import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hand, Download, FileText } from 'lucide-react';
import { landListings, plotListings } from '../data';
import LeadModal from './LeadModal';

/** After page loader (~2s), open “Get a Quote” on first paint of the app */
const AUTO_INTEREST_DELAY_MS = 2300;

function StickyCTA() {
  const location = useLocation();
  const path = location.pathname;
  const [activeModal, setActiveModal] = useState(null); // 'brochure' | 'interest' | null

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
          </div>
        </div>
      </div>

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
