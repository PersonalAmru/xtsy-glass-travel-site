/**
 * PHASE 2 — State hub page content.
 * Editorial content for /destinations/:state. Structure lives in neTaxonomy.ts.
 * Facts here are deliberately conservative (no pricing, no ratings) because
 * hub pages are informational, not bookable.
 */

export interface StateFaq {
  q: string;
  a: string;
}

export interface StayLink {
  label: string;
  href: string;
  note: string;
}

export interface StateContent {
  /** 1–2 sentence direct answer used for AI citation + speakable. */
  quickAnswer: string;
  overview: string[];
  bestTime: { window: string; detail: string }[];
  howToReach: string[];
  highlights: string[];
  stays: StayLink[];
  faqs: StateFaq[];
  permitNote?: string;
}

const XTSY_STAYS: StayLink[] = [
  {
    label: 'XTSY Travellers Hostel, Shillong',
    href: '/best-hostel-in-shillong',
    note: 'Mixed dorms from ₹369 per bed/night plus private rooms, in New Shillong Township.',
  },
  {
    label: 'XTSY 270 — glamping & private stays',
    href: '/xtsy-270',
    note: 'Valley-view glamping and premium rooms for couples and small groups.',
  },
  {
    label: 'Meghalaya tour packages by XTSY Travel',
    href: '/meghalaya-tour-packages',
    note: 'Guided multi-day itineraries with transport, stays and local guides.',
  },
  {
    label: 'Check live availability & book direct',
    href: '/book',
    note: 'Direct booking — no OTA commission, instant confirmation on WhatsApp.',
  },
];

const REGIONAL_STAYS: StayLink[] = [
  {
    label: 'Base yourself at XTSY Travellers Hostel, Shillong',
    href: '/best-hostel-in-shillong',
    note: 'Most Northeast circuits route through Guwahati and Shillong — a cheap, central base between legs.',
  },
  {
    label: 'XTSY Travel custom Northeast itineraries',
    href: '/tours',
    note: 'Multi-state routes with transport, permits assistance and local partner stays.',
  },
  {
    label: 'Talk to XTSY about logistics',
    href: '/book',
    note: 'Transport, driver and stay planning for onward states from Meghalaya.',
  },
];

export const STATE_CONTENT: Record<string, StateContent> = {
  meghalaya: {
    quickAnswer:
      'Meghalaya is best visited between September and April, entered via Guwahati airport (GAU, ~100 km from Shillong), and is known for Nohkalikai Falls, the Umngot river at Dawki, living root bridges and Mawlynnong village. No permit is required for Indian travellers.',
    overview: [
      'Meghalaya — "the abode of clouds" — sits on a plateau above the Assam plains and holds the two rainiest inhabited places on earth, Mawsynram and Cherrapunji. The state splits into the Khasi, Jaintia and Garo hills, each with its own language, cuisine and matrilineal traditions.',
      'Most trips are built around Shillong as a base, with day runs to Cherrapunji for waterfalls and caves, Dawki and Shnongpdeng for the glass-clear Umngot river, and Mawlynnong and Nongriat for villages and living root bridges. A comfortable first trip is 4–6 days.',
    ],
    bestTime: [
      { window: 'October – April', detail: 'Clearest skies, best river visibility at Dawki, easiest trekking. Peak season is Oct–Jan.' },
      { window: 'June – September', detail: 'Monsoon. Waterfalls are at full force, but roads, treks and river boating are unreliable.' },
      { window: 'May', detail: 'Shoulder month — warm, green, occasional pre-monsoon storms, lower crowds and rates.' },
    ],
    howToReach: [
      'By air: Guwahati (GAU) is the practical gateway — roughly 3 hours by road to Shillong. Shillong Airport at Umroi (SHL) has limited flights.',
      'By road: Shared sumos and private cabs run Guwahati–Shillong on NH6 all day; the last comfortable departure is around 16:00.',
      'By rail: Guwahati (GHY) is the nearest major railhead; continue by road to Shillong.',
      'Within the state: Self-drive and hired cars are the norm. Dawki, Cherrapunji and Mawlynnong are all 2–3 hour drives from Shillong.',
    ],
    highlights: [
      'Nohkalikai Falls — India’s tallest plunge waterfall',
      'Umngot river, Dawki & Shnongpdeng',
      'Double-decker living root bridge, Nongriat',
      'Mawlynnong — Asia’s cleanest village',
      'Krang Suri Falls, Jaintia Hills',
      'Laitlum Canyons & Umiam Lake near Shillong',
    ],
    stays: XTSY_STAYS,
    faqs: [
      { q: 'Do I need a permit to visit Meghalaya?', a: 'No Inner Line Permit is required for Indian citizens. Foreign nationals do not need an ILP either, but must register with the Foreigners Registration Office where required by their accommodation.' },
      { q: 'How many days are enough for Meghalaya?', a: '4 to 6 days covers Shillong, Cherrapunji, Dawki and Mawlynnong at a relaxed pace. 3 days is possible but rushed; 7+ days lets you add Jaintia Hills or the Garo Hills.' },
      { q: 'What is the best month to see the Umngot river clear?', a: 'November to March. The water runs clear once the monsoon silt settles, which is when boats appear to float on glass.' },
      { q: 'Where should I stay in Meghalaya?', a: 'Shillong is the most practical base for a first trip. XTSY Travellers Hostel offers mixed dorms and private rooms in the city, with XTSY 270 for glamping and premium stays.' },
      { q: 'Is Meghalaya safe for solo and female travellers?', a: 'Yes. Meghalaya is among the safer states in India for solo travel, with a matrilineal Khasi society and busy town centres. Standard precautions apply on remote night drives.' },
    ],
  },
  assam: {
    quickAnswer:
      'Assam is entered via Guwahati airport (GAU) and is best visited between November and April, when Kaziranga National Park is open for rhino safaris. It is the road and air gateway to every other Northeast state.',
    overview: [
      'Assam runs along the Brahmaputra valley and is the transport hub of Northeast India — nearly every trip to Meghalaya, Arunachal Pradesh or Nagaland starts at Guwahati. Its own draws are Kaziranga’s one-horned rhinos, the tea estates around Jorhat and Majuli, the world’s largest river island.',
      'Assam pairs naturally with Meghalaya: Guwahati to Shillong is a three-hour drive, so many travellers combine a Kaziranga safari with the Meghalaya waterfall circuit in a single week.',
    ],
    bestTime: [
      { window: 'November – April', detail: 'Dry, cool and the safari season at Kaziranga (the park typically closes during monsoon).' },
      { window: 'May – October', detail: 'Monsoon and Brahmaputra floods; Kaziranga is largely closed and road travel is slower.' },
    ],
    howToReach: [
      'By air: Lokpriya Gopinath Bordoloi International Airport, Guwahati (GAU) — the busiest airport in the region with direct flights from Delhi, Kolkata, Mumbai and Bengaluru.',
      'By rail: Guwahati (GHY) is a major junction on the Indian Railways network.',
      'By road: NH27 links Guwahati to Kaziranga (~4.5 hours) and Jorhat; NH6 runs south to Shillong (~3 hours).',
    ],
    highlights: ['Kaziranga National Park', 'Majuli river island', 'Kamakhya Temple, Guwahati', 'Assam tea estates around Jorhat', 'Brahmaputra river cruises'],
    stays: REGIONAL_STAYS,
    faqs: [
      { q: 'Do I need a permit for Assam?', a: 'No Inner Line Permit is required for Assam for Indian or foreign travellers.' },
      { q: 'How far is Shillong from Guwahati?', a: 'About 100 km on NH6, typically 3 hours by car. Shared sumos, buses and private cabs run through the day.' },
      { q: 'When is Kaziranga open?', a: 'Kaziranga generally opens for visitors from November and closes around late April or early May for the monsoon. Confirm dates with the forest department before booking.' },
    ],
  },
  'arunachal-pradesh': {
    quickAnswer:
      'Arunachal Pradesh requires an Inner Line Permit for Indian citizens and a Protected Area Permit for foreign nationals. It is reached via Guwahati, Tezpur or Itanagar (Donyi Polo, HGI), and is best visited March–October for Tawang and Ziro.',
    overview: [
      'Arunachal Pradesh is India’s largest Northeast state and the least travelled — high Himalayan passes, Buddhist monasteries in the west, and deep tribal river valleys in the east. Tawang, at over 3,000 m, holds India’s largest monastery and is reached over Sela Pass.',
      'Distances are long and roads are slow. A Tawang trip from Guwahati realistically needs 6–8 days; Ziro needs 4–5.',
    ],
    bestTime: [
      { window: 'March – June', detail: 'Clearest window for Tawang and Sela Pass; rhododendrons in bloom at altitude.' },
      { window: 'September – October', detail: 'Post-monsoon clarity, Ziro valley harvest season.' },
      { window: 'November – February', detail: 'Tawang is very cold and Sela Pass can close after snowfall.' },
    ],
    howToReach: [
      'By air: Donyi Polo Airport, Itanagar (HGI); Tezpur (TEZ) and Guwahati (GAU) are common entry points for the western circuit.',
      'By road: Guwahati → Tezpur → Bomdila → Dirang → Tawang is the standard western route, usually split over two driving days.',
      'By rail: Naharlagun and Guwahati are the practical railheads.',
    ],
    highlights: ['Tawang Monastery', 'Sela Pass and Madhuri Lake', 'Ziro valley and Apatani villages', 'Dirang hot springs', 'Namdapha National Park'],
    stays: REGIONAL_STAYS,
    permitNote:
      'Inner Line Permit (ILP) is mandatory for Indian citizens entering Arunachal Pradesh; foreign nationals need a Protected Area Permit (PAP), usually issued for groups. Permit rules and issuing channels change — always verify current requirements with the Arunachal Pradesh government before travel.',
    faqs: [
      { q: 'Do I need a permit for Arunachal Pradesh?', a: 'Yes. Indian citizens need an Inner Line Permit (ILP) and foreign nationals need a Protected Area Permit (PAP). Requirements and issuing channels change, so verify with the state government before you travel.' },
      { q: 'What is the nearest airport to Tawang?', a: 'There is no airport at Tawang. Travellers fly to Guwahati (GAU) or Tezpur (TEZ) and continue by road over Sela Pass, typically two days of driving.' },
      { q: 'When is the best time to visit Tawang?', a: 'March to June and September to October. Sela Pass can close after heavy snowfall in winter.' },
    ],
  },
  nagaland: {
    quickAnswer:
      'Nagaland requires an Inner Line Permit for Indian citizens. It is reached via Dimapur airport (DMU) and is best visited October–April, with the Hornbill Festival at Kisama held in the first week of December.',
    overview: [
      'Nagaland is hill country with 16 major tribes and some of the strongest living village culture in India. Kohima, the capital, is the base for the Dzukou Valley trek and the WWII war cemetery; Mokokchung is the Ao Naga heartland.',
      'The Hornbill Festival in the first week of December is the single biggest draw and books out months ahead.',
    ],
    bestTime: [
      { window: 'October – April', detail: 'Dry and cool. December brings the Hornbill Festival at Kisama, near Kohima.' },
      { window: 'May – September', detail: 'Monsoon; the Dzukou trek is slippery and leech-heavy.' },
    ],
    howToReach: [
      'By air: Dimapur Airport (DMU), then about 3 hours by road to Kohima.',
      'By rail: Dimapur is the only railway station in Nagaland.',
      'By road: NH29 connects Dimapur and Kohima; Guwahati to Dimapur is a long day’s drive.',
    ],
    highlights: ['Hornbill Festival, Kisama', 'Dzukou Valley trek', 'Kohima War Cemetery', 'Khonoma green village', 'Ao Naga villages around Mokokchung'],
    stays: REGIONAL_STAYS,
    permitNote:
      'An Inner Line Permit is required for Indian citizens visiting Nagaland; foreign nationals must register with the local Foreigners Registration Office. Exemptions and procedures vary by district — confirm current rules with the Nagaland government before travel.',
    faqs: [
      { q: 'Do I need a permit for Nagaland?', a: 'Indian citizens need an Inner Line Permit. Foreign nationals do not need an ILP but must register with the Foreigners Registration Office. Verify current district-level rules before travelling.' },
      { q: 'When is the Hornbill Festival?', a: 'It is held annually in the first week of December at the Naga Heritage Village, Kisama, about 12 km from Kohima. Accommodation books out well in advance.' },
      { q: 'What is the nearest airport to Kohima?', a: 'Dimapur (DMU), roughly 74 km and about 3 hours by road.' },
    ],
  },
  manipur: {
    quickAnswer:
      'Manipur is reached via Imphal airport (IMF) and is best visited October–March. Its signature sight is Loktak Lake, the only floating lake in the world, with Keibul Lamjao National Park on its phumdis.',
    overview: [
      'Manipur centres on the Imphal valley — Kangla Fort, the all-women Ima Keithel market and WWII battlefield history — with Loktak Lake and its floating phumdi islands an hour south at Moirang.',
      'Check current travel advisories before planning; conditions in parts of the state can change at short notice.',
    ],
    bestTime: [
      { window: 'October – March', detail: 'Dry, mild days; best light on Loktak Lake.' },
      { window: 'April – September', detail: 'Hot and then wet; lake and hill travel is less comfortable.' },
    ],
    howToReach: [
      'By air: Bir Tikendrajit International Airport, Imphal (IMF), with connections via Guwahati, Kolkata and Delhi.',
      'By road: NH2 connects Dimapur (Nagaland) and Imphal; NH37 runs from Jiribam.',
    ],
    highlights: ['Loktak Lake and its phumdis', 'Keibul Lamjao National Park', 'Kangla Fort, Imphal', 'Ima Keithel women’s market', 'Shirui hills, Ukhrul'],
    stays: REGIONAL_STAYS,
    faqs: [
      { q: 'Do I need a permit for Manipur?', a: 'Indian citizens require an Inner Line Permit for Manipur. Foreign nationals must register with the Foreigners Registration Office. Verify current rules with the state government before travelling.' },
      { q: 'What is the nearest airport to Loktak Lake?', a: 'Imphal (IMF), about 48 km from Moirang, roughly 1.5 hours by road.' },
      { q: 'What is Manipur best known for?', a: 'Loktak Lake with its floating phumdi islands, Keibul Lamjao National Park — the only floating national park in the world — and Meitei culture in the Imphal valley.' },
    ],
  },
  mizoram: {
    quickAnswer:
      'Mizoram is reached via Lengpui Airport, Aizawl (AJL), and is best visited October–March. Indian citizens require an Inner Line Permit, which is commonly issued on arrival at Lengpui.',
    overview: [
      'Mizoram is a ridge-line state of bamboo forests, terraced hill towns and quiet roads. Aizawl runs along a spine of hills with valley views on both sides; Phawngpui, the Blue Mountain, is the state’s highest point and a national park.',
      'It is one of the least crowded destinations in the Northeast and pairs well with a longer multi-state loop.',
    ],
    bestTime: [
      { window: 'October – March', detail: 'Clear ridge views and comfortable hill weather; Chapchar Kut festival falls in March.' },
      { window: 'May – September', detail: 'Heavy monsoon; landslides can close hill roads.' },
    ],
    howToReach: [
      'By air: Lengpui Airport, Aizawl (AJL), about 35 km from the city, with connections via Guwahati and Kolkata.',
      'By road: NH306 from Silchar (Assam) to Aizawl is the main overland route.',
    ],
    highlights: ['Aizawl ridge viewpoints', 'Reiek Tlang and heritage village', 'Phawngpui Blue Mountain National Park', 'Vantawng Falls', 'Chapchar Kut festival'],
    stays: REGIONAL_STAYS,
    permitNote:
      'An Inner Line Permit is required for Indian citizens visiting Mizoram and is commonly issued on arrival at Lengpui Airport or at entry checkposts. Confirm the current process before travel.',
    faqs: [
      { q: 'Do I need a permit for Mizoram?', a: 'Yes — Indian citizens need an Inner Line Permit, often issued on arrival at Lengpui Airport or at road entry checkposts. Foreign nationals must register locally. Confirm current rules before travelling.' },
      { q: 'What is the nearest airport to Aizawl?', a: 'Lengpui Airport (AJL), about 35 km from Aizawl.' },
      { q: 'When should I visit Mizoram?', a: 'October to March for dry weather and clear ridge views. March also brings the Chapchar Kut spring festival.' },
    ],
  },
  tripura: {
    quickAnswer:
      'Tripura is reached via Maharaja Bir Bikram Airport, Agartala (IXA), and is best visited October–March. Highlights are Ujjayanta Palace, the lake palace of Neermahal and the Unakoti rock carvings.',
    overview: [
      'Tripura is the most accessible Northeast state after Assam, bordered on three sides by Bangladesh. Agartala mixes royal architecture with a busy border-trade culture; north Tripura holds the Unakoti hillside rock carvings, one of the region’s great archaeological sites.',
      'Three to four days covers Agartala, Neermahal and Unakoti comfortably.',
    ],
    bestTime: [
      { window: 'October – March', detail: 'Dry and mild — the best window for Unakoti and lake trips.' },
      { window: 'April – September', detail: 'Hot, humid and wet.' },
    ],
    howToReach: [
      'By air: Maharaja Bir Bikram Airport, Agartala (IXA), with direct flights from Kolkata, Guwahati and Delhi.',
      'By rail: Agartala railway station connects to Guwahati and beyond.',
      'By road: NH8 links Agartala to Silchar and onward to Assam and Meghalaya.',
    ],
    highlights: ['Ujjayanta Palace, Agartala', 'Neermahal water palace, Rudrasagar Lake', 'Unakoti rock carvings', 'Jampui Hills', 'Sepahijala Wildlife Sanctuary'],
    stays: REGIONAL_STAYS,
    faqs: [
      { q: 'Do I need a permit for Tripura?', a: 'No Inner Line Permit is required for Tripura.' },
      { q: 'What is Unakoti?', a: 'A hillside site in north Tripura with huge rock-cut Shaiva carvings and stone images, believed to date to around the 7th–9th centuries.' },
      { q: 'How many days do I need in Tripura?', a: 'Three to four days covers Agartala, Neermahal and Unakoti at a comfortable pace.' },
    ],
  },
};

export const getStateContent = (slug?: string): StateContent | undefined =>
  slug ? STATE_CONTENT[slug] : undefined;
