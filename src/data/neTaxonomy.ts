/**
 * NORTHEAST INDIA DESTINATION TAXONOMY (Phase 1 — architecture)
 * -------------------------------------------------------------
 * Single source of truth for the hierarchical URL structure:
 *
 *   /destinations/:state
 *   /destinations/:state/:city
 *   /destinations/:state/:city/:attraction
 *   /expeditions/:type/:route
 *
 * Only structure lives here. Page content for state hubs (Phase 2) and
 * expeditions (Phase 3) is layered on top of this taxonomy later.
 */
import { meghalayaDestinations, type MeghalayaDestination } from './meghalayaDestinations';

export interface NECity {
  slug: string;
  name: string;
  /** Short factual blurb used on the city hub + meta description. */
  blurb: string;
}

export interface NEState {
  slug: string;
  name: string;
  blurb: string;
  gatewayCity: string;
  nearestAirport: string;
  cities: NECity[];
}

export const NE_STATES: NEState[] = [
  {
    slug: 'meghalaya',
    name: 'Meghalaya',
    blurb:
      'The wettest state in India — living root bridges, canyon waterfalls, crystal rivers and the Khasi, Jaintia and Garo hills.',
    gatewayCity: 'Guwahati (Assam)',
    nearestAirport: 'Guwahati (GAU) · Shillong Airport, Umroi (SHL)',
    cities: [
      { slug: 'shillong', name: 'Shillong', blurb: 'Meghalaya’s capital and the base for Umiam Lake, Shillong Peak, Elephant Falls and Laitlum.' },
      { slug: 'cherrapunji', name: 'Cherrapunji (Sohra)', blurb: 'Waterfall country — Nohkalikai, Seven Sisters, Wei Sawdong and the living root bridges.' },
      { slug: 'dawki', name: 'Dawki', blurb: 'The clear Umngot river, boating at Shnongpdeng and the India–Bangladesh border viewpoints.' },
      { slug: 'mawlynnong', name: 'Mawlynnong', blurb: 'Asia’s cleanest village and the Riwai single-decker living root bridge.' },
      { slug: 'jowai', name: 'Jowai (Jaintia Hills)', blurb: 'Krang Suri Falls, Nartiang monoliths, Thadlaskein Lake and Jaintia cave systems.' },
      { slug: 'mawsynram', name: 'Mawsynram', blurb: 'The rainiest inhabited place on earth, home to the Mawjymbuin stalagmite cave.' },
      { slug: 'nongstoin', name: 'Nongstoin (West Khasi Hills)', blurb: 'Langshiang Falls, Nongkhnum river island and offbeat West Khasi viewpoints.' },
      { slug: 'tura', name: 'Tura (Garo Hills)', blurb: 'Balpakram National Park, Nokrek Biosphere Reserve, Siju Cave and Tura Peak.' },
    ],
  },
  {
    slug: 'assam',
    name: 'Assam',
    blurb: 'The Brahmaputra valley — Kaziranga rhinos, tea estates, Majuli island and the gateway to all of Northeast India.',
    gatewayCity: 'Guwahati',
    nearestAirport: 'Lokpriya Gopinath Bordoloi International, Guwahati (GAU)',
    cities: [
      { slug: 'guwahati', name: 'Guwahati', blurb: 'The Northeast’s main gateway city — Kamakhya temple, Umananda and river cruises.' },
      { slug: 'kaziranga', name: 'Kaziranga', blurb: 'UNESCO grassland park famous for the one-horned rhinoceros.' },
      { slug: 'majuli', name: 'Majuli', blurb: 'The Brahmaputra’s river island, satras and Mishing villages.' },
      { slug: 'jorhat', name: 'Jorhat', blurb: 'Tea capital of Assam and the road head for Majuli ferries.' },
    ],
  },
  {
    slug: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    blurb: 'High Himalaya — Tawang monastery, Sela Pass, Ziro valley and remote tribal river valleys. Inner Line Permit required.',
    gatewayCity: 'Guwahati / Tezpur (Assam)',
    nearestAirport: 'Donyi Polo, Itanagar (HGI) · Tezpur (TEZ) · Guwahati (GAU)',
    cities: [
      { slug: 'tawang', name: 'Tawang', blurb: 'India’s largest monastery, Sela Pass and high-altitude lakes at 3,000 m+.' },
      { slug: 'ziro', name: 'Ziro', blurb: 'Apatani valley, paddy-fish cultivation and the Ziro music festival.' },
      { slug: 'itanagar', name: 'Itanagar', blurb: 'State capital, permit office and the road head into the interior valleys.' },
      { slug: 'dirang', name: 'Dirang', blurb: 'Warm valley stop on the Bomdila–Tawang highway with hot springs and orchards.' },
    ],
  },
  {
    slug: 'nagaland',
    name: 'Nagaland',
    blurb: 'Naga hills — the Hornbill Festival, Dzukou valley trek and living village culture. Inner Line Permit required.',
    gatewayCity: 'Dimapur',
    nearestAirport: 'Dimapur (DMU)',
    cities: [
      { slug: 'kohima', name: 'Kohima', blurb: 'State capital, WWII war cemetery and the base for Dzukou Valley.' },
      { slug: 'dimapur', name: 'Dimapur', blurb: 'Nagaland’s rail/air gateway in the plains.' },
      { slug: 'mokokchung', name: 'Mokokchung', blurb: 'Ao Naga heartland with traditional village councils.' },
    ],
  },
  {
    slug: 'manipur',
    name: 'Manipur',
    blurb: 'Loktak Lake floating phumdis, Keibul Lamjao park and the Imphal valley’s Meitei culture.',
    gatewayCity: 'Imphal',
    nearestAirport: 'Bir Tikendrajit International, Imphal (IMF)',
    cities: [
      { slug: 'imphal', name: 'Imphal', blurb: 'Kangla Fort, Ima Keithel women’s market and WWII heritage sites.' },
      { slug: 'loktak', name: 'Loktak (Moirang)', blurb: 'The floating-island lake and Keibul Lamjao National Park.' },
      { slug: 'ukhrul', name: 'Ukhrul', blurb: 'Shirui hills, the Shirui lily and Tangkhul Naga villages.' },
    ],
  },
  {
    slug: 'mizoram',
    name: 'Mizoram',
    blurb: 'Ridge-top towns, bamboo forests, Phawngpui blue mountain and some of India’s cleanest hill roads.',
    gatewayCity: 'Aizawl',
    nearestAirport: 'Lengpui, Aizawl (AJL)',
    cities: [
      { slug: 'aizawl', name: 'Aizawl', blurb: 'Hill capital built along a ridge, with viewpoints over the Tlawng valley.' },
      { slug: 'reiek', name: 'Reiek', blurb: 'Reiek Tlang peak and the heritage Mizo village.' },
      { slug: 'phawngpui', name: 'Phawngpui', blurb: 'The Blue Mountain National Park, Mizoram’s highest peak.' },
    ],
  },
  {
    slug: 'tripura',
    name: 'Tripura',
    blurb: 'Ujjayanta Palace, the lake palace of Neermahal and the rock carvings of Unakoti.',
    gatewayCity: 'Agartala',
    nearestAirport: 'Maharaja Bir Bikram, Agartala (IXA)',
    cities: [
      { slug: 'agartala', name: 'Agartala', blurb: 'Capital city with Ujjayanta Palace and the Bangladesh border crossing.' },
      { slug: 'unakoti', name: 'Unakoti', blurb: 'Ancient hillside rock-cut Shaiva carvings in the state’s north.' },
      { slug: 'neermahal', name: 'Neermahal (Melaghar)', blurb: 'The water palace on Rudrasagar Lake.' },
    ],
  },
];

export const getStateBySlug = (slug?: string) => NE_STATES.find(s => s.slug === slug);
export const getCityBySlug = (stateSlug?: string, citySlug?: string) =>
  getStateBySlug(stateSlug)?.cities.find(c => c.slug === citySlug);

// ---------------------------------------------------------------------------
// Meghalaya attraction → city mapping (migration of /places-to-visit/*)
// ---------------------------------------------------------------------------

const REGION_TO_CITY: Record<MeghalayaDestination['region'], string> = {
  'Near Shillong': 'shillong',
  'East Khasi Hills': 'shillong',
  'Cherrapunji & Sohra': 'cherrapunji',
  'Jaintia Hills': 'jowai',
  'Garo Hills': 'tura',
  'West Khasi Hills': 'nongstoin',
};

/** Per-slug overrides where the region is broader than the real base town. */
const CITY_OVERRIDES: Record<string, string> = {
  'dawki-umngot-river': 'dawki',
  'dawki-suspension-bridge': 'dawki',
  shnongpdeng: 'dawki',
  'mawlynnong-village': 'mawlynnong',
  'nongriat-village': 'cherrapunji',
  'mawjymbuin-cave': 'mawsynram',
};

export const getCitySlugForDestination = (d: MeghalayaDestination): string =>
  CITY_OVERRIDES[d.slug] ?? REGION_TO_CITY[d.region] ?? 'shillong';

/** Canonical hierarchical path for a Meghalaya attraction slug. */
export function destinationPath(slug: string): string {
  const d = meghalayaDestinations.find(x => x.slug === slug);
  if (!d) return `/destinations/meghalaya/shillong/${slug}`;
  return `/destinations/meghalaya/${getCitySlugForDestination(d)}/${d.slug}`;
}

export const getDestinationsForCity = (stateSlug: string, citySlug: string): MeghalayaDestination[] =>
  stateSlug === 'meghalaya'
    ? meghalayaDestinations.filter(d => getCitySlugForDestination(d) === citySlug)
    : [];

export const getDestinationsForState = (stateSlug: string): MeghalayaDestination[] =>
  stateSlug === 'meghalaya' ? meghalayaDestinations : [];

// ---------------------------------------------------------------------------
// Expeditions (Phase 3 fills the content; structure reserved here)
// ---------------------------------------------------------------------------

export const EXPEDITION_TYPES = ['motorbike', '4x4'] as const;
export type ExpeditionType = (typeof EXPEDITION_TYPES)[number];

export interface ExpeditionTypeDetail {
  /** Realistic riding/driving days for this vehicle type. */
  duration: string;
  /** Indicative XTSY-supported cost per person, INR. */
  priceFrom: number;
  vehicle: string;
  notes: string;
}

export interface ExpeditionRouteStub {
  slug: string;
  name: string;
  types: ExpeditionType[];
  /** One-line answer-first summary. */
  summary: string;
  distanceKm: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  bestSeason: string;
  avoidSeason: string;
  maxAltitude: string;
  permits: string[];
  highlights: string[];
  roadNotes: string;
  byType: Partial<Record<ExpeditionType, ExpeditionTypeDetail>>;
  /**
   * Semrush-validated head phrasing (India DB). `headQuery` is the highest-
   * volume query for the route; `motorbikeQuery` overrides it on the
   * motorbike variant when riders search differently (e.g. "tawang bike trip").
   */
  seo: {
    headQuery: string;
    motorbikeQuery?: string;
    keywords: string[];
    /** Direct-answer lead line worked into the "In short" block. */
    answerLead: string;
  };
}

export const EXPEDITION_ROUTES: ExpeditionRouteStub[] = [
  {
    slug: 'guwahati-to-shillong',
    name: 'Guwahati to Shillong',
    types: ['motorbike', '4x4'],
    summary:
      'The classic 100 km NH6 run from Guwahati airport up into the Khasi hills, past Umiam Lake, finishing in Shillong. No permits, ridable year round, doable in half a day.',
    distanceKm: 100,
    difficulty: 'Easy',
    bestSeason: 'October to April (clear skies, dry tarmac)',
    avoidSeason: 'Peak monsoon downpours in June and July reduce visibility on the Barapani climb',
    maxAltitude: 'approx. 1,525 m (5,000 ft) at Shillong',
    permits: ['No Inner Line Permit required for Assam or Meghalaya', 'Indian driving licence or valid International Driving Permit', 'Vehicle registration and third-party insurance'],
    highlights: [
      'Umiam Lake (Barapani) viewpoint at the 80 km mark',
      'Nongpoh food halt roughly halfway',
      'Four-lane NH6 with fuel every 20-30 km',
      'Arrival base at XTSY Travellers Hostel, Shillong',
    ],
    roadNotes:
      'NH6 is fully surfaced four-lane for most of the route with a two-lane hill section after Nongpoh. Expect heavy truck traffic and avoid riding after dark on the final ghat climb.',
    byType: {
      motorbike: { duration: '3-4 hours one way', priceFrom: 3500, vehicle: 'Royal Enfield Himalayan / Classic 350', notes: 'Carry a rain shell year round — hill showers arrive without warning above Nongpoh.' },
      '4x4': { duration: '2.5-3.5 hours one way', priceFrom: 6500, vehicle: 'Mahindra Thar / Bolero Neo with driver', notes: '2WD is enough on this route; 4x4 matters only if you continue to Nongriat or Shnongpdeng trailheads.' },
    },
    seo: {
      headQuery: 'Guwahati to Shillong Distance',
      keywords: ['guwahati to shillong distance', 'guwahati to shillong', 'guwahati to shillong taxi', 'guwahati to shillong road trip'],
      answerLead: 'Guwahati to Shillong is 100 km on NH6 and takes about 3 hours by road.',
    },
  },
  {
    slug: 'guwahati-to-tawang',
    name: 'Guwahati to Tawang via Assam',
    types: ['motorbike', '4x4'],
    summary:
      'A 520 km high-Himalaya run from the Brahmaputra plains over Sela Pass to Tawang at 3,048 m (10,000 ft). Arunachal Pradesh Inner Line Permit is mandatory and Bumla Pass needs a separate army permit.',
    distanceKm: 520,
    difficulty: 'Challenging',
    bestSeason: 'April to June and mid-September to October',
    avoidSeason: 'December to March — Sela Pass closes without notice in heavy snow; July to August landslides on the Bhalukpong-Bomdila stretch',
    maxAltitude: 'Sela Pass 4,170 m (13,700 ft); Bumla Pass 4,633 m (15,200 ft)',
    permits: [
      'Inner Line Permit (ILP) for Arunachal Pradesh — Indian nationals, applied online or at Guwahati/Tezpur',
      'Protected Area Permit (PAP) for foreign nationals, minimum group and prior clearance required',
      'Separate Bumla Pass permit issued by the Indian Army at Tawang, subject to weather and security',
    ],
    highlights: [
      'Bhalukpong forest gate and the Kameng river gorge',
      'Dirang valley hot springs and apple orchards',
      'Sela Pass and Paradise Lake at 13,700 ft',
      'Jaswant Garh war memorial',
      'Tawang Monastery, India\u2019s largest',
      'Bumla Pass on the Indo-China border at 15,200 ft',
    ],
    roadNotes:
      'Mixed tarmac, gravel and construction cuttings past Bomdila. Fuel is scarce beyond Dirang — top up at Bomdila. Altitude sickness is a genuine risk above Sela; split the climb over two nights at Dirang or Bomdila.',
    byType: {
      motorbike: { duration: '5-6 days round trip', priceFrom: 32000, vehicle: 'Royal Enfield Himalayan (recommended) with luggage rack', notes: 'Sub-zero mornings at Sela even in May. Thermal layers, waterproof gloves and a spare tube are non-negotiable.' },
      '4x4': { duration: '5-6 days round trip', priceFrom: 58000, vehicle: 'Mahindra Scorpio 4x4 / Thar with hill-experienced driver', notes: 'High-clearance 4x4 strongly advised for the Bumla Pass day — the track is loose rock and snowmelt.' },
    },
    seo: {
      headQuery: 'Guwahati to Tawang Distance',
      motorbikeQuery: 'Tawang Bike Trip',
      keywords: ['guwahati to tawang distance', 'guwahati to tawang', 'tawang bike trip', 'tawang road trip'],
      answerLead: 'Guwahati to Tawang is 520 km over Sela Pass and takes two days of driving each way.',
    },
  },
  {
    slug: 'guwahati-to-kohima',
    name: 'Guwahati to Kohima via Assam',
    types: ['motorbike', '4x4'],
    summary:
      'A 340 km run down NH27 to Dimapur and up into the Naga hills to Kohima at 1,444 m. Nagaland requires an Inner Line Permit for Indian nationals and foreign nationals must register with the local FRO on arrival.',
    distanceKm: 340,
    difficulty: 'Moderate',
    bestSeason: 'October to April, peaking with the Hornbill Festival in the first week of December',
    avoidSeason: 'June to August — the Dimapur-Kohima hill road slips badly in monsoon',
    maxAltitude: 'approx. 2,450 m (8,000 ft) at the Dzukou Valley trailhead',
    permits: [
      'Inner Line Permit (ILP) for Nagaland — Indian nationals, issued online or at Dimapur',
      'Foreign nationals do not need a PAP but must register with the Foreigners Registration Officer within 24 hours of arrival',
      'Carry photo ID at all times; checkposts are frequent',
    ],
    highlights: [
      'Kaziranga National Park detour on NH27',
      'Kohima War Cemetery',
      'Naga Heritage Village, Kisama — Hornbill Festival ground',
      'Dzukou Valley trek from Viswema',
      'Khonoma, Asia\u2019s first green village',
    ],
    roadNotes:
      'NH27 is fast four-lane to Dimapur, then 74 km of steep, broken and often congested hill road to Kohima that takes three hours alone. Ride the hill section in daylight.',
    byType: {
      motorbike: { duration: '3-4 days round trip', priceFrom: 18000, vehicle: 'Royal Enfield Himalayan / Classic 350', notes: 'The Dimapur-Kohima climb is the hardest hour of the trip — plan fuel and brakes accordingly.' },
      '4x4': { duration: '3-4 days round trip', priceFrom: 34000, vehicle: 'Mahindra Thar / Scorpio with driver', notes: 'A high-clearance vehicle earns its keep on the Dzukou and Khonoma approach roads.' },
    },
    seo: {
      headQuery: 'Guwahati to Kohima Distance',
      keywords: ['guwahati to kohima distance', 'guwahati to kohima', 'kohima road trip', 'hornbill festival road trip'],
      answerLead: 'Guwahati to Kohima is 340 km via Dimapur and takes about 8 hours by road.',
    },
  },
  {
    slug: 'meghalaya-loop',
    name: 'Meghalaya Loop — Shillong · Dawki · Mawlynnong · Cherrapunji',
    types: ['motorbike', '4x4'],
    summary:
      'A 350 km permit-free circuit from Shillong through Dawki\u2019s clear Umngot river, Mawlynnong village and the Cherrapunji waterfall belt. The best introduction to Northeast riding.',
    distanceKm: 350,
    difficulty: 'Moderate',
    bestSeason: 'October to April for clear water at Dawki; September for full-flow waterfalls',
    avoidSeason: 'June to August turns the Umngot muddy and makes the Nongriat descent slippery',
    maxAltitude: 'approx. 1,525 m (5,000 ft) at Shillong; sea-level heat at Dawki',
    permits: [
      'No Inner Line Permit needed anywhere in Meghalaya',
      'Foreign nationals must carry passport copies for the Dawki border zone',
      'Local entry fees apply at Mawlynnong, Wei Sawdong and the root bridges',
    ],
    highlights: [
      'Umngot river boating at Shnongpdeng and Dawki',
      'Mawlynnong, Asia\u2019s cleanest village, and the Riwai root bridge',
      'Nohkalikai Falls and Seven Sisters Falls',
      'Wei Sawdong three-tier falls',
      'Double-decker living root bridge at Nongriat (3,500-step descent)',
      'Laitlum Canyons on the way back to Shillong',
    ],
    roadNotes:
      'Good tarmac Shillong-Dawki-Cherrapunji with narrow single-lane village stretches near Mawlynnong. The Dawki descent is steep with blind hairpins; the plains around Dawki get very hot even in winter.',
    byType: {
      motorbike: { duration: '3-4 days', priceFrom: 14000, vehicle: 'Royal Enfield Classic 350 / Himalayan', notes: 'The most popular first Northeast ride — light traffic, short daily distances, huge scenery.' },
      '4x4': { duration: '3-4 days', priceFrom: 28000, vehicle: 'Mahindra Thar / Bolero with driver', notes: 'Comfortable for families; only the Wei Sawdong and Nongriat approach tracks need clearance.' },
    },
    seo: {
      headQuery: 'Meghalaya Road Trip Itinerary',
      keywords: ['meghalaya road trip itinerary', 'shillong to cherrapunji distance', 'shillong to dawki', 'meghalaya bike trip'],
      answerLead: 'The Meghalaya loop covers 350 km from Shillong through Dawki, Mawlynnong and Cherrapunji in 3-4 days.',
    },
  },
];


export const getExpeditionRoute = (type?: string, route?: string) =>
  EXPEDITION_ROUTES.find(r => r.slug === route && r.types.includes(type as ExpeditionType));

/** Every hierarchical URL that should appear in the destinations sitemap. */
export function buildDestinationSitemapPaths(): string[] {
  const paths: string[] = ['/destinations'];
  for (const state of NE_STATES) {
    paths.push(`/destinations/${state.slug}`);
    for (const city of state.cities) {
      paths.push(`/destinations/${state.slug}/${city.slug}`);
      for (const d of getDestinationsForCity(state.slug, city.slug)) {
        paths.push(`/destinations/${state.slug}/${city.slug}/${d.slug}`);
      }
    }
  }
  return paths;
}
