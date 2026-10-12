from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.db.models import Artifact
from backend.app.agents.coding_agent import coding_agent

router = APIRouter()

class GenerateArtifactRequest(BaseModel):
    template: str
    title: Optional[str] = ""
    description: Optional[str] = ""
    contextPrompt: Optional[str] = ""

@router.post("/generate")
def generate_artifact(req: GenerateArtifactRequest, db: Session = Depends(get_db)):
    result = coding_agent.generate_artifact(
        template=req.template,
        title=req.title or "",
        description=req.description or "",
        context_prompt=req.contextPrompt or "",
    )

    # Persist in DB
    artifact_db = Artifact(
        id=result["id"],
        title=result["title"],
        description=result.get("description"),
        template=result["template"],
        type=result["type"],
        code=result["code"],
        is_demo=False,
    )
    db.add(artifact_db)
    db.commit()

    return {
        "id": result["id"],
        "title": result["title"],
        "description": result.get("description"),
        "template": result["template"],
        "type": result["type"],
        "code": result["code"],
        "createdAt": "Just now",
        "updatedAt": "Just now",
        "isDemo": False,
    }

@router.get("/")
def list_artifacts(db: Session = Depends(get_db)):
    arts = db.query(Artifact).order_by(Artifact.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "template": a.template,
            "type": a.type,
            "code": a.code,
            "isDemo": a.is_demo,
            "createdAt": a.created_at.strftime("%b %d, %Y") if a.created_at else "",
            "updatedAt": a.updated_at.strftime("%b %d, %Y") if a.updated_at else "",
        }
        for a in arts
    ]
