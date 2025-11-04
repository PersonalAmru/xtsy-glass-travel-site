// Centralized room capacity and terminology utility
// This ensures consistent capacity calculations across booking flow, admin dashboard, and edge functions

export interface RoomTypeInfo {
  capacity: number;
  unit: 'bed' | 'room';
  label: string;
}

// Room type mapping based on the booking flow data
export const ROOM_TYPE_INFO: Record<string, RoomTypeInfo> = {
  // Economy dorms
  '8-bed-mixed-economy-dorm': { capacity: 8, unit: 'bed', label: 'Bed in 8-Bed Mixed Economy Dorm' },
  '6-bed-mixed-economy-dorm': { capacity: 6, unit: 'bed', label: 'Bed in 6-Bed Female Dormitory' },
  
  // Hostel dorms
  '4-bed-female-only-dorm': { capacity: 4, unit: 'bed', label: 'Bed in 4-Bed Female Only Dormitory' },
  '4-bed-mixed-female-dorm': { capacity: 4, unit: 'bed', label: 'Bed in 4-Bed Mixed Dormitory' },
  '6-bed-mixed-female-dorm': { capacity: 6, unit: 'bed', label: 'Bed in 6-Bed Female Only Dormitory' },
  '6-bed-mixed-dorm': { capacity: 6, unit: 'bed', label: 'Bed in 6-Bed Mixed Dormitory' },
  
  // Private rooms
  'king-double-room': { capacity: 2, unit: 'room', label: 'King Double Room' },
  'king-triple-room': { capacity: 1, unit: 'room', label: 'King Triple Room' },
  'xtsy-270': { capacity: 1, unit: 'room', label: '270° Panorama Glass Ensuite' },
};

// Alternative names mapping for database compatibility
export const ROOM_NAME_MAPPING: Record<string, string> = {
  // Database names -> Frontend IDs
  'Bed in 8-Bed Mixed Economy Dorm': '8-bed-mixed-economy-dorm',
  '8 Bed Mixed Economy Dorm': '8-bed-mixed-economy-dorm',
  'Bed in 6-Bed Female Dormitory': '6-bed-mixed-economy-dorm',
  'Bed in 6-Bed Mixed Economy Dorm': '6-bed-mixed-economy-dorm',
  '6 Bed Mixed Economy Dorm': '6-bed-mixed-economy-dorm',
  '6 Bed Female Dormitory': '6-bed-mixed-economy-dorm',
  'Bed in 4-Bed Female Only Dormitory': '4-bed-female-only-dorm',
  '4 Bed Female Only Dormitory': '4-bed-female-only-dorm',
  'Bed in 4-Bed Mixed Dormitory': '4-bed-mixed-female-dorm',
  '4 Bed Mixed Dormitory': '4-bed-mixed-female-dorm',
  'Bed in 6-Bed Female Only Dormitory': '6-bed-mixed-female-dorm',
  '6 Bed Female Only Dormitory': '6-bed-mixed-female-dorm',
  'Bed in 6-Bed Mixed Dormitory': '6-bed-mixed-dorm',
  '6 Bed Mixed Dormitory': '6-bed-mixed-dorm',
  'King Double Room': 'king-double-room',
  'King Triple Room': 'king-triple-room',
  '270° Panorama Glass Ensuite': 'xtsy-270',
};

/**
 * Get room capacity information by room type ID or name
 */
export function getRoomTypeInfo(roomTypeIdOrName: string): RoomTypeInfo {
  // First try direct lookup
  if (ROOM_TYPE_INFO[roomTypeIdOrName]) {
    return ROOM_TYPE_INFO[roomTypeIdOrName];
  }
  
  // Try mapping from database name to frontend ID
  const mappedId = ROOM_NAME_MAPPING[roomTypeIdOrName];
  if (mappedId && ROOM_TYPE_INFO[mappedId]) {
    return ROOM_TYPE_INFO[mappedId];
  }
  
  // Fallback: pattern matching from room name
  const name = roomTypeIdOrName.toLowerCase();
  
  if (name.includes('8') && name.includes('bed')) {
    return { capacity: 8, unit: 'bed', label: roomTypeIdOrName };
  }
  if (name.includes('6') && name.includes('bed')) {
    return { capacity: 6, unit: 'bed', label: roomTypeIdOrName };
  }
  if (name.includes('4') && name.includes('bed')) {
    return { capacity: 4, unit: 'bed', label: roomTypeIdOrName };
  }
  if (name.includes('270') || name.includes('panorama')) {
    return { capacity: 1, unit: 'room', label: roomTypeIdOrName };
  }
  if (name.includes('king') || name.includes('double') || name.includes('triple')) {
    return { capacity: name.includes('double') ? 2 : 1, unit: 'room', label: roomTypeIdOrName };
  }
  
  // Ultimate fallback
  return { capacity: 1, unit: 'room', label: roomTypeIdOrName };
}

/**
 * Get room capacity number only
 */
export function getRoomCapacity(roomTypeIdOrName: string): number {
  return getRoomTypeInfo(roomTypeIdOrName).capacity;
}

/**
 * Get proper unit label for availability display
 */
export function getAvailabilityLabel(roomTypeIdOrName: string, available: number): string {
  const info = getRoomTypeInfo(roomTypeIdOrName);
  const unit = info.unit === 'bed' ? 'bed' : 'room';
  const plural = available === 1 ? unit : `${unit}s`;
  return `${available} ${plural} available`;
}

/**
 * Check if room type is a dormitory
 */
export function isDormitory(roomTypeIdOrName: string): boolean {
  return getRoomTypeInfo(roomTypeIdOrName).unit === 'bed';
}

/**
 * Get all possible keys for a room type (for database queries)
 */
export function getRoomTypeKeys(roomTypeIdOrName: string): string[] {
  const keys = [roomTypeIdOrName];
  
  // Add mapped name if exists
  const mappedId = ROOM_NAME_MAPPING[roomTypeIdOrName];
  if (mappedId && mappedId !== roomTypeIdOrName) {
    keys.push(mappedId);
  }
  
  // Add reverse mapping
  const reverseMapping = Object.entries(ROOM_NAME_MAPPING).find(([_, id]) => id === roomTypeIdOrName);
  if (reverseMapping && reverseMapping[0] !== roomTypeIdOrName) {
    keys.push(reverseMapping[0]);
  }
  
  return [...new Set(keys)]; // Remove duplicates
}