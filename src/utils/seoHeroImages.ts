/**
 * Hero image mapping for programmatic SEO pages.
 * Uses Supabase-hosted Meghalaya gallery assets where available,
 * with category-level fallbacks for pages without specific images.
 */

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
};

const DEFAULT_HERO = `${THINGS_TO_DO}/laitlum-canyons-meghalaya-2.webp`;

/**
 * Get the hero image URL for a given SEO page.
 * Priority: slug-specific → category fallback → default
 */
export const getHeroImageForPage = (slug: string, category: string): string => {
  return SLUG_HERO_MAP[slug] || CATEGORY_HERO_MAP[category] || DEFAULT_HERO;
};
