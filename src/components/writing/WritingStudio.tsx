import React, { useState } from 'react';
import {
  PenTool,
  Sparkles,
  Save,
  Download,
  Copy,
  BookOpen,
  ArrowRight,
  RefreshCw,
  FileText,
  Share2,
  Check,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WritingFormat, EssayTone } from '../../types';
import { apiClient } from '../../services/apiClient';
import { renderMarkdownBlocks } from '../../utils/markdownRenderer';

export const WritingStudio: React.FC = () => {
  const { activeEssay, setActiveEssay, addLibraryItem, showToast } = useApp();

  const [selectedFormat, setSelectedFormat] = useState<WritingFormat>('ship30');
  const [topic, setTopic] = useState('Product-market fit for early-stage startups');
  const [length, setLength] = useState('~1,250 words');
  const [focus, setFocus] = useState('examples, frameworks, case studies');
  const [tone, setTone] = useState<EssayTone>('practical');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('preview');

  const formats: { id: WritingFormat; title: string; subtitle: string }[] = [
    { id: 'ship30', title: 'Ship 30 for 30', subtitle: 'Turn insights into essays' },
    { id: 'custom', title: 'Custom Essay', subtitle: 'Your own format' },
    { id: 'social', title: 'Social Post', subtitle: 'Threads, LinkedIn, Twitter' },
    { id: 'newsletter', title: 'Newsletter Draft', subtitle: 'Short and sharp' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await apiClient.generateEssay({
        topic,
        format: selectedFormat,
        length,
        tone,
        focus,
      });
      setActiveEssay(generated);
      showToast('Essay generated using Ship 30 for 30 skill');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToLibrary = () => {
    addLibraryItem({
      title: activeEssay.title,
      type: 'essay',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      snippet: `${activeEssay.subtitle} (~${activeEssay.wordCount} words)`,
      tags: ['Ship 30 for 30', 'Essay', activeEssay.tone],
      referenceId: activeEssay.id,
      thumbnailUrl: activeEssay.heroImageUrl,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeEssay.content);
    setIsCopied(true);
    showToast('Copied full essay to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExport = (ext: 'md' | 'html') => {
    const blob = new Blob([activeEssay.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeEssay.title.toLowerCase().replace(/\s+/g, '-')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported as .${ext}`);
  };

  return (
    <div className="studio-layout-container">
      {/* Left Control Bar (Formats + Configuration Form) */}
      <aside className="studio-sidebar-controls">
        <div className="studio-sidebar-header">
          <div className="header-title-badge">
            <PenTool size={16} className="text-orange" />
            <h2 className="studio-panel-heading">Writing Studio</h2>
          </div>
          <span className="studio-pill-tag">Ship 30 for 30 Engine</span>
        </div>

        {/* Format Selector List matching screenshot */}
        <div className="formats-picker-list">
          {formats.map((fmt) => {
            const isActive = selectedFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                className={`format-card-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedFormat(fmt.id)}
              >
                <div className="format-indicator-box">
                  {isActive && <CheckCircle2 size={14} />}
                </div>
                <div className="format-text-meta">
                  <span className="format-title">{fmt.title}</span>
                  <span className="format-subtitle">{fmt.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Form Inputs matching screenshot */}
        <div className="studio-form-fields">
          <div className="form-group">
            <label className="field-label">Topic</label>
            <input
              type="text"
              className="field-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Product-market fit for early-stage startups"
            />
          </div>

          <div className="form-group">
            <label className="field-label">Length</label>
            <select
              className="field-select"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            >
              <option value="~750 words">~750 words (Atomic essay)</option>
              <option value="~1,250 words">~1,250 words (Standard Ship 30 for 30)</option>
              <option value="~2,000 words">~2,000 words (Deep-dive guide)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="field-label">Focus (optional)</label>
            <input
              type="text"
              className="field-input"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="e.g. examples, frameworks, case studies"
            />
          </div>

          <div className="form-group">
            <label className="field-label">Tone</label>
            <select
              className="field-select"
              value={tone}
              onChange={(e) => setTone(e.target.value as EssayTone)}
            >
              <option value="practical">Practical and actionable</option>
              <option value="analytical">Reflective & analytical</option>
              <option value="provocative">Provocative & direct</option>
              <option value="tactical">Step-by-step tactical</option>
            </select>
          </div>

          <button
            className="generate-essay-btn"
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Synthesizing Transcripts...</span>
              </>
            ) : (
              <>
                <span>Generate Essay</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Reading & Editing Canvas */}
      <main className="studio-canvas-area">
        {/* Canvas Toolbar */}
        <div className="canvas-top-toolbar">
          <div className="canvas-stats">
            <span className="stats-badge">
              <FileText size={13} />
              {activeEssay.wordCount} words
            </span>
            <span className="stats-badge">
              <Clock size={13} />
              {activeEssay.readingTimeMinutes} min read
            </span>
            <div className="view-switch-tabs">
              <button
                className={`switch-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                Editorial Preview
              </button>
              <button
                className={`switch-tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
                onClick={() => setActiveTab('editor')}
              >
                Markdown Editor
              </button>
            </div>
          </div>

          <div className="canvas-actions">
            <button className="canvas-action-btn" onClick={handleCopy} title="Copy Markdown">
              {isCopied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
            <button className="canvas-action-btn" onClick={() => handleExport('md')} title="Download Markdown">
              <Download size={14} />
              <span>Export .md</span>
            </button>
            <button className="canvas-save-btn" onClick={handleSaveToLibrary}>
              <Save size={14} />
              <span>Save to Library</span>
            </button>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="canvas-scrollable-content">
          <div className="essay-sheet-paper">
            {activeTab === 'preview' ? (
              <article className="essay-editorial-article">
                <div className="essay-header-block">
                  <div className="essay-badge-row">
                    <span className="essay-format-pill">Ship 30 for 30 Framework</span>
                    <span className="essay-tone-pill">Tone: {activeEssay.tone}</span>
                  </div>
                  <h1 className="essay-title font-serif">{activeEssay.title}</h1>
                  <p className="essay-subtitle">{activeEssay.subtitle}</p>
                </div>

                {/* Hero Banner visual */}
                <div className="essay-hero-visual-box">
                  <img
                    src={activeEssay.heroImageUrl || '/assets/mountain_cliff_editorial.jpg'}
                    alt="Mountain Landscape"
                    className="essay-hero-img"
                  />
                  <div className="essay-hero-quote-strip">
                    <p>{activeEssay.heroQuote || '"Talk to users. Ship small. Learn fast."'}</p>
                  </div>
                </div>

                {/* Quote Callout */}
                {activeEssay.quoteCallout && (
                  <blockquote className="essay-quote-block">
                    <Sparkles size={18} className="quote-sparkle" />
                    <p className="quote-text font-serif">"{activeEssay.quoteCallout.quote}"</p>
                    <cite className="quote-cite">
                      — {activeEssay.quoteCallout.author}, {activeEssay.quoteCallout.source}
                    </cite>
                  </blockquote>
                )}

                {/* Body Content with rich Markdown parsing */}
                <div className="essay-body-content">
                  {renderMarkdownBlocks(activeEssay.content)}
                </div>

                {/* Grounded Citations Drawer at Bottom */}
                <div className="grounded-sources-section">
                  <div className="sources-title">Referenced Podcast Transcripts (Sample Excerpts)</div>
                  <div className="sources-cards-grid">
                    {activeEssay.citations.map((c) => (
                      <div key={c.id} className="source-citation-card">
                        <div className="src-ep-num">Episode {c.episodeNumber}</div>
                        <div className="src-ep-title">{c.episodeTitle}</div>
                        <div className="src-time">{c.timestampStart} - {c.timestampEnd}</div>
                        <p className="src-excerpt">"{c.excerpt}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ) : (
              <div className="markdown-editor-pane">
                <textarea
                  className="editor-textarea"
                  value={activeEssay.content}
                  onChange={(e) => {
                    const newContent = e.target.value;
                    const words = newContent.trim().split(/\s+/).filter(Boolean).length;
                    setActiveEssay((prev) => ({
                      ...prev,
                      content: newContent,
                      wordCount: words,
                    }));
                  }}
                  placeholder="Draft your essay in Markdown..."
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .studio-layout-container {
          display: flex;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: var(--bg-workspace);
        }

        .studio-sidebar-controls {
          width: 360px;
          min-width: 360px;
          height: 100%;
          background: #0b0e17;
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 24px;
        }

        .studio-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .header-title-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .studio-panel-heading {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
        }

        .studio-pill-tag {
          font-size: 10px;
          background: rgba(255, 115, 54, 0.12);
          color: var(--accent-secondary);
          border: 1px solid rgba(255, 115, 54, 0.25);
          padding: 2px 7px;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        .formats-picker-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 24px;
        }

        .format-card-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          text-align: left;
          transition: all var(--transition-fast);
        }

        .format-card-btn:hover {
          background: var(--bg-surface-hover);
          border-color: var(--border-hover);
        }

        .format-card-btn.active {
          border-color: var(--accent-primary);
          background: linear-gradient(90deg, rgba(255, 115, 54, 0.15) 0%, rgba(22, 27, 44, 0.8) 100%);
        }

        .format-indicator-box {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1.5px solid var(--border-default);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
        }

        .format-card-btn.active .format-indicator-box {
          border-color: var(--accent-primary);
        }

        .format-text-meta {
          display: flex;
          flex-direction: column;
        }

        .format-title {
          font-size: 13.5px;
          font-weight: 600;
          color: #ffffff;
        }

        .format-subtitle {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .studio-form-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .field-input, .field-select {
          width: 100%;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          font-size: 13.5px;
          color: #ffffff;
        }

        .field-input:focus, .field-select:focus {
          border-color: var(--border-accent);
        }

        .generate-essay-btn {
          margin-top: 8px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #ff7336 100%);
          color: #ffffff;
          padding: 12px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(255, 115, 54, 0.35);
          transition: all var(--transition-fast);
        }

        .generate-essay-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255, 115, 54, 0.5);
        }

        .generate-essay-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Canvas Area */
        .studio-canvas-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
        }

        .canvas-top-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 28px;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-surface-1);
        }

        .canvas-stats {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .stats-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .view-switch-tabs {
          display: flex;
          align-items: center;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          padding: 2px;
          gap: 2px;
        }

        .switch-tab-btn {
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .switch-tab-btn.active {
          background: var(--bg-surface-3);
          color: #ffffff;
          font-weight: 600;
        }

        .canvas-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .canvas-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-size: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
        }

        .canvas-action-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .canvas-save-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-md);
          font-size: 12px;
          font-weight: 600;
          background: rgba(255, 115, 54, 0.15);
          color: var(--accent-secondary);
          border: 1px solid rgba(255, 115, 54, 0.3);
        }

        .canvas-save-btn:hover {
          background: var(--accent-primary);
          color: #ffffff;
        }

        .canvas-scrollable-content {
          flex: 1;
          overflow-y: auto;
          padding: 36px 40px;
          display: flex;
          justify-content: center;
        }

        .essay-sheet-paper {
          width: 100%;
          max-width: 820px;
        }

        .essay-header-block {
          margin-bottom: 24px;
        }

        .essay-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .essay-format-pill {
          font-size: 11px;
          font-weight: 700;
          color: #ff9e43;
          background: rgba(255, 115, 54, 0.12);
          border: 1px solid rgba(255, 115, 54, 0.25);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }

        .essay-tone-pill {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .essay-title {
          font-size: 32px;
          font-weight: 600;
          line-height: 1.25;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .essay-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
        }

        .essay-hero-visual-box {
          position: relative;
          width: 100%;
          height: 220px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 30px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .essay-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .essay-hero-quote-strip {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: rgba(13, 16, 27, 0.8);
          backdrop-filter: blur(6px);
          border-left: 3px solid var(--accent-primary);
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-style: italic;
          color: #ffffff;
        }

        .essay-quote-block {
          background: rgba(255, 115, 54, 0.08);
          border-left: 4px solid var(--accent-primary);
          border-radius: var(--radius-md);
          padding: 18px 24px;
          margin: 28px 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .quote-sparkle {
          color: var(--accent-primary);
        }

        .quote-text {
          font-size: 16px;
          font-style: italic;
          color: #ffffff;
          line-height: 1.5;
        }

        .quote-cite {
          font-size: 12px;
          color: var(--accent-secondary);
          font-style: normal;
        }

        .essay-body-content {
          font-size: 15.5px;
          line-height: 1.75;
          color: #d2d6e4;
        }

        .essay-section-h2 {
          font-size: 21px;
          font-weight: 600;
          color: #ffffff;
          margin: 32px 0 12px 0;
        }

        .essay-p {
          margin-bottom: 16px;
        }

        .essay-bullet-list {
          padding-left: 24px;
          margin-bottom: 16px;
          line-height: 1.7;
        }

        .essay-divider {
          border: none;
          height: 1px;
          background: var(--border-subtle);
          margin: 28px 0;
        }

        .grounded-sources-section {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid var(--border-default);
        }

        .sources-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .sources-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .source-citation-card {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 14px;
        }

        .src-ep-num {
          font-size: 10px;
          color: var(--accent-secondary);
          font-weight: 700;
          text-transform: uppercase;
        }

        .src-ep-title {
          font-size: 12.5px;
          font-weight: 600;
          color: #ffffff;
          margin-top: 2px;
        }

        .src-time {
          font-size: 11px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          margin: 2px 0 6px 0;
        }

        .src-excerpt {
          font-size: 12px;
          color: var(--text-secondary);
          font-style: italic;
          line-height: 1.4;
        }

        /* Editor pane */
        .markdown-editor-pane {
          width: 100%;
          height: 600px;
        }

        .editor-textarea {
          width: 100%;
          height: 100%;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: 20px;
          color: #ffffff;
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1.6;
          resize: none;
        }

        .editor-textarea:focus {
          border-color: var(--border-accent);
        }

        @media (max-width: 900px) {
          .studio-layout-container {
            flex-direction: column;
          }
          .studio-sidebar-controls {
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1px solid var(--border-subtle);
          }
          .sources-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
