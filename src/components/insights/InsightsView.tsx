import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  TrendingUp,
  Target,
  ArrowRight,
  Sparkles,
  Play,
  Quote,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { MOCK_INSIGHTS } from '../../services/mockDataAdapter';
import { apiClient } from '../../services/apiClient';
import { InsightTheme } from '../../types';
import { useApp } from '../../context/AppContext';

export const InsightsView: React.FC = () => {
  const { setCurrentPage, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [insights, setInsights] = useState<InsightTheme[]>(MOCK_INSIGHTS);

  useEffect(() => {
    let isMounted = true;
    apiClient.getInsights().then((data) => {
      if (isMounted && data && data.length > 0) {
        setInsights(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['All', 'Product-Market Fit', 'Growth Loops', 'Leadership'];

  const filteredInsights = insights.filter(
    (ins) => selectedCategory === 'All' || ins.category === selectedCategory
  );

  return (
    <div className="insights-container">
      {/* Header */}
      <div className="insights-header-block">
        <div className="insights-title-row">
          <div className="insights-icon-box">
            <Lightbulb size={22} />
          </div>
          <div>
            <h1 className="insights-main-title">Evidence-Oriented Insights</h1>
            <p className="insights-subtitle">
              Synthesized frameworks, real episode findings, and curated interview quotes.
            </p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="insights-categories-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Theme Cards or Empty State */}
      {filteredInsights.length === 0 ? (
        <div className="insights-empty-state">
          <Lightbulb size={36} className="empty-icon" />
          <h3>No insights found for "{selectedCategory}"</h3>
          <p>Try selecting a different category filter or view all insights.</p>
          <button className="reset-filter-btn" onClick={() => setSelectedCategory('All')}>
            Show All Themes
          </button>
        </div>
      ) : (
        <div className="insights-cards-grid">
        {filteredInsights.map((ins) => (
          <div key={ins.id} className="insight-card">
            <div className="insight-top-meta">
              <span className="insight-cat-tag">{ins.category}</span>
              <span className="insight-ep-tag">
                Ep. {ins.episodeNumber} • {ins.guest}
              </span>
            </div>

            <h3 className="insight-title font-serif">{ins.title}</h3>

            {/* Evidence quote */}
            <div className="evidence-quote-box">
              <Quote size={14} className="quote-icon" />
              <p className="evidence-text">"{ins.evidenceExcerpt}"</p>
            </div>

            {/* Core Takeaways */}
            <div className="takeaways-block">
              <span className="takeaways-label">Core Takeaways</span>
              <ul className="takeaways-list">
                {ins.takeaways.map((point, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={13} className="check-icon" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Action */}
            <div className="action-box">
              <span className="action-label">Actionable Next Step</span>
              <p className="action-text">{ins.recommendedAction}</p>
            </div>

            <button
              className="insight-action-btn"
              onClick={() => {
                setCurrentPage('writing');
                showToast(`Loaded "${ins.title}" into Writing Studio`);
              }}
            >
              <span>Turn into Ship 30 for 30 Essay</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
        </div>
      )}

      <style>{`
        .insights-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          background: var(--bg-workspace);
        }

        .insights-header-block {
          padding: 28px 36px 20px 36px;
          border-bottom: 1px solid var(--border-subtle);
          background: #090c14;
        }

        .insights-title-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .insights-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: #f59e0b;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .insights-main-title {
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
        }

        .insights-subtitle {
          font-size: 13.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .insights-categories-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cat-pill {
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-muted);
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          transition: all var(--transition-fast);
        }

        .cat-pill:hover {
          color: #ffffff;
          border-color: var(--border-hover);
        }

        .cat-pill.active {
          background: #f59e0b;
          color: #000000;
          font-weight: 700;
          border-color: #f59e0b;
        }

        .insights-cards-grid {
          padding: 28px 36px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
          gap: 20px;
          max-width: 1300px;
          margin: 0 auto;
          width: 100%;
        }

        .insight-card {
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all var(--transition-fast);
        }

        .insight-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .insight-top-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .insight-cat-tag {
          font-size: 11px;
          font-weight: 700;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.12);
          padding: 3px 8px;
          border-radius: var(--radius-xs);
        }

        .insight-ep-tag {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .insight-title {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.3;
        }

        .evidence-quote-box {
          display: flex;
          gap: 8px;
          background: var(--bg-surface-2);
          border-left: 3px solid #fbbf24;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
        }

        .quote-icon {
          color: #fbbf24;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .evidence-text {
          font-size: 12.5px;
          font-style: italic;
          color: #d1d5e5;
          line-height: 1.5;
        }

        .takeaways-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .takeaways-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .takeaways-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .takeaways-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .check-icon {
          color: var(--accent-emerald);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .action-box {
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
        }

        .action-label {
          display: block;
          font-size: 10.5px;
          font-weight: 700;
          color: var(--accent-secondary);
          text-transform: uppercase;
        }

        .action-text {
          font-size: 12.5px;
          color: #ffffff;
          margin-top: 3px;
        }

        .insight-action-btn {
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
          margin-top: auto;
        }

        .insight-action-btn:hover {
          background: var(--bg-surface-3);
          border-color: var(--accent-primary);
          color: #ffffff;
        }

        @media (max-width: 900px) {
          .insights-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
