// ============================================================================
// TAB BISTRO BY XTSY — HIGH-DEPTH RESTAURANT & CATERING SPOKE PAGES
// ----------------------------------------------------------------------------
// A small set of authoritative, deep "spoke" landing pages (6 rich sections,
// 5 FAQs, quickAnswer) that anchor the dining + catering clusters. Unlike the
// thin programmatic dining pages, these are content-deep hubs that the StayEat
// Explore module on destination pages and itineraries links INTO.
//
// Every page:
//   • carries `schemaType: 'Restaurant'` (rendered as unique Restaurant JSON-LD
//     with @id, geo, hours and menu in ProgrammaticSEOPage.tsx)
//   • routes its CTA to /tab-bistro (or /tab-bistro/catering for catering hubs)
//   • is force-kept indexable via DINING_SPOKE_SLUGS in seoQualityFilter.ts
// ============================================================================
import type { SEOPageData, SchemaType } from './seoPages';

const spoke = (
  slug: string,
  title: string,
  metaDescription: string,
  h1: string,
  intro: string,
  sections: { heading: string; content: string; listItems?: string[] }[],
  faqs: { question: string; answer: string }[],
  relatedSlugs: string[],
  keywords: string[],
  quickAnswer: string,
  ctaLink = '/tab-bistro',
): SEOPageData => ({
  slug,
  category: 'restaurants',
  schemaType: 'Restaurant' as SchemaType,
  title,
  metaDescription,
  h1,
  intro,
  sections,
  faqs,
  relatedSlugs,
  ctaText: 'Dine at TAB Bistro',
  ctaLink,
  keywords,
  quickAnswer,
});

const baseFaqs = [
  {
    question: 'Where exactly is TAB Bistro by XTSY located?',
    answer:
      'TAB Bistro by XTSY sits on Mawdiangdiang Road in New Shillong Township, a cab ride from Police Bazaar and right beside XTSY Travellers Hostel — easy to reach by cab or self-drive, with parking on site.',
  },
  {
    question: 'What are TAB Bistro\'s opening hours?',
    answer: 'TAB Bistro is open every day from 9:00 AM to 10:30 PM, serving all-day breakfast, lunch, dinner and café orders.',
  },
  {
    question: 'Does TAB Bistro take reservations and large group bookings?',
    answer:
      'Yes. You can reserve a table or book a group section on WhatsApp at +91 88373 17070. TAB Bistro also handles private dining, parties, corporate lunches and full-scale catering.',
  },
];

export const DINING_SPOKE_SLUGS: string[] = [
  'tab-bistro-by-xtsy-restaurant',
  'best-chinese-restaurant-in-shillong',
  'restaurant-in-police-bazar',
  'best-restaurant-shillong',
  'catering-services-in-shillong',
  'wedding-catering-services-shillong',
  'party-catering-shillong',
  'corporate-event-catering-shillong',
];

export const DINING_SPOKE_PAGES: SEOPageData[] = [
  // ── 1. FLAGSHIP RESTAURANT SPOKE ──────────────────────────────────────────
  spoke(
    'tab-bistro-by-xtsy-restaurant',
    'TAB Bistro by XTSY — Multi-Cuisine Forest Restaurant in Shillong',
    'TAB Bistro by XTSY is a multi-cuisine forest-dining restaurant in New Shillong Township. Barbecue, tandoor, Chinese, Thai, Italian & Khasi food. Open 9 AM–10:30 PM.',
    'TAB Bistro by XTSY — Shillong\'s Multi-Cuisine Forest Restaurant',
    'TAB Bistro by XTSY is Shillong\'s multi-cuisine forest-dining restaurant, set among the pines of New Shillong Township beside XTSY Travellers Hostel. From a live charcoal barbecue and tandoor to Indo-Chinese, Thai, Italian and authentic Khasi plates, it brings global flavours to one warm, lantern-lit space — open all day, every day.',
    [
      { heading: 'A Forest-Dining Experience in Shillong', content: 'TAB Bistro pairs serious cooking with a setting you will not forget — pine views, warm lighting and an open kitchen.', listItems: ['Indoor and covered outdoor forest seating', 'Live charcoal barbecue & tandoor counter', 'Open kitchen with daily-fresh prep', 'Family, couple and large-group sections', 'On-site parking and step-free access'] },
      { heading: 'The Menu — 10+ Cuisines Under One Roof', content: 'Whatever your table is craving, TAB Bistro has a dish for it.', listItems: ['North Indian curries, biryani & tandoori', 'Indo-Chinese & Thai wok dishes', 'Wood-fired pizza & Italian pasta', 'Charcoal barbecue platters & sizzlers', 'Continental mains, soups & salads', 'Authentic Khasi & Northeast specials'] },
      { heading: 'All-Day Breakfast, Café & Rooftop Vibes', content: 'Mornings start early at TAB Bistro with a full breakfast spread and a proper café menu.', listItems: ['All-day breakfast — eggs, pancakes, parathas', 'Espresso, cold brew, shakes & mocktails', 'Fresh bakes, desserts & forest-side coffee', 'Great Wi-Fi for a slow brunch or work session'] },
      { heading: 'Why Travellers & Locals Choose TAB Bistro', content: 'TAB Bistro is the dining home of the XTSY hospitality group, trusted by guests across Meghalaya.', listItems: ['15% in-house discount for XTSY hostel guests', 'Veg, non-veg, vegan & Jain-friendly options', 'Reservations, private dining & catering', 'Hygienic, FSSAI-aligned kitchen standards', 'Walkable from XTSY Travellers Hostel'] },
      { heading: 'Catering, Parties & Bulk Orders', content: 'Beyond the dining room, TAB Bistro caters events across Shillong and Meghalaya — from intimate dinners to destination weddings.', listItems: ['Wedding & destination-wedding catering', 'Corporate lunches & retreat catering', 'Birthday & private party menus', 'Bulk and party food orders', 'Custom multi-cuisine buffet packages'] },
      { heading: 'How to Find & Book TAB Bistro', content: 'TAB Bistro is on Mawdiangdiang Road, New Shillong Township, near NIFT and IIM Shillong. Reserve a table, plan a party, or order catering on WhatsApp at +91 88373 17070, or explore the full menu on the TAB Bistro page.' },
    ],
    [...baseFaqs, { question: 'Is TAB Bistro good for families and couples?', answer: 'Yes — TAB Bistro has dedicated family seating and quieter couple-friendly corners with forest views, plus a kids-friendly menu and high chairs on request.' }, { question: 'Does TAB Bistro have vegetarian and vegan options?', answer: 'Absolutely. There is a large vegetarian menu across every cuisine, plus vegan and Jain-friendly dishes — just let the team know your preference.' }],
    ['best-place-to-eat-in-shillong', 'best-food-in-shillong', 'restaurant-in-shillong', 'cafe-shillong', 'catering-services-in-shillong'],
    ['tab bistro shillong', 'tab bistro by xtsy', 'restaurant in shillong', 'best place to eat in shillong', 'multi cuisine restaurant shillong', 'forest dining shillong'],
    'TAB Bistro by XTSY is a multi-cuisine forest-dining restaurant in New Shillong Township serving barbecue, tandoor, Chinese, Thai, Italian and Khasi food, open daily 9 AM–10:30 PM with catering on request.',
  ),

  // ── 2. BEST CHINESE RESTAURANT ────────────────────────────────────────────
  spoke(
    'best-chinese-restaurant-in-shillong',
    'Best Chinese Restaurant in Shillong — Indo-Chinese & Thai | TAB Bistro',
    'Craving the best Chinese restaurant in Shillong? TAB Bistro by XTSY serves Indo-Chinese, Thai & pan-Asian wok dishes, hakka noodles, momos & more. Open 9 AM–10:30 PM.',
    'Best Chinese Restaurant in Shillong',
    'When you want the best Chinese restaurant in Shillong, TAB Bistro by XTSY delivers smoky wok-tossed Indo-Chinese and pan-Asian classics — hakka noodles, chilli chicken, momos and aromatic Thai curries — all cooked fresh in a forest-side kitchen in New Shillong Township.',
    [
      { heading: 'Why TAB Bistro Tops Shillong\'s Chinese Food Scene', content: 'TAB Bistro brings high-heat wok cooking and balanced Asian flavours to Shillong.', listItems: ['Authentic high-flame wok technique', 'Indo-Chinese, Thai & pan-Asian menu', 'Veg, non-veg & seafood options', 'Generous portions for sharing', 'Dine-in, takeaway & catering'] },
      { heading: 'Must-Try Chinese & Asian Dishes', content: 'The plates Shillong keeps coming back for:', listItems: ['Hakka & Schezwan noodles', 'Chilli chicken & chilli paneer', 'Steamed & fried momos with chutney', 'Thai red, green & basil curries', 'Manchurian, fried rice & spring rolls'] },
      { heading: 'Indo-Chinese vs Authentic Thai — Have Both', content: 'TAB Bistro spans the full Asian spectrum, from desi-style Indo-Chinese heat to fragrant Thai curries with jasmine rice — perfect for mixed tables that can never agree.', listItems: ['Indo-Chinese gravies & dry starters', 'Thai curries, soups & stir-fries', 'Tom yum & tom kha soups', 'Veg and seafood Thai bowls'] },
      { heading: 'Great for Groups, Dates & Late Dinners', content: 'Open until 10:30 PM with comfortable seating, TAB Bistro suits everything from a quick noodle fix to a full Asian feast.', listItems: ['Family & large-group sections', 'Couple-friendly forest-view seating', 'Open 9 AM–10:30 PM daily', 'Reservations on WhatsApp'] },
      { heading: 'Order Chinese for Parties & Events', content: 'Planning a get-together? TAB Bistro caters Asian and multi-cuisine spreads for parties, offices and weddings across Shillong.', listItems: ['Asian party platters & live noodle counters', 'Bulk momo & starter orders', 'Custom buffet menus', 'Corporate & event catering'] },
      { heading: 'Visit or Order from TAB Bistro', content: 'Find TAB Bistro on Mawdiangdiang Road, New Shillong Township, near NIFT and IIM Shillong. Reserve a table or order Chinese for a crowd on WhatsApp at +91 88373 17070.' },
    ],
    [...baseFaqs, { question: 'Does TAB Bistro serve authentic Thai food too?', answer: 'Yes — alongside Indo-Chinese, TAB Bistro serves Thai red, green and basil curries, tom yum and tom kha soups, and Thai fried rice and noodles.' }, { question: 'Can I order Chinese food in bulk for a party?', answer: 'Yes. TAB Bistro offers bulk and party orders for Asian and multi-cuisine menus — message +91 88373 17070 with your headcount and date.' }],
    ['chinese-food-in-shillong', 'best-place-to-eat-in-shillong', 'restaurant-in-shillong', 'tab-bistro-by-xtsy-restaurant', 'party-catering-shillong'],
    ['best chinese restaurant in shillong', 'chinese restaurant shillong', 'indo chinese restaurant shillong', 'chinese food in shillong', 'thai restaurant shillong', 'momos in shillong'],
    'TAB Bistro by XTSY is among the best Chinese restaurants in Shillong, serving Indo-Chinese and Thai wok dishes — hakka noodles, chilli chicken, momos and Thai curries — open daily 9 AM–10:30 PM.',
  ),

  // ── 3. RESTAURANT IN POLICE BAZAR ─────────────────────────────────────────
  spoke(
    'restaurant-in-police-bazar',
    'Restaurant in Police Bazar Shillong — Multi-Cuisine Dining | TAB Bistro',
    'Looking for a restaurant near Police Bazar in Shillong? TAB Bistro by XTSY is a short drive away — barbecue, Chinese, North Indian, pizza & Khasi food. Open 9 AM–10:30 PM.',
    'Restaurant in Police Bazar, Shillong',
    'Police Bazar is Shillong\'s buzzing heart, and the city\'s best multi-cuisine dining is just minutes away at TAB Bistro by XTSY in New Shillong Township. Swap the crowded market lanes for a calm forest setting with barbecue, Chinese, North Indian, pizza and Khasi food — without losing the easy 10-minute hop from Police Bazar.',
    [
      { heading: 'Dining Near Police Bazar', content: 'Police Bazar is packed with cafés and street food, but for a full sit-down multi-cuisine meal, TAB Bistro is the easy upgrade just a short cab ride away.', listItems: ['A cab ride from Police Bazar', 'Calm forest setting vs busy market', 'Full multi-cuisine menu & bar snacks', 'Parking on site', 'Open late till 10:30 PM'] },
      { heading: 'What to Eat at TAB Bistro', content: 'A menu that covers every craving the market sparks:', listItems: ['Charcoal barbecue & tandoor platters', 'Indo-Chinese & Thai favourites', 'North Indian curries & biryani', 'Wood-fired pizza & pasta', 'Khasi & Northeast specials'] },
      { heading: 'Perfect After Shopping or Sightseeing', content: 'Police Bazar is the launchpad for Ward\'s Lake, Don Bosco Museum and Shillong Peak. TAB Bistro is the ideal refuel stop before or after exploring.', listItems: ['Great for post-shopping lunches', 'Relaxed dinners after sightseeing', 'All-day breakfast for early starts', 'Café menu for coffee & cake breaks'] },
      { heading: 'Café, Breakfast & Rooftop Feel', content: 'Beyond mains, TAB Bistro runs a full café — espresso, shakes, fresh bakes and forest-view seating that the market simply cannot offer.', listItems: ['Espresso, cold brew & mocktails', 'All-day breakfast spread', 'Desserts & fresh bakes', 'Wi-Fi-friendly seating'] },
      { heading: 'Catering & Parties from Police Bazar to Shillong', content: 'Hosting near Police Bazar or anywhere in Shillong? TAB Bistro caters parties, offices and weddings across the city.', listItems: ['Party & birthday catering', 'Corporate lunch delivery', 'Wedding & event catering', 'Bulk and party food orders'] },
      { heading: 'How to Reach TAB Bistro from Police Bazar', content: 'From Police Bazar, take a cab toward Mawdiangdiang Road in New Shillong Township. Reserve a table or order ahead on WhatsApp at +91 88373 17070.' },
    ],
    [...baseFaqs, { question: 'How far is TAB Bistro from Police Bazar?', answer: 'TAB Bistro is a cab ride from Police Bazar, on Mawdiangdiang Road in New Shillong Township, with on-site parking.' }, { question: 'Is there good food near Police Bazar for families?', answer: 'Yes — TAB Bistro, a short drive from Police Bazar, has family seating, a multi-cuisine menu and a kids-friendly menu, making it a great family dining choice.' }],
    ['restaurants-in-police-bazar-shillong', 'best-restaurant-in-police-bazar-shillong', 'best-place-to-eat-in-shillong', 'tab-bistro-by-xtsy-restaurant', 'cafe-shillong'],
    ['restaurant in police bazar', 'best restaurant in police bazar', 'restaurants in police bazar shillong', 'places to eat in police bazar', 'food in police bazar shillong'],
    'TAB Bistro by XTSY is a multi-cuisine restaurant in New Shillong Township, a cab ride from Police Bazar, serving barbecue, Chinese, North Indian, pizza and Khasi food, open daily 9 AM–10:30 PM.',
  ),

  // ── 4. BEST RESTAURANT SHILLONG ───────────────────────────────────────────
  spoke(
    'best-restaurant-shillong',
    'Best Restaurant in Shillong 2026 — Top Multi-Cuisine Dining | TAB Bistro',
    'The best restaurant in Shillong for 2026 — TAB Bistro by XTSY. Barbecue, Chinese, North Indian, Italian & Khasi food in a forest setting. Open 9 AM–10:30 PM.',
    'Best Restaurant in Shillong',
    'Searching for the best restaurant in Shillong? TAB Bistro by XTSY blends a stunning pine-forest setting with a genuinely wide, well-executed multi-cuisine menu — barbecue and tandoor, Indo-Chinese and Thai, Italian, Continental and authentic Khasi food — making it a top pick for travellers and locals alike.',
    [
      { heading: 'What Makes a Restaurant the Best in Shillong', content: 'TAB Bistro checks every box travellers look for:', listItems: ['Wide, consistent multi-cuisine menu', 'Memorable forest-dining ambience', 'Veg, non-veg, vegan & Jain options', 'Friendly service & fair pricing', 'Open all day till 10:30 PM'] },
      { heading: 'The TAB Bistro Menu', content: 'Ten-plus cuisines, all cooked fresh:', listItems: ['Charcoal barbecue & tandoor', 'North Indian curries & biryani', 'Indo-Chinese & Thai wok dishes', 'Wood-fired pizza & pasta', 'Khasi & Northeast specialities'] },
      { heading: 'Best for Every Occasion', content: 'From solo travellers to big celebrations, TAB Bistro fits the moment.', listItems: ['Couple dinners with forest views', 'Family meals & kids menu', 'Group celebrations & parties', 'Work-friendly café brunches'] },
      { heading: 'Café, Breakfast & Desserts', content: 'A full café complements the kitchen with coffee, shakes, fresh bakes and an all-day breakfast spread.', listItems: ['Espresso, cold brew & mocktails', 'All-day breakfast', 'Desserts & fresh bakes', 'Wi-Fi-friendly seating'] },
      { heading: 'More Than a Restaurant — Catering & Events', content: 'As the dining arm of the XTSY group, TAB Bistro also caters weddings, corporate events and parties across Meghalaya.', listItems: ['Wedding & destination-wedding catering', 'Corporate & retreat catering', 'Party & birthday menus', 'Bulk and party food orders'] },
      { heading: 'Visit TAB Bistro', content: 'TAB Bistro is on Mawdiangdiang Road, New Shillong Township, near NIFT and IIM Shillong. Reserve your table on WhatsApp at +91 88373 17070 or browse the full menu on the TAB Bistro page.' },
    ],
    [...baseFaqs, { question: 'What is the best restaurant in Shillong for tourists?', answer: 'TAB Bistro by XTSY is a favourite with tourists thanks to its forest setting, broad multi-cuisine menu and location beside XTSY Travellers Hostel — convenient for travellers exploring Meghalaya.' }, { question: 'Is TAB Bistro expensive?', answer: 'TAB Bistro is mid-range and fair value for its setting and menu range, with an extra 15% in-house discount for XTSY hostel guests.' }],
    ['best-place-to-eat-in-shillong', 'best-food-in-shillong', 'restaurant-in-shillong', 'tab-bistro-by-xtsy-restaurant', 'best-chinese-restaurant-in-shillong'],
    ['best restaurant shillong', 'best restaurant in shillong', 'top restaurant in shillong', 'best place to eat in shillong', 'multi cuisine restaurant shillong'],
    'TAB Bistro by XTSY is widely rated among the best restaurants in Shillong — a multi-cuisine forest restaurant serving barbecue, Chinese, North Indian, Italian and Khasi food, open daily 9 AM–10:30 PM.',
  ),

  // ── 5. CATERING SERVICES HUB ──────────────────────────────────────────────
  spoke(
    'catering-services-in-shillong',
    'Catering Services in Shillong — Weddings, Corporate & Parties | TAB Bistro',
    'Professional catering services in Shillong by TAB Bistro by XTSY. Wedding, corporate, party & bulk food catering with multi-cuisine menus. Get a quote on WhatsApp.',
    'Catering Services in Shillong',
    'TAB Bistro by XTSY offers full-service catering across Shillong and Meghalaya — from destination weddings and corporate retreats to birthday parties and bulk food orders. With a 10+ cuisine kitchen, live counters and experienced event staff, we handle the food so you can host with confidence.',
    [
      { heading: 'Catering Services We Offer', content: 'One team for every kind of event in Shillong:', listItems: ['Wedding & destination-wedding catering', 'Corporate lunches, retreats & conferences', 'Birthday & private party catering', 'Bulk and party food orders', 'Live counters — barbecue, chaat, noodles, tandoor'] },
      { heading: 'Multi-Cuisine Catering Menus', content: 'Build a buffet from across our kitchen:', listItems: ['North Indian & tandoor spreads', 'Indo-Chinese & Thai live counters', 'Continental & Italian stations', 'Khasi & Northeast regional menus', 'Desserts, bakery & beverage counters'] },
      { heading: 'How Our Catering Works', content: 'Booking catering with TAB Bistro is simple and transparent.', listItems: ['Share date, venue, headcount & cuisine preference', 'Get a custom menu & quote', 'Tasting on request for large events', 'Setup, live cooking & service by our team', 'Veg, non-veg, vegan & Jain options'] },
      { heading: 'Weddings & Destination Events', content: 'Meghalaya is a rising destination-wedding spot, and TAB Bistro caters scenic celebrations with multi-day menus and on-site live cooking.', listItems: ['Multi-day wedding menus', 'On-site live cooking & buffet setup', 'Custom regional & global spreads', 'Coordination with venues & planners'] },
      { heading: 'Corporate & Bulk Catering', content: 'Reliable, hygienic catering for offices and large groups across Shillong.', listItems: ['Daily office lunch catering', 'Conference & retreat meals', 'Bulk food orders for institutions', 'Packed-meal & buffet formats'] },
      { heading: 'Get a Catering Quote', content: 'Tell us your event date, venue, guest count and cuisine preferences for a tailored quote. Message TAB Bistro catering on WhatsApp at +91 88373 17070 or open the catering page to start.' },
    ],
    [...baseFaqs, { question: 'How much notice does TAB Bistro need for catering?', answer: 'For parties we suggest a few days; for weddings and large corporate events, a couple of weeks helps us plan menus, staff and tastings. Last-minute bulk orders are accommodated where possible.' }, { question: 'Can TAB Bistro cater pure-veg or Jain events?', answer: 'Yes — we offer fully vegetarian, vegan and Jain-friendly catering menus, as well as mixed veg and non-veg spreads.' }],
    ['wedding-catering-services-shillong', 'corporate-event-catering-shillong', 'party-catering-shillong', 'tab-bistro-by-xtsy-restaurant', 'best-restaurant-shillong'],
    ['catering services in shillong', 'catering in shillong', 'caterers in shillong', 'event catering shillong', 'bulk food order shillong', 'order party food near me'],
    'TAB Bistro by XTSY provides full catering services in Shillong — weddings, corporate events, parties and bulk orders — with multi-cuisine menus and live counters. Get a quote on WhatsApp at +91 88373 17070.',
    '/tab-bistro/catering',
  ),

  // ── 6. WEDDING CATERING ───────────────────────────────────────────────────
  spoke(
    'wedding-catering-services-shillong',
    'Wedding Catering Services in Shillong — Destination Weddings | TAB Bistro',
    'Wedding catering services in Shillong & Meghalaya by TAB Bistro by XTSY. Multi-cuisine wedding menus, live counters & destination-wedding catering. Get a quote.',
    'Wedding Catering Services in Shillong',
    'Planning a wedding in Shillong or a destination wedding in Meghalaya? TAB Bistro by XTSY delivers full wedding catering — multi-day menus, live cooking counters and experienced service staff — so your celebration tastes as memorable as the misty hills it happens in.',
    [
      { heading: 'Complete Wedding Catering', content: 'Everything your wedding food needs, handled by one team:', listItems: ['Multi-day wedding menus', 'Mehendi, sangeet & reception spreads', 'Live counters — barbecue, chaat, tandoor, noodles', 'Veg, non-veg, vegan & Jain menus', 'On-site setup & service staff'] },
      { heading: 'Multi-Cuisine Wedding Menus', content: 'Curate a spread your guests will remember:', listItems: ['North Indian & tandoor mains', 'Indo-Chinese & Thai live stations', 'Continental & Italian counters', 'Khasi & Northeast regional dishes', 'Dessert, bakery & beverage stations'] },
      { heading: 'Destination Weddings in Meghalaya', content: 'Meghalaya\'s lakes, pine forests and viewpoints make stunning wedding backdrops, and TAB Bistro caters them end to end.', listItems: ['On-site live cooking at scenic venues', 'Coordination with planners & venues', 'Custom regional & global spreads', 'Catering paired with XTSY stays & tours'] },
      { heading: 'How We Plan Your Wedding Menu', content: 'A clear, calm process for one of your biggest days.', listItems: ['Share date, venue & guest count', 'Receive a custom menu & quote', 'Menu tasting for large events', 'Final headcount & logistics lock-in', 'Execution by our event team'] },
      { heading: 'Stay, Dine & Celebrate with XTSY', content: 'As part of the XTSY hospitality group, we can pair wedding catering with guest stays at XTSY Travellers Hostel and curated Meghalaya tours for your wedding party.', listItems: ['Group accommodation for guests', 'Pre/post-wedding tours & experiences', 'Welcome dinners at TAB Bistro', 'One point of contact for food & stay'] },
      { heading: 'Get a Wedding Catering Quote', content: 'Share your wedding dates, venue, guest count and cuisine preferences for a tailored proposal. Message TAB Bistro on WhatsApp at +91 88373 17070 or open the catering page.' },
    ],
    [...baseFaqs, { question: 'Does TAB Bistro cater destination weddings outside Shillong?', answer: 'Yes — TAB Bistro caters destination weddings across Meghalaya, including lakeside and forest venues, with on-site live cooking and full service staff.' }, { question: 'Can you handle large wedding guest counts?', answer: 'Yes. TAB Bistro scales menus and staffing for large weddings; share your guest count and we will plan counters, menu and logistics accordingly.' }],
    ['catering-services-in-shillong', 'corporate-event-catering-shillong', 'party-catering-shillong', 'destination-wedding-shillong', 'tab-bistro-by-xtsy-restaurant'],
    ['wedding catering services shillong', 'wedding catering shillong', 'destination wedding catering', 'wedding caterers in shillong', 'wedding food catering meghalaya'],
    'TAB Bistro by XTSY provides wedding and destination-wedding catering across Shillong and Meghalaya, with multi-day multi-cuisine menus, live counters and full service staff. Get a quote at +91 88373 17070.',
    '/tab-bistro/catering',
  ),

  // ── 7. PARTY CATERING ─────────────────────────────────────────────────────
  spoke(
    'party-catering-shillong',
    'Party Catering & Bulk Food Orders in Shillong | TAB Bistro by XTSY',
    'Party catering and bulk food orders in Shillong by TAB Bistro by XTSY. Birthdays, get-togethers & celebrations with multi-cuisine menus. Order party food on WhatsApp.',
    'Party Catering & Bulk Food Orders in Shillong',
    'From birthday bashes to house parties and get-togethers, TAB Bistro by XTSY makes party food easy in Shillong — multi-cuisine menus, live counters and reliable bulk orders, delivered or set up so you can enjoy your own party.',
    [
      { heading: 'Party Catering Made Easy', content: 'Host without the stress — we cook, you celebrate:', listItems: ['Birthday & house-party catering', 'Get-together & reunion menus', 'Live counters — barbecue, momos, chaat', 'Bulk and party food orders', 'Setup & service options'] },
      { heading: 'Crowd-Pleasing Party Menus', content: 'Menus designed for sharing:', listItems: ['Barbecue & tandoor platters', 'Indo-Chinese starters & noodles', 'North Indian mains & biryani', 'Pizza, pasta & finger food', 'Desserts & beverage counters'] },
      { heading: 'Bulk Food Orders', content: 'Need food for a big group at short notice? TAB Bistro handles bulk orders across Shillong.', listItems: ['Bulk starters, mains & desserts', 'Packed-meal & buffet formats', 'Custom quantity & cuisine mix', 'Veg, non-veg, vegan & Jain options'] },
      { heading: 'Great for Every Celebration', content: 'Whatever the occasion, there is a menu for it.', listItems: ['Birthdays & anniversaries', 'Office parties & team lunches', 'Festive & family gatherings', 'Welcome dinners for travellers'] },
      { heading: 'Order Party Food in Shillong', content: 'Share your date, guest count and menu preferences for a quick quote. Message TAB Bistro on WhatsApp at +91 88373 17070 — or visit the catering page for buffet and live-counter options.' },
      { heading: 'Why Order from TAB Bistro', content: 'TAB Bistro brings restaurant-quality, hygienic, multi-cuisine food to your party with the backing of the XTSY hospitality group — consistent, fairly priced and reliable.', listItems: ['Restaurant-quality party food', 'Hygienic, FSSAI-aligned kitchen', 'Fair, transparent pricing', 'One contact for food & setup'] },
    ],
    [...baseFaqs, { question: 'Can I place a bulk food order for a party at short notice?', answer: 'Yes — TAB Bistro accommodates last-minute bulk and party orders where possible. Message +91 88373 17070 with your headcount, menu and timing.' }, { question: 'Do you deliver party food or only set it up on-site?', answer: 'Both — TAB Bistro offers delivery of bulk party orders as well as on-site buffet setup and live counters, depending on your venue and headcount.' }],
    ['catering-services-in-shillong', 'wedding-catering-services-shillong', 'corporate-event-catering-shillong', 'tab-bistro-by-xtsy-restaurant', 'best-chinese-restaurant-in-shillong'],
    ['party catering shillong', 'bulk food order shillong', 'order party food near me', 'birthday party catering shillong', 'bulk order food near me'],
    'TAB Bistro by XTSY offers party catering and bulk food orders in Shillong — birthdays, get-togethers and celebrations — with multi-cuisine menus and live counters. Order on WhatsApp at +91 88373 17070.',
    '/tab-bistro/catering',
  ),

  // ── 8. CORPORATE CATERING ─────────────────────────────────────────────────
  spoke(
    'corporate-event-catering-shillong',
    'Corporate & Event Catering in Shillong | TAB Bistro by XTSY',
    'Corporate and event catering in Shillong by TAB Bistro by XTSY. Office lunches, conferences, retreats & team events with multi-cuisine menus. Get a corporate quote.',
    'Corporate & Event Catering in Shillong',
    'TAB Bistro by XTSY is the reliable catering partner for businesses in Shillong — office lunches, conferences, retreats and team events, served with hygienic, multi-cuisine menus and on-time delivery so your day runs smoothly.',
    [
      { heading: 'Corporate Catering Services', content: 'Dependable food for every business occasion:', listItems: ['Daily & one-off office lunch catering', 'Conference & seminar meals', 'Corporate retreat catering', 'Team lunches & celebrations', 'Packed-meal & buffet formats'] },
      { heading: 'Menus That Suit the Office', content: 'Balanced, crowd-friendly menus across cuisines:', listItems: ['North Indian & tandoor mains', 'Indo-Chinese & Thai options', 'Continental & Italian dishes', 'Light, healthy salads & bowls', 'Veg, non-veg, vegan & Jain options'] },
      { heading: 'Retreats & Off-Sites in Meghalaya', content: 'Pairing a corporate retreat with Meghalaya\'s scenery? TAB Bistro caters off-sites and the XTSY group can bundle stays and team experiences.', listItems: ['Retreat & off-site meal catering', 'On-site live cooking options', 'Group stays at XTSY Travellers Hostel', 'Team tours & experiences via XTSY'] },
      { heading: 'Reliable, Hygienic & On Time', content: 'Corporate clients need consistency — that is what TAB Bistro delivers.', listItems: ['Hygienic, FSSAI-aligned kitchen', 'Punctual delivery & setup', 'Consistent quality at scale', 'Transparent corporate billing'] },
      { heading: 'How to Book Corporate Catering', content: 'Booking is straightforward and tailored to your team.', listItems: ['Share date, location & headcount', 'Receive a custom menu & quote', 'Recurring or one-off scheduling', 'Setup, delivery & service options'] },
      { heading: 'Get a Corporate Catering Quote', content: 'Tell us your date, location, headcount and menu preferences for a tailored corporate quote. Message TAB Bistro on WhatsApp at +91 88373 17070 or open the catering page.' },
    ],
    [...baseFaqs, { question: 'Does TAB Bistro offer recurring office lunch catering?', answer: 'Yes — TAB Bistro can set up recurring daily or weekly office lunch catering with rotating multi-cuisine menus. Share your schedule and headcount for a plan.' }, { question: 'Can you cater corporate retreats outside Shillong?', answer: 'Yes — TAB Bistro caters corporate retreats and off-sites across Meghalaya, with on-site cooking options and bundled XTSY stays and team experiences.' }],
    ['catering-services-in-shillong', 'wedding-catering-services-shillong', 'party-catering-shillong', 'tab-bistro-by-xtsy-restaurant', 'best-restaurant-shillong'],
    ['corporate catering shillong', 'corporate event catering shillong', 'office lunch catering shillong', 'conference catering shillong', 'event catering shillong'],
    'TAB Bistro by XTSY provides corporate and event catering in Shillong — office lunches, conferences and retreats — with hygienic multi-cuisine menus and on-time delivery. Get a quote at +91 88373 17070.',
    '/tab-bistro/catering',
  ),
];
