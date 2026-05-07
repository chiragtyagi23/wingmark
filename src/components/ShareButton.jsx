import { SITE_URL } from '../data';

async function buildImageFile(image) {
  if (!image || typeof fetch === 'undefined') return null;
  try {
    const absolute = image.startsWith('http')
      ? image
      : `${SITE_URL.replace(/\/+$/, '')}${image.startsWith('/') ? '' : '/'}${image}`;
    const response = await fetch(absolute, { mode: 'cors' });
    if (!response.ok) return null;
    const blob = await response.blob();
    const ext = (blob.type.split('/')[1] || 'jpg').split(';')[0];
    return new File([blob], `wingsmark-${Date.now()}.${ext}`, { type: blob.type });
  } catch {
    return null;
  }
}

function ShareButton({
  title,
  message,
  className = '',
  label = 'Share on WhatsApp',
  phone,
  image,
}) {
  const handleClick = async () => {
    let url = SITE_URL ?? '';
    if (typeof window !== 'undefined') {
      const path = window.location.pathname || '/';
      const hash = window.location.hash || '';
      const base = (SITE_URL ?? window.location.origin).replace(/\/+$/, '');
      url = `${base}${path}${hash}`;
    }

    const text = `${message ? message + '\n\n' : ''}${url}`.trim();

    if (image && typeof navigator !== 'undefined' && navigator.canShare && navigator.share) {
      const file = await buildImageFile(image);
      if (file && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ title, text, files: [file] });
          return;
        } catch (err) {
          if (err?.name === 'AbortError') return;
        }
      }
    }

    if (!phone && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }

    const waBase = phone ? `https://wa.me/${phone}` : 'https://wa.me/';
    const waUrl = `${waBase}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      className={`share-btn ${className}`.trim()}
      onClick={handleClick}
      aria-label={label}
    >
      <svg viewBox="0 0 32 32" width="16" height="16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.003 3C9.376 3 4 8.373 4 14.998c0 2.32.633 4.49 1.736 6.355L4 29l7.83-1.706A11.97 11.97 0 0 0 16.003 27C22.63 27 28 21.625 28 14.998S22.63 3 16.003 3Zm0 21.668a9.66 9.66 0 0 1-4.92-1.342l-.353-.21-4.65 1.013 1.04-4.523-.23-.37a9.626 9.626 0 0 1-1.482-5.238c0-5.336 4.34-9.674 9.681-9.674s9.679 4.338 9.679 9.674c.001 5.337-4.339 9.67-9.765 9.67Zm5.31-7.244c-.29-.146-1.717-.847-1.984-.943-.265-.097-.459-.146-.652.146-.193.29-.749.943-.918 1.137-.169.193-.338.218-.628.073-.29-.145-1.226-.452-2.336-1.44-.864-.77-1.448-1.722-1.617-2.012-.169-.29-.018-.447.127-.591.13-.13.29-.338.434-.507.146-.169.193-.29.29-.483.097-.193.048-.362-.024-.507-.072-.146-.652-1.572-.894-2.151-.236-.566-.476-.49-.652-.499-.169-.008-.362-.01-.555-.01-.193 0-.507.073-.773.362-.265.29-1.013.99-1.013 2.416s1.038 2.802 1.183 2.996c.146.193 2.046 3.122 4.957 4.378.694.3 1.235.479 1.657.613.696.221 1.33.19 1.83.115.558-.083 1.717-.701 1.96-1.378.242-.677.242-1.257.169-1.378-.072-.121-.265-.193-.555-.338Z"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}

export default ShareButton;
