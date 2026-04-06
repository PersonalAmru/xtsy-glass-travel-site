
## Meghalaya Tourism SEO Architecture — Implementation Plan

### Phase 1: Data Layer & Core Components
1. **Destination Data** (`src/data/meghalayaDestinations.ts`) — Extract all 50+ destinations from the PDF with name, slug, description, region, category
2. **Image Matching Utility** (`src/utils/destinationImages.ts`) — Auto-match Supabase bucket images to destination slugs
3. **Reusable Components:**
   - `DestinationCard` — Image + title + short description + link
   - `DestinationGallery` — Responsive grid with lightbox, lazy loading
   - `RadialScrollGallery` — Install the provided GSAP component into `components/ui/`

### Phase 2: Pillar Page
4. **Things to Do in Meghalaya** (`/things-to-do-in-meghalaya`) — 3000-4000 word SEO pillar page with sections: Near Shillong, Cherrapunji, Adventure, Villages, Itinerary, CTA

### Phase 3: Cluster Pages (Destination Pages)
5. **Dynamic Destination Page** (`/places-to-visit/:slug`) — Template with: Overview, History, Best Time, Things to Do, How to Reach, Travel Tips, Nearby Attractions, Gallery, Book CTA
6. **SEO metadata** for each destination via SEOHead + JSON-LD (TouristDestination, BreadcrumbList)

### Phase 4: Category Pages
7. `/meghalaya-waterfalls`, `/meghalaya-caves`, `/meghalaya-villages`, `/meghalaya-viewpoints`

### Phase 5: Monetization Pages
8. `/meghalaya-tour-packages`, `/meghalaya-couple-tour-package`, `/shillong-tour-package`

### Phase 6: Blog Cluster Pages
9. `/best-time-to-visit-meghalaya`, `/hidden-places-in-meghalaya`, `/3-day-meghalaya-itinerary`, `/5-day-meghalaya-itinerary`, `/budget-trip-to-meghalaya`

### Phase 7: Gallery SEO Pages
10. `/meghalaya-photo-gallery`, `/nohkalikai-falls-photos`, `/dawki-river-photos`

### Phase 8: Programmatic SEO Templates
11. Dynamic routes: `/things-to-do-in-:slug`, `/best-time-to-visit-:slug`, `/:slug-travel-guide`, `/:slug-photos`

### Phase 9: Routing, Sitemap & Internal Linking
12. Register all new routes in App.tsx
13. Update sitemap.xml with all new URLs
14. Internal linking from pillar → clusters → packages

### Phase 10: RadialScrollGallery Integration
15. Install the GSAP scroll gallery component, wire it with destination data + Supabase images on the pillar page

**Total new files: ~20 components/pages + 2 data files + 1 utility**
**No existing files modified except: App.tsx (routes), sitemap.xml, SEOHead.tsx (new configs)**
