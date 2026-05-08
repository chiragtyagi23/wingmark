import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import {
  buildBrochureData,
  generateBrochureFile,
  shareBrochureFiles,
} from '../utils/generateBrochure';

function buildShareText({ title, location, price, listingUrl }) {
  const lines = [`*${title || 'Listing'}*`];
  if (location) lines.push(`Location: ${location}`);
  if (price) lines.push(`Price: ${price}`);
  if (listingUrl) {
    lines.push('');
    lines.push(`View full microsite: ${listingUrl}`);
  }
  return lines.join('\n');
}

function ShareBrochureButton({
  listing,
  type = 'land',
  label = 'Send This Listing on WhatsApp',
}) {
  const [busy, setBusy] = useState(false);

  const handleShare = async () => {
    if (busy) return;
    setBusy(true);

    try {
      const file = await generateBrochureFile(listing, type);
      const data = buildBrochureData(listing, type);
      const fallbackText =
        `${buildShareText(data)}\n\n(Brochure PDF just downloaded — please drag it into this chat to attach.)`;
      await shareBrochureFiles([file], fallbackText);
    } catch (err) {
      console.error('Brochure share failed', err);
      const msg = (err && err.message) || String(err);
      alert(
        `Could not generate the brochure.\n\n${msg}\n\nIf this persists, open the browser console (F12) for details.`
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className="btn-share-brochure"
      onClick={handleShare}
      disabled={busy}
      aria-busy={busy}
    >
      {busy ? <Loader2 size={16} className="btn-share-spin" /> : <Send size={16} />}
      <span>{busy ? 'Preparing…' : label}</span>
    </button>
  );
}

export default ShareBrochureButton;
