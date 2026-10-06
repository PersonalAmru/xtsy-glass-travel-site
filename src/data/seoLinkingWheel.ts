/**
 * Internal Linking Wheel Architecture
 * 
 * Creates circular crawl paths so search engines never hit dead ends.
 * Each cluster forms a wheel: Pillar → Destinations → Attractions → Programmatic → back to Pillar
 * 
 * Every page gets exactly 10 contextual internal links:
 * 1 → homepage
 * 1 → meghalaya-travel-guide (master pillar)
 * 2 → related pillar pages
 * 3 → related destination pages
 * 2 → related attraction/programmatic pages
 * 1 → itinerary page
 */

export interface LinkWheelCluster {
  id: string;
  label: string;
  pillar: string;           // pillar page slug
  destinations: string[];   // destination page slugs
  attractions: string[];    // attraction/programmatic slugs
  nextCluster: string;      // next cluster ID for wheel continuity
}

export const LINK_WHEEL_CLUSTERS: LinkWheelCluster[] = [
  {
    id: 'waterfalls',
    label: 'Waterfalls in Meghalaya',
    pillar: 'waterfalls-in-meghalaya',
    destinations: [
      'nohkalikai-falls-meghalaya',
      'krang-suri-falls-meghalaya',
      'wei-sawdong-falls-meghalaya',
      'elephant-falls-shillong',
      'seven-sisters-falls-meghalaya',
    ],
    attractions: [
      'best-waterfalls-meghalaya',
      'waterfalls-near-shillong',
      'waterfalls-near-cherrapunji',
    ],
    nextCluster: 'caves',
  },
  {
    id: 'caves',
    label: 'Caves in Meghalaya',
    pillar: 'meghalaya-caves-guide',
    destinations: [
      'mawsmai-cave-cherrapunji',
      'krem-liat-prah-meghalaya',
      'siju-cave-garo-hills',
      'arwah-cave-cherrapunji',
    ],
    attractions: [
      'best-caves-meghalaya',
      'caving-in-meghalaya',
    ],
    nextCluster: 'shillong',
  },
  {
    id: 'shillong',
    label: 'Shillong Attractions',
    pillar: 'shillong-travel-guide',
    destinations: [
      'police-bazaar-shillong',
      'ward-lake-shillong',
      'don-bosco-museum-shillong',
      'umiam-lake-shillong',
      'laitlum-canyons-shillong',
    ],
    attractions: [
      'things-to-do-in-shillong',
      'best-cafes-shillong',
      'restaurants-in-shillong',
      'stay-near-police-bazar',
    ],
    nextCluster: 'cherrapunjee',
  },
  {
    id: 'cherrapunjee',
    label: 'Cherrapunjee Attractions',
    pillar: 'cherrapunji-travel-guide',
    destinations: [
      'nohkalikai-falls-meghalaya',
      'mawsmai-cave-cherrapunji',
      'seven-sisters-falls-meghalaya',
      'double-decker-root-bridge',
      'eco-park-sohra',
    ],
    attractions: [
      'things-to-do-in-cherrapunjee',
      'shillong-to-cherrapunjee-road-trip',
      'hostel-in-cherrapunji-tonight',
      'cheap-homestay-in-cherrapunji',
    ],
    nextCluster: 'dawki',
  },
  {
    id: 'dawki',
    label: 'Dawki & East Meghalaya',
    pillar: 'dawki-umngot-river-guide',
    destinations: [
      'shnongpdeng-camping-meghalaya',
      'mawlynnong-cleanest-village',
      'dawki-suspension-bridge-meghalaya',
    ],
    attractions: [
      'things-to-do-in-dawki',
      'shillong-to-dawki-road-trip',
      'camping-in-meghalaya',
    ],
    nextCluster: 'trekking',
  },
  {
    id: 'trekking',
    label: 'Adventure & Trekking',
    pillar: 'trekking-in-meghalaya',
    destinations: [
      'double-decker-root-bridge',
      'mawryngkhang-bamboo-trail',
      'nongriat-village-trek',
      'david-scott-trail',
    ],
    attractions: [
      'trekking-trails-meghalaya',
      'adventure-activities-meghalaya',
      'backpacking-meghalaya-guide',
    ],
    nextCluster: 'waterfalls', // completes the wheel
  },
];

// Cluster lookup by ID
const clusterMap = new Map(LINK_WHEEL_CLUSTERS.map(c => [c.id, c]));

// Reverse lookup: slug → cluster ID
const slugToCluster = new Map<string, string>();
LINK_WHEEL_CLUSTERS.forEach(c => {
  slugToCluster.set(c.pillar, c.id);
  c.destinations.forEach(d => slugToCluster.set(d, c.id));
  c.attractions.forEach(a => slugToCluster.set(a, c.id));
});

/**
 * Get the 10 contextual internal links for any page slug.
 * Returns links structured for the linking wheel architecture.
 */
export interface InternalLink {
  slug: string;
  label: string;
  type: 'homepage' | 'master-pillar' | 'pillar' | 'destination' | 'attraction' | 'itinerary';
}

// Default itinerary pages for linking
const ITINERARY_SLUGS = [
  'meghalaya-3-day-itinerary',
  '5-day-meghalaya-itinerary',
  '7-day-meghalaya-itinerary',
  'meghalaya-itinerary',
];

// Pillar slug → human label
const PILLAR_LABELS: Record<string, string> = {
  'meghalaya-travel-guide': 'Meghalaya Travel Guide',
  'places-to-visit-meghalaya': 'Places to Visit in Meghalaya',
  'things-to-do-meghalaya': 'Things to Do in Meghalaya',
  'meghalaya-itinerary': 'Meghalaya Itinerary',
  'shillong-travel-guide': 'Shillong Travel Guide',
  'cherrapunji-travel-guide': 'Cherrapunjee Travel Guide',
  'dawki-umngot-river-guide': 'Dawki & Umngot River Guide',
  'waterfalls-in-meghalaya': 'Waterfalls in Meghalaya',
  'trekking-in-meghalaya': 'Trekking in Meghalaya',
  'meghalaya-backpacking-guide': 'Meghalaya Backpacking Guide',
  'meghalaya-tour-packages': 'Meghalaya Tour Packages',
  'hostels-in-shillong': 'Hostels in Shillong',
  'meghalaya-caves-guide': 'Caves in Meghalaya',
};

export function getWheelLinks(currentSlug: string): InternalLink[] {
  const links: InternalLink[] = [];
  
  // 1. Homepage
  links.push({ slug: '', label: 'Home', type: 'homepage' });
  
  // 2. Master pillar
  if (currentSlug !== 'meghalaya-travel-guide') {
    links.push({ slug: 'meghalaya-travel-guide', label: 'Meghalaya Travel Guide', type: 'master-pillar' });
  }
  
  // Find which cluster this page belongs to
  const clusterId = slugToCluster.get(currentSlug);
  const cluster = clusterId ? clusterMap.get(clusterId) : undefined;
  const nextCluster = cluster ? clusterMap.get(cluster.nextCluster) : undefined;
  
  // 3. Two related pillar pages
  const pillarCandidates = Object.keys(PILLAR_LABELS).filter(s => s !== currentSlug && s !== 'meghalaya-travel-guide');
  if (cluster && cluster.pillar !== currentSlug) {
    links.push({ slug: cluster.pillar, label: PILLAR_LABELS[cluster.pillar] || cluster.label, type: 'pillar' });
  }
  // Add next cluster's pillar for wheel continuity
  if (nextCluster && nextCluster.pillar !== currentSlug) {
    links.push({ slug: nextCluster.pillar, label: PILLAR_LABELS[nextCluster.pillar] || nextCluster.label, type: 'pillar' });
  }
  // Fill remaining pillar slots
  while (links.filter(l => l.type === 'pillar').length < 2) {
    const candidate = pillarCandidates.find(s => !links.some(l => l.slug === s));
    if (!candidate) break;
    links.push({ slug: candidate, label: PILLAR_LABELS[candidate] || candidate, type: 'pillar' });
  }
  
  // 4. Three related destination pages
  if (cluster) {
    const destCandidates = cluster.destinations.filter(d => d !== currentSlug);
    destCandidates.slice(0, 2).forEach(d => {
      links.push({ slug: d, label: d.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), type: 'destination' });
    });
    // One from next cluster for cross-linking
    if (nextCluster) {
      const crossDest = nextCluster.destinations.find(d => d !== currentSlug);
      if (crossDest) {
        links.push({ slug: crossDest, label: crossDest.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), type: 'destination' });
      }
    }
  }
  // Fill remaining destination slots
  while (links.filter(l => l.type === 'destination').length < 3) {
    const fallbacks = ['nohkalikai-falls-meghalaya', 'krang-suri-falls-meghalaya', 'mawsmai-cave-cherrapunji', 'double-decker-root-bridge'];
    const candidate = fallbacks.find(s => !links.some(l => l.slug === s) && s !== currentSlug);
    if (!candidate) break;
    links.push({ slug: candidate, label: candidate.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), type: 'destination' });
  }
  
  // 5. Two related attraction/programmatic pages
  if (cluster) {
    cluster.attractions.filter(a => a !== currentSlug).slice(0, 2).forEach(a => {
      links.push({ slug: a, label: a.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), type: 'attraction' });
    });
  }
  while (links.filter(l => l.type === 'attraction').length < 2) {
    const fallbacks = ['meghalaya-tour-packages', 'backpacker-hostel-shillong', 'best-hostel-in-shillong'];
    const candidate = fallbacks.find(s => !links.some(l => l.slug === s) && s !== currentSlug);
    if (!candidate) break;
    links.push({ slug: candidate, label: candidate.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), type: 'attraction' });
  }
  
  // 6. One itinerary page
  const itinerary = ITINERARY_SLUGS.find(s => s !== currentSlug);
  if (itinerary) {
    links.push({ slug: itinerary, label: itinerary.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), type: 'itinerary' });
  }
  
  return links;
}

/**
 * Keyword-to-URL Canonical Mapping
 * Prevents cannibalization by assigning one primary keyword per page.
 */
export const KEYWORD_CANONICAL_MAP: Record<string, string> = {
  'hostel in shillong': 'best-hostel-in-shillong',
  'best hostel shillong': 'best-hostel-in-shillong',
  'backpacker hostel shillong': 'backpacker-hostel-shillong',
  'budget-friendly hostel shillong': 'cheap-hostels-shillong',
  'budget stay shillong': 'budget-stay-shillong',
  'dormitory shillong': 'shillong-dormitory',
  'hostels in meghalaya': 'hostels-in-meghalaya',
  'meghalaya travel guide': 'meghalaya-travel-guide',
  'places to visit meghalaya': 'places-to-visit-meghalaya',
  'things to do meghalaya': 'things-to-do-meghalaya',
  'meghalaya itinerary': 'meghalaya-itinerary',
  'shillong travel guide': 'shillong-travel-guide',
  'cherrapunjee travel guide': 'cherrapunji-travel-guide',
  'dawki travel guide': 'dawki-umngot-river-guide',
  'waterfalls in meghalaya': 'waterfalls-in-meghalaya',
  'trekking in meghalaya': 'trekking-in-meghalaya',
  'meghalaya backpacking': 'meghalaya-backpacking-guide',
  'meghalaya tour packages': 'meghalaya-tour-packages',
  'nohkalikai falls': 'nohkalikai-falls-meghalaya',
  'krang suri falls': 'krang-suri-falls-meghalaya',
  'wei sawdong falls': 'wei-sawdong-falls-meghalaya',
  'mawsmai cave': 'mawsmai-cave-cherrapunji',
  'dawki river': 'dawki-umngot-river-guide',
  'living root bridge': 'double-decker-root-bridge',
  'mawlynnong village': 'mawlynnong-cleanest-village',
  'laitlum canyons': 'laitlum-canyons-shillong',
  '3 day meghalaya itinerary': 'meghalaya-3-day-itinerary',
  '5 day meghalaya itinerary': '5-day-meghalaya-itinerary',
  '7 day meghalaya itinerary': '7-day-meghalaya-itinerary',
  'restaurants in shillong': 'restaurants-in-shillong',
  'cafes in shillong': 'best-cafes-shillong',
  'hotels in shillong': 'hotels-in-shillong',
  'homestays in shillong': 'homestays-in-shillong',
  'camping in meghalaya': 'camping-in-meghalaya',
  'best time to visit meghalaya': 'best-time-to-visit-meghalaya',
};

/**
 * Homepage Destination Explorer categories
 * Used for the branch-view navigation on the homepage
 */
export interface ExplorerCategory {
  id: string;
  label: string;
  icon: string;
  pillarSlug: string;
  destinations: { slug: string; label: string }[];
}

export const EXPLORER_CATEGORIES: ExplorerCategory[] = [
  {
    id: 'waterfalls',
    label: 'Waterfalls',
    icon: '💧',
    pillarSlug: 'waterfalls-in-meghalaya',
    destinations: [
      { slug: 'nohkalikai-falls-meghalaya', label: 'Nohkalikai Falls' },
      { slug: 'krang-suri-falls-meghalaya', label: 'Krang Suri Falls' },
      { slug: 'wei-sawdong-falls-meghalaya', label: 'Wei Sawdong Falls' },
      { slug: 'seven-sisters-falls-meghalaya', label: 'Seven Sisters Falls' },
      { slug: 'elephant-falls-shillong', label: 'Elephant Falls' },
      { slug: 'waterfalls-near-shillong', label: 'Waterfalls Near Shillong' },
    ],
  },
  {
    id: 'caves',
    label: 'Caves',
    icon: '🕳️',
    pillarSlug: 'meghalaya-caves-guide',
    destinations: [
      { slug: 'mawsmai-cave-cherrapunji', label: 'Mawsmai Cave' },
      { slug: 'krem-liat-prah-meghalaya', label: 'Krem Liat Prah' },
      { slug: 'siju-cave-garo-hills', label: 'Siju Cave' },
      { slug: 'arwah-cave-cherrapunji', label: 'Arwah Cave' },
    ],
  },
  {
    id: 'villages',
    label: 'Villages & Culture',
    icon: '🏘️',
    pillarSlug: 'places-to-visit-meghalaya',
    destinations: [
      { slug: 'mawlynnong-cleanest-village', label: 'Mawlynnong — Cleanest Village' },
      { slug: 'nongriat-village-trek', label: 'Nongriat Village' },
      { slug: 'mawphlang-sacred-forest', label: 'Mawphlang Sacred Forest' },
      { slug: 'shnongpdeng-camping-meghalaya', label: 'Shnongpdeng Village' },
    ],
  },
  {
    id: 'viewpoints',
    label: 'Viewpoints',
    icon: '⛰️',
    pillarSlug: 'places-to-visit-meghalaya',
    destinations: [
      { slug: 'laitlum-canyons-shillong', label: 'Laitlum Canyons' },
      { slug: 'shillong-peak-meghalaya', label: 'Shillong Peak' },
      { slug: 'nongjrong-sunrise-viewpoint', label: 'Nongjrong Sunrise' },
      { slug: 'mawthadraishan-peak', label: 'Mawthadraishan Peak' },
    ],
  },
  {
    id: 'adventure',
    label: 'Adventure',
    icon: '🧗',
    pillarSlug: 'trekking-in-meghalaya',
    destinations: [
      { slug: 'double-decker-root-bridge', label: 'Double Decker Root Bridge' },
      { slug: 'mawryngkhang-bamboo-trail', label: 'Mawryngkhang Trek' },
      { slug: 'david-scott-trail', label: 'David Scott Trail' },
      { slug: 'camping-in-meghalaya', label: 'Camping in Meghalaya' },
    ],
  },
  {
    id: 'rivers',
    label: 'Rivers & Lakes',
    icon: '🏞️',
    pillarSlug: 'dawki-umngot-river-guide',
    destinations: [
      { slug: 'dawki-umngot-river-guide', label: 'Dawki — Umngot River' },
      { slug: 'umiam-lake-shillong', label: 'Umiam Lake' },
      { slug: 'shnongpdeng-camping-meghalaya', label: 'Shnongpdeng River Beach' },
      { slug: 'ranikor-meghalaya', label: 'Ranikor River Valley' },
    ],
  },
];
