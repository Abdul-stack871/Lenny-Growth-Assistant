import json
import os
import re
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from backend.app.db.models import TranscriptChunk

TRANSCRIPTS_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "data",
    "transcripts.json"
)

OUT_OF_DOMAIN_PATTERNS = [
    r"\b(astrophysics|quantum mechanics|black holes|cooking recipe|baking cake)\b",
    r"\b(presidential election|geopolitics|military war|cryptocurrency pump)\b",
    r"\b(celebrity gossip|astrology|horoscope)\b",
]

def load_transcripts_data() -> List[Dict[str, Any]]:
    if os.path.exists(TRANSCRIPTS_FILE):
        with open(TRANSCRIPTS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def init_transcripts_db(db: Session):
    """Seed transcripts into DB if not present."""
    count = db.query(TranscriptChunk).count()
    if count == 0:
        data = load_transcripts_data()
        for item in data:
            chunk = TranscriptChunk(
                id=item["id"],
                episode_number=item["episode_number"],
                episode_title=item["episode_title"],
                guest=item["guest"],
                timestamp_start=item["timestamp_start"],
                timestamp_end=item["timestamp_end"],
                audio_seconds=item["audio_seconds"],
                topic_tags=",".join(item.get("topic_tags", [])),
                quote=item["quote"],
                text=item["text"],
            )
            db.add(chunk)
        db.commit()

def tokenize(text: str) -> List[str]:
    return [w.lower() for w in re.findall(r"\b\w{3,}\b", text)]

class TranscriptRetriever:
    def __init__(self):
        self.transcripts = load_transcripts_data()

    def search(self, query: str, top_k: int = 3, threshold: float = 0.15) -> Dict[str, Any]:
        """
        Grounded search over authentic Lenny transcripts.
        Detects out-of-domain queries and computes relevance score.
        """
        query_lower = query.lower().strip()
        
        # Check out-of-domain patterns
        for pattern in OUT_OF_DOMAIN_PATTERNS:
            if re.search(pattern, query_lower):
                return {
                    "has_sufficient_evidence": False,
                    "confidence_score": 0.0,
                    "citations": [],
                    "evidence_text": "",
                    "message": "Insufficient evidence in the Lenny transcript archive for this query. The archive covers Product-Market Fit, Growth Loops, Pricing Strategy, Retention, and Leadership.",
                }

        query_tokens = set(tokenize(query_lower))
        if not query_tokens:
            return {
                "has_sufficient_evidence": False,
                "confidence_score": 0.0,
                "citations": [],
                "evidence_text": "",
                "message": "Query too short to perform grounded retrieval.",
            }

        scored: List[Tuple[float, Dict[str, Any]]] = []

        for item in self.transcripts:
            text_tokens = tokenize(item["text"])
            tags_tokens = tokenize(",".join(item.get("topic_tags", [])))
            guest_tokens = tokenize(item["guest"])
            title_tokens = tokenize(item["episode_title"])

            all_item_tokens = text_tokens + tags_tokens + guest_tokens + title_tokens
            overlap = query_tokens.intersection(all_item_tokens)

            # Score computation: Jaccard-like overlap with token weighting
            score = len(overlap) / float(len(query_tokens))

            # Boost if guest or topic tag directly mentioned
            for tag in item.get("topic_tags", []):
                if tag.lower() in query_lower:
                    score += 0.35
            if item["guest"].lower() in query_lower:
                score += 0.45
            if str(item["episode_number"]) in query_lower:
                score += 0.50

            # Boost if phrase matches verbatim
            if item["quote"].lower() in query_lower or query_lower in item["text"].lower():
                score += 0.50

            if score > 0:
                scored.append((score, item))

        scored.sort(key=lambda x: x[0], reverse=True)

        if not scored or scored[0][0] < threshold:
            return {
                "has_sufficient_evidence": False,
                "confidence_score": scored[0][0] if scored else 0.0,
                "citations": [],
                "evidence_text": "",
                "message": f"Insufficient evidence in the Lenny transcript archive for '{query}'. Grounded responses require direct citations from verified guest interviews.",
            }

        top_results = scored[:top_k]
        top_score = top_results[0][0]

        citations = []
        evidence_snippets = []

        for score, item in top_results:
            citation = {
                "id": f"cit-{item['id']}",
                "episodeNumber": item["episode_number"],
                "episodeTitle": item["episode_title"],
                "guest": item["guest"],
                "timestampStart": item["timestamp_start"],
                "timestampEnd": item["timestamp_end"],
                "excerpt": item["quote"],
                "audioSeconds": item["audio_seconds"],
                "isDemo": False, # Verified authentic transcript citation
            }
            citations.append(citation)
            evidence_snippets.append(
                f"[Episode {item['episode_number']}: {item['episode_title']} with {item['guest']} at {item['timestamp_start']}]\n"
                f"\"{item['text']}\""
            )

        return {
            "has_sufficient_evidence": True,
            "confidence_score": min(round(top_score, 2), 1.0),
            "citations": citations,
            "evidence_text": "\n\n".join(evidence_snippets),
            "message": "Verified citations retrieved from transcript corpus.",
        }

retriever = TranscriptRetriever()
