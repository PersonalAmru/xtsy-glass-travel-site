/**
 * PROPERTY ARCHITECTURE
 * Defines properties within locations, each with their own inventory
 */

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

// Base storage URL for Supabase gallery assets
const STORAGE_BASE = 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets';

// ==================== LOCATIONS ====================
export const LOCATIONS: Record<string, Location> = {
  'shillong': {
    id: 'shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    country: 'India',
    isActive: true,
  },
};

// ==================== PROPERTIES ====================
export const PROPERTIES: Record<string, Property> = {
  'xtsy-luxury': {
    id: 'xtsy-luxury',
    slug: 'xtsy-luxury',
    name: 'XTSY Luxury',
    shortName: 'Luxury',
    locationId: 'shillong',
    description: 'Experience unparalleled luxury with our signature 270° Panorama Glass Suite offering breathtaking mountain views.',
    heroImage: `${STORAGE_BASE}/270/IMG_9956.jpg`,
    images: [
      `${STORAGE_BASE}/270/IMG_9956.jpg`,
      `${STORAGE_BASE}/270/IMG_9955.jpg`,
      `${STORAGE_BASE}/270/IMG_9950.jpg`,
      `${STORAGE_BASE}/270/IMG_9927.jpg`,
      `${STORAGE_BASE}/270/IMG_9812.jpg`,
    ],
    amenities: ['270° Mountain Views', 'Premium Breakfast', 'Luxury Ensuite', 'Air Conditioning', '4K QLED TV'],
    priceRange: { min: 7650, max: 11500 },
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
    heroImage: `${STORAGE_BASE}/New%20Images%20property/IMG_9068.jpeg`,
    images: [
      `${STORAGE_BASE}/New%20Images%20property/IMG_9068.jpeg`,
      `${STORAGE_BASE}/New%20Images%20property/IMG_9274.jpeg`,
      `${STORAGE_BASE}/New%20Images%20property/IMG_9314.jpeg`,
      `${STORAGE_BASE}/New%20Images%20property/IMG_9318.jpeg`,
      `${STORAGE_BASE}/New%20Images%20property/IMG_9540.jpeg`,
    ],
    amenities: ['Free WiFi', 'Common Area', 'Games Room', 'Hot Water', 'Lockers'],
    priceRange: { min: 300, max: 1800 },
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
