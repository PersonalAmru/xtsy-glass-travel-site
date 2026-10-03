/**
 * Centralized Searchable Index for XTSY Intelligent Search Console
 * Includes: properties, rooms, experiences, locations, tours, pages, SEO keywords, synonyms
 */

import { ROOM_INVENTORY } from '@/data/roomInventory';
import { PROPERTIES, LOCATIONS } from '@/data/properties';

export type SearchCategory = 'stays' | 'experiences' | 'locations' | 'tours' | 'pages';

export interface SearchEntry {
  id: string;
  title: string;
  description: string;
  category: SearchCategory;
  icon: string;
  image?: string;
  url: string;
  price?: string;
  location?: string;
  keywords: string[];
  synonyms?: string[];
}

// ======================== SYNONYM MAP ========================
export const SYNONYM_MAP: Record<string, string[]> = {
  'glass stay': ['glasshouse', 'glass dome', 'glass cabin', 'glass suite', 'panorama glass', '270'],
  'hostel': ['budget stay', 'backpacker hostel', 'dormitory', 'dorm', 'cheap stay', 'travellers hostel'],
  'romantic stay': ['couple stay', 'honeymoon stay', 'couples retreat', 'romantic getaway', 'valentine'],
  'stargazing': ['glass house', 'night sky', 'milky way', 'star viewing', 'astronomy'],
  'adventure': ['trek', 'trekking', 'hiking', 'expedition', 'outdoor', 'camping'],
  'budget': ['cheap', 'affordable', 'low cost', 'economy', 'backpacker'],
  'luxury': ['premium', 'high-end', 'exclusive', 'vip', 'five star'],
  'female': ['women', 'girls', 'ladies', 'women only', 'female only'],
  'pet': ['dog', 'cat', 'animal', 'furry friend', 'pet friendly'],
  'work': ['remote work', 'coworking', 'digital nomad', 'workation', 'work from home', 'wfh'],
  'meghalaya': ['abode of clouds', 'scotland of east', 'shillong', 'cherrapunji', 'dawki', 'living root bridge', 'sohra'],
  'northeast': ['north east india', 'seven sisters', 'NE india', 'assam', 'nagaland', 'manipur', 'mizoram', 'tripura', 'arunachal', 'sikkim'],
  'best time to visit': ['when to go', 'season', 'best month', 'weather'],
  'how to reach': ['directions', 'transport', 'travel to', 'getting there', 'airport', 'train'],
  'couple': ['honeymoon', 'romantic', 'anniversary', 'proposal', 'valentine'],
};

// Expand a query with synonyms
export function expandWithSynonyms(query: string): string {
  const q = query.toLowerCase();
  let expanded = q;
  for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
    if (q.includes(key)) {
      expanded += ' ' + synonyms.join(' ');
    }
    for (const syn of synonyms) {
      if (q.includes(syn)) {
        expanded += ' ' + key + ' ' + synonyms.join(' ');
        break;
      }
    }
  }
  return expanded;
}

// ======================== BUILD INDEX ========================
function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  // 1. Room Types → STAYS
  Object.values(ROOM_INVENTORY).forEach((room) => {
    entries.push({
      id: `room-${room.id}`,
      title: room.name,
      description: `${room.propertyType} · From ₹${room.discountedPrice}/night`,
      category: 'stays',
      icon: room.kind === 'dorm' ? '🛏️' : room.category === 'luxury' ? '✨' : '👫',
      image: room.image,
      url: room.id === 'xtsy-270' ? '/xtsy-270' : '/search?location=shillong',
      price: `₹${room.discountedPrice}`,
      location: 'Shillong, Meghalaya',
      keywords: [
        room.name, room.shortName, room.propertyType,
        room.category, room.kind, room.description,
        `₹${room.discountedPrice}`, `${room.capacity} bed`,
        ...(room.tags || []),
        ...room.features.slice(0, 5),
        // SEO keywords
        ...(room.kind === 'dorm' ? ['dormitory', 'hostel bed', 'backpacker', 'budget stay shillong'] : []),
        ...(room.category === 'luxury' ? ['luxury stay shillong', 'glass house india', 'stargazing hotel', 'romantic stay shillong', 'glamping northeast india'] : []),
        ...(room.id === 'king-double-room' ? ['couple room shillong', 'private room hostel', 'king bed shillong'] : []),
        ...(room.tags?.includes('preferred_by_female') ? ['female dorm shillong', 'women only hostel', 'safe stay women'] : []),
      ],
      synonyms: room.category === 'luxury'
        ? ['glass stay', 'stargazing', 'romantic stay', 'luxury']
        : ['hostel', 'budget'],
    });
  });

  // 2. Properties
  Object.values(PROPERTIES).forEach((prop) => {
    entries.push({
      id: `property-${prop.id}`,
      title: prop.name,
      description: prop.description,
      category: 'stays',
      icon: prop.category === 'luxury' ? '💎' : '🏠',
      image: prop.heroImage,
      url: prop.slug === 'xtsy-luxury' ? '/xtsy-270' : '/properties',
      price: `₹${prop.priceRange.min}–₹${prop.priceRange.max}`,
      location: 'Shillong, Meghalaya',
      keywords: [
        prop.name, prop.shortName, prop.description,
        prop.category,
        ...prop.amenities,
        'shillong', 'meghalaya', 'northeast india',
        ...(prop.category === 'hostel' ? ['biggest hostel north east', 'best hostel shillong', 'travellers hostel'] : []),
        ...(prop.category === 'luxury' ? ['luxury glass house', 'panorama suite', 'best luxury stay shillong'] : []),
      ],
    });
  });

  // 3. Experiences
  entries.push({
    id: 'exp-stargazing',
    title: 'Experience by XTSY',
    description: 'India\'s first 270° panoramic glass house for stargazing experiences',
    category: 'experiences',
    icon: '🌌',
    url: '/xtsy-270',
    location: 'Shillong',
    keywords: [
      'glass house stay', 'stargazing hotel', 'glass cabin india', 'romantic stay shillong',
      'luxury glass dome', 'northeast india glamping', 'milky way viewing',
      'panoramic glass', '270 degree view', 'mountain glass house',
      'best stargazing stay india', 'glass house meghalaya',
    ],
    synonyms: ['glass stay', 'stargazing', 'romantic stay'],
  });

  entries.push({
    id: 'exp-pet-friendly',
    title: 'Pet-Friendly Stays',
    description: 'Travel with your furry companion at XTSY',
    category: 'experiences',
    icon: '🐾',
    url: '/pet-friendly',
    keywords: ['pet friendly hotel', 'dog friendly hostel', 'travel with pets', 'pet stay shillong', 'animal friendly'],
    synonyms: ['pet'],
  });

  entries.push({
    id: 'exp-female',
    title: 'Female Travellers Safe Stays',
    description: 'Curated safe stays and dorms for women solo travellers',
    category: 'experiences',
    icon: '👩‍💼',
    url: '/female-travellers',
    keywords: ['female solo travel', 'women hostel', 'girls dorm', 'safe stay women', 'women only dorm shillong'],
    synonyms: ['female'],
  });

  entries.push({
    id: 'exp-work',
    title: 'Work From XTSY',
    description: 'Remote work-friendly hostel with high-speed WiFi',
    category: 'experiences',
    icon: '💻',
    url: '/work-from-home',
    keywords: ['workation', 'digital nomad hostel', 'coworking shillong', 'remote work hotel', 'wifi hostel'],
    synonyms: ['work'],
  });

  entries.push({
    id: 'exp-rentals',
    title: 'XTSY Bike & Car Rentals',
    description: 'Explore Meghalaya on two wheels or four',
    category: 'experiences',
    icon: '🏍️',
    url: '/xtsy-rentals',
    keywords: ['bike rental shillong', 'car rental meghalaya', 'scooty rent', 'royal enfield shillong', 'self drive'],
  });

  // 3b. XTSY Adventure Campsite Dawki — featured experience entry
  entries.push({
    id: 'exp-dawki-campsite',
    title: 'XTSY Adventure Campsite — Dawki',
    description: 'Riverside camping on Umngot · ₹800 only camping · ₹1000 with breakfast',
    category: 'experiences',
    icon: '⛺',
    url: '/xtsy-adventure-campsite-dawki',
    price: '₹800',
    location: 'Dawki, Meghalaya',
    keywords: [
      'dawki camping', 'camping in dawki', 'umngot river camping', 'dawki tent stay',
      'riverside camping meghalaya', 'xtsy adventure campsite', 'best camping dawki',
      'budget stay dawki', 'dawki bonfire', 'dawki kayaking', 'stay in dawki today',
      'camping near dawki', 'tent stay meghalaya', 'meghalaya adventure camping',
    ],
    synonyms: ['adventure', 'budget'],
  });

  // 4. Locations
  Object.values(LOCATIONS).forEach((loc) => {
    entries.push({
      id: `loc-${loc.id}`,
      title: loc.name,
      description: `${loc.state}, ${loc.country} — Explore stays & tours`,
      category: 'locations',
      icon: '📍',
      url: `/search?location=${loc.id}`,
      location: `${loc.state}, ${loc.country}`,
      keywords: [
        loc.name, loc.state, loc.country,
        'northeast india', 'scotland of east', 'abode of clouds',
        'cherrapunji', 'dawki', 'living root bridge', 'mawlynnong',
      ],
      synonyms: ['meghalaya', 'northeast'],
    });
  });

  entries.push({
    id: 'loc-northeast',
    title: 'North East India',
    description: 'Explore the mystical 8 sister states',
    category: 'locations',
    icon: '🌿',
    url: '/tours?group=northeast',
    keywords: [
      'north east india', 'northeast tour', 'seven sisters', 'assam', 'nagaland',
      'manipur', 'mizoram', 'tripura', 'arunachal pradesh', 'sikkim',
      'meghalaya tour', 'unexplored india',
    ],
    synonyms: ['northeast'],
  });

  entries.push(
    {
      id: 'adventure-meghalaya-tours', title: 'Meghalaya Adventure Tours',
      description: 'Compare guided trips, treks and river outings in Meghalaya', category: 'tours', icon: '🥾',
      url: '/meghalaya-tour-packages', location: 'Meghalaya',
      keywords: ['meghalaya adventure tour', 'adventure tours in northeast india', 'meghalaya trekking tour'],
    },
    {
      id: 'adventure-meghalaya-activities', title: 'Adventure Activities in Meghalaya',
      description: 'Treks, caves, rivers and outdoor trips from Shillong', category: 'experiences', icon: '🏞️',
      url: '/things-to-do-in-meghalaya', location: 'Meghalaya',
      keywords: ['adventure activities in meghalaya', 'adventure activities in shillong', 'things to do near shillong'],
    },
    {
      id: 'adventure-northeast-expeditions', title: 'Northeast Motorbike & 4x4 Expeditions',
      description: 'Routes from Guwahati and Shillong, with permits and seasons', category: 'tours', icon: '🏍️',
      url: '/expeditions', location: 'Northeast India',
      keywords: ['motorbike expedition northeast india', '4x4 expedition meghalaya', 'northeast road trip'],
    },
  );

  for (const [state, cities] of [
    ['meghalaya', ['shillong', 'cherrapunji', 'dawki', 'mawlynnong', 'jowai', 'mawsynram', 'nongstoin', 'tura']],
    ['assam', ['guwahati', 'kaziranga', 'majuli', 'jorhat']],
  ] as const) {
    for (const city of cities) {
      entries.push({
        id: `nearby-adventure-${city}`,
        title: `Adventure activities near ${city[0].toUpperCase()}${city.slice(1)}`,
        description: `Nearby places and onward trips around ${city}, ${state}`,
        category: 'locations', icon: '📍',
        url: `/destinations/${state}/${city}`, location: `${city}, ${state}`,
        keywords: [`adventure near me ${city}`, `adventure activities near ${city}`, `adventure activities in ${city}`],
      });
    }
  }

  // 5. Tour Packages → TOURS (static subset to keep index lean)
  const tourEntries: Omit<SearchEntry, 'id'>[] = [
    {
      title: 'Meghalaya Biodiversity Expedition',
      description: 'Research expedition exploring endemic species & conservation',
      category: 'tours',
      icon: '🔬',
      url: '/tours',
      price: '₹33,999',
      location: 'Meghalaya',
      keywords: ['biodiversity', 'wildlife', 'research', 'conservation', 'ecology', 'meghalaya tour'],
    },
    {
      title: 'Wari Chora Expedition',
      description: 'Extreme wilderness trek through Meghalaya\'s hidden gem',
      category: 'tours',
      icon: '🧗',
      url: '/tours',
      price: '₹13,999',
      location: 'Meghalaya',
      keywords: ['wari chora', 'trek meghalaya', 'waterfall rappelling', 'adventure trek', 'canyoning'],
    },
    {
      title: 'Krem Chympe Cave Expedition',
      description: 'Underground adventure in India\'s 5th longest cave',
      category: 'tours',
      icon: '🦇',
      url: '/tours',
      price: '₹18,999',
      location: 'Meghalaya',
      keywords: ['cave expedition', 'caving', 'krem chympe', 'speleology', 'underground river'],
    },
    {
      title: 'Dawki & Living Root Bridges',
      description: 'Crystal clear rivers and UNESCO living root bridges',
      category: 'tours',
      icon: '🌉',
      url: '/tours',
      price: '₹18,999',
      location: 'Meghalaya',
      keywords: ['dawki', 'living root bridge', 'crystal clear river', 'double decker bridge', 'nongriat'],
    },
    {
      title: 'Himachal Yoga Retreat',
      description: 'Transformative yoga in Dharamkot with Himalayan views',
      category: 'tours',
      icon: '🧘',
      url: '/tours',
      price: '₹39,999',
      location: 'Himachal Pradesh',
      keywords: ['yoga retreat', 'meditation', 'dharamshala', 'himalayan yoga', 'wellness'],
    },
    {
      title: 'Wilderness Survival Camp',
      description: 'Master winter survival in Northeast wilderness',
      category: 'tours',
      icon: '🏕️',
      url: '/tours',
      price: '₹24,999',
      location: 'Northeast India',
      keywords: ['survival camp', 'wilderness training', 'bushcraft', 'camping', 'outdoor skills'],
    },
    {
      title: 'Tawang Monastery Trek',
      description: 'Journey to India\'s largest monastery in Arunachal',
      category: 'tours',
      icon: '🏔️',
      url: '/tours',
      price: '₹28,999',
      location: 'Arunachal Pradesh',
      keywords: ['tawang', 'monastery', 'arunachal pradesh', 'bumla pass', 'buddhist monastery'],
    },
    {
      title: 'Sikkim High-Altitude Adventure',
      description: 'Gurudongmar Lake & Kanchenjunga viewpoints',
      category: 'tours',
      icon: '🏔️',
      url: '/tours',
      price: '₹32,999',
      location: 'Sikkim',
      keywords: ['sikkim', 'gurudongmar', 'kanchenjunga', 'high altitude', 'gangtok', 'pelling'],
    },
    {
      title: 'Kerala Backwaters Cruise',
      description: 'Houseboat cruise through Kerala\'s serene backwaters',
      category: 'tours',
      icon: '🚢',
      url: '/tours',
      price: '₹26,999',
      location: 'Kerala',
      keywords: ['kerala', 'backwaters', 'houseboat', 'alleppey', 'munnar', 'thekkady'],
    },
    {
      title: 'Royal Enfield Northeast Ride',
      description: 'Epic motorcycle expedition across Northeast India',
      category: 'tours',
      icon: '🏍️',
      url: '/tours',
      price: '₹34,999',
      location: 'Northeast India',
      keywords: ['bike ride', 'royal enfield', 'motorcycle', 'road trip', 'biking northeast'],
    },
  ];

  tourEntries.forEach((t, i) => {
    entries.push({ ...t, id: `tour-${i}` } as SearchEntry);
  });

  // 6. Pages
  const pageEntries: Omit<SearchEntry, 'id'>[] = [
    { title: 'Gallery', description: 'Photos & videos of XTSY properties', category: 'pages', icon: '📸', url: '/gallery', keywords: ['gallery', 'photos', 'images', 'pictures', 'videos'] },
    { title: 'About XTSY', description: 'Our story, mission & team', category: 'pages', icon: '📖', url: '/about', keywords: ['about', 'story', 'team', 'mission', 'founder'] },
    { title: 'FAQs', description: 'Frequently asked questions', category: 'pages', icon: '❓', url: '/faq', keywords: ['faq', 'help', 'question', 'how to', 'support'] },
    { title: 'XTSY vs Zostel', description: 'Honest comparison guide', category: 'pages', icon: '⚔️', url: '/xtsy-vs-zostel', keywords: ['zostel', 'compare', 'vs', 'alternative', 'better hostel'] },
    { title: 'Pricing & Cancellation', description: 'Transparent pricing and refund policies', category: 'pages', icon: '📋', url: '/pricing-cancellation-policy', keywords: ['pricing', 'cancellation', 'refund', 'policy'] },
    { title: 'Privacy Policy', description: 'Your data privacy rights', category: 'pages', icon: '🔒', url: '/privacy-policy', keywords: ['privacy', 'data', 'gdpr', 'policy'] },
    { title: 'Travel & Tours', description: '30+ curated tour packages across India', category: 'pages', icon: '✈️', url: '/tours', keywords: ['travel', 'tours', 'packages', 'trip', 'itinerary', 'adventure'] },
    { title: 'Blog — Discover Meghalaya', description: 'Travel guides and destination stories', category: 'pages', icon: '📝', url: '/guides', keywords: ['blog', 'meghalaya guide', 'travel blog', 'things to do shillong'] },
    { title: 'Offers & Deals', description: 'Latest offers on stays and tours', category: 'pages', icon: '🎁', url: '/book', keywords: ['offers', 'deals', 'discount', 'coupon', 'promo'] },
    { title: 'Destinations — Meghalaya Guide', description: 'Top 10 places to visit in Meghalaya', category: 'pages', icon: '🗺️', url: '/destinations', keywords: ['destinations', 'meghalaya tourist places', 'places to visit meghalaya', 'meghalaya tourism', 'top 10 meghalaya'] },
  ];

  // 7. Destination entries for search
  const destinationEntries: Omit<SearchEntry, 'id'>[] = [
    { title: 'Living Root Bridges, Nongriat', description: 'UNESCO-nominated bio-engineered bridges by Khasi tribes', category: 'locations', icon: '🌉', url: '/destinations#living-root-bridges', location: 'Nongriat, Meghalaya', keywords: ['living root bridge', 'double decker bridge', 'nongriat trek', 'root bridge meghalaya', 'unesco meghalaya'] },
    { title: 'Dawki & Umngot River', description: 'Clearest river in Asia — boats float in mid-air', category: 'locations', icon: '🚣', url: '/destinations#dawki-umngot-river', location: 'Dawki, Meghalaya', keywords: ['dawki river', 'umngot river', 'clearest river india', 'crystal clear river', 'dawki boat ride'] },
    { title: 'Cherrapunji (Sohra)', description: 'Wettest place on Earth — waterfalls & living root bridges', category: 'locations', icon: '🌧️', url: '/destinations#cherrapunji', location: 'Sohra, Meghalaya', keywords: ['cherrapunji', 'sohra', 'wettest place earth', 'seven sisters falls', 'cherrapunji tour'] },
    { title: 'Mawlynnong Village', description: "Asia's Cleanest Village — sustainable community living", category: 'locations', icon: '🌸', url: '/destinations#mawlynnong', location: 'East Khasi Hills', keywords: ['mawlynnong', 'cleanest village asia', 'clean village meghalaya', 'mawlynnong tour'] },
    { title: 'Laitlum Canyons', description: 'End of Hills — dramatic canyon viewpoints near Shillong', category: 'locations', icon: '🏔️', url: '/destinations#laitlum-canyons', location: 'Near Shillong', keywords: ['laitlum canyons', 'end of hills', 'canyon trek shillong', 'laitlum viewpoint'] },
    { title: 'Nohkalikai Falls', description: "India's tallest plunge waterfall at 1,115 feet", category: 'locations', icon: '💧', url: '/destinations#nohkalikai-falls', location: 'Cherrapunji', keywords: ['nohkalikai falls', 'tallest waterfall india', 'cherrapunji waterfall', 'plunge waterfall'] },
    { title: 'Mawphlang Sacred Forest', description: '800-year-old protected sacred grove of the Khasi people', category: 'locations', icon: '🌲', url: '/destinations#mawphlang-sacred-forest', location: 'East Khasi Hills', keywords: ['mawphlang', 'sacred forest', 'sacred grove meghalaya', 'ancient forest'] },
    { title: 'Umiam Lake (Barapani)', description: 'Scenic reservoir with kayaking and sunset views', category: 'locations', icon: '🏞️', url: '/destinations#umiam-lake', location: 'Ri-Bhoi, Meghalaya', keywords: ['umiam lake', 'barapani', 'shillong lake', 'kayaking meghalaya'] },
  ];

  destinationEntries.forEach((d, i) => {
    entries.push({ ...d, id: `dest-${i}` } as SearchEntry);
  });

  pageEntries.forEach((p, i) => {
    entries.push({ ...p, id: `page-${i}` } as SearchEntry);
  });

  return entries;
}

// Singleton
let _cachedIndex: SearchEntry[] | null = null;
export function getSearchIndex(): SearchEntry[] {
  if (!_cachedIndex) {
    _cachedIndex = buildSearchIndex();
  }
  return _cachedIndex;
}

export const CATEGORY_LABELS: Record<SearchCategory, string> = {
  stays: 'STAYS',
  experiences: 'EXPERIENCES',
  locations: 'LOCATIONS',
  tours: 'TOUR PACKAGES',
  pages: 'PAGES',
};

export const CATEGORY_ORDER: SearchCategory[] = ['stays', 'experiences', 'locations', 'tours', 'pages'];
