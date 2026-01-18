/**
 * SINGLE SOURCE OF TRUTH FOR ROOM TYPES
 * 
 * All 9 XTSY room types with unique IDs that match the database.
 * Used across: booking flow, admin dashboard, inventory management, calendar blocking
 */

export type RoomCategory = 'luxury' | 'hostel' | 'economy';
export type UnitType = 'bed' | 'room';

export interface RoomTypeConfig {
  id: string;                    // Unique database ID - used for all DB operations
  name: string;                  // Display name (what guests see)
  shortName: string;             // Short name for admin UI
  category: RoomCategory;        // Property category
  unitType: UnitType;            // 'bed' for dorms, 'room' for private
  capacity: number;              // Number of beds/guests
  totalUnits: number;            // Total inventory available
  propertyType: string;          // XTSY Luxury, XTSY Travellers Hostel, XTSY Economy
  isBookable: boolean;           // false for OTA-only rooms
  basePrice: number;             // Base price per night in INR
  image?: string;                // Primary room image URL
  images?: string[];             // Gallery images for room
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
 * - king-triple-room
 * - 6-bed-mixed-economy-dorm
 * - 8-bed-mixed-economy-dorm
 */
// Room images from Supabase storage (source of truth)
export const ROOM_IMAGES: Record<string, string[]> = {
  'xtsy-270': [
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140811.png',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140029.png'
  ],
  '4-bed-female-only-dorm': [
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/2.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/3.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/4.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/5.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/6.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/7.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/IMG_5161.png'
  ],
  '4-bed-mixed-female-dorm': [
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/4.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/5.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/IMG_5161.png'
  ],
  '6-bed-mixed-female-dorm': [
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png'
  ],
  '6-bed-mixed-dorm': [
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png'
  ],
  'king-double-room': [
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/2.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/3.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg'
  ],
  'king-triple-room': [
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/2.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/3.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/5.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg'
  ],
  '6-bed-mixed-economy-dorm': [
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG'
  ],
  '8-bed-mixed-economy-dorm': [
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/4.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/5.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/6.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/8.jpg',
    'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/9.jpg'
  ],
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
    propertyType: 'XTSY Luxury',
    isBookable: true,
    basePrice: 8500, // Weekday price (weekend: 11500)
    image: ROOM_IMAGES['xtsy-270'][0],
    images: ROOM_IMAGES['xtsy-270'],
  },

  // === HOSTEL CATEGORY ===
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
    basePrice: 850, // Original price (discounted: 765)
    image: ROOM_IMAGES['4-bed-female-only-dorm'][0],
    images: ROOM_IMAGES['4-bed-female-only-dorm'],
  },

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
    basePrice: 800, // Original price (discounted: 720)
    image: ROOM_IMAGES['4-bed-mixed-female-dorm'][0],
    images: ROOM_IMAGES['4-bed-mixed-female-dorm'],
  },

  '6-bed-mixed-female-dorm': {
    id: '6-bed-mixed-female-dorm',
    name: 'Bed in 6-Bed Female Dormitory',
    shortName: '6-Bed Female Dorm',
    category: 'hostel',
    unitType: 'bed',
    capacity: 6,
    totalUnits: 6,
    propertyType: 'XTSY Travellers Hostel',
    isBookable: true,
    basePrice: 750, // Original price (discounted: 675)
    image: ROOM_IMAGES['6-bed-mixed-female-dorm'][0],
    images: ROOM_IMAGES['6-bed-mixed-female-dorm'],
  },

  '6-bed-mixed-dorm': {
    id: '6-bed-mixed-dorm',
    name: 'Bed in 6-Bed Mixed Dormitory',
    shortName: '6-Bed Mixed Dorm',
    category: 'hostel',
    unitType: 'bed',
    capacity: 6,
    totalUnits: 6,
    propertyType: 'XTSY Travellers Hostel',
    isBookable: true,
    basePrice: 700, // Original price (discounted: 630)
    image: ROOM_IMAGES['6-bed-mixed-dorm'][0],
    images: ROOM_IMAGES['6-bed-mixed-dorm'],
  },

  'king-double-room': {
    id: 'king-double-room',
    name: 'King Double Room',
    shortName: 'King Double',
    category: 'hostel',
    unitType: 'room',
    capacity: 2,
    totalUnits: 2,
    propertyType: 'XTSY Travellers Hostel',
    isBookable: true,
    basePrice: 2800, // Original price (discounted: 2520)
    image: ROOM_IMAGES['king-double-room'][0],
    images: ROOM_IMAGES['king-double-room'],
  },

  'king-triple-room': {
    id: 'king-triple-room',
    name: 'King Triple Room',
    shortName: 'King Triple',
    category: 'hostel',
    unitType: 'room',
    capacity: 3,
    totalUnits: 1,
    propertyType: 'XTSY Travellers Hostel',
    isBookable: true,
    basePrice: 3500, // Original price (discounted: 3150)
    image: ROOM_IMAGES['king-triple-room'][0],
    images: ROOM_IMAGES['king-triple-room'],
  },

  // === ECONOMY CATEGORY (OTA-only) ===
  '6-bed-mixed-economy-dorm': {
    id: '6-bed-mixed-economy-dorm',
    name: 'Bed in 6-Bed Economy Dormitory',
    shortName: '6-Bed Economy',
    category: 'economy',
    unitType: 'bed',
    capacity: 6,
    totalUnits: 6,
    propertyType: 'XTSY Economy',
    isBookable: false,
    basePrice: 399,
    image: ROOM_IMAGES['6-bed-mixed-economy-dorm'][0],
    images: ROOM_IMAGES['6-bed-mixed-economy-dorm'],
  },

  '8-bed-mixed-economy-dorm': {
    id: '8-bed-mixed-economy-dorm',
    name: 'Bed in 8-Bed Mixed Dormitory',
    shortName: '8-Bed Economy Mixed',
    category: 'economy',
    unitType: 'bed',
    capacity: 8,
    totalUnits: 8,
    propertyType: 'XTSY Economy',
    isBookable: false,
    basePrice: 349,
    image: ROOM_IMAGES['8-bed-mixed-economy-dorm'][0],
    images: ROOM_IMAGES['8-bed-mixed-economy-dorm'],
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
  'King Triple Room': 'king-triple-room',
  'King Triple': 'king-triple-room',
  'Bed in 8-Bed Mixed Dormitory': '8-bed-mixed-economy-dorm',
  '8-Bed Economy Mixed': '8-bed-mixed-economy-dorm',
  '8 Bed Mixed Dormitory': '8-bed-mixed-economy-dorm',
  'Bed in 8-Bed Mixed Economy Dorm': '8-bed-mixed-economy-dorm',
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
 * Get all room types for a category
 */
export function getRoomTypesByCategory(category: RoomCategory): RoomTypeConfig[] {
  return Object.values(ROOM_TYPES).filter(r => r.category === category);
}

/**
 * Get all bookable room types
 */
export function getBookableRoomTypes(): RoomTypeConfig[] {
  return Object.values(ROOM_TYPES).filter(r => r.isBookable);
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
  luxury: 'XTSY Luxury',
  hostel: 'XTSY Travellers Hostel',
  economy: 'XTSY Economy',
};
