import React, { useState } from 'react';
import {
  Settings,
  HardDrive,
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Save,
  Trash2,
  ShieldCheck,
  Sliders,
  Server,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiClient } from '../../services/apiClient';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    showToast,
    ollamaStatus: contextOllamaStatus,
    backendStatus: contextBackendStatus,
    checkConnections,
  } = useApp();

  const [ollamaEndpoint, setOllamaEndpoint] = useState(settings.ollamaEndpoint);
  const [apiBaseUrl, setApiBaseUrl] = useState(settings.apiBaseUrl || 'http://localhost:8000/api/v1');
  const [localOllamaStatus, setLocalOllamaStatus] = useState(contextOllamaStatus);
  const [localBackendStatus, setLocalBackendStatus] = useState(contextBackendStatus);
  const [isCheckingOllama, setIsCheckingOllama] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  const handleCheckOllama = async () => {
    setIsCheckingOllama(true);
    setLocalOllamaStatus('checking');
    try {
      const res = await apiClient.checkOllamaHealth(ollamaEndpoint);
      setLocalOllamaStatus(res.status);
      showToast(
        res.status === 'connected'
          ? 'Ollama connected: Local inference active'
          : 'Ollama not detected on ' + ollamaEndpoint,
        res.status === 'connected' ? 'success' : 'error'
      );
    } finally {
      setIsCheckingOllama(false);
    }
  };

  const handleCheckBackend = async () => {
    setIsCheckingBackend(true);
    setLocalBackendStatus('checking');
    try {
      const res = await apiClient.checkBackendHealth();
      setLocalBackendStatus(res.status);
      showToast(
        res.status === 'connected'
          ? `Backend connected (${res.latencyMs || 0}ms latency)`
          : 'FastAPI backend not detected at ' + apiBaseUrl,
        res.status === 'connected' ? 'success' : 'error'
      );
    } finally {
      setIsCheckingBackend(false);
    }
  };

  const handleSave = () => {
    updateSettings({
      ollamaEndpoint,
      apiBaseUrl,
    });
    checkConnections(true);
    showToast('Settings saved successfully');
  };

  const handleClearCache = () => {
    if (window.confirm('Reset application cache and reload default mock workspace?')) {
      showToast('Local application session reset', 'info');
      window.location.reload();
    }
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header-block">
        <div className="settings-title-row">
          <div className="settings-icon-box">
            <Settings size={22} />
          </div>
          <div>
            <h1 className="settings-main-title">System Settings & Connections</h1>
            <p className="settings-subtitle">
              Verify local Ollama status, inspect backend service health, and configure application preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="settings-content-body">
        {/* Ollama Local Provider Card */}
        <section className="settings-card">
          <div className="card-header-row">
            <div className="card-title-meta">
              <HardDrive size={18} className="text-emerald" />
              <h3>Local Ollama Configuration</h3>
            </div>
            <div className={`status-pill ${localOllamaStatus}`}>
              {localOllamaStatus === 'connected' ? (
                <>
                  <CheckCircle2 size={13} />
                  <span>Online (Connected)</span>
                </>
              ) : localOllamaStatus === 'checking' ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <AlertCircle size={13} />
                  <span>Offline (Demo Fallback)</span>
                </>
              )}
            </div>
          </div>

          <p className="card-desc">
            The assistant connects to a local Ollama instance running on your machine for zero-cost, private inference.
          </p>

          <div className="settings-field">
            <label>Ollama Server Endpoint</label>
            <div className="input-with-button">
              <input
                type="text"
                value={ollamaEndpoint}
                onChange={(e) => setOllamaEndpoint(e.target.value)}
                placeholder="http://localhost:11434"
              />
              <button
                className="test-conn-btn"
                onClick={handleCheckOllama}
                disabled={isCheckingOllama}
              >
                {isCheckingOllama ? <RefreshCw size={14} className="animate-spin" /> : 'Test Connection'}
              </button>
            </div>
            <span className="field-hint">
              Default Ollama port is <code>11434</code>. Run <code>ollama serve</code> to start your local instance.
            </span>
          </div>
        </section>

        {/* FastAPI Backend Service Card */}
        <section className="settings-card">
          <div className="card-header-row">
            <div className="card-title-meta">
              <Server size={18} className="text-sky" />
              <h3>FastAPI Backend Service</h3>
            </div>
            <div className={`status-pill ${localBackendStatus}`}>
              {localBackendStatus === 'connected' ? (
                <>
                  <CheckCircle2 size={13} />
                  <span>Backend Online</span>
                </>
              ) : localBackendStatus === 'checking' ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Pinging /health...</span>
                </>
              ) : (
                <>
                  <AlertCircle size={13} />
                  <span>Disconnected (Preview Mode)</span>
                </>
              )}
            </div>
          </div>

          <p className="card-desc">
            The frontend connects to the FastAPI backend service for retrieval-augmented generation and vector index queries.
          </p>

          <div className="settings-field">
            <label>Backend API Base URL</label>
            <div className="input-with-button">
              <input
                type="text"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                placeholder="http://localhost:8000/api/v1"
              />
              <button
                className="test-conn-btn"
                onClick={handleCheckBackend}
                disabled={isCheckingBackend}
              >
                {isCheckingBackend ? <RefreshCw size={14} className="animate-spin" /> : 'Test Backend'}
              </button>
            </div>
            <span className="field-hint">
              Configured for FastAPI backend at <code>http://localhost:8000/api/v1</code>.
            </span>
          </div>
        </section>

        {/* Cloud Credentials Security Card (Server-Side Only) */}
        <section className="settings-card">
          <div className="card-header-row">
            <div className="card-title-meta">
              <Cloud size={18} className="text-purple" />
              <h3>Cloud Credentials Architecture</h3>
            </div>
            <div className="security-notice server-side">
              <ShieldCheck size={14} />
              <span>Server-Managed via Backend .env</span>
            </div>
          </div>

          <p className="card-desc">
            In accordance with production security standards, cloud API credentials (Anthropic Claude and OpenAI) are never stored in browser localStorage. Cloud inference keys must be configured server-side via backend environment variables.
          </p>

          <div className="credentials-spec-grid">
            <div className="cred-spec-item">
              <div className="cred-key-name">ANTHROPIC_API_KEY</div>
              <div className="cred-status-badge">Managed in backend .env</div>
              <p className="cred-desc">Required for Claude 3.5 Sonnet long-form reasoning and essay writing.</p>
            </div>

            <div className="cred-spec-item">
              <div className="cred-key-name">OPENAI_API_KEY</div>
              <div className="cred-status-badge">Managed in backend .env</div>
              <p className="cred-desc">Required for GPT-4o multimodal queries and code generation.</p>
            </div>
          </div>
        </section>

        {/* Knowledge Base & Dataset Status */}
        <section className="settings-card">
          <div className="card-header-row">
            <div className="card-title-meta">
              <Database size={18} className="text-amber" />
              <h3>Knowledge Base & Retrieval Status</h3>
            </div>
            <div className="status-pill demo-pill">
              <span>Curated Sample Dataset</span>
            </div>
          </div>

          <p className="card-desc">
            The frontend preview is grounded in curated Lenny's Podcast transcript excerpts covering product-market fit, growth loops, and pricing strategy. Full vector indexing of 480+ episodes is performed by the FastAPI backend.
          </p>
        </section>

        {/* Editorial & UI Preferences */}
        <section className="settings-card">
          <div className="card-header-row">
            <div className="card-title-meta">
              <Sliders size={18} className="text-orange" />
              <h3>Editorial & UI Preferences</h3>
            </div>
          </div>

          <div className="preference-toggles-list">
            <div className="toggle-row">
              <div>
                <span className="toggle-title">Newsreader Serif Display Headings</span>
                <p className="toggle-sub">Enable editorial serif typography for headlines and essay canvases.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableSerifHeadings}
                onChange={(e) => updateSettings({ enableSerifHeadings: e.target.checked })}
                className="checkbox-input"
              />
            </div>

            <div className="toggle-row">
              <div>
                <span className="toggle-title">Auto-scroll Active Chat</span>
                <p className="toggle-sub">Automatically scroll message window on new incoming responses.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoScrollChat}
                onChange={(e) => updateSettings({ autoScrollChat: e.target.checked })}
                className="checkbox-input"
              />
            </div>

            <div className="toggle-row">
              <div>
                <span className="toggle-title">Reduced Motion</span>
                <p className="toggle-sub">Minimize micro-animations and transition durations.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                className="checkbox-input"
              />
            </div>
          </div>
        </section>

        {/* Action Save Bar */}
        <div className="settings-save-bar">
          <button className="save-settings-main-btn" onClick={handleSave}>
            <Save size={16} />
            <span>Save Connection Settings</span>
          </button>
          <button className="clear-cache-btn" onClick={handleClearCache}>
            <Trash2 size={15} />
            <span>Reset Session Data</span>
          </button>
        </div>
      </div>

      <style>{`
        .settings-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          background: var(--bg-workspace);
        }

        .settings-header-block {
          padding: 28px 36px 20px 36px;
          border-bottom: 1px solid var(--border-subtle);
          background: #090c14;
        }

        .settings-title-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .settings-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: #4b5563;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .settings-main-title {
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
        }

        .settings-subtitle {
          font-size: 13.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .settings-content-body {
          padding: 28px 36px 40px 36px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 900px;
        }

        .settings-card {
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: 22px 24px;
        }

        .card-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .card-title-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card-title-meta h3 {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .card-desc {
          font-size: 13.5px;
          color: var(--text-muted);
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 11.5px;
          font-weight: 600;
        }

        .status-pill.connected {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-pill.disconnected {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .status-pill.checking {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }

        .status-pill.demo-pill {
          background: rgba(255, 115, 54, 0.15);
          color: #ff9e43;
          border: 1px solid rgba(255, 115, 54, 0.3);
        }

        .security-notice.server-side {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #34d399;
          background: rgba(16, 185, 129, 0.1);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .credentials-spec-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 12px;
        }

        @media (max-width: 640px) {
          .credentials-spec-grid {
            grid-template-columns: 1fr;
          }
        }

        .cred-spec-item {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 14px 16px;
        }

        .cred-key-name {
          font-family: monospace;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .cred-status-badge {
          display: inline-block;
          font-size: 11px;
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
          padding: 2px 7px;
          border-radius: 4px;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .cred-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.4;
          margin: 0;
        }

        .settings-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .settings-field label {
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
        }

        .input-with-button {
          display: flex;
          gap: 10px;
        }

        .input-with-button input {
          flex: 1;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          color: #ffffff;
          font-size: 13.5px;
          font-family: monospace;
        }

        .test-conn-btn {
          background: var(--bg-surface-3);
          border: 1px solid var(--border-default);
          color: #ffffff;
          padding: 0 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all var(--transition-fast);
        }

        .test-conn-btn:hover:not(:disabled) {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        .field-hint {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .field-hint code {
          color: var(--accent-primary);
          background: rgba(255, 115, 54, 0.1);
          padding: 1px 4px;
          border-radius: 3px;
        }

        .preference-toggles-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-subtle);
        }

        .toggle-row:last-child {
          border-bottom: none;
        }

        .toggle-title {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
        }

        .toggle-sub {
          font-size: 12.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          accent-color: var(--accent-primary);
          cursor: pointer;
        }

        .settings-save-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 10px;
        }

        .save-settings-main-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--accent-primary);
          color: #ffffff;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .save-settings-main-btn:hover {
          background: var(--accent-hover);
        }

        .clear-cache-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid var(--border-default);
          color: var(--text-muted);
          padding: 9px 16px;
          border-radius: var(--radius-md);
          font-size: 13px;
          cursor: pointer;
        }

        .clear-cache-btn:hover {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.4);
        }

        .text-emerald { color: #34d399; }
        .text-sky { color: #38bdf8; }
        .text-purple { color: #c084fc; }
        .text-amber { color: #fbbf24; }
        .text-orange { color: #ff9e43; }
      `}</style>
    </div>
  );
};
