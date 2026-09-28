/**
 * Content + JSON-LD for the two Shillong stay hubs:
 *   /best-hostel-in-shillong  → "hostels in Shillong" (guide / comparison intent)
 *   /cheap-hostels-shillong   → "cheap hostel in Shillong" (budget intent)
 * The homepage owns "best hostel in Shillong" (brand + head term), so these
 * pages support it instead of competing with it.
 * All prices come from the live booking inventory.
 */
import { inr, lowestDormPrice, roomPrice } from '@/components/v2/pricing';
import { PANORAMA_DECORATION, PANORAMA_STAY_ONLY, PANORAMA_WITH_BREAKFAST } from '@/data/panoramaPricing';
import { fromXtsy } from '@/lib/travel/routing';

export type StayHubVariant = 'hostels' | 'cheap';
const SITE = 'https://xtsy.one';

export const rooms = () => [
  { id: '8-bed-mixed-dorm', name: '8-bed mixed dorm', price: roomPrice('8-bed-mixed-dorm').now, note: 'Best-value bunk with curtain, locker, reading light and charging point.' },
  { id: '6-bed-mixed-dorm', name: '6-bed mixed dorm', price: roomPrice('6-bed-mixed-dorm').now, note: 'Smaller dorm, same in-bunk comforts — a favourite with backpackers.' },
  { id: '4-bed-female-only-dorm', name: '4-bed women-only dorm', price: roomPrice('4-bed-female-only-dorm').now, note: 'Women-only, female staff on call, lockers — the safest budget bed.' },
  { id: 'king-double-room', name: 'King Double room', price: roomPrice('king-double-room').now, note: 'Private room for two with a view of the pines.' },
  { id: 'xtsy-270', name: 'Experience by XTSY (glass suite)', price: PANORAMA_STAY_ONLY, note: `India’s First Stargaze Glamp. ${inr(PANORAMA_WITH_BREAKFAST)} with breakfast for two; decoration +${inr(PANORAMA_DECORATION)}.` },
].filter((r) => r.price > 0);

export function stayHubCopy(v: StayHubVariant) {
  const dorm = inr(lowestDormPrice());
  const cheap = v === 'cheap';
  return {
    path: cheap ? '/cheap-hostels-shillong' : '/best-hostel-in-shillong',
    title: cheap ? `Cheap Hostels in Shillong — Dorm Beds from ${dorm} | XTSY` : `Hostels in Shillong 2026 — Dorms from ${dorm} | XTSY`,
    description: cheap
      ? `Cheap hostel in Shillong? XTSY dorm beds from ${dorm}, women-only dorm, lockers, Wi-Fi, TAB Bistro on site. New Shillong Township. Book direct, no OTA mark-up.`
      : `XTSY Travellers Hostel, New Shillong Township (4.8★, 161 Google reviews): dorms from ${dorm}, a women-only dorm, private rooms and a glass suite.`,
    h1: cheap ? 'Cheap hostels in Shillong' : 'Hostels in Shillong',
    eyebrow: cheap ? `Budget beds from ${dorm} · book direct` : 'The 2026 guide · by the team that runs XTSY',
    quick: cheap
      ? `The cheapest good bed in Shillong at XTSY Travellers Hostel is an 8-bed dorm bunk at ${dorm} a night, with a curtain, locker and charging point. Women can pick the women-only dorm at ${inr(roomPrice('4-bed-female-only-dorm').now)}. You save more by booking direct on xtsy.one or WhatsApp (+91 88373 17070), staying midweek and staying 3+ nights.`
      : `For most travellers the best-rated hostel in Shillong is XTSY Travellers Hostel in New Shillong Township (4.8★ from 161 Google reviews): dorms from ${dorm}, a women-only dorm, King Double rooms at ${inr(roomPrice('king-double-room').now)} and the Experience by XTSY glass suite. It’s quieter and greener than central Shillong, about 30 minutes by road from Police Bazaar, with TAB Bistro on site.`,
    keywords: cheap
      ? 'cheap hostel in shillong, cheap hostels shillong, budget hostel shillong, dorm bed shillong price, affordable stay shillong'
      : 'hostels in shillong, hostel in shillong, best hostels in shillong, backpacker hostel shillong, female dorm shillong, hostel near iim shillong',
  };
}

export function stayHubFaqs(v: StayHubVariant): { q: string; a: string }[] {
  const dorm = inr(lowestDormPrice());
  const base = [
    { q: 'Which is the best hostel in Shillong?', a: `XTSY Travellers Hostel in New Shillong Township is one of the best-rated hostels in Shillong (4.8★ from 161 Google reviews). Dorms start at ${dorm}, there is a women-only dorm, private King Double rooms and the Experience by XTSY glass suite, and TAB Bistro is on site.` },
    { q: 'How much is a hostel in Shillong per night?', a: `At XTSY, dorm beds are ${dorm} (8-bed) and ${inr(roomPrice('6-bed-mixed-dorm').now)} (6-bed), the women-only dorm is ${inr(roomPrice('4-bed-female-only-dorm').now)}, the King Double room ${inr(roomPrice('king-double-room').now)}, and Experience by XTSY ${inr(PANORAMA_STAY_ONLY)} (${inr(PANORAMA_WITH_BREAKFAST)} with breakfast for two).` },
    { q: 'Where is XTSY Travellers Hostel?', a: 'Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya 793018 — near NIFT Shillong, IIM Shillong, NEIGRIHMS, NEIAH and Martin Luther Christian University. It is not in Police Bazaar or central Shillong; the drive to Police Bazaar takes about 30 minutes.' },
    { q: 'Is there a women-only dorm in Shillong?', a: `Yes. XTSY has a 4-bed women-only dorm (${inr(roomPrice('4-bed-female-only-dorm').now)} a night) with female staff on call, lockers and 24/7 arrival support.` },
    { q: 'What are check-in and check-out times?', a: 'Standard check-in is 11 AM and check-out is strictly 10 AM. Arriving late? Message the desk with your arrival time.' },
    { q: 'What is the cancellation policy?', a: 'The booking amount is non-refundable — there is no free cancellation. You can change your dates once within 90 days of the original check-in (ask at least 48 hours before), subject to availability and any rate difference.' },
    { q: 'Are pets allowed?', a: 'Cats and birds are most welcome. Dogs are accepted depending on breed and size — please contact the XTSY desk about any additional charges before booking.' },
    { q: 'How do I get to XTSY from Guwahati airport?', a: `It is about ${fromXtsy('guwahati').hours + 0.25} hours by road (roughly 120 km). Shared taxis run Guwahati–Shillong all day, or the XTSY desk can send a cab.` },
    { q: 'Is it cheaper to book the hostel direct?', a: 'Yes. OTAs add their commission to the price you see. Booking direct on xtsy.one or WhatsApp gets you the base rate and a GST invoice.' },
    { q: 'Can I plan day trips from the hostel?', a: `Yes — Cherrapunji (~${fromXtsy('nohkalikai').hours} h), Dawki and Mawlynnong (~${fromXtsy('dawki').hours} h) and Laitlum (~${fromXtsy('laitlum').hours} h) are day trips from XTSY. Far places like Wari Chora or Tawang need nights nearby, which the XTSY desk books with trusted partners.` },
    { q: 'Do you take groups?', a: 'Yes — whole-dorm stays and group rates for 6–60 people, with transport, guides and TAB Bistro meals, and GST invoices on request.' },
  ];
  if (v === 'cheap') {
    base.unshift({ q: 'What is the cheapest hostel bed in Shillong?', a: `At XTSY the cheapest bed is the 8-bed mixed dorm at ${dorm} a night, with a privacy curtain, locker and charging point at every bunk.` });
    base.push({ q: 'How can I save money on a Shillong hostel?', a: 'Book direct, travel Sunday to Thursday, stay 3 or more nights, and share a group dorm. Ask on WhatsApp about long-stay and group rates.' });
  } else {
    base.push({ q: 'Central Shillong or New Shillong Township — where should I stay?', a: 'Stay central (Police Bazaar, Laitumkhrah) if you want nightlife on foot. Stay at XTSY in New Shillong Township for quieter pines, more space, a restaurant downstairs, easy parking and quicker starts for Cherrapunji and Dawki day trips.' });
  }
  return base;
}

export function stayHubSchema(v: StayHubVariant) {
  const c = stayHubCopy(v);
  const url = `${SITE}${c.path}`;
  const faqs = stayHubFaqs(v);
  return [{
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: c.title, description: c.description, about: { '@id': `${SITE}/#hostel` }, isPartOf: { '@id': `${SITE}/#website` }, inLanguage: 'en-IN', dateModified: '2026-09-27', abstract: c.quick, speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '[data-quick-answer]'] } },
      {
        '@type': 'ItemList',
        name: `${c.h1}: rooms at XTSY Travellers Hostel`,
        itemListElement: rooms().map((r, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Offer', name: r.name, price: String(r.price), priceCurrency: 'INR', url: `${SITE}/book`, offeredBy: { '@id': `${SITE}/#hostel` } } })),
      },
      { '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name: c.h1, item: url }] },
    ],
  }];
}
