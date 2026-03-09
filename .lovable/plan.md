

## Problem

The `FloatingWhatsApp` component is imported in `App.tsx` but **never actually rendered** in the JSX tree. That's why no WhatsApp button appears on any page, including `/xtsy-270`.

The page-specific WhatsApp button we added to `XTSY270.tsx` should work, but it may be visually hidden behind the "Will it be yours?" CTA bar or missing the Footer component (which would push content).

## Plan

**File: `src/App.tsx`** — Add `<FloatingWhatsApp />` to the rendered JSX, right after `</Routes>` and before closing `</TooltipProvider>`.

This will make the floating WhatsApp button appear on all pages (except `/admin` and `/booking` as already handled by the component's logic).

**File: `src/pages/XTSY270.tsx`** — Remove the duplicate page-specific WhatsApp button we added earlier (lines 395-404), since the global component will now handle it.

