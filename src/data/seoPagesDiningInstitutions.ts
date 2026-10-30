// ============================================================================
// TAB BISTRO BY XTSY — INSTITUTION CLUSTER (New Shillong Township)
// ----------------------------------------------------------------------------
// TAB Bistro sits in New Shillong Township, within a few minutes of the
// campuses and the hospital that bring most weekday footfall to Mawdiangdiang:
// NEIGRIMS, NEIAH, NIFT Shillong, IIM Shillong and Martin Luther Christian
// University. Before this file, NEIGRIMS and MLCU appeared nowhere on the site
// at all, so searches like "restaurant near NEIGRIMS" had nothing to match.
//
// Two rules were applied when writing these pages:
//
//  1. Only dishes that are actually on the printed menu are named. The older
//     dining pages advertise pizza, momos, burgers, sizzlers and Khasi food,
//     none of which TAB Bistro serves; that mistake is not repeated here.
//  2. The lunch position is stated honestly. The kitchen is closed for walk-in
//     lunch and takes preorders only, which is exactly what a student or a
//     hospital attendant needs to know before walking over.
// ============================================================================
import type { SEOPageData, SchemaType } from './seoPages';
import { BISTRO_BREAKFAST, BISTRO_EVENING, BISTRO_LAST_ORDER } from './tabBistroHours';

const TAB_CTA = 'Dine at TAB Bistro';
const TAB_LINK = '/tab-bistro';

const HOURS_LINE =
  `Breakfast ${BISTRO_BREAKFAST.label} and dinner ${BISTRO_EVENING.label} ` +
  `(last order ${BISTRO_LAST_ORDER.label}) every day. The kitchen is closed for walk-in lunch; ` +
  `lunch is taken as a preorder, which suits a group booking a table ahead of time.`;

interface Institution {
  slug: string;
  /** Full name, spelled out once for search and for readers who do not know the acronym. */
  full: string;
  short: string;
  /** What this audience actually comes in for. */
  audience: string;
  occasions: string[];
  keywords: string[];
}

const INSTITUTIONS: Institution[] = [
  {
    slug: 'restaurant-near-neigrims-shillong',
    full: 'North Eastern Indira Gandhi Regional Institute of Health and Medical Sciences (NEIGRIMS)',
    short: 'NEIGRIMS',
    audience:
      'doctors coming off a shift, students between postings, and families staying nearby while a relative is admitted',
    occasions: [
      'An early breakfast before a morning shift',
      'A proper sit-down dinner after a long day on the ward',
      'A quiet table for a family staying near the hospital',
      'Preordered lunch for a department or a visiting team',
    ],
    keywords: [
      'restaurant near neigrims',
      'restaurants near neigrims shillong',
      'food near neigrims',
      'neigrims shillong food',
      'places to eat near neigrims',
    ],
  },
  {
    slug: 'restaurant-near-nift-shillong',
    full: 'the National Institute of Fashion Technology (NIFT), Shillong',
    short: 'NIFT Shillong',
    audience: 'students, faculty and parents visiting for juries, exhibitions and convocation',
    occasions: [
      'Breakfast before a morning jury',
      'A table for a studio group after submissions',
      'Dinner with parents visiting for the weekend',
      'A preordered lunch for a class or a department event',
    ],
    keywords: [
      'restaurant near nift shillong',
      'food near nift shillong',
      'cafe near nift shillong',
      'nift shillong restaurants',
      'places to eat near nift shillong',
    ],
  },
  {
    slug: 'restaurant-near-iim-shillong',
    full: 'the Indian Institute of Management (IIM) Shillong',
    short: 'IIM Shillong',
    audience: 'students, visiting faculty and recruiters in town for placement week',
    occasions: [
      'Dinner for a study group that has had enough of the mess',
      'A quiet table to host a recruiter or a guest speaker',
      'Breakfast before an early session',
      'A preordered group lunch during placement or conference week',
    ],
    keywords: [
      'restaurant near iim shillong',
      'food near iim shillong',
      'iim shillong restaurants',
      'places to eat near iim shillong',
      'dinner near iim shillong',
    ],
  },
  {
    slug: 'restaurant-near-neiah-shillong',
    full: 'the North Eastern Institute of Ayurveda and Homoeopathy (NEIAH)',
    short: 'NEIAH',
    audience: 'students and staff on campus, and families visiting them',
    occasions: [
      'Breakfast before class',
      'Dinner out without going into central Shillong',
      'A table for a family visiting for the weekend',
      'A preordered lunch for a batch or a campus event',
    ],
    keywords: [
      'restaurant near neiah shillong',
      'food near neiah',
      'neiah shillong restaurants',
      'places to eat near neiah',
      'cafe near neiah shillong',
    ],
  },
  {
    slug: 'restaurant-near-mlcu-shillong',
    full: 'Martin Luther Christian University (MLCU)',
    short: 'MLCU',
    audience: 'students, faculty and visiting families',
    occasions: [
      'Breakfast before a morning lecture',
      'Dinner with friends at the end of the week',
      'A table for parents in town for a few days',
      'A preordered lunch for a department or society event',
    ],
    keywords: [
      'restaurant near mlcu shillong',
      'martin luther christian university restaurants',
      'food near mlcu',
      'places to eat near mlcu shillong',
      'cafe near martin luther christian university',
    ],
  },
];

const institutionPage = (i: Institution): SEOPageData => ({
  slug: i.slug,
  category: 'restaurants',
  schemaType: 'Restaurant' as SchemaType,
  title: `Restaurants Near ${i.short}, New Shillong Township | TAB Bistro by XTSY`,
  metaDescription:
    `Looking for a place to eat near ${i.short}? TAB Bistro by XTSY is in New Shillong Township, minutes away — ` +
    `North Indian, Indo-Chinese, tandoor, biryani, South Indian and pasta, with breakfast and dinner daily and lunch on preorder.`,
  h1: `Where to eat near ${i.short}`,
  intro:
    `TAB Bistro by XTSY is a multi-cuisine restaurant in New Shillong Township, a few minutes from ${i.full}. ` +
    `It is built for the people who are actually around here on a weekday — ${i.audience} — rather than for ` +
    `visitors passing through on a tour. ${HOURS_LINE}`,
  sections: [
    {
      heading: `What people from ${i.short} come in for`,
      content:
        `The menu runs across North Indian gravies and a live tandoor, Indo-Chinese, dum biryani, South Indian ` +
        `breakfast and hand-crafted pasta, so a table of six rarely has to agree on one cuisine. Portions are ` +
        `sized to share and the kitchen is comfortable with large orders given notice.`,
      listItems: i.occasions,
    },
    {
      heading: 'What is on the menu',
      content:
        `Everything listed here is on the current menu, with prices exclusive of 5% GST.`,
      listItems: [
        'Tandoor — tandoori chicken, chicken tikka, paneer tikka, malai broccoli, tandoori prawns',
        'North Indian — butter masala, kadhai, lababdar, chicken kosha, dal makhani, fresh naan and kulcha',
        'Indo-Chinese — Manchurian, Schezwan and Kung Pao, Hakka noodles, fried rice and chopsuey',
        'XTSY dum biryani — veg, egg and chicken, plus chicken mandi for two or four',
        'South Indian — masala dosa, egg dosa, Kerala parotta, curd rice, steamed rice with rasam',
        'Breakfast — poha, omelettes, parathas, puri sabji and pancakes',
        'Pasta, shakes, mojitos and fresh lemonades',
      ],
    },
    {
      heading: 'Getting here',
      content:
        `TAB Bistro is on Mawdiangdiang Road in New Shillong Township, at XTSY Travellers Hostel. ` +
        `It is a short drive or a walkable distance from the campuses and the hospital in the township, which ` +
        `is the point: you do not have to go down into central Shillong and back for a decent dinner. ` +
        `Parking is on site, and tables can be reserved ahead on WhatsApp.`,
    },
  ],
  faqs: [
    {
      question: `Is there a good restaurant near ${i.short}?`,
      answer:
        `Yes. TAB Bistro by XTSY is a multi-cuisine restaurant in New Shillong Township, minutes from ${i.short}, ` +
        `serving North Indian, tandoor, Indo-Chinese, biryani, South Indian and pasta. ${HOURS_LINE}`,
    },
    {
      question: 'Can we come for lunch?',
      answer:
        `Not as a walk-in. The kitchen runs breakfast ${BISTRO_BREAKFAST.label} and dinner ${BISTRO_EVENING.label}, ` +
        `and is closed in between. Lunch is available as a preorder, so a group that calls ahead can be seated and fed ` +
        `at a set time — which is usually what a class, a department or a visiting team needs anyway.`,
    },
    {
      question: 'Do you take group bookings and bulk orders?',
      answer:
        'Yes. Group tables, preordered lunches, department dinners and bulk catering orders are all handled, with ' +
        'notice. Message the XTSY desk on WhatsApp with your numbers and the date and the kitchen will confirm.',
    },
    {
      question: 'Is it vegetarian-friendly?',
      answer:
        'Yes. There are full veg sections across tandoor, North Indian gravies, Indo-Chinese, biryani, South Indian ' +
        'and pasta, not a token dish or two, so a mixed veg and non-veg table works without compromise.',
    },
  ],
  relatedSlugs: ['restaurant-in-shillong', 'best-restaurant-in-shillong', 'breakfast-in-shillong'],
  ctaText: TAB_CTA,
  ctaLink: TAB_LINK,
  keywords: [
    ...i.keywords,
    'restaurant in new shillong township',
    'restaurant near mawdiangdiang',
    'tab bistro by xtsy',
  ],
  quickAnswer:
    `TAB Bistro by XTSY, in New Shillong Township, is the nearest multi-cuisine restaurant to ${i.short}. ` +
    `Breakfast ${BISTRO_BREAKFAST.label} and dinner ${BISTRO_EVENING.label} daily; lunch by preorder.`,
});

export const diningInstitutionPages: SEOPageData[] = INSTITUTIONS.map(institutionPage);
