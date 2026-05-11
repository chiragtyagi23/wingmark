import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { sanitizePdfText } from './generateBrochure';

const PALETTE = {
  navy: rgb(0.04, 0.10, 0.18),
  gold: rgb(0.97, 0.78, 0.10),
  text: rgb(0.16, 0.20, 0.25),
  muted: rgb(0.40, 0.43, 0.48),
  white: rgb(1, 1, 1),
};

const LETTERHEAD_CANDIDATES = [
  '/black beige Modern Business Letterhead.pdf',
  '/Black Beige Modern Business Letterhead.pdf',
  '/White Green and Gold Modern Minimal Business Letterhead.pdf',
  '/letterhead.pdf',
].map((p) => encodeURI(p));

async function fetchLetterheadBytes() {
  let lastErr;
  for (const url of LETTERHEAD_CANDIDATES) {
    try {
      const res = await fetch(url);
      if (!res.ok) { lastErr = new Error(`${res.status}: ${url}`); continue; }
      return await res.arrayBuffer();
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('No letterhead PDF found.');
}

function wrapText(text, font, fontSize, maxWidth) {
  if (!text) return [];
  const words = text.replace(/\n/g, ' ').split(/\s+/).filter(Boolean);
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

export async function generateCompanyProfilePdf() {
  const letterheadBytes = await fetchLetterheadBytes();
  const pdfDoc = await PDFDocument.load(letterheadBytes, { ignoreEncryption: true });

  const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const pages = pdfDoc.getPages();
  if (!pages.length) throw new Error('Letterhead has no pages.');
  const page = pages[0];
  const { width, height } = page.getSize();

  const margin = 56;
  const headerSpace = 140;
  const footerSpace = 100;
  const contentWidth = width - margin * 2;
  const minY = footerSpace;
  let y = height - headerSpace;

  const s = (t) => sanitizePdfText(t);

  const drawLabel = (label) => {
    page.drawText(label.toUpperCase(), { x: margin, y, size: 8, font: helvBold, color: PALETTE.gold });
    y -= 13;
  };

  const drawParagraph = (text, { fontSize = 10, font: f = helv, color = PALETTE.text, indent = 0 } = {}) => {
    const lines = wrapText(s(text), f, fontSize, contentWidth - indent);
    for (const line of lines) {
      if (y < minY) return;
      page.drawText(line, { x: margin + indent, y, size: fontSize, font: f, color });
      y -= fontSize + 3;
    }
    y -= 4;
  };

  const drawBullet = (text, opts = {}) => {
    drawParagraph(`- ${text}`, { indent: 12, ...opts });
  };

  // ---- Title ----
  page.drawText(s('THE WINGSMARK INFRAA'), { x: margin, y, size: 18, font: helvBold, color: PALETTE.navy });
  y -= 22;
  page.drawText(s('Company Profile'), { x: margin, y, size: 11, font: helvOblique, color: PALETTE.muted });
  y -= 18;

  // gold divider
  page.drawRectangle({ x: margin, y, width: 56, height: 2, color: PALETTE.gold });
  y -= 16;

  // ---- About ----
  drawLabel('About Us');
  drawParagraph(
    'The Wingsmark Infraa is a Navi Mumbai based Real Estate Advisory specializing in land acquisition, land development & offering sales & marketing strategy for new developments.'
  );
  drawParagraph(
    'Our core strength is land liaisoning backed with the promise of high returns for our stake holders.'
  );
  drawParagraph(
    'Founded by industry veterans, we focus on providing Trust & Value through a very customer friendly approach, innovative ideas & specialised services.'
  );

  // ---- Regions ----
  drawLabel('Regions of Expertise');
  for (const region of ['Kharghar', 'Panvel', 'Khopoli', 'Pen', 'Karjat', 'The promising high-growth corridor of Mumbai 3.0']) {
    drawBullet(region);
  }

  // ---- Services ----
  drawLabel('Our Services');
  drawBullet('Land — Acquisition, Dispute Resolution & Legal Clearance');
  drawBullet('Development — Bungalow & Villa plotting in Mumbai 3.0, Redevelopment in Mumbai');
  drawBullet('New Projects — Sales Strategy, Marketing & Distribution');

  // ---- Corporate Identity ----
  drawLabel('Corporate Identity');
  drawParagraph('Incorporated as a Limited Liability Partnership (LLP) in May 2026.');

  // ---- Leadership ----
  drawLabel('Leadership');
  drawParagraph('Mehhul Badani — 80708 88111 / 99309 49066', { font: helvBold, color: PALETTE.navy });
  drawParagraph('Key Roles: Founder, COO, Strategic Advisor & Designated Partner', { fontSize: 9 });
  y -= 2;
  drawParagraph('Vijay C Gaaikwad — 95525 10383', { font: helvBold, color: PALETTE.navy });
  drawParagraph('Key Roles: Founder, Land Acquisition, Govt Liaisoning & Designated Partner', { fontSize: 9 });
  y -= 2;
  drawParagraph('Advocate Sathyam Acharya — 98195 20866', { font: helvBold, color: PALETTE.navy });
  drawParagraph('Key Roles: Verification, Documentation, Legal Advisor', { fontSize: 9 });

  // ---- Office ----
  drawLabel('Our Office');
  drawParagraph('Headquartered in Navi Mumbai with additional branches in Greater Mumbai, Delhi & upcoming office in Gujarat.');
  y -= 2;
  drawLabel('Address');
  drawParagraph('Shop 2, Plot 96, Sai Leela CHS, New Sector 50, Seawoods, Navi Mumbai - 400 706');

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: 'application/pdf' });
}
