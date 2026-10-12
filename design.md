# Design System Documentation
## Midnight Editorial Intelligence
**Project:** The Lenny Growth Assistant • Oogway Labs  
**Theme:** Editorial Precision, Deep Midnight Hues, Amber-Orange Energy  

---

## 1. Design Philosophy
*Midnight Editorial Intelligence* combines the focus and authority of a world-class literary publication with the interactive density of modern software engineering workspaces. The interface eliminates visual clutter, prioritizing long-form typography, tactile controls, and high-contrast typographic hierarchy.

---

## 2. Color Palette & Tokens

### 2.1 Surfaces & Backgrounds
```css
--bg-workspace: #06080e;   /* Deepest midnight base */
--bg-surface-1: #0c0e17;   /* Primary sidebar & topbar surface */
--bg-surface-2: #131724;   /* Card, container & hover background */
--bg-surface-hover: #1b2032; /* Interactive element hover */
```

### 2.2 Editorial Accent Colors
```css
--accent-primary: #ff7336;   /* Lenny Editorial Orange */
--accent-secondary: #ff9e43; /* Warm Amber Highlight */
--accent-glow: rgba(255, 115, 54, 0.25);
```

### 2.3 Semantic Status Colors
```css
--status-connected: #34d399;   /* Emerald green (Local Ollama / DB Active) */
--status-warning: #fbbf24;     /* Amber */
--status-disconnected: #f87171;/* Coral Red */
--status-cloud: #818cf8;       /* Indigo (Anthropic / Claude Cloud) */
```

### 2.4 Typography & Text Colors
```css
--text-primary: #f5f6fa;   /* 95% opacity white */
--text-secondary: #c9cddb; /* 80% opacity muted gray */
--text-muted: #7e859b;     /* 50% opacity subtle metadata */
--border-subtle: rgba(255, 255, 255, 0.08);
--border-accent: rgba(255, 115, 54, 0.4);
```

---

## 3. Typography Architecture

| Typeface | Class / Variable | Usage | Weights |
| :--- | :--- | :--- | :--- |
| **Newsreader** | `.font-serif` | Editorial headlines, article titles, quotes | 400, 500, 600, 700 |
| **Plus Jakarta Sans** | Default sans | UI controls, labels, navigation, body copy | 400, 500, 600, 700 |
| **Fira Code** | `.font-mono` | Timestamps, word counts, model IDs, code blocks | 400, 500, 600 |

### Typographic Scale
- **Display 1 (Serif):** `28px` / `1.3` line-height — Essay titles & Hero banners
- **Section Heading (Serif):** `20px` / `1.4` line-height — Section headings (`##`)
- **Body Editorial:** `15.5px` / `1.65` line-height — Essay body copy with calibrated letter spacing
- **UI Label:** `13px` / `1.4` line-height — Navigation items, buttons, badge pills
- **Meta Caption (Mono):** `11.5px` / `1.2` line-height — Timestamps, tokens, audio scrub bars

---

## 4. Layout & Responsive Architecture

### 4.1 Shell Layout
The application features a 3-column responsive layout:
1. **Collapsible Sidebar (256px wide):** Navigation tabs, live model indicator, pinned and recent conversations, library quick-access.
2. **Dynamic Central Workspace (Flex 1):** Swappable primary views (Chat Workspace, Writing Studio, Artifact Builder, Insights, Library, Settings).
3. **Collapsible Contextual Panel (360px - 60% expandable):** Real-time transcript viewer with audio scrub bars, notes editor, and Ship 30 for 30 preview.

### 4.2 Responsive Breakpoints
- **Desktop (1024px+):** Full 3-column view with simultaneous chat and contextual inspection.
- **Tablet (768px - 1023px):** Contextual panel becomes an overlay drawer; sidebar collapsible into icon mode.
- **Mobile (< 768px):** Single column workspace with bottom navigation bar, floating action controls, and full-screen modals.

---

## 5. Security & Sandbox Isolation

### 5.1 Artifact Sandbox Security
All interactive HTML artifacts are isolated via an `iframe` sandbox:
```html
<iframe
  sandbox="allow-scripts"
  srcdoc="{sanitizedHtml}"
  class="sandbox-frame"
/>
```
- **Disallowed:** `allow-same-origin`, `allow-top-navigation`, `allow-modals`, `allow-popups`.
- **Sanitization:** Server-side `PiCodingAgent` strips any references to `window.top`, `window.parent`, and `document.cookie`.

---

## 6. Accessibility & Micro-Interactions
- High-contrast ratio (> 7:1) for all body text against dark backgrounds.
- Explicit `focus-visible` outlines on interactive controls with orange glow.
- Spring-physics transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) on drawers, cards, and modal dialogs.
