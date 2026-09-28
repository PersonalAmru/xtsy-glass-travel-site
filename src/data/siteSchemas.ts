
/** Owner-confirmed Google Maps pin for the gate of XTSY Travellers Hostel. */
export const XTSY_MAPS_URL = 'https://maps.app.goo.gl/UnP9PfbSJdafMFMM6';
/**
 * Sitewide JSON-LD entities, scoped per route.
 * WebSite + Organization stay in __root; Hostel is homepage-only and
 * Restaurant is /tab-bistro-only so the entity graph is unambiguous.
 */

export const HOSTEL_SCHEMA: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Hostel",
  "@id": "https://xtsy.one/#hostel",
  name: "XTSY Travellers Hostel",
  alternateName: ["XTSY Hostel", "XTSY Shillong", "XTSY Traveller's Hostel"],
  description:
    "Backpacker hostel in New Shillong Township, Shillong, Meghalaya (near IIM Shillong and NIFT Shillong): mixed and women-only dorms, King Double rooms, Experience by XTSY glass suite, TAB Bistro restaurant on site, pet-friendly (cats and birds; dogs by breed and size), 24/7 arrival support.",
  url: "https://xtsy.one",
  image: [
    "https://xtsy.one/img/o/xtsy-property-images-8-1920.webp",
    "https://xtsy.one/img/o/xtsy-property-images-6-1920.webp",
    "https://xtsy.one/img/o/xtsy-6-bed-mixed-dormitory-1-1280.webp",
  ],
  hasMap: XTSY_MAPS_URL,
  petsAllowed: true,
  smokingAllowed: false,
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Credit Card, Debit Card",
  areaServed: ["Shillong", "Meghalaya", "Northeast India"],
  amenityFeature: ["Free Wi-Fi", "On-site restaurant (TAB Bistro)", "Women-only dorm", "Lockers", "24/7 arrival support", "Pet friendly", "Parking", "Co-working desks", "Tour desk"].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
  containsPlace: { "@id": "https://xtsy.one/tab-bistro#restaurant" },
  sameAs: [
    "https://www.tripadvisor.com/Hotel_Review-g15012368-d33031050-Reviews-Xtsy_Travellers_Hostel-Mawdiangdiang_East_Khasi_Hills_District_Meghalaya.html",
    "https://www.hostelworld.com/hostels/p/333065/xtsy-travellers-hostel/",
    "https://www.expedia.com/Shillong-Hotels-XTSY-Travellers-Hostel.h118331713.Hotel-Information",
  ],
  logo: "https://xtsy.one/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png",
  telephone: "+91-8837317070",
  priceRange: "₹389 - ₹5,799",
  checkinTime: "11:00",
  checkoutTime: "10:00",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mawdiangdiang Road, New Shillong Township",
    addressLocality: "Shillong",
    addressRegion: "Meghalaya",
    addressCountry: "IN",
    postalCode: "793018",
  },
  geo: { "@type": "GeoCoordinates", latitude: 25.6025457, longitude: 91.9448902 },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "161",
    reviewCount: "161",
    bestRating: "5",
  },
};

export const RESTAURANT_SCHEMA: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": "https://xtsy.one/tab-bistro#restaurant",
  name: "TAB Bistro by XTSY",
  url: "https://xtsy.one/tab-bistro",
  image: "https://xtsy.one/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png",
  servesCuisine: ["Indian", "Continental", "Khasi", "Cafe"],
  priceRange: "₹₹",
  telephone: "+91-8837317070",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mawdiangdiang Road, New Shillong Township",
    addressLocality: "Shillong",
    addressRegion: "Meghalaya",
    postalCode: "793018",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 25.6025457, longitude: 91.9448902 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "07:00",
      closes: "22:30",
    },
  ],
  acceptsReservations: true,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.7",
    reviewCount: "142",
    bestRating: "5",
  },
};
