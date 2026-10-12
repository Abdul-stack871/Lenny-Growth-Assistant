import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className={`toast-container ${toast.type} animate-fade-in`}>
      {toast.type === 'success' && <CheckCircle2 size={16} className="toast-icon success" />}
      {toast.type === 'error' && <AlertCircle size={16} className="toast-icon error" />}
      {toast.type === 'info' && <Info size={16} className="toast-icon info" />}
      <span className="toast-message">{toast.message}</span>

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: var(--bg-surface-3);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          box-shadow: var(--shadow-lg);
          z-index: var(--z-toast);
          font-size: 13px;
          color: #ffffff;
        }

        .toast-container.success {
          border-color: rgba(16, 185, 129, 0.4);
        }

        .toast-container.error {
          border-color: rgba(239, 68, 68, 0.4);
        }

        .toast-container.info {
          border-color: rgba(255, 115, 54, 0.4);
        }

        .toast-icon.success {
          color: var(--accent-emerald);
        }

        .toast-icon.error {
          color: var(--accent-coral);
        }

        .toast-icon.info {
          color: var(--accent-primary);
        }

        .toast-message {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
