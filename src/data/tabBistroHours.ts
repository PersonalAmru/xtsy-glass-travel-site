/**
 * TAB Bistro by XTSY — opening hours (single source of truth).
 *
 * The kitchen runs two service windows every day:
 *   - Breakfast: 8:45 AM – 11:45 AM
 *   - Evening & dinner: 4:30 PM – 11:00 PM
 * The restaurant is closed for lunch; lunch is available by preorder only.
 * Reuse these constants everywhere hours are shown so the copy never drifts.
 */

export const BISTRO_BREAKFAST = { opens: '08:45', closes: '11:45', label: '8:45 AM – 11:45 AM' } as const;
export const BISTRO_EVENING = { opens: '16:30', closes: '23:00', label: '4:30 PM – 11 PM' } as const;

/** Short display string for chips, cards and footers. */
export const BISTRO_HOURS_SHORT = `Breakfast ${BISTRO_BREAKFAST.label} · Dinner ${BISTRO_EVENING.label}`;

/** Sentence form for descriptions and FAQs. */
export const BISTRO_HOURS_SENTENCE =
  'Open daily for breakfast 8:45 AM – 11:45 AM and evening & dinner 4:30 PM – 11 PM. Closed for lunch — lunch preorders accepted.';

/** Compact form for meta descriptions. */
export const BISTRO_HOURS_META = 'Breakfast 8:45–11:45 AM & dinner 4:30–11 PM daily; lunch by preorder.';

/**
 * Bookable table slots (24h values), 30-minute steps.
 * Last breakfast seating 11:30 AM; last dinner seating 10:30 PM.
 */
export const BISTRO_SLOT_RANGES: { from: number; to: number }[] = [
  { from: 8 * 60 + 45, to: 11 * 60 + 30 },
  { from: 16 * 60 + 30, to: 22 * 60 + 30 },
];
