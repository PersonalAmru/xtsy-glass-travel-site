/**
 * Which programmatic SEO pages Google should index.
 *
 * "Hostel/homestay/glamping in <town> today / tonight / tomorrow / this weekend /
 * last minute / now" pages for towns where XTSY has no property are near-duplicate
 * doorway pages (Google spam policy: doorway abuse / scaled content). They stay
 * reachable for visitors (URLs unchanged) but are served `noindex, follow` and
 * left out of sitemaps, so their link equity flows to the main town guide.
 * Shillong variants stay indexable: XTSY really has live beds there.
 */
const TIME_VARIANT = /-(today|tonight|this-weekend|tomorrow|last-minute|now)$/;
const STAY_PREFIX = /^(hostel|homestay|glamping|hotel)s?-in-/;

export function isConsolidatedSEOSlug(slug: string): boolean {
  return STAY_PREFIX.test(slug) && TIME_VARIANT.test(slug) && !slug.includes('shillong');
}

export function isIndexableSEOSlug(slug: string): boolean {
  return !isConsolidatedSEOSlug(slug);
}
