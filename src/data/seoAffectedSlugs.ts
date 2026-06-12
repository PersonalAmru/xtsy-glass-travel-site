/**
 * AFFECTED SLUGS — RECOVERY LIST (April 2026)
 * --------------------------------------------
 * 167 URLs flagged by Google Search Console as
 * "Discovered – currently not indexed". These slugs were filtered out by the
 * quality cap or missing entirely, causing soft-404s.
 *
 * Splitting them by status lets us:
 *   1. Force-include the live + filtered-out ones in the page registry.
 *   2. Redirect truly missing ones to the closest canonical page.
 *   3. Re-surface every affected URL in the priority sitemap so Google
 *      re-crawls them within days, not weeks.
 *
 * Generated from: xtsy.one-Coverage-Drilldown-2026-04-24.xlsx
 */

/** Slugs that exist as programmatic SEO pages but were dropped by the
 *  quality cap. Adding them to ALWAYS_KEEP_SLUGS restores them. */
export const RECOVERY_FILTERED_OUT: ReadonlyArray<string> = [
  'birdwatching-meghalaya',
  'camping-in-shnongpdeng',
  'car-booking-shillong',
  'car-rental-guwahati',
  'cheap-car-rental-shillong',
  'corporate-retreat-shillong',
  'dawki-umngot-river-guide',
  'fishing-in-dawki',
  'guwahati-to-meghalaya-road-trip',
  'guwahati-to-shillong-transport',
  'hospital-accommodation-shillong',
  // 'hostels-in-shillong' — MERGED → 301 to /best-hostel-in-shillong (see RECOVERY_REDIRECTS)
  'hotel-near-police-bazar',
  'hotels-in-shillong-available-now',
  'how-to-reach-cherrapunji',
  'how-to-reach-dawki',
  'how-to-reach-meghalaya-from-bangalore',
  'how-to-reach-meghalaya-from-delhi',
  'how-to-reach-meghalaya-from-kolkata',
  'how-to-reach-meghalaya-from-mumbai',
  'how-to-reach-shillong',
  'kayaking-in-meghalaya',
  'meghalaya-backpacking-guide',
  'meghalaya-in-april',
  'meghalaya-in-august',
  'meghalaya-in-december',
  'meghalaya-in-february',
  'meghalaya-in-january',
  'meghalaya-in-july',
  'meghalaya-in-june',
  'meghalaya-in-march',
  'meghalaya-in-may',
  'meghalaya-in-november',
  'meghalaya-in-october',
  'meghalaya-in-september',
  'meghalaya-tour-packages-pillar',
  'meghalaya-trip-today',
  'north-east-trip-guide',
  'offbeat-meghalaya',
  'outdoor-venue-shillong',
  'patient-attendant-stay-neigrihms',
  'pre-wedding-shoot-meghalaya',
  'scooty-rental-shillong',
  'self-drive-car-guwahati',
  'shillong-to-dawki-trip',
  'shillong-to-nongjrong',
  'shillong-vacation-planner',
  'solo-trip-meghalaya',
  'suv-rental-shillong',
  'trekking-in-meghalaya',
  'vehicle-rental-northeast',
  'waterfalls-in-meghalaya',
  'zip-lining-meghalaya',
];

/** Slugs that are already live (real route or in filtered set) but were
 *  not in the priority sitemap, so Google never crawled them. */
export const RECOVERY_LIVE_PAGES: ReadonlyArray<string> = [
  '3-day-meghalaya-itinerary',
  '4-day-meghalaya-itinerary',
  '6-day-meghalaya-itinerary',
  '8-day-meghalaya-itinerary',
  'cheap-hostel-shillong',
  'cherrapunji-tour-package',
  'couples-hostel-shillong',
  'dawki-tour-package',
  'dorms-in-shillong',
  'group-booking-shillong',
  'group-stay-shillong',
  'guest-house-shillong',
  'homestay-in-dawki',
  'homestay-in-mawlynnong',
  'homestay-shillong-city',
  'hostel-near-police-bazar-shillong',
  'hostels-in-meghalaya',
  'hostels-in-shillong-today',
  'isabella-hostel-vs-xtsy',
  'khasi-food-guide',
  'long-stay-hostel-shillong',
  'luxury-resorts-for-couples-shillong',
  'luxury-stays-in-india',
  'meghalaya-adventure-package',
  'meghalaya-honeymoon-package',
  'meghalaya-photography-tour',
  'meghalaya-tour-package-3-days',
  'meghalaya-tour-package-5-days',
  'meghalaya-tour-package-7-days',
  'meghalaya-tour-packages',
  'nongjrong-tour-package',
  'shillong-dormitory',
  'shillong-last-minute-stays',
  'shillong-stay-tonight',
  'shillong-tour-package-2-days',
  'shillong-weekend-trip',
  'solo-travel-hostel-shillong',
  'stargaze-hostel-vs-xtsy',
  'stays-in-shillong',
  'street-food-police-bazar',
  'tour-operators-meghalaya',
  'tour-operators-shillong',
  'travel-agency-shillong',
  'unique-luxury-stay-india',
  'weekend-meghalaya-trip',
  // 'youth-hostel-shillong' — MERGED → 301 to /best-hostel-in-shillong (see RECOVERY_REDIRECTS)
  'zion-backpackers-vs-xtsy',
  'zostel-vs-xtsy-shillong',
];

/**
 * places-to-visit/* paths handled by DestinationDetail.
 *
 * De-duped to CANONICAL destination slugs so generated sitemaps + the admin
 * recovery panels stay consistent with the cross-canonical each page emits.
 * The keyword-rich URL variants (…-shillong, …-meghalaya, …-guide) still
 * resolve as LIVE 200 pages via DESTINATION_SLUG_ALIASES in
 * meghalayaDestinations.ts and canonicalize onto these primary slugs.
 */
export const RECOVERY_PLACES_PATHS: ReadonlyArray<string> = [
  'places-to-visit/umiam-lake',
  'places-to-visit/elephant-falls',
  'places-to-visit/shillong-peak',
  'places-to-visit/nohkalikai-falls',
  'places-to-visit/krang-suri-falls',
  'places-to-visit/wei-sawdong-falls',
  'places-to-visit/rainbow-falls',
  'places-to-visit/mawlynnong-village',
  'places-to-visit/double-decker-living-root-bridge',
  'places-to-visit/dawki-umngot-river',
  'places-to-visit/laitlum-canyons',
  'places-to-visit/mawphlang-sacred-forest',
  'places-to-visit/mawsmai-cave',
  'places-to-visit/shnongpdeng',
];


/**
 * Slugs that have NO programmatic page and NO real React route. Each is
 * mapped to the closest canonical destination. The `/:slug` catch-all
 * checks this map BEFORE rendering NotFound and issues a 301-style
 * <Navigate replace> so Google consolidates equity into the canonical URL.
 */
export const RECOVERY_REDIRECTS: Readonly<Record<string, string>> = {
  // Real routes that Google sees but render as homepage / 404 due to typo
  'faq': '/about',
  // Vehicle rentals → consolidated rental landing
  'car-rental-shillong': '/xtsy-rentals',
  'car-rental-northeast-india': '/xtsy-rentals',
  'luxury-car-rental-shillong': '/xtsy-rentals',
  'premium-suv-rental-shillong': '/xtsy-rentals',
  'self-drive-car-shillong': '/xtsy-rentals',
  'tempo-traveller-shillong': '/xtsy-rentals',
  // Phase 1 hostel-cluster MERGE → 301 the consolidated variants so they
  // never render a real 404 (they were dropped from the registry via
  // MERGED_REDIRECT_SLUGS but previously had no redirect target).
  'hostels-in-shillong': '/best-hostel-in-shillong',
  'youth-hostel-shillong': '/best-hostel-in-shillong',
  'backpacker-hostel-shillong': '/best-hostel-in-shillong',
  'cheap-hostel-in-shillong': '/cheap-hostel-shillong',
  // Stays → consolidated hostel pillar
  'oyo-rooms-shillong-alternative': '/best-hostel-in-shillong',
  'guest-house-neigrihms-shillong': '/best-hostel-in-shillong',
  'homestay-neigrihms-shillong': '/best-hostel-in-shillong',
  'hotel-near-neigrihms-shillong': '/best-hostel-in-shillong',
  'lodge-neigrihms-shillong': '/best-hostel-in-shillong',
  // Itineraries / planning → tour-packages pillar
  'meghalaya-itinerary-planning': '/meghalaya-tour-packages',
  'meghalaya-trip-cost': '/meghalaya-tour-packages',
  'meghalaya-monsoon-travel-guide': '/meghalaya-tour-packages',
  'meghalaya-road-trip-guide': '/meghalaya-tour-packages',
  // Activities → things-to-do pillar
  'camping-in-meghalaya': '/things-to-do-in-meghalaya',
  'caves-in-meghalaya': '/meghalaya-caves',
  'kayaking-meghalaya': '/things-to-do-in-meghalaya',
  'shnongpdeng-camping-guide': '/things-to-do-in-meghalaya',
  // Travel guides → cherrapunji guide
  'cherrapunji-travel-guide': '/things-to-do-in-meghalaya',
  'dawki-river-travel-guide': '/things-to-do-in-meghalaya',
};
