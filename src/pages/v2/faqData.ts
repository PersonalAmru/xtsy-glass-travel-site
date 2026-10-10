/** /faq content and FAQPage JSON-LD — kept out of the page component so the route head
 *  (bundled into every page) doesn't pull the whole FAQ page into the main chunk. */
import { inr, lowestDormPrice, roomPrice } from '@/components/v2/pricing';
import { PROPERTY_ADDRESS } from '@/data/brandFacts';
import { HOSTEL_POLICIES } from '@/data/hostelPolicies';

export type Topic = { id: string; n: string; q: [string, string][] };

export function buildTopics(): Topic[] {
  const suite = roomPrice('xtsy-270');
  const female = roomPrice('4-bed-female-only-dorm');
  return [
    { id: 'stay', n: 'Staying at XTSY', q: [
      ['How much does a hostel in Shillong cost?', `At XTSY Travellers Hostel, an 8-bed mixed dorm bed is ${inr(roomPrice('8-bed-mixed-dorm').now)}, a 6-bed mixed dorm bed is ${inr(roomPrice('6-bed-mixed-dorm').now)}, and a 4-bed women-only dorm bed is ${inr(female.now)} per person per night. King Double is ${inr(roomPrice('king-double-room').now)} per room per night for up to two guests. All these rates include GST; breakfast is not included. Experience by XTSY is ${inr(suite.now)} per night, stay only.`],
      ['Where is New Shillong Township?', `New Shillong Township is the newer Shillong area around Mawdiangdiang, away from the city centre and Police Bazaar. XTSY’s address is ${PROPERTY_ADDRESS}, near NIFT Shillong, IIM Shillong, NEIGRIHMS, NEIAH and Martin Luther Christian University. Share the hostel map pin with your driver rather than asking for central Shillong.`],
      ['Can I book through WhatsApp?', 'Yes. Choose your dates and beds or rooms at xtsy.one/book, fill in your guest details, then tap Send WhatsApp enquiry. Your pending enquiry is saved before WhatsApp opens with your room selections, dates, guests, GST-inclusive estimated total, contact details and enquiry reference. Send that pre-filled message to +91 88373 17070. An enquiry is not a confirmed reservation; the desk confirms availability and payment arrangements.'],
      ['Where exactly is XTSY?', 'XTSY Travellers Hostel, Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya – 793018. Near NIFT Shillong, IIM Shillong, NEIGRIHMS, NEIAH and Martin Luther Christian University, in a calm, green part of Shillong away from the city centre.'],
      ['Does XTSY have properties in other places?', 'No. XTSY Travellers Hostel in New Shillong Township (with Experience by XTSY and TAB Bistro) is XTSY’s only property. Everywhere else, including Dawki, Sohra, Tawang and beyond, XTSY arranges stays, transport and travel help through trusted travel partners, and our desk stays your single contact.'],
      ['What rooms do you have?', `6 and 8-bed mixed dorms from ${inr(lowestDormPrice())}, a 4-bed female-only dorm (${inr(female.now)}), King Double private rooms and Experience by XTSY, India’s First Stargaze Glamp. Dorm prices are per bed; private-room prices are per room. The 4-bed mixed dorm is not available. Every bed has a locker, reading light and charging point.`],
      ['What are check-in and check-out times?', 'Standard check-in is 11 AM and check-out is strictly 10 AM. Arriving late? Message the desk with your arrival time; our arrival desk can help around the clock.'],
      ['Is it safe for solo women?', `XTSY offers a 4-bed women-only dorm at ${inr(female.now)} per bed per night, with secure access, personal lockers, CCTV in common areas and female staff support. The desk can help arrange trusted transport. No property can guarantee complete safety: secure your belongings and contact the desk immediately if you feel uncomfortable.`],
      ['What are the quiet hours?', `Quiet hours are ${HOSTEL_POLICIES.quietHours}. Keep voices and phone calls low, use headphones, and avoid disturbing guests who are sleeping. The Safety & House Rules page has the full guest conduct rules.`],
      ['What should I bring to a hostel?', 'Bring your identification, booking or enquiry reference, personal toiletries and any medication you need. A padlock and earplugs can be useful; ask the desk about locker locks and any item you want to borrow before arrival.'],
      ['Are bathrooms shared?', 'Dorm guests use shared facilities. If a private bathroom is essential, check the exact room facilities with the desk before booking; Experience by XTSY has an ensuite washroom.'],
      ['Is Wi-Fi and food available?', 'Wi-Fi is available at XTSY and TAB Bistro by XTSY is on site for meals and beverages. Meals are paid separately; breakfast is not included in the displayed room rates. Ask the desk about parking, laundry or work-space requirements before booking.'],
      ['Why book direct?', 'Book direct for the current GST-inclusive rate and direct contact with the XTSY desk. Sending a WhatsApp enquiry does not confirm a reservation or take payment.'],
    ] },
    { id: 'suite', n: 'Experience by XTSY', q: [
      ['What is Experience by XTSY?', 'India’s First Stargaze Glamp: a 270° panoramic glass suite in the pines of New Shillong, for one couple a night.'],
      ['How much is it?', `${inr(suite.now)} a night, GST included (stay only, breakfast not included). Decoration for special occasions is ₹2,500 plus ₹450 GST, once per stay: ₹8,949 total for one night with decoration.`],
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
