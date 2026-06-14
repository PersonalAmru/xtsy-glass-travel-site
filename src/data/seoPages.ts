// Programmatic SEO Page Registry — 1,400+ keyword-targeted pages
import { EXPANSION_SEO_PAGES } from './seoPagesExpansion';
import { PILLAR_PAGES } from './seoPillarPages';
import { DESTINATION_PAGES } from './seoDestinationPages';
import { LAST_MINUTE_SEO_PAGES } from './seoLastMinutePages';
import { ROUTE_SEO_PAGES } from './seoPagesRoutes';
import { INTENT_STAY_SEO_PAGES } from './seoPagesIntent';
import { INSTITUTION_SEO_PAGES } from './seoPagesInstitutions';
import { ACTIVITY_SEO_PAGES } from './seoPagesActivities';
import { DURATION_ITINERARY_SEO_PAGES } from './seoPagesDurations';
import { GLOBAL_NE_SEO_PAGES } from './seoPagesGlobalNE';
import { NE_EXPANSION_SEO_PAGES } from './seoPagesNortheastExpansion';
import { DINING_SEO_PAGES } from './seoPagesDining';
import { DINING_EXPANSION_SEO_PAGES } from './seoPagesDiningExpansion';
import { DINING_SPOKE_PAGES } from './seoPagesDiningSpokes';

export type SEOPageCategory = 
  | 'hostels' | 'hotels' | 'homestays' | 'glamping' | 'accommodation'
  | 'rentals' | 'tours' | 'travel-guides' | 'destinations' | 'attractions'
  | 'itineraries' | 'activities' | 'hospitals' | 'restaurants' | 'weddings'
  | 'transport' | 'competitor-capture' | 'food-dining' | 'seasonal' | 'events' | 'travel-agency'
  | 'group-tours' | 'corporate' | 'workation' | 'themed-trips' | 'road-bike-trips';

export type SchemaType = 
  | 'LodgingBusiness' | 'Hostel' | 'Hotel' | 'TouristAttraction' 
  | 'TravelGuide' | 'Article' | 'TouristTrip' | 'Restaurant'
  | 'EventVenue' | 'LocalBusiness' | 'Product' | 'AutoRental';

export interface SEOFaq {
  question: string;
  answer: string;
}

export interface SEOSection {
  heading: string;
  content: string;
  listItems?: string[];
}

export interface SEOPageData {
  slug: string;
  category: SEOPageCategory;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: SEOSection[];
  faqs: SEOFaq[];
  schemaType: SchemaType;
  relatedSlugs: string[];
  ctaText: string;
  ctaLink: string;
  keywords: string[];
  /** Concise 1–2 sentence answer surfaced as "Quick Answer for Travelers" + Speakable schema */
  quickAnswer?: string;
  /** Optional list of nearby attraction labels for the Nearby Attractions section */
  nearbyAttractions?: string[];
}

// Helper to generate page data efficiently
const hostel = (slug: string, title: string, metaDesc: string, h1: string, intro: string, sections: SEOSection[], faqs: SEOFaq[], related: string[], keywords: string[]): SEOPageData => ({
  slug, category: 'hostels', title, metaDescription: metaDesc, h1, intro, sections, faqs,
  schemaType: 'Hostel', relatedSlugs: related, ctaText: 'Book Your Stay', ctaLink: '/book', keywords
});

const hotel = (slug: string, title: string, metaDesc: string, h1: string, intro: string, sections: SEOSection[], faqs: SEOFaq[], related: string[], keywords: string[]): SEOPageData => ({
  slug, category: 'hotels', title, metaDescription: metaDesc, h1, intro, sections, faqs,
  schemaType: 'Hotel', relatedSlugs: related, ctaText: 'Check Availability', ctaLink: '/book', keywords
});

const homestay = (slug: string, title: string, metaDesc: string, h1: string, intro: string, sections: SEOSection[], faqs: SEOFaq[], related: string[], keywords: string[]): SEOPageData => ({
  slug, category: 'homestays', title, metaDescription: metaDesc, h1, intro, sections, faqs,
  schemaType: 'LodgingBusiness', relatedSlugs: related, ctaText: 'Book Homestay', ctaLink: '/book', keywords
});

const rental = (slug: string, title: string, metaDesc: string, h1: string, intro: string, sections: SEOSection[], faqs: SEOFaq[], related: string[], keywords: string[]): SEOPageData => ({
  slug, category: 'rentals', title, metaDescription: metaDesc, h1, intro, sections, faqs,
  schemaType: 'AutoRental', relatedSlugs: related, ctaText: 'Book Now', ctaLink: 'https://wa.me/918787537633?text=Hi, I need a rental vehicle in Shillong', keywords
});

const tour = (slug: string, title: string, metaDesc: string, h1: string, intro: string, sections: SEOSection[], faqs: SEOFaq[], related: string[], keywords: string[]): SEOPageData => ({
  slug, category: 'tours', title, metaDescription: metaDesc, h1, intro, sections, faqs,
  schemaType: 'TouristTrip', relatedSlugs: related, ctaText: 'Book This Package', ctaLink: 'https://wa.me/918787537633?text=Hi, I am interested in a tour package', keywords
});

const guide = (slug: string, title: string, metaDesc: string, h1: string, intro: string, sections: SEOSection[], faqs: SEOFaq[], related: string[], keywords: string[]): SEOPageData => ({
  slug, category: 'travel-guides', title, metaDescription: metaDesc, h1, intro, sections, faqs,
  schemaType: 'TravelGuide', relatedSlugs: related, ctaText: 'Plan Your Trip', ctaLink: '/tours', keywords
});

const attraction = (slug: string, title: string, metaDesc: string, h1: string, intro: string, sections: SEOSection[], faqs: SEOFaq[], related: string[], keywords: string[]): SEOPageData => ({
  slug, category: 'attractions', title, metaDescription: metaDesc, h1, intro, sections, faqs,
  schemaType: 'TouristAttraction', relatedSlugs: related, ctaText: 'Explore Tours', ctaLink: '/tours', keywords
});

const destination = (slug: string, title: string, metaDesc: string, h1: string, intro: string, sections: SEOSection[], faqs: SEOFaq[], related: string[], keywords: string[]): SEOPageData => ({
  slug, category: 'destinations', title, metaDescription: metaDesc, h1, intro, sections, faqs,
  schemaType: 'TouristAttraction', relatedSlugs: related, ctaText: 'View Packages', ctaLink: '/tours', keywords
});

const itinerary = (slug: string, title: string, metaDesc: string, h1: string, intro: string, sections: SEOSection[], faqs: SEOFaq[], related: string[], keywords: string[]): SEOPageData => ({
  slug, category: 'itineraries', title, metaDescription: metaDesc, h1, intro, sections, faqs,
  schemaType: 'TouristTrip', relatedSlugs: related, ctaText: 'Book This Itinerary', ctaLink: 'https://wa.me/918787537633?text=Hi, I want to plan my Meghalaya trip', keywords
});

const activity = (slug: string, title: string, metaDesc: string, h1: string, intro: string, sections: SEOSection[], faqs: SEOFaq[], related: string[], keywords: string[]): SEOPageData => ({
  slug, category: 'activities', title, metaDescription: metaDesc, h1, intro, sections, faqs,
  schemaType: 'TouristAttraction', relatedSlugs: related, ctaText: 'Book Adventure', ctaLink: '/tours', keywords
});

// ============================================================================
// CATEGORY 1: HOSTELS & BUDGET ACCOMMODATION (40+ pages)
// ============================================================================

const hostelPages: SEOPageData[] = [
  hostel('backpacker-hostel-shillong', 'Best Backpacker Hostel in Shillong 2026 | XTSY', 'Top-rated backpacker hostel in Shillong with dorms from ₹499. Free WiFi, common kitchen, social lounge. Perfect for solo travelers & groups.', 'Best Backpacker Hostel in Shillong', 'Looking for a lively, affordable backpacker hostel in Shillong? XTSY Travellers Hostel is the top-rated hostel for solo travelers, backpackers, and groups exploring Meghalaya. Located in New Shillong Township with easy access to Police Bazaar and all major attractions.',
    [
      { heading: 'Why Backpackers Love XTSY Hostel', content: 'XTSY is designed ground-up for the backpacker community. Our vibrant common areas, fully-equipped kitchen, and social lounge make it the perfect basecamp for exploring Meghalaya.', listItems: ['Mixed & female-only dormitories from ₹499/night', 'High-speed WiFi throughout the property', 'Common kitchen with free tea & coffee', 'Social lounge with board games & Netflix', 'Luggage storage & laundry service', '24/7 reception with local travel advice'] },
      { heading: 'Location & Accessibility', content: 'Situated on Mawdiangdiang Road in New Shillong Township, XTSY is just 10 minutes from Police Bazaar, 15 minutes from Shillong Peak, and serves as the perfect base for day trips to Cherrapunji, Dawki, and Mawlynnong.' },
      { heading: 'Room Types & Pricing', content: 'We offer a range of accommodation to suit every budget:', listItems: ['8-Bed Mixed Dormitory — ₹499/night', '6-Bed Mixed Dormitory — ₹699/night', '4-Bed Female Dormitory — ₹799/night', 'Private Double Room — ₹1,499/night', 'Deluxe Private Room — ₹1,999/night'] },
      { heading: 'Activities & Experiences', content: 'XTSY isn\'t just a place to sleep — it\'s an experience. Join our community events, guided treks, city walks, and bonfire nights. Meet fellow travelers and create memories that last a lifetime.' },
      { heading: 'How to Reach XTSY Hostel', content: 'From Guwahati Airport (SHL/GAU): Take a shared taxi to Shillong (₹500, 2.5 hours) or book a private cab. From Shillong city: Auto-rickshaw from Police Bazaar takes 10 minutes.' },
    ],
    [
      { question: 'Is XTSY a party hostel?', answer: 'XTSY is a social hostel with a vibrant atmosphere. We have a common lounge, bonfire area, and organize social events. However, we maintain quiet hours after 11 PM for guests who want to rest.' },
      { question: 'Can I book a bed in a dormitory?', answer: 'Yes! Individual bed bookings are available in all our dormitories. You can book online or walk in.' },
      { question: 'Is there a female-only dorm?', answer: 'Yes, we have a dedicated 4-bed female-only dormitory with secure lockers and private bathroom.' },
      { question: 'Do you provide meals?', answer: 'TAB Bistro, our in-house restaurant, serves breakfast, lunch, and dinner. We also have a common kitchen for self-cooking.' },
    ],
    ['cheap-hostel-shillong', 'shillong-dormitory', 'budget-stay-shillong', 'hostel-near-police-bazar-shillong'],
    ['backpacker hostel shillong', 'hostel in shillong', 'shillong backpacker hostel', 'best hostel shillong for backpackers']
  ),

  hostel('cheap-hostel-shillong', 'Cheap Hostel in Shillong — Beds from ₹499 | XTSY', 'Cheapest hostel in Shillong with beds from ₹499/night. Clean dorms, free WiFi, hot showers. Best value budget accommodation in Meghalaya.', 'Cheapest Hostel in Shillong — Starting ₹499', 'Find the most affordable hostel stay in Shillong at XTSY Travellers Hostel. With dormitory beds starting at just ₹499 per night, enjoy clean rooms, hot showers, free WiFi, and a social atmosphere without breaking the bank.',
    [
      { heading: 'Budget-Friendly Pricing', content: 'At XTSY, we believe great experiences shouldn\'t cost a fortune. Our competitive pricing makes Shillong accessible to every traveler.', listItems: ['Dorm beds from ₹499/night — the lowest in Shillong', 'No hidden charges — WiFi, hot water included', 'Weekly & monthly discounts available', 'Group booking discounts for 4+ guests'] },
      { heading: 'What You Get for ₹499', content: 'Every bed at XTSY comes with a comfortable mattress, clean linen, personal locker, reading light, charging point, and access to all common facilities including kitchen, lounge, and outdoor areas.' },
      { heading: 'Compare Shillong Budget Stays', content: 'XTSY consistently offers the best value compared to other budget options in Shillong. While most hotels charge ₹1,500+ for basic rooms, our dorm beds provide a superior social experience at a fraction of the cost.' },
    ],
    [
      { question: 'What is the cheapest room at XTSY?', answer: 'Our 8-bed mixed dormitory starts at ₹499 per night per bed, making it the most affordable option in Shillong.' },
      { question: 'Are there any hidden charges?', answer: 'No hidden charges. WiFi, hot water, common kitchen access, and locker usage are all included in the room price.' },
      { question: 'Can I get a discount for longer stays?', answer: 'Yes! We offer weekly and monthly discounts. Contact us on WhatsApp for special long-stay rates.' },
    ],
    ['backpacker-hostel-shillong', 'budget-stay-shillong', 'shillong-dormitory'],
    ['cheap hostel shillong', 'cheapest hostel in shillong', 'affordable hostel shillong', 'low budget stay shillong']
  ),

  hostel('shillong-dormitory', 'Dormitory in Shillong — Mixed & Female Dorms | XTSY', 'Book dormitory beds in Shillong from ₹499. Mixed & female-only dorms with lockers, hot showers, free WiFi. Best rated dorm stay in Meghalaya.', 'Dormitory Accommodation in Shillong', 'XTSY offers the best dormitory experience in Shillong with both mixed and female-only options. Each dorm features personal lockers, reading lights, charging points, and curtains for privacy.',
    [
      { heading: 'Dorm Options at XTSY', content: 'Choose from our carefully designed dormitories:', listItems: ['8-Bed Mixed Dorm — ₹499/night, ideal for budget travelers', '6-Bed Mixed Dorm — ₹699/night, more space & comfort', '4-Bed Female-Only Dorm — ₹799/night, safe & secure'] },
      { heading: 'Dorm Amenities', content: 'Every bed comes with premium amenities for a comfortable stay.', listItems: ['Personal locker with charging point', 'Privacy curtain & reading light', 'Fresh bed linen & towel', 'Hot shower in attached bathroom', 'Free high-speed WiFi'] },
    ],
    [
      { question: 'Do dorms have lockers?', answer: 'Yes, every bed has a personal locker. Bring your own lock or buy one at reception for ₹100.' },
      { question: 'Are the dorms co-ed?', answer: 'We have both mixed (co-ed) dormitories and a dedicated female-only dormitory for solo women travelers.' },
    ],
    ['backpacker-hostel-shillong', 'cheap-hostel-shillong', 'budget-stay-shillong'],
    ['dormitory in shillong', 'shillong dorm', 'mixed dormitory shillong', 'female dormitory shillong']
  ),

  hostel('budget-stay-shillong', 'Budget Stay in Shillong — From ₹499/Night | XTSY', 'Best budget stays & budget hotels in Shillong starting ₹499. Hostel dorms, private rooms & group accommodation. Central location, all amenities included.', 'Budget Stay in Shillong — Affordable Hotels & Hostels', 'Planning a budget trip to Shillong? XTSY Travellers Hostel offers the best value accommodation with options ranging from ₹499 dorm beds to ₹1,999 private rooms. If you are searching for budget hotels in Shillong, our private rooms give you hotel-grade comfort at hostel prices — central location, free WiFi, hot water, and a vibrant travel community.',
    [
      { heading: 'Budget Accommodation Options', content: 'We offer accommodation for every budget level — from social dorm beds to private rooms that rival budget hotels in Shillong:', listItems: ['Dormitory beds from ₹499/night', 'Private rooms from ₹1,499/night', 'Deluxe rooms from ₹1,999/night', 'Group packages for 6+ travelers'] },
      { heading: 'Budget Hotels vs Hostel Stays in Shillong', content: 'Most budget hotels in Shillong charge ₹1,500–2,500 for a basic room with few extras. At XTSY you get a private room from ₹1,499 with free high-speed WiFi, 24/7 reception, hot water, an in-house restaurant (TAB Bistro), and a tour desk — plus the option to drop to a ₹499 dorm bed when you want to travel even leaner. You also book direct, so there are no OTA markups inflating your nightly rate.' },
      { heading: 'Save Money in Shillong', content: 'Tips to make your Shillong trip affordable:', listItems: ['Cook in our free common kitchen', 'Join shared day trips to split transport costs', 'Visit free attractions like Laitlum Canyons', 'Use shared taxis instead of private cabs', 'Book direct for best rates — no OTA markups', 'Travel in shoulder season (June–September) for lower rates'] },
      { heading: 'What\'s Included in Your Stay', content: 'Every booking at XTSY includes WiFi, hot water, common area access, kitchen usage, luggage storage, and local travel advice. No hidden fees or surprise charges — the price you see is the price you pay, whether you book a dorm bed or a private room.' },
      { heading: 'Location — Central & Connected', content: 'XTSY sits in New Shillong Township, roughly 10 minutes from Police Bazaar and a comfortable base for day trips to Cherrapunji, Dawki, and Mawlynnong. For a budget stay you get genuinely convenient access without paying a city-centre premium.' },
    ],
    [
      { question: 'What is the cheapest way to stay in Shillong?', answer: 'XTSY dorm beds at ₹499/night are the most affordable quality accommodation in Shillong. Combined with self-cooking in our kitchen, you can manage a Shillong trip on ₹1,500/day.' },
      { question: 'Are there good budget hotels in Shillong?', answer: 'Budget hotels in Shillong typically start around ₹1,500–2,500. XTSY\'s private rooms from ₹1,499 offer comparable comfort plus free WiFi, hot water, an in-house restaurant, and a tour desk — making them one of the best-value budget stays in the city.' },
      { question: 'Is Shillong expensive for tourists?', answer: 'Shillong is quite affordable compared to other tourist destinations. Budget travelers can explore comfortably on ₹1,500-2,500 per day including stay, food, and local transport.' },
      { question: 'Do budget stays in Shillong include WiFi and hot water?', answer: 'At XTSY, yes — free high-speed WiFi and hot water are included in every room and dorm at no extra cost. Always confirm with smaller budget hotels, as some charge extra for these.' },
    ],
    ['cheap-hostel-shillong', 'backpacker-hostel-shillong', 'shillong-dormitory', 'hotels-in-shillong', 'hostel-near-police-bazar-shillong'],
    ['budget stay shillong', 'budget hotels in shillong', 'budget hotel shillong', 'affordable accommodation shillong', 'cheap stay shillong']
  ),

  hostel('hostel-near-police-bazar-shillong', 'Hostel Near Police Bazar Shillong | XTSY', 'Best hostel near Police Bazar Shillong. 10 min from city center. Dorms from ₹499, private rooms from ₹1,499. Book now at XTSY.', 'Hostel Near Police Bazar, Shillong', 'Looking for a hostel near Police Bazar in Shillong? XTSY Travellers Hostel is located just 10 minutes from Police Bazaar, the heart of Shillong. Easy access to shopping, restaurants, and local transport.',
    [
      { heading: 'Location Advantage', content: 'XTSY is perfectly positioned for exploring Shillong:', listItems: ['10 minutes to Police Bazaar by auto', '15 minutes to Shillong Peak', '20 minutes to Elephant Falls', 'Close to Iewduh (Bara Bazaar)', 'Near local bus & taxi stands'] },
      { heading: 'Nearby Attractions', content: 'From XTSY, easily access Shillong\'s top spots including Police Bazaar market, Ward\'s Lake, Don Bosco Museum, Shillong Peak, and Lady Hydari Park — all within 20 minutes.' },
    ],
    [
      { question: 'How far is XTSY from Police Bazaar?', answer: 'XTSY is approximately 3.5 km from Police Bazaar, a 10-minute drive by auto-rickshaw (₹50-80).' },
      { question: 'Is there public transport from Police Bazaar to XTSY?', answer: 'Yes, shared autos and city buses run frequently between Police Bazaar and New Shillong Township. Auto fare is around ₹30-50.' },
    ],
    ['backpacker-hostel-shillong', 'budget-stay-shillong'],
    ['hostel near police bazar shillong', 'hostel near police bazaar', 'accommodation near police bazar shillong']
  ),

  hostel('hostels-in-meghalaya', 'Best Hostels in Meghalaya 2026 — Top Rated | XTSY', 'Discover the best hostels in Meghalaya. From Shillong to Cherrapunji, find budget dorms & backpacker hostels. Top-rated stays for solo & group travel.', 'Best Hostels in Meghalaya — Complete Guide', 'Meghalaya is emerging as a top backpacker destination in India, and hostels are the best way to explore this beautiful state on a budget. Here\'s your complete guide to hostels across Meghalaya.',
    [
      { heading: 'Top Hostels in Meghalaya', content: 'XTSY Travellers Hostel in Shillong leads the hostel scene in Meghalaya with modern facilities, social atmosphere, and the best location for day trips.', listItems: ['XTSY Travellers Hostel, Shillong — From ₹499', 'Central Shillong location', 'In-house restaurant (TAB Bistro)', 'Tour desk for Cherrapunji, Dawki trips'] },
      { heading: 'Why Choose Hostels in Meghalaya', content: 'Hostels offer the perfect base for Meghalaya exploration:', listItems: ['Meet fellow travelers for group trips', 'Local travel advice from staff', 'Shared transport to save costs', 'Social events & bonfire nights', 'Affordable long-stay options'] },
      { heading: 'Hostel Tips for Meghalaya', content: 'Book in advance during peak season (October-April). Carry warm clothes as Shillong gets cold. Most hostels provide lockers — bring a padlock. Join group trips organized by the hostel to save on transport costs.' },
    ],
    [
      { question: 'Are there hostels in Cherrapunji?', answer: 'Currently, Shillong has the best hostel infrastructure. XTSY in Shillong serves as the ideal base for Cherrapunji day trips (2 hours away).' },
      { question: 'What is the best hostel in Meghalaya?', answer: 'XTSY Travellers Hostel in Shillong is consistently rated as the best hostel in Meghalaya with 4.8 stars on Google.' },
    ],
    ['backpacker-hostel-shillong', 'cheap-hostel-shillong', 'budget-stay-shillong'],
    ['hostels in meghalaya', 'best hostels meghalaya', 'meghalaya hostel', 'backpacker hostel meghalaya']
  ),

  hostel('couples-hostel-shillong', 'Couple-Friendly Hostel in Shillong | Private Rooms', 'Couple-friendly hostel in Shillong with private rooms from ₹1,499. Cozy rooms, scenic views, and romantic dining at TAB Bistro. Book at XTSY.', 'Couple-Friendly Hostel in Shillong', 'Traveling as a couple to Shillong? XTSY offers private rooms perfect for couples, combining hostel affordability with hotel-level privacy. Enjoy cozy rooms, forest views, and romantic dining at our in-house TAB Bistro.',
    [
      { heading: 'Private Rooms for Couples', content: 'Our couple-friendly rooms offer:', listItems: ['Private Double Room — ₹1,499/night', 'Deluxe Double Room — ₹1,999/night', 'XTSY 270° Glasshouse — ₹4,999/night (romantic getaway)', 'All rooms with attached bathroom & hot water', 'Forest/mountain views available'] },
      { heading: 'Romantic Experiences', content: 'Make your Shillong trip special with candlelight dinner at TAB Bistro, sunset views from Laitlum Canyons, private Dawki boating, and stargazing from our 270° Glasshouse.' },
    ],
    [
      { question: 'Is XTSY couple-friendly?', answer: 'Yes! XTSY has private rooms specifically designed for couples with king-size beds, attached bathrooms, and a peaceful environment.' },
      { question: 'What is the best room for couples?', answer: 'The XTSY 270° Glasshouse is our most romantic option — a glass-walled suite with panoramic forest views, stargazing ceiling, and sunrise breakfast service.' },
    ],
    ['backpacker-hostel-shillong', 'luxury-glamping-shillong'],
    ['couple friendly hostel shillong', 'couple hotel shillong', 'romantic stay shillong', 'couple room shillong']
  ),

  hostel('group-stay-shillong', 'Group Stay in Shillong — 4 to 20 Guests | XTSY', 'Book group accommodation in Shillong for 4-20 guests. Dorms, private rooms & full floor booking. Best group discounts at XTSY Hostel.', 'Group Accommodation in Shillong', 'Planning a group trip to Shillong? XTSY offers flexible accommodation for groups of 4 to 20+ guests with special group discounts, shared spaces, and customized tour arrangements.',
    [
      { heading: 'Group Booking Options', content: 'Flexible options for every group size:', listItems: ['4-6 guests: Private dorm room booking', '6-10 guests: Multiple rooms + common area', '10-20 guests: Full floor exclusive booking', 'Custom packages with meals & tours', 'Corporate/college group rates available'] },
      { heading: 'Group Activities', content: 'We organize group-specific activities including bonfire nights, guided treks, Dawki camping trips, and Cherrapunji excursions. Our tour desk handles all logistics.' },
    ],
    [
      { question: 'Do you offer group discounts?', answer: 'Yes! Groups of 6+ get 10% off, groups of 10+ get 15% off. Contact us on WhatsApp for custom group pricing.' },
      { question: 'Can we book an entire floor?', answer: 'Yes, we offer full floor bookings for groups of 10-20 guests with exclusive access to common areas.' },
    ],
    ['backpacker-hostel-shillong', 'budget-stay-shillong'],
    ['group stay shillong', 'group accommodation shillong', 'group trip shillong hostel', 'college trip shillong']
  ),

  hostel('solo-travel-hostel-shillong', 'Solo Travel Hostel in Shillong | Meet Travelers | XTSY', 'Best hostel in Shillong for solo travelers. Social atmosphere, group activities, female-only dorms. Safe & affordable from ₹499/night.', 'Solo Travel Hostel in Shillong', 'Shillong is one of the best solo travel destinations in India, and XTSY is designed to make solo travelers feel at home. Meet fellow travelers, join group activities, and explore Meghalaya with new friends.',
    [
      { heading: 'Why Solo Travelers Choose XTSY', content: 'Our hostel is built for social connections:', listItems: ['Social lounge for meeting fellow travelers', 'Organized group trips & treks', 'Community dinners & bonfire nights', 'Safe female-only dormitories', 'Local travel advice from experienced staff', 'WhatsApp community for trip planning'] },
      { heading: 'Solo Travel Tips for Shillong', content: 'Shillong is safe for solo travelers, including women. Use shared taxis, join hostel group trips, try local food at Police Bazaar, and don\'t miss the live music scene. XTSY staff can help plan your entire itinerary.' },
    ],
    [
      { question: 'Is Shillong safe for solo travelers?', answer: 'Yes! Shillong is one of the safest cities in India for solo travelers. The locals are friendly and helpful, and XTSY provides a safe, social environment.' },
      { question: 'Can I join group trips from the hostel?', answer: 'Absolutely! We organize daily group trips to Cherrapunji, Dawki, Mawlynnong, and other destinations. You can join other travelers and split costs.' },
    ],
    ['backpacker-hostel-shillong', 'cheap-hostel-shillong'],
    ['solo travel hostel shillong', 'solo traveler shillong', 'shillong solo trip', 'solo backpacking meghalaya']
  ),

  hostel('long-stay-hostel-shillong', 'Long Stay Hostel Shillong — Weekly & Monthly | XTSY', 'Long-term hostel stay in Shillong with weekly & monthly discounts. High-speed WiFi, coworking space. Ideal for remote workers & digital nomads.', 'Long Stay Hostel in Shillong — Weekly & Monthly Rates', 'XTSY offers special long-stay packages for digital nomads, remote workers, and travelers who want to experience Shillong beyond a weekend trip. Weekly and monthly discounts make extended stays affordable.',
    [
      { heading: 'Long Stay Packages', content: 'Special rates for extended stays:', listItems: ['Weekly stay: 15% discount on daily rate', 'Monthly stay: 30% discount on daily rate', 'Includes: WiFi, kitchen, laundry access', 'Coworking-friendly common areas', 'Flexible check-in/check-out'] },
      { heading: 'Why Stay Long in Shillong', content: 'Shillong\'s pleasant climate, affordable living costs, and stunning surroundings make it ideal for remote work. XTSY provides reliable WiFi, quiet workspaces, and a community of like-minded travelers.' },
    ],
    [
      { question: 'What is the monthly rate at XTSY?', answer: 'Monthly rates start from ₹12,000 for dorm beds and ₹30,000 for private rooms. Contact us for exact pricing based on room type and season.' },
      { question: 'Is the WiFi good enough for remote work?', answer: 'Yes! We provide high-speed fiber internet throughout the property, adequate for video calls and regular work.' },
    ],
    ['backpacker-hostel-shillong', 'budget-stay-shillong'],
    ['long stay hostel shillong', 'monthly stay shillong', 'digital nomad shillong', 'coworking hostel shillong']
  ),
];

// ============================================================================
// CATEGORY 2: HOTELS & ACCOMMODATION (20+ pages)
// ============================================================================

const hotelPages: SEOPageData[] = [
  hotel('budget-hotel-shillong', 'Budget Hotels in Shillong — From ₹999 | XTSY', 'Affordable budget hotels in Shillong from ₹999/night. Clean rooms, central location, free WiFi. Best value stays near Police Bazar.', 'Budget Hotels in Shillong', 'Looking for a budget hotel in Shillong? While traditional hotels can be expensive, XTSY offers hotel-quality private rooms at hostel prices. Enjoy clean rooms, attached bathrooms, and premium amenities from just ₹999.',
    [
      { heading: 'Why Choose XTSY Over Traditional Hotels', content: 'XTSY offers the best of both worlds:', listItems: ['Private rooms at 40-50% less than hotels', 'Modern amenities: WiFi, hot water, clean linen', 'In-house restaurant (no need to go out)', 'Social atmosphere if you want it', 'Quiet private rooms if you need peace'] },
      { heading: 'Compare Hotel Prices in Shillong', content: 'Average hotel room in Shillong costs ₹2,500-5,000/night. XTSY private rooms start at ₹1,499 with the same amenities and a better location.' },
    ],
    [
      { question: 'How do XTSY rooms compare to budget hotels?', answer: 'Our private rooms offer hotel-quality beds, attached bathrooms, and modern amenities at 40-50% lower prices than comparable hotels in Shillong.' },
    ],
    ['backpacker-hostel-shillong', 'budget-stay-shillong'],
    ['budget hotel shillong', 'cheap hotel shillong', 'affordable hotel shillong', 'hotel under 1000 shillong']
  ),

  hotel('hotel-near-neigrihms-shillong', 'Hotel Near NEIGRIHMS Shillong — XTSY Hostel', 'Affordable hotel near NEIGRIHMS Hospital Shillong. Private rooms from ₹1,499. Clean, safe & comfortable. 10 min from NEIGRIHMS campus.', 'Hotel Near NEIGRIHMS Hospital, Shillong', 'Need accommodation near NEIGRIHMS Hospital in Shillong? XTSY Travellers Hostel is located in New Shillong Township, just 10 minutes from the NEIGRIHMS campus. Ideal for patients\' families and visitors.',
    [
      { heading: 'Proximity to NEIGRIHMS', content: 'XTSY is conveniently located near NEIGRIHMS:', listItems: ['10 minutes by auto-rickshaw from NEIGRIHMS', 'Affordable daily & weekly rates', 'Home-cooked meals at TAB Bistro', 'Quiet, peaceful environment', 'Long-stay discounts for patient families'] },
      { heading: 'Amenities for Hospital Visitors', content: 'We understand the needs of hospital visitors. XTSY offers quiet rooms, flexible check-in times, meal service, WiFi for staying connected, and a supportive staff.' },
    ],
    [
      { question: 'How far is XTSY from NEIGRIHMS?', answer: 'XTSY is approximately 4 km from NEIGRIHMS, about a 10-minute auto-rickshaw ride costing ₹60-80.' },
      { question: 'Do you offer discounts for long stays?', answer: 'Yes, we offer weekly and monthly discounts for patients\' attendants. Please contact us for special rates.' },
    ],
    ['guest-house-neigrihms-shillong', 'lodge-neigrihms-shillong', 'homestay-neigrihms-shillong'],
    ['hotel near neigrihms shillong', 'accommodation near neigrihms', 'stay near neigrihms hospital', 'hotel near neigrihms']
  ),

  hotel('guest-house-neigrihms-shillong', 'Guest House Near NEIGRIHMS Shillong | XTSY', 'Guest house accommodation near NEIGRIHMS Hospital. Private rooms, home-cooked meals, weekly discounts. Safe & clean stay at XTSY.', 'Guest House Near NEIGRIHMS, Shillong', 'XTSY offers guest house-style accommodation near NEIGRIHMS Hospital in Shillong. Private rooms with attached bathrooms, home-cooked meals, and a peaceful environment for hospital visitors.',
    [
      { heading: 'Guest House Facilities', content: 'A comfortable home away from home:', listItems: ['Private rooms with attached bathroom', 'Home-cooked meals at TAB Bistro', 'Hot water & clean linen daily', 'WiFi for staying connected', 'Friendly staff for local assistance'] },
    ],
    [
      { question: 'Is XTSY like a guest house?', answer: 'XTSY offers both hostel dormitories and private rooms. For hospital visitors, our private rooms provide a guest house experience with added amenities.' },
    ],
    ['hotel-near-neigrihms-shillong', 'lodge-neigrihms-shillong'],
    ['guest house near neigrihms shillong', 'guest house neigrihms', 'accommodation neigrihms']
  ),

  hotel('lodge-neigrihms-shillong', 'Lodge Near NEIGRIHMS Shillong — Affordable Stay', 'Affordable lodge near NEIGRIHMS Hospital Shillong. Clean rooms from ₹999. Daily & weekly rates. Safe location for hospital visitors.', 'Lodge Near NEIGRIHMS Hospital, Shillong', 'Looking for an affordable lodge near NEIGRIHMS? XTSY offers clean, comfortable rooms close to the hospital at budget-friendly rates. Perfect for patient attendants and visitors.',
    [
      { heading: 'Affordable Lodging Options', content: 'Budget-friendly stays near NEIGRIHMS:', listItems: ['Dorm beds from ₹499/night', 'Private rooms from ₹1,499/night', 'Weekly discounts available', 'Meal packages at TAB Bistro'] },
    ],
    [
      { question: 'Is there a cheaper option than hotels near NEIGRIHMS?', answer: 'Yes! XTSY dorm beds start at ₹499/night and private rooms at ₹1,499 — significantly cheaper than most hotels in the area.' },
    ],
    ['hotel-near-neigrihms-shillong', 'guest-house-neigrihms-shillong'],
    ['lodge near neigrihms shillong', 'lodge neigrihms', 'cheap lodge shillong']
  ),

  hotel('homestay-neigrihms-shillong', 'Homestay Near NEIGRIHMS Shillong | XTSY', 'Cozy homestay-style accommodation near NEIGRIHMS Shillong. Home-cooked meals, family environment. Weekly & monthly rates available.', 'Homestay Near NEIGRIHMS Hospital, Shillong', 'XTSY offers a homestay-like experience near NEIGRIHMS Hospital with home-cooked meals, a warm family environment, and rates that won\'t strain your budget during a stressful time.',
    [
      { heading: 'Homestay Experience at XTSY', content: 'Experience the warmth of a homestay:', listItems: ['Home-cooked meals at TAB Bistro', 'Warm, family-like atmosphere', 'Personal attention from staff', 'Quiet environment for rest', 'Kitchen access for dietary needs'] },
    ],
    [
      { question: 'Does XTSY feel like a homestay?', answer: 'Our private rooms offer a cozy, homestay-like atmosphere with the added benefits of professional service, in-house dining, and 24/7 staff availability.' },
    ],
    ['hotel-near-neigrihms-shillong', 'guest-house-neigrihms-shillong'],
    ['homestay near neigrihms shillong', 'homestay neigrihms', 'home stay near neigrihms hospital']
  ),

  hotel('places-to-stay-shillong', 'Best Places to Stay in Shillong 2026 — Complete Guide', 'Complete guide to places to stay in Shillong. Hostels, hotels, homestays, glamping compared. Prices, locations & booking links.', 'Best Places to Stay in Shillong — 2026 Guide', 'Planning your Shillong trip and confused about where to stay? This comprehensive guide covers every accommodation type in Shillong from budget dorm beds to luxury glamping experiences.',
    [
      { heading: 'Accommodation Types in Shillong', content: 'Shillong offers diverse stay options:', listItems: ['Hostels & Dorms — ₹499-999/night (best for solo/backpackers)', 'Budget Hotels — ₹1,000-2,500/night', 'Mid-Range Hotels — ₹2,500-5,000/night', 'Homestays — ₹1,500-3,000/night', 'Luxury Hotels — ₹5,000-15,000/night', 'Glamping — ₹4,999+/night (XTSY 270° Glasshouse)'] },
      { heading: 'Best Areas to Stay in Shillong', content: 'Top areas for tourists:', listItems: ['Police Bazaar — central, shopping & food hub', 'Laitumkhrah — quiet, local restaurants', 'New Shillong Township — spacious, near XTSY', 'Upper Shillong — scenic, forest surroundings'] },
      { heading: 'Our Recommendation', content: 'For the best value and experience, XTSY Travellers Hostel in New Shillong Township offers dorms (₹499), private rooms (₹1,499), and the iconic 270° Glasshouse (₹4,999) — catering to every budget and travel style.' },
    ],
    [
      { question: 'What is the best area to stay in Shillong?', answer: 'For tourists, Police Bazaar area offers the most convenience. For a peaceful experience with nature views, New Shillong Township (where XTSY is located) is ideal.' },
      { question: 'How much does accommodation cost in Shillong?', answer: 'Accommodation ranges from ₹499/night for dorm beds at XTSY to ₹15,000+ for luxury hotels. Budget travelers can find excellent stays for ₹500-1,500/night.' },
    ],
    ['backpacker-hostel-shillong', 'budget-stay-shillong', 'luxury-glamping-shillong'],
    ['places to stay in shillong', 'where to stay shillong', 'best accommodation shillong', 'shillong stay options']
  ),

  hotel('oyo-rooms-shillong-alternative', 'Better Than OYO Rooms in Shillong — XTSY Hostel', 'Looking for OYO rooms in Shillong? Try XTSY instead. Better rooms, lower prices, real reviews. Private rooms from ₹1,499. No hidden fees.', 'OYO Alternative in Shillong — Why XTSY is Better', 'Searching for OYO rooms in Shillong? XTSY Travellers Hostel offers a superior experience with verified quality, no hidden charges, and real guest reviews. Private rooms from ₹1,499 with all amenities included.',
    [
      { heading: 'XTSY vs OYO Rooms', content: 'Why travelers prefer XTSY:', listItems: ['No hidden charges — price you see is what you pay', 'Real, verified Google reviews (4.8 stars)', 'In-house restaurant (TAB Bistro)', 'Community atmosphere & social events', 'Consistent quality — not a franchise model', 'Direct booking = best price guaranteed'] },
    ],
    [
      { question: 'Is XTSY better than OYO in Shillong?', answer: 'XTSY consistently outperforms OYO properties in Shillong based on Google reviews, with better amenities, transparent pricing, and an in-house restaurant.' },
    ],
    ['budget-hotel-shillong', 'places-to-stay-shillong'],
    ['oyo rooms shillong', 'oyo alternative shillong', 'better than oyo shillong']
  ),
];

// ============================================================================
// CATEGORY 3: HOMESTAYS (15+ pages)
// ============================================================================

const homestayPages: SEOPageData[] = [
  homestay('homestay-in-cherrapunji', 'Homestay in Cherrapunji — Local Experience | XTSY', 'Book homestay-style stays near Cherrapunji. Traditional Khasi hospitality, local food, guided tours. Base at XTSY Shillong for day trips.', 'Homestay Experience Near Cherrapunji', 'Experience authentic Khasi hospitality near Cherrapunji. While most homestays in Cherrapunji are basic, XTSY offers a modern homestay-like experience in Shillong with organized day trips to Cherrapunji — the best of both worlds.',
    [
      { heading: 'Cherrapunji Homestay Experience', content: 'Enjoy Cherrapunji\'s magic while staying at comfortable XTSY:', listItems: ['Day trips to all Cherrapunji attractions', 'Traditional Khasi food at TAB Bistro', 'Comfortable beds & modern amenities', 'Local guides for trekking & sightseeing', 'Sunset views & bonfire nights'] },
      { heading: 'What to See in Cherrapunji', content: 'Cherrapunji (Sohra) is home to stunning attractions:', listItems: ['Nohkalikai Falls — India\'s tallest plunge waterfall', 'Seven Sisters Falls viewpoint', 'Mawsmai Cave — illuminated limestone cave', 'Double Decker Root Bridge — UNESCO tentative site', 'Eco Park — panoramic views of Bangladesh plains'] },
    ],
    [
      { question: 'Should I stay in Cherrapunji or Shillong?', answer: 'We recommend staying at XTSY in Shillong and doing a day trip to Cherrapunji. Shillong has better accommodation, restaurants, and connectivity.' },
    ],
    ['homestay-in-dawki', 'homestay-in-mawlynnong', 'cherrapunji-travel-guide'],
    ['homestay in cherrapunji', 'homestay cherrapunjee', 'stay in cherrapunji', 'accommodation cherrapunji']
  ),

  homestay('homestay-in-dawki', 'Homestay in Dawki — Near Umngot River | XTSY', 'Homestay accommodation near Dawki and Umngot River. Day trips from XTSY Shillong. Crystal-clear boating, camping & river experiences.', 'Homestay Near Dawki & Umngot River', 'Dawki is famous for the crystal-clear Umngot River. Stay at XTSY in Shillong and enjoy organized day trips to Dawki with boating, camping, and photography experiences.',
    [
      { heading: 'Dawki Experience from XTSY', content: 'We organize the perfect Dawki trip:', listItems: ['Full-day Dawki excursion from Shillong', 'Crystal-clear Umngot River boating', 'Visit to India-Bangladesh border', 'Shnongpdeng camping option', 'Zip-lining & cliff jumping activities'] },
    ],
    [
      { question: 'Can I stay overnight in Dawki?', answer: 'While Dawki has limited accommodation, you can camp at Shnongpdeng. We recommend XTSY Shillong as your base with organized day trips to Dawki.' },
    ],
    ['homestay-in-cherrapunji', 'shnongpdeng-camping-guide', 'dawki-river-travel-guide'],
    ['homestay in dawki', 'stay near dawki', 'accommodation dawki meghalaya', 'homestay near umngot river']
  ),

  homestay('homestay-in-mawlynnong', 'Homestay in Mawlynnong — Asia\'s Cleanest Village', 'Visit Mawlynnong, Asia\'s cleanest village. Homestay-style experience from XTSY Shillong. Day trips with living root bridge visit included.', 'Homestay Near Mawlynnong Village', 'Mawlynnong, Asia\'s cleanest village, is a must-visit in Meghalaya. Stay at XTSY and explore Mawlynnong on a guided day trip that includes the living root bridge, bamboo skywalk, and traditional Khasi village life.',
    [
      { heading: 'Mawlynnong Day Trip', content: 'Experience the cleanest village in Asia:', listItems: ['Guided tour of Mawlynnong village', 'Living root bridge walk', 'Bamboo sky platform (viewpoint to Bangladesh)', 'Traditional Khasi lunch', 'Combined with Dawki visit'] },
    ],
    [
      { question: 'Is Mawlynnong worth visiting?', answer: 'Absolutely! Asia\'s cleanest village is a unique experience. The living root bridge, bamboo skywalk, and Khasi culture make it a highlight of any Meghalaya trip.' },
    ],
    ['homestay-in-dawki', 'homestay-in-cherrapunji'],
    ['homestay in mawlynnong', 'stay in mawlynnong', 'mawlynnong village accommodation']
  ),

  homestay('homestay-shillong-city', 'Homestay in Shillong City — Local Living | XTSY', 'Authentic homestay experience in Shillong. Private rooms, home-cooked Khasi food, cultural immersion. From ₹1,499/night at XTSY.', 'Homestay in Shillong City', 'Experience Shillong like a local with XTSY\'s homestay-style private rooms. Enjoy home-cooked Khasi cuisine at TAB Bistro, cultural exchanges with local staff, and genuine Meghalaya hospitality.',
    [
      { heading: 'What Makes Our Stay Special', content: 'XTSY combines modern comfort with local warmth:', listItems: ['Home-cooked Khasi & multi-cuisine meals', 'Local staff sharing cultural insights', 'Traditional music & cultural evenings', 'Nature-surrounded property', 'Personalized trip planning'] },
    ],
    [
      { question: 'Does XTSY offer local food?', answer: 'Yes! TAB Bistro serves authentic Khasi cuisine alongside Indian and continental options. Try jadoh (Khasi rice dish), tungrymbai, and local specialties.' },
    ],
    ['places-to-stay-shillong', 'budget-stay-shillong'],
    ['homestay in shillong', 'shillong homestay', 'local homestay shillong', 'authentic stay shillong']
  ),
];

// ============================================================================
// CATEGORY 4: CAR & BIKE RENTALS (20+ pages)
// ============================================================================

const rentalPages: SEOPageData[] = [
  rental('car-rental-shillong', 'Car Rental in Shillong — Self Drive & Chauffeur | XTSY', 'Rent a car in Shillong from ₹2,500/day. Self-drive & chauffeur options. Sedan, SUV, Innova available. Airport pickup included.', 'Car Rental in Shillong — Self Drive & Chauffeur', 'Explore Meghalaya at your own pace with XTSY car rental service in Shillong. Choose from sedans, SUVs, and premium vehicles with self-drive or chauffeur options. Airport pickup and drop available.',
    [
      { heading: 'Vehicle Options', content: 'Choose the right vehicle for your trip:', listItems: ['Maruti Swift/i20 — ₹2,500/day (city exploration)', 'Hyundai Creta/Seltos — ₹3,500/day (hills & waterfalls)', 'Toyota Innova — ₹4,500/day (family trips)', 'Mahindra Thar — ₹5,000/day (adventure & off-road)', 'Premium SUV (Fortuner) — ₹7,000/day'] },
      { heading: 'Self-Drive vs Chauffeur', content: 'Self-drive is available for Indian license holders. Chauffeur-driven is recommended for first-time visitors as Meghalaya roads can be challenging. All chauffeurs are local experts who double as guides.' },
      { heading: 'Rental Packages', content: 'Multi-day packages for popular routes:', listItems: ['Shillong Local — ₹2,500/day', 'Shillong-Cherrapunji — ₹3,500/day', 'Shillong-Dawki-Mawlynnong — ₹4,000/day', 'Full Meghalaya Circuit (5 days) — ₹15,000', 'Airport Transfer (Guwahati-Shillong) — ₹3,500 one way'] },
    ],
    [
      { question: 'Can I rent a self-drive car in Shillong?', answer: 'Yes! We offer self-drive cars with Indian driving license. Minimum age 21, valid license required. ₹5,000 security deposit (refundable).' },
      { question: 'Is it safe to self-drive in Meghalaya?', answer: 'Roads in Meghalaya can be narrow and winding. If you\'re experienced with hill driving, self-drive is fine. Otherwise, our local chauffeur-drivers are recommended.' },
      { question: 'Do you offer airport pickup?', answer: 'Yes! Guwahati Airport to Shillong transfer costs ₹3,500 one way (2.5-hour drive). We also offer Shillong Helipad transfers.' },
    ],
    ['bike-rental-shillong', 'self-drive-car-shillong', 'luxury-car-rental-shillong'],
    ['car rental shillong', 'rent a car shillong', 'car hire shillong', 'car rental meghalaya']
  ),

  rental('bike-rental-shillong', 'Bike Rental in Shillong — Royal Enfield & More | XTSY', 'Rent a bike in Shillong from ₹800/day. Royal Enfield, Himalayan, KTM available. Explore Meghalaya on two wheels. Helmet & gear included.', 'Bike Rental in Shillong — Ride Meghalaya', 'Explore Meghalaya on two wheels! XTSY offers bike rentals in Shillong with Royal Enfield, Himalayan, and KTM options. Helmets, raincoats, and basic gear included. Perfect for adventure seekers.',
    [
      { heading: 'Available Bikes', content: 'Choose your ride:', listItems: ['Honda Activa/Dio — ₹500/day (city rides)', 'Royal Enfield Classic 350 — ₹800/day', 'Royal Enfield Himalayan — ₹1,200/day', 'KTM Duke 200 — ₹1,000/day', 'Bajaj Avenger — ₹700/day'] },
      { heading: 'What\'s Included', content: 'Every bike rental comes with helmet, riding raincoat, basic tool kit, phone mount, and 24/7 roadside assistance within Shillong.' },
      { heading: 'Best Bike Routes in Meghalaya', content: 'Top routes for biking:', listItems: ['Shillong to Cherrapunji — 54 km, scenic waterfalls', 'Shillong to Dawki — 81 km, river valley views', 'Shillong to Laitlum Canyons — 22 km, canyon drive', 'Shillong to Mawphlang Sacred Forest — 25 km', 'Upper Shillong Loop — 15 km, forest ride'] },
    ],
    [
      { question: 'Do I need a license to rent a bike?', answer: 'Yes, a valid Indian two-wheeler driving license is required. International visitors need an International Driving Permit.' },
      { question: 'Is biking safe in Meghalaya?', answer: 'Meghalaya roads are scenic but can be challenging with curves and occasional rain. Wear proper gear, drive slow on bends, and avoid night riding.' },
    ],
    ['car-rental-shillong', 'self-drive-car-shillong'],
    ['bike rental shillong', 'rent bike shillong', 'royal enfield rental shillong', 'motorcycle rental meghalaya']
  ),

  rental('self-drive-car-shillong', 'Self Drive Car Rental Shillong — From ₹2,500/Day', 'Self-drive car rental in Shillong. Sedan & SUV available from ₹2,500/day. Explore Meghalaya at your pace. Easy booking via WhatsApp.', 'Self Drive Car Rental in Shillong', 'Want the freedom to explore Meghalaya on your own schedule? XTSY self-drive car rentals let you pick up a vehicle in Shillong and drive to Cherrapunji, Dawki, Mawlynnong, and beyond.',
    [
      { heading: 'Self-Drive Benefits', content: 'Freedom to explore at your pace:', listItems: ['No schedule constraints', 'Stop anywhere for photos', 'Explore off-beat destinations', 'Cost-effective for couples/small groups', 'GPS navigation included'] },
      { heading: 'Requirements', content: 'To rent a self-drive car:', listItems: ['Valid Indian driving license', 'Minimum age: 21 years', 'Security deposit: ₹5,000 (refundable)', 'Aadhar/Passport ID verification', 'Fuel at your own cost'] },
    ],
    [
      { question: 'Is self-drive available for out-of-state visitors?', answer: 'Yes! Any valid Indian driving license works. We also accept International Driving Permits for foreign visitors.' },
    ],
    ['car-rental-shillong', 'bike-rental-shillong'],
    ['self drive car shillong', 'self drive rental shillong', 'rent car without driver shillong']
  ),

  rental('luxury-car-rental-shillong', 'Luxury Car Rental Shillong — Fortuner, Innova Crysta', 'Premium luxury car rental in Shillong. Toyota Fortuner, Innova Crysta with professional driver. Corporate, wedding & VIP transfers.', 'Luxury Car Rental in Shillong', 'Need a premium vehicle in Shillong? XTSY offers luxury car rentals including Toyota Fortuner, Innova Crysta, and other premium SUVs with professional drivers. Perfect for weddings, corporate events, and VIP transfers.',
    [
      { heading: 'Luxury Fleet', content: 'Premium vehicles available:', listItems: ['Toyota Innova Crysta — ₹5,500/day', 'Toyota Fortuner — ₹7,000/day', 'MG Hector — ₹5,000/day', 'Mahindra XUV700 — ₹5,500/day'] },
      { heading: 'Services', content: 'Premium service includes professional driver in formal attire, airport meet & greet, in-car amenities, flexible scheduling, and multi-city tours.' },
    ],
    [
      { question: 'Can I book a luxury car for a wedding?', answer: 'Yes! We provide decorated luxury vehicles for weddings and special occasions. Contact us for wedding car packages.' },
    ],
    ['car-rental-shillong', 'premium-suv-rental-shillong'],
    ['luxury car rental shillong', 'fortuner rental shillong', 'premium car hire shillong']
  ),

  rental('premium-suv-rental-shillong', 'Premium SUV Rental Shillong — Thar, Fortuner, XUV', 'Rent premium SUVs in Shillong. Mahindra Thar, Toyota Fortuner, XUV700. Perfect for off-road Meghalaya adventures. From ₹5,000/day.', 'Premium SUV Rental in Shillong', 'Meghalaya\'s terrain demands a capable vehicle. Rent a premium SUV from XTSY for the ultimate road trip experience — from Shillong\'s hills to Dawki\'s valleys and Cherrapunji\'s winding roads.',
    [
      { heading: 'SUV Options', content: 'Adventure-ready vehicles:', listItems: ['Mahindra Thar (4x4) — ₹5,000/day', 'Toyota Fortuner (4x4) — ₹7,000/day', 'Mahindra XUV700 — ₹5,500/day', 'Hyundai Creta — ₹3,500/day'] },
    ],
    [
      { question: 'Do I need an SUV for Meghalaya?', answer: 'While a sedan works for main roads, an SUV is recommended for off-beat destinations, monsoon travel, and the Dawki-Shnongpdeng route.' },
    ],
    ['car-rental-shillong', 'luxury-car-rental-shillong'],
    ['premium suv rental shillong', 'suv rental meghalaya', 'thar rental shillong', 'off road car rental shillong']
  ),

  rental('car-rental-northeast-india', 'Car Rental Northeast India — Meghalaya, Assam, Nagaland', 'Rent a car for Northeast India road trips. Cover Meghalaya, Assam, Nagaland, Arunachal. Multi-state packages from ₹3,500/day.', 'Car Rental for Northeast India Road Trip', 'Planning a road trip across Northeast India? XTSY offers multi-state car rental packages covering Meghalaya, Assam, Nagaland, and Arunachal Pradesh. Start from Guwahati and explore the entire region.',
    [
      { heading: 'Multi-State Packages', content: 'Road trip packages across Northeast India:', listItems: ['Meghalaya Circuit (5 days) — ₹18,000', 'Meghalaya + Assam (7 days) — ₹25,000', 'Northeast Grand Circuit (10 days) — ₹40,000', 'Guwahati Airport pickup included'] },
      { heading: 'Route Recommendations', content: 'Popular Northeast road trip routes:', listItems: ['Guwahati → Shillong → Cherrapunji → Dawki', 'Shillong → Jowai → Dawki → Shnongpdeng', 'Guwahati → Kaziranga → Majuli Island', 'Shillong → Nongpoh → Guwahati'] },
    ],
    [
      { question: 'Can I drive from Guwahati to Shillong?', answer: 'Yes! It\'s a 100 km drive taking about 2.5-3 hours via NH6. The road is well-maintained with beautiful views of Umiam Lake.' },
    ],
    ['car-rental-shillong', 'self-drive-car-shillong'],
    ['car rental northeast india', 'car hire northeast india', 'road trip northeast india car']
  ),

  rental('tempo-traveller-shillong', 'Tempo Traveller Rental Shillong — 12-26 Seater', 'Book tempo traveller in Shillong for group tours. 12, 17, 20 & 26 seater available. Meghalaya sightseeing, airport transfers. From ₹6,000/day.', 'Tempo Traveller Rental in Shillong', 'Traveling with a large group to Meghalaya? Rent a tempo traveller in Shillong for comfortable group travel to Cherrapunji, Dawki, Mawlynnong, and other destinations.',
    [
      { heading: 'Tempo Traveller Options', content: 'Group vehicle fleet:', listItems: ['12-Seater Tempo — ₹6,000/day', '17-Seater Tempo — ₹7,500/day', '20-Seater Mini Bus — ₹9,000/day', '26-Seater Bus — ₹12,000/day', 'AC & Non-AC options available'] },
    ],
    [
      { question: 'Can a tempo traveller go to Cherrapunji?', answer: 'Yes, tempo travellers regularly ply on the Shillong-Cherrapunji route. The road is suitable for larger vehicles.' },
    ],
    ['car-rental-shillong', 'group-stay-shillong'],
    ['tempo traveller shillong', 'tempo traveller rental meghalaya', 'bus rental shillong', 'group vehicle shillong']
  ),
];

// ============================================================================
// CATEGORY 5: TOUR PACKAGES (30+ pages)
// ============================================================================

const tourPages: SEOPageData[] = [
  tour('meghalaya-tour-package-3-days', '3 Day Meghalaya Tour Package — ₹7,999 | XTSY', 'Best 3-day Meghalaya tour package at ₹7,999/person. Shillong, Elephant Falls, Laitlum Canyons. Stay, meals & transport included.', '3-Day Meghalaya Tour Package', 'Short on time? Our 3-day Meghalaya package covers Shillong\'s best attractions with comfortable stay at XTSY, meals at TAB Bistro, and guided sightseeing.',
    [
      { heading: 'Day-by-Day Itinerary', content: 'A compact but complete Meghalaya experience:', listItems: ['Day 1: Arrive Shillong → Umiam Lake → XTSY check-in → Police Bazaar evening', 'Day 2: Shillong Peak → Elephant Falls → Laitlum Canyons → Bonfire', 'Day 3: Ward\'s Lake → Don Bosco Museum → Departure'] },
      { heading: 'What\'s Included', content: 'Everything you need:', listItems: ['2 nights at XTSY Hostel/Private Room', 'All meals (breakfast, lunch, dinner)', 'Local transport & sightseeing', 'English-speaking guide', 'Airport/station pickup & drop'] },
      { heading: 'Pricing', content: 'Starting from ₹7,999 per person (twin sharing). Solo travelers: ₹9,999. Group discounts available for 6+ travelers.' },
    ],
    [
      { question: 'Is 3 days enough for Meghalaya?', answer: 'Three days covers Shillong\'s highlights well. For Cherrapunji and Dawki, we recommend our 5-day or 7-day packages.' },
      { question: 'Can I customize this package?', answer: 'Yes! We offer fully customizable packages. Contact us on WhatsApp to build your perfect itinerary.' },
    ],
    ['meghalaya-tour-package-5-days', 'meghalaya-tour-package-7-days', 'shillong-tour-package-2-days'],
    ['3 day meghalaya tour package', 'meghalaya 3 day trip', 'short trip meghalaya', 'weekend meghalaya package']
  ),

  tour('meghalaya-tour-package-5-days', '5 Day Meghalaya Tour Package — ₹13,999 | XTSY', 'Complete 5-day Meghalaya tour at ₹13,999. Shillong + Cherrapunji + Dawki + Mawlynnong. All meals, stays & transport included.', '5-Day Meghalaya Tour Package — Complete Experience', 'Our most popular package! 5 days covering Shillong, Cherrapunji waterfalls, Dawki river, and Mawlynnong village. All-inclusive with stays at XTSY, meals, transport, and guided tours.',
    [
      { heading: 'Complete Itinerary', content: 'The perfect Meghalaya exploration:', listItems: ['Day 1: Guwahati → Shillong, Umiam Lake, Police Bazaar', 'Day 2: Shillong Peak, Elephant Falls, Laitlum Canyons', 'Day 3: Cherrapunji — Nohkalikai Falls, Mawsmai Cave, Seven Sisters', 'Day 4: Dawki boating, Mawlynnong village, Living Root Bridge', 'Day 5: Local market shopping, departure'] },
      { heading: 'Package Includes', content: 'All-inclusive pricing:', listItems: ['4 nights XTSY accommodation', 'All meals & snacks', 'Private transport throughout', 'Entry fees to all attractions', 'Local guide for all excursions', 'Airport pickup & drop'] },
      { heading: 'Pricing', content: '₹13,999/person (twin sharing). Solo: ₹16,999. Family (4 pax): ₹12,999/person.' },
    ],
    [
      { question: 'Is this package suitable for families?', answer: 'Yes! We have family-friendly vehicles, kid-safe accommodations, and adjustable activity levels.' },
      { question: 'What if it rains during the trip?', answer: 'We provide rain gear and adjust the itinerary for indoor activities or covered attractions. Meghalaya is beautiful even in the rain!' },
    ],
    ['meghalaya-tour-package-3-days', 'meghalaya-tour-package-7-days', 'meghalaya-honeymoon-package'],
    ['5 day meghalaya tour', 'meghalaya 5 day package', 'meghalaya tour 5 days', 'complete meghalaya tour']
  ),

  tour('meghalaya-tour-package-7-days', '7 Day Meghalaya Tour Package — ₹22,999 | XTSY', 'Ultimate 7-day Meghalaya tour at ₹22,999. Every major attraction covered. Nongriat trek, Dawki camping, Cherrapunji waterfalls. All inclusive.', '7-Day Complete Meghalaya Tour Package', 'The ultimate Meghalaya experience! 7 days covering every major destination including the Nongriat trek to Double Decker Root Bridge, Dawki camping, Shnongpdeng adventures, and all Cherrapunji waterfalls.',
    [
      { heading: 'Full 7-Day Itinerary', content: 'The complete Meghalaya circuit:', listItems: ['Day 1: Arrive Shillong, Umiam Lake, evening exploration', 'Day 2: Shillong sightseeing — Peak, Elephant Falls, Cathedral', 'Day 3: Cherrapunji — Nohkalikai, Seven Sisters, Mawsmai Cave', 'Day 4: Nongriat Trek — Double Decker Root Bridge (overnight)', 'Day 5: Return from Nongriat, Eco Park, rest', 'Day 6: Dawki + Shnongpdeng — boating, camping, cliff jumping', 'Day 7: Mawlynnong + departure'] },
      { heading: 'Adventure Highlights', content: 'This package includes thrilling experiences:', listItems: ['Nongriat trek (3,500 steps!) to Double Decker Root Bridge', 'Crystal-clear Umngot River boating at Dawki', 'Cliff jumping & zip-lining at Shnongpdeng', 'Mawryngkhang bamboo trail (optional)', 'Night camping under stars'] },
      { heading: 'Pricing Details', content: '₹22,999/person (twin sharing). Includes everything: stay, all meals, transport, guide, entry fees, camping gear.' },
    ],
    [
      { question: 'Is the Nongriat trek difficult?', answer: 'The trek involves 3,500 steps down and up. It requires moderate fitness. We provide guides and can adjust the pace. Not recommended for elderly or those with knee issues.' },
      { question: 'Is camping at Shnongpdeng safe?', answer: 'Yes! We use professional camping gear, and our guides are experienced. The campsite is well-maintained with basic sanitation facilities.' },
    ],
    ['meghalaya-tour-package-5-days', 'nongjrong-tour-package', 'meghalaya-adventure-package'],
    ['7 day meghalaya tour', 'meghalaya week trip', 'complete meghalaya package', 'meghalaya 7 day itinerary']
  ),

  tour('shillong-tour-package-2-days', 'Shillong Tour Package 2 Days — ₹4,999 | XTSY', 'Quick 2-day Shillong tour at ₹4,999. Shillong Peak, Elephant Falls, Police Bazaar, Ward\'s Lake. Stay & meals at XTSY included.', '2-Day Shillong Tour Package — Weekend Getaway', 'Perfect for a quick weekend escape! Our 2-day Shillong package covers the city\'s best attractions with comfortable stay at XTSY and meals at TAB Bistro.',
    [
      { heading: 'Weekend Itinerary', content: 'Pack the best of Shillong in 2 days:', listItems: ['Day 1: Arrive → Shillong Peak → Elephant Falls → Police Bazaar', 'Day 2: Ward\'s Lake → Cathedral → Don Bosco Museum → Departure'] },
      { heading: 'Package Price', content: '₹4,999/person including 1 night XTSY stay, all meals, local transport, and guide.' },
    ],
    [
      { question: 'Can I extend to 3 days?', answer: 'Yes! Add a day trip to Laitlum Canyons and Mawphlang Sacred Forest for just ₹2,500 more.' },
    ],
    ['meghalaya-tour-package-3-days', 'shillong-weekend-trip'],
    ['shillong tour package 2 days', '2 day shillong trip', 'shillong weekend getaway', 'quick shillong tour']
  ),

  tour('meghalaya-honeymoon-package', 'Meghalaya Honeymoon Package — ₹18,999/Couple | XTSY', 'Romantic Meghalaya honeymoon package for couples. 270° Glasshouse stay, private Dawki boating, candlelight dinner. 5 days ₹18,999.', 'Meghalaya Honeymoon Package — Romantic Getaway', 'Celebrate your love amidst Meghalaya\'s stunning landscapes! Our honeymoon package features a stay in the iconic XTSY 270° Glasshouse, private Dawki boating, sunset at Laitlum, and candlelight dinner.',
    [
      { heading: 'Romantic Itinerary', content: '5 days of romance in Meghalaya:', listItems: ['Day 1: Arrive → XTSY 270° Glasshouse check-in → Welcome dinner', 'Day 2: Shillong viewpoints → Sunset at Laitlum → Stargazing', 'Day 3: Private Dawki boating → Shnongpdeng beach', 'Day 4: Cherrapunji waterfalls → Candlelight dinner', 'Day 5: Leisure morning → Departure'] },
      { heading: 'Romantic Experiences', content: 'Special couple experiences:', listItems: ['270° Glasshouse with panoramic views & stargazing', 'Private Umngot River boating (crystal-clear water)', 'Candlelight dinner at TAB Bistro', 'Couples photography at scenic viewpoints', 'Sunrise breakfast in bed'] },
      { heading: 'Pricing', content: '₹18,999 per couple for 5 days/4 nights. Includes premium accommodation, all meals, private transport, and romantic add-ons.' },
    ],
    [
      { question: 'Is Meghalaya good for honeymoon?', answer: 'Meghalaya is one of India\'s most romantic destinations with pristine nature, pleasant weather, and unique experiences like our 270° Glasshouse — perfect for couples.' },
      { question: 'What is the XTSY 270° Glasshouse?', answer: 'It\'s India\'s first 270-degree glass-walled suite offering panoramic forest views and stargazing. A truly unique romantic experience.' },
    ],
    ['meghalaya-tour-package-5-days', 'luxury-glamping-shillong', 'couples-hostel-shillong'],
    ['meghalaya honeymoon package', 'honeymoon in meghalaya', 'romantic trip meghalaya', 'couples meghalaya trip']
  ),

  tour('nongjrong-tour-package', 'Nongjrong Tour Package — Sunrise & Root Bridges', 'Book Nongjrong tour package from Shillong. Famous sunrise viewpoint, living root bridges, Khasi village trek. Full-day guided tour.', 'Nongjrong Tour Package — Sunrise & Root Bridges', 'Nongjrong is one of Meghalaya\'s hidden gems, famous for its breathtaking sunrise viewpoint and living root bridges. This full-day guided tour from Shillong takes you through authentic Khasi village life.',
    [
      { heading: 'Tour Highlights', content: 'What you\'ll experience:', listItems: ['Pre-dawn departure for sunrise viewpoint', 'Panoramic views of river valleys & clouds', 'Living root bridge trek', 'Traditional Khasi village visit', 'Local Khasi lunch', 'Return to Shillong by evening'] },
      { heading: 'Pricing', content: '₹2,500/person for full-day guided tour including transport, guide, and local lunch.' },
    ],
    [
      { question: 'How difficult is the Nongjrong trek?', answer: 'Moderate difficulty. The trek involves approximately 2,000 steps. Suitable for anyone with basic fitness.' },
    ],
    ['meghalaya-tour-package-5-days', 'meghalaya-adventure-package'],
    ['nongjrong tour package', 'nongjrong sunrise', 'nongjrong viewpoint', 'nongjrong trek']
  ),

  tour('cherrapunji-tour-package', 'Cherrapunji Tour Package From Shillong — ₹2,500/Day', 'Full-day Cherrapunji tour from Shillong at ₹2,500. Nohkalikai Falls, Mawsmai Cave, Seven Sisters Falls, Eco Park. Transport & guide included.', 'Cherrapunji Tour Package From Shillong', 'Experience Cherrapunji (Sohra), the wettest place on Earth, on our guided day trip from Shillong. Visit Nohkalikai Falls, Mawsmai Cave, Seven Sisters Falls, and the stunning Eco Park.',
    [
      { heading: 'Full Day Cherrapunji Tour', content: 'Complete Cherrapunji experience:', listItems: ['Nohkalikai Falls — India\'s tallest plunge waterfall', 'Mawsmai Cave — illuminated limestone cave', 'Seven Sisters Falls (seasonal)', 'Eco Park — panoramic views', 'Thangkharang Park — cliff edge viewpoint', 'Optional: Double Decker Root Bridge trek'] },
      { heading: 'Package Details', content: '₹2,500/person including private transport, guide, and entry fees. Meals extra. Depart 7 AM, return by 6 PM.' },
    ],
    [
      { question: 'How far is Cherrapunji from Shillong?', answer: 'Cherrapunji (Sohra) is 54 km from Shillong, approximately 2 hours by car through beautiful mountainous terrain.' },
    ],
    ['meghalaya-tour-package-5-days', 'nongjrong-tour-package', 'dawki-tour-package'],
    ['cherrapunji tour package', 'cherrapunjee tour', 'sohra tour package', 'cherrapunji from shillong']
  ),

  tour('dawki-tour-package', 'Dawki Tour Package From Shillong — ₹3,000/Day', 'Dawki day trip from Shillong at ₹3,000. Crystal-clear Umngot River boating, India-Bangladesh border, Shnongpdeng. Full-day guided tour.', 'Dawki Tour Package From Shillong', 'Visit Dawki, home to the crystal-clear Umngot River, on our guided day trip from Shillong. Includes boating, India-Bangladesh border visit, and optional Shnongpdeng activities.',
    [
      { heading: 'Dawki Day Trip', content: 'Full-day Dawki experience:', listItems: ['Crystal-clear Umngot River boating', 'India-Bangladesh border viewpoint', 'Shnongpdeng — cliff jumping, zip-line (optional)', 'Visit to Mawlynnong (Asia\'s cleanest village)', 'Living Root Bridge walk', 'Photo stops along the scenic route'] },
      { heading: 'Package Details', content: '₹3,000/person including transport, guide, boating. Additional activities at Shnongpdeng charged separately.' },
    ],
    [
      { question: 'When is the best time to visit Dawki?', answer: 'October to March offers the clearest water in Umngot River. The river turns slightly green-blue during monsoon but is still stunning.' },
    ],
    ['cherrapunji-tour-package', 'meghalaya-tour-package-5-days'],
    ['dawki tour package', 'dawki trip from shillong', 'umngot river tour', 'dawki boating package']
  ),

  tour('meghalaya-adventure-package', 'Meghalaya Adventure Package — Trek, Camp, Explore', 'Adventure tour package in Meghalaya. Trekking, camping, cliff jumping, caving. 5 days of adrenaline. From ₹16,999/person.', 'Meghalaya Adventure Package — For Thrill Seekers', 'Meghalaya is India\'s adventure capital. Our adventure package combines trekking to root bridges, camping at Shnongpdeng, cliff jumping, caving, and more for the ultimate adrenaline experience.',
    [
      { heading: 'Adventure Itinerary', content: '5 days of pure adventure:', listItems: ['Day 1: Arrive → Laitlum Canyon trek', 'Day 2: Nongriat trek → Double Decker Root Bridge', 'Day 3: Mawsmai Cave → Arwah Cave exploration', 'Day 4: Shnongpdeng — cliff jumping, zip-line, kayaking', 'Day 5: Mawryngkhang bamboo trail → Departure'] },
      { heading: 'Activities Included', content: 'All adventure activities included:', listItems: ['Living root bridge trek (Nongriat)', 'Cave exploration (Mawsmai & Arwah)', 'Cliff jumping at Shnongpdeng', 'Zip-lining over Umngot River', 'Bamboo trail walking', 'River kayaking', 'Night camping under stars'] },
    ],
    [
      { question: 'Is the adventure package suitable for beginners?', answer: 'Yes! Our guides adjust difficulty levels. Some activities (cliff jumping heights) are optional. Basic fitness is sufficient for most activities.' },
    ],
    ['meghalaya-tour-package-7-days', 'trekking-in-meghalaya', 'camping-in-meghalaya'],
    ['meghalaya adventure package', 'adventure tour meghalaya', 'meghalaya adventure trip', 'extreme sports meghalaya']
  ),

  tour('meghalaya-photography-tour', 'Meghalaya Photography Tour — Capture the Beauty', 'Photography tour in Meghalaya. Golden hour shoots, waterfall photography, village portraits. 5-day guided photo tour from ₹19,999.', 'Meghalaya Photography Tour — Capture Every Moment', 'Meghalaya is a photographer\'s paradise. Our photography tour is designed for enthusiasts and professionals, covering the most photogenic spots at golden hour with local guides.',
    [
      { heading: 'Photography Hotspots', content: 'Best locations for photography:', listItems: ['Laitlum Canyons — sunrise & cloud formations', 'Dawki River — glass-clear water reflections', 'Nohkalikai Falls — dramatic waterfall shots', 'Living Root Bridges — architectural marvels', 'Mawlynnong — village life & colors', 'Shillong streets — cultural photography'] },
      { heading: 'What\'s Special', content: 'Photography-focused itinerary:', listItems: ['Timed for golden hour at each location', 'Early morning & late evening shoots', 'Local models/subjects arranged', 'Drone-friendly locations identified', 'Post-processing workshop included'] },
    ],
    [
      { question: 'Can I bring a drone?', answer: 'Drones are allowed in most areas of Meghalaya. We identify drone-safe zones in advance. Some restricted areas (near borders) may require permits.' },
    ],
    ['meghalaya-tour-package-5-days', 'meghalaya-photo-gallery'],
    ['meghalaya photography tour', 'photo tour meghalaya', 'photography trip shillong', 'meghalaya for photographers']
  ),
];

// ============================================================================
// CATEGORY 6: TRAVEL GUIDES (40+ pages)
// ============================================================================

const guidePages: SEOPageData[] = [
  guide('places-to-visit-meghalaya', 'Places to Visit in Meghalaya 2026 — 50+ Destinations', 'Complete guide to 50+ places to visit in Meghalaya. Waterfalls, caves, villages, viewpoints. Maps, timings, entry fees & travel tips.', 'Places to Visit in Meghalaya — Complete Guide', 'Meghalaya, the "Abode of Clouds," offers some of India\'s most stunning natural attractions. From the highest waterfalls to the clearest rivers, ancient caves to living root bridges — here\'s your complete guide to 50+ must-visit places.',
    [
      { heading: 'Top 10 Must-Visit Places', content: 'Don\'t miss these iconic attractions:', listItems: ['1. Dawki & Umngot River — Crystal-clear water boating', '2. Nohkalikai Falls — India\'s tallest plunge waterfall', '3. Living Root Bridges — UNESCO-worthy natural wonders', '4. Laitlum Canyons — Dramatic cliff viewpoints', '5. Mawlynnong — Asia\'s cleanest village', '6. Mawsmai Cave — Illuminated limestone cave', '7. Elephant Falls — Three-tiered waterfall', '8. Shillong Peak — Highest point of Shillong', '9. Krang Suri Falls — Blue lagoon swimming', '10. Shnongpdeng — Adventure sports paradise'] },
      { heading: 'Region-Wise Breakdown', content: 'Meghalaya\'s attractions are spread across three regions:', listItems: ['East Khasi Hills: Shillong, Cherrapunji, Mawlynnong, Dawki', 'West Khasi Hills: Nongkhnum Island, Mawthadraishan', 'Jaintia Hills: Krang Suri Falls, Thadlaskein Lake', 'Garo Hills: Tura Peak, Siju Cave, Balpakram'] },
      { heading: 'Best Time to Visit', content: 'October to April is the best season. Monsoon (June-September) brings heavy rain but creates stunning waterfalls. Avoid December-January if you dislike cold weather.' },
    ],
    [
      { question: 'How many days do I need for Meghalaya?', answer: 'Minimum 5 days to cover the highlights. 7-10 days for a comprehensive experience including treks and off-beat destinations.' },
      { question: 'Is Meghalaya safe for tourists?', answer: 'Yes! Meghalaya is one of the safest states in India for tourists. The Khasi people are known for their warm hospitality.' },
    ],
    ['things-to-do-meghalaya', 'meghalaya-backpacking-guide', 'meghalaya-itinerary-planning'],
    ['places to visit in meghalaya', 'best places meghalaya', 'meghalaya tourist places', 'meghalaya sightseeing']
  ),

  guide('meghalaya-backpacking-guide', 'Meghalaya Backpacking Guide 2026 — Budget Tips & Routes', 'Complete backpacking guide to Meghalaya. Budget tips, routes, hostels, local transport. Explore Meghalaya on ₹1,500/day. Backpacker tested.', 'Meghalaya Backpacking Guide — Budget Travel', 'Meghalaya is emerging as one of India\'s top backpacking destinations. This guide covers everything you need to know about budget travel in Meghalaya — from ₹499 hostel beds to shared transport hacks and free attractions.',
    [
      { heading: 'Daily Budget Breakdown', content: 'Meghalaya on a budget:', listItems: ['Hostel dorm bed: ₹499-699/night', 'Food (local restaurants): ₹300-500/day', 'Local transport (shared): ₹200-400/day', 'Entry fees: ₹50-200/attraction', 'Total: ₹1,200-1,800/day'] },
      { heading: 'Budget Travel Tips', content: 'Save money while exploring:', listItems: ['Stay at XTSY — cheapest quality hostel in Shillong', 'Use shared Sumo/taxi instead of private cars', 'Cook at the hostel common kitchen', 'Join group trips organized by XTSY', 'Visit free attractions: Laitlum, Sacred Forest, viewpoints', 'Travel in shoulder season (March-May) for lower prices'] },
      { heading: 'Best Backpacking Routes', content: 'Tested routes for backpackers:', listItems: ['Route 1: Guwahati → Shillong → Cherrapunji → Dawki (5 days)', 'Route 2: Shillong → Jowai → Krang Suri → Dawki (4 days)', 'Route 3: Shillong → Nongriat Trek → Shillong (3 days)', 'Route 4: Full Circuit including Tura & Garo Hills (10 days)'] },
    ],
    [
      { question: 'Can I backpack Meghalaya solo?', answer: 'Absolutely! Meghalaya is very safe for solo backpackers. XTSY Hostel in Shillong is the perfect base to meet fellow travelers and join group trips.' },
      { question: 'Is public transport available in Meghalaya?', answer: 'Shared Sumos (jeeps) connect major towns. From Shillong, shared transport goes to Cherrapunji, Dawki, and Jowai. For remote areas, hiring a car is recommended.' },
    ],
    ['budget-trip-meghalaya', 'backpacking-northeast-india', 'places-to-visit-meghalaya'],
    ['meghalaya backpacking guide', 'backpacking meghalaya', 'budget travel meghalaya', 'meghalaya budget trip']
  ),

  guide('meghalaya-trip-cost', 'Meghalaya Trip Cost 2026 — Complete Budget Breakdown', 'How much does a Meghalaya trip cost? Complete budget breakdown for 3, 5, 7-day trips. Transport, stay, food, activities. Budget to luxury.', 'Meghalaya Trip Cost — Budget Breakdown 2026', 'Planning your Meghalaya trip budget? Here\'s a detailed cost breakdown covering accommodation, transport, food, and activities for different trip durations and travel styles.',
    [
      { heading: 'Trip Cost by Duration', content: 'Average per-person costs:', listItems: ['3-Day Trip: ₹5,000-12,000 (budget to comfort)', '5-Day Trip: ₹8,000-20,000 (budget to comfort)', '7-Day Trip: ₹12,000-30,000 (budget to comfort)', '10-Day Trip: ₹18,000-45,000 (budget to luxury)'] },
      { heading: 'Accommodation Costs', content: 'Stay options and pricing:', listItems: ['Hostel dorm (XTSY): ₹499-699/night', 'Hostel private room: ₹1,499-1,999/night', 'Budget hotel: ₹1,000-2,500/night', 'Mid-range hotel: ₹2,500-5,000/night', 'Luxury/Glamping: ₹5,000-15,000/night'] },
      { heading: 'Transport Costs', content: 'Getting around Meghalaya:', listItems: ['Guwahati to Shillong (shared): ₹500/person', 'Guwahati to Shillong (private): ₹3,500', 'Shillong to Cherrapunji (shared): ₹300', 'Full-day car rental: ₹2,500-5,000', 'Bike rental: ₹500-1,200/day'] },
    ],
    [
      { question: 'Is Meghalaya expensive?', answer: 'Meghalaya is quite affordable compared to Himachal, Goa, or Kerala. Budget travelers can manage on ₹1,500-2,000/day while comfort travelers spend ₹3,000-5,000/day.' },
    ],
    ['meghalaya-backpacking-guide', 'budget-trip-meghalaya'],
    ['meghalaya trip cost', 'meghalaya tour budget', 'how much meghalaya trip costs', 'meghalaya travel expenses']
  ),

  guide('meghalaya-road-trip-guide', 'Meghalaya Road Trip Guide — Routes, Tips & Stops', 'Complete Meghalaya road trip guide. Best routes, road conditions, fuel stops, scenic viewpoints. Self-drive tips for Meghalaya highways.', 'Meghalaya Road Trip Guide — Drive Through the Clouds', 'A road trip through Meghalaya is one of India\'s most scenic driving experiences. Winding mountain roads, lush green valleys, dramatic waterfalls, and friendly villages make every kilometer memorable.',
    [
      { heading: 'Best Road Trip Routes', content: 'Top driving routes in Meghalaya:', listItems: ['Guwahati → Shillong (NH6) — 100 km, 2.5 hrs, scenic Umiam Lake', 'Shillong → Cherrapunji (NH6) — 54 km, 2 hrs, waterfall route', 'Shillong → Dawki — 81 km, 2.5 hrs, valley views', 'Shillong → Jowai → Krang Suri — 64 km, 2 hrs', 'Shillong → Mawphlang — 25 km, 1 hr, forest drive'] },
      { heading: 'Road Conditions', content: 'What to expect on Meghalaya roads: Generally well-maintained on national highways. Some stretches to remote destinations have narrow, winding roads. Monsoon can cause temporary landslides. 4WD recommended for off-beat locations.' },
      { heading: 'Essential Road Trip Tips', content: 'Before you drive:', listItems: ['Carry extra fuel — petrol pumps are sparse on some routes', 'Start early — fog/cloud cover increases by afternoon', 'Drive slow on bends — local trucks share the road', 'Download offline maps — network can be patchy', 'Keep rain gear accessible — weather changes fast'] },
    ],
    [
      { question: 'Can I do a road trip in Meghalaya with a sedan?', answer: 'Major routes (Shillong-Cherrapunji, Shillong-Dawki) are sedan-friendly. For Nongriat, Shnongpdeng, and remote villages, an SUV is recommended.' },
    ],
    ['car-rental-shillong', 'self-drive-car-shillong', 'bike-rental-shillong'],
    ['meghalaya road trip', 'self drive meghalaya', 'road trip to meghalaya', 'driving in meghalaya']
  ),

  guide('backpacking-northeast-india', 'Backpacking Northeast India 2026 — Complete Guide', 'Ultimate backpacking guide to Northeast India. Meghalaya, Assam, Nagaland, Arunachal, Sikkim. Routes, budgets, hostels & tips.', 'Backpacking Northeast India — The Ultimate Guide', 'Northeast India is the final frontier for backpackers in India. This comprehensive guide covers all seven sister states plus Sikkim — routes, budgets, permits, hostels, and insider tips.',
    [
      { heading: 'State-by-State Guide', content: 'Northeast India overview:', listItems: ['Meghalaya — Caves, waterfalls, root bridges (5-7 days)', 'Assam — Kaziranga, Majuli, river cruises (3-5 days)', 'Nagaland — Hornbill Festival, tribal culture (4-6 days)', 'Arunachal Pradesh — Tawang, monasteries (5-7 days, permit needed)', 'Sikkim — Pelling, Gangtok, Gurudongmar (5-7 days, permit needed)', 'Manipur — Loktak Lake, INA Museum (3-4 days)', 'Tripura — Ujjayanta Palace, Unakoti (2-3 days)'] },
      { heading: 'Permit Requirements', content: 'Some states require permits:', listItems: ['Arunachal Pradesh — Inner Line Permit (apply online)', 'Nagaland — Inner Line Permit (apply online)', 'Sikkim — Restricted Area Permit for North Sikkim', 'Meghalaya — No permit required for Indians', 'Assam — No permit required'] },
      { heading: 'Budget Overview', content: 'Northeast India is remarkably affordable. Budget travelers can explore on ₹1,500-2,500/day covering hostel stay, local food, and shared transport.' },
    ],
    [
      { question: 'Is Northeast India safe for solo travelers?', answer: 'Yes! Northeast India is among the safest regions in India for solo travelers, including women. People are incredibly friendly and helpful.' },
      { question: 'What is the best time for Northeast India?', answer: 'October to April is ideal for most states. Nagaland\'s Hornbill Festival is in December. Avoid June-August for heavy monsoon.' },
    ],
    ['meghalaya-backpacking-guide', 'meghalaya-trip-cost'],
    ['backpacking northeast india', 'northeast india travel guide', 'seven sisters travel', 'northeast india trip']
  ),

  guide('how-to-reach-shillong', 'How to Reach Shillong — Flights, Trains, Buses & Taxis', 'Complete guide on how to reach Shillong from anywhere in India. Flight routes, train options, bus services, taxi booking & travel tips.', 'How to Reach Shillong — Complete Transport Guide', 'Planning to visit Shillong? Here\'s everything you need to know about reaching Meghalaya\'s capital, whether you\'re coming from Delhi, Kolkata, Mumbai, or nearby Guwahati.',
    [
      { heading: 'By Air', content: 'Flight options to reach Shillong:', listItems: ['Nearest major airport: LGBI Airport, Guwahati (124 km)', 'Shillong Airport (Umroi) — limited flights from Kolkata', 'Helicopter service: Guwahati to Shillong (30 min)', 'Airlines: IndiGo, SpiceJet, Air India from major cities'] },
      { heading: 'By Road from Guwahati', content: 'Most common route:', listItems: ['Distance: 100 km via NH6', 'Shared Sumo/Taxi: ₹500/person (3 hours)', 'Private Taxi: ₹3,000-3,500 (2.5 hours)', 'XTSY Airport Pickup: ₹3,500 (door-to-door)', 'Meghalaya Transport buses: ₹250 (4 hours)'] },
      { heading: 'By Train', content: 'Nearest railway station is Guwahati. Trains from Delhi (Rajdhani Express), Kolkata, and other major cities arrive at Guwahati. From there, take a taxi to Shillong.' },
    ],
    [
      { question: 'Is there a direct flight to Shillong?', answer: 'Shillong\'s Umroi Airport has limited flights. Most travelers fly to Guwahati and drive 2.5 hours to Shillong.' },
      { question: 'What is the cheapest way to reach Shillong?', answer: 'Fly to Guwahati, then take a shared Sumo/taxi for ₹500. Total journey time from Guwahati airport to Shillong is about 3 hours.' },
    ],
    ['places-to-stay-shillong', 'backpacker-hostel-shillong'],
    ['how to reach shillong', 'shillong travel', 'guwahati to shillong', 'flights to shillong']
  ),

  guide('shillong-travel-guide', 'Shillong Travel Guide 2026 — Scotland of the East', 'Complete Shillong travel guide. Top attractions, food, nightlife, shopping, weather, transport. Everything you need for your Shillong trip.', 'Shillong Travel Guide 2026 — Scotland of the East', 'Known as the "Scotland of the East," Shillong is a charming hill station that serves as the gateway to Meghalaya. This comprehensive guide covers everything from attractions and food to nightlife and shopping.',
    [
      { heading: 'Top Attractions in Shillong', content: 'Must-visit places in and around Shillong:', listItems: ['Shillong Peak — Panoramic views of the city', 'Elephant Falls — Iconic three-tiered waterfall', 'Laitlum Canyons — Dramatic cliff viewpoints', 'Ward\'s Lake — Beautiful botanical garden', 'Don Bosco Museum — Northeast India culture', 'Police Bazaar — Shopping & street food', 'Umiam Lake — Kayaking & boating'] },
      { heading: 'Food & Dining', content: 'Shillong\'s food scene:', listItems: ['TAB Bistro (XTSY) — Forest dining with multi-cuisine menu', 'Police Bazaar street food — Momos, noodles, kebabs', 'Café Shillong — Live music & coffee', 'City Hut Dhaba — Local Khasi food', 'ML 05 Café — Artisan coffee'] },
      { heading: 'Nightlife & Music', content: 'Shillong is the rock capital of India! Live music venues, cafés with performances, and a vibrant nightlife scene make evenings exciting.' },
      { heading: 'Weather & What to Pack', content: 'Shillong has pleasant weather year-round. Summer (Apr-Jun): 15-25°C. Monsoon (Jul-Sep): Heavy rain, 18-23°C. Winter (Nov-Feb): 4-15°C. Pack layers, rain gear, and comfortable walking shoes.' },
    ],
    [
      { question: 'How many days do I need in Shillong?', answer: '2-3 days for Shillong city. Add 2-3 more days for day trips to Cherrapunji, Dawki, and other destinations.' },
    ],
    ['places-to-visit-meghalaya', 'how-to-reach-shillong', 'backpacker-hostel-shillong'],
    ['shillong travel guide', 'shillong tourism', 'shillong tourist guide', 'visiting shillong']
  ),

  guide('cherrapunji-travel-guide', 'Cherrapunji Travel Guide 2026 — Wettest Place on Earth', 'Complete Cherrapunji (Sohra) travel guide. Top waterfalls, caves, root bridges. How to reach, where to stay, best time to visit.', 'Cherrapunji Travel Guide — The Wettest Place on Earth', 'Cherrapunji (officially Sohra) is famous as the wettest place on Earth and home to stunning waterfalls, ancient caves, and the legendary living root bridges. Here\'s your complete travel guide.',
    [
      { heading: 'Top Attractions', content: 'Must-visit in Cherrapunji:', listItems: ['Nohkalikai Falls — India\'s tallest plunge waterfall (340m)', 'Seven Sisters Falls — Seven streams cascading down', 'Mawsmai Cave — Illuminated limestone cave walk', 'Double Decker Root Bridge — Living root bridge marvel', 'Eco Park — Stunning canyon viewpoints', 'Thangkharang Park — Cliff-edge views of Bangladesh'] },
      { heading: 'How to Reach', content: 'Getting to Cherrapunji:', listItems: ['From Shillong: 54 km, 2 hours by car', 'Shared Sumo from Shillong: ₹300/person', 'Private car rental: ₹3,500 (day trip)', 'XTSY organized day trips: ₹2,500/person all-inclusive'] },
    ],
    [
      { question: 'Is Cherrapunji still the wettest place?', answer: 'Mawsynram, a village near Cherrapunji, now holds the record. But Cherrapunji remains incredibly wet during monsoon and is the more accessible destination.' },
    ],
    ['shillong-travel-guide', 'dawki-river-travel-guide', 'cherrapunji-tour-package'],
    ['cherrapunji travel guide', 'cherrapunjee guide', 'sohra travel guide', 'visiting cherrapunji']
  ),

  guide('dawki-river-travel-guide', 'Dawki River Travel Guide — Crystal Clear Umngot River', 'Complete guide to Dawki and Umngot River. Boating, swimming, camping at Shnongpdeng. How to reach, best time, costs & tips.', 'Dawki & Umngot River Travel Guide', 'Dawki\'s Umngot River is famous for its crystal-clear water where boats appear to float in mid-air. This guide covers everything about visiting Dawki, from boating to camping at Shnongpdeng.',
    [
      { heading: 'Dawki Highlights', content: 'What to do at Dawki:', listItems: ['Umngot River boating (₹800-1,200/boat, 30 min)', 'Shnongpdeng camping & water sports', 'Cliff jumping & zip-lining', 'India-Bangladesh border viewpoint', 'Riverside photography', 'Combined visit with Mawlynnong village'] },
      { heading: 'Best Time to Visit', content: 'October to March: Crystal-clear water, perfect for boating. April to June: Warm weather, less crowded. July to September: Monsoon, water level high, limited boating.' },
    ],
    [
      { question: 'Can you swim in Dawki river?', answer: 'Yes! Swimming is allowed at Shnongpdeng (near Dawki). The river has gentle currents in the dry season. Always wear a life jacket.' },
    ],
    ['cherrapunji-travel-guide', 'shnongpdeng-camping-guide', 'dawki-tour-package'],
    ['dawki river guide', 'umngot river travel', 'dawki boating', 'crystal clear river india']
  ),

  guide('budget-trip-meghalaya', 'Budget Trip to Meghalaya — Complete Guide Under ₹10K', 'How to plan a budget trip to Meghalaya under ₹10,000. Cheap transport, hostels, free attractions. Complete 5-day budget itinerary.', 'Budget Trip to Meghalaya — Under ₹10,000', 'Yes, you can explore Meghalaya on a tight budget! This guide shows you how to plan an amazing 5-day trip for under ₹10,000 including stay, food, transport, and attractions.',
    [
      { heading: '5-Day Budget Itinerary (Under ₹10K)', content: 'Day-by-day budget plan:', listItems: ['Day 1: Guwahati → Shillong (shared Sumo ₹500) → XTSY dorm (₹499)', 'Day 2: Shillong Peak, Elephant Falls, Laitlum (free entry) — Transport ₹400', 'Day 3: Cherrapunji day trip (shared Sumo ₹600) — Entry ₹200', 'Day 4: Dawki + Mawlynnong (shared transport ₹700)', 'Day 5: Local markets → Departure (shared Sumo ₹500)'] },
      { heading: 'Budget Breakdown', content: 'Total 5-day cost:', listItems: ['Accommodation (4 nights XTSY dorm): ₹2,000', 'Transport (shared): ₹2,700', 'Food (budget): ₹2,000', 'Entry fees & activities: ₹1,000', 'Miscellaneous: ₹800', 'TOTAL: ~₹8,500'] },
    ],
    [
      { question: 'Can I visit Meghalaya in ₹10,000?', answer: 'Absolutely! With hostel dorms at ₹499, shared transport, and budget eating, a 5-day Meghalaya trip costs under ₹10,000.' },
    ],
    ['meghalaya-backpacking-guide', 'meghalaya-trip-cost', 'cheap-hostel-shillong'],
    ['budget trip meghalaya', 'cheap meghalaya tour', 'meghalaya in budget', 'meghalaya trip under 10000']
  ),

  guide('meghalaya-itinerary-planning', 'Meghalaya Itinerary Planning — 3 to 10 Day Plans', 'Plan your perfect Meghalaya itinerary. Day-by-day plans for 3, 5, 7, 10-day trips. Routes, timings, and booking tips. Updated for 2026.', 'Meghalaya Itinerary Planning Guide — 3 to 10 Days', 'Not sure how to plan your Meghalaya trip? This guide provides ready-made itineraries for 3-day weekends to 10-day adventures, with flexible options for every travel style.',
    [
      { heading: '3-Day Itinerary (Weekend)', content: 'Quick Shillong experience:', listItems: ['Day 1: Arrive → Shillong Peak → Police Bazaar', 'Day 2: Elephant Falls → Laitlum → Mawphlang', 'Day 3: Ward\'s Lake → Shopping → Departure'] },
      { heading: '5-Day Itinerary (Most Popular)', content: 'Covers all highlights:', listItems: ['Day 1-2: Shillong sightseeing', 'Day 3: Cherrapunji day trip', 'Day 4: Dawki + Mawlynnong', 'Day 5: Leisure → Departure'] },
      { heading: '7-Day Itinerary (Complete)', content: 'The full Meghalaya experience:', listItems: ['Day 1-2: Shillong exploration', 'Day 3: Cherrapunji waterfalls', 'Day 4-5: Nongriat trek (Root Bridge)', 'Day 6: Dawki + Shnongpdeng', 'Day 7: Mawlynnong → Departure'] },
      { heading: '10-Day Itinerary (Explorer)', content: 'Off the beaten path:', listItems: ['Day 1-3: Shillong + surroundings', 'Day 4-5: Cherrapunji + Nongriat', 'Day 6-7: Dawki + Shnongpdeng camping', 'Day 8: Jowai + Krang Suri Falls', 'Day 9: Mawryngkhang Bamboo Trail', 'Day 10: Leisure → Departure'] },
    ],
    [
      { question: 'What is the ideal duration for Meghalaya?', answer: '5-7 days is ideal to cover the major highlights without rushing. If you have 3 days, focus on Shillong and either Cherrapunji or Dawki.' },
    ],
    ['meghalaya-tour-package-5-days', 'meghalaya-tour-package-7-days'],
    ['meghalaya itinerary', 'meghalaya trip plan', 'how to plan meghalaya trip', 'meghalaya days planning']
  ),

  guide('things-to-do-meghalaya', 'Things to Do in Meghalaya — 50 Best Experiences', 'Top 50 things to do in Meghalaya. Adventure sports, waterfall trekking, cave exploration, cultural experiences. Complete activity guide.', 'Things to Do in Meghalaya — Top 50 Experiences', 'Meghalaya offers an incredible range of activities from gentle nature walks to extreme cliff jumping. This guide covers the 50 best things to do in the Abode of Clouds.',
    [
      { heading: 'Adventure Activities', content: 'For thrill seekers:', listItems: ['Trek to Double Decker Root Bridge (Nongriat)', 'Cliff jumping at Shnongpdeng', 'Zip-lining over Umngot River', 'Cave exploration at Mawsmai & Arwah', 'Mawryngkhang Bamboo Trail (scariest trail!)', 'Kayaking at Umiam Lake', 'Waterfall rappelling', 'Camping under stars'] },
      { heading: 'Nature & Sightseeing', content: 'For nature lovers:', listItems: ['Boating on crystal-clear Dawki river', 'Sunrise at Laitlum Canyons', 'Visit Asia\'s cleanest village (Mawlynnong)', 'Explore Mawphlang Sacred Forest', 'Photography at Nohkalikai Falls', 'Swim at Krang Suri Falls blue lagoon'] },
      { heading: 'Culture & Food', content: 'Cultural experiences:', listItems: ['Try traditional Khasi cuisine (Jadoh, Tungrymbai)', 'Visit Don Bosco Museum', 'Attend Nongkrem Dance Festival (November)', 'Shop at Iewduh (Bara Bazaar)', 'Learn archery — Shillong Teer game', 'Live music at Shillong cafés'] },
    ],
    [
      { question: 'What are the must-do activities in Meghalaya?', answer: 'Top 5: 1) Root Bridge trek, 2) Dawki boating, 3) Laitlum sunrise, 4) Mawsmai Cave, 5) Shnongpdeng cliff jumping.' },
    ],
    ['places-to-visit-meghalaya', 'meghalaya-adventure-package'],
    ['things to do in meghalaya', 'meghalaya activities', 'what to do meghalaya', 'meghalaya experiences']
  ),

  guide('meghalaya-monsoon-travel-guide', 'Meghalaya in Monsoon — Rainy Season Travel Guide', 'Is monsoon good for Meghalaya? Complete guide to visiting Meghalaya during rainy season. Waterfall peaks, road safety, what to pack.', 'Meghalaya Monsoon Travel Guide — Rainy Season Magic', 'Monsoon transforms Meghalaya into a waterfall wonderland. While challenging, visiting during June-September offers the most spectacular waterfall views and lush green landscapes.',
    [
      { heading: 'Why Visit in Monsoon', content: 'Monsoon advantages:', listItems: ['Waterfalls at full force — Nohkalikai, Seven Sisters', 'Lush green everything — picture-perfect landscapes', 'Fewer tourists — peaceful experience', 'Lower prices — off-season discounts', 'Unique cloud experiences — literally inside clouds'] },
      { heading: 'Monsoon Precautions', content: 'Stay safe during rains:', listItems: ['Carry waterproof bags & rain gear', 'Avoid river activities when water level is high', 'Check road conditions before travel', 'Keep buffer days for weather delays', 'Wear anti-skid shoes for treks'] },
    ],
    [
      { question: 'Is it safe to visit Meghalaya during monsoon?', answer: 'Generally yes, but with precautions. Avoid river sports, check road conditions daily, and carry rain gear. Some remote treks may be closed.' },
    ],
    ['meghalaya-backpacking-guide', 'cherrapunji-travel-guide'],
    ['meghalaya monsoon', 'meghalaya rainy season', 'meghalaya in june', 'meghalaya in july']
  ),

  guide('shnongpdeng-camping-guide', 'Shnongpdeng Camping Guide — Adventure on Umngot River', 'Complete Shnongpdeng camping guide. Riverside camping, cliff jumping, zip-lining, kayaking. Packages, costs & what to carry.', 'Shnongpdeng Camping Guide — River Adventure', 'Shnongpdeng is Meghalaya\'s adventure paradise, located on the banks of the crystal-clear Umngot River. This guide covers camping, water sports, and everything you need for an unforgettable experience.',
    [
      { heading: 'Activities at Shnongpdeng', content: 'Adventure sports available:', listItems: ['Cliff jumping (various heights)', 'Zip-lining over Umngot River', 'Kayaking & snorkeling', 'River swimming', 'Scuba diving (seasonal)', 'Bonfire & stargazing camping'] },
      { heading: 'Camping Options', content: 'Where to stay:', listItems: ['Riverside tent camping — ₹1,500-2,500/night', 'Basic huts — ₹1,000-1,500/night', 'Or stay at XTSY Shillong & do a day trip', 'XTSY overnight camping package — ₹3,500 (all activities included)'] },
    ],
    [
      { question: 'Is Shnongpdeng safe for camping?', answer: 'Yes! Professional camping operators maintain the sites. Activities have safety gear and trained instructors. Avoid swimming in monsoon when water levels rise.' },
    ],
    ['dawki-river-travel-guide', 'meghalaya-adventure-package', 'camping-in-meghalaya'],
    ['shnongpdeng camping', 'shnongpdeng adventure', 'camping near dawki', 'shnongpdeng activities']
  ),
];

// ============================================================================
// CATEGORY 7: DESTINATIONS (20+ pages)
// ============================================================================

const destinationPages: SEOPageData[] = [
  destination('shillong-guide', 'Shillong — The Scotland of the East | Complete Guide', 'Complete Shillong guide. Attractions, food, nightlife, weather, transport. Where to stay, what to eat, how to explore. Updated 2026.', 'Shillong — Scotland of the East', 'Shillong, the charming capital of Meghalaya, is known as the Scotland of the East for its rolling hills, pleasant climate, and colonial architecture. A complete guide to exploring this vibrant hill station.',
    [
      { heading: 'Why Visit Shillong', content: 'Shillong offers a unique blend of nature, culture, and adventure:', listItems: ['Pleasant weather year-round (10-25°C)', 'Gateway to Cherrapunji, Dawki, and other attractions', 'Vibrant music & café culture', 'Delicious local Khasi cuisine', 'Affordable travel destination'] },
      { heading: 'When to Visit', content: 'October to April: Best weather. March-May: Cherry blossoms & pleasant. June-September: Monsoon, lush green. December-January: Cold but festive.' },
    ],
    [
      { question: 'Is Shillong worth visiting?', answer: 'Absolutely! Shillong combines natural beauty, cultural richness, and a vibrant social scene. It\'s also the perfect base for exploring all of Meghalaya.' },
    ],
    ['shillong-travel-guide', 'places-to-stay-shillong', 'how-to-reach-shillong'],
    ['shillong', 'shillong meghalaya', 'shillong city guide', 'visit shillong']
  ),

  destination('cherrapunji-guide', 'Cherrapunji (Sohra) — Wettest Place on Earth | Guide', 'Complete Cherrapunji guide. Nohkalikai Falls, Root Bridges, caves. How to reach, where to stay, what to see. Day trip from Shillong.', 'Cherrapunji (Sohra) — Where Rain Meets Wonder', 'Cherrapunji, now officially known as Sohra, is famous as one of the wettest places on Earth. Home to India\'s tallest waterfall and ancient living root bridges.',
    [
      { heading: 'Key Attractions', content: 'Top places in Cherrapunji:', listItems: ['Nohkalikai Falls — 340m, India\'s tallest plunge waterfall', 'Double Decker Root Bridge — Nongriat trek', 'Mawsmai Cave — Walk-through limestone cave', 'Seven Sisters Falls — Seasonal waterfall', 'Eco Park — Canyon viewpoints', 'Arwah Cave — Ancient fossil cave'] },
    ],
    [
      { question: 'How far is Cherrapunji from Shillong?', answer: '54 km, approximately 2 hours by car. Best visited as a day trip from Shillong.' },
    ],
    ['cherrapunji-travel-guide', 'cherrapunji-tour-package'],
    ['cherrapunji', 'sohra meghalaya', 'cherrapunjee guide', 'wettest place earth']
  ),

  destination('dawki-guide', 'Dawki — Crystal Clear Umngot River | Travel Guide', 'Dawki travel guide. Crystal-clear Umngot River boating, Shnongpdeng, India-Bangladesh border. How to reach, best time, costs.', 'Dawki — Home of India\'s Clearest River', 'Dawki is a small border town in Meghalaya famous for the Umngot River, whose crystal-clear water makes boats appear to float in mid-air. A must-visit destination for every Meghalaya traveler.',
    [
      { heading: 'What to Do in Dawki', content: 'Dawki experiences:', listItems: ['Boat ride on Umngot River (₹800-1,200)', 'Visit India-Bangladesh border', 'Shnongpdeng adventure sports', 'Photography — boats floating on clear water', 'Riverside camping'] },
    ],
    [
      { question: 'When is the water clearest at Dawki?', answer: 'November to February offers the clearest water conditions. The river is stunning year-round but monsoon makes it slightly turbid.' },
    ],
    ['dawki-river-travel-guide', 'dawki-tour-package'],
    ['dawki', 'dawki meghalaya', 'umngot river dawki', 'dawki boat ride']
  ),

  destination('mawlynnong-guide', 'Mawlynnong — Asia\'s Cleanest Village | Guide', 'Visit Mawlynnong, Asia\'s cleanest village. Living root bridge, sky platform, Khasi culture. Day trip from Shillong. Complete guide.', 'Mawlynnong — Asia\'s Cleanest Village', 'Mawlynnong earned the title of Asia\'s cleanest village and remains a model of community-driven cleanliness. Visit the living root bridge, climb the bamboo sky platform, and experience authentic Khasi village life.',
    [
      { heading: 'Village Highlights', content: 'What to see in Mawlynnong:', listItems: ['Community-maintained cleanliness system', 'Living Root Bridge walk', 'Bamboo Sky Platform — views to Bangladesh', 'Traditional Khasi homes & gardens', 'Balancing Rock formation', 'Local Khasi food experience'] },
    ],
    [
      { question: 'Is Mawlynnong worth visiting?', answer: 'Yes! The 30-minute walk through the village is charming. Combined with Dawki (30 minutes away), it makes a perfect day trip from Shillong.' },
    ],
    ['dawki-guide', 'homestay-in-mawlynnong'],
    ['mawlynnong', 'cleanest village asia', 'mawlynnong village', 'mawlynnong meghalaya']
  ),
];

// ============================================================================
// CATEGORY 8: ATTRACTIONS (30+ pages)
// ============================================================================

const attractionPages: SEOPageData[] = [
  attraction('nohkalikai-falls-guide', 'Nohkalikai Falls — India\'s Tallest Waterfall | Guide', 'Complete guide to Nohkalikai Falls, India\'s tallest plunge waterfall (340m). How to visit, best time, entry fee, viewpoint tips.', 'Nohkalikai Falls — India\'s Tallest Plunge Waterfall', 'At 340 meters, Nohkalikai Falls is India\'s tallest plunge waterfall, plunging into a stunning turquoise pool. Located near Cherrapunji, it\'s one of Meghalaya\'s most iconic attractions.',
    [
      { heading: 'Visitor Information', content: 'Plan your visit:', listItems: ['Location: 7 km from Cherrapunji town', 'Entry fee: ₹50/person', 'Best time: Post-monsoon (Oct-Dec) for best flow', 'Time needed: 1-2 hours', 'Viewpoint is well-maintained & accessible', 'Photography tip: Visit in morning for best light'] },
    ],
    [
      { question: 'Can you swim at Nohkalikai Falls?', answer: 'No, swimming is not possible at the base. The falls plunge into a deep pool far below the viewpoint. You can view from the top viewpoint.' },
    ],
    ['cherrapunji-travel-guide', 'waterfalls-in-meghalaya'],
    ['nohkalikai falls', 'tallest waterfall india', 'nohkalikai falls cherrapunji', 'nohkalikai falls guide']
  ),

  attraction('living-root-bridge-trek', 'Living Root Bridge Trek — Double Decker Root Bridge', 'Complete guide to the Living Root Bridge trek in Meghalaya. Nongriat Double Decker Root Bridge. Trail details, difficulty, what to carry.', 'Living Root Bridge Trek — Nongriat Trail', 'The living root bridges of Meghalaya are among the world\'s most unique natural wonders. Created by the Khasi people over centuries, these bridges grow stronger with time. The Double Decker at Nongriat is the most famous.',
    [
      { heading: 'Trek Details', content: 'Nongriat Trek information:', listItems: ['Trailhead: Tyrna village (near Cherrapunji)', 'Distance: ~3.5 km one way', 'Steps: ~3,500 (down and up)', 'Difficulty: Moderate to challenging', 'Time: 3-4 hours one way', 'Overnight stay recommended at Nongriat'] },
      { heading: 'What to Carry', content: 'Essential trekking gear:', listItems: ['2 liters water minimum', 'Trail shoes with good grip', 'Rain jacket/poncho', 'Snacks & energy bars', 'Small backpack (not suitcase!)', 'Camera/phone waterproof case'] },
    ],
    [
      { question: 'How difficult is the root bridge trek?', answer: 'Moderate difficulty. The 3,500 steps are the main challenge. Going down is easier but coming back up requires stamina. Most reasonably fit people complete it in 6-8 hours round trip.' },
    ],
    ['trekking-in-meghalaya', 'nongjrong-tour-package', 'meghalaya-adventure-package'],
    ['living root bridge trek', 'double decker root bridge', 'nongriat trek', 'root bridge meghalaya']
  ),

  attraction('laitlum-canyons-guide', 'Laitlum Canyons — Shillong\'s Best Viewpoint | Guide', 'Complete Laitlum Canyons guide. How to reach, best time for sunrise, trekking route. Free entry, 22 km from Shillong. Photography tips.', 'Laitlum Canyons — The End of Hills', 'Laitlum, meaning "end of hills" in Khasi, offers some of the most dramatic cliff-edge views in Northeast India. This free attraction is just 22 km from Shillong and is a must for every Meghalaya visitor.',
    [
      { heading: 'Visiting Laitlum', content: 'Everything you need to know:', listItems: ['Distance from Shillong: 22 km (1 hour)', 'Entry fee: Free', 'Best time: Sunrise or late afternoon', 'Trekking: Optional 2-hour canyon trek', 'Photography: Stunning cloud & valley views', 'Food: Small shops near viewpoint'] },
    ],
    [
      { question: 'Is Laitlum Canyons free?', answer: 'Yes! Laitlum Canyons has no entry fee, making it one of the best free attractions in Meghalaya.' },
    ],
    ['shillong-travel-guide', 'places-to-visit-meghalaya'],
    ['laitlum canyons', 'laitlum canyon shillong', 'laitlum viewpoint', 'best viewpoint shillong']
  ),

  attraction('krang-suri-falls-guide', 'Krang Suri Falls — Blue Lagoon of Meghalaya | Guide', 'Krang Suri Falls travel guide. Swimming in blue lagoon, how to reach from Shillong, entry fee, best time. Hidden gem of Jaintia Hills.', 'Krang Suri Falls — Meghalaya\'s Blue Lagoon', 'Krang Suri Falls in Jaintia Hills is famous for its stunning turquoise blue pool where visitors can swim. One of Meghalaya\'s most beautiful and Instagram-worthy attractions.',
    [
      { heading: 'Visitor Information', content: 'Plan your Krang Suri visit:', listItems: ['Location: Jaintia Hills, 85 km from Shillong', 'Entry fee: ₹50 + ₹20 camera fee', 'Drive time: 2.5 hours from Shillong', 'Swimming: Allowed in the blue lagoon pool', 'Best time: October-April (clear water)', 'Time needed: 2-3 hours'] },
    ],
    [
      { question: 'Can you swim at Krang Suri Falls?', answer: 'Yes! Swimming is the highlight. The blue lagoon pool beneath the falls is safe for swimming. Life jackets are available for rent.' },
    ],
    ['waterfalls-in-meghalaya', 'meghalaya-adventure-package'],
    ['krang suri falls', 'krang suri falls meghalaya', 'blue lagoon meghalaya', 'swimming waterfall meghalaya']
  ),

  attraction('elephant-falls-guide', 'Elephant Falls Shillong — Three-Tiered Waterfall', 'Elephant Falls guide. Shillong\'s most popular waterfall with three tiers. Entry fee ₹20, 12 km from city. How to reach, tips.', 'Elephant Falls — Shillong\'s Iconic Waterfall', 'Elephant Falls is Shillong\'s most visited waterfall, featuring three beautiful tiers surrounded by lush greenery. Located just 12 km from Shillong, it\'s an easy half-day excursion.',
    [
      { heading: 'Visit Details', content: 'Quick guide:', listItems: ['Location: 12 km from Shillong city', 'Entry fee: ₹20/person', 'Three distinct tiers to explore', 'Well-maintained steps & pathways', 'Time needed: 45 minutes to 1 hour', 'Best combined with Shillong Peak visit'] },
    ],
    [
      { question: 'Why is it called Elephant Falls?', answer: 'The British named it after an elephant-shaped rock near the falls. Though the rock was destroyed in a 1897 earthquake, the name persists.' },
    ],
    ['shillong-travel-guide', 'waterfalls-in-meghalaya'],
    ['elephant falls shillong', 'elephant falls', 'waterfalls near shillong', 'elephant falls entry fee']
  ),

  attraction('wei-sawdong-falls-guide', 'Wei Sawdong Falls — Three-Tiered Hidden Gem', 'Wei Sawdong Falls guide. Three-tiered waterfall near Cherrapunji. Trek route, difficulty, best time. One of Meghalaya\'s most beautiful.', 'Wei Sawdong Falls — Meghalaya\'s Hidden Three-Tiered Gem', 'Wei Sawdong Falls is a stunning three-tiered waterfall near Cherrapunji, often considered more beautiful than its more famous neighbors. The trek to the base offers a rewarding adventure.',
    [
      { heading: 'Trek & Visit Details', content: 'What to know:', listItems: ['Location: Near Cherrapunji (Sohra)', 'Trek difficulty: Moderate (steel ladders & steps)', 'Time: 1.5-2 hours round trip', 'Best tier: Third tier (most photogenic)', 'Swimming: Possible at the pool below', 'Best time: October-March'] },
    ],
    [
      { question: 'How difficult is the Wei Sawdong trek?', answer: 'Moderate. Involves climbing down steel ladders and stone steps. Shoes with good grip are essential. Not suitable for those with vertigo.' },
    ],
    ['waterfalls-in-meghalaya', 'cherrapunji-travel-guide'],
    ['wei sawdong falls', 'wei sawdong waterfall', 'hidden waterfall meghalaya', 'three tier waterfall cherrapunji']
  ),

  attraction('rainbow-falls-guide', 'Rainbow Falls Meghalaya — Nongriat Trek Guide', 'Rainbow Falls trek guide. Located beyond Double Decker Root Bridge in Nongriat. Trail details, difficulty, best time for rainbow.', 'Rainbow Falls — Beyond the Double Decker Root Bridge', 'Rainbow Falls is a stunning waterfall accessible only by extending the Nongriat trek beyond the Double Decker Root Bridge. Named for the rainbow that forms in its spray, it\'s one of Meghalaya\'s most rewarding treks.',
    [
      { heading: 'Trek to Rainbow Falls', content: 'From Double Decker Root Bridge:', listItems: ['Additional 1 hour walk from DDRB', 'Trail goes through dense forest', 'River crossings on foot', 'Rainbow visible: 9-11 AM (sunny days)', 'Swimming possible at the base pool', 'Overnight at Nongriat recommended'] },
    ],
    [
      { question: 'When can you see the rainbow?', answer: 'The rainbow appears between 9-11 AM on sunny days when sunlight hits the waterfall spray at the right angle. Visit in dry season for best chances.' },
    ],
    ['living-root-bridge-trek', 'meghalaya-adventure-package'],
    ['rainbow falls meghalaya', 'rainbow falls nongriat', 'rainbow waterfall trek', 'rainbow falls trek guide']
  ),
];

// ============================================================================
// CATEGORY 9: ACTIVITIES (20+ pages)
// ============================================================================

const activityPages: SEOPageData[] = [
  activity('waterfalls-in-meghalaya', 'Waterfalls in Meghalaya — 20 Most Beautiful Falls', 'Guide to 20 most beautiful waterfalls in Meghalaya. Nohkalikai, Elephant Falls, Krang Suri, Wei Sawdong, Seven Sisters & more.', 'Waterfalls in Meghalaya — 20 Most Beautiful', 'Meghalaya is India\'s waterfall capital with hundreds of cascading falls across the state. From India\'s tallest plunge waterfall to hidden swimming holes, here are the 20 most stunning waterfalls.',
    [
      { heading: 'Top 20 Waterfalls', content: 'Meghalaya\'s best waterfalls:', listItems: ['1. Nohkalikai Falls (340m) — India\'s tallest plunge', '2. Krang Suri Falls — Blue lagoon swimming', '3. Wei Sawdong Falls — Three-tiered beauty', '4. Elephant Falls — Shillong\'s iconic falls', '5. Seven Sisters Falls — Seven parallel streams', '6. Rainbow Falls — Trek to see the rainbow', '7. Noh Ka Likai (Upper tier)', '8. Dainthlen Falls — Legend of the snake', '9. Sweet Falls — Near Shillong city', '10. Spread Eagle Falls — Easy access'] },
    ],
    [
      { question: 'Which is the best waterfall in Meghalaya?', answer: 'Nohkalikai Falls is the most iconic, but Krang Suri Falls (for swimming) and Wei Sawdong Falls (for photography) are equally stunning experiences.' },
    ],
    ['nohkalikai-falls-guide', 'krang-suri-falls-guide', 'wei-sawdong-falls-guide'],
    ['waterfalls in meghalaya', 'meghalaya waterfalls', 'best waterfalls meghalaya', 'waterfall list meghalaya']
  ),

  activity('caves-in-meghalaya', 'Caves in Meghalaya — Explore Underground Wonders', 'Guide to caves in Meghalaya. Mawsmai Cave, Arwah Cave, Krem Mawmluh, Krem Liat Prah. Caving tours, difficulty, entry fees.', 'Caves in Meghalaya — Underground Wonders', 'Meghalaya has the longest cave system in South Asia with over 1,500 known caves. From easy walk-through caves to extreme caving adventures, here\'s your complete cave guide.',
    [
      { heading: 'Popular Caves', content: 'Accessible caves for tourists:', listItems: ['Mawsmai Cave — Illuminated, walk-through (easy)', 'Arwah Cave — Fossil cave with ancient formations', 'Krem Mawmluh — India\'s 4th longest cave', 'Krem Liat Prah — India\'s longest cave (31 km)', 'Siju Cave — Home to rare bats', 'Krem Dam — Underground river cave'] },
      { heading: 'Caving Adventure Tours', content: 'For serious cavers, XTSY organizes guided caving expeditions to less-explored caves with proper equipment and experienced local guides.' },
    ],
    [
      { question: 'Is Mawsmai Cave scary?', answer: 'Not at all! Mawsmai Cave is well-lit, has concrete pathways, and takes just 20-30 minutes to walk through. Very family-friendly.' },
    ],
    ['meghalaya-adventure-package', 'cherrapunji-travel-guide'],
    ['caves in meghalaya', 'meghalaya caves', 'mawsmai cave', 'caving meghalaya']
  ),

  activity('trekking-in-meghalaya', 'Trekking in Meghalaya — Best Trails & Treks 2026', 'Best trekking trails in Meghalaya. Nongriat root bridge, Laitlum, David Scott Trail, Mawryngkhang. Difficulty levels, guides & tips.', 'Trekking in Meghalaya — Best Trails & Treks', 'Meghalaya offers some of India\'s most unique trekking experiences — from living root bridge trails to bamboo walkways and canyon hikes. Here are the best treks for every fitness level.',
    [
      { heading: 'Best Treks by Difficulty', content: 'Treks for every level:', listItems: ['Easy: Laitlum Canyon trek (2 hours)', 'Easy: Mawphlang Sacred Forest (1 hour)', 'Moderate: Nongriat Root Bridge (6-8 hours round)', 'Moderate: David Scott Trail (16 km heritage path)', 'Hard: Mawryngkhang Bamboo Trail (extreme!)', 'Hard: Rainbow Falls extension (full day)'] },
    ],
    [
      { question: 'Do I need a guide for trekking in Meghalaya?', answer: 'For Nongriat and remote treks, a guide is recommended. For Laitlum and Mawphlang, the trails are well-marked and guides are optional.' },
    ],
    ['living-root-bridge-trek', 'meghalaya-adventure-package'],
    ['trekking in meghalaya', 'meghalaya treks', 'hiking meghalaya', 'best treks northeast india']
  ),

  activity('camping-in-meghalaya', 'Camping in Meghalaya — Best Campsites & Experiences', 'Best camping sites in Meghalaya. Shnongpdeng riverside, Mawphanlur lake, Nongriat forest. Camping packages, gear, tips & costs.', 'Camping in Meghalaya — Under the Stars', 'Meghalaya\'s diverse landscapes offer incredible camping experiences — from riverside camping at Shnongpdeng to lakeside camping at Mawphanlur and forest camping near Nongriat.',
    [
      { heading: 'Top Camping Sites', content: 'Best places to camp:', listItems: ['Shnongpdeng — Riverside camping on Umngot River', 'Mawphanlur — Lake-side camping', 'Nongriat — Forest camping near Root Bridges', 'Krang Suri — Waterfall camping', 'Laitlum — Canyon edge camping (organized by XTSY)'] },
      { heading: 'XTSY Camping Packages', content: 'We organize camping trips with all gear, guides, and meals included. Starting from ₹2,500/person.' },
    ],
    [
      { question: 'Do I need to carry camping gear?', answer: 'XTSY provides all camping gear — tents, sleeping bags, mats, and basic cooking equipment. Just carry personal essentials.' },
    ],
    ['shnongpdeng-camping-guide', 'meghalaya-adventure-package'],
    ['camping in meghalaya', 'camping meghalaya', 'best campsites meghalaya', 'riverside camping meghalaya']
  ),

  activity('kayaking-meghalaya', 'Kayaking in Meghalaya — Umiam Lake & Umngot River', 'Kayaking in Meghalaya. Umiam Lake kayaking near Shillong, Umngot River kayaking at Dawki. Packages, costs & booking info.', 'Kayaking in Meghalaya — Lake & River Adventures', 'Meghalaya offers exceptional kayaking on both calm lakes and crystal-clear rivers. From Umiam Lake\'s peaceful waters near Shillong to Shnongpdeng\'s adventure kayaking on the Umngot.',
    [
      { heading: 'Kayaking Locations', content: 'Where to kayak in Meghalaya:', listItems: ['Umiam Lake — Calm lake kayaking, 30 min from Shillong', 'Shnongpdeng — River kayaking on Umngot River', 'Dawki — Gentle river paddling', 'Organized by adventure operators with safety gear'] },
    ],
    [
      { question: 'Is kayaking safe in Meghalaya?', answer: 'Yes! Both Umiam Lake and Shnongpdeng have trained instructors and safety equipment. Life jackets are mandatory.' },
    ],
    ['meghalaya-adventure-package', 'shnongpdeng-camping-guide'],
    ['kayaking meghalaya', 'kayaking shillong', 'umiam lake kayaking', 'water sports meghalaya']
  ),
];

// ============================================================================
// CATEGORY 10: ITINERARIES (15+ pages)
// ============================================================================

const itineraryPages: SEOPageData[] = [
  itinerary('2-day-shillong-itinerary', '2-Day Shillong Itinerary — Perfect Weekend Plan', 'Best 2-day Shillong itinerary for a weekend trip. Day-by-day plan with Shillong Peak, Elephant Falls, Police Bazaar. Budget & timing tips.', '2-Day Shillong Itinerary — Weekend Getaway', 'Perfect for a quick weekend escape from Guwahati or surrounding cities. This 2-day itinerary covers Shillong\'s essential attractions with suggested timings and budget tips.',
    [
      { heading: 'Day-by-Day Plan', content: 'Your Shillong weekend:', listItems: ['Day 1: Arrive → Umiam Lake stop → Shillong Peak → Elephant Falls → Police Bazaar evening', 'Day 2: Ward\'s Lake → Don Bosco Museum → Laitumkhrah market → Departure'] },
      { heading: 'Budget Estimate', content: '₹3,000-5,000/person for 2 days including XTSY stay, food, and local transport.' },
    ],
    [
      { question: 'Is 2 days enough for Shillong?', answer: 'For Shillong city, yes. But to experience Meghalaya fully (Cherrapunji, Dawki), plan at least 5 days.' },
    ],
    ['meghalaya-tour-package-3-days', 'shillong-travel-guide'],
    ['2 day shillong itinerary', 'shillong weekend trip', 'shillong 2 days', 'short trip shillong']
  ),

  itinerary('7-day-meghalaya-itinerary', '7-Day Meghalaya Itinerary — Complete Trip Plan', 'Perfect 7-day Meghalaya itinerary. Shillong, Cherrapunji, Dawki, Nongriat, Mawlynnong. Day-by-day plan with costs & tips.', '7-Day Meghalaya Itinerary — The Complete Plan', 'The definitive 7-day Meghalaya itinerary covering every major destination. From Shillong\'s peaks to Cherrapunji\'s waterfalls, Nongriat\'s root bridges to Dawki\'s crystal river.',
    [
      { heading: 'Complete 7-Day Plan', content: 'Your perfect Meghalaya week:', listItems: ['Day 1: Arrive Shillong → Umiam Lake → Check in XTSY', 'Day 2: Shillong Peak → Elephant Falls → Laitlum Canyons', 'Day 3: Cherrapunji day — Nohkalikai, Mawsmai Cave, Seven Sisters', 'Day 4: Nongriat trek — Double Decker Root Bridge (stay overnight)', 'Day 5: Rainbow Falls → Return to Shillong → Rest', 'Day 6: Dawki → Shnongpdeng activities → Mawlynnong', 'Day 7: Local shopping → Departure'] },
      { heading: 'Estimated Budget', content: '₹15,000-25,000/person for 7 days (budget to comfort). Book XTSY for the best value accommodation.' },
    ],
    [
      { question: 'Is 7 days too long for Meghalaya?', answer: 'Not at all! 7 days lets you enjoy without rushing, include treks, and have rest days. It\'s the ideal duration for a comprehensive experience.' },
    ],
    ['meghalaya-tour-package-7-days', 'meghalaya-itinerary-planning'],
    ['7 day meghalaya itinerary', 'meghalaya 7 day plan', 'one week meghalaya', 'meghalaya week itinerary']
  ),

  itinerary('10-day-meghalaya-itinerary', '10-Day Meghalaya Itinerary — Explorer\'s Guide', 'Ultimate 10-day Meghalaya itinerary for explorers. Off-beat destinations, adventure activities. Jaintia Hills, Garo Hills included.', '10-Day Meghalaya Itinerary — The Explorer\'s Route', 'For travelers who want to go beyond the usual tourist trail. This 10-day itinerary includes Jaintia Hills, less-explored waterfalls, and off-beat experiences most tourists miss.',
    [
      { heading: '10-Day Explorer Route', content: 'The ultimate Meghalaya experience:', listItems: ['Day 1-2: Shillong exploration + Mawphlang Sacred Forest', 'Day 3: Cherrapunji waterfalls', 'Day 4-5: Nongriat trek + Rainbow Falls', 'Day 6: Dawki + Shnongpdeng camping', 'Day 7: Jowai → Krang Suri Falls', 'Day 8: Mawryngkhang Bamboo Trail', 'Day 9: Nongkhnum Island (river island)', 'Day 10: Shillong → Departure'] },
    ],
    [
      { question: 'Is 10 days worth it for Meghalaya alone?', answer: 'If you want to explore beyond the usual spots — Jaintia Hills, Garo Hills, remote waterfalls — 10 days is perfect and you\'ll see a side most tourists never experience.' },
    ],
    ['meghalaya-tour-package-7-days', 'meghalaya-itinerary-planning'],
    ['10 day meghalaya itinerary', 'meghalaya 10 days', 'extended meghalaya trip', 'off beat meghalaya']
  ),

  itinerary('shillong-weekend-trip', 'Shillong Weekend Trip — 2 Night 3 Day Plan', 'Plan a perfect Shillong weekend trip. Friday to Sunday itinerary. Attractions, food, nightlife. Budget ₹5,000-8,000.', 'Shillong Weekend Trip — Fri to Sun Plan', 'Escape to Shillong for the weekend! This Friday-to-Sunday itinerary maximizes your time with the best of Shillong including viewpoints, waterfalls, food, and music.',
    [
      { heading: 'Weekend Itinerary', content: 'Friday to Sunday plan:', listItems: ['Friday evening: Arrive → XTSY check-in → Police Bazaar dinner', 'Saturday: Full day — Shillong Peak → Elephant Falls → Laitlum → Bonfire', 'Sunday: Ward\'s Lake → Shopping → Departure by 3 PM'] },
    ],
    [
      { question: 'Can I reach Shillong from Guwahati for a weekend?', answer: 'Yes! It\'s just 2.5 hours by car. Leave Guwahati Friday evening, arrive by 8 PM. Leave Shillong Sunday 3 PM, reach Guwahati by 6 PM.' },
    ],
    ['2-day-shillong-itinerary', 'shillong-travel-guide'],
    ['shillong weekend trip', 'weekend getaway shillong', 'shillong short trip', 'friday to sunday shillong']
  ),
];

// ============================================================================
// COMBINE ALL PAGES
// ============================================================================

const BASE_SEO_PAGES: SEOPageData[] = [
  ...hostelPages,
  ...hotelPages,
  ...homestayPages,
  ...rentalPages,
  ...tourPages,
  ...guidePages,
  ...destinationPages,
  ...attractionPages,
  ...activityPages,
  ...itineraryPages,
];

import { filterHighQualityPages } from './seoQualityFilter';

// Raw set — every programmatic page we know about.
const RAW_SEO_PAGES_WITH_DUPES: SEOPageData[] = [
  ...PILLAR_PAGES,
  ...DESTINATION_PAGES,
  ...BASE_SEO_PAGES,
  ...EXPANSION_SEO_PAGES,
  ...DINING_SPOKE_PAGES,
  ...DINING_SEO_PAGES,
  ...DINING_EXPANSION_SEO_PAGES,
  ...LAST_MINUTE_SEO_PAGES,
  ...ROUTE_SEO_PAGES,
  ...INTENT_STAY_SEO_PAGES,
  ...INSTITUTION_SEO_PAGES,
  ...ACTIVITY_SEO_PAGES,
  ...DURATION_ITINERARY_SEO_PAGES,
  ...GLOBAL_NE_SEO_PAGES,
  ...NE_EXPANSION_SEO_PAGES,
];

// De-duplicate by slug — the same slug must never be defined twice
// (causes duplicate-URL / self-cannibalisation in search). First
// definition wins; earlier collections (pillar/destination) take
// priority over auto-generated ones.
const dedupeBySlug = (pages: SEOPageData[]): SEOPageData[] => {
  const seen = new Set<string>();
  const out: SEOPageData[] = [];
  for (const p of pages) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    out.push(p);
  }
  return out;
};

const RAW_SEO_PAGES: SEOPageData[] = dedupeBySlug(RAW_SEO_PAGES_WITH_DUPES);


// Public surface — quality-filtered to ~200 pages. Drops thin/duplicate
// clusters that risk Google "doorway page" classification and protects
// crawl budget. See src/data/seoQualityFilter.ts for the rules.
import { applySEOOverrides } from './seoPagesOverrides';
import { BRAND_OPENER, whyXTSYSection } from './brandFacts';
import { normalizeSEOPage } from './seoNormalize';

// SERP-safe title clamp. Google truncates titles past ~60 chars, so any
// over-length title is intelligently shortened: keep the brand suffix
// (after " | "), drop the em/en-dash secondary descriptor, and only
// ellipsis-clamp as a last resort. Titles already ≤60 chars are untouched.
const clampTitle = (title: string): string => {
  if (title.length <= 60) return title;
  const parts = title.split(' | ');
  const brand = parts.length > 1 ? parts.pop()! : '';
  const head = parts.join(' | ');
  const shortHead = head.split(/\s[—–-]\s/)[0].trim();
  if (brand) {
    const withBrand = `${shortHead} | ${brand}`;
    if (withBrand.length <= 60) return withBrand;
    if (shortHead.length <= 60) return shortHead;
    return shortHead.slice(0, 59).trimEnd() + '…';
  }
  if (shortHead.length >= 30 && shortHead.length <= 60) return shortHead;
  return head.slice(0, 59).trimEnd() + '…';
};

// SERP-safe meta description clamp (≤160 chars). Prefers ending on a full
// sentence; otherwise trims to the last whole word. Descriptions ≤160 are
// left untouched.
const clampDesc = (desc: string): string => {
  if (desc.length <= 160) return desc;
  const window = desc.slice(0, 160);
  const lastStop = Math.max(window.lastIndexOf('. '), window.lastIndexOf('! '), window.lastIndexOf('? '));
  if (lastStop >= 110) return window.slice(0, lastStop + 1).trim();
  const lastSpace = window.lastIndexOf(' ', 157);
  return (lastSpace > 110 ? window.slice(0, lastSpace) : window.slice(0, 157)).trimEnd() + '…';
};

// Phase 2 brand-rewrite enforcer: every published page receives the
// canonical brand opener + Why-XTSY + About-Group sections. Idempotent —
// pages that already mention NEITA/270°/XTSY ONE Ventures keep their
// intro untouched, and the trust sections are deduped by heading.
const enforceBrandFacts = (pages: SEOPageData[]): SEOPageData[] => {
  const introHasBrand = (s: string) => /NEITA|270°|XTSY ONE Ventures/i.test(s);
  const why = whyXTSYSection();
  return pages.map(p => {
    const intro = introHasBrand(p.intro) ? p.intro : `${BRAND_OPENER} ${p.intro}`;
    const existing = new Set(p.sections.map(s => s.heading));
    const extras: SEOSection[] = [];
    if (!existing.has(why.heading)) extras.push(why);
    return { ...p, title: clampTitle(p.title), metaDescription: clampDesc(p.metaDescription), intro, sections: [...p.sections, ...extras] };
  });
};

export const ALL_SEO_PAGES: SEOPageData[] = enforceBrandFacts(
  applySEOOverrides(filterHighQualityPages(RAW_SEO_PAGES))
);
export const RAW_SEO_PAGES_COUNT = RAW_SEO_PAGES.length;

// Helper to find a page by slug
export const findSEOPage = (slug: string): SEOPageData | undefined => {
  return ALL_SEO_PAGES.find(p => p.slug === slug);
};

// Get all slugs for sitemap generation
export const getAllSEOSlugs = (): string[] => {
  return ALL_SEO_PAGES.map(p => p.slug);
};

// Get pages by category
export const getPagesByCategory = (category: SEOPageCategory): SEOPageData[] => {
  return ALL_SEO_PAGES.filter(p => p.category === category);
};

// Get related pages for internal linking
export const getRelatedPages = (slug: string): SEOPageData[] => {
  const page = findSEOPage(slug);
  if (!page) return [];
  return page.relatedSlugs
    .map(s => findSEOPage(s))
    .filter((p): p is SEOPageData => !!p);
};
