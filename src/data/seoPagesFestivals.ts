/**
 * Festival pages — a cluster Zostel does not cover.
 *
 * Meghalaya's festival season (November above all) is when Shillong fills up and travellers
 * search months ahead. The Shillong Cherry Blossom Festival's permanent venue, New Shillong
 * Highland Grounds, is in New Shillong — the same township as XTSY Travellers Hostel — so the
 * hostel is genuinely close to it, unlike stays in central Shillong.
 *
 * Dates are from Meghalaya Tourism and state press reports (checked 22 October 2026). Traditional
 * festival dates are set by village authorities and move year to year, so the copy says so rather
 * than inventing precision.
 */
import type { SEOPageData } from './seoPages';

const CHERRY_VENUE = 'New Shillong Highland Grounds, New Shillong';

export const FESTIVAL_SEO_PAGES: SEOPageData[] = [
  {
    slug: 'shillong-cherry-blossom-festival',
    category: 'seasonal',
    schemaType: 'TravelGuide',
    title: 'Shillong Cherry Blossom Festival 2026: Dates & Stay',
    metaDescription:
      'Shillong Cherry Blossom Festival 2026 runs 20-21 November at New Shillong Highland Grounds. Dates, tickets, getting there, and where to stay nearby from ₹399.',
    h1: 'Shillong Cherry Blossom Festival 2026',
    intro:
      'India’s only cherry blossom festival takes place on 20 and 21 November 2026 at its new permanent home, New Shillong Highland Grounds. XTSY Travellers Hostel is in the same township, New Shillong, so you are minutes from the ground rather than driving in from the city. Dorm beds start at ₹399 a night, all inclusive.',
    sections: [
      {
        heading: 'Dates, venue and tickets',
        content:
          'The 2026 edition runs across two days in late November, when Shillong’s Himalayan cherry trees bloom. The festival moved to a permanent government-allotted ground in New Shillong, which is a change from the earlier Ward’s Lake and Polo Ground editions.',
        listItems: [
          'Dates: 20-21 November 2026',
          `Venue: ${CHERRY_VENUE}`,
          'Tickets: sold through the official organiser, Rockski; single-day passes started at about ₹2,500 including taxes',
          'First-wave headliners announced: Khalid, Swae Lee and Boys Like Girls',
          'Check the official Meghalaya Tourism page before booking travel, as line-ups and timings change',
        ],
      },
      {
        heading: 'Why staying in New Shillong matters this week',
        content:
          'On festival nights, central Shillong traffic backs up and cabs become scarce and expensive after the last set. XTSY is in New Shillong Township, the same side of the city as the Highland Grounds, near NIFT and IIM Shillong, so getting back after the show is short and simple.',
        listItems: [
          'Same township as the festival ground',
          'Dorm beds ₹399, 6-bed ₹499, women-only 4-bed ₹599, King Double ₹2,399, all inclusive',
          'TAB Bistro on site for late dinner after the music',
          'Check-in from 11 AM, check-out strictly 10 AM',
          'Book early: festival week is the busiest of the Shillong year',
        ],
      },
      {
        heading: 'Getting to Shillong for the festival',
        content:
          'Most travellers fly or take a train to Guwahati, then drive 3 to 3.5 hours to Shillong. Shared taxis leave Guwahati’s Paltan Bazar through the day; a private cab can be arranged by the XTSY desk. Umroi airport near Shillong has limited flights. Book transport well ahead for festival weekend, as seats sell out.',
      },
      {
        heading: 'What else to do while the blossoms are out',
        content:
          'Late November is the best travel window of the year in Meghalaya: waterfalls still run, skies are clear, and the Umngot River at Dawki has turned glass-clear. Pair the festival with a few days on the road.',
        listItems: [
          'Sohra (Cherrapunji) waterfalls and caves, about 2 hours away',
          'Dawki and Shnongpdeng on the Umngot River, about 3 hours',
          'Mawlynnong and the Riwai living root bridge',
          'Laitlum Canyons at sunrise, about an hour from New Shillong',
          'Wangala, the Garo 100 Drums festival, falls in the same month in West Garo Hills',
        ],
      },
    ],
    faqs: [
      {
        question: 'When is the Shillong Cherry Blossom Festival 2026?',
        answer:
          'It runs on 20 and 21 November 2026 at New Shillong Highland Grounds, the festival’s new permanent venue in New Shillong.',
      },
      {
        question: 'Where is the Cherry Blossom Festival held now?',
        answer:
          'At New Shillong Highland Grounds in New Shillong, a permanent ground allotted by the state government. Earlier editions were held at Ward’s Lake and the Polo Ground in central Shillong.',
      },
      {
        question: 'How much are Cherry Blossom Festival tickets?',
        answer:
          'Single-day passes started at roughly ₹2,500 including taxes for the 2026 edition, sold through the official organiser Rockski. Prices rise closer to the dates, and two-day passes are usually offered.',
      },
      {
        question: 'Where should I stay for the Shillong Cherry Blossom Festival?',
        answer:
          'Stay in New Shillong if you can, because it is the same township as the Highland Grounds venue and avoids late-night traffic back into the city. XTSY Travellers Hostel has dorm beds from ₹399 a night and a King Double at ₹2,399, all inclusive, with TAB Bistro on site.',
      },
      {
        question: 'Do the cherry blossoms actually bloom during the festival?',
        answer:
          'Usually, yes. Shillong’s Himalayan cherry trees flower in November, which is why the festival is held then, but the exact peak shifts by a week or two with the weather.',
      },
      {
        question: 'How far in advance should I book a stay for festival week?',
        answer:
          'Several weeks at least. Festival weekend is the busiest of the Shillong year and beds, rooms and cabs all sell out. Book direct to avoid booking-site mark-ups.',
      },
    ],
    relatedSlugs: ['best-time-to-visit-meghalaya', 'meghalaya-festivals', 'best-hostel-in-shillong'],
    ctaText: 'Book a bed for festival week',
    ctaLink: '/book',
    keywords: [
      'shillong cherry blossom festival',
      'cherry blossom festival 2026',
      'cherry blossom festival shillong dates',
      'cherry blossom festival tickets',
      'where to stay cherry blossom festival shillong',
    ],
  },
  {
    slug: 'meghalaya-festivals',
    category: 'seasonal',
    schemaType: 'TravelGuide',
    title: 'Meghalaya Festivals: Dates, Places & How to Attend',
    metaDescription:
      'A traveller’s guide to Meghalaya’s festivals: Cherry Blossom, Wangala, Nongkrem, Shad Suk Mynsiem and Behdienkhlam. When they fall, where to go and how to plan.',
    h1: 'Festivals of Meghalaya: when they fall and how to plan around them',
    intro:
      'Meghalaya’s calendar runs on harvests, thanksgiving and the seasons, not on tourist timetables. Most traditional festival dates are set by village authorities a few weeks ahead, so plan the trip around the month and confirm the exact days closer to the time. November is the richest month, with the Cherry Blossom Festival in Shillong and Wangala in the Garo Hills.',
    sections: [
      {
        heading: 'The festival year at a glance',
        content:
          'Dates below were checked in October 2026. Traditional dates are announced by the Syiem or village councils and move year to year; only the Cherry Blossom Festival keeps fixed calendar dates.',
        listItems: [
          'April: Shad Suk Mynsiem, the Khasi spring thanksgiving dance, in Shillong',
          'Mid-July: Behdienkhlam in Jowai, West Jaintia Hills, the Pnar monsoon festival',
          'Mid-November: Wangala, the Garo 100 Drums harvest festival, at Asanang near Tura; the 2026 golden-jubilee edition is reported for 12-14 November, with 13 November a state holiday',
          'Mid-November: Nongkrem Dance at Smit, near Shillong; dates are set by the Syiem each year',
          '20-21 November 2026: Shillong Cherry Blossom Festival, New Shillong Highland Grounds',
        ],
      },
      {
        heading: 'Which festival suits which traveller',
        content:
          'They are very different occasions. Pick by what you want from the trip rather than by what is closest.',
        listItems: [
          'Live music and crowds: the Cherry Blossom Festival, with international headliners',
          'Traditional dance and ceremony: Nongkrem at Smit and Shad Suk Mynsiem in Shillong',
          'Drums, scale and the Garo Hills: Wangala at Asanang, a long drive west of Shillong',
          'Monsoon ritual and village life: Behdienkhlam in Jowai',
        ],
      },
      {
        heading: 'Attending respectfully',
        content:
          'Traditional festivals are religious and community events, not performances put on for visitors. A few things make a real difference.',
        listItems: [
          'Ask before photographing people, especially dancers and elders',
          'Dress modestly and follow instructions from organisers and village hosts',
          'Do not step into the dance ground or ceremonial areas',
          'Carry cash in small notes; networks are weak away from Shillong',
          'Hire a local guide where the village offers one',
        ],
      },
      {
        heading: 'Where to base yourself',
        content:
          'Shillong works as a base for the Cherry Blossom Festival, Nongkrem at Smit and Shad Suk Mynsiem. Jowai is a long day trip for Behdienkhlam, and Wangala in the Garo Hills needs its own trip, with an overnight in Tura. XTSY Travellers Hostel is in New Shillong Township, near the Cherry Blossom Festival’s Highland Grounds venue, with dorm beds from ₹399 a night and the XTSY desk arranging transport through trusted local partners.',
      },
    ],
    faqs: [
      {
        question: 'What is the biggest festival in Meghalaya?',
        answer:
          'By attendance, the Shillong Cherry Blossom Festival in November. Among traditional festivals, Wangala, the Garo 100 Drums festival, and Nongkrem Dance near Shillong are the largest.',
      },
      {
        question: 'When is Wangala festival 2026?',
        answer:
          'Wangala is held in mid-November at Asanang in West Garo Hills. The 2026 golden-jubilee edition has been reported for 12-14 November, with 13 November observed as a state holiday. Confirm with Meghalaya Tourism before booking, as the state announces the dates each year.',
      },
      {
        question: 'When is the Nongkrem dance festival?',
        answer:
          'Nongkrem is held at Smit, near Shillong, usually over five days in mid-November. The exact dates are set by the Syiem of Khyrim each year, so confirm closer to the month.',
      },
      {
        question: 'Which month is best for festivals in Meghalaya?',
        answer:
          'November. The Cherry Blossom Festival, Wangala and Nongkrem all fall in that month, and the weather is at its best, with clear skies and waterfalls still running after the monsoon.',
      },
      {
        question: 'Can tourists attend traditional Meghalaya festivals?',
        answer:
          'Yes, visitors are welcome at Nongkrem, Wangala, Shad Suk Mynsiem and Behdienkhlam. They are community and religious occasions rather than shows, so ask before photographing people, dress modestly and follow the organisers’ instructions.',
      },
      {
        question: 'Do I need to book accommodation early for festival season?',
        answer:
          'Yes. Shillong fills up for Cherry Blossom weekend and beds, rooms and cabs sell out weeks ahead. Booking direct avoids booking-site mark-ups.',
      },
    ],
    relatedSlugs: ['shillong-cherry-blossom-festival', 'best-time-to-visit-meghalaya', 'things-to-do-in-meghalaya'],
    ctaText: 'Plan a festival trip',
    ctaLink: '/book',
    keywords: [
      'meghalaya festivals',
      'festivals of meghalaya',
      'wangala festival',
      'nongkrem dance festival',
      'shad suk mynsiem',
      'behdienkhlam',
    ],
  },
];
