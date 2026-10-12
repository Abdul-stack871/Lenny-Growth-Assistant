import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  FileText,
  Layers,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopBar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    createNewConversation,
    selectedModel,
    setIsSwitchModelModalOpen,
    setIsMobileMenuOpen,
    setActiveContextualTab,
    setIsRightPanelOpen,
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'chat' | 'sources' | 'artifacts') => {
    if (tab === 'chat') {
      setCurrentPage('chat');
    } else if (tab === 'sources') {
      setCurrentPage('chat');
      setActiveContextualTab('transcript');
      setIsRightPanelOpen(true);
    } else if (tab === 'artifacts') {
      setCurrentPage('chat');
      setActiveContextualTab('artifact');
      setIsRightPanelOpen(true);
    }
  };

  return (
    <header className="topbar-container" aria-label="Top Bar">
      {/* Mobile Hamburger Menu */}
      <button
        className="mobile-menu-trigger"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open Navigation Menu"
      >
        <Menu size={20} />
      </button>

      {/* Left Navigation Pills */}
      <div className="topbar-nav-pills">
        <button
          className="new-chat-btn"
          onClick={createNewConversation}
          title="Start fresh conversation"
        >
          <Plus size={14} />
          <span>New Chat</span>
        </button>

        <div className="view-mode-tabs">
          <button
            className={`view-tab-btn ${currentPage === 'chat' ? 'active' : ''}`}
            onClick={() => handleTabClick('chat')}
          >
            <MessageSquare size={14} />
            <span>Chat</span>
          </button>
          <button
            className="view-tab-btn"
            onClick={() => handleTabClick('sources')}
            title="View grounded podcast transcripts"
          >
            <FileText size={14} />
            <span>Sources</span>
          </button>
          <button
            className="view-tab-btn"
            onClick={() => handleTabClick('artifacts')}
            title="View generated artifacts and essays"
          >
            <Layers size={14} />
            <span>Artifacts</span>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="topbar-right-controls">
        {/* Model Selector Pill */}
        <button
          className="model-pill-btn"
          onClick={() => setIsSwitchModelModalOpen(true)}
          title="Active Model - Click to switch"
        >
          <span className="model-dot" />
          <span className="model-pill-name">{selectedModel.name}</span>
          <ChevronDown size={14} className="model-chevron" />
        </button>



        {/* User Profile Avatar */}
        <div className="user-profile-wrapper">
          <button
            className="user-profile-btn"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            title="User Profile: Abdul Rahman (Student)"
          >
            <div className="user-avatar-circle">AR</div>
            <div className="user-meta-text">
              <span className="user-name">Abdul Rahman</span>
              <span className="user-role">Student</span>
            </div>
            <ChevronDown size={12} className="user-chevron" />
          </button>

          {isProfileMenuOpen && (
            <div className="user-dropdown-card animate-fade-in">
              <div className="dropdown-user-header">
                <div className="avatar-lg">AR</div>
                <div>
                  <div className="name-bold">Abdul Rahman</div>
                  <div className="role-sub">Student • Oogway Labs Fellow</div>
                </div>
              </div>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item-btn"
                onClick={() => {
                  setCurrentPage('settings');
                  setIsProfileMenuOpen(false);
                }}
              >
                Settings & API Keys
              </button>
              <button
                className="dropdown-item-btn"
                onClick={() => {
                  setCurrentPage('library');
                  setIsProfileMenuOpen(false);
                }}
              >
                Saved Library Items
              </button>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item-btn"
                onClick={() => {
                  setCurrentPage('settings');
                  setIsProfileMenuOpen(false);
                }}
              >
                System & Connections Settings
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .topbar-container {
          height: var(--topbar-height);
          min-height: var(--topbar-height);
          width: 100%;
          background-color: var(--bg-workspace);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          z-index: var(--z-topbar);
          user-select: none;
        }

        .mobile-menu-trigger {
          display: none;
          color: var(--text-secondary);
          padding: 8px;
          border-radius: var(--radius-md);
        }

        .topbar-nav-pills {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .new-chat-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #2563eb;
          color: #ffffff;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
          transition: all var(--transition-fast);
        }

        .new-chat-btn:hover {
          background: #1d4ed8;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5);
        }

        .view-mode-tabs {
          display: flex;
          align-items: center;
          background-color: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          padding: 3px 4px;
          gap: 2px;
        }

        .view-tab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .view-tab-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-surface-hover);
        }

        .view-tab-btn.active {
          color: #ffffff;
          background-color: var(--bg-surface-3);
          font-weight: 600;
        }

        .topbar-right-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .model-pill-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          padding: 6px 14px;
          font-size: 12.5px;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .model-pill-btn:hover {
          background-color: var(--bg-surface-2);
          border-color: var(--border-hover);
          color: var(--text-primary);
        }

        .model-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--accent-emerald);
          box-shadow: 0 0 6px var(--accent-emerald);
        }

        .model-pill-name {
          font-weight: 500;
        }

        .model-chevron {
          color: var(--text-muted);
        }

        .upgrade-cloud-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(90deg, #ec4899 0%, #ff7336 100%);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 12.5px;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(255, 115, 54, 0.3);
          transition: all var(--transition-fast);
        }

        .upgrade-cloud-btn:hover {
          opacity: 0.92;
          box-shadow: 0 4px 14px rgba(255, 115, 54, 0.45);
        }

        .icon-action-btn {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          background-color: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          position: relative;
          transition: all var(--transition-fast);
        }

        .icon-action-btn:hover {
          color: #ffffff;
          background-color: var(--bg-surface-2);
        }

        .notif-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--accent-primary);
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-profile-wrapper {
          position: relative;
        }

        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 3px 8px 3px 3px;
          border-radius: var(--radius-full);
          background-color: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          transition: all var(--transition-fast);
        }

        .user-profile-btn:hover {
          background-color: var(--bg-surface-2);
          border-color: var(--border-hover);
        }

        .user-avatar-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #0284c7;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-meta-text {
          display: flex;
          flex-direction: column;
          text-align: left;
          line-height: 1.1;
        }

        .user-name {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-role {
          font-size: 10px;
          color: var(--text-muted);
        }

        .user-chevron {
          color: var(--text-muted);
        }

        .user-dropdown-card {
          position: absolute;
          top: 42px;
          right: 0;
          width: 240px;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xl);
          padding: 12px;
          z-index: var(--z-dropdown);
        }

        .dropdown-user-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px;
        }

        .avatar-lg {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #0284c7;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .name-bold {
          font-size: 13.5px;
          font-weight: 600;
        }

        .role-sub {
          font-size: 11px;
          color: var(--text-muted);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 8px 0;
        }

        .dropdown-item-btn {
          width: 100%;
          text-align: left;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .dropdown-item-btn:hover {
          color: #ffffff;
          background-color: var(--bg-surface-hover);
        }

        @media (max-width: 900px) {
          .mobile-menu-trigger {
            display: flex;
          }
          .user-meta-text {
            display: none;
          }
          .view-mode-tabs {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
