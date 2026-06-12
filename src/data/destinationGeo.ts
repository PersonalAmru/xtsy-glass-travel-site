// ============================================================================
// DESTINATION GEO COORDINATES
// ----------------------------------------------------------------------------
// Approximate WGS84 coordinates for Meghalaya destinations, used to enrich the
// `TouristAttraction` JSON-LD with a `geo` GeoCoordinates node and a stable
// `@id`. Better structured-data quality => richer SERP + AI-answer eligibility.
//
// Coordinates are approximate (place-level, not survey-grade) and safe for
// schema. Destinations not listed fall back to the Meghalaya state centroid.
// ============================================================================

export interface GeoPoint {
  lat: number;
  lng: number;
}

// State centroid fallback (Shillong region).
export const MEGHALAYA_CENTROID: GeoPoint = { lat: 25.467, lng: 91.366 };

export const DESTINATION_GEO: Record<string, GeoPoint> = {
  'umiam-lake': { lat: 25.6536, lng: 91.887 },
  'shillong-peak': { lat: 25.555, lng: 91.865 },
  'elephant-falls': { lat: 25.546, lng: 91.805 },
  'laitlum-canyons': { lat: 25.45, lng: 91.97 },
  'nohkalikai-falls': { lat: 25.276, lng: 91.685 },
  'double-decker-living-root-bridge': { lat: 25.2483, lng: 91.665 },
  'dawki-umngot-river': { lat: 25.185, lng: 92.02 },
  'mawphlang-sacred-forest': { lat: 25.445, lng: 91.75 },
  'mawlynnong-village': { lat: 25.201, lng: 91.915 },
  'krang-suri-falls': { lat: 25.4, lng: 92.2 },
  'mawsmai-cave': { lat: 25.248, lng: 91.728 },
  'seven-sisters-falls': { lat: 25.253, lng: 91.715 },
  'wei-sawdong-falls': { lat: 25.27, lng: 91.71 },
  'rainbow-falls': { lat: 25.235, lng: 91.68 },
  'garden-of-caves': { lat: 25.27, lng: 91.735 },
  'arwah-cave': { lat: 25.263, lng: 91.717 },
  'dainthlen-falls': { lat: 25.29, lng: 91.7 },
  'eco-park-sohra': { lat: 25.253, lng: 91.73 },
  'shnongpdeng': { lat: 25.19, lng: 92.025 },
  'nartiang-monoliths': { lat: 25.58, lng: 92.29 },
  'thadlaskein-lake': { lat: 25.62, lng: 92.33 },
  'balpakram-national-park': { lat: 25.25, lng: 90.88 },
  'nokrek-biosphere-reserve': { lat: 25.46, lng: 90.33 },
  'sweet-falls': { lat: 25.53, lng: 91.87 },
  'bishop-falls': { lat: 25.54, lng: 91.88 },
  'spread-eagle-falls': { lat: 25.56, lng: 91.88 },
  'mawjymbuin-cave': { lat: 25.3, lng: 91.6 },
  'nongkhnum-island': { lat: 25.5, lng: 91.27 },
  'krem-mawmluh': { lat: 25.255, lng: 91.71 },
  'siju-cave': { lat: 25.37, lng: 90.69 },
  'tura-peak': { lat: 25.51, lng: 90.22 },
  'nongjrong-sunrise-viewpoint': { lat: 25.3, lng: 91.8 },
  'kynrem-falls': { lat: 25.24, lng: 91.74 },
  'langshiang-falls': { lat: 25.5, lng: 91.25 },
  'mawryngkhang-bamboo-trail': { lat: 25.33, lng: 91.88 },
  'jakrem-hot-springs': { lat: 25.4, lng: 91.55 },
  'dawki-suspension-bridge': { lat: 25.185, lng: 92.018 },
  'mawthadraishan-peak': { lat: 25.54, lng: 91.6 },
  'nongriat-village': { lat: 25.2483, lng: 91.665 },
  'phe-phe-falls': { lat: 25.45, lng: 92.25 },
  'krem-liat-prah': { lat: 25.27, lng: 92.4 },
  'wah-rilang-viewpoint': { lat: 25.4, lng: 91.5 },
  'ranikor': { lat: 25.23, lng: 91.27 },
};

/** Returns place-level coordinates for a destination slug, falling back to the
 * Meghalaya state centroid so the `geo` node is always present. */
export const getDestinationGeo = (slug: string): GeoPoint =>
  DESTINATION_GEO[slug] ?? MEGHALAYA_CENTROID;
