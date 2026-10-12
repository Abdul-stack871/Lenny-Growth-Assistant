import React, { useState } from 'react';
import {
  Bookmark,
  Search,
  FileText,
  Layers,
  MessageSquare,
  MoreVertical,
  ExternalLink,
  Trash2,
  Download,
  Eye,
  X,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LibraryItem, LibraryFilter } from '../../types';

export const LibraryView: React.FC = () => {
  const {
    libraryItems,
    removeLibraryItem,
    setCurrentPage,
    setActiveConversationId,
    showToast,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<LibraryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);

  const filteredItems = libraryItems.filter((item) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'essays' && item.type === 'essay') ||
      (activeFilter === 'artifacts' && item.type === 'artifact') ||
      (activeFilter === 'chats' && item.type === 'chat');

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.snippet.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleOpenItem = (item: LibraryItem) => {
    if (item.type === 'essay') {
      setCurrentPage('writing');
    } else if (item.type === 'artifact') {
      setCurrentPage('artifacts');
    } else {
      setActiveConversationId(item.referenceId);
      setCurrentPage('chat');
    }
  };

  return (
    <div className="library-container">
      {/* Header matching screenshot 4 */}
      <div className="library-header-block">
        <div className="library-title-row">
          <div className="library-icon-box">
            <Bookmark size={22} />
          </div>
          <div>
            <h1 className="library-main-title">My Library</h1>
            <p className="library-subtitle">Your essays, artifacts and important chats.</p>
          </div>
        </div>

        {/* Filter Pills matching screenshot */}
        <div className="library-controls-row">
          <div className="filter-pills-group">
            <button
              className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-pill ${activeFilter === 'essays' ? 'active' : ''}`}
              onClick={() => setActiveFilter('essays')}
            >
              Essays
            </button>
            <button
              className={`filter-pill ${activeFilter === 'artifacts' ? 'active' : ''}`}
              onClick={() => setActiveFilter('artifacts')}
            >
              Artifacts
            </button>
            <button
              className={`filter-pill ${activeFilter === 'chats' ? 'active' : ''}`}
              onClick={() => setActiveFilter('chats')}
            >
              Chats
            </button>
          </div>

          {/* Search bar */}
          <div className="library-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search saved content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="library-items-list-area">
        {filteredItems.length === 0 ? (
          <div className="library-empty-state">
            <Bookmark size={36} className="empty-icon" />
            <h3>No saved content found</h3>
            <p>Save essays from Writing Studio or artifacts from Artifact Builder to access them here.</p>
          </div>
        ) : (
          <div className="library-items-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="library-card" onClick={() => setPreviewItem(item)}>
                {/* Thumbnail / Visual indicator */}
                <div className="card-thumb-area">
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt={item.title} className="card-thumb-img" />
                  ) : (
                    <div className={`card-placeholder-thumb ${item.type}`}>
                      {item.type === 'essay' && <FileText size={22} />}
                      {item.type === 'artifact' && <Layers size={22} />}
                      {item.type === 'chat' && <MessageSquare size={22} />}
                    </div>
                  )}
                  <span className={`type-badge-pill ${item.type}`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </div>

                {/* Card Content */}
                <div className="card-info-area">
                  <h3 className="card-title font-serif">{item.title}</h3>
                  <div className="card-date-meta">
                    <Clock size={11} />
                    <span>{item.date}</span>
                  </div>
                  <p className="card-snippet">{item.snippet}</p>

                  <div className="card-tags-row">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="card-actions-area" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="item-act-btn"
                    onClick={() => handleOpenItem(item)}
                    title="Open in Workspace"
                  >
                    <ExternalLink size={15} />
                  </button>
                  <button
                    className="item-act-btn delete"
                    onClick={() => removeLibraryItem(item.id)}
                    title="Remove from library"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Preview Modal */}
      {previewItem && (
        <div className="modal-backdrop" onClick={() => setPreviewItem(null)}>
          <div className="preview-modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <div>
                <span className={`type-badge-pill ${previewItem.type}`}>
                  {previewItem.type.toUpperCase()}
                </span>
                <h2 className="preview-title font-serif">{previewItem.title}</h2>
                <span className="preview-date">Saved on {previewItem.date}</span>
              </div>
              <button className="preview-close-btn" onClick={() => setPreviewItem(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="preview-modal-body">
              <p className="preview-snippet-full">{previewItem.snippet}</p>
              {previewItem.thumbnailUrl && (
                <img src={previewItem.thumbnailUrl} alt="" className="preview-full-img" />
              )}
            </div>

            <div className="preview-modal-footer">
              <button
                className="preview-open-btn"
                onClick={() => {
                  handleOpenItem(previewItem);
                  setPreviewItem(null);
                }}
              >
                <span>Open in Editor</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .library-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          background: var(--bg-workspace);
        }

        .library-header-block {
          padding: 28px 36px 20px 36px;
          border-bottom: 1px solid var(--border-subtle);
          background: #090c14;
        }

        .library-title-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .library-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: #0284c7;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .library-main-title {
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
        }

        .library-subtitle {
          font-size: 13.5px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .library-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .filter-pills-group {
          display: flex;
          align-items: center;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          padding: 3px;
          gap: 3px;
        }

        .filter-pill {
          padding: 6px 18px;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .filter-pill.active {
          background: #2563eb;
          color: #ffffff;
          font-weight: 600;
        }

        .library-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          padding: 7px 16px;
          width: 280px;
        }

        .library-search-box input {
          flex: 1;
          background: transparent;
          border: none;
          font-size: 13px;
        }

        .library-items-list-area {
          flex: 1;
          padding: 28px 36px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .library-items-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .library-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: 16px 20px;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .library-card:hover {
          background: var(--bg-surface-hover);
          border-color: var(--border-hover);
          transform: translateY(-1px);
        }

        .card-thumb-area {
          width: 110px;
          height: 74px;
          border-radius: var(--radius-md);
          overflow: hidden;
          position: relative;
          background: var(--bg-surface-2);
          flex-shrink: 0;
        }

        .card-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-placeholder-thumb {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-placeholder-thumb.essay { background: rgba(255, 115, 54, 0.12); color: #ff7336; }
        .card-placeholder-thumb.artifact { background: rgba(168, 85, 247, 0.12); color: #a855f7; }
        .card-placeholder-thumb.chat { background: rgba(56, 189, 248, 0.12); color: #38bdf8; }

        .type-badge-pill {
          position: absolute;
          bottom: 4px;
          left: 4px;
          font-size: 9.5px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 3px;
          text-transform: uppercase;
          background: rgba(8, 10, 16, 0.85);
          color: #ffffff;
        }

        .card-info-area {
          flex: 1;
        }

        .card-title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .card-date-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--text-muted);
          margin: 3px 0 6px 0;
        }

        .card-snippet {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-tags-row {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }

        .tag-chip {
          font-size: 11px;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .card-actions-area {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .item-act-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-act-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .item-act-btn.delete:hover {
          color: var(--accent-coral);
          background: rgba(239, 68, 68, 0.1);
        }

        .library-empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-muted);
        }

        .empty-icon {
          margin-bottom: 12px;
          opacity: 0.4;
        }

        /* Preview Modal */
        .preview-modal-card {
          width: 100%;
          max-width: 600px;
          background: var(--bg-surface-1);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          padding: 24px;
        }

        .preview-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .preview-title {
          font-size: 20px;
          color: #ffffff;
          margin: 6px 0 2px 0;
        }

        .preview-date {
          font-size: 12px;
          color: var(--text-muted);
        }

        .preview-close-btn {
          color: var(--text-muted);
        }

        .preview-modal-body {
          margin-bottom: 24px;
        }

        .preview-snippet-full {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 14px;
        }

        .preview-full-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: var(--radius-md);
        }

        .preview-modal-footer {
          display: flex;
          justify-content: flex-end;
        }

        .preview-open-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--accent-primary);
          color: #ffffff;
          padding: 8px 18px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};
