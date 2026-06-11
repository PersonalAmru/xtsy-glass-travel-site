/**
 * SEO QUALITY FILTER
 * ------------------
 * Reduces the programmatic SEO surface to a focused ~500 high-quality,
 * high-commercial-intent slugs (Tier 1 + Tier 2). This is the single source of
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
  'travel-guides',
  // NE expansion (Phase 1) — high-commercial-intent clusters (capped tight).
  'group-tours',
  'corporate',
  'workation',
  'themed-trips',
  'road-bike-trips',
  'seasonal',
]);

// Hard per-category cap to prevent any single cluster from dominating the
// sitemap. Tuned to land the indexable surface near ~500 Tier 1/2 URLs.
export const PER_CATEGORY_CAP: Record<string, number> = {
  hostels: 40,
  homestays: 25,
  glamping: 25,
  accommodation: 20,
  tours: 21,
  destinations: 18,
  attractions: 7,
  restaurants: 60,
  itineraries: 30,
  'travel-guides': 40,
  // NE expansion caps — trimmed from the old doorway-page volumes.
  'group-tours': 30,
  'corporate': 20,
  'workation': 12,
  'themed-trips': 40,
  'road-bike-trips': 20,
  'seasonal': 30,
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
 * Slugs that have been MERGED into a canonical page (Phase 1 hostel-cluster
 * consolidation). Dropped from the indexable registry so `findSEOPage` returns
 * undefined and the `/:slug` catch-all issues the 301-style redirect declared
 * in `RECOVERY_REDIRECTS`. Never re-add these as live pages.
 */
export const MERGED_REDIRECT_SLUGS: ReadonlySet<string> = new Set<string>([
  'cheap-hostel-in-shillong',     // → /cheap-hostel-shillong (keep better-ranking variant)
  'backpacker-hostel-shillong',   // → /best-hostel-in-shillong
  'youth-hostel-shillong',        // → /best-hostel-in-shillong
  'hostels-in-shillong',          // → /best-hostel-in-shillong
]);

/**
 * Apply quality filter + per-category caps. Stable order is preserved so
 * sitemaps and prerender output remain deterministic.
 */
export function filterHighQualityPages(pages: SEOPageData[]): SEOPageData[] {
  const counts: Record<string, number> = {};
  const result: SEOPageData[] = [];
  for (const page of pages) {
    // Merged/consolidated slugs are never indexable — they redirect instead.
    if (MERGED_REDIRECT_SLUGS.has(page.slug)) continue;
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
