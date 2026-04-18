/**
 * Auto-generated SEO pages for global Northeast India (8 states) — 88 pages.
 * Covers: Meghalaya, Assam, Arunachal, Nagaland, Manipur, Mizoram, Tripura, Sikkim.
 */
import type { SEOPageData } from './seoPages';
import { buildGlobalNEPage } from './seoPageFactory';
import { generateGlobalNESlugs } from '../../scripts/generate-seo-slugs';

const slugs = generateGlobalNESlugs();

export const GLOBAL_NE_SEO_PAGES: SEOPageData[] = slugs.map(buildGlobalNEPage);
