/**
 * Auto-generated SEO pages for activities x destinations — 198 pages.
 */
import type { SEOPageData } from './seoPages';
import { buildActivityPage } from './seoPageFactory';
import { generateActivitySlugs } from '../../scripts/generate-seo-slugs';

const slugs = generateActivitySlugs();

export const ACTIVITY_SEO_PAGES: SEOPageData[] = slugs.map(buildActivityPage);
