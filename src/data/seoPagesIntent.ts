/**
 * Auto-generated SEO pages for intent-based stays (last-minute / today / tonight / cheap / best) — 324 pages.
 */
import type { SEOPageData } from './seoPages';
import { buildIntentStayPage } from './seoPageFactory';
import { generateIntentStaySlugs } from '../../scripts/generate-seo-slugs';

const slugs = generateIntentStaySlugs();

export const INTENT_STAY_SEO_PAGES: SEOPageData[] = slugs.map(buildIntentStayPage);
