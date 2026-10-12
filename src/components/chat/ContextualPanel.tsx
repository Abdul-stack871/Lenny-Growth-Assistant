import React, { useState } from 'react';
import {
  FileText,
  Volume2,
  StickyNote,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  Sparkles,
  ChevronDown,
  X,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TranscriptViewer } from './TranscriptViewer';
import { NotesEditor } from './NotesEditor';
import { renderMarkdownBlocks } from '../../utils/markdownRenderer';

export const ContextualPanel: React.FC = () => {
  const {
    activeContextualTab,
    setActiveContextualTab,
    isRightPanelOpen,
    setIsRightPanelOpen,
    isRightPanelMaximized,
    setIsRightPanelMaximized,
    activeEssay,
    setCurrentPage,
    showToast,
  } = useApp();

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  if (!isRightPanelOpen) {
    return (
      <button
        className="collapsed-panel-trigger"
        onClick={() => setIsRightPanelOpen(true)}
        title="Open Artifact & Sources Panel"
      >
        <BookOpen size={16} />
        <span>Artifact & Sources</span>
        <ArrowUpRight size={14} />
        <style>{`
          .collapsed-panel-trigger {
            position: fixed;
            top: 72px;
            right: 18px;
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--bg-surface-2);
            border: 1px solid var(--border-default);
            padding: 8px 14px;
            border-radius: var(--radius-full);
            color: var(--text-secondary);
            font-size: 12.5px;
            font-weight: 600;
            box-shadow: var(--shadow-md);
            z-index: var(--z-panel);
            transition: all var(--transition-fast);
          }
          .collapsed-panel-trigger:hover {
            color: #ffffff;
            border-color: var(--accent-primary);
            background: var(--bg-surface-3);
          }
        `}</style>
      </button>
    );
  }

  const handleExport = (format: 'markdown' | 'html' | 'copy') => {
    if (format === 'copy') {
      navigator.clipboard.writeText(activeEssay.content);
      showToast('Essay copied to clipboard');
    } else {
      const blob = new Blob([activeEssay.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeEssay.title.toLowerCase().replace(/\s+/g, '-')}.${format === 'markdown' ? 'md' : 'html'}`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(`Exported essay as ${format.toUpperCase()}`);
    }
    setIsExportMenuOpen(false);
  };

  return (
    <aside
      className={`contextual-panel-container ${isRightPanelMaximized ? 'maximized' : ''}`}
      aria-label="Contextual Details & Artifact Canvas"
    >
      {/* Top Header with Tabs & Actions */}
      <div className="panel-header">
        <div className="panel-tabs">
          <button
            className={`panel-tab-btn ${activeContextualTab === 'artifact' ? 'active' : ''}`}
            onClick={() => setActiveContextualTab('artifact')}
          >
            <FileText size={14} />
            <span>Artifact</span>
          </button>
          <button
            className={`panel-tab-btn ${activeContextualTab === 'transcript' ? 'active' : ''}`}
            onClick={() => setActiveContextualTab('transcript')}
          >
            <Volume2 size={14} />
            <span>Transcript</span>
          </button>
          <button
            className={`panel-tab-btn ${activeContextualTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveContextualTab('notes')}
          >
            <StickyNote size={14} />
            <span>Notes</span>
          </button>
        </div>

        <div className="panel-actions">
          {/* Export Dropdown */}
          <div className="export-dropdown-wrapper">
            <button
              className="export-btn"
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
            >
              <span>Export</span>
              <ChevronDown size={13} />
            </button>
            {isExportMenuOpen && (
              <div className="export-menu animate-fade-in">
                <button onClick={() => handleExport('copy')}>Copy to Clipboard</button>
                <button onClick={() => handleExport('markdown')}>Download as Markdown (.md)</button>
                <button onClick={() => handleExport('html')}>Download as HTML (.html)</button>
              </div>
            )}
          </div>

          {/* Maximize / Minimize toggle */}
          <button
            className="panel-icon-btn"
            onClick={() => setIsRightPanelMaximized(!isRightPanelMaximized)}
            title={isRightPanelMaximized ? 'Restore width' : 'Maximize panel'}
          >
            {isRightPanelMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          {/* Close toggle */}
          <button
            className="panel-icon-btn"
            onClick={() => setIsRightPanelOpen(false)}
            title="Collapse panel"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Panel Body Content */}
      <div className="panel-content-body">
        {activeContextualTab === 'transcript' && <TranscriptViewer />}
        {activeContextualTab === 'notes' && <NotesEditor />}

        {activeContextualTab === 'artifact' && (
          <div className="artifact-preview-canvas">
            {/* Meta Pill Tag */}
            <div className="artifact-meta-header">
              <span className="artifact-type-tag">Ship 30 for 30 Essay</span>
              <span className="artifact-word-count">~1,250 words</span>
            </div>

            {/* Display Headline & Subtitle */}
            <h1 className="artifact-main-title font-serif">{activeEssay.title}</h1>
            <p className="artifact-main-subtitle">{activeEssay.subtitle}</p>

            {/* Hero Image Banner with Quote */}
            <div className="artifact-hero-banner">
              <img
                src={activeEssay.heroImageUrl || '/assets/mountain_cliff_editorial.jpg'}
                alt="Editorial mountain landscape"
                className="hero-banner-img"
              />
              <div className="hero-banner-overlay">
                <div className="hero-quote-box">
                  <p className="hero-quote-text">{activeEssay.heroQuote || '"Talk to users. Ship small. Learn fast."'}</p>
                </div>
              </div>
            </div>

            {/* "On this page" TOC Card */}
            <div className="toc-card">
              <div className="toc-title">On this page</div>
              <ol className="toc-list">
                {activeEssay.tableOfContents.map((item, idx) => (
                  <li key={idx} className="toc-item">
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            {/* Structured Essay Body */}
            <div className="essay-rendered-body">
              {activeEssay.content ? (
                renderMarkdownBlocks(activeEssay.content)
              ) : (
                <>
                  <section className="essay-section">
                    <h2 className="section-title font-serif">1. The Hard Truth About Product-Market Fit</h2>
                    <p className="section-paragraph">
                      Product-market fit isn't a single celebratory moment. It's a gradual, rigorous process of
                      deeply understanding your customers, solving a hair-on-fire problem, and creating a
                      repeatable distribution channel. In this essay, we'll explore key lessons from Lenny's
                      conversations with top founders and operators.
                    </p>
                  </section>

                  {/* Quote Callout Card */}
                  {activeEssay.quoteCallout && (
                    <div className="quote-callout-card">
                      <div className="quote-sparkle-icon">
                        <Sparkles size={16} />
                      </div>
                      <div className="quote-callout-text">
                        <p className="quote-italic">
                          "{activeEssay.quoteCallout.quote}"
                        </p>
                        <span className="quote-attribution">
                          — {activeEssay.quoteCallout.author}, {activeEssay.quoteCallout.source}
                        </span>
                      </div>
                    </div>
                  )}

                  <section className="essay-section">
                    <h2 className="section-title font-serif">2. Deep Customer Understanding Precedes Features</h2>
                    <p className="section-paragraph">
                      Lenny emphasizes talking to real customers, not just running surveys. Focus on understanding
                      the actual problems and the current workarounds they use. If people aren't currently paying or
                      suffering with imperfect solutions, the problem may not be painful enough.
                    </p>
                    <p className="section-paragraph">
                      When Peter Reinhardt launched Segment, the breakthrough arrived only after listening to 30
                      developers who had hacked together their own tracking scripts.
                    </p>
                  </section>

                  <section className="essay-section">
                    <h2 className="section-title font-serif">3. Ship Small and Iterate Rapidly</h2>
                    <p className="section-paragraph">
                      Early-stage teams should ship simple solutions, observe real usage, and iterate based on
                      direct customer feedback rather than trying to build a complex product upfront.
                    </p>
                  </section>
                </>
              )}
            </div>

            {/* Writing Studio Bridge button */}
            <div className="open-in-studio-box">
              <button
                className="open-studio-btn"
                onClick={() => setCurrentPage('writing')}
              >
                <span>Edit or Remix in Writing Studio</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .contextual-panel-container {
          width: var(--right-panel-width);
          min-width: 360px;
          height: 100%;
          background: #0b0e17;
          border-left: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          z-index: var(--z-panel);
          transition: width var(--transition-spring);
        }

        .contextual-panel-container.maximized {
          width: 60%;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-surface-1);
        }

        .panel-tabs {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .panel-tab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .panel-tab-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .panel-tab-btn.active {
          color: #ffffff;
          background: var(--bg-surface-2);
          font-weight: 600;
        }

        .panel-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .export-dropdown-wrapper {
          position: relative;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
        }

        .export-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .export-menu {
          position: absolute;
          top: 32px;
          right: 0;
          width: 190px;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 6px;
          z-index: var(--z-dropdown);
        }

        .export-menu button {
          width: 100%;
          text-align: left;
          padding: 8px 10px;
          font-size: 12px;
          color: var(--text-secondary);
          border-radius: var(--radius-xs);
        }

        .export-menu button:hover {
          background: var(--bg-surface-hover);
          color: #ffffff;
        }

        .panel-icon-btn {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .panel-icon-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .panel-content-body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .artifact-preview-canvas {
          padding: 24px 28px;
          background: #0d101b;
          min-height: 100%;
        }

        .artifact-meta-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .artifact-type-tag {
          font-size: 11px;
          font-weight: 700;
          color: #ff9e43;
          background: rgba(255, 115, 54, 0.12);
          border: 1px solid rgba(255, 115, 54, 0.25);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          letter-spacing: 0.04em;
        }

        .artifact-word-count {
          font-size: 11.5px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .artifact-main-title {
          font-size: 24px;
          font-weight: 600;
          line-height: 1.25;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .artifact-main-subtitle {
          font-size: 13.5px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .artifact-hero-banner {
          position: relative;
          width: 100%;
          height: 170px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 22px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(13, 16, 27, 0.2) 0%, rgba(13, 16, 27, 0.85) 100%);
          display: flex;
          align-items: flex-end;
          padding: 16px;
        }

        .hero-quote-box {
          background: rgba(13, 16, 27, 0.7);
          backdrop-filter: blur(4px);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--accent-primary);
        }

        .hero-quote-text {
          font-size: 12.5px;
          font-style: italic;
          color: #f1f3f9;
        }

        .toc-card {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          margin-bottom: 24px;
        }

        .toc-title {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .toc-list {
          padding-left: 20px;
          color: var(--text-secondary);
          font-size: 13px;
          line-height: 1.7;
        }

        .toc-item {
          cursor: pointer;
        }

        .toc-item:hover {
          color: var(--accent-primary);
        }

        .essay-rendered-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
          line-height: 1.65;
        }

        .section-title {
          font-size: 17px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .section-paragraph {
          font-size: 14px;
          color: #c9cedd;
          margin-bottom: 10px;
        }

        .quote-callout-card {
          display: flex;
          gap: 12px;
          background: rgba(255, 115, 54, 0.07);
          border: 1px solid rgba(255, 115, 54, 0.22);
          border-radius: var(--radius-md);
          padding: 16px;
          margin: 10px 0;
        }

        .quote-sparkle-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .quote-italic {
          font-size: 13.5px;
          font-style: italic;
          color: #ffffff;
          line-height: 1.5;
        }

        .quote-attribution {
          display: block;
          font-size: 11.5px;
          color: var(--accent-secondary);
          margin-top: 6px;
        }

        .open-in-studio-box {
          margin-top: 30px;
          padding-top: 18px;
          border-top: 1px solid var(--border-subtle);
        }

        .open-studio-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }

        .open-studio-btn:hover {
          border-color: var(--accent-primary);
          background: var(--bg-surface-3);
          color: #ffffff;
        }

        @media (max-width: 1100px) {
          .contextual-panel-container {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};
