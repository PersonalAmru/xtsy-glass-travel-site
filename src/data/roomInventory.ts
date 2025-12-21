/**
 * UNIFIED ROOM INVENTORY
 * Single source of truth for all room types across the application
 * Used by: RoomsSection, BookingFlow, Admin Dashboard, Inventory Manager
 */

import { generateStandardizedFeatures } from '@/utils/roomFeatures';

export type RoomCategory = 'luxury' | 'hostel' | 'economy';
export type RoomKind = 'private' | 'dorm';
export type RoomStatus = 'available' | 'limited' | 'sold_out' | 'maintenance';

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
}

// Winter discount configuration
const WINTER_DISCOUNT = 0.10; // 10% off

const applyDiscount = (price: number): number => Math.round(price * (1 - WINTER_DISCOUNT));

// Base storage URL for Supabase gallery assets
const STORAGE_BASE = 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets';

/**
 * Complete room inventory - all 9 room types
 */
export const ROOM_INVENTORY: Record<string, RoomType> = {
  // === LUXURY CATEGORY ===
  'xtsy-270': {
    id: 'xtsy-270',
    name: 'XTSY 270° Panorama Glass Ensuite',
    shortName: '270° Glass Suite',
    category: 'luxury',
    kind: 'private',
    basePrice: 8500,
    weekdayPrice: 8500,
    weekendPrice: 11500,
    discountedPrice: applyDiscount(8500),
    originalPrice: 8500,
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
    image: `${STORAGE_BASE}/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140811.png`,
    images: [
      `${STORAGE_BASE}/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140811.png`,
      `${STORAGE_BASE}/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140029.png`,
    ],
    isBookable: true,
    propertyType: 'XTSY Luxury',
  },

  // === HOSTEL CATEGORY ===
  '4-bed-female-only-dorm': {
    id: '4-bed-female-only-dorm',
    name: 'Bed in 4-Bed Female Dormitory',
    shortName: '4-Bed Female Dorm',
    category: 'hostel',
    kind: 'dorm',
    basePrice: 850,
    weekdayPrice: 850,
    weekendPrice: 850,
    discountedPrice: applyDiscount(850),
    originalPrice: 850,
    capacity: 4,
    totalUnits: 1,
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
  },

  '4-bed-mixed-dorm': {
    id: '4-bed-mixed-dorm',
    name: 'Bed in 4-Bed Mixed Dormitory',
    shortName: '4-Bed Mixed Dorm',
    category: 'hostel',
    kind: 'dorm',
    basePrice: 800,
    weekdayPrice: 800,
    weekendPrice: 800,
    discountedPrice: applyDiscount(800),
    originalPrice: 800,
    capacity: 4,
    totalUnits: 1,
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
  },

  '6-bed-female-dorm': {
    id: '6-bed-female-dorm',
    name: 'Bed in 6-Bed Female Dormitory',
    shortName: '6-Bed Female Dorm',
    category: 'hostel',
    kind: 'dorm',
    basePrice: 750,
    weekdayPrice: 750,
    weekendPrice: 750,
    discountedPrice: applyDiscount(750),
    originalPrice: 750,
    capacity: 6,
    totalUnits: 5,
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
    isBookable: true,
    propertyType: 'XTSY Travellers Hostel',
  },

  '6-bed-mixed-dorm': {
    id: '6-bed-mixed-dorm',
    name: 'Bed in 6-Bed Mixed Dormitory',
    shortName: '6-Bed Mixed Dorm',
    category: 'hostel',
    kind: 'dorm',
    basePrice: 700,
    weekdayPrice: 700,
    weekendPrice: 700,
    discountedPrice: applyDiscount(700),
    originalPrice: 700,
    capacity: 6,
    totalUnits: 6,
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
  },

  'king-double-room': {
    id: 'king-double-room',
    name: 'King Double Room',
    shortName: 'King Double',
    category: 'hostel',
    kind: 'private',
    basePrice: 2800,
    weekdayPrice: 2800,
    weekendPrice: 2800,
    discountedPrice: applyDiscount(2800),
    originalPrice: 2800,
    capacity: 2,
    totalUnits: 2,
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
  },

  'king-triple-room': {
    id: 'king-triple-room',
    name: 'King Triple Room',
    shortName: 'King Triple',
    category: 'hostel',
    kind: 'private',
    basePrice: 3500,
    weekdayPrice: 3500,
    weekendPrice: 3500,
    discountedPrice: applyDiscount(3500),
    originalPrice: 3500,
    capacity: 3,
    totalUnits: 1,
    description: 'Luxurious private room accommodating up to three guests',
    features: generateStandardizedFeatures('hostel', 'King Triple Room', 'private'),
    image: `${STORAGE_BASE}/King%20Triple%20Room/1.jpg`,
    images: [
      `${STORAGE_BASE}/King%20Triple%20Room/1.jpg`,
      `${STORAGE_BASE}/King%20Triple%20Room/2.jpg`,
      `${STORAGE_BASE}/King%20Triple%20Room/3.jpg`,
      `${STORAGE_BASE}/King%20Triple%20Room/5.jpg`,
      `${STORAGE_BASE}/King%20Double%20Room/IMG_4077.jpg`,
    ],
    isBookable: true,
    propertyType: 'XTSY Travellers Hostel',
  },

  // === ECONOMY CATEGORY (OTA-only) ===
  '6-bed-economy-female-dorm': {
    id: '6-bed-economy-female-dorm',
    name: 'Bed in 6-Bed Female Dormitory',
    shortName: '6-Bed Economy Female',
    category: 'economy',
    kind: 'dorm',
    basePrice: 0,
    weekdayPrice: 0,
    weekendPrice: 0,
    discountedPrice: 0,
    originalPrice: 0,
    capacity: 6,
    totalUnits: 6,
    description: 'Budget-friendly female dormitory with essential amenities',
    features: generateStandardizedFeatures('economy', 'Bed in 6-Bed Female Dormitory', 'dorm'),
    image: `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/1.JPG`,
    images: [
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/1.JPG`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/3.jpg`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/4.jpg`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/5.JPG`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/6.JPG`,
      `${STORAGE_BASE}/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png`,
    ],
    isBookable: false, // OTA only
    propertyType: 'XTSY Economy',
  },

  '8-bed-mixed-economy-dorm': {
    id: '8-bed-mixed-economy-dorm',
    name: 'Bed in 8-Bed Mixed Dormitory',
    shortName: '8-Bed Economy Mixed',
    category: 'economy',
    kind: 'dorm',
    basePrice: 0,
    weekdayPrice: 0,
    weekendPrice: 0,
    discountedPrice: 0,
    originalPrice: 0,
    capacity: 8,
    totalUnits: 8,
    description: 'Most economical option for backpackers and budget travelers',
    features: generateStandardizedFeatures('economy', 'Bed in 8-Bed Mixed Dormitory', 'dorm'),
    image: `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/3.jpg`,
    images: [
      `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/3.jpg`,
      `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/4.jpg`,
      `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/5.jpg`,
      `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/6.jpg`,
      `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/8.jpg`,
      `${STORAGE_BASE}/8%20Bed%20Mixed%20Dorms/9.jpg`,
    ],
    isBookable: false, // OTA only
    propertyType: 'XTSY Economy',
  },
};

// Helper functions for filtering
export const getRoomsByCategory = (category: RoomCategory): RoomType[] => {
  return Object.values(ROOM_INVENTORY).filter(room => room.category === category);
};

export const getBookableRooms = (): RoomType[] => {
  return Object.values(ROOM_INVENTORY).filter(room => room.isBookable);
};

export const getAllRooms = (): RoomType[] => {
  return Object.values(ROOM_INVENTORY);
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
  luxury: 'XTSY Luxury',
  hostel: 'XTSY Travellers Hostel',
  economy: 'XTSY Economy',
};
