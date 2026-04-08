

# SEO Infrastructure Expansion — Excel Keyword Integration + 300+ Pages

## Current State
- **72 SEO pages** exist in `src/data/seoPages.ts` across 10 categories
- **Programmatic route** `/:slug` already handles dynamic rendering via `ProgrammaticSEOPage.tsx`
- Excel contains **~180 keyword rows** from Google Ads campaigns covering: car/bike rentals, Neigrihms hospital accommodation, hostel/dormitory, Zostel competitor capture, luxury stays, tour packages, travel agency, self-drive cars (Guwahati focus), and transport routes

## Gap Analysis — Missing Keywords from Excel

### Already covered (existing pages handle these):
- backpacker hostel shillong, hostels in shillong, shillong dormitory, budget stay
- car rental shillong, bike rental shillong, self drive car, luxury car rental, premium SUV rental
- hotel near neigrihms, lodge/guest house/homestay near neigrihms
- nongjrong tour package, meghalaya tour packages, north east tour packages
- luxury stays, glasshouse stays

### NEW pages needed from Excel keywords:

**Competitor Capture (5 pages)**
- `zostel-vs-xtsy-shillong` — targets "zostel shillong", "zostel prices", "zostel meghalaya"
- `isabella-hostel-vs-xtsy` — targets competitor search
- `stargaze-hostel-vs-xtsy` — competitor capture
- `zion-backpackers-vs-xtsy` — competitor capture
- `youth-hostel-shillong` — targets "youth hostel shillong"

**Self-Drive & Transport Guwahati (8 pages)**
- `self-drive-car-guwahati` — targets "self drive cars in guwahati"
- `car-rental-guwahati` — targets "guwahati self drive car rental"
- `scooty-rental-shillong` — targets "scooty rental"
- `suv-rental-shillong` — targets "suv rental near me"
- `cheap-car-rental-shillong` — targets "cheapest rental cars", "cheap car hire"
- `guwahati-to-shillong-transport` — targets bus route queries (siliguri, dimapur, kohima, tawang, guwahati to shillong)
- `car-booking-shillong` — targets "car booking", "car hire"
- `vehicle-rental-northeast` — targets "vehicle rental near me", "vehicle rental"

**Travel Agency (3 pages)**
- `travel-agency-shillong` — targets "travel agency in shillong", "best travel agency in shillong"
- `tour-operators-meghalaya` — targets "tour operators in meghalaya" (highest performing keyword: 108 impressions, 15 clicks)
- `tour-operators-shillong` — targets "tour operators in shillong"

**Experience & Intent (8 pages)**
- `solo-trip-meghalaya` — targets "solo trip", "solo travel"
- `north-east-trip-guide` — targets "north east trip", "is north east safe"
- `offbeat-meghalaya` — targets "offbeat india"
- `shillong-vacation-planner` — targets "shillong vacation", "shillong offers"
- `group-booking-shillong` — targets "group booking shillong"
- `luxury-resorts-for-couples-shillong` — targets "luxury resorts for couples"
- `unique-luxury-stay-india` — targets "unique luxury stay india", "glasshouse stays india"
- `luxury-stays-in-india` — targets "luxury stays in india"

**Accommodation Expansion (6 pages)**
- `stays-in-shillong` — targets "stays in shillong"
- `dorms-in-shillong` — targets "dorms in shillong", "dormitory room in shillong"
- `places-to-stay-shillong` — targets location-intent queries
- `homestay-in-mawlynnong` — targets homestay near cleanest village
- `hotel-near-police-bazar` — high-intent accommodation
- `guest-house-shillong` — targets budget guest house searchers

**Long-Tail Tourism (expanded from user's list, ~200 pages)**
Expand the existing registry with bulk-generated pages for:
- Itinerary variants: 4-day, 6-day, 8-day, weekend
- Destination combos: "shillong-to-cherrapunji-road-trip", "dawki-to-mawlynnong-guide"
- Seasonal: "meghalaya-in-october", "meghalaya-in-december", "shillong-in-winter"
- Activity combos: "kayaking-in-meghalaya", "birdwatching-meghalaya", "fishing-in-dawki"
- Hospital accommodation: "hospital-accommodation-shillong", "patient-attendant-stay-neigrihms"
- Food & dining: "best-restaurants-shillong", "street-food-police-bazar", "khasi-food-guide"
- Transport: how-to-reach from 10+ origin cities
- Weddings & events: "outdoor-venue-shillong", "pre-wedding-shoot-meghalaya"

## Implementation Plan

### Step 1: Expand seoPages.ts with ~230 new page entries
Add new category helper functions where needed (e.g., `transport`, `competitor`). Add all keyword-mapped pages with optimized title tags (under 60 chars), meta descriptions (under 155 chars), H1, 2-3 content sections, 1-2 FAQs, related slugs, and keyword arrays.

### Step 2: Add new categories to type system
Update `SEOPageCategory` to include: `transport`, `competitor-capture`, `food-dining`, `seasonal`, `events`.
Update `SchemaType` to include any missing types.

### Step 3: Update sitemap.xml
Auto-generate all 300+ URLs into the sitemap with proper lastmod dates and priority values (0.8 for transactional, 0.6 for informational).

### Step 4: Update internal linking
Ensure every new page has 3-5 `relatedSlugs` connecting to existing pages, creating a dense internal link web.

### Step 5: Update ProgrammaticSEOPage.tsx
- Add schema builders for new types (TransportService, FoodEstablishment)
- Improve category labels map for new categories

### Step 6: Add robots.txt updates
Ensure all new URL patterns are crawlable.

## Technical Details

**File changes:**
1. `src/data/seoPages.ts` — Major expansion from ~1,082 lines to ~3,500+ lines (230 new page entries)
2. `src/pages/seo/ProgrammaticSEOPage.tsx` — Add new schema builders and category labels
3. `public/sitemap.xml` — Regenerate with all 300+ URLs
4. `public/robots.txt` — Verify all paths allowed

**No new components needed** — the existing `ProgrammaticSEOPage.tsx` template handles all page types. The `/:slug` catch-all route already serves them.

**Performance note:** The seoPages.ts file will be large but is only loaded when a user hits a `/:slug` route (lazy-loaded via `ProgrammaticSEOPage`). The `findSEOPage()` lookup is O(n) but with 300 entries runs in microseconds.

