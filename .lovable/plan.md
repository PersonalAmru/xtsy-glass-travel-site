# Phase A — Hero Image Category Fix + Sitemap Regeneration

## Goal
Eliminate ~1,041 wrong-hero mismatches across programmatic SEO pages by adding the 5 missing categories to `CATEGORY_HERO_MAP`, then regenerate all sitemaps so coverage stays in sync.

## Changes

### 1. `src/utils/seoHeroImages.ts`
Add 5 missing categories to `CATEGORY_HERO_MAP` using existing Supabase Meghalaya assets, chosen to match each category's intent:

- `themed-trips` → `double-decker-living-root-bridge-meghalaya-3.webp` (experiential)
- `group-tours` → `mawphlang-sacred-forest-meghalaya-1.webp` (group/community vibe)
- `corporate` → `umiam-lake-meghalaya-2.webp` (calm, professional retreat scene)
- `road-bike-trips` → `laitlum-canyons-meghalaya-4.webp` (open road / vista)
- `workation` → `nongjrong-sunrise-viewpoint-meghalaya-3.webp` (serene work-from-view)

No other code paths change — `getHeroImageForPage()` already falls through category → default, so adding entries is sufficient.

### 2. Regenerate sitemaps
Run `bunx tsx scripts/generateSitemaps.ts` to rebuild `public/sitemap-static.xml` and `public/sitemap-priority.xml` with today's `lastmod`. Script also cross-checks GSC recovery slugs and exits non-zero if any are missing.

## Verification
- Spot-read 2–3 programmatic pages from each newly mapped category to confirm hero resolves to the new image (not Laitlum default).
- Confirm `sitemap-priority.xml` regenerated with updated `<lastmod>` and the script's coverage check passes.

## Out of scope (deferred to later phases)
- Phase B: state-keyed section image pools (Assam/Arunachal/etc.)
- Phase C: batch `generate-seo-hero` runs for top commercial slugs
- Phase D: per-slug og:image generation
