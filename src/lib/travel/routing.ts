/**
 * Drive-time estimates for the trip assistant.
 *
 * Long legs use a curated hub graph (real road corridors with typical hill
 * speeds, plus Guwahati flights where they beat driving); short hops inside a
 * cluster use straight-line distance with a hill-road winding factor.
 */
import { CLUSTERS, PLACE_BY_ID, XTSY, type HubId, type Place } from './places';

export interface Point { lat: number; lng: number; hub?: HubId; label: string; clusterId?: string }
export interface Seg { from: string; to: string; km: number; hours: number; flight: boolean }
export interface Leg { km: number; hours: number; via: string[]; flight: boolean; segs: Seg[] }

export const HUBS: Record<HubId, { name: string; lat: number; lng: number; airport?: string }> = {
  xtsy: { name: 'XTSY, New Shillong', lat: XTSY.lat, lng: XTSY.lng },
  shillong: { name: 'Shillong', lat: 25.576, lng: 91.883 },
  gau: { name: 'Guwahati airport', lat: 26.106, lng: 91.586, airport: 'Guwahati (GAU)' },
  guwahati: { name: 'Guwahati', lat: 26.144, lng: 91.736 },
  sohra: { name: 'Sohra', lat: 25.284, lng: 91.721 },
  dawki: { name: 'Dawki', lat: 25.186, lng: 92.020 },
  jowai: { name: 'Jowai', lat: 25.450, lng: 92.200 },
  nongstoin: { name: 'Nongstoin', lat: 25.517, lng: 91.269 },
  tura: { name: 'Tura', lat: 25.514, lng: 90.203 },
  baghmara: { name: 'Baghmara', lat: 25.199, lng: 90.634 },
  kaziranga: { name: 'Kaziranga (Kohora)', lat: 26.580, lng: 93.410 },
  jorhat: { name: 'Jorhat', lat: 26.750, lng: 94.203, airport: 'Jorhat (JRH)' },
  majuli: { name: 'Majuli', lat: 26.950, lng: 94.170 },
  tezpur: { name: 'Tezpur', lat: 26.633, lng: 92.800 },
  bhalukpong: { name: 'Bhalukpong', lat: 27.013, lng: 92.650 },
  dirang: { name: 'Dirang', lat: 27.358, lng: 92.241 },
  tawang: { name: 'Tawang', lat: 27.586, lng: 91.865 },
  itanagar: { name: 'Itanagar', lat: 27.084, lng: 93.605 },
  ziro: { name: 'Ziro', lat: 27.546, lng: 93.831 },
  dimapur: { name: 'Dimapur', lat: 25.906, lng: 93.727, airport: 'Dimapur (DMU)' },
  kohima: { name: 'Kohima', lat: 25.670, lng: 94.110 },
  imphal: { name: 'Imphal', lat: 24.817, lng: 93.937, airport: 'Imphal (IMF)' },
  silchar: { name: 'Silchar', lat: 24.833, lng: 92.779 },
  aizawl: { name: 'Aizawl', lat: 23.727, lng: 92.718, airport: 'Aizawl (AJL)' },
  agartala: { name: 'Agartala', lat: 23.831, lng: 91.286, airport: 'Agartala (IXA)' },
  siliguri: { name: 'Siliguri / Bagdogra', lat: 26.727, lng: 88.395, airport: 'Bagdogra (IXB)' },
  gangtok: { name: 'Gangtok', lat: 27.339, lng: 88.606 },
};

// [a, b, km, hours, flight?]
const EDGES: [HubId, HubId, number, number, boolean?][] = [
  ['xtsy', 'shillong', 12, 0.5], ['xtsy', 'guwahati', 105, 3], ['shillong', 'guwahati', 100, 3],
  ['guwahati', 'gau', 22, 0.75], ['xtsy', 'gau', 125, 3.25], ['shillong', 'gau', 120, 3.25],
  ['shillong', 'sohra', 55, 1.75], ['xtsy', 'sohra', 65, 2], ['xtsy', 'dawki', 80, 2.5], ['shillong', 'dawki', 82, 2.75],
  ['xtsy', 'jowai', 60, 1.5], ['jowai', 'dawki', 60, 2], ['shillong', 'nongstoin', 90, 2.75],
  ['nongstoin', 'tura', 210, 6.5], ['guwahati', 'tura', 220, 5.5], ['tura', 'baghmara', 110, 4],
  // Southern border road (Mawsynram–Balat–Maheshkhola): slow, but the shortest way to Baghmara.
  ['shillong', 'baghmara', 260, 9], ['guwahati', 'baghmara', 230, 8.5],
  ['guwahati', 'kaziranga', 195, 4.5], ['kaziranga', 'jorhat', 95, 2], ['jorhat', 'majuli', 25, 1.5],
  ['guwahati', 'tezpur', 180, 4], ['tezpur', 'kaziranga', 75, 1.5], ['tezpur', 'bhalukpong', 60, 1.5],
  ['bhalukpong', 'dirang', 140, 4.5], ['dirang', 'tawang', 135, 4.5], ['guwahati', 'itanagar', 320, 7.5],
  ['tezpur', 'itanagar', 170, 4], ['itanagar', 'ziro', 115, 4], ['kaziranga', 'dimapur', 160, 3.5],
  ['guwahati', 'dimapur', 280, 6.5], ['dimapur', 'kohima', 75, 2.5], ['kohima', 'imphal', 140, 4.5],
  ['jowai', 'silchar', 155, 5], ['silchar', 'aizawl', 180, 6], ['silchar', 'agartala', 260, 8], ['silchar', 'imphal', 250, 8],
  ['guwahati', 'siliguri', 450, 10], ['siliguri', 'gangtok', 115, 4],
  // Flights from Guwahati (hours include check-in and airport transfers).
  ['gau', 'imphal', 0, 3.5, true], ['gau', 'aizawl', 0, 3.5, true], ['gau', 'agartala', 0, 3.5, true],
  ['gau', 'siliguri', 0, 3.5, true], ['gau', 'dimapur', 0, 3.5, true],
];

const ADJ: Record<string, { to: HubId; km: number; h: number; flight: boolean }[]> = {};
for (const [a, b, km, h, f] of EDGES) {
  (ADJ[a] ??= []).push({ to: b, km, h, flight: !!f });
  (ADJ[b] ??= []).push({ to: a, km, h, flight: !!f });
}

const R = 6371;
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const round = (h: number) => Math.round(h * 4) / 4;

/** Local hop on hill roads: winding factor 1.5, ~28 km/h average. */
function localHop(a: { lat: number; lng: number }, b: { lat: number; lng: number }): Leg {
  const straight = haversineKm(a, b);
  // Short hops wind more (town roads, switchbacks); add a little time to park and set off.
  const km = straight * (straight < 15 ? 2 : 1.5);
  const hours = round(km / 28 + (straight > 0.5 ? 0.15 : 0));
  return { km: Math.round(km), hours, via: [], flight: false, segs: [{ from: '', to: '', km: Math.round(km), hours, flight: false }] };
}

function dijkstra(from: HubId, to: HubId): Leg {
  if (from === to) return { km: 0, hours: 0, via: [], flight: false, segs: [] };
  const dist: Record<string, number> = { [from]: 0 };
  const prev: Record<string, { hub: HubId; km: number; flight: boolean }> = {};
  const done = new Set<string>();
  while (true) {
    let u: HubId | null = null;
    for (const k of Object.keys(dist)) if (!done.has(k) && (u === null || dist[k] < dist[u])) u = k as HubId;
    if (u === null) break;
    if (u === to) break;
    done.add(u);
    for (const e of ADJ[u] ?? []) {
      const nd = dist[u] + e.h;
      if (dist[e.to] === undefined || nd < dist[e.to]) { dist[e.to] = nd; prev[e.to] = { hub: u, km: e.km, flight: e.flight }; }
    }
  }
  if (dist[to] === undefined) {
    const h = localHop(HUBS[from], HUBS[to]);
    return h;
  }
  let km = 0; let flight = false; const via: string[] = []; const segs: Seg[] = []; let cur: HubId = to;
  while (cur !== from) {
    const p = prev[cur];
    km += p.km; flight = flight || p.flight; via.unshift(HUBS[cur].name);
    segs.unshift({ from: HUBS[p.hub].name, to: HUBS[cur].name, km: p.km, hours: round(dist[cur] - dist[p.hub]), flight: p.flight });
    cur = p.hub;
  }
  return { km, hours: round(dist[to]), via: via.slice(0, -1), flight, segs };
}

const CLUSTER_ACCESS: Record<string, HubId[]> = {
  shillong: ['xtsy', 'shillong'], sohra: ['sohra'], 'east-khasi': ['dawki'], jaintia: ['jowai'], 'west-khasi': ['nongstoin'],
  garo: ['tura', 'baghmara'], guwahati: ['guwahati'], kaziranga: ['kaziranga'], majuli: ['majuli'], tawang: ['dirang', 'tawang'],
  ziro: ['ziro'], nagaland: ['kohima'], manipur: ['imphal'], mizoram: ['aizawl'], tripura: ['agartala'], sikkim: ['gangtok'],
};

export const pointOfHub = (hub: HubId): Point => ({ ...HUBS[hub], hub, label: HUBS[hub].name });
export const pointOfPlace = (p: Place): Point => ({ lat: p.lat, lng: p.lng, label: p.name, clusterId: p.cluster });

function accessHub(pt: Point): HubId {
  if (pt.hub) return pt.hub;
  const hubs = CLUSTER_ACCESS[pt.clusterId ?? ''] ?? (Object.keys(HUBS) as HubId[]);
  return hubs.reduce((best, h) => (haversineKm(pt, HUBS[h]) < haversineKm(pt, HUBS[best]) ? h : best), hubs[0]);
}

/** Estimated road (or flight) time between any two points. */
export function travel(a: Point, b: Point): Leg {
  if (a.clusterId && a.clusterId === b.clusterId) { const h = localHop(a, b); return { ...h, segs: [{ ...h.segs[0], from: a.label, to: b.label }] }; }
  const ha = accessHub(a);
  const hb = accessHub(b);
  const first = a.hub ? null : localHop(a, HUBS[ha]);
  const last = b.hub ? null : localHop(HUBS[hb], b);
  const mid = dijkstra(ha, hb);
  const segs: Seg[] = [
    ...(first && first.km ? [{ ...first.segs[0], from: a.label, to: HUBS[ha].name }] : []),
    ...mid.segs,
    ...(last && last.km ? [{ ...last.segs[0], from: HUBS[hb].name, to: b.label }] : []),
  ];
  // Day-trip clusters are reached straight from XTSY; skip the hub detour if a direct hop is shorter.
  const total: Leg = { km: (first?.km ?? 0) + mid.km + (last?.km ?? 0), hours: round((first?.hours ?? 0) + mid.hours + (last?.hours ?? 0)), via: mid.via, flight: mid.flight, segs };
  // Straight hops only from XTSY / Shillong town (the hills between other clusters have no direct roads).
  if (!mid.flight && (a.hub === 'xtsy' || a.hub === 'shillong' || b.hub === 'xtsy' || b.hub === 'shillong') && haversineKm(a, b) < 45) {
    const direct = localHop(a, b);
    if (direct.hours < total.hours) return { ...direct, segs: [{ ...direct.segs[0], from: a.label, to: b.label }] };
  }
  return total;
}

export const XTSY_POINT: Point = pointOfHub('xtsy');
export const fromXtsy = (placeId: string): Leg => travel(XTSY_POINT, pointOfPlace(PLACE_BY_ID[placeId]));
export const clusterOf = (placeId: string) => CLUSTERS[PLACE_BY_ID[placeId].cluster];

/** Airports a trip can end at, with the hub each one sits on. */
export const EXIT_GATEWAYS: HubId[] = ['gau', 'dimapur', 'imphal', 'agartala', 'aizawl', 'siliguri', 'jorhat'];
