import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import {
  formatLandOpportunity,
  formatMultiline,
  formatSingleBullet,
  formatSuitableFor,
} from './listingTextFormat';

let _fontRegCache = null;
let _fontBoldCache = null;

async function fetchFontPair() {
  if (_fontRegCache && _fontBoldCache)
    return { reg: _fontRegCache, bold: _fontBoldCache };
  try {
    const [r1, r2] = await Promise.all([
      fetch('/NotoSans-Regular.ttf'),
      fetch('/NotoSans-Bold.ttf'),
    ]);
    if (!r1.ok || !r2.ok) return null;
    _fontRegCache = await r1.arrayBuffer();
    _fontBoldCache = await r2.arrayBuffer();
    return { reg: _fontRegCache, bold: _fontBoldCache };
  } catch {
    return null;
  }
}

/**
 * Letterhead files in /public - first fetch that returns 200 wins.
 * (Users sometimes save with different spelling/casing.)
 */
const LETTERHEAD_CANDIDATES = [
  '/black beige Modern Business Letterhead (5).pdf',
  '/black beige Modern Business Letterhead (3).pdf',
].map((p) => encodeURI(p));

/**
 * Standard 14 fonts only support WinAnsi. Unicode (e.g. ₹, smart quotes,
 * en-dash) makes pdf-lib throw "WinAnsi cannot encode …".
 */
export function sanitizePdfText(text) {
  if (text == null || text === undefined) return '';
  let s = String(text)
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
    if (code === 0x20b9) {
      out += ch;
      continue;
    }
    /* Bullet (same as listing UI) - requires embedded Unicode font (Noto). */
    if (code === 0x2022) {
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
  navy: rgb(0.078, 0.247, 0.404),
  gold: rgb(0.80, 0.60, 0.0),
  red: rgb(0.84, 0.18, 0.18),
  text: rgb(0.06, 0.14, 0.26),
  muted: rgb(0.40, 0.43, 0.48),
};

async function fetchAsArrayBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.arrayBuffer();
}

const SKIP_SANITIZE = new Set(['imageUrl', 'locationImageUrl', 'listingUrl', 'googleMapsUrl']);

function sanitizeBrochureData(data) {
  const result = { ...data };
  for (const key of Object.keys(result)) {
    if (key === 'galleryUrls') continue;
    if (typeof result[key] === 'string' && !SKIP_SANITIZE.has(key)) {
      result[key] = sanitizePdfText(result[key]);
    }
  }
  return result;
}

/** WhatsApp / brochure gallery: max 8 images = 2 compilation pages × 4 images. */
export const MAX_BROCHURE_GALLERY_IMAGES = 8;

/** Ordered unique image URLs for gallery pages (hero, gallery, extra location shot). */
function collectGalleryUrls(item) {
  if (!item) return [];
  const urls = [];
  const seen = new Set();
  const add = (u) => {
    if (u == null || u === '' || u === '#') return;
    const s = String(u).trim();
    if (!s || seen.has(s)) return;
    seen.add(s);
    urls.push(s);
  };
  add(item.img);
  if (Array.isArray(item.gallery)) {
    for (const g of item.gallery) add(g);
  }
  add(item.locationImage);
  return urls.slice(0, MAX_BROCHURE_GALLERY_IMAGES);
}

/**
 * Embed an image into the PDF. Tries multiple strategies:
 *   1. Fetch raw bytes → embedJpg or embedPng directly
 *   2. If direct embed fails, re-encode through canvas → dataURL → embedJpg
 */
async function tryEmbedImage(pdfDoc, url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch ${res.status}`);
    const arrBuf = await res.arrayBuffer();
    const bytes = new Uint8Array(arrBuf);

    const isJpg = bytes[0] === 0xff && bytes[1] === 0xd8;
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47;

    // Strategy 1: direct embed
    if (isJpg) {
      try {
        return await pdfDoc.embedJpg(bytes);
      } catch { /* fall through to canvas */ }
    }
    if (isPng) {
      try {
        return await pdfDoc.embedPng(bytes);
      } catch { /* fall through to canvas */ }
    }

    // Strategy 2: canvas re-encode (handles all browser-decodable formats)
    const blob = new Blob([bytes]);
    const blobUrl = URL.createObjectURL(blob);
    try {
      const img = await new Promise((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('img decode failed'));
        el.src = blobUrl;
      });

      let w = img.naturalWidth || img.width;
      let h = img.naturalHeight || img.height;
      if (!w || !h) return null;

      const MAX = 800;
      if (w > MAX || h > MAX) {
        const s = MAX / Math.max(w, h);
        w = Math.round(w * s);
        h = Math.round(h * s);
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.80);
      const b64 = dataUrl.split(',')[1];
      if (!b64) return null;
      const raw = atob(b64);
      const jpgBytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) jpgBytes[i] = raw.charCodeAt(i);
      return await pdfDoc.embedJpg(jpgBytes);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (e) {
    console.warn('[brochure] image embed failed for', url, e);
    return null;
  }
}

const PDF_BULLET_PREFIX = /^\s*[•\u2022\-–—]\s*/;
const PDF_BULLET_LEAD = '• ';

/** Word-wrap plain text (no bullet) to fit `maxWidth`. */
function wrapWords(text, font, fontSize, maxWidth) {
  if (!text) return [];
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const w of words) {
    const candidate = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(candidate, fontSize) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Word-wrap for PDF body copy. Bullet paragraphs use a hanging indent so
 * wrapped lines align under the text after "• ", not under the bullet.
 * @returns {{ text: string, indent: number }[]}
 */
function wrapText(text, font, fontSize, maxWidth) {
  if (!text) return [];
  const paragraphs = String(text).split(/\n+/);
  const lines = [];
  const bulletIndent = font.widthOfTextAtSize(PDF_BULLET_LEAD, fontSize);

  let hangContinuation = false;

  for (const raw of paragraphs) {
    const p = raw.trim();
    if (!p) continue;

    if (PDF_BULLET_PREFIX.test(p)) {
      hangContinuation = true;
      const body = p.replace(PDF_BULLET_PREFIX, '').trim();
      const bodyLines = wrapWords(body, font, fontSize, maxWidth - bulletIndent);
      for (let i = 0; i < bodyLines.length; i += 1) {
        lines.push({
          text: i === 0 ? PDF_BULLET_LEAD + bodyLines[i] : bodyLines[i],
          indent: i === 0 ? 0 : bulletIndent,
        });
      }
    } else if (hangContinuation) {
      const contLines = wrapWords(p, font, fontSize, maxWidth - bulletIndent);
      for (const cl of contLines) {
        lines.push({ text: cl, indent: bulletIndent });
      }
    } else {
      hangContinuation = false;
      for (const plain of wrapWords(p, font, fontSize, maxWidth)) {
        lines.push({ text: plain, indent: 0 });
      }
    }
  }
  return lines;
}

/** Gallery pages: clean header strip (no letterhead watermark). */
const GALLERY_HEADER_H = 92;
const GALLERY_PAGE_MARGIN = 36;
const GALLERY_CELL_GAP = 10;

function drawGalleryHeaderOnly(pg, pageWidth, pageHeight, helvBold) {
  const bandH = GALLERY_HEADER_H;
  pg.drawRectangle({
    x: 0,
    y: pageHeight - bandH,
    width: pageWidth,
    height: bandH,
    color: PALETTE.navy,
  });
  const title = 'THE WINGSMARK INFRAA';
  const sz = 15;
  const tw = helvBold.widthOfTextAtSize(title, sz);
  const textY = pageHeight - bandH / 2 - sz * 0.32;
  pg.drawText(title, {
    x: (pageWidth - tw) / 2,
    y: textY,
    size: sz,
    font: helvBold,
    color: PALETTE.gold,
  });
  pg.drawRectangle({
    x: 0,
    y: pageHeight - bandH - 3,
    width: pageWidth,
    height: 3,
    color: PALETTE.gold,
  });
}

/**
 * @param {'cover'|'contain'} mode cover = fill cell (one full-page image); contain = fit inside cell
 */
function drawImageInCell(page, emb, cellX, cellY, cellW, cellH, mode) {
  const iw = emb.width;
  const ih = emb.height;
  const ar = iw / ih;
  const arC = cellW / cellH;
  let drawW;
  let drawH;
  if (mode === 'cover') {
    if (ar > arC) {
      drawH = cellH;
      drawW = drawH * ar;
    } else {
      drawW = cellW;
      drawH = drawW / ar;
    }
  } else if (ar > arC) {
    drawW = cellW;
    drawH = drawW / ar;
  } else {
    drawH = cellH;
    drawW = drawH * ar;
  }
  const drawX = cellX + (cellW - drawW) / 2;
  const drawY = cellY + (cellH - drawH) / 2;
  page.drawRectangle({
    x: cellX,
    y: cellY,
    width: cellW,
    height: cellH,
    color: rgb(1, 1, 1),
  });
  page.drawImage(emb, {
    x: drawX,
    y: drawY,
    width: drawW,
    height: drawH,
  });
  page.drawRectangle({
    x: cellX,
    y: cellY,
    width: cellW,
    height: cellH,
    borderColor: PALETTE.gold,
    borderWidth: 2,
  });
}

/** Bottom-left (x,y), width, height for each cell; n = 1..4 */
function galleryCellRects(n, pageWidth, pageHeight) {
  const margin = GALLERY_PAGE_MARGIN;
  const areaYMin = margin;
  const areaYMax = pageHeight - GALLERY_HEADER_H - 18;
  const W = pageWidth - 2 * margin;
  const H = areaYMax - areaYMin;
  const g = GALLERY_CELL_GAP;
  const cells = [];
  if (n <= 0) return cells;
  if (n === 1) {
    cells.push({ x: margin, y: areaYMin, w: W, h: H });
  } else if (n === 2) {
    const ch = (H - g) / 2;
    cells.push({ x: margin, y: areaYMin + ch + g, w: W, h: ch });
    cells.push({ x: margin, y: areaYMin, w: W, h: ch });
  } else if (n === 3) {
    const hTop = Math.round((H - g) * 0.56);
    const hBot = H - g - hTop;
    cells.push({ x: margin, y: areaYMin + hBot + g, w: W, h: hTop });
    const bw = (W - g) / 2;
    cells.push({ x: margin, y: areaYMin, w: bw, h: hBot });
    cells.push({ x: margin + bw + g, y: areaYMin, w: bw, h: hBot });
  } else {
    const ch = (H - g) / 2;
    const cw = (W - g) / 2;
    cells.push({ x: margin, y: areaYMin, w: cw, h: ch });
    cells.push({ x: margin + cw + g, y: areaYMin, w: cw, h: ch });
    cells.push({ x: margin, y: areaYMin + ch + g, w: cw, h: ch });
    cells.push({ x: margin + cw + g, y: areaYMin + ch + g, w: cw, h: ch });
  }
  return cells;
}

/** Letterhead source files sometimes ship with extra blank pages - keep only page 1. */
function trimDocToSinglePage(doc) {
  const n = doc.getPageCount();
  for (let i = n - 1; i >= 1; i -= 1) {
    doc.removePage(i);
  }
}

/**
 * Listing # badge on text (letterhead) pages - not used on image gallery pages.
 * Returns Y for the next content (title or body) below the badge.
 */
function contentYAfterListingBadge(
  targetPage,
  helvBold,
  contentX,
  contentWidth,
  pageHeight,
  headerSpace,
  listingNumber
) {
  let y = pageHeight - headerSpace;
  if (!listingNumber || !String(listingNumber).trim()) return y;
  const badgeText = String(listingNumber).toUpperCase();
  const badgeFontSize = 13;
  const badgePadH = 18;
  const badgePadV = 8;
  const badgeTextWidth = helvBold.widthOfTextAtSize(badgeText, badgeFontSize);
  const badgeW = badgeTextWidth + badgePadH * 2;
  const badgeH = badgeFontSize + badgePadV * 2;
  const badgeX = contentX + (contentWidth - badgeW) / 2;
  const badgeY = y - badgeH + badgePadV;

  targetPage.drawRectangle({
    x: badgeX,
    y: badgeY,
    width: badgeW,
    height: badgeH,
    color: rgb(1, 1, 1),
    borderColor: PALETTE.navy,
    borderWidth: 1.5,
  });

  targetPage.drawText(badgeText, {
    x: badgeX + badgePadH,
    y: badgeY + badgePadV,
    size: badgeFontSize,
    font: helvBold,
    color: PALETTE.red,
  });
  return y - badgeH - 24;
}

/**
 * After text pages: blank pages with Wingsmark header only + listing images.
 * Up to 4 images per page; max {@link MAX_BROCHURE_GALLERY_IMAGES} images (2 pages).
 * Layouts: 1 full, 2 landscape strips, 3 (1+2), 4 (2x2).
 */
async function appendListingGalleryPages(pdfDoc, galleryUrls, pageWidth, pageHeight, helvBold) {
  const urls = (galleryUrls || []).slice(0, MAX_BROCHURE_GALLERY_IMAGES);
  if (!urls.length) return;
  for (let i = 0; i < urls.length; i += 4) {
    const batch = urls.slice(i, i + 4);
    const n = batch.length;
    const pg = pdfDoc.addPage([pageWidth, pageHeight]);
    pg.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
      color: rgb(1, 1, 1),
    });
    drawGalleryHeaderOnly(pg, pageWidth, pageHeight, helvBold);
    const cells = galleryCellRects(n, pageWidth, pageHeight);
    const embeds = await Promise.all(batch.map((u) => tryEmbedImage(pdfDoc, u)));
    for (let j = 0; j < n; j++) {
      const cell = cells[j];
      const emb = embeds[j];
      if (!emb) {
        pg.drawRectangle({
          x: cell.x,
          y: cell.y,
          width: cell.w,
          height: cell.h,
          color: rgb(0.96, 0.96, 0.96),
          borderColor: PALETTE.gold,
          borderWidth: 2,
        });
        continue;
      }
      const mode = n === 1 ? 'cover' : 'contain';
      drawImageInCell(pg, emb, cell.x, cell.y, cell.w, cell.h, mode);
    }
  }
}

/**
 * Multi-page brochure: listing text on letterhead (with overflow pages),
 * then optional gallery pages (Wingsmark header only, no watermark) with
 * up to four images per page, maximum eight images (two gallery pages).
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
 *   snapshot?: string,
 *   googleMapsUrl?: string,
 *   address?: string,
 *   galleryUrls?: string[],
 * }} data
 * @returns {Promise<Blob>}
 */
export async function generateListingBrochure(data) {
  const safe = sanitizeBrochureData(data);
  const letterheadBytes = await fetchLetterheadBytes();
  const pdfDoc = await PDFDocument.load(letterheadBytes, {
    ignoreEncryption: true,
  });
  /** Pristine pages for overflow (page 0 must not be copied after content is drawn on it). */
  const lhTemplate = await PDFDocument.load(letterheadBytes, {
    ignoreEncryption: true,
  });
  trimDocToSinglePage(pdfDoc);
  trimDocToSinglePage(lhTemplate);

  pdfDoc.registerFontkit(fontkit);
  const fontPair = await fetchFontPair();
  let helv, helvBold, helvOblique;
  if (fontPair) {
    helv = await pdfDoc.embedFont(fontPair.reg, { subset: true });
    helvBold = await pdfDoc.embedFont(fontPair.bold, { subset: true });
    helvOblique = helv;
  } else {
    helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
    helvBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    helvOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  }

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
  let y = contentYAfterListingBadge(
    page,
    helvBold,
    contentX,
    contentWidth,
    height,
    headerSpace,
    safe.listingNumber
  );

  // ---------- Title with red underline (first text page only) ----------
  const titleSize = 20;
  const titleLines = wrapWords(safe.title, helvBold, titleSize, contentWidth);
  for (const line of titleLines) {
    const lineW = helvBold.widthOfTextAtSize(line, titleSize);
    const lineX = contentX + (contentWidth - lineW) / 2;
    page.drawText(line, {
      x: lineX,
      y,
      size: titleSize,
      font: helvBold,
      color: PALETTE.navy,
    });
    y -= titleSize + 1;
  }
  y -= 20;

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
      ['Comments / Approvals', safe.comments],
      ['Price', safe.price],
      ['Status', safe.status],
    ];
  }
  rows = rows.filter(([, v]) => v);

  const labelSize = 12;
  const valueSize = 15;
  const lineGap = 10;
  const valueLineHeight = valueSize + 2;
  const labelBlockHeight = labelSize + 10;
  /** Body copy: same dark navy as the listing title. */
  const bodyInk = PALETTE.navy;

  let drawPage = page;
  let yCursor = y;

  const startFreshPage = async () => {
    const [np] = await pdfDoc.copyPages(lhTemplate, [0]);
    pdfDoc.addPage(np);
    return pdfDoc.getPages().at(-1);
  };

  /** Continue on a new letterhead page — no extra badge (maximises usable height). */
  const continueOnNewPage = async () => {
    drawPage = await startFreshPage();
    yCursor = height - headerSpace;
  };

  for (const [label, value] of rows) {
    const valueLines = wrapText(value, helv, valueSize, contentWidth);
    if (!valueLines.length) continue;

    const labelText = label.toUpperCase();
    const labelW = helvBold.widthOfTextAtSize(labelText, labelSize);
    const drawFieldLabel = () => {
      drawPage.drawText(labelText, {
        x: contentX,
        y: yCursor,
        size: labelSize,
        font: helvBold,
        color: PALETTE.gold,
      });
      drawPage.drawRectangle({
        x: contentX,
        y: yCursor - 3,
        width: labelW,
        height: 1.2,
        color: PALETTE.gold,
      });
      yCursor -= labelBlockHeight;
    };

    let lineIdx = 0;
    let labelDrawn = false;

    while (lineIdx < valueLines.length) {
      const needsLabel = !labelDrawn;
      const required = (needsLabel ? labelBlockHeight : 0) + valueLineHeight;
      if (yCursor - required < minY) {
        await continueOnNewPage();
        labelDrawn = false;
        continue;
      }
      if (needsLabel) {
        drawFieldLabel();
        labelDrawn = true;
      }
      const row = valueLines[lineIdx];
      drawPage.drawText(row.text, {
        x: contentX + (row.indent || 0),
        y: yCursor,
        size: valueSize,
        font: helv,
        color: bodyInk,
      });
      yCursor -= valueLineHeight;
      lineIdx += 1;
    }
    yCursor -= lineGap;
  }

  await appendListingGalleryPages(
    pdfDoc,
    safe.galleryUrls || [],
    width,
    height,
    helvBold
  );

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
    const secondImg = item.gallery?.find((g) => g !== item.img) || '';
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
      imageUrl: item.img || '',
      locationImageUrl: secondImg,
      listingUrl: `${SITE_URL}/plot/${item.slug}`,
      galleryUrls: collectGalleryUrls(item),
    };
  }
  return {
    pdfType: 'land',
    title: item.name,
    listingNumber: item.listingNumber,
    location: item.loc,
    nearestTrain: formatSingleBullet(item.nearestStation),
    area: formatSingleBullet(item.area),
    suitableFor: formatSuitableFor(item.suitableFor),
    opportunity: formatLandOpportunity(item),
    keyPoints: formatMultiline(item.keyPoints),
    specialFeatures: formatMultiline(item.specialFeatures || ''),
    comments: formatMultiline(item.comments ?? item.specialComments ?? ''),
    price: formatSingleBullet(item.price),
    status: formatSingleBullet(item.status),
    imageUrl: item.img || '',
    locationImageUrl:
      (item.locationImage && item.locationImage !== item.img
        ? item.locationImage
        : null) ||
      item.gallery?.find((g) => g !== item.img) ||
      '',
    listingUrl: `${SITE_URL}/land/${item.slug}`,
    snapshot: formatMultiline(item.snapshot || []),
    googleMapsUrl: item.googleLocationUrl || '',
    address: item.location?.address || '',
    galleryUrls: collectGalleryUrls(item),
  };
}

/** WhatsApp prefill URLs can fail if the message is huge; clip long blobs. */
const WHATSAPP_MESSAGE_MAX = 3600;

function clipText(text, maxChars) {
  if (text == null || text === '') return '';
  const s = String(text).replace(/\r\n/g, '\n').trim();
  if (!s) return '';
  if (s.length <= maxChars) return s;
  return `${s.slice(0, maxChars).trim()}…`;
}

/**
 * Rich plain-text message for WhatsApp with the full listing snapshot
 * (location, area, pricing, opportunity, key points, maps link, microsite).
 * Used beside the brochure PDF on share / desktop fallback.
 */
export function buildWhatsAppListingMessage(item, type) {
  if (!item) return '';
  const d = buildBrochureData(item, type);
  if (!d) return '';

  const lines = [];
  const add = (line) => {
    if (line != null && String(line).trim() !== '') lines.push(String(line).trim());
  };

  if (type === 'plot') {
    add(`*${d.title || 'Plot listing'}*`);
    add(d.listingNumber);
    add(`Location:\n${clipText(d.location, 900)}`);
    add(d.sector ? `Sector: ${d.sector}` : '');
    add(d.plotNumber ? `Plot number: ${d.plotNumber}` : '');
    add(d.area ? `Area: ${d.area}` : '');
    add(d.accessRoad ? `Access road: ${d.accessRoad}` : '');
    add(d.stage ? `Stage: ${d.stage}` : '');
    if (d.pdfType === 'plot-jv') {
      add(d.jvRatio ? `JV ratio: ${d.jvRatio}` : '');
      add(d.jvDepositPrice ? `JV on price: ${d.jvDepositPrice}` : '');
    } else {
      add(d.salePrice ? `Sale price: ${d.salePrice}` : '');
    }
    const c = clipText(d.comments, 1400);
    if (c) add(`Comments:\n${c}`);
  } else {
    add(`*${d.title || 'Land listing'}*`);
    add(d.listingNumber);
    add(`Location:\n${clipText(d.location, 1400)}`);
    add(d.nearestTrain ? `Nearest station: ${d.nearestTrain}` : '');
    add(d.area ? `Total area: ${d.area}` : '');
    const sf = clipText(d.suitableFor, 700);
    if (sf) add(`Suitable for:\n${sf}`);
    const opp = clipText(d.opportunity, 1600);
    if (opp) add(`Opportunity:\n${opp}`);
    const kp = clipText(d.keyPoints, 1200);
    if (kp) add(`Key points:\n${kp}`);
    const sp = clipText(d.specialFeatures, 1000);
    if (sp) add(`Special features:\n${sp}`);
    const cm = clipText(d.comments, 1600);
    if (cm) add(`Comments / approvals:\n${cm}`);
    add(d.price ? `Price: ${d.price}` : '');
    add(d.status ? `Status: ${d.status}` : '');
  }

  if (Array.isArray(item.snapshot) && item.snapshot.length) {
    add('');
    add('*Snapshot*');
    for (const s of item.snapshot) {
      if (s) add(`• ${String(s).trim()}`);
    }
  }

  const mapAddr = item.location?.address || item.location_geo?.address;
  if (item.googleLocationUrl) {
    add('');
    add(`Google Maps:\n${item.googleLocationUrl}`);
  }
  if (mapAddr) add(`Address: ${mapAddr}`);

  add('');
  add(`*Microsite (full listing)*\n${d.listingUrl}`);

  let out = lines.join('\n');
  if (out.length > WHATSAPP_MESSAGE_MAX) {
    out = `${out.slice(0, WHATSAPP_MESSAGE_MAX - 80).trim()}\n\n…(trimmed for WhatsApp - full detail is in the PDF.)`;
  }
  return out;
}

/**
 * Build a single brochure PDF as a `File` ready for `navigator.share`
 * or for direct download.
 */
export async function generateBrochureFile(item, type) {
  const data = buildBrochureData(item, type);
  if (!data) throw new Error('Missing listing data for brochure.');
  const blob = await generateListingBrochure(data);

  // Extract the listing code (e.g. "L/004", "PS/001", "PJ/001") from
  // strings like "Listing #: L/004" and make it filename-safe.
  const codeMatch = (item.listingNumber || '').match(/([A-Z]+)\s*\/\s*(\d+)/i);
  const code = codeMatch
    ? `${codeMatch[1].toUpperCase()}-${codeMatch[2].padStart(3, '0')}`
    : 'L-001';
  const fileName = `Wingsmark-${code}.pdf`;
  return new File([blob], fileName, { type: 'application/pdf' });
}

/**
 * Share brochure file(s) only (no caption text - WhatsApp receives the PDF alone).
 * On mobile: native share sheet with files only. On desktop: download each file,
 * then open WhatsApp Web without a prefilled message.
 */
export async function shareBrochureFiles(files) {
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

  const waUrl = `https://wa.me/${WHATSAPP_BROCHURE_NUMBER}`;
  setTimeout(() => {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }, files.length * 220 + 250);

  return true;
}
