# Full-site performance — baseline (2026-10-19T15:40 UTC)

Pages: 684. Lab profile: mid-range phone, Slow 4G, 4x CPU, cold cache (warm = repeat visit).

| Measure | Value |
|---|---|
| Lab LCP median / p75 / p95 | 2.48 s / 2.78 s / 3.29 s |
| Pages with good LCP (≤ 2.5 s) | 56% (poor > 4 s: 1%) |
| FCP median / TTFB median | 2.43 s / 208 ms |
| Pages with CLS > 0.1 | 0 |
| Data per first visit / repeat visit (median) | 607 KB / 112 KB |
| JavaScript (median) | 444 KB in 74 files |
| PageSpeed score median (p25) | 67 (67); 2% of pages ≥ 90 |
| PageSpeed LCP / FCP / TBT median | 5.66 s / 4.20 s / 0 ms |
| Static files without long caching | 248 |

## By template

| Template | Pages | Lab LCP med / p75 | Good LCP | PSI score med (min) | PSI LCP med | KB first / repeat |
|---|---|---|---|---|---|---|
| sitemap-destinations | 79 | 2.35 s / 2.47 s | 81% | 68 (64) | 5.58 s | 624 / 88 |
| sitemap-dining | 70 | 2.42 s / 2.56 s | 69% | 68 (66) | 5.58 s | 598 / 104 |
| sitemap-guides | 139 | 2.48 s / 2.72 s | 55% | 68 (62) | 5.58 s | 607 / 113 |
| sitemap-hostel | 94 | 2.53 s / 2.73 s | 49% | 67 (65) | 5.71 s | 613 / 119 |
| sitemap-misc | 22 | 3.10 s / 3.29 s | 36% | 67 (66) | 5.78 s | 670 / 177 |
| sitemap-programmatic | 25 | 2.45 s / 2.48 s | 76% | 67 (66) | 5.71 s | 608 / 117 |
| sitemap-static | 45 | 2.46 s / 2.67 s | 60% | 67 (63) | 5.71 s | 606 / 106 |
| sitemap-tour-packages | 74 | 2.89 s / 3.06 s | 0% | 64 (63) | 6.30 s | 707 / 102 |
| sitemap-tours | 136 | 2.45 s / 2.55 s | 72% | 67 (66) | 5.63 s | 605 / 112 |

## Most common PageSpeed opportunities

- Use efficient cache lifetimes — 660 pages, ~431 ms LCP saving each
- Render-blocking requests — 660 pages, ~56 ms LCP saving each
- Reduce unused JavaScript — 659 pages, ~465 ms LCP saving each
- Improve image delivery — 659 pages, ~33 ms LCP saving each
- Minimize main-thread work — 12 pages, ~0 ms LCP saving each
- Reduce JavaScript execution time — 4 pages, ~0 ms LCP saving each
- Avoid large layout shifts — 3 pages, ~0 ms LCP saving each
- Image elements do not have explicit `width` and `height` — 2 pages, ~0 ms LCP saving each
- Avoid enormous network payloads — 1 pages, ~0 ms LCP saving each

## Slowest pages (lab LCP)

- /things-to-do-in-meghalaya — 7.70 s (IMG assets/northeast-ecological-education-authentic-DcCVgflo.jpg)
- /3-day-arunachal-pradesh-itinerary — 5.99 s (IMG /img/o/xtsyvoyage-arunachal-pradesh-cover-image-500.avif)
- /destinations/meghalaya/dawki — 4.78 s (P We use necessary cookies to run the site. With you)
- /how-to-reach-cherrapunji — 4.54 s (P Backed by XTSY — Northeast India's NEITA 2025-nomi)
- /monsoon-in-tawang — 4.52 s (IMG /img/o/xtsyvoyage-arunachal-pradesh-cover-image-500.avif)
- /meghalaya-adventure-tour — 4.29 s (IMG img/o/xtsyvoyage-nongriat-double-decker-root-bridge-736.webp)
- /destinations/meghalaya/tura/tura-peak — 4.22 s (P We use necessary cookies to run the site. With you)
- /destinations/meghalaya/shillong/bishop-falls — 3.99 s (P We use necessary cookies to run the site. With you)
- /5-day-meghalaya-itinerary — 3.97 s (P We use necessary cookies to run the site. With you)
- /destinations/meghalaya/shillong/sweet-falls — 3.94 s (P We use necessary cookies to run the site. With you)
- /2-day-assam-itinerary — 3.83 s (IMG /img/o/xtsyvoyage-assam-cover-image-736.avif)
- /glamping-in-shillong-tonight — 3.62 s (IMG /img/o/xtsy-270-xtsy270-900.avif)
- /glamping-near-shillong-airport — 3.61 s (IMG /img/o/xtsy-270-xtsy270-900.avif)
- /tours/thailand-nature-culture-escape — 3.58 s (IMG /img/px/tour-302-828.avif)
- /pet-friendly — 3.56 s (IMG /img/o/xtsy-property-images-15-828.avif)

## Lowest PageSpeed scores

- /things-to-do-in-meghalaya — 62 (LCP 7.82 s)
- /gallery — 63 (LCP 16.13 s)
- /tours/wari-chora-hidden-gem-of-meghalaya — 63 (LCP 6.30 s)
- /how-to-reach-dawki — 63 (LCP 5.73 s)
- /tours/4n-5d-shillong-meghalaya-tour — 63 (LCP 6.78 s)
- /destinations/meghalaya/cherrapunji/rainbow-falls — 64 (LCP 6.98 s)
- /destinations/meghalaya/shillong/umiam-lake — 64 (LCP 6.32 s)
- /tours/5d-meghalaya-trip-package — 64 (LCP 6.38 s)
- /tours/6d-meghalaya-honeymoon-package — 64 (LCP 6.38 s)
- /tours/6n-7d-meghalaya-tour — 64 (LCP 6.30 s)
- /tours/dawki-crystal-waters-winter-escape — 64 (LCP 6.38 s)
- /tours/kodaikanal-winter-hill-retreat — 64 (LCP 6.30 s)
- /tours/kerala-winter-backwaters-paradise — 64 (LCP 6.30 s)
- /tours/kullu-valley-winter-adventure — 64 (LCP 6.33 s)
- /tours/manipur-loktak-lake-winter-discovery — 64 (LCP 6.30 s)

## Console errors

- 682 pages: The Content Security Policy directive 'frame-ancestors' is ignored when delivered via a <meta> element.
- 682 pages: X-Frame-Options may only be set via an HTTP header sent along with a document. It may not be set inside <meta>.
- 630 pages: Failed to load resource: the server responded with a status of 429 ()
- 48 pages: Failed to load resource: net::ERR_NAME_NOT_RESOLVED
- 43 pages: Connecting to 'https://o4510659453911040.ingest.us.sentry.io/api/4510659499982848/envelope/?sentry_version=7&sentry_key=de60ec1c757d6d0b6fd991d42d4b8e06&sentry_
- 43 pages: Fetch API cannot load https://o4510659453911040.ingest.us.sentry.io/api/4510659499982848/envelope/?sentry_version=7&sentry_key=de60ec1c757d6d0b6fd991d42d4b8e06&
- 2 pages: Failed to load resource: the server responded with a status of 409 ()
- 1 pages: Failed to load resource: net::ERR_CONNECTION_CLOSED
- 1 pages: Failed to load resource: net::ERR_CERT_DATE_INVALID