import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "connected"
    assert "The Lenny Growth Assistant" in data["app"]
    assert "ollama" in data

def test_conversation_lifecycle():
    # 1. Create Conversation
    create_res = client.post(
        "/api/v1/chat/conversations",
        json={"title": "Pytest PMF Session", "modelId": "ollama-llama-3-2"}
    )
    assert create_res.status_code == 200
    conv_data = create_res.json()
    conv_id = conv_data["id"]
    assert conv_data["title"] == "Pytest PMF Session"

    # 2. List Conversations
    list_res = client.get("/api/v1/chat/conversations")
    assert list_res.status_code == 200
    assert any(c["id"] == conv_id for c in list_res.json())

    # 3. Patch Conversation
    patch_res = client.patch(
        f"/api/v1/chat/conversations/{conv_id}",
        json={"title": "Updated PMF Session", "is_pinned": True}
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["isPinned"] is True

    # 4. Get Conversation
    get_res = client.get(f"/api/v1/chat/conversations/{conv_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Updated PMF Session"

    # 5. Delete Conversation
    del_res = client.delete(f"/api/v1/chat/conversations/{conv_id}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "deleted"

def test_grounded_message_retrieval():
    conv_res = client.post("/api/v1/chat/conversations", json={"title": "Grounding Test"})
    conv_id = conv_res.json()["id"]

    msg_res = client.post(
        "/api/v1/chat/messages",
        json={
            "conversationId": conv_id,
            "content": "What did Peter Reinhardt say about product market fit at Segment?",
            "modelId": "ollama-llama-3-2",
        }
    )
    assert msg_res.status_code == 200
    data = msg_res.json()
    assert data["role"] == "assistant"
    assert len(data["citations"]) > 0
    # Verify episode 12 Peter Reinhardt citation is present
    top_cit = data["citations"][0]
    assert top_cit["episodeNumber"] == 12
    assert "Peter Reinhardt" in top_cit["guest"]
    assert top_cit["timestampStart"] == "14:05"

def test_insufficient_evidence_handling():
    conv_res = client.post("/api/v1/chat/conversations", json={"title": "Out of domain test"})
    conv_id = conv_res.json()["id"]

    msg_res = client.post(
        "/api/v1/chat/messages",
        json={
            "conversationId": conv_id,
            "content": "How do black holes collide according to quantum mechanics and astrophysics?",
            "modelId": "ollama-llama-3-2",
        }
    )
    assert msg_res.status_code == 200
    data = msg_res.json()
    assert data["role"] == "assistant"
    assert len(data["citations"]) == 0
    assert "Insufficient Evidence" in data["content"]

def test_ship30_essay_generation():
    essay_res = client.post(
        "/api/v1/writing/generate",
        json={
            "topic": "Finding Product-Market Fit",
            "format": "ship30",
            "length": "~1,250 words",
            "tone": "practical",
        }
    )
    assert essay_res.status_code == 200
    data = essay_res.json()
    assert data["format"] == "ship30"
    assert data["wordCount"] >= 800 # Deep ~1,250 word essay
    assert len(data["tableOfContents"]) >= 4
    assert "content" in data
    assert "hookEvaluation" in data
    assert data["hookEvaluation"]["score"] >= 80

def test_artifact_generation_and_sanitization():
    art_res = client.post(
        "/api/v1/artifacts/generate",
        json={
            "template": "growth-dashboard",
            "title": "Compounding Viral Loop",
            "description": "Elena Verna Growth Simulation",
        }
    )
    assert art_res.status_code == 200
    data = art_res.json()
    assert data["type"] == "html"
    assert "window.top" not in data["code"] # Verified sanitization
    assert "window.parent" not in data["code"]
    assert "document.cookie" not in data["code"]

def test_insights_list():
    res = client.get("/api/v1/insights/")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 4
    assert any(i["category"] == "Product-Market Fit" for i in data)
