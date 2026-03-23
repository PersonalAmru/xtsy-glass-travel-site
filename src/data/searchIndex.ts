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
  'meghalaya': ['abode of clouds', 'scotland of east', 'shillong', 'cherrapunji', 'dawki', 'living root bridge'],
  'northeast': ['north east india', 'seven sisters', 'NE india', 'assam', 'nagaland', 'manipur', 'mizoram', 'tripura', 'arunachal', 'sikkim'],
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
    title: 'XTSY Glass Stargazing Suite',
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
    url: '/travel',
    keywords: [
      'north east india', 'northeast tour', 'seven sisters', 'assam', 'nagaland',
      'manipur', 'mizoram', 'tripura', 'arunachal pradesh', 'sikkim',
      'meghalaya tour', 'unexplored india',
    ],
    synonyms: ['northeast'],
  });

  // 5. Tour Packages → TOURS (static subset to keep index lean)
  const tourEntries: Omit<SearchEntry, 'id'>[] = [
    {
      title: 'Meghalaya Biodiversity Expedition',
      description: 'Research expedition exploring endemic species & conservation',
      category: 'tours',
      icon: '🔬',
      url: '/travel',
      price: '₹33,999',
      location: 'Meghalaya',
      keywords: ['biodiversity', 'wildlife', 'research', 'conservation', 'ecology', 'meghalaya tour'],
    },
    {
      title: 'Wari Chora Expedition',
      description: 'Extreme wilderness trek through Meghalaya\'s hidden gem',
      category: 'tours',
      icon: '🧗',
      url: '/travel',
      price: '₹13,999',
      location: 'Meghalaya',
      keywords: ['wari chora', 'trek meghalaya', 'waterfall rappelling', 'adventure trek', 'canyoning'],
    },
    {
      title: 'Krem Chympe Cave Expedition',
      description: 'Underground adventure in India\'s 5th longest cave',
      category: 'tours',
      icon: '🦇',
      url: '/travel',
      price: '₹18,999',
      location: 'Meghalaya',
      keywords: ['cave expedition', 'caving', 'krem chympe', 'speleology', 'underground river'],
    },
    {
      title: 'Dawki & Living Root Bridges',
      description: 'Crystal clear rivers and UNESCO living root bridges',
      category: 'tours',
      icon: '🌉',
      url: '/travel',
      price: '₹18,999',
      location: 'Meghalaya',
      keywords: ['dawki', 'living root bridge', 'crystal clear river', 'double decker bridge', 'nongriat'],
    },
    {
      title: 'Himachal Yoga Retreat',
      description: 'Transformative yoga in Dharamkot with Himalayan views',
      category: 'tours',
      icon: '🧘',
      url: '/travel',
      price: '₹39,999',
      location: 'Himachal Pradesh',
      keywords: ['yoga retreat', 'meditation', 'dharamshala', 'himalayan yoga', 'wellness'],
    },
    {
      title: 'Wilderness Survival Camp',
      description: 'Master winter survival in Northeast wilderness',
      category: 'tours',
      icon: '🏕️',
      url: '/travel',
      price: '₹24,999',
      location: 'Northeast India',
      keywords: ['survival camp', 'wilderness training', 'bushcraft', 'camping', 'outdoor skills'],
    },
    {
      title: 'Tawang Monastery Trek',
      description: 'Journey to India\'s largest monastery in Arunachal',
      category: 'tours',
      icon: '🏔️',
      url: '/travel',
      price: '₹28,999',
      location: 'Arunachal Pradesh',
      keywords: ['tawang', 'monastery', 'arunachal pradesh', 'bumla pass', 'buddhist monastery'],
    },
    {
      title: 'Sikkim High-Altitude Adventure',
      description: 'Gurudongmar Lake & Kanchenjunga viewpoints',
      category: 'tours',
      icon: '🏔️',
      url: '/travel',
      price: '₹32,999',
      location: 'Sikkim',
      keywords: ['sikkim', 'gurudongmar', 'kanchenjunga', 'high altitude', 'gangtok', 'pelling'],
    },
    {
      title: 'Kerala Backwaters Cruise',
      description: 'Houseboat cruise through Kerala\'s serene backwaters',
      category: 'tours',
      icon: '🚢',
      url: '/travel',
      price: '₹26,999',
      location: 'Kerala',
      keywords: ['kerala', 'backwaters', 'houseboat', 'alleppey', 'munnar', 'thekkady'],
    },
    {
      title: 'Royal Enfield Northeast Ride',
      description: 'Epic motorcycle expedition across Northeast India',
      category: 'tours',
      icon: '🏍️',
      url: '/travel',
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
    { title: 'Travel & Tours', description: '30+ curated tour packages across India', category: 'pages', icon: '✈️', url: '/travel', keywords: ['travel', 'tours', 'packages', 'trip', 'itinerary', 'adventure'] },
    { title: 'Blog — Discover Meghalaya', description: 'Travel guides and destination stories', category: 'pages', icon: '📝', url: '/blog', keywords: ['blog', 'meghalaya guide', 'travel blog', 'things to do shillong'] },
    { title: 'Offers & Deals', description: 'Latest offers on stays and tours', category: 'pages', icon: '🎁', url: '/offers', keywords: ['offers', 'deals', 'discount', 'coupon', 'promo'] },
  ];

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
