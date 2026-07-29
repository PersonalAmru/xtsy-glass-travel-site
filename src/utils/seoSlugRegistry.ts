/**
 * Single source of truth for ALL resolvable URL slugs in the app.
 *
 * Used by:
 *  1. The build-time slug audit (`scripts/auditSlugs.ts`) — flags any slug
 *     referenced in nav/content that doesn't resolve to a real page.
 *  2. The auto sitemap generator (`scripts/generateSitemaps.ts`).
 *  3. The admin coverage dashboard.
 */
import { ALL_SEO_PAGES } from '@/data/seoPages';
import { RECOVERY_REDIRECTS } from '@/data/seoAffectedSlugs';

/** Hand-coded React Router routes (kept in sync with App.tsx). */
export const STATIC_ROUTES: ReadonlyArray<string> = [
  '/',
  '/about',
  '/gallery',
  '/tours',
  '/xtsy-270',
  '/pet-friendly',
  '/xtsy-vs-zostel',
  '/female-travellers',
  '/work-from-home',
  '/xtsy-rentals',
  '/tab-bistro',
  '/xtsy-adventure-campsite-dawki',
  '/privacy-policy',
  '/terms-of-service',
  '/pricing-cancellation-policy',
  '/book',
  
  '/things-to-do-in-meghalaya',
  '/meghalaya-waterfalls',
  '/meghalaya-caves',
  '/meghalaya-villages',
  '/meghalaya-viewpoints',
  '/meghalaya-tour-packages',
  '/group-bookings-meghalaya',
  '/meghalaya-couple-tour-package',
  '/shillong-tour-package',
  '/best-time-to-visit-meghalaya',
  '/hidden-places-in-meghalaya',
  '/3-day-meghalaya-itinerary',
  '/5-day-meghalaya-itinerary',
  '/budget-trip-to-meghalaya',
  '/meghalaya-photo-gallery',
  '/best-hostel-in-shillong',
  '/hotels-in-shillong',
  '/homestays-in-shillong',
  '/luxury-glamping-shillong',
  '/destination-wedding-shillong',
  '/restaurant-in-shillong',
  '/hostel-booking',
  '/hostel-near-me',
];

/** Returns true if `path` resolves to a real React route, programmatic SEO
 *  page, or an active redirect. */
export function isResolvable(path: string): boolean {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (STATIC_ROUTES.includes(normalized)) return true;

  const slug = normalized.replace(/^\//, '').split('/')[0];
  if (!slug) return true;

  // Programmatic SEO entry?
  if (ALL_SEO_PAGES.some(p => p.slug === slug)) return true;

  // Recovery redirect?
  if (Object.prototype.hasOwnProperty.call(RECOVERY_REDIRECTS, slug)) return true;

  // places-to-visit/* dynamic
  if (normalized.startsWith('/places-to-visit/')) return true;
  // tours/* dynamic
  if (normalized.startsWith('/tours/')) return true;

  return false;
}

export interface SlugAuditResult {
  totalReferenced: number;
  resolved: number;
  unresolved: string[];
}

/** Audit a list of slugs against the registry. Used by the build script. */
export function auditSlugs(slugs: string[]): SlugAuditResult {
  const unresolved: string[] = [];
  for (const s of slugs) {
    if (!isResolvable(s)) unresolved.push(s);
  }
  return {
    totalReferenced: slugs.length,
    resolved: slugs.length - unresolved.length,
    unresolved,
  };
}
