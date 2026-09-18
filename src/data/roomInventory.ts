/**
 * UNIFIED ROOM INVENTORY
 * Single source of truth for all room types across the application
 * Used by: RoomsSection, BookingFlow, Admin Dashboard, Inventory Manager
 */

import { generateStandardizedFeatures } from '@/utils/roomFeatures';
import { TAG_LABELS, TAG_COLORS, ROOM_IMAGES, type RoomTag } from '@/config/roomTypes';

export type RoomCategory = 'luxury' | 'hostel';
export type RoomKind = 'private' | 'dorm';
export type RoomStatus = 'available' | 'limited' | 'sold_out' | 'maintenance';

/**
 * Seasonal Pricing — auto-switches on May 1, 2026
 * April = current lower prices (with hype messaging)
 * May+ = new higher prices
 */
const MAY_PRICING_START = new Date('2026-05-01T00:00:00+05:30');

export function isMayPricingActive(): boolean {
  return new Date() >= MAY_PRICING_START;
}

interface SeasonalPrice {
  april: number;
  may: number;
  originalApril: number;
  originalMay: number;
}

const SEASONAL_PRICES: Record<string, SeasonalPrice> = {
  'xtsy-270':              { april: 5399, may: 5399, originalApril: 11999, originalMay: 11999 },
  'king-double-room':      { april: 2200, may: 2200, originalApril: 3499,  originalMay: 3499 },
  '4-bed-female-only-dorm':{ april: 599,  may: 599,  originalApril: 679,   originalMay: 679 },
  '6-bed-mixed-female-dorm':{ april: 389, may: 389,  originalApril: 599,   originalMay: 599 },
  '6-bed-mixed-dorm':      { april: 499, may: 499,  originalApril: 699,   originalMay: 699 },
  '8-bed-mixed-dorm':      { april: 399, may: 399,  originalApril: 550,   originalMay: 550 },
};

function getSeasonalPrice(roomId: string): { discounted: number; original: number } {
  const prices = SEASONAL_PRICES[roomId];
  if (!prices) return { discounted: 0, original: 0 };
  const isMay = isMayPricingActive();
  return {
    discounted: isMay ? prices.may : prices.april,
    original: isMay ? prices.originalMay : prices.originalApril,
  };
}

/**
 * Get April price-hike urgency message (returns null after May 1)
 */
export function getPriceHikeMessage(roomId: string): string | null {
  if (isMayPricingActive()) return null;
  const prices = SEASONAL_PRICES[roomId];
  if (!prices || prices.may <= prices.april) return null;
  const increase = prices.may - prices.april;
  return `Price increases by ₹${increase} from May 1`;
}

/**
 * Simulate traffic level — uses hour-of-day as proxy
 * Peak hours (10-14, 19-22) = high traffic → show tighter scarcity
 * Off-peak = low traffic → slightly more availability shown
 */
function isHighTraffic(): boolean {
  const hour = new Date().getHours();
  return (hour >= 10 && hour <= 14) || (hour >= 19 && hour <= 22);
}

/**
 * Get realistic simulated availability for a room
 * High traffic: always under 3 (1-2)
 * Low traffic: always under 6 (1-5)
 * XTSY 270: always exactly 1
 */
export function getSimulatedAvailability(roomId: string): number {
  const room = ROOM_INVENTORY[roomId];
  if (!room) return 0;
  if (room.totalUnits === 1) return 1; // XTSY 270 — always 1
  if (room.kind === 'private') return 1; // Private rooms (King Double) — always show 1 left

  const hour = new Date().getHours();
  const seed = (roomId.charCodeAt(0) + hour) % 7;
  const highTraffic = isHighTraffic();

  if (highTraffic) {
    return 1 + (seed % 2); // 1-2
  }
  return 1 + (seed % 5); // 1-5
}

export interface RoomType {
  id: string;
  name: string;
  shortName: string;
  category: RoomCategory;
  kind: RoomKind;
  basePrice: number;
  weekdayPrice: number;
  weekendPrice: number;
  discountedPrice: number; // Current price with any active discounts
  originalPrice: number;
  capacity: number;
  totalUnits: number;
  description: string;
  features: string[];
  image: string;
  images: string[];
  isBookable: boolean; // false for OTA-only rooms
  propertyType: string;
  displayOrder: number; // Order for display (lower = first)
  tags?: RoomTag[]; // Marketing tags
}

// Re-export tag utilities
export { TAG_LABELS, TAG_COLORS };
export type { RoomTag };

// Room gallery images are resolved via ROOM_IMAGES (Lovable CDN) in src/config/roomTypes.ts

/**
 * Complete room inventory - XTSY Travellers Hostel
 * Updated prices and room order as specified
 * 
 * Order: King Double (top) → 4-Bed Female → 4-Bed Mixed → 6-Bed Female → 6-Bed Mixed → 8-Bed Mixed
 */
export const ROOM_INVENTORY: Record<string, RoomType> = {
  // === LUXURY CATEGORY ===
  'xtsy-270': {
    id: 'xtsy-270',
    name: 'XTSY 270° Panorama Glass Ensuite',
    shortName: '270° Glass Suite',
    category: 'luxury',
    kind: 'private',
    basePrice: getSeasonalPrice('xtsy-270').discounted,
    weekdayPrice: getSeasonalPrice('xtsy-270').discounted,
    weekendPrice: getSeasonalPrice('xtsy-270').discounted,
    discountedPrice: getSeasonalPrice('xtsy-270').discounted,
    originalPrice: getSeasonalPrice('xtsy-270').original,
    capacity: 2,
    totalUnits: 1,
    description: "India's pioneering 270° panoramic glass house offering unparalleled luxury and breathtaking mountain vistas.",
    features: [
      'Stay Only',
      '270° Panoramic Glass Walls',
      'Luxury Ensuite Washroom',
      'Premium Mountain Views',
      'High-Speed Wi-Fi',
      'Air Conditioning',
      '4K QLED Television',
      'Netflix & Chill',
      'Instagram Moments',
    ],
    image: ROOM_IMAGES['xtsy-270'][0],
    images: ROOM_IMAGES['xtsy-270'],
    isBookable: true,
    propertyType: 'Experience by XTSY',
    displayOrder: 1,
    tags: ['luxury_couple'],
  },

  // === HOSTEL CATEGORY (XTSY Travellers Hostel) ===
  
  // King Double Room - Preferred by Couple
  'king-double-room': {
    id: 'king-double-room',
    name: 'King Double Room',
    shortName: 'King Double',
    category: 'hostel',
    kind: 'private',
    basePrice: getSeasonalPrice('king-double-room').discounted,
    weekdayPrice: getSeasonalPrice('king-double-room').discounted,
    weekendPrice: getSeasonalPrice('king-double-room').discounted,
    discountedPrice: getSeasonalPrice('king-double-room').discounted,
    originalPrice: getSeasonalPrice('king-double-room').original,
    capacity: 2,
    totalUnits: 3,
    description: 'Spacious private room with king bed for two guests',
    features: generateStandardizedFeatures('hostel', 'King Double Room', 'private'),
    image: ROOM_IMAGES['king-double-room'][0],
    images: ROOM_IMAGES['king-double-room'],
    isBookable: true,
    propertyType: 'XTSY Travellers Hostel',
    displayOrder: 10,
    tags: ['preferred_by_couple'],
  },

  // 4-Bed Female Dorm (Preferred by Female)
  '4-bed-female-only-dorm': {
    id: '4-bed-female-only-dorm',
    name: 'Bed in 4-Bed Female Dormitory',
    shortName: '4-Bed Female Dorm',
    category: 'hostel',
    kind: 'dorm',
    basePrice: getSeasonalPrice('4-bed-female-only-dorm').discounted,
    weekdayPrice: getSeasonalPrice('4-bed-female-only-dorm').discounted,
    weekendPrice: getSeasonalPrice('4-bed-female-only-dorm').discounted,
    discountedPrice: getSeasonalPrice('4-bed-female-only-dorm').discounted,
    originalPrice: getSeasonalPrice('4-bed-female-only-dorm').original,
    capacity: 4,
    totalUnits: 4,
    description: 'Female-only dormitory with modern amenities and comfortable beds',
    features: generateStandardizedFeatures('hostel', 'Bed in 4-Bed Female Dormitory', 'dorm'),
    image: ROOM_IMAGES['4-bed-female-only-dorm'][0],
    images: ROOM_IMAGES['4-bed-female-only-dorm'],
    isBookable: true,
    propertyType: 'XTSY Travellers Hostel',
    displayOrder: 20,
    tags: ['preferred_by_female'],
  },

  // 6-Bed Female Dorm (SOLD OUT - Closed)
  '6-bed-mixed-female-dorm': {
    id: '6-bed-mixed-female-dorm',
    name: 'Bed in 6-Bed Female Dormitory',
    shortName: '6-Bed Female Dorm',
    category: 'hostel',
    kind: 'dorm',
    basePrice: getSeasonalPrice('6-bed-mixed-female-dorm').discounted,
    weekdayPrice: getSeasonalPrice('6-bed-mixed-female-dorm').discounted,
    weekendPrice: getSeasonalPrice('6-bed-mixed-female-dorm').discounted,
    discountedPrice: getSeasonalPrice('6-bed-mixed-female-dorm').discounted,
    originalPrice: getSeasonalPrice('6-bed-mixed-female-dorm').original,
    capacity: 6,
    totalUnits: 6,
    description: 'Spacious female dormitory with modern amenities',
    features: generateStandardizedFeatures('hostel', 'Bed in 6-Bed Female Dormitory', 'dorm'),
    image: ROOM_IMAGES['6-bed-mixed-female-dorm'][0],
    images: ROOM_IMAGES['6-bed-mixed-female-dorm'],
    isBookable: false,
    propertyType: 'XTSY Travellers Hostel',
    displayOrder: 40,
    tags: ['sold_out'],
  },

  // 6-Bed Mixed Dorm (Recommended)
  '6-bed-mixed-dorm': {
    id: '6-bed-mixed-dorm',
    name: 'Bed in 6-Bed Mixed Dormitory',
    shortName: '6-Bed Mixed Dorm',
    category: 'hostel',
    kind: 'dorm',
    basePrice: getSeasonalPrice('6-bed-mixed-dorm').discounted,
    weekdayPrice: getSeasonalPrice('6-bed-mixed-dorm').discounted,
    weekendPrice: getSeasonalPrice('6-bed-mixed-dorm').discounted,
    discountedPrice: getSeasonalPrice('6-bed-mixed-dorm').discounted,
    originalPrice: getSeasonalPrice('6-bed-mixed-dorm').original,
    capacity: 6,
    totalUnits: 18,
    description: 'Budget-friendly mixed dormitory with essential amenities',
    features: generateStandardizedFeatures('hostel', 'Bed in 6-Bed Mixed Dormitory', 'dorm'),
    image: ROOM_IMAGES['6-bed-mixed-dorm'][0],
    images: ROOM_IMAGES['6-bed-mixed-dorm'],
    isBookable: true,
    propertyType: 'XTSY Travellers Hostel',
    displayOrder: 50,
    tags: ['recommended'],
  },

  // 8-Bed Mixed Dorm (Bestseller)
  '8-bed-mixed-dorm': {
    id: '8-bed-mixed-dorm',
    name: 'Bed in 8-Bed Mixed Dormitory',
    shortName: '8-Bed Mixed Dorm',
    category: 'hostel',
    kind: 'dorm',
    basePrice: getSeasonalPrice('8-bed-mixed-dorm').discounted,
    weekdayPrice: getSeasonalPrice('8-bed-mixed-dorm').discounted,
    weekendPrice: getSeasonalPrice('8-bed-mixed-dorm').discounted,
    discountedPrice: getSeasonalPrice('8-bed-mixed-dorm').discounted,
    originalPrice: getSeasonalPrice('8-bed-mixed-dorm').original,
    capacity: 8,
    totalUnits: 24,
    description: 'Best value mixed dormitory for budget-conscious backpackers',
    features: generateStandardizedFeatures('hostel', 'Bed in 8-Bed Mixed Dormitory', 'dorm'),
    image: ROOM_IMAGES['8-bed-mixed-dorm'][0],
    images: ROOM_IMAGES['8-bed-mixed-dorm'],
    isBookable: true,
    propertyType: 'XTSY Travellers Hostel',
    displayOrder: 60,
    tags: ['bestseller'],
  },

};

// Helper functions for filtering
export const getRoomsByCategory = (category: RoomCategory): RoomType[] => {
  return Object.values(ROOM_INVENTORY)
    .filter(room => room.category === category)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

export const getRoomsByProperty = (propertyType: string): RoomType[] => {
  return Object.values(ROOM_INVENTORY)
    .filter(room => room.propertyType === propertyType)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

export const getBookableRooms = (): RoomType[] => {
  return Object.values(ROOM_INVENTORY)
    .filter(room => room.isBookable)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

export const getBookableRoomsByProperty = (propertyType: string): RoomType[] => {
  return Object.values(ROOM_INVENTORY)
    .filter(room => room.isBookable && room.propertyType === propertyType)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

export const getAllRooms = (): RoomType[] => {
  return Object.values(ROOM_INVENTORY)
    .sort((a, b) => a.displayOrder - b.displayOrder);
};

export const getRoomById = (id: string): RoomType | undefined => {
  return ROOM_INVENTORY[id];
};

// Status color mapping for admin UI
export const STATUS_COLORS: Record<RoomStatus, { bg: string; text: string; border: string }> = {
  available: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
  limited: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
  sold_out: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30' },
  maintenance: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted' },
};

// Category display names
export const CATEGORY_LABELS: Record<RoomCategory, string> = {
  luxury: 'Experience by XTSY',
  hostel: 'XTSY Travellers Hostel',
};
