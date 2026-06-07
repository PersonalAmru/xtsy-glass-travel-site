/**
 * Hero image mapping for programmatic SEO pages.
 *
 * All imagery is served from the Lovable CDN (rehosted from the `xtsyvoyage`
 * destination bucket). The legacy Supabase project (oidnydyyjyjfnyadhyzn) was
 * decommissioned, so every hero/section image now resolves through the
 * centralised CDN map. Resolution order:
 *   AI manifest (currently empty) → slug-specific → category fallback → default.
 */
import { SEO_HERO_MANIFEST } from '@/data/seoHeroManifest';
import { cdn } from '@/data/cdnImages';

// Curated, CDN-hosted destination heroes.
const IMG = {
  meghalaya: cdn('xtsyvoyage/Meghalaya Cover Image.jpeg'),
  assam: cdn('xtsyvoyage/Assam Cover Image.jpeg'),
  arunachal: cdn('xtsyvoyage/Arunachal Pradesh Cover Image.jpeg'),
  nagaland: cdn('xtsyvoyage/Nagaland Cover Image.jpeg'),
  sikkim: cdn('xtsyvoyage/Sikkim Cover Image.jpeg'),
  nohkalikai: cdn('xtsyvoyage/Nohkalikai Falls.jpeg'),
  nohkalikai2: cdn('xtsyvoyage/Nohkalikai Falls 2.jpeg'),
  krangshuri: cdn('xtsyvoyage/Krang Shuri Waterfall.jpeg'),
  elephant: cdn('xtsyvoyage/Elephant Falls.jpeg'),
  sevensister: cdn('xtsyvoyage/Seven Sister waterfalls.jpeg'),
  mawsmai: cdn('xtsyvoyage/Mawsmai Cave.jpeg'),
  mawsmai2: cdn('xtsyvoyage/Mawsmai Cave-2.jpeg'),
  mawlynnong: cdn('xtsyvoyage/Mawlynnong.jpeg'),
  mawlynnong2: cdn('xtsyvoyage/Mawlynnong 2.jpeg'),
  nongriat: cdn('xtsyvoyage/Nongriat Double Decker Root Bridge.jpeg'),
  nongriat2: cdn('xtsyvoyage/Nongriat Double Decker Root Bridge and Rainbow Waterfall.jpeg'),
  laitlum: cdn('xtsyvoyage/Laitlum canyons.jpeg'),
  umiam: cdn('xtsyvoyage/Umiam Lake.jpeg'),
  umiam2: cdn('xtsyvoyage/Umiam Lake 2.jpeg'),
  dawki: cdn('xtsyvoyage/Dawki River.jpeg'),
  dawki2: cdn('xtsyvoyage/Dawki River 2.jpeg'),
  dawki3: cdn('xtsyvoyage/Dawki River 3.jpeg'),
  bumla: cdn('xtsyvoyage/Bumla Pass Bike Expedition.jpeg'),
  festival: cdn('xtsyvoyage/Arunachal Winter Cultural Festival.jpeg'),
  bhutan: cdn('xtsyvoyage/Bhutan Mindful Kingdom Journey.jpeg'),
  himachal: cdn('xtsyvoyage/Himachal Yoga Retreat Program.jpeg'),
  dravidian: cdn('xtsyvoyage/Dravidian Architecture Masterclass.jpeg'),
  ecological: cdn('xtsyvoyage/Northeast Ecological Immersion.jpeg'),
};

const DEFAULT_HERO = IMG.laitlum;

// Slug-specific curated heroes.
const SLUG_HERO_MAP: Record<string, string> = {
  'nohkalikai-falls-meghalaya': IMG.nohkalikai,
  'krang-suri-falls-meghalaya': IMG.krangshuri,
  'wei-sawdong-falls-meghalaya': IMG.nohkalikai2,
  'elephant-falls-shillong': IMG.elephant,
  'seven-sisters-falls-meghalaya': IMG.sevensister,
  'waterfalls-in-meghalaya': IMG.nohkalikai,
  'waterfalls-near-shillong': IMG.elephant,
  'best-waterfalls-meghalaya': IMG.krangshuri,
  'mawsmai-cave-cherrapunji': IMG.mawsmai,
  'arwah-cave-cherrapunji': IMG.mawsmai2,
  'meghalaya-caves-guide': IMG.mawsmai,
  'caving-in-meghalaya': IMG.mawsmai2,
  'mawlynnong-cleanest-village': IMG.mawlynnong,
  'nongriat-village-trek': IMG.nongriat,
  'double-decker-root-bridge': IMG.nongriat2,
  'laitlum-canyons-shillong': IMG.laitlum,
  'dawki-umngot-river-guide': IMG.dawki,
  'umiam-lake-shillong': IMG.umiam,
  'shnongpdeng-camping-meghalaya': IMG.dawki2,
  'meghalaya-travel-guide': IMG.laitlum,
  'places-to-visit-meghalaya': IMG.nongriat2,
  'things-to-do-meghalaya': IMG.nongriat,
  'shillong-travel-guide': IMG.umiam2,
  'cherrapunji-travel-guide': IMG.nohkalikai2,
  'dawki-travel-guide': IMG.dawki,
};

// Category-level fallback heroes.
const CATEGORY_HERO_MAP: Record<string, string> = {
  hostels: IMG.laitlum,
  hotels: IMG.umiam,
  homestays: IMG.mawlynnong,
  glamping: IMG.dawki2,
  accommodation: IMG.laitlum,
  rentals: IMG.bumla,
  tours: IMG.nongriat,
  'travel-guides': IMG.meghalaya,
  destinations: IMG.nohkalikai,
  attractions: IMG.krangshuri,
  itineraries: IMG.dawki,
  activities: IMG.bumla,
  restaurants: IMG.mawlynnong2,
  'food-dining': IMG.mawlynnong2,
  weddings: IMG.umiam,
  transport: IMG.laitlum,
  'competitor-capture': IMG.laitlum,
  seasonal: IMG.festival,
  events: IMG.festival,
  'travel-agency': IMG.dawki3,
  hospitals: IMG.umiam2,
  'themed-trips': IMG.bhutan,
  'group-tours': IMG.nongriat2,
  corporate: IMG.umiam,
  'road-bike-trips': IMG.bumla,
  workation: IMG.umiam2,
};

/**
 * Get the hero image URL for a given SEO page.
 * Priority: AI manifest → slug-specific curated → category fallback → default.
 */
export const getHeroImageForPage = (slug: string, category: string): string => {
  return SEO_HERO_MANIFEST[slug] || SLUG_HERO_MAP[slug] || CATEGORY_HERO_MAP[category] || DEFAULT_HERO;
};

/**
 * URL of an AI-generated hero, if one exists. The legacy seo-heroes bucket is
 * gone, so this returns an empty string — the page falls back to the curated
 * CDN hero from getHeroImageForPage().
 */
export const getAIHeroURL = (_slug: string): string => '';

// State-specific section image pools (all CDN-hosted).
const MEGHALAYA_POOL = [
  IMG.nongriat, IMG.dawki, IMG.laitlum, IMG.nohkalikai, IMG.mawlynnong,
  IMG.krangshuri, IMG.umiam, IMG.nongriat2, IMG.elephant, IMG.sevensister,
];
const ASSAM_POOL = [IMG.assam, IMG.sevensister, IMG.ecological];
const ARUNACHAL_POOL = [IMG.arunachal, IMG.bumla, IMG.festival];
const NAGALAND_POOL = [IMG.nagaland, IMG.festival, IMG.ecological];
const SIKKIM_POOL = [IMG.sikkim, IMG.umiam, IMG.laitlum];
const MANIPUR_POOL = [IMG.umiam, IMG.ecological, IMG.sevensister];
const MIZORAM_POOL = [IMG.ecological, IMG.laitlum, IMG.sevensister];
const TRIPURA_POOL = [IMG.ecological, IMG.dravidian, IMG.sevensister];

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
 * Deterministic and state-aware.
 */
export const getSectionImage = (slug: string, sectionIndex: number, heroToAvoid?: string): string => {
  const state = inferStateFromSlug(slug);
  const pool = STATE_SECTION_POOLS[state] ?? MEGHALAYA_POOL;
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  const start = Math.abs(h) % pool.length;
  let img = pool[(start + sectionIndex) % pool.length];
  if (img === heroToAvoid && pool.length > 1) {
    img = pool[(start + sectionIndex + 1) % pool.length];
  }
  return img;
};
