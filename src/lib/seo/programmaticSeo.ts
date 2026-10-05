/**
 * Shared SEO/AEO model for the ~530 programmatic pages (/$slug).
 *
 * Used by both the route head() — so titles, robots, the hero preload and ALL
 * JSON-LD are in the server-rendered HTML that search engines and AI crawlers
 * (GPTBot, PerplexityBot, ClaudeBot… which don't run JavaScript) read — and by
 * the page component, so what's in the schema is also visible on the page.
 */
import { findSEOPage, ALL_SEO_PAGES, type SEOPageData } from '@/data/seoPages';
import { isConsolidatedSEOSlug, isIndexableSEOSlug } from '@/data/seoIndexPolicy';
import { IMG, COVERS, first } from '@/data/v2Images';
import { BISTRO_COVER } from '@/data/bistroCover';
import { photoFor } from '@/data/v2TourImages';
import { responsiveImage } from '@/data/cdnImages';
import { inr, lowestDormPrice, roomPrice } from '@/components/v2/pricing';
import { PANORAMA_STAY_ONLY } from '@/data/panoramaPricing';
import { CLUSTERS, PLACES, type Place } from '@/lib/travel/places';
import { fromXtsy } from '@/lib/travel/routing';

const SITE = 'https://xtsy.one';
export const SEO_CONTENT_UPDATED = '2026-09-27';

export const CATEGORY_LABELS: Record<string, string> = {
  hostels: 'Hostels', hotels: 'Hotels', homestays: 'Homestays', glamping: 'Glamping',
  accommodation: 'Stays', rentals: 'Rentals', tours: 'Tour packages',
  'travel-guides': 'Travel guides', destinations: 'Destinations', attractions: 'Attractions',
  itineraries: 'Itineraries', activities: 'Activities', hospitals: 'Stays near hospitals',
  restaurants: 'Food & dining', weddings: 'Weddings & events', transport: 'Transport',
  'competitor-capture': 'Hostel comparison', 'food-dining': 'Food & dining',
  seasonal: 'Seasonal guides', events: 'Events', 'travel-agency': 'Travel agency',
  'group-tours': 'Group trips', corporate: 'Corporate offsites', workation: 'Workation',
  'themed-trips': 'Themed trips', 'road-bike-trips': 'Road & bike trips',
};

/** Category hub each programmatic page belongs to (breadcrumb level 2). */
const CATEGORY_HUB: Record<string, string> = {
  hostels: '/best-hostel-in-shillong', accommodation: '/best-hostel-in-shillong', hotels: '/hotels-in-shillong',
  homestays: '/homestays-in-shillong', glamping: '/luxury-glamping-shillong', hospitals: '/best-hostel-in-shillong',
  workation: '/work-from-home', rentals: '/xtsy-rentals', tours: '/tours', 'group-tours': '/group-bookings-meghalaya',
  corporate: '/group-bookings-meghalaya', 'themed-trips': '/tours', 'road-bike-trips': '/expeditions',
  restaurants: '/tab-bistro', 'food-dining': '/tab-bistro', weddings: '/destination-wedding-shillong',
  destinations: '/things-to-do-in-meghalaya', attractions: '/things-to-do-in-meghalaya', 'travel-guides': '/things-to-do-in-meghalaya',
  itineraries: '/things-to-do-in-meghalaya', seasonal: '/best-time-to-visit-meghalaya', activities: '/things-to-do-in-meghalaya',
};

const STAY_CATS = new Set(['hostels', 'accommodation', 'hotels', 'homestays', 'glamping', 'hospitals', 'workation', 'competitor-capture']);
/** Pages that sell travel beyond Shillong get the "go further" block. */
const TRAVEL_CATS = new Set(['destinations', 'attractions', 'travel-guides', 'itineraries', 'tours', 'themed-trips', 'road-bike-trips', 'seasonal', 'activities', 'group-tours']);

const TOWNS: [RegExp, string][] = [
  [/guwahati/, 'Guwahati'], [/gangtok|sikkim/, 'Gangtok'], [/kohima|nagaland/, 'Kohima'], [/cherrapunji|cherrapunjee|sohra/, 'Cherrapunji'],
  [/dawki/, 'Dawki'], [/mawlynnong/, 'Mawlynnong'], [/tawang|arunachal/, 'Tawang'], [/kaziranga/, 'Kaziranga'], [/tura|garo/, 'Tura'],
  [/imphal|manipur/, 'Imphal'], [/aizawl|mizoram/, 'Aizawl'], [/agartala|tripura/, 'Agartala'], [/jowai/, 'Jowai'],
];

export function townOf(page: SEOPageData): string | null {
  const s = `${page.slug} ${page.h1}`.toLowerCase();
  if (/shillong|new-shillong|meghalaya-hostel/.test(page.slug)) return null;
  for (const [re, name] of TOWNS) if (re.test(s)) return name;
  return null;
}

/** Places the page is about (for distances, seasons and permits). */
export function placesOf(page: SEOPageData): Place[] {
  const t = ` ${page.slug.replace(/-/g, ' ')} ${page.h1.toLowerCase()} `;
  const hits: Place[] = [];
  for (const p of PLACES) {
    if (p.id === 'shillong') continue;
    if ([p.name.toLowerCase(), ...p.aliases].some((a) => a.length > 3 && t.includes(` ${a} `))) hits.push(p);
  }
  return hits.slice(0, 3);
}

export interface Hero { src: string; srcSet?: string; w?: number; h?: number; alt: string }

export function heroFor(page: SEOPageData): Hero {
  let src = '';
  const c = page.category;
  if (c === 'restaurants' || c === 'food-dining' || /bistro|restaurant|cafe|food/.test(page.slug)) src = BISTRO_COVER;
  else if (c === 'glamping' || /glamp|glass|270|stargaz/.test(page.slug)) src = first(IMG.suite);
  else if (c === 'group-tours' || c === 'corporate') src = COVERS.groups;
  else if (c === 'weddings') src = COVERS.wedding;
  else if (c === 'workation') src = COVERS.workation;
  else if (c === 'rentals' || c === 'road-bike-trips') src = IMG.bumla;
  else if (STAY_CATS.has(c)) {
    const town = townOf(page);
    src = town ? photoFor(town) || COVERS.home : [COVERS.home, COVERS.about, COVERS.contact][page.slug.length % 3];
  } else src = photoFor(page.h1, page.slug.replace(/-/g, ' ')) || IMG.meghalaya;
  const r = responsiveImage(src);
  return { src: r?.src ?? src, srcSet: r?.srcSet, w: r?.w, h: r?.h, alt: page.h1 };
}

export interface Fact { k: string; v: string }

/** A 40–70 word answer-first summary: what AI answer engines quote. */
export function quickAnswerFor(page: SEOPageData): string {
  if (page.quickAnswer) return page.quickAnswer;
  const town = townOf(page);
  const dorm = inr(lowestDormPrice());
  if (STAY_CATS.has(page.category)) {
    if (town) {
      return `XTSY’s own hostel is in New Shillong Township, Meghalaya. For ${town}, the XTSY desk books trusted partner stays, cabs and guides and stays your single point of contact — message +91 88373 17070 on WhatsApp for tonight’s options. Passing through Shillong? Beds at XTSY Travellers Hostel start at ${dorm} a night.`;
    }
    return `XTSY Travellers Hostel on Mawdiangdiang Road, New Shillong Township is a top-rated hostel in Shillong: dorm beds from ${dorm}, a women-only dorm at ${inr(roomPrice('4-bed-female-only-dorm').now)}, King Double rooms at ${inr(roomPrice('king-double-room').now)} and the Experience by XTSY glass suite from ${inr(PANORAMA_STAY_ONLY)}. TAB Bistro is on site, pets are welcome, check-in is 11 AM and check-out 10 AM.`;
  }
  const intro = (page.intro || '').replace(/\s+/g, ' ').trim();
  const sentences = intro.match(/[^.!?]+[.!?]+/g) ?? [intro];
  let out = '';
  for (const s of sentences) { if ((out + s).split(' ').length > 55) break; out += s; }
  const place = placesOf(page)[0];
  if (place) {
    const leg = fromXtsy(place.id);
    const tail = CLUSTERS[place.cluster].dayTripFromXtsy
      ? ` ${place.name} is ~${leg.hours} h from XTSY Travellers Hostel in New Shillong — an easy day trip.`
      : ` ${place.name} is ~${leg.hours} h from Shillong, so plan nights nearby; the XTSY desk books partner stays and transport.`;
    return (out || intro.slice(0, 280)).trim() + tail;
  }
  return (out || intro.slice(0, 320)).trim();
}

export function factsFor(page: SEOPageData): Fact[] {
  const facts: Fact[] = [];
  const town = townOf(page);
  if (STAY_CATS.has(page.category) && !town) {
    facts.push(
      { k: 'Where', v: 'Mawdiangdiang Road, New Shillong Township, Shillong 793018 (near IIM & NIFT Shillong)' },
      { k: 'Dorm beds', v: `from ${inr(lowestDormPrice())} / night` },
      { k: 'Private room', v: `King Double ${inr(roomPrice('king-double-room').now)} / night` },
      { k: 'Glass suite', v: `Experience by XTSY ${inr(PANORAMA_STAY_ONLY)}, all inclusive` },
      { k: 'Check-in / out', v: '11 AM / 10 AM (strict)' },
      { k: 'Pets', v: 'Cats & birds welcome; dogs by breed and size' },
      { k: 'Cancellation', v: 'Booking amount non-refundable; one date change within 90 days' },
    );
  }
  for (const p of placesOf(page)) {
    const leg = fromXtsy(p.id);
    facts.push({ k: `${p.name} from XTSY`, v: `~${leg.hours} h · ${leg.km} km${CLUSTERS[p.cluster].dayTripFromXtsy ? ' (day trip)' : ' (stay nearby)'}` });
  }
  const seen = new Set<string>();
  for (const p of placesOf(page)) {
    const c = CLUSTERS[p.cluster];
    if (seen.has(c.id)) continue; seen.add(c.id);
    if (c.season) facts.push({ k: `Best time · ${c.short}`, v: c.season });
    if (c.permit) facts.push({ k: `Permits · ${c.state}`, v: c.permit });
  }
  if (town && STAY_CATS.has(page.category)) facts.push({ k: `Stays in ${town}`, v: 'Trusted partner stays booked by the XTSY desk' });
  return facts.slice(0, 8);
}

export const goesBeyondShillong = (page: SEOPageData) => TRAVEL_CATS.has(page.category) || !!townOf(page);

function mainEntity(page: SEOPageData, url: string, hero: Hero): Record<string, unknown> {
  const base: Record<string, unknown> = { '@type': page.schemaType, '@id': `${url}#main`, name: page.h1, description: page.metaDescription, url, image: `${SITE}${hero.src}` };
  if (['Hostel', 'LodgingBusiness', 'Hotel'].includes(page.schemaType)) {
    const town = townOf(page);
    if (town) {
      // Pages about other towns describe a service, not our building.
      return { '@type': 'Service', '@id': `${url}#main`, name: page.h1, description: page.metaDescription, url, areaServed: town, provider: { '@id': `${SITE}/#organization` }, serviceType: 'Accommodation booking' };
    }
    return {
      ...base,
      '@type': 'Hostel',
      mainEntityOfPage: url,
      sameAs: `${SITE}/#hostel`,
      address: { '@type': 'PostalAddress', streetAddress: 'Mawdiangdiang Road, New Shillong Township', addressLocality: 'Shillong', addressRegion: 'Meghalaya', postalCode: '793018', addressCountry: 'IN' },
      geo: { '@type': 'GeoCoordinates', latitude: 25.6025457, longitude: 91.9448902 },
      telephone: '+91-8837317070',
      priceRange: `${inr(lowestDormPrice())} - ${inr(PANORAMA_STAY_ONLY)}`,
      checkinTime: '11:00',
      checkoutTime: '10:00',
      petsAllowed: true,
      makesOffer: [
        { '@type': 'Offer', name: 'Dorm bed', price: String(lowestDormPrice()), priceCurrency: 'INR', url: `${SITE}/book` },
        { '@type': 'Offer', name: 'King Double Room', price: String(roomPrice('king-double-room').now), priceCurrency: 'INR', url: `${SITE}/book` },
        { '@type': 'Offer', name: 'Experience by XTSY (glass suite)', price: String(PANORAMA_STAY_ONLY), priceCurrency: 'INR', url: `${SITE}/xtsy-270` },
      ],
    };
  }
  if (page.schemaType === 'TouristTrip') return { ...base, provider: { '@id': `${SITE}/#organization` }, touristType: CATEGORY_LABELS[page.category] };
  if (page.schemaType === 'Restaurant') return { ...base, '@id': `${SITE}/tab-bistro#restaurant`, name: 'TAB Bistro by XTSY', servesCuisine: ['North Indian', 'Indo-Chinese', 'Thai', 'Continental', 'Northeast Indian'], telephone: '+91-8837317070', address: { '@type': 'PostalAddress', streetAddress: 'Mawdiangdiang Road, New Shillong Township', addressLocality: 'Shillong', addressRegion: 'Meghalaya', postalCode: '793018', addressCountry: 'IN' } };
  if (page.schemaType === 'TouristAttraction') {
    const p = placesOf(page)[0];
    return { ...base, ...(p ? { geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lng } } : {}), isAccessibleForFree: true, address: { '@type': 'PostalAddress', addressRegion: 'Meghalaya', addressCountry: 'IN' } };
  }
  // Guides, articles, everything else.
  return { ...base, '@type': 'Article', headline: page.h1, author: { '@type': 'Organization', name: 'XTSY Travel', url: SITE }, publisher: { '@id': `${SITE}/#organization` }, datePublished: '2025-01-01', dateModified: SEO_CONTENT_UPDATED };
}

export function schemaFor(page: SEOPageData): Record<string, unknown>[] {
  const url = `${SITE}/${page.slug}`;
  const hero = heroFor(page);
  const hub = CATEGORY_HUB[page.category] ?? '/things-to-do-in-meghalaya';
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: page.title,
      description: page.metaDescription,
      inLanguage: 'en-IN',
      isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website`, url: SITE, name: 'XTSY Travel' },
      about: { '@id': `${SITE}/#hostel` },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}${hero.src}` },
      dateModified: SEO_CONTENT_UPDATED,
      mainEntity: { '@id': `${url}#main` },
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '[data-quick-answer]', '[data-key-facts]'] },
      abstract: quickAnswerFor(page),
    },
    mainEntity(page, url, hero),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: CATEGORY_LABELS[page.category] ?? 'Guides', item: `${SITE}${hub}` },
        { '@type': 'ListItem', position: 3, name: page.h1, item: url },
      ],
    },
  ];
  if (page.faqs.length) {
    graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: page.faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) });
  }
  return [{ '@context': 'https://schema.org', '@graph': graph }];
}

export interface ProgrammaticModel {
  page: SEOPageData;
  noindex: boolean;
  hero: Hero;
  hub: string;
  quickAnswer: string;
  facts: Fact[];
}

export function programmaticModel(slug: string): ProgrammaticModel | null {
  const page = findSEOPage(slug);
  if (!page) return null;
  return {
    page,
    noindex: isConsolidatedSEOSlug(page.slug),
    hero: heroFor(page),
    hub: CATEGORY_HUB[page.category] ?? '/things-to-do-in-meghalaya',
    quickAnswer: quickAnswerFor(page),
    facts: factsFor(page),
  };
}

/** Pages too thin to publish render a real 404 (see routes/$slug.tsx). */
export function isThinSEOPage(page: SEOPageData): boolean {
  const bodyLen = (page.intro?.length || 0) + page.sections.reduce((a, s) => a + (s.content?.length || 0), 0);
  return page.sections.length < 3 || bodyLen < 600;
}

const shortLabel = (page: SEOPageData) => {
  const full = (page.h1 || page.title).split(/\s[|–—]\s/)[0];
  const head = full.split(/:\s/)[0];
  // Keep the subtitle when cutting it would leave a dangling "for" / "in" / "to".
  const label = /\b(for|in|to|of|and|with|the|a)$/i.test(head) ? full : head;
  return label.replace(/(\s+(for|in))?\s*\(?20\d\d\)?$/i, '').trim();
};

export type GuideGroup = { category: string; label: string; hub?: string; pages: { slug: string; label: string }[] };

/** Every live, indexable guide grouped by category: the crawlable A–Z at /guides. */
export function guideDirectory(): GuideGroup[] {
  const groups = new Map<string, GuideGroup>();
  for (const page of ALL_SEO_PAGES) {
    if (!isIndexableSEOSlug(page.slug) || isThinSEOPage(page)) continue;
    const label = CATEGORY_LABELS[page.category] ?? 'More guides';
    if (!groups.has(label)) groups.set(label, { category: page.category, label, hub: CATEGORY_HUB[page.category], pages: [] });
    groups.get(label)!.pages.push({ slug: page.slug, label: shortLabel(page) });
  }
  const out = [...groups.values()];
  for (const g of out) g.pages.sort((a, b) => a.label.localeCompare(b.label));
  return out.sort((a, b) => b.pages.length - a.pages.length);
}
