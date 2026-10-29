/**
 * TAB Bistro by XTSY — opening hours (single source of truth).
 *
 * The kitchen runs two service windows every day:
 *   - Breakfast: 8:45 AM – 12:00 PM
 *   - Dinner: 5:00 PM – 11:00 PM (last order 10:30 PM)
 * The restaurant is closed for lunch; lunch is available by preorder only.
 * Reuse these constants everywhere hours are shown so the copy never drifts.
 */

export const BISTRO_BREAKFAST = { opens: '08:45', closes: '12:00', label: '8:45 AM – 12 PM' } as const;
export const BISTRO_EVENING = { opens: '17:00', closes: '23:00', label: '5 PM – 11 PM' } as const;

/** The kitchen stops taking orders half an hour before close. */
export const BISTRO_LAST_ORDER = { time: '22:30', label: '10:30 PM' } as const;

export const BISTRO_LUNCH_DETAILS = 'Closed for lunch service; lunch preorders are accepted subject to confirmation.';

/** Short display string for chips, cards and footers. */
export const BISTRO_HOURS_SHORT = `Breakfast ${BISTRO_BREAKFAST.label} · Dinner ${BISTRO_EVENING.label}`;

/** Sentence form for descriptions and FAQs. */
export const BISTRO_HOURS_SENTENCE =
  `Open daily for breakfast ${BISTRO_BREAKFAST.label} and dinner ${BISTRO_EVENING.label} ` +
  `(last order ${BISTRO_LAST_ORDER.label}). ${BISTRO_LUNCH_DETAILS}`;

/** Compact form for meta descriptions. */
export const BISTRO_HOURS_META = 'Breakfast 8:45 AM–12 PM & dinner 5–11 PM daily (last order 10:30 PM); lunch by preorder.';

/**
 * Bookable table slots (24h values), 30-minute steps.
 * Last breakfast seating 11:45 AM; last dinner seating 10:30 PM, which is also
 * the kitchen's last order.
 */
export const BISTRO_SLOT_RANGES: { from: number; to: number }[] = [
  { from: 8 * 60 + 45, to: 11 * 60 + 45 },
  { from: 17 * 60, to: 22 * 60 + 30 },
];

export type BistroRequestKind = 'table' | 'lunch-preorder';

/** Lunch times are guest requests, not an additional restaurant service window. */
export function isValidBistroRequestTime(kind: BistroRequestKind, time: string, offeredTableTimes: string[]): boolean {
  return kind === 'lunch-preorder'
    ? /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
    : offeredTableTimes.includes(time);
}
