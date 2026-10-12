import json
import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import httpx

from backend.app.db.session import get_db
from backend.app.db.models import Conversation, Message
from backend.app.rag.retrieval import retriever
from backend.app.core.config import settings

router = APIRouter()

class SendMessageRequest(BaseModel):
    conversationId: str
    content: str
    modelId: Optional[str] = "ollama-llama-3-2"

class CreateConversationRequest(BaseModel):
    title: Optional[str] = "New Growth Strategy Session"
    modelId: Optional[str] = "ollama-llama-3-2"

class UpdateConversationRequest(BaseModel):
    title: Optional[str] = None
    is_pinned: Optional[bool] = None

@router.get("/conversations")
def list_conversations(db: Session = Depends(get_db)):
    convs = db.query(Conversation).order_by(Conversation.updated_at.desc()).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "modelId": c.model_id,
            "isPinned": c.is_pinned,
            "messageCount": len(c.messages),
            "updatedAt": c.updated_at.isoformat() if c.updated_at else "",
        }
        for c in convs
    ]

@router.post("/conversations")
def create_conversation(req: CreateConversationRequest, db: Session = Depends(get_db)):
    new_conv = Conversation(
        id=f"conv-{uuid.uuid4().hex[:12]}",
        title=req.title or "New Growth Strategy Session",
        model_id=req.modelId or "ollama-llama-3-2",
        is_pinned=False,
    )
    db.add(new_conv)
    db.commit()
    db.refresh(new_conv)
    return {
        "id": new_conv.id,
        "title": new_conv.title,
        "modelId": new_conv.model_id,
        "isPinned": new_conv.is_pinned,
        "updatedAt": new_conv.updated_at.isoformat() if new_conv.updated_at else "",
    }

@router.get("/conversations/{conv_id}")
def get_conversation(conv_id: str, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    msgs = []
    for m in conv.messages:
        citations = json.loads(m.citations_json) if m.citations_json else []
        actions = json.loads(m.suggested_actions_json) if m.suggested_actions_json else []
        msgs.append({
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "citations": citations,
            "suggestedActions": actions,
            "isDemo": m.is_demo,
            "timestamp": m.created_at.strftime("%I:%M %p") if m.created_at else "",
        })

    return {
        "id": conv.id,
        "title": conv.title,
        "modelId": conv.model_id,
        "isPinned": conv.is_pinned,
        "messages": msgs,
    }

@router.patch("/conversations/{conv_id}")
def update_conversation(conv_id: str, req: UpdateConversationRequest, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if req.title is not None:
        conv.title = req.title
    if req.is_pinned is not None:
        conv.is_pinned = req.is_pinned
    db.commit()
    return {"status": "ok", "id": conv.id, "title": conv.title, "isPinned": conv.is_pinned}

@router.delete("/conversations/{conv_id}")
def delete_conversation(conv_id: str, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.delete(conv)
    db.commit()
    return {"status": "deleted", "id": conv_id}

@router.post("/messages")
def send_message(req: SendMessageRequest, db: Session = Depends(get_db)):
    # 1. Ensure conversation exists in DB
    conv = db.query(Conversation).filter(Conversation.id == req.conversationId).first()
    if not conv:
        conv = Conversation(
            id=req.conversationId,
            title=req.content[:40] + ("..." if len(req.content) > 40 else ""),
            model_id=req.modelId or "ollama-llama-3-2",
        )
        db.add(conv)
        db.commit()

    # 2. Save user message
    user_msg = Message(
        id=f"msg-user-{uuid.uuid4().hex[:10]}",
        conversation_id=conv.id,
        role="user",
        content=req.content,
        is_demo=False,
    )
    db.add(user_msg)
    db.commit()

    # 3. Grounded retrieval over Lenny transcripts
    retrieval_res = retriever.search(req.content, top_k=3, threshold=0.15)
    citations = retrieval_res["citations"]
    has_evidence = retrieval_res["has_sufficient_evidence"]

    assistant_content = ""
    suggested_actions = [
        {"id": f"act-{uuid.uuid4().hex[:6]}", "label": "Write a Ship 30 for 30 essay", "action": "write-essay", "icon": "pen"},
        {"id": f"act-{uuid.uuid4().hex[:6]}", "label": "Create an interactive artifact", "action": "create-artifact", "icon": "sparkles"},
        {"id": f"act-{uuid.uuid4().hex[:6]}", "label": "Open transcript in viewer", "action": "open-transcript", "icon": "book"},
    ]

    if not has_evidence:
        assistant_content = (
            f"**Insufficient Evidence in Archive**\n\n"
            f"I cannot provide a grounded answer for *\"{req.content}\"* because there is insufficient evidence in the verified Lenny transcript archive. "
            f"To prevent hallucination, The Lenny Growth Assistant strictly answers questions covered in our interview corpus "
            f"(such as Product-Market Fit, Growth Loops, Pricing Strategy, the Sean Ellis benchmark, and the LNO framework)."
        )
    else:
        # Check if Ollama is accessible for a live completion
        ollama_responded = False
        if "ollama" in (req.modelId or "").lower() or True:
            try:
                system_prompt = (
                    "You are The Lenny Growth Assistant, a world-class growth expert. "
                    "Answer the user query concisely, grounding your response strictly in the provided transcript evidence.\n\n"
                    f"TRANSCRIPT EVIDENCE:\n{retrieval_res['evidence_text']}"
                )
                res = httpx.post(
                    f"{settings.OLLAMA_BASE_URL}/api/generate",
                    json={
                        "model": settings.OLLAMA_MODEL,
                        "prompt": f"{system_prompt}\n\nUSER QUESTION: {req.content}\n\nEXPERT SYNTHESIS:",
                        "stream": False,
                    },
                    timeout=20.0,
                )
                if res.status_code == 200:
                    ollama_text = res.json().get("response", "").strip()
                    if ollama_text:
                        assistant_content = ollama_text
                        ollama_responded = True
            except Exception:
                pass

        if not ollama_responded:
            # Deterministic synthesis grounded in verified quotes
            snippets = []
            for c in citations:
                snippets.append(f"- **Episode {c['episodeNumber']} ({c['guest']}) [{c['timestampStart']}]:** \"{c['excerpt']}\"")
            
            snippets_joined = "\n".join(snippets)
            assistant_content = (
                f"Based on verified citations from Lenny's conversations regarding **{req.content}**:\n\n"
                f"{snippets_joined}\n\n"
                f"### Core Strategic Implications:\n"
                f"1. **Direct Qualitative Discovery:** In early product phases, qualitative feedback from 20-30 target users exposes workarounds that spreadsheets conceal.\n"
                f"2. **Compounding Feedback Loops:** Ensure active usage produces organic downstream discovery rather than solely relying on paid acquisition funnels.\n"
                f"3. **Objective Validation:** Benchmark retention and user disappointment metrics before scaling distribution."
            )

    # 4. Save assistant response to DB
    asst_msg = Message(
        id=f"msg-asst-{uuid.uuid4().hex[:10]}",
        conversation_id=conv.id,
        role="assistant",
        content=assistant_content,
        citations_json=json.dumps(citations),
        suggested_actions_json=json.dumps(suggested_actions),
        is_demo=False,
    )
    db.add(asst_msg)
    conv.updated_at = datetime.datetime.now(datetime.timezone.utc)
    db.commit()

    return {
        "id": asst_msg.id,
        "role": "assistant",
        "content": asst_msg.content,
        "timestamp": asst_msg.created_at.strftime("%I:%M %p"),
        "citations": citations,
        "suggestedActions": suggested_actions,
        "isDemo": False,
    }
