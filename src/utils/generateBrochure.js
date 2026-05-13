import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

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
 * Letterhead files in /public — first fetch that returns 200 wins.
 * (Users sometimes save with different spelling/casing.)
 */
const LETTERHEAD_CANDIDATES = [
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

const SKIP_SANITIZE = new Set(['imageUrl', 'locationImageUrl', 'listingUrl']);

function sanitizeBrochureData(data) {
  const result = { ...data };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'string' && !SKIP_SANITIZE.has(key)) {
      result[key] = sanitizePdfText(result[key]);
    }
  }
  return result;
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
  let y = height - headerSpace;

  // ---------- Listing number badge (centered, white bg, blue border) ----------
  if (safe.listingNumber) {
    const badgeText = String(safe.listingNumber).toUpperCase();
    const badgeFontSize = 13;
    const badgePadH = 18;
    const badgePadV = 8;
    const badgeTextWidth = helvBold.widthOfTextAtSize(badgeText, badgeFontSize);
    const badgeW = badgeTextWidth + badgePadH * 2;
    const badgeH = badgeFontSize + badgePadV * 2;
    const badgeX = contentX + (contentWidth - badgeW) / 2;
    const badgeY = y - badgeH + badgePadV;

    page.drawRectangle({
      x: badgeX,
      y: badgeY,
      width: badgeW,
      height: badgeH,
      color: rgb(1, 1, 1),
      borderColor: PALETTE.navy,
      borderWidth: 1.5,
    });

    page.drawText(badgeText, {
      x: badgeX + badgePadH,
      y: badgeY + badgePadV,
      size: badgeFontSize,
      font: helvBold,
      color: PALETTE.red,
    });
    y -= badgeH + 24;
  }

  // ---------- Title with red underline ----------
  const titleSize = 20;
  const titleLines = wrapText(safe.title, helvBold, titleSize, contentWidth);
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
    const blockHeight = labelSize + 8 + valueLines.length * (valueSize + 2) + lineGap;
    if (y - blockHeight < minY) break;
    const labelText = label.toUpperCase();
    const labelW = helvBold.widthOfTextAtSize(labelText, labelSize);
    page.drawText(labelText, {
      x: contentX,
      y,
      size: labelSize,
      font: helvBold,
      color: PALETTE.gold,
    });
    page.drawRectangle({
      x: contentX,
      y: y - 3,
      width: labelW,
      height: 1.2,
      color: PALETTE.gold,
    });
    y -= labelSize + 10;
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

  // ---------- Two image boxes in gold frames (COMMENTED OUT FOR NOW) ----------
  /*
  const rawImgUrls = [data.imageUrl, data.locationImageUrl].filter(Boolean);
  const imgUrls = [...new Set(rawImgUrls)];

  if (imgUrls.length > 0) {
    const embedResults = await Promise.all(imgUrls.map((u) => tryEmbedImage(pdfDoc, u)));
    const embeds = embedResults.filter(Boolean);

    if (embeds.length > 0) {
      const boxBorder = 2;
      const boxPad = 5;
      const gap = 14;
      const spaceLeft = y - minY - 10;
      const needNewPage = spaceLeft < 120;

      let targetPage = page;
      let imgY0;
      const imgAreaH = 220;

      if (needNewPage) {
        const [lhPage] = await PDFDocument.load(letterheadBytes, {
          ignoreEncryption: true,
        }).then((d) => {
          const ps = d.getPages();
          return pdfDoc.copyPages(d, ps.map((_, i) => i));
        });
        pdfDoc.addPage(lhPage);
        targetPage = pdfDoc.getPages().at(-1);
        imgY0 = height - headerSpace;
      } else {
        imgY0 = y;
      }

      const totalAvail = contentWidth;
      const boxW =
        embeds.length === 2
          ? (totalAvail - gap) / 2
          : totalAvail * 0.6;
      const imgW = boxW - (boxBorder + boxPad) * 2;
      const maxImgH = needNewPage
        ? imgAreaH
        : Math.min(imgAreaH, spaceLeft - (boxBorder + boxPad) * 2);

      const imgDraws = embeds.map((emb) => {
        const aspect = emb.width / emb.height;
        let drawW = imgW;
        let drawH = drawW / aspect;
        if (drawH > maxImgH) {
          drawH = maxImgH;
          drawW = drawH * aspect;
        }
        return { emb, drawW, drawH };
      });

      const tallest = Math.max(...imgDraws.map((d) => d.drawH));
      const boxH = tallest + (boxBorder + boxPad) * 2;
      const boxY = imgY0 - boxH - 4;
      const startX =
        embeds.length === 2
          ? contentX
          : contentX + (totalAvail - boxW) / 2;
      let curX = startX;

      for (const { emb, drawW, drawH } of imgDraws) {
        targetPage.drawRectangle({
          x: curX,
          y: boxY,
          width: boxW,
          height: boxH,
          borderColor: PALETTE.gold,
          borderWidth: boxBorder,
        });

        const imgX = curX + (boxW - drawW) / 2;
        const imgYPos = boxY + (boxH - drawH) / 2;
        targetPage.drawImage(emb, {
          x: imgX,
          y: imgYPos,
          width: drawW,
          height: drawH,
        });

        curX += boxW + gap;
      }
    }
  }
  */

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
    imageUrl: item.img || '',
    locationImageUrl:
      (item.locationImage && item.locationImage !== item.img
        ? item.locationImage
        : null) ||
      item.gallery?.find((g) => g !== item.img) ||
      '',
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
  const num = numMatch ? numMatch[1].padStart(3, '0') : '001';
  const fileName = `TheWingsMarkInfraa-listing#${num}.pdf`;
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
