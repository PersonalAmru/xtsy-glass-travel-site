/** /faq content and FAQPage JSON-LD — kept out of the page component so the route head
 *  (bundled into every page) doesn't pull the whole FAQ page into the main chunk. */
import { inr, lowestDormPrice, roomPrice } from '@/components/v2/pricing';

export type Topic = { id: string; n: string; q: [string, string][] };

export function buildTopics(): Topic[] {
  const suite = roomPrice('xtsy-270');
  const female = roomPrice('4-bed-female-only-dorm');
  return [
    { id: 'stay', n: 'Staying at XTSY', q: [
      ['Where exactly is XTSY?', 'XTSY Travellers Hostel, Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya – 793018. Near NIFT Shillong, IIM Shillong, NEIGRIHMS, NEIAH and Martin Luther Christian University, in a calm, green part of Shillong away from the city centre.'],
      ['Does XTSY have properties in other places?', 'No. XTSY Travellers Hostel in New Shillong Township (with Experience by XTSY and TAB Bistro) is XTSY’s only property. Everywhere else, including Dawki, Sohra, Tawang and beyond, XTSY arranges stays, transport and travel help through trusted travel partners, and our desk stays your single contact.'],
      ['What rooms do you have?', `6 and 8-bed mixed dorms from ${inr(lowestDormPrice())}, a 4-bed female-only dorm (${inr(female.now)}), King Double private rooms and Experience by XTSY, India’s First Stargaze Glamp. Every bed has a locker, reading light and charging point.`],
      ['What are check-in and check-out times?', 'Standard check-in is 11 AM and check-out is strictly 10 AM. Arriving late? Message the desk with your arrival time; our arrival desk can help around the clock.'],
      ['Is XTSY safe for solo women?', 'Yes. A women-only dorm, female staff on call, CCTV in common areas and personal lockers.'],
      ['Why book direct?', 'You save 20–30% vs OTAs and get instant confirmation from the XTSY team.'],
    ] },
    { id: 'suite', n: 'Experience by XTSY', q: [
      ['What is Experience by XTSY?', 'India’s First Stargaze Glamp: a 270° panoramic glass suite in the pines of New Shillong, for one couple a night.'],
      ['How much is it?', `${inr(suite.now)} a night stay-only, or ₹5,799 with breakfast for two. Decoration for special occasions is ₹2,500.`],
      ['Is it private?', 'Yes. The glass faces natural landscapes, not buildings, and there are blackout shades for total seclusion.'],
      ['Can I book it on OTAs?', 'No. Experience by XTSY is booked direct only, on xtsy.one or WhatsApp. Book 2–3 weeks ahead in peak season, and at least 48 hours ahead for decoration.'],
      ['Does it get hot in the day?', 'Daytime sun can warm any glass structure. The suite has climate control, blackout shades and cross ventilation.'],
    ] },
    { id: 'tours', n: 'Tours & rentals', q: [
      ['What are the must-see spots?', 'Living root bridges, Dawki’s clear Umngot river, Nohkalikai Falls and Mawlynnong village. We arrange guided trips to all of them.'],
      ['Can you customise a trip?', 'Yes. Try Plan a trip with AI (on the home page or the Plan a trip page), then send the plan to the XTSY desk.'],
      ['Who provides stays and vehicles outside New Shillong?', 'Trusted travel partners that XTSY books and coordinates. XTSY stays your single point of contact.'],
      ['Do you handle permits?', 'Yes, for Arunachal Pradesh, parts of Nagaland and border areas. Share your details 15–20 days before travel.'],
      ['Do you rent bikes and cars?', 'Yes. Royal Enfields from ₹1,300 a day and cars from ₹1,800, booked through trusted rental partners, with drivers on request.'],
    ] },
    { id: 'booking', n: 'Booking & payments', q: [
      ['What is your cancellation policy?', 'All advance payments are non-refundable. You can modify a booking once within 90 days of the original check-in, requested at least 48 hours before, subject to availability and any rate difference. No refunds for no-shows. Full details are on the Pricing & Cancellation Policy page.'],
      ['What payment methods work?', 'UPI, bank transfers, cards and cash. International guests can pay by PayPal or wire transfer.'],
      ['Is airport pickup available?', 'Yes, from Guwahati Airport and Shillong Airport (Umroi). Ask the desk when you book.'],
      ['Do groups get discounts?', 'Groups of 6+ get special rates on stays and tours. Colleges, corporates and clubs: message us for a quote.'],
    ] },
    { id: 'food', n: 'TAB Bistro', q: [
      ['When is TAB Bistro open?', 'Every day, 9 AM to 10:30 PM.'],
      ['Do you cater events?', 'Yes. Weddings, corporate events and bulk orders, with veg, non-veg and Jain options.'],
    ] },
    { id: 'pets', n: 'Pets', q: [
      ['Can I bring my pet?', 'Cats and birds are most welcome. Dogs depending on breed and size. Please contact the XTSY desk about any additional charges.'],
      ['Do you help with pet travel?', 'Yes, with domestic and international pet paperwork, vet coordination and pet sitting.'],
    ] },
    { id: 'travel', n: 'Getting here', q: [
      ['How do I reach XTSY from Guwahati?', 'About 100 km from Guwahati Airport, roughly 2.5 to 3 hours by road. We can arrange airport transfers.'],
      ['When is the best time to visit?', 'October to April for clear skies. June to September for the waterfalls at full force.'],
      ['Is the Northeast safe for international tourists?', 'Yes, and people are welcoming. Some areas need permits for foreign nationals, which the XTSY desk helps with.'],
    ] },
  ];
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://xtsy.one/faq#faq',
    about: { '@id': 'https://xtsy.one/#hostel' },
    mainEntity: buildTopics().flatMap((t) => t.q.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))),
  };
}
