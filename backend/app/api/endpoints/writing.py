import json
from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.db.models import Essay
from backend.app.agents.writing_agent import writing_agent

router = APIRouter()

class GenerateEssayRequest(BaseModel):
    topic: str
    format: Optional[str] = "ship30"
    length: Optional[str] = "~1,250 words"
    tone: Optional[str] = "practical"
    focus: Optional[str] = "Growth and PMF"

@router.post("/generate")
async def generate_essay(req: GenerateEssayRequest, db: Session = Depends(get_db)):
    result = await writing_agent.generate_essay(
        topic=req.topic,
        format_type=req.format or "ship30",
        length=req.length or "~1,250 words",
        tone=req.tone or "practical",
        focus=req.focus or "Growth and PMF",
    )

    # Persist in DB
    essay_db = Essay(
        id=result["id"],
        title=result["title"],
        subtitle=result.get("subtitle"),
        topic=result["topic"],
        format=result["format"],
        length=result["length"],
        word_count=result["wordCount"],
        reading_time_minutes=result["readingTimeMinutes"],
        tone=result["tone"],
        hero_image_url=result.get("heroImageUrl"),
        hero_quote=result.get("heroQuote"),
        table_of_contents_json=json.dumps(result.get("tableOfContents", [])),
        quote_callout_json=json.dumps(result.get("quoteCallout", {})),
        citations_json=json.dumps(result.get("citations", [])),
        content=result["content"],
        is_demo=False,
    )
    db.add(essay_db)
    db.commit()

    return result

@router.get("/")
def list_essays(db: Session = Depends(get_db)):
    essays = db.query(Essay).order_by(Essay.created_at.desc()).all()
    out = []
    for e in essays:
        out.append({
            "id": e.id,
            "title": e.title,
            "subtitle": e.subtitle,
            "topic": e.topic,
            "format": e.format,
            "length": e.length,
            "wordCount": e.word_count,
            "readingTimeMinutes": e.reading_time_minutes,
            "tone": e.tone,
            "heroImageUrl": e.hero_image_url,
            "heroQuote": e.hero_quote,
            "tableOfContents": json.loads(e.table_of_contents_json) if e.table_of_contents_json else [],
            "quoteCallout": json.loads(e.quote_callout_json) if e.quote_callout_json else None,
            "citations": json.loads(e.citations_json) if e.citations_json else [],
            "content": e.content,
            "isDemo": e.is_demo,
            "createdAt": e.created_at.strftime("%b %d, %Y") if e.created_at else "",
            "updatedAt": e.updated_at.strftime("%b %d, %Y") if e.updated_at else "",
        })
    return out
