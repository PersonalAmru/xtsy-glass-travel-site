/**
 * Auto-generated SEO pages for duration-based itineraries — 72 pages.
 */
import type { SEOPageData } from './seoPages';
import { buildDurationItineraryPage } from './seoPageFactory';
import { generateDurationItinerarySlugs } from '../../scripts/generate-seo-slugs';

const slugs = generateDurationItinerarySlugs();

export const DURATION_ITINERARY_SEO_PAGES: SEOPageData[] = slugs.map(buildDurationItineraryPage);
