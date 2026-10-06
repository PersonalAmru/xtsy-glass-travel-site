/**
 * Shared deal-intent FAQ set reused across every hostel booking page
 * (/hostel-booking, /hostel-near-me, /best-hostel-in-shillong, /backpacking-india).
 * Kept in one place so the on-page copy and the FAQPage JSON-LD never drift apart.
 */
export interface HostelFaq {
  q: string;
  a: string;
}

export const hostelDealFaqs: HostelFaq[] = [
  {
    q: 'Do you need to book a hostel in advance in Shillong?',
    a: 'For dorm beds, 3–7 days ahead is enough outside peak. You do need to book in advance — ideally 2–4 weeks — for October to May, Christmas–New Year, Cherry Blossom Festival, Durga Puja and long weekends, and always for private rooms or Experience by XTSY. Booking in advance direct at xtsy.one/book also locks the lowest rate, since last-minute inventory is the most expensive.',
  },
  {
    q: 'How do I get the best hostel deals?',
    a: 'Five things move the price the most: (1) book direct instead of through Hostelworld or Booking.com so no 15–18% commission is priced in, (2) travel midweek — Sunday to Thursday beds are more affordable than Friday/Saturday, (3) stay 3+ nights to trigger the long-stay discount, (4) travel in the June–September monsoon shoulder when Meghalaya is greenest and rates are lowest, and (5) message us on WhatsApp before booking — we can often match or beat any OTA rate you have found.',
  },
  {
    q: 'Is it more affordable to book a hostel direct or on Hostelworld / Booking.com?',
    a: 'Direct is more affordable. OTAs charge the property a 15–18% commission that is built into the displayed rate, plus a booking deposit. Booking direct at xtsy.one gives you the same bed at the base rate, direct support from the XTSY desk, and free extras (late checkout on request, luggage storage, TAB Bistro breakfast discount) that OTA bookings do not include.',
  },
  {
    q: 'Are there group, long-stay or student discounts?',
    a: 'Yes. Groups of 6+ get a dedicated group rate and can block a whole dorm; stays of 7+ nights get a weekly rate; digital nomads and remote workers get a monthly work-from-hills package. Student and solo-female-traveller offers run seasonally — ask on WhatsApp at +91 88373 17070 before booking.',
  },
  {
    q: 'What happens if I need to cancel or change my dates?',
    a: 'The booking amount is non-refundable — there is no free cancellation. You can change your dates once within 90 days of the original check-in (ask at least 48 hours before), subject to availability and any rate difference — just WhatsApp us. OTA bookings follow that OTA’s policy.',
  },
  {
    q: 'Do I pay upfront when I book?',
    a: 'No prepayment is required on most dorm beds — pay on arrival by UPI, card or cash. Private rooms, Experience by XTSY, group blocks and peak-season dates take a partial advance to hold the inventory. Every direct booking gets an instant WhatsApp confirmation and a GST invoice.',
  },
];

/** Maps the shared FAQs to schema.org Question entities for a FAQPage node. */
export const hostelDealFaqEntities = hostelDealFaqs.map((f) => ({
  '@type': 'Question',
  name: f.q,
  acceptedAnswer: { '@type': 'Answer', text: f.a },
}));
