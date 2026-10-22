import { BISTRO_BREAKFAST, BISTRO_EVENING, BISTRO_LUNCH_DETAILS } from '../data/tabBistroHours';

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const INTRO = "At TAB Bistro, every dish is crafted with intention — bold flavors, fresh ingredients, and a touch of XTSY signature style. Whether you're here for a quick bite, a relaxed meal with friends, or a taste of something new, we’ve created a space that feels warm, modern, and effortlessly inviting.";
type Time = { hours?: number; minutes?: number; seconds?: number; nanos?: number };
type Period = { openDay: string; closeDay: string; openTime: Time; closeTime: Time };
export type BistroGoogleFields = { regularHours?: { periods?: Period[] }; profile?: { description?: string } };

const googleTime = (value: string): Time => {
  const [hours, minutes] = value.split(':').map(Number);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59)
    throw new Error('Invalid Bistro service time');
  return { hours, minutes };
};

export function buildBistroGoogleFields(): BistroGoogleFields {
  return {
    regularHours: { periods: DAYS.flatMap(day => [BISTRO_BREAKFAST, BISTRO_EVENING].map(window => ({
      openDay: day, closeDay: day, openTime: googleTime(window.opens), closeTime: googleTime(window.closes),
    }))) },
    profile: { description: `${INTRO} Breakfast is served daily from ${BISTRO_BREAKFAST.label}, and evening dining and dinner from ${BISTRO_EVENING.label}. ${BISTRO_LUNCH_DETAILS}` },
  };
}

export function matchingBistroGoogleFields(current: BistroGoogleFields, desired: BistroGoogleFields): boolean {
  const periods = (fields: BistroGoogleFields) => (fields.regularHours?.periods ?? []).map(p =>
    `${p.openDay}:${p.openTime.hours ?? 0}:${p.openTime.minutes ?? 0}:${p.openTime.seconds ?? 0}:${p.openTime.nanos ?? 0}-${p.closeDay}:${p.closeTime.hours ?? 0}:${p.closeTime.minutes ?? 0}:${p.closeTime.seconds ?? 0}:${p.closeTime.nanos ?? 0}`
  ).sort();
  return JSON.stringify(periods(current)) === JSON.stringify(periods(desired)) && current.profile?.description === desired.profile?.description;
}

export async function reconcileBistroGoogleProfile(
  call: (method: 'GET' | 'PATCH', validateOnly?: boolean, body?: BistroGoogleFields) => Promise<BistroGoogleFields>,
): Promise<'unchanged' | 'updated'> {
  const desired = buildBistroGoogleFields();
  if (matchingBistroGoogleFields(await call('GET'), desired)) return 'unchanged';
  await call('PATCH', true, desired);
  await call('PATCH', false, desired);
  if (!matchingBistroGoogleFields(await call('GET'), desired)) throw new Error('Google has not returned the requested Bistro details; check the listing before retrying.');
  return 'updated';
}