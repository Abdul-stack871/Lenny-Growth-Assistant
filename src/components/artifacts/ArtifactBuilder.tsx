import React, { useState } from 'react';
import {
  Layers,
  BarChart3,
  LayoutTemplate,
  Calendar,
  FileText,
  ArrowRight,
  Code2,
  Eye,
  Download,
  Save,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ArtifactTemplate } from '../../types';
import { MOCK_ARTIFACT_TEMPLATES } from '../../services/mockDataAdapter';
import { SandboxFrame } from './SandboxFrame';
import { apiClient } from '../../services/apiClient';

export const ArtifactBuilder: React.FC = () => {
  const { activeArtifact, setActiveArtifact, addLibraryItem, conversations, showToast } = useApp();

  const [activeCreationMode, setActiveCreationMode] = useState<'template' | 'custom' | 'chat'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ArtifactTemplate>('growth-dashboard');
  const [artifactTitle, setArtifactTitle] = useState(activeArtifact.title);
  const [artifactDesc, setArtifactDesc] = useState(activeArtifact.description);
  const [customPrompt, setCustomPrompt] = useState('Build an executive SaaS dashboard tracking retention curves and payback milestones.');
  const [selectedChatId, setSelectedChatId] = useState(conversations[0]?.id || '');
  const [editorCode, setEditorCode] = useState(activeArtifact.code);
  const [activePaneTab, setActivePaneTab] = useState<'preview' | 'code'>('preview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const templates: {
    id: ArtifactTemplate;
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'growth-dashboard',
      title: 'Growth Dashboard',
      desc: 'Metrics and charts',
      icon: <BarChart3 size={24} />,
      color: 'orange',
    },
    {
      id: 'strategy-canvas',
      title: 'Strategy Canvas',
      desc: 'Visual framework',
      icon: <LayoutTemplate size={24} />,
      color: 'amber',
    },
    {
      id: 'product-roadmap',
      title: 'Product Roadmap',
      desc: 'Timeline and phases',
      icon: <Calendar size={24} />,
      color: 'purple',
    },
    {
      id: 'one-pager',
      title: 'One-Pager',
      desc: 'HTML/CSS document',
      icon: <FileText size={24} />,
      color: 'blue',
    },
  ];

  const handleSelectTemplate = (id: ArtifactTemplate) => {
    setSelectedTemplate(id);
    const tmpl = MOCK_ARTIFACT_TEMPLATES[id];
    if (tmpl) {
      setArtifactTitle(tmpl.title);
      setArtifactDesc(tmpl.desc);
      setEditorCode(tmpl.code);
      setActiveArtifact({
        id: `art-${id}-${Date.now()}`,
        title: tmpl.title,
        description: tmpl.desc,
        template: id,
        type: tmpl.type,
        code: tmpl.code,
        createdAt: 'Just now',
        updatedAt: 'Just now',
        isDemo: true,
      });
    }
  };

  const handleCreateArtifact = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    let finalTitle = artifactTitle;
    let finalDesc = artifactDesc;
    let finalTemplate = selectedTemplate;

    if (activeCreationMode === 'chat') {
      const chat = conversations.find((c) => c.id === selectedChatId) || conversations[0];
      if (chat) {
        finalTitle = `${chat.title} Artifact`;
        finalDesc = `Synthesized visual artifact generated from discussion on "${chat.title}"`;
      }
    }

    try {
      const generated = await apiClient.generateArtifact({
        template: finalTemplate,
        title: finalTitle,
        description: finalDesc,
        contextPrompt: activeCreationMode === 'custom' ? customPrompt : undefined,
      });
      setActiveArtifact(generated);
      setArtifactTitle(generated.title);
      setArtifactDesc(generated.description);
      setEditorCode(generated.code);
      showToast(`Artifact generated: ${generated.title}`);
    } catch {
      setGenerationError('Failed to generate artifact. Please retry.');
      showToast('Artifact generation error', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToLibrary = () => {
    addLibraryItem({
      title: artifactTitle,
      type: 'artifact',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      snippet: artifactDesc,
      tags: ['Artifact', selectedTemplate, 'HTML/CSS'],
      referenceId: activeArtifact.id,
    });
  };

  const handleExport = () => {
    const blob = new Blob([editorCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifactTitle.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported artifact as HTML file');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorCode);
    setIsCopied(true);
    showToast('Copied code to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="artifact-builder-container">
      {/* Top Creation Header */}
      <div className="builder-header-panel">
        <div className="builder-title-row">
          <div className="builder-icon-badge">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="builder-title">Create an Artifact</h1>
            <p className="builder-subtitle">Turn podcast knowledge into sandboxed interactive visual artifacts</p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="creation-mode-tabs">
          <button
            className={`mode-tab-btn ${activeCreationMode === 'template' ? 'active' : ''}`}
            onClick={() => setActiveCreationMode('template')}
          >
            Template
          </button>
          <button
            className={`mode-tab-btn ${activeCreationMode === 'custom' ? 'active' : ''}`}
            onClick={() => setActiveCreationMode('custom')}
          >
            Custom
          </button>
          <button
            className={`mode-tab-btn ${activeCreationMode === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveCreationMode('chat')}
          >
            From Chat
          </button>
        </div>

        {/* Mode 1: 4 Template Cards Grid */}
        {activeCreationMode === 'template' && (
          <div className="templates-selector-grid animate-fade-in">
            {templates.map((t) => {
              const isSelected = selectedTemplate === t.id;
              return (
                <div
                  key={t.id}
                  className={`template-tile-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectTemplate(t.id)}
                >
                  <div className={`tile-icon-box ${t.color}`}>{t.icon}</div>
                  <div className="tile-text">
                    <h3 className="tile-name">{t.title}</h3>
                    <p className="tile-desc">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mode 2: Custom Artifact Form */}
        {activeCreationMode === 'custom' && (
          <div className="custom-builder-form animate-fade-in">
            <div className="custom-form-row">
              <div className="form-group flex-1">
                <label className="form-label">Artifact Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={artifactTitle}
                  onChange={(e) => setArtifactTitle(e.target.value)}
                  placeholder="e.g. Q4 Growth Retention Funnel"
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Base Structure</label>
                <select
                  className="form-select"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value as ArtifactTemplate)}
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.desc})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Custom Generation Prompt & Requirements</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe layout, metrics to visualize, and specific color themes..."
              />
            </div>
          </div>
        )}

        {/* Mode 3: From Chat Context */}
        {activeCreationMode === 'chat' && (
          <div className="from-chat-panel animate-fade-in">
            <div className="form-group">
              <label className="form-label">Select Source Conversation to Synthesize</label>
              <div className="chat-options-grid">
                {conversations.slice(0, 4).map((chat) => {
                  const isChatPicked = selectedChatId === chat.id;
                  return (
                    <div
                      key={chat.id}
                      className={`chat-option-card ${isChatPicked ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedChatId(chat.id);
                        setArtifactTitle(`${chat.title} Artifact`);
                        setArtifactDesc(`Visual canvas generated from ${chat.messages.length} conversation messages.`);
                      }}
                    >
                      <MessageSquare size={16} className="chat-opt-icon" />
                      <div className="chat-opt-text">
                        <span className="chat-opt-title">{chat.title}</span>
                        <span className="chat-opt-count">{chat.messages.length} messages</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Error banner if generation failed */}
        {generationError && (
          <div className="generation-error-banner animate-fade-in">
            <AlertCircle size={15} />
            <span>{generationError}</span>
            <button className="retry-btn-mini" onClick={handleCreateArtifact}>
              Retry
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="builder-cta-row">
          <button
            className="create-artifact-main-btn"
            onClick={handleCreateArtifact}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Generating Sandbox...</span>
              </>
            ) : (
              <>
                <span>Generate Artifact</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Split Canvas (Editor vs Isolated Sandbox Preview) */}
      <div className="builder-workspace-view">
        <div className="workspace-view-toolbar">
          <div className="toolbar-left">
            <span className="artifact-active-name">{artifactTitle}</span>
            <div className="view-mode-pills">
              <button
                className={`view-pill ${activePaneTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActivePaneTab('preview')}
              >
                <Eye size={13} />
                <span>Live Sandbox</span>
              </button>
              <button
                className={`view-pill ${activePaneTab === 'code' ? 'active' : ''}`}
                onClick={() => setActivePaneTab('code')}
              >
                <Code2 size={13} />
                <span>HTML / CSS Source</span>
              </button>
            </div>
          </div>

          <div className="toolbar-right">
            <button className="tb-btn" onClick={handleCopy} title="Copy code">
              {isCopied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
            <button className="tb-btn" onClick={handleExport} title="Download HTML">
              <Download size={14} />
              <span>Export HTML</span>
            </button>
            <button className="tb-btn save" onClick={handleSaveToLibrary}>
              <Save size={14} />
              <span>Save to Library</span>
            </button>
          </div>
        </div>

        <div className="workspace-render-pane">
          {activePaneTab === 'preview' ? (
            <SandboxFrame code={editorCode} title={artifactTitle} />
          ) : (
            <div className="code-editor-container">
              <textarea
                className="code-textarea"
                value={editorCode}
                onChange={(e) => {
                  setEditorCode(e.target.value);
                  setActiveArtifact((prev) => ({ ...prev, code: e.target.value }));
                }}
                placeholder="Edit HTML/CSS code directly..."
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .artifact-builder-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          background: var(--bg-workspace);
        }

        .builder-header-panel {
          padding: 24px 32px 18px 32px;
          border-bottom: 1px solid var(--border-subtle);
          background: #090c14;
        }

        .builder-title-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .builder-icon-badge {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: #0284c7;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .builder-title {
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
        }

        .builder-subtitle {
          font-size: 13.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .creation-mode-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          padding: 4px;
          border-radius: var(--radius-md);
          width: fit-content;
          margin-bottom: 16px;
        }

        .mode-tab-btn {
          padding: 6px 16px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .mode-tab-btn:hover {
          color: #ffffff;
        }

        .mode-tab-btn.active {
          background: var(--bg-surface-3);
          color: #ffffff;
          box-shadow: var(--shadow-sm);
        }

        .templates-selector-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        @media (max-width: 900px) {
          .templates-selector-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 540px) {
          .templates-selector-grid {
            grid-template-columns: 1fr;
          }
        }

        .template-tile-card {
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all var(--transition-fast);
        }

        .template-tile-card:hover {
          border-color: rgba(255, 115, 54, 0.4);
          background: var(--bg-surface-hover);
        }

        .template-tile-card.selected {
          border-color: var(--accent-primary);
          background: rgba(255, 115, 54, 0.08);
          box-shadow: 0 0 12px rgba(255, 115, 54, 0.2);
        }

        .tile-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tile-icon-box.orange { background: rgba(255, 115, 54, 0.15); color: #ff7336; }
        .tile-icon-box.amber { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .tile-icon-box.purple { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
        .tile-icon-box.blue { background: rgba(2, 132, 199, 0.15); color: #0284c7; }

        .tile-name {
          font-size: 13.5px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .tile-desc {
          font-size: 11.5px;
          color: var(--text-muted);
          margin: 2px 0 0 0;
        }

        /* Custom Form */
        .custom-builder-form {
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .custom-form-row {
          display: flex;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #ffffff;
        }

        .form-input, .form-select, .form-textarea {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-sm);
          color: #ffffff;
          padding: 8px 12px;
          font-size: 13px;
        }

        .form-textarea {
          resize: vertical;
          font-family: inherit;
        }

        /* From Chat */
        .from-chat-panel {
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-bottom: 16px;
        }

        .chat-options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 8px;
        }

        .chat-option-card {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .chat-option-card:hover {
          border-color: var(--accent-primary);
        }

        .chat-option-card.selected {
          border-color: var(--accent-primary);
          background: rgba(255, 115, 54, 0.1);
        }

        .chat-opt-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .chat-opt-text {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-opt-title {
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chat-opt-count {
          font-size: 11px;
          color: var(--text-muted);
        }

        .generation-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-size: 12.5px;
          margin-bottom: 12px;
        }

        .retry-btn-mini {
          background: rgba(239, 68, 68, 0.25);
          color: #ffffff;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          margin-left: auto;
        }

        .builder-cta-row {
          display: flex;
          justify-content: flex-start;
        }

        .create-artifact-main-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--accent-primary);
          color: #ffffff;
          padding: 10px 22px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .create-artifact-main-btn:hover:not(:disabled) {
          background: var(--accent-hover);
          box-shadow: 0 4px 14px rgba(255, 115, 54, 0.35);
        }

        /* Live Workspace View */
        .builder-workspace-view {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px 32px 32px 32px;
          min-height: 520px;
        }

        .workspace-view-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-bottom: none;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .artifact-active-name {
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
        }

        .view-mode-pills {
          display: flex;
          gap: 4px;
          background: var(--bg-surface-2);
          padding: 3px;
          border-radius: var(--radius-sm);
        }

        .view-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .view-pill.active {
          background: var(--bg-surface-3);
          color: #ffffff;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tb-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          padding: 6px 12px;
          border-radius: var(--radius-xs);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .tb-btn:hover {
          color: #ffffff;
          border-color: var(--border-hover);
        }

        .tb-btn.save {
          background: rgba(255, 115, 54, 0.15);
          color: var(--accent-primary);
          border-color: rgba(255, 115, 54, 0.3);
        }

        .tb-btn.save:hover {
          background: var(--accent-primary);
          color: #ffffff;
        }

        .workspace-render-pane {
          flex: 1;
          border: 1px solid var(--border-default);
          border-radius: 0 0 var(--radius-md) var(--radius-md);
          overflow: hidden;
          min-height: 440px;
          background: #0c0e17;
        }

        .code-editor-container {
          width: 100%;
          height: 100%;
          padding: 16px;
          background: #080a10;
        }

        .code-textarea {
          width: 100%;
          height: 100%;
          min-height: 400px;
          background: transparent;
          border: none;
          color: #38bdf8;
          font-family: 'Fira Code', monospace;
          font-size: 13px;
          line-height: 1.6;
          outline: none;
          resize: none;
        }

        .text-emerald { color: #34d399; }
      `}</style>
    </div>
  );
};
