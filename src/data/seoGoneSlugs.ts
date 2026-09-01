/**
 * Slugs that should return HTTP 410 (Gone) instead of 404.
 *
 * Use 410 for content that was permanently removed (e.g. deprecated tour
 * packages, retired property names) — Google drops 410 URLs from the index
 * faster than 404s, helping recover crawl budget.
 *
 * Maintained via the Admin → SEO → Recovery panel.
 */
export const GONE_SLUGS: ReadonlySet<string> = new Set<string>([
  // Legacy redirect stubs removed 2026-09 — permanently gone (410).
  'contact-us',
  'refund-cancellation-policy',
  'privacy',
  'travel',
]);
