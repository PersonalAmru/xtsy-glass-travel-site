/**
 * FULL 404 AUDIT
 * --------------
 * Flags every URL that would render <NotFound /> (soft-404) or fail to
 * resolve, across:
 *   1. Programmatic SEO pages that trip the thin-content guard
 *      (sections < 3 OR total body < 600 chars) in ProgrammaticSEOPage.tsx.
 *   2. Recovery slug lists (RECOVERY_FILTERED_OUT / RECOVERY_LIVE_PAGES)
 *      that no longer resolve via findSEOPage.
 *   3. RECOVERY_PLACES_PATHS that don't resolve via getDestinationBySlug.
 *   4. RECOVERY_REDIRECTS targets that don't themselves resolve.
 */
import { ALL_SEO_PAGES, findSEOPage } from '../src/data/seoPages';
import {
  RECOVERY_FILTERED_OUT,
  RECOVERY_LIVE_PAGES,
  RECOVERY_PLACES_PATHS,
  RECOVERY_REDIRECTS,
} from '../src/data/seoAffectedSlugs';
import { getDestinationBySlug } from '../src/data/meghalayaDestinations';
import { STATIC_ROUTES } from '../src/utils/seoSlugRegistry';

const THIN_SECTIONS = 3;
const THIN_BODY = 600;

const bodyLen = (p: any) =>
  (p.intro?.length || 0) +
  p.sections.reduce((a: number, s: any) => a + (s.content?.length || 0), 0);

const isThin = (p: any) => p.sections.length < THIN_SECTIONS || bodyLen(p) < THIN_BODY;

// 1. Thin programmatic pages → render NotFound
const thin = ALL_SEO_PAGES.filter(isThin);

// 2. Recovery slugs that no longer resolve
const deadRecovery = [...new Set([...RECOVERY_FILTERED_OUT, ...RECOVERY_LIVE_PAGES])]
  .filter((slug) => {
    const p = findSEOPage(slug);
    return !p || isThin(p);
  });

// 3. places-to-visit paths that don't resolve
const deadPlaces = RECOVERY_PLACES_PATHS.filter((path) => {
  const slug = path.replace('places-to-visit/', '');
  return !getDestinationBySlug(slug);
});

// 4. redirect targets that don't themselves resolve
const staticSet = new Set(STATIC_ROUTES);
const deadRedirectTargets = Object.entries(RECOVERY_REDIRECTS).filter(([, target]) => {
  if (staticSet.has(target)) return false;
  const tslug = target.replace(/^\//, '').split('/')[0];
  if (staticSet.has('/' + tslug)) return false;
  if (target.startsWith('/places-to-visit/')) {
    return !getDestinationBySlug(target.replace('/places-to-visit/', ''));
  }
  const p = findSEOPage(tslug);
  return !p || isThin(p);
});

console.log('=== FULL 404 AUDIT ===');
console.log(`Total SEO pages: ${ALL_SEO_PAGES.length}`);
console.log(`\n[1] Thin programmatic pages (render NotFound): ${thin.length}`);
thin.slice(0, 60).forEach((p) =>
  console.log(`   - ${p.slug}  (sections=${p.sections.length}, body=${bodyLen(p)})`),
);
if (thin.length > 60) console.log(`   ...and ${thin.length - 60} more`);

console.log(`\n[2] Recovery slugs that DON'T resolve / are thin: ${deadRecovery.length}`);
deadRecovery.forEach((s) => console.log(`   - ${s}`));

console.log(`\n[3] places-to-visit paths that 404: ${deadPlaces.length}`);
deadPlaces.forEach((s) => console.log(`   - ${s}`));

console.log(`\n[4] Redirect targets that themselves 404: ${deadRedirectTargets.length}`);
deadRedirectTargets.forEach(([s, t]) => console.log(`   - ${s} -> ${t}`));

const totalBroken =
  thin.length + deadRecovery.length + deadPlaces.length + deadRedirectTargets.length;
console.log(`\n=== TOTAL ISSUES: ${totalBroken} ===`);
