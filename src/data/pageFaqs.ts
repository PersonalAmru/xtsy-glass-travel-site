/**
 * Visible FAQs (with FAQPage markup) for guide and package pages that had none, flagged by the
 * 22 Oct 2026 content audit. Answers use only facts the site states elsewhere: approved room
 * prices, house policies, and drive times from src/lib/travel/routing.ts. Package prices are not
 * repeated here; the package pages and /tours carry them.
 */
export type PageFaq = { q: string; a: string };

const GROUP_TRIP = 'XTSY runs a 6-night Meghalaya group trip that departs every Saturday from October to May, with pick-up in Guwahati. You can book a single seat; there is no minimum group size.';

export const PAGE_FAQS: Record<string, PageFaq[]> = {
  '/5-day-meghalaya-itinerary': [
    { q: 'Is 5 days enough for Meghalaya?', a: 'Five days covers the classic circuit: Shillong, Sohra (Cherrapunjee), Dawki and Mawlynnong, plus one root-bridge trek. Add a day or two for the Jaintia Hills or a slower pace.' },
    { q: 'Where should I base myself?', a: 'Shillong works as a base for most day trips. From XTSY Travellers Hostel in New Shillong Township, Sohra is about 2 hours by road and Dawki about 2.5 hours. For the Double Decker root-bridge trek, spend a night near Tyrna or Sohra so you can start early.' },
    { q: 'How do I get from Guwahati to Shillong?', a: 'By road it takes about 3 hours from Guwahati city and about 3¼ hours from Guwahati airport. Shared taxis run all day, or the XTSY desk can arrange a cab.' },
    { q: 'Can I do this itinerary with a group?', a: GROUP_TRIP },
  ],
  '/best-time-to-visit-meghalaya': [
    { q: 'What is the best month to visit Meghalaya?', a: 'October to April is the most comfortable time: clearer skies, cooler days and good road conditions. November to April is also when the Umngot River at Dawki is clearest.' },
    { q: 'Is the monsoon a good time to go?', a: 'June to September brings the fullest waterfalls and the greenest hills, but heavy rain, mist and occasional landslides. Keep a buffer day and carry rain gear.' },
    { q: 'When is Dawki river clearest?', a: 'Usually from November to April, when there is little rain upstream. In the monsoon the water turns muddy and boating can be suspended.' },
    { q: 'How cold does Shillong get in winter?', a: 'December to February nights can drop close to freezing, while days stay mild. Pack warm layers.' },
  ],
  '/budget-trip-to-meghalaya': [
    { q: 'What is the cheapest place to stay in Shillong?', a: 'At XTSY Travellers Hostel, an 8-bed dorm bed costs ₹399 a night and a 6-bed dorm ₹499, all inclusive. A 4-bed women-only dorm is ₹599.' },
    { q: 'How can I save on transport?', a: 'Use shared taxis between Guwahati and Shillong and for the main routes, travel in a group to split a cab for day trips, and plan Sohra and Dawki on separate days to avoid long return drives.' },
    { q: 'Is it cheaper to book the hostel direct?', a: 'Yes. Booking sites add their commission to the price you see; booking on xtsy.one gives you the base rate.' },
    { q: 'Is there a budget group trip?', a: GROUP_TRIP },
  ],
  '/hidden-places-in-meghalaya': [
    { q: 'How do I reach offbeat places in Meghalaya?', a: 'Most hidden spots have little or no public transport. Hire a cab or a scooter for the day, start early, and ask locally about road and trail conditions.' },
    { q: 'Do I need a guide?', a: 'For village treks, caves and sacred forests a local guide is strongly recommended. They know the trails and the customs, and many places expect visitors to come with one.' },
    { q: 'Is there mobile network at remote spots?', a: 'Often not. Download offline maps, carry cash, and tell your stay where you are heading.' },
    { q: 'Can XTSY plan an offbeat trip?', a: 'Yes. The XTSY desk builds custom itineraries from New Shillong, with stays and transport outside Shillong arranged through trusted local partners.' },
  ],
  '/meghalaya-couple-tour-package': [
    { q: 'Is Meghalaya good for couples?', a: 'Yes. Quiet viewpoints, waterfalls, river boating at Dawki and cool weather make it a popular couples trip, especially from October to April.' },
    { q: 'Is there a special stay for couples?', a: 'Experience by XTSY, a glass-roofed suite at XTSY in New Shillong Township, costs ₹5,999 a night (stay only). Decoration can be added for ₹2,500 + ₹450 GST.' },
    { q: 'Where does the trip start?', a: 'Pick-up and drop are in Guwahati, at the airport or railway station.' },
    { q: 'Can the itinerary be changed?', a: 'Yes. Dates, pace and stays can be adjusted; message the XTSY desk with what you have in mind.' },
  ],
  '/meghalaya-tour-packages': [
    { q: 'How many days do I need for Meghalaya?', a: 'Five to seven days covers Shillong, Sohra, Dawki, Mawlynnong and a root-bridge trek. Shorter trips work if you focus on Shillong and Sohra.' },
    { q: 'Can I join a group if I am travelling alone?', a: GROUP_TRIP },
    { q: 'Where do the tours start?', a: 'XTSY tours pick up and drop in Guwahati, at the airport or railway station.' },
    { q: 'Are the tour prices fixed?', a: 'Each package lists a fixed per-person price on its page. Tour bookings are non-refundable once confirmed.' },
  ],
  '/shillong-tour-package': [
    { q: 'What can I see in 3 days around Shillong?', a: 'Umiam Lake, Shillong Peak, Elephant Falls, Laitlum Canyons and Ward\'s Lake, with a day trip to Sohra (Cherrapunjee) for waterfalls and caves.' },
    { q: 'How far is XTSY from Police Bazaar?', a: 'About 30 minutes by road. XTSY is in New Shillong Township, near IIM and NIFT Shillong.' },
    { q: 'Can I extend the trip?', a: 'Yes. Add Dawki and Mawlynnong for a fourth day, or join the weekly 6-night Meghalaya group trip that departs every Saturday from October to May.' },
  ],
  '/meghalaya-photo-gallery': [
    { q: 'Where are these photos from?', a: 'From featured places across Meghalaya: Shillong, Sohra (Cherrapunjee), Dawki, Mawlynnong and the Khasi and Jaintia Hills. Each place is listed under "Where these photos were taken".' },
    { q: 'When is the best light for photography?', a: 'October to December gives the clearest skies. In the monsoon, shoot waterfalls early before mist rolls in.' },
    { q: 'Can I visit these places on a tour?', a: GROUP_TRIP },
  ],
  '/destinations': [
    { q: 'Which places should I visit first in Meghalaya?', a: 'Start with Shillong, Sohra (Cherrapunjee) and Dawki. Together they cover waterfalls, caves, living root bridges and the clear Umngot River.' },
    { q: 'Does XTSY arrange trips outside Meghalaya?', a: 'Yes. XTSY\'s own stay is in New Shillong Township; elsewhere in the Northeast, stays, transport and guides come from trusted travel partners, with XTSY as your single contact.' },
    { q: 'Do I need permits?', a: 'Indian citizens need an Inner Line Permit for Arunachal Pradesh, Nagaland, Mizoram and Manipur. Meghalaya, Assam and Sikkim\'s main areas do not need one, though some border areas in Sikkim do.' },
  ],
  '/xtsy-vs-zostel': [
    { q: 'Where is each hostel in Shillong?', a: 'XTSY Travellers Hostel is in New Shillong Township, near IIM and NIFT, about 30 minutes by road from Police Bazaar. Zostel Shillong is in the Golf Club area, about 2 km from the city centre.' },
    { q: 'Which is cheaper?', a: 'XTSY publishes all-inclusive dorm prices from ₹399 a night. Zostel does not publish its Shillong dorm prices on its own website, so check its listing for your dates.' },
    { q: 'Which has a women-only dorm?', a: 'XTSY has a 4-bed women-only dorm at ₹599 a night.' },
    { q: 'Which is better for groups and pets?', a: 'XTSY takes groups of 6 to 60 and welcomes cats and birds (dogs depending on breed and size). Zostel Shillong lists an 18+ rule, groups of up to 6 and no pets.' },
    { q: 'Do both run group trips?', a: 'Yes. Zostel sells fixed-date Zo Trips. ' + GROUP_TRIP },
  ],
  '/meghalaya-festivals': [
    { q: 'What is the most famous festival in Meghalaya?', a: 'Wangala, the Garo 100 Drums Festival near Tura, and Shad Suk Mynsiem, the Khasi spring dance in Shillong, are the best known. Behdienkhlam in Jowai is the biggest Pnar festival.' },
    { q: 'Which festival can I see from Shillong?', a: 'Shad Suk Mynsiem (usually April) is held in Shillong, the Nongkrem Dance (usually October or November) is at Smit nearby, and the Cherry Blossom Festival (usually November) takes place across the city.' },
    { q: 'Are festival dates the same every year?', a: 'No. Most follow traditional or agricultural calendars, so confirm the dates for your year before booking. The Hornbill Festival in Nagaland is the exception: it runs 1–10 December every year.' },
    { q: 'Can XTSY plan a festival trip?', a: 'Yes. XTSY arranges stays, transport and timing from New Shillong, and works with trusted partners for festivals elsewhere in the Northeast.' },
  ],
  '/pricing-cancellation-policy': [
    { q: 'Can I cancel and get a refund?', a: 'No. There is no free cancellation: the booking amount is non-refundable, and no-shows are treated as cancellations.' },
    { q: 'Can I change my dates instead?', a: 'Yes, once per booking. The new dates must fall within 90 days of the original check-in, you must ask at least 48 hours before check-in, and any rate difference is paid at the time of change.' },
    { q: 'Are prices all inclusive?', a: 'Room prices shown on xtsy.one are all inclusive: dorm beds from ₹399, King Double ₹2,399 and Experience by XTSY ₹5,999 (stay only).' },
    { q: 'Who do I contact about a booking?', a: 'Email booking@xtsy.one for bookings, or admin@xtsy.one for policy questions.' },
  ],
};
