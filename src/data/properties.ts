/**
 * PROPERTY ARCHITECTURE
 * Defines properties within locations, each with their own inventory
 */

import xtsyStargazing from '@/assets/xtsy-270-stargazing.jpeg';
import xtsyAerial from '@/assets/xtsy-270-aerial.jpeg';
import xtsyMilkyway from '@/assets/xtsy-270-milkyway.jpeg';
import xtsyMilkyway2 from '@/assets/xtsy-270-milkyway2.jpeg';
import xtsyInterior from '@/assets/xtsy-270-interior.jpeg';
import hostelHero from '@/assets/hostel-hero-9068.jpeg';
import { cdn, cdnMany } from './cdnImages';

export interface Location {
  id: string;
  name: string;
  state: string;
  country: string;
  isActive: boolean;
}

export interface Property {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  locationId: string;
  description: string;
  heroImage: string;
  images: string[];
  amenities: string[];
  priceRange: { min: number; max: number };
  rating: number;
  reviewCount: number;
  category: 'luxury' | 'hostel' | 'budget';
  roomTypeIds: string[]; // IDs from roomInventory.ts
  isActive: boolean;
}

// Property gallery image keys (uploaded to storage, rehosted on the Lovable CDN)
const PROPERTY_IMAGE_KEYS = [
  'xtsy/Property Image 1.jpg',
  'xtsy/Property Images 2.jpg',
  'xtsy/Property Images 3.jpg',
  'xtsy/Property Images 4.jpg',
  'xtsy/Property Images 5.jpg',
  'xtsy/Property Images 6.jpg',
  'xtsy/Property Images 7.jpg',
  'xtsy/Property Images 8.jpg',
  'xtsy/Property Images 9.jpg',
  'xtsy/Property Images 10.jpg',
];

// ==================== LOCATIONS ====================
export const LOCATIONS: Record<string, Location> = {
  'shillong': {
    id: 'shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    country: 'India',
    isActive: true,
  },
  'dawki': {
    id: 'dawki',
    name: 'Dawki',
    state: 'Meghalaya',
    country: 'India',
    isActive: true,
  },
};

// Dawki riverside campsite imagery (uploaded to the "xtsy-adventure-campsite" bucket, rehosted on the CDN)
export const DAWKI_CAMPING_IMAGES = cdnMany([
  'xtsy-adventure-campsite/Dawki Campsite 1.jpeg',
  'xtsy-adventure-campsite/Dawki Campsite 2.jpeg',
  'xtsy-adventure-campsite/Dawki Campsite 3.jpeg',
  'xtsy-adventure-campsite/Dawki Campsite 4.jpeg',
  'xtsy-adventure-campsite/Dawki Campsite 5.jpeg',
  'xtsy-adventure-campsite/Dawki Campsite 6.jpeg',
]);

// ==================== PROPERTIES ====================
export const PROPERTIES: Record<string, Property> = {
  'xtsy-luxury': {
    id: 'xtsy-luxury',
    slug: 'xtsy-luxury',
    name: 'Experience by XTSY',
    shortName: 'Experience',
    locationId: 'shillong',
    description: 'Experience unparalleled luxury with our signature 270° Panorama Glass Suite offering breathtaking mountain views.',
    heroImage: xtsyStargazing,
    images: [
      xtsyStargazing,
      xtsyAerial,
      xtsyMilkyway,
      xtsyMilkyway2,
      xtsyInterior,
    ],
    // Note: New local images (stargazing, aerial, milkyway, interior) used on /xtsy-270 page
    amenities: ['270° Mountain Views', 'Premium Breakfast', 'Luxury Ensuite', 'Air Conditioning', '4K QLED TV'],
    priceRange: { min: 4999, max: 4999 },
    rating: 4.9,
    reviewCount: 86,
    category: 'luxury',
    roomTypeIds: ['xtsy-270'],
    isActive: true,
  },
  'xtsy-travellers-hostel': {
    id: 'xtsy-travellers-hostel',
    slug: 'xtsy-travellers-hostel',
    name: 'XTSY Travellers Hostel',
    shortName: 'Hostel',
    locationId: 'shillong',
    description: 'The biggest hostel in Shillong with premium dormitories and private rooms for backpackers and travelers.',
    heroImage: hostelHero,
    images: cdnMany(PROPERTY_IMAGE_KEYS),
    amenities: ['Free WiFi', 'Common Area', 'Games Room', 'Hot Water', 'Lockers'],
    priceRange: { min: 269, max: 2099 },
    rating: 4.7,
    reviewCount: 161,
    category: 'hostel',
    roomTypeIds: [
      'king-double-room',
      '4-bed-female-only-dorm',
      '4-bed-mixed-female-dorm',
      '6-bed-mixed-female-dorm',
      '6-bed-mixed-dorm',
      '8-bed-mixed-dorm',
    ],
    isActive: true,
  },
  'xtsy-adventure-campsite-dawki': {
    id: 'xtsy-adventure-campsite-dawki',
    slug: 'xtsy-adventure-campsite-dawki',
    name: 'XTSY Adventure Campsite',
    shortName: 'Campsite',
    locationId: 'dawki',
    description: 'Riverside camping in Dawki on the crystal-clear Umngot — bonfires, kayaking and starlit skies for 80+ guests.',
    // Hero = suspension-bridge photo (Dawki Campsite 4) per brand reference.
    heroImage: cdn('xtsy-adventure-campsite/Dawki Campsite 4.jpeg'),
    images: DAWKI_CAMPING_IMAGES.slice(0, 8),
    amenities: ['Riverside Pitches', 'Shared Washrooms', 'Bonfire (chargeable)', 'Water Activities (chargeable)', 'Dinner On Request'],
    priceRange: { min: 800, max: 1000 },
    rating: 4.8,
    reviewCount: 24,
    category: 'budget',
    roomTypeIds: [], // experience-based; no room cards
    isActive: true,
  },
};

// ==================== HELPER FUNCTIONS ====================

export const getLocationById = (id: string): Location | undefined => LOCATIONS[id];

export const getActiveLocations = (): Location[] => 
  Object.values(LOCATIONS).filter(loc => loc.isActive);

export const getPropertyById = (id: string): Property | undefined => PROPERTIES[id];

export const getPropertyBySlug = (slug: string): Property | undefined => 
  Object.values(PROPERTIES).find(p => p.slug === slug);

export const getPropertiesByLocation = (locationId: string): Property[] => 
  Object.values(PROPERTIES).filter(p => p.locationId === locationId && p.isActive);

export const getAllActiveProperties = (): Property[] => 
  Object.values(PROPERTIES).filter(p => p.isActive);

// Get location options for dropdown
export const getLocationOptions = () => 
  Object.values(LOCATIONS)
    .filter(loc => loc.isActive)
    .map(loc => ({
      value: loc.id,
      label: loc.name,
      sublabel: `${loc.state}, ${loc.country}`,
    }));
