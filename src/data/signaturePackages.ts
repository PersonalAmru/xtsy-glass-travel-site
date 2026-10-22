// ============================================================
// XTSY — Signature Tour Package Catalog (SOURCE OF TRUTH)
// ------------------------------------------------------------
// These are the ONLY approved, real package prices.
// Never generate, calculate, or randomise package pricing.
// Every price here is a verified, fixed, per-person rate.
// ============================================================

export type PackageRegion = "Meghalaya" | "Arunachal Pradesh" | "Assam & Meghalaya";

export interface SignaturePackage {
  /** Stable URL slug — used at /tours/<slug> and in sitemaps. */
  slug: string;
  title: string;
  region: PackageRegion;
  /** Exact per-person price in INR (number, no formatting). */
  pricePerPerson: number;
  /** Minimum group size required for the listed price (undefined = no minimum). */
  minGroup?: number;
  /** Human-readable duration, e.g. "4 Nights / 5 Days". */
  duration: string;
  nights: number;
  days: number;
  shortDescription: string;
  pickupDrop: string;
  idealFor: string[];
  highlights: string[];
  /** Fixed group departures a solo traveller can join (weekday 0 = Sunday … 6 = Saturday;
   *  months 1–12 in which the trip departs). */
  departures?: { weekday: number; months: number[] };
}

/** Format a fixed price for display. Never used to compute new prices. */
export const formatPackagePrice = (inr: number): string =>
  `₹${inr.toLocaleString("en-IN")}`;

export const SIGNATURE_PACKAGES: SignaturePackage[] = [
  // ---------------- Meghalaya ----------------
  {
    slug: "4n-5d-shillong-meghalaya-tour",
    title: "4 Nights 5 Days Shillong Meghalaya Tour",
    region: "Meghalaya",
    pricePerPerson: 15500,
    minGroup: 4,
    duration: "4 Nights / 5 Days",
    nights: 4,
    days: 5,
    shortDescription:
      "The essential Meghalaya circuit covering Shillong, Cherrapunjee and Dawki with living root bridges and the Umngot River.",
    pickupDrop: "Guwahati Airport / Railway Station",
    idealFor: ["Families", "Couples", "Groups", "First-time visitors"],
    highlights: [
      "Shillong city & Umiam Lake",
      "Cherrapunjee waterfalls",
      "Dawki Umngot River boating",
      "Mawlynnong — Asia's cleanest village",
    ],
  },
  {
    slug: "6n-7d-meghalaya-tour",
    title: "6 Nights 7 Days Meghalaya Tour",
    region: "Meghalaya",
    pricePerPerson: 17500,
    minGroup: 4,
    duration: "6 Nights / 7 Days",
    nights: 6,
    days: 7,
    shortDescription:
      "A deeper week-long Meghalaya journey adding the Jaintia Hills, extended treks and offbeat villages.",
    pickupDrop: "Guwahati Airport / Railway Station",
    idealFor: ["Families", "Groups", "Explorers", "Photographers"],
    highlights: [
      "Double Decker Living Root Bridge trek",
      "Krang Suri & Jaintia Hills",
      "Dawki & Shnongpdeng",
      "Mawphlang Sacred Forest",
    ],
  },
  {
    slug: "meghalaya-group-trip-6n-7d",
    title: "Meghalaya Group Trip, Saturday Departures",
    region: "Meghalaya",
    pricePerPerson: 18500,
    duration: "6 Nights / 7 Days",
    nights: 6,
    days: 7,
    shortDescription:
      "Join a small group on a fixed-date week in Meghalaya: Shillong, the Double Decker root bridge, Krang Suri, Dawki and Mawlynnong. Book one seat.",
    pickupDrop: "Guwahati Airport / Railway Station",
    idealFor: ["Solo travellers", "Friends", "Couples", "First-time visitors"],
    highlights: [
      "Departs every Saturday, October to May",
      "Double Decker Living Root Bridge trek",
      "Krang Suri Falls & Dawki on the Umngot River",
      "Mawphlang Sacred Forest & Mawlynnong village",
    ],
    departures: { weekday: 6, months: [10, 11, 12, 1, 2, 3, 4, 5] },
  },
  {
    slug: "6d-shillong-meghalaya-tour",
    title: "6 Days Shillong Meghalaya Tour",
    region: "Meghalaya",
    pricePerPerson: 19000,
    duration: "5 Nights / 6 Days",
    nights: 5,
    days: 6,
    shortDescription:
      "A relaxed six-day Shillong-based tour balancing iconic highlights with leisure time in the Scotland of the East.",
    pickupDrop: "Guwahati Airport / Railway Station",
    idealFor: ["Couples", "Families", "Leisure travellers"],
    highlights: [
      "Shillong café & music culture",
      "Elephant Falls & Shillong Peak",
      "Cherrapunjee day trip",
      "Dawki & Mawlynnong",
    ],
  },
  {
    slug: "5d-meghalaya-trip-package",
    title: "5 Days Meghalaya Trip Package",
    region: "Meghalaya",
    pricePerPerson: 19000,
    duration: "4 Nights / 5 Days",
    nights: 4,
    days: 5,
    shortDescription:
      "A compact, well-paced five-day Meghalaya trip covering the state's most photographed destinations.",
    pickupDrop: "Guwahati Airport / Railway Station",
    idealFor: ["Couples", "Friends", "Short-break travellers"],
    highlights: [
      "Living root bridges",
      "Nohkalikai Falls",
      "Crystal-clear Dawki",
      "Mawsmai Cave",
    ],
  },
  {
    slug: "5n-6d-meghalaya-holiday-package",
    title: "5 Nights 6 Days Meghalaya Holiday Package",
    region: "Meghalaya",
    pricePerPerson: 24500,
    duration: "5 Nights / 6 Days",
    nights: 5,
    days: 6,
    shortDescription:
      "An upgraded holiday experience across Meghalaya with comfortable stays and a richer, slower itinerary.",
    pickupDrop: "Guwahati Airport / Railway Station",
    idealFor: ["Families", "Couples", "Comfort travellers"],
    highlights: [
      "Comfort-class stays",
      "Cherrapunjee & Sohra",
      "Dawki & Shnongpdeng",
      "Laitlum Canyons",
    ],
  },
  {
    slug: "6d-meghalaya-honeymoon-package",
    title: "6 Days Meghalaya Honeymoon Package",
    region: "Meghalaya",
    pricePerPerson: 26000,
    duration: "5 Nights / 6 Days",
    nights: 5,
    days: 6,
    shortDescription:
      "A romantic six-day Meghalaya honeymoon with handpicked stays, scenic drives and private experiences for two.",
    pickupDrop: "Guwahati Airport / Railway Station",
    idealFor: ["Couples", "Honeymooners"],
    highlights: [
      "Romantic stays & candlelight options",
      "Umngot River private boating",
      "Cherry blossom / valley views",
      "Living root bridge walk",
    ],
  },
  {
    slug: "7n-guwahati-shillong-kaziranga-tour",
    title: "7 Nights Guwahati Shillong Kaziranga Tour",
    region: "Assam & Meghalaya",
    pricePerPerson: 27000,
    duration: "7 Nights / 8 Days",
    nights: 7,
    days: 8,
    shortDescription:
      "A combined Assam & Meghalaya grand tour pairing Shillong's hills with Kaziranga's one-horned rhino safari.",
    pickupDrop: "Guwahati Airport / Railway Station",
    idealFor: ["Families", "Wildlife lovers", "Groups"],
    highlights: [
      "Kaziranga jeep & safari",
      "Shillong & Cherrapunjee",
      "Dawki & Mawlynnong",
      "Kamakhya & Guwahati",
    ],
  },
  // ---------------- Arunachal Pradesh ----------------
  {
    slug: "5n-6d-tawang-tour",
    title: "5 Nights 6 Days Tawang Tour",
    region: "Arunachal Pradesh",
    pricePerPerson: 19000,
    duration: "5 Nights / 6 Days",
    nights: 5,
    days: 6,
    shortDescription:
      "A high-Himalayan Tawang journey over Sela Pass to the famed Tawang Monastery and Madhuri Lake.",
    pickupDrop: "Guwahati / Tezpur",
    idealFor: ["Couples", "Adventure travellers", "Groups"],
    highlights: [
      "Sela Pass (13,700 ft)",
      "Tawang Monastery",
      "Madhuri (Sangetsar) Lake",
      "Nuranang Falls",
    ],
  },
  {
    slug: "6n-7d-arunachal-pradesh-tour",
    title: "6 Nights 7 Days Arunachal Pradesh Tour",
    region: "Arunachal Pradesh",
    pricePerPerson: 22000,
    duration: "6 Nights / 7 Days",
    nights: 6,
    days: 7,
    shortDescription:
      "A comprehensive Arunachal circuit through Bhalukpong, Dirang, Bomdila and Tawang with cultural immersion.",
    pickupDrop: "Guwahati / Tezpur",
    idealFor: ["Explorers", "Groups", "Culture seekers"],
    highlights: [
      "Bomdila & Dirang valleys",
      "Sangti Valley",
      "Tawang Monastery",
      "Sela Pass & Bumla approach",
    ],
  },
  {
    slug: "7n-8d-tawang-tour",
    title: "7 Nights 8 Days Tawang Tour",
    region: "Arunachal Pradesh",
    pricePerPerson: 18500,
    duration: "7 Nights / 8 Days",
    nights: 7,
    days: 8,
    shortDescription:
      "An extended, well-acclimatised Tawang expedition with relaxed pacing across the Western Arunachal Himalayas.",
    pickupDrop: "Guwahati / Tezpur",
    idealFor: ["Groups", "Slow travellers", "Photographers"],
    highlights: [
      "Acclimatised high-altitude pacing",
      "Tawang & monasteries",
      "Sela Pass & alpine lakes",
      "Local Monpa culture",
    ],
  },
];

export const getSignaturePackageBySlug = (slug: string): SignaturePackage | undefined =>
  SIGNATURE_PACKAGES.find((p) => p.slug === slug);

export const getRelatedPackages = (
  slug: string,
  limit = 3,
): SignaturePackage[] => {
  const current = getSignaturePackageBySlug(slug);
  if (!current) return SIGNATURE_PACKAGES.slice(0, limit);
  return SIGNATURE_PACKAGES.filter(
    (p) => p.slug !== slug && p.region === current.region,
  )
    .concat(SIGNATURE_PACKAGES.filter((p) => p.slug !== slug && p.region !== current.region))
    .slice(0, limit);
};

// ------------------------------------------------------------
// Adapter: render a fixed Signature Package through the shared
// /tours/:slug TourDetail page (TourPackage shape).
// ------------------------------------------------------------
import type { TourPackage, ItineraryDay } from "./travelData";
import { cdn } from "./cdnImages";

// ------------------------------------------------------------
// Full day-by-day itineraries for every fixed Signature Package.
// Keyed by slug. These are curated, factual route plans — never
// auto-generated. Rendered on /tours/:slug under the Itinerary tab.
// ------------------------------------------------------------
export const PACKAGE_ITINERARIES: Record<string, ItineraryDay[]> = {
  "4n-5d-shillong-meghalaya-tour": [
    {
      day: "Day 1",
      title: "Arrival in Guwahati → Drive to Shillong",
      route: "Guwahati → Umiam Lake → Shillong (~3.5 hrs)",
      activities: [
        "Airport / railway station pickup at Guwahati",
        "Scenic drive into the Khasi Hills",
        "Photo stop at Umiam Lake (Barapani)",
        "Check-in at Shillong hotel & evening at Police Bazaar",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 2",
      title: "Shillong Sightseeing & Local Culture",
      route: "Shillong city circuit",
      activities: [
        "Elephant Falls & Shillong Peak viewpoint",
        "Ward's Lake and Lady Hydari Park",
        "Don Bosco Museum of Indigenous Cultures",
        "Explore Shillong's café & live-music scene",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 3",
      title: "Cherrapunjee (Sohra) Waterfalls Day",
      route: "Shillong → Cherrapunjee → Shillong (~2 hrs each way)",
      activities: [
        "Nohkalikai Falls — India's tallest plunge waterfall",
        "Mawsmai Limestone Caves",
        "Seven Sisters Falls & Arwah Caves",
        "Mawkdok Dympep Valley viewpoint",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 4",
      title: "Dawki & Mawlynnong — The Cleanest Village",
      route: "Shillong → Mawlynnong → Dawki → Shillong",
      activities: [
        "Boating on the crystal-clear Umngot River, Dawki",
        "Mawlynnong — Asia's cleanest village",
        "Living root bridge at Riwai village",
        "Sky-walk / balancing rock & India-Bangladesh border view",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 5",
      title: "Departure",
      route: "Shillong → Guwahati (~3.5 hrs)",
      activities: [
        "Leisurely breakfast & last-minute shopping",
        "Drive back to Guwahati",
        "Drop at airport / railway station for onward journey",
      ],
    },
  ],
  "6n-7d-meghalaya-tour": [
    {
      day: "Day 1",
      title: "Arrival Guwahati → Shillong",
      route: "Guwahati → Umiam Lake → Shillong",
      activities: [
        "Pickup at Guwahati & drive to Shillong",
        "Umiam Lake viewpoint stop",
        "Hotel check-in and evening at Police Bazaar",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 2",
      title: "Shillong City & Mawphlang Sacred Forest",
      route: "Shillong → Mawphlang → Shillong",
      activities: [
        "Elephant Falls & Shillong Peak",
        "Mawphlang Sacred Grove guided nature walk",
        "Ward's Lake & Don Bosco Museum",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 3",
      title: "Cherrapunjee & Nongriat Trek Base",
      route: "Shillong → Cherrapunjee (~2 hrs)",
      activities: [
        "Nohkalikai Falls & Mawsmai Caves",
        "Seven Sisters Falls viewpoint",
        "Transfer to Cherrapunjee / Tyrna for the root-bridge trek",
      ],
      overnight: "Cherrapunjee",
    },
    {
      day: "Day 4",
      title: "Double Decker Living Root Bridge Trek",
      route: "Tyrna → Nongriat → Tyrna (full-day trek)",
      activities: [
        "Descend ~3,500 steps to Nongriat village",
        "Double Decker Living Root Bridge",
        "Rainbow Falls & natural pools (optional swim)",
        "Return ascent to Tyrna",
      ],
      overnight: "Cherrapunjee",
    },
    {
      day: "Day 5",
      title: "Jaintia Hills — Krang Suri & Dawki",
      route: "Cherrapunjee → Jaintia Hills → Shnongpdeng",
      activities: [
        "Krang Suri Falls turquoise pool",
        "Drive to Dawki / Shnongpdeng on the Umngot River",
        "Umngot River boating & riverside camp stay",
      ],
      overnight: "Shnongpdeng / Dawki",
    },
    {
      day: "Day 6",
      title: "Mawlynnong & Return to Shillong",
      route: "Dawki → Mawlynnong → Shillong",
      activities: [
        "Mawlynnong cleanest village & Riwai root bridge",
        "Sky-walk viewpoint",
        "Drive back to Shillong for the night",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 7",
      title: "Departure",
      route: "Shillong → Guwahati",
      activities: [
        "Breakfast & souvenir shopping",
        "Transfer to Guwahati airport / station",
      ],
    },
  ],
  "6d-shillong-meghalaya-tour": [
    {
      day: "Day 1",
      title: "Arrival → Shillong",
      route: "Guwahati → Umiam Lake → Shillong",
      activities: [
        "Pickup and scenic drive to Shillong",
        "Umiam Lake stop",
        "Check-in & relaxed evening at Police Bazaar",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 2",
      title: "Shillong Leisure & Café Culture",
      route: "Shillong city",
      activities: [
        "Elephant Falls & Shillong Peak",
        "Ward's Lake, Cathedral & Don Bosco Museum",
        "Explore Shillong's café and music scene at leisure",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 3",
      title: "Cherrapunjee Day Trip",
      route: "Shillong → Cherrapunjee → Shillong",
      activities: [
        "Nohkalikai Falls & Seven Sisters Falls",
        "Mawsmai Cave & Arwah Cave",
        "Mawkdok Valley zip-line (optional)",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 4",
      title: "Dawki & Mawlynnong",
      route: "Shillong → Mawlynnong → Dawki → Shillong",
      activities: [
        "Umngot River boating at Dawki",
        "Mawlynnong cleanest village & Riwai living root bridge",
        "Border viewpoint & sky-walk",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 5",
      title: "Laitlum Canyons & Local Markets",
      route: "Shillong → Laitlum → Shillong",
      activities: [
        "Laitlum Canyons grand valley views",
        "Smit village & Khasi heritage",
        "Leisure shopping at Bara Bazaar",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 6",
      title: "Departure",
      route: "Shillong → Guwahati",
      activities: [
        "Breakfast & checkout",
        "Drive to Guwahati airport / station for departure",
      ],
    },
  ],
  "5d-meghalaya-trip-package": [
    {
      day: "Day 1",
      title: "Arrival → Shillong",
      route: "Guwahati → Umiam Lake → Shillong",
      activities: [
        "Airport / station pickup",
        "Umiam Lake photo stop",
        "Hotel check-in & Police Bazaar evening",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 2",
      title: "Cherrapunjee Highlights",
      route: "Shillong → Cherrapunjee → Shillong",
      activities: [
        "Nohkalikai Falls",
        "Mawsmai Cave & Seven Sisters Falls",
        "Mawkdok Valley viewpoint",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 3",
      title: "Living Root Bridge & Dawki",
      route: "Shillong → Riwai → Dawki → Shillong",
      activities: [
        "Riwai single-decker living root bridge",
        "Umngot River boating at Dawki",
        "Mawlynnong cleanest village",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 4",
      title: "Shillong City Tour",
      route: "Shillong city circuit",
      activities: [
        "Elephant Falls & Shillong Peak",
        "Ward's Lake & Don Bosco Museum",
        "Café-hopping and shopping at leisure",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 5",
      title: "Departure",
      route: "Shillong → Guwahati",
      activities: [
        "Breakfast & checkout",
        "Transfer to Guwahati for departure",
      ],
    },
  ],
  "5n-6d-meghalaya-holiday-package": [
    {
      day: "Day 1",
      title: "Arrival → Shillong",
      route: "Guwahati → Umiam Lake → Shillong",
      activities: [
        "Pickup & comfortable drive to Shillong",
        "Umiam Lake stop",
        "Check-in at comfort-class stay & leisure evening",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 2",
      title: "Shillong Sightseeing",
      route: "Shillong city",
      activities: [
        "Elephant Falls & Shillong Peak",
        "Ward's Lake, Cathedral & Don Bosco Museum",
        "Evening at Police Bazaar",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 3",
      title: "Cherrapunjee & Sohra",
      route: "Shillong → Cherrapunjee",
      activities: [
        "Nohkalikai Falls & Seven Sisters Falls",
        "Mawsmai & Arwah Caves",
        "Transfer to a Sohra / Cherrapunjee stay",
      ],
      overnight: "Cherrapunjee",
    },
    {
      day: "Day 4",
      title: "Dawki & Shnongpdeng River Day",
      route: "Cherrapunjee → Shnongpdeng / Dawki",
      activities: [
        "Umngot River boating in crystal-clear waters",
        "Riverside activities & kayaking (optional)",
        "Riverside camp / resort stay",
      ],
      overnight: "Shnongpdeng / Dawki",
    },
    {
      day: "Day 5",
      title: "Mawlynnong, Laitlum & Return",
      route: "Dawki → Mawlynnong → Laitlum → Shillong",
      activities: [
        "Mawlynnong cleanest village & Riwai root bridge",
        "Laitlum Canyons viewpoint",
        "Drive back to Shillong",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 6",
      title: "Departure",
      route: "Shillong → Guwahati",
      activities: [
        "Leisurely breakfast & shopping",
        "Transfer to Guwahati for departure",
      ],
    },
  ],
  "6d-meghalaya-honeymoon-package": [
    {
      day: "Day 1",
      title: "Romantic Arrival → Shillong",
      route: "Guwahati → Umiam Lake → Shillong",
      activities: [
        "Private pickup & scenic drive for two",
        "Umiam Lake sunset photo stop",
        "Check-in at a handpicked romantic stay",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 2",
      title: "Shillong for Couples",
      route: "Shillong city",
      activities: [
        "Elephant Falls & Shillong Peak views",
        "Ward's Lake boat ride",
        "Cosy café evening & optional candlelight dinner",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 3",
      title: "Cherrapunjee Scenic Escape",
      route: "Shillong → Cherrapunjee",
      activities: [
        "Nohkalikai Falls & valley viewpoints",
        "Mawsmai Cave walk",
        "Transfer to a romantic Sohra resort",
      ],
      overnight: "Cherrapunjee",
    },
    {
      day: "Day 4",
      title: "Living Root Bridge & Private Boating",
      route: "Cherrapunjee → Dawki",
      activities: [
        "Riwai living root bridge walk",
        "Private Umngot River boating for two at Dawki",
        "Riverside leisure time",
      ],
      overnight: "Shnongpdeng / Dawki",
    },
    {
      day: "Day 5",
      title: "Mawlynnong & Return to Shillong",
      route: "Dawki → Mawlynnong → Shillong",
      activities: [
        "Mawlynnong cleanest village stroll",
        "Sky-walk viewpoint",
        "Drive back to Shillong & farewell dinner",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 6",
      title: "Departure",
      route: "Shillong → Guwahati",
      activities: [
        "Relaxed breakfast & checkout",
        "Transfer to Guwahati for departure",
      ],
    },
  ],
  "7n-guwahati-shillong-kaziranga-tour": [
    {
      day: "Day 1",
      title: "Arrival Guwahati",
      route: "Guwahati city",
      activities: [
        "Airport / station pickup",
        "Kamakhya Temple visit",
        "Brahmaputra River sunset cruise (optional)",
      ],
      overnight: "Guwahati",
    },
    {
      day: "Day 2",
      title: "Guwahati → Shillong",
      route: "Guwahati → Umiam Lake → Shillong",
      activities: [
        "Drive to Shillong with Umiam Lake stop",
        "Shillong city orientation",
        "Evening at Police Bazaar",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 3",
      title: "Cherrapunjee Day",
      route: "Shillong → Cherrapunjee → Shillong",
      activities: [
        "Nohkalikai Falls & Seven Sisters Falls",
        "Mawsmai Cave",
        "Mawkdok Valley viewpoint",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 4",
      title: "Dawki & Mawlynnong",
      route: "Shillong → Mawlynnong → Dawki → Shillong",
      activities: [
        "Umngot River boating at Dawki",
        "Mawlynnong cleanest village & Riwai root bridge",
        "Border viewpoint",
      ],
      overnight: "Shillong",
    },
    {
      day: "Day 5",
      title: "Shillong → Kaziranga",
      route: "Shillong → Kaziranga (~5–6 hrs)",
      activities: [
        "Scenic drive to Kaziranga National Park",
        "Check-in at resort near the park",
        "Evening cultural Bihu dance program (optional)",
      ],
      overnight: "Kaziranga",
    },
    {
      day: "Day 6",
      title: "Kaziranga Safari Day",
      route: "Kaziranga National Park",
      activities: [
        "Early-morning elephant / jeep safari for one-horned rhinos",
        "Afternoon jeep safari in a different range",
        "Wildlife photography — rhinos, elephants, deer & birds",
      ],
      overnight: "Kaziranga",
    },
    {
      day: "Day 7",
      title: "Kaziranga → Guwahati",
      route: "Kaziranga → Guwahati (~5 hrs)",
      activities: [
        "Optional second morning safari",
        "Drive back to Guwahati",
        "Leisure shopping at Fancy Bazaar / Pan Bazaar",
      ],
      overnight: "Guwahati",
    },
    {
      day: "Day 8",
      title: "Departure",
      route: "Guwahati",
      activities: [
        "Breakfast & checkout",
        "Transfer to Guwahati airport / station",
      ],
    },
  ],
  "5n-6d-tawang-tour": [
    {
      day: "Day 1",
      title: "Guwahati / Tezpur → Bhalukpong → Dirang",
      route: "Tezpur → Bhalukpong → Dirang (~6 hrs)",
      activities: [
        "Pickup & drive towards Arunachal foothills",
        "Permit formalities at Bhalukpong",
        "Drive through Tippi & Sessa to Dirang valley",
      ],
      overnight: "Dirang",
    },
    {
      day: "Day 2",
      title: "Dirang → Sela Pass → Tawang",
      route: "Dirang → Sela Pass (13,700 ft) → Tawang",
      activities: [
        "Cross the iconic Sela Pass & Sela Lake",
        "Jaswant Garh War Memorial",
        "Nuranang (Jang) Falls",
        "Arrive Tawang by evening",
      ],
      overnight: "Tawang",
    },
    {
      day: "Day 3",
      title: "Tawang Monastery & Local Sightseeing",
      route: "Tawang town",
      activities: [
        "Tawang Monastery — India's largest",
        "Tawang War Memorial",
        "Craft centre & local markets",
        "Urgelling Monastery (birthplace of the 6th Dalai Lama)",
      ],
      overnight: "Tawang",
    },
    {
      day: "Day 4",
      title: "Bumla Pass & Madhuri Lake Excursion",
      route: "Tawang → Sangetsar → Tawang (permit required)",
      activities: [
        "Madhuri (Sangetsar) Lake",
        "PTSO Lake",
        "Bumla Pass Indo-China border (subject to permit & weather)",
      ],
      overnight: "Tawang",
    },
    {
      day: "Day 5",
      title: "Tawang → Bomdila",
      route: "Tawang → Bomdila (~6 hrs)",
      activities: [
        "Return drive over Sela Pass",
        "Bomdila Monastery & viewpoint",
        "Apple orchards & craft centre",
      ],
      overnight: "Bomdila",
    },
    {
      day: "Day 6",
      title: "Bomdila → Guwahati / Tezpur (Departure)",
      route: "Bomdila → Tezpur → Guwahati",
      activities: [
        "Drive back through Bhalukpong",
        "Drop at Tezpur / Guwahati for departure",
      ],
    },
  ],
  "6n-7d-arunachal-pradesh-tour": [
    {
      day: "Day 1",
      title: "Guwahati / Tezpur → Bhalukpong",
      route: "Guwahati → Bhalukpong (~5 hrs)",
      activities: [
        "Pickup & drive to the Arunachal gateway",
        "Inner Line Permit formalities",
        "Evening by the Kameng River",
      ],
      overnight: "Bhalukpong",
    },
    {
      day: "Day 2",
      title: "Bhalukpong → Dirang",
      route: "Bhalukpong → Tippi → Dirang",
      activities: [
        "Tippi Orchid Centre",
        "Sessa Orchid Sanctuary",
        "Dirang Dzong & hot springs",
      ],
      overnight: "Dirang",
    },
    {
      day: "Day 3",
      title: "Dirang → Sangti Valley → Bomdila",
      route: "Dirang → Sangti → Bomdila",
      activities: [
        "Sangti Valley scenic walk (winter black-necked cranes)",
        "Bomdila Monastery & viewpoint",
        "Local craft centre",
      ],
      overnight: "Bomdila",
    },
    {
      day: "Day 4",
      title: "Bomdila → Sela Pass → Tawang",
      route: "Bomdila → Sela Pass → Tawang",
      activities: [
        "Sela Pass & Sela Lake",
        "Jaswant Garh War Memorial",
        "Nuranang Falls, arrive Tawang",
      ],
      overnight: "Tawang",
    },
    {
      day: "Day 5",
      title: "Tawang Monastery & Town",
      route: "Tawang town",
      activities: [
        "Tawang Monastery & War Memorial",
        "Urgelling Monastery & craft centre",
        "Local markets",
      ],
      overnight: "Tawang",
    },
    {
      day: "Day 6",
      title: "Madhuri Lake & Bumla Approach",
      route: "Tawang → Sangetsar → Tawang",
      activities: [
        "Madhuri (Sangetsar) Lake & PTSO Lake",
        "Bumla Pass approach (subject to permit & weather)",
        "Return to Tawang",
      ],
      overnight: "Tawang",
    },
    {
      day: "Day 7",
      title: "Tawang → Guwahati / Tezpur (Departure)",
      route: "Tawang → Bomdila → Tezpur → Guwahati",
      activities: [
        "Long scenic return drive",
        "Drop at Tezpur / Guwahati for departure",
      ],
    },
  ],
  "7n-8d-tawang-tour": [
    {
      day: "Day 1",
      title: "Guwahati / Tezpur → Bhalukpong",
      route: "Guwahati → Bhalukpong",
      activities: [
        "Pickup & drive to Arunachal foothills",
        "Permit formalities",
        "Relaxed evening by the Kameng River",
      ],
      overnight: "Bhalukpong",
    },
    {
      day: "Day 2",
      title: "Bhalukpong → Dirang",
      route: "Bhalukpong → Tippi → Dirang",
      activities: [
        "Tippi Orchid Centre & Sessa Orchid Sanctuary",
        "Dirang Dzong & hot water springs",
        "Acclimatisation evening in Dirang valley",
      ],
      overnight: "Dirang",
    },
    {
      day: "Day 3",
      title: "Dirang Leisure & Sangti Valley",
      route: "Dirang → Sangti → Dirang",
      activities: [
        "Sangti Valley nature walk",
        "National Yak Research Centre",
        "Apple orchards & kiwi farms (seasonal)",
      ],
      overnight: "Dirang",
    },
    {
      day: "Day 4",
      title: "Dirang → Sela Pass → Tawang",
      route: "Dirang → Sela Pass → Tawang",
      activities: [
        "Sela Pass (13,700 ft) & Sela Lake",
        "Jaswant Garh War Memorial",
        "Nuranang Falls, arrive Tawang",
      ],
      overnight: "Tawang",
    },
    {
      day: "Day 5",
      title: "Tawang Monastery & Heritage",
      route: "Tawang town",
      activities: [
        "Tawang Monastery — India's largest",
        "Tawang War Memorial & craft centre",
        "Urgelling Monastery & local markets",
      ],
      overnight: "Tawang",
    },
    {
      day: "Day 6",
      title: "Bumla Pass & Madhuri Lake",
      route: "Tawang → Sangetsar → Tawang",
      activities: [
        "Madhuri (Sangetsar) Lake & PTSO Lake",
        "Bumla Pass Indo-China border (permit & weather permitting)",
        "Return to Tawang",
      ],
      overnight: "Tawang",
    },
    {
      day: "Day 7",
      title: "Tawang → Bomdila",
      route: "Tawang → Sela Pass → Bomdila",
      activities: [
        "Return over Sela Pass",
        "Bomdila Monastery & viewpoint",
        "Apple orchards & local craft centre",
      ],
      overnight: "Bomdila",
    },
    {
      day: "Day 8",
      title: "Bomdila → Guwahati / Tezpur (Departure)",
      route: "Bomdila → Tezpur → Guwahati",
      activities: [
        "Scenic descent through Bhalukpong",
        "Drop at Tezpur / Guwahati for departure",
      ],
    },
  ],
};

PACKAGE_ITINERARIES["meghalaya-group-trip-6n-7d"] = PACKAGE_ITINERARIES["6n-7d-meghalaya-tour"];

/** The next departure dates (ISO yyyy-mm-dd) for a package with fixed departures, from `from`. */
export const upcomingDepartures = (p: SignaturePackage, from: Date, count = 8): string[] => {
  if (!p.departures) return [];
  const out: string[] = [];
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate() + 1));
  for (let i = 0; i < 400 && out.length < count; i++, d.setUTCDate(d.getUTCDate() + 1)) {
    if (d.getUTCDay() === p.departures.weekday && p.departures.months.includes(d.getUTCMonth() + 1)) {
      out.push(d.toISOString().slice(0, 10));
    }
  }
  return out;
};

export const getPackageItinerary = (slug: string): ItineraryDay[] | undefined =>
  PACKAGE_ITINERARIES[slug];

// Resolved lazily (first use) so no image lookup runs while modules are still loading.
const REGION_IMAGE_KEYS: Record<PackageRegion, string[]> = {
  Meghalaya: [
    "xtsyvoyage/Meghalaya Cover Image.jpeg",
    "xtsyvoyage/Nongriat Double Decker Root Bridge.jpeg",
    "xtsyvoyage/Dawki River.jpeg",
    "xtsyvoyage/Nohkalikai Falls.jpeg",
    "xtsyvoyage/Mawlynnong.jpeg",
  ],
  "Arunachal Pradesh": [
    "xtsyvoyage/Arunachal Pradesh Cover Image.jpeg",
    "xtsyvoyage/Bumla Pass Bike Expedition.jpeg",
  ],
  "Assam & Meghalaya": [
    "xtsyvoyage/Assam Cover Image.jpeg",
    "xtsyvoyage/Meghalaya Cover Image.jpeg",
    "xtsyvoyage/Dawki River.jpeg",
  ],
};

const FALLBACK_REGION_IMAGE = "/img/o/xtsyvoyage-meghalaya-cover-image-736.webp";
const regionImageCache: Partial<Record<string, string[]>> = {};
function regionImages(region: string): string[] {
  const hit = regionImageCache[region];
  if (hit) return hit;
  let list: string[] = [];
  try {
    const keys = REGION_IMAGE_KEYS[region as PackageRegion] ?? REGION_IMAGE_KEYS.Meghalaya;
    list = keys.map((k) => cdn(k)).filter((u) => u && !u.endsWith("placeholder.svg"));
  } catch (err) {
    console.error("[signaturePackages] region image lookup failed", region, err);
  }
  if (!list.length) list = [FALLBACK_REGION_IMAGE];
  regionImageCache[region] = list;
  return list;
}

export const signaturePackageToTourPackage = (p: SignaturePackage): TourPackage => {
  const imgs = regionImages(p.region);
  return {
    id: 9000 + SIGNATURE_PACKAGES.indexOf(p),
    title: p.title,
    description: p.shortDescription,
    duration: p.duration,
    difficulty: "Easy",
    price: formatPackagePrice(p.pricePerPerson),
    image: imgs[0],
    images: imgs,
    rating: 4.7,
    category: "leisure",
    location: p.region,
    region: p.region,
    highlights: p.highlights,
    bestSeason: "Oct–Apr",
    groupSize: p.departures ? "Join solo — fixed group departures" : p.minGroup ? `Min ${p.minGroup} travellers` : undefined,
    fixedPrice: true,
    itinerary: PACKAGE_ITINERARIES[p.slug],
    inclusions: [
      "Accommodation on twin/triple sharing",
      "Daily breakfast",
      p.departures ? "Shared group transport throughout the tour" : "Private transport throughout the tour",
      `Pickup & drop: ${p.pickupDrop}`,
      "Experienced local driver-guide",
      "All applicable permits & entry coordination",
    ],
    exclusions: [
      "Flights / trains to & from the start point",
      "Lunch & dinner (unless specified)",
      "Personal expenses, tips & shopping",
      "Anything not listed in inclusions",
    ],
    faqs: [
      { q: "Is this a fixed price?", a: `Yes — ${formatPackagePrice(p.pricePerPerson)} per person is a fixed, transparent rate. We never generate random pricing.` },
      { q: "What is the pickup & drop point?", a: p.pickupDrop },
      { q: "Who is this package ideal for?", a: p.idealFor.join(", ") + "." },
      p.departures
        ? { q: "Can I join on my own?", a: "Yes. Book one seat on any Saturday departure; you travel with the other guests on that date. For your own dates or a private group, see the 6 Nights 7 Days Meghalaya Tour." }
        : { q: "Can I customise the itinerary?", a: "Yes, dates and stays can be tailored. Message us on WhatsApp to personalise this package." },
    ],
  };
};
