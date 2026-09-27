/**
 * Travel knowledge base for the XTSY trip assistant.
 *
 * Every place has approximate coordinates, the cluster it belongs to, how long
 * a visit takes and a few facts. Clusters decide where a traveller can sleep:
 * the Shillong-region clusters are day trips from XTSY Travellers Hostel
 * (New Shillong Township, XTSY's only own property); everything further out
 * uses a partner stay in the cluster's base town, booked by the XTSY desk.
 *
 * Coordinates and drive times are planning estimates, not navigation data.
 */

export type ClusterId =
  | 'shillong' | 'sohra' | 'east-khasi' | 'jaintia' | 'west-khasi' | 'garo'
  | 'guwahati' | 'kaziranga' | 'majuli' | 'tawang' | 'ziro' | 'nagaland' | 'manipur'
  | 'mizoram' | 'tripura' | 'sikkim';

export type HubId =
  | 'xtsy' | 'shillong' | 'gau' | 'guwahati' | 'sohra' | 'dawki' | 'jowai' | 'nongstoin'
  | 'tura' | 'baghmara' | 'kaziranga' | 'jorhat' | 'majuli' | 'tezpur' | 'bhalukpong'
  | 'dirang' | 'tawang' | 'itanagar' | 'ziro' | 'dimapur' | 'kohima' | 'imphal'
  | 'silchar' | 'aizawl' | 'agartala' | 'siliguri' | 'gangtok';

export interface Cluster {
  id: ClusterId;
  name: string;
  /** Short label for titles. */
  short: string;
  state: string;
  /** Hub the cluster's overnight stay is in. */
  base: HubId;
  /** Where travellers sleep in this cluster. */
  stay: string;
  /** True when the whole cluster is a comfortable day trip from XTSY. */
  dayTripFromXtsy: boolean;
  permit?: string;
  season?: string;
}

export interface Place {
  id: string;
  name: string;
  aliases: string[];
  cluster: ClusterId;
  lat: number;
  lng: number;
  /** Hours on the ground (walks, viewpoints, treks). */
  visit: number;
  tags: string[];
  note?: string;
  /** Needs a whole day by itself (big treks, canyon expeditions). */
  fullDay?: boolean;
}

export const XTSY = {
  name: 'XTSY Travellers Hostel',
  area: 'New Shillong Township',
  address: 'Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya 793018',
  lat: 25.535,
  lng: 91.965,
};

export const CLUSTERS: Record<ClusterId, Cluster> = {
  shillong: { id: 'shillong', short: 'Shillong', name: 'Shillong & around', state: 'Meghalaya', base: 'xtsy', stay: 'XTSY Travellers Hostel, New Shillong Township (our own stay)', dayTripFromXtsy: true },
  sohra: { id: 'sohra', short: 'Cherrapunji', name: 'Cherrapunji (Sohra)', state: 'Meghalaya', base: 'xtsy', stay: 'XTSY Travellers Hostel, New Shillong Township (our own stay)', dayTripFromXtsy: true, season: 'Waterfalls peak June–September; clearest views October–March.' },
  'east-khasi': { id: 'east-khasi', short: 'Dawki', name: 'Dawki, Mawlynnong & Shnongpdeng', state: 'Meghalaya', base: 'xtsy', stay: 'XTSY Travellers Hostel, New Shillong Township (our own stay), or a partner riverside camp at Dawki', dayTripFromXtsy: true, season: 'The Umngot is glass-clear November–April; in the monsoon it turns muddy and boating can stop.' },
  jaintia: { id: 'jaintia', short: 'Jowai', name: 'Jowai & the Jaintia Hills', state: 'Meghalaya', base: 'xtsy', stay: 'XTSY Travellers Hostel, New Shillong Township (our own stay)', dayTripFromXtsy: true },
  'west-khasi': { id: 'west-khasi', short: 'West Khasi Hills', name: 'West Khasi Hills', state: 'Meghalaya', base: 'nongstoin', stay: 'Partner homestay near Nongstoin (booked by XTSY)', dayTripFromXtsy: false, season: 'Roads are slow in the monsoon; October–April is easiest.' },
  garo: { id: 'garo', short: 'Garo Hills', name: 'Garo Hills (Tura, Siju, Baghmara, Wari Chora)', state: 'Meghalaya', base: 'baghmara', stay: 'Partner guesthouse in Tura or Baghmara (booked by XTSY)', dayTripFromXtsy: false, season: 'Wari Chora boat rides need the dry season (November–March).' },
  guwahati: { id: 'guwahati', short: 'Guwahati', name: 'Guwahati', state: 'Assam', base: 'guwahati', stay: 'Partner hotel in Guwahati (booked by XTSY)', dayTripFromXtsy: false },
  kaziranga: { id: 'kaziranga', short: 'Kaziranga', name: 'Kaziranga National Park', state: 'Assam', base: 'kaziranga', stay: 'Partner lodge at Kohora, Kaziranga (booked by XTSY)', dayTripFromXtsy: false, season: 'Safaris usually run November–April; the park closes in the monsoon.' },
  majuli: { id: 'majuli', short: 'Majuli', name: 'Majuli river island', state: 'Assam', base: 'majuli', stay: 'Partner bamboo cottage on Majuli (booked by XTSY)', dayTripFromXtsy: false },
  tawang: { id: 'tawang', short: 'Tawang', name: 'Western Arunachal (Dirang, Sela, Tawang)', state: 'Arunachal Pradesh', base: 'tawang', stay: 'Partner stays in Dirang and Tawang (booked by XTSY)', dayTripFromXtsy: false, permit: 'Indian travellers need an Arunachal Inner Line Permit (ILP); foreign nationals need a Protected Area Permit. Bumla needs a separate army permit.', season: 'April–June and October–November are best; Sela Pass can shut with snow December–February.' },
  ziro: { id: 'ziro', short: 'Ziro', name: 'Ziro Valley', state: 'Arunachal Pradesh', base: 'ziro', stay: 'Partner homestay in Ziro (booked by XTSY)', dayTripFromXtsy: false, permit: 'Arunachal ILP (Indians) or PAP (foreign nationals) needed.', season: 'Ziro Festival of Music is in late September.' },
  nagaland: { id: 'nagaland', short: 'Kohima', name: 'Kohima & Dzukou', state: 'Nagaland', base: 'kohima', stay: 'Partner homestay in Kohima (booked by XTSY)', dayTripFromXtsy: false, permit: 'Indian travellers need a Nagaland ILP (online).', season: 'Hornbill Festival runs 1–10 December; Dzukou lilies bloom June–July.' },
  manipur: { id: 'manipur', short: 'Imphal', name: 'Imphal & Loktak Lake', state: 'Manipur', base: 'imphal', stay: 'Partner hotel in Imphal (booked by XTSY)', dayTripFromXtsy: false, permit: 'Indian travellers need a Manipur ILP. Check current travel advisories before booking.' },
  mizoram: { id: 'mizoram', short: 'Aizawl', name: 'Aizawl', state: 'Mizoram', base: 'aizawl', stay: 'Partner hotel in Aizawl (booked by XTSY)', dayTripFromXtsy: false, permit: 'Indian travellers need a Mizoram ILP.' },
  tripura: { id: 'tripura', short: 'Agartala', name: 'Agartala & Unakoti', state: 'Tripura', base: 'agartala', stay: 'Partner hotel in Agartala (booked by XTSY)', dayTripFromXtsy: false },
  sikkim: { id: 'sikkim', short: 'Gangtok', name: 'Gangtok & Sikkim', state: 'Sikkim', base: 'gangtok', stay: 'Partner hotel in Gangtok (booked by XTSY)', dayTripFromXtsy: false, permit: 'Tsomgo, Nathula and North Sikkim need local permits (arranged with the stay); foreign nationals need a Restricted Area Permit.' },
};

const P = (id: string, name: string, cluster: ClusterId, lat: number, lng: number, visit: number, tags: string[], aliases: string[] = [], extra: Partial<Place> = {}): Place =>
  ({ id, name, cluster, lat, lng, visit, tags, aliases, ...extra });

export const PLACES: Place[] = [
  // Shillong & around (from XTSY: 0–1 h)
  P('shillong', 'Shillong city', 'shillong', 25.576, 91.883, 3, ['culture', 'food', 'shopping'], ['shillong', 'police bazaar', 'bara bazaar', 'wards lake', "ward's lake"]),
  P('umiam', 'Umiam Lake', 'shillong', 25.658, 91.887, 1.5, ['lake', 'kayaking', 'sunset', 'photography'], ['umiam', 'barapani', 'bara pani']),
  P('elephant-falls', 'Elephant Falls', 'shillong', 25.539, 91.821, 1, ['waterfall'], ['elephant falls', 'elephant fall']),
  P('shillong-peak', 'Shillong Peak', 'shillong', 25.545, 91.871, 1, ['viewpoint'], ['shillong peak']),
  P('laitlum', 'Laitlum Canyons', 'shillong', 25.463, 91.952, 2, ['viewpoint', 'sunrise', 'trekking', 'photography'], ['laitlum', 'lait lum']),
  P('mawphlang', 'Mawphlang Sacred Forest', 'shillong', 25.447, 91.756, 2, ['culture', 'forest', 'nature'], ['mawphlang', 'sacred forest', 'sacred grove']),
  P('don-bosco', 'Don Bosco Museum', 'shillong', 25.572, 91.899, 1.5, ['culture', 'museum'], ['don bosco']),
  P('mawjymbuin', 'Mawjymbuin Cave, Mawsynram', 'sohra', 25.297, 91.583, 1.5, ['cave'], ['mawsynram', 'mawjymbuin']),
  // Sohra
  P('sohra', 'Cherrapunji (Sohra)', 'sohra', 25.284, 91.721, 1, ['waterfall', 'viewpoint'], ['cherrapunji', 'cherrapunjee', 'cherra', 'sohra']),
  P('nohkalikai', 'Nohkalikai Falls', 'sohra', 25.275, 91.688, 1, ['waterfall', 'viewpoint'], ['nohkalikai', 'nohkalikai falls']),
  P('seven-sisters', 'Seven Sisters Falls', 'sohra', 25.257, 91.733, 0.75, ['waterfall'], ['seven sisters', 'seven sister', 'nohsngithiang']),
  P('mawsmai', 'Mawsmai Cave', 'sohra', 25.247, 91.728, 1, ['cave'], ['mawsmai']),
  P('arwah', 'Arwah Cave', 'sohra', 25.296, 91.715, 1.5, ['cave'], ['arwah']),
  P('wei-sawdong', 'Wei Sawdong Falls', 'sohra', 25.292, 91.743, 2, ['waterfall', 'trekking'], ['wei sawdong', 'weisawdong']),
  P('dainthlen', 'Dainthlen Falls', 'sohra', 25.303, 91.717, 0.75, ['waterfall'], ['dainthlen']),
  P('nongriat', 'Double Decker Root Bridge, Nongriat', 'sohra', 25.241, 91.678, 6.5, ['trekking', 'root bridge'], ['nongriat', 'double decker', 'double-decker', 'root bridge', 'living root bridge', 'tyrna', 'rainbow falls'], { fullDay: true, note: 'About 3,500 steps down from Tyrna and back up; start by 7 AM.' }),
  P('mawkdok', 'Mawkdok Dympep Valley', 'sohra', 25.393, 91.767, 0.75, ['viewpoint', 'ziplining'], ['mawkdok', 'dympep']),
  // Dawki / Mawlynnong / Shnongpdeng
  P('dawki', 'Dawki & the Umngot River', 'east-khasi', 25.186, 92.020, 2.5, ['river', 'boating', 'kayaking', 'border'], ['dawki', 'umngot', 'umngot river']),
  P('shnongpdeng', 'Shnongpdeng', 'east-khasi', 25.184, 92.006, 3, ['river', 'kayaking', 'camping', 'cliff jumping'], ['shnongpdeng', 'shnong pdeng']),
  P('mawlynnong', 'Mawlynnong village', 'east-khasi', 25.202, 91.916, 2, ['culture', 'village', 'root bridge'], ['mawlynnong', 'cleanest village', 'riwai']),
  // Jaintia
  P('krang-suri', 'Krang Suri Falls', 'jaintia', 25.241, 92.185, 2, ['waterfall', 'swimming'], ['krang suri', 'krang shuri', 'krangsuri']),
  P('jowai', 'Jowai & Thadlaskein Lake', 'jaintia', 25.450, 92.200, 1.5, ['culture', 'lake'], ['jowai', 'thadlaskein']),
  P('nartiang', 'Nartiang Monoliths', 'jaintia', 25.570, 92.213, 1, ['culture', 'history'], ['nartiang', 'monoliths']),
  P('phe-phe', 'Phe Phe Falls', 'jaintia', 25.330, 92.140, 2, ['waterfall', 'trekking'], ['phe phe', 'phephe']),
  // West Khasi Hills
  P('nongkhnum', 'Nongkhnum River Island', 'west-khasi', 25.640, 91.180, 3, ['river', 'camping'], ['nongkhnum']),
  P('langshiang', 'Langshiang Falls', 'west-khasi', 25.577, 91.136, 2, ['waterfall'], ['langshiang']),
  P('mawphanlur', 'Mawphanlur', 'west-khasi', 25.480, 91.370, 2, ['lake', 'camping', 'viewpoint'], ['mawphanlur']),
  // Garo Hills
  P('tura', 'Tura & Tura Peak', 'garo', 25.514, 90.203, 2, ['viewpoint', 'culture'], ['tura', 'tura peak']),
  P('nokrek', 'Nokrek National Park', 'garo', 25.676, 90.317, 5, ['wildlife', 'trekking'], ['nokrek'], { fullDay: true }),
  P('daribokgre', 'Daribokgre village', 'garo', 25.600, 90.320, 3, ['village', 'culture'], ['daribokgre']),
  P('siju', 'Siju Cave & Simsang River', 'garo', 25.352, 90.686, 2.5, ['cave'], ['siju', 'simsang']),
  P('wari-chora', 'Wari Chora canyon', 'garo', 25.300, 90.560, 8, ['canyon', 'boating', 'trekking', 'adventure'], ['wari chora', 'warichora', 'wari-chora', 'rongrenggiri'], { fullDay: true, note: 'Remote canyon near Baghmara: guided jungle walk plus a wooden-boat ride through the gorge. Needs a local guide.' }),
  P('balpakram', 'Balpakram National Park', 'garo', 25.323, 90.862, 6, ['wildlife', 'canyon'], ['balpakram'], { fullDay: true }),
  P('baghmara', 'Baghmara', 'garo', 25.199, 90.634, 1, ['river'], ['baghmara']),
  // Assam
  P('guwahati', 'Guwahati & Kamakhya Temple', 'guwahati', 26.166, 91.705, 3, ['culture', 'temple'], ['guwahati', 'kamakhya', 'brahmaputra']),
  P('kaziranga', 'Kaziranga National Park', 'kaziranga', 26.580, 93.410, 6, ['wildlife', 'safari'], ['kaziranga', 'rhino'], { fullDay: true }),
  P('majuli', 'Majuli river island', 'majuli', 26.950, 94.170, 6, ['culture', 'island'], ['majuli'], { fullDay: true }),
  // Arunachal
  P('dirang', 'Dirang valley', 'tawang', 27.358, 92.241, 2, ['valley', 'culture'], ['dirang', 'bomdila']),
  P('sela', 'Sela Pass', 'tawang', 27.503, 92.105, 1, ['viewpoint', 'snow'], ['sela', 'sela pass']),
  P('tawang', 'Tawang Monastery', 'tawang', 27.586, 91.865, 4, ['culture', 'monastery', 'snow'], ['tawang']),
  P('bumla', 'Bumla Pass', 'tawang', 27.740, 91.910, 6, ['snow', 'border'], ['bumla', 'bum la', 'madhuri lake', 'sangetsar'], { fullDay: true, note: 'Needs an army permit arranged in Tawang the day before.' }),
  P('ziro', 'Ziro Valley', 'ziro', 27.546, 93.831, 5, ['valley', 'culture', 'festival'], ['ziro', 'apatani'], { fullDay: true }),
  // Nagaland
  P('kohima', 'Kohima & Kisama (Hornbill)', 'nagaland', 25.670, 94.110, 4, ['culture', 'festival', 'history'], ['kohima', 'hornbill', 'kisama']),
  P('khonoma', 'Khonoma green village', 'nagaland', 25.651, 94.024, 3, ['village', 'culture'], ['khonoma']),
  P('dzukou', 'Dzukou Valley trek', 'nagaland', 25.558, 94.068, 8, ['trekking', 'valley'], ['dzukou', 'dzukou valley'], { fullDay: true }),
  // Manipur, Mizoram, Tripura
  P('imphal', 'Imphal', 'manipur', 24.817, 93.937, 4, ['culture', 'history'], ['imphal', 'manipur']),
  P('loktak', 'Loktak Lake', 'manipur', 24.550, 93.780, 4, ['lake'], ['loktak', 'keibul lamjao']),
  P('aizawl', 'Aizawl', 'mizoram', 23.727, 92.718, 4, ['culture'], ['aizawl', 'mizoram']),
  P('agartala', 'Agartala & Ujjayanta Palace', 'tripura', 23.831, 91.286, 4, ['culture', 'palace'], ['agartala', 'tripura', 'ujjayanta']),
  P('unakoti', 'Unakoti rock carvings', 'tripura', 24.320, 92.070, 3, ['history'], ['unakoti']),
  // Sikkim
  P('gangtok', 'Gangtok', 'sikkim', 27.339, 88.606, 4, ['culture', 'mountains'], ['gangtok', 'sikkim', 'mg marg']),
  P('tsomgo', 'Tsomgo Lake & Nathula', 'sikkim', 27.375, 88.763, 6, ['lake', 'snow'], ['tsomgo', 'changu', 'nathula', 'nathu la'], { fullDay: true }),
  P('lachung', 'Lachung & Yumthang', 'sikkim', 27.690, 88.743, 8, ['valley', 'snow'], ['lachung', 'yumthang', 'north sikkim', 'gurudongmar'], { fullDay: true }),
  P('pelling', 'Pelling', 'sikkim', 27.300, 88.240, 4, ['mountains', 'monastery'], ['pelling']),
];

export const PLACE_BY_ID: Record<string, Place> = Object.fromEntries(PLACES.map((p) => [p.id, p]));
