import React from 'react';
import { Copy, Save, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotesEditor: React.FC = () => {
  const { userNotes, setUserNotes, showToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(userNotes);
    setCopied(true);
    showToast('Notes copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    showToast('Notes saved locally');
  };

  return (
    <div className="notes-container">
      <div className="notes-toolbar">
        <span className="notes-label">PERSISTENT SCRATCHPAD</span>
        <div className="notes-actions">
          <button className="note-btn" onClick={handleCopy} title="Copy notes">
            {copied ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button className="note-btn save" onClick={handleSave} title="Save notes">
            <Save size={13} />
            <span>Save</span>
          </button>
        </div>
      </div>

      <textarea
        className="notes-textarea"
        value={userNotes}
        onChange={(e) => setUserNotes(e.target.value)}
        placeholder="Jot down quick thoughts, synthesized takeaways, or draft questions..."
      />

      <style>{`
        .notes-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 16px 20px;
        }

        .notes-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 12px;
        }

        .notes-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .notes-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .note-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: 11.5px;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
        }

        .note-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .note-btn.save {
          background: rgba(255, 115, 54, 0.15);
          color: var(--accent-secondary);
        }

        .note-btn.save:hover {
          background: var(--accent-primary);
          color: #ffffff;
        }

        .notes-textarea {
          flex: 1;
          width: 100%;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 14px;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.6;
          resize: none;
        }

        .notes-textarea:focus {
          border-color: var(--border-accent);
        }

        .text-emerald {
          color: var(--accent-emerald);
        }
      `}</style>
    </div>
  );
};
