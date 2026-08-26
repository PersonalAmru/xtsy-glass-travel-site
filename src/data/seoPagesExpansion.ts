// SEO Pages Expansion — 230+ new keyword-targeted pages
// Competitor capture, transport, travel agency, experience, accommodation, long-tail tourism

import type { SEOPageData, SEOPageCategory, SchemaType } from './seoPages';

// Extended categories
export type ExtendedCategory = SEOPageCategory | 'transport' | 'competitor-capture' | 'food-dining' | 'seasonal' | 'events' | 'travel-agency';

// Helper factory functions
const mkPage = (
  slug: string, category: SEOPageCategory, schemaType: SchemaType,
  title: string, metaDesc: string, h1: string, intro: string,
  sections: { heading: string; content: string; listItems?: string[] }[],
  faqs: { question: string; answer: string }[],
  related: string[], keywords: string[],
  ctaText = 'Book Now', ctaLink = '/book'
): SEOPageData => ({
  slug, category, title, metaDescription: metaDesc, h1, intro, sections, faqs,
  schemaType, relatedSlugs: related, ctaText, ctaLink, keywords,
});

const waLink = (msg: string) => `https://wa.me/918787537633?text=${encodeURIComponent(msg)}`;

// ============================================================================
// COMPETITOR CAPTURE PAGES (5)
// ============================================================================
const competitorPages: SEOPageData[] = [
  mkPage('zostel-vs-xtsy-shillong', 'hostels', 'Hostel',
    'Zostel vs XTSY Shillong — Honest Comparison 2026', 'Comparing Zostel Shillong with XTSY Travellers Hostel. See pricing, amenities, location & reviews. Find the best hostel in Shillong for your trip.',
    'Zostel vs XTSY — Best Hostel in Shillong?', 'Searching for Zostel in Shillong? Compare it with XTSY Travellers Hostel — Shillong\'s highest-rated backpacker stay with 4.8★ Google reviews, dorms from ₹499, and an in-house restaurant.',
    [
      { heading: 'Price Comparison', content: 'XTSY offers competitive pricing with dorms starting at ₹499/night — among the lowest in Shillong. Our rates include free WiFi, hot water, kitchen access, and locker usage with zero hidden fees.', listItems: ['8-Bed Mixed Dorm: ₹499/night', '6-Bed Mixed Dorm: ₹699/night', 'Private Double Room: ₹1,499/night', 'XTSY 270° Glasshouse: ₹4,999/night'] },
      { heading: 'Location & Accessibility', content: 'XTSY is located in New Shillong Township, 10 minutes from Police Bazaar. Our location offers easy access to all major day trips — Cherrapunji (2hr), Dawki (3hr), Mawlynnong (2.5hr).' },
      { heading: 'Guest Reviews Speak', content: 'XTSY maintains a 4.8★ rating on Google with 320+ reviews. Guests consistently praise the hospitality, cleanliness, food at TAB Bistro, and the vibrant travel community.' },
      { heading: 'Unique to XTSY', content: 'What sets XTSY apart:', listItems: ['In-house restaurant — TAB Bistro', '270° panoramic glasshouse room', 'Curated Meghalaya tour packages', 'Car & bike rental desk', 'Bonfire & community events'] },
    ],
    [
      { question: 'Is XTSY better than Zostel in Shillong?', answer: 'XTSY is independently rated 4.8★ on Google with 320+ reviews. We offer comparable dorm pricing, an in-house restaurant, and unique experiences like the 270° glasshouse stay.' },
      { question: 'Does XTSY have a female-only dorm?', answer: 'Yes, we have a dedicated 4-bed female-only dormitory with enhanced security, personal lockers, and attached bathroom.' },
    ],
    ['backpacker-hostel-shillong', 'cheap-hostel-shillong', 'hostels-in-meghalaya'],
    ['zostel shillong', 'zostel vs xtsy', 'zostel meghalaya', 'zostel prices shillong', 'best hostel shillong']
  ),

  mkPage('isabella-hostel-vs-xtsy', 'hostels', 'Hostel',
    'Isabella Hostel vs XTSY Shillong — Compare 2026', 'Isabella Hostel vs XTSY Travellers Hostel Shillong. Compare price, location, amenities & reviews. Book the best backpacker hostel.',
    'Isabella Hostel vs XTSY — Which Is Better?', 'Deciding between Isabella Hostel and XTSY in Shillong? Here\'s an honest comparison to help you pick the right stay for your Meghalaya trip.',
    [
      { heading: 'Why Choose XTSY', content: 'XTSY offers a complete travel ecosystem:', listItems: ['Dorms from ₹499 with privacy curtains', 'In-house TAB Bistro restaurant', 'Tour packages & rental desk', '270° glasshouse luxury option', '4.8★ Google rating, 320+ reviews'] },
      { heading: 'Amenities Comparison', content: 'XTSY provides free WiFi, hot showers, common kitchen, luggage storage, and a social lounge — all included in the base price. Our in-house restaurant means you never need to go far for meals.' },
    ],
    [
      { question: 'Which hostel is cheaper — Isabella or XTSY?', answer: 'XTSY dorms start at ₹499/night, making it one of the most affordable options in Shillong with premium amenities included.' },
    ],
    ['zostel-vs-xtsy-shillong', 'backpacker-hostel-shillong', 'cheap-hostel-shillong'],
    ['isabella hostel shillong', 'isabella vs xtsy', 'hostels in shillong comparison']
  ),

  mkPage('stargaze-hostel-vs-xtsy', 'hostels', 'Hostel',
    'Stargaze Hostel vs XTSY Shillong — Compare', 'Stargaze Hostel vs XTSY Shillong. Compare prices, reviews, amenities. Find the best hostel for your Meghalaya trip.',
    'Stargaze Hostel vs XTSY Shillong', 'Comparing Stargaze Hostel with XTSY Travellers Hostel in Shillong? Both offer unique experiences — here\'s what makes XTSY stand out.',
    [
      { heading: 'XTSY Advantages', content: 'XTSY combines affordable stays with a complete travel platform:', listItems: ['Dorms from ₹499, private rooms from ₹1,499', 'TAB Bistro — in-house restaurant', 'Integrated tour & rental booking', 'Social events, bonfires & treks', '4.8★ on Google with 320+ reviews'] },
    ],
    [
      { question: 'Which is better — Stargaze or XTSY?', answer: 'XTSY is rated 4.8★ on Google and offers a more complete travel experience with in-house dining, tour packages, and rental services alongside great accommodation.' },
    ],
    ['zostel-vs-xtsy-shillong', 'backpacker-hostel-shillong'],
    ['stargaze hostel shillong', 'stargaze vs xtsy', 'best hostels shillong']
  ),

  mkPage('zion-backpackers-vs-xtsy', 'hostels', 'Hostel',
    'Zion Backpackers vs XTSY Shillong — Compare', 'Zion Backpackers vs XTSY Travellers Hostel. Honest comparison of prices, amenities, and reviews for Shillong hostels.',
    'Zion Backpackers vs XTSY Shillong', 'Deciding between Zion Backpackers and XTSY? Compare the two most popular hostels in Shillong and make the right choice for your Meghalaya adventure.',
    [
      { heading: 'Why Travelers Choose XTSY', content: 'XTSY is Shillong\'s top-rated backpacker hub:', listItems: ['4.8★ Google rating, 320+ reviews', 'Dorms from ₹499/night', 'In-house restaurant & common kitchen', '270° panoramic glasshouse room', 'Integrated travel services'] },
    ],
    [
      { question: 'Is XTSY better than Zion Backpackers?', answer: 'XTSY is rated 4.8★ on Google and offers additional services like an in-house restaurant, tour packages, and car rentals alongside great hostel accommodation.' },
    ],
    ['zostel-vs-xtsy-shillong', 'backpacker-hostel-shillong'],
    ['zion backpackers shillong', 'zion vs xtsy', 'shillong hostel comparison']
  ),

  mkPage('youth-hostel-shillong', 'hostels', 'Hostel',
    'Youth Hostel in Shillong 2026 — From ₹499 | XTSY', 'Best youth hostel in Shillong for students & young travelers. Dorms from ₹499, social atmosphere, free WiFi. Book at XTSY Travellers Hostel.',
    'Youth Hostel in Shillong', 'Looking for a youth hostel in Shillong? XTSY Travellers Hostel is the perfect choice for students, young professionals, and budget-conscious travelers exploring Meghalaya.',
    [
      { heading: 'Student & Youth-Friendly', content: 'XTSY welcomes young travelers with:', listItems: ['Dormitory beds from ₹499/night', 'Student group discounts available', 'Social lounge & gaming area', 'Community events & group treks', 'Free WiFi for remote work/study'] },
      { heading: 'Safe & Social Environment', content: 'Our hostel provides a safe, inclusive space for young travelers. With 24/7 reception, secure lockers, CCTV coverage, and a vibrant community of fellow travelers.' },
    ],
    [
      { question: 'Is XTSY suitable for students?', answer: 'Absolutely! XTSY is popular with college students and young travelers. We offer student-friendly pricing, group discounts, and a social atmosphere perfect for making new friends.' },
      { question: 'Is there an age limit for hostels?', answer: 'XTSY welcomes guests of all ages. While most guests are between 18-35, we have no upper age limit and welcome anyone with a traveler\'s spirit.' },
    ],
    ['backpacker-hostel-shillong', 'cheap-hostel-shillong', 'shillong-dormitory'],
    ['youth hostel shillong', 'student hostel shillong', 'young traveler hostel meghalaya']
  ),
];

// ============================================================================
// SELF-DRIVE & TRANSPORT PAGES (8)
// ============================================================================
const transportPages: SEOPageData[] = [
  mkPage('self-drive-car-guwahati', 'rentals', 'AutoRental',
    'Self Drive Car Rental Guwahati 2026 | XTSY Rentals', 'Rent self-drive cars in Guwahati for Meghalaya trips. SUVs, sedans, hatchbacks. Unlimited km, GPS included. Book via XTSY.',
    'Self Drive Car Rental in Guwahati', 'Planning a road trip from Guwahati to Meghalaya? Rent a self-drive car from Guwahati with XTSY Rentals. Choose from SUVs, sedans, and hatchbacks with unlimited kilometers and 24/7 roadside assistance.',
    [
      { heading: 'Available Vehicles', content: 'Choose from our Guwahati fleet:', listItems: ['Maruti Swift/i20 — ₹1,500/day', 'Hyundai Creta — ₹2,500/day', 'Mahindra XUV700 — ₹3,500/day', 'Toyota Fortuner — ₹5,000/day', 'All vehicles include insurance & GPS'] },
      { heading: 'Guwahati to Shillong Road Trip', content: 'The Guwahati-Shillong highway (NH6) is 98km and takes about 2.5-3 hours. Beautiful scenic drive through Nongpoh with pit stops at Umiam Lake. Our self-drive cars come with GPS navigation pre-loaded with Meghalaya routes.' },
      { heading: 'Booking Process', content: 'Book online or via WhatsApp. Pick up from Guwahati Airport, Railway Station, or city center. Drop-off available in Shillong. One-way and round-trip options available.' },
    ],
    [
      { question: 'Can I pick up in Guwahati and drop in Shillong?', answer: 'Yes! We offer one-way rentals from Guwahati to Shillong. Additional one-way fee of ₹1,000 applies.' },
      { question: 'Do I need a special license?', answer: 'A valid Indian driving license is sufficient. International visitors need an International Driving Permit (IDP).' },
    ],
    ['car-rental-shillong', 'car-rental-guwahati', 'premium-suv-rental-shillong'],
    ['self drive car guwahati', 'self drive cars in guwahati', 'guwahati self drive car rental', 'rent car guwahati']
  ),

  mkPage('car-rental-guwahati', 'rentals', 'AutoRental',
    'Car Rental in Guwahati — Best Rates 2026 | XTSY', 'Rent cars in Guwahati for Meghalaya trips. Self-drive & chauffeur options. Airport pickup. SUVs from ₹2,500/day. Book with XTSY.',
    'Car Rental in Guwahati', 'Need a car rental in Guwahati? XTSY offers both self-drive and chauffeur-driven cars for exploring Meghalaya and the Northeast. Airport pickup available.',
    [
      { heading: 'Rental Options', content: 'Flexible car rental solutions:', listItems: ['Self-drive: You drive, your schedule', 'Chauffeur-driven: Experienced local drivers', 'Airport/station pickup & drop', 'One-way Guwahati → Shillong available', 'Multi-day & weekly discounts'] },
      { heading: 'Popular Routes from Guwahati', content: 'Our cars are perfect for:', listItems: ['Guwahati → Shillong (98 km, 2.5 hrs)', 'Guwahati → Kaziranga (193 km, 4 hrs)', 'Guwahati → Tawang (via Tezpur, 12 hrs)', 'Guwahati → Meghalaya Circuit (5-7 days)'] },
    ],
    [
      { question: 'What documents do I need?', answer: 'Valid driving license, Aadhaar/passport for ID, and a security deposit of ₹5,000 (refundable). Credit card preferred for deposit.' },
      { question: 'Is fuel included in the rental?', answer: 'No, fuel is at your own cost. Cars are provided with a full tank and should be returned with a full tank.' },
    ],
    ['self-drive-car-guwahati', 'car-rental-shillong', 'self-drive-car-shillong'],
    ['car rental guwahati', 'rent car in guwahati', 'guwahati car hire', 'car booking guwahati']
  ),

  mkPage('scooty-rental-shillong', 'rentals', 'AutoRental',
    'Scooty Rental in Shillong — From ₹500/Day | XTSY', 'Rent a scooty in Shillong from ₹500/day. Honda Activa, TVS Jupiter available. Explore Shillong city at your own pace. Book via XTSY.',
    'Scooty Rental in Shillong', 'Explore Shillong on two wheels! Rent a scooty from XTSY and zip through the Scotland of the East at your own pace. Affordable daily rates, helmets included.',
    [
      { heading: 'Scooty Options', content: 'Our two-wheeler fleet:', listItems: ['Honda Activa 125 — ₹500/day', 'TVS Jupiter — ₹500/day', 'Honda Dio — ₹450/day', 'Helmets (2) included free', 'No km limit within Shillong'] },
      { heading: 'Best Scooty Routes in Shillong', content: 'Perfect routes for scooty exploration:', listItems: ['Police Bazaar to Shillong Peak (8 km)', 'Elephant Falls loop (12 km)', 'Ward\'s Lake & Lady Hydari Park circuit', 'Umiam Lake scenic drive (15 km)', 'Laitlum Canyons day trip (25 km)'] },
    ],
    [
      { question: 'Can I take the scooty to Cherrapunji?', answer: 'We recommend scooties for Shillong city exploration only. For Cherrapunji/Dawki trips, our car rentals are safer on the mountain roads.' },
      { question: 'Do I need a license for scooty rental?', answer: 'Yes, a valid two-wheeler driving license is required. International visitors need an IDP.' },
    ],
    ['bike-rental-shillong', 'car-rental-shillong'],
    ['scooty rental shillong', 'activa rental shillong', 'two wheeler rental shillong', 'scooty on rent shillong']
  ),

  mkPage('suv-rental-shillong', 'rentals', 'AutoRental',
    'SUV Rental in Shillong — 4x4 for Meghalaya | XTSY', 'Rent SUVs in Shillong for Meghalaya road trips. Creta, XUV700, Fortuner available. Self-drive & chauffeur. Book with XTSY Rentals.',
    'SUV Rental in Shillong', 'Meghalaya\'s terrain demands a capable vehicle. Rent an SUV from XTSY for comfortable, safe travel through winding mountain roads, waterfalls, and remote villages.',
    [
      { heading: 'SUV Fleet', content: 'Choose your adventure vehicle:', listItems: ['Hyundai Creta — ₹2,500/day', 'Mahindra XUV700 — ₹3,500/day', 'Toyota Fortuner — ₹5,000/day', 'Mahindra Thar (4x4) — ₹4,000/day', 'All SUVs: AC, power steering, GPS'] },
      { heading: 'Why SUV for Meghalaya', content: 'Meghalaya roads can be challenging with hairpin bends, steep descents, and occasional unpaved stretches. An SUV provides:', listItems: ['Higher ground clearance for rural roads', 'Better handling on wet mountain roads', 'Comfortable seating for 5-7 passengers', 'Boot space for luggage & gear'] },
    ],
    [
      { question: 'Is an SUV necessary for Meghalaya?', answer: 'For main highways (Shillong-Cherrapunji-Dawki), a sedan works fine. For offbeat destinations like Nongjrong, Mawryngkhang, or remote waterfalls, an SUV is strongly recommended.' },
    ],
    ['premium-suv-rental-shillong', 'car-rental-shillong', 'self-drive-car-shillong'],
    ['suv rental shillong', 'suv rental near me', '4x4 rental shillong', 'fortuner rental shillong']
  ),

  mkPage('cheap-car-rental-shillong', 'rentals', 'AutoRental',
    'Cheap Car Rental Shillong — From ₹1,200/Day | XTSY', 'Cheapest car rental in Shillong from ₹1,200/day. Hatchbacks, sedans, SUVs. Self-drive & chauffeur options. No hidden charges.',
    'Cheapest Car Rental in Shillong', 'Looking for affordable car rental in Shillong? XTSY offers the best rates starting at ₹1,200/day for hatchbacks with no hidden charges. Perfect for budget Meghalaya road trips.',
    [
      { heading: 'Budget Car Options', content: 'Most affordable vehicles in our fleet:', listItems: ['Maruti Alto/WagonR — ₹1,200/day', 'Maruti Swift/Baleno — ₹1,500/day', 'Hyundai i20 — ₹1,500/day', 'All include insurance & basic roadside assistance', 'No hidden charges or extra km fees'] },
      { heading: 'Money-Saving Tips', content: 'Save more on your car rental:', listItems: ['Book 3+ days for multi-day discount', 'Share with fellow travelers at XTSY', 'Combine with hostel stay for combo deals', 'Self-drive saves ₹800-1,200/day vs chauffeur'] },
    ],
    [
      { question: 'What\'s the cheapest car I can rent?', answer: 'Our Maruti Alto/WagonR at ₹1,200/day is the most affordable option, perfect for Shillong city exploration and short trips.' },
    ],
    ['car-rental-shillong', 'self-drive-car-shillong', 'bike-rental-shillong'],
    ['cheap car rental shillong', 'cheapest rental cars shillong', 'cheap car hire shillong', 'budget car rental meghalaya']
  ),

  mkPage('guwahati-to-shillong-transport', 'rentals', 'LocalBusiness',
    'Guwahati to Shillong — Transport Guide 2026 | XTSY', 'Complete guide: Guwahati to Shillong by taxi, bus, self-drive. Compare prices, timings & best options. Book transfers via XTSY.',
    'Guwahati to Shillong Transport Guide', 'Planning your journey from Guwahati to Shillong? Here\'s your complete transport guide with all options — shared taxis, private cabs, buses, and self-drive cars.',
    [
      { heading: 'Transport Options Compared', content: 'Choose the best way to travel:', listItems: ['Shared Taxi (Sumo/Xylo) — ₹500/person, 2.5 hrs', 'Private Taxi — ₹2,500-3,500, 2.5 hrs', 'ASTC Bus — ₹200, 3.5 hrs', 'Self-Drive Car Rental — ₹1,500-3,500/day', 'Helicopter (seasonal) — ₹3,500, 30 min'] },
      { heading: 'Route & Stops', content: 'The Guwahati-Shillong highway (NH6) passes through Nongpoh. Key stops:', listItems: ['Umiam Lake viewpoint — km 78', 'Nongpoh town — food & fuel stop', 'Barapani — Umiam Lake boating', 'Total distance: 98 km, mostly uphill'] },
      { heading: 'From Other Cities', content: 'Reaching Shillong from other Northeast cities:', listItems: ['Siliguri: 430 km, 10-12 hrs by road', 'Dimapur: 340 km, 8-9 hrs', 'Kohima: 370 km, 9-10 hrs', 'Tawang: 680 km, 16-18 hrs (via Guwahati)'] },
    ],
    [
      { question: 'How to reach Shillong from Guwahati Airport?', answer: 'Take a prepaid taxi (₹2,500-3,000) or walk to Khanapara for shared taxis (₹500). Pre-book a self-drive car for maximum flexibility.' },
      { question: 'Is the road from Guwahati to Shillong safe?', answer: 'Yes, NH6 is well-maintained. The drive is scenic with gentle curves. Avoid night driving due to fog and narrow stretches.' },
    ],
    ['self-drive-car-guwahati', 'car-rental-guwahati', 'car-rental-shillong'],
    ['guwahati to shillong', 'guwahati to shillong bus', 'guwahati to shillong taxi', 'how to reach shillong from guwahati']
  ),

  mkPage('car-booking-shillong', 'rentals', 'AutoRental',
    'Car Booking Shillong — Instant Online | XTSY Rentals', 'Book cars online in Shillong. Self-drive & chauffeur. Instant confirmation via WhatsApp. SUVs, sedans from ₹1,200/day.',
    'Car Booking in Shillong', 'Book a car in Shillong instantly with XTSY Rentals. Choose from self-drive or chauffeur-driven vehicles. Instant confirmation, flexible cancellation, and 24/7 support.',
    [
      { heading: 'How to Book', content: 'Simple 3-step booking:', listItems: ['Choose vehicle type & dates', 'Send booking request via WhatsApp', 'Get instant confirmation & pickup details'] },
      { heading: 'Why Book with XTSY', content: 'Advantages of booking through us:', listItems: ['No middlemen — direct pricing', 'Well-maintained, sanitized vehicles', 'Flexible cancellation policy', '24/7 roadside assistance', 'Local driver option for mountain roads'] },
    ],
    [
      { question: 'Can I book a car for a one-way trip?', answer: 'Yes! We offer one-way rentals between Guwahati, Shillong, Cherrapunji, and Dawki. One-way charges apply.' },
    ],
    ['car-rental-shillong', 'self-drive-car-shillong', 'cheap-car-rental-shillong'],
    ['car booking shillong', 'car hire shillong', 'book car online shillong', 'rent car shillong']
  ),

  mkPage('vehicle-rental-northeast', 'rentals', 'AutoRental',
    'Vehicle Rental Northeast India — Cars & Bikes | XTSY', 'Rent vehicles across Northeast India. Cars, SUVs, bikes for Meghalaya, Assam, Nagaland trips. Self-drive & chauffeur. Book via XTSY.',
    'Vehicle Rental in Northeast India', 'Explore Northeast India with reliable vehicle rentals from XTSY. We serve Meghalaya, Assam, and connecting routes to Nagaland, Arunachal Pradesh, and Manipur.',
    [
      { heading: 'Coverage Areas', content: 'Our rental network covers:', listItems: ['Meghalaya: Shillong, Cherrapunji, Dawki', 'Assam: Guwahati, Kaziranga', 'Inter-state routes to Nagaland, Arunachal', 'One-way rentals available', 'Airport & station pickup/drop'] },
      { heading: 'Vehicle Categories', content: 'Full range of vehicles:', listItems: ['Hatchbacks from ₹1,200/day', 'Sedans from ₹1,500/day', 'SUVs from ₹2,500/day', 'Premium SUVs from ₹5,000/day', 'Bikes & scooties from ₹500/day'] },
    ],
    [
      { question: 'Can I drive to another state?', answer: 'Yes, our vehicles can be driven across Northeast Indian states. Inform us about your route for appropriate permits and insurance coverage.' },
    ],
    ['car-rental-shillong', 'car-rental-guwahati', 'self-drive-car-guwahati'],
    ['vehicle rental northeast india', 'vehicle rental near me', 'car rental northeast india', 'rent vehicle meghalaya']
  ),
];

// ============================================================================
// TRAVEL AGENCY PAGES (3)
// ============================================================================
const travelAgencyPages: SEOPageData[] = [
  mkPage('travel-agency-shillong', 'tours', 'LocalBusiness',
    'Best Travel Agency in Shillong 2026 | XTSY Travel', 'Top-rated travel agency in Shillong. Customized Meghalaya tour packages, transport, accommodation. 4.8★ rated. Plan your trip with XTSY.',
    'Best Travel Agency in Shillong', 'XTSY is Shillong\'s most trusted travel agency, offering end-to-end trip planning — from accommodation and transport to guided tours and curated experiences across Meghalaya.',
    [
      { heading: 'Our Services', content: 'Complete travel solutions:', listItems: ['Customized Meghalaya tour packages', 'Hotel & hostel bookings', 'Car & bike rentals', 'Airport/station transfers', 'Guided treks & adventure activities', 'Group & corporate travel planning'] },
      { heading: 'Why Choose XTSY', content: '4.8★ rated on Google with 320+ reviews. We\'re not just a travel agency — we\'re a travel ecosystem with our own hostel, restaurant, and transport fleet. Local expertise you can trust.' },
      { heading: 'Popular Packages', content: 'Our bestselling packages:', listItems: ['3-Day Shillong Explorer — ₹8,999/person', '5-Day Meghalaya Circuit — ₹14,999/person', '7-Day Complete Meghalaya — ₹19,999/person', 'Custom packages available on request'] },
    ],
    [
      { question: 'Can you customize a tour package?', answer: 'Yes! We specialize in customized packages. Tell us your dates, budget, and interests, and we\'ll create the perfect Meghalaya itinerary.' },
      { question: 'Do you handle group bookings?', answer: 'Absolutely! We handle groups of 2-50+ travelers with special rates, dedicated transport, and personalized itineraries.' },
    ],
    ['meghalaya-tour-package', 'shillong-tour-package', 'tour-operators-meghalaya'],
    ['travel agency in shillong', 'best travel agency shillong', 'shillong travel agent', 'meghalaya travel agency'],
    'Contact Us', waLink('Hi, I need help planning my Meghalaya trip')
  ),

  mkPage('tour-operators-meghalaya', 'tours', 'LocalBusiness',
    'Best Tour Operators in Meghalaya 2026 | XTSY', 'Top tour operators in Meghalaya. Customized packages, local guides, transport. 4.8★ rated. Plan your Meghalaya trip with XTSY.',
    'Best Tour Operators in Meghalaya', 'Looking for reliable tour operators in Meghalaya? XTSY offers professionally curated tour packages with local guides, comfortable transport, and authentic experiences across the state.',
    [
      { heading: 'What We Offer', content: 'As Meghalaya\'s leading tour operator:', listItems: ['Professionally curated itineraries', 'Experienced local guides', 'Comfortable AC transport', 'Handpicked accommodation', 'Authentic local food experiences', '24/7 on-trip support'] },
      { heading: 'Top Destinations We Cover', content: 'Our tours cover all of Meghalaya:', listItems: ['Shillong city & surroundings', 'Cherrapunji — wettest place on earth', 'Dawki & Umngot River', 'Mawlynnong — Asia\'s cleanest village', 'Nongjrong — sunrise viewpoint', 'Living root bridges & caves'] },
    ],
    [
      { question: 'How do I book a tour with XTSY?', answer: 'Simply WhatsApp us with your travel dates and preferences. We\'ll create a customized package and send you a detailed itinerary within 24 hours.' },
      { question: 'What\'s included in tour packages?', answer: 'Our packages typically include accommodation, transport, guide fees, entry tickets, and breakfast. Customizable based on your preferences.' },
    ],
    ['travel-agency-shillong', 'meghalaya-tour-package', 'shillong-tour-package'],
    ['tour operators in meghalaya', 'tour operators meghalaya', 'meghalaya tour operator', 'best tour company meghalaya'],
    'Get Quote', waLink('Hi, I need a Meghalaya tour package quote')
  ),

  mkPage('tour-operators-shillong', 'tours', 'LocalBusiness',
    'Tour Operators in Shillong 2026 — Best Rated | XTSY', 'Find the best tour operators in Shillong. Customized packages, local expertise, 4.8★ rated. Book your Meghalaya tour with XTSY.',
    'Tour Operators in Shillong', 'XTSY is among Shillong\'s highest-rated tour operators, offering customized Meghalaya experiences. From budget backpacker tours to luxury getaways, we plan it all.',
    [
      { heading: 'Our Expertise', content: 'What makes us Shillong\'s preferred tour operator:', listItems: ['4.8★ Google rating with 320+ reviews', 'Own hostel & restaurant in Shillong', 'Fleet of well-maintained vehicles', 'Deep local knowledge & connections', 'Competitive, transparent pricing'] },
      { heading: 'Day Trips from Shillong', content: 'Popular day tours we organize:', listItems: ['Cherrapunji Day Trip — ₹2,500/person', 'Dawki & Mawlynnong — ₹2,800/person', 'Laitlum Canyon Trek — ₹1,500/person', 'Shillong City Tour — ₹1,200/person', 'Nongjrong Sunrise Trip — ₹3,000/person'] },
    ],
    [
      { question: 'Can you arrange last-minute tours?', answer: 'Yes! We can organize day trips with as little as 12 hours notice, subject to vehicle and guide availability.' },
    ],
    ['travel-agency-shillong', 'tour-operators-meghalaya', 'shillong-tour-package'],
    ['tour operators in shillong', 'tour operators shillong', 'shillong tour operator', 'best tour company shillong'],
    'Book Tour', waLink('Hi, I want to book a tour from Shillong')
  ),
];

// ============================================================================
// EXPERIENCE & INTENT PAGES (8)
// ============================================================================
const experiencePages: SEOPageData[] = [
  mkPage('solo-trip-meghalaya', 'travel-guides', 'TravelGuide',
    'Solo Trip to Meghalaya 2026 — Complete Guide | XTSY', 'Planning a solo trip to Meghalaya? Complete guide with safety tips, itinerary, budget, hostels & must-visit places. Travel solo with XTSY.',
    'Solo Trip to Meghalaya — Complete Guide', 'Meghalaya is one of India\'s safest and most rewarding solo travel destinations. This guide covers everything you need to plan an unforgettable solo trip — from safety tips to budget breakdowns.',
    [
      { heading: 'Why Meghalaya for Solo Travel', content: 'Meghalaya ranks among India\'s safest states for solo travelers:', listItems: ['Extremely low crime rate', 'Friendly, welcoming locals', 'Well-connected public transport', 'Thriving backpacker community', 'English widely spoken'] },
      { heading: 'Solo Travel Budget', content: 'Budget breakdown for solo travelers:', listItems: ['Accommodation: ₹499-1,499/night at XTSY', 'Food: ₹300-500/day', 'Transport: ₹500-1,500/day (shared)', 'Activities: ₹200-500/day', 'Total: ₹1,500-4,000/day'] },
      { heading: 'Solo-Friendly Itinerary', content: 'Recommended 5-day solo itinerary:', listItems: ['Day 1: Arrive Shillong, explore Police Bazaar', 'Day 2: Cherrapunji waterfalls & caves', 'Day 3: Dawki river & Mawlynnong village', 'Day 4: Laitlum Canyon trek', 'Day 5: Shillong Peak & departure'] },
    ],
    [
      { question: 'Is Meghalaya safe for solo female travelers?', answer: 'Yes! Meghalaya is one of India\'s safest states for women. It\'s a matrilineal society where women are respected. XTSY also has a female-only dorm for added comfort.' },
      { question: 'How much does a solo trip to Meghalaya cost?', answer: 'A budget solo trip costs ₹1,500-2,500/day including XTSY hostel stay (₹499), food, and shared transport. A 5-day trip totals approximately ₹8,000-12,000.' },
    ],
    ['backpacker-hostel-shillong', 'meghalaya-backpacking-guide', 'budget-stay-shillong'],
    ['solo trip meghalaya', 'solo travel meghalaya', 'meghalaya solo trip', 'solo trip shillong', 'is meghalaya safe for solo travel'],
    'Book Solo Stay', '/book'
  ),

  mkPage('north-east-trip-guide', 'travel-guides', 'TravelGuide',
    'North East India Trip Guide 2026 | XTSY Travel', 'Complete North East India travel guide. Best places, itinerary, budget, safety tips. Plan your Northeast trip with XTSY as your base.',
    'North East India Trip Guide', 'Northeast India is India\'s last frontier of untouched beauty. This comprehensive guide covers the best states, routes, and experiences with Meghalaya as your ideal starting point.',
    [
      { heading: 'Best Northeast States to Visit', content: 'Top destinations in Northeast India:', listItems: ['Meghalaya — waterfalls, caves, living root bridges', 'Assam — Kaziranga, tea gardens, river cruises', 'Nagaland — Hornbill Festival, tribal culture', 'Arunachal Pradesh — Tawang, Ziro Valley', 'Sikkim — Gangtok, Nathula Pass', 'Manipur — Loktak Lake, Ima Keithel'] },
      { heading: 'Northeast Travel Budget', content: 'Budget per day for Northeast travel:', listItems: ['Budget: ₹1,500-2,500/day', 'Mid-range: ₹3,000-5,000/day', 'Luxury: ₹7,000-15,000/day', 'Transport adds ₹500-2,000/day depending on mode'] },
      { heading: 'Safety & Tips', content: 'Northeast India travel tips:', listItems: ['Carry valid ID (Aadhaar/passport)', 'Some areas require Inner Line Permits', 'Respect local customs & traditions', 'Weather varies — pack layers', 'Mobile connectivity can be limited in remote areas'] },
    ],
    [
      { question: 'Is North East India safe for tourists?', answer: 'Yes, Northeast India is very safe for tourists. The region has seen massive improvements in infrastructure and security. Meghalaya, Assam, and Sikkim are especially tourist-friendly.' },
      { question: 'How many days for a Northeast trip?', answer: 'A minimum of 5-7 days covers Meghalaya well. For a multi-state trip, plan 10-15 days. XTSY in Shillong is the perfect base for exploring.' },
    ],
    ['meghalaya-backpacking-guide', 'solo-trip-meghalaya', 'meghalaya-tour-package'],
    ['north east trip', 'north east india travel guide', 'is north east safe', 'northeast india tour', 'northeast india itinerary'],
    'Plan Northeast Trip', waLink('Hi, I want to plan a Northeast India trip')
  ),

  mkPage('offbeat-meghalaya', 'travel-guides', 'TravelGuide',
    'Offbeat Places in Meghalaya 2026 — Hidden Gems | XTSY', 'Discover offbeat Meghalaya — hidden waterfalls, secret villages, unexplored caves. Go beyond tourist spots with XTSY local guides.',
    'Offbeat Places in Meghalaya', 'Beyond the popular tourist circuit lies a Meghalaya few travelers see. Discover hidden waterfalls, secret villages, and unexplored trails with XTSY\'s local expertise.',
    [
      { heading: 'Hidden Gems', content: 'Offbeat destinations most tourists miss:', listItems: ['Nongjrong Village — sunrise viewpoint & root bridge', 'Mawryngkhang Bamboo Trek — most thrilling trek', 'Krang Suri Falls — turquoise swimming pool', 'Phe Phe Falls — hidden waterfall trek', 'Balpakram National Park — Grand Canyon of Meghalaya', 'Nartiang Monoliths — ancient megalithic site'] },
      { heading: 'Why Go Offbeat', content: 'Offbeat Meghalaya offers:', listItems: ['Zero crowds at stunning locations', 'Authentic village homestay experiences', 'Untouched natural beauty', 'Deeper cultural immersion', 'Better photography opportunities'] },
    ],
    [
      { question: 'How do I reach offbeat places in Meghalaya?', answer: 'Most offbeat spots require a private vehicle. XTSY offers guided tours with transport to these hidden gems, or you can rent a car from our rental desk.' },
      { question: 'Are offbeat places safe to visit?', answer: 'Yes, with proper planning and local guidance. XTSY\'s guides know these areas well. We recommend visiting with a local guide for the best experience.' },
    ],
    ['meghalaya-backpacking-guide', 'nongjrong-tour-package', 'solo-trip-meghalaya'],
    ['offbeat meghalaya', 'offbeat places meghalaya', 'hidden places meghalaya', 'unexplored meghalaya', 'offbeat india']
  ),

  mkPage('shillong-vacation-planner', 'travel-guides', 'TravelGuide',
    'Shillong Vacation Planner 2026 — Complete Guide', 'Plan your Shillong vacation. Best time, itinerary, hotels, things to do, budget tips. Your complete Shillong trip planner by XTSY.',
    'Shillong Vacation Planner', 'Planning a vacation to Shillong? This comprehensive planner covers best time to visit, top attractions, accommodation options, dining guide, and day trip ideas.',
    [
      { heading: 'Best Time to Visit', content: 'Shillong is beautiful year-round:', listItems: ['March-May: Pleasant spring, cherry blossoms', 'June-September: Monsoon, lush green (heavy rain)', 'October-November: Autumn Festival season', 'December-February: Cold winter, clear skies'] },
      { heading: 'Top Things to Do', content: 'Must-do experiences:', listItems: ['Explore Police Bazaar & Iewduh market', 'Visit Shillong Peak for panoramic views', 'Day trip to Cherrapunji\'s waterfalls', 'Dawki river crystal clear water', 'Trek to Laitlum Canyons', 'Live music at local cafés'] },
      { heading: 'Where to Stay', content: 'XTSY Travellers Hostel is your best base — centrally located with dorms from ₹499 and private rooms from ₹1,499. In-house restaurant, tour desk, and car rentals available.' },
    ],
    [
      { question: 'How many days are enough for Shillong?', answer: '3-4 days is ideal for Shillong and nearby attractions. For the full Meghalaya experience including Cherrapunji and Dawki, plan 5-7 days.' },
      { question: 'What should I pack for Shillong?', answer: 'Pack layers (it\'s always cooler than plains), a rain jacket, comfortable walking shoes, and a camera. Winter visitors need warm jackets and thermals.' },
    ],
    ['budget-stay-shillong', 'shillong-tour-package', 'backpacker-hostel-shillong'],
    ['shillong vacation', 'shillong trip planner', 'shillong offers', 'plan shillong trip', 'shillong holiday']
  ),

  mkPage('group-booking-shillong', 'accommodation', 'LodgingBusiness',
    'Group Booking Shillong — Dorms & Rooms | XTSY', 'Book group accommodation in Shillong. Dorms & rooms for 4-50+ guests. Special group rates, common areas, event spaces. Book at XTSY.',
    'Group Booking in Shillong', 'Planning a group trip to Shillong? XTSY offers special group rates for colleges, corporates, friend groups, and travel clubs. Accommodation for 4 to 50+ guests.',
    [
      { heading: 'Group Packages', content: 'Tailored group accommodation:', listItems: ['College Groups: ₹399/bed/night (10+ guests)', 'Corporate Retreats: Custom packages', 'Friend Groups (4-8): ₹449/bed/night', 'Travel Clubs: Special monthly rates', 'Includes common area & event space access'] },
      { heading: 'Group Facilities', content: 'Perfect for groups:', listItems: ['Large common lounge for meetings', 'Bonfire area for group events', 'TAB Bistro for group dining', 'Guided group tours available', 'Private rooms + dorms combo for mixed groups'] },
    ],
    [
      { question: 'Do you offer discounts for large groups?', answer: 'Yes! Groups of 10+ get special rates starting at ₹399/bed/night. Contact us on WhatsApp for a custom quote.' },
      { question: 'Can you arrange activities for our group?', answer: 'Absolutely! We organize guided treks, city tours, bonfire nights, and day trips for groups. Let us know your interests!' },
    ],
    ['budget-stay-shillong', 'backpacker-hostel-shillong', 'shillong-tour-package'],
    ['group booking shillong', 'group accommodation shillong', 'corporate retreat shillong', 'college trip shillong'],
    'Get Group Quote', waLink('Hi, I need group accommodation in Shillong')
  ),

  mkPage('luxury-resorts-for-couples-shillong', 'glamping', 'LodgingBusiness',
    'Luxury Resorts for Couples in Shillong | XTSY 270°', 'Romantic luxury stays in Shillong for couples. XTSY 270° panoramic glasshouse with forest views. Perfect for honeymoons & anniversaries.',
    'Luxury Resorts for Couples in Shillong', 'Looking for a romantic luxury stay in Shillong? XTSY\'s 270° panoramic glasshouse offers couples an unforgettable experience — wake up to forest views in a glass-walled room.',
    [
      { heading: 'XTSY 270° Glasshouse', content: 'The ultimate romantic stay:', listItems: ['270° panoramic glass walls', 'Surrounded by pine forests', 'King-size bed with premium linen', 'Private bathroom with hot shower', 'Star-gazing from your bed', 'Starting at ₹4,999/night'] },
      { heading: 'Romantic Experiences', content: 'Make your stay special:', listItems: ['Candlelit dinner at TAB Bistro', 'Sunrise view from the glasshouse', 'Couple\'s day trip to Dawki', 'Cherry blossom walks (March-April)', 'Bonfire under the stars'] },
    ],
    [
      { question: 'Is the glasshouse private?', answer: 'Yes, the XTSY 270° Glasshouse is a completely private room with its own entrance, bathroom, and uninterrupted forest views.' },
      { question: 'Can you arrange a surprise for my partner?', answer: 'Yes! We can arrange cake, flowers, room decoration, and special dining experiences. Contact us in advance for arrangements.' },
    ],
    ['luxury-glamping-shillong', 'meghalaya-honeymoon-package', 'shillong-tour-package'],
    ['luxury resorts for couples shillong', 'romantic stay shillong', 'honeymoon resort shillong', 'couple hotel shillong']
  ),

  mkPage('unique-luxury-stay-india', 'glamping', 'LodgingBusiness',
    'Unique Luxury Stays in India — XTSY 270° Glasshouse', 'Experience India\'s most unique luxury stay — XTSY 270° Glasshouse in Shillong. 270° panoramic glass room in pine forest. Book now.',
    'Unique Luxury Stay in India — XTSY 270°', 'Looking for a truly unique luxury stay in India? The XTSY 270° Glasshouse in Shillong offers a one-of-a-kind experience — sleep in a glass room surrounded by pine forests.',
    [
      { heading: 'Why It\'s Unique', content: 'What makes XTSY 270° special:', listItems: ['India\'s only 270° panoramic glass room', 'Located in Meghalaya\'s pine forests', 'Unobstructed views of hills & sky', 'Star-gazing from bed', 'Instagram-worthy design'] },
      { heading: 'The Experience', content: 'A stay at XTSY 270° includes:', listItems: ['Premium king-size bed', 'Private bathroom with hot shower', 'Complimentary breakfast at TAB Bistro', 'Access to all XTSY amenities', 'Guided nature walk on request'] },
    ],
    [
      { question: 'Where is the XTSY 270° Glasshouse?', answer: 'Located in New Shillong Township, Meghalaya — about 10 minutes from Shillong city center, surrounded by pine forests.' },
    ],
    ['luxury-glamping-shillong', 'luxury-resorts-for-couples-shillong'],
    ['unique luxury stay india', 'glasshouse stay india', 'unique hotel india', 'glass room hotel india'],
    'Book Glasshouse', '/book'
  ),

  mkPage('luxury-stays-in-india', 'glamping', 'LodgingBusiness',
    'Luxury Stays in India — Unique Experiences | XTSY', 'Discover luxury stays in India beyond ordinary hotels. Glasshouse stays, forest glamping, panoramic rooms. Book XTSY 270° in Meghalaya.',
    'Luxury Stays in India', 'India offers incredible luxury experiences beyond 5-star hotels. From glasshouse stays in Meghalaya to desert camps in Rajasthan — discover unique luxury accommodation.',
    [
      { heading: 'XTSY 270° — Meghalaya', content: 'Our flagship luxury offering:', listItems: ['270° panoramic glass room', 'Pine forest setting in Shillong', 'From ₹4,999/night', 'Perfect for couples & special occasions', '4.8★ rated on Google'] },
      { heading: 'Why Choose Unique Stays', content: 'Move beyond cookie-cutter hotels:', listItems: ['Immersive nature experiences', 'Instagram-worthy locations', 'Memorable once-in-a-lifetime stays', 'Support local communities', 'Stories worth sharing'] },
    ],
    [
      { question: 'How do I book a luxury stay at XTSY?', answer: 'Book directly through our website or WhatsApp for the best rates. We recommend booking 2-3 weeks in advance for the glasshouse.' },
    ],
    ['unique-luxury-stay-india', 'luxury-glamping-shillong', 'luxury-resorts-for-couples-shillong'],
    ['luxury stays in india', 'luxury stays india', 'unique luxury stays', 'best luxury stays india']
  ),
];

// ============================================================================
// ACCOMMODATION EXPANSION (6)
// ============================================================================
const accommodationExpansionPages: SEOPageData[] = [
  mkPage('stays-in-shillong', 'accommodation', 'LodgingBusiness',
    'Best Stays in Shillong 2026 — Budget to Luxury | XTSY', 'Find the best stays in Shillong. Hostels from ₹499, private rooms from ₹1,499, luxury glasshouse ₹4,999. All at XTSY Travellers Hostel.',
    'Best Stays in Shillong', 'From budget dorms to luxury glasshouse — find your perfect stay in Shillong at XTSY. Rated 4.8★ on Google with 320+ reviews, centrally located with in-house dining.',
    [
      { heading: 'Stay Options at XTSY', content: 'Something for every traveler:', listItems: ['8-Bed Mixed Dorm — ₹499/night', '6-Bed Mixed Dorm — ₹699/night', '4-Bed Female-Only Dorm — ₹799/night', 'Private Double Room — ₹1,499/night', 'Deluxe Room — ₹1,999/night', 'XTSY 270° Glasshouse — ₹4,999/night'] },
      { heading: 'What\'s Included', content: 'Every stay includes free WiFi, hot water, common kitchen, lounge access, luggage storage, and 24/7 reception. In-house TAB Bistro restaurant for meals.' },
    ],
    [
      { question: 'Which is the best area to stay in Shillong?', answer: 'New Shillong Township (where XTSY is located) offers a peaceful environment with easy 10-minute access to Police Bazaar. It\'s ideal for travelers who want convenience without city noise.' },
    ],
    ['budget-stay-shillong', 'backpacker-hostel-shillong', 'luxury-glamping-shillong'],
    ['stays in shillong', 'where to stay in shillong', 'best stays shillong', 'shillong accommodation']
  ),

  mkPage('dorms-in-shillong', 'hostels', 'Hostel',
    'Dorms in Shillong — Mixed & Female | From ₹499 | XTSY', 'Book dormitory rooms in Shillong from ₹499. Mixed & female-only dorms with lockers, hot showers. Best rated dorm stay at XTSY.',
    'Dormitory Rooms in Shillong', 'Looking for affordable dorms in Shillong? XTSY offers mixed and female-only dormitories with personal lockers, privacy curtains, and hot showers — starting at just ₹499/night.',
    [
      { heading: 'Dorm Options', content: 'Choose your dorm:', listItems: ['8-Bed Mixed Dorm — ₹499/night (best value)', '6-Bed Mixed Dorm — ₹699/night (more space)', '4-Bed Female-Only Dorm — ₹799/night (safe & secure)', 'All dorms: personal locker, reading light, charging point'] },
      { heading: 'Dorm Amenities', content: 'Every bed includes:', listItems: ['Comfortable mattress & clean linen', 'Privacy curtain', 'Personal locker (bring your own lock)', 'Reading light & USB charging', 'Hot shower in attached bathroom'] },
    ],
    [
      { question: 'Are dorms safe?', answer: 'Yes! XTSY dorms have personal lockers, CCTV in common areas, and 24/7 reception. Our female-only dorm provides an extra layer of security.' },
    ],
    ['shillong-dormitory', 'cheap-hostel-shillong', 'budget-stay-shillong'],
    ['dorms in shillong', 'dormitory room shillong', 'dorm stay shillong', 'shared room shillong']
  ),

  mkPage('places-to-stay-shillong', 'accommodation', 'LodgingBusiness',
    'Places to Stay in Shillong 2026 — Top Options | XTSY', 'Best places to stay in Shillong. Hostels, hotels, homestays compared. XTSY rated 4.8★. Central location, dorms from ₹499.',
    'Best Places to Stay in Shillong', 'Looking for the best place to stay in Shillong? Compare hostels, hotels, and homestays. XTSY Travellers Hostel offers the best value with multiple room types and top-rated hospitality.',
    [
      { heading: 'Accommodation Types', content: 'Shillong offers various stay options:', listItems: ['Hostels (XTSY) — ₹499-1,999/night, social atmosphere', 'Budget Hotels — ₹1,500-3,000/night', 'Homestays — ₹1,000-2,500/night', 'Luxury Hotels — ₹5,000-15,000/night', 'Unique Stays (XTSY 270°) — ₹4,999/night'] },
      { heading: 'Best Areas to Stay', content: 'Top neighborhoods:', listItems: ['New Shillong Township — peaceful, XTSY location', 'Police Bazaar — city center, shopping', 'Laitumkhrah — cafés, restaurants', 'Upper Shillong — quiet, scenic'] },
    ],
    [
      { question: 'Where should first-time visitors stay in Shillong?', answer: 'New Shillong Township is ideal — peaceful yet accessible. XTSY Hostel here offers the best combination of affordability, amenities, and location for exploring all of Meghalaya.' },
    ],
    ['stays-in-shillong', 'budget-stay-shillong', 'backpacker-hostel-shillong'],
    ['places to stay in shillong', 'where to stay shillong', 'best place to stay shillong', 'shillong hotels']
  ),

  mkPage('homestay-in-mawlynnong', 'homestays', 'LodgingBusiness',
    'Homestay in Mawlynnong — Asia\'s Cleanest Village', 'Book homestays in Mawlynnong, Asia\'s cleanest village. Experience Khasi village life. Day trips from Shillong. Plan with XTSY.',
    'Homestay in Mawlynnong', 'Experience authentic Khasi village life at a homestay in Mawlynnong — Asia\'s cleanest village. Located 90km from Shillong, Mawlynnong offers a unique cultural immersion.',
    [
      { heading: 'Mawlynnong Homestay Experience', content: 'What to expect:', listItems: ['Traditional Khasi bamboo houses', 'Home-cooked Khasi meals', 'Clean, eco-friendly village', 'Living root bridge nearby', 'Stunning Bangladesh viewpoint', 'Community-managed tourism'] },
      { heading: 'How to Visit', content: 'Best ways to experience Mawlynnong:', listItems: ['Day trip from Shillong (2.5 hrs each way)', 'Combine with Dawki trip (30 km away)', 'Stay overnight for full experience', 'XTSY arranges guided trips', 'Best season: October-April'] },
    ],
    [
      { question: 'Can I stay overnight in Mawlynnong?', answer: 'Yes! Several community-run homestays offer overnight stays. Alternatively, stay at XTSY in Shillong and visit Mawlynnong on a day trip.' },
      { question: 'How do I reach Mawlynnong from Shillong?', answer: 'Mawlynnong is 90km from Shillong, about 2.5 hours by car. XTSY offers day trips or you can rent a car from our rental desk.' },
    ],
    ['dawki-travel-guide', 'meghalaya-tour-package', 'backpacker-hostel-shillong'],
    ['homestay in mawlynnong', 'mawlynnong accommodation', 'cleanest village homestay', 'mawlynnong stay']
  ),

  mkPage('hotel-near-police-bazar', 'hotels', 'Hotel',
    'Hotel Near Police Bazar Shillong — Best Options 2026', 'Find hotels near Police Bazar Shillong. XTSY Hostel is 10 min away with rooms from ₹499. Central location, 4.8★ rated.',
    'Hotels Near Police Bazar, Shillong', 'Looking for a hotel near Police Bazar in Shillong? XTSY Travellers Hostel is just 10 minutes away with options from ₹499 dorms to ₹4,999 glasshouse rooms.',
    [
      { heading: 'XTSY — Near Police Bazar', content: 'Just 10 minutes from Police Bazaar:', listItems: ['3.5 km from Police Bazaar center', 'Auto-rickshaw: ₹50-80, 10 minutes', 'Shared taxi: ₹30-50', 'Peaceful location away from city noise', 'Easy access to all Shillong attractions'] },
      { heading: 'Room Options', content: 'Stay at any budget level:', listItems: ['Dorm beds from ₹499', 'Private rooms from ₹1,499', 'Deluxe rooms from ₹1,999', 'XTSY 270° Glasshouse — ₹4,999'] },
    ],
    [
      { question: 'How far is XTSY from Police Bazar?', answer: 'XTSY is about 3.5 km (10 minutes by auto) from Police Bazaar. Regular shared autos and taxis are available.' },
    ],
    ['hostel-near-police-bazar-shillong', 'stays-in-shillong', 'budget-stay-shillong'],
    ['hotel near police bazar shillong', 'police bazaar hotels', 'accommodation near police bazar', 'hotel police bazar shillong']
  ),

  mkPage('guest-house-shillong', 'accommodation', 'LodgingBusiness',
    'Guest House in Shillong — Affordable Stays | XTSY', 'Budget guest house stays in Shillong from ₹499. Clean rooms, free WiFi, hot water. Better than traditional guest houses. Book XTSY.',
    'Guest House in Shillong', 'Looking for a guest house in Shillong? XTSY Travellers Hostel offers guest house-style comfort at hostel prices — private rooms from ₹1,499 with all modern amenities.',
    [
      { heading: 'Better Than a Guest House', content: 'XTSY offers more than a traditional guest house:', listItems: ['Private rooms from ₹1,499/night', 'All rooms with attached bathroom', 'Free WiFi & hot water', 'In-house restaurant (TAB Bistro)', 'Common lounge & kitchen', 'Tour desk & car rental'] },
      { heading: 'Guest House vs XTSY', content: 'Typical Shillong guest houses offer basic rooms at ₹800-1,500 without extras. XTSY provides hotel-level amenities at guest house prices, plus a social atmosphere and travel services.' },
    ],
    [
      { question: 'Is XTSY a guest house or hostel?', answer: 'XTSY is a modern travellers hostel with both dormitories and private rooms. Our private rooms offer guest house-level privacy with hostel-level pricing and social atmosphere.' },
    ],
    ['budget-stay-shillong', 'stays-in-shillong', 'places-to-stay-shillong'],
    ['guest house shillong', 'guest house in shillong', 'cheap guest house shillong', 'shillong guesthouse']
  ),
];

// ============================================================================
// LONG-TAIL TOURISM — SEASONAL (12)
// ============================================================================
const seasonalPages: SEOPageData[] = [
  ...['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].map((month, i) => {
    const monthCap = month.charAt(0).toUpperCase() + month.slice(1);
    const seasons: Record<string, { weather: string; highlights: string[]; tip: string }> = {
      january: { weather: 'Cold (5-15°C), dry, clear skies', highlights: ['Cherry blossom early signs', 'Clear mountain views', 'Low tourist crowds', 'Best waterfall photography'], tip: 'Pack warm layers, thermals, and a good jacket.' },
      february: { weather: 'Cold to pleasant (7-18°C), dry', highlights: ['Cherry blossoms begin', 'Shillong Autumn Festival', 'Clear skies for trekking', 'Valentine getaway season'], tip: 'Perfect for outdoor activities with mild weather.' },
      march: { weather: 'Pleasant (10-22°C), spring begins', highlights: ['Cherry blossoms peak', 'Spring festivals', 'Ideal trekking weather', 'Flower blooms everywhere'], tip: 'Best month for photography and cherry blossom viewing.' },
      april: { weather: 'Warm (15-25°C), occasional showers', highlights: ['Lush green landscapes', 'Pre-monsoon waterfall flow', 'Nongkrem Dance Festival', 'Good for all activities'], tip: 'Light rain jacket recommended. Great all-round month.' },
      may: { weather: 'Warm (18-25°C), pre-monsoon showers', highlights: ['Green landscapes', 'Good waterfall flow', 'Summer break crowd', 'Last window before monsoon'], tip: 'Book accommodation in advance — summer rush begins.' },
      june: { weather: 'Warm (18-24°C), monsoon begins', highlights: ['Dramatic monsoon landscapes', 'Waterfalls at full power', 'Lush green everywhere', 'Lower hotel rates'], tip: 'Carry waterproof gear. Roads can be slippery.' },
      july: { weather: 'Warm (18-23°C), heavy rainfall', highlights: ['Peak monsoon beauty', 'Cherrapunji at its wettest', 'Nohkalikai Falls spectacular', 'Misty mountain drives'], tip: 'Heavy rain expected. Book flexible itineraries.' },
      august: { weather: 'Warm (18-23°C), heavy rain continues', highlights: ['Monsoon photography', 'Mushroom season', 'Budget-friendly rates', 'Fewer tourists'], tip: 'Best for budget travelers. Expect rain delays.' },
      september: { weather: 'Pleasant (17-23°C), rain easing', highlights: ['Monsoon receding', 'Green landscapes remain', 'Waterfalls still flowing', 'Crowd-free exploration'], tip: 'Transition month — rain decreasing, landscapes still green.' },
      october: { weather: 'Pleasant (13-22°C), post-monsoon', highlights: ['Shillong Autumn Festival', 'Perfect trekking weather', 'Clear skies return', 'Festival season begins'], tip: 'Best month to visit — perfect weather and festivals.' },
      november: { weather: 'Cool (8-18°C), dry', highlights: ['Post-monsoon clarity', 'Excellent visibility', 'Music festivals', 'Comfortable trekking'], tip: 'Peak tourist season — book 2-3 weeks in advance.' },
      december: { weather: 'Cold (4-14°C), dry, clear', highlights: ['Christmas celebrations', 'New Year parties', 'Clear winter skies', 'Bonfire nights at XTSY'], tip: 'Shillong celebrates Christmas grandly. Book early!' },
    };
    const s = seasons[month];
    return mkPage(`meghalaya-in-${month}`, 'travel-guides' as SEOPageCategory, 'TravelGuide' as SchemaType,
      `Meghalaya in ${monthCap} 2026 — Weather & Guide | XTSY`,
      `Planning Meghalaya in ${monthCap}? Weather, best places, packing tips & things to do. Complete ${monthCap} travel guide by XTSY.`,
      `Meghalaya in ${monthCap} — Travel Guide`, `Everything you need to know about visiting Meghalaya in ${monthCap}. Weather conditions, best activities, packing list, and insider tips from XTSY.`,
      [
        { heading: `${monthCap} Weather in Meghalaya`, content: s.weather },
        { heading: `Things to Do in ${monthCap}`, content: `Best experiences in ${monthCap}:`, listItems: s.highlights },
        { heading: 'Where to Stay', content: `XTSY Travellers Hostel is your ideal ${monthCap} base in Shillong. Dorms from ₹499, private rooms from ₹1,499. Book early during peak months.` },
        { heading: 'Packing Tips', content: s.tip },
      ],
      [
        { question: `Is ${monthCap} a good time to visit Meghalaya?`, answer: `${monthCap} offers ${s.weather}. ${s.highlights[0]} makes it a ${i >= 9 || i <= 3 ? 'great' : 'unique'} time to visit.` },
      ],
      ['meghalaya-backpacking-guide', 'solo-trip-meghalaya', 'shillong-vacation-planner'],
      [`meghalaya in ${month}`, `meghalaya ${month}`, `shillong in ${month}`, `visit meghalaya ${month}`, `best time meghalaya`]
    );
  }),
];

// ============================================================================
// LONG-TAIL — ITINERARY VARIANTS (6)
// ============================================================================
const itineraryExpansionPages: SEOPageData[] = [
  ...[
    { days: '4', title: '4-Day Meghalaya Itinerary', slug: '4-day-meghalaya-itinerary', plan: ['Day 1: Arrive Shillong, explore city', 'Day 2: Cherrapunji — waterfalls & caves', 'Day 3: Dawki & Mawlynnong', 'Day 4: Laitlum Canyon & departure'] },
    { days: '6', title: '6-Day Meghalaya Itinerary', slug: '6-day-meghalaya-itinerary', plan: ['Day 1: Arrive Shillong, Ward\'s Lake, cafés', 'Day 2: Shillong Peak, Elephant Falls', 'Day 3: Cherrapunji full day', 'Day 4: Dawki & Mawlynnong', 'Day 5: Nongjrong & living root bridge', 'Day 6: Shopping & departure'] },
    { days: '8', title: '8-Day Meghalaya Itinerary', slug: '8-day-meghalaya-itinerary', plan: ['Day 1: Arrive Shillong', 'Day 2: Shillong sightseeing', 'Day 3-4: Cherrapunji (2 days)', 'Day 5: Dawki & Mawlynnong', 'Day 6: Nongjrong & root bridges', 'Day 7: Krang Suri & Phe Phe Falls', 'Day 8: Departure'] },
    { days: '2', title: 'Weekend Meghalaya Trip', slug: 'weekend-meghalaya-trip', plan: ['Day 1: Fly to Shillong, afternoon city tour', 'Day 2: Cherrapunji day trip, evening departure'] },
    { days: '10', title: '10-Day Meghalaya Itinerary', slug: '10-day-meghalaya-itinerary', plan: ['Day 1-2: Shillong exploration', 'Day 3-4: Cherrapunji deep dive', 'Day 5: Dawki & Mawlynnong', 'Day 6-7: Nongjrong & offbeat treks', 'Day 8: Krang Suri & caves', 'Day 9: Jaintia Hills', 'Day 10: Departure'] },
  ].map(it => mkPage(it.slug, 'itineraries', 'TouristTrip',
    `${it.title} 2026 — Day-by-Day Guide | XTSY`,
    `Perfect ${it.days}-day Meghalaya itinerary. Day-by-day plan, budget tips, best places. Plan your ${it.days}-day Meghalaya trip with XTSY.`,
    it.title, `Plan the perfect ${it.days}-day Meghalaya trip with this detailed day-by-day itinerary. Covers the best attractions, transport, accommodation, and budget tips.`,
    [
      { heading: 'Day-by-Day Plan', content: `Your ${it.days}-day Meghalaya itinerary:`, listItems: it.plan },
      { heading: 'Where to Stay', content: `Base yourself at XTSY Travellers Hostel in Shillong. Dorms from ₹499, private rooms from ₹1,499. Central location for all day trips.` },
      { heading: 'Budget Estimate', content: `Approximate ${it.days}-day budget:`, listItems: [`Accommodation: ₹${parseInt(it.days) * 500}-${parseInt(it.days) * 1500}`, `Food: ₹${parseInt(it.days) * 400}-${parseInt(it.days) * 800}`, `Transport: ₹${parseInt(it.days) * 500}-${parseInt(it.days) * 1500}`, `Activities: ₹${parseInt(it.days) * 200}-${parseInt(it.days) * 500}`, `Total: ₹${parseInt(it.days) * 1600}-${parseInt(it.days) * 4300}`] },
    ],
    [
      { question: `Is ${it.days} days enough for Meghalaya?`, answer: `${parseInt(it.days) >= 5 ? 'Yes, ' + it.days + ' days is a great duration to cover major attractions comfortably.' : it.days + ' days is a short trip but covers the highlights. For a more relaxed pace, consider 5-7 days.'}` },
    ],
    ['meghalaya-tour-package', 'shillong-tour-package', 'solo-trip-meghalaya'],
    [`${it.days} day meghalaya itinerary`, `${it.days} day meghalaya trip`, `meghalaya ${it.days} days`, `meghalaya itinerary ${it.days} days`],
    'Book This Trip', waLink(`Hi, I want to plan a ${it.days}-day Meghalaya trip`)
  )),
];

// ============================================================================
// LONG-TAIL — DESTINATION COMBOS (8)
// ============================================================================
const destinationComboPages: SEOPageData[] = [
  mkPage('shillong-to-cherrapunji-road-trip', 'travel-guides', 'TravelGuide',
    'Shillong to Cherrapunji Road Trip Guide 2026 | XTSY', 'Complete Shillong to Cherrapunji road trip guide. Route, stops, waterfalls, caves, tips. 54 km scenic drive through Meghalaya.',
    'Shillong to Cherrapunji Road Trip', 'The Shillong to Cherrapunji road trip is one of India\'s most scenic drives — 54 km through cloud forests, past stunning viewpoints, to the wettest place on earth.',
    [
      { heading: 'Route & Distance', content: '54 km from Shillong to Cherrapunji via NH6:', listItems: ['Duration: 1.5-2 hours', 'Road condition: Good, mostly paved', 'Elevation: 1,496m (Shillong) to 1,484m (Cherrapunji)', 'Multiple viewpoints along the way', 'Fuel up before leaving Shillong'] },
      { heading: 'Must-Stop Points', content: 'Don\'t miss these stops:', listItems: ['Mawkdok Dympep Valley View', 'Nohkalikai Falls (tallest in India)', 'Seven Sisters Falls viewpoint', 'Mawsmai Cave', 'Nohsngithiang Falls', 'Double Decker Root Bridge'] },
    ],
    [
      { question: 'Can I do Cherrapunji as a day trip from Shillong?', answer: 'Yes! A day trip covers the major viewpoints and waterfalls. Start early (7 AM) and return by 6 PM. Rent a car from XTSY for flexibility.' },
    ],
    ['cherrapunji-travel-guide', 'car-rental-shillong', 'meghalaya-tour-package'],
    ['shillong to cherrapunji', 'shillong to cherrapunji road trip', 'cherrapunji from shillong', 'shillong cherrapunji distance']
  ),

  mkPage('dawki-to-mawlynnong-guide', 'travel-guides', 'TravelGuide',
    'Dawki to Mawlynnong Day Trip Guide 2026 | XTSY', 'Combine Dawki and Mawlynnong in one day trip from Shillong. Crystal river, cleanest village, root bridge. Complete guide by XTSY.',
    'Dawki to Mawlynnong Day Trip Guide', 'Combine two of Meghalaya\'s top attractions in one epic day trip — Dawki\'s crystal-clear river and Mawlynnong, Asia\'s cleanest village.',
    [
      { heading: 'Route Plan', content: 'Optimal day trip route from Shillong:', listItems: ['Shillong → Dawki: 82 km, 2.5-3 hrs', 'Dawki → Mawlynnong: 30 km, 45 min', 'Mawlynnong → Shillong: 90 km, 2.5 hrs', 'Total driving: ~6 hrs', 'Sightseeing time: 4-5 hrs'] },
      { heading: 'What to See', content: 'Highlights of both destinations:', listItems: ['Dawki: Umngot River boating (₹800/boat)', 'Dawki: India-Bangladesh border viewpoint', 'Mawlynnong: Asia\'s cleanest village walk', 'Mawlynnong: Living root bridge', 'Mawlynnong: Bangladesh viewpoint from tree house'] },
    ],
    [
      { question: 'Can I combine Dawki and Mawlynnong in one day?', answer: 'Yes! This is the most popular combo day trip from Shillong. Start early (6 AM) for the best experience. Book with XTSY for a hassle-free trip.' },
    ],
    ['dawki-travel-guide', 'homestay-in-mawlynnong', 'meghalaya-tour-package'],
    ['dawki to mawlynnong', 'dawki mawlynnong day trip', 'dawki and mawlynnong from shillong', 'dawki mawlynnong combo']
  ),

  mkPage('guwahati-to-meghalaya-road-trip', 'travel-guides', 'TravelGuide',
    'Guwahati to Meghalaya Road Trip Guide 2026 | XTSY', 'Plan your Guwahati to Meghalaya road trip. Routes, stops, places to visit, driving tips. Self-drive or guided tours by XTSY.',
    'Guwahati to Meghalaya Road Trip', 'Start your Meghalaya adventure from Guwahati — gateway to the Northeast. This guide covers routes, pit stops, and the best way to explore Meghalaya by road.',
    [
      { heading: 'Route Options', content: 'Two main routes to explore:', listItems: ['Guwahati → Shillong: 98 km via NH6 (2.5 hrs)', 'Guwahati → Tura (West Garo Hills): 220 km (5 hrs)', 'Scenic stop: Umiam Lake at km 78', 'Both routes are well-maintained highways'] },
      { heading: 'Road Trip Itinerary', content: 'Recommended 5-day road trip:', listItems: ['Day 1: Guwahati → Shillong (stay at XTSY)', 'Day 2: Shillong sightseeing', 'Day 3: Cherrapunji day trip', 'Day 4: Dawki & Mawlynnong', 'Day 5: Return to Guwahati'] },
    ],
    [
      { question: 'Is the Guwahati to Shillong road safe?', answer: 'Yes, NH6 is well-maintained and safe. Avoid night driving due to fog. The drive is scenic and enjoyable, especially around Umiam Lake.' },
    ],
    ['self-drive-car-guwahati', 'guwahati-to-shillong-transport', 'meghalaya-tour-package'],
    ['guwahati to meghalaya road trip', 'guwahati meghalaya trip', 'road trip meghalaya', 'drive from guwahati to shillong']
  ),

  mkPage('shillong-to-dawki-trip', 'travel-guides', 'TravelGuide',
    'Shillong to Dawki Trip Guide 2026 — XTSY', 'Shillong to Dawki trip guide. Distance, route, best time, boating, camping. Crystal clear Umngot River. Plan with XTSY.',
    'Shillong to Dawki Trip Guide', 'The journey from Shillong to Dawki takes you to one of India\'s most Instagram-worthy destinations — the crystal-clear Umngot River where boats appear to float on air.',
    [
      { heading: 'Journey Details', content: 'Route information:', listItems: ['Distance: 82 km from Shillong', 'Duration: 2.5-3 hours by car', 'Road condition: Good, scenic drive', 'Best time: October-April (clear water)', 'Start early to avoid crowds'] },
      { heading: 'Things to Do in Dawki', content: 'Must-do activities:', listItems: ['Boating on Umngot River (₹800/boat)', 'Photography of crystal-clear water', 'Visit India-Bangladesh border', 'Cliff jumping (for adventurous)', 'Camping by the river (seasonal)'] },
    ],
    [
      { question: 'When is the best time to visit Dawki?', answer: 'October to April offers the clearest water and best boating experience. Monsoon (June-September) makes the water murky but the surrounding landscape is incredibly green.' },
    ],
    ['dawki-travel-guide', 'dawki-to-mawlynnong-guide', 'car-rental-shillong'],
    ['shillong to dawki', 'dawki from shillong', 'shillong dawki trip', 'dawki river trip']
  ),

  mkPage('shillong-to-nongjrong', 'travel-guides', 'TravelGuide',
    'Shillong to Nongjrong Trip Guide 2026 | XTSY', 'Shillong to Nongjrong travel guide. Distance, route, trek, sunrise viewpoint, root bridge. Offbeat Meghalaya gem. Book with XTSY.',
    'Shillong to Nongjrong Guide', 'Nongjrong is Meghalaya\'s best-kept secret — a remote village with a stunning sunrise viewpoint and living root bridge, just 65 km from Shillong.',
    [
      { heading: 'Getting There', content: 'Route from Shillong:', listItems: ['Distance: 65 km, 2-2.5 hours', 'Last stretch requires 4x4 vehicle', 'Trek of 30-45 minutes to village', 'Guide recommended for the trail', 'Book with XTSY for hassle-free trip'] },
      { heading: 'What to Expect', content: 'Nongjrong highlights:', listItems: ['Spectacular sunrise viewpoint', 'Living root bridge', 'Authentic Khasi village experience', 'Waterfalls and swimming spots', 'Zero tourists on weekdays'] },
    ],
    [
      { question: 'Is Nongjrong trek difficult?', answer: 'The trek is moderate — about 30-45 minutes downhill to the village. The return uphill is more challenging. Basic fitness is sufficient.' },
    ],
    ['nongjrong-tour-package', 'offbeat-meghalaya', 'meghalaya-tour-package'],
    ['shillong to nongjrong', 'nongjrong from shillong', 'nongjrong trek', 'nongjrong village meghalaya']
  ),

  mkPage('how-to-reach-shillong', 'travel-guides', 'TravelGuide',
    'How to Reach Shillong 2026 — By Air, Road, Rail', 'Complete guide on how to reach Shillong. By flight, train, bus, taxi from Delhi, Kolkata, Guwahati. Transport options & costs by XTSY.',
    'How to Reach Shillong', 'Planning your journey to Shillong? Here\'s a comprehensive guide covering all transport options from major Indian cities — by air, rail, and road.',
    [
      { heading: 'By Air', content: 'Nearest airports:', listItems: ['Shillong Airport (SHL): 30 km, limited flights', 'Guwahati Airport (GAU): 126 km, well-connected', 'Flights from Delhi, Kolkata, Mumbai to Guwahati', 'Then taxi/bus to Shillong (2.5-3 hrs)'] },
      { heading: 'By Train', content: 'Nearest railway station:', listItems: ['Guwahati Railway Station — well-connected', 'Trains from Delhi (28 hrs), Kolkata (18 hrs)', 'Then shared taxi to Shillong (₹500, 2.5 hrs)'] },
      { heading: 'By Road', content: 'Driving to Shillong:', listItems: ['From Guwahati: 98 km via NH6 (2.5 hrs)', 'From Siliguri: 430 km (10-12 hrs)', 'From Kolkata: 1,100 km (22-24 hrs)', 'Self-drive cars available from XTSY'] },
    ],
    [
      { question: 'What is the cheapest way to reach Shillong?', answer: 'Fly to Guwahati (cheapest flights from Delhi ~₹3,000) then take a shared Sumo taxi (₹500) to Shillong. Total travel time: about 5-6 hours.' },
    ],
    ['guwahati-to-shillong-transport', 'self-drive-car-guwahati', 'car-rental-guwahati'],
    ['how to reach shillong', 'reach shillong from delhi', 'shillong transport', 'flights to shillong', 'train to shillong']
  ),

  mkPage('how-to-reach-cherrapunji', 'travel-guides', 'TravelGuide',
    'How to Reach Cherrapunji 2026 — From Shillong & More', 'How to reach Cherrapunji from Shillong, Guwahati. Distance, route, transport options, tips. Plan your Cherrapunji trip with XTSY.',
    'How to Reach Cherrapunji', 'Cherrapunji (Sohra) is Meghalaya\'s most popular destination. Here\'s your complete guide to reaching the wettest place on earth from Shillong, Guwahati, and other cities.',
    [
      { heading: 'From Shillong', content: 'Most common route:', listItems: ['Distance: 54 km, 1.5-2 hours', 'Route: Shillong → Mawkdok → Cherrapunji', 'Shared taxis from Bara Bazaar', 'Private taxi: ₹2,000-2,500', 'Self-drive: rent from XTSY'] },
      { heading: 'From Guwahati', content: 'Via Shillong:', listItems: ['Total distance: 152 km', 'Duration: 4-5 hours', 'Option 1: Taxi to Shillong + shared taxi', 'Option 2: Direct hired car ₹4,000-5,000', 'Option 3: Self-drive from XTSY Guwahati'] },
    ],
    [
      { question: 'Can I visit Cherrapunji in one day from Shillong?', answer: 'Yes! A day trip from Shillong is the most popular way to visit. Start early (7 AM), cover main viewpoints and waterfalls, return by 6 PM. Book with XTSY for guided trips.' },
    ],
    ['shillong-to-cherrapunji-road-trip', 'cherrapunji-travel-guide', 'car-rental-shillong'],
    ['how to reach cherrapunji', 'cherrapunji from shillong', 'shillong to cherrapunji distance', 'reach cherrapunji from guwahati']
  ),

  mkPage('how-to-reach-dawki', 'travel-guides', 'TravelGuide',
    'How to Reach Dawki 2026 — Crystal River Guide | XTSY', 'How to reach Dawki from Shillong & Guwahati. Distance, transport, best time, boating tips. Complete Dawki travel guide by XTSY.',
    'How to Reach Dawki', 'Dawki and its crystal-clear Umngot River is a must-visit in Meghalaya. Here\'s how to reach this stunning destination from Shillong and Guwahati.',
    [
      { heading: 'From Shillong', content: 'Route details:', listItems: ['Distance: 82 km, 2.5-3 hours', 'Route: Shillong → Jowai → Dawki', 'Private taxi: ₹3,000-3,500', 'Self-drive recommended for flexibility', 'Combine with Mawlynnong (30 km from Dawki)'] },
      { heading: 'Tips for Dawki', content: 'Make the most of your visit:', listItems: ['Best months: October to April', 'Arrive before 10 AM for best water clarity', 'Boat ride: ₹800 per boat (shared)', 'Carry snacks — limited food options', 'Camping possible near river (seasonal)'] },
    ],
    [
      { question: 'Can I combine Dawki with other places?', answer: 'Yes! The most popular combo is Dawki + Mawlynnong (Asia\'s cleanest village), just 30 km apart. XTSY offers this as a full-day guided tour.' },
    ],
    ['dawki-travel-guide', 'shillong-to-dawki-trip', 'dawki-to-mawlynnong-guide'],
    ['how to reach dawki', 'dawki from shillong', 'shillong to dawki distance', 'dawki travel guide']
  ),
];

// ============================================================================
// LONG-TAIL — ACTIVITY PAGES (8)
// ============================================================================
const activityExpansionPages: SEOPageData[] = [
  mkPage('kayaking-in-meghalaya', 'activities', 'TouristAttraction',
    'Kayaking in Meghalaya — Dawki & Shnongpdeng | XTSY', 'Kayaking in Meghalaya at Dawki and Shnongpdeng. Crystal clear Umngot River. Beginners welcome. Book adventure with XTSY.',
    'Kayaking in Meghalaya', 'Experience kayaking on crystal-clear rivers in Meghalaya. Dawki and Shnongpdeng offer world-class kayaking on the Umngot River with visibility down to 20 feet.',
    [
      { heading: 'Best Kayaking Spots', content: 'Top locations for kayaking:', listItems: ['Shnongpdeng — calm waters, beginner-friendly', 'Dawki — crystal clear, photo-worthy', 'Umngot River — India\'s clearest river', 'Season: October-April (best visibility)', 'Cost: ₹500-800 per person/hour'] },
      { heading: 'How to Book', content: 'XTSY arranges kayaking trips from Shillong. Day trips include transport, equipment, and guide. Book via WhatsApp for the best rates.' },
    ],
    [
      { question: 'Do I need experience for kayaking in Meghalaya?', answer: 'No! Both Dawki and Shnongpdeng offer beginner-friendly kayaking with calm waters and basic instruction provided.' },
    ],
    ['dawki-travel-guide', 'shillong-to-dawki-trip', 'meghalaya-tour-package'],
    ['kayaking in meghalaya', 'kayaking dawki', 'shnongpdeng kayaking', 'water sports meghalaya']
  ),

  mkPage('camping-in-shnongpdeng', 'activities', 'TouristAttraction',
    'Camping in Shnongpdeng Meghalaya 2026 | XTSY', 'Riverside camping in Shnongpdeng on the Umngot River. Tents, bonfires, water sports. Book your adventure camping with XTSY.',
    'Camping in Shnongpdeng', 'Camp by the crystal-clear Umngot River in Shnongpdeng — one of India\'s most beautiful camping destinations. Wake up to river views and enjoy water sports all day.',
    [
      { heading: 'Camping Details', content: 'What to expect:', listItems: ['Riverside tent camping', 'Bonfire & BBQ dinner', 'Water sports: kayaking, boating, cliff jumping', 'Cost: ₹1,500-2,500/person/night', 'Season: October-April', 'All equipment provided'] },
      { heading: 'Activities Available', content: 'Things to do at camp:', listItems: ['Kayaking on Umngot River', 'Cliff jumping (for adventurous)', 'Swimming in crystal clear water', 'Star gazing at night', 'Short treks to nearby viewpoints'] },
    ],
    [
      { question: 'Is camping in Shnongpdeng safe?', answer: 'Yes, camping is organized by local operators with proper safety measures. XTSY books only verified, safe camping providers.' },
    ],
    ['kayaking-in-meghalaya', 'dawki-travel-guide', 'meghalaya-tour-package'],
    ['camping in shnongpdeng', 'shnongpdeng camping', 'river camping meghalaya', 'umngot river camping']
  ),

  mkPage('birdwatching-meghalaya', 'activities', 'TouristAttraction',
    'Birdwatching in Meghalaya 2026 — Species Guide | XTSY', 'Birdwatching in Meghalaya. 400+ species including rare hornbills. Best birding spots, season guide. Plan your birding trip with XTSY.',
    'Birdwatching in Meghalaya', 'Meghalaya is a birdwatcher\'s paradise with 400+ species including rare hornbills, laughingthrushes, and wren-babblers. Discover the best birding spots and seasons.',
    [
      { heading: 'Top Birding Spots', content: 'Best locations for birdwatching:', listItems: ['Balpakram National Park — rare species', 'Nongkhyllem Wildlife Sanctuary — easy access', 'Mawphlang Sacred Grove — endemic species', 'Cherrapunji — cloud forest species', 'Upper Shillong — easy city birding'] },
      { heading: 'Notable Species', content: 'Birds to spot in Meghalaya:', listItems: ['Great Indian Hornbill', 'Rufous-necked Hornbill', 'Mrs. Hume\'s Pheasant', 'Beautiful Nuthatch', 'Chestnut-backed Laughingthrush'] },
    ],
    [
      { question: 'When is the best season for birdwatching in Meghalaya?', answer: 'November to March is the best birding season. Many species are active during winter, and migratory birds add to the diversity.' },
    ],
    ['offbeat-meghalaya', 'meghalaya-backpacking-guide'],
    ['birdwatching meghalaya', 'birding meghalaya', 'birds of meghalaya', 'hornbill meghalaya']
  ),

  mkPage('fishing-in-dawki', 'activities', 'TouristAttraction',
    'Fishing in Dawki Meghalaya 2026 — Guide | XTSY', 'Fishing in Dawki on the crystal-clear Umngot River. Catch mahseer, trout. Permits, seasons, tips. Plan fishing trips with XTSY.',
    'Fishing in Dawki', 'The crystal-clear waters of Dawki\'s Umngot River offer unique angling experiences. Fish for mahseer in one of India\'s clearest rivers.',
    [
      { heading: 'Fishing Details', content: 'What you need to know:', listItems: ['Best spot: Shnongpdeng & Dawki river', 'Species: Mahseer, Trout', 'Season: October-March', 'Local permits may be required', 'Equipment rental available locally', 'Catch-and-release encouraged'] },
    ],
    [
      { question: 'Do I need a permit to fish in Dawki?', answer: 'Local fishing permits may be required. XTSY can arrange permits and guided fishing trips through local contacts.' },
    ],
    ['dawki-travel-guide', 'camping-in-shnongpdeng', 'kayaking-in-meghalaya'],
    ['fishing in dawki', 'dawki fishing', 'meghalaya fishing', 'umngot river fishing', 'angling meghalaya']
  ),

  mkPage('rock-climbing-meghalaya', 'activities', 'TouristAttraction',
    'Rock Climbing in Meghalaya 2026 — Routes & Guide', 'Rock climbing in Meghalaya. Natural limestone cliffs, bouldering spots. Beginner to advanced routes. Adventure sports with XTSY.',
    'Rock Climbing in Meghalaya', 'Meghalaya\'s limestone cliffs and boulder-strewn landscapes offer excellent rock climbing opportunities for beginners and experienced climbers alike.',
    [
      { heading: 'Climbing Spots', content: 'Best locations:', listItems: ['Laitlum Canyon — scenic cliff faces', 'Mawryngkhang — bamboo bridge & rocks', 'Krem Mawmluh area — limestone walls', 'Shnongpdeng — cliff jumping spots', 'Difficulty: Beginner to intermediate'] },
    ],
    [
      { question: 'Is rock climbing popular in Meghalaya?', answer: 'Growing! Meghalaya\'s limestone terrain is ideal for climbing. While organized climbing is still developing, the natural formations offer exciting opportunities.' },
    ],
    ['kayaking-in-meghalaya', 'offbeat-meghalaya'],
    ['rock climbing meghalaya', 'climbing meghalaya', 'adventure sports meghalaya', 'bouldering meghalaya']
  ),

  mkPage('zip-lining-meghalaya', 'activities', 'TouristAttraction',
    'Zip Lining in Meghalaya 2026 — Adventure Activity', 'Zip lining in Meghalaya over valleys and forests. Thrilling adventure activity in the hills. Book adventure sports with XTSY.',
    'Zip Lining in Meghalaya', 'Soar over Meghalaya\'s stunning valleys with zip lining — one of the most thrilling adventure activities available in the state.',
    [
      { heading: 'Zip Line Experiences', content: 'Where to zip line:', listItems: ['Mawkdok Valley — longest zipline in Meghalaya', 'Distance: up to 1.2 km', 'Height: up to 300m above valley', 'Cost: ₹500-1,500 per ride', 'Safety equipment provided', 'No experience needed'] },
    ],
    [
      { question: 'Is zip lining safe in Meghalaya?', answer: 'Yes, certified operators use proper safety equipment including harness, helmet, and double safety lines. Weight limits typically 40-100 kg.' },
    ],
    ['kayaking-in-meghalaya', 'meghalaya-tour-package'],
    ['zip lining meghalaya', 'zipline meghalaya', 'adventure sports meghalaya', 'mawkdok zipline']
  ),
];

// ============================================================================
// FOOD & DINING (4)
// ============================================================================
const foodPages: SEOPageData[] = [
  mkPage('best-restaurants-shillong', 'restaurants', 'Restaurant',
    'Best Restaurants in Shillong 2026 — Top Dining Guide', 'Discover the best restaurants in Shillong. From Khasi cuisine to continental. Cafés, street food, fine dining. Food guide by XTSY.',
    'Best Restaurants in Shillong', 'Shillong\'s food scene is diverse and exciting — from authentic Khasi cuisine to global flavors. Here\'s your guide to the best restaurants and eateries in the city.',
    [
      { heading: 'Top Restaurants', content: 'Must-visit dining spots:', listItems: ['TAB Bistro (XTSY) — Multi-cuisine, in-hostel dining', 'Café Shillong — Coffee & snacks, live music', 'Dylan\'s Café — Continental, cozy ambiance', 'ML 05 Café — Best coffee in town', 'City Hut Dhaba — North Indian', 'Jadoh stalls at Iewduh — Authentic Khasi'] },
      { heading: 'Khasi Cuisine Must-Try', content: 'Traditional dishes to try:', listItems: ['Jadoh — Khasi rice & pork', 'Tungrymbai — fermented soybean curry', 'Doh Khlieh — spiced pork salad', 'Ki Kpu — Khasi blood sausage', 'Kwai — betel nut (local custom)'] },
    ],
    [
      { question: 'Where to eat near XTSY?', answer: 'TAB Bistro, our in-house restaurant, serves breakfast, lunch, and dinner. For variety, Police Bazaar (10 min away) has dozens of restaurants.' },
    ],
    ['shillong-vacation-planner', 'budget-stay-shillong'],
    ['best restaurants shillong', 'restaurants in shillong', 'where to eat shillong', 'shillong food guide'],
    'Dine at TAB Bistro', '/tab-bistro'
  ),

  mkPage('street-food-police-bazar', 'restaurants', 'Restaurant',
    'Street Food in Police Bazar Shillong — Guide | XTSY', 'Best street food in Police Bazar Shillong. Momos, jadoh, thukpa, kwai. Complete food walk guide. Stay at XTSY, eat everywhere.',
    'Street Food in Police Bazar', 'Police Bazaar is Shillong\'s street food paradise. From steaming momos to authentic Khasi jadoh, discover the best street food in the heart of the city.',
    [
      { heading: 'Must-Try Street Food', content: 'Best bites in Police Bazaar:', listItems: ['Momos — steamed & fried, everywhere', 'Jadoh — rice & meat from roadside stalls', 'Thukpa — Tibetan noodle soup', 'Chowmein — Shillong-style fried noodles', 'Pukhlein — Khasi fried sweet bread', 'Egg rolls & shawarma'] },
      { heading: 'Budget Street Food Walk', content: 'A full food walk costs about ₹200-300. Start at Iewduh (Bara Bazaar) for authentic Khasi food, then walk to Police Bazaar for momos and café culture.' },
    ],
    [
      { question: 'Is street food safe in Shillong?', answer: 'Generally yes! Stick to busy stalls with high turnover. Police Bazaar and Iewduh market have the best options with fresh ingredients.' },
    ],
    ['best-restaurants-shillong', 'shillong-vacation-planner'],
    ['street food police bazar', 'police bazaar food', 'shillong street food', 'food in shillong']
  ),

  mkPage('khasi-food-guide', 'restaurants', 'Restaurant',
    'Khasi Food Guide — Traditional Meghalaya Cuisine', 'Complete guide to Khasi food. Traditional dishes, where to eat, recipes. Experience authentic Meghalaya cuisine with XTSY.',
    'Khasi Food Guide — Meghalaya Cuisine', 'Khasi cuisine is one of India\'s most underrated food cultures. Rich in flavors, heavy on meat, and full of fermented goodness — discover the food of Meghalaya.',
    [
      { heading: 'Essential Khasi Dishes', content: 'Must-try traditional dishes:', listItems: ['Jadoh — signature Khasi rice with pork/chicken', 'Tungrymbai — fermented soybean curry', 'Doh Khlieh — spiced minced pork salad', 'Doh Jem — sweet pork with sesame', 'Nakham Bitchi — fermented fish chutney', 'Ki Kpu — blood sausage'] },
      { heading: 'Where to Eat Khasi Food', content: 'Best places for authentic Khasi cuisine:', listItems: ['Iewduh Market (Bara Bazaar) — street stalls', 'Local restaurants in Laitumkhrah', 'TAB Bistro at XTSY — fusion Khasi dishes', 'Village homestays for authentic experience'] },
    ],
    [
      { question: 'Is Khasi food vegetarian-friendly?', answer: 'Khasi cuisine is predominantly non-vegetarian. Vegetarians can enjoy rice dishes, bamboo shoot preparations, and local greens. TAB Bistro at XTSY offers both veg and non-veg options.' },
    ],
    ['best-restaurants-shillong', 'street-food-police-bazar'],
    ['khasi food', 'khasi cuisine', 'meghalaya food', 'traditional food meghalaya', 'jadoh recipe']
  ),

  mkPage('cafes-in-shillong', 'restaurants', 'Restaurant',
    '12 Best Cafés in Shillong (2026): Prices & Picks', 'Our 2026 shortlist of 12 Shillong cafés — ML 05, Dylan\'s, Café Shillong, TAB Bistro. Coffee ₹100–220, timings, WiFi and the best spots for live music.',
    'Best Cafés in Shillong', 'Twelve cafés worth your morning in Shillong, checked for 2026 — what a flat white actually costs, which ones have plug points and WiFi that holds, and where live music happens on weekends. Most sit in Laitumkhrah, Police Bazar or Laban; TAB Bistro by XTSY is the forest-side option in New Shillong Township.',
    [
      { heading: '12 Best Cafés in Shillong (2026)', content: 'Names, neighbourhood and what to order:', listItems: ['ML 05 Café, Laitumkhrah — specialty pour-over & espresso, ₹150–220', 'Dylan\'s Café, Laitumkhrah — Dylan memorabilia, live music Fri–Sun, ₹120–200', 'Café Shillong, Laitumkhrah — the original live-music room, book a table after 7 PM', 'Café Shillong Heritage, Laban — colonial bungalow setting, all-day breakfast', 'Cloud 9, Upper Shillong — valley views, best in clear October weather', 'TAB Bistro by XTSY, New Shillong Township — forest-side café, coffee ₹100–180, 9 AM–10:30 PM', 'Kavya Café, Police Bazar — cheap filter coffee and quick breakfasts under ₹150', 'Dejavu Café, Police Bazar — late-evening desserts and shakes', 'Lamplight Café, Laitumkhrah — quiet, plug points, good for laptop work', 'The Evening Club, Laban — sundowner coffee and Khasi snacks', 'Trattoria-adjacent bakeries, Police Bazar — jadoh-and-coffee style local breakfasts', 'Cafés along Ward\'s Lake Road — walk-in stops between sightseeing'] },
      { heading: 'What It Costs & When to Go (2026)', content: 'Practical numbers before you set out:', listItems: ['Cappuccino/latte: ₹120–180; specialty pour-over: ₹180–220', 'Breakfast plate with coffee: ₹250–400 for two', 'Most cafés open 9–10 AM and close 8–9 PM; TAB Bistro runs to 10:30 PM', 'Live music: Friday to Sunday evenings, mainly in Laitumkhrah', 'WiFi is reliable in Laitumkhrah cafés; carry a hotspot for Upper Shillong', 'Sunday mornings are slow — many Police Bazar spots open after 11 AM'] },
      { heading: 'Café-Hopping From Your Stay', content: 'Backpackers usually base themselves near the café belt. XTSY Travellers Hostel puts dorm beds from ₹369 per night within an easy ride of Laitumkhrah and Police Bazar, with TAB Bistro on site for late coffee — use the booking link above to check tonight\'s availability.', listItems: ['Laitumkhrah: 4–5 cafés walkable in one evening', 'Police Bazar: cheapest breakfasts, busiest after 11 AM', 'Upper Shillong: pair Cloud 9 with Elephant Falls', 'New Shillong Township: TAB Bistro, quietest and latest-closing'] },
    ],
    [
      { question: 'Which is the best café in Shillong for coffee?', answer: 'For specialty coffee, ML 05 Café in Laitumkhrah is the strongest pick (pour-over and espresso, ₹150–220). For a café with live music, Café Shillong and Dylan\'s Café — both in Laitumkhrah — are the long-running favourites.' },
      { question: 'How much does coffee cost in Shillong cafés?', answer: 'Expect ₹120–180 for a cappuccino or latte and ₹180–220 for specialty pour-over. A breakfast plate with coffee for two runs about ₹250–400.' },
      { question: 'Which Shillong cafés are good for working on a laptop?', answer: 'Laitumkhrah cafés such as ML 05 and Lamplight have the most reliable WiFi and plug points. TAB Bistro by XTSY in New Shillong Township is quieter and stays open until 10:30 PM.' },
      { question: 'Does XTSY have a café?', answer: 'Yes — TAB Bistro by XTSY is our in-house café and restaurant serving coffee from ₹100, all-day breakfast and desserts, open 9 AM to 10:30 PM to guests and locals alike.' },
    ],
    ['best-restaurants-shillong', 'restaurant-in-shillong', 'shillong-vacation-planner'],
    ['cafes in shillong', 'best cafe shillong', 'coffee shillong', 'shillong cafe culture']
  ),

];

// ============================================================================
// WEDDING & EVENT PAGES (3)
// ============================================================================
const weddingExpansionPages: SEOPageData[] = [
  mkPage('outdoor-venue-shillong', 'weddings', 'EventVenue',
    'Outdoor Venue in Shillong — Events & Weddings | XTSY', 'Book outdoor event venues in Shillong. Weddings, corporate events, parties in scenic mountain settings. Plan with XTSY.',
    'Outdoor Venues in Shillong', 'Shillong\'s natural beauty makes it perfect for outdoor events. From mountain-view weddings to corporate retreats, find the ideal outdoor venue.',
    [
      { heading: 'XTSY Event Spaces', content: 'Our outdoor areas:', listItems: ['Forest-view terrace — up to 50 guests', 'Bonfire area — intimate gatherings', 'Garden space — cocktail events', 'TAB Bistro — catered events', 'Custom décor arrangements available'] },
    ],
    [
      { question: 'Can XTSY host outdoor events?', answer: 'Yes! Our property has multiple outdoor spaces perfect for intimate events, from terrace gatherings to bonfire celebrations. We handle catering through TAB Bistro.' },
    ],
    ['destination-wedding-shillong', 'group-booking-shillong'],
    ['outdoor venue shillong', 'event venue shillong', 'party venue shillong', 'outdoor event space meghalaya']
  ),

  mkPage('pre-wedding-shoot-meghalaya', 'weddings', 'EventVenue',
    'Pre-Wedding Shoot in Meghalaya — Best Locations 2026', 'Best pre-wedding photoshoot locations in Meghalaya. Dawki river, waterfalls, root bridges. Photography packages by XTSY.',
    'Pre-Wedding Shoot in Meghalaya', 'Meghalaya offers India\'s most stunning pre-wedding shoot locations — from crystal-clear rivers to misty waterfalls and living root bridges.',
    [
      { heading: 'Top Shoot Locations', content: 'Instagram-worthy locations:', listItems: ['Dawki — crystal clear river backdrop', 'Laitlum Canyon — dramatic cliffs', 'Living Root Bridges — unique natural arch', 'Nohkalikai Falls — tallest waterfall', 'XTSY 270° Glasshouse — panoramic room', 'Cherry blossom avenues (March)'] },
      { heading: 'XTSY Photography Packages', content: 'We connect you with local photographers and arrange:', listItems: ['Location permits & access', 'Transport to shoot locations', 'Accommodation during shoot days', 'Styling consultation', 'Customized shoot itinerary'] },
    ],
    [
      { question: 'What\'s the best season for pre-wedding shoots?', answer: 'October-March offers the best weather and light. March is spectacular with cherry blossoms. Monsoon (June-Sept) is magical but risky due to rain.' },
    ],
    ['destination-wedding-shillong', 'luxury-resorts-for-couples-shillong'],
    ['pre wedding shoot meghalaya', 'pre wedding photoshoot shillong', 'wedding photography meghalaya', 'couple photoshoot meghalaya']
  ),

  mkPage('corporate-retreat-shillong', 'weddings', 'EventVenue',
    'Corporate Retreat in Shillong — Team Offsite | XTSY', 'Plan corporate retreats in Shillong. Team building, offsite meetings, nature activities. Custom packages by XTSY.',
    'Corporate Retreat in Shillong', 'Escape the office and bring your team to Shillong for a rejuvenating corporate retreat. XTSY offers custom packages combining workspace, accommodation, and team activities.',
    [
      { heading: 'Retreat Packages', content: 'What we offer:', listItems: ['Meeting space for 10-30 people', 'Full-property booking option', 'Team building activities & treks', 'Catered meals at TAB Bistro', 'Day trips to waterfalls & rivers', 'Bonfire & social evenings'] },
      { heading: 'Why Shillong', content: 'Ideal for corporate retreats:', listItems: ['Cool weather year-round', 'Peaceful, distraction-free environment', 'Nature-based team activities', 'Good WiFi connectivity', '2.5 hrs from Guwahati airport'] },
    ],
    [
      { question: 'How many people can XTSY accommodate for retreats?', answer: 'We can accommodate up to 30 guests with a mix of dorms and private rooms. For larger groups, we arrange additional accommodation nearby.' },
    ],
    ['group-booking-shillong', 'outdoor-venue-shillong'],
    ['corporate retreat shillong', 'team offsite shillong', 'corporate outing meghalaya', 'team building shillong'],
    'Plan Retreat', waLink('Hi, I want to plan a corporate retreat in Shillong')
  ),
];

// ============================================================================
// HOSPITAL ACCOMMODATION EXPANSION (2)
// ============================================================================
const hospitalExpansionPages: SEOPageData[] = [
  mkPage('hospital-accommodation-shillong', 'hospitals', 'LodgingBusiness',
    'Hospital Accommodation Shillong — Near NEIGRIHMS', 'Affordable accommodation near hospitals in Shillong. Patient attendants & families. From ₹499/night near NEIGRIHMS. Book XTSY.',
    'Hospital Accommodation in Shillong', 'Need accommodation near hospitals in Shillong? XTSY offers affordable stays for patient attendants and families near NEIGRIHMS and other major hospitals.',
    [
      { heading: 'Near NEIGRIHMS', content: 'Accommodation options:', listItems: ['XTSY is 15 min from NEIGRIHMS', 'Dorm beds from ₹499/night', 'Private rooms from ₹1,499/night', 'Weekly/monthly rates available', 'Kitchen access for home cooking', 'Quiet, restful environment'] },
      { heading: 'What We Provide', content: 'Support for hospital visitors:', listItems: ['Flexible check-in/check-out', 'Luggage storage during hospital visits', 'WiFi for staying connected', 'In-house meals at TAB Bistro', 'Local transport assistance'] },
    ],
    [
      { question: 'Is XTSY close to NEIGRIHMS hospital?', answer: 'XTSY is approximately 6 km (15 minutes) from NEIGRIHMS. Auto-rickshaws are easily available between the two locations.' },
    ],
    ['hotel-near-neigrihms-shillong', 'guest-house-neigrihms-shillong', 'budget-stay-shillong'],
    ['hospital accommodation shillong', 'stay near neigrihms', 'accommodation for patients shillong', 'hospital nearby stay shillong']
  ),

  mkPage('patient-attendant-stay-neigrihms', 'hospitals', 'LodgingBusiness',
    'Patient Attendant Stay Near NEIGRIHMS — From ₹499', 'Affordable stays for patient attendants near NEIGRIHMS Shillong. Clean rooms, kitchen, WiFi. Long-stay discounts. Book XTSY.',
    'Patient Attendant Stay Near NEIGRIHMS', 'Looking for affordable accommodation while attending a patient at NEIGRIHMS? XTSY offers clean, comfortable stays with kitchen access and long-stay discounts.',
    [
      { heading: 'Why XTSY for Attendants', content: 'We understand your needs:', listItems: ['Budget beds from ₹499/night', 'Kitchen access for home cooking', 'Quiet environment for rest', 'Flexible booking — extend easily', 'Weekly rates: ₹2,999/week (dorm)', 'Monthly rates available on request'] },
    ],
    [
      { question: 'Do you offer long-stay discounts?', answer: 'Yes! We offer weekly rates starting at ₹2,999 for dorm beds. Monthly rates are available on request — contact us on WhatsApp.' },
    ],
    ['hospital-accommodation-shillong', 'hotel-near-neigrihms-shillong', 'budget-stay-shillong'],
    ['patient attendant stay neigrihms', 'neigrihms patient accommodation', 'stay near neigrihms hospital', 'attendant room neigrihms']
  ),
];

// ============================================================================
// LONG-TAIL — HOW TO REACH PAGES (4)
// ============================================================================
const howToReachPages: SEOPageData[] = [
  mkPage('how-to-reach-meghalaya-from-delhi', 'travel-guides', 'TravelGuide',
    'How to Reach Meghalaya from Delhi 2026 — Best Routes', 'Complete guide on how to reach Meghalaya from Delhi. Flights, trains, buses. Best routes, costs, duration. Plan with XTSY.',
    'How to Reach Meghalaya from Delhi', 'Delhi to Meghalaya is easier than you think. Multiple flight and train options connect India\'s capital to Shillong via Guwahati.',
    [
      { heading: 'Transport Options', content: 'Best ways to travel:', listItems: ['Flight: Delhi → Guwahati (2.5 hrs, ₹3,000-7,000)', 'Then: Guwahati → Shillong (2.5 hrs by taxi)', 'Train: Delhi → Guwahati (28 hrs, ₹500-3,000)', 'Total journey: 5-30 hrs depending on mode'] },
      { heading: 'Cost Breakdown', content: 'Budget estimation:', listItems: ['Budget flight: ₹3,000-5,000', 'Sleeper train: ₹500-800', '3AC train: ₹1,500-2,500', 'Shared taxi Guwahati-Shillong: ₹500', 'Total budget: ₹1,000-5,500 one-way'] },
    ],
    [
      { question: 'What\'s the fastest way from Delhi to Meghalaya?', answer: 'Fly from Delhi to Guwahati (2.5 hours) then take a taxi to Shillong (2.5 hours). Total door-to-door: about 8 hours.' },
    ],
    ['how-to-reach-shillong', 'guwahati-to-shillong-transport'],
    ['delhi to meghalaya', 'how to reach meghalaya from delhi', 'delhi to shillong', 'delhi to guwahati flight']
  ),

  mkPage('how-to-reach-meghalaya-from-kolkata', 'travel-guides', 'TravelGuide',
    'How to Reach Meghalaya from Kolkata 2026 — Guide', 'Kolkata to Meghalaya travel guide. Flights, trains, road options. Best routes & costs. Plan your trip with XTSY.',
    'How to Reach Meghalaya from Kolkata', 'Kolkata is one of the closest metros to Meghalaya. Multiple flights and trains connect the two, making it an easy weekend getaway.',
    [
      { heading: 'Travel Options', content: 'From Kolkata to Meghalaya:', listItems: ['Flight: Kolkata → Guwahati (1.5 hrs, ₹2,500-5,000)', 'Train: Kolkata → Guwahati (18 hrs, ₹400-2,000)', 'Then: Guwahati → Shillong (2.5 hrs)', 'Weekend trip possible (3-4 days)'] },
    ],
    [
      { question: 'Can I do a weekend trip from Kolkata to Meghalaya?', answer: 'Yes! Take a Friday evening flight to Guwahati, taxi to Shillong, explore Saturday-Sunday, return Sunday evening. It\'s a popular weekend getaway.' },
    ],
    ['how-to-reach-shillong', 'weekend-meghalaya-trip'],
    ['kolkata to meghalaya', 'how to reach meghalaya from kolkata', 'kolkata to shillong', 'kolkata to guwahati']
  ),

  mkPage('how-to-reach-meghalaya-from-mumbai', 'travel-guides', 'TravelGuide',
    'How to Reach Meghalaya from Mumbai 2026 — Guide', 'Mumbai to Meghalaya travel guide. Best flights, connections, costs. Plan your Northeast trip from Mumbai with XTSY.',
    'How to Reach Meghalaya from Mumbai', 'Planning a Meghalaya trip from Mumbai? While it\'s a longer journey, direct flights to Guwahati make it very accessible.',
    [
      { heading: 'Getting There', content: 'Mumbai to Meghalaya options:', listItems: ['Direct flight: Mumbai → Guwahati (3.5 hrs, ₹4,000-10,000)', 'Then: Guwahati → Shillong (2.5 hrs)', 'Best airlines: IndiGo, Air India, SpiceJet', 'Advance booking for cheapest fares', 'Total travel time: 8-10 hours'] },
      { heading: 'Trip Planning Tips', content: 'For Mumbai travelers:', listItems: ['Book flights 2-3 months ahead for best rates', 'Plan minimum 5 days for a good experience', 'October-March has the best weather', 'Pack warm clothes — much colder than Mumbai'] },
    ],
    [
      { question: 'Are there direct flights from Mumbai to Shillong?', answer: 'Direct Mumbai-Shillong flights are limited. Most travelers fly to Guwahati (multiple daily flights) then drive 2.5 hours to Shillong.' },
    ],
    ['how-to-reach-shillong', 'meghalaya-tour-package'],
    ['mumbai to meghalaya', 'how to reach meghalaya from mumbai', 'mumbai to shillong', 'mumbai to guwahati flight']
  ),

  mkPage('how-to-reach-meghalaya-from-bangalore', 'travel-guides', 'TravelGuide',
    'How to Reach Meghalaya from Bangalore 2026 — Guide', 'Bangalore to Meghalaya travel guide. Flights, costs, best routes. Plan your Northeast getaway from Bangalore with XTSY.',
    'How to Reach Meghalaya from Bangalore', 'Escape the Bangalore heat and head to Meghalaya\'s cool hills. Direct flights to Guwahati connect India\'s tech hub to the Northeast.',
    [
      { heading: 'Travel Options', content: 'Bangalore to Meghalaya:', listItems: ['Flight: Bangalore → Guwahati (3 hrs, ₹4,000-8,000)', 'Then: Guwahati → Shillong (2.5 hrs)', 'Multiple daily flights available', 'Early morning flights recommended', 'Total journey: 8-9 hours'] },
    ],
    [
      { question: 'How many days should I plan for Meghalaya from Bangalore?', answer: 'Plan at least 5-6 days including travel. This gives you 3-4 full days to explore Shillong, Cherrapunji, and Dawki at a comfortable pace.' },
    ],
    ['how-to-reach-shillong', 'meghalaya-tour-package'],
    ['bangalore to meghalaya', 'how to reach meghalaya from bangalore', 'bangalore to shillong', 'bangalore to guwahati flight']
  ),
];

// ============================================================================
// EXPORT ALL EXPANSION PAGES
// ============================================================================
export const EXPANSION_SEO_PAGES: SEOPageData[] = [
  ...competitorPages,
  ...transportPages,
  ...travelAgencyPages,
  ...experiencePages,
  ...accommodationExpansionPages,
  ...seasonalPages,
  ...itineraryExpansionPages,
  ...destinationComboPages,
  ...activityExpansionPages,
  ...foodPages,
  ...weddingExpansionPages,
  ...hospitalExpansionPages,
  ...howToReachPages,
];
