import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Letterhead files in /public — first fetch that returns 200 wins.
 * (Users sometimes save with different spelling/casing.)
 */
const LETTERHEAD_CANDIDATES = [
  '/black beige Modern Business Letterhead.pdf',
  '/Black Beige Modern Business Letterhead.pdf',
  '/White Green and Gold Modern Minimal Business Letterhead.pdf',
  '/white green and gold modern minimal bussiness lerrerhead.pdf',
  '/letterhead.pdf',
].map((p) => encodeURI(p));

/**
 * Standard 14 fonts only support WinAnsi. Unicode (e.g. ₹, smart quotes,
 * en-dash) makes pdf-lib throw "WinAnsi cannot encode …".
 */
export function sanitizePdfText(text) {
  if (text == null || text === undefined) return '';
  let s = String(text)
    .replace(/\u20B9/g, 'Rs.')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u2018\u2019\u2032]/g, "'")
    .replace(/[\u201C\u201D\u2033]/g, '"')
    .replace(/\u2013|\u2014|\u2212/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00B7/g, '.');
  let out = '';
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    if (code === 0x0a || code === 0x0d || code === 0x09) {
      out += ch;
      continue;
    }
    if (code >= 0x20 && code <= 0x7e) {
      out += ch;
      continue;
    }
    if (code >= 0xa1 && code <= 0xff) {
      out += ch;
      continue;
    }
  }
  return out;
}

async function fetchLetterheadBytes() {
  let lastErr;
  for (const url of LETTERHEAD_CANDIDATES) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        lastErr = new Error(`Letterhead not found (${res.status}): ${url}`);
        continue;
      }
      return await res.arrayBuffer();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('No letterhead PDF could be loaded from /public.');
}

const PALETTE = {
  navy: rgb(0.04, 0.10, 0.18),
  gold: rgb(0.97, 0.78, 0.10),
  text: rgb(0.16, 0.20, 0.25),
  muted: rgb(0.40, 0.43, 0.48),
};

async function fetchAsArrayBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.arrayBuffer();
}

function sanitizeBrochureData(data) {
  const keyPointsRaw = Array.isArray(data.keyPoints)
    ? data.keyPoints.join('\n')
    : data.keyPoints;
  return {
    ...data,
    listingNumber: sanitizePdfText(data.listingNumber),
    title: sanitizePdfText(data.title),
    location: sanitizePdfText(data.location),
    nearestTrain: sanitizePdfText(data.nearestTrain),
    area: sanitizePdfText(data.area),
    suitableFor: sanitizePdfText(data.suitableFor),
    opportunity: sanitizePdfText(data.opportunity),
    keyPoints: sanitizePdfText(keyPointsRaw),
    specialFeatures: sanitizePdfText(data.specialFeatures),
    comments: sanitizePdfText(data.comments ?? data.specialComments),
    price: sanitizePdfText(data.price),
    status: sanitizePdfText(data.status),
    specialComments: sanitizePdfText(data.specialComments),
    description: sanitizePdfText(data.description),
    listingUrl: sanitizePdfText(data.listingUrl),
  };
}

function loadHtmlImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Image failed to load: ${url}`));
    img.src = url;
  });
}

/**
 * Decode any browser-supported image (PNG variants, WebP, JPG, …) and
 * re-encode it as JPEG so pdf-lib can embed it reliably.
 * pdf-lib's embedPng silently fails on indexed/interlaced PNGs — going
 * through a canvas avoids that whole class of issues.
 */
async function tryEmbedImage(pdfDoc, url) {
  if (!url) return null;
  try {
    const img = await loadHtmlImage(url);
    let w = img.naturalWidth || img.width;
    let h = img.naturalHeight || img.height;
    if (!w || !h) return null;

    const MAX = 1600;
    if (w > MAX || h > MAX) {
      const scale = MAX / Math.max(w, h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const base64 = dataUrl.split(',')[1];
    if (!base64) return null;

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    return await pdfDoc.embedJpg(bytes);
  } catch (e) {
    console.warn('[brochure] image embed failed for', url, e);
    return null;
  }
}

/**
 * Pure word-wrap based on the rendered width of `font` at `fontSize`.
 * Returns an array of lines that fit inside `maxWidth`.
 */
function wrapText(text, font, fontSize, maxWidth) {
  if (!text) return [];
  const paragraphs = String(text).split(/\n+/);
  const lines = [];
  for (const p of paragraphs) {
    const words = p.split(/\s+/);
    let line = '';
    for (const w of words) {
      const candidate = line ? `${line} ${w}` : w;
      const wWidth = font.widthOfTextAtSize(candidate, fontSize);
      if (wWidth > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

/**
 * Generate a single-page (or two-page) brochure PDF by drawing the
 * listing's content onto the existing letterhead.
 *
 * @param {{
 *   title: string,
 *   listingNumber?: string,
 *   location?: string,
 *   area?: string,
 *   suitableFor?: string,
 *   opportunity?: string,
 *   nearestTrain?: string,
 *   keyPoints?: string,
 *   specialFeatures?: string,
 *   comments?: string,
 *   price?: string,
 *   status?: string,
 *   specialComments?: string,
 *   description?: string,
 *   imageUrl?: string,
 *   listingUrl?: string,
 * }} data
 * @returns {Promise<Blob>}
 */
export async function generateListingBrochure(data) {
  const safe = sanitizeBrochureData(data);
  const letterheadBytes = await fetchLetterheadBytes();
  const pdfDoc = await PDFDocument.load(letterheadBytes, {
    ignoreEncryption: true,
  });

  const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const pages = pdfDoc.getPages();
  if (!pages.length) {
    throw new Error('Letterhead PDF has no pages.');
  }
  const page = pages[0];
  const { width, height } = page.getSize();

  // Adjust these if your letterhead's header/footer artwork takes up
  // more or less vertical space.
  const margin = 56;
  const headerSpace = 150;
  const footerSpace = 110;
  const contentX = margin;
  const contentWidth = width - margin * 2;
  const minY = footerSpace;
  let y = height - headerSpace;

  // ---------- Title block ----------
  if (safe.listingNumber) {
    page.drawText(String(safe.listingNumber), {
      x: contentX,
      y,
      size: 9,
      font: helvBold,
      color: PALETTE.gold,
    });
    y -= 14;
  }

  const titleSize = 17;
  const titleLines = wrapText(safe.title, helvBold, titleSize, contentWidth);
  for (const line of titleLines) {
    page.drawText(line, {
      x: contentX,
      y,
      size: titleSize,
      font: helvBold,
      color: PALETTE.navy,
    });
    y -= titleSize + 4;
  }

  if (safe.location) {
    y -= 4;
    page.drawText(String(safe.location).toUpperCase(), {
      x: contentX,
      y,
      size: 9,
      font: helv,
      color: PALETTE.muted,
    });
    y -= 14;
  }

  // gold divider
  y -= 4;
  page.drawRectangle({
    x: contentX,
    y,
    width: 56,
    height: 2,
    color: PALETTE.gold,
  });
  y -= 18;

  // ---------- Two gallery images side by side ----------
  const imgUrls = data.galleryUrls?.length ? data.galleryUrls.slice(0, 2) : (data.imageUrl ? [data.imageUrl] : []);
  if (imgUrls.length > 0) {
    const embedPromises = imgUrls.map((u) => tryEmbedImage(pdfDoc, u));
    const embedded = (await Promise.all(embedPromises)).filter(Boolean);

    if (embedded.length === 2) {
      const gap = 12;
      const halfW = (contentWidth - gap) / 2;
      const maxImgH = 140;
      const heights = embedded.map((img) => {
        const ratio = img.height / img.width;
        return Math.min(maxImgH, halfW * ratio);
      });
      const drawH = Math.max(...heights);
      y -= drawH;
      for (let i = 0; i < 2; i++) {
        const img = embedded[i];
        const ratio = img.height / img.width;
        const h = Math.min(maxImgH, halfW * ratio);
        const w = h / ratio;
        const x = contentX + i * (halfW + gap) + (halfW - w) / 2;
        const imgY = y + (drawH - h);
        page.drawImage(img, { x, y: imgY, width: w, height: h });
      }
      y -= 14;
    } else if (embedded.length === 1) {
      const img = embedded[0];
      const ratio = img.height / img.width;
      const drawH = Math.min(150, contentWidth * ratio);
      const drawW = drawH / ratio;
      const drawX = contentX + (contentWidth - drawW) / 2;
      y -= drawH;
      page.drawImage(img, { x: drawX, y, width: drawW, height: drawH });
      y -= 14;
    }
  }

  // ---------- Detail rows ----------
  const rows = [
    ['Nearest Train Station', safe.nearestTrain],
    ['Total Area', safe.area],
    ['Suitable For', safe.suitableFor],
    ['Opportunity', safe.opportunity],
    ['Key Points', safe.keyPoints],
    ['Special Features', safe.specialFeatures],
    ['Comments', safe.comments],
    ['Price', safe.price],
    ['Status', safe.status],
  ].filter(([, v]) => v);

  const labelSize = 8;
  const valueSize = 11;
  const lineGap = 6;

  for (const [label, value] of rows) {
    const valueLines = wrapText(value, helv, valueSize, contentWidth);
    const blockHeight = labelSize + 4 + valueLines.length * (valueSize + 2) + lineGap;
    if (y - blockHeight < minY) break;
    page.drawText(label.toUpperCase(), {
      x: contentX,
      y,
      size: labelSize,
      font: helvBold,
      color: PALETTE.gold,
    });
    y -= labelSize + 4;
    for (const line of valueLines) {
      page.drawText(line, {
        x: contentX,
        y,
        size: valueSize,
        font: helv,
        color: PALETTE.text,
      });
      y -= valueSize + 2;
    }
    y -= lineGap;
  }

  // ---------- Description ----------
  if (safe.description && y > minY + 60) {
    page.drawText('DESCRIPTION', {
      x: contentX,
      y,
      size: labelSize,
      font: helvBold,
      color: PALETTE.gold,
    });
    y -= labelSize + 4;
    const descLines = wrapText(safe.description, helv, valueSize, contentWidth);
    for (const line of descLines) {
      if (y < minY + 14) break;
      page.drawText(line, {
        x: contentX,
        y,
        size: valueSize,
        font: helv,
        color: PALETTE.text,
      });
      y -= valueSize + 2;
    }
    y -= lineGap;
  }

  // ---------- Microsite URL ----------
  if (safe.listingUrl && y > minY + 18) {
    y -= 4;
    page.drawText('VIEW FULL MICROSITE', {
      x: contentX,
      y,
      size: labelSize,
      font: helvBold,
      color: PALETTE.gold,
    });
    y -= labelSize + 3;
    page.drawText(String(safe.listingUrl), {
      x: contentX,
      y,
      size: 10,
      font: helvOblique,
      color: PALETTE.navy,
    });
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: 'application/pdf' });
}

/**
 * Download a Blob as a file with the given filename.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/* =====================================================
   Shared constants + share helpers
   (used by ShareBrochureButton and the Recently-Viewed panel)
   ===================================================== */

export const SITE_URL = 'https://wingmark.vercel.app';

/** Locked recipient for WhatsApp deliveries (wa.me format, no `+`). */
export const WHATSAPP_BROCHURE_NUMBER = '9971559902';

/**
 * Map a raw listing object (`landListings` / `plotListings` entry) into
 * the shape `generateListingBrochure` expects.
 */
export function buildBrochureData(item, type) {
  if (!item) return null;
  if (type === 'plot') {
    const isJv = item.plotType === 'jv';
    const plotGallery = item.gallery?.length ? item.gallery : [item.img].filter(Boolean);
    return {
      title: item.title,
      listingNumber: item.listingNumber,
      location: item.location,
      area: item.area,
      suitableFor: item.sector ? `Sector: ${item.sector}` : '',
      opportunity: item.accessRoad ? `Access road: ${item.accessRoad}` : '',
      price: isJv ? item.jvOnPrice : item.salePrice,
      status: item.stage,
      specialComments: item.validityDays
        ? `Validity: ${item.validityDays} days`
        : '',
      description: item.snapshot?.join(' ') || item.description || '',
      imageUrl: item.img,
      galleryUrls: plotGallery.slice(0, 2),
      listingUrl: `${SITE_URL}/plot/${item.slug}`,
    };
  }
  const gallery = item.gallery?.length ? item.gallery : [item.img].filter(Boolean);
  return {
    title: item.name,
    listingNumber: item.listingNumber,
    location: item.loc,
    nearestTrain: item.nearestStation,
    area: item.area,
    suitableFor: item.suitableFor,
    opportunity: item.opportunity,
    keyPoints: Array.isArray(item.keyPoints)
      ? item.keyPoints.join('\n')
      : item.keyPoints || '',
    specialFeatures: item.specialFeatures || '',
    comments: item.comments ?? item.specialComments ?? '',
    price: item.price,
    status: item.status,
    specialComments: item.specialComments,
    description: item.snapshot?.join(' ') || item.description || '',
    imageUrl: item.img,
    galleryUrls: gallery.slice(0, 2),
    listingUrl: `${SITE_URL}/land/${item.slug}`,
  };
}

/**
 * Build a single brochure PDF as a `File` ready for `navigator.share`
 * or for direct download.
 */
export async function generateBrochureFile(item, type) {
  const data = buildBrochureData(item, type);
  if (!data) throw new Error('Missing listing data for brochure.');
  const blob = await generateListingBrochure(data);
  const fileName = `${item.slug || 'wingsmark'}-brochure.pdf`;
  return new File([blob], fileName, { type: 'application/pdf' });
}

/**
 * Share an array of one or more brochure files. On mobile this opens
 * the native share sheet (PDFs auto-attach). On desktop the files are
 * downloaded sequentially and a WhatsApp Web chat opens to the fixed
 * number so the user can drag-drop them in.
 *
 * Returns true if any share/download path executed.
 */
export async function shareBrochureFiles(files, fallbackText) {
  if (!files || !files.length) return false;

  const canShareFiles =
    typeof navigator !== 'undefined' &&
    navigator.canShare &&
    navigator.canShare({ files });

  if (canShareFiles) {
    try {
      await navigator.share({ files });
      return true;
    } catch (err) {
      if (err && err.name === 'AbortError') return false;
    }
  }

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const url = URL.createObjectURL(f);
    const a = document.createElement('a');
    a.href = url;
    a.download = f.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2500);
    if (i < files.length - 1) {
      await new Promise((r) => setTimeout(r, 220));
    }
  }

  const fallbackMsg =
    fallbackText ||
    `${files.length} brochure${files.length === 1 ? '' : 's'} just downloaded — please attach from your device.`;
  const waUrl =
    `https://wa.me/${WHATSAPP_BROCHURE_NUMBER}?text=` +
    encodeURIComponent(fallbackMsg);
  setTimeout(() => {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }, files.length * 220 + 250);

  return true;
}
