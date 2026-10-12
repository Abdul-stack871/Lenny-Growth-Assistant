import React from 'react';
import {
  MessageSquare,
  Bookmark,
  Layers,
  Settings,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from './CommandPalette';
import { SwitchModelModal } from './SwitchModelModal';
import { Toast } from './Toast';

// Pages
import { HomeView } from '../home/HomeView';
import { ChatWorkspace } from '../chat/ChatWorkspace';
import { WritingStudio } from '../writing/WritingStudio';
import { ArtifactBuilder } from '../artifacts/ArtifactBuilder';
import { LibraryView } from '../library/LibraryView';
import { InsightsView } from '../insights/InsightsView';
import { PlaygroundView } from '../playground/PlaygroundView';
import { SettingsView } from '../settings/SettingsView';

export const AppShell: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();

  return (
    <div className="app-shell-root">
      {/* Desktop Persistent Sidebar */}
      <div className="desktop-sidebar-pane">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-close-row">
              <span className="drawer-title">Navigation</span>
              <button
                className="drawer-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="main-workspace-frame">
        <TopBar />

        <main className="active-page-viewport" role="main">
          {currentPage === 'home' && <HomeView />}
          {currentPage === 'chat' && <ChatWorkspace />}
          {currentPage === 'writing' && <WritingStudio />}
          {currentPage === 'artifacts' && <ArtifactBuilder />}
          {currentPage === 'library' && <LibraryView />}
          {currentPage === 'insights' && <InsightsView />}
          {currentPage === 'playground' && <PlaygroundView />}
          {currentPage === 'settings' && <SettingsView />}
        </main>

        {/* Mobile Bottom Navigation Bar matching screenshot 5 */}
        <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
          <button
            className={`bottom-nav-item ${currentPage === 'chat' ? 'active' : ''}`}
            onClick={() => setCurrentPage('chat')}
          >
            <MessageSquare size={18} />
            <span>Chat</span>
          </button>
          <button
            className={`bottom-nav-item ${currentPage === 'library' ? 'active' : ''}`}
            onClick={() => setCurrentPage('library')}
          >
            <Bookmark size={18} />
            <span>Library</span>
          </button>
          <button
            className={`bottom-nav-item ${currentPage === 'artifacts' ? 'active' : ''}`}
            onClick={() => setCurrentPage('artifacts')}
          >
            <Layers size={18} />
            <span>Artifacts</span>
          </button>
          <button
            className={`bottom-nav-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentPage('settings')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Global Interactive Modals */}
      <CommandPalette />
      <SwitchModelModal />
      <Toast />

      <style>{`
        .app-shell-root {
          width: 100vw;
          height: 100vh;
          display: flex;
          overflow: hidden;
          background-color: var(--bg-app);
          position: relative;
        }

        .desktop-sidebar-pane {
          height: 100%;
          display: block;
        }

        .main-workspace-frame {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          position: relative;
        }

        .active-page-viewport {
          flex: 1;
          height: calc(100% - var(--topbar-height));
          overflow: hidden;
          position: relative;
        }

        /* Mobile Drawer */
        .mobile-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: var(--z-modal);
          display: flex;
        }

        .mobile-drawer-content {
          width: 280px;
          height: 100%;
          background: var(--bg-sidebar);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
        }

        .drawer-close-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .drawer-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .drawer-close-btn {
          color: var(--text-muted);
          padding: 4px;
        }

        .drawer-close-btn:hover {
          color: #ffffff;
        }

        /* Mobile Bottom Nav */
        .mobile-bottom-nav {
          display: none;
          height: 56px;
          background: var(--bg-surface-1);
          border-top: 1px solid var(--border-subtle);
          justify-content: space-around;
          align-items: center;
          padding: 0 10px;
          z-index: var(--z-topbar);
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--text-muted);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .bottom-nav-item.active {
          color: var(--accent-primary);
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .desktop-sidebar-pane {
            display: none;
          }

          .mobile-bottom-nav {
            display: flex;
          }

          .active-page-viewport {
            height: calc(100% - var(--topbar-height) - 56px);
          }
        }
      `}</style>
    </div>
  );
};
