import landListings from '../api/land.json';
import plotListings from '../api/plots.json';
import { formatLandDetailField, formatPlotDetailField } from './listingTextFormat';

function findListing(entry) {
  if (!entry?.slug) return null;
  if (entry.type === 'plot') {
    return plotListings.find((p) => p.slug === entry.slug) ?? null;
  }
  return landListings.find((l) => l.slug === entry.slug) ?? null;
}

/** Detail rows for cart / recently viewed (listing fields except title). */
export function buildCartDetailBlocks(item, type) {
  if (!item) return [];

  if (type === 'plot') {
    const isJv = item.plotType === 'jv';
    const rows = [
      ['Location', item.location],
      ['Sector', item.sector],
      ['Area', item.area],
      ['Plot Number', item.plotNumber],
      ['Access Road', item.accessRoad],
      ['Stage', item.stage],
      isJv ? ['JV Ratio', item.jvRatio] : ['Sale Price', item.salePrice],
      isJv ? ['JV on Price', item.jvOnPrice] : null,
      item.validityDays ? ['Validity', `${item.validityDays} days`] : null,
      item.comments ? ['Comments', item.comments] : null,
    ];
    return rows
      .filter((r) => r && r[1])
      .map(([label, raw]) => ({
        label,
        value: formatPlotDetailField(label, raw),
        preline: true,
      }));
  }

  const commentsText = item.comments ?? item.specialComments;
  const rows = [
    ['Location', item.loc],
    ['Nearest train station', item.nearestStation],
    ['Total Area', item.area],
    ['Suitable for', item.suitableFor],
    ['Opportunity', item.opportunity],
    ['Key points', item.keyPoints],
    ['Special Features', item.specialFeatures],
    ['Comments', commentsText],
    ['JV Terms', item.jvTerms],
    [item.label || 'Price', item.price],
    ['Status', item.status],
  ];

  return rows
    .filter(([, v]) => v)
    .map(([label, raw]) => ({
      label,
      value: formatLandDetailField(label, raw, item),
      preline: true,
    }));
}

/** Resolve full listing from a visited/cart entry id. */
export function getCartDisplayDetails(entry) {
  const item = findListing(entry);
  if (!item) return [];
  return buildCartDetailBlocks(item, entry.type);
}
