/**
 * SINGLE SOURCE OF TRUTH FOR ROOM TYPES
 * 
 * All XTSY room types with unique IDs that match the database.
 * Used across: booking flow, admin dashboard, inventory management, calendar blocking
 */

export type RoomCategory = 'luxury' | 'hostel';
export type UnitType = 'bed' | 'room';

// Room tags for marketing and segmentation
export type RoomTag = 
  | 'couple_favourite' 
  | 'solo_traveller' 
  | 'preferred_by_group' 
  | 'preferred_by_families'
  | 'best_value'
  | 'most_popular'
  | 'bestseller'
  | 'recommended'
  | 'preferred_by_female'
  | 'preferred_by_couple'
  | 'luxury_couple'
  | 'sold_out';

export interface RoomTypeConfig {
  id: string;                    // Unique database ID - used for all DB operations
  name: string;                  // Display name (what guests see)
  shortName: string;             // Short name for admin UI
  category: RoomCategory;        // Property category
  unitType: UnitType;            // 'bed' for dorms, 'room' for private
  capacity: number;              // Number of beds/guests
  totalUnits: number;            // Total inventory available
  propertyType: string;          // Experience by XTSY, XTSY Travellers Hostel, XTSY Economy
  isBookable: boolean;           // false for OTA-only rooms
  basePrice: number;             // Base price per night in INR
  image?: string;                // Primary room image URL
  images?: string[];             // Gallery images for room
  displayOrder: number;          // Order for display (lower = first)
  tags?: RoomTag[];              // Marketing tags
}

/**
 * All XTSY Room Types
 * 
 * IDs match exactly with the room_types table in Supabase:
 * - xtsy-270
 * - 4-bed-female-only-dorm
 * - 4-bed-mixed-female-dorm
 * - 6-bed-mixed-female-dorm
 * - 6-bed-mixed-dorm
 * - king-double-room
 * - 8-bed-mixed-dorm (NEW - XTSY Travellers Hostel)
 * - 6-bed-mixed-economy-dorm
 * - 8-bed-mixed-economy-dorm
 */
 // Room images — uploaded to storage, rehosted on the Lovable CDN.
// Resolved by "bucket/Filename" key via the CDN image map.
import { cdnMany } from '@/data/cdnImages';

export const ROOM_IMAGES: Record<string, string[]> = {
  'xtsy-270': cdnMany([
    'xtsy-270/XTSY270.JPG',
    'xtsy-270/XTSY270 2.JPG',
    'xtsy-270/XTSY270 3.JPG',
    'xtsy-270/XTSY270 4.JPG',
    'xtsy-270/XTSY270 5.JPG',
    'xtsy-270/XTSY270 6.JPG',
    'xtsy-270/XTSY270 7.JPG',
  ]),
  '4-bed-female-only-dorm': cdnMany([
    'xtsy/4 Bed Female Dormitory.jpg',
    'xtsy/4 Bed Female Dormitory 2.jpg',
    'xtsy/4 Bed Female Dormitory 3.jpg',
    'xtsy/4 Bed Female Dormitory 4.JPG',
    'xtsy/4 Bed Female Dormitory 5.JPG',
    'xtsy/4 Bed Female Dormitory 6.JPG',
    'xtsy/4 Bed Female Dormitory 7.JPG',
    'xtsy/4 Bed Female Dormitory 8.jpg',
  ]),
  '4-bed-mixed-female-dorm': cdnMany([
    'xtsy/4 Bed Mixed Dormitory 1.JPG',
    'xtsy/4 Bed Mixed Dormitory 2.JPG',
    'xtsy/4 Bed Mixed Dormitory 3.jpg',
    'xtsy/4 Bed Mixed Dormitory 4.JPG',
    'xtsy/4 Bed Mixed Dormitory 5.jpg',
    'xtsy/4 Bed Mixed Dormitory 7.jpg',
  ]),
  '6-bed-mixed-female-dorm': cdnMany([
    'xtsy/6 Bed Mixed Dormitory 1.JPG',
    'xtsy/6 Bed Mixed Dormitory 2.JPG',
    'xtsy/6 Bed Mixed Dormitory 3.jpg',
    'xtsy/6 Bed Mixed Dormitory 4.jpg',
    'xtsy/6 Bed Mixed Dormitory 5.JPG',
    'xtsy/6 Bed Mixed Dormitory 6.JPG',
  ]),
  '6-bed-mixed-dorm': cdnMany([
    'xtsy/6 Bed Mixed Dormitory 7.jpg',
    'xtsy/6 Bed Mixed Dormitory 8.jpg',
    'xtsy/6 Bed Mixed Dormitory 9.jpg',
    'xtsy/6 Bed Mixed Dormitory 1.JPG',
    'xtsy/6 Bed Mixed Dormitory 2.JPG',
    'xtsy/6 Bed Mixed Dormitory 3.jpg',
  ]),
  'king-double-room': cdnMany([
    'xtsy/King Double Room.jpg',
    'xtsy/King Double Room 2.jpg',
    'xtsy/King Double Room 3.JPG',
    'xtsy/King Double Room 4.jpg',
  ]),
  // No dedicated 8-bed photos were uploaded — reuse the 6-bed mixed dorm set.
  '8-bed-mixed-dorm': cdnMany([
    'xtsy/6 Bed Mixed Dormitory 4.jpg',
    'xtsy/6 Bed Mixed Dormitory 5.JPG',
    'xtsy/6 Bed Mixed Dormitory 6.JPG',
    'xtsy/6 Bed Mixed Dormitory 7.jpg',
    'xtsy/6 Bed Mixed Dormitory 8.jpg',
    'xtsy/6 Bed Mixed Dormitory 9.jpg',
  ]),
};

// Tag display labels
export const TAG_LABELS: Record<RoomTag, string> = {
  couple_favourite: 'Couple Favourite',
  solo_traveller: 'Solo Traveller',
  preferred_by_group: 'Preferred by Groups',
  preferred_by_families: 'Preferred by Families',
  best_value: 'Best Value',
  most_popular: 'Most Popular',
  bestseller: 'Bestseller',
  recommended: 'Recommended',
  preferred_by_female: 'Preferred by Female',
  preferred_by_couple: 'Preferred by Couple',
  luxury_couple: 'Luxury Couple',
  sold_out: 'Sold Out',
};

// Tag colors for UI
export const TAG_COLORS: Record<RoomTag, { bg: string; text: string }> = {
  couple_favourite: { bg: 'bg-rose-500/20', text: 'text-rose-400' },
  solo_traveller: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  preferred_by_group: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  preferred_by_families: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  best_value: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  most_popular: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  bestseller: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  recommended: { bg: 'bg-teal-500/20', text: 'text-teal-400' },
  preferred_by_female: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  preferred_by_couple: { bg: 'bg-rose-500/20', text: 'text-rose-400' },
  luxury_couple: { bg: 'bg-amber-600/20', text: 'text-amber-300' },
  sold_out: { bg: 'bg-red-600/20', text: 'text-red-400' },
};

export const ROOM_TYPES: Record<string, RoomTypeConfig> = {
  // === LUXURY CATEGORY ===
  'xtsy-270': {
    id: 'xtsy-270',
    name: 'XTSY 270° Panorama Glass Ensuite',
    shortName: '270° Glass Suite',
    category: 'luxury',
    unitType: 'room',
    capacity: 2,
    totalUnits: 1,
    propertyType: 'Experience by XTSY',
    isBookable: true,
    basePrice: 7489,
    displayOrder: 1,
    tags: ['luxury_couple'],
    image: ROOM_IMAGES['xtsy-270'][0],
    images: ROOM_IMAGES['xtsy-270'],
  },

  // === HOSTEL CATEGORY (XTSY Travellers Hostel) ===
  // King Double Room - First (Preferred by Couple)
  'king-double-room': {
    id: 'king-double-room',
    name: 'King Double Room',
    shortName: 'King Double',
    category: 'hostel',
    unitType: 'room',
    capacity: 2,
    totalUnits: 3,
    propertyType: 'XTSY Travellers Hostel',
    isBookable: true,
    basePrice: 2099,
    displayOrder: 10,
    tags: ['preferred_by_couple'],
    image: ROOM_IMAGES['king-double-room'][0],
    images: ROOM_IMAGES['king-double-room'],
  },

  // 4-Bed Female Dorm (Preferred by Female)
  '4-bed-female-only-dorm': {
    id: '4-bed-female-only-dorm',
    name: 'Bed in 4-Bed Female Dormitory',
    shortName: '4-Bed Female Dorm',
    category: 'hostel',
    unitType: 'bed',
    capacity: 4,
    totalUnits: 4,
    propertyType: 'XTSY Travellers Hostel',
    isBookable: true,
    basePrice: 419,
    displayOrder: 20,
    tags: ['preferred_by_female'],
    image: ROOM_IMAGES['4-bed-female-only-dorm'][0],
    images: ROOM_IMAGES['4-bed-female-only-dorm'],
  },

  // 4-Bed Mixed Dorm (Preferred by Solo Traveller)
  '4-bed-mixed-female-dorm': {
    id: '4-bed-mixed-female-dorm',
    name: 'Bed in 4-Bed Mixed Dormitory',
    shortName: '4-Bed Mixed Dorm',
    category: 'hostel',
    unitType: 'bed',
    capacity: 4,
    totalUnits: 4,
    propertyType: 'XTSY Travellers Hostel',
    isBookable: true,
    basePrice: 529,
    displayOrder: 30,
    tags: ['solo_traveller'],
    image: ROOM_IMAGES['4-bed-mixed-female-dorm'][0],
    images: ROOM_IMAGES['4-bed-mixed-female-dorm'],
  },

  // 6-Bed Female Dorm (SOLD OUT)
  '6-bed-mixed-female-dorm': {
    id: '6-bed-mixed-female-dorm',
    name: 'Bed in 6-Bed Female Dormitory',
    shortName: '6-Bed Female Dorm',
    category: 'hostel',
    unitType: 'bed',
    capacity: 6,
    totalUnits: 6,
    propertyType: 'XTSY Travellers Hostel',
    isBookable: false,
    basePrice: 369,
    displayOrder: 40,
    tags: ['sold_out'],
    image: ROOM_IMAGES['6-bed-mixed-female-dorm'][0],
    images: ROOM_IMAGES['6-bed-mixed-female-dorm'],
  },

  // 6-Bed Mixed Dorm (Recommended)
  '6-bed-mixed-dorm': {
    id: '6-bed-mixed-dorm',
    name: 'Bed in 6-Bed Mixed Dormitory',
    shortName: '6-Bed Mixed Dorm',
    category: 'hostel',
    unitType: 'bed',
    capacity: 6,
    totalUnits: 18,
    propertyType: 'XTSY Travellers Hostel',
    isBookable: true,
    basePrice: 419,
    displayOrder: 50,
    tags: ['recommended'],
    image: ROOM_IMAGES['6-bed-mixed-dorm'][0],
    images: ROOM_IMAGES['6-bed-mixed-dorm'],
  },

  // 8-Bed Mixed Dorm (Bestseller)
  '8-bed-mixed-dorm': {
    id: '8-bed-mixed-dorm',
    name: 'Bed in 8-Bed Mixed Dormitory',
    shortName: '8-Bed Mixed Dorm',
    category: 'hostel',
    unitType: 'bed',
    capacity: 8,
    totalUnits: 24,
    propertyType: 'XTSY Travellers Hostel',
    isBookable: true,
    basePrice: 269,
    displayOrder: 60,
    tags: ['bestseller'],
    image: ROOM_IMAGES['8-bed-mixed-dorm'][0],
    images: ROOM_IMAGES['8-bed-mixed-dorm'],
  },

};

// All valid room type IDs
export const ROOM_TYPE_IDS = Object.keys(ROOM_TYPES) as string[];

// Legacy name to ID mapping for database compatibility
export const ROOM_NAME_TO_ID: Record<string, string> = {
  // Handle various legacy name formats that might exist in old bookings
  'XTSY 270° Panorama Glass Ensuite': 'xtsy-270',
  '270° Panorama Glass Ensuite': 'xtsy-270',
  '270° Glass Suite': 'xtsy-270',
  'Bed in 4-Bed Female Dormitory': '4-bed-female-only-dorm',
  '4-Bed Female Dorm': '4-bed-female-only-dorm',
  '4 Bed Female Dormitory': '4-bed-female-only-dorm',
  'Bed in 4-Bed Mixed Dormitory': '4-bed-mixed-female-dorm',
  '4-Bed Mixed Dorm': '4-bed-mixed-female-dorm',
  '4 Bed Mixed Dormitory': '4-bed-mixed-female-dorm',
  'Bed in 6-Bed Female Dormitory': '6-bed-mixed-female-dorm',
  '6-Bed Female Dorm': '6-bed-mixed-female-dorm',
  '6 Bed Female Dormitory': '6-bed-mixed-female-dorm',
  'Bed in 6-Bed Female Only Dormitory': '6-bed-mixed-female-dorm',
  '6-bed-female-dorm': '6-bed-mixed-female-dorm', // Legacy ID
  'Bed in 6-Bed Mixed Dormitory': '6-bed-mixed-dorm',
  '6-Bed Mixed Dorm': '6-bed-mixed-dorm',
  '6 Bed Mixed Dormitory': '6-bed-mixed-dorm',
  'King Double Room': 'king-double-room',
  'King Double': 'king-double-room',
  'Bed in 8-Bed Mixed Dormitory': '8-bed-mixed-dorm',
  '8-Bed Mixed Dorm': '8-bed-mixed-dorm',
  '8 Bed Mixed Dormitory': '8-bed-mixed-dorm',
};

/**
 * Resolve any room type identifier (ID or name) to the canonical room type ID
 */
export function resolveRoomTypeId(roomTypeIdOrName: string): string {
  // Direct match
  if (ROOM_TYPES[roomTypeIdOrName]) {
    return roomTypeIdOrName;
  }

  // Try name mapping
  const mappedId = ROOM_NAME_TO_ID[roomTypeIdOrName];
  if (mappedId) {
    return mappedId;
  }

  // Fuzzy match by checking if it's a known room name
  const lowerInput = roomTypeIdOrName.toLowerCase();
  for (const [id, config] of Object.entries(ROOM_TYPES)) {
    if (
      config.name.toLowerCase() === lowerInput ||
      config.shortName.toLowerCase() === lowerInput ||
      id.toLowerCase() === lowerInput
    ) {
      return id;
    }
  }

  // Return as-is if no match found (will be handled by caller)
  return roomTypeIdOrName;
}

/**
 * Get room type configuration by ID or name
 */
export function getRoomType(roomTypeIdOrName: string): RoomTypeConfig | undefined {
  const id = resolveRoomTypeId(roomTypeIdOrName);
  return ROOM_TYPES[id];
}

/**
 * Get all room types for a category, sorted by displayOrder
 */
export function getRoomTypesByCategory(category: RoomCategory): RoomTypeConfig[] {
  return Object.values(ROOM_TYPES)
    .filter(r => r.category === category)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Get all room types for a property, sorted by displayOrder
 */
export function getRoomTypesByProperty(propertyType: string): RoomTypeConfig[] {
  return Object.values(ROOM_TYPES)
    .filter(r => r.propertyType === propertyType)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Get all bookable room types, sorted by displayOrder
 */
export function getBookableRoomTypes(): RoomTypeConfig[] {
  return Object.values(ROOM_TYPES)
    .filter(r => r.isBookable)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Get bookable room types for a specific property
 */
export function getBookableRoomTypesByProperty(propertyType: string): RoomTypeConfig[] {
  return Object.values(ROOM_TYPES)
    .filter(r => r.isBookable && r.propertyType === propertyType)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Check if room type is a dormitory (bed-based)
 */
export function isDormitory(roomTypeIdOrName: string): boolean {
  const config = getRoomType(roomTypeIdOrName);
  return config?.unitType === 'bed';
}

/**
 * Get availability label (e.g., "3 beds available" or "1 room available")
 */
export function getAvailabilityLabel(roomTypeIdOrName: string, available: number): string {
  const config = getRoomType(roomTypeIdOrName);
  const unit = config?.unitType === 'bed' ? 'bed' : 'room';
  const plural = available === 1 ? unit : `${unit}s`;
  return `${available} ${plural} available`;
}

/**
 * Property type labels for display
 */
export const PROPERTY_LABELS: Record<RoomCategory, string> = {
  luxury: 'Experience by XTSY',
  hostel: 'XTSY Travellers Hostel',
};
