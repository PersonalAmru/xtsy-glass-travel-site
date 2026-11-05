# XTSY SEO Remediation Audit — 5 November 2026

## Scope
Shillong hostel URL cluster, metadata/canonical strategy, redirects, programmatic SEO registry, recovery inventory, sitemap controls, and crawler-facing SSR checks.

## Remediation in this PR
- Canonical budget-intent hub: `/budget-hostels-shillong`.
- Legacy `/cheap-hostels-shillong`, `/cheap-hostel-shillong`, and `/cheap-hostel-in-shillong` redirect to the budget canonical.
- Removed the retired `cheap-hostel-shillong` programmatic SEO page and its override to prevent a competing page.
- Updated related-page links, static route registry, recovery slug list, route tree, checked-in static sitemap, and SSR SEO route list.
- Stay-hub headline, description, H1, FAQs, JSON-LD, keywords and canonical use budget-focused language. Live-inventory pricing helpers are retained.
- `robots.txt` now advertises only `sitemap_index.xml`; the sitemap writer generates identical index contents at both sitemap filenames.

## Audit findings requiring follow-up
- Checked-in sitemap branches previously contained 696 URL entries / 694 unique URLs, including duplicate homepage and campsite entries. Rebuild and cross-branch dedupe must be verified on CI-generated artifacts.
- SEO overrides contain hardcoded rates, rating/review counts and promotional assertions that can drift from authoritative data. A reviewed source-of-truth migration is required; blind replacement is unsafe.
- Some programmatic hostel pages contain location and amenity claims that require page-level verification against actual property facts.
- “Coming soon” promotional copy is duplicated across page components/SEO sections. Centralize feature status before removing or updating claims.
- GSC inventory reconciliation requires a current Search Console export after deployment; repository artifacts alone cannot establish current indexed/canonical states.

## Validation before merge/deployment
- Regenerate TanStack route tree and compare with committed `src/routeTree.gen.ts`.
- Run build, lint, sitemap rebuild, sitemap consistency, sitemap health audit and SSR SEO checks.
- Verify redirect status and canonical for all legacy aliases on staging/live.
- Crawl the canonical budget hub and confirm no Shillong hostel SEO title, H1, description, keywords, OG/Twitter metadata, FAQ or JSON-LD uses “cheap”.
- Reconcile rebuilt sitemap URLs against current GSC URL coverage.

## Status
Source changes prepared for review. CI, deployed crawl and GSC reconciliation are pending; none are marked as passed.
