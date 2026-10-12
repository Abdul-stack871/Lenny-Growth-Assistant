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
   ├── CORS Middleware (all origins allowed; no authentication)
   ├── Core Routers: /chat, /writing, /artifacts, /insights, /transcripts (+ /health)
   │
   ├── [ Grounded Retrieval ]  (backend/app/rag/retrieval.py)
   │      ├── transcripts.json loaded into memory (also seeded into transcript_chunks)
   │      ├── Keyword-overlap scorer with guest / tag / episode boosts (no embeddings)
   │      └── Insufficient-Evidence Gatekeeper
   │
   ├── [ Agent Layer ]  (template-based, no LLM calls)
   │      ├── Ship30WritingAgent (fixed 6-section essay, hook score, citations)
   │      └── PiCodingAgent (fixed HTML templates, regex-sanitized)
   │
   ├── [ Persistence Layer (SQLAlchemy 2.0) ]
   │      ├── Primary: PostgreSQL (localhost:5432)
   │      └── Auto-Fallback: SQLite (lenny_growth.db)
   │
   └── [ LLM Execution ]
          ├── Local: Ollama (http://localhost:11434 / llama3.2:latest), used by /chat/messages only
          └── Cloud: Anthropic / OpenAI keys are read and reported by /health;
                     no code path sends requests to either provider
```

Diagrams for the same architecture are in [README.md](README.md) and [docs/images/system-architecture.svg](docs/images/system-architecture.svg).

---

## 2. Detailed Data Flow

### 2.1 Grounded Chat Query Flow
1. **User Query Input:** User sends query (e.g., *"What did Peter Reinhardt say about product-market fit?"*).
2. **FastAPI Ingestion:** `POST /api/v1/chat/messages` receives the payload. The conversation is created if it does not exist, and the user message is saved.
3. **Retrieval Matcher:**
   - Checks out-of-domain regex patterns, then tokenizes the query.
   - Scores token overlap against the in-memory excerpts from `backend/data/transcripts.json`, with boosts for matching guest, topic tag, episode number or verbatim phrase.
4. **Insufficient-Evidence Evaluation:**
   - If out-of-domain, or the top score is `< 0.15`: returns an explicit disclaimer and zero citations (no LLM call).
   - If `>= 0.15`: takes the top 3 excerpts and builds citations (episode, guest, timestamps, quote) plus an evidence block.
5. **Inference Execution:**
   - Sends the evidence and question to Ollama (`POST {OLLAMA_BASE_URL}/api/generate`, model `OLLAMA_MODEL`, 20 s timeout). This happens regardless of the model selected in the UI.
   - If Ollama is unreachable, times out or returns an empty answer, the endpoint builds a deterministic reply from the quoted citations.
6. **Persistence & Return:**
   - The assistant message and its citations are stored in the SQLAlchemy database.
   - The client receives the message with citations and suggested follow-up actions. If the backend cannot be reached, `apiClient.ts` shows a demo response marked `isDemo`.

### 2.2 Ship 30 for 30 Essay Generation Flow
1. **Writing Request:** `POST /api/v1/writing/generate` with topic, tone, format.
2. **Retrieval:** The writing agent runs the same retriever (top 4, threshold `0.10`) and attaches the resulting citations.
3. **Template Synthesis (no LLM call):**
   - Fills a fixed 6-section Markdown essay with the requested topic. The body text is static and does not use the retrieved excerpts.
   - Computes a heuristic hook score (base 80, capped at 98) from title features.
   - Includes fixed quote callouts. The `ANTHROPIC_API_KEY` client in this module is created but never used.
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
3. Tables are created with `Base.metadata.create_all` on server startup and `transcript_chunks` is seeded from `transcripts.json` when empty. There are no migrations.
4. Persistence covers conversations, messages, essays and artifacts. The frontend currently keeps its conversation list and Library in local React state, so saved history is not reloaded into the UI.

---

## 5. Security & Isolation Architecture
1. **API Keys Isolated:** Cloud credentials (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) are read only by the backend from `.env` and are never sent to the frontend (`/health` returns only whether they are set).
2. **Iframe Sandboxing:** Artifacts render in an iframe with `sandbox="allow-scripts"`. The backend also regex-replaces `window.top`, `window.parent`, `document.cookie` and `localStorage` in generated code. This filtering is a basic safeguard for the current fixed templates, not a security boundary for untrusted code.
3. **CORS:** The backend allows all origins (`allow_origins=["*"]`), which suits local development only.
