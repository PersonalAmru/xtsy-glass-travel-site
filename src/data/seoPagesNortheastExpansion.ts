/**
 * Northeast India expansion — Phase 1.
 *
 * Generates ~1,250 indexable pages across 5 new commercial categories:
 *   - group-tours      (group-tour-{dest}, school-tour-{state}, etc.)
 *   - corporate        (corporate-retreat-{dest}-{N}-day, leadership-retreat-{state})
 *   - workation        (workation-{dest}, digital-nomad-stay-{state})
 *   - themed-trips     (honeymoon-package-{dest}, family-tour-{state})
 *   - road-bike-trips  (bike-trip-{dest}-from-{origin}, road-trip-{state})
 *   - seasonal         (monsoon-in-{dest}, winter-in-{state}, festival pages)
 *
 * Every page enforced by the factory to:
 *   - quickAnswer 40–240 chars, period-ended
 *   - 8 FAQs (each 25–280 chars)
 *   - title 35–60 chars, meta 130–160 chars
 *   - 5 sections incl. ≥1 bulleted listItems block
 *   - WhatsApp deep-link CTA with prefilled context (no hardcoded prices)
 *
 * Quality filter caps in `seoQualityFilter.ts` keep the indexable surface
 * tuned. Categories not on the allowlist are dropped at registry assembly.
 */
import type { SEOPageData } from './seoPages';
import {
  buildGroupTourPage,
  buildCorporateRetreatPage,
  buildWorkationPage,
  buildThemedTripPage,
  buildRoadBikeTripPage,
  buildSeasonalPage,
} from './seoPageFactory';
import {
  generateGroupTourSlugs,
  generateCorporateSlugs,
  generateWorkationSlugs,
  generateThemedTripSlugs,
  generateRoadBikeTripSlugs,
  generateSeasonalFestivalSlugs,
} from '../../scripts/generate-seo-slugs';

const safe = <T>(slugs: string[], fn: (s: string) => T): T[] => {
  const out: T[] = [];
  for (const s of slugs) {
    try { out.push(fn(s)); } catch (e) {
      // Defensive: a single malformed slug must never blank the bundle.
      // eslint-disable-next-line no-console
      console.warn('[NE-expansion] failed to build', s, e);
    }
  }
  return out;
};

export const GROUP_TOUR_SEO_PAGES: SEOPageData[] = safe(generateGroupTourSlugs(), buildGroupTourPage);
export const CORPORATE_SEO_PAGES: SEOPageData[] = safe(generateCorporateSlugs(), buildCorporateRetreatPage);
export const WORKATION_SEO_PAGES: SEOPageData[] = safe(generateWorkationSlugs(), buildWorkationPage);
export const THEMED_TRIP_SEO_PAGES: SEOPageData[] = safe(generateThemedTripSlugs(), buildThemedTripPage);
export const ROAD_BIKE_SEO_PAGES: SEOPageData[] = safe(generateRoadBikeTripSlugs(), buildRoadBikeTripPage);
export const SEASONAL_SEO_PAGES: SEOPageData[] = safe(generateSeasonalFestivalSlugs(), buildSeasonalPage);

export const NE_EXPANSION_SEO_PAGES: SEOPageData[] = [
  ...GROUP_TOUR_SEO_PAGES,
  ...CORPORATE_SEO_PAGES,
  ...WORKATION_SEO_PAGES,
  ...THEMED_TRIP_SEO_PAGES,
  ...ROAD_BIKE_SEO_PAGES,
  ...SEASONAL_SEO_PAGES,
];
