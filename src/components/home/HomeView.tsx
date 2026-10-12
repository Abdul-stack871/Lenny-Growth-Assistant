import React, { useState } from 'react';
import {
  MessageSquare,
  PenTool,
  Layers,
  ArrowRight,
  Database,
  Sparkles,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Compass,
  Play,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HomeView: React.FC = () => {
  const { setCurrentPage, createNewConversation, showToast } = useApp();
  const [viewMode, setViewMode] = useState<'workspace' | 'public'>('workspace');

  return (
    <div className="home-container">
      {/* View Mode Toggle Header */}
      <div className="home-top-switch-bar">
        <div className="switch-pill">
          <button
            className={`switch-btn ${viewMode === 'workspace' ? 'active' : ''}`}
            onClick={() => setViewMode('workspace')}
          >
            Workspace Dashboard
          </button>
          <button
            className={`switch-btn ${viewMode === 'public' ? 'active' : ''}`}
            onClick={() => setViewMode('public')}
          >
            Public Product Landing
          </button>
        </div>
        <span className="switch-hint">
          {viewMode === 'workspace'
            ? 'Internal operational workspace for founders & PMs'
            : 'Public overview showcase from reference screenshot'}
        </span>
      </div>

      {viewMode === 'workspace' ? (
        /* ================= WORKSPACE DASHBOARD VIEW ================= */
        <div className="workspace-hero-grid animate-fade-in">
          {/* Main Editorial Hero Card with Window/Sunset Visual */}
          <div className="editorial-hero-card">
            <img
              src="/assets/editorial_desk_sunset.jpg"
              alt="Editorial Study Desk with Sunset Mountains"
              className="editorial-hero-bg-img"
            />
            <div className="editorial-hero-glass-overlay">
              <div className="hero-text-content">
                <span className="editorial-eyebrow">THE LENNY</span>
                <h1 className="editorial-headline font-serif">Growth Assistant</h1>
                <p className="editorial-description">
                  Turn Lenny's insights into answers, essays and powerful artifacts — all in one workspace.
                </p>

                <div className="editorial-quote-box">
                  <p className="quote-text">
                    "Better questions build better products."
                  </p>
                  <span className="quote-author">— Lenny Rachitsky</span>
                </div>
              </div>

              {/* Bottom Knowledge Base Pill */}
              <div
                className="knowledge-base-pill-card"
                onClick={() => {
                  setCurrentPage('insights');
                  showToast('Opened Verified Transcript Knowledge Base', 'info');
                }}
                style={{ cursor: 'pointer' }}
                title="Explore Grounded Transcript Knowledge Base"
              >
                <div className="kb-icon-square">
                  <Database size={20} />
                </div>
                <div className="kb-meta">
                  <div className="kb-title-row">
                    <span className="kb-title">Knowledge Base</span>
                    <span className="kb-tag">Verified Archive</span>
                  </div>
                  <span className="kb-name">Lenny's Podcast Transcripts</span>
                  <span className="kb-count">7 Landmark Milestone Episodes • Grounded RAG Index</span>
                </div>
                <ArrowRight size={16} className="kb-arrow" />
              </div>
            </div>
          </div>

          {/* Quick Action Cards Grid */}
          <div className="quick-actions-sidebar-panel">
            <div className="panel-title-badge">
              <Sparkles size={13} />
              <span>START A WORKFLOW</span>
            </div>

            <div className="action-cards-column">
              <div
                className="workflow-action-card"
                onClick={() => {
                  createNewConversation();
                }}
              >
                <div className="action-icon-circle blue">
                  <MessageSquare size={18} />
                </div>
                <div className="action-card-text">
                  <h3>Start a Conversation</h3>
                  <p>Ask complex product, growth, or pricing questions grounded in curated transcript excerpts.</p>
                </div>
                <ArrowRight size={16} className="action-card-arrow" />
              </div>

              <div
                className="workflow-action-card"
                onClick={() => {
                  setCurrentPage('writing');
                  showToast('Opened Writing Studio');
                }}
              >
                <div className="action-icon-circle orange">
                  <PenTool size={18} />
                </div>
                <div className="action-card-text">
                  <h3>Create a 30 for 30 Essay</h3>
                  <p>Generate a structured ~1,250-word essay with referenced interview citations.</p>
                </div>
                <ArrowRight size={16} className="action-card-arrow" />
              </div>

              <div
                className="workflow-action-card"
                onClick={() => {
                  setCurrentPage('artifacts');
                  showToast('Opened Artifact Builder');
                }}
              >
                <div className="action-icon-circle purple">
                  <Layers size={18} />
                </div>
                <div className="action-card-text">
                  <h3>Build an Artifact</h3>
                  <p>Render interactive HTML growth dashboards, strategy canvases, and roadmaps.</p>
                </div>
                <ArrowRight size={16} className="action-card-arrow" />
              </div>
            </div>

            {/* Research Entry Points */}
            <div className="entry-points-section">
              <div className="entry-title">Featured Research Themes</div>
              <div className="theme-pills-list">
                <button
                  className="theme-pill"
                  onClick={() => {
                    setCurrentPage('insights');
                  }}
                >
                  <TrendingUp size={13} />
                  <span>Product-Market Fit Benchmarks</span>
                </button>
                <button
                  className="theme-pill"
                  onClick={() => {
                    setCurrentPage('insights');
                  }}
                >
                  <Compass size={13} />
                  <span>Compounding Growth Loops</span>
                </button>
                <button
                  className="theme-pill"
                  onClick={() => {
                    setCurrentPage('insights');
                  }}
                >
                  <BookOpen size={13} />
                  <span>The Sean Ellis 40% Test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= PUBLIC PRODUCT LANDING VIEW ================= */
        <div className="public-landing-container animate-fade-in">
          {/* Public Hero */}
          <div className="public-hero-section">
            <h1 className="public-hero-title">
              Turn Conversations Into <span className="gradient-text">Real Growth</span>
            </h1>
            <p className="public-hero-subtitle">
              Ask better product and growth questions. Get grounded answers from Lenny's Podcast transcripts,
              create high-quality content, and generate useful artifacts — all in one place.
            </p>

            <div className="public-cta-row">
              <button
                className="public-cta-primary"
                onClick={() => {
                  setCurrentPage('chat');
                  showToast('Welcome to the workspace');
                }}
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </button>
              <button
                className="public-cta-secondary"
                onClick={() => showToast('Playing interactive product demo', 'info')}
              >
                <Play size={14} fill="currentColor" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* 4 Feature Cards matching screenshot */}
            <div className="public-features-grid">
              <div className="public-feature-card">
                <div className="feat-icon-box orange">
                  <MessageSquare size={20} />
                </div>
                <h3>Grounded Answers</h3>
                <p>Answers synthesized from podcast transcripts with referenced timestamp excerpts.</p>
              </div>

              <div className="public-feature-card">
                <div className="feat-icon-box amber">
                  <PenTool size={20} />
                </div>
                <h3>Ship 30 for 30</h3>
                <p>Dedicated essay skill generating 1,250-word editorial articles with compelling hooks.</p>
              </div>

              <div className="public-feature-card">
                <div className="feat-icon-box purple">
                  <Layers size={20} />
                </div>
                <h3>Create Artifacts</h3>
                <p>Sandboxed Markdown, interactive HTML dashboards, and strategy canvases.</p>
              </div>

              <div className="public-feature-card">
                <div className="feat-icon-box blue">
                  <Cpu size={20} />
                </div>
                <h3>Multiple Models</h3>
                <p>Full flexibility with private local Ollama inference or frontier cloud providers.</p>
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="public-metrics-bar">
              <div className="metric-box">
                <div className="metric-value">Curated</div>
                <div className="metric-label">Sample episodes</div>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <div className="metric-value">Demo</div>
                <div className="metric-label">Knowledge index</div>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <div className="metric-value">4</div>
                <div className="metric-label">AI skills</div>
              </div>
              <div className="metric-divider" />
              <div className="metric-box">
                <div className="metric-value">100%</div>
                <div className="metric-label">Sandboxed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .home-container {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          background: var(--bg-workspace);
          display: flex;
          flex-direction: column;
        }

        .home-top-switch-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(11, 13, 22, 0.4);
        }

        .switch-pill {
          display: flex;
          align-items: center;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          padding: 3px;
        }

        .switch-btn {
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .switch-btn.active {
          background: var(--bg-surface-3);
          color: #ffffff;
          font-weight: 600;
        }

        .switch-hint {
          font-size: 12px;
          color: var(--text-muted);
        }

        /* Workspace Grid */
        .workspace-hero-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
          padding: 28px;
          max-width: 1360px;
          margin: 0 auto;
          width: 100%;
          flex: 1;
        }

        .editorial-hero-card {
          position: relative;
          border-radius: var(--radius-2xl);
          overflow: hidden;
          min-height: 520px;
          border: 1px solid var(--border-default);
          box-shadow: var(--shadow-xl);
          display: flex;
        }

        .editorial-hero-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.92) contrast(1.05);
        }

        .editorial-hero-glass-overlay {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(8, 10, 16, 0.82) 0%, rgba(13, 16, 26, 0.6) 50%, rgba(8, 10, 16, 0.88) 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 36px 40px;
        }

        .editorial-eyebrow {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #ffffff;
          text-transform: uppercase;
        }

        .editorial-headline {
          font-size: 44px;
          font-weight: 600;
          line-height: 1.1;
          color: #ff9e43;
          margin: 4px 0 16px 0;
          background: linear-gradient(135deg, #ffffff 0%, #ff9e43 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .editorial-description {
          font-size: 15px;
          line-height: 1.6;
          color: #d1d5e5;
          max-width: 440px;
        }

        .editorial-quote-box {
          margin-top: 24px;
          background: rgba(18, 22, 36, 0.7);
          backdrop-filter: blur(8px);
          border-left: 3px solid var(--accent-primary);
          padding: 12px 18px;
          border-radius: var(--radius-sm);
          max-width: 400px;
        }

        .quote-text {
          font-size: 13.5px;
          font-style: italic;
          color: #ffffff;
        }

        .quote-author {
          font-size: 11.5px;
          color: var(--accent-secondary);
          margin-top: 4px;
          display: block;
        }

        .knowledge-base-pill-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(18, 22, 36, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-xl);
          padding: 14px 20px;
          width: fit-content;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
        }

        .kb-icon-square {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kb-meta {
          display: flex;
          flex-direction: column;
        }

        .kb-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .kb-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .kb-tag {
          font-size: 9.5px;
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          padding: 1px 5px;
          border-radius: 3px;
          font-weight: 700;
        }

        .kb-name {
          font-size: 13.5px;
          font-weight: 600;
          color: #ffffff;
        }

        .kb-count {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .kb-arrow {
          color: var(--text-muted);
          margin-left: 10px;
        }

        /* Action Column */
        .quick-actions-sidebar-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .panel-title-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent-secondary);
        }

        .action-cards-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .workflow-action-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: 18px 20px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .workflow-action-card:hover {
          background: var(--bg-surface-hover);
          border-color: var(--border-hover);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .action-icon-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .action-icon-circle.blue {
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
        }

        .action-icon-circle.orange {
          background: rgba(255, 115, 54, 0.12);
          color: #ff7336;
        }

        .action-icon-circle.purple {
          background: rgba(168, 85, 247, 0.12);
          color: #a855f7;
        }

        .action-card-text {
          flex: 1;
        }

        .action-card-text h3 {
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
        }

        .action-card-text p {
          font-size: 12.5px;
          color: var(--text-secondary);
          margin-top: 3px;
          line-height: 1.4;
        }

        .action-card-arrow {
          color: var(--text-muted);
          transition: transform var(--transition-fast);
        }

        .workflow-action-card:hover .action-card-arrow {
          color: #ffffff;
          transform: translateX(3px);
        }

        .entry-points-section {
          margin-top: 10px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: 18px;
        }

        .entry-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .theme-pills-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .theme-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          font-size: 13px;
          color: var(--text-secondary);
          background: var(--bg-surface-2);
          text-align: left;
          transition: all var(--transition-fast);
        }

        .theme-pill:hover {
          color: #ffffff;
          background: var(--bg-surface-hover);
        }

        /* Public Landing Styles */
        .public-landing-container {
          max-width: 1080px;
          margin: 0 auto;
          padding: 40px 24px 60px 24px;
          text-align: center;
        }

        .public-hero-title {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: #ffffff;
          margin-bottom: 16px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ff9e43 0%, #ec4899 50%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .public-hero-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          max-width: 680px;
          margin: 0 auto 30px auto;
          line-height: 1.6;
        }

        .public-cta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 48px;
        }

        .public-cta-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #ff7336 100%);
          color: #ffffff;
          padding: 12px 28px;
          border-radius: var(--radius-full);
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 4px 20px rgba(255, 115, 54, 0.4);
          transition: all var(--transition-fast);
        }

        .public-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(255, 115, 54, 0.55);
        }

        .public-cta-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          color: var(--text-primary);
          padding: 12px 24px;
          border-radius: var(--radius-full);
          font-size: 14px;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .public-cta-secondary:hover {
          background: var(--bg-surface-3);
          border-color: var(--border-hover);
        }

        .public-features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 48px;
        }

        .public-feature-card {
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: 24px 20px;
          text-align: left;
          transition: all var(--transition-fast);
        }

        .public-feature-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-3px);
        }

        .feat-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .feat-icon-box.orange { background: rgba(255, 115, 54, 0.15); color: #ff7336; }
        .feat-icon-box.amber { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .feat-icon-box.purple { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
        .feat-icon-box.blue { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }

        .public-feature-card h3 {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .public-feature-card p {
          font-size: 12.5px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .public-metrics-bar {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          padding: 24px;
        }

        .metric-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .metric-value {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
        }

        .metric-label {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .metric-divider {
          width: 1px;
          height: 36px;
          background: var(--border-subtle);
        }

        @media (max-width: 900px) {
          .workspace-hero-grid {
            grid-template-columns: 1fr;
          }
          .public-features-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};
