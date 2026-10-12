import {
  ChatConversation,
  ChatMessage,
  Essay,
  Artifact,
  InsightTheme,
  WritingFormat,
  EssayTone,
  ArtifactTemplate,
} from '../types';
import {
  MOCK_CONVERSATIONS,
  MOCK_DEFAULT_ESSAY,
  MOCK_ARTIFACT_TEMPLATES,
  MOCK_INSIGHTS,
  MOCK_CITATIONS,
} from './mockDataAdapter';

// Configurable backend base URL from environment
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  modelId: string;
}

export interface GenerateEssayPayload {
  topic: string;
  format: WritingFormat;
  length: string;
  tone: EssayTone;
  focus?: string;
}

export interface GenerateArtifactPayload {
  template: ArtifactTemplate;
  title: string;
  description: string;
  contextPrompt?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Health check for FastAPI backend
   */
  async checkBackendHealth(): Promise<{ status: 'connected' | 'disconnected'; latencyMs?: number }> {
    const startTime = performance.now();
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(1500),
      });
      const latencyMs = Math.round(performance.now() - startTime);
      if (response.ok) {
        return { status: 'connected', latencyMs };
      }
      return { status: 'disconnected' };
    } catch {
      return { status: 'disconnected' };
    }
  }

  /**
   * Health check for local Ollama instance
   */
  async checkOllamaHealth(endpoint: string = 'http://localhost:11434'): Promise<{
    status: 'connected' | 'disconnected';
    models?: string[];
  }> {
    try {
      const response = await fetch(`${endpoint}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(1500),
      });
      if (response.ok) {
        const data = await response.json();
        const models = (data.models || []).map((m: { name: string }) => m.name);
        return { status: 'connected', models };
      }
      return { status: 'disconnected' };
    } catch {
      return { status: 'disconnected' };
    }
  }

  /**
   * Send a chat message with retrieval grounding
   */
  async sendMessage(payload: SendMessagePayload): Promise<ChatMessage> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60000),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Backend unavailable; clean simulated mock grounded response
    }

    // Simulated grounded response (labeled as demo fallback)
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      isDemo: true,
      content: `Based on curated transcript excerpts regarding "${payload.content}", here is a synthesized framework:

1. **Direct Customer Discovery:** Start with 15 qualitative conversations without selling.
2. **Rapid Iteration:** Build minimal prototypes in under 48 hours to validate behavior rather than declared intent.
3. **Leading Indicators:** Look for voluntary retention and unprompted recommendations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [
        { ...MOCK_CITATIONS[0], isDemo: true },
        { ...MOCK_CITATIONS[1], isDemo: true },
      ],
      suggestedActions: [
        { id: `act-${Date.now()}-1`, label: 'Write a 30 for 30 essay', action: 'write-essay', icon: 'pen' },
        { id: `act-${Date.now()}-2`, label: 'Create a visual artifact', action: 'create-artifact', icon: 'sparkles' },
        { id: `act-${Date.now()}-3`, label: 'Show more examples', action: 'more-examples', icon: 'refresh' },
      ],
    };
  }

  /**
   * Generate Ship 30 for 30 or custom essay
   */
  async generateEssay(payload: GenerateEssayPayload): Promise<Essay> {
    try {
      const response = await fetch(`${this.baseUrl}/writing/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60000),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback to local adapter
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      ...MOCK_DEFAULT_ESSAY,
      id: `essay-${Date.now()}`,
      topic: payload.topic,
      format: payload.format,
      length: payload.length,
      tone: payload.tone,
      title: payload.topic.charAt(0).toUpperCase() + payload.topic.slice(1),
      updatedAt: 'Just now',
      isDemo: true,
    };
  }

  /**
   * Generate an artifact
   */
  async generateArtifact(payload: GenerateArtifactPayload): Promise<Artifact> {
    try {
      const response = await fetch(`${this.baseUrl}/artifacts/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60000),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 900));
    const tmpl = MOCK_ARTIFACT_TEMPLATES[payload.template] || MOCK_ARTIFACT_TEMPLATES['growth-dashboard'];
    return {
      id: `art-${Date.now()}`,
      title: payload.title || tmpl.title,
      description: payload.description || tmpl.desc,
      template: payload.template,
      type: tmpl.type,
      code: tmpl.code,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      isDemo: true,
    };
  }

  /**
   * Fetch insights from backend
   */
  async getInsights(): Promise<InsightTheme[]> {
    try {
      const response = await fetch(`${this.baseUrl}/insights/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(4000),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }
    return MOCK_INSIGHTS;
  }

  /**
   * List conversations persisted on backend
   */
  async listConversations(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/conversations`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }
    return [];
  }

  /**
   * Search transcripts via Grounded RAG engine
   */
  async searchTranscripts(query: string, topK: number = 5): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/transcripts/search?q=${encodeURIComponent(query)}&top_k=${topK}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(4000),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }
    return null;
  }

  /**
   * List verified podcast episodes
   */
  async listEpisodes(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/transcripts/episodes`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }
    return [];
  }
}

export const apiClient = new ApiClient();
