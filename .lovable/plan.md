

## Plan: Fix Lightbox Not Opening for All Gallery Images

### Investigation

The code in `GallerySection.tsx` correctly passes `onClick={() => handleImageClick(index)}` to every `GalleryTile`, and the tile wrapper div has `cursor-pointer` and the `onClick` handler. The overlays all have `pointer-events-none`. The `ImageLightbox` receives `allImageUrls` from `filteredItems.map(i => i.image)` and `lightboxIndex`.

However, there is a potential issue: the `<img>` element has `relative z-10` which elevates it into its own stacking context above the parent div. While clicks should still bubble, some browsers may have issues with click propagation on replaced elements (`<img>`) that sit above their parent in z-index. Additionally, the skeleton div intercepts the stacking.

### Changes (single file: `src/components/GallerySection.tsx`)

**1. Add explicit `onClick` directly on the `<img>` element (lines 44-63)**
- Add `onClick={onClick}` to the `<img>` tag itself as a safety net, ensuring clicks on the image always trigger the lightbox regardless of stacking context issues.
- Also add `cursor-pointer` to the image class.

**2. Add `pointer-events-none` to the skeleton placeholder (line 41)**
- Ensure the skeleton cannot intercept clicks while visible (before image loads).

**3. Ensure the wrapper div click always fires (line 35-37)**
- Add `role="button"` and `tabIndex={0}` for accessibility and to reinforce clickability.
- Add `onKeyDown` for Enter/Space to open lightbox.

These are small, targeted changes to guarantee every tile opens the lightbox consistently.

