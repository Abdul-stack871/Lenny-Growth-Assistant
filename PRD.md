# Product Requirements Document (PRD)
## The Lenny Growth Assistant
**Author:** Oogway Labs Forward Deployed Engineering  
**Version:** 1.0.0 • Production Release  
**Status:** Approved & Implemented  

---

## 1. Executive Summary
The Lenny Growth Assistant is an AI-powered conversational workspace, grounded retrieval engine, and editorial intelligence studio designed for product managers, founders, and growth operators. The system synthesizes insights from hundreds of hours of *Lenny's Podcast* and newsletter archives, providing source-verified answers with exact episode numbers, speaker attributions, and audio timestamps.

The product combines:
1. **Grounded Transcript RAG:** Strict citation linking and insufficient-evidence safeguards to prevent hallucinations.
2. **Ship 30 for 30 Writing Studio:** An autonomous agent that transforms conversational queries into approximately 1,250-word atomic essays with editorial hook scoring.
3. **Pi Coding Agent & Artifact Builder:** Dynamic generation of interactive, sandboxed prototypes (growth loops, pricing calculators, roadmaps).
4. **Local & Cloud Model Hybrid Execution:** Seamless local privacy via Ollama (`llama3.2:latest`) with optional cloud scaling via Anthropic Claude 3.5 Sonnet.

---

## 2. Target Users & Problem Statement

### 2.1 Target Personas
- **Early-Stage Founders:** Seeking empirical heuristics for product-market fit (PMF), customer discovery interviews, and 0-to-1 launch velocity.
- **Growth Leads & Product Managers:** Designing sustainable compounding growth loops, pricing models, and retention engines.
- **Content & Thought Leadership Operators:** Drafting tactical playbooks using structured frameworks like Ship 30 for 30.

### 2.2 Core Problems Solved
- **Generic AI Hallucinations:** Standard commercial LLMs generate generic advice devoid of real-world operator context.
- **Unsearchable Audio Archives:** Hundreds of hours of dense interview audio remain trapped without direct timestamped deep-linking.
- **Friction in Knowledge Execution:** The gap between listening to an interview and creating an actionable deliverable (memo, essay, interactive calculator) is traditionally hours of manual labor.

---

## 3. Product Principles
1. **Strict Citation Grounding:** Every factual assertion must link back to an authentic guest statement, timestamp span, and audio offset.
2. **Honesty Over Hallucination:** When an archive query lacks sufficient evidence or falls out-of-domain, the system must clearly decline to answer rather than fabricate evidence.
3. **Midnight Editorial Intelligence:** A premium, low-fatigue visual aesthetic tailored for high-focus strategy and long-form writing.
4. **Zero-Trust Client Security:** Sensitive API keys (Anthropic, OpenAI) are strictly managed via server environment variables, never stored in client `localStorage`.
5. **Turnkey Resilience:** Dual-mode persistence automatically attempts PostgreSQL and smoothly falls back to SQLite if PostgreSQL credentials require local configuration.

---

## 4. Key Functional Requirements

### 4.1 Grounded Transcript Retrieval & Chat
- **FR-1.1:** Tokenized hybrid search matching keywords, guest names, episode numbers, and topic tags.
- **FR-1.2:** Verification threshold (`score >= 0.15`). Queries scoring below threshold trigger an explicit "Insufficient Evidence" response.
- **FR-1.3:** Citations must render with episode badge, guest name, timestamp start/end, and quote excerpt.
- **FR-1.4:** Session persistence supporting multiple independent chat conversations with rename, pin, and delete actions.

### 4.2 Ship 30 for 30 Writing Studio
- **FR-2.1:** Autonomous agent generating structured ~1,250-word essays with 6 core sections:
  1. The Hard Truth
  2. Customer Discovery & Hair-on-Fire Problems
  3. Compounding Growth Loops
  4. Quantitative Benchmarks (Sean Ellis 40% rule)
  5. Anti-Patterns & Traps
  6. Actionable Operator Checklist
- **FR-2.2:** Real-time hook evaluation scoring headlines on curiosity, specificity, and length.
- **FR-2.3:** Markdown Editor and Editorial Preview tabs with custom markdown parsing (bold, italics, code, bullet lists, blockquotes, horizontal rules).
- **FR-2.4:** Export to Markdown (`.md`), Copy to Clipboard, and Save to Library actions.

### 4.3 Interactive Artifact Builder & Sandboxing
- **FR-3.1:** Pre-built templates: Growth Dashboard, Pricing Strategy Calculator, Phase-Driven Roadmap, Executive One-Pager Memo.
- **FR-3.2:** Custom prompt generation and chat-to-artifact remixed views.
- **FR-3.3:** Sandboxed iframe execution (`sandbox="allow-scripts"`) preventing top-window navigation, cookie exfiltration, or script breakouts.

### 4.4 Models & Connectivity
- **FR-4.1:** Local inference via Ollama (`http://localhost:11434`) using `llama3.2:latest`.
- **FR-4.2:** Server-side cloud inference via Anthropic Claude 3.5 Sonnet / OpenAI GPT-4o.
- **FR-4.3:** Live diagnostic health monitoring verifying FastAPI backend and Ollama connectivity.

---

## 5. Non-Functional Requirements
- **Performance:** Frontend production bundle builds in under 1 second; initial page load renders in under 50ms.
- **Security:** HTML artifacts execute inside isolated sandboxes; client-side storage of third-party API keys is prohibited.
- **Reliability:** Backend includes automated test suite with 100% pass rate across health, session CRUD, grounding, and essay generation.
