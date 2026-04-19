# XTSY Site Health Audit — Empty Pages, Load Errors & Scroll Glitches

**Date:** 2026-04-19  
**Scope:** Public pages, programmatic SEO (1,400+ slugs), homepage scroll perf  
**Status:** Audit-only — no code changes. Pick which fixes you want and I'll execute.

---

## 🔴 PRIORITY 1 — Empty / Thin Programmatic SEO Pages

### Finding
`src/pages/seo/ProgrammaticSEOPage.tsx` powers the catch-all `/:slug` route. When `findSEOPage(slug)` fails it correctly renders `<NotFound />`. **However**, when it succeeds, content quality is uneven:

| Source | Pages | Content depth | Risk |
|---|---|---|---|
| `seoPages.ts` (hand-written) | 13 | Rich, 800-1500 words | ✅ OK |
| `seoPageFactory.ts` (templated) | 9 base patterns × ~150 generated slugs | 4 generic sections + 4 reused FAQs | 🔴 **Thin** |
| `seoPagesActivities/Durations/Routes/Institutions/GlobalNE/Intent` | ~1,200+ | Same shared template helpers (`bestTimeSection`, `thingsToDoSection`, `travelTipsSection`) | 🔴 **Near-duplicate content across hundreds of URLs** |

**Why pages feel "empty":**
1. Same 4 paragraphs reused across 200+ destination guides (only the state name swapped) → Google treats as doorway pages, may serve a soft-404.
2. No images inside sections — only the hero image.
3. AI Quick Answer block uses identical templated sentences.
4. `nearbyAttractions` field exists on the type but isn't populated by the factory.

### Recommended fixes
- **A.** Add `<NotFound />` fallback when section count < 3 OR total `intro + sections.content` length < 600 chars (prevents thin pages from indexing).
- **B.** Inject the AI hero image *and* 1-2 contextual gallery images per section (we already have `getHeroImageForPage`).
- **C.** Use Lovable AI / Pexels (already configured) to generate **unique** intro + first-section paragraphs per slug at build time, cached as JSON.
- **D.** Add `noindex` to factory-generated pages until C is shipped.

---

## 🟠 PRIORITY 2 — Homepage Scroll Glitches

### Findings (from code scan, 1021×667 viewport)

1. **Multiple eager-loaded sections above the fold**  
   `Index.tsx` marks 6 sections as `<LazyWrapper eager>` (AvailableStaysNow, TrendingDestinations, DestinationExplorer, XTSYPrime, HomeTourPackages). All hydrate together → main-thread spike during first scroll.

2. **`backdrop-blur-sm` over animated marquees**  
   `ReviewsSection.tsx` runs two infinite marquees (lines 694, 723) at 40-45s each. `TrendingDestinations.tsx:104` uses `backdrop-blur-sm` on cards. Per project memory rule: *avoid backdrop-blur on animated/scrollable areas*. This forces the compositor to re-sample every frame during scroll.

3. **HeroSection has 2 fixed-position SVG layers + grid pattern**  
   Lines 195-202 layer a 64px grid + bottom mountain SVG behind animated language text + `animate-bounce` chevron. Each scroll triggers paint of full-viewport pseudo-element.

4. **Service worker cache-busting**  
   `public/sw.js` does `cache.put` *during* navigation (line 81). On slow connections this blocks the main thread mid-scroll.

5. **No `content-visibility: auto`** on below-fold sections — full layout cost on every scroll tick.

### Recommended fixes
- **E.** Demote `XTSYPrimeSection`, `HomeTourPackages` to non-eager `<LazyWrapper>` (saves ~200ms TBT).
- **F.** Replace `backdrop-blur-sm` in `TrendingDestinations.tsx` with `text-shadow` + solid `bg-black/40`.
- **G.** Pause marquee animations when section is off-screen (`IntersectionObserver` → `animation-play-state: paused`).
- **H.** Add `content-visibility: auto; contain-intrinsic-size: 600px;` to all `<LazyWrapper>` wrappers.
- **I.** Move SW `cache.put` into `event.waitUntil()` with `requestIdleCallback`.

---

## 🟠 PRIORITY 3 — Page Load Errors (Lazy Chunks)

### Finding
`App.tsx` defines 50+ `createLazyComponent` wrappers with a 100ms→250ms retry. On flaky mobile networks the second retry still fails → ErrorBoundary shows generic "Page couldn't load." This is the most common root cause of users reporting "empty pages" that are actually chunk-load failures.

**Evidence:** `ErrorBoundary.tsx` line 41-46 already lists 5 chunk-error patterns it tries to recover from.

### Recommended fixes
- **J.** Bump retries from 2 to 3 with backoff (250ms, 750ms, 2000ms).
- **K.** On final failure, force a hard `window.location.reload()` instead of showing the error UI (pulls fresh chunk hashes after a deploy).
- **L.** Add a Vite `build.rollupOptions.output.manualChunks` strategy to keep route chunks <100KB (currently many admin pages bundle huge libs).

---

## 🟡 PRIORITY 4 — Image-Driven "Empty" Perception

Most "empty" reports trace back to broken images on programmatic SEO heroes. `ProgrammaticSEOPage.tsx:275-279` already has an `onError` that hides the `<img>` — leaving a transparent gradient overlay over a dark background. **Looks empty to the user.**

### Recommended fix
- **M.** On image error, swap to `getAIHeroURL(slug)` first, then fall back to `/lovable-uploads/8059ea95-…png` brand placeholder, never to `display:none`.

---

## 🟢 PRIORITY 5 — Misc QoL

- `console.log` in `PerformanceMonitor.tsx` fires on every navigation/resource entry → noisy and slows DevTools. Gate behind `import.meta.env.DEV`.
- `Header.tsx:64` still uses `backdrop-blur-md` on desktop — keep, but add `will-change: auto` (currently default to `transform`-promoted layer that lingers).
- 99 markdown audit files in repo root — clutter, no runtime impact.

---

## 📋 Suggested Execution Order (Supreme Dragon Plan v2)

| Wave | Items | Effort | Impact |
|---|---|---|---|
| **Wave 1 — Stop the bleeding (today)** | A, D, J, K, M | 1 cycle | Empty pages disappear; chunk errors auto-recover |
| **Wave 2 — Scroll fluidity (next)** | E, F, G, H | 1 cycle | Homepage scroll smoothness, lower CLS |
| **Wave 3 — Content depth (longer)** | B, C | 2-3 cycles | 1,000+ pages get unique imagery + AI intros |
| **Wave 4 — Polish** | I, L, gate logs | 1 cycle | Lighthouse +5-10 |

---

**Pick the waves you want shipped (e.g. "Wave 1+2") and I'll execute in a single mega-cycle.**
