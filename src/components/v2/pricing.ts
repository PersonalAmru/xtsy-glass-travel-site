/**
 * Live prices for the redesign, read from the booking engine's room inventory
 * (src/data/roomInventory.ts) so the marketing pages never drift from checkout.
 */
import { getBookableRooms, getRoomById } from '@/data/roomInventory';

export const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export function lowestDormPrice(): number {
  const dorms = getBookableRooms().filter((r) => r.kind === 'dorm');
  return dorms.length ? Math.min(...dorms.map((r) => r.discountedPrice)) : 0;
}

export function roomPrice(id: string): { now: number; was: number } {
  const r = getRoomById(id);
  return { now: r?.discountedPrice ?? 0, was: r?.originalPrice ?? 0 };
}
