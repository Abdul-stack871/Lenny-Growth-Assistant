import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Page,
  AIModel,
  ChatConversation,
  ChatMessage,
  Essay,
  Artifact,
  LibraryItem,
  AppSettings,
  ConnectionStatus,
} from '../types';
import {
  MOCK_MODELS,
  MOCK_CONVERSATIONS,
  MOCK_DEFAULT_ESSAY,
  MOCK_ARTIFACT_TEMPLATES,
  MOCK_LIBRARY_ITEMS,
} from '../services/mockDataAdapter';
import { apiClient } from '../services/apiClient';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;

  // Chat contextual panel
  activeContextualTab: 'artifact' | 'transcript' | 'notes';
  setActiveContextualTab: (tab: 'artifact' | 'transcript' | 'notes') => void;
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (open: boolean) => void;
  isRightPanelMaximized: boolean;
  setIsRightPanelMaximized: (max: boolean) => void;

  // AI Models
  models: AIModel[];
  selectedModel: AIModel;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;

  // Genuine System & Model Connection Statuses
  ollamaStatus: ConnectionStatus;
  backendStatus: ConnectionStatus;
  checkConnections: (silent?: boolean) => Promise<void>;

  // Conversations
  conversations: ChatConversation[];
  activeConversation: ChatConversation | undefined;
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  createNewConversation: () => void;
  renameConversation: (id: string, newTitle: string) => void;
  pinConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  isSendingMessage: boolean;
  messageError: string | null;
  retryLastMessage: () => Promise<void>;

  // Writing
  activeEssay: Essay;
  setActiveEssay: React.Dispatch<React.SetStateAction<Essay>>;

  // Artifacts
  activeArtifact: Artifact;
  setActiveArtifact: React.Dispatch<React.SetStateAction<Artifact>>;

  // Library
  libraryItems: LibraryItem[];
  addLibraryItem: (item: Omit<LibraryItem, 'id'>) => void;
  removeLibraryItem: (id: string) => void;

  // Notes
  userNotes: string;
  setUserNotes: (notes: string) => void;

  // Modals & Panels
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isSwitchModelModalOpen: boolean;
  setIsSwitchModelModalOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Feedback Toast
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('chat');
  const [activeContextualTab, setActiveContextualTab] = useState<'artifact' | 'transcript' | 'notes'>('artifact');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isRightPanelMaximized, setIsRightPanelMaximized] = useState(false);

  // Models
  const [models] = useState<AIModel[]>(MOCK_MODELS);
  const [selectedModelId, setSelectedModelId] = useState<string>('ollama-llama-3-2');
  const selectedModel = models.find((m) => m.id === selectedModelId) || models[0];

  // Genuine Live Connection Statuses
  const [ollamaStatus, setOllamaStatus] = useState<ConnectionStatus>('checking');
  const [backendStatus, setBackendStatus] = useState<ConnectionStatus>('checking');

  // Conversations
  const [conversations, setConversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [lastUserMessageText, setLastUserMessageText] = useState<string>('');

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  // Writing & Artifacts
  const [activeEssay, setActiveEssay] = useState<Essay>(MOCK_DEFAULT_ESSAY);
  const [activeArtifact, setActiveArtifact] = useState<Artifact>({
    id: 'art-growth-1',
    title: 'SaaS Growth & Retention Dashboard',
    description: 'Metrics and charts for tracking cohort retention, payback, and activation.',
    template: 'growth-dashboard',
    type: 'html',
    code: MOCK_ARTIFACT_TEMPLATES['growth-dashboard'].code,
    createdAt: 'Oct 7, 2026',
    updatedAt: 'Oct 7, 2026',
    isDemo: true,
  });

  // Library
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(MOCK_LIBRARY_ITEMS);

  // Notes
  const [userNotes, setUserNotes] = useState<string>(`# My Product Notes

- Investigate early customer onboarding dropoff points
- Run Sean Ellis survey (40% threshold benchmark)
- Focus on cohort retention curve flattening rather than vanity pageviews
- Prepare presentation for weekly sync based on Lenny's Podcast Ep. 12`);

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSwitchModelModalOpen, setIsSwitchModelModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Settings (NO browser API keys stored)
  const [settings, setSettings] = useState<AppSettings>({
    defaultProvider: 'ollama',
    selectedModelId: 'ollama-llama-3-2',
    ollamaEndpoint: 'http://localhost:11434',
    apiBaseUrl: 'http://localhost:8000/api/v1',
    enableSerifHeadings: true,
    reducedMotion: false,
    autoScrollChat: true,
    theme: 'midnight',
  });

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings updated', 'info');
  };

  // Genuine Health Checks
  const checkConnections = useCallback(async (silent: boolean = false) => {
    setOllamaStatus('checking');
    setBackendStatus('checking');

    try {
      const [ollamaRes, backendRes] = await Promise.all([
        apiClient.checkOllamaHealth(settings.ollamaEndpoint),
        apiClient.checkBackendHealth(),
      ]);

      setOllamaStatus(ollamaRes.status);
      setBackendStatus(backendRes.status);

      if (!silent) {
        if (ollamaRes.status === 'connected') {
          showToast('Ollama connected: Local inference active', 'success');
        } else {
          showToast('Ollama not detected at localhost:11434 (Demo mode active)', 'info');
        }
      }
    } catch {
      setOllamaStatus('disconnected');
      setBackendStatus('disconnected');
    }
  }, [settings.ollamaEndpoint, showToast]);

  // Initial check on mount
  useEffect(() => {
    checkConnections(true);
  }, [checkConnections]);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const createNewConversation = () => {
    const newChat: ChatConversation = {
      id: `chat-${Date.now()}`,
      title: 'New conversation',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      modelId: selectedModelId,
      messages: [],
    };
    setConversations((prev) => [newChat, ...prev]);
    setActiveConversationId(newChat.id);
    setMessageError(null);
    setCurrentPage('chat');
    showToast('Created new conversation');
  };

  const renameConversation = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle.trim(), updatedAt: 'Just now' } : c))
    );
    showToast('Conversation renamed');
  };

  const pinConversation = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextPinned = !c.pinned;
          showToast(nextPinned ? 'Pinned to top of Recent Chats' : 'Unpinned conversation');
          return { ...c, pinned: nextPinned };
        }
        return c;
      })
    );
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (activeConversationId === id) {
        if (remaining.length > 0) {
          setActiveConversationId(remaining[0].id);
        } else {
          const fallbackChat: ChatConversation = {
            id: `chat-${Date.now()}`,
            title: 'New conversation',
            createdAt: 'Just now',
            updatedAt: 'Just now',
            modelId: selectedModelId,
            messages: [],
          };
          setActiveConversationId(fallbackChat.id);
          return [fallbackChat];
        }
      }
      return remaining;
    });
    showToast('Conversation deleted', 'info');
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !activeConversation) return;

    setMessageError(null);
    setLastUserMessageText(content);

    const userMsg: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Append user message immediately
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              title: c.messages.length === 0 ? content.slice(0, 42) : c.title,
              updatedAt: 'Just now',
              messages: [...c.messages, userMsg],
            }
          : c
      )
    );

    setIsSendingMessage(true);

    try {
      const assistantMsg = await apiClient.sendMessage({
        conversationId: activeConversation.id,
        content,
        modelId: selectedModelId,
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                updatedAt: 'Just now',
                messages: [...c.messages, assistantMsg],
              }
            : c
        )
      );
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve response';
      setMessageError(errorMsg);
      showToast('Error generating response. Click retry to attempt again.', 'error');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const retryLastMessage = async () => {
    if (!lastUserMessageText) return;
    setMessageError(null);
    setIsSendingMessage(true);

    try {
      const assistantMsg = await apiClient.sendMessage({
        conversationId: activeConversationId,
        content: lastUserMessageText,
        modelId: selectedModelId,
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                updatedAt: 'Just now',
                messages: [...c.messages, assistantMsg],
              }
            : c
        )
      );
      showToast('Retried response generated');
    } catch {
      setMessageError('Retry failed. Check backend connection.');
      showToast('Retry attempt failed', 'error');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const addLibraryItem = (item: Omit<LibraryItem, 'id'>) => {
    const newItem: LibraryItem = {
      ...item,
      id: `lib-${Date.now()}`,
    };
    setLibraryItems((prev) => [newItem, ...prev]);
    showToast('Saved to My Library');
  };

  const removeLibraryItem = (id: string) => {
    setLibraryItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed from Library', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        activeContextualTab,
        setActiveContextualTab,
        isRightPanelOpen,
        setIsRightPanelOpen,
        isRightPanelMaximized,
        setIsRightPanelMaximized,
        models,
        selectedModel,
        selectedModelId,
        setSelectedModelId,
        ollamaStatus,
        backendStatus,
        checkConnections,
        conversations,
        activeConversation,
        activeConversationId,
        setActiveConversationId,
        createNewConversation,
        renameConversation,
        pinConversation,
        deleteConversation,
        sendMessage,
        isSendingMessage,
        messageError,
        retryLastMessage,
        activeEssay,
        setActiveEssay,
        activeArtifact,
        setActiveArtifact,
        libraryItems,
        addLibraryItem,
        removeLibraryItem,
        userNotes,
        setUserNotes,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isSwitchModelModalOpen,
        setIsSwitchModelModalOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        settings,
        updateSettings,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
