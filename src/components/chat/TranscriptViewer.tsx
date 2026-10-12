import React, { useState } from 'react';
import { Play, Pause, Volume2, RotateCcw, Clock, Search, ExternalLink } from 'lucide-react';
import { MOCK_CITATIONS } from '../../services/mockDataAdapter';
import { useApp } from '../../context/AppContext';

export const TranscriptViewer: React.FC = () => {
  const { showToast } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState(MOCK_CITATIONS[1]); // Ep. 12 Product-Market Fit
  const [filterQuery, setFilterQuery] = useState('');

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
    showToast(isPlaying ? 'Audio paused' : 'Audio playback is simulated in preview mode', 'info');
  };

  const filteredCitations = MOCK_CITATIONS.filter(
    (c) =>
      c.episodeTitle.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.excerpt.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="transcript-container">
      {/* Audio Player Card */}
      <div className="audio-player-card">
        <div className="audio-header">
          <div className="audio-ep-meta">
            <span className="audio-tag">SAMPLE AUDIO EXCERPT (DEMO)</span>
            <h4 className="audio-title">
              Ep. {activeEpisode.episodeNumber} - {activeEpisode.episodeTitle}
            </h4>
            <span className="audio-speaker">Guest: {activeEpisode.guest}</span>
          </div>
        </div>

        {/* Audio scrub bar */}
        <div className="scrub-container">
          <div className="scrub-track">
            <div className="scrub-progress" style={{ width: isPlaying ? '64%' : '32%' }} />
          </div>
          <div className="scrub-timestamps">
            <span>{activeEpisode.timestampStart}</span>
            <span>{activeEpisode.timestampEnd}</span>
          </div>
        </div>

        {/* Player controls */}
        <div className="player-controls">
          <button
            className="ctrl-btn"
            onClick={() => showToast('Replaying excerpt', 'info')}
            title="Replay from excerpt start"
          >
            <RotateCcw size={15} />
          </button>
          <button
            className="play-main-btn"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play excerpt'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
          </button>
          <button className="ctrl-btn" title="Volume">
            <Volume2 size={16} />
          </button>
          <span className="speed-badge">1.0x</span>
        </div>
      </div>

      {/* Transcript Excerpts Search */}
      <div className="transcript-search-box">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          placeholder="Filter sample episode transcripts..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
        />
      </div>

      {/* Excerpt Stream */}
      <div className="excerpts-list">
        {filteredCitations.map((cit) => {
          const isCurrent = cit.id === activeEpisode.id;
          return (
            <div
              key={cit.id}
              className={`excerpt-card ${isCurrent ? 'active' : ''}`}
              onClick={() => setActiveEpisode(cit)}
            >
              <div className="excerpt-top">
                <span className="ep-num-pill">Episode {cit.episodeNumber}</span>
                <span className="timestamp-pill">
                  <Clock size={11} />
                  {cit.timestampStart} - {cit.timestampEnd}
                </span>
              </div>
              <p className="excerpt-quote">"{cit.excerpt}"</p>
              <div className="excerpt-footer">
                <span className="speaker-label">{cit.guest}</span>
                <span className="verified-tag sample-tag">Sample Grounding Excerpt</span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .transcript-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
          overflow-y: auto;
          padding: 16px 20px;
        }

        .audio-player-card {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: 16px;
          box-shadow: var(--shadow-sm);
        }

        .audio-tag {
          font-size: 10px;
          font-weight: 700;
          color: var(--accent-primary);
          letter-spacing: 0.05em;
        }

        .audio-title {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          margin-top: 2px;
        }

        .audio-speaker {
          font-size: 12px;
          color: var(--text-muted);
        }

        .scrub-container {
          margin: 14px 0 10px 0;
        }

        .scrub-track {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          position: relative;
          cursor: pointer;
        }

        .scrub-progress {
          height: 100%;
          background: var(--accent-primary);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .scrub-timestamps {
          display: flex;
          justify-content: space-between;
          font-size: 10.5px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          margin-top: 4px;
        }

        .player-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .play-main-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .play-main-btn:hover {
          transform: scale(1.06);
          background: var(--accent-primary-hover);
        }

        .ctrl-btn {
          color: var(--text-secondary);
          padding: 6px;
        }

        .ctrl-btn:hover {
          color: #ffffff;
        }

        .speed-badge {
          font-size: 11px;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .transcript-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 8px 12px;
        }

        .transcript-search-box input {
          flex: 1;
          background: transparent;
          border: none;
          font-size: 12.5px;
        }

        .excerpts-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .excerpt-card {
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          padding: 14px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .excerpt-card:hover {
          background: var(--bg-surface-hover);
          border-color: var(--border-hover);
        }

        .excerpt-card.active {
          border-color: var(--accent-primary);
          background: rgba(255, 115, 54, 0.06);
        }

        .excerpt-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .ep-num-pill {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .timestamp-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--accent-secondary);
          font-family: var(--font-mono);
        }

        .excerpt-quote {
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-secondary);
          font-style: italic;
        }

        .excerpt-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 11px;
        }

        .speaker-label {
          color: #ffffff;
          font-weight: 600;
        }

        .verified-tag {
          color: var(--accent-emerald);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
