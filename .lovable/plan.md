

# Visual UI/UX Audit — All Pages

## Summary
Full audit across all public-facing pages identifying visual bugs, image loading issues, empty screen risks, missing pagination, and UX gaps.

---

## Critical Issues Found

### 1. Destination Images: Broken/Missing (All SEO Pages)
**Pages affected**: `/things-to-do-in-meghalaya`, `/places-to-visit/:slug`, category pages, photo gallery
**Bug**: `getDestinationImageUrl()` generates URLs like `{slug}-meghalaya-1.webp` but there is no verification these images actually exist in Supabase. If images are missing, users see:
- **DestinationCard**: `UnifiedImage` falls back to a gray placeholder — entire card looks broken
- **DestinationDetail hero**: Raw `<img>` with no `onError` fallback — shows browser broken-image icon
- **DestinationGallery**: `onError` hides the image entirely (`display: none`) — gallery can appear empty
- **ArcGalleryHero**: Falls back to `placehold.co` — functional but poor UX

**Fix**: Add `onError` fallback to DestinationDetail hero image. Add a proper fallback placeholder in DestinationGallery instead of hiding. Verify Supabase bucket images exist or provide a curated fallback map.

### 2. ArcGalleryHero: Content Overlap on Small Viewports
**Page**: `/things-to-do-in-meghalaya`
**Bug**: The arc uses absolute positioning with `bottom: 35%` for the circle and `bottom: 8%` for the text. On viewports between 640-768px (tablet), arc cards and the CTA text overlap. The `minHeight: 80vh` is insufficient when cards + text compete for vertical space.
**Fix**: Make `bottom` percentages responsive or increase `minHeight` on medium viewports.

### 3. Tours Page: No Pagination
**Page**: `/tours`
**Bug**: `filteredTours` renders ALL tours (30+) in a single grid with no pagination or "load more". On mobile, this creates a very long scroll with 30+ image cards loading simultaneously.
**Fix**: Add pagination or "Load More" with initial batch of 9-12 cards.

### 4. ThingsToDoInMeghalaya: All 50+ Destinations Rendered at Once
**Page**: `/things-to-do-in-meghalaya`
**Bug**: The "All Destinations" section renders all `meghalayaDestinations` (50+ cards) simultaneously. Each card triggers an image load via `UnifiedImage`. No pagination, lazy chunking, or "Show More" pattern.
**Fix**: Add "Show More" or paginate in batches of 12.

### 5. ReviewsSection: 992 Lines, Heavy Initial Render
**Page**: Homepage
**Bug**: 20+ hardcoded fallback reviews in component body + DB reviews loaded on mount. The marquee animation triples the DOM (3 copies). On slow connections, users may see a blank section before reviews load from Supabase.
**Fix**: Already uses `LazyWrapper` — acceptable. But the marquee tripling with 20+ cards creates ~60+ review DOM nodes. Consider reducing visible count.

### 6. DestinationDetail Hero: No Loading State
**Page**: `/places-to-visit/:slug`
**Bug**: The hero section uses a raw `<img>` tag without:
- `loading="eager"` or `fetchPriority="high"` for LCP
- No skeleton/placeholder while loading
- No `onError` handler — broken image shows browser default

**Fix**: Add `onError` fallback, `fetchPriority="high"`, and a background color placeholder.

### 7. Gallery Page: Scroll-to-Gallery Timing Issue
**Page**: `/gallery`
**Bug**: Uses `setTimeout(100ms)` to scroll to gallery section and dispatch filter events. This is fragile — if the gallery component hasn't mounted yet (lazy loaded), the scroll target won't exist.
**Fix**: Use a ref-based or `MutationObserver` approach instead of timeout.

### 8. Tab Bistro Menu: No Scroll Indicator
**Page**: `/tab-bistro`
**Bug**: The menu tabs section doesn't indicate horizontal scrollability on mobile if there are many categories. Users may not discover all menu categories.
**Fix**: Add scroll shadows or a swipe hint.

---

## Medium Issues

### 9. Tours Page: Mobile Filter Overlay Has No Body Scroll Lock
**Page**: `/tours`
**Bug**: When the mobile filter drawer opens, the background content is still scrollable. Users can accidentally scroll the page behind the filter overlay.
**Fix**: Add `overflow: hidden` to body when filter overlay is open.

### 10. HomeTourPackages: `motion` Import on Homepage
**Page**: Homepage (`/`)
**Bug**: `HomeTourPackages` imports `motion` from `framer-motion` for a simple fade-in. This adds ~30KB to the homepage bundle. The section is already lazy loaded, but framer-motion may already be in the main bundle.
**Fix**: Replace with CSS `animate-fade-in` or intersection observer pattern already used elsewhere.

### 11. AdventureCallToAction: `backdrop-blur-md` on CTA Card
**Page**: Homepage
**Bug**: Uses `backdrop-blur-md` which can cause jank on lower-end mobile devices during scroll. The memory note explicitly warns about GPU overhead from background blurs.
**Fix**: Remove `backdrop-blur-md` or replace with solid semi-transparent background.

### 12. CategoryPage: Slug Extraction is Fragile
**Page**: `/meghalaya-waterfalls`, `/meghalaya-caves`, etc.
**Bug**: `pathname.replace('/', '')` only removes the first `/`. If the path ever changes or has trailing slashes, matching breaks. Example: `/meghalaya-waterfalls/` would become `meghalaya-waterfalls/` and fail to match.
**Fix**: Use `pathname.replace(/^\/|\/$/g, '')` for robust slug extraction.

### 13. DestinationGallery Lightbox: No Keyboard Navigation or Swipe
**Page**: All destination detail pages
**Bug**: The lightbox has click-based navigation but no keyboard arrow key support and no touch/swipe gestures for mobile.
**Fix**: Add `keydown` event listener for ArrowLeft/ArrowRight and swipe gesture support.

---

## Minor / Polish Issues

### 14. GallerySection: No "Load More" for Large Galleries
If the gallery has many items, all load at once. The first 3 use eager loading, rest use lazy — acceptable but could benefit from progressive loading.

### 15. MobileBottomNav / FloatingWhatsApp Overlap
Both components may render fixed-position elements at the bottom of the viewport. Needs z-index coordination check.

### 16. XTSYPrimeSection: Image URLs via `import.meta.url`
Uses `new URL(../assets/..., import.meta.url).href` — works but if any asset file is missing, it silently breaks with no fallback.

---

## Implementation Plan (Prioritized)

### Phase 1 — Critical Fixes (Image & Empty Screen Prevention)
1. **DestinationDetail hero**: Add `onError` fallback, `fetchPriority="high"`, skeleton bg
2. **DestinationGallery**: Replace `display:none` on error with placeholder image
3. **DestinationCard/UnifiedImage**: Ensure fallback renders a branded placeholder instead of gray box
4. **ArcGalleryHero**: Fix card/text overlap on tablet viewports

### Phase 2 — Pagination & Performance
5. **Tours page**: Add "Load More" with 12-card batches
6. **ThingsToDoInMeghalaya**: Add "Show More" for All Destinations section (show 12, expand to full)
7. **Tours mobile filter**: Add body scroll lock
8. **CategoryPage**: Fix slug extraction regex

### Phase 3 — UX Polish
9. **DestinationGallery lightbox**: Add keyboard nav (ArrowLeft/Right, Escape)
10. **AdventureCallToAction**: Remove `backdrop-blur-md`
11. **Gallery page**: Replace `setTimeout` scroll with robust approach
12. **Tab Bistro menu**: Add mobile scroll indicator

### Estimated Scope
- **Files to modify**: ~10 components
- **New code**: ~150 lines additions, ~30 lines removals
- **No new dependencies required**
- **No routing or layout changes**

