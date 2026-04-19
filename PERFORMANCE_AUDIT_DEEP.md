# Deep Performance & Speed Audit — XTSY Homepage

**Date:** 2026-04-19 · **Route:** `/` · **Viewport:** 1366×768 · **Mode:** Vite dev (preview)

> ⚠️ Numbers reflect dev-mode (unminified, HMR overhead). Production will be ~30-50% faster on JS metrics, but **CLS, network, and DOM counts are real**.

---

## 🔴 Core Web Vitals

| Metric | Value | Threshold | Verdict |
|---|---|---|---|
| **TTFB** | 1222 ms | < 800 ms | ⚠️ Slow (dev server) |
| **FCP** | 1896 ms | < 1800 ms | ⚠️ Borderline |
| **DOM Interactive** | 1853 ms | — | OK |
| **DOMContentLoaded** | 8165 ms | < 3500 ms | 🔴 **Very slow** |
| **Full Page Load** | 9225 ms | < 5000 ms | 🔴 **Very slow** |
| **CLS** | **1.4175** | < 0.1 | 🔴 **Critical — 14× over budget** |
| **Script Duration** | 1.22 s | < 500 ms | 🔴 Heavy |
| **Task Duration** | 3.64 s | < 2 s | 🔴 Main-thread saturated |

---

## 🚨 Critical Issues (fix first)

### 1. CLS = 1.4175 — Layout Shift Catastrophe
The page shifts content **continuously after load**. Top offenders captured by the profiler:

| Element | Shift Score |
|---|---|
| `<footer class="bg-card border-t ...">` | **1.4175** |
| `<a class="fixed bottom-20 ... bg-[#25D366]">` (FloatingWhatsApp) | **0.875** |
| Anonymous `<div>` | 0.624 |

**Root cause:** Footer + WhatsApp button mount late (after lazy chunks load) and push content. The site has `content-visibility: auto` with `contain-intrinsic-size: 600px` on `LazyWrapper` (Wave 2 fix) — this is correct, **but the footer itself isn't reserving space** and the `FloatingWhatsApp` button mounts conditionally.

**Fix:** Reserve min-height for footer placeholder; mount `FloatingWhatsApp` synchronously with fixed dimensions from first paint.

### 2. DOM Explosion: 8,781 nodes (after scroll)
- Started at 352 nodes, ballooned to 8,781 after a single scroll.
- 990 event listeners. 4 frames (likely tracking iframes).
- 16-deep DOM tree.

**Root cause:** Every section eager-mounts on first viewport intersection and never unmounts. Multiple gallery/carousel components each spawn 100+ nodes.

**Fix:** Add `IntersectionObserver`-based unmounting on `LazyWrapper` for sections > 2 viewports below; virtualize image grids in `GallerySection` and `TrendingDestinations`.

### 3. Slow Edge Functions Block Render
| Endpoint | Duration |
|---|---|
| `track-analytics` (call 1) | **2224 ms** |
| `track-analytics` (call 2) | **2032 ms** |
| `fetch-exchange-rates` (call 1) | **1662 ms** |
| `fetch-exchange-rates` (call 2) | **1628 ms** |

Both are called **twice** on initial load (StrictMode double-invoke OR redundant mount). They're `fetch` (not blocking) but **use up the network during LCP window**.

**Fix:**
- Move `fetch-exchange-rates` behind `requestIdleCallback` (only needed when currency selector opens).
- Debounce `track-analytics` to batch events into one call per 5s window.

### 4. Heavy Image Payloads, Not Optimized
| Asset | Size | Status |
|---|---|---|
| `xtsy-270-stargazing.jpeg` | 313 KB | Should be < 80 KB WebP |
| `meghalaya-hero.jpg` | 274 KB | LCP candidate, needs `<picture>` AVIF/WebP |
| `xtsy-color-logo.png` | **199 KB** | 🔴 **Logo should be < 15 KB** — likely uncompressed PNG |
| `6 Bed MixedFemale Dorms/1.JPG` | 1694 ms load | Above-fold but not preloaded |

**Fix:**
- Convert `xtsy-color-logo.png` → SVG or 8-bit PNG (saves ~185 KB).
- Run all `/lovable-uploads/*.png` and `/src/assets/*.jpg` through `scripts/optimize-and-upload-images.ts`.

### 5. Scroll Handler Hot Path
`handleScroll` in `useEnhancedAnalytics.tsx:238` consumed **17.7 ms self-time** during a single scroll — fires on every `scroll` event.

**Fix:** Throttle to 250ms via `lodash.throttle` or `requestAnimationFrame` gate.

### 6. Bundle Bloat (dev)
- 156 script requests (1.4 MB)
- `lucide-react` ships **159 KB** — full barrel import is loading every icon.
- `react-dom_client.js` 154 KB (1188 ms parse)

**Fix:**
- Audit `lucide-react` imports — ensure all are `import { X } from 'lucide-react'` (tree-shake), never `import * as Icons`.
- Consider `lucide-react/icons/<name>` per-icon imports for the 5 highest-traffic components.

---

## 🟡 Medium Priority

### 7. Console errors / dev warnings
- `fetchpriority` should be `fetchPriority` (camelCase) — affects `LazyImage`, `OptimizedImage`, `PerformantImage`. Fix the JSX prop name.
- `X-Frame-Options` cannot be set via `<meta>` — remove from `productionSecurityHeaders.ts:85` (must be HTTP header only, set on Cloudflare/edge).

### 8. CPU profile findings (13.3s window during scroll)
| Function | Self-time |
|---|---|
| `_c1` (Sheet portal) | 31.4 ms |
| `defineKeyPropWarningGetter` (React DEV) | 26.2 ms |
| `appendChild` | 40.5 ms |

Sheet/Dialog portals are mounting unnecessarily on first render. Defer modal mounting to `onOpenChange`.

### 9. Style recalc overhead
- 256 style recalcs / 343.8 ms on a single scroll.
- Likely caused by Tailwind utility churn on hover/intersection state.

**Fix:** Consolidate animated chip classes into static CSS variants.

---

## 📋 Priority Action List

| # | Action | File | Impact |
|---|---|---|---|
| 1 | Reserve footer min-height; preload WhatsApp FAB | `Footer.tsx`, `FloatingWhatsApp.tsx` | CLS 1.4 → < 0.1 |
| 2 | Optimize `xtsy-color-logo.png` (199 KB → SVG) | `src/assets/` | -185 KB |
| 3 | Throttle `handleScroll` analytics | `useEnhancedAnalytics.tsx:238` | -50% scroll jank |
| 4 | Defer `fetch-exchange-rates` to idle/onOpen | `CurrencySelector.tsx` | -3.3s network |
| 5 | Batch `track-analytics` calls | `useAnalytics.tsx` | -4.2s network |
| 6 | Fix `fetchpriority` → `fetchPriority` JSX | 3 image components | Removes DEV errors |
| 7 | Remove `<meta http-equiv="X-Frame-Options">` | `productionSecurityHeaders.ts:85` | Removes warning |
| 8 | Unmount `LazyWrapper` content > 2 viewports below | `LazyWrapper.tsx` | DOM 8.7k → ~2k |
| 9 | Per-icon imports for top 5 lucide icons | various | -50 KB initial |

---

## ✅ What's Working

- `content-visibility: auto` on `LazyWrapper` is firing correctly (Wave 2).
- Marquee `animationPlayState='paused'` off-screen is active (Wave 2).
- Service worker registered, idle-deferred caching live (Wave 4).
- Heap 35.7 MB / 2.1 GB limit — plenty of headroom.
- Layout count 70 in 9s = acceptable.

---

## Recommended next step

Pick the priority tier you want shipped:
- **Tier A (CLS + Network):** Items 1, 3, 4, 5 — the four that move CWV most.
- **Tier B (Bundle + DOM):** Items 2, 8, 9 — for sustained scroll & repeat-visit perf.
- **Tier C (Cleanup):** Items 6, 7 — quick warnings sweep.

Reply `Ship Tier A` (or A+B, all, etc.) and I'll execute.
