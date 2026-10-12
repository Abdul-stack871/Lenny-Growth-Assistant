# Lenny Growth Assistant

**Ask growth and product-market-fit questions and get answers backed by cited podcast excerpts, then turn them into essays and interactive artifacts.**

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-backend-009688?logo=fastapi&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-local%20LLM-000000)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL%20%2F%20SQLite-persistence-336791?logo=postgresql&logoColor=white)

<p align="center">
  <img src="docs/images/system-architecture.svg" alt="System overview: React frontend calls a FastAPI backend, which uses a transcript retriever, Ollama, and PostgreSQL with a SQLite fallback" width="100%">
</p>

---

## Project overview

Generic chatbots give generic growth advice. This project grounds answers in a small, curated set of *Lenny's Podcast* excerpts and shows exactly where each answer came from: episode, guest and timestamp. If the archive has nothing relevant, the assistant says so instead of guessing.

| | |
| :--- | :--- |
| **Problem** | Growth advice is generic, and long interviews are hard to search or cite. |
| **Approach** | Keyword-based retrieval over bundled transcript excerpts, then a local LLM (Ollama) that answers from the matched excerpts. |
| **Output** | A cited chat answer, a Ship 30 for 30 style essay, or a sandboxed HTML artifact. |
| **Status** | Working prototype. See [Current limitations](#current-limitations-and-future-improvements) for what is and isn't implemented. |

## Key features

| Feature | What it does | Implementation status |
| :--- | :--- | :--- |
| **Grounded chat** | Retrieves up to 3 matching excerpts, attaches citations, and asks Ollama to answer from them. | Implemented. Falls back to a quote-based answer if Ollama is unreachable. |
| **Insufficient-evidence guard** | Replies "Insufficient Evidence" with zero citations for out-of-domain or low-scoring queries (score below `0.15`). | Implemented. Out-of-domain detection is a short regex list. |
| **Writing Studio** | Generates a 6-section essay with a hook score and citations, saved to the database. | Implemented as a **fixed template** filled with the topic. It does not call an LLM. |
| **Artifact Builder** | Produces self-contained HTML artifacts (growth loop, pricing calculator, generic card) shown in a sandboxed iframe. | Implemented as **fixed templates** with regex sanitization. It does not call an LLM. |
| **Conversation storage** | Saves conversations, messages, essays and artifacts via SQLAlchemy to PostgreSQL, or SQLite if PostgreSQL is unreachable. | Backend implemented. The UI does not yet reload saved history (see limitations). |
| **Insights, Library, Playground, Settings** | Insights shows 4 hard-coded themes from the API. Settings runs live Ollama and backend health checks. | Library and Playground are UI-only and do not call the backend. |

## How the application works

1. You ask a question in the **Chat** view. The React app sends it to `POST /api/v1/chat/messages`.
2. The backend stores your message, then searches the transcript excerpts for matches.
3. If nothing scores high enough, it returns an explicit "insufficient evidence" reply.
4. Otherwise it sends the matched excerpts and your question to Ollama. If Ollama doesn't answer, it builds a reply directly from the quoted excerpts.
5. The reply, its citations and suggested follow-up actions are stored and returned to the UI.
6. From there you can open the **Writing Studio** or **Artifact Builder**, which call their own endpoints.

If the backend is unreachable, the frontend shows a clearly labelled demo response (`isDemo: true`) rather than failing silently.

## End-to-end request workflow

### Diagram A: chat request

```mermaid
flowchart TD
    U([User]) --> UI["React + TypeScript UI<br/>ChatComposer and AppContext"]
    UI -->|"POST /api/v1/chat/messages"| API["FastAPI chat endpoint"]
    API --> SAVE1[("Save user message<br/>PostgreSQL or SQLite")]
    SAVE1 --> RET["TranscriptRetriever.search<br/>keyword overlap, top 3, threshold 0.15"]
    RET --> OOD{"Out of domain or<br/>score below 0.15?"}
    OOD -- Yes --> INS["Insufficient-evidence reply<br/>no citations"]
    OOD -- No --> PROMPT["Build prompt from<br/>matched transcript excerpts"]
    PROMPT --> OLL{"Ollama /api/generate<br/>answers within 20 s?"}
    OLL -- Yes --> LLM["Ollama answer"]
    OLL -- "No or error" --> DET["Deterministic answer built<br/>from quoted citations"]
    INS --> SAVE2
    LLM --> SAVE2
    DET --> SAVE2
    SAVE2[("Save assistant message<br/>and citations JSON")] --> RESP["JSON response:<br/>content, citations, suggestedActions"]
    RESP --> UI
    API -. "backend unreachable" .-> DEMO["Frontend demo fallback<br/>message marked isDemo"]
    DEMO -.-> UI
```

### Diagram A2: writing and artifact requests

```mermaid
flowchart LR
    W["Writing Studio"] -->|"POST /writing/generate"| WA["Ship30WritingAgent<br/>retrieves top 4 citations,<br/>fills a fixed essay template"]
    WA --> ES[("essays table")]
    WA --> WR["Essay, hook score,<br/>citations"]
    A["Artifact Builder"] -->|"POST /artifacts/generate"| CA["PiCodingAgent<br/>picks an HTML template,<br/>regex-sanitizes code"]
    CA --> AS[("artifacts table")]
    CA --> AO["HTML code"] --> SB["Sandboxed iframe<br/>sandbox allow-scripts"]
```

## System architecture

### Diagram B: components and responsibilities

```mermaid
flowchart LR
    subgraph FE["Frontend: React 19, TypeScript, Vite"]
        VIEWS["Views: Chat, Writing, Artifacts,<br/>Library, Insights, Playground, Settings"]
        STATE["AppContext<br/>React state"]
        CLIENT["apiClient.ts<br/>fetch with demo fallback"]
        VIEWS --> STATE --> CLIENT
    end
    subgraph BE["Backend: FastAPI"]
        EP["Endpoints under /api/v1<br/>chat, writing, artifacts,<br/>insights, transcripts, health"]
        AG["Agent layer<br/>Ship30WritingAgent, PiCodingAgent"]
        RAG["rag/retrieval.py<br/>TranscriptRetriever and citations"]
        ORM["SQLAlchemy models and session"]
        EP --> AG
        EP --> RAG
        AG --> RAG
        EP --> ORM
    end
    subgraph DATA["Data"]
        JSON[("transcripts.json<br/>10 excerpts, 7 episodes")]
        PG[("PostgreSQL<br/>primary")]
        SQ[("SQLite lenny_growth.db<br/>automatic fallback")]
    end
    OLL["Ollama<br/>llama3.2:latest on localhost:11434"]
    CLOUD["Anthropic and OpenAI<br/>keys detected only, never called"]
    CLIENT -->|"REST JSON"| EP
    CLIENT -. "health check, direct" .-> OLL
    RAG -->|"loaded at startup"| JSON
    ORM --> PG
    ORM -.->|"if PostgreSQL unreachable"| SQ
    EP -->|"chat only: /api/generate"| OLL
    EP -.->|"/health reports key presence"| CLOUD
```

| Component | Responsibility | Code |
| :--- | :--- | :--- |
| UI and state | Views, selected model, conversations, library (local React state) | `src/components/`, `src/context/AppContext.tsx` |
| API client | Calls the backend, falls back to labelled demo data when it fails | `src/services/apiClient.ts` |
| Endpoints | HTTP routes and persistence calls | `backend/app/api/endpoints/` |
| Agent layer | Essay and artifact generation (template-based) | `backend/app/agents/` |
| Retrieval | Tokenizes the query, scores excerpts, builds citations, rejects weak queries | `backend/app/rag/retrieval.py` |
| Persistence | PostgreSQL-first engine with SQLite fallback; creates tables and seeds `transcript_chunks` on startup | `backend/app/db/` |

## Technology stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 19, TypeScript 6, Vite 8, `lucide-react`, plain CSS design tokens |
| Backend | Python, FastAPI, Uvicorn, Pydantic Settings, httpx |
| Database | SQLAlchemy 2 with PostgreSQL (via `psycopg2`) or SQLite fallback |
| LLM | Ollama (`llama3.2:latest` by default) |
| Tooling | `pytest` and FastAPI `TestClient`, `oxlint`, `tsc` |

## Project folder structure

```text
.
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app, CORS, /health, router registration
│   │   ├── core/config.py          # Settings loaded from environment / .env
│   │   ├── db/                     # session.py (PostgreSQL → SQLite), models.py
│   │   ├── rag/retrieval.py        # Transcript search, scoring, citations
│   │   ├── agents/                 # writing_agent.py, coding_agent.py
│   │   └── api/endpoints/          # chat, writing, artifacts, insights, transcripts
│   ├── data/transcripts.json       # Bundled transcript excerpts
│   └── tests/test_api.py           # 7 API tests
├── src/                            # React + TypeScript frontend
│   ├── components/                 # chat, writing, artifacts, library, insights, ...
│   ├── context/AppContext.tsx      # Global app state
│   ├── services/                   # apiClient.ts, mockDataAdapter.ts (demo fallback data)
│   └── styles/                     # Design tokens and global CSS
├── docs/images/system-architecture.svg
├── PRD.md  architecture.md  design.md  test_instructions.md  manual_ui_test_plan.md  agent_logs.md
├── .env.example
└── package.json
```

## Installation and local setup

All commands are for **Windows PowerShell**, run from the repository root.

**Prerequisites**

- Node.js `20.19+` or `22.12+` (required by Vite 8)
- Python `3.11+` (backend tests were verified on Python 3.13)
- [Ollama](https://ollama.com/) for live LLM answers (optional, see [Running](#running-the-frontend-backend-postgresql-and-ollama))
- PostgreSQL (optional, SQLite is used automatically if it is unavailable)

```powershell
git clone https://github.com/Abdul-stack871/Lenny-Growth-Assistant.git
cd Lenny-Growth-Assistant

# Frontend dependencies
npm install

# Backend virtual environment and dependencies
python -m venv .venv
# If activation is blocked: Set-ExecutionPolicy -Scope Process RemoteSigned
.\.venv\Scripts\Activate.ps1
python -m pip install fastapi uvicorn sqlalchemy pydantic-settings httpx pytest

# Optional extras
python -m pip install psycopg2-binary   # needed only to use PostgreSQL
python -m pip install anthropic         # optional; the writing agent only creates a client, it makes no calls

# Local configuration (never commit .env)
Copy-Item .env.example .env
```

The repository has no `requirements.txt`, so the backend packages above are listed explicitly.

## Environment variables and configuration

Copy `.env.example` to `.env` and edit as needed. The backend reads `.env` from the **current directory**, so start it from the repository root.

| Variable | Used by | Purpose | Default |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Backend | PostgreSQL URL. If the connection fails, SQLite (`sqlite:///./lenny_growth.db`) is used. | `postgresql://postgres:postgres@localhost:5432/lenny_growth` |
| `OLLAMA_BASE_URL` | Backend | Ollama server address | `http://localhost:11434` |
| `OLLAMA_MODEL` | Backend | Model used for chat answers | `llama3.2:latest` |
| `ANTHROPIC_API_KEY` | Backend | Only reported by `/health` and used to create an unused client | empty |
| `OPENAI_API_KEY` | Backend | Only reported by `/health`; no code calls OpenAI | empty |
| `VITE_API_BASE_URL` | Frontend | Backend base URL | `http://localhost:8000/api/v1` |

`ENVIRONMENT`, `PORT`, `HOST`, `VITE_OLLAMA_ENDPOINT` and `VITE_APP_ENV` appear in `.env.example` but are **not read by the code**. Server host and port come from the `uvicorn` command, and the frontend's Ollama endpoint is set in the Settings page (default `http://localhost:11434`).

Keep API keys in the server-side `.env` only. `.env`, `*.db` and `*.sqlite` files are already in `.gitignore`.

## API endpoints

Base URL `http://127.0.0.1:8000`, interactive docs at `/docs`.

| Method | Path | Description |
| :--- | :--- | :--- |
| GET | `/api/v1/health` | Backend status, Ollama reachability, and whether cloud keys are set |
| GET | `/api/v1/chat/conversations` | List conversations |
| POST | `/api/v1/chat/conversations` | Create a conversation |
| GET | `/api/v1/chat/conversations/{id}` | Get a conversation with its messages |
| PATCH | `/api/v1/chat/conversations/{id}` | Rename or pin (`title`, `is_pinned`) |
| DELETE | `/api/v1/chat/conversations/{id}` | Delete a conversation |
| POST | `/api/v1/chat/messages` | Send a message: retrieve, answer, cite, save |
| POST | `/api/v1/writing/generate` | Generate and save an essay |
| GET | `/api/v1/writing/` | List saved essays |
| POST | `/api/v1/artifacts/generate` | Generate and save an artifact |
| GET | `/api/v1/artifacts/` | List saved artifacts |
| GET | `/api/v1/insights/` | Static insight themes |
| GET | `/api/v1/transcripts/search?q=...&top_k=5` | Run retrieval directly |
| GET | `/api/v1/transcripts/episodes` | List episodes in the bundled data |

Note: `/health` returns `"database": "connected"` as a fixed value. It does not report which database is active.

## Running the frontend, backend, PostgreSQL, and Ollama

Use separate PowerShell windows.

**1. Ollama (optional, enables live LLM answers)**

```powershell
ollama pull llama3.2
ollama serve        # skip if the Ollama app is already running
```

Without Ollama, chat still works and returns an answer assembled from the quoted excerpts.

**2. PostgreSQL (optional)**

Start a local PostgreSQL service and create a database matching `DATABASE_URL`:

```powershell
psql -U postgres -c "CREATE DATABASE lenny_growth;"
```

Tables are created automatically on backend startup. If the connection fails, the backend logs a warning and creates `lenny_growth.db` (SQLite) in the working directory.

**3. Backend**

```powershell
.\.venv\Scripts\Activate.ps1
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

**4. Frontend**

```powershell
npm run dev          # http://localhost:5173
```

**5. Quick check**

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/health

$body = '{"conversationId":"demo-1","content":"What did Peter Reinhardt say about product-market fit?"}'
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/v1/chat/messages -ContentType "application/json" -Body $body
```

## Testing instructions

```powershell
# Backend: 7 API tests (health, conversation CRUD, grounded retrieval,
# insufficient evidence, essay generation, artifact sanitization, insights)
python -m pytest backend/tests/test_api.py -v

# Frontend: type-check and production build
npm run build

# Frontend lint (currently reports unused-import warnings only)
npm run lint
```

- The tests use whichever database is available and write test data to it. They also call Ollama if it is running, and pass without it.
- There are no automated frontend tests. Use [manual_ui_test_plan.md](manual_ui_test_plan.md) for UI checks.
- [test_instructions.md](test_instructions.md) has longer curl-based walkthroughs (its paths and commands are written for a different machine layout, so prefer the commands in this README).

## Screenshots and diagrams

- Diagrams: the two Mermaid diagrams above, plus [`docs/images/system-architecture.svg`](docs/images/system-architecture.svg).
- Component and schema details: [architecture.md](architecture.md).
- UI screenshots are not committed yet. Adding them under `docs/images/` and linking them here would be a useful next step.

## Current limitations and future improvements

| Area | Current state | Possible improvement |
| :--- | :--- | :--- |
| Retrieval | Token-overlap scoring over 10 excerpts from 7 episodes, loaded from JSON. The `transcript_chunks` table is seeded but not queried. No embeddings or vector search. | Embeddings plus a vector index, and a larger ingested corpus. |
| Transcript data | Short curated excerpts. They have not been verified against the original episodes in this repository. | Ingest and verify full transcripts with source links. |
| Cloud LLMs | Claude and OpenAI appear in the model picker, but the backend never calls either. Chat always uses Ollama whichever model is selected. | Add real provider clients and route by `modelId`. |
| Writing and artifact agents | Template-based. The essay body is fixed text with the topic substituted. Artifacts come from three fixed templates. | Drive generation with an LLM using retrieved excerpts. |
| Conversation history | Saved by the backend, but the UI keeps conversations and the Library in local state seeded with demo data and does not reload history. | Wire the existing conversation endpoints into `AppContext`. |
| Insights | Hard-coded in `insights.py`. | Derive from the transcript data. |
| Artifact sandboxing | Iframe `sandbox="allow-scripts"` plus regex replacement of `window.top`, `window.parent`, `document.cookie` and `localStorage`. Templates are static, so risk is low today, but regex filtering is not a security boundary for untrusted code. | Rely on the iframe sandbox and add a content security policy before accepting generated or user code. |
| Configuration | CORS allows all origins (`CORS_ORIGINS` in settings is unused). `/health` hard-codes `database` and `environment`. No `requirements.txt`. | Restrict CORS, report the real database, add a requirements file. |
| Quality | No frontend tests, no migrations (tables via `create_all`), lint warnings. | Add tests and Alembic migrations. |

## Credits and repository links

- Repository: <https://github.com/Abdul-stack871/Lenny-Growth-Assistant>
- Built by Oogway Labs. Content themes are drawn from *Lenny's Podcast* by Lenny Rachitsky. This is an independent project, not affiliated with or endorsed by the podcast.
- Project documents: [PRD.md](PRD.md) · [architecture.md](architecture.md) · [design.md](design.md) · [test_instructions.md](test_instructions.md) · [manual_ui_test_plan.md](manual_ui_test_plan.md) · [agent_logs.md](agent_logs.md) · [.env.example](.env.example)
- No license file is present in the repository.
