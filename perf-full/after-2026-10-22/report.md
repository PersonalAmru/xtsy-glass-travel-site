# Full-site performance — after-2026-10-22 (2026-10-22T14:12 UTC)

Pages: 685. Lab profile: mid-range phone, Slow 4G, 4x CPU, cold cache (warm = repeat visit).

| Measure | Value |
|---|---|
| Lab LCP median / p75 / p95 | 2.48 s / 2.81 s / 3.30 s |
| Pages with good LCP (≤ 2.5 s) | 53% (poor > 4 s: 1%) |
| FCP median / TTFB median | 2.41 s / 198 ms |
| Pages with CLS > 0.1 | 0 |
| Data per first visit / repeat visit (median) | 607 KB / 47 KB |
| JavaScript (median) | 445 KB in 74 files |
| PageSpeed score median (p25) | 70 (69); 2% of pages ≥ 90 |
| PageSpeed LCP / FCP / TBT median | 4.97 s / 4.20 s / 0 ms |
| Static files without long caching | 205 |

## By template

| Template | Pages | Lab LCP med / p75 | Good LCP | PSI score med (min) | PSI LCP med | KB first / repeat |
|---|---|---|---|---|---|---|
| sitemap-destinations | 79 | 2.29 s / 2.50 s | 76% | 71 (64) | 5.13 s | 624 / 23 |
| sitemap-dining | 70 | 2.41 s / 2.68 s | 64% | 70 (68) | 4.90 s | 598 / 39 |
| sitemap-guides | 139 | 2.51 s / 2.80 s | 50% | 70 (63) | 4.92 s | 607 / 49 |
| sitemap-hostel | 94 | 2.55 s / 2.76 s | 46% | 70 (68) | 5.05 s | 613 / 55 |
| sitemap-misc | 22 | 3.06 s / 3.16 s | 36% | 69 (68) | 5.27 s | 670 / 112 |
| sitemap-programmatic | 25 | 2.46 s / 2.51 s | 72% | 70 (68) | 5.03 s | 608 / 49 |
| sitemap-static | 45 | 2.43 s / 2.81 s | 58% | 70 (65) | 4.96 s | 607 / 42 |
| sitemap-tour-packages | 75 | 2.90 s / 3.09 s | 0% | 66 (64) | 5.64 s | 708 / 38 |
| sitemap-tours | 136 | 2.41 s / 2.60 s | 69% | 70 (54) | 4.93 s | 605 / 47 |

## Most common PageSpeed opportunities

- Use efficient cache lifetimes — 665 pages, ~184 ms LCP saving each
- Render-blocking requests — 665 pages, ~32 ms LCP saving each
- Reduce unused JavaScript — 664 pages, ~450 ms LCP saving each
- Improve image delivery — 664 pages, ~52 ms LCP saving each
- Minimize main-thread work — 7 pages, ~0 ms LCP saving each
- Reduce JavaScript execution time — 3 pages, ~0 ms LCP saving each
- Image elements do not have explicit `width` and `height` — 2 pages, ~0 ms LCP saving each
- Avoid enormous network payloads — 1 pages, ~0 ms LCP saving each
- Avoid large layout shifts — 1 pages, ~0 ms LCP saving each

## Slowest pages (lab LCP)

- /things-to-do-in-meghalaya — 7.99 s (IMG assets/northeast-ecological-education-authentic-DcCVgflo.jpg)
- /destinations/meghalaya/dawki — 4.75 s (P We use necessary cookies to run the site. With you)
- /meghalaya-adventure-tour — 4.05 s (IMG img/o/xtsyvoyage-nongriat-double-decker-root-bridge-736.webp)
- /destinations/meghalaya/tura/tura-peak — 4.00 s (P We use necessary cookies to run the site. With you)
- /destinations/meghalaya/shillong/sweet-falls — 3.97 s (P We use necessary cookies to run the site. With you)
- /destinations/meghalaya/shillong/bishop-falls — 3.96 s (P We use necessary cookies to run the site. With you)
- /5-day-meghalaya-itinerary — 3.93 s (P We use necessary cookies to run the site. With you)
- /2-day-assam-trip — 3.72 s (IMG /img/o/xtsyvoyage-assam-cover-image-736.avif)
- /student-accommodation-near-nift-shillong — 3.70 s (IMG /img/o/xtsy-property-images-6-828.avif)
- /3-day-mizoram-trip — 3.63 s (IMG /img/o/xtsyvoyage-meghalaya-cover-image-736.avif)
- /glamping-near-shillong-airport — 3.57 s (IMG /img/o/xtsy-270-xtsy270-900.avif)
- /tours/bumla-pass-bike-expedition — 3.54 s (IMG /img/px/tour-28-828.avif)
- /monsoon-in-aizawl — 3.54 s (IMG /img/o/xtsyvoyage-meghalaya-cover-image-736.avif)
- / — 3.53 s (IMG /img/o/xtsy-property-images-8-portrait-828.avif)
- /workation-cherrapunji — 3.53 s (IMG /img/o/xtsy-property-images-27-1242.avif)

## Lowest PageSpeed scores

- /bike-trip-assam — 54 (LCP 3.53 s)
- /things-to-do-in-meghalaya — 63 (LCP 7.23 s)
- /meghalaya-photography-tour — 63 (LCP 3.96 s)
- /destinations/meghalaya/dawki/shnongpdeng — 64 (LCP 6.53 s)
- /destinations/meghalaya/cherrapunji/nongriat-village — 64 (LCP 6.38 s)
- /tours/arunachal-winter-cultural-festival — 64 (LCP 6.54 s)
- /gallery — 65 (LCP 17.56 s)
- /tours/assam-wildlife-tea-heritage — 65 (LCP 5.80 s)
- /tours/kerala-winter-backwaters-paradise — 65 (LCP 5.66 s)
- /tours/kullu-valley-winter-adventure — 65 (LCP 5.60 s)
- /destinations/meghalaya/dawki/dawki-suspension-bridge — 65 (LCP 5.96 s)
- /tours/turkey-history-landscape-route — 65 (LCP 5.68 s)
- /tours/xtsy-solo-traveller-pass-meghalaya — 65 (LCP 5.69 s)
- /tours/5d-meghalaya-trip-package — 66 (LCP 5.64 s)
- /tours/6d-meghalaya-honeymoon-package — 66 (LCP 5.66 s)

## Console errors

- 49 pages: Failed to load resource: net::ERR_NAME_NOT_RESOLVED
- 6 pages: Failed to load resource: the server responded with a status of 403 ()