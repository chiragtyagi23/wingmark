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
  red: rgb(0.84, 0.18, 0.18),
  text: rgb(0.06, 0.14, 0.26),
  muted: rgb(0.40, 0.43, 0.48),
};

async function fetchAsArrayBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.arrayBuffer();
}

function sanitizeBrochureData(data) {
  const result = { ...data };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'string') {
      result[key] = sanitizePdfText(result[key]);
    }
  }
  return result;
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
      size: 11,
      font: helvBold,
      color: PALETTE.red,
    });
    y -= 22;
  }

  const titleSize = 20;
  const titleLines = wrapText(safe.title, helvBold, titleSize, contentWidth);
  for (const line of titleLines) {
    page.drawText(line, {
      x: contentX,
      y,
      size: titleSize,
      font: helvBold,
      color: PALETTE.navy,
    });
    y -= titleSize + 5;
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

  // ---------- Detail rows (vary by listing type) ----------
  let rows;
  if (safe.pdfType === 'plot-sale') {
    rows = [
      ['Location', safe.location],
      ['Sector', safe.sector],
      ['Plot Number', safe.plotNumber],
      ['Area', safe.area],
      ['Access Road', safe.accessRoad],
      ['Stage', safe.stage],
      ['Sale Price', safe.salePrice],
      ['Comments', safe.comments],
    ];
  } else if (safe.pdfType === 'plot-jv') {
    rows = [
      ['Location', safe.location],
      ['Sector', safe.sector],
      ['Plot Number', safe.plotNumber],
      ['Area', safe.area],
      ['Access Road', safe.accessRoad],
      ['Stage', safe.stage],
      ['JV Ratio', safe.jvRatio],
      ['JV Deposit Price', safe.jvDepositPrice],
      ['Comments', safe.comments],
    ];
  } else {
    rows = [
      ['Location', safe.location],
      ['Nearest Train Station', safe.nearestTrain],
      ['Total Area', safe.area],
      ['Suitable For', safe.suitableFor],
      ['Opportunity', safe.opportunity],
      ['Key Points', safe.keyPoints],
      ['Special Features', safe.specialFeatures],
      ['Comments', safe.comments],
      ['Price', safe.price],
      ['Status', safe.status],
    ];
  }
  rows = rows.filter(([, v]) => v);

  const labelSize = 12;
  const valueSize = 15;
  const lineGap = 12;

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
    return {
      pdfType: isJv ? 'plot-jv' : 'plot-sale',
      title: item.title,
      listingNumber: item.listingNumber,
      location: item.location,
      sector: item.sector,
      plotNumber: item.plotNumber,
      area: item.area,
      accessRoad: item.accessRoad,
      stage: item.stage,
      salePrice: !isJv ? item.salePrice : '',
      jvRatio: isJv ? item.jvRatio : '',
      jvDepositPrice: isJv ? item.jvOnPrice : '',
      comments: item.comments || '',
    };
  }
  return {
    pdfType: 'land',
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
  const numMatch = (item.listingNumber || '').match(/(\d+)/);
  const num = numMatch ? numMatch[1].padStart(4, '0') : '0001';
  const fileName = `thewingsmarkinfraalisting#${num}.pdf`;
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
