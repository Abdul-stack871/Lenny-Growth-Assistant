import {
  AIModel,
  ChatConversation,
  Essay,
  Artifact,
  LibraryItem,
  InsightTheme,
  Citation,
} from '../types';

export const MOCK_MODELS: AIModel[] = [
  {
    id: 'ollama-llama-3-2',
    name: 'Ollama (Llama 3.2)',
    provider: 'ollama',
    isLocal: true,
    description: 'Meta Llama 3.2 3B Instruct optimized for fast local inference via Ollama.',
    contextWindow: '128K',
    status: 'active',
    badge: 'Running locally',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    isLocal: false,
    description: 'State of the art intelligence for long-form reasoning, writing, and code artifacts.',
    contextWindow: '200K',
    status: 'ready',
    badge: 'Cloud',
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    provider: 'openai',
    isLocal: false,
    description: 'High-speed multimodal flagship model for synthesis and strategy.',
    contextWindow: '128K',
    status: 'ready',
    badge: 'Cloud',
  },
];

export const MOCK_CITATIONS: Citation[] = [
  {
    id: 'cit-1',
    episodeNumber: 1,
    episodeTitle: 'Early-Stage Strategy',
    guest: 'Lenny Rachitsky',
    timestampStart: '22:14',
    timestampEnd: '26:35',
    excerpt: 'Talking directly to 20-30 actual users will uncover painful workarounds that spreadsheets and analytics will never tell you.',
    audioSeconds: 1334,
  },
  {
    id: 'cit-2',
    episodeNumber: 12,
    episodeTitle: 'Product-Market Fit & Traction',
    guest: 'Peter Reinhardt',
    timestampStart: '14:05',
    timestampEnd: '18:40',
    excerpt: 'When you finally have PMF, the feeling changes from pushing a giant boulder uphill to desperately trying to keep up with incoming user demand.',
    audioSeconds: 845,
  },
  {
    id: 'cit-3',
    episodeNumber: 84,
    episodeTitle: 'Growth Loops & Retention Mechanics',
    guest: 'Elena Verna & Brian Balfour',
    timestampStart: '08:30',
    timestampEnd: '12:15',
    excerpt: 'Linear funnels are dead. Sustainable products win when one cohort of users directly produces the inputs for the next cohort.',
    audioSeconds: 510,
  },
  {
    id: 'cit-4',
    episodeNumber: 103,
    episodeTitle: 'Finding Your Core User',
    guest: 'Rahul Vohra',
    timestampStart: '19:40',
    timestampEnd: '24:10',
    excerpt: 'The Sean Ellis 40% rule: ask how disappointed users would be if your product disappeared tomorrow. If over 40% say very disappointed, you have product-market fit.',
    audioSeconds: 1180,
  },
];

export const MOCK_DEFAULT_ESSAY: Essay = {
  id: 'essay-pmf-1',
  title: 'How Early-Stage Startups Can Find Product-Market Fit',
  subtitle: "A practical guide based on Lenny's insights",
  topic: 'Product-market fit for early-stage startups',
  format: 'ship30',
  length: '~1,250 words',
  wordCount: 1248,
  readingTimeMinutes: 5,
  tone: 'practical',
  heroImageUrl: '/assets/mountain_cliff_editorial.jpg',
  heroQuote: '"Talk to users. Ship small. Learn fast."',
  tableOfContents: [
    '1. The Hard Truth About Product-Market Fit',
    '2. Understand Customers Deeply',
    '3. Ship and Iterate in Days, Not Months',
    '4. Look for Strong Emotional Signals',
    '5. Common Traps That Deceive Founders',
    '6. Key Actionable Takeaways',
  ],
  quoteCallout: {
    quote: 'The best founders I know are obsessed with talking to customers, not building features.',
    author: 'Lenny Rachitsky',
    source: 'Episode: Early-Stage Strategy',
  },
  citations: MOCK_CITATIONS,
  createdAt: 'Oct 8, 2026',
  updatedAt: 'Oct 8, 2026',
  isDemo: true,
  content: `## 1. The Hard Truth About Product-Market Fit

Product-market fit isn't a single celebratory moment. It's an ongoing, rigorous process of deeply understanding your customers, solving a hair-on-fire problem, and creating a repeatable distribution loop.

Across hundreds of interviews with world-class founders and growth leaders on Lenny's Podcast, one unifying truth emerges: **most startups fail not because they couldn't build the product, but because they built something nobody truly cared enough to pay for or return to.**

Finding PMF requires an ego-free willingness to discard features, reframe the value proposition, and focus relentlessly on the smallest possible cohort of enthusiastic users.

---

## 2. Understand Customers Deeply

Lenny repeatedly emphasizes that qualitative customer understanding must precede quantitative optimization. Surveys and vanity pageview metrics deceive; intimate conversations reveal reality.

When speaking with early users, do not pitch your vision. Instead, investigate:
- What is the most painful, manual part of their current workflow?
- How much money or time do they waste solving it today?
- What hacked-together spreadsheets or duct-tape tools are they currently enduring?

If users are not actively attempting to solve the problem with existing imperfect tools, the problem is rarely urgent enough to sustain an early-stage startup.

---

## 3. Ship and Iterate in Days, Not Months

A frequent pitfall among engineering and product teams is polishing an unvalidated concept. World-class operators prioritize velocity of customer feedback over architectural perfection.

Ship small, imperfect iterations. Put wireframes and clickable prototypes in front of 5 users every Tuesday. Watch where their cursor hesitates. Listen to the friction in their voice. Treat every code deployment as an empirical hypothesis test.

---

## 4. Look for Strong Emotional Signals

How do you know when PMF is genuinely happening? Lenny's guests highlight several unmistakable qualitative and quantitative indicators:

- **Organic Word of Mouth:** Users spontaneously evangelize the product to their colleagues without referral incentives.
- **Extreme Disappointment:** As popularized by Rahul Vohra's framework, over 40% of users state they would be "very disappointed" if the product ceased to exist.
- **Spontaneous Workarounds:** When a bug occurs, users complain passionately because their workflow was disrupted, rather than silently churning.

---

## 5. Common Traps That Deceive Founders

1. **The 'One Feature Away' Fallacy:** Believing that adding one more integration will suddenly unlock exponential retention.
2. **Confusing Top-of-Funnel Hype with Retention:** Spikes from Product Hunt or social media that crater to 0% retention within 14 days.
3. **Targeting Everyone:** Building a generalized tool instead of dominating an acute niche where you are 10x better than the alternative.

---

## 6. Key Actionable Takeaways

- **Narrow the wedge:** Win 100 passionate evangelists before pursuing 10,000 lukewarm visitors.
- **Instrument retention early:** If cohort retention curves do not flatten horizontally, stop investing in paid acquisition.
- **Keep the feedback loop under 48 hours:** Talk to users, synthesize feedback, deploy a fix, and close the loop directly with the user who requested it.`,
};

export const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'chat-pmf-1',
    title: 'Product-market fit for early-stage startups',
    createdAt: 'Oct 8, 2026',
    updatedAt: '10:24 AM',
    modelId: 'ollama-llama-3-2',
    pinned: true,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'How can an early-stage startup find product-market fit?',
        timestamp: '10:24 AM',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        timestamp: '10:25 AM',
        isDemo: true,
        content: `Based on curated podcast transcripts, here's a grounded answer on finding product-market fit for early-stage startups.

### Key insights

1. **Deep customer understanding**
   Lenny emphasizes talking to real customers, not just running surveys. Focus on understanding the actual problems and the current workarounds they use.

2. **Ship small and iterate**
   Early-stage teams should ship simple solutions, observe real usage, and iterate based on customer feedback rather than trying to build a perfect product upfront.

3. **Look for strong emotional signals**
   Signs like users coming back, referring others, or feeling disappointed when they can't use the product indicate product-market fit.`,
        citations: [
          MOCK_CITATIONS[0],
          MOCK_CITATIONS[1],
          MOCK_CITATIONS[2],
          MOCK_CITATIONS[3],
        ],
        suggestedActions: [
          { id: 'act-1', label: 'Write a 30 for 30 essay', action: 'write-essay', icon: 'pen' },
          { id: 'act-2', label: 'Create a visual artifact', action: 'create-artifact', icon: 'sparkles' },
          { id: 'act-3', label: 'Show more examples', action: 'more-examples', icon: 'refresh' },
        ],
      },
    ],
  },
  {
    id: 'chat-growth-loops',
    title: 'Growth loops',
    createdAt: 'Oct 7, 2026',
    updatedAt: '2:15 PM',
    modelId: 'ollama-llama-3-2',
    messages: [
      {
        id: 'msg-gl-1',
        role: 'user',
        content: 'What are the main growth loop frameworks used by high-performing SaaS companies?',
        timestamp: '2:12 PM',
      },
      {
        id: 'msg-gl-2',
        role: 'assistant',
        content: `Based on Elena Verna and Brian Balfour on Lenny's Podcast, high-growth products rely on compounding loops rather than static funnels.

### The Three Core Loop Categories:
1. **Product-Led Loops (Viral & Collaborative):** A user creates value (document, invite, link), triggering notifications that bring in secondary users (e.g. Figma, Loom, Notion).
2. **Content Loops:** User-generated or company-generated programmatic pages rank on search, attracting new searchers who generate further content (e.g. Pinterest, Zapier).
3. **Paid Reinvestment Loops:** Customers generate LTV with rapid payback (<6 months), which directly finances customer acquisition campaigns without diluting runway.`,
        timestamp: '2:15 PM',
        citations: [MOCK_CITATIONS[2]],
      },
    ],
  },
  {
    id: 'chat-pricing-strategy',
    title: 'Pricing strategy',
    createdAt: 'Oct 6, 2026',
    updatedAt: '11:04 AM',
    modelId: 'ollama-llama-3-2',
    messages: [
      {
        id: 'msg-pr-1',
        role: 'user',
        content: 'How should a B2B SaaS startup choose its primary value metric for pricing?',
        timestamp: '11:00 AM',
      },
      {
        id: 'msg-pr-2',
        role: 'assistant',
        content: `According to Patrick Campbell and Madhavan Ramanujam on Lenny's Podcast:

- **Per-seat pricing** is increasingly penalized in the AI era. If your software saves time, charging per seat punishes efficiency.
- **Value-metric pricing** scales with the customer's success (e.g., active contacts for HubSpot, API calls for Twilio, or volume processed for Stripe).
- Align your metric with what the buyer considers their primary ROI indicator.`,
        timestamp: '11:04 AM',
        citations: [MOCK_CITATIONS[0]],
      },
    ],
  },
  {
    id: 'chat-founder-mindset',
    title: 'Founder mindset',
    createdAt: 'Oct 5, 2026',
    updatedAt: '4:45 PM',
    modelId: 'ollama-llama-3-2',
    messages: [
      {
        id: 'msg-fm-1',
        role: 'user',
        content: 'What mental models do top founders use to manage prioritization and avoid burnout?',
        timestamp: '4:40 PM',
      },
      {
        id: 'msg-fm-2',
        role: 'assistant',
        content: `Drawing from Shreyas Doshi and Dalton Caldwell's episodes:

- **LNO Framework:** Categorize tasks into Leverage (10x payoff), Neutral (1x payoff), and Overhead (compliance/hygiene). Never apply perfectionism to Overhead.
- **High-Agency Execution:** When confronted with obstacles, refuse to accept default outcomes. Formulate the path forward around first principles.`,
        timestamp: '4:45 PM',
      },
    ],
  },
  {
    id: 'chat-ai-apps',
    title: 'AI in consumer apps',
    createdAt: 'Oct 4, 2026',
    updatedAt: '9:18 AM',
    modelId: 'ollama-llama-3-2',
    messages: [
      {
        id: 'msg-ai-1',
        role: 'user',
        content: 'What UX patterns actually drive retention in consumer AI applications?',
        timestamp: '9:15 AM',
      },
      {
        id: 'msg-ai-2',
        role: 'assistant',
        content: `Top takeaways from recent Lenny episodes on AI interfaces:

- **Moving beyond blank chat boxes:** Users suffer from 'blank prompt paralysis'. Give strong contextual suggestions, preset chips, and artifact canvases.
- **Inline Editing & Control:** Allow users to tweak partial outputs without regenerating the entire response.
- **Sandboxed Artifacts:** Generating direct interactive outputs (dashboards, essays, graphics) drives 3x higher utility than raw conversational text.`,
        timestamp: '9:18 AM',
      },
    ],
  },
];

export const MOCK_LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: 'lib-1',
    title: 'Product-market fit for early-stage startups',
    type: 'essay',
    date: 'Oct 8, 2026',
    snippet: 'A practical, 1,250-word Ship 30 for 30 guide synthesized from Lenny Rachitsky and Peter Reinhardt podcast transcripts.',
    tags: ['PMF', 'Startups', 'Ship 30 for 30', 'Strategy'],
    referenceId: 'essay-pmf-1',
    thumbnailUrl: '/assets/mountain_cliff_editorial.jpg',
    isDemo: true,
  },
  {
    id: 'lib-2',
    title: 'SaaS Growth Dashboard',
    type: 'artifact',
    date: 'Oct 7, 2026',
    snippet: 'Interactive HTML/CSS metrics dashboard tracking CAC payback, Net Dollar Retention, and cohort retention loops.',
    tags: ['Dashboard', 'Metrics', 'HTML/CSS', 'Growth'],
    referenceId: 'art-growth-1',
    isDemo: true,
  },
  {
    id: 'lib-3',
    title: 'Two-sided marketplace strategy',
    type: 'essay',
    date: 'Oct 6, 2026',
    snippet: 'Solving the chicken-and-egg problem: constraint-driven geography, subsidies, and high-frequency supply.',
    tags: ['Marketplaces', 'Network Effects', 'Essay'],
    referenceId: 'essay-marketplace',
    isDemo: true,
  },
  {
    id: 'lib-4',
    title: 'Growth loops framework',
    type: 'artifact',
    date: 'Oct 5, 2026',
    snippet: 'Visual strategy canvas mapping viral, content, and paid loops with conversion efficiency coefficients.',
    tags: ['Strategy Canvas', 'Framework', 'Visual'],
    referenceId: 'art-loops-1',
    isDemo: true,
  },
  {
    id: 'lib-5',
    title: 'Founder decision frameworks',
    type: 'essay',
    date: 'Oct 4, 2026',
    snippet: 'Applying Shreyas Doshi’s LNO framework, high agency, and pre-mortems to founder sprint cadences.',
    tags: ['Leadership', 'Mental Models', 'Essay'],
    referenceId: 'essay-decision',
    isDemo: true,
  },
];

export const MOCK_ARTIFACT_TEMPLATES: Record<
  string,
  { title: string; desc: string; type: 'html' | 'markdown'; code: string }
> = {
  'growth-dashboard': {
    title: 'SaaS Growth & Retention Dashboard',
    desc: 'Metrics and charts for tracking cohort retention, payback, and activation.',
    type: 'html',
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0c0e17; color: #f5f6fa; margin: 0; padding: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .card { background: #161b2c; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; }
    .metric-title { font-size: 13px; color: #9ea5ba; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
    .metric-val { font-size: 32px; font-weight: 700; color: #ffffff; }
    .metric-delta { font-size: 12px; color: #10b981; margin-top: 4px; display: inline-block; font-weight: 500; }
    .chart-container { background: #161b2c; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; }
    .bar-row { display: flex; align-items: center; gap: 12px; margin: 12px 0; font-size: 13px; }
    .bar-label { width: 90px; color: #9ea5ba; }
    .bar-track { flex: 1; height: 12px; background: rgba(255,255,255,0.06); border-radius: 6px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, #ff7336, #ff9e43); }
    h2 { font-size: 18px; margin-top: 0; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="grid">
    <div class="card">
      <div class="metric-title">Net Dollar Retention</div>
      <div class="metric-val">124%</div>
      <span class="metric-delta">↑ +4.2% MoM</span>
    </div>
    <div class="card">
      <div class="metric-title">CAC Payback</div>
      <div class="metric-val">5.4 mo</div>
      <span class="metric-delta">↓ -0.8 mo (Better)</span>
    </div>
    <div class="card">
      <div class="metric-title">Activation Rate</div>
      <div class="metric-val">48.6%</div>
      <span class="metric-delta">↑ +3.1% vs Goal</span>
    </div>
    <div class="card">
      <div class="metric-title">Ellis PMF Score</div>
      <div class="metric-val">52%</div>
      <span class="metric-delta">Threshold: 40%</span>
    </div>
  </div>
  <div class="chart-container">
    <h2>Cohort Retention Progression</h2>
    <div class="bar-row">
      <span class="bar-label">Month 1</span>
      <div class="bar-track"><div class="bar-fill" style="width: 100%;"></div></div>
      <span>100%</span>
    </div>
    <div class="bar-row">
      <span class="bar-label">Month 2</span>
      <div class="bar-track"><div class="bar-fill" style="width: 74%;"></div></div>
      <span>74%</span>
    </div>
    <div class="bar-row">
      <span class="bar-label">Month 3</span>
      <div class="bar-track"><div class="bar-fill" style="width: 61%;"></div></div>
      <span>61%</span>
    </div>
    <div class="bar-row">
      <span class="bar-label">Month 6</span>
      <div class="bar-track"><div class="bar-fill" style="width: 58%;"></div></div>
      <span>58% (Curve Flat)</span>
    </div>
  </div>
</body>
</html>`,
  },
  'strategy-canvas': {
    title: 'Product Strategy Canvas',
    desc: 'Visual framework mapping competitive differentiation, ICP wedge, and moat.',
    type: 'html',
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0c0e17; color: #f5f6fa; margin: 0; padding: 24px; }
    .canvas-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .box { background: #161b2c; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; }
    .box-title { font-size: 14px; font-weight: 600; color: #ff9e43; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
    ul { margin: 0; padding-left: 20px; color: #9ea5ba; font-size: 14px; line-height: 1.6; }
    li { margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="canvas-grid">
    <div class="box">
      <div class="box-title">Target ICP Wedge</div>
      <ul>
        <li>Seed to Series A tech founders & early PMs.</li>
        <li>Acute pain: struggling to structure customer interview feedback.</li>
        <li>Current workaround: messy Google Docs and forgotten recordings.</li>
      </ul>
    </div>
    <div class="box">
      <div class="box-title">10x Value Proposition</div>
      <ul>
        <li>Instant grounded extraction of product decisions from raw conversations.</li>
        <li>Generates Ship 30 for 30 essays and live dashboards in seconds.</li>
        <li>Zero prompt engineering required from the user.</li>
      </ul>
    </div>
    <div class="box">
      <div class="box-title">Distribution Loop</div>
      <ul>
        <li>Collaborative artifact viewer links shared with team and board members.</li>
        <li>Public Ship 30 for 30 essays published directly to LinkedIn & X.</li>
        <li>Podcast listeners discovering through Lenny's newsletter curation.</li>
      </ul>
    </div>
    <div class="box">
      <div class="box-title">Defensible Moat</div>
      <ul>
        <li>Proprietary chunking & vector retrieval across podcast transcripts.</li>
        <li>Tailored writing skill agent tuned on proven editorial formats.</li>
        <li>Integrated secure workspace replacing fragmented generic chatbot tabs.</li>
      </ul>
    </div>
  </div>
</body>
</html>`,
  },
  'product-roadmap': {
    title: 'Phase-Driven Product Roadmap',
    desc: 'Timeline and milestone phases for MVP, Growth, and Scale.',
    type: 'html',
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0c0e17; color: #f5f6fa; margin: 0; padding: 24px; }
    .phase-card { background: #161b2c; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 16px; border-left: 4px solid #ff7336; }
    .phase-badge { display: inline-block; font-size: 11px; background: rgba(255, 115, 54, 0.15); color: #ff9e43; padding: 3px 8px; border-radius: 4px; font-weight: 600; margin-bottom: 8px; }
    h3 { margin: 0 0 10px 0; font-size: 16px; }
    p { margin: 0; font-size: 13.5px; color: #9ea5ba; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="phase-card">
    <div class="phase-badge">PHASE 1 • IN PROGRESS</div>
    <h3>Full Frontend Engineering & Design System</h3>
    <p>Midnight Editorial Intelligence workspace, 8 responsive sections, Ship 30 for 30 writing studio, sandboxed artifact viewer, and typed API integration boundary.</p>
  </div>
  <div class="phase-card" style="border-left-color: #8b5cf6;">
    <div class="phase-badge" style="background: rgba(139, 92, 246, 0.15); color: #a78bfa;">PHASE 2 • BACKEND & RAG</div>
    <h3>FastAPI, PostgreSQL & Transcript Vector Indexing</h3>
    <p>Ingestion pipeline for full archive of Lenny episodes, hybrid vector + keyword search, citation timestamps, and Ollama local LLM execution pipeline.</p>
  </div>
  <div class="phase-card" style="border-left-color: #38bdf8;">
    <div class="phase-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">PHASE 3 • AUTONOMOUS AGENT LAYER</div>
    <h3>Claude Agent SDK & Pi Coding Agent Integration</h3>
    <p>Self-evaluating Ship 30 for 30 writing agent with editorial hook scoring, dynamic artifact generation, and secure cloud sharing.</p>
  </div>
</body>
</html>`,
  },
  'one-pager': {
    title: 'Product One-Pager',
    desc: 'Structured executive summary document for team and stakeholder alignment.',
    type: 'html',
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Newsreader', Georgia, serif; background: #0c0e17; color: #f5f6fa; margin: 0; padding: 32px; max-width: 700px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 28px; margin-bottom: 6px; font-weight: 600; }
    .meta { font-family: -apple-system, sans-serif; font-size: 12px; color: #9ea5ba; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.05em; }
    h2 { font-size: 18px; margin-top: 24px; color: #ff9e43; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px; }
    p { font-size: 15px; color: #c9cddb; }
  </style>
</head>
<body>
  <h1>The Lenny Growth Assistant</h1>
  <div class="meta">Oogway Labs • Product Executive One-Pager • Q4 2026</div>
  <h2>Problem Statement</h2>
  <p>Founders and product managers spend hundreds of hours searching generic search engines and listening to podcast archives without an efficient path from interview knowledge to structured operational decisions.</p>
  <h2>Core Solution</h2>
  <p>An AI-powered research and writing workspace grounded strictly in Lenny's Podcast and Newsletter transcripts. The system combines instant citation verification with specialized agents that transform conversational queries into Ship 30 for 30 essays and visual artifacts.</p>
  <h2>Key Success Metrics</h2>
  <p>1. Time from question to grounded essay draft under 60 seconds.<br>2. Transcript-referenced claims with direct audio timestamp links.<br>3. Over 40% weekly active user retention among early product builders.</p>
</body>
</html>`,
  },
};

export const MOCK_INSIGHTS: InsightTheme[] = [
  {
    id: 'ins-1',
    title: 'The Real Definition of Product-Market Fit',
    category: 'Product-Market Fit',
    episodeTitle: 'Product-Market Fit & Traction',
    episodeNumber: 12,
    guest: 'Peter Reinhardt',
    timestamp: '14:05',
    isDemo: true,
    takeaways: [
      'PMF feels like desperately trying to fulfill demand, not pushing features.',
      'Retention curves must flatten horizontally before scaling spend.',
      'Focus on the 5-10 users who cannot live without you.',
    ],
    evidenceExcerpt: 'When Segment launched, we realized people didn’t care about our analytics tool. But when we released a tiny open-source analytics router library, GitHub stars exploded and thousands downloaded it in 48 hours.',
    recommendedAction: 'Audit your current churned users to isolate the hyper-engaged cohort and rebuild your messaging exclusively around their use case.',
  },
  {
    id: 'ins-2',
    title: 'Building Compounding Growth Loops',
    category: 'Growth Loops',
    episodeTitle: 'Growth Loops & Retention Mechanics',
    episodeNumber: 84,
    guest: 'Elena Verna & Brian Balfour',
    timestamp: '08:30',
    isDemo: true,
    takeaways: [
      'Linear acquisition funnels suffer from diminishing returns.',
      'Loops reinvest outputs from one user cohort into acquisition of the next.',
      'Product-led virality requires a natural collaborative artifact.',
    ],
    evidenceExcerpt: 'The fatal mistake most growth teams make is treating acquisition, retention, and monetization as three isolated silos. In high-growth companies, the retention mechanism itself is what powers acquisition.',
    recommendedAction: 'Map out the exact step where an active user exposes your product to a non-user, and eliminate friction at that transfer point.',
  },
  {
    id: 'ins-3',
    title: 'The Sean Ellis 40% PMF Benchmark',
    category: 'Product-Market Fit',
    episodeTitle: 'Finding Your Core User',
    episodeNumber: 103,
    guest: 'Rahul Vohra',
    timestamp: '19:40',
    isDemo: true,
    takeaways: [
      'Ask: How would you feel if you could no longer use the product?',
      'If over 40% answer "very disappointed", you have product-market fit.',
      'Analyze what the "somewhat disappointed" group is missing.',
    ],
    evidenceExcerpt: 'At Superhuman, we surveyed all our users. When we isolated only the users who would be very disappointed, we discovered they all shared a single persona: professionals who receive over 200 emails a day.',
    recommendedAction: 'Run the Sean Ellis survey with your last 50 active users to calculate your current PMF percentage score.',
  },
  {
    id: 'ins-4',
    title: 'The LNO Framework for High-Leverage Work',
    category: 'Leadership',
    episodeTitle: 'Mental Models & Career Frameworks',
    episodeNumber: 42,
    guest: 'Shreyas Doshi',
    timestamp: '28:15',
    isDemo: true,
    takeaways: [
      'Leverage tasks: 10x impact, deserve 100% excellence.',
      'Neutral tasks: 1x impact, execute well with standard effort.',
      'Overhead tasks: <1x impact, do as quickly and minimally as possible.',
    ],
    evidenceExcerpt: 'The biggest cause of burnout among high achievers is applying Leverage-level perfectionism to Overhead tasks. You must give yourself permission to do B- work on Overhead.',
    recommendedAction: 'Audit your calendar this week and explicitly tag every meeting and project as L, N, or O.',
  },
];
