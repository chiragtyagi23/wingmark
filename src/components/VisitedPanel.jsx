import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ImageOff, Send, Loader2 } from 'lucide-react';

/**
 * Recently-viewed listings popup. Displays everything tracked by
 * useVisitedListings with checkboxes, click-through to the listing,
 * bulk share, delete / clear-all actions.
 */
function VisitedPanel({
  open,
  onClose,
  entries,
  onRemove,
  onClear,
  onShare,
  shareBusy = false,
}) {
  const [selected, setSelected] = useState(() => new Set());

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setSelected(new Set());
  }, [open]);

  useEffect(() => {
    setSelected((prev) => {
      const validIds = new Set(entries.map((e) => e.id));
      const next = new Set();
      prev.forEach((id) => {
        if (validIds.has(id)) next.add(id);
      });
      return next;
    });
  }, [entries]);

  const allSelected = useMemo(
    () => entries.length > 0 && selected.size === entries.length,
    [entries.length, selected.size]
  );

  if (!open) return null;

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(entries.map((e) => e.id)));
    }
  };

  const handleRemoveSelected = () => {
    if (selected.size === 0) return;
    onRemove?.(Array.from(selected));
    setSelected(new Set());
  };

  const handleShareSelected = async () => {
    if (selected.size === 0 || shareBusy) return;
    const ids = Array.from(selected);
    await onShare?.(ids);
  };

  const handleClearAll = () => {
    if (entries.length === 0) return;
    if (
      window.confirm(
        'Clear all recently viewed listings? This cannot be undone.'
      )
    ) {
      onClear?.();
      setSelected(new Set());
    }
  };

  return (
    <>
      <div
        className="visited-panel-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="visited-panel"
        role="dialog"
        aria-label="Recently viewed listings"
      >
        <header className="visited-panel-head">
          <div>
            <h3 className="visited-panel-title">Recently Viewed</h3>
            <p className="visited-panel-sub">
              {entries.length === 0
                ? 'No listings yet - explore Land Deals or Plots to add some.'
                : `${entries.length} listing${entries.length === 1 ? '' : 's'} explored`}
            </p>
          </div>
          <button
            type="button"
            className="visited-panel-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        {entries.length > 0 && (
          <div className="visited-panel-toolbar">
            <label className="visited-panel-selectall">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
              />
              <span>{allSelected ? 'Unselect all' : 'Select all'}</span>
            </label>
            <div className="visited-panel-toolbar-actions">
              {selected.size > 0 && (
                <>
                  <button
                    type="button"
                    className="visited-panel-btn visited-panel-btn--share"
                    onClick={handleShareSelected}
                    disabled={shareBusy}
                    aria-busy={shareBusy}
                  >
                    {shareBusy ? (
                      <Loader2 size={13} className="visited-share-spin" />
                    ) : (
                      <Send size={13} />
                    )}
                    {shareBusy ? 'Preparing…' : `Share (${selected.size})`}
                  </button>
                  <button
                    type="button"
                    className="visited-panel-btn visited-panel-btn--danger"
                    onClick={handleRemoveSelected}
                    disabled={shareBusy}
                  >
                    <Trash2 size={13} />
                    Remove ({selected.size})
                  </button>
                </>
              )}
              <button
                type="button"
                className="visited-panel-btn visited-panel-btn--ghost"
                onClick={handleClearAll}
                disabled={shareBusy}
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        <div className="visited-panel-list">
          {entries.length === 0 ? (
            <div className="visited-panel-empty">
              <div className="visited-empty-icon">
                <ImageOff size={28} />
              </div>
              <div className="visited-empty-title">Nothing here yet</div>
              <div className="visited-empty-sub">
                Open any land or plot listing - it will be saved here so you can
                jump back any time.
              </div>
            </div>
          ) : (
            entries.map((entry) => {
              const isChecked = selected.has(entry.id);
              const target = `/${entry.type}/${entry.slug}`;
              return (
                <div
                  key={entry.id}
                  className={`visited-row ${isChecked ? 'is-selected' : ''}`}
                >
                  <label className="visited-row-check">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOne(entry.id)}
                      aria-label={`Select ${entry.title}`}
                    />
                  </label>

                  <Link
                    to={target}
                    className="visited-row-body"
                    onClick={onClose}
                  >
                    <div className="visited-row-thumb">
                      {entry.img ? (
                        <img src={entry.img} alt="" loading="lazy" />
                      ) : (
                        <ImageOff size={18} />
                      )}
                    </div>
                    <div className="visited-row-info">
                      <div className="visited-row-tags">
                        <span
                          className={`visited-row-tag visited-row-tag--${entry.type}`}
                        >
                          {entry.type === 'plot' ? 'Plot' : 'Land'}
                        </span>
                        {entry.listingNumber && (
                          <span className="visited-row-num">
                            {entry.listingNumber}
                          </span>
                        )}
                      </div>
                      <div className="visited-row-title">{entry.title}</div>
                      {entry.location && (
                        <div className="visited-row-loc">{entry.location}</div>
                      )}
                      {entry.price && (
                        <div className="visited-row-price">{entry.price}</div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default VisitedPanel;
