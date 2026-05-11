/**
 * Programmatic SEO Slug Generator
 * Generates 1000+ unique slug combinations across:
 *  - Routes (from-X-to-Y)
 *  - Intent (last-minute, today, tonight, weekend)
 *  - Institutions (NEIGRIMS, IIM, NIFT, hospitals)
 *  - Global Northeast (8 states)
 *  - Activity x Destination
 *
 * Run: npx tsx scripts/generate-seo-slugs.ts > /tmp/seo-slug-stats.txt
 */

export const NE_STATES = [
  'meghalaya', 'assam', 'arunachal-pradesh', 'nagaland',
  'manipur', 'mizoram', 'tripura', 'sikkim',
] as const;

export const ORIGIN_CITIES = [
  'guwahati', 'delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai',
  'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'chandigarh',
  'bhubaneswar', 'patna', 'siliguri', 'imphal', 'agartala', 'aizawl',
] as const;

export const NE_DESTINATIONS = [
  'shillong', 'cherrapunji', 'mawlynnong', 'dawki', 'mawsynram', 'jowai',
  'tura', 'nongstoin', 'williamnagar', 'baghmara', // Meghalaya
  'kaziranga', 'majuli', 'kamakhya', 'sivasagar', 'jorhat', 'tezpur', // Assam
  'tawang', 'ziro', 'bomdila', 'pasighat', 'itanagar', // Arunachal
  'kohima', 'dzukou-valley', 'mon', 'mokokchung', // Nagaland
  'imphal', 'loktak-lake', 'moreh', // Manipur
  'aizawl', 'champhai', 'reiek', // Mizoram
  'agartala', 'unakoti', 'neermahal', // Tripura
  'gangtok', 'pelling', 'lachung', 'tsomgo-lake', // Sikkim
] as const;

export const INTENT_MODIFIERS = [
  'today', 'tonight', 'this-weekend', 'tomorrow', 'last-minute', 'now',
] as const;

export const STAY_TYPES = [
  'hostel', 'hotel', 'homestay', 'guesthouse', 'budget-stay', 'glamping',
] as const;

export const ACTIVITIES = [
  'trekking', 'caving', 'camping', 'kayaking', 'photography', 'birding',
  'cycling', 'waterfall-trek', 'village-tour', 'cultural-tour', 'food-tour',
] as const;

export const DURATIONS = [
  '2-day', '3-day', '4-day', '5-day', '7-day', '10-day',
] as const;

export const INSTITUTIONS = [
  { slug: 'neigrims', name: 'NEIGRIMS', type: 'medical', city: 'shillong' },
  { slug: 'iim-shillong', name: 'IIM Shillong', type: 'education', city: 'shillong' },
  { slug: 'nift-shillong', name: 'NIFT Shillong', type: 'education', city: 'shillong' },
  { slug: 'nehu', name: 'NEHU', type: 'education', city: 'shillong' },
  { slug: 'shillong-medical-college', name: 'Shillong Medical College', type: 'medical', city: 'shillong' },
  { slug: 'civil-hospital-shillong', name: 'Civil Hospital Shillong', type: 'medical', city: 'shillong' },
  { slug: 'iit-guwahati', name: 'IIT Guwahati', type: 'education', city: 'guwahati' },
  { slug: 'gmch-guwahati', name: 'GMCH Guwahati', type: 'medical', city: 'guwahati' },
  { slug: 'aiims-guwahati', name: 'AIIMS Guwahati', type: 'medical', city: 'guwahati' },
] as const;

// =============================================================
// Slug Generators (each returns deduped string[])
// =============================================================

export function generateRouteSlugs(): string[] {
  const slugs = new Set<string>();
  for (const from of ORIGIN_CITIES) {
    for (const to of NE_DESTINATIONS) {
      if (from === to) continue;
      slugs.add(`${from}-to-${to}`);
    }
  }
  return Array.from(slugs);
}

export function generateIntentStaySlugs(): string[] {
  const slugs = new Set<string>();
  const cities = ['shillong', 'cherrapunji', 'guwahati', 'gangtok', 'kohima', 'imphal'];
  for (const stay of STAY_TYPES) {
    for (const city of cities) {
      for (const intent of INTENT_MODIFIERS) {
        slugs.add(`${stay}-in-${city}-${intent}`);
      }
      slugs.add(`cheap-${stay}-in-${city}`);
      slugs.add(`best-${stay}-in-${city}`);
      slugs.add(`${stay}-near-${city}-airport`);
    }
  }
  return Array.from(slugs);
}

export function generateInstitutionSlugs(): string[] {
  const slugs = new Set<string>();
  for (const inst of INSTITUTIONS) {
    slugs.add(`stay-near-${inst.slug}`);
    slugs.add(`hostel-near-${inst.slug}`);
    slugs.add(`hotel-near-${inst.slug}`);
    slugs.add(`accommodation-near-${inst.slug}`);
    if (inst.type === 'medical') {
      slugs.add(`patient-attendant-stay-${inst.slug}`);
      slugs.add(`budget-stay-near-${inst.slug}`);
    }
    if (inst.type === 'education') {
      slugs.add(`student-accommodation-near-${inst.slug}`);
      slugs.add(`parent-stay-near-${inst.slug}`);
    }
  }
  return Array.from(slugs);
}

export function generateActivitySlugs(): string[] {
  const slugs = new Set<string>();
  const topDestinations = NE_DESTINATIONS.slice(0, 18);
  for (const activity of ACTIVITIES) {
    for (const dest of topDestinations) {
      slugs.add(`${activity}-in-${dest}`);
    }
  }
  return Array.from(slugs);
}

export function generateDurationItinerarySlugs(): string[] {
  const slugs = new Set<string>();
  const states = ['meghalaya', 'assam', 'arunachal-pradesh', 'nagaland', 'sikkim', 'mizoram'];
  for (const dur of DURATIONS) {
    for (const state of states) {
      slugs.add(`${dur}-${state}-itinerary`);
      slugs.add(`${dur}-${state}-trip`);
    }
  }
  return Array.from(slugs);
}

export function generateGlobalNESlugs(): string[] {
  const slugs = new Set<string>();
  for (const state of NE_STATES) {
    slugs.add(`${state}-travel-guide-2026`);
    slugs.add(`places-to-visit-in-${state}`);
    slugs.add(`things-to-do-in-${state}`);
    slugs.add(`best-time-to-visit-${state}`);
    slugs.add(`how-to-reach-${state}`);
    slugs.add(`${state}-tour-packages`);
    slugs.add(`hidden-gems-in-${state}`);
    slugs.add(`solo-travel-${state}`);
    slugs.add(`couple-trip-to-${state}`);
    slugs.add(`monsoon-in-${state}`);
    slugs.add(`winter-in-${state}`);
  }
  return Array.from(slugs);
}

// =============================================================
// NORTHEAST EXPANSION — group / corporate / workation / themed / seasonal
// =============================================================

/** State-level commercial hubs covering all 8 NE states. */
export const NE_DESTINATIONS_FULL = [
  'shillong', 'cherrapunji', 'mawlynnong', 'dawki', 'mawsynram', 'jowai',
  'tura', 'shnongpdeng', 'nongjrong',
  'guwahati', 'kaziranga', 'majuli', 'jorhat', 'tezpur', 'haflong',
  'tawang', 'ziro', 'bomdila', 'pasighat', 'itanagar',
  'kohima', 'dzukou-valley', 'mokokchung',
  'imphal', 'loktak-lake',
  'aizawl', 'champhai', 'reiek',
  'agartala', 'unakoti',
  'gangtok', 'pelling', 'lachung', 'tsomgo-lake',
] as const;

const TOP_GROUP_DESTINATIONS = [
  'shillong', 'cherrapunji', 'dawki', 'mawlynnong', 'guwahati', 'kaziranga',
  'tawang', 'ziro', 'kohima', 'gangtok', 'pelling', 'aizawl', 'imphal', 'agartala',
  'shnongpdeng', 'nongjrong', 'jowai',
] as const;

const GROUP_INTENTS = [
  'group-tour', 'group-tour-package', 'team-outing', 'company-offsite',
  'startup-retreat', 'school-tour', 'college-trip', 'large-group-tour',
] as const;

const CORPORATE_INTENTS = [
  'corporate-retreat', 'corporate-offsite', 'corporate-team-building',
  'leadership-retreat', 'business-travel', 'conference-venue',
] as const;

const WORKATION_INTENTS = [
  'workation', 'digital-nomad-stay', 'long-stay', 'monthly-stay',
  'remote-work-stay', 'wifi-stay-for-nomads',
] as const;

const THEMED_INTENTS = [
  'honeymoon-package', 'romantic-getaway', 'family-tour', 'family-vacation',
  'weekend-trip', 'student-trip', 'solo-adventure', 'friends-trip',
  'photography-tour', 'birding-tour',
] as const;

const ROAD_BIKE_INTENTS = [
  'bike-trip', 'royal-enfield-trip', 'self-drive-trip', 'road-trip',
  'self-drive-itinerary', 'bike-tour-package',
] as const;

const SEASONS = ['monsoon', 'winter', 'summer', 'autumn', 'spring'] as const;
const FESTIVALS = [
  'cherry-blossom-festival', 'hornbill-festival', 'wangala-festival',
  'shad-suk-mynsiem', 'bihu-festival', 'ziro-music-festival',
  'losar-festival', 'tawang-festival',
] as const;

/** {intent}-{destination} for groups (e.g. group-tour-cherrapunji). */
export function generateGroupTourSlugs(): string[] {
  const out = new Set<string>();
  for (const intent of GROUP_INTENTS) {
    for (const dest of TOP_GROUP_DESTINATIONS) out.add(`${intent}-${dest}`);
    for (const state of NE_STATES) out.add(`${intent}-${state}`);
  }
  return [...out];
}

/** {intent}-{destination} for corporate (e.g. corporate-retreat-shillong). */
export function generateCorporateSlugs(): string[] {
  const out = new Set<string>();
  for (const intent of CORPORATE_INTENTS) {
    for (const dest of TOP_GROUP_DESTINATIONS) out.add(`${intent}-${dest}`);
    for (const state of NE_STATES) out.add(`${intent}-${state}`);
  }
  // Duration variants for top commercial intents
  for (const dur of ['2-day', '3-day', '4-day', '5-day']) {
    for (const dest of ['shillong', 'cherrapunji', 'guwahati', 'gangtok', 'kohima']) {
      out.add(`corporate-retreat-${dest}-${dur}`);
      out.add(`team-outing-${dest}-${dur}`);
    }
  }
  return [...out];
}

/** Workation slugs (e.g. workation-ziro, digital-nomad-stay-shillong). */
export function generateWorkationSlugs(): string[] {
  const out = new Set<string>();
  for (const intent of WORKATION_INTENTS) {
    for (const dest of TOP_GROUP_DESTINATIONS) out.add(`${intent}-${dest}`);
    for (const state of NE_STATES) out.add(`${intent}-${state}`);
  }
  return [...out];
}

/** Themed (honeymoon/family/student/etc) — broad destination matrix. */
export function generateThemedTripSlugs(): string[] {
  const out = new Set<string>();
  for (const intent of THEMED_INTENTS) {
    for (const dest of NE_DESTINATIONS_FULL) out.add(`${intent}-${dest}`);
    for (const state of NE_STATES) out.add(`${intent}-${state}`);
  }
  return [...out];
}

/** Bike + road-trip combos, including origin-aware variants from key hubs. */
export function generateRoadBikeTripSlugs(): string[] {
  const out = new Set<string>();
  for (const intent of ROAD_BIKE_INTENTS) {
    for (const dest of TOP_GROUP_DESTINATIONS) out.add(`${intent}-${dest}`);
    for (const state of NE_STATES) out.add(`${intent}-${state}`);
  }
  // Origin-aware bike trips from major hubs
  for (const origin of ['guwahati', 'shillong', 'dimapur', 'siliguri']) {
    for (const dest of ['tawang', 'ziro', 'kohima', 'kaziranga', 'cherrapunji', 'gangtok']) {
      if (origin === dest) continue;
      out.add(`bike-trip-${dest}-from-${origin}`);
      out.add(`road-trip-${dest}-from-${origin}`);
    }
  }
  return [...out];
}

/** Seasonal + festival pages across NE destinations. */
export function generateSeasonalFestivalSlugs(): string[] {
  const out = new Set<string>();
  for (const season of SEASONS) {
    for (const dest of NE_DESTINATIONS_FULL) out.add(`${season}-in-${dest}`);
    for (const state of NE_STATES) out.add(`${season}-in-${state}`);
  }
  for (const fest of FESTIVALS) out.add(fest);
  return [...out];
}

export function generateAllSlugs() {
  const routes = generateRouteSlugs();
  const intent = generateIntentStaySlugs();
  const institutions = generateInstitutionSlugs();
  const activities = generateActivitySlugs();
  const durations = generateDurationItinerarySlugs();
  const globalNE = generateGlobalNESlugs();

  return {
    routes,
    intent,
    institutions,
    activities,
    durations,
    globalNE,
    total:
      routes.length +
      intent.length +
      institutions.length +
      activities.length +
      durations.length +
      globalNE.length,
  };
}

// CLI entrypoint — guarded so the file is safe to import in the browser bundle.
// Without `typeof process` guard, every SEO data file that re-exports from
// here (routes/activities/durations/intent) crashed with "process is not defined"
// on first import, causing every programmatic SEO page to black-screen.
if (typeof process !== 'undefined' && process.argv?.[1] && import.meta.url === `file://${process.argv[1]}`) {
  const all = generateAllSlugs();
  console.log(`Routes: ${all.routes.length}`);
  console.log(`Intent: ${all.intent.length}`);
  console.log(`Institutions: ${all.institutions.length}`);
  console.log(`Activities: ${all.activities.length}`);
  console.log(`Durations: ${all.durations.length}`);
  console.log(`Global NE: ${all.globalNE.length}`);
  console.log(`TOTAL: ${all.total}`);
}
