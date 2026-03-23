

## Plan: Fix Gallery Lightbox Visibility

### Problem
The lightbox uses a small fixed-size container (`w-72 h-[360px]`) with `object-cover`, making images appear tiny and cropped. The `bg-black/95` overlay combined with the small image makes it look too dark.

### Changes (single file: `src/components/ImageLightbox.tsx`)

**1. Replace fixed-size container with responsive viewport-filling layout (lines 146-158)**
- Remove the fixed `w-72 h-[360px]` container and `aspect-[4/5]`
- Use `max-w-[90vw] max-h-[85vh]` with `object-contain` so images fill the viewport while preserving aspect ratio

**2. Reduce overlay darkness (line 97)**
- Change `bg-black/95` to `bg-black/80` for a less oppressive backdrop

**3. Add onError fallback on the lightbox image**
- If an image fails to load in the lightbox, fall back to `/placeholder.svg` and mark as loaded

No other files changed.

