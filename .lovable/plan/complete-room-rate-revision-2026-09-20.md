# Complete room-rate revision

## Scope
- Reuse the existing room inventory and Panorama pricing data as the source for guest-visible prices.
- Correct the WhatsApp enquiry and booking payloads for the Panorama package and decoration choices, and verify all other room quotes.
- Remove the winter promotion and strike-through discount presentation from the homepage rooms section.
- Remove the unavailable 4-bed mixed dorm from search, landing content, booking access, integrations, and other guest-reachable paths.
- Finish Panorama package selection and the optional decoration add-on across totals, GST, summaries, saved booking details, and WhatsApp text.
- Inspect live room records and, only if those records drive the site, apply an additive migration to align rates and deactivate the unavailable room.

## Validation
- Run the TypeScript typecheck.
- Search `src/` and `supabase/functions/` for the exact stale values and room identifier requested, separating unrelated restaurant/menu numbers from accommodation references.
- Exercise the Panorama and room-booking screens in the preview, checking package selection, decoration, totals, and visible room availability.

## Technical notes
- Existing pricing exports will be extended rather than duplicating numeric literals across screens.
- The decoration amount will follow the same taxable subtotal path as the selected Panorama room package.
- Existing consent, analytics validation, and booking security behavior will remain unchanged.
