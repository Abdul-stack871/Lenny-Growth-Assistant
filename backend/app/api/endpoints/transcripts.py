from typing import Optional
from fastapi import APIRouter, Query
from backend.app.rag.retrieval import retriever, load_transcripts_data

router = APIRouter()

@router.get("/search")
def search_transcripts(q: str = Query(..., min_length=1), top_k: int = 5):
    return retriever.search(q, top_k=top_k)

@router.get("/episodes")
def list_episodes():
    data = load_transcripts_data()
    episodes = {}
    for item in data:
        num = item["episode_number"]
        if num not in episodes:
            episodes[num] = {
                "episodeNumber": num,
                "episodeTitle": item["episode_title"],
                "guest": item["guest"],
                "chunkCount": 0,
                "topicTags": item.get("topic_tags", []),
            }
        episodes[num]["chunkCount"] += 1
    return list(episodes.values())
