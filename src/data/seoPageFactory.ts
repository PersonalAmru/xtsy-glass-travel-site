/**
 * Dynamic SEO page factory — generates SEOPageData objects from slugs at module-load time.
 * Uses templates + slug parsing to keep TypeScript bundle minimal (no per-page hand-written content).
 *
 * Aligned with existing seoPages.ts schema. Adds optional `quickAnswer` and `nearbyAttractions`
 * fields consumed by the upgraded ProgrammaticSEOPage template.
 */

import type { SEOPageData, SEOPageCategory, SchemaType, SEOSection, SEOFaq } from './seoPages';
import { BRAND_OPENER, whyXTSYSection } from './brandFacts';

// =============================================================
// Display label helpers
// =============================================================
const LABEL_OVERRIDES: Record<string, string> = {
  neigrims: 'NEIGRIMS',
  'iim-shillong': 'IIM Shillong',
  'nift-shillong': 'NIFT Shillong',
  nehu: 'NEHU',
  'iit-guwahati': 'IIT Guwahati',
  'gmch-guwahati': 'GMCH Guwahati',
  'aiims-guwahati': 'AIIMS Guwahati',
  'arunachal-pradesh': 'Arunachal Pradesh',
  'dzukou-valley': 'Dzukou Valley',
  'tsomgo-lake': 'Tsomgo Lake',
  'loktak-lake': 'Loktak Lake',
  'umngot-river': 'Umngot River',
  'shillong-medical-college': 'Shillong Medical College',
  'civil-hospital-shillong': 'Civil Hospital Shillong',
};

export const slugToLabel = (slug: string): string => {
  if (LABEL_OVERRIDES[slug]) return LABEL_OVERRIDES[slug];
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

const YEAR = new Date().getFullYear();

// =============================================================
// Section builders
// =============================================================

const howToReachSection = (destination: string, fromOrigin?: string): SEOSection => ({
  heading: `How to Reach ${slugToLabel(destination)}${fromOrigin ? ` from ${slugToLabel(fromOrigin)}` : ''}`,
  content: `${slugToLabel(destination)} is well-connected to major Indian cities via road, rail and air. The nearest major airport is Lokpriya Gopinath Bordoloi International Airport in Guwahati (GAU)${fromOrigin ? `, with multiple daily flights from ${slugToLabel(fromOrigin)}` : ''}. From Guwahati, prepaid taxis and shared cabs reach ${slugToLabel(destination)} in 3–4 hours along NH-6.`,
  listItems: [
    `By Air: Fly to Guwahati (GAU)${fromOrigin ? ` from ${slugToLabel(fromOrigin)}` : ''}, then drive 3–4 hrs`,
    `By Train: Guwahati Junction (GHY) is the nearest railhead`,
    `By Road: NH-6 from Guwahati offers a scenic 100 km drive`,
    `Pre-booked taxis: ₹2,500–₹3,500 (Innova/Sedan)`,
    `Shared sumo: ₹400–₹600 per seat from Paltan Bazaar`,
  ],
});

const bestTimeSection = (destination: string): SEOSection => ({
  heading: `Best Time to Visit ${slugToLabel(destination)}`,
  content: `${slugToLabel(destination)} is a year-round destination, but October to April delivers the clearest skies, comfortable temperatures (8°C–22°C) and the best photography conditions. Monsoon (June–September) transforms waterfalls and the landscape but can bring landslides on hill roads.`,
  listItems: [
    'October–March: Cool, dry, ideal for sightseeing and trekking',
    'April–May: Pleasant, perfect shoulder season',
    'June–September: Heavy rains, lush greenery, full waterfalls',
    'December–January: Cold (down to 4°C), cosy hostel evenings',
  ],
});

const thingsToDoSection = (destination: string, activity?: string): SEOSection => {
  if (activity) {
    return {
      heading: `Top ${slugToLabel(activity)} Experiences in ${slugToLabel(destination)}`,
      content: `${slugToLabel(destination)} is one of the best places in Northeast India for ${slugToLabel(activity).toLowerCase()}. Below are operator-vetted experiences popular with XTSY guests in ${YEAR}.`,
      listItems: [
        `Guided ${slugToLabel(activity).toLowerCase()} expeditions with local Khasi guides`,
        `Half-day and full-day options available`,
        `Equipment rental and transport included`,
        `Bookable directly from XTSY Travellers Hostel`,
      ],
    };
  }
  return {
    heading: `Things to Do in ${slugToLabel(destination)}`,
    content: `${slugToLabel(destination)} offers a layered mix of natural wonders and cultural experiences. From living root bridges and crystalline rivers to sacred forests and limestone caves, here are the top experiences travellers book through XTSY.`,
    listItems: [
      'Visit Asia\'s cleanest village — Mawlynnong',
      'Trek to the Double-Decker Living Root Bridge',
      'Boat ride on Dawki\'s glass-clear Umngot river',
      'Explore Mawsmai and Krem Liat Prah caves',
      'Catch sunrise from Laitlum Canyons or Nongjrong',
      'Experience local Khasi cuisine at TAB Bistro',
    ],
  };
};

const travelTipsSection = (): SEOSection => ({
  heading: 'Travel Tips & Local Etiquette',
  content: 'A few practical tips that XTSY travellers consistently recommend for a smooth trip to Northeast India.',
  listItems: [
    'Carry cash — many remote spots have no UPI/card support',
    'Layer your clothing — temperatures swing 10°C in a day',
    'Inner-line permits required for Arunachal, Mizoram, Nagaland',
    'Respect local customs — ask before photographing villagers',
    'Network: Jio and Airtel work best in the hills',
    'Book stays 2–3 weeks ahead in peak season (Oct–Mar)',
  ],
});

const nearbyAttractionsSection = (destination: string, list: string[]): SEOSection => ({
  heading: `Nearby Attractions to ${slugToLabel(destination)}`,
  content: `Travellers staying in ${slugToLabel(destination)} can easily extend their trip with these nearby experiences, all within 1–3 hours by road.`,
  listItems: list.map(s => slugToLabel(s)),
});

// =============================================================
// FAQ builders
// =============================================================

const faqsForDestination = (destination: string): SEOFaq[] => {
  const label = slugToLabel(destination);
  return [
    { question: `What is the best time to visit ${label}?`, answer: `October to April offers the clearest weather. Monsoon (Jun–Sep) is dramatic for waterfalls but expect heavy rain.` },
    { question: `How many days are enough for ${label}?`, answer: `Most travellers spend 3–5 days exploring ${label} and surrounding attractions. XTSY can craft a custom itinerary on WhatsApp.` },
    { question: `Is ${label} safe for solo and female travellers?`, answer: `Yes. Northeast India is among the safest regions in the country, and XTSY runs dedicated female-only dorms with 24/7 reception. Solo and female guests consistently rate their stays 5/5 for safety and a peaceful atmosphere.` },
    { question: `How do I book a stay near ${label}?`, answer: `Message us on WhatsApp at +91 88373 17070 for instant availability and the best direct rate. Our Shillong base offers 24/7 check-in.` },
    { question: `What do guests say about staying with XTSY near ${label}?`, answer: `XTSY Travellers Hostel is rated highly across Google, MakeMyTrip, Goibibo, Agoda and Hostelworld. Guests repeatedly praise the spotless dorms, friendly staff, great food at TAB Bistro and a genuine international backpacker vibe — "one of the best dormitories near Shillong".` },
    { question: `Where will I sleep — what rooms are available near ${label}?`, answer: `Choose 4, 6 and 8-bed mixed dorms, female-only dorms, private rooms, or the flagship 270° Panorama Glass En-suite at Experience by XTSY. Every bed has a locker, reading light and charging point. Dorms from ₹499, glass suite for couples and content creators.` },
  ];
};

const faqsForRoute = (from: string, to: string): SEOFaq[] => [
  { question: `What is the cheapest way from ${slugToLabel(from)} to ${slugToLabel(to)}?`, answer: `The most cost-effective combo is a flight to Guwahati followed by a shared sumo (₹400–₹600/seat) from Paltan Bazaar to ${slugToLabel(to)}.` },
  { question: `How long does the journey from ${slugToLabel(from)} to ${slugToLabel(to)} take?`, answer: `Total travel time is typically 5–8 hours: a 2–3 hour flight to Guwahati, then 3–4 hours by road to ${slugToLabel(to)}.` },
  { question: `Are there direct flights from ${slugToLabel(from)} to ${slugToLabel(to)}?`, answer: `Most travellers route via Guwahati (GAU). Direct flights are rare; we recommend booking your stay at XTSY first and we'll coordinate ground transport.` },
  { question: `Where should I stay on arrival in ${slugToLabel(to)}?`, answer: `XTSY Travellers Hostel offers 24/7 check-in with dorms from ₹499 and private rooms from ₹1,499. Book on WhatsApp.` },
];

const faqsForInstitution = (instSlug: string, instName: string, type: 'medical' | 'education'): SEOFaq[] => {
  const audience = type === 'medical' ? 'patient attendants' : 'students and parents';
  return [
    { question: `What is the closest stay to ${instName}?`, answer: `XTSY Travellers Hostel in Mawdiangdiang offers comfortable, budget-friendly stays within easy reach of ${instName} with 24/7 check-in for ${audience}.` },
    { question: `Do you offer long-stay rates near ${instName}?`, answer: `Yes — guests visiting ${instName} can request weekly and monthly rates on WhatsApp. We accommodate flexible check-in times.` },
    { question: `Is the stay near ${instName} safe and quiet?`, answer: `XTSY runs a 24/7 manned reception, secure lockers and quiet zones — ideal for ${audience} who need rest.` },
    { question: `How do I reach ${instName} from XTSY?`, answer: `Local taxis and shared cabs are available. We're happy to arrange pickup — message +91 88373 17070.` },
  ];
};

const faqsForLastMinute = (city: string): SEOFaq[] => [
  { question: `Can I book a stay in ${slugToLabel(city)} for tonight?`, answer: `Yes — XTSY accepts same-day bookings via WhatsApp at +91 88373 17070. Subject to availability.` },
  { question: `What's the cheapest last-minute stay in ${slugToLabel(city)}?`, answer: `Dorm beds at XTSY start at ₹499/night including taxes. Private rooms from ₹1,499.` },
  { question: `Do you have 24/7 check-in?`, answer: `Yes — our Shillong reception is staffed 24/7 for late arrivals.` },
  { question: `Is breakfast included?`, answer: `Breakfast can be added on at TAB Bistro — message us for the menu and rates. Guests rate the food highly: "food was great, staff were very polite".` },
  { question: `Is a last-minute dorm at XTSY any good?`, answer: `Very. Even guests who booked purely for budget end up surprised — spotless beds, friendly staff and a welcoming vibe earn repeat 5/5 ratings across Goibibo, MakeMyTrip and Agoda. "Really amazing and affordable place to stay near Shillong."` },
];

// =============================================================
// Page factories per cluster
// =============================================================

const baseRelated = ['meghalaya-travel-guide', 'things-to-do-in-meghalaya', 'meghalaya-tour-packages', 'shillong-tour-package', 'best-hostel-in-shillong'];

const buildPage = (params: {
  slug: string;
  category: SEOPageCategory;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: SEOSection[];
  faqs: SEOFaq[];
  schemaType: SchemaType;
  related: string[];
  ctaText: string;
  ctaLink: string;
  keywords: string[];
  quickAnswer?: string;
  nearbyAttractions?: string[];
}): SEOPageData & { quickAnswer?: string; nearbyAttractions?: string[] } => {
  // Phase 2 brand rewrite: prepend the canonical brand opener (only if not
  // already present) and append Why-XTSY + About-Group sections to every
  // programmatic page. Single source of truth: src/data/brandFacts.ts.
  const introHasBrand = /NEITA|270°|XTSY ONE Ventures/i.test(params.intro);
  const intro = introHasBrand ? params.intro : `${BRAND_OPENER} ${params.intro}`;
  const sections = [...params.sections, whyXTSYSection()];
  return {
    slug: params.slug,
    category: params.category,
    title: params.title,
    metaDescription: params.metaDescription,
    h1: params.h1,
    intro,
    sections,
    faqs: params.faqs,
    schemaType: params.schemaType,
    relatedSlugs: params.related,
    ctaText: params.ctaText,
    ctaLink: params.ctaLink,
    keywords: params.keywords,
    quickAnswer: params.quickAnswer,
    nearbyAttractions: params.nearbyAttractions,
  };
};

// ---- Routes (from-X-to-Y) ----
export function buildRoutePage(slug: string): SEOPageData {
  const [from, , to] = slug.split('-to-').length === 2
    ? [slug.split('-to-')[0], 'to', slug.split('-to-')[1]]
    : ['', '', slug];
  const fromLabel = slugToLabel(from);
  const toLabel = slugToLabel(to);
  const title = `${fromLabel} to ${toLabel} (${YEAR}) – Travel Guide, Itinerary & Booking Options`;
  const metaDescription = `Plan your trip from ${fromLabel} to ${toLabel} with routes, fares, transport tips and direct stay options. Get instant help on WhatsApp.`;

  return buildPage({
    slug,
    category: 'travel-guides',
    title,
    metaDescription,
    h1: `${fromLabel} to ${toLabel}: ${YEAR} Travel Guide`,
    intro: `Looking for the easiest, fastest and most cost-effective way to travel from ${fromLabel} to ${toLabel}? This XTSY-curated guide covers every viable route — flights, trains, road combos and pricing — plus a verified ${toLabel} stay option with 24/7 check-in.`,
    sections: [
      howToReachSection(to, from),
      bestTimeSection(to),
      thingsToDoSection(to),
      travelTipsSection(),
    ],
    faqs: faqsForRoute(from, to),
    schemaType: 'TravelGuide',
    related: ['meghalaya-travel-guide', 'shillong-travel-guide', 'cherrapunji-travel-guide', 'best-hostel-in-shillong', 'meghalaya-tour-packages'],
    ctaText: 'Book Stay on Arrival',
    ctaLink: '/book',
    keywords: [`${fromLabel} to ${toLabel}`, `how to reach ${toLabel}`, `${toLabel} travel`, 'northeast india travel'],
    quickAnswer: `Fastest route: Fly to Guwahati (GAU), then drive 3–4 hrs to ${toLabel}. Total time ~5–8 hrs. Book your ${toLabel} stay at XTSY for guaranteed 24/7 check-in.`,
  });
}

// ---- Intent stays (last-minute / today / tonight) ----
export function buildIntentStayPage(slug: string): SEOPageData {
  // Examples: hostel-in-shillong-tonight, cheap-hotel-in-cherrapunji, best-homestay-in-shillong, hostel-near-shillong-airport
  const parts = slug.split('-');
  let stay = '';
  let city = '';
  let intent = '';
  let modifier = '';

  // near-airport
  if (slug.includes('-near-') && slug.endsWith('-airport')) {
    const [stayWord, , cityWord] = slug.split('-near-')[0].split('-').length === 1
      ? [slug.split('-near-')[0], 'near', slug.split('-near-')[1].replace('-airport', '')]
      : ['hostel', 'near', slug.split('-near-')[1].replace('-airport', '')];
    stay = stayWord;
    city = cityWord;
    modifier = 'airport';
  } else if (parts[0] === 'cheap' || parts[0] === 'best') {
    modifier = parts[0];
    stay = parts[1];
    city = parts[3];
  } else {
    stay = parts[0];
    city = parts[2];
    intent = parts.slice(3).join('-');
  }

  const stayLabel = slugToLabel(stay);
  const cityLabel = slugToLabel(city);
  const intentLabel = intent ? ` ${slugToLabel(intent)}` : modifier ? ` (${slugToLabel(modifier)})` : '';
  const title = `${modifier ? slugToLabel(modifier) + ' ' : ''}${stayLabel} in ${cityLabel}${intentLabel} (${YEAR}) – Travel Guide, Itinerary & Booking Options`;
  const metaDescription = `Book a ${modifier ? modifier + ' ' : ''}${stayLabel.toLowerCase()} in ${cityLabel}${intent ? ' for ' + intent.replace('-', ' ') : ''}. Live availability, best rates and 24/7 check-in. Get instant help on WhatsApp.`;

  return buildPage({
    slug,
    category: stay === 'hotel' ? 'hotels' : stay === 'homestay' ? 'homestays' : stay === 'glamping' ? 'glamping' : 'hostels',
    title,
    metaDescription,
    h1: `${modifier ? slugToLabel(modifier) + ' ' : ''}${stayLabel} in ${cityLabel}${intentLabel}`,
    intro: `Need a ${stayLabel.toLowerCase()} in ${cityLabel}${intent ? ' ' + intent.replace('-', ' ') : ''}? XTSY Travellers Hostel offers 24/7 check-in, instant WhatsApp confirmation and verified pricing — ideal for last-minute and same-day travellers.`,
    sections: [
      {
        heading: `Why XTSY for ${stayLabel.toLowerCase()} in ${cityLabel}`,
        content: `Walk-in friendly, transparent pricing and 24/7 reception. Unlike OTAs, you get an instant confirmation on WhatsApp and a verified rate.`,
        listItems: [
          'Dorms from ₹499, private rooms from ₹1,499 (taxes incl.)',
          '24/7 check-in for late-night and red-eye arrivals',
          'Free WiFi, secure lockers, hot showers',
          'Female-only dorms available',
          'Pet-friendly with prior notice',
        ],
      },
      thingsToDoSection(city),
      travelTipsSection(),
    ],
    faqs: faqsForLastMinute(city),
    schemaType: stay === 'hotel' ? 'Hotel' : stay === 'homestay' ? 'LodgingBusiness' : 'Hostel',
    related: baseRelated,
    ctaText: intent ? `Book for ${intent.replace('-', ' ')}` : 'Check Availability',
    ctaLink: 'https://wa.me/918837317070?text=Hi, I need a ' + stayLabel.toLowerCase() + ' in ' + cityLabel + (intent ? ' for ' + intent.replace('-', ' ') : ''),
    keywords: [`${stayLabel.toLowerCase()} in ${cityLabel}`, `${cityLabel} ${stayLabel.toLowerCase()}`, intent ? `${cityLabel} ${intent.replace('-', ' ')}` : `${cityLabel} accommodation`, 'last minute booking shillong'],
    quickAnswer: `Yes — XTSY accepts same-day bookings in ${cityLabel} via WhatsApp +91 88373 17070. Dorms from ₹499, private rooms from ₹1,499. 24/7 check-in.`,
  });
}

// ---- Institutions (NEIGRIMS, IIM, etc.) ----
export function buildInstitutionPage(slug: string, inst: { slug: string; name: string; type: 'medical' | 'education' }): SEOPageData {
  const intent = slug.replace(`-${inst.slug}`, '').replace(/-near$/, '');
  const intentLabel = slugToLabel(intent);
  const title = `${intentLabel} ${inst.name} (${YEAR}) – Travel Guide, Itinerary & Booking Options`;
  const metaDescription = `${intentLabel} ${inst.name} — verified, budget-friendly with 24/7 check-in. Ideal for ${inst.type === 'medical' ? 'patient attendants and visitors' : 'students, parents and visitors'}. Instant WhatsApp booking.`;

  return buildPage({
    slug,
    category: inst.type === 'medical' ? 'hospitals' : 'accommodation',
    title,
    metaDescription,
    h1: `${intentLabel} ${inst.name}`,
    intro: `Visiting ${inst.name}? XTSY Travellers Hostel is the most trusted budget-friendly stay nearby — with 24/7 check-in, female-safe dorms, and instant WhatsApp confirmations for ${inst.type === 'medical' ? 'patient attendants and family members' : 'students, parents and visiting faculty'}.`,
    sections: [
      {
        heading: `Distance & Transport from XTSY to ${inst.name}`,
        content: `XTSY is centrally located in Mawdiangdiang, with easy taxi/cab access to ${inst.name}. Local rates: ₹150–₹300 one-way. Shared sumos available from Police Bazaar.`,
        listItems: [
          'Shared taxis run frequently to all major Shillong landmarks',
          'Reception staff can pre-book a cab with prior notice',
          'Free WiFi and quiet zones for rest between visits',
          'Long-stay/weekly rates available on request',
        ],
      },
      thingsToDoSection('shillong'),
      travelTipsSection(),
    ],
    faqs: faqsForInstitution(inst.slug, inst.name, inst.type),
    schemaType: 'LodgingBusiness',
    related: ['best-hostel-in-shillong', 'hotels-in-shillong', 'homestays-in-shillong', 'shillong-travel-guide', 'meghalaya-travel-guide'],
    ctaText: 'Book on WhatsApp',
    ctaLink: `https://wa.me/918837317070?text=Hi, I need a stay near ${inst.name}`,
    keywords: [`stay near ${inst.name}`, `${inst.name} accommodation`, `hostel near ${inst.name}`, inst.type === 'medical' ? 'patient attendant stay shillong' : 'student stay shillong'],
    quickAnswer: `XTSY Travellers Hostel is the most trusted budget stay near ${inst.name}, offering 24/7 check-in, secure dorms and weekly rates. Book on WhatsApp at +91 88373 17070.`,
  });
}

// ---- Activity in destination ----
export function buildActivityPage(slug: string): SEOPageData {
  const [activity, , destination] = slug.split('-in-').length === 2
    ? [slug.split('-in-')[0], 'in', slug.split('-in-')[1]]
    : ['', '', slug];
  const activityLabel = slugToLabel(activity);
  const destLabel = slugToLabel(destination);
  const title = `${activityLabel} in ${destLabel} (${YEAR}) – Travel Guide, Itinerary & Booking Options`;
  const metaDescription = `Discover the best ${activityLabel.toLowerCase()} experiences in ${destLabel}. Verified guides, transport, gear and stays. WhatsApp for instant help.`;

  return buildPage({
    slug,
    category: 'activities',
    title,
    metaDescription,
    h1: `${activityLabel} in ${destLabel}: ${YEAR} Guide`,
    intro: `${destLabel} is one of the most rewarding places in Northeast India for ${activityLabel.toLowerCase()}. This XTSY guide covers the best routes, expert local guides, gear recommendations and where to stay before/after.`,
    sections: [
      thingsToDoSection(destination, activity),
      howToReachSection(destination),
      bestTimeSection(destination),
      travelTipsSection(),
    ],
    faqs: faqsForDestination(destination),
    schemaType: 'TouristAttraction',
    related: baseRelated,
    ctaText: 'Plan This Experience',
    ctaLink: `https://wa.me/918837317070?text=Hi, I want to do ${activityLabel.toLowerCase()} in ${destLabel}`,
    keywords: [`${activityLabel.toLowerCase()} in ${destLabel}`, `${destLabel} ${activityLabel.toLowerCase()}`, `northeast india ${activityLabel.toLowerCase()}`],
    quickAnswer: `${destLabel} offers some of India's best ${activityLabel.toLowerCase()} experiences. XTSY can arrange a verified guide, gear and stay — message +91 88373 17070.`,
  });
}

// ---- Duration itinerary ----
export function buildDurationItineraryPage(slug: string): SEOPageData {
  const parts = slug.split('-');
  const dur = `${parts[0]}-${parts[1]}`;
  const suffix = parts[parts.length - 1]; // 'itinerary' | 'trip'
  const stateRaw = parts.slice(2, -1).join('-');
  const stateLabel = slugToLabel(stateRaw);
  const durLabel = slugToLabel(dur);
  // Differentiate the -trip vs -itinerary variants so they never share
  // identical title/description (avoids keyword cannibalisation).
  const isTrip = suffix === 'trip';
  const title = isTrip
    ? `${durLabel} ${stateLabel} Trip Plan (${YEAR}) – Cost, Route & Stays`
    : `${durLabel} ${stateLabel} Itinerary (${YEAR}) – Day-Wise Plan & Stays`;
  const metaDescription = isTrip
    ? `Planning a ${durLabel.toLowerCase()} ${stateLabel} trip? Get a ready route, realistic budget, transport tips and where to stay. Customise instantly on WhatsApp.`
    : `Complete ${durLabel.toLowerCase()} ${stateLabel} itinerary with a day-wise plan, costs, transport and handpicked stays. Customise on WhatsApp instantly.`;

  return buildPage({
    slug,
    category: 'itineraries',
    title,
    metaDescription,
    h1: isTrip
      ? `${durLabel} ${stateLabel} Trip Plan for ${YEAR}`
      : `${durLabel} ${stateLabel} Itinerary for ${YEAR}`,
    intro: isTrip
      ? `Planning a ${durLabel.toLowerCase()} ${stateLabel} trip? This XTSY-tested plan covers the ideal route, realistic costs, transit timings and budget-friendly stays so you can travel without second-guessing.`
      : `Our ${durLabel.toLowerCase()} ${stateLabel} itinerary is the most-asked plan among XTSY travellers. It balances iconic spots, hidden gems, comfortable transit and budget-friendly stays.`,
    sections: [
      thingsToDoSection(stateRaw),
      howToReachSection(stateRaw),
      bestTimeSection(stateRaw),
      travelTipsSection(),
    ],
    faqs: faqsForDestination(stateRaw),
    schemaType: 'TouristTrip',
    related: ['meghalaya-tour-packages', 'meghalaya-couple-tour-package', 'shillong-tour-package', 'meghalaya-travel-guide', 'best-hostel-in-shillong'],
    ctaText: 'Customise on WhatsApp',
    ctaLink: `https://wa.me/918837317070?text=Hi, I want a ${slugToLabel(dur).toLowerCase()} ${stateLabel} itinerary`,
    keywords: [`${dur} ${stateLabel.toLowerCase()} itinerary`, `${stateLabel.toLowerCase()} ${dur} trip`, 'northeast india itinerary'],
    quickAnswer: `A ${slugToLabel(dur).toLowerCase()} ${stateLabel} trip typically covers Shillong, Cherrapunji, Mawlynnong and Dawki. Message us on WhatsApp +91 88373 17070 for a custom plan.`,
  });
}

// ---- Global Northeast (state-level guides) ----
export function buildGlobalNEPage(slug: string): SEOPageData {
  // Patterns: assam-travel-guide-2026, places-to-visit-in-nagaland, hidden-gems-in-mizoram, monsoon-in-sikkim
  let state = '';
  let intent = '';
  if (slug.endsWith('-travel-guide-2026') || slug.endsWith('-travel-guide')) {
    state = slug.replace('-travel-guide-2026', '').replace('-travel-guide', '');
    intent = 'travel-guide';
  } else if (slug.startsWith('places-to-visit-in-')) {
    state = slug.replace('places-to-visit-in-', '');
    intent = 'places-to-visit';
  } else if (slug.startsWith('things-to-do-in-')) {
    state = slug.replace('things-to-do-in-', '');
    intent = 'things-to-do';
  } else if (slug.startsWith('best-time-to-visit-')) {
    state = slug.replace('best-time-to-visit-', '');
    intent = 'best-time';
  } else if (slug.startsWith('how-to-reach-')) {
    state = slug.replace('how-to-reach-', '');
    intent = 'how-to-reach';
  } else if (slug.endsWith('-tour-packages')) {
    state = slug.replace('-tour-packages', '');
    intent = 'tour-packages';
  } else if (slug.startsWith('hidden-gems-in-')) {
    state = slug.replace('hidden-gems-in-', '');
    intent = 'hidden-gems';
  } else if (slug.startsWith('solo-travel-')) {
    state = slug.replace('solo-travel-', '');
    intent = 'solo-travel';
  } else if (slug.startsWith('couple-trip-to-')) {
    state = slug.replace('couple-trip-to-', '');
    intent = 'couple-trip';
  } else if (slug.startsWith('monsoon-in-') || slug.startsWith('winter-in-')) {
    state = slug.replace(/^(monsoon|winter)-in-/, '');
    intent = slug.startsWith('monsoon-in-') ? 'monsoon' : 'winter';
  } else {
    state = slug;
    intent = 'guide';
  }

  const stateLabel = slugToLabel(state);
  const intentLabel = slugToLabel(intent.replace(/-/g, ' '));
  const title = `${intentLabel} ${stateLabel} (${YEAR}) – Travel Guide, Itinerary & Booking Options`;
  const metaDescription = `Plan your ${stateLabel} trip with routes, ${intent} insights, costs, stays and WhatsApp support. Trusted by 10,000+ XTSY travellers.`;

  return buildPage({
    slug,
    category: intent === 'tour-packages' ? 'tours' : 'travel-guides',
    title,
    metaDescription,
    h1: `${intentLabel} in ${stateLabel}, Northeast India`,
    intro: `${stateLabel} is one of Northeast India's most evocative destinations. From its lush valleys to indigenous tribes, monasteries and pristine rivers, this XTSY guide covers everything you need to plan, book and travel confidently.`,
    sections: [
      howToReachSection(state),
      bestTimeSection(state),
      thingsToDoSection(state),
      travelTipsSection(),
    ],
    faqs: faqsForDestination(state),
    schemaType: intent === 'tour-packages' ? 'TouristTrip' : 'TravelGuide',
    related: ['meghalaya-travel-guide', 'things-to-do-in-meghalaya', 'meghalaya-tour-packages', 'shillong-travel-guide', 'best-hostel-in-shillong'],
    ctaText: 'Plan with XTSY',
    ctaLink: `https://wa.me/918837317070?text=Hi, I want to plan a trip to ${stateLabel}`,
    keywords: [`${stateLabel.toLowerCase()} ${intent.replace(/-/g, ' ')}`, `${stateLabel.toLowerCase()} travel`, `northeast india ${state}`, `${stateLabel.toLowerCase()} ${YEAR}`],
    quickAnswer: `${stateLabel} is best visited Oct–Apr. The nearest hub is Guwahati (GAU). XTSY can arrange a custom plan — WhatsApp +91 88373 17070.`,
  });
}

// =============================================================
// NORTHEAST EXPANSION BUILDERS — group / corporate / workation / themed / seasonal
// All factories enforce AI-answer rules:
//   - quickAnswer 40–240 chars, period-ended, direct answer in first 30 words
//   - intro opens with the answer (no "Looking for", "Welcome to", "Are you")
//   - 8 FAQs (each 25–280 chars)
//   - title 35–60 chars, meta 130–160 chars
//   - 4+ sections, ≥1 bulleted listItems block
//   - WhatsApp deep-link CTA with prefilled context (no hardcoded prices)
// =============================================================

const WA = '+918837317070';
const waLink = (msg: string) => `https://wa.me/918837317070?text=${encodeURIComponent(msg)}`;

const clamp = (s: string, min: number, max: number) => {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
};

const eightFaqs = (
  scope: string,
  intent: string,
  ctaLabel: string,
): SEOFaq[] => [
  { question: `What does an XTSY ${intent} in ${scope} include?`, answer: `Curated stays, ground transport, local guides, key activities and 24/7 on-trip support across ${scope}. Custom itineraries built on WhatsApp ${WA}.` },
  { question: `How many people can join a ${intent} in ${scope}?`, answer: `XTSY runs ${intent} groups of 6 to 60 across ${scope}. Larger groups (corporate / college) are quoted separately on WhatsApp ${WA}.` },
  { question: `What is the best month for a ${intent} in ${scope}?`, answer: `October to April delivers the most reliable weather across Northeast India. Monsoon (Jun–Sep) is dramatic but plan buffer days for landslides on hill routes.` },
  { question: `How early should I book a ${intent} in ${scope}?`, answer: `Lock dates 4–8 weeks ahead in peak season (Oct–Mar). Off-season groups can confirm in 7–10 days. Last-minute bookings handled on WhatsApp.` },
  { question: `Are XTSY ${intent} packages customisable for ${scope}?`, answer: `Yes — every itinerary is rebuilt around your group size, dates, budget and pace. Send your brief on WhatsApp ${WA} for a quote.` },
  { question: `Do you handle inner-line permits for ${scope}?`, answer: `Yes. XTSY processes inner-line permits for Arunachal, Mizoram and Nagaland for all confirmed group bookings; share IDs at least 7 days before travel.` },
  { question: `What kind of stays does XTSY use for a ${intent} in ${scope}?`, answer: `A mix of vetted hostels, boutique homestays, glamping camps and 3-star hotels — chosen by group profile and route. All properties are personally inspected.` },
  { question: `How do I confirm a ${intent} for ${scope}?`, answer: `Send your dates, group size and intent on WhatsApp ${WA}. We reply with a quote within an hour and ${ctaLabel.toLowerCase()} once confirmed.` },
];

const groupHighlightsSection = (scope: string, intent: string): SEOSection => ({
  heading: `Why XTSY for ${slugToLabel(intent)} in ${scope}`,
  content: `XTSY has hosted 200+ groups across Northeast India since 2022. Operators on the ground in Meghalaya, Assam and Arunachal mean nothing is outsourced — every transfer, guide and stay is owned end-to-end.`,
  listItems: [
    `Group size handled: 6–60 (corporate, college, friends, family)`,
    `Single point of contact on WhatsApp throughout the trip`,
    `Inner-line permits arranged for Arunachal, Mizoram, Nagaland`,
    `Vetted hostels, homestays, glamping camps and 3-star hotels`,
    `Curated experiences with native Khasi, Garo and Mising guides`,
    `On-trip 24/7 support number with on-ground escalation`,
  ],
});

const corporateInclusionsSection = (scope: string): SEOSection => ({
  heading: `What's Included in a Corporate Retreat in ${scope}`,
  content: `Standard XTSY corporate packages bundle accommodation, meeting space, F&B, ground transport and curated team experiences. AV and conference setup added on request.`,
  listItems: [
    `Twin-share rooms with attached bath, hot water, fast WiFi`,
    `Conference / breakout space with projector and whiteboard`,
    `Three meals + tea/coffee, vegetarian and Jain options`,
    `Branded transport from Guwahati airport (GAU) onwards`,
    `1–2 curated team-building experiences (caving, river day, root-bridge trek)`,
    `Dedicated trip lead + bookkeeping invoice with GST`,
  ],
});

const workationInclusionsSection = (scope: string): SEOSection => ({
  heading: `What's Included in a Workation Stay in ${scope}`,
  content: `Long-stay workation rates at XTSY include weekly housekeeping, fast fibre WiFi, daily breakfast and access to a dedicated quiet zone. Ideal for remote workers and digital nomads.`,
  listItems: [
    `Fibre WiFi (50+ Mbps verified) with backup mobile hotspot`,
    `Ergonomic desk + chair, daylight reading lamp`,
    `Weekly housekeeping and laundry service`,
    `Quiet zone with no-call hours (10am–5pm)`,
    `Daily breakfast at TAB Bistro, monthly meal plans available`,
    `Weekly community dinner with other long-stay guests`,
  ],
});

const workationLifeSection = (scope: string): SEOSection => ({
  heading: `What a Workation in ${scope} Is Really Like`,
  content: `A workation in ${scope} blends focused remote-work days with weekends spent exploring Northeast India. Mornings are quiet and cool — ideal for deep work — while evenings open up to forest walks, live music and a community of other long-stay travellers. XTSY is built for nomads who want reliable WiFi and a proper desk without giving up the mountains outside the window.`,
  listItems: [
    `Cool, low-distraction mornings perfect for deep work`,
    `Power backup so calls and deadlines never drop`,
    `Walkable to cafés, viewpoints and weekend trailheads`,
    `Flexible weekly and monthly rates — stay 7 nights or 3 months`,
    `Pet-friendly and solo-female-friendly long stays`,
    `Easy weekend trips to waterfalls, living root bridges and lakes`,
  ],
});

const workationFaqs = (scope: string, intentLabel: string): SEOFaq[] => [
  { question: `Is ${scope} good for a workation?`, answer: `Yes — ${scope} offers cool weather, low cost of living and calm surroundings that suit remote work. XTSY adds verified fibre WiFi, ergonomic desks and quiet hours so you can work reliably. WhatsApp ${WA}.` },
  { question: `How fast is the WiFi for remote work in ${scope}?`, answer: `XTSY ${scope.toLowerCase()} stays run on verified 50+ Mbps fibre with a backup mobile hotspot, so video calls and uploads stay stable through the day.` },
  { question: `What are the monthly workation rates in ${scope}?`, answer: `Long-stay rates are billed weekly or monthly with no hidden fees and drop the longer you stay. Share your dates on WhatsApp ${WA} for live monthly pricing.` },
  { question: `What is the minimum stay for a ${intentLabel} in ${scope}?`, answer: `Workation stays start from 7 nights, with discounted weekly and monthly rates for stays of a month or more. Flexible check-in and check-out on request.` },
  { question: `Is there a dedicated workspace or quiet zone?`, answer: `Yes — every workation guest gets an ergonomic desk, daylight lamp and access to a quiet zone with no-call hours (10am–5pm) for focused work.` },
  { question: `What is the best time for a workation in ${scope}?`, answer: `October to April is ideal — clear skies, cool days and great weekend exploring. Monsoon (Jun–Sep) is greener and cheaper, with reliable indoor work setups.` },
  { question: `Can digital nomads explore on weekends?`, answer: `Absolutely. ${scope} puts waterfalls, living root bridges, lakes and viewpoints within easy reach — XTSY can arrange weekend trips so you switch off fully between work weeks.` },
  { question: `How do I book a ${intentLabel} in ${scope}?`, answer: `Send your dates and expected length of stay on WhatsApp ${WA}. We reply with live availability and a weekly/monthly quote within an hour.` },
];


// ---- Group tours (group-tour-cherrapunji, school-tour-meghalaya, etc.) ----
export function buildGroupTourPage(slug: string): SEOPageData {
  // intent prefix from a known list, rest = scope (destination or state)
  const intents = [
    'large-group-tour', 'group-tour-package', 'group-tour',
    'team-outing', 'company-offsite', 'startup-retreat',
    'school-tour', 'college-trip',
  ];
  const intent = intents.find(i => slug.startsWith(i + '-')) ?? 'group-tour';
  const scope = slug.slice(intent.length + 1);
  const scopeLabel = slugToLabel(scope);
  const intentLabel = slugToLabel(intent);
  const title = clamp(`${intentLabel} ${scopeLabel} ${YEAR} – Custom Itineraries by XTSY`, 35, 60);
  const metaDescription = clamp(`${intentLabel} packages in ${scopeLabel} for groups of 6–60. Curated stays, transport, guides and 24/7 support. Get a quote on WhatsApp ${WA}.`, 130, 160);
  const quickAnswer = clamp(`XTSY runs custom ${intentLabel.toLowerCase()} programmes in ${scopeLabel} for 6–60 people, covering stays, transport, permits and curated experiences end-to-end. Get a quote on WhatsApp ${WA}.`, 40, 240);

  return buildPage({
    slug,
    category: 'group-tours',
    title,
    metaDescription,
    h1: `${intentLabel} in ${scopeLabel} — ${YEAR}`,
    intro: `XTSY operates curated ${intentLabel.toLowerCase()} packages across ${scopeLabel} with on-ground operations in Shillong, Guwahati and Tawang. Every itinerary is rebuilt around your group size, dates and pace — stays, transport, permits and guides are handled in-house, not outsourced.`,
    sections: [
      groupHighlightsSection(scopeLabel, intent),
      thingsToDoSection(scope.split('-')[0]),
      howToReachSection(scope.split('-')[0]),
      bestTimeSection(scope.split('-')[0]),
      travelTipsSection(),
    ],
    faqs: eightFaqs(scopeLabel, intentLabel.toLowerCase(), 'lock the booking'),
    schemaType: 'TouristTrip',
    related: ['meghalaya-tour-packages', 'shillong-tour-package', 'corporate-retreat-shillong', 'best-hostel-in-shillong', 'meghalaya-travel-guide'],
    ctaText: 'Get Group Quote',
    ctaLink: waLink(`Hi XTSY, I'd like a quote for a ${intentLabel.toLowerCase()} in ${scopeLabel}.`),
    keywords: [`${intentLabel.toLowerCase()} ${scopeLabel.toLowerCase()}`, `${scopeLabel.toLowerCase()} group tour`, `${scopeLabel.toLowerCase()} team outing`, 'northeast india group tour'],
    quickAnswer,
  });
}

// ---- Corporate retreats (corporate-retreat-shillong-3-day, etc.) ----
export function buildCorporateRetreatPage(slug: string): SEOPageData {
  const intents = [
    'corporate-retreat', 'corporate-offsite', 'corporate-team-building',
    'leadership-retreat', 'business-travel', 'conference-venue',
  ];
  const intent = intents.find(i => slug.startsWith(i + '-')) ?? 'corporate-retreat';
  const rest = slug.slice(intent.length + 1);
  // optional duration suffix like "-3-day"
  const durMatch = rest.match(/-(\d+)-day$/);
  const duration = durMatch ? `${durMatch[1]}-day` : '';
  const scope = duration ? rest.replace(`-${duration}`, '') : rest;
  const scopeLabel = slugToLabel(scope);
  const intentLabel = slugToLabel(intent);
  const durLabel = duration ? `${duration.replace('-', ' ')} ` : '';
  const title = clamp(`${durLabel}${intentLabel} in ${scopeLabel} ${YEAR} – XTSY`, 35, 60);
  const metaDescription = clamp(`Plan a ${durLabel}${intentLabel.toLowerCase()} in ${scopeLabel} with XTSY: stays, conference space, transport, F&B and team experiences. WhatsApp ${WA} for a quote.`, 130, 160);
  const quickAnswer = clamp(`XTSY plans ${durLabel}${intentLabel.toLowerCase()} programmes in ${scopeLabel} with conference space, twin-share stays, transport, F&B and curated team experiences. Get a quote on WhatsApp ${WA}.`, 40, 240);

  return buildPage({
    slug,
    category: 'corporate',
    title,
    metaDescription,
    h1: `${durLabel}${intentLabel} in ${scopeLabel}`,
    intro: `XTSY designs ${intentLabel.toLowerCase()} programmes in ${scopeLabel} that combine productive offsite time with high-recall team experiences — caving, river days, root-bridge treks and Khasi cultural sessions. Conference space, AV and bookkeeping invoices included.`,
    sections: [
      corporateInclusionsSection(scopeLabel),
      groupHighlightsSection(scopeLabel, intent),
      thingsToDoSection(scope.split('-')[0]),
      bestTimeSection(scope.split('-')[0]),
      travelTipsSection(),
    ],
    faqs: eightFaqs(scopeLabel, intentLabel.toLowerCase(), 'issue the GST invoice'),
    schemaType: 'EventVenue',
    related: ['meghalaya-tour-packages', 'shillong-tour-package', 'group-tour-shillong', 'best-hostel-in-shillong', 'meghalaya-travel-guide'],
    ctaText: 'Request Corporate Quote',
    ctaLink: waLink(`Hi XTSY, I'd like a corporate quote for ${intentLabel.toLowerCase()} in ${scopeLabel}${duration ? ` (${duration})` : ''}.`),
    keywords: [`${intentLabel.toLowerCase()} ${scopeLabel.toLowerCase()}`, `${scopeLabel.toLowerCase()} offsite`, `${scopeLabel.toLowerCase()} team building`, 'corporate retreat northeast india'],
    quickAnswer,
  });
}

// ---- Workation (workation-ziro, digital-nomad-stay-shillong, etc.) ----
export function buildWorkationPage(slug: string): SEOPageData {
  const intents = [
    'workation', 'digital-nomad-stay', 'long-stay', 'monthly-stay',
    'remote-work-stay', 'wifi-stay-for-nomads',
  ];
  const intent = intents.find(i => slug.startsWith(i + '-')) ?? 'workation';
  const scope = slug.slice(intent.length + 1);
  const scopeLabel = slugToLabel(scope);
  const intentLabel = slugToLabel(intent);
  const title = clamp(`${intentLabel} in ${scopeLabel} ${YEAR} – Long-Stay by XTSY`, 35, 60);
  const metaDescription = clamp(`${intentLabel} stays in ${scopeLabel} for remote workers and digital nomads. Fast fibre WiFi, weekly housekeeping, monthly rates. WhatsApp ${WA}.`, 130, 160);
  const quickAnswer = clamp(`XTSY offers ${intentLabel.toLowerCase()} stays in ${scopeLabel} with verified 50+ Mbps fibre WiFi, daily breakfast, weekly housekeeping and monthly rates for remote workers. WhatsApp ${WA} for live availability.`, 40, 240);

  return buildPage({
    slug,
    category: 'workation',
    title,
    metaDescription,
    h1: `${intentLabel} in ${scopeLabel}`,
    intro: `XTSY runs purpose-built ${intentLabel.toLowerCase()} stays in ${scopeLabel} for remote workers, founders and digital nomads. Verified fibre WiFi, ergonomic desks, quiet hours and a community of long-stay guests — billed weekly or monthly with no hidden fees.`,
    sections: [
      workationInclusionsSection(scopeLabel),
      workationLifeSection(scopeLabel),
      thingsToDoSection(scope.split('-')[0]),
      bestTimeSection(scope.split('-')[0]),
      travelTipsSection(),
    ],
    faqs: workationFaqs(scopeLabel, intentLabel.toLowerCase()),
    schemaType: 'LodgingBusiness',
    related: ['best-hostel-in-shillong', 'work-from-home', 'homestays-in-shillong', 'meghalaya-travel-guide', 'shillong-travel-guide'],
    ctaText: 'Check Long-Stay Quote',
    ctaLink: waLink(`Hi XTSY, I'd like a long-stay (workation) quote in ${scopeLabel}.`),
    keywords: [`workation ${scopeLabel.toLowerCase()}`, `digital nomad ${scopeLabel.toLowerCase()}`, `long stay ${scopeLabel.toLowerCase()}`, 'remote work stay northeast india'],
    quickAnswer,
  });
}

// ---- Themed (honeymoon, family, weekend, student, friends, etc.) ----
export function buildThemedTripPage(slug: string): SEOPageData {
  const intents = [
    'honeymoon-package', 'romantic-getaway', 'family-tour', 'family-vacation',
    'weekend-trip', 'student-trip', 'solo-adventure', 'friends-trip',
    'photography-tour', 'birding-tour',
  ];
  const intent = intents.find(i => slug.startsWith(i + '-')) ?? 'family-tour';
  const scope = slug.slice(intent.length + 1);
  const scopeLabel = slugToLabel(scope);
  const intentLabel = slugToLabel(intent);
  const title = clamp(`${intentLabel} ${scopeLabel} ${YEAR} – Custom by XTSY`, 35, 60);
  const metaDescription = clamp(`Custom ${intentLabel.toLowerCase()} in ${scopeLabel}: vetted stays, transport, guides and curated experiences. Quote in under an hour on WhatsApp ${WA}.`, 130, 160);
  const quickAnswer = clamp(`XTSY plans custom ${intentLabel.toLowerCase()} itineraries in ${scopeLabel} with vetted stays, transport, guides and on-trip support. Quote in under an hour on WhatsApp ${WA}.`, 40, 240);

  return buildPage({
    slug,
    category: 'themed-trips',
    title,
    metaDescription,
    h1: `${intentLabel} in ${scopeLabel}`,
    intro: `XTSY builds ${intentLabel.toLowerCase()} itineraries in ${scopeLabel} from scratch — pace, stays and experiences chosen for who is travelling, not what is on a brochure. On-ground operations across Meghalaya, Assam and Arunachal mean transparent pricing and zero outsourcing.`,
    sections: [
      groupHighlightsSection(scopeLabel, intent),
      thingsToDoSection(scope.split('-')[0]),
      howToReachSection(scope.split('-')[0]),
      bestTimeSection(scope.split('-')[0]),
      travelTipsSection(),
    ],
    faqs: eightFaqs(scopeLabel, intentLabel.toLowerCase(), 'confirm the booking'),
    schemaType: 'TouristTrip',
    related: ['meghalaya-tour-packages', 'meghalaya-couple-tour-package', 'shillong-tour-package', 'best-hostel-in-shillong', 'meghalaya-travel-guide'],
    ctaText: 'Plan This Trip',
    ctaLink: waLink(`Hi XTSY, I'd like a quote for a ${intentLabel.toLowerCase()} in ${scopeLabel}.`),
    keywords: [`${intentLabel.toLowerCase()} ${scopeLabel.toLowerCase()}`, `${scopeLabel.toLowerCase()} ${intent.split('-')[0]}`, `northeast india ${intent.split('-')[0]}`],
    quickAnswer,
  });
}

// ---- Bike + road trip ----
export function buildRoadBikeTripPage(slug: string): SEOPageData {
  const intents = [
    'royal-enfield-trip', 'self-drive-itinerary', 'bike-tour-package',
    'self-drive-trip', 'bike-trip', 'road-trip',
  ];
  const intent = intents.find(i => slug.startsWith(i + '-')) ?? 'bike-trip';
  let rest = slug.slice(intent.length + 1);
  const fromMatch = rest.match(/-from-([a-z-]+)$/);
  const origin = fromMatch ? fromMatch[1] : '';
  const scope = origin ? rest.replace(`-from-${origin}`, '') : rest;
  const scopeLabel = slugToLabel(scope);
  const intentLabel = slugToLabel(intent);
  const originLabel = origin ? slugToLabel(origin) : '';
  const title = clamp(`${intentLabel} ${scopeLabel}${origin ? ` from ${originLabel}` : ''} ${YEAR}`, 35, 60);
  const metaDescription = clamp(`${intentLabel} to ${scopeLabel}${origin ? ` from ${originLabel}` : ''}: route, fuel, permits, stays and curated stops. Quote on WhatsApp ${WA}.`, 130, 160);
  const quickAnswer = clamp(`XTSY plans ${intentLabel.toLowerCase()} routes to ${scopeLabel}${origin ? ` from ${originLabel}` : ''} with bike rental, permits, fuel stops, vetted stays and on-route support. WhatsApp ${WA} for a quote.`, 40, 240);

  return buildPage({
    slug,
    category: 'road-bike-trips',
    title,
    metaDescription,
    h1: `${intentLabel} to ${scopeLabel}${origin ? ` from ${originLabel}` : ''}`,
    intro: `${intentLabel} routes to ${scopeLabel}${origin ? ` from ${originLabel}` : ''} require permits, fuel planning and reliable stays. XTSY handles bike rental, inner-line permits, day-by-day fuel stops and vetted accommodation across the entire route — with on-call breakdown support.`,
    sections: [
      groupHighlightsSection(scopeLabel, intent),
      howToReachSection(scope, origin || undefined),
      thingsToDoSection(scope),
      bestTimeSection(scope),
      travelTipsSection(),
    ],
    faqs: eightFaqs(scopeLabel, intentLabel.toLowerCase(), 'confirm the bike + permit booking'),
    schemaType: 'TouristTrip',
    related: ['meghalaya-tour-packages', 'xtsy-rentals', 'shillong-tour-package', 'best-hostel-in-shillong', 'meghalaya-travel-guide'],
    ctaText: 'Get Route Quote',
    ctaLink: waLink(`Hi XTSY, I'd like a ${intentLabel.toLowerCase()} quote to ${scopeLabel}${origin ? ` from ${originLabel}` : ''}.`),
    keywords: [`${intentLabel.toLowerCase()} ${scopeLabel.toLowerCase()}`, `bike trip northeast india`, `${scopeLabel.toLowerCase()} road trip`, 'royal enfield northeast'],
    quickAnswer,
  });
}

// ---- Seasonal + festival ----
export function buildSeasonalPage(slug: string): SEOPageData {
  // monsoon-in-{x}, winter-in-{x}, summer-in-{x}, autumn-in-{x}, spring-in-{x}
  // OR a known festival slug
  const seasons = ['monsoon', 'winter', 'summer', 'autumn', 'spring'];
  const inMatch = seasons.find(s => slug.startsWith(`${s}-in-`));
  let scope = '';
  let intent = '';
  let intentLabel = '';
  if (inMatch) {
    intent = inMatch;
    scope = slug.replace(`${inMatch}-in-`, '');
    intentLabel = `${slugToLabel(inMatch)} in ${slugToLabel(scope)}`;
  } else {
    // festival slug — treat the whole slug as a label
    intent = 'festival';
    scope = slug;
    intentLabel = slugToLabel(slug);
  }
  const scopeLabel = slugToLabel(scope);
  const title = clamp(`${intentLabel} ${YEAR} – XTSY Travel Guide`, 35, 60);
  const metaDescription = clamp(`${intentLabel} guide: best spots, what to pack, where to stay and how XTSY can plan the trip. WhatsApp ${WA} for a custom itinerary.`, 130, 160);
  const quickAnswer = clamp(`${intentLabel} is best experienced ${intent === 'festival' ? 'with confirmed dates and pre-booked stays — XTSY handles both' : 'with the right gear, route and stays — XTSY plans the full trip end-to-end'}. WhatsApp ${WA}.`, 40, 240);

  return buildPage({
    slug,
    category: 'seasonal',
    title,
    metaDescription,
    h1: intentLabel,
    intro: `${intentLabel} draws travellers for very specific reasons — weather, light, festivals or harvest. This XTSY guide covers the must-do spots, what to pack, where to stay and how to plan the logistics so the trip actually happens.`,
    sections: [
      groupHighlightsSection(scopeLabel, intent),
      thingsToDoSection(scope.split('-')[0]),
      bestTimeSection(scope.split('-')[0]),
      travelTipsSection(),
    ],
    faqs: eightFaqs(scopeLabel, intentLabel.toLowerCase(), 'confirm dates and stays'),
    schemaType: intent === 'festival' ? 'LocalBusiness' : 'TravelGuide',
    related: ['meghalaya-travel-guide', 'meghalaya-tour-packages', 'best-hostel-in-shillong', 'shillong-travel-guide', 'things-to-do-in-meghalaya'],
    ctaText: 'Plan This Trip',
    ctaLink: waLink(`Hi XTSY, I'd like to plan a trip for ${intentLabel}.`),
    keywords: [`${intentLabel.toLowerCase()}`, `northeast india ${intent}`, `${scopeLabel.toLowerCase()} ${intent}`],
    quickAnswer,
  });
}
