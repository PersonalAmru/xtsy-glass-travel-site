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
    { q: 'Where should I base myself for a 5-day Meghalaya trip?', a: 'Shillong works as the main base, with one night near Sohra or Shnongpdeng so you are not driving back late. XTSY Travellers Hostel is in New Shillong Township, which gives faster morning starts towards Sohra and Dawki than central Shillong does.' },
    { q: 'How much does a 5-day Meghalaya trip cost?', a: 'Budget travellers can do it on roughly \\u20b91,500-2,500 a day including a dorm bed, shared transport and meals. XTSY\'s fixed 4-night, 5-day Shillong and Meghalaya package is \\u20b915,500 per person for a group of four or more, including stays, private transport, a driver-guide and daily breakfast.' },
    { q: 'Should I hire a car or use shared taxis?', a: 'A private car costs more but saves hours every day, because shared taxis run on their own schedules and rarely reach viewpoints. For a five-day loop with fixed stops, a private vehicle or a package is usually better value than piecing together shared transport.' },
    { q: 'Can I do this itinerary solo?', a: 'Yes. Solo travellers can stay in dorms and join XTSY\'s Saturday group departure, a 6-night, 7-day Meghalaya trip at \\u20b918,500 per person with no minimum group size, so you share transport and costs with other travellers.' },
  ],
  '/best-time-to-visit-meghalaya': [
    { q: 'What is the best month to visit Meghalaya?', a: 'October to April is the most comfortable time: clearer skies, cooler days and good road conditions. November to April is also when the Umngot River at Dawki is clearest.' },
    { q: 'Is the monsoon a good time to go?', a: 'June to September brings the fullest waterfalls and the greenest hills, but heavy rain, mist and occasional landslides. Keep a buffer day and carry rain gear.' },
    { q: 'When is Dawki river clearest?', a: 'Usually from November to April, when there is little rain upstream. In the monsoon the water turns muddy and boating can be suspended.' },
    { q: 'How cold does Shillong get in winter?', a: 'December to February nights can drop close to freezing, while days stay mild. Pack warm layers.' },
    { q: 'Is it worth visiting Meghalaya during the monsoon?', a: 'Yes, if waterfalls are your reason for coming. June to September is when Nohkalikai, Seven Sisters and Wei Sawdong are at their most powerful, and the hills are greenest. Expect rain most days, leeches on forest trails, and mist that can hide viewpoints by midday. Roads to Sohra and Dawki stay open, but plan loose days.' },
    { q: 'When is the Umngot River at Dawki clearest?', a: 'November to April. After the monsoon silt settles, the water turns glass-clear and boats appear to float. During and just after heavy rain the river runs brown and boating can be suspended.' },
    { q: 'What is the weather like in Shillong through the year?', a: 'Shillong sits at about 1,500 m, so it is mild year-round: roughly 15-24\\u00b0C in summer and 4-15\\u00b0C in winter, with cold nights from December to February. Carry a jacket in every season and a rain layer from May to September.' },
    { q: 'Which months are cheapest to travel in Meghalaya?', a: 'June to September, the monsoon, is the low season, and stays and cabs are at their cheapest. At XTSY, dorm beds start at \\u20b9399 a night all year, with a women-only dorm at \\u20b9599 and the King Double at \\u20b92,399.' },
    { q: 'How many days do you need for Meghalaya?', a: 'Five days covers Shillong, Sohra and Dawki comfortably. Seven days adds the Double Decker root-bridge trek and the Jaintia Hills without rushing. XTSY runs a 6-night, 7-day Meghalaya group trip that departs every Saturday from October to May at \\u20b918,500 per person, which a solo traveller can join.' },
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
    { q: 'Which offbeat places in Meghalaya are worth the detour?', a: 'Laitlum Canyons for the cliff views, Wei Sawdong for its three-tier falls down a steep bamboo ladder, Mawphlang Sacred Forest for Khasi monoliths and old-growth trees, Phe Phe Falls in the Jaintia Hills, and Krang Suri for its turquoise pool. All are day trips from Shillong.' },
    { q: 'Are these places reachable without a car?', a: 'Most are not reachable by regular public transport. Shared taxis serve the main towns, but the last stretch to viewpoints and falls usually needs a hired vehicle. The XTSY desk arranges cabs and can group travellers heading the same way.' },
    { q: 'Do offbeat spots in Meghalaya charge entry fees?', a: 'Many are run by the village community and charge a small entry or parking fee, typically \\u20b920-100 per person, often collected in cash. Carry small notes, as mobile networks and UPI are unreliable away from the main roads.' },
    { q: 'Is it safe to visit remote spots in Meghalaya?', a: 'Generally yes, but go early, tell someone your plan, and come back before dark; the roads have no lighting and mist falls quickly. Several trails, including Wei Sawdong, involve steep ladders and slippery rock in the monsoon. Hire a local guide where the village offers one.' },
    { q: 'What should I carry for a day of offbeat exploring?', a: 'Shoes with grip, a rain layer in any season, cash in small notes, water and snacks, and a power bank. Network coverage drops outside the towns, so download offline maps before you leave Shillong.' },
  ],
  '/meghalaya-couple-tour-package': [
    { q: 'Is Meghalaya good for couples?', a: 'Yes. Quiet viewpoints, waterfalls, river boating at Dawki and cool weather make it a popular couples trip, especially from October to April.' },
    { q: 'Is there a special stay for couples?', a: 'Experience by XTSY, a glass-roofed suite at XTSY in New Shillong Township, costs ₹5,999 a night (stay only). Decoration can be added for ₹2,500 + ₹450 GST.' },
    { q: 'Where does the trip start?', a: 'Pick-up and drop are in Guwahati, at the airport or railway station.' },
    { q: 'Can the itinerary be changed?', a: 'Yes. Dates, pace and stays can be adjusted; message the XTSY desk with what you have in mind.' },
    { q: 'What is included in the Meghalaya couple tour package?', a: 'The 6-day honeymoon package at \\u20b926,000 per person covers stays, private transport with a driver-guide, daily breakfast, and the couple-friendly circuit through Shillong, Sohra, Mawlynnong and Dawki. Flights and trains to Guwahati are not included.' },
    { q: 'Is there a private stay for couples at XTSY?', a: 'Yes. The King Double room is \\u20b92,399 a night, all inclusive. Experience by XTSY, a glass sky room with a queen-size bed, is \\u20b95,999 a night for the stay, with an optional decoration add-on at \\u20b92,500 plus \\u20b9450 GST.' },
    { q: 'When is the best time for a honeymoon in Meghalaya?', a: 'October to April. Skies are clearest, the Umngot River at Dawki runs glass-clear, and evenings are cool rather than cold. The monsoon from June to September is dramatic and green, but rain can shorten viewpoint days.' },
    { q: 'How many days do couples need in Meghalaya?', a: 'Five to six days is comfortable: two nights in or near Shillong, one or two near Sohra, and a night by the river at Dawki or Shnongpdeng, with time left for slow mornings.' },
    { q: 'Can you arrange a surprise or celebration?', a: 'Yes. Tell the XTSY desk before you arrive and the Experience by XTSY decoration add-on can be arranged for an anniversary, proposal or birthday, at \\u20b92,500 plus \\u20b9450 GST, once per stay.' },
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
    { q: 'What does the Shillong tour package include?', a: 'The 3-day Shillong package covers your stay at XTSY Travellers Hostel, transport for sightseeing, and the main Shillong circuit: Umiam Lake, Shillong Peak, Elephant Falls and Laitlum Canyons, with dinner at TAB Bistro. Flights and trains to Guwahati are not included.' },
    { q: 'How much is a Shillong tour package per person?', a: 'The 3-day Shillong tour starts at \\u20b97,999 per person. Longer Meghalaya packages that add Sohra, Dawki and Mawlynnong start at \\u20b915,500 per person for four or more travellers.' },
    { q: 'How do I reach Shillong for the tour?', a: 'Fly or take a train to Guwahati, then drive about 3 to 3.5 hours to Shillong. Shared taxis run all day from Guwahati\'s Paltan Bazar, and XTSY can arrange a private cab. Shillong also has a small airport at Umroi with limited flights.' },
    { q: 'Can the Shillong package be customised?', a: 'Yes. Dates, stays and the pace can be changed, and the package can be extended into Sohra, Dawki or the Jaintia Hills. Message the XTSY desk with your dates and group size.' },
    { q: 'Is this package suitable for solo travellers?', a: 'It can be run for one person as a private trip, which costs more per head. Solo travellers who want to share costs can join XTSY\'s fixed Saturday Meghalaya group departure instead, at \\u20b918,500 per person for 6 nights and 7 days.' },
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
