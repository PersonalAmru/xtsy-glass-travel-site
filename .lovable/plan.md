

## Plan: Add Small WhatsApp Button on XTSY 270 Page

**File: `src/pages/XTSY270.tsx`**

Add a small fixed WhatsApp button in the bottom-right corner of the page, linking to the business WhatsApp (`wa.me/918837317070`). It will use the existing `whatsapp-icon.svg` asset and fire the `lead_initiated` GTM event on click (consistent with the existing `FloatingWhatsApp` component).

- Import the WhatsApp icon SVG and `routeGTMEvent`
- Add a fixed-position `<a>` tag in the bottom-right corner (`fixed bottom-6 right-6 z-50`) with a small green circular button (`w-12 h-12 rounded-full bg-[#25D366]`) containing the WhatsApp icon
- Opens `https://wa.me/918837317070` in a new tab
- This is page-specific, placed inside the XTSY270 component's return JSX

