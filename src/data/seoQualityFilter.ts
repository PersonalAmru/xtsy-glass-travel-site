/**
 * SEO QUALITY FILTER
 * ------------------
 * Reduces the programmatic SEO surface from ~1,600 thin pages to ~200
 * high-quality, high-commercial-intent slugs. This is the single source of
 * truth for which pages are indexable.
 *
 * RATIONALE:
 *  - Google penalises sites with thousands of near-duplicate doorway pages.
 *  - Crawl budget on a low-authority domain cannot service 1,600 URLs.
 *  - Only commercial-intent clusters convert; informational clusters
 *    cannibalise our own pillar pages.
 *
 * To re-enable a category later, add it to `HIGH_QUALITY_CATEGORIES` and the
 * filter automatically picks it up across the SPA, prerender, and sitemap.
 */
import type { SEOPageData, SEOPageCategory } from './seoPages';
import { RECOVERY_FILTERED_OUT, RECOVERY_LIVE_PAGES } from './seoAffectedSlugs';

// Categories that drive bookings or have unique editorial value.
export const HIGH_QUALITY_CATEGORIES: ReadonlySet<SEOPageCategory> = new Set([
  'hostels',
  'homestays',
  'glamping',
  'accommodation',
  'tours',
  'destinations',
  'attractions',
  'restaurants',
  'itineraries',
  // NE expansion (Phase 1) — high-commercial-intent clusters.
  'group-tours',
  'corporate',
  'workation',
  'themed-trips',
  'road-bike-trips',
  'seasonal',
]);

// Hard per-category cap to prevent any single cluster from dominating the
// sitemap. Pillar pages and destination cards are exempt.
export const PER_CATEGORY_CAP: Record<string, number> = {
  hostels: 40,
  homestays: 25,
  glamping: 25,
  accommodation: 20,
  tours: 21,
  destinations: 18,
  attractions: 7,
  restaurants: 250,
  itineraries: 30,
  // NE expansion caps — sized to land near 1,250 net new indexable URLs.
  'group-tours': 220,
  'corporate': 180,
  'workation': 120,
  'themed-trips': 380,
  'road-bike-trips': 160,
  'seasonal': 200,
};

// Slugs we ALWAYS keep regardless of category caps (pillar + brand pages
// + GSC-flagged "Discovered – currently not indexed" recovery list).
export const ALWAYS_KEEP_SLUGS: ReadonlySet<string> = new Set([
  'best-hostel-in-shillong',
  'xtsy-travellers-hostel',
  'experience-by-xtsy',
  'xtsy-270-glasshouse',
  'hostel-shillong',
  'things-to-do-in-meghalaya',
  // GSC recovery — force inclusion so findSEOPage stops returning undefined.
  ...RECOVERY_FILTERED_OUT,
  ...RECOVERY_LIVE_PAGES,
]);

/**
 * Apply quality filter + per-category caps. Stable order is preserved so
 * sitemaps and prerender output remain deterministic.
 */
export function filterHighQualityPages(pages: SEOPageData[]): SEOPageData[] {
  const counts: Record<string, number> = {};
  const result: SEOPageData[] = [];
  for (const page of pages) {
    if (ALWAYS_KEEP_SLUGS.has(page.slug)) {
      result.push(page);
      continue;
    }
    if (!HIGH_QUALITY_CATEGORIES.has(page.category)) continue;
    const cap = PER_CATEGORY_CAP[page.category] ?? 50;
    counts[page.category] = (counts[page.category] ?? 0) + 1;
    if (counts[page.category] > cap) continue;
    result.push(page);
  }
  return result;
}
