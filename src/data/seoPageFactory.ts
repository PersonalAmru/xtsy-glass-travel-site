/**
 * Dynamic SEO page factory — generates SEOPageData objects from slugs at module-load time.
 * Uses templates + slug parsing to keep TypeScript bundle minimal (no per-page hand-written content).
 *
 * Aligned with existing seoPages.ts schema. Adds optional `quickAnswer` and `nearbyAttractions`
 * fields consumed by the upgraded ProgrammaticSEOPage template.
 */

import type { SEOPageData, SEOPageCategory, SchemaType, SEOSection, SEOFaq } from './seoPages';

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
    { question: `Is ${label} safe for solo and female travellers?`, answer: `Yes. Northeast India is among the safest regions in the country, and XTSY runs dedicated female-only dorms with 24/7 reception.` },
    { question: `How do I book a stay near ${label}?`, answer: `Message us on WhatsApp at +91 88373 17070 for instant availability and the best direct rate. Our Shillong base offers 24/7 check-in.` },
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
  { question: `Is breakfast included?`, answer: `Breakfast can be added on at TAB Bistro — message us for the menu and rates.` },
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
}): SEOPageData & { quickAnswer?: string; nearbyAttractions?: string[] } => ({
  slug: params.slug,
  category: params.category,
  title: params.title,
  metaDescription: params.metaDescription,
  h1: params.h1,
  intro: params.intro,
  sections: params.sections,
  faqs: params.faqs,
  schemaType: params.schemaType,
  relatedSlugs: params.related,
  ctaText: params.ctaText,
  ctaLink: params.ctaLink,
  keywords: params.keywords,
  quickAnswer: params.quickAnswer,
  nearbyAttractions: params.nearbyAttractions,
});

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
  const metaDescription = `Find verified, budget-friendly stays near ${inst.name} with 24/7 check-in. Ideal for ${inst.type === 'medical' ? 'patient attendants and visitors' : 'students, parents and visitors'}. WhatsApp booking.`;

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
  const stateRaw = parts.slice(2, -1).join('-');
  const stateLabel = slugToLabel(stateRaw);
  const title = `${slugToLabel(dur)} ${stateLabel} Itinerary (${YEAR}) – Travel Guide, Itinerary & Booking Options`;
  const metaDescription = `Complete ${slugToLabel(dur).toLowerCase()} ${stateLabel} itinerary with day-wise plan, costs, transport and stays. Customise on WhatsApp instantly.`;

  return buildPage({
    slug,
    category: 'itineraries',
    title,
    metaDescription,
    h1: `${slugToLabel(dur)} ${stateLabel} Itinerary for ${YEAR}`,
    intro: `Our ${slugToLabel(dur).toLowerCase()} ${stateLabel} itinerary is the most-asked plan among XTSY travellers. It balances iconic spots, hidden gems, comfortable transit and budget-friendly stays.`,
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
