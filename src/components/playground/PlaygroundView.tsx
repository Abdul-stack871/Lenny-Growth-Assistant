import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Sliders,
  Cpu,
  Clock,
  Zap,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PlaygroundView: React.FC = () => {
  const { models, selectedModelId, setSelectedModelId, showToast } = useApp();

  const [systemPrompt, setSystemPrompt] = useState(
    'You are The Lenny Growth Assistant, an expert AI product strategy partner grounded in Lenny\'s Podcast and Newsletter transcripts.'
  );
  const [userPrompt, setUserPrompt] = useState(
    'Synthesize the 3 biggest reasons early-stage founders misinterpret initial user traction.'
  );
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [isRunning, setIsRunning] = useState(false);
  const [responseOutput, setResponseOutput] = useState('');
  const [latency, setLatency] = useState<number | null>(null);
  const [tokenStats, setTokenStats] = useState<{ input: number; output: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    if (!userPrompt.trim()) return;
    setIsRunning(true);
    setResponseOutput('');
    const startTime = performance.now();

    // Simulated model generation with realistic streaming delay
    setTimeout(() => {
      const output = `### Grounded Synthesis from Curated Podcast Transcripts (Preview Simulation)

1. **Confusing Acquisition Spikes with Retention (The 'Product Hunt Trap')**
   Early surges from launch events or press coverage produce deceptive sign-up numbers. As Brian Balfour points out, traction only exists if cohort retention curves flatten horizontally above 20%.

2. **Listening to Declared Intent Over Observed Behavior**
   Users often praise prototypes verbally to be polite. Lenny highlights that real demand is evidenced by voluntary frequency and extreme disappointment when access is revoked, not compliments.

3. **Subsidizing Usage with Manual Effort**
   Founders doing high-touch onboarding sometimes mask product friction. When founders stop manual interventions, unassisted user activation drops to near zero.`;

      setResponseOutput(output);
      setLatency(Math.round(performance.now() - startTime));
      setTokenStats({ input: 142, output: 218 });
      setIsRunning(false);
      showToast('Prompt executed successfully');
    }, 950);
  };

  const handleReset = () => {
    setUserPrompt('');
    setResponseOutput('');
    setLatency(null);
    setTokenStats(null);
    showToast('Playground cleared', 'info');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseOutput);
    setCopied(true);
    showToast('Copied output to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="playground-container">
      {/* Header */}
      <div className="playground-header-block">
        <div className="playground-title-row">
          <div className="playground-icon-box">
            <Terminal size={22} />
          </div>
          <div>
            <h1 className="playground-main-title">AI Model Playground</h1>
            <p className="playground-subtitle">
              Inspect model parameters, tune system prompts, and benchmark local vs cloud inference.
            </p>
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="playground-split-layout">
        {/* Left Parameter & Prompt Panel */}
        <div className="playground-controls-panel">
          {/* Model Selector */}
          <div className="pg-field-group">
            <label className="pg-label">Active Inference Model</label>
            <select
              className="pg-select"
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.isLocal ? 'Local' : 'Cloud'})
                </option>
              ))}
            </select>
          </div>

          {/* Hyperparameters */}
          <div className="pg-sliders-row">
            <div className="slider-group">
              <div className="slider-label-row">
                <span>Temperature</span>
                <span className="slider-val">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="pg-range-input"
              />
            </div>

            <div className="slider-group">
              <div className="slider-label-row">
                <span>Max Output Tokens</span>
                <span className="slider-val">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="256"
                max="4096"
                step="128"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="pg-range-input"
              />
            </div>
          </div>

          {/* System Prompt */}
          <div className="pg-field-group">
            <label className="pg-label">System Prompt & Instructions</label>
            <textarea
              className="pg-textarea system"
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>

          {/* User Prompt Input */}
          <div className="pg-field-group flex-1">
            <label className="pg-label">User Prompt</label>
            <textarea
              className="pg-textarea user"
              rows={5}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
            />
          </div>

          {/* Run & Reset Actions */}
          <div className="pg-action-buttons">
            <button
              className="pg-run-btn"
              onClick={handleRun}
              disabled={isRunning || !userPrompt.trim()}
            >
              <Play size={15} fill="currentColor" />
              <span>{isRunning ? 'Executing Inference...' : 'Run Prompt'}</span>
            </button>
            <button className="pg-reset-btn" onClick={handleReset}>
              <RotateCcw size={15} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Right Output & Telemetry Panel */}
        <div className="playground-output-panel">
          <div className="output-header-bar">
            <span className="output-title">Model Response</span>
            {latency && (
              <div className="telemetry-badges">
                <span className="telemetry-pill">
                  <Clock size={12} />
                  {latency}ms
                </span>
                <span className="telemetry-pill">
                  <Zap size={12} />
                  {tokenStats?.input} in / {tokenStats?.output} out
                </span>
              </div>
            )}
            {responseOutput && (
              <button className="copy-output-btn" onClick={handleCopy}>
                {copied ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          <div className="output-scroll-body">
            {isRunning ? (
              <div className="running-placeholder">
                <div className="pulse-glow-box">
                  <Cpu size={24} className="animate-spin" />
                </div>
                <span>Executing prompt against {models.find(m => m.id === selectedModelId)?.name}...</span>
              </div>
            ) : responseOutput ? (
              <div className="rendered-output-text">
                {responseOutput.split('\n\n').map((block, idx) => (
                  <p key={idx}>{block}</p>
                ))}
              </div>
            ) : (
              <div className="empty-output-placeholder">
                <Terminal size={32} className="empty-icon" />
                <p>Run a prompt to see grounded response metrics, latency timing, and token usage.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .playground-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: var(--bg-workspace);
        }

        .playground-header-block {
          padding: 24px 36px 16px 36px;
          border-bottom: 1px solid var(--border-subtle);
          background: #090c14;
        }

        .playground-title-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .playground-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: #8b5cf6;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .playground-main-title {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
        }

        .playground-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .playground-split-layout {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          overflow: hidden;
        }

        .playground-controls-panel {
          padding: 24px 32px;
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
        }

        .pg-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pg-label {
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .pg-select, .pg-textarea {
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          color: #ffffff;
          font-size: 13.5px;
        }

        .pg-textarea {
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.5;
          resize: vertical;
        }

        .pg-sliders-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 14px;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .slider-val {
          color: var(--accent-secondary);
          font-family: var(--font-mono);
          font-weight: 600;
        }

        .pg-range-input {
          accent-color: var(--accent-primary);
        }

        .pg-action-buttons {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }

        .pg-run-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #6366f1 0%, #ff7336 100%);
          color: #ffffff;
          padding: 12px;
          border-radius: var(--radius-md);
          font-size: 13.5px;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(255, 115, 54, 0.3);
        }

        .pg-run-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(255, 115, 54, 0.45);
        }

        .pg-reset-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          padding: 12px 18px;
          border-radius: var(--radius-md);
          font-size: 13px;
        }

        .pg-reset-btn:hover {
          color: #ffffff;
          background: var(--bg-surface-2);
        }

        /* Output Panel */
        .playground-output-panel {
          display: flex;
          flex-direction: column;
          background: #0a0d16;
          overflow: hidden;
        }

        .output-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-surface-1);
        }

        .output-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .telemetry-badges {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .telemetry-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.05);
          padding: 3px 8px;
          border-radius: 4px;
          font-family: var(--font-mono);
        }

        .copy-output-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--text-muted);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .copy-output-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .output-scroll-body {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
        }

        .empty-output-placeholder, .running-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text-muted);
          gap: 12px;
        }

        .rendered-output-text {
          font-size: 14.5px;
          line-height: 1.7;
          color: #d1d5e5;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (max-width: 900px) {
          .playground-split-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
