/**
 * brandFacts.ts — Canonical XTSY brand-positioning source of truth.
 *
 * Every programmatic + static SEO page imports from here so positioning,
 * awards, partners and property scope stay consistent across all 1,583+
 * URLs. Edit once → propagates everywhere.
 *
 * RULES (also tracked in mem://brand/positioning-master-v1):
 *  - The only own property is on Mawdiangdiang Road, New Shillong Township,
 *    Shillong 793018 (NOT Mawkhar / Police Bazaar / central Shillong).
 *    Anywhere else, XTSY facilitates stays, transport and travel help
 *    through trusted travel partners — do NOT claim a property.
 *  - Always credit XTSY Ventures Private Limited as parent company.
 *  - Pluxee partner badge + NEITA award line must be eligible to surface
 *    on every page (length-permitting).
 */

import type { SEOSection } from './seoPages';

export const BRAND = {
  legalName: 'XTSY Ventures Private Limited',
  brand: 'XTSY',
  hqCity: 'Shillong',
  hqState: 'Meghalaya',
  whatsapp: '+918837317070',
  whatsappDisplay: '+91 88373 17070',
  gstin: '17QSKPK1714H1ZE',
} as const;

/** XTSY's Google rating — used for the hostel, tours, travel and the Dawki campsite (booked via XTSY). */
export const GOOGLE_RATING = { value: '4.8', count: 161, label: '4.8★ · 161 Google reviews' } as const;

export const PROPERTY_ADDRESS = 'Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya 793018';
export const PROPERTY_CHECK_IN = '11:00';
export const PROPERTY_CHECK_OUT = '10:00';

export const OWN_PROPERTIES = [
  {
    name: 'XTSY Travellers Hostel',
    tagline: "Northeast India's Best Budget Accommodation",
    city: 'New Shillong Township, Shillong',
    description:
      "India's biggest backpacker hostel in Northeast — NEITA 2025 nominee, female-safe, with 24/7 arrival support. Standard check-in is 11 AM and check-out is strictly 10 AM.",
  },
  {
    name: 'Experience by XTSY',
    tagline: "India's First Stargaze Glamp",
    city: 'New Shillong Township, Shillong',
    description:
      'A first-of-its-kind panoramic glass suite designed for stargazing, anniversaries and slow luxury — built and operated in Shillong.',
  },
] as const;

export const AWARDS = [
  'Nominated: Best Budget-Friendly Accommodation, Northeast India Tourism Awards (NEITA 2025)',
  "Highest-rated hostel in Northeast India on Google (4.8★, 161 Google reviews)",
  "Experience by XTSY — India's first stargaze glamp",
] as const;

export const PARTNERS = [
  'Pluxee India (formerly Sodexo) — official hospitality partner for employee benefits',
  'Meghalaya Tourism Department — verified accommodation partner',
  'Trusted accommodation partner network across Meghalaya, NE India and Sikkim',
] as const;

export const GROUP_VENTURES = [
  {
    name: 'XTSY Tourism',
    summary: 'Curated tours across Northeast India, Sikkim & beyond — planned by XTSY, delivered with trusted travel partners outside New Shillong.',
  },
  {
    name: 'XTSY Destination Weddings',
    summary: 'End-to-end destination weddings in Meghalaya and Northeast India.',
  },
  {
    name: 'TAB Bistro & Catering',
    summary: 'In-house bistro and event catering — corporate, weddings and bulk orders.',
  },
  {
    name: 'XTSY Rentals',
    summary: 'Royal Enfield, scooters and self-drive cars for Northeast road trips.',
  },
  {
    name: 'XTSY Hospitality Tech',
    summary: 'AI-powered booking, channel-management and traveller-intelligence platform.',
  },
  {
    name: "Asia's First Stargazing Resort (upcoming)",
    summary: 'A multi-design stargazing resort under construction — first of its kind in Asia.',
  },
] as const;

/** One-sentence brand opener prepended to every programmatic page intro. */
export const BRAND_OPENER =
  "Backed by XTSY — Northeast India's NEITA 2025-nominated hospitality brand, operating India's biggest backpacker hostel and the country's first 270° stargaze glamping ensuite, both in Shillong.";

/** Property-scope disclaimer. Used wherever a non-Shillong stay is mentioned. */
export const PARTNER_NETWORK_NOTE =
  "Outside Shillong, XTSY arranges stays through our vetted accommodation partner network across Meghalaya, Northeast India and Sikkim. Our own properties are in Shillong.";

export const whyXTSYSection = (): SEOSection => ({
  heading: 'Why Travellers Pick XTSY',
  content:
    "XTSY is Northeast India's highest-rated independent hospitality brand — Shillong-born, traveller-built, and having hosted 10,786+ guests through owned properties, curated tours, weddings, catering and rentals.",
  listItems: [
    'NEITA 2025 nominee — Best Budget-Friendly Accommodation in Northeast India',
    "Experience by XTSY — India's first stargaze glamp",
    'Highest-rated hostel in Northeast on Google (4.8★, 161 Google reviews)',
    'Pluxee India partner — corporate stays via employee-benefit vouchers accepted',
    `24/7 WhatsApp booking & on-trip support — ${BRAND.whatsappDisplay}`,
    'Owned operations in Shillong + vetted partner network across NE India and Sikkim',
  ],
});

export const aboutXTSYGroupSection = (): SEOSection => ({
  heading: `About ${BRAND.brand} — Powered by ${BRAND.legalName}`,
  content: `${BRAND.brand} is an integrated travel & hospitality group from ${BRAND.hqCity}, ${BRAND.hqState}. Our group operates two own properties in Shillong and a curated services arm across Northeast India.`,
  listItems: GROUP_VENTURES.map(v => `${v.name} — ${v.summary}`).concat([
    `${PARTNER_NETWORK_NOTE}`,
  ]),
});

/** Brand-fact regex used by seoQualityFilter / seo-quality-scan. */
export const BRAND_FACT_PATTERNS: RegExp[] = [
  /NEITA/i,
  /Pluxee/i,
  /270°|270 degree/i,
  /XTSY (ONE )?Ventures/i,
  /Northeast India['']s|biggest hostel in Northeast/i,
];

export const hasBrandFacts = (text: string, min = 2): boolean =>
  BRAND_FACT_PATTERNS.filter(r => r.test(text)).length >= min;
