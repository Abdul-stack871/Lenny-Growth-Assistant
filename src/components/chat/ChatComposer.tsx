import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, ArrowRight, Loader2, Sparkles, PenTool, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChatComposer: React.FC = () => {
  const { sendMessage, isSendingMessage, showToast } = useApp();
  const [input, setInput] = useState('');
  const [showSkillMenu, setShowSkillMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isSendingMessage) return;

    const content = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await sendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const insertSkill = (skillPrompt: string) => {
    setInput(skillPrompt);
    setShowSkillMenu(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="composer-container">
      {/* Skill Suggestions Drawer */}
      {showSkillMenu && (
        <div className="skill-dropdown animate-fade-in">
          <div className="skill-header">Grounded AI Skills</div>
          <button
            className="skill-item-btn"
            onClick={() => insertSkill('Synthesize a Ship 30 for 30 essay on product-market fit from recent episodes')}
          >
            <PenTool size={14} className="text-orange" />
            <div>
              <div className="skill-item-title">Ship 30 for 30 Essay Skill</div>
              <div className="skill-item-sub">1,250-word editorial synthesis grounded in transcripts</div>
            </div>
          </button>
          <button
            className="skill-item-btn"
            onClick={() => insertSkill('Generate an interactive HTML growth retention dashboard')}
          >
            <BarChart3 size={14} className="text-purple" />
            <div>
              <div className="skill-item-title">Growth Dashboard Artifact</div>
              <div className="skill-item-sub">Cohort metrics, payback formulas, and charts</div>
            </div>
          </button>
          <button
            className="skill-item-btn"
            onClick={() => insertSkill('Extract actionable PMF interview frameworks from Lenny & Peter Reinhardt')}
          >
            <Sparkles size={14} className="text-blue" />
            <div>
              <div className="skill-item-title">Qualitative PMF Discovery</div>
              <div className="skill-item-sub">Direct evidence excerpts and tactical questions</div>
            </div>
          </button>
        </div>
      )}

      <form className="composer-card" onSubmit={handleSubmit}>
        {/* Attachment / Skill button */}
        <button
          type="button"
          className={`composer-tool-btn ${showSkillMenu ? 'active' : ''}`}
          onClick={() => setShowSkillMenu((prev) => !prev)}
          title="Attach research skill or prompt preset"
        >
          <Paperclip size={18} />
        </button>

        {/* Multiline textarea */}
        <textarea
          ref={textareaRef}
          className="composer-textarea"
          placeholder="Ask a follow-up or try a skill..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isSendingMessage}
        />

        {/* Send Button */}
        <button
          type="submit"
          className="composer-send-btn"
          disabled={!input.trim() || isSendingMessage}
          title="Send message (Enter)"
        >
          {isSendingMessage ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ArrowRight size={18} />
          )}
        </button>
      </form>

      <style>{`
        .composer-container {
          position: relative;
          width: 100%;
          padding: 12px 20px 20px 20px;
          background: linear-gradient(180deg, transparent 0%, var(--bg-workspace) 30%);
        }

        .skill-dropdown {
          position: absolute;
          bottom: 74px;
          left: 24px;
          width: 380px;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          padding: 10px;
          z-index: var(--z-dropdown);
        }

        .skill-header {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          padding: 6px 10px;
        }

        .skill-item-btn {
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px;
          border-radius: var(--radius-md);
          text-align: left;
          transition: all var(--transition-fast);
        }

        .skill-item-btn:hover {
          background: var(--bg-surface-hover);
        }

        .skill-item-title {
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
        }

        .skill-item-sub {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .text-orange { color: var(--accent-primary); }
        .text-purple { color: #a855f7; }
        .text-blue { color: #38bdf8; }

        .composer-card {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background-color: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          padding: 8px 10px 8px 14px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          transition: border-color var(--transition-fast);
        }

        .composer-card:focus-within {
          border-color: var(--border-accent);
          box-shadow: 0 4px 24px rgba(255, 115, 54, 0.15);
        }

        .composer-tool-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all var(--transition-fast);
          flex-shrink: 0;
          margin-bottom: 2px;
        }

        .composer-tool-btn:hover,
        .composer-tool-btn.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .composer-textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 14.5px;
          line-height: 1.5;
          padding: 6px 0;
          resize: none;
          max-height: 160px;
        }

        .composer-textarea::placeholder {
          color: var(--text-muted);
        }

        .composer-send-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #ff7336 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(255, 115, 54, 0.35);
          transition: all var(--transition-fast);
        }

        .composer-send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(255, 115, 54, 0.5);
        }

        .composer-send-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: none;
        }

        .animate-spin {
          animation: spinSlow 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
