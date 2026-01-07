/**
 * Room Capacity Utility
 * Re-exports from the single source of truth and provides backward compatibility
 */

import {
  ROOM_TYPES,
  ROOM_NAME_TO_ID,
  resolveRoomTypeId,
  getRoomType,
  isDormitory as isDorm,
  getAvailabilityLabel as getAvailLabel,
  type RoomTypeConfig,
} from '@/config/roomTypes';

// Re-export types
export type { RoomTypeConfig };
export { ROOM_TYPES, ROOM_NAME_TO_ID, resolveRoomTypeId, getRoomType };

// Legacy interface for backward compatibility
export interface RoomTypeInfo {
  capacity: number;
  unit: 'bed' | 'room';
  label: string;
}

// Build legacy ROOM_TYPE_INFO from the new config
export const ROOM_TYPE_INFO: Record<string, RoomTypeInfo> = Object.fromEntries(
  Object.entries(ROOM_TYPES).map(([id, config]) => [
    id,
    {
      capacity: config.capacity,
      unit: config.unitType,
      label: config.name,
    },
  ])
);

// Legacy ROOM_NAME_MAPPING for backward compatibility
export const ROOM_NAME_MAPPING = ROOM_NAME_TO_ID;

/**
 * Get room capacity information by room type ID or name
 */
export function getRoomTypeInfo(roomTypeIdOrName: string): RoomTypeInfo {
  const config = getRoomType(roomTypeIdOrName);
  if (config) {
    return {
      capacity: config.capacity,
      unit: config.unitType,
      label: config.name,
    };
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
    return { capacity: 2, unit: 'room', label: roomTypeIdOrName };
  }
  if (name.includes('king') || name.includes('double') || name.includes('triple')) {
    return { capacity: name.includes('double') ? 2 : 3, unit: 'room', label: roomTypeIdOrName };
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
  return getAvailLabel(roomTypeIdOrName, available);
}

/**
 * Check if room type is a dormitory
 */
export function isDormitory(roomTypeIdOrName: string): boolean {
  return isDorm(roomTypeIdOrName);
}

/**
 * Get all possible keys for a room type (for database queries)
 */
export function getRoomTypeKeys(roomTypeIdOrName: string): string[] {
  const resolvedId = resolveRoomTypeId(roomTypeIdOrName);
  const keys = new Set<string>([roomTypeIdOrName, resolvedId]);

  // Add any names that map to this ID
  for (const [name, id] of Object.entries(ROOM_NAME_TO_ID)) {
    if (id === resolvedId) {
      keys.add(name);
    }
  }

  return Array.from(keys);
}
