import React, { useState } from 'react';
import {
  Play,
  Copy,
  Check,
  PenTool,
  Sparkles,
  RefreshCw,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { ChatMessage as ChatMessageType, Citation } from '../../types';
import { useApp } from '../../context/AppContext';
import { renderMarkdownBlocks } from '../../utils/markdownRenderer';

interface Props {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<Props> = ({ message }) => {
  const {
    setCurrentPage,
    setActiveContextualTab,
    setIsRightPanelOpen,
    setActiveEssay,
    activeEssay,
    showToast,
  } = useApp();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    showToast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCitationClick = (_citation: Citation) => {
    setActiveContextualTab('transcript');
    setIsRightPanelOpen(true);
    showToast('Opened transcript reference in right panel', 'info');
  };

  const handleActionClick = (actionType: string) => {
    if (actionType === 'write-essay') {
      setActiveEssay((prev) => ({
        ...prev,
        topic: 'Product-market fit for early-stage startups',
        title: 'How Early-Stage Startups Can Find Product-Market Fit',
      }));
      setCurrentPage('writing');
      showToast('Loaded Ship 30 for 30 Writing Studio');
    } else if (actionType === 'create-artifact') {
      setCurrentPage('artifacts');
      showToast('Opened Artifact Builder');
    } else if (actionType === 'more-examples') {
      setActiveContextualTab('transcript');
      setIsRightPanelOpen(true);
      showToast('Showing additional episode excerpts');
    }
  };

  if (message.role === 'user') {
    return (
      <div className="message-row user-row animate-fade-in">
        <div className="user-avatar-badge">AR</div>
        <div className="user-bubble-wrapper">
          <div className="user-bubble-content">{message.content}</div>
          <span className="message-timestamp">{message.timestamp}</span>
        </div>

        <style>{`
          .user-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 24px;
            padding-left: 20px;
          }

          .user-avatar-badge {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #0284c7;
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .user-bubble-wrapper {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            max-width: 80%;
          }

          .user-bubble-content {
            background-color: #1e2538;
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #ffffff;
            padding: 12px 18px;
            border-radius: var(--radius-lg);
            font-size: 14.5px;
            line-height: 1.5;
            box-shadow: var(--shadow-sm);
          }

          .message-timestamp {
            font-size: 11px;
            color: var(--text-muted);
            margin-top: 6px;
            margin-left: 4px;
          }
        `}</style>
      </div>
    );
  }

  // Assistant Message Layout
  return (
    <div className="message-row assistant-row animate-fade-in">
      <div className="assistant-logo-avatar">
        <svg viewBox="0 0 32 32" className="assistant-svg">
          <defs>
            <linearGradient id="assistGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9A3D" />
              <stop offset="50%" stopColor="#FF5722" />
              <stop offset="100%" stopColor="#9C27B0" />
            </linearGradient>
          </defs>
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="url(#assistGrad)"
            strokeWidth="3.5"
            strokeDasharray="52 24"
            strokeLinecap="round"
            transform="rotate(-40 16 16)"
          />
          <circle cx="16" cy="16" r="5" fill="#FF7336" />
        </svg>
      </div>

      <div className="assistant-content-body">
        {/* Render text with formatting */}
        <div className="assistant-text-markdown">
          {renderMarkdownBlocks(message.content)}
        </div>

        {/* Source Citation Pills / Cards */}
        {message.citations && message.citations.length > 0 && (
          <div className="citations-tray">
            {message.citations.slice(0, 2).map((cit) => (
              <button
                key={cit.id}
                className="citation-card-pill"
                onClick={() => handleCitationClick(cit)}
                title="Click to view full transcript & audio excerpt"
              >
                <div className="citation-play-circle">
                  <Play size={11} fill="currentColor" />
                </div>
                <div className="citation-meta-text">
                  <span className="citation-podcast-name">Lenny's Podcast</span>
                  <span className="citation-ep-title">
                    Ep. {cit.episodeNumber} - {cit.episodeTitle}
                  </span>
                  <span className="citation-timestamp">
                    {cit.timestampStart} - {cit.timestampEnd}
                  </span>
                </div>
              </button>
            ))}

            {message.citations.length > 2 && (
              <button
                className="citation-more-pill"
                onClick={() => {
                  setActiveContextualTab('transcript');
                  setIsRightPanelOpen(true);
                }}
                title="View all source references"
              >
                <span>+{message.citations.length - 2} sources</span>
              </button>
            )}
          </div>
        )}

        {/* Suggested Action Chips */}
        {message.suggestedActions && (
          <div className="suggested-actions-tray">
            {message.suggestedActions.map((action) => (
              <button
                key={action.id}
                className="suggested-action-btn"
                onClick={() => handleActionClick(action.action)}
              >
                {action.icon === 'pen' && <PenTool size={13} />}
                {action.icon === 'sparkles' && <Sparkles size={13} />}
                {action.icon === 'refresh' && <RefreshCw size={13} />}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Footer toolbar */}
        <div className="message-toolbar">
          <div className="timestamp-group">
            <span className="message-timestamp">{message.timestamp}</span>
            {message.isDemo && (
              <span className="demo-indicator-pill">Sample Grounding Excerpt</span>
            )}
          </div>
          <div className="toolbar-actions">
            <button
              className="toolbar-btn"
              onClick={handleCopy}
              title="Copy answer"
            >
              {copied ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              className="toolbar-btn"
              onClick={() => {
                setActiveContextualTab('artifact');
                setIsRightPanelOpen(true);
                showToast('Viewing connected artifact');
              }}
              title="Open in Artifact Canvas"
            >
              <ExternalLink size={13} />
              <span>Canvas</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .assistant-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 28px;
        }

        .assistant-logo-avatar {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          filter: drop-shadow(0 0 8px rgba(255, 115, 54, 0.4));
        }

        .assistant-svg {
          width: 100%;
          height: 100%;
        }

        .assistant-content-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: rgba(22, 27, 44, 0.4);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: 18px 20px;
        }

        .assistant-text-markdown {
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--text-primary);
        }

        .narrative-paragraph {
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .insights-heading {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #ffffff;
          margin: 14px 0 10px 0;
        }

        .numbered-insight-item {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .insight-point {
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          border-left: 3px solid var(--accent-primary);
        }

        .point-number {
          font-weight: 700;
          color: var(--accent-primary);
          margin-right: 6px;
        }

        .point-title {
          font-weight: 700;
          color: #ffffff;
        }

        .point-body {
          font-size: 13.5px;
          color: var(--text-secondary);
          margin-top: 4px;
          line-height: 1.5;
        }

        .point-subtext {
          font-size: 13.5px;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .citations-tray {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }

        .citation-card-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          text-align: left;
          transition: all var(--transition-fast);
        }

        .citation-card-pill:hover {
          background: var(--bg-surface-hover);
          border-color: var(--accent-primary);
          transform: translateY(-1px);
        }

        .citation-play-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .citation-meta-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }

        .citation-podcast-name {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .citation-ep-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
        }

        .citation-timestamp {
          font-size: 11px;
          color: var(--accent-secondary);
          font-family: var(--font-mono);
        }

        .citation-more-pill {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .citation-more-pill:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
        }

        .suggested-actions-tray {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 6px;
        }

        .suggested-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          padding: 6px 14px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .suggested-action-btn:hover {
          color: #ffffff;
          border-color: var(--accent-primary);
          background: var(--bg-surface-2);
        }

        .message-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 11.5px;
        }

        .timestamp-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .demo-indicator-pill {
          font-size: 10px;
          font-weight: 600;
          color: var(--accent-primary);
          background: rgba(255, 115, 54, 0.1);
          border: 1px solid rgba(255, 115, 54, 0.25);
          padding: 1px 6px;
          border-radius: var(--radius-xs);
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toolbar-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 4px;
          color: var(--text-muted);
          font-size: 11.5px;
        }

        .toolbar-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .text-emerald {
          color: var(--accent-emerald);
        }
      `}</style>
    </div>
  );
};
