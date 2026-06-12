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
import type { TourPackage } from "./travelData";
import { cdn } from "./cdnImages";

const REGION_IMAGES: Record<PackageRegion, string[]> = {
  Meghalaya: [
    cdn("xtsyvoyage/Meghalaya Cover Image.jpeg"),
    cdn("xtsyvoyage/Nongriat Double Decker Root Bridge.jpeg"),
    cdn("xtsyvoyage/Dawki River.jpeg"),
    cdn("xtsyvoyage/Nohkalikai Falls.jpeg"),
    cdn("xtsyvoyage/Mawlynnong.jpeg"),
  ],
  "Arunachal Pradesh": [
    cdn("xtsyvoyage/Arunachal Pradesh Cover Image.jpeg"),
    cdn("xtsyvoyage/Bumla Pass Bike Expedition.jpeg"),
  ],
  "Assam & Meghalaya": [
    cdn("xtsyvoyage/Assam Cover Image.jpeg"),
    cdn("xtsyvoyage/Meghalaya Cover Image.jpeg"),
    cdn("xtsyvoyage/Dawki River.jpeg"),
  ],
};

export const signaturePackageToTourPackage = (p: SignaturePackage): TourPackage => {
  const imgs = REGION_IMAGES[p.region] ?? [cdn("xtsyvoyage/Meghalaya Cover Image.jpeg")];
  return {
    id: 9000 + SIGNATURE_PACKAGES.indexOf(p),
    title: p.title,
    description: p.shortDescription,
    duration: p.duration,
    difficulty: "Easy",
    price: formatPackagePrice(p.pricePerPerson),
    image: imgs[0],
    images: imgs,
    rating: 4.8,
    category: "leisure",
    location: p.region,
    region: p.region,
    highlights: p.highlights,
    bestSeason: "Oct–Apr",
    groupSize: p.minGroup ? `Min ${p.minGroup} travellers` : undefined,
    fixedPrice: true,
    inclusions: [
      "Accommodation on twin/triple sharing",
      "Daily breakfast",
      "Private transport throughout the tour",
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
      { q: "Can I customise the itinerary?", a: "Yes, dates and stays can be tailored. Message us on WhatsApp to personalise this package." },
    ],
  };
};
