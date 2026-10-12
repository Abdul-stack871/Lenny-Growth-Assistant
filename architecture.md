# System Architecture Document
## The Lenny Growth Assistant
**Oogway Labs Forward Deployed Engineering**  
**Version:** 1.0.0 • Production Release  

---

## 1. High-Level System Architecture

```
[ Browser / Client ] (React 19 + TypeScript + Vite)
         |
         | HTTP / REST (JSON)
         v
[ FastAPI Backend (Port 8000) ]
   ├── Authentication & CORS Middleware
   ├── Core Routers: /chat, /writing, /artifacts, /insights, /transcripts
   │
   ├── [ Grounded RAG Engine ]
   │      ├── Ingestion Pipeline (transcripts.json)
   │      ├── Hybrid Keyword & Semantic Matcher
   │      └── Insufficient-Evidence Gatekeeper
   │
   ├── [ Autonomous Agent Layer ]
   │      ├── Ship 30 for 30 Writing Agent (~1,250 words)
   │      └── Pi Coding Agent (Sanitized Interactive Artifacts)
   │
   ├── [ Persistence Layer (SQLAlchemy 2.0) ]
   │      ├── Primary: PostgreSQL (localhost:5432)
   │      └── Auto-Fallback: SQLite (lenny_growth.db)
   │
   └── [ Multi-Model LLM Execution ]
          ├── Local: Ollama (http://localhost:11434 / llama3.2:latest)
          └── Cloud: Anthropic Claude 3.5 Sonnet / OpenAI GPT-4o
```

---

## 2. Detailed Data Flow

### 2.1 Grounded Chat Query Flow
1. **User Query Input:** User sends query (e.g., *"What did Peter Reinhardt say about product-market fit?"*).
2. **FastAPI Ingestion:** `POST /api/v1/chat/messages` receives payload with session ID.
3. **Retrieval Matcher:**
   - Normalizes and tokenizes query.
   - Computes weighted overlap against authentic episode transcripts (`backend/data/transcripts.json`).
   - Checks out-of-domain patterns.
4. **Insufficient-Evidence Evaluation:**
   - If confidence `< 0.15` or out-of-domain: Returns explicit disclaimer and zero citations.
   - If confidence `>= 0.15`: Extracts timestamp spans, quotes, speaker metadata, and compiles grounding context.
5. **Inference Execution:**
   - Calls local Ollama `llama3.2:latest` or Claude API with structured grounding prompt.
   - Generates response strictly adhering to retrieved evidence.
6. **Persistence & Return:**
   - Conversation and messages stored in SQLAlchemy database.
   - Client receives message with timestamped citation badges and suggested follow-up actions.

### 2.2 Ship 30 for 30 Essay Generation Flow
1. **Writing Request:** `POST /api/v1/writing/generate` with topic, tone, format.
2. **Autonomous Retrieval:** Writing agent queries transcript database for top 4 relevant operator perspectives.
3. **Structured Synthesis:**
   - Generates ~1,250 words across 6 foundational sections.
   - Evaluates hook score out of 100 based on curiosity and conciseness.
   - Formats clean Markdown with headers (`##`), bullet points, and exact quote callouts.
4. **Database Storage & UI Display:**
   - Persists to `essays` table.
   - Client receives JSON essay; `renderMarkdownBlocks` displays rich typographical layout in Editorial Preview.

---

## 3. Database Schema Design

### 3.1 ER Diagram
```
[ Conversation ] 1 ─── N [ Message ]
       id                        id
       title                     conversation_id (FK)
       model_id                  role
       is_pinned                 content
       created_at                citations_json
       updated_at                suggested_actions_json

[ Essay ]                     [ Artifact ]
       id                            id
       title                         title
       topic                         template
       format                        type
       word_count                    code (sanitized)
       content                       created_at
       citations_json

[ TranscriptChunk ]
       id (e.g., ep12-chunk1)
       episode_number
       episode_title
       guest
       timestamp_start / end
       quote / text
```

---

## 4. Multi-Tier Persistence Strategy
To guarantee seamless setup without local database friction:
1. `backend/app/db/session.py` attempts a pre-ping connection to PostgreSQL using `settings.DATABASE_URL`.
2. If the connection fails (e.g., password mismatch or service unconfigured), it logs an informative notice and immediately activates `sqlite:///./lenny_growth.db`.
3. Database migrations and tables (`Base.metadata.create_all`) execute automatically on server startup.

---

## 5. Security & Isolation Architecture
1. **API Keys Isolated:** Cloud credentials (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) are kept exclusively on the server in `.env`.
2. **Iframe Sandboxing:** All artifacts execute within an iframe with `sandbox="allow-scripts"` and sanitization stripping access to `window.top` and `document.cookie`.
