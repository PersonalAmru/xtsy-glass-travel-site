/**
 * Auto-generated SEO pages for institutions (NEIGRIHMS, IIM, NIFT, hospitals, AIIMS) — 54 pages.
 */
import type { SEOPageData } from './seoPages';
import { buildInstitutionPage } from './seoPageFactory';
import { generateInstitutionSlugs, INSTITUTIONS } from '../../scripts/generate-seo-slugs';

const slugs = generateInstitutionSlugs();
const instMap = new Map<string, typeof INSTITUTIONS[number]>(
  INSTITUTIONS.map(i => [i.slug, i])
);

export const INSTITUTION_SEO_PAGES: SEOPageData[] = slugs
  .map(slug => {
    const matchedInst = INSTITUTIONS.find(i => slug.endsWith(`-${i.slug}`));
    if (!matchedInst) return null;
    return buildInstitutionPage(slug, matchedInst);
  })
  .filter((p): p is SEOPageData => p !== null);
