/**
 * RATE SANITY CHECK
 * Single source of truth for canonical Shillong rates. Run this on
 * every booking step to ensure UI prices match the inventory module.
 *
 * If any room has drifted from canonical pricing, we log a warning and
 * return the canonical figure — the UI must always show the latest.
 */

import { ROOM_INVENTORY } from '@/data/roomInventory';

// Canonical published rates for Shillong (incl. GST where applicable)
export const SHILLONG_CANONICAL_RATES: Record<string, number> = {
  'xtsy-270': 4999,
  'king-double-room': 2399,
  '4-bed-female-only-dorm': 419,
  '4-bed-mixed-female-dorm': 569,
  '6-bed-mixed-female-dorm': 389,
  '6-bed-mixed-dorm': 469,
  '8-bed-mixed-dorm': 369,
};

/**
 * Returns the canonical price for a room. If inventory has drifted,
 * a console warning is logged so devs can spot the regression.
 */
export function getCanonicalRate(roomId: string): number {
  const canonical = SHILLONG_CANONICAL_RATES[roomId];
  if (canonical === undefined) return ROOM_INVENTORY[roomId]?.basePrice ?? 0;

  const inventoryPrice = ROOM_INVENTORY[roomId]?.basePrice;
  if (inventoryPrice !== undefined && inventoryPrice !== canonical) {
    console.warn(
      `[RateSanityCheck] Drift detected for ${roomId}: inventory=${inventoryPrice}, canonical=${canonical}. Using canonical.`,
    );
  }
  return canonical;
}

/**
 * Verify a single price matches canonical. Returns canonical price.
 */
export function verifyRate(roomId: string, displayedPrice: number): number {
  const canonical = getCanonicalRate(roomId);
  if (displayedPrice !== canonical) {
    console.warn(
      `[RateSanityCheck] UI showing ₹${displayedPrice} for ${roomId} but canonical is ₹${canonical}.`,
    );
  }
  return canonical;
}

/**
 * Rooms that include complimentary breakfast in the published rate.
 * Used by room cards and booking summary to surface the inclusion.
 */
export const ROOMS_WITH_COMPLIMENTARY_BREAKFAST: Record<string, string> = {
  'xtsy-270': 'Complimentary breakfast for 2',
};

export function getBreakfastInclusion(roomId: string): string | null {
  return ROOMS_WITH_COMPLIMENTARY_BREAKFAST[roomId] ?? null;
}
