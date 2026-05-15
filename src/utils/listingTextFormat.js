/**
 * Shared listing copy formatting - keep Land detail UI and brochure PDF in sync.
 * (Same rules as the former LandDetailPage helpers.)
 */

const BULLET_PREFIX = /^\s*[•\u2022\-–—]\s*/;

/** Split bullet/newline copy into clean list items (no leading bullet chars). */
export function parseBulletItems(val) {
  if (val == null || val === '') return [];
  if (Array.isArray(val)) {
    return val
      .map((s) => String(s).replace(BULLET_PREFIX, '').trim())
      .filter(Boolean);
  }
  const text = String(val).trim();
  if (!text) return [];
  if (/[•\u2022]/.test(text) && /\n/.test(text)) {
    return text
      .split(/\n+/)
      .map((line) => line.replace(BULLET_PREFIX, '').trim())
      .filter(Boolean);
  }
  if (BULLET_PREFIX.test(text)) {
    return [text.replace(BULLET_PREFIX, '').trim()].filter(Boolean);
  }
  return [];
}

export function isBulletContent(val) {
  return parseBulletItems(val).length > 1;
}

/** Short location line for cards (first bullet or first line). */
export function locationPreview(loc) {
  const items = parseBulletItems(loc);
  if (items.length) return items[0];
  const line = String(loc || '')
    .split(/\n/)[0]
    .replace(BULLET_PREFIX, '')
    .trim();
  return line;
}

export function formatMultiline(val) {
  if (val == null || val === '') return '';
  const items = parseBulletItems(val);
  if (items.length > 1) {
    return items.map((s) => `• ${s}`).join('\n');
  }
  if (Array.isArray(val)) {
    return val
      .map((s) => String(s).replace(BULLET_PREFIX, '').trim())
      .filter(Boolean)
      .map((s) => `• ${s}`)
      .join('\n');
  }
  return String(val);
}

/**
 * Split prose into bullet lines (comma / period boundaries), with guards for
 * N.A., numbers, abbreviations - same as the listing details page.
 */
export function splitToBullets(val) {
  if (!val) return '';
  const existing = parseBulletItems(val);
  if (existing.length > 1) return formatMultiline(val);
  if (Array.isArray(val)) return formatMultiline(val);
  const text = String(val)
    .replace(/(\d),(\d)/g, '$1<KEEPCOMMA>$2')
    .replace(/\b([A-Z])\.(?=[A-Z]\.)/g, '$1<KEEPDOT>')
    .replace(/\b(Mr|Mrs|Ms|Dr|St|Jr|Sr|vs|etc|approx|aka|i\.e|e\.g)\./gi,
      '$1<KEEPDOT>');
  const parts = text
    .split(/[,.]+(?:\s+|$)/)
    .map((s) =>
      s
        .replace(/<KEEPCOMMA>/g, ',')
        .replace(/<KEEPDOT>/g, '.')
        .replace(/^[\s\-–—•]+|[\s\-–—•]+$/g, '')
        .trim()
    )
    .filter(Boolean);
  if (parts.length <= 1) return parts[0] || String(val).trim();
  return parts.map((s) => `• ${s}`).join('\n');
}

/** Opportunity field: respect `skipOpportunitySplit` like the website. */
export function formatLandOpportunity(item) {
  if (!item?.opportunity) return '';
  if (item.skipOpportunitySplit) return String(item.opportunity);
  return splitToBullets(item.opportunity);
}
