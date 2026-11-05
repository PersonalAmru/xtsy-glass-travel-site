## XTSY SEO Intelligence — five deliverables

1. **Canonical business facts:** central verified facts for property scope, room rates, review counts, check-in/out and partner-vs-owned property distinctions. Rates and reviews are time-sensitive; avoid hardcoding in pages or AI files.
2. **Dawki/Umngot refresh:** improve the existing canonical page with sourced access, seasonality, activities/pricing, Shnongpdeng context, advisories, FAQs and internal links. Record source and last-verified date for factual claims.
3. **Search conversion and URL consolidation:** map query clusters to one canonical URL; audit redirects, canonicals, titles/descriptions and page intent for hostel and itinerary pages. Verify live route and backlink/index signals before redirecting.
4. **Bing and AI discoverability:** validate robots/CDN access for Bingbot and OAI-SearchBot; add IndexNow only after confirming lifecycle hooks and secure key storage. Treat llms.txt as informational, not a ranking promise.
5. **SEO intelligence centre:** combine Search Console/Bing performance, sitemap/crawl diagnostics, query-to-page mapping, indexation evidence, AI referral/citation checks and conversion events. Label sources and dates.

### Image policy

For new or refreshed page imagery, use only images retrieved through the Pexels API. Store photo ID, photographer, source page URL, retrieval timestamp, alt text and attribution. Do not scrape Pexels pages or use unverified hotlinks. Flag existing non-Pexels assets for review rather than silently replacing them. Keep PEXELS_API_KEY server-side; never commit it or expose it in client bundles.

### Validation

- Run lint, build, sitemap audit and route smoke tests.
- Run the read-only SEO intelligence audit against staging, then production.
- Review rendered HTML and structured data samples.
- Verify canonical/redirect changes against live behavior.
- Re-submit sitemap(s) and monitor Search Console/Bing after deployment.
- Do not claim indexing, ranking, AI citations or booking impact without observed data.
