
# Replace Arc Animation with PhotoGallery Spread Animation

## What Changes
Replace the `ArcGalleryHero` component on `/things-to-do-in-meghalaya` with a new `PhotoGallery` component adapted from the provided code.

## Steps

### 1. Create `src/components/ui/photo-gallery.tsx`
- Adapt the provided gallery.tsx for React/Vite (no `next/image`, use standard `<img>`)
- Use `framer-motion` (already installed) for spring animations
- Photos spread horizontally from a stacked center position with slight random rotations
- Mouse-tracking gradient overlay on each photo
- Responsive: scale down positions on mobile

### 2. Pick best 5 images from existing page assets
- Use the same Supabase gallery images already referenced in ThingsToDoInMeghalaya.tsx
- No new image assets needed

### 3. Update `ThingsToDoInMeghalaya.tsx`
- Replace `ArcGalleryHero` import/usage with `PhotoGallery`
- Keep hero background image, title, subtitle, and CTA buttons intact
- Preserve all SEO content below unchanged

### No other files modified. No new dependencies needed (framer-motion already installed).
