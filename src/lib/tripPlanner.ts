/**
 * XTSY trip planner engine.
 *
 * Builds a day-by-day Meghalaya plan from the traveller's choices, instantly and
 * in the browser (no network call). Every plan is based at XTSY Travellers
 * Hostel in New Shillong Township; day trips are grouped by region so the
 * traveller never zig-zags (Sohra loop, Dawki/Mawlynnong east loop, and so on),
 * and the planner warns when the chosen places need more days than selected.
 *
 * Drive times are conservative estimates; the XTSY desk confirms every plan.
 */

export type PlannerPlace =
  | 'shillong' | 'umiam' | 'laitlum' | 'cherrapunji' | 'nongriat'
  | 'dawki' | 'mawlynnong' | 'shnongpdeng';

export type PlannerStyle =
  | 'backpacking' | 'adventure' | 'nature' | 'romantic' | 'pet-friendly' | 'photography';

export type PlannerExperience =
  | 'waterfalls' | 'caves' | 'camping' | 'trekking' | 'culture' | 'sunrise' | 'kayaking';

export interface PlannerInput {
  days: number;
  styles: PlannerStyle[];
  places: PlannerPlace[];
  experiences: PlannerExperience[];
}

export interface PlanDay {
  n: number;
  title: string;
  stops: string[];
  meta: string;
  driveHours: number;
  tint: string;
}

export interface TripPlan {
  days: PlanDay[];
  driveTotal: number;
  warning: string;
}

interface Block {
  title: string;
  stops: string[];
  drive: number;
  meta: string;
  tint: string;
}

export const DAY_OPTIONS = [
  { v: 3, label: '3 days', desc: 'Quick getaway' },
  { v: 5, label: '5 days', desc: 'Most popular' },
  { v: 7, label: '7 days', desc: 'Full loop' },
  { v: 10, label: '10 days', desc: 'Slow travel' },
] as const;

export const STYLE_OPTIONS: { v: PlannerStyle; label: string }[] = [
  { v: 'backpacking', label: 'Backpacking' },
  { v: 'adventure', label: 'Adventure' },
  { v: 'nature', label: 'Nature & waterfalls' },
  { v: 'romantic', label: 'Romantic getaway' },
  { v: 'pet-friendly', label: 'Pet-friendly' },
  { v: 'photography', label: 'Photography' },
];

export const PLACE_OPTIONS: { v: PlannerPlace; label: string }[] = [
  { v: 'shillong', label: 'Shillong' },
  { v: 'umiam', label: 'Umiam Lake' },
  { v: 'laitlum', label: 'Laitlum Canyon' },
  { v: 'cherrapunji', label: 'Cherrapunjee' },
  { v: 'nongriat', label: 'Nongriat root bridge' },
  { v: 'dawki', label: 'Dawki, Umngot River' },
  { v: 'mawlynnong', label: 'Mawlynnong' },
  { v: 'shnongpdeng', label: 'Shnongpdeng' },
];

export const EXPERIENCE_OPTIONS: { v: PlannerExperience; label: string }[] = [
  { v: 'waterfalls', label: 'Waterfall chasing' },
  { v: 'caves', label: 'Cave exploration' },
  { v: 'camping', label: 'River camping' },
  { v: 'trekking', label: 'Trekking' },
  { v: 'culture', label: 'Village culture' },
  { v: 'sunrise', label: 'Sunrise viewpoints' },
  { v: 'kayaking', label: 'Kayaking' },
];

export const DEFAULT_PLANNER_INPUT: PlannerInput = {
  days: 5,
  styles: ['nature'],
  places: ['umiam', 'laitlum', 'cherrapunji', 'dawki', 'mawlynnong'],
  experiences: ['waterfalls', 'kayaking'],
};

const FILLERS: Record<PlannerStyle, Block> = {
  romantic: { title: 'Slow day for two', stops: ['Late breakfast at TAB Bistro', 'Pine forest walk', 'Stargazing night at Experience by XTSY'], drive: 0, meta: 'No driving · night at Experience by XTSY', tint: '#1F2438' },
  adventure: { title: 'Wari Chora canyon adventure', stops: ['Guided trek and river crossing', 'Waterfall rappelling (with guides)'], drive: 4, meta: 'Full day · back at XTSY', tint: '#A12444' },
  nature: { title: 'Elephant Falls and Umiam slow day', stops: ['Elephant Falls', 'Umiam Lake at golden hour', 'Pine walks around New Shillong'], drive: 1.5, meta: 'Easy day · back at XTSY', tint: '#2F4A3F' },
  photography: { title: 'Golden-hour photo day', stops: ['Laitlum at sunrise', 'Mawphlang Sacred Forest', 'Umiam Lake at sunset'], drive: 2.5, meta: 'Back at XTSY', tint: '#45506A' },
  'pet-friendly': { title: 'Pet-friendly pine trails', stops: ['Morning walk in the pines', 'Lunch at TAB Bistro', 'Lazy afternoon on the hostel lawn'], drive: 0, meta: 'No driving · pets welcome', tint: '#2F4A3F' },
  backpacking: { title: 'Hostel day and local life', stops: ['Laundry and slow breakfast', 'Bara Bazaar local market', 'Games night and bonfire at XTSY'], drive: 1, meta: 'Back at XTSY', tint: '#A12444' },
};

const BUFFER: Block = { title: 'Buffer day', stops: ['Rest, cafés and a spare day for rain'], drive: 0, meta: 'Meghalaya weather needs a spare day', tint: '#4F566A' };

export function buildTripPlan(input: PlannerInput): TripPlan {
  const { days, styles, places, experiences } = input;
  const has = (p: PlannerPlace) => places.includes(p);
  const ex = (e: PlannerExperience) => experiences.includes(e);

  const arrivalStops = ['Guwahati airport or station to Shillong (~3 h)'];
  if (has('umiam')) arrivalStops.push('Umiam Lake viewpoint on the way in');
  arrivalStops.push('Check in at XTSY, New Shillong Township', 'Dinner at TAB Bistro');

  let near: Block | null = null;
  if (has('laitlum') || has('shillong') || ex('sunrise')) {
    const s: string[] = [];
    if (has('laitlum') || ex('sunrise')) s.push('Laitlum Canyons at sunrise');
    s.push('Shillong Peak viewpoint');
    if (has('shillong')) s.push('Ward’s Lake, Police Bazaar market and cafés');
    if (ex('culture')) s.push('Don Bosco Museum of Northeast cultures');
    if (ex('waterfalls')) s.push('Elephant Falls');
    near = { title: 'Sunrise canyons and Shillong', stops: s, drive: 1.5, meta: 'Short drives · back at XTSY', tint: '#45506A' };
  }

  let sohra: Block | null = null;
  if (has('cherrapunji')) {
    const s = ['Nohkalikai Falls viewpoint', 'Seven Sisters Falls'];
    if (ex('caves')) s.push('Mawsmai Cave');
    if (ex('waterfalls')) s.push('Wei Sawdong falls');
    s.push('Eco Park, Sohra');
    sohra = { title: 'Cherrapunji waterfall loop', stops: s, drive: 4, meta: '~2 h each way · back at XTSY', tint: '#2F4A3F' };
  }

  let trek: Block | null = null;
  if (has('nongriat') || ex('trekking')) {
    trek = {
      title: 'Double decker root bridge trek, Nongriat',
      stops: ['Tyrna trailhead (~30 min from Sohra)', 'About 3,500 steps down to the double decker bridge', 'Rainbow Falls if time allows', 'Climb back and drive to XTSY'],
      drive: sohra ? 3 : 5,
      meta: 'Full, demanding day · start by 7 AM · back at XTSY',
      tint: '#2F4A3F',
    };
  }

  const camping = has('shnongpdeng') || ex('camping');
  let east: Block | null = null;
  if (has('dawki') || has('mawlynnong')) {
    const s: string[] = [];
    if (has('mawlynnong') || ex('culture')) s.push('Mawlynnong village walk and Riwai living root bridge');
    if (has('dawki')) s.push('Boating on the clear Umngot at Dawki');
    if (ex('kayaking')) s.push('Kayaking on the Umngot');
    s.push('India–Bangladesh border viewpoint');
    east = { title: 'Mawlynnong and Dawki', stops: s, drive: 5, meta: `~2.5 h out · ${camping ? 'overnight at a partner riverside camp, Dawki' : 'back at XTSY'}`, tint: '#8A1D3A' };
  }

  let camp: Block | null = null;
  if (camping) {
    camp = { title: 'Shnongpdeng river day', stops: ['Kayaking and cliff jumps (in season)', 'Suspension bridge walk', 'Riverside lunch, then drive back to XTSY'], drive: 3.5, meta: '30 min from Dawki · ~3 h back to XTSY', tint: '#8A1D3A' };
    if (!east) camp.stops.unshift('Drive to the Dawki area (~2.5 h), tent at a partner riverside camp');
  }

  const order = [near, sohra, trek, east, camp].filter((b): b is Block => Boolean(b));
  const middle = Math.max(1, days - 2);
  let chosen = order.slice(0, middle);
  let dropped = order.slice(middle);

  // If the Shillong day doesn't fit, fold it into the arrival evening instead of dropping it.
  if (near && dropped.includes(near)) {
    const withoutNear = order.filter((b) => b !== near);
    chosen = withoutNear.slice(0, middle);
    dropped = withoutNear.slice(middle);
    arrivalStops.splice(arrivalStops.length - 1, 0, `Evening in Shillong: ${has('shillong') ? 'Police Bazaar and cafés' : 'Ward’s Lake'}`);
  }

  const fill = styles.map((s) => FILLERS[s]).filter(Boolean);
  while (chosen.length < middle) chosen.push(fill.shift() ?? BUFFER);

  const all: Block[] = [
    { title: 'Arrive in the pines', stops: arrivalStops, drive: 3, meta: 'Night at XTSY, New Shillong Township', tint: '#A12444' },
    ...chosen,
    { title: 'Departure', stops: ['Breakfast at TAB Bistro', 'Shillong to Guwahati (~3 h)'], drive: 3, meta: 'Leave by 10 AM for afternoon flights', tint: '#4F566A' },
  ].slice(0, days);

  return {
    days: all.map((b, i) => ({ n: i + 1, title: b.title, stops: b.stops, meta: b.meta, driveHours: b.drive, tint: b.tint })),
    driveTotal: Math.round(all.reduce((a, b) => a + b.drive, 0)),
    warning: dropped.length
      ? `That’s more than ${days} days can hold. We left out: ${dropped.map((b) => b.title).join(', ')}. Add days or remove a place.`
      : '',
  };
}

/** Plain-text version for WhatsApp / enquiry notes. */
export function planToText(input: PlannerInput, plan: TripPlan): string {
  const lines = plan.days.map((d) => `Day ${d.n}: ${d.title} — ${d.stops.join(', ')}`);
  return `${input.days}-day Meghalaya plan (base: XTSY, New Shillong Township)\n${lines.join('\n')}\n~${plan.driveTotal} h driving in total`;
}
