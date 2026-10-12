# Verification & Testing Instructions
## The Lenny Growth Assistant
**Author:** Oogway Labs Forward Deployed Engineering  
**Version:** 1.0.0  

---

## 1. Prerequisites
Ensure you have the following installed in your environment:
- **Node.js:** v18.0.0 or higher
- **Python:** 3.11 or 3.12 with `pip`
- **Ollama:** Installed and serving on `http://localhost:11434` with model `llama3.2:latest`
- **PostgreSQL:** Optional local service on port 5432 (auto-falls back to SQLite if credentials are unconfigured)

---

## 2. Frontend Verification & Production Build

### 2.1 Verify TypeScript & Production Bundle Build
Run the following in the repository root (`D:\Oogway-Project`):
```bash
npm run build
```
**Expected Output:**
```
vite v8.3.4 building client environment for production...
transforming...
✓ 1931 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.65 kB │ gzip:   0.83 kB
dist/assets/index-ByD_JRLn.css    4.70 kB │ gzip:   1.82 kB
dist/assets/index-BamWVPmg.js   483.94 kB │ gzip: 121.41 kB
✓ built in ~800ms
```

### 2.2 Run Frontend Development Server
```bash
npm run dev -- --port 5173 --host
```
Navigate to `http://localhost:5173` in any modern browser.

---

## 3. Backend Verification & Automated Testing

### 3.1 Install Python Dependencies (If not already installed)
```bash
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings httpx pytest pytest-asyncio psycopg2-binary anthropic
```

### 3.2 Run Complete Automated Pytest Suite
Execute the automated test suite covering health checks, conversation CRUD, grounded RAG retrieval, insufficient evidence handling, Ship 30 for 30 essay generation, and artifact sanitization:
```bash
python -m pytest backend/tests/test_api.py -v
```
**Expected Output:**
```
backend/tests/test_api.py::test_health_endpoint PASSED                   [ 14%]
backend/tests/test_api.py::test_conversation_lifecycle PASSED            [ 28%]
backend/tests/test_api.py::test_grounded_message_retrieval PASSED        [ 42%]
backend/tests/test_api.py::test_insufficient_evidence_handling PASSED    [ 57%]
backend/tests/test_api.py::test_ship30_essay_generation PASSED           [ 71%]
backend/tests/test_api.py::test_artifact_generation_and_sanitization PASSED [ 85%]
backend/tests/test_api.py::test_insights_list PASSED                     [100%]
======================= 7 passed in ~15s =======================
```

---

## 4. Starting the FastAPI Server
To launch the backend server on `http://127.0.0.1:8000`:
```bash
uvicorn backend.app.main:app --port 8000 --host 127.0.0.1 --reload
```

### 4.1 Health Check Verification
```bash
curl http://localhost:8000/api/v1/health
```
**Expected Response:**
```json
{
  "status": "connected",
  "app": "The Lenny Growth Assistant",
  "version": "1.0.0",
  "environment": "development",
  "database": "connected",
  "ollama": {
    "status": "connected",
    "endpoint": "http://localhost:11434",
    "model": "llama3.2:latest"
  },
  "cloud": {
    "anthropic": false,
    "openai": false
  }
}
```

---

## 5. Testing Grounded Retrieval & Essay Generation via Curl

### 5.1 Send Grounded Chat Query
```bash
curl -X POST http://localhost:8000/api/v1/chat/messages \
  -H "Content-Type: application/json" \
  -d '{"conversationId": "test-session", "content": "What did Peter Reinhardt say about product-market fit at Segment?"}'
```
**Expected:** Returns assistant message quoting Episode 12 with Peter Reinhardt at timestamp 14:05.

### 5.2 Test Insufficient Evidence Safeguard
```bash
curl -X POST http://localhost:8000/api/v1/chat/messages \
  -H "Content-Type: application/json" \
  -d '{"conversationId": "test-session", "content": "How do black holes collide according to astrophysics?"}'
```
**Expected:** Returns explicit `Insufficient Evidence in Archive` response with empty citations list.

### 5.3 Generate ~1,250-Word Ship 30 for 30 Essay
```bash
curl -X POST http://localhost:8000/api/v1/writing/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "Product-Market Fit for Early-Stage Startups", "format": "ship30", "length": "~1,250 words"}'
```
**Expected:** Returns structured essay with hook score, 6 numbered headings, quote callouts, and word count ~1,000-1,250 words.
