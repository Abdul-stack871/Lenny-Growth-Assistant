export type Page =
  | 'home'
  | 'chat'
  | 'writing'
  | 'artifacts'
  | 'library'
  | 'insights'
  | 'playground'
  | 'settings';

export type ModelProvider = 'ollama' | 'anthropic' | 'openai';

export type ConnectionStatus = 'connected' | 'disconnected' | 'checking';

export interface AIModel {
  id: string;
  name: string;
  provider: ModelProvider;
  isLocal: boolean;
  description: string;
  contextWindow: string;
  status: 'active' | 'ready' | 'offline';
  badge?: string;
  requiresBackend?: boolean;
}

export interface Citation {
  id: string;
  episodeNumber: number;
  episodeTitle: string;
  guest?: string;
  timestampStart: string;
  timestampEnd: string;
  excerpt: string;
  audioSeconds?: number;
  audioUrl?: string;
  isDemo?: boolean;
}

export interface SuggestedAction {
  id: string;
  label: string;
  action: 'write-essay' | 'create-artifact' | 'more-examples' | 'custom';
  icon: 'pen' | 'sparkles' | 'refresh';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  suggestedActions?: SuggestedAction[];
  isStreaming?: boolean;
  isDemo?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  modelId: string;
  pinned?: boolean;
}

export type WritingFormat = 'ship30' | 'custom' | 'social' | 'newsletter';
export type EssayTone = 'practical' | 'analytical' | 'provocative' | 'tactical';

export interface Essay {
  id: string;
  title: string;
  subtitle: string;
  topic: string;
  format: WritingFormat;
  length: string;
  wordCount: number;
  readingTimeMinutes: number;
  tone: EssayTone;
  content: string;
  tableOfContents: string[];
  quoteCallout?: {
    quote: string;
    author: string;
    source: string;
  };
  heroImageUrl?: string;
  heroQuote?: string;
  citations: Citation[];
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export type ArtifactTemplate =
  | 'growth-dashboard'
  | 'strategy-canvas'
  | 'product-roadmap'
  | 'one-pager';

export interface Artifact {
  id: string;
  title: string;
  description: string;
  template: ArtifactTemplate;
  type: 'html' | 'markdown';
  code: string;
  createdAt: string;
  updatedAt: string;
  thumbnailIcon?: string;
  isDemo?: boolean;
}

export type LibraryFilter = 'all' | 'essays' | 'artifacts' | 'chats';

export interface LibraryItem {
  id: string;
  title: string;
  type: 'essay' | 'artifact' | 'chat';
  date: string;
  snippet: string;
  tags: string[];
  referenceId: string;
  thumbnailUrl?: string;
  isDemo?: boolean;
}

export interface InsightTheme {
  id: string;
  title: string;
  category: 'Product-Market Fit' | 'Growth Loops' | 'Pricing & Monetization' | 'Retention' | 'Leadership';
  episodeTitle: string;
  episodeNumber: number;
  guest: string;
  timestamp: string;
  takeaways: string[];
  evidenceExcerpt: string;
  recommendedAction: string;
  isDemo?: boolean;
}

export interface AppSettings {
  defaultProvider: ModelProvider;
  selectedModelId: string;
  ollamaEndpoint: string;
  apiBaseUrl: string;
  enableSerifHeadings: boolean;
  reducedMotion: boolean;
  autoScrollChat: boolean;
  theme: 'midnight' | 'dark';
}
