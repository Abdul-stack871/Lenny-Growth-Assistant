# The Lenny Growth Assistant

> **Organization:** Oogway Labs  
> **Release:** Production Version 1.0.0 (Full-Stack Engineering & Autonomous Agent Architecture)  
> **Design Philosophy:** Midnight Editorial Intelligence  
> **Target Audience:** Product Managers, Startup Founders, Growth Operators, and Product Engineers  

---

## 1. Product Overview

**The Lenny Growth Assistant** is an AI-powered conversational workspace, grounded retrieval engine, and editorial intelligence studio built on the podcast and newsletter archives of *Lenny Rachitsky*. The platform empowers operators to transition directly from interview knowledge into structured product decisions, Ship 30 for 30 atomic essays, and sandboxed interactive artifacts.

---

## 2. Key Capabilities & Technical Highlights

1. **Grounded Transcript RAG Engine:**
   - Real, authentic transcript archive covering landmark interviews: Peter Reinhardt (Segment), Rahul Vohra (Superhuman), Elena Verna & Brian Balfour (Growth Loops), Shreyas Doshi (LNO Framework), and Patrick Campbell (ProfitWell).
   - Weighted hybrid keyword, phrase, and speaker matching with strict confidence scoring (`threshold >= 0.15`).
   - Insufficient-evidence safeguards: queries lacking evidence in the Lenny corpus explicitly state lack of data to prevent hallucination.

2. **Ship 30 for 30 Essay Studio:**
   - Autonomous writing agent generating ~1,250-word structured essays across 6 canonical sections.
   - Built-in hook evaluation scoring headlines on curiosity, specificity, and length.
   - Dynamic markdown parser (`renderMarkdownBlocks`) formatting headings, bold text, lists, and quotes without raw markdown artifacts.

3. **Pi Coding Agent & Sandboxed Artifact Builder:**
   - Generates interactive, self-contained HTML/CSS/JS artifacts (growth loops, pricing calculators, product roadmaps).
   - Strict sandbox isolation (`sandbox="allow-scripts"`) and sanitization stripping access to `window.top` and `document.cookie`.

4. **Multi-Model Local & Cloud Inference:**
   - Zero-latency, private local execution via **Ollama** (`http://localhost:11434`) using `llama3.2:latest`.
   - Cloud provider execution using **Anthropic Claude 3.5 Sonnet** and **OpenAI GPT-4o** configured exclusively via server environment variables.

5. **Resilient Persistence Layer:**
   - SQLAlchemy 2.0 ORM with PostgreSQL primary support (`postgresql://...`) and automatic fallback to SQLite (`sqlite:///./lenny_growth.db`).
   - Multi-session conversation management (rename, pin, delete) and library persistence.

---

## 3. Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Build System:** Vite 8 (production bundle builds in under 800ms)
- **Styling:** Vanilla CSS design tokens (`src/styles/tokens.css` & `src/styles/globals.css`)
- **Typography:** *Newsreader* (Serif), *Plus Jakarta Sans* (Interface Sans), *Fira Code* (Monospace)
- **Icons:** `lucide-react`

### Backend
- **Framework:** FastAPI (Python 3.12)
- **ORM & Database:** SQLAlchemy 2.0 (PostgreSQL + SQLite auto-fallback)
- **Local AI:** Ollama API (`llama3.2:latest`)
- **Cloud AI:** Anthropic Claude Agent SDK (1.13.0)
- **Testing:** `pytest` + `pytest-asyncio` + FastAPI `TestClient`

---

## 4. The Eight Core Workspace Sections

| Section | Route | Capabilities |
| :--- | :--- | :--- |
| **1. Home** | `'home'` | Editorial dashboard with sunset visual backdrop, quote callouts, knowledge base status widget, and quick-start workflow cards. |
| **2. Chat Workspace** | `'chat'` | Central grounded conversation workspace with prompt suggestions, timestamped citation cards, collapsible right contextual panel (Transcript, Notes, Artifact Preview), and retry logic. |
| **3. Writing Studio** | `'writing'` | Dedicated Ship 30 for 30 essay generation studio with format, length, and tone pickers, live hook scoring, and dual Editorial Preview / Markdown Editor views. |
| **4. Artifact Workspace** | `'artifacts'` | Sandboxed artifact canvas supporting Template, Custom prompt, and From-Chat modes with live iframe execution. |
| **5. Library** | `'library'` | Central repository of saved essays, interactive artifacts, and conversation sessions with category filtering and search. |
| **6. Insights** | `'insights'` | Categorized growth takeaways from verified guest interviews (PMF, Growth Loops, Pricing, Leadership) with direct transcript citations. |
| **7. Playground** | `'playground'` | Model parameter testbench with temperature sliders, token limits, system prompt configuration, and token telemetry badges. |
| **8. Settings** | `'settings'` | Live diagnostics testing connectivity to Ollama and FastAPI backend, and documentation for server `.env` configuration. |

---

## 5. Quickstart & Installation

### 5.1 Prerequisites
- **Node.js:** v18.0.0 or higher
- **Python:** 3.11 or 3.12
- **Ollama:** Installed and serving on `http://localhost:11434` with `llama3.2:latest`

### 5.2 Frontend Setup
```bash
# 1. Install dependencies
npm install

# 2. Run development server (port 5173)
npm run dev

# 3. Compile production bundle
npm run build
```

### 5.3 Backend Setup
```bash
# 1. Install Python dependencies
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings httpx pytest pytest-asyncio psycopg2-binary anthropic

# 2. Launch FastAPI server (port 8000)
uvicorn backend.app.main:app --port 8000 --host 127.0.0.1 --reload
```

---

## 6. Automated Testing

Run the automated backend test suite:
```bash
python -m pytest backend/tests/test_api.py -v
```
**Test Coverage:**
- `test_health_endpoint`: Verifies backend health and Ollama detection.
- `test_conversation_lifecycle`: Verifies session creation, listing, patching, and deletion.
- `test_grounded_message_retrieval`: Verifies grounded retrieval from authentic Lenny transcripts.
- `test_insufficient_evidence_handling`: Verifies out-of-domain query interception without hallucination.
- `test_ship30_essay_generation`: Verifies ~1,250-word essay generation with hook evaluation.
- `test_artifact_generation_and_sanitization`: Verifies iframe sandbox code sanitization.
- `test_insights_list`: Verifies categorized insight themes and evidence citations.

---

## 7. Documentation Suite
- [PRD.md](file:///d:/Oogway-Project/PRD.md): Complete Product Requirements Document
- [design.md](file:///d:/Oogway-Project/design.md): Midnight Editorial Intelligence Design System
- [architecture.md](file:///d:/Oogway-Project/architecture.md): System Architecture & Data Flow
- [agent_logs.md](file:///d:/Oogway-Project/agent_logs.md): Autonomous Agent Decision Traces & Logs
- [test_instructions.md](file:///d:/Oogway-Project/test_instructions.md): Step-by-Step Verification Guide
- [manual_ui_test_plan.md](file:///d:/Oogway-Project/manual_ui_test_plan.md): Comprehensive Manual Test Plan
- [.env.example](file:///d:/Oogway-Project/.env.example): Environment Variable Configuration
