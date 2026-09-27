/**
 * Sitewide JSON-LD entities, scoped per route.
 * WebSite + Organization stay in __root; Hostel is homepage-only and
 * Restaurant is /tab-bistro-only so the entity graph is unambiguous.
 */

export const HOSTEL_SCHEMA: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Hostel",
  name: "XTSY Travellers Hostel",
  url: "https://xtsy.one",
  logo: "https://xtsy.one/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png",
  telephone: "+91-8837317070",
  priceRange: "₹399 - ₹5,799",
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
  geo: { "@type": "GeoCoordinates", latitude: 25.5788, longitude: 91.8933 },
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
  geo: { "@type": "GeoCoordinates", latitude: 25.5788, longitude: 91.8933 },
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
