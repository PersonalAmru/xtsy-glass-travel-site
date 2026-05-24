/**
 * Hero image mapping for programmatic SEO pages.
 * Uses Supabase-hosted Meghalaya gallery assets where available,
 * with category-level fallbacks for pages without specific images.
 */

import { SEO_HERO_MANIFEST } from '@/data/seoHeroManifest';


const SUPABASE_BUCKET = 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets';
const THINGS_TO_DO = `${SUPABASE_BUCKET}/Meghalaya%20things%20to%20do`;

// Slug-specific hero images (verified available assets)
const SLUG_HERO_MAP: Record<string, string> = {
  // Waterfalls
  'nohkalikai-falls-meghalaya': `${THINGS_TO_DO}/nohkalikai-falls-meghalaya-1.webp`,
  'krang-suri-falls-meghalaya': `${THINGS_TO_DO}/krang-suri-falls-meghalaya-2.webp`,
  'wei-sawdong-falls-meghalaya': `${THINGS_TO_DO}/wei-sawdong-falls-meghalaya-2.webp`,
  'elephant-falls-shillong': `${THINGS_TO_DO}/elephant-falls-meghalaya-1.webp`,
  'seven-sisters-falls-meghalaya': `${THINGS_TO_DO}/nohkalikai-falls-meghalaya-2.webp`,
  'waterfalls-in-meghalaya': `${THINGS_TO_DO}/nohkalikai-falls-meghalaya-1.webp`,
  'waterfalls-near-shillong': `${THINGS_TO_DO}/elephant-falls-meghalaya-2.webp`,
  'best-waterfalls-meghalaya': `${THINGS_TO_DO}/wei-sawdong-falls-meghalaya-3.webp`,
  'spread-eagle-falls-meghalaya': `${THINGS_TO_DO}/spread-eagle-falls-meghalaya-1.webp`,
  'sweet-falls-meghalaya': `${THINGS_TO_DO}/sweet-falls-meghalaya-1.webp`,
  'rainbow-falls-meghalaya': `${THINGS_TO_DO}/rainbow-falls-meghalaya-4.webp`,

  // Caves
  'mawsmai-cave-cherrapunji': `${THINGS_TO_DO}/mawsmai-cave-meghalaya-1.webp`,
  'krem-liat-prah-meghalaya': `${THINGS_TO_DO}/krem-liat-prah-meghalaya-1.webp`,
  'siju-cave-garo-hills': `${THINGS_TO_DO}/siju-cave-meghalaya-2.webp`,
  'arwah-cave-cherrapunji': `${THINGS_TO_DO}/mawsmai-cave-meghalaya-2.webp`,
  'meghalaya-caves-guide': `${THINGS_TO_DO}/mawsmai-cave-meghalaya-3.webp`,
  'caving-in-meghalaya': `${THINGS_TO_DO}/mawsmai-cave-meghalaya-1.webp`,
  'mawjymbuin-cave-mawsynram': `${THINGS_TO_DO}/mawjymbuin-cave-meghalaya-2.webp`,

  // Villages & Culture
  'mawlynnong-cleanest-village': `${THINGS_TO_DO}/mawlynnong-village-meghalaya-1.webp`,
  'nongriat-village-trek': `${THINGS_TO_DO}/nongriat-village-meghalaya-1.webp`,
  'mawphlang-sacred-forest': `${THINGS_TO_DO}/mawphlang-sacred-forest-meghalaya-1.webp`,
  'double-decker-root-bridge': `${THINGS_TO_DO}/double-decker-living-root-bridge-meghalaya-2.webp`,

  // Viewpoints & Peaks
  'laitlum-canyons-shillong': `${THINGS_TO_DO}/laitlum-canyons-meghalaya-2.webp`,
  'shillong-peak-meghalaya': `${THINGS_TO_DO}/shillong-peak-meghalaya-2.webp`,
  'nongjrong-sunrise-viewpoint': `${THINGS_TO_DO}/nongjrong-sunrise-viewpoint-meghalaya-1.webp`,
  'mawthadraishan-peak': `${THINGS_TO_DO}/mawthadraishan-peak-meghalaya-1.webp`,
  'tura-peak-garo-hills': `${THINGS_TO_DO}/tura-peak-meghalaya-2.webp`,

  // Rivers & Lakes
  'dawki-umngot-river-guide': `${THINGS_TO_DO}/dawki-umngot-river-meghalaya-2.webp`,
  'umiam-lake-shillong': `${THINGS_TO_DO}/umiam-lake-meghalaya-1.webp`,
  'shnongpdeng-camping-meghalaya': `${THINGS_TO_DO}/dawki-umngot-river-meghalaya-3.webp`,
  'thadlaskein-lake-jaintia-hills': `${THINGS_TO_DO}/thadlaskein-lake-meghalaya-2.webp`,
  'nongkhnum-island-meghalaya': `${THINGS_TO_DO}/nongkhnum-island-meghalaya-1.webp`,

  // Adventure
  'mawryngkhang-bamboo-trail': `${THINGS_TO_DO}/mawryngkhang-bamboo-trail-meghalaya-1.webp`,
  'trekking-in-meghalaya': `${THINGS_TO_DO}/mawryngkhang-bamboo-trail-meghalaya-2.webp`,
  'david-scott-trail': `${THINGS_TO_DO}/laitlum-canyons-meghalaya-3.webp`,
  'camping-in-meghalaya': `${THINGS_TO_DO}/ranikor-meghalaya-1.webp`,

  // Wildlife
  'nokrek-biosphere-reserve': `${THINGS_TO_DO}/nokrek-biosphere-reserve-meghalaya-1.webp`,

  // Pillar/General
  'meghalaya-travel-guide': `${THINGS_TO_DO}/laitlum-canyons-meghalaya-4.webp`,
  'places-to-visit-meghalaya': `${THINGS_TO_DO}/nongjrong-sunrise-viewpoint-meghalaya-2.webp`,
  'things-to-do-meghalaya': `${THINGS_TO_DO}/double-decker-living-root-bridge-meghalaya-3.webp`,
  'shillong-travel-guide': `${THINGS_TO_DO}/shillong-peak-meghalaya-3.webp`,
  'cherrapunji-travel-guide': `${THINGS_TO_DO}/nohkalikai-falls-meghalaya-2.webp`,
  'dawki-travel-guide': `${THINGS_TO_DO}/dawki-umngot-river-meghalaya-2.webp`,
  'jaintia-hills-travel-guide': `${THINGS_TO_DO}/krang-suri-falls-meghalaya-3.webp`,
  'garo-hills-travel-guide': `${THINGS_TO_DO}/siju-cave-meghalaya-3.webp`,
  'ranikor-meghalaya': `${THINGS_TO_DO}/ranikor-meghalaya-2.webp`,
};

// Category-level fallback hero images
const CATEGORY_HERO_MAP: Record<string, string> = {
  hostels: `${THINGS_TO_DO}/laitlum-canyons-meghalaya-2.webp`,
  hotels: `${THINGS_TO_DO}/umiam-lake-meghalaya-2.webp`,
  homestays: `${THINGS_TO_DO}/mawlynnong-village-meghalaya-2.webp`,
  glamping: `${THINGS_TO_DO}/nongjrong-sunrise-viewpoint-meghalaya-3.webp`,
  accommodation: `${THINGS_TO_DO}/laitlum-canyons-meghalaya-3.webp`,
  rentals: `${THINGS_TO_DO}/shillong-peak-meghalaya-2.webp`,
  tours: `${THINGS_TO_DO}/double-decker-living-root-bridge-meghalaya-2.webp`,
  'travel-guides': `${THINGS_TO_DO}/nongjrong-sunrise-viewpoint-meghalaya-2.webp`,
  destinations: `${THINGS_TO_DO}/nohkalikai-falls-meghalaya-1.webp`,
  attractions: `${THINGS_TO_DO}/krang-suri-falls-meghalaya-2.webp`,
  itineraries: `${THINGS_TO_DO}/dawki-umngot-river-meghalaya-2.webp`,
  activities: `${THINGS_TO_DO}/mawryngkhang-bamboo-trail-meghalaya-1.webp`,
  restaurants: `${THINGS_TO_DO}/mawlynnong-village-meghalaya-1.webp`,
  'food-dining': `${THINGS_TO_DO}/mawlynnong-village-meghalaya-1.webp`,
  weddings: `${THINGS_TO_DO}/umiam-lake-meghalaya-1.webp`,
  transport: `${THINGS_TO_DO}/laitlum-canyons-meghalaya-4.webp`,
  'competitor-capture': `${THINGS_TO_DO}/laitlum-canyons-meghalaya-2.webp`,
  seasonal: `${THINGS_TO_DO}/nohkalikai-falls-meghalaya-2.webp`,
  events: `${THINGS_TO_DO}/mawphlang-sacred-forest-meghalaya-2.webp`,
  'travel-agency': `${THINGS_TO_DO}/dawki-umngot-river-meghalaya-3.webp`,
  hospitals: `${THINGS_TO_DO}/shillong-peak-meghalaya-3.webp`,
  'themed-trips': `${THINGS_TO_DO}/double-decker-living-root-bridge-meghalaya-3.webp`,
  'group-tours': `${THINGS_TO_DO}/mawphlang-sacred-forest-meghalaya-1.webp`,
  corporate: `${THINGS_TO_DO}/umiam-lake-meghalaya-2.webp`,
  'road-bike-trips': `${THINGS_TO_DO}/laitlum-canyons-meghalaya-4.webp`,
  workation: `${THINGS_TO_DO}/nongjrong-sunrise-viewpoint-meghalaya-3.webp`,
};

const SUPABASE_HERO_BUCKET = 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/seo-heroes';

const DEFAULT_HERO = `${THINGS_TO_DO}/laitlum-canyons-meghalaya-2.webp`;

/**
 * Get the hero image URL for a given SEO page.
 * Priority: AI-generated (Supabase seo-heroes bucket) → slug-specific curated → category fallback → default.
 *
 * Note: AI heroes are produced on-demand by the `generate-seo-hero` edge function.
 * The browser will fall back to the curated/category image if the AI hero hasn't been generated yet.
 */
export const getHeroImageForPage = (slug: string, category: string): string => {
  return SEO_HERO_MANIFEST[slug] || SLUG_HERO_MAP[slug] || CATEGORY_HERO_MAP[category] || DEFAULT_HERO;
};

/** URL where the AI-generated hero would live if/when produced. */
export const getAIHeroURL = (slug: string): string => {
  return `${SUPABASE_HERO_BUCKET}/${slug}.webp`;
};

// Wave 3B — Pool of contextual section images, rotated per section index so each
// page renders distinct supporting visuals (no duplicates within a page).
// Phase B — split by Northeast state so pages targeting Assam/Arunachal/etc.
// no longer show only Meghalaya scenery.
const TRAVEL_PAGE = `${SUPABASE_BUCKET}/Travel%20page`;
const TRAVEL_DOM = `${SUPABASE_BUCKET}/Travel%20DOM/1`;

const MEGHALAYA_POOL = [
  `${THINGS_TO_DO}/double-decker-living-root-bridge-meghalaya-2.webp`,
  `${THINGS_TO_DO}/dawki-umngot-river-meghalaya-2.webp`,
  `${THINGS_TO_DO}/laitlum-canyons-meghalaya-3.webp`,
  `${THINGS_TO_DO}/nohkalikai-falls-meghalaya-1.webp`,
  `${THINGS_TO_DO}/mawlynnong-village-meghalaya-1.webp`,
  `${THINGS_TO_DO}/krang-suri-falls-meghalaya-2.webp`,
  `${THINGS_TO_DO}/shillong-peak-meghalaya-2.webp`,
  `${THINGS_TO_DO}/nongriat-village-meghalaya-1.webp`,
  `${THINGS_TO_DO}/umiam-lake-meghalaya-1.webp`,
  `${THINGS_TO_DO}/mawphlang-sacred-forest-meghalaya-1.webp`,
];

const ASSAM_POOL = [
  `${TRAVEL_PAGE}/north%20east%20tour.jpg`,
  `${TRAVEL_PAGE}/dress-of-north-east-india.jpg`,
  `${TRAVEL_PAGE}/70q7obg5shx31.jpg`,
];

const ARUNACHAL_POOL = [
  `${TRAVEL_PAGE}/Tawang-Monastery.jpg`,
  `${TRAVEL_PAGE}/Bike%20trip%20arunachal.jpg`,
  `${TRAVEL_DOM}/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg`,
];

const NAGALAND_POOL = [
  `${TRAVEL_PAGE}/nagaland.jpg`,
  `${TRAVEL_PAGE}/kohima.jpg`,
  `${TRAVEL_PAGE}/dress-of-north-east-india.jpg`,
];

const SIKKIM_POOL = [
  `${TRAVEL_PAGE}/kanchenjunga-mountain-pelling-sikkim-1-city-hero.jpg`,
  `${TRAVEL_PAGE}/sikkim%20winter.png`,
  `${TRAVEL_PAGE}/north%20east%20tour.jpg`,
];

const MANIPUR_POOL = [
  `${TRAVEL_PAGE}/maipur%20lokak%20lake.webp`,
  `${TRAVEL_PAGE}/dress-of-north-east-india.jpg`,
  `${TRAVEL_PAGE}/north%20east%20tour.jpg`,
];

const MIZORAM_POOL = [
  `${TRAVEL_PAGE}/dress-of-north-east-india.jpg`,
  `${TRAVEL_PAGE}/north%20east%20tour.jpg`,
  `${TRAVEL_PAGE}/70q7obg5shx31.jpg`,
];

const TRIPURA_POOL = [
  `${TRAVEL_PAGE}/dress-of-north-east-india.jpg`,
  `${TRAVEL_PAGE}/north%20east%20tour.jpg`,
  `${TRAVEL_PAGE}/70q7obg5shx31.jpg`,
];

const STATE_SECTION_POOLS: Record<string, string[]> = {
  meghalaya: MEGHALAYA_POOL,
  assam: ASSAM_POOL,
  arunachal: ARUNACHAL_POOL,
  nagaland: NAGALAND_POOL,
  sikkim: SIKKIM_POOL,
  manipur: MANIPUR_POOL,
  mizoram: MIZORAM_POOL,
  tripura: TRIPURA_POOL,
};

// Keywords that hint at each state. First match wins; meghalaya is the fallback.
const STATE_KEYWORDS: Array<{ state: keyof typeof STATE_SECTION_POOLS; needles: string[] }> = [
  { state: 'arunachal', needles: ['arunachal', 'tawang', 'ziro', 'itanagar', 'bomdila', 'sela-pass'] },
  { state: 'sikkim', needles: ['sikkim', 'gangtok', 'pelling', 'lachung', 'lachen', 'kanchenjunga', 'gurudongmar'] },
  { state: 'nagaland', needles: ['nagaland', 'kohima', 'dimapur', 'hornbill', 'mokokchung', 'mon-'] },
  { state: 'manipur', needles: ['manipur', 'imphal', 'loktak', 'ukhrul'] },
  { state: 'mizoram', needles: ['mizoram', 'aizawl', 'lunglei', 'champhai'] },
  { state: 'tripura', needles: ['tripura', 'agartala', 'unakoti', 'udaipur-tripura'] },
  { state: 'assam', needles: ['assam', 'guwahati', 'kaziranga', 'majuli', 'jorhat', 'tezpur', 'sivasagar', 'tea-garden'] },
  { state: 'meghalaya', needles: ['meghalaya', 'shillong', 'cherrapunji', 'dawki', 'mawlynnong', 'nongriat', 'jaintia', 'khasi', 'garo', 'mawsynram', 'umiam', 'laitlum', 'nohkalikai', 'krang-suri'] },
];

/** Infer Northeast state from a slug. Defaults to meghalaya (our home turf). */
const inferStateFromSlug = (slug: string): keyof typeof STATE_SECTION_POOLS => {
  const s = slug.toLowerCase();
  for (const { state, needles } of STATE_KEYWORDS) {
    if (needles.some(n => s.includes(n))) return state;
  }
  return 'meghalaya';
};

/**
 * Pick a contextual image for a section based on the page slug + section index.
 * Deterministic: same slug+index always returns the same image.
 * State-aware: routes to the matching Northeast state pool.
 */
export const getSectionImage = (slug: string, sectionIndex: number, heroToAvoid?: string): string => {
  const state = inferStateFromSlug(slug);
  const pool = STATE_SECTION_POOLS[state] ?? MEGHALAYA_POOL;
  // Deterministic hash from slug
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  const start = Math.abs(h) % pool.length;
  let img = pool[(start + sectionIndex) % pool.length];
  // Avoid repeating the hero image as the first section image
  if (img === heroToAvoid && pool.length > 1) {
    img = pool[(start + sectionIndex + 1) % pool.length];
  }
  return img;
};


