import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hand, Download, FileText, History } from 'lucide-react';
import { landListings, plotListings } from '../data';
import LeadModal from './LeadModal';
import VisitedPanel from './VisitedPanel';
import { useVisitedListings } from '../hooks/useVisitedListings';
import {
  generateBrochureFile,
  shareBrochureFiles,
  SITE_URL,
} from '../utils/generateBrochure';

/** After page loader (~2s), open “Get a Quote” on first paint of the app */
const AUTO_INTEREST_DELAY_MS = 2300;

function StickyCTA() {
  const location = useLocation();
  const path = location.pathname;
  const [activeModal, setActiveModal] = useState(null); // 'brochure' | 'interest' | null
  const [visitedOpen, setVisitedOpen] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const { entries: visitedEntries, remove: removeVisited, clear: clearVisited } =
    useVisitedListings();

  useEffect(() => {
    setVisitedOpen(false);
  }, [path]);

  const lookupListing = (entry) => {
    if (!entry) return null;
    if (entry.type === 'plot') {
      return plotListings.find((p) => p.slug === entry.slug);
    }
    return landListings.find((l) => l.slug === entry.slug);
  };

  const handleShareSelected = async (ids) => {
    if (!ids?.length || shareBusy) return;
    setShareBusy(true);
    try {
      const selectedEntries = ids
        .map((id) => visitedEntries.find((e) => e.id === id))
        .filter(Boolean);

      const files = [];
      const failures = [];
      for (const entry of selectedEntries) {
        const full = lookupListing(entry);
        if (!full) {
          failures.push(entry.title || entry.slug);
          continue;
        }
        try {
          const file = await generateBrochureFile(full, entry.type);
          files.push(file);
        } catch (e) {
          console.error('[brochure] generation failed for', entry.id, e);
          failures.push(entry.title || entry.slug);
        }
      }

      if (files.length === 0) {
        alert(
          'Could not generate any brochures. Please try again.' +
            (failures.length ? `\n\nFailed: ${failures.join(', ')}` : '')
        );
        return;
      }

      const summaryLines = selectedEntries
        .map((e) => `• ${e.title} — ${SITE_URL}/${e.type}/${e.slug}`)
        .join('\n');
      const fallbackText =
        files.length === 1
          ? `Brochure attached.\n\n${summaryLines}\n\n(PDF just downloaded — please attach it here.)`
          : `${files.length} brochures attached.\n\n${summaryLines}\n\n(PDFs just downloaded — please attach them here.)`;

      await shareBrochureFiles(files, fallbackText);

      if (failures.length) {
        alert(`Some brochures failed:\n\n${failures.join('\n')}`);
      }
    } catch (err) {
      console.error('Bulk share failed', err);
      alert(
        `Could not share brochures.\n\n${err?.message || String(err)}`
      );
    } finally {
      setShareBusy(false);
    }
  };

  const landMatch = path.match(/^\/land\/([^/]+)/);
  const plotMatch = path.match(/^\/plot\/([^/]+)/);

  let brochureUrl = '';
  let listingTitle = '';

  if (landMatch) {
    const slug = landMatch[1];
    const listing = landListings.find((l) => l.slug === slug);
    listingTitle = listing?.name || '';
    const firstPdf = listing?.files?.find((f) =>
      (f.url || '').toLowerCase().endsWith('.pdf')
    );
    brochureUrl = firstPdf?.url || '';
  } else if (plotMatch) {
    const slug = plotMatch[1];
    const plot = plotListings.find((p) => p.slug === slug);
    listingTitle = plot?.title || '';
    const firstPdf = plot?.files?.find((f) =>
      (f.url || '').toLowerCase().endsWith('.pdf')
    );
    brochureUrl = firstPdf?.url || '';
  }

  const openBrochure = () => setActiveModal('brochure');
  const openInterest = () => setActiveModal('interest');
  const closeModal = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      setActiveModal((prev) => (prev == null ? 'interest' : prev));
    }, AUTO_INTEREST_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const handleBrochureSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log('[Brochure request]', data);
    if (brochureUrl) {
      const a = document.createElement('a');
      a.href = brochureUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.download = '';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const handleInterestSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log('[Interest request]', data);
  };

  return (
    <>
      <div className="sticky-cta">
        <div className="sticky-cta-inner">
          <div className="sticky-cta-left">
            <button
              type="button"
              className="sticky-cta-btn sticky-cta-btn--outline"
              onClick={openBrochure}
            >
              {brochureUrl ? <Download size={16} /> : <FileText size={16} />}
              <span>{brochureUrl ? 'Download Brochure' : 'Request Brochure'}</span>
            </button>
          </div>

          {listingTitle && (
            <div className="sticky-cta-title" title={listingTitle}>
              {listingTitle}
            </div>
          )}

          <div className="sticky-cta-right">
            <button
              type="button"
              className="sticky-cta-btn sticky-cta-btn--primary"
              onClick={openInterest}
            >
              <span>I Am Interested</span>
              <Hand size={18} className="sticky-cta-wave" />
            </button>

            <button
              type="button"
              className={`sticky-cta-history ${visitedOpen ? 'is-active' : ''}`}
              onClick={() => setVisitedOpen((v) => !v)}
              aria-label={`Recently viewed (${visitedEntries.length})`}
              aria-expanded={visitedOpen}
              title="Recently viewed listings"
            >
              <History size={18} />
              {visitedEntries.length > 0 && (
                <span className="sticky-cta-history-badge">
                  {visitedEntries.length > 9 ? '9+' : visitedEntries.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <VisitedPanel
        open={visitedOpen}
        onClose={() => setVisitedOpen(false)}
        entries={visitedEntries}
        onRemove={removeVisited}
        onClear={clearVisited}
        onShare={handleShareSelected}
        shareBusy={shareBusy}
      />

      <LeadModal
        open={activeModal === 'brochure'}
        onClose={closeModal}
        title="Download Brochure"
        submitLabel="Submit"
        onSubmit={handleBrochureSubmit}
        context={listingTitle}
      />

      <LeadModal
        open={activeModal === 'interest'}
        onClose={closeModal}
        title="Get a Quote"
        submitLabel="Submit"
        onSubmit={handleInterestSubmit}
        context={listingTitle || "Tell us a bit about you and we'll get in touch"}
      />
    </>
  );
}

export default StickyCTA;
