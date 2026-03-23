

## Plan: Replace First Two Gallery Image URLs

### What
Replace the broken image URLs for the first two gallery items (id 1 and id 2) with the valid XTSY 270 asset URLs provided.

### Changes (single file: `src/components/GallerySection.tsx`)

**Lines 95-96** — Update the `image` field:
- Item id 1: change URL to `https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/270/ChatGPT%20Image%20Mar%207,%202026,%2008_23_20%20PM.png`
- Item id 2: change URL to `https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/270/ChatGPT%20Image%20Feb%2028,%202026,%2002_15_59%20PM.png`

Everything else (titles, categories, featured flags, grid layout, error handling, transitions) remains unchanged.

