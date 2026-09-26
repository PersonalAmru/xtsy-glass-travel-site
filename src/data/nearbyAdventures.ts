/** Curated nearby trip ideas for existing Assam and Meghalaya city guides. */
export interface NearbyAdventure {
  label: string;
  detail: string;
  href: string;
}

export const NEARBY_ADVENTURES: Record<string, NearbyAdventure[]> = {
  shillong: [
    { label: 'Laitlum Canyons', detail: 'Canyon viewpoints and walking routes outside Shillong.', href: '/destinations/meghalaya/shillong' },
    { label: 'Mawphlang Sacred Forest', detail: 'Guided forest walks from a Shillong base.', href: '/things-to-do-in-meghalaya' },
    { label: 'Meghalaya loop', detail: 'Continue by motorbike or 4x4 to Dawki, Mawlynnong and Cherrapunji.', href: '/expeditions/motorbike/meghalaya-loop' },
  ],
  cherrapunji: [
    { label: 'Nongriat root bridge trek', detail: 'A full-day descent and return through the Khasi Hills.', href: '/things-to-do-in-meghalaya' },
    { label: 'Caves and waterfalls near Sohra', detail: 'Explore the Mawsmai cave area and waterfall viewpoints.', href: '/destinations/meghalaya/cherrapunji' },
  ],
  dawki: [
    { label: 'Umngot River at Dawki', detail: 'Boating and river scenery around Dawki and Shnongpdeng.', href: '/destinations/meghalaya/dawki' },
    { label: 'XTSY Adventure Campsite', detail: 'Riverside camping near the Umngot.', href: '/xtsy-adventure-campsite-dawki' },
  ],
  mawlynnong: [
    { label: 'Riwai living root bridge', detail: 'A short walk from Mawlynnong through the village area.', href: '/destinations/meghalaya/mawlynnong' },
    { label: 'Meghalaya road circuit', detail: 'Link Mawlynnong with Dawki and Cherrapunji.', href: '/expeditions/4x4/meghalaya-loop' },
  ],
  jowai: [
    { label: 'Krang Suri Falls', detail: 'A Jaintia Hills waterfall outing from Jowai.', href: '/destinations/meghalaya/jowai' },
    { label: 'Meghalaya activity guide', detail: 'Compare waterfall walks, caving and river adventures.', href: '/things-to-do-in-meghalaya' },
  ],
  mawsynram: [
    { label: 'Mawjymbuin Cave', detail: 'A cave visit in the Mawsynram area.', href: '/destinations/meghalaya/mawsynram' },
    { label: 'Meghalaya caves', detail: 'Find more cave routes across the state.', href: '/meghalaya-caves' },
  ],
  nongstoin: [
    { label: 'Nongkhnum River Island', detail: 'River landscapes and a longer outing from Nongstoin.', href: '/destinations/meghalaya/nongstoin' },
    { label: 'Meghalaya activities', detail: 'Compare trails and natural sites before setting out.', href: '/things-to-do-in-meghalaya' },
  ],
  tura: [
    { label: 'Tura Peak and Garo Hills', detail: 'Forest and hill walks with Tura as your base.', href: '/destinations/meghalaya/tura' },
    { label: 'Meghalaya activity guide', detail: 'Plan other nature-focused stops across the state.', href: '/things-to-do-in-meghalaya' },
  ],
  guwahati: [
    { label: 'Brahmaputra river outings', detail: 'Explore river experiences from the Assam gateway.', href: '/destinations/assam' },
    { label: 'Guwahati to Shillong ride', detail: 'A 100 km road route into the Khasi Hills.', href: '/expeditions/motorbike/guwahati-to-shillong' },
    { label: 'Kaziranga and onward trips', detail: 'Use Guwahati as a starting point for an Assam circuit.', href: '/destinations/assam/kaziranga' },
  ],
  kaziranga: [
    { label: 'Kaziranga wildlife', detail: 'Seasonal park visits; check current opening dates before travelling.', href: '/destinations/assam' },
    { label: 'Assam onward routes', detail: 'Connect the park with Guwahati or the Majuli and Jorhat area.', href: '/destinations/assam' },
  ],
  majuli: [
    { label: 'Majuli river island', detail: 'Explore the island and its village landscapes from the Jorhat side.', href: '/destinations/assam' },
    { label: 'Jorhat gateway', detail: 'Plan the river crossing and nearby tea-estate region.', href: '/destinations/assam/jorhat' },
  ],
  jorhat: [
    { label: 'Majuli island trip', detail: 'Reach the Brahmaputra island via the Jorhat ferry area.', href: '/destinations/assam/majuli' },
    { label: 'Assam tea landscape', detail: 'Explore the tea-growing region around Jorhat.', href: '/destinations/assam' },
  ],
};