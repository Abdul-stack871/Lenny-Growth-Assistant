import React, { useState, useEffect } from 'react';
import {
  Search,
  MessageSquare,
  PenTool,
  Layers,
  Bookmark,
  Lightbulb,
  Terminal,
  Settings,
  X,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Page } from '../../types';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setCurrentPage,
    conversations,
    setActiveConversationId,
    libraryItems,
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    { label: 'Go to Chat', page: 'chat' as Page, icon: <MessageSquare size={16} /> },
    { label: 'Open Writing Studio (Ship 30 for 30)', page: 'writing' as Page, icon: <PenTool size={16} /> },
    { label: 'Build Artifacts', page: 'artifacts' as Page, icon: <Layers size={16} /> },
    { label: 'Browse Saved Library', page: 'library' as Page, icon: <Bookmark size={16} /> },
    { label: 'Explore Insights & Themes', page: 'insights' as Page, icon: <Lightbulb size={16} /> },
    { label: 'AI Model Playground', page: 'playground' as Page, icon: <Terminal size={16} /> },
    { label: 'System Settings & Ollama', page: 'settings' as Page, icon: <Settings size={16} /> },
  ];

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredChats = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLibrary = libraryItems.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectPage = (page: Page) => {
    setCurrentPage(page);
    setIsCommandPaletteOpen(false);
  };

  const handleSelectChat = (id: string) => {
    setActiveConversationId(id);
    setCurrentPage('chat');
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="palette-backdrop" onClick={() => setIsCommandPaletteOpen(false)}>
      <div className="palette-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="palette-search-row">
          <Search size={18} className="palette-icon" />
          <input
            autoFocus
            type="text"
            className="palette-input"
            placeholder="Type a command, search conversations, or jump to page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="palette-close-btn"
            onClick={() => setIsCommandPaletteOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        <div className="palette-results">
          {/* Quick Actions */}
          <div className="palette-group-title">Navigation & Actions</div>
          {filteredActions.map((action, idx) => (
            <button
              key={idx}
              className="palette-item-btn"
              onClick={() => handleSelectPage(action.page)}
            >
              <span className="item-icon">{action.icon}</span>
              <span className="item-text">{action.label}</span>
              <ArrowRight size={14} className="item-arrow" />
            </button>
          ))}

          {/* Chats */}
          {filteredChats.length > 0 && (
            <>
              <div className="palette-group-title">Conversations</div>
              {filteredChats.slice(0, 4).map((chat) => (
                <button
                  key={chat.id}
                  className="palette-item-btn"
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <MessageSquare size={16} className="item-icon" />
                  <span className="item-text">{chat.title}</span>
                  <span className="item-tag">Chat</span>
                </button>
              ))}
            </>
          )}

          {/* Library items */}
          {filteredLibrary.length > 0 && (
            <>
              <div className="palette-group-title">Library Artifacts & Essays</div>
              {filteredLibrary.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  className="palette-item-btn"
                  onClick={() => {
                    setCurrentPage('library');
                    setIsCommandPaletteOpen(false);
                  }}
                >
                  <Bookmark size={16} className="item-icon" />
                  <span className="item-text">{item.title}</span>
                  <span className="item-tag">{item.type}</span>
                </button>
              ))}
            </>
          )}
        </div>

        <div className="palette-footer">
          <span>Navigate with arrows</span>
          <span>Esc to close</span>
        </div>
      </div>

      <style>{`
        .palette-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(4, 5, 8, 0.82);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 100px;
          z-index: var(--z-modal);
        }

        .palette-modal {
          width: 90%;
          max-width: 620px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 115, 54, 0.1);
          overflow: hidden;
        }

        .palette-search-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .palette-icon {
          color: var(--accent-primary);
        }

        .palette-input {
          flex: 1;
          background: transparent;
          border: none;
          font-size: 16px;
          color: #ffffff;
          outline: none;
        }

        .palette-close-btn {
          color: var(--text-muted);
          padding: 4px;
        }

        .palette-close-btn:hover {
          color: #ffffff;
        }

        .palette-results {
          max-height: 380px;
          overflow-y: auto;
          padding: 10px;
        }

        .palette-group-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          padding: 8px 10px 4px 10px;
        }

        .palette-item-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          text-align: left;
        }

        .palette-item-btn:hover {
          color: #ffffff;
          background-color: var(--bg-surface-hover);
        }

        .item-icon {
          color: var(--text-muted);
        }

        .palette-item-btn:hover .item-icon {
          color: var(--accent-primary);
        }

        .item-text {
          flex: 1;
          font-size: 14px;
        }

        .item-arrow {
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .palette-item-btn:hover .item-arrow {
          opacity: 1;
          color: var(--accent-primary);
        }

        .item-tag {
          font-size: 11px;
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        .palette-footer {
          display: flex;
          justify-content: space-between;
          padding: 10px 20px;
          background: rgba(0, 0, 0, 0.25);
          border-top: 1px solid var(--border-subtle);
          font-size: 11.5px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
