import React from 'react';
import {
  Home,
  MessageSquare,
  PenTool,
  Layers,
  Bookmark,
  Lightbulb,
  Terminal,
  Settings,
  Search,
  Cpu,
  Plus,
  Compass,
  Pin,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Page } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    conversations,
    activeConversationId,
    setActiveConversationId,
    createNewConversation,
    selectedModel,
    ollamaStatus,
    setIsSwitchModelModalOpen,
    setIsCommandPaletteOpen,
    setIsMobileMenuOpen,
  } = useApp();

  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare size={18} /> },
    { id: 'writing', label: 'Writing Studio', icon: <PenTool size={18} /> },
    { id: 'artifacts', label: 'Artifacts', icon: <Layers size={18} /> },
    { id: 'library', label: 'Library', icon: <Bookmark size={18} /> },
    { id: 'insights', label: 'Insights', icon: <Lightbulb size={18} /> },
    { id: 'playground', label: 'Playground', icon: <Terminal size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const handleSelectChat = (id: string) => {
    setActiveConversationId(id);
    setCurrentPage('chat');
    setIsMobileMenuOpen(false);
  };

  return (
    <aside className="sidebar-container" aria-label="Main Navigation">
      {/* Brand Header */}
      <div className="sidebar-header">
        <button
          className="brand-logo-btn"
          onClick={() => handleNavClick('home')}
          title="The Lenny Growth Assistant"
        >
          <div className="brand-spiral-icon">
            <svg viewBox="0 0 32 32" className="brand-svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
                stroke="url(#logoGrad)"
                strokeWidth="3.5"
                strokeDasharray="52 24"
                strokeLinecap="round"
                transform="rotate(-40 16 16)"
              />
              <circle cx="16" cy="16" r="5" fill="#FF7336" />
            </svg>
          </div>
          <div className="brand-text-block">
            <span className="brand-name">Lenny</span>
          </div>
        </button>
      </div>

      {/* Global Search Pill (Ctrl+K) */}
      <div className="sidebar-search-box">
        <button
          className="search-trigger-btn"
          onClick={() => setIsCommandPaletteOpen(true)}
          title="Search anything (Ctrl+K)"
        >
          <Search size={15} className="search-icon" />
          <span className="search-placeholder">Search...</span>
          <span className="search-kbd">Ctrl K</span>
        </button>
      </div>

      {/* Primary Navigation Links */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {isActive && <div className="active-glow-pill" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Recent Chats Section */}
      <div className="sidebar-recent-section">
        <div className="recent-header">
          <span className="recent-title">Recent Chats</span>
          <button
            className="new-chat-mini-btn"
            onClick={createNewConversation}
            title="Start new conversation"
          >
            <Plus size={14} />
          </button>
        </div>
        <ul className="recent-list">
          {[...conversations]
            .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
            .slice(0, 6)
            .map((chat) => {
              const isChatActive = currentPage === 'chat' && activeConversationId === chat.id;
              return (
                <li key={chat.id} className="recent-item">
                  <button
                    className={`recent-link ${isChatActive ? 'active' : ''} ${chat.pinned ? 'pinned' : ''}`}
                    onClick={() => handleSelectChat(chat.id)}
                    title={chat.pinned ? `Pinned: ${chat.title}` : chat.title}
                  >
                    <span className="recent-dot">{chat.pinned ? <Pin size={11} className="pin-icon" /> : '#'}</span>
                    <span className="recent-text">{chat.title}</span>
                  </button>
                </li>
              );
            })}
          <li className="recent-item">
            <button
              className="recent-link more-chats-btn"
              onClick={() => handleNavClick('library')}
            >
              <Compass size={13} style={{ marginRight: 6, opacity: 0.7 }} />
              <span className="recent-text">More in Library...</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Bottom Model Card Widget */}
      <div className="sidebar-bottom-card">
        <div className="model-widget-card">
          <div className="model-widget-header">
            <div className="model-icon-circle">
              <Cpu size={16} />
            </div>
            <div className="model-meta">
              <span className="model-label">Model</span>
              <span className="model-name" title={selectedModel.name}>
                {selectedModel.name}
              </span>
            </div>
          </div>
          <div className="model-status-row">
            <div className={`status-indicator ${selectedModel.isLocal ? (ollamaStatus === 'connected' ? 'online' : 'offline') : 'cloud'}`}>
              <span className={`pulse-dot ${selectedModel.isLocal ? (ollamaStatus === 'connected' ? 'online' : 'offline') : 'cloud'}`} />
              <span className="status-text">
                {selectedModel.isLocal
                  ? ollamaStatus === 'connected'
                    ? 'Ollama Online'
                    : ollamaStatus === 'checking'
                    ? 'Checking Ollama...'
                    : 'Ollama Offline (Demo)'
                  : 'Backend .env Required'}
              </span>
            </div>
            <button
              className="switch-model-btn"
              onClick={() => setIsSwitchModelModalOpen(true)}
              title="Change active LLM provider or model"
            >
              Switch Model
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar-container {
          width: var(--sidebar-width);
          min-width: var(--sidebar-width);
          height: 100%;
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          user-select: none;
          z-index: var(--z-sidebar);
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-header {
          padding: 18px 18px 12px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-logo-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
          padding: 4px 6px;
          border-radius: var(--radius-md);
        }

        .brand-logo-btn:hover {
          opacity: 0.92;
        }

        .brand-spiral-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 8px rgba(255, 115, 54, 0.4));
        }

        .brand-svg {
          width: 100%;
          height: 100%;
        }

        .brand-name {
          font-size: 19px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .sidebar-search-box {
          padding: 0 16px 12px 16px;
        }

        .search-trigger-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          font-size: 13px;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .search-trigger-btn:hover {
          border-color: var(--border-hover);
          background-color: var(--bg-surface-2);
          color: var(--text-secondary);
        }

        .search-icon {
          color: var(--text-muted);
        }

        .search-placeholder {
          flex: 1;
          text-align: left;
        }

        .search-kbd {
          font-size: 11px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 1px 6px;
          color: var(--text-secondary);
          font-family: var(--font-mono);
        }

        .sidebar-nav {
          padding: 4px 12px;
          flex-shrink: 0;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-link {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 12px;
          border-radius: var(--radius-md);
          font-size: 13.5px;
          font-weight: 500;
          color: var(--text-secondary);
          position: relative;
          transition: all var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--text-primary);
          background-color: var(--bg-surface-hover);
        }

        .nav-link.active {
          color: #ffffff;
          background: linear-gradient(90deg, rgba(255, 115, 54, 0.18) 0%, rgba(35, 43, 69, 0.6) 100%);
          font-weight: 600;
          border: 1px solid rgba(255, 115, 54, 0.25);
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
        }

        .nav-link.active .nav-icon {
          color: var(--accent-primary);
        }

        .active-glow-pill {
          position: absolute;
          left: -4px;
          width: 4px;
          height: 18px;
          background-color: var(--accent-primary);
          border-radius: 4px;
          box-shadow: 0 0 10px var(--accent-primary);
        }

        .sidebar-recent-section {
          padding: 18px 14px 10px 14px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .recent-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4px 8px 4px;
        }

        .recent-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
        }

        .new-chat-mini-btn {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.04);
        }

        .new-chat-mini-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .recent-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .recent-link {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 7px 10px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          color: var(--text-muted);
          text-align: left;
          transition: all var(--transition-fast);
        }

        .recent-link:hover {
          color: var(--text-primary);
          background-color: var(--bg-surface-hover);
        }

        .recent-link.active {
          color: #ffffff;
          background-color: var(--bg-surface-active);
          font-weight: 500;
        }

        .recent-dot {
          margin-right: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          opacity: 0.5;
        }

        .recent-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .more-chats-btn {
          color: var(--text-muted);
          font-size: 12px;
          margin-top: 2px;
        }

        .sidebar-bottom-card {
          padding: 14px;
          border-top: 1px solid var(--border-subtle);
          background: rgba(11, 13, 22, 0.6);
        }

        .model-widget-card {
          background-color: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 12px;
        }

        .model-widget-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .model-icon-circle {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          background: rgba(255, 115, 54, 0.12);
          color: var(--accent-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .model-meta {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .model-label {
          font-size: 10.5px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .model-name {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .model-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11.5px;
          padding-top: 6px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--accent-emerald);
          box-shadow: 0 0 8px var(--accent-emerald);
        }

        .switch-model-btn {
          color: var(--accent-secondary);
          font-weight: 500;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .switch-model-btn:hover {
          color: #ffffff;
          background: rgba(255, 115, 54, 0.15);
        }
      `}</style>
    </aside>
  );
};
