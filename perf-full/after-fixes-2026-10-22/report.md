# Full-site performance — after-fixes-2026-10-22 (2026-10-22T18:23 UTC)

Pages: 685. Lab profile: mid-range phone, Slow 4G, 4x CPU, cold cache (warm = repeat visit).

| Measure | Value |
|---|---|
| Lab LCP median / p75 / p95 | 2.43 s / 2.70 s / 3.27 s |
| Pages with good LCP (≤ 2.5 s) | 68% (poor > 4 s: 2%) |
| FCP median / TTFB median | 2.36 s / 172 ms |
| Pages with CLS > 0.1 | 0 |
| Data per first visit / repeat visit (median) | 607 KB / 47 KB |
| JavaScript (median) | 445 KB in 74 files |
| PageSpeed score median (p25) | 70 (69); 1% of pages ≥ 90 |
| PageSpeed LCP / FCP / TBT median | 4.99 s / 4.20 s / 0 ms |
| Static files without long caching | 285 |

## By template

| Template | Pages | Lab LCP med / p75 | Good LCP | PSI score med (min) | PSI LCP med | KB first / repeat |
|---|---|---|---|---|---|---|
| sitemap-destinations | 79 | 2.26 s / 2.40 s | 86% | 68 (64) | 5.40 s | 624 / 23 |
| sitemap-dining | 70 | 2.37 s / 2.42 s | 89% | 71 (68) | 4.86 s | 598 / 39 |
| sitemap-guides | 139 | 2.45 s / 2.52 s | 74% | 70 (68) | 4.97 s | 607 / 49 |
| sitemap-hostel | 94 | 2.47 s / 2.64 s | 65% | 70 (66) | 5.05 s | 613 / 55 |
| sitemap-misc | 22 | 3.09 s / 3.20 s | 36% | 70 (68) | 5.03 s | 670 / 112 |
| sitemap-programmatic | 25 | 2.38 s / 2.46 s | 88% | 70 (67) | 5.04 s | 610 / 49 |
| sitemap-static | 45 | 2.41 s / 2.76 s | 69% | 71 (67) | 4.92 s | 607 / 42 |
| sitemap-tour-packages | 75 | 2.86 s / 2.95 s | 0% | 66 (56) | 5.59 s | 709 / 37 |
| sitemap-tours | 136 | 2.40 s / 2.48 s | 82% | 70 (62) | 4.95 s | 605 / 47 |

## Most common PageSpeed opportunities

- Use efficient cache lifetimes — 670 pages, ~170 ms LCP saving each
- Render-blocking requests — 670 pages, ~38 ms LCP saving each
- Improve image delivery — 669 pages, ~52 ms LCP saving each
- Reduce unused JavaScript — 668 pages, ~468 ms LCP saving each
- Minimize main-thread work — 20 pages, ~0 ms LCP saving each
- Reduce JavaScript execution time — 4 pages, ~0 ms LCP saving each
- Image elements do not have explicit `width` and `height` — 2 pages, ~0 ms LCP saving each
- Avoid large layout shifts — 2 pages, ~0 ms LCP saving each
- Avoid enormous network payloads — 1 pages, ~0 ms LCP saving each

## Slowest pages (lab LCP)

- /things-to-do-in-meghalaya — 7.07 s (IMG assets/northeast-ecological-education-authentic-DcCVgflo.jpg)
- /meghalaya-itinerary — 5.52 s (P Backed by XTSY — Northeast India's NEITA 2025-nomi)
- /destinations/meghalaya/dawki — 4.57 s (IMG /img/o/xtsyvoyage-dawki-river-735.webp)
- /kongthong-whistling-village — 4.29 s (P Backed by XTSY — Northeast India's NEITA 2025-nomi)
- /tours/sri-lanka-heritage-wildlife-loop — 4.20 s (IMG /img/px/tour-306-828.avif)
- /workation-aizawl — 4.15 s (IMG /img/o/xtsy-property-images-27-1242.avif)
- /monsoon-in-cherrapunji — 4.13 s (IMG /img/o/xtsyvoyage-nohkalikai-falls-736.avif)
- /student-accommodation-near-nift-shillong — 4.08 s (IMG /img/o/xtsy-property-images-6-828.avif)
- /destinations/meghalaya/shillong/sweet-falls — 4.06 s (P We use necessary cookies to run the site. With you)
- /meghalaya-adventure-tour — 4.06 s (IMG img/o/xtsyvoyage-nongriat-double-decker-root-bridge-736.webp)
- /destinations/meghalaya/shillong/bishop-falls — 4.02 s (P We use necessary cookies to run the site. With you)
- /tours/vietnam-discovery-trail — 4.02 s (IMG /img/px/tour-301-828.avif)
- /5-day-meghalaya-itinerary — 3.97 s (P We use necessary cookies to run the site. With you)
- /monsoon-in-jowai — 3.96 s (IMG /img/o/xtsyvoyage-meghalaya-cover-image-736.avif)
- /destinations/meghalaya/tura/tura-peak — 3.90 s (P We use necessary cookies to run the site. With you)

## Lowest PageSpeed scores

- /tours/6d-shillong-meghalaya-tour — 56 (LCP 4.33 s)
- /group-tour-aizawl — 62 (LCP 4.95 s)
- /destinations/meghalaya/dawki/shnongpdeng — 64 (LCP 6.45 s)
- /destinations/meghalaya/jowai — 64 (LCP 6.03 s)
- /tours/assam-wildlife-tea-heritage — 65 (LCP 5.80 s)
- /tours/bumla-pass-bike-expedition — 65 (LCP 5.69 s)
- /tours/dawki-crystal-waters-winter-escape — 65 (LCP 5.74 s)
- /tours/manipur-loktak-lake-winter-discovery — 65 (LCP 5.66 s)
- /destinations/meghalaya/cherrapunji/double-decker-living-root-bridge — 65 (LCP 6.16 s)
- /destinations/meghalaya/shillong/elephant-falls — 65 (LCP 6.09 s)
- /tours/bali-wellness-culture-retreat — 65 (LCP 5.66 s)
- /tours/meghalaya-biodiversity-research-expedition — 65 (LCP 4.35 s)
- /tours/sikkim-peaceful-winter-retreat — 65 (LCP 5.64 s)
- /tours/turkey-history-landscape-route — 65 (LCP 5.69 s)
- /destinations/meghalaya/cherrapunji/nongriat-village — 65 (LCP 6.32 s)

## Console errors

- 49 pages: Failed to load resource: net::ERR_NAME_NOT_RESOLVED
- 5 pages: Failed to load resource: the server responded with a status of 403 ()