/**
 * XTSY trip assistant — the "Plan a trip with AI" brain.
 *
 * Runs entirely in the browser (no paid model calls): it understands free-text
 * trip requests and follow-ups ("5 days, Dawki and Cherrapunji, 4 of us in
 * December", "add Kaziranga", "make it 7 days", "how far is Wari Chora?"),
 * keeps the conversation state, builds a feasible plan with the geo planner
 * and answers common questions from XTSY's own facts.
 *
 * For stays, XTSY always comes first: its own hostel in New Shillong Township
 * for anything within day-trip range, and XTSY-booked partner stays further out.
 */
import { CLUSTERS, PLACES, PLACE_BY_ID, XTSY, type ClusterId, type Place } from './places';
import { XTSY_POINT, pointOfHub, pointOfPlace, travel } from './routing';
import { buildPlan, fmtH, type Plan, type TripStyle } from './planner';
import { inr, lowestDormPrice, roomPrice } from '@/components/v2/pricing';
import { PANORAMA_DECORATION, PANORAMA_STAY_ONLY } from '@/data/panoramaPricing';

export interface ChatState {
  days?: number;
  placeIds: string[];
  travellers?: number;
  styles: TripStyle[];
  month?: number;
  camping?: boolean;
  hasPlan: boolean;
  /** Places the traveller removed; never suggested again. */
  avoid: string[];
  /** Places named in the latest trip message. */
  latest: string[];
}

export type ChatAction = 'send' | 'whatsapp' | 'book' | 'copy' | 'reset';

export interface Reply {
  text: string;
  plan?: Plan;
  chips: string[];
  actions: ChatAction[];
}

export const INITIAL_STATE: ChatState = { placeIds: [], styles: [], hasPlan: false, avoid: [], latest: [] };

export const WELCOME: Reply = {
  text: `Hi! I’m the XTSY trip assistant. Tell me where you’d like to go in Shillong, Meghalaya or anywhere in Northeast India, how many days you have and who’s coming, and I’ll plan it day by day with real drive times.\n\nI can also answer questions about stays, prices, permits and the best time to visit.`,
  chips: ['5 days in Meghalaya', 'Weekend in Shillong for a couple', 'Dawki + Cherrapunji, 4 friends', 'Tawang in 7 days', 'Where should I stay in Shillong?'],
  actions: [],
};

const NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fourteen: 14, fifteen: 15 };
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const REGION_ALIASES: [RegExp, string[]][] = [
  [/\barunachal\b/, ['dirang', 'sela', 'tawang']],
  [/\bnagaland\b/, ['kohima', 'khonoma']],
  [/\bsikkim\b/, ['gangtok', 'tsomgo']],
  [/\bgaro( hills)?\b/, ['tura', 'siju']],
  [/\bjaintia( hills)?\b/, ['krang-suri', 'jowai']],
  [/\bwest khasi\b/, ['mawphanlur', 'nongkhnum']],
  [/\bassam\b/, ['kaziranga']],
  [/\bmanipur\b/, ['imphal', 'loktak']],
];

const STYLE_WORDS: [RegExp, TripStyle][] = [
  [/honeymoon|romantic|anniversary|couple|wife|husband|girlfriend|boyfriend|proposal/, 'romantic'],
  [/\b(dog|dogs|cat|cats|pet|pets|puppy)\b/, 'pets'],
  [/backpack|hostel|dorm/, 'backpacking'],
  [/budget|budget-friendly|low cost|affordable/, 'budget'],
  [/adventure|trek|hike|rappel|canyon|kayak|thrill/, 'adventure'],
  [/photo|camera|instagram|sunrise|sunset/, 'photography'],
  [/family|kids|children|parents/, 'family'],
  [/culture|village|tribal|khasi|festival|history|museum/, 'culture'],
  [/solo (female|woman|girl)|women only|female traveller|female traveler|girls trip/, 'solo-female'],
  [/nature|waterfall|falls|lake|scenic/, 'nature'],
];

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const clean = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();

export function findPlaces(text: string): Place[] {
  const t = ` ${clean(text)} `;
  const hits: { p: Place; at: number }[] = [];
  const aliases = PLACES.flatMap((p) => [p.name.toLowerCase(), ...p.aliases].map((a) => ({ a, p }))).sort((x, y) => y.a.length - x.a.length);
  const taken: [number, number][] = [];
  for (const { a, p } of aliases) {
    const re = new RegExp(`[^a-z]${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^a-z]`);
    const m = re.exec(t);
    if (!m) continue;
    const start = m.index; const end = start + a.length;
    if (taken.some(([s, e]) => start < e && end > s)) continue;
    taken.push([start, end]);
    if (!hits.some((h) => h.p.id === p.id)) hits.push({ p, at: start });
  }
  for (const [re, ids] of REGION_ALIASES) {
    const m = re.exec(t);
    if (m && !hits.some((h) => ids.includes(h.p.id))) ids.forEach((id, i) => hits.push({ p: PLACE_BY_ID[id], at: m.index + i / 10 }));
  }
  return hits.sort((a, b) => a.at - b.at).map((h) => h.p);
}

function parseDays(t: string): number | undefined {
  const n = /(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fourteen|fifteen)\s*-?\s*(day|days|d\b|night|nights|n\b)/.exec(t);
  if (n) { const v = NUM[n[1]] ?? Number(n[1]); return /night|n\b/.test(n[2]) ? v + 1 : v; }
  if (/\bfortnight\b/.test(t)) return 14;
  if (/\b(a|one) week\b|\bweek long\b|\bweek\b/.test(t)) return 7;
  if (/\blong weekend\b/.test(t)) return 4;
  if (/\bweekend\b/.test(t)) return 3;
  return undefined;
}

function parseTravellers(t: string): number | undefined {
  const n = /(\d{1,3}|two|three|four|five|six|seven|eight|nine|ten|twelve|fifteen)\s*(people|persons|person|pax|friends|adults|of us|travellers|travelers|guests|members|students|colleagues)/.exec(t);
  if (n) return NUM[n[1]] ?? Number(n[1]);
  const fam = /family of (\d{1,2}|two|three|four|five|six)/.exec(t); if (fam) return NUM[fam[1]] ?? Number(fam[1]);
  const we = /\bwe are (\d{1,3}|two|three|four|five|six|seven|eight|nine|ten)\b/.exec(t); if (we) return NUM[we[1]] ?? Number(we[1]);
  if (/\b(solo|alone|myself|just me)\b/.test(t)) return 1;
  if (/\b(couple|honeymoon|my wife|my husband|girlfriend|boyfriend|two of us)\b/.test(t)) return 2;
  return undefined;
}

function parseMonth(t: string): number | undefined {
  for (let i = 0; i < 12; i++) if (new RegExp(`\\b${MONTHS[i]}[a-z]*\\b`).test(t) && !(MONTHS[i] === 'may' && /\bmay (i|we|be)\b/.test(t))) return i;
  if (/\bmonsoon\b/.test(t)) return 6;
  if (/\bwinter\b/.test(t)) return 11;
  if (/\bsummer\b/.test(t)) return 4;
  if (/\b(christmas|new year)\b/.test(t)) return 11;
  if (/\bdiwali\b/.test(t)) return 10;
  if (/\bpuja\b/.test(t)) return 9;
  return undefined;
}

// ---------- fact answers ----------

function stayAnswer(place?: Place): string {
  const suite = roomPrice('xtsy-270');
  const lines = [
    `**1. ${XTSY.name}** — our own hostel on Mawdiangdiang Road, New Shillong Township (near IIM & NIFT Shillong). Dorm beds from ${inr(lowestDormPrice())}, women-only dorm ${inr(roomPrice('4-bed-female-only-dorm').now)}, King Double ${inr(roomPrice('king-double-room').now)} a night. TAB Bistro on site, 24/7 arrival support, pets welcome (cats and birds; dogs by breed and size).`,
    `**2. Experience by XTSY** — India’s First Stargaze Glamp, a 270° glass suite for two at the same property: ${inr(suite.now || PANORAMA_STAY_ONLY)} a night, all inclusive (stay only); decoration +${inr(PANORAMA_DECORATION)}.`,
  ];
  if (place && !CLUSTERS[place.cluster].dayTripFromXtsy) {
    const leg = travel(XTSY_POINT, pointOfPlace(place));
    lines.unshift(`${place.name} is ~${fmtH(leg.hours)} (~${leg.km} km) from Shillong, so you’ll sleep near it: the XTSY desk books a trusted **${lowerFirst(CLUSTERS[place.cluster].stay.replace(' (booked by XTSY)', ''))}** for you. Spend your Shillong nights with us:`);
  } else if (place) {
    const leg = travel(XTSY_POINT, pointOfPlace(place));
    lines.unshift(`${place.name} is an easy day trip from XTSY (~${fmtH(leg.hours)} each way), so you can stay with us and come back each evening:`);
  } else {
    lines.unshift('For Shillong and Meghalaya, here’s where we’d put you:');
  }
  lines.push('XTSY’s own property is only in New Shillong Township; everywhere else in Northeast India, XTSY arranges stays, cabs and guides through trusted partners.');
  return lines.join('\n\n');
}

/**
 * General Meghalaya and Shillong knowledge, answered on its own merits.
 *
 * The assistant used to reply only from XTSY's own facts, so a visitor asking
 * something ordinary — what the weather is like, whether their card will work,
 * how to get around — got nothing useful. Someone researching a trip asks those
 * questions long before they pick a stay, and an assistant that cannot answer
 * them is not worth opening twice.
 *
 * Each answer stands alone first. XTSY is mentioned only where it genuinely
 * bears on the answer, and left out where it does not.
 */
const GENERAL: [RegExp, () => string, string[]][] = [
  [/\bweather\b|temperature|how cold|how hot|climate|rain(y|fall|s)?\b/,
    () => 'Shillong sits at about 1,500 m, so it stays mild: roughly 15–24°C in summer and 4–15°C in winter, with a few nights near 2°C in January. Sohra (Cherrapunji) and Mawsynram are among the wettest places on earth — the monsoon runs June to September and can bring days of continuous rain and landslides on hill roads. October to April is dry and clear.',
    ['Best time to visit?', 'Plan a 5-day trip']],
  [/best time|which month|when (should|to) (i |we )?(visit|go|come)|peak season|off season/,
    () => 'October to April is the comfortable window: clear skies, waterfalls still running and good light for the viewpoints. November and December are the busiest. June to September is the monsoon — everything is green and dramatic, prices drop, but expect rain most days and slow roads. March and April are quiet and pleasant.',
    ['Plan a trip in December', 'What is the weather like?']],
  [/\b(atms?|cash|cards?|upi|money|payment|bank)\b/,
    () => 'Carry cash. ATMs are easy in Shillong but scarce once you are out towards Dawki, Mawlynnong, Nongstoin or the Garo Hills, and many boat operators, homestays and small eateries are cash-only. UPI works in Shillong and at most fuel pumps, patchily elsewhere. Draw what you need before leaving the city.',
    ['Plan a 4-day trip', 'How do I get around?']],
  [/\b(network|signal|mobile data|sim|internet|connectivity|wifi in meghalaya)\b/,
    () => 'Jio and Airtel cover Shillong and the main roads well. Coverage thins out in the gorges around Sohra, on the Dawki road and across the Garo Hills, and drops entirely on the Nongriat trek. Download offline maps before you set out. BSNL still reaches some places the others do not.',
    ['Plan a trek day', 'Where is XTSY?']],
  [/how (do i|to|can i) (get around|travel around|move around)|local transport|taxi|cab|shared (taxi|sumo)|bus\b|rent a car|self.?drive/,
    () => 'Shared taxis run set routes inside Shillong cheaply, and shared Sumos leave Police Bazar for most district towns in the morning. For day trips to Sohra, Dawki or Mawlynnong a private cab is far more practical — the sights are spread out and shared transport rarely waits. Self-drive cars and Royal Enfields are available, and XTSY rents both from New Shillong.',
    ['XTSY rentals', 'Plan a 5-day trip']],
  [/\bsafe|safety|is it safe|solo travel|alone\b/,
    () => 'Meghalaya is one of the safer states in India for travellers, including women travelling alone. Khasi society is matrilineal and women are visible everywhere in public life. The usual sense applies: hill roads are poor after dark, so finish drives by evening, and trek with a local guide where trails are unmarked. Shillong itself winds down early.',
    ['Women-only dorm', 'Plan a solo trip']],
  [/what (to|should i) (wear|pack)|packing|clothes|shoes|umbrella/,
    () => 'Layers and a rain shell at any time of year — the weather turns fast. Winter nights want a proper jacket. Shoes with grip matter more than people expect: the root-bridge steps and the paths at Sohra are wet and slick even in the dry months. An umbrella is more useful than a hood in the monsoon, and a dry bag for the Dawki boat.',
    ['Plan the root bridge trek', 'What is the weather like?']],
  [/khasi|local food|try (to eat|food)|what food|local dish|jadoh|cuisine of/,
    () => 'Khasi food is worth seeking out: jadoh (rice cooked with pork), dohneiiong (pork with black sesame), tungrymbai, and the smoked pork you will smell in Iewduh market. Laitumkhrah and Police Bazar in Shillong have the best-known places. We deliberately do not cook local dishes at TAB Bistro — the local eateries do them properly and we would rather send you to them.',
    ['Plan a food trail', 'Where is XTSY?']],
  [/language|do they speak|english|hindi|khasi language/,
    () => 'Khasi is the everyday language in and around Shillong, Garo in the west, and English is widely spoken — it is the state official language and signage is in English. Hindi is understood in the city and less so in the villages. You will have no trouble getting by in English.',
    ['Plan a 3-day trip']],
  [/alcohol|drink|bar|pub|dry state|liquor/,
    () => 'Meghalaya is not a dry state. Shillong has bars and licensed restaurants, though most close by around 10:30–11 PM, and Sunday service is limited. Outside the city, expect very little. Drinking is frowned on at sacred groves and in some villages, including Mawlynnong — worth respecting.',
    ['Plan a Shillong evening']],
  [/altitude|sick|medical|hospital|pharmacy|doctor/,
    () => 'At about 1,500 m, Shillong is not high enough for altitude sickness. NEIGRIMS in New Shillong Township is the main referral hospital and pharmacies are easy to find in the city; carry your own basics for the villages and the treks, where the nearest chemist can be an hour away.',
    ['Where is XTSY?']],
  [/\b(root bridge|nongriat|double decker|trek|trekking|hike|hiking)\b/,
    () => 'The Double Decker living root bridge at Nongriat is about 3,000 steps down from Tyrna and the same back up — three to five hours round trip, and genuinely hard on the knees rather than technically difficult. Start early, carry water, and give it a whole day. Shorter root bridges near Mawlynnong and Riwai take twenty minutes.',
    ['Add the root bridge trek', 'What should I pack?']],
];

const FACTS: [RegExp, () => string, string[]][] = [
  [/check.?in|check.?out|checkin|checkout|arrival time/, () => 'Standard check-in at XTSY is **11 AM** and check-out is **strictly 10 AM**. Arriving late? Message the desk with your time — our arrival desk helps around the clock.', ['Plan a 3-day trip', 'Where is XTSY?']],
  [/\b(pet|pets|dog|dogs|cat|cats)\b/, () => 'Cats and birds are most welcome at XTSY. Dogs depend on breed and size — please contact the XTSY desk about any additional charges before you book.', ['Plan a pet-friendly trip', 'Pet-friendly stays page']],
  [/women|female|girls|solo woman|safe for/, () => `XTSY has a **women-only 4-bed dorm** (${inr(roomPrice('4-bed-female-only-dorm').now)} a night) with female staff on call, lockers, CCTV in common areas and 24/7 arrival support.`, ['Plan a solo trip', 'Where is XTSY?']],
  [/tab bistro|\brestaurant\b|(?<!local )\bfood\b|\bdinner\b|\bbreakfast\b|\beat\b|where (can|do) (i|we) eat/, () => 'TAB Bistro by XTSY is our on-site restaurant (breakfast 8:45 AM–12 PM, dinner 5–11 PM, last order 10:30 PM; lunch by preorder): live tandoor, North Indian gravies, Indo-Chinese, XTSY dum biryani, South Indian breakfast and hand-crafted pasta, with plenty of veg. For Khasi food, the local places in Shillong do it far better than we would — ask the desk and we will point you to one.', ['See the menu', 'Plan a food trail']],
  [/where is xtsy|address|location|how (do i|to) (reach|get to) (xtsy|the hostel)|located/, () => `XTSY Travellers Hostel is on **Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya 793018** — near NIFT Shillong, IIM Shillong, NEIGRIMS, NEIAH and Martin Luther Christian University. From Guwahati airport it’s ~3–3.5 h by road; we can send a cab.`, ['How do I reach Shillong?', 'Plan a 4-day trip']],
  [/how (do i|to|can i) (reach|get to|go to) (shillong|meghalaya)|nearest airport|flight to shillong|train to shillong/, () => 'Fly or take a train to **Guwahati** (GAU), then drive ~3 h to Shillong (~3.25 h to XTSY in New Shillong). Shillong’s own airport at Umroi has a few flights. The XTSY desk can arrange a pick-up from Guwahati.', ['Plan 5 days from Guwahati', 'Where should I stay in Shillong?']],
  [/\b(ilp|permit|permits|pap|rap)\b/, () => `Meghalaya and Assam need no permit. **Arunachal**, **Nagaland**, **Mizoram** and **Manipur** need an Inner Line Permit for Indian travellers (foreign nationals need a Protected Area Permit for Arunachal). **Sikkim**: Tsomgo, Nathula and North Sikkim need local permits. The XTSY desk helps with paperwork for trips we plan.`, ['Tawang in 7 days', 'Kohima & Dzukou trip']],
  [/workation|work from|wifi|wi-fi|remote work|digital nomad|coworking/, () => 'XTSY runs workation stays with fast Wi-Fi, desks and long-stay rates (weekly and monthly plans on the Workation page), with TAB Bistro downstairs.', ['Workation plans', 'Plan a slow 10-day trip']],
  [/group|college|corporate|offsite|students|school trip/, () => 'We plan group trips for 6–60 people: whole-dorm stays at XTSY, tempo or SUV transport, guides and TAB Bistro meals, with GST invoices on request.', ['Plan a group trip for 20', 'Group bookings page']],
  [/cancel|refund/, () => 'The booking amount is **non-refundable** — there is no free cancellation. You can change your dates **once within 90 days** of the original check-in (ask at least 48 hours before), subject to availability and any rate difference. Full terms are on the Pricing & Cancellation Policy page.', ['Talk to the desk on WhatsApp']],
];

function priceAnswer(): string {
  return `Current direct rates at XTSY (per night, all inclusive):\n\n• Dorm beds from **${inr(lowestDormPrice())}**\n• Women-only 4-bed dorm **${inr(roomPrice('4-bed-female-only-dorm').now)}**\n• King Double **${inr(roomPrice('king-double-room').now)}**\n• Experience by XTSY: **${inr(PANORAMA_STAY_ONLY)}** (stay only); decoration +${inr(PANORAMA_DECORATION)}\n\nBooking direct saves 20–30% vs OTAs. Tour prices depend on the plan — build one and the desk will quote it.`;
}

function distanceAnswer(places: Place[], t: string): string | null {
  if (!/how far|distance|how long|hours from|km from|drive (time|from)|travel time/.test(t)) return null;
  let a: Place | undefined = places[0];
  let b: Place | undefined = places[1];
  if (!a) return 'Tell me the place and I’ll give you the drive time — for example “How far is Dawki from Shillong?”';
  // "from Shillong" / "from XTSY" means from our hostel.
  const isShillong = (p?: Place) => !!p && (p.id === 'shillong' || p.cluster === 'shillong' && p.id !== 'laitlum' && p.id !== 'mawphlang');
  if (b && isShillong(a)) { a = b; b = undefined; }
  else if (b && isShillong(b)) b = undefined;
  const from = b ? pointOfPlace(a) : XTSY_POINT;
  const to = b ? pointOfPlace(b) : pointOfPlace(a);
  const leg = travel(from, to);
  const fromName = b ? a.name : 'XTSY (New Shillong)';
  const toPlace = b ?? a;
  const gau = travel(pointOfHub('gau'), pointOfPlace(toPlace));
  const day = CLUSTERS[toPlace.cluster].dayTripFromXtsy
    ? `That’s a comfortable **day trip from XTSY** — you’re back for dinner at TAB Bistro.`
    : `That’s too far for a day trip from Shillong, so plan at least **${leg.hours > 7 ? 3 : 2} extra days** for it, sleeping near it at a ${lowerFirst(CLUSTERS[toPlace.cluster].stay.replace(' (booked by XTSY)', ''))} that the XTSY desk books. Keep your Shillong nights at XTSY.`;
  return `**${fromName} → ${toPlace.name}:** about **${fmtH(leg.hours)}** (~${leg.km} km)${leg.flight ? ' including a flight from Guwahati' : leg.via.length ? ` via ${leg.via.join(', ')}` : ''}. From Guwahati airport it’s ~${fmtH(gau.hours)}.\n\n${day}\n\nHill roads are slow and weather can add time — the desk confirms every route.`;
}

function bestTimeAnswer(places: Place[], t: string): string | null {
  if (!/best time|when (should|to) (i )?(go|visit)|season|weather|rain/.test(t)) return null;
  const clusters = [...new Set((places.length ? places : [PLACE_BY_ID.sohra]).map((p) => p.cluster))];
  const lines = clusters.map((c) => `**${CLUSTERS[c].name}:** ${CLUSTERS[c].season ?? 'October to April is the most reliable; June–September brings heavy rain and green hills.'}`);
  return `${lines.join('\n\n')}\n\nFor Meghalaya overall: **October–April** for clear views and dry roads; **June–September** for thundering waterfalls (pack rain gear and keep a spare day).`;
}

// ---------- the conversation ----------

export function respond(message: string, prev: ChatState): { reply: Reply; state: ChatState } {
  const t = clean(message);
  const state: ChatState = { ...INITIAL_STATE, ...prev, placeIds: [...prev.placeIds], styles: [...prev.styles], avoid: [...(prev.avoid ?? [])] };

  if (!t) return { reply: WELCOME, state };
  if (/^(start over|reset|new trip|clear|restart)\b/.test(t)) return { reply: { ...WELCOME, text: 'Fresh start. Where would you like to go?' }, state: { ...INITIAL_STATE } };
  if (/^(hi|hello|hey|namaste|khublei|good (morning|evening|afternoon))\b[!. ]*$/.test(t)) return { reply: WELCOME, state };
  if (/^(thanks|thank you|thx|great|awesome|perfect|ok|okay|cool)\b/.test(t) && t.length < 25) {
    return { reply: { text: 'Happy to help! When you’re ready, send the plan to the XTSY desk and we’ll confirm stays, cabs and prices on WhatsApp.', chips: ['Make it 1 day longer', 'Add a camping night at Dawki'], actions: state.hasPlan ? ['send', 'whatsapp', 'book'] : [] }, state };
  }

  const places = findPlaces(message);
  const mentionsTrip = /\b(plan|trip|itinerary|tour|days?|nights?|week|weekend|visit|go to|travel|holiday|vacation|honeymoon|package)\b/.test(t);

  // Questions first (unless the message is clearly a trip request with days).
  const dist = distanceAnswer(places, t);
  if (dist) {
    const target = places.find((p) => p.id !== 'shillong' && p.cluster !== 'shillong') ?? places[0];
    return { reply: { text: dist, chips: target ? [`Plan a trip with ${target.name}`, `Where should I stay near ${target.name}?`] : ['How far is Dawki?', 'How far is Tawang?'], actions: [] }, state };
  }
  if (/(where|best place|good place|recommend).{0,30}(stay|hostel|hotel|homestay|sleep|accommodation)|best hostel|best hotel|stay in shillong|hostel in shillong|hotel in shillong/.test(t) && !parseDays(t)) {
    return { reply: { text: stayAnswer(places[0]), chips: ['Check live availability', 'Plan my trip around XTSY', 'Pet policy'], actions: ['book'] }, state };
  }
  if (/\b(price|prices|cost|rate|rates|tariff|how much|charges)\b/.test(t) && !parseDays(t) && !places.length) {
    return { reply: { text: priceAnswer(), chips: ['Check live availability', 'Plan a 4-day trip'], actions: ['book'] }, state };
  }
  const bt = bestTimeAnswer(places, t);
  if (bt && !parseDays(t)) return { reply: { text: bt, chips: ['Plan 5 days in December', 'Plan a monsoon trip'], actions: [] }, state };
  if (!(mentionsTrip && (parseDays(t) || places.length))) {
    for (const [re, answer, chips] of FACTS) if (re.test(t)) return { reply: { text: answer(), chips, actions: [] }, state };
    for (const [re, answer, chips] of GENERAL) if (re.test(t)) return { reply: { text: answer(), chips, actions: [] }, state };
  }

  // Trip edits and requests.
  const removing = /\b(remove|without|skip|drop|exclude|no more|don'?t want)\b/.test(t);
  const adding = /\b(add|include|also|plus)\b/.test(t);
  const newTrip = !adding && !removing && !!parseDays(t) && places.length > 0;
  if (newTrip) { state.camping = undefined; state.styles = []; state.avoid = []; }
  state.latest = [];
  if (places.length) {
    const ids = places.map((p) => p.id);
    if (removing) { state.placeIds = state.placeIds.filter((id) => !ids.includes(id)); state.avoid = [...new Set([...state.avoid, ...ids])]; }
    else {
      state.avoid = state.avoid.filter((id) => !ids.includes(id));
      state.placeIds = newTrip || !state.hasPlan ? ids : [...new Set([...state.placeIds, ...ids])];
      state.latest = ids;
    }
  }
  const days = parseDays(t);
  if (days) state.days = days;
  const more = /\b(one|1) (more|extra) day|a day longer|longer\b/.test(t); if (more) state.days = (state.days ?? 5) + 1;
  const less = /\b(one|1) (less|fewer) day|shorter\b/.test(t); if (less) state.days = Math.max(2, (state.days ?? 5) - 1);
  const pax = parseTravellers(t); if (pax) state.travellers = pax;
  const month = parseMonth(t); if (month !== undefined) state.month = month;
  if (/\b(camp|camping|tent)\b/.test(t)) state.camping = !removing;
  for (const [re, s] of STYLE_WORDS) if (re.test(t) && !state.styles.includes(s)) state.styles.push(s);

  const touched = places.length || days || more || less || pax || month !== undefined || /camp|tent/.test(t) || STYLE_WORDS.some(([re]) => re.test(t)) || mentionsTrip;
  if (!touched) {
    return {
      reply: {
        text: 'I didn’t quite catch that. Try something like “5 days in Meghalaya with Dawki and Cherrapunji”, “How far is Tawang?” or “Where should I stay in Shillong?”. You can also message the XTSY desk on WhatsApp.',
        chips: ['5 days in Meghalaya', 'How far is Dawki?', 'Where should I stay in Shillong?'],
        actions: ['whatsapp'],
      },
      state,
    };
  }

  const plan = buildPlan({ days: state.days ?? 5, placeIds: state.placeIds, travellers: state.travellers ?? 2, styles: state.styles, month: state.month, camping: state.camping, keep: state.latest, avoid: state.avoid });
  state.hasPlan = true;
  state.days = plan.input.days;
  return { reply: planReply(plan, state), state };
}

function planReply(plan: Plan, state: ChatState): Reply {
  const nightsOther = plan.days.filter((d) => !d.atXtsy && d.overnight !== '—').length;
  const lines: string[] = [];
  lines.push(`**Your ${plan.input.days}-day plan** for ${plan.input.travellers} ${plan.input.travellers === 1 ? 'traveller' : 'travellers'}${state.month !== undefined ? ` in ${MONTH_NAMES[state.month]}` : ''} · ~${fmtH(plan.driveHours)} on the road in total.`);
  const stays: string[] = [];
  if (plan.nightsAtXtsy) stays.push(`${plan.nightsAtXtsy} ${plan.nightsAtXtsy === 1 ? 'night' : 'nights'} at **${XTSY.name}**, New Shillong (our own stay)`);
  if (nightsOther) stays.push(`${nightsOther} at partner stays the XTSY desk books`);
  if (stays.length) lines.push(`Stays: ${stays.join(' + ')}.`);
  if (!plan.nightsAtXtsy) lines.push(`Tip: add 2 days at the start for Shillong and Cherrapunji with nights at ${XTSY.name} — Guwahati is on the way.`);
  if (state.styles.includes('romantic')) lines.push(`💫 Make one night special at **Experience by XTSY**, India’s First Stargaze Glamp: ${inr(PANORAMA_STAY_ONLY)} a night, all inclusive (decoration +${inr(PANORAMA_DECORATION)}).`);
  for (const d of plan.dropped) lines.push(`⚠️ I left out **${d.name}**: ${d.reason}. Add ${d.extraDays} ${d.extraDays === 1 ? 'day' : 'days'} to fit it in.`);
  if (plan.added.length) lines.push(`You had spare time, so I added: ${plan.added.join(', ')}. Say “remove …” to drop any.`);
  for (const p of plan.permits) lines.push(`🪪 ${p}`);
  for (const n of plan.notes) lines.push(`• ${n}`);

  const chips: string[] = [];
  if (plan.dropped.length) chips.push(`Make it ${plan.input.days + plan.dropped[0].extraDays} days`);
  else chips.push(`Make it ${plan.input.days + 2} days`);
  if (!state.camping && plan.input.placeIds.some((id) => PLACE_BY_ID[id]?.cluster === 'east-khasi')) chips.push('Add a camping night at Dawki');
  if (!plan.input.placeIds.includes('nongriat')) chips.push('Add the root bridge trek');
  if (!state.travellers) chips.push('We are 4 people');
  if (state.month === undefined) chips.push('We’re going in December');
  const farAdd: [ClusterId, string][] = [['kaziranga', 'Add Kaziranga'], ['tawang', 'Add Tawang'], ['garo', 'Add Wari Chora']];
  const fa = farAdd.find(([c]) => !plan.input.placeIds.some((id) => PLACE_BY_ID[id]?.cluster === c));
  if (fa) chips.push(fa[1]);
  return { text: lines.join('\n\n'), plan, chips: chips.slice(0, 5), actions: ['send', 'whatsapp', 'book', 'copy', 'reset'] };
}
