

# Add Detailed Day-by-Day Itineraries from PDFs to /travel Tours

## Overview
Integrate the detailed day-by-day itineraries from 10 uploaded PDF documents into the existing tour packages on the /travel page. This involves extending the `TourPackage` data type to support structured itinerary data and updating the modal to display real itineraries instead of auto-generated ones.

## What Changes

### 1. Extend the TourPackage Type with Itinerary Data
Add an optional `itinerary` field to the `TourPackage` interface in `src/data/travelData.ts`:

```text
itinerary?: {
  day: string;        // e.g. "Day 1", "Day 0"
  title: string;      // e.g. "Guwahati to Shillong"
  route?: string;     // e.g. "Drive: 3-4 hrs"
  activities: string[];
  overnight?: string; // e.g. "Shillong"
}[]
```

### 2. Map PDFs to Existing Tour IDs
Each PDF maps to an existing tour package. The itinerary data will be added to these entries:

| PDF Document | Existing Tour | Section |
|---|---|---|
| Wilderness Survival Winter Camp | ID 202 - "Wilderness Survival Camp (Winter)" | XTSY Exclusives |
| Northeast Ecological Immersion (Garo Hills) | ID 203 - "Northeast Ecological Immersion" | XTSY Exclusives |
| Wari Chora Hidden Gem | ID 204 - "Wari Chora - Hidden Gem of Meghalaya" | XTSY Exclusives |
| Himachal Yoga Retreat | ID 205 - "Himachal Yoga Retreat Program" | XTSY Exclusives |
| Krem Chympe & Moopun Falls | ID 206 - "Khaddum Expedition - Krem Chympe" | XTSY Exclusives |
| Double Decker Root Bridge | ID 1 - "Double Decker Root Bridge & Cherrapunji" | Northeast > Meghalaya |
| Shillong Winter Cultural Sojourn | ID 5 - "Shillong Winter Cultural Sojourn" | Northeast > Meghalaya |
| Moopun Falls & Phe Phe Falls | ID 7 - "Phi Phi & Moopun Waterfalls Adventure" | Northeast > Meghalaya |
| Arunachal Tawang Exploration | ID 29 - "Tawang Monastery Exploration" | Northeast > Arunachal |
| Northeast Ecological Immersion (Meghalaya 8-day) | ID 201 - "Meghalaya Biodiversity Research Expedition" | XTSY Exclusives |

### 3. Update Tour Metadata Where PDFs Reveal Differences
Some tours will get updated descriptions, highlights, and durations based on the actual PDF content:

- **ID 206 (Krem Chympe)**: Duration change from "6 Days" to "4 Days", highlights updated to include Moopun Falls, cave boating, and stalactite exploration
- **ID 29 (Tawang)**: Highlights updated to include Bum La Pass (India-China border), Sela Pass 13,700 ft, Nuranang Waterfall, Madhuri Lake, hot springs
- **ID 205 (Himachal Yoga)**: Duration change from "7 Days" to "6 Days", highlights updated for Dharamkot, Naddi, Kareri Village, Tushita Meditation Centre
- **ID 5 (Shillong Sojourn)**: Highlights refined to match PDF (Air Force Museum, Golf Course, Don Bosco Museum, Cathedral)

### 4. Update TourPackageModal to Show Real Itineraries
Modify `src/components/TourPackageModal.tsx` to prioritize the structured `itinerary` field from tour data over the auto-generated `generateOverallItineraryView` logic. When `tourPackage.itinerary` exists, render the actual day-by-day breakdown. Fall back to auto-generated view only when no itinerary data is present.

### 5. Create Itinerary Data File
To keep `travelData.ts` manageable, create a separate `src/data/tourItineraries.ts` file containing all 10 detailed itineraries, then merge them into the tour objects at export time.

## Files to Create
- `src/data/tourItineraries.ts` — All 10 itineraries keyed by tour ID

## Files to Modify
- `src/data/travelData.ts` — Add `itinerary` field to `TourPackage` interface, merge itinerary data into tour objects, update metadata for IDs 206/29/205/5
- `src/components/TourPackageModal.tsx` — Render real itineraries when available (day-by-day cards with route, activities, overnight stay info)

## Technical Notes
- The itinerary data is static and sourced directly from the PDFs, ensuring the /travel page becomes the single source of truth for tour content
- No new dependencies required
- The `TourItineraryService` auto-generation logic is preserved as fallback for tours without PDF-sourced itineraries
- All existing GTM tracking (view_package, destination_interest_detected) continues to work unchanged since the data structure is additive only

