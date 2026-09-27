/**
 * Day-by-day itinerary builder for the XTSY trip assistant.
 *
 * Rules that keep plans realistic:
 *  - Day trips from XTSY only when the round trip plus time on the ground fits
 *    in ~11 hours (Shillong, Sohra, Dawki/Mawlynnong, Jowai).
 *  - Everything further (Garo Hills, West Khasi, Kaziranga, Tawang, Kohima,
 *    Sikkim…) becomes its own leg with transfer days and nights at a partner
 *    stay near the sights. TAB Bistro meals only appear on XTSY days.
 *  - Transfers over ~10 hours are split with a night on the way; flights from
 *    Guwahati are used where they beat the road.
 *  - If the places don't fit, the farthest legs are dropped first and the
 *    traveller is told how many extra days each would need. Spare days are
 *    filled with nearby sights first, then easy days at XTSY.
 */
import { CLUSTERS, PLACE_BY_ID, XTSY, type ClusterId, type Place } from './places';
import { EXIT_GATEWAYS, HUBS, XTSY_POINT, pointOfHub, pointOfPlace, travel, type Leg, type Point } from './routing';
import type { HubId } from './places';

export type TripStyle = 'backpacking' | 'adventure' | 'nature' | 'romantic' | 'pets' | 'photography' | 'family' | 'culture' | 'solo-female' | 'budget';

export interface PlanInput {
  days: number;
  placeIds: string[];
  travellers: number;
  styles: TripStyle[];
  /** 0 = January … 11 = December */
  month?: number;
  camping?: boolean;
  /** Places the traveller asked for most recently: dropped last. */
  keep?: string[];
  /** Places the traveller removed: never suggested again. */
  avoid?: string[];
}

export interface PlanDay {
  n: number;
  title: string;
  stops: string[];
  driveHours: number;
  km: number;
  overnight: string;
  atXtsy: boolean;
}

export interface DroppedItem { name: string; reason: string; extraDays: number }

export interface Plan {
  input: PlanInput;
  days: PlanDay[];
  driveHours: number;
  km: number;
  nightsAtXtsy: number;
  dropped: DroppedItem[];
  added: string[];
  notes: string[];
  permits: string[];
}

export const XTSY_STAY = `${XTSY.name}, ${XTSY.area} (our own stay)`;
const DAY_BUDGET = 11;
const r1 = (n: number) => Math.round(n * 4) / 4;
export const fmtH = (h: number) => (h < 1 ? `${Math.max(15, Math.round(h * 60))} min` : `${r1(h)} h`);
const placeLine = (p: Place) => (p.note ? `${p.name} — ${p.note}` : p.name);

function legText(leg: Leg): string[] {
  if (!leg.segs.length) return [];
  if (!leg.flight) return [`Drive ~${fmtH(leg.hours)} (~${leg.km} km)${leg.via.length ? ` via ${leg.via.join(', ')}` : ''}`];
  return leg.segs.map((s) => (s.flight ? `Fly ${s.from.replace(' airport', '')} → ${s.to} (allow ~${fmtH(s.hours)} with airport time)` : `Drive ${s.from} → ${s.to} (~${fmtH(s.hours)})`));
}

/** Pack a cluster's places into day trips from XTSY. */
function dayTrips(places: Place[], camping: boolean): PlanDay[] {
  const days: PlanDay[] = [];
  const dist = (p: Place) => travel(XTSY_POINT, pointOfPlace(p)).hours;
  // Farthest sights anchor a day; nearer ones fill it on the way.
  const queue = [...places].sort((a, b) => Number(!!b.fullDay) - Number(!!a.fullDay) || dist(b) - dist(a));
  let campUsed = false;
  while (queue.length) {
    const first = queue.shift()!;
    const day: Place[] = [first];
    let cur = pointOfPlace(first);
    const out = travel(XTSY_POINT, cur);
    let used = out.hours + first.visit;
    let drive = out.hours;
    let km = out.km;
    const campDay = camping && first.cluster === 'east-khasi' && !campUsed;
    if (!first.fullDay) {
      for (let i = 0; i < queue.length; ) {
        const cand = queue[i];
        if (cand.fullDay) { i++; continue; }
        const hop = travel(cur, pointOfPlace(cand));
        const back = campDay ? { hours: 0 } : travel(pointOfPlace(cand), XTSY_POINT);
        if (used + hop.hours + cand.visit + back.hours <= DAY_BUDGET) {
          day.push(cand); used += hop.hours + cand.visit; drive += hop.hours; km += hop.km; cur = pointOfPlace(cand); queue.splice(i, 1);
        } else i++;
      }
    }
    const clusterId = first.cluster;
    const camp = campDay;
    const back = travel(cur, XTSY_POINT);
    const stops = day.map(placeLine);
    if (first.id === 'nongriat') stops.unshift('Leave XTSY by 6 AM for the Tyrna trailhead');
    if (camp) {
      campUsed = true;
      days.push({ n: 0, title: `${CLUSTERS[clusterId].name}: river day and camp night`, stops: [...stops, 'Bonfire night at the partner riverside camp (booked by XTSY)'], driveHours: r1(drive), km, overnight: 'Partner riverside camp, Dawki (booked by XTSY)', atXtsy: false });
      {
        days.push({ n: 0, title: 'River morning, back to the pines', stops: ['Sunrise on the Umngot and breakfast at camp', `Drive back to XTSY (~${fmtH(back.hours)})`, 'Dinner at TAB Bistro by XTSY'], driveHours: back.hours, km: back.km, overnight: XTSY_STAY, atXtsy: true });
      }
      continue;
    }
    const light = used + back.hours < 5 && !day.some((p) => p.id === 'shillong');
    days.push({
      n: 0,
      title: day.length > 1 ? `${CLUSTERS[clusterId].short} day trip` : `${first.name}${first.fullDay ? ' (full day)' : ''}`,
      stops: [...stops, ...(light ? ['Free afternoon in Shillong: Police Bazaar, Ward’s Lake and cafés'] : []), `Back at XTSY by evening (~${fmtH(back.hours)} drive)`, 'Dinner at TAB Bistro by XTSY'],
      driveHours: r1(drive + back.hours),
      km: km + back.km,
      overnight: XTSY_STAY,
      atXtsy: true,
    });
  }
  return days;
}

function stayName(clusterId: ClusterId, at: Point): string {
  if (clusterId === 'garo') {
    const d = (h: 'tura' | 'baghmara') => Math.hypot(at.lat - HUBS[h].lat, at.lng - HUBS[h].lng);
    return `Partner guesthouse in ${d('tura') < d('baghmara') ? 'Tura' : 'Baghmara'} (booked by XTSY)`;
  }
  if (clusterId === 'tawang') return at.lat > 27.45 ? 'Partner stay in Tawang (booked by XTSY)' : 'Partner stay in Dirang (booked by XTSY)';
  return CLUSTERS[clusterId].stay;
}

const STAY_HUBS: Partial<Record<ClusterId, HubId[]>> = { garo: ['tura', 'baghmara'], tawang: ['dirang', 'tawang'] };
/** Where the traveller actually sleeps after the last sight of a far cluster. */
function sleepPoint(clusterId: ClusterId, at: Point): Point {
  const hubs = STAY_HUBS[clusterId] ?? [CLUSTERS[clusterId].base];
  const h = hubs.reduce((b, x) => (Math.hypot(at.lat - HUBS[x].lat, at.lng - HUBS[x].lng) < Math.hypot(at.lat - HUBS[b].lat, at.lng - HUBS[b].lng) ? x : b), hubs[0]);
  return pointOfHub(h);
}

/** Days inside a far cluster, sleeping at the cluster's partner stay. */
function farDays(clusterId: ClusterId, places: Place[], entry: Point): { days: PlanDay[]; end: Point } {
  const days: PlanDay[] = [];
  const left = [...places];
  let cur = entry;
  while (left.length) {
    left.sort((a, b) => travel(cur, pointOfPlace(a)).hours - travel(cur, pointOfPlace(b)).hours);
    const first = left.shift()!;
    const hop = travel(cur, pointOfPlace(first));
    const stops = [placeLine(first)];
    let used = hop.hours + first.visit;
    let drive = hop.hours;
    let km = hop.km;
    cur = pointOfPlace(first);
    if (!first.fullDay) {
      for (let i = 0; i < left.length; ) {
        const cand = left[i];
        const h = travel(cur, pointOfPlace(cand));
        if (!cand.fullDay && used + h.hours + cand.visit <= 9) { stops.push(placeLine(cand)); used += h.hours + cand.visit; drive += h.hours; km += h.km; cur = pointOfPlace(cand); left.splice(i, 1); } else i++;
      }
    }
    days.push({ n: 0, title: stops.length > 1 ? `${CLUSTERS[clusterId].short}: ${first.name} and more` : first.name, stops, driveHours: r1(drive), km, overnight: stayName(clusterId, cur), atXtsy: false });
  }
  return { days, end: sleepPoint(clusterId, cur) };
}

/** Transfer day(s); anything over ~10 h of road is split with a night on the way. */
function transfer(from: Point, to: Point, overnight: string, toLabel: string, maxDay = 10): PlanDay[] {
  const leg = travel(from, to);
  const atXtsy = overnight === XTSY_STAY;
  if (leg.hours <= maxDay || leg.segs.length < 2) {
    return [{ n: 0, title: `${from.label} → ${toLabel}`, stops: [...legText(leg), atXtsy ? 'Dinner at TAB Bistro by XTSY' : 'Leave early; lunch on the road'], driveHours: leg.hours, km: leg.km, overnight, atXtsy }];
  }
  // Split at the hub closest to half way.
  let acc = 0; let bestIdx = 0; let bestGap = Infinity;
  leg.segs.forEach((s, i) => { acc += s.hours; const g = Math.abs(acc - leg.hours / 2); if (g < bestGap && i < leg.segs.length - 1) { bestGap = g; bestIdx = i; } });
  const firstH = r1(leg.segs.slice(0, bestIdx + 1).reduce((a, s) => a + s.hours, 0));
  const firstKm = leg.segs.slice(0, bestIdx + 1).reduce((a, s) => a + s.km, 0);
  const mid = leg.segs[bestIdx].to;
  const segText = (segs: Leg['segs']) => segs.map((x) => (x.flight ? `Fly ${x.from.replace(' airport', '')} → ${x.to} (allow ~${fmtH(x.hours)} with airport time)` : `Drive ${x.from} → ${x.to} (~${fmtH(x.hours)})`));
  const midName = mid.replace(' airport', '');
  return [
    { n: 0, title: `${from.label} → ${midName}`, stops: [...segText(leg.segs.slice(0, bestIdx + 1)), `Night in ${midName} to break the journey`], driveHours: firstH, km: firstKm, overnight: `Partner stay in ${midName} (booked by XTSY)`, atXtsy: false },
    { n: 0, title: `${midName} → ${toLabel}`, stops: segText(leg.segs.slice(bestIdx + 1)), driveHours: r1(leg.hours - firstH), km: leg.km - firstKm, overnight, atXtsy },
  ];
}

interface Assembly { days: PlanDay[]; farClusters: ClusterId[]; far: Map<ClusterId, Place[]> }

/** Build the whole trip for a fixed set of places. */
function assemble(places: Place[], camping: boolean): Assembly {
  const byCluster = new Map<ClusterId, Place[]>();
  for (const p of places) byCluster.set(p.cluster, [...(byCluster.get(p.cluster) ?? []), p]);
  const core = [...byCluster.entries()].filter(([c]) => CLUSTERS[c].dayTripFromXtsy);
  const farIds = [...byCluster.keys()].filter((c) => !CLUSTERS[c].dayTripFromXtsy);

  const days: PlanDay[] = [];
  let cursor: Point = pointOfHub('gau');
  const hasCore = core.length > 0;
  if (hasCore) {
    const arrival = travel(pointOfHub('gau'), XTSY_POINT);
    const arrivalStops = ['Pick-up at Guwahati airport or station'];
    // Umiam sits on the Guwahati–Shillong road: see it on the way in.
    const shillong = core.find(([c]) => c === 'shillong');
    if (shillong && shillong[1].some((p) => p.id === 'umiam')) {
      arrivalStops.push('Umiam Lake viewpoint on the way in');
      shillong[1] = shillong[1].filter((p) => p.id !== 'umiam');
    }
    arrivalStops.push(`Drive ~${fmtH(arrival.hours)} to New Shillong`, `Check in at ${XTSY.name} (check-in 11 AM)`, 'Dinner at TAB Bistro by XTSY');
    days.push({ n: 0, title: 'Arrive in the pines', stops: arrivalStops, driveHours: arrival.hours, km: arrival.km, overnight: XTSY_STAY, atXtsy: true });
    const trips = dayTrips(core.flatMap(([, ps]) => ps), camping);
    // Gentle start: shortest day trips first, camp nights last among the core days.
    const campIdx = trips.findIndex((d) => d.overnight.includes('camp'));
    const campPair = campIdx >= 0 ? trips.splice(campIdx, 2) : [];
    trips.sort((x, y) => x.driveHours - y.driveHours);
    days.push(...trips, ...campPair);
    cursor = XTSY_POINT;
    // A camp night means the last core day ends at Dawki.
    const lastCore = days[days.length - 1];
    if (!lastCore.atXtsy && lastCore.overnight.includes('Dawki')) cursor = { ...pointOfHub('dawki'), label: 'Dawki' };
  }

  const remaining = [...farIds];
  while (remaining.length) {
    const nearestOf = (c: ClusterId) => [...byCluster.get(c)!].sort((x, y) => travel(cursor, pointOfPlace(x)).hours - travel(cursor, pointOfPlace(y)).hours)[0];
    remaining.sort((a, b) => travel(cursor, pointOfPlace(nearestOf(a))).hours - travel(cursor, pointOfPlace(nearestOf(b))).hours);
    const cid = remaining.shift()!;
    const first = nearestOf(cid);
    const ps = [first, ...byCluster.get(cid)!.filter((p) => p !== first)];
    const entry = pointOfPlace(first);
    const t = transfer(cursor, entry, stayName(cid, entry), CLUSTERS[cid].short);
    const inside = farDays(cid, ps, entry);
    const last = t[t.length - 1];
    // A short transfer can share a day with a short first sight.
    if (!last.stops.some((s) => s.startsWith('Fly')) && last.driveHours <= 5 && inside.days.length && inside.days[0].driveHours + last.driveHours <= 8 && !ps[0].fullDay) {
      const d0 = inside.days[0];
      t[t.length - 1] = { ...d0, title: `${last.title} · ${d0.title}`, stops: [last.stops[0], ...d0.stops], driveHours: r1(last.driveHours + d0.driveHours), km: last.km + d0.km };
      inside.days.shift();
    }
    days.push(...t, ...inside.days);
    cursor = inside.end;
  }

  // Departure from the nearest airport (Guwahati when the trip ends at XTSY).
  const endsAtXtsy = days.length ? days[days.length - 1].atXtsy : true;
  const exits = EXIT_GATEWAYS.map((g) => ({ g, leg: travel(cursor, pointOfHub(g)) })).sort((a, b) => a.leg.hours - b.leg.hours);
  const exit = endsAtXtsy ? { g: 'gau' as const, leg: travel(XTSY_POINT, pointOfHub('gau')) } : exits[0];
  const exitName = HUBS[exit.g].airport ?? HUBS[exit.g].name;
  if (!endsAtXtsy && exit.leg.hours > 11) {
    days.push(...transfer(cursor, pointOfHub(exit.g), '', exitName, 11).map((d, i, arr) => (i === arr.length - 1 ? { ...d, title: `Departure via ${exitName}`, overnight: '—' } : d)));
  } else {
    days.push({ n: 0, title: 'Departure', stops: [...(endsAtXtsy ? ['Breakfast at TAB Bistro', 'Check out by 10 AM'] : ['Early breakfast and check-out']), `Drive ~${fmtH(exit.leg.hours)} to ${exitName}${exit.leg.hours > 6 ? ' — book an evening flight' : ''}`], driveHours: exit.leg.hours, km: exit.leg.km, overnight: '—', atXtsy: false });
  }
  return { days, farClusters: farIds, far: new Map(farIds.map((c) => [c, byCluster.get(c)!])) };
}

const EXTRAS: Record<TripStyle, { title: string; stops: string[] }> = {
  romantic: { title: 'Slow day for two', stops: ['Late breakfast at TAB Bistro', 'Pine forest walk in New Shillong', 'Stargazing night at Experience by XTSY (book ahead)'] },
  pets: { title: 'Pet-friendly pine day', stops: ['Morning walk in the pines around XTSY', 'Lunch at TAB Bistro', 'Lazy afternoon at the hostel'] },
  backpacking: { title: 'Hostel day and local life', stops: ['Slow breakfast and laundry', 'Bara Bazaar and Police Bazaar in Shillong', 'Games night at XTSY'] },
  budget: { title: 'Shillong on a budget', stops: ['Shared taxi into Shillong', 'Ward’s Lake and Police Bazaar street food', 'Back to XTSY for dinner'] },
  photography: { title: 'Golden-hour photo day', stops: ['Laitlum Canyons at sunrise', 'Mawphlang Sacred Forest', 'Umiam Lake at sunset'] },
  nature: { title: 'Easy nature day near Shillong', stops: ['Elephant Falls', 'Shillong Peak viewpoint', 'Pine walks around New Shillong'] },
  adventure: { title: 'Adventure day near Shillong', stops: ['Kayaking at Umiam Lake', 'Laitlum Canyons hike', 'Ziplining at Mawkdok (seasonal)'] },
  family: { title: 'Family day in Shillong', stops: ['Don Bosco Museum', 'Ward’s Lake paddle boats', 'Dinner at TAB Bistro'] },
  culture: { title: 'Khasi culture day', stops: ['Don Bosco Museum of Northeast cultures', 'Mawphlang Sacred Forest with a local guide', 'Dinner at TAB Bistro'] },
  'solo-female': { title: 'Easy solo day', stops: ['Women-only dorm with female staff on call at XTSY', 'Café hop in Laitumkhrah', 'Dinner at TAB Bistro'] },
};
const EXTRA_ORDER: TripStyle[] = ['nature', 'culture', 'backpacking', 'photography', 'adventure', 'family'];

export const DEFAULT_PLACES = ['umiam', 'laitlum', 'nohkalikai', 'mawsmai', 'seven-sisters', 'mawlynnong', 'dawki'];
const CORE_SUGGESTIONS = ['laitlum', 'umiam', 'nohkalikai', 'mawsmai', 'seven-sisters', 'mawlynnong', 'dawki', 'shnongpdeng', 'krang-suri', 'wei-sawdong', 'mawphlang', 'nongriat', 'arwah', 'jowai'];

export function buildPlan(input: PlanInput): Plan {
  const target = Math.max(1, Math.min(21, Math.round(input.days)));
  const wanted = [...new Set(input.placeIds)].map((id) => PLACE_BY_ID[id]).filter(Boolean);
  let places = wanted.length ? wanted : DEFAULT_PLACES.map((id) => PLACE_BY_ID[id]);
  const camping = !!input.camping;
  const dropped: DroppedItem[] = [];
  const added: string[] = [];

  let a = assemble(places, camping);

  // Too long: drop the far legs that cost the most days, then the last core sights.
  while (a.days.length > target && places.length) {
    const keep = new Set(input.keep ?? []);
    const droppable = a.farClusters.filter((c) => !places.some((p) => p.cluster === c && keep.has(p.id)));
    const coreDroppable = places.filter((p) => CLUSTERS[p.cluster].dayTripFromXtsy && !keep.has(p.id));
    if (a.farClusters.length && (droppable.length || !coreDroppable.length)) {
      const pool = droppable.length ? droppable : a.farClusters;
      let worst: ClusterId = pool[0]; let worstCost = -1;
      for (const c of pool) {
        const cost = a.days.length - assemble(places.filter((p) => p.cluster !== c), camping).days.length;
        if (cost > worstCost) { worst = c; worstCost = cost; }
      }
      const gone = places.filter((p) => p.cluster === worst);
      places = places.filter((p) => p.cluster !== worst);
      const from = travel(XTSY_POINT, pointOfPlace(gone[0]));
      dropped.push({ name: gone.map((p) => p.name).join(', '), reason: `${CLUSTERS[worst].name} is ~${fmtH(from.hours)} (~${from.km} km) from Shillong — too far for a day trip`, extraDays: Math.max(1, worstCost) });
    } else {
      const last = coreDroppable.length ? coreDroppable[coreDroppable.length - 1] : places[places.length - 1];
      places = places.filter((p) => p !== last);
      dropped.push({ name: last.name, reason: 'not enough days', extraDays: 1 });
    }
    a = assemble(places, camping);
  }

  // Spare days: nearby sights in clusters already visited, then Shillong-region highlights.
  const used = new Set([...places.map((p) => p.id), ...(input.avoid ?? [])]);
  const farCandidates = places.filter((p) => !CLUSTERS[p.cluster].dayTripFromXtsy).flatMap((p) =>
    Object.values(PLACE_BY_ID).filter((q) => q.cluster === p.cluster && !used.has(q.id)).sort((x, y) => travel(pointOfPlace(p), pointOfPlace(x)).hours - travel(pointOfPlace(p), pointOfPlace(y)).hours).slice(0, 2));
  const candidates = [...new Map([...farCandidates, ...CORE_SUGGESTIONS.map((id) => PLACE_BY_ID[id])].map((p) => [p.id, p])).values()].filter((p) => !used.has(p.id) && !dropped.some((d) => d.name.includes(p.name)));
  for (const c of candidates) {
    if (a.days.length >= target) break;
    const trial = assemble([...places, c], camping);
    if (trial.days.length <= target) { places = [...places, c]; a = trial; added.push(c.name); }
  }

  // Still spare: relaxed days where the traveller sleeps (XTSY if they're there).
  let days = a.days;
  const monsoon = input.month !== undefined && input.month >= 5 && input.month <= 8;
  const pool = [...new Set([...input.styles, ...EXTRA_ORDER])].map((s) => EXTRAS[s]).filter(Boolean);
  let k = 0;
  while (days.length < target) {
    const xtsyIdx = days.map((d, i) => (d.atXtsy ? i : -1)).filter((i) => i >= 0);
    if (xtsyIdx.length) {
      const x = monsoon && k === 0 ? { title: 'Rain buffer day', stops: ['A spare day for heavy rain or a closed road', 'Cafés in Laitumkhrah', 'Dinner at TAB Bistro'] } : pool[k % pool.length];
      days.splice(xtsyIdx[xtsyIdx.length - 1] + 1, 0, { n: 0, title: x.title, stops: x.stops, driveHours: 1, km: 30, overnight: XTSY_STAY, atXtsy: true });
    } else {
      const at = Math.max(1, days.length - 1);
      days.splice(at, 0, { n: 0, title: 'Slow day', stops: ['Rest, a local walk and time for weather or permit delays'], driveHours: 0, km: 0, overnight: days[at - 1].overnight, atXtsy: false });
    }
    k++;
  }
  days = days.slice(0, target).map((d, i) => ({ ...d, n: i + 1 }));

  // How many extra days would bring each dropped item back?
  for (const d of dropped) {
    const back = Object.values(PLACE_BY_ID).filter((p) => d.name.split(', ').includes(p.name));
    if (back.length) d.extraDays = Math.max(1, assemble([...places, ...back], camping).days.length - target);
  }

  const notes: string[] = [];
  const permits: string[] = [];
  for (const cid of new Set(places.map((p) => p.cluster))) {
    const c = CLUSTERS[cid];
    if (c.season) notes.push(`${c.name}: ${c.season}`);
    if (c.permit && !permits.some((x) => x.startsWith(c.state))) permits.push(`${c.state}: ${c.permit}`);
  }
  const longest = days.reduce((m, d) => Math.max(m, d.driveHours), 0);
  if (longest >= 8) notes.push(`Your longest day has ~${fmtH(longest)} on the road; hill roads are slow, so start at dawn.`);
  if (monsoon) notes.push('Monsoon trip: expect heavy rain and occasional landslides; keep plans flexible.');
  if (input.styles.includes('pets')) notes.push('Pets: cats and birds are most welcome at XTSY; dogs depend on breed and size — ask the desk about any extra charges. Partner stays elsewhere have their own pet rules.');

  return {
    input: { ...input, days: target, placeIds: places.map((p) => p.id) },
    days,
    driveHours: r1(days.reduce((s, d) => s + d.driveHours, 0)),
    km: days.reduce((s, d) => s + d.km, 0),
    nightsAtXtsy: days.filter((d) => d.atXtsy).length,
    dropped,
    added,
    notes,
    permits,
  };
}

export function planToText(plan: Plan): string {
  const lines = plan.days.map((d) => `Day ${d.n}: ${d.title} — ${d.stops.join('; ')} | Night: ${d.overnight}`);
  return `${plan.input.days}-day trip for ${plan.input.travellers} (planned with the XTSY trip assistant)\n${lines.join('\n')}\n~${plan.driveHours} h on the road in total`;
}
