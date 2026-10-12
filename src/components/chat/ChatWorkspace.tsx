import React, { useRef, useEffect, useState } from 'react';
import {
  Edit2,
  Check,
  Share2,
  Sparkles,
  Pin,
  Trash2,
  RotateCcw,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from './ChatMessage';
import { ChatComposer } from './ChatComposer';
import { ContextualPanel } from './ContextualPanel';

export const ChatWorkspace: React.FC = () => {
  const {
    activeConversation,
    renameConversation,
    pinConversation,
    deleteConversation,
    sendMessage,
    isSendingMessage,
    messageError,
    retryLastMessage,
    showToast,
  } = useApp();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeConversation) {
      setTitleInput(activeConversation.title);
    }
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isSendingMessage]);

  const handleSaveTitle = () => {
    if (activeConversation && titleInput.trim()) {
      renameConversation(activeConversation.id, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const samplePrompts = [
    {
      title: 'Product-Market Fit Signals',
      prompt: 'How can an early-stage startup tell if they genuinely have product-market fit according to Lenny\'s guests?',
    },
    {
      title: 'Compounding Growth Loops',
      prompt: 'What are the main growth loop frameworks used by high-performing SaaS companies?',
    },
    {
      title: 'B2B SaaS Pricing Metrics',
      prompt: 'How should a B2B SaaS startup choose its primary value metric for pricing in the AI era?',
    },
  ];

  return (
    <div className="chat-layout-wrapper">
      {/* Central Chat Stream */}
      <div className="chat-main-area">
        {/* Chat Header Bar */}
        <div className="chat-header-bar">
          <div className="chat-title-group">
            {isEditingTitle ? (
              <div className="edit-title-row">
                <input
                  type="text"
                  className="title-edit-input"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  autoFocus
                />
                <button className="title-action-btn" onClick={handleSaveTitle}>
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <div className="title-display-row">
                <h2 className="conversation-title">{activeConversation?.title || 'Conversation'}</h2>
                <button
                  className="title-edit-trigger"
                  onClick={() => setIsEditingTitle(true)}
                  title="Rename conversation"
                >
                  <Edit2 size={13} />
                </button>
              </div>
            )}
          </div>

          <div className="chat-header-actions">
            <button
              className={`header-action-btn ${activeConversation?.pinned ? 'pinned' : ''}`}
              onClick={() => activeConversation && pinConversation(activeConversation.id)}
              title={activeConversation?.pinned ? 'Unpin conversation' : 'Pin conversation to top'}
            >
              <Pin size={14} />
            </button>
            <button
              className="header-action-btn"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Conversation link copied to clipboard');
              }}
              title="Share conversation"
            >
              <Share2 size={14} />
            </button>
            <button
              className="header-action-btn delete"
              onClick={() => {
                if (activeConversation && window.confirm('Delete this conversation?')) {
                  deleteConversation(activeConversation.id);
                }
              }}
              title="Delete conversation"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="chat-messages-scroll-area">
          <div className="chat-messages-container">
            {/* Empty State when no messages */}
            {(!activeConversation || activeConversation.messages.length === 0) && (
              <div className="chat-empty-state animate-fade-in">
                <div className="empty-badge">
                  <Sparkles size={13} />
                  <span>EDITORIAL INTELLIGENCE WORKSPACE</span>
                </div>
                <h1 className="empty-title font-serif">Explore Lenny's Knowledge Base</h1>
                <p className="empty-subtitle">
                  Ask tactical product, growth, retention, and pricing questions synthesized from Lenny's Podcast transcripts.
                </p>

                <div className="sample-prompts-grid">
                  {samplePrompts.map((sp, idx) => (
                    <button
                      key={idx}
                      className="sample-prompt-card"
                      onClick={() => sendMessage(sp.prompt)}
                    >
                      <div className="sp-header">
                        <MessageSquare size={14} className="sp-icon" />
                        <span className="sp-title">{sp.title}</span>
                      </div>
                      <p className="sp-text">"{sp.prompt}"</p>
                      <div className="sp-action-hint">
                        <span>Ask question</span>
                        <ArrowRight size={13} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rendered Messages */}
            {activeConversation?.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Loading / Thinking State */}
            {isSendingMessage && (
              <div className="assistant-thinking-indicator animate-fade-in">
                <div className="thinking-avatar">
                  <Cpu size={16} className="animate-spin text-orange" />
                </div>
                <div className="thinking-bubble">
                  <div className="thinking-dots">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                  <span className="thinking-text">Synthesizing transcripts & citations...</span>
                </div>
              </div>
            )}

            {/* Error & Retry State */}
            {messageError && (
              <div className="chat-error-banner animate-fade-in">
                <div className="error-text-row">
                  <AlertCircle size={16} className="text-red" />
                  <span>{messageError}</span>
                </div>
                <button className="retry-btn" onClick={retryLastMessage}>
                  <RotateCcw size={13} />
                  <span>Retry Message</span>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom Composer */}
        <ChatComposer />
      </div>

      {/* Contextual Right Panel */}
      <ContextualPanel />

      <style>{`
        .chat-layout-wrapper {
          display: flex;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: var(--bg-workspace);
        }

        .chat-main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          position: relative;
        }

        .chat-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(13, 16, 26, 0.5);
          user-select: none;
        }

        .conversation-title {
          font-size: 14.5px;
          font-weight: 600;
          color: #ffffff;
        }

        .title-display-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title-edit-trigger {
          color: var(--text-muted);
          padding: 3px;
          border-radius: var(--radius-xs);
        }

        .title-edit-trigger:hover {
          color: #ffffff;
        }

        .edit-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .title-edit-input {
          background: var(--bg-surface-2);
          border: 1px solid var(--accent-primary);
          color: #ffffff;
          font-size: 14px;
          padding: 3px 8px;
          border-radius: var(--radius-xs);
          outline: none;
        }

        .title-action-btn {
          color: var(--accent-primary);
          padding: 3px;
        }

        .chat-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .header-action-btn {
          color: var(--text-muted);
          padding: 6px;
          border-radius: var(--radius-xs);
          transition: all var(--transition-fast);
        }

        .header-action-btn:hover {
          color: #ffffff;
          background: var(--bg-surface-2);
        }

        .header-action-btn.pinned {
          color: var(--accent-primary);
          background: rgba(255, 115, 54, 0.15);
        }

        .header-action-btn.delete:hover {
          color: #ef4444;
        }

        .chat-messages-scroll-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
        }

        .chat-messages-container {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        /* Empty State */
        .chat-empty-state {
          padding: 40px 0 20px 0;
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
        }

        .empty-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(255, 115, 54, 0.1);
          border: 1px solid rgba(255, 115, 54, 0.25);
          color: var(--accent-primary);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-radius: var(--radius-full);
          margin-bottom: 16px;
        }

        .empty-title {
          font-size: 32px;
          color: #ffffff;
          margin: 0 0 10px 0;
          font-weight: 600;
        }

        .empty-subtitle {
          font-size: 14.5px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0 0 32px 0;
        }

        .sample-prompts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          text-align: left;
        }

        @media (max-width: 768px) {
          .sample-prompts-grid {
            grid-template-columns: 1fr;
          }
        }

        .sample-prompt-card {
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .sample-prompt-card:hover {
          border-color: var(--accent-primary);
          background: var(--bg-surface-2);
          transform: translateY(-2px);
        }

        .sp-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sp-icon {
          color: var(--accent-primary);
        }

        .sp-title {
          font-size: 12.5px;
          font-weight: 600;
          color: #ffffff;
        }

        .sp-text {
          font-size: 12.5px;
          color: var(--text-muted);
          line-height: 1.45;
          margin: 0;
          flex: 1;
        }

        .sp-action-hint {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11.5px;
          color: var(--accent-primary);
          font-weight: 600;
          padding-top: 6px;
          border-top: 1px solid var(--border-subtle);
        }

        /* Assistant thinking indicator */
        .assistant-thinking-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .thinking-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thinking-bubble {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(22, 27, 44, 0.4);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 10px 16px;
        }

        .thinking-dots {
          display: flex;
          gap: 4px;
        }

        .thinking-dots .dot {
          width: 6px;
          height: 6px;
          background: var(--accent-primary);
          border-radius: 50%;
          animation: dotPulse 1.4s infinite ease-in-out both;
        }

        .thinking-dots .dot:nth-child(1) { animation-delay: -0.32s; }
        .thinking-dots .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        .thinking-text {
          font-size: 13px;
          color: var(--text-muted);
        }

        /* Error Banner */
        .chat-error-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          padding: 10px 16px;
          margin-bottom: 20px;
        }

        .error-text-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fca5a5;
          font-size: 13px;
        }

        .retry-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #ffffff;
          padding: 5px 12px;
          border-radius: var(--radius-xs);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .retry-btn:hover {
          background: rgba(239, 68, 68, 0.35);
        }

        .text-orange { color: var(--accent-primary); }
        .text-red { color: #ef4444; }
      `}</style>
    </div>
  );
};
