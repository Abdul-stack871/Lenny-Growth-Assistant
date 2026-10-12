import React from 'react';
import { X, Check, Cpu, Cloud, HardDrive, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SwitchModelModal: React.FC = () => {
  const {
    isSwitchModelModalOpen,
    setIsSwitchModelModalOpen,
    models,
    selectedModelId,
    setSelectedModelId,
    ollamaStatus,
    showToast,
  } = useApp();

  if (!isSwitchModelModalOpen) return null;

  const handleSelect = (id: string, name: string) => {
    setSelectedModelId(id);
    showToast(`Switched active model to ${name}`);
    setIsSwitchModelModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsSwitchModelModalOpen(false)}>
      <div className="modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Select Inference Model</h2>
            <p className="modal-subtitle">
              Choose between private local Ollama inference and backend-configured cloud providers.
            </p>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setIsSwitchModelModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="models-list">
          {models.map((model) => {
            const isSelected = model.id === selectedModelId;
            return (
              <div
                key={model.id}
                className={`model-option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(model.id, model.name)}
              >
                <div className="model-option-icon">
                  {model.isLocal ? <HardDrive size={20} /> : <Cloud size={20} />}
                </div>

                <div className="model-option-info">
                  <div className="model-option-top">
                    <span className="model-option-name">{model.name}</span>
                    <span className={`model-option-badge ${model.isLocal ? 'local' : 'cloud'}`}>
                      {model.isLocal ? 'Local Ollama' : 'Backend .env'}
                    </span>
                  </div>
                  <p className="model-option-desc">{model.description}</p>
                  <div className="model-option-meta">
                    <span>Context: {model.contextWindow}</span>
                    <span>•</span>
                    <span className="security-tag">
                      <ShieldCheck size={12} />
                      {model.isLocal ? 'Private Local Inference' : 'Managed Server-Side'}
                    </span>
                  </div>
                </div>

                <div className="model-check-circle">
                  {isSelected && <Check size={16} />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-footer-notice">
          <Cpu size={14} />
          <span>
            {ollamaStatus === 'connected' ? (
              <span className="text-emerald">Local Ollama online at <code>http://localhost:11434</code></span>
            ) : ollamaStatus === 'checking' ? (
              <span>Checking local Ollama at <code>http://localhost:11434</code>...</span>
            ) : (
              <span className="text-amber">Local Ollama offline (<code>http://localhost:11434</code>). Run <code>ollama serve</code> or use demo mode.</span>
            )}
          </span>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(4, 5, 8, 0.82);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--z-modal);
          padding: 20px;
        }

        .modal-card {
          width: 100%;
          max-width: 560px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
        }

        .modal-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .modal-close-btn {
          color: var(--text-muted);
          padding: 4px;
        }

        .modal-close-btn:hover {
          color: #ffffff;
        }

        .models-list {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .model-option-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .model-option-card:hover {
          background: var(--bg-surface-hover);
          border-color: var(--border-hover);
        }

        .model-option-card.selected {
          border-color: var(--accent-primary);
          background: linear-gradient(90deg, rgba(255, 115, 54, 0.12) 0%, rgba(22, 27, 44, 0.9) 100%);
        }

        .model-option-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .model-option-card.selected .model-option-icon {
          background: rgba(255, 115, 54, 0.18);
          color: var(--accent-primary);
        }

        .model-option-info {
          flex: 1;
        }

        .model-option-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .model-option-name {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
        }

        .model-option-badge {
          font-size: 10.5px;
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 600;
        }

        .model-option-badge.local {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }

        .model-option-badge.cloud {
          background: rgba(139, 92, 246, 0.15);
          color: #a78bfa;
        }

        .model-option-desc {
          font-size: 12.5px;
          color: var(--text-secondary);
          margin-top: 3px;
        }

        .model-option-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 6px;
        }

        .security-tag {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .model-check-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1.5px solid var(--border-default);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .model-option-card.selected .model-check-circle {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
        }

        .modal-footer-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: rgba(0, 0, 0, 0.25);
          border-top: 1px solid var(--border-subtle);
          font-size: 12px;
          color: var(--text-muted);
        }

        .modal-footer-notice code {
          color: var(--accent-secondary);
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
};
