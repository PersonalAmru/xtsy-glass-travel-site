/**
 * UNIFIED ROOM INVENTORY
 * Single source of truth for all room types across the application
 * Used by: RoomsSection, BookingFlow, Admin Dashboard, Inventory Manager
 */

import { generateStandardizedFeatures } from '@/utils/roomFeatures';
import { TAG_LABELS, TAG_COLORS, type RoomTag } from '@/config/roomTypes';
import xtsyStargazing from '@/assets/xtsy-270-stargazing.jpeg';
import xtsyInterior from '@/assets/xtsy-270-interior.jpeg';

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
  'xtsy-270':              { april: 4999, may: 4999, originalApril: 11999, originalMay: 11999 },
  'king-double-room':      { april: 2099, may: 2399, originalApril: 3099,  originalMay: 3499 },
  '4-bed-female-only-dorm':{ april: 419,  may: 419,  originalApril: 679,   originalMay: 679 },
  '4-bed-mixed-female-dorm':{ april: 529, may: 569,  originalApril: 749,   originalMay: 799 },
  '6-bed-mixed-female-dorm':{ april: 369, may: 389,  originalApril: 599,   originalMay: 599 },
  '6-bed-mixed-dorm':      { april: 419,  may: 469,  originalApril: 630,   originalMay: 699 },
  '8-bed-mixed-dorm':      { april: 269,  may: 329,  originalApril: 550,   originalMay: 550 },
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
 * Get realistic simulated availability for a room
 * Uses deterministic-ish values that feel natural
 */
export function getSimulatedAvailability(roomId: string): number {
  const room = ROOM_INVENTORY[roomId];
  if (!room) return 0;
  // Use hour of day as seed for slight variation
  const hour = new Date().getHours();
  const seed = (roomId.charCodeAt(0) + hour) % 7;
  if (room.totalUnits === 1) return 1; // XTSY 270 — always 1
  if (room.totalUnits <= 4) return Math.max(1, Math.min(room.totalUnits, 1 + (seed % 3))); // 1-3
  if (room.totalUnits <= 8) return Math.max(2, Math.min(room.totalUnits, 2 + (seed % 4))); // 2-5
  // Large dorms (18, 24 beds) — show moderate scarcity
  return Math.max(3, Math.min(8, 3 + (seed % 5))); // 3-7
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

// Base storage URL for Supabase gallery assets
const STORAGE_BASE = 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets';

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
      'Premium Breakfast',
      '270° Panoramic Glass Walls',
      'Luxury Ensuite Washroom',
      'Premium Mountain Views',
      'High-Speed Wi-Fi',
      'Air Conditioning',
      '4K QLED Television',
      'Netflix & Chill',
      'Instagram Moments',
    ],
    image: xtsyStargazing,
    images: [
      xtsyStargazing,
      xtsyInterior,
    ],
    isBookable: true,
    propertyType: 'XTSY Experience',
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
    basePrice: 2099,
    weekdayPrice: 2099,
    weekendPrice: 2099,
    discountedPrice: 2099,
    originalPrice: 3099,
    capacity: 2,
    totalUnits: 3,
    description: 'Spacious private room with king bed for two guests',
    features: generateStandardizedFeatures('hostel', 'King Double Room', 'private'),
    image: `${STORAGE_BASE}/King%20Double%20Room/1.jpg`,
    images: [
      `${STORAGE_BASE}/King%20Double%20Room/1.jpg`,
      `${STORAGE_BASE}/King%20Double%20Room/2.jpg`,
      `${STORAGE_BASE}/King%20Double%20Room/3.JPG`,
      `${STORAGE_BASE}/King%20Double%20Room/IMG_4077.jpg`,
    ],
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
    basePrice: 419,
    weekdayPrice: 419,
    weekendPrice: 419,
    discountedPrice: 419,
    originalPrice: 679,
    capacity: 4,
    totalUnits: 4,
    description: 'Female-only dormitory with modern amenities and comfortable beds',
    features: generateStandardizedFeatures('hostel', 'Bed in 4-Bed Female Dormitory', 'dorm'),
    image: `${STORAGE_BASE}/4%20Bed%20Female%20Only%20Dorms/1.jpg`,
    images: [
      `${STORAGE_BASE}/4%20Bed%20Female%20Only%20Dorms/1.jpg`,
      `${STORAGE_BASE}/4%20Bed%20Female%20Only%20Dorms/2.jpg`,
      `${STORAGE_BASE}/4%20Bed%20Female%20Only%20Dorms/3.jpg`,
      `${STORAGE_BASE}/4%20Bed%20Female%20Only%20Dorms/4.JPG`,
      `${STORAGE_BASE}/4%20Bed%20Female%20Only%20Dorms/5.JPG`,
      `${STORAGE_BASE}/4%20Bed%20Female%20Only%20Dorms/6.JPG`,
      `${STORAGE_BASE}/4%20Bed%20Female%20Only%20Dorms/7.JPG`,
      `${STORAGE_BASE}/4%20Bed%20Female%20Only%20Dorms/IMG_5161.png`,
    ],
    isBookable: true,
    propertyType: 'XTSY Travellers Hostel',
    displayOrder: 20,
    tags: ['preferred_by_female'],
  },

  // 4-Bed Mixed Dorm (Solo Traveller)
  '4-bed-mixed-female-dorm': {
    id: '4-bed-mixed-female-dorm',
    name: 'Bed in 4-Bed Mixed Dormitory',
    shortName: '4-Bed Mixed Dorm',
    category: 'hostel',
    kind: 'dorm',
    basePrice: 529,
    weekdayPrice: 529,
    weekendPrice: 529,
    discountedPrice: 529,
    originalPrice: 749,
    capacity: 4,
    totalUnits: 4,
    description: 'Mixed dormitory with shared facilities and social atmosphere',
    features: generateStandardizedFeatures('hostel', 'Bed in 4-Bed Mixed Dormitory', 'dorm'),
    image: `${STORAGE_BASE}/4%20Bed%20MixedFemale%20Dorms/3.jpg`,
    images: [
      `${STORAGE_BASE}/4%20Bed%20MixedFemale%20Dorms/3.jpg`,
      `${STORAGE_BASE}/4%20Bed%20MixedFemale%20Dorms/4.JPG`,
      `${STORAGE_BASE}/4%20Bed%20MixedFemale%20Dorms/5.jpg`,
      `${STORAGE_BASE}/4%20Bed%20MixedFemale%20Dorms/IMG_5161.png`,
    ],
    isBookable: true,
    propertyType: 'XTSY Travellers Hostel',
    displayOrder: 30,
    tags: ['solo_traveller'],
  },

  // 6-Bed Female Dorm (SOLD OUT - Closed)
  '6-bed-mixed-female-dorm': {
    id: '6-bed-mixed-female-dorm',
    name: 'Bed in 6-Bed Female Dormitory',
    shortName: '6-Bed Female Dorm',
    category: 'hostel',
    kind: 'dorm',
    basePrice: 369,
    weekdayPrice: 369,
    weekendPrice: 369,
    discountedPrice: 369,
    originalPrice: 599,
    capacity: 6,
    totalUnits: 6,
    description: 'Spacious female dormitory with modern amenities',
    features: generateStandardizedFeatures('hostel', 'Bed in 6-Bed Female Dormitory', 'dorm'),
    image: `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/1.JPG`,
    images: [
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/1.JPG`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/3.jpg`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/4.jpg`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/5.JPG`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/6.JPG`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png`,
    ],
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
    basePrice: 419,
    weekdayPrice: 419,
    weekendPrice: 419,
    discountedPrice: 419,
    originalPrice: 630,
    capacity: 6,
    totalUnits: 18,
    description: 'Budget-friendly mixed dormitory with essential amenities',
    features: generateStandardizedFeatures('hostel', 'Bed in 6-Bed Mixed Dormitory', 'dorm'),
    image: `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/1.JPG`,
    images: [
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/1.JPG`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/3.jpg`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/4.jpg`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/5.JPG`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/6.JPG`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png`,
    ],
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
    basePrice: 269,
    weekdayPrice: 269,
    weekendPrice: 269,
    discountedPrice: 269,
    originalPrice: 550,
    capacity: 8,
    totalUnits: 24,
    description: 'Best value mixed dormitory for budget-conscious backpackers',
    features: generateStandardizedFeatures('hostel', 'Bed in 8-Bed Mixed Dormitory', 'dorm'),
    image: `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/3.jpg`,
    images: [
      `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/3.jpg`,
      `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/4.jpg`,
      `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/5.jpg`,
      `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/6.jpg`,
      `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/8.jpg`,
      `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/9.jpg`,
    ],
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
  luxury: 'XTSY Experience',
  hostel: 'XTSY Travellers Hostel',
};
