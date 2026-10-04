/**
 * Tours beyond the Northeast: Kerala, Himachal Pradesh & Spiti, Tamil Nadu & Kodaikanal,
 * and South India's temple circuits.
 *
 * - Priced on request (price: "On request"): every trip is private and quoted for the
 *   traveller's dates, group size and hotel category. Cards and pages show "Price on request"
 *   and an Enquire / Get a quote button instead of a per-person price.
 * - XTSY's own property is only in New Shillong Township; on these tours stays, vehicles and
 *   local guides are arranged through trusted travel partners, XTSY is the single contact.
 * - Listing order across the site puts Meghalaya and Northeast tours first; these follow
 *   (see sortToursForDisplay in travelData.ts).
 */
import type { TourPackage, ItineraryDay } from './travelData';

const ON_REQUEST = 'On request';

const PARTNER_INCLUSIONS = [
  'Stays on twin sharing through trusted travel partners',
  'Private vehicle with driver for the whole route',
  'Sightseeing as per the itinerary',
  'Daily breakfast',
  'An XTSY trip coordinator on WhatsApp throughout',
];

const PARTNER_EXCLUSIONS = [
  'Flights or train tickets to the start point',
  'Entry tickets, camera fees and boat rides unless stated',
  'Lunch and dinner unless stated',
  'Special or VIP darshan tickets at temples',
  'Personal expenses, tips and travel insurance',
];

const faqs = (best: string, extra: { q: string; a: string }[] = []) => [
  {
    q: 'How much does this tour cost?',
    a: 'It is priced on request: the cost depends on your dates, group size and hotel category. Message the XTSY desk on WhatsApp (+91 88373 17070) with your dates and number of travellers and we will send a quote.',
  },
  {
    q: 'Who runs the trip on the ground?',
    a: "XTSY's own property is in New Shillong Township, Meghalaya. On this tour, stays, vehicles and local guides are arranged through trusted travel partners, with XTSY as your single point of contact.",
  },
  { q: 'When is the best time to go?', a: best },
  { q: 'Can the itinerary be changed?', a: 'Yes. Every trip is private, so days, stays and pace can be adjusted to suit you.' },
  ...extra,
];

const TEMPLE_ETIQUETTE = {
  q: 'Are there dress codes or entry rules at the temples?',
  a: 'Yes. Most temples expect modest traditional dress (dhoti or trousers for men, saree, salwar or long skirts for women), and some, especially in Kerala, admit only Hindus to the inner sanctum. Shoes are left outside, and photography is not allowed inside many shrines. Your coordinator will brief you before each visit.',
};

/** Main photo for schema / sharing: the tour's own reviewed photo once it exists, else a shared one of the same place, else the XTSY cover. */
const OWN_PHOTOS = new Set<number>([]);
const SHARED: Record<number, number> = { 75: 71, 76: 73, 66: 64, 85: 83, 87: 84, 91: 82, 92: 81 };
const img = (id: number) =>
  OWN_PHOTOS.has(id) ? `/img/px/tour-${id}-1280.webp` : SHARED[id] ? `/img/px/tour-${SHARED[id]}-1280.webp` : 'https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png';

const day = (n: number, title: string, activities: string[], overnight?: string, route?: string): ItineraryDay => ({
  day: `Day ${n}`,
  title,
  ...(route ? { route } : {}),
  activities,
  ...(overnight ? { overnight } : {}),
});

const base = { price: ON_REQUEST, rating: 4.7, inclusions: PARTNER_INCLUSIONS, exclusions: PARTNER_EXCLUSIONS, groupSize: 'Private trip, any group size' } as const;

// ── Kerala ─────────────────────────────────────────────────────────────────
const kerala: TourPackage[] = [
  {
    ...base,
    id: 76,
    title: 'Classic Kerala: Kochi, Munnar, Thekkady & Alleppey',
    description: 'Seven days across Kerala: Fort Kochi’s old quarter, Munnar’s tea hills, Thekkady’s spice gardens and Periyar lake, and a night on an Alleppey houseboat.',
    duration: '7 Days',
    difficulty: 'Easy',
    image: img(76),
    category: 'leisure',
    location: 'Kerala',
    highlights: ['Fort Kochi & Chinese fishing nets', 'Munnar tea estates', 'Eravikulam National Park', 'Thekkady spice plantation walk', 'Periyar lake boat ride', 'Alleppey houseboat night'],
    bestSeason: 'Sep–Mar',
    faqs: faqs('September to March is best: green after the monsoon, with cool nights in Munnar. Eravikulam National Park usually closes in February–March for the Nilgiri tahr calving season.'),
    itinerary: [
      day(1, 'Arrive in Kochi', ['Pickup from Kochi airport or Ernakulam station', 'Fort Kochi walk: Chinese fishing nets, St Francis Church', 'Mattancherry Palace and Jew Town', 'Evening Kathakali performance'], 'Kochi'),
      day(2, 'Kochi to Munnar', ['Drive into the Western Ghats (about 4 hours)', 'Cheeyappara and Valara waterfalls on the way', 'Spice garden stop', 'Evening at leisure in the tea hills'], 'Munnar', 'Kochi → Munnar'),
      day(3, 'Munnar tea hills', ['Eravikulam National Park for Nilgiri tahr (when open)', 'Tea Museum', 'Mattupetty Dam and Echo Point', 'Kundala Lake'], 'Munnar'),
      day(4, 'Munnar to Thekkady', ['Drive through cardamom country (about 3 hours)', 'Spice plantation walk', 'Optional Kalaripayattu martial-arts show in the evening'], 'Thekkady', 'Munnar → Thekkady'),
      day(5, 'Periyar and on to Kumarakom', ['Morning boat ride on Periyar lake', 'Optional nature walk in Periyar Tiger Reserve', 'Drive to Kumarakom by Vembanad lake (about 4 hours)'], 'Kumarakom', 'Thekkady → Kumarakom'),
      day(6, 'Alleppey houseboat', ['Board a houseboat at Alleppey (Alappuzha) around noon', 'Cruise the Kuttanad canals and paddy fields', 'Lunch, dinner and breakfast on board', 'Sunset over the backwaters'], 'Houseboat, Alleppey'),
      day(7, 'Departure', ['Disembark after breakfast', 'Drive to Kochi airport or station (about 2 hours)', 'Trip concludes']),
    ],
  },
  {
    ...base,
    id: 74,
    title: 'Munnar Tea Hills & Eravikulam',
    description: 'A short break in Munnar’s rolling tea estates: Eravikulam National Park, the Tea Museum, Top Station and waterfalls on the drive up from Kochi.',
    duration: '4 Days',
    difficulty: 'Easy',
    image: img(74),
    category: 'leisure',
    location: 'Kerala',
    highlights: ['Eravikulam National Park', 'Tea estate walk', 'Top Station viewpoint', 'Mattupetty Dam', 'Attukal waterfalls'],
    bestSeason: 'Sep–May',
    faqs: faqs('September to May. Eravikulam National Park usually closes in February–March for the Nilgiri tahr calving season, so check before booking those months.'),
    itinerary: [
      day(1, 'Kochi to Munnar', ['Pickup from Kochi airport or station', 'Cheeyappara and Valara waterfalls', 'Spice garden stop', 'Check in among the tea hills'], 'Munnar', 'Kochi → Munnar (about 4 hours)'),
      day(2, 'Eravikulam and the Tea Museum', ['Eravikulam National Park for Nilgiri tahr (when open)', 'Tea Museum and factory', 'Mattupetty Dam, Echo Point, Kundala Lake'], 'Munnar'),
      day(3, 'Top Station and tea estates', ['Top Station viewpoint over the Western Ghats', 'Guided tea estate walk', 'Attukal waterfalls and Lockhart Gap viewpoint'], 'Munnar'),
      day(4, 'Departure', ['Morning at leisure', 'Drive back to Kochi', 'Trip concludes']),
    ],
  },
  {
    ...base,
    id: 75,
    title: 'Alleppey Houseboat & Kumarakom Backwaters',
    description: 'Three slow days on Kerala’s backwaters: Kumarakom’s bird sanctuary and Vembanad lake, then a night aboard a private houseboat through the Kuttanad canals.',
    duration: '3 Days',
    difficulty: 'Easy',
    image: img(75),
    category: 'leisure',
    location: 'Kerala',
    highlights: ['Private houseboat night', 'Kuttanad paddy canals', 'Kumarakom Bird Sanctuary', 'Vembanad lake sunset', 'Village canoe ride'],
    bestSeason: 'Sep–Mar',
    inclusions: [...PARTNER_INCLUSIONS, 'Lunch, dinner and breakfast on the houseboat'],
    faqs: faqs('September to March for pleasant weather; the monsoon (June–August) is lush and quiet but wet.'),
    itinerary: [
      day(1, 'Kochi to Kumarakom', ['Pickup from Kochi airport or station', 'Kumarakom Bird Sanctuary walk', 'Sunset by Vembanad lake'], 'Kumarakom', 'Kochi → Kumarakom (about 2 hours)'),
      day(2, 'Houseboat day', ['Board a private houseboat at Alleppey around noon', 'Cruise past paddy fields farmed below sea level', 'Lunch, dinner and breakfast on board'], 'Houseboat, Alleppey'),
      day(3, 'Departure', ['Disembark after breakfast', 'Optional village canoe ride', 'Drive to Kochi', 'Trip concludes']),
    ],
  },
  {
    ...base,
    id: 77,
    title: 'Varkala Cliffs, Kovalam & Trivandrum',
    description: 'Kerala’s south coast: Varkala’s red cliffs over the Arabian Sea, Kovalam’s lighthouse beach, a Poovar estuary boat ride and Trivandrum’s museums and temple.',
    duration: '4 Days',
    difficulty: 'Easy',
    image: img(77),
    category: 'leisure',
    location: 'Kerala',
    highlights: ['Varkala North Cliff', 'Papanasam beach', 'Kovalam Lighthouse Beach', 'Poovar estuary boat ride', 'Napier Museum, Trivandrum'],
    bestSeason: 'Oct–Mar',
    faqs: faqs('October to March for calm seas and sunny days.', [TEMPLE_ETIQUETTE]),
    itinerary: [
      day(1, 'Trivandrum to Varkala', ['Pickup from Trivandrum airport or station', 'Varkala North Cliff walk', 'Papanasam beach and Janardhana Swamy Temple', 'Sunset from the cliff'], 'Varkala', 'Trivandrum → Varkala (about 1.5 hours)'),
      day(2, 'Varkala at leisure', ['Kappil beach, where the backwater meets the sea', 'Optional Ayurvedic massage', 'Cliff-top cafés in the evening'], 'Varkala'),
      day(3, 'Kovalam and Poovar', ['Drive to Kovalam', 'Lighthouse Beach', 'Boat ride on the Poovar estuary'], 'Kovalam'),
      day(4, 'Trivandrum and departure', ['Napier Museum and gardens', 'Optional darshan at Sri Padmanabhaswamy Temple (Hindus only, strict dress code)', 'Drop at Trivandrum airport or station']),
    ],
  },
];

// ── Himachal Pradesh & Spiti ───────────────────────────────────────────────
const himachal: TourPackage[] = [
  {
    ...base,
    id: 65,
    title: 'Spiti Valley Circuit via Kinnaur',
    description: 'The full Spiti loop from Shimla to Manali: Kinnaur’s Sangla and Chitkul, Nako, the thousand-year-old Tabo monastery, Kaza’s high villages, Chandratal lake and the Atal Tunnel.',
    duration: '9 Days',
    difficulty: 'Challenging',
    image: img(65),
    category: 'adventure',
    location: 'Himachal Pradesh',
    highlights: ['Chitkul and Sangla valley', 'Tabo Monastery', 'Key Monastery', 'Langza, Hikkim and Komic villages', 'Chicham bridge', 'Chandratal lake', 'Kunzum Pass'],
    bestSeason: 'Jun–Oct',
    faqs: faqs('June to early October, when Kunzum Pass and the Chandratal road are usually open. Snowfall can close the pass earlier in some years.', [
      { q: 'How high does this trip go?', a: 'Most of the route is above 3,000 m and Kunzum Pass is about 4,550 m. The loop goes up gradually through Kinnaur so your body can adjust; a buffer day is wise, and travellers with heart or lung conditions should check with a doctor first.' },
    ]),
    itinerary: [
      day(1, 'Arrive in Shimla', ['Pickup from Chandigarh airport or station', 'Drive up to Shimla (about 4 hours)', 'Evening on the Mall Road and the Ridge'], 'Shimla'),
      day(2, 'Shimla to Sangla', ['Drive via Narkanda along the Sutlej valley', 'Enter Kinnaur', 'Kamru Fort in the evening'], 'Sangla', 'Shimla → Sangla (about 8 hours)'),
      day(3, 'Chitkul and Kalpa', ['Morning at Chitkul, the last village on the road toward the Tibet border', 'Drive to Kalpa', 'Kinner Kailash range at sunset'], 'Kalpa'),
      day(4, 'Kalpa to Tabo via Nako', ['Khab, where the Spiti meets the Sutlej', 'Nako village and lake', 'Tabo Monastery, founded in 996 CE'], 'Tabo', 'Kalpa → Nako → Tabo'),
      day(5, 'Dhankar and on to Kaza', ['Dhankar Monastery on its cliff', 'Optional hike to Dhankar lake', 'Pin Valley detour', 'Arrive in Kaza'], 'Kaza'),
      day(6, 'Kaza’s high villages', ['Key Monastery', 'Kibber and the Chicham bridge', 'Langza’s Buddha statue and fossil slopes', 'Hikkim, one of the world’s highest post offices, and Komic'], 'Kaza'),
      day(7, 'Kunzum Pass to Chandratal', ['Drive over Kunzum Pass', 'Walk to Chandratal, the moon lake', 'Night in a lakeside camp (seasonal)'], 'Chandratal camps'),
      day(8, 'Chandratal to Manali', ['Drive via Batal and Gramphu', 'Through the Atal Tunnel', 'Evening in Old Manali'], 'Manali'),
      day(9, 'Departure', ['Drop at Bhuntar airport or the Manali bus stand', 'Trip concludes']),
    ],
  },
  {
    ...base,
    id: 67,
    title: 'Winter Spiti Snow Expedition',
    description: 'Spiti under snow, reached through Kinnaur when the Manali side is closed: frozen villages, Key Monastery in winter and a chance of snow-leopard sightings with local trackers near Kibber.',
    duration: '8 Days',
    difficulty: 'Challenging',
    image: img(67),
    category: 'adventure',
    location: 'Himachal Pradesh',
    highlights: ['Spiti in deep winter', 'Key Monastery in snow', 'Snow-leopard tracking near Kibber', 'Frozen Langza and Hikkim', 'Kinnaur valley drive'],
    bestSeason: 'Jan–Mar',
    faqs: faqs('January to March. Night temperatures in Kaza can fall below −20°C, and roads close after heavy snowfall, so dates stay flexible.', [
      { q: 'Will I see a snow leopard?', a: 'Sightings are possible with local trackers in winter, but never guaranteed: the cats are rare and shy.' },
    ]),
    itinerary: [
      day(1, 'Arrive in Shimla', ['Pickup from Chandigarh', 'Drive up to Shimla', 'Gear check and briefing'], 'Shimla'),
      day(2, 'Shimla to Kalpa', ['Long drive along the Sutlej through Kinnaur', 'Kinner Kailash views from Kalpa'], 'Kalpa'),
      day(3, 'Kalpa to Tabo', ['Nako village under snow', 'Tabo Monastery'], 'Tabo'),
      day(4, 'Tabo to Kaza', ['Dhankar Monastery', 'Arrive in Kaza and rest'], 'Kaza'),
      day(5, 'Kibber and Key', ['Key Monastery in winter', 'Snow-leopard tracking with local spotters near Kibber'], 'Kaza'),
      day(6, 'Langza, Hikkim and Komic', ['Snowbound high villages', 'Homestay lunch with a local family'], 'Kaza'),
      day(7, 'Kaza back to Kinnaur', ['Return drive through Spiti and Kinnaur'], 'Kalpa or Rampur'),
      day(8, 'Back to Chandigarh', ['Drive to Shimla and on to Chandigarh', 'Trip concludes']),
    ],
  },
  {
    ...base,
    id: 66,
    title: 'Shimla, Manali & Solang Classic',
    description: 'Himachal’s classic pair: colonial Shimla and Kufri, then Manali’s Old Town, Hadimba Temple, Solang Valley and a drive through the Atal Tunnel to Sissu.',
    duration: '6 Days',
    difficulty: 'Easy',
    image: img(66),
    category: 'leisure',
    location: 'Himachal Pradesh',
    highlights: ['Shimla Mall Road and the Ridge', 'Kufri', 'Solang Valley', 'Atal Tunnel to Sissu', 'Hadimba Temple', 'Old Manali'],
    bestSeason: 'Mar–Jun, Sep–Dec',
    faqs: faqs('March to June and September to December; December to February brings snow in Manali and Solang, with some road closures.'),
    itinerary: [
      day(1, 'Arrive in Shimla', ['Pickup from Chandigarh', 'Mall Road, the Ridge and Christ Church'], 'Shimla'),
      day(2, 'Kufri and Jakhu', ['Kufri', 'Jakhu Temple', 'Evening at leisure'], 'Shimla'),
      day(3, 'Shimla to Manali', ['Drive via Mandi and the Kullu valley', 'Optional river rafting near Kullu (seasonal)'], 'Manali', 'Shimla → Manali (about 8 hours)'),
      day(4, 'Solang and Sissu', ['Solang Valley', 'Through the Atal Tunnel to Sissu (weather permitting)'], 'Manali'),
      day(5, 'Manali town', ['Hadimba Temple', 'Vashisht hot springs', 'Old Manali and the Mall Road'], 'Manali'),
      day(6, 'Departure', ['Drop at Bhuntar airport or the Manali bus stand', 'Trip concludes']),
    ],
  },
];

// ── Tamil Nadu & Kodaikanal ────────────────────────────────────────────────
const tamilNadu: TourPackage[] = [
  {
    ...base,
    id: 85,
    title: 'Kodaikanal & Madurai: Hills and Temples',
    description: 'Madurai’s Meenakshi Amman Temple, then up to Kodaikanal in the Palani hills: the lake, Coaker’s Walk, Pillar Rocks, pine forests and the farming village of Poombarai.',
    duration: '5 Days',
    difficulty: 'Easy',
    image: img(85),
    category: 'leisure',
    location: 'Tamil Nadu',
    highlights: ['Meenakshi Amman Temple', 'Kodai Lake', 'Coaker’s Walk', 'Pillar Rocks', 'Pine forest', 'Poombarai village'],
    bestSeason: 'Oct–Jun',
    faqs: faqs('October to June. Kodaikanal is cool all year; April–June is the busiest season.', [TEMPLE_ETIQUETTE]),
    itinerary: [
      day(1, 'Arrive in Madurai', ['Pickup from Madurai airport or station', 'Thirumalai Nayak Palace', 'Evening at Meenakshi Amman Temple'], 'Madurai'),
      day(2, 'Madurai to Kodaikanal', ['Ghat-road drive into the Palani hills (about 4 hours)', 'Silver Cascade falls', 'Kodai Lake: boating or cycling', 'Sunset on Coaker’s Walk'], 'Kodaikanal'),
      day(3, 'Kodaikanal viewpoints', ['Pillar Rocks', 'Guna Caves (viewed from the trail)', 'Pine forest and Moir Point', 'Berijam Lake (forest-department permit, limited vehicles a day)'], 'Kodaikanal'),
      day(4, 'Poombarai and Mannavanur', ['Terraced farms of Poombarai village', 'Mannavanur lake and grasslands'], 'Kodaikanal'),
      day(5, 'Departure', ['Drive back to Madurai', 'Trip concludes']),
    ],
  },
  {
    ...base,
    id: 86,
    title: 'Ooty & Coonoor: Nilgiri Mountain Railway',
    description: 'The Nilgiris by toy train: Ooty’s lake and botanical garden, Doddabetta peak, tea factories, and the UNESCO-listed Nilgiri Mountain Railway down to Coonoor.',
    duration: '5 Days',
    difficulty: 'Easy',
    image: img(86),
    category: 'leisure',
    location: 'Tamil Nadu',
    highlights: ['Nilgiri Mountain Railway (UNESCO)', 'Doddabetta Peak', 'Government Botanical Garden', 'Tea factory visit', 'Dolphin’s Nose, Coonoor', 'Pykara Falls'],
    bestSeason: 'Oct–Jun',
    faqs: faqs('October to June; April–May is peak season. Toy-train seats are limited and are booked in advance once your dates are fixed.'),
    itinerary: [
      day(1, 'Coimbatore to Ooty', ['Pickup from Coimbatore airport or station', 'Drive up via Mettupalayam (about 3 hours)', 'Evening by Ooty Lake'], 'Ooty'),
      day(2, 'Ooty', ['Government Botanical Garden', 'Doddabetta Peak', 'Tea factory and museum', 'Rose Garden'], 'Ooty'),
      day(3, 'Toy train to Coonoor', ['Nilgiri Mountain Railway, Ooty to Coonoor', 'Sim’s Park', 'Dolphin’s Nose and Lamb’s Rock'], 'Coonoor'),
      day(4, 'Pykara', ['Pykara Falls and lake', 'Pine forest and Shooting Point'], 'Ooty'),
      day(5, 'Departure', ['Drive to Coimbatore', 'Trip concludes']),
    ],
  },
  {
    ...base,
    id: 87,
    title: 'Mahabalipuram, Pondicherry & Chennai Heritage Coast',
    description: 'Tamil Nadu’s coast: Chennai’s temples and Marina, Mahabalipuram’s UNESCO-listed shore temples and rock carvings, Pondicherry’s French Quarter and Auroville.',
    duration: '5 Days',
    difficulty: 'Easy',
    image: img(87),
    category: 'cultural',
    location: 'Tamil Nadu',
    highlights: ['Shore Temple, Mahabalipuram (UNESCO)', 'Pancha Rathas', 'Arjuna’s Penance', 'Pondicherry French Quarter', 'Auroville', 'Kapaleeshwarar Temple'],
    bestSeason: 'Nov–Feb',
    faqs: faqs('November to February, after the northeast monsoon and before the heat.', [TEMPLE_ETIQUETTE]),
    itinerary: [
      day(1, 'Chennai', ['Pickup from Chennai airport or station', 'Kapaleeshwarar Temple, Mylapore', 'Marina Beach at sunset'], 'Chennai'),
      day(2, 'Mahabalipuram', ['DakshinaChitra heritage village on the way', 'Shore Temple, Pancha Rathas and Arjuna’s Penance'], 'Mahabalipuram'),
      day(3, 'To Pondicherry', ['Coastal drive to Pondicherry', 'French Quarter walk and the Promenade', 'Sri Aurobindo Ashram'], 'Pondicherry'),
      day(4, 'Auroville', ['Auroville visitor centre and Matrimandir viewing point', 'Afternoon at Paradise Beach'], 'Pondicherry'),
      day(5, 'Departure', ['Drive to Chennai (about 3 hours)', 'Trip concludes']),
    ],
  },
];

// ── Temple circuits ────────────────────────────────────────────────────────
const temples: TourPackage[] = [
  {
    ...base,
    id: 90,
    title: 'Madurai, Rameswaram & Kanyakumari Temple Trail',
    description: 'South India’s great pilgrimage line: Madurai’s Meenakshi Amman Temple, Rameswaram’s Ramanathaswamy corridors and Dhanushkodi, then sunrise at Kanyakumari.',
    duration: '6 Days',
    difficulty: 'Easy',
    image: img(90),
    category: 'cultural',
    location: 'Tamil Nadu',
    highlights: ['Meenakshi Amman Temple', 'Ramanathaswamy Temple corridors', 'Pamban Bridge', 'Dhanushkodi', 'Vivekananda Rock Memorial', 'Suchindram Temple'],
    bestSeason: 'Oct–Mar',
    faqs: faqs('October to March for cooler weather.', [TEMPLE_ETIQUETTE]),
    itinerary: [
      day(1, 'Madurai', ['Pickup from Madurai airport or station', 'Meenakshi Amman Temple', 'Night ceremony when the deity is carried to the bed chamber'], 'Madurai'),
      day(2, 'To Rameswaram', ['Drive across the Pamban Bridge (about 4 hours)', 'Ramanathaswamy Temple and its long corridors'], 'Rameswaram'),
      day(3, 'Dhanushkodi', ['Dhanushkodi ghost town and Arichal Munai', 'Dr APJ Abdul Kalam National Memorial'], 'Rameswaram'),
      day(4, 'To Kanyakumari', ['Drive down the coast (about 5 hours)', 'Sunset at the southern tip of India'], 'Kanyakumari'),
      day(5, 'Kanyakumari', ['Sunrise at the shore', 'Ferry to the Vivekananda Rock Memorial and Thiruvalluvar Statue', 'Kumari Amman Temple', 'Suchindram Thanumalayan Temple'], 'Kanyakumari'),
      day(6, 'Departure', ['Drop at Trivandrum airport (about 2.5 hours) or Kanyakumari station', 'Trip concludes']),
    ],
  },
  {
    ...base,
    id: 91,
    title: 'Great Living Chola Temples & Navagraha Circuit',
    description: 'The Chola heartland: Srirangam, the three UNESCO-listed Great Living Chola Temples at Thanjavur, Darasuram and Gangaikonda Cholapuram, and the nine Navagraha temples around Kumbakonam.',
    duration: '5 Days',
    difficulty: 'Easy',
    image: img(91),
    category: 'cultural',
    location: 'Tamil Nadu',
    highlights: ['Brihadeeswarar Temple, Thanjavur (UNESCO)', 'Airavatesvara Temple, Darasuram (UNESCO)', 'Gangaikonda Cholapuram (UNESCO)', 'Navagraha temples', 'Srirangam Ranganathaswamy Temple'],
    bestSeason: 'Oct–Mar',
    faqs: faqs('October to March for cooler weather.', [TEMPLE_ETIQUETTE]),
    itinerary: [
      day(1, 'Tiruchirappalli', ['Pickup from Trichy airport or station', 'Srirangam Ranganathaswamy Temple', 'Rockfort Ucchi Pillayar Temple at sunset'], 'Trichy'),
      day(2, 'Thanjavur', ['Brihadeeswarar Temple', 'Thanjavur Palace and Saraswati Mahal Library', 'Thanjavur art-plate workshop'], 'Kumbakonam'),
      day(3, 'Chola masterpieces', ['Airavatesvara Temple, Darasuram', 'Gangaikonda Cholapuram'], 'Kumbakonam'),
      day(4, 'Navagraha circuit', ['The nine planetary temples around Kumbakonam, usually covered in one long day'], 'Kumbakonam'),
      day(5, 'Departure', ['Drive back to Trichy', 'Trip concludes']),
    ],
  },
  {
    ...base,
    id: 92,
    title: 'Pancha Bhoota Sthalam: The Five Elements Temples',
    description: 'The five Shiva temples of the elements: earth at Kanchipuram, air at Sri Kalahasti, fire at Tiruvannamalai, space at Chidambaram and water at Thiruvanaikaval.',
    duration: '6 Days',
    difficulty: 'Easy',
    image: img(92),
    category: 'cultural',
    location: 'Tamil Nadu',
    highlights: ['Ekambareswarar Temple, Kanchipuram (earth)', 'Srikalahasteeswara Temple (air)', 'Arunachaleswarar Temple, Tiruvannamalai (fire)', 'Thillai Nataraja Temple, Chidambaram (space)', 'Jambukeswarar Temple, Thiruvanaikaval (water)'],
    bestSeason: 'Oct–Mar',
    faqs: faqs('October to March. Tiruvannamalai is busiest on full-moon nights, when pilgrims walk the hill path.', [TEMPLE_ETIQUETTE]),
    itinerary: [
      day(1, 'Chennai to Kanchipuram', ['Pickup from Chennai airport or station', 'Ekambareswarar Temple (earth)', 'Kailasanathar Temple and a silk-weaving visit'], 'Kanchipuram'),
      day(2, 'Sri Kalahasti', ['Drive to Sri Kalahasti, Andhra Pradesh (about 3 hours)', 'Srikalahasteeswara Temple (air)'], 'Sri Kalahasti or Tirupati'),
      day(3, 'Tiruvannamalai', ['Drive to Tiruvannamalai', 'Arunachaleswarar Temple (fire)', 'Optional walk on the 14 km Girivalam path'], 'Tiruvannamalai'),
      day(4, 'Chidambaram', ['Drive to Chidambaram (about 3 hours)', 'Thillai Nataraja Temple (space)'], 'Chidambaram'),
      day(5, 'Thiruvanaikaval and Srirangam', ['Drive to Trichy', 'Jambukeswarar Temple (water)', 'Srirangam Ranganathaswamy Temple'], 'Trichy'),
      day(6, 'Departure', ['Drop at Trichy airport or station', 'Trip concludes']),
    ],
  },
  {
    ...base,
    id: 93,
    title: 'Kerala Temple Trail: Guruvayur to Padmanabhaswamy',
    description: 'Kerala’s great temples from north to south: Guruvayur, Thrissur’s Vadakkunnathan, Vaikom and Ambalappuzha, ending at Sri Padmanabhaswamy in Thiruvananthapuram.',
    duration: '5 Days',
    difficulty: 'Easy',
    image: img(93),
    category: 'cultural',
    location: 'Kerala',
    highlights: ['Guruvayur Sri Krishna Temple', 'Vadakkunnathan Temple, Thrissur', 'Vaikom Mahadeva Temple', 'Ambalappuzha Sri Krishna Temple', 'Sri Padmanabhaswamy Temple'],
    bestSeason: 'Sep–Mar',
    faqs: faqs('September to March; the June–August monsoon is very wet.', [TEMPLE_ETIQUETTE]),
    itinerary: [
      day(1, 'Kochi to Guruvayur', ['Pickup from Kochi airport or station', 'Guruvayur Sri Krishna Temple', 'Punnathur Kotta elephant sanctuary'], 'Guruvayur'),
      day(2, 'Thrissur', ['Vadakkunnathan Temple', 'Drive south toward Kottayam'], 'Kottayam'),
      day(3, 'Vaikom and Ambalappuzha', ['Vaikom Mahadeva Temple', 'Ambalappuzha Sri Krishna Temple, known for its palpayasam'], 'Alleppey'),
      day(4, 'To Thiruvananthapuram', ['Drive south (about 3.5 hours)', 'Attukal Bhagavathy Temple'], 'Thiruvananthapuram'),
      day(5, 'Padmanabhaswamy and departure', ['Morning darshan at Sri Padmanabhaswamy Temple (Hindus only, strict dress code)', 'Drop at Trivandrum airport or station']),
    ],
  },
];

/** Display order inside the expansion: Kerala, Himachal & Spiti, Tamil Nadu & Kodaikanal, then temple circuits. */
export const indiaExpansionTours: TourPackage[] = [...kerala, ...himachal, ...tamilNadu, ...temples];
