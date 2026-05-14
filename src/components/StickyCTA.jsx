import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Hand, ShoppingCart } from 'lucide-react';
import ShareBrochureButton from './ShareBrochureButton';
import LeadModal from './LeadModal';
import VisitedPanel from './VisitedPanel';
import { useVisitedListings } from '../hooks/useVisitedListings';
import landListings from '../api/land.json';
import plotListings from '../api/plots.json';
import {
  generateBrochureFile,
  shareBrochureFiles,
  SITE_URL,
} from '../utils/generateBrochure';

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
  const isDetailPage = Boolean(landMatch || plotMatch);

  let listingFiles = [];
  let listingTitle = '';

  if (landMatch) {
    const slug = landMatch[1];
    const listing = landListings.find((l) => l.slug === slug);
    listingTitle = listing?.name || '';
    listingFiles = (listing?.files || []).filter((f) => f?.url && f.url !== '#');
  } else if (plotMatch) {
    const slug = plotMatch[1];
    const plot = plotListings.find((p) => p.slug === slug);
    listingTitle = plot?.title || '';
    listingFiles = (plot?.files || []).filter((f) => f?.url && f.url !== '#');
  }

  let detailListing = null;
  let detailType = 'land';
  if (landMatch) {
    detailListing = landListings.find((l) => l.slug === landMatch[1]) || null;
    detailType = 'land';
  } else if (plotMatch) {
    detailListing = plotListings.find((p) => p.slug === plotMatch[1]) || null;
    detailType = 'plot';
  }

  const openBrochure = useCallback(() => setActiveModal('brochure'), []);
  const openInterest = () => setActiveModal('interest');
  const closeModal = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    if (!isDetailPage) return undefined;
    const onOpenDocuments = () => openBrochure();
    window.addEventListener('wingsmark-open-documents-modal', onOpenDocuments);
    return () =>
      window.removeEventListener('wingsmark-open-documents-modal', onOpenDocuments);
  }, [isDetailPage, openBrochure]);

  // Reserve bottom space (and tag <body>) only while the bar is visible
  // so other pages don't leave an unused gap below the footer.
  useEffect(() => {
    if (!isDetailPage) return undefined;
    document.body.classList.add('has-sticky-cta');
    return () => document.body.classList.remove('has-sticky-cta');
  }, [isDetailPage]);

  const handleBrochureSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log('[Brochure request]', data);
    if (!listingFiles.length) return;
    listingFiles.forEach((file, i) => {
      window.setTimeout(() => {
        const a = document.createElement('a');
        a.href = file.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.download = file.name || '';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 350);
    });
  };

  const handleInterestSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log('[Interest request]', data);
  };

  if (!isDetailPage) {
    return null;
  }

  return (
    <>
      <div className="sticky-cta">
        <div className="sticky-cta-inner">
          <div className="sticky-cta-left">
            {detailListing ? (
              <ShareBrochureButton
                listing={detailListing}
                type={detailType}
                buttonClassName="sticky-cta-btn sticky-cta-btn--share-wa"
              />
            ) : null}
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
              className={`sticky-cta-btn sticky-cta-btn--cart ${visitedOpen ? 'is-active' : ''}`}
              onClick={() => setVisitedOpen((v) => !v)}
              aria-label={`Add to Cart (${visitedEntries.length} item${
                visitedEntries.length === 1 ? '' : 's'
              })`}
              aria-expanded={visitedOpen}
            >
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
              {visitedEntries.length > 0 && (
                <span className="sticky-cta-cart-badge">
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
        title="Download All Documents"
        submitLabel="Submit"
        onSubmit={handleBrochureSubmit}
        context={listingTitle}
      />

      <LeadModal
        open={activeModal === 'interest'}
        onClose={closeModal}
        title="Post Your Enquiry"
        submitLabel="Submit"
        onSubmit={handleInterestSubmit}
        context={listingTitle || "Tell us a bit about you and we'll get in touch"}
      />
    </>
  );
}

export default StickyCTA;
