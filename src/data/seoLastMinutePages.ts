/**
 * Last-Minute / Same-Day SEO Pages
 * High-intent programmatic pages targeting immediate booking queries
 */
import type { SEOPageData } from './seoPages';

const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export const LAST_MINUTE_SEO_PAGES: SEOPageData[] = [
  {
    slug: 'hostels-in-shillong-today',
    category: 'hostels',
    title: `Hostels in Shillong Available Today (${today}) | Book Now`,
    metaDescription: `Find hostels available in Shillong today. Dorm beds from ₹269/night, private rooms from ₹2,099. Real-time availability, instant booking confirmation at XTSY.`,
    h1: `Hostels Available in Shillong Today`,
    intro: `Looking for a hostel in Shillong right now? XTSY Travellers Hostel has beds and rooms available tonight. Book instantly with real-time availability — no waiting, no uncertainty. From budget dorm beds starting at ₹269/night to private king rooms at ₹2,099/night.`,
    sections: [
      {
        heading: 'Available Right Now',
        content: `Our real-time inventory shows live availability for today. Don't miss out — beds fill up fast, especially on weekends and during festivals. Book directly for the best rates, guaranteed.`,
        listItems: [
          '8-Bed Mixed Dorm — ₹269/night (24 beds)',
          '6-Bed Mixed Dorm — ₹419/night (18 beds)',
          '4-Bed Female Dorm — ₹419/night (4 beds)',
          '4-Bed Mixed Dorm — ₹529/night (4 beds)',
          'King Double Room — ₹2,099/night (3 rooms)',
          '270° Panorama Glass Suite — ₹7,489/night (1 suite)',
        ],
      },
      {
        heading: 'Why Book Direct with XTSY?',
        content: `Booking directly through xtsy.one guarantees you the lowest price, instant confirmation via WhatsApp, and no hidden fees. Unlike OTAs, we don't charge commission — savings we pass directly to you.`,
        listItems: [
          'Lowest price guarantee — beat any OTA rate',
          'Instant WhatsApp confirmation',
          'Free cancellation up to 24 hours before check-in',
          'Real-time availability — no overbooking risk',
        ],
      },
      {
        heading: 'Getting to XTSY from Guwahati',
        content: `XTSY is located in Mawkhar, Shillong — just 2.5 hours from Guwahati Airport. Shared taxis run every 30 minutes from ISBT Guwahati. We can also arrange private airport transfers for guests.`,
      },
    ],
    faqs: [
      { question: 'Can I book a hostel in Shillong for tonight?', answer: 'Yes! XTSY accepts same-day bookings. Check our live availability above and book instantly. Confirmation is sent via WhatsApp within minutes.' },
      { question: 'What is the cheapest hostel bed in Shillong today?', answer: 'The most affordable option is our 8-Bed Mixed Dormitory at ₹269/night. It includes Wi-Fi, hot water, locker storage, and access to all common areas.' },
      { question: 'Is walk-in available at XTSY?', answer: 'Walk-ins are welcome subject to availability. However, we recommend booking online to guarantee your spot, especially during peak season.' },
    ],
    schemaType: 'Hostel',
    relatedSlugs: ['shillong-last-minute-stays', 'shillong-stay-tonight', 'best-hostel-in-shillong', 'budget-hostel-shillong'],
    ctaText: 'Book Now for Tonight',
    ctaLink: '/book',
    keywords: ['hostels in shillong today', 'shillong hostel available now', 'hostel booking shillong tonight', 'last minute hostel shillong'],
  },
  {
    slug: 'shillong-last-minute-stays',
    category: 'accommodation',
    title: `Last Minute Stays in Shillong — Available Now (${today})`,
    metaDescription: `Need a last-minute stay in Shillong? Rooms and dorms available right now from ₹269/night. Instant booking, real-time availability at XTSY Travellers Hostel.`,
    h1: 'Last Minute Stays in Shillong',
    intro: `Spontaneous trip to Shillong? We've got you covered. XTSY Travellers Hostel offers instant booking with real-time availability. No advance planning needed — find a bed or room available right now and book in under 30 seconds.`,
    sections: [
      {
        heading: 'Book in 30 Seconds',
        content: `Our streamlined booking process gets you confirmed in moments. Select your dates, choose your room, enter basic details — done. Confirmation arrives on WhatsApp instantly.`,
      },
      {
        heading: 'Tonight\'s Best Deals',
        content: `Last-minute travellers get special rates. Our dorm beds start at just ₹269/night — that's less than a meal at most restaurants. Private rooms with king beds are available from ₹2,099/night.`,
        listItems: [
          'Dorm beds from ₹269/night',
          'Private rooms from ₹2,099/night',
          'Luxury 270° Glass Suite from ₹7,489/night',
          'All prices inclusive of taxes',
        ],
      },
      {
        heading: 'What\'s Nearby',
        content: `XTSY is located in the heart of Shillong, walking distance from Police Bazaar, Ward\'s Lake, and Don Bosco Museum. The famous Café Shillong and local eateries are within 5 minutes.`,
      },
    ],
    faqs: [
      { question: 'Can I get a room in Shillong at the last minute?', answer: 'Yes, XTSY accepts same-day bookings online. We show real-time availability so you know exactly what\'s open before you book.' },
      { question: 'Do I need to pay in advance for last-minute booking?', answer: 'No advance payment required for most room types. You can pay at check-in. Some premium rooms may require a small deposit.' },
    ],
    schemaType: 'LodgingBusiness',
    relatedSlugs: ['hostels-in-shillong-today', 'shillong-stay-tonight', 'hotels-in-shillong-available-now', 'meghalaya-trip-today'],
    ctaText: 'Check Availability Now',
    ctaLink: '/book',
    keywords: ['last minute stays shillong', 'shillong accommodation tonight', 'emergency stay shillong', 'same day hotel shillong'],
  },
  {
    slug: 'meghalaya-trip-today',
    category: 'travel-guides',
    title: `Start Your Meghalaya Trip Today — Stays & Tours Available Now`,
    metaDescription: `Planning a spontaneous Meghalaya trip? Stays available from ₹269/night and curated tour packages ready to start today. Book accommodation and adventures instantly.`,
    h1: 'Start Your Meghalaya Trip Today',
    intro: `The best trips are the ones you don't overthink. Meghalaya is calling — and stays, tours, and adventures are available right now. Whether you're already in Guwahati or planning from Delhi, we'll help you start exploring today.`,
    sections: [
      {
        heading: 'Quick Meghalaya Itinerary',
        content: `Here's a spontaneous 3-day plan you can start today:`,
        listItems: [
          'Day 1 — Arrive in Shillong, explore Police Bazaar & Ward\'s Lake, stay at XTSY',
          'Day 2 — Day trip to Cherrapunjee: Living Root Bridges, Nohkalikai Falls, Seven Sisters Falls',
          'Day 3 — Dawki River crystal clear waters, Mawlynnong (Asia\'s cleanest village), return to Shillong',
        ],
      },
      {
        heading: 'Book Stay + Tour Together',
        content: `Combine your accommodation with one of our 30+ curated tour packages. From Living Root Bridge treks to Dawki river expeditions — we handle logistics so you focus on experiences.`,
      },
      {
        heading: 'Getting Here Fast',
        content: `Fly to Guwahati (GAU) — multiple daily flights from Delhi, Mumbai, Kolkata, Bangalore. From Guwahati, Shillong is just 2.5 hours by road. We arrange airport pickups.`,
      },
    ],
    faqs: [
      { question: 'Can I start a Meghalaya trip today?', answer: 'Absolutely! Accommodation is available for tonight and tour packages can start as early as tomorrow morning. Book your stay now and plan activities on arrival.' },
      { question: 'What\'s the best quick trip to Meghalaya?', answer: 'A 3-day itinerary covering Shillong, Cherrapunjee, and Dawki is perfect for a quick getaway. You\'ll experience the best of Meghalaya — waterfalls, living root bridges, and crystal clear rivers.' },
    ],
    schemaType: 'TouristTrip',
    relatedSlugs: ['hostels-in-shillong-today', 'shillong-last-minute-stays', '3-day-meghalaya-itinerary', 'meghalaya-tour-packages'],
    ctaText: 'Book Stay & Start Exploring',
    ctaLink: '/book',
    keywords: ['meghalaya trip today', 'spontaneous meghalaya trip', 'start meghalaya trip now', 'quick meghalaya getaway'],
  },
  {
    slug: 'hotels-in-shillong-available-now',
    category: 'hotels',
    title: `Hotels in Shillong Available Now (${today}) — Instant Booking`,
    metaDescription: `Hotels and rooms in Shillong available right now. Private rooms from ₹2,099/night, luxury suites from ₹7,489. Real-time availability, instant confirmation.`,
    h1: 'Hotels & Rooms in Shillong Available Now',
    intro: `Need a hotel room in Shillong right now? Check real-time availability below. XTSY offers private rooms and luxury suites with instant booking confirmation — no waiting for host approval.`,
    sections: [
      {
        heading: 'Private Rooms Available Today',
        content: `Our private rooms offer hotel-grade comfort at hostel-friendly prices. Every room includes high-speed Wi-Fi, hot water, daily housekeeping, and mountain views.`,
        listItems: [
          'King Double Room — ₹2,099/night (fits 2 guests)',
          '270° Panorama Glass Ensuite — ₹7,489/night (luxury experience)',
        ],
      },
      {
        heading: 'Budget-Friendly Alternatives',
        content: `If private rooms are fully booked, our dormitories offer comfortable beds with all essential amenities starting from just ₹269/night. Perfect for solo travellers and backpackers.`,
      },
      {
        heading: 'Location & Accessibility',
        content: `Located in Mawkhar, Shillong — central to all major attractions. 5 minutes from Police Bazaar, 10 minutes from Ward's Lake, and 15 minutes from Shillong Peak viewpoint.`,
      },
    ],
    faqs: [
      { question: 'Are there hotels available in Shillong right now?', answer: 'Yes, XTSY has rooms available for immediate booking. Our real-time system shows live inventory — what you see is what\'s actually available.' },
      { question: 'What\'s the cheapest private room in Shillong tonight?', answer: 'Our King Double Room starts at ₹2,099/night for two guests. This includes all amenities — Wi-Fi, hot water, housekeeping, and breakfast options.' },
    ],
    schemaType: 'Hotel',
    relatedSlugs: ['shillong-last-minute-stays', 'hostels-in-shillong-today', 'shillong-stay-tonight', 'hotels-in-shillong'],
    ctaText: 'Book a Room Now',
    ctaLink: '/book',
    keywords: ['hotels in shillong available now', 'shillong hotel tonight', 'shillong room available today', 'instant hotel booking shillong'],
  },
  {
    slug: 'shillong-stay-tonight',
    category: 'accommodation',
    title: `Stay in Shillong Tonight — Rooms & Beds Available (${today})`,
    metaDescription: `Need a place to stay in Shillong tonight? Beds from ₹269, rooms from ₹2,099. Real-time availability, instant booking, WhatsApp confirmation at XTSY Hostel.`,
    h1: 'Stay in Shillong Tonight',
    intro: `It's not too late to find the perfect stay in Shillong. Whether you need a budget dorm bed or a luxury glass suite with panoramic mountain views, we have options available right now. Book in 30 seconds, get confirmed on WhatsApp.`,
    sections: [
      {
        heading: 'What\'s Available Tonight',
        content: `Our live inventory updates in real-time. Here's what you can book right now:`,
        listItems: [
          '8-Bed Mixed Dorm — From ₹269/night (best value)',
          '6-Bed Mixed Dorm — From ₹419/night (recommended)',
          '4-Bed Female Dorm — From ₹419/night (women only)',
          '4-Bed Mixed Dorm — From ₹529/night (smaller group)',
          'King Double Room — From ₹2,099/night (couples)',
          '270° Glass Suite — From ₹7,489/night (luxury)',
        ],
      },
      {
        heading: 'Check-In Process',
        content: `Check-in is at 1:00 PM, but early check-in is available subject to room availability. Late arrivals are welcome — just inform us via WhatsApp. Check-out is at 11:00 AM.`,
      },
      {
        heading: 'Guest Reviews',
        content: `Rated 4.8/5 by 320+ guests. XTSY is the biggest and highest-rated hostel in Northeast India. Guests love our rooftop views, clean facilities, and friendly staff.`,
      },
    ],
    faqs: [
      { question: 'Can I check in tonight?', answer: 'Yes, we accept same-day check-ins. Standard check-in is 1 PM, but late arrivals are welcome. Just message us on WhatsApp after booking.' },
      { question: 'Is there a minimum stay requirement?', answer: 'No minimum stay — you can book for just one night. Many guests book for tonight and extend their stay if they love it (most do!).' },
    ],
    schemaType: 'LodgingBusiness',
    relatedSlugs: ['hostels-in-shillong-today', 'shillong-last-minute-stays', 'hotels-in-shillong-available-now', 'meghalaya-trip-today'],
    ctaText: 'Book Tonight',
    ctaLink: '/book',
    keywords: ['stay in shillong tonight', 'shillong tonight accommodation', 'where to stay shillong today', 'shillong bed tonight'],
  },
];
