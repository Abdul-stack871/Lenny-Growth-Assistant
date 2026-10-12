# Manual UI & End-to-End Test Plan
## The Lenny Growth Assistant
**Quality Bar:** Production-Grade Product Engineering  
**Application URL:** `http://localhost:5173`  
**Backend API URL:** `http://localhost:8000/api/v1`  

---

## Test Suite Overview

| Suite ID | Feature Area | Focus |
| :--- | :--- | :--- |
| **TS-01** | Navigation & Shell Architecture | Sidebar, TopBar, Mobile Drawer, View Transitions |
| **TS-02** | Grounded Chat & Session Management | Prompt Suggestions, Citations, Multi-Session CRUD, Retry |
| **TS-03** | Ship 30 for 30 Writing Studio | Formats, Dynamic Markdown Parsing, Tone Selectors, Export |
| **TS-04** | Artifact Builder & Sandbox Isolation | Template Selection, Custom Code, Sandboxed Iframe, Copy |
| **TS-05** | Contextual Right Panel | Transcripts, Audio Scrubbing, Notes Editor, Studio Bridge |
| **TS-06** | Insights & Growth Themes | Categorized Theme Cards, Direct Quote Previews, Filters |
| **TS-07** | Model Selector & Settings | Local Ollama Diagnostic, Server Env Documentation, Reset |
| **TS-08** | Error Handling & Offline Fallback | Network Disconnection, Toast Alerts, Insufficient Evidence |

---

## Detailed Test Cases

### TS-01: Navigation & Shell Architecture
- **TC-1.1: Sidebar Section Navigation**
  - *Steps:* Click each sidebar item: Home, Chat, Writing Studio, Artifacts, Library, Insights, Playground, Settings.
  - *Expected:* Central workspace swaps instantaneously with zero layout shift; active tab pill highlights in orange.
- **TC-1.2: Sidebar Collapse / Expand**
  - *Steps:* Click the collapse toggle button at the bottom of the sidebar.
  - *Expected:* Sidebar transitions smoothly to 72px icon-only rail; tooltip previews render on hover; workspace expands to fill viewport.
- **TC-1.3: User Profile Menu**
  - *Steps:* Click the user avatar in the top-right corner.
  - *Expected:* Opens dropdown menu with user profile details, active session model, and navigation link to Settings.

---

### TS-02: Grounded Chat & Session Management
- **TC-2.1: Empty State & Prompt Suggestions**
  - *Steps:* Click `+ New Chat` button.
  - *Expected:* Displays clean empty state with 3 clickable prompt pills ("How did Segment find PMF?", "What is the 40% PMF benchmark?", "Explain compounding growth loops").
  - *Action:* Click any prompt suggestion; it immediately sends the prompt and starts generation.
- **TC-2.2: Grounded Citation Card Rendering**
  - *Steps:* Send query: *"What did Peter Reinhardt say about product market fit?"*
  - *Expected:* Response renders with verified citation badge (Episode 12, Peter Reinhardt, timestamp 14:05).
  - *Action:* Click citation badge; right contextual panel opens directly to the transcript tab at the exact timestamp.
- **TC-2.3: Insufficient Evidence Disclaimer**
  - *Steps:* Send out-of-domain query: *"How do black holes collide in quantum physics?"*
  - *Expected:* Response displays explicit "Insufficient Evidence in Archive" banner; citations drawer is clean and empty.
- **TC-2.4: Session Management (Rename, Pin, Delete)**
  - *Steps:* Hover over a conversation in the sidebar. Click the `...` menu.
  - *Expected:* Can pin the chat (moves to top with pin icon), rename the title, or delete the session with confirmation.

---

### TS-03: Ship 30 for 30 Writing Studio
- **TC-3.1: Essay Generation Workflow**
  - *Steps:* Navigate to Writing Studio. Enter topic: *"Retention Loops for B2B SaaS"*. Select *Ship 30 for 30* format and *Authoritative* tone. Click *Generate Atomic Essay*.
  - *Expected:* Generates structured ~1,250-word essay with numbered headings (`## 1...`), hero image banner, quote callout, and hook evaluation badge.
- **TC-3.2: Editorial Preview vs. Markdown Editor**
  - *Steps:* Toggle between *Editorial Preview* and *Markdown Editor*.
  - *Expected:* Preview displays fully styled headings, bold text, italics, and blockquotes without raw markdown characters. Editor displays editable raw markdown with live word count.
- **TC-3.3: Export and Clipboard Actions**
  - *Steps:* Click *Copy* button and *Export .md* button.
  - *Expected:* *Copy* button toggles to green checkmark with "Copied" toast; *Export .md* initiates a browser file download of the `.md` document.

---

### TS-04: Artifact Builder & Sandbox Isolation
- **TC-4.1: Template Exploration**
  - *Steps:* Navigate to Artifacts. Select *Growth Dashboard* template.
  - *Expected:* Interactive simulation renders inside iframe.
- **TC-4.2: Sandbox Security Verification**
  - *Steps:* Inspect the DOM elements of the rendered artifact.
  - *Expected:* The `iframe` has attribute `sandbox="allow-scripts"` and does not possess `allow-same-origin` or top navigation permissions.
- **TC-4.3: Custom Generation & Chat Remix**
  - *Steps:* Select *Custom* tab. Input a prompt for a pricing calculator. Click *Generate Artifact*.
  - *Expected:* Pi Coding Agent produces a working interactive calculator with interactive sliders and real-time computation.

---

### TS-05: Contextual Right Panel & Transcripts
- **TC-5.1: Right Panel Collapse & Maximize**
  - *Steps:* Click the maximize button (`[ ]`) on the top-right panel header; click collapse button (`X`).
  - *Expected:* Panel expands smoothly to 60% width when maximized; collapses to floating trigger pill when closed.
- **TC-5.2: Simulated Audio Excerpt Player**
  - *Steps:* Switch to *Transcript* tab. Click the play button on the audio player card.
  - *Expected:* Scrub progress bar activates; informative toast notifies user of playback status.

---

### TS-06: Insights & Knowledge Themes
- **TC-6.1: Theme Filtering**
  - *Steps:* Navigate to Insights. Filter by category pills (All, Product-Market Fit, Growth Loops, Leadership).
  - *Expected:* Cards filter instantly to display relevant verified operator evidence.
- **TC-6.2: Open in Studio Action**
  - *Steps:* Click *Draft Essay from Theme* on any insight card.
  - *Expected:* Directs user to Writing Studio with topic pre-populated and essay draft initiated.

---

### TS-07: Model Selector & Settings
- **TC-7.1: Real Connection Diagnostics**
  - *Steps:* Navigate to Settings. Click *Test Ollama Connection* and *Test Backend Health*.
  - *Expected:* Pings live endpoints; displays exact latency in milliseconds and model list (`llama3.2:latest`).
- **TC-7.2: Server-Side Environment Variable Architecture**
  - *Steps:* Review API Keys section in Settings.
  - *Expected:* Displays architectural note that keys are safely stored in backend `.env` rather than insecure browser storage.
