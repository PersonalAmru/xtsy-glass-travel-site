/**
 * Auto-generated SEO pages for routes (from-X-to-Y) — 681 pages.
 * Aligned with seoPages.ts schema. Hero images resolved via seoHeroImages.ts.
 */
import type { SEOPageData } from './seoPages';
import { buildRoutePage } from './seoPageFactory';
import { generateRouteSlugs } from '../../scripts/generate-seo-slugs';

const slugs = generateRouteSlugs();

export const ROUTE_SEO_PAGES: SEOPageData[] = slugs.map(buildRoutePage);
