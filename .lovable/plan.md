

## Plan: Fix Gallery Image Loading Issues

### Root Cause

The `GalleryTile` component in `src/components/GallerySection.tsx` has a CSS conflict: two conflicting Tailwind transition utilities (`transition-opacity` and `transition-transform`) are applied to the `<img>` tag. In Tailwind, only the last `transition-*` class wins, so the opacity fade-in never actually transitions — images stay at `opacity-0` permanently, appearing as dark boxes even after loading.

Additionally, there is no `onError` handler, so broken images remain invisible forever.

### Changes (single file: `src/components/GallerySection.tsx`)

**1. Fix the CSS transition conflict on the `<img>` tag (line 55-57)**
- Replace the two conflicting `transition-opacity` / `transition-transform` utilities with a single `transition-all` or explicit `transition` style that handles both opacity and transform together.
- Result: images will properly fade in from `opacity-0` to `opacity-100` on load.

**2. Add `onError` fallback handler**
- Add an `onError` callback that sets the image `src` to `/placeholder.svg` and marks it as loaded, so no image card stays blank.

**3. Remove `contentVisibility: "auto"` for items index >= 6**
- This CSS property can cause rendering issues where images in lower rows never become visible. Remove it to ensure all tiles render correctly.

**4. Ensure proper stacking with explicit z-index**
- Give the skeleton placeholder `z-0` and the image `z-10` so the loaded image always appears above the skeleton.

No other files or components are changed.

