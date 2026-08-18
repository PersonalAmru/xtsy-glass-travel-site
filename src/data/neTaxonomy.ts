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

export interface ExpeditionRouteStub {
  slug: string;
  name: string;
  types: ExpeditionType[];
}

export const EXPEDITION_ROUTES: ExpeditionRouteStub[] = [
  { slug: 'guwahati-to-shillong', name: 'Guwahati to Shillong', types: ['motorbike', '4x4'] },
  { slug: 'guwahati-to-tawang', name: 'Guwahati to Tawang via Assam', types: ['motorbike', '4x4'] },
  { slug: 'guwahati-to-kohima', name: 'Guwahati to Kohima via Assam', types: ['motorbike', '4x4'] },
  { slug: 'meghalaya-loop', name: 'Meghalaya Loop — Shillong · Dawki · Mawlynnong · Cherrapunji', types: ['motorbike', '4x4'] },
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
