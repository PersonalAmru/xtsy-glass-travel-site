/** Plan-a-trip FAQs and JSON-LD — separate from the page so the route head doesn't pull the page (and chat) into the main chunk. */
import { inr, lowestDormPrice, roomPrice } from '@/components/v2/pricing';
import { PANORAMA_STAY_ONLY, PANORAMA_WITH_BREAKFAST } from '@/data/panoramaPricing';
import { fromXtsy } from '@/lib/travel/routing';
import { fmtH } from '@/lib/travel/planner';

export function planTripFaqs() {
  return [
    { q: 'Where should I stay in Shillong?', a: `XTSY Travellers Hostel on Mawdiangdiang Road, New Shillong Township (near IIM & NIFT Shillong): dorm beds from ${inr(lowestDormPrice())}, a women-only dorm, King Double rooms at ${inr(roomPrice('king-double-room').now)} and Experience by XTSY, India’s First Stargaze Glamp, from ${inr(PANORAMA_STAY_ONLY)} (${inr(PANORAMA_WITH_BREAKFAST)} with breakfast for two). TAB Bistro is on site and pets are welcome (cats and birds; dogs by breed and size).` },
    { q: 'How many days do I need for Meghalaya?', a: 'Five days covers Shillong, Cherrapunji and Dawki–Mawlynnong as day trips from a Shillong base, plus arrival and departure via Guwahati. Add a day for the Nongriat double decker root bridge trek and 3–4 days for the Garo Hills (Wari Chora, Siju).' },
    { q: 'Can I visit Wari Chora as a day trip from Shillong?', a: `No. Wari Chora is near Baghmara in the South Garo Hills, about ${fmtH(fromXtsy('wari-chora').hours)} by road from Shillong. Plan at least three extra days with nights at a partner guesthouse in Baghmara; the XTSY desk arranges it.` },
    { q: 'Is Dawki a day trip from Shillong?', a: `Yes. Dawki is about ${fmtH(fromXtsy('dawki').hours)} from XTSY in New Shillong, so you can combine it with Mawlynnong and be back for dinner. For a slower trip, add a night at the partner riverside camp.` },
    { q: 'Does XTSY arrange stays outside Shillong?', a: 'XTSY’s own property is only in New Shillong Township. Everywhere else in Northeast India (Garo Hills, Kaziranga, Tawang, Kohima, Sikkim and more), XTSY books trusted partner stays, cabs and guides and stays your single point of contact.' },
    { q: 'Is the trip assistant free?', a: 'Yes. Plans are free and instant. When you’re happy, send the plan to the XTSY desk and we confirm stays, transport and prices on WhatsApp before you pay anything.' },
  ];
}

/** JSON-LD rendered server-side by the /plan-trip-with-ai route head. */
export function planTripSchema() {
  const app = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'XTSY trip assistant — Plan a trip with AI',
    url: 'https://xtsy.one/plan-trip-with-ai',
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'INR' },
    provider: { '@id': 'https://xtsy.one/#organization' },
    about: { '@id': 'https://xtsy.one/#hostel' },
  };
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: planTripFaqs().map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return [app, faq];
}
