// ============================================================================
// TAB BISTRO BY XTSY — RESTAURANT & DINING SEO PAGES
// ----------------------------------------------------------------------------
// High-commercial-intent programmatic pages targeting Shillong restaurant,
// café, cuisine, locality, and catering keyword clusters. Every page carries
// Restaurant schema and routes its CTA to /tab-bistro (TAB Bistro by XTSY).
//
// NOTE: the `restaurants` category is capped in seoQualityFilter.ts — the cap
// must be large enough to keep these pages indexable (see PER_CATEGORY_CAP).
// ============================================================================
import type { SEOPageData, SchemaType } from './seoPages';

const TAB = 'Dine at TAB Bistro';
const TAB_LINK = '/tab-bistro';

const dish = (
  slug: string,
  title: string,
  metaDesc: string,
  h1: string,
  intro: string,
  sections: { heading: string; content: string; listItems?: string[] }[],
  faqs: { question: string; answer: string }[],
  related: string[],
  keywords: string[],
  quickAnswer?: string,
): SEOPageData => ({
  slug,
  category: 'restaurants',
  schemaType: 'Restaurant' as SchemaType,
  title,
  metaDescription: metaDesc,
  h1,
  intro,
  sections,
  faqs,
  relatedSlugs: related,
  ctaText: TAB,
  ctaLink: TAB_LINK,
  keywords,
  quickAnswer,
});

// Shared FAQ used across dining pages.
const tabFaq = {
  question: 'Where can I eat near XTSY in Shillong?',
  answer:
    'TAB Bistro by XTSY is a multi-cuisine forest-dining restaurant in New Shillong Township serving North Indian, tandoor, Indo-Chinese, Thai, Continental, Italian, seafood and Northeast cuisine. It is open 9 AM–10:30 PM, takes reservations, and also handles catering and bulk orders.',
};

export const DINING_SEO_PAGES: SEOPageData[] = [
  // ===== GENERAL "BEST FOOD / WHERE TO EAT" CLUSTER ========================
  dish(
    'best-place-to-eat-in-shillong',
    'Best Place to Eat in Shillong 2026 — Top Restaurant Guide',
    'Looking for the best place to eat in Shillong? Multi-cuisine dining, cafés, barbecue & Khasi food. Eat at TAB Bistro by XTSY — open 9 AM–10:30 PM.',
    'Best Place to Eat in Shillong',
    'From smoky barbecue and tandoor to Thai, Italian and authentic Khasi flavours, Shillong rewards hungry travellers. If you want one place that does it all, TAB Bistro by XTSY is a multi-cuisine forest-dining restaurant loved by guests and locals alike.',
    [
      { heading: 'Best Places to Eat in Shillong', content: 'Top dining picks for every craving:', listItems: ['TAB Bistro by XTSY — multi-cuisine, forest dining, barbecue & tandoor', 'Police Bazaar — cafés, momos and street food', 'Laitumkhrah — pubs, cafés and casual eateries', 'Iewduh (Bara Bazaar) — authentic Khasi jadoh stalls', 'Ward\'s Lake area — heritage cafés'] },
      { heading: 'Why TAB Bistro Tops the List', content: 'TAB Bistro brings global flavours to the pine forests of Shillong:', listItems: ['10+ cuisines under one roof', 'Live tandoor & barbecue grill', 'Veg and non-veg menus', 'In-house guest discount of 15%', 'Reservations, catering & bulk orders'] },
    ],
    [tabFaq, { question: 'What food is Shillong famous for?', answer: 'Shillong is famous for Khasi dishes like jadoh, doh khlieh and tungrymbai, plus a vibrant café and barbecue scene. TAB Bistro serves both regional and global cuisines.' }],
    ['best-food-in-shillong', 'restaurant-in-shillong', 'places-to-eat-in-shillong', 'cafe-shillong'],
    ['best place to eat in shillong', 'places to eat in shillong', 'where to eat in shillong', 'good food in shillong', 'best food near me'],
    'TAB Bistro by XTSY is one of the best places to eat in Shillong — a multi-cuisine forest restaurant serving barbecue, tandoor and global flavours, open 9 AM–10:30 PM.',
  ),
  dish(
    'best-food-in-shillong',
    'Best Food in Shillong — What & Where to Eat | TAB Bistro',
    'The best food in Shillong, from Khasi jadoh to barbecue, Chinese & Italian. Discover top dishes and dine at TAB Bistro by XTSY. Open 9 AM–10:30 PM.',
    'Best Food in Shillong',
    'Shillong\'s food scene blends Khasi tradition with global influence. Whether you crave smoky barbecue, hand-tossed momos, or a wood-fired pizza, here is what to eat — and where TAB Bistro by XTSY fits into your food map.',
    [
      { heading: 'Must-Try Food in Shillong', content: 'Dishes you should not miss:', listItems: ['Jadoh — Khasi rice with pork or chicken', 'Doh Khlieh — spiced pork salad', 'Momos & thukpa — Tibetan favourites', 'Barbecue & tandoor platters at TAB Bistro', 'Wood-fired pizza & continental mains'] },
      { heading: 'Best Food at TAB Bistro', content: 'Signature multi-cuisine plates loved by travellers:', listItems: ['Charcoal barbecue & sizzlers', 'North Indian thalis & tandoori', 'Indo-Chinese & Thai curries', 'Italian pasta & pizza', 'Hearty all-day breakfast'] },
    ],
    [tabFaq],
    ['best-place-to-eat-in-shillong', 'best-restaurants-shillong', 'khasi-food-guide', 'restaurant-in-shillong'],
    ['best food in shillong', 'best food places in shillong', 'good food in shillong', 'food in shillong', 'best food near me'],
    'The best food in Shillong ranges from Khasi jadoh to barbecue and global cuisine. TAB Bistro by XTSY serves 10+ cuisines, open 9 AM–10:30 PM.',
  ),
  dish(
    'places-to-eat-in-shillong',
    'Places to Eat in Shillong — Restaurants, Cafés & Barbecue',
    'Best places to eat in Shillong for every budget — restaurants, cafés, barbecue & Khasi food. Dine at TAB Bistro by XTSY. Open 9 AM–10:30 PM.',
    'Places to Eat in Shillong',
    'Planning where to eat in Shillong? From buzzing Police Bazaar cafés to forest-side fine dining, here are the best places to eat — with TAB Bistro by XTSY as a multi-cuisine all-rounder.',
    [
      { heading: 'Top Places to Eat', content: 'Eateries for every mood:', listItems: ['TAB Bistro by XTSY — multi-cuisine forest dining', 'Cafés in Laitumkhrah — coffee & live music', 'Police Bazaar — street food & quick bites', 'Family restaurants for groups & kids', 'Barbecue & grill nights'] },
      { heading: 'Plan Your Meal', content: 'Tips for dining out in Shillong:', listItems: ['Most kitchens close by 10:30 PM', 'Reserve ahead on weekends', 'TAB Bistro offers catering & bulk orders', 'Veg and non-veg options widely available', 'In-house XTSY guests get 15% off'] },
    ],
    [tabFaq],
    ['best-place-to-eat-in-shillong', 'restaurant-in-shillong', 'family-restaurant-shillong', 'cafe-shillong'],
    ['places to eat in shillong', 'places to eat', 'restaurants in shillong', 'dine in restaurants near me', 'food places near me'],
  ),
  dish(
    'good-restaurants-in-shillong',
    'Good Restaurants in Shillong — Top Rated Dining 2026',
    'Find good restaurants in Shillong with great food and ambiance. Multi-cuisine, barbecue, Chinese & veg options. TAB Bistro by XTSY. Open 9 AM–10:30 PM.',
    'Good Restaurants in Shillong',
    'Want a reliably good meal in Shillong? These restaurants consistently deliver on taste, service and ambiance — led by TAB Bistro by XTSY, a multi-cuisine forest-dining favourite.',
    [
      { heading: 'Good Restaurants to Try', content: 'Dependable picks across the city:', listItems: ['TAB Bistro by XTSY — multi-cuisine & barbecue', 'Chinese & Indo-Chinese specialists', 'Pure-veg & thali restaurants', 'Cafés with continental menus', 'Family-friendly dining spots'] },
      { heading: 'What Makes a Restaurant Good Here', content: 'TAB Bistro ticks every box:', listItems: ['Fresh ingredients & live grill', 'Wide multi-cuisine menu', 'Clean, scenic forest setting', '4.8★ XTSY hospitality standard', 'Easy reservations & catering'] },
    ],
    [tabFaq],
    ['best-restaurants-shillong', 'restaurant-in-shillong', 'best-place-to-eat-in-shillong'],
    ['good restaurants in shillong', 'best restaurants shillong', 'good restaurants near me', 'recommended restaurants near me', 'top restaurants near me'],
  ),

  // ===== CUISINE CLUSTER ===================================================
  dish(
    'best-chinese-restaurant-shillong',
    'Best Chinese Restaurant in Shillong — Indo-Chinese & Thai',
    'Best Chinese restaurant in Shillong for Indo-Chinese, Thai & Asian food. Noodles, dumplings, chilli & more at TAB Bistro by XTSY. Open 9 AM–10:30 PM.',
    'Best Chinese Restaurant in Shillong',
    'Craving noodles, dumplings or fiery chilli chicken? Shillong has a strong Indo-Chinese tradition, and TAB Bistro by XTSY plates up Chinese and Thai favourites alongside its multi-cuisine menu.',
    [
      { heading: 'Best Chinese & Asian Dishes', content: 'What to order:', listItems: ['Hakka & Schezwan noodles', 'Steamed & pan-fried momos/dumplings', 'Chilli chicken & paneer', 'Thai red & green curry', 'Manchurian & fried rice'] },
      { heading: 'Why TAB Bistro for Chinese Food', content: 'A reliable Indo-Chinese stop in Shillong:', listItems: ['Authentic wok-tossed flavours', 'Veg & non-veg options', 'Thai curries & Asian sides', 'Generous portions', 'Dine-in, catering & bulk orders'] },
    ],
    [{ question: 'Where is the best Chinese restaurant in Shillong?', answer: 'TAB Bistro by XTSY serves popular Indo-Chinese and Thai dishes — noodles, dumplings, chilli chicken and curries — as part of its multi-cuisine menu, open 9 AM–10:30 PM.' }, tabFaq],
    ['restaurant-in-shillong', 'best-restaurants-shillong', 'best-place-to-eat-in-shillong'],
    ['best chinese restaurant in shillong', 'chinese restaurant in shillong', 'chinese food', 'chinese food near me', 'chinese restaurant near me'],
  ),
  dish(
    'barbeque-restaurant-shillong',
    'Barbecue Restaurant in Shillong — BBQ & Grill | TAB Bistro',
    'Best barbecue restaurant in Shillong for grilled platters, tandoor & sizzlers. Smoky BBQ in a pine forest at TAB Bistro by XTSY. Open 9 AM–10:30 PM.',
    'Barbecue Restaurant in Shillong',
    'For smoky, char-grilled flavour, TAB Bistro by XTSY is a standout barbecue and grill destination in Shillong — live tandoor, sizzlers and barbecue platters served in a pine-forest setting.',
    [
      { heading: 'Barbecue & Grill Highlights', content: 'Fire-kissed favourites:', listItems: ['Charcoal barbecue platters', 'Tandoori chicken, fish & paneer', 'Sizzlers with sides', 'Grilled kebabs & skewers', 'Veg barbecue options'] },
      { heading: 'Barbecue Nights & Events', content: 'Perfect for groups and celebrations:', listItems: ['Group barbecue bookings', 'Catering for parties & events', 'Bulk & corporate orders', 'Forest-side ambiance', 'In-house guest discount of 15%'] },
    ],
    [{ question: 'Is there a barbecue restaurant in Shillong?', answer: 'Yes — TAB Bistro by XTSY serves charcoal barbecue, tandoor and sizzlers in a pine-forest setting, with group bookings and catering available.' }, tabFaq],
    ['restaurant-in-shillong', 'best-restaurants-shillong', 'wedding-catering-shillong'],
    ['barbeque restaurant shillong', 'barbecue restaurant shillong', 'bbq shillong', 'grill restaurant shillong', 'best food near me'],
  ),
  dish(
    'pure-veg-restaurant-shillong',
    'Pure Veg Restaurant in Shillong — Vegetarian Food Guide',
    'Pure veg & vegetarian restaurants in Shillong — thalis, South Indian, Chinese & continental veg. Dine at TAB Bistro by XTSY. Open 9 AM–10:30 PM.',
    'Pure Veg Restaurant in Shillong',
    'Vegetarian travellers are well looked after in Shillong. From hearty thalis to veg Chinese and continental plates, TAB Bistro by XTSY offers an extensive vegetarian menu alongside its multi-cuisine spread.',
    [
      { heading: 'Vegetarian Dishes to Try', content: 'Veg favourites on the menu:', listItems: ['Paneer tikka & tandoori veg', 'Veg thalis & North Indian curries', 'Veg Hakka noodles & Manchurian', 'Margherita & veggie pizzas', 'South Indian dosa & idli (breakfast)'] },
      { heading: 'Veg-Friendly Dining', content: 'Why veg diners choose TAB Bistro:', listItems: ['Dedicated vegetarian section', 'Jain-friendly options on request', 'No cross-contamination care', 'Veg catering & bulk orders', 'Veg breakfast all morning'] },
    ],
    [{ question: 'Are there pure veg restaurants in Shillong?', answer: 'Yes. Shillong has several vegetarian-friendly restaurants, and TAB Bistro by XTSY offers an extensive pure-veg menu with Jain-friendly options on request.' }, tabFaq],
    ['best-veg-restaurants-shillong', 'restaurant-in-shillong', 'best-place-to-eat-in-shillong'],
    ['pure veg restaurant in shillong', 'pure veg restaurants in shillong', 'best veg restaurants in shillong', 'vegetarian food near me', 'vegetarian restaurant near me'],
  ),
  dish(
    'best-veg-restaurants-shillong',
    'Best Veg Restaurants in Shillong — Top Vegetarian Dining',
    'Best vegetarian restaurants in Shillong with thalis, Chinese, Italian & South Indian veg food. Dine at TAB Bistro by XTSY. Open 9 AM–10:30 PM.',
    'Best Veg Restaurants in Shillong',
    'Shillong\'s best vegetarian dining combines variety with value. TAB Bistro by XTSY leads with a broad veg menu spanning Indian, Chinese, Italian and continental favourites.',
    [
      { heading: 'Top Veg Restaurants', content: 'Where vegetarians eat well:', listItems: ['TAB Bistro by XTSY — multi-cuisine veg menu', 'Pure-veg thali houses', 'South Indian veg eateries', 'Veg-friendly cafés', 'Pizza & pasta spots'] },
      { heading: 'Veg Menu Highlights', content: 'Crowd-pleasing vegetarian plates:', listItems: ['Veg tandoor & paneer specials', 'Veg Indo-Chinese', 'Continental veg mains', 'Veg pizza & pasta', 'Fresh salads & soups'] },
    ],
    [tabFaq],
    ['pure-veg-restaurant-shillong', 'best-restaurants-shillong', 'restaurant-in-shillong'],
    ['best veg restaurants in shillong', 'vegetarian restaurant near me', 'pure veg restaurant in shillong', 'vegetarian food near me', 'vegetarian cafe near me'],
  ),

  // ===== LOCALITY CLUSTER =================================================
  dish(
    'restaurants-in-laitumkhrah',
    'Restaurants in Laitumkhrah Shillong — Cafés & Dining Guide',
    'Best restaurants in Laitumkhrah, Shillong — cafés, Chinese, barbecue & multi-cuisine. Plan your meal and dine at TAB Bistro by XTSY. Open 9 AM–10:30 PM.',
    'Restaurants in Laitumkhrah, Shillong',
    'Laitumkhrah is one of Shillong\'s liveliest food neighbourhoods — packed with cafés, pubs and casual eateries. For a full multi-cuisine experience, TAB Bistro by XTSY is a short hop away in New Shillong Township.',
    [
      { heading: 'Dining in Laitumkhrah', content: 'What the area is known for:', listItems: ['Buzzing café culture & live music', 'Casual Chinese & momo joints', 'Continental & fast food', 'Student-friendly pricing', 'Late-evening hangouts'] },
      { heading: 'Pair It With TAB Bistro', content: 'When you want more variety:', listItems: ['Multi-cuisine forest dining', 'Barbecue & tandoor', 'Veg & non-veg menus', 'Reservations & catering', 'In-house guest discount of 15%'] },
    ],
    [{ question: 'Which are the best restaurants in Laitumkhrah?', answer: 'Laitumkhrah is famous for its cafés, Chinese eateries and casual dining. For a full multi-cuisine spread, TAB Bistro by XTSY nearby serves barbecue, tandoor and global cuisine.' }, tabFaq],
    ['restaurants-in-police-bazar-shillong', 'restaurant-in-shillong', 'cafe-shillong'],
    ['restaurants in laitumkhrah', 'best restaurants in laitumkhrah', 'restaurant in laitumkhrah', 'restaurants in laitumkhrah shillong', 'best restaurants in shillong laitumkhrah'],
  ),
  dish(
    'restaurants-in-police-bazar-shillong',
    'Restaurants in Police Bazar Shillong — Best Dining & Food',
    'Best restaurants in Police Bazar, Shillong — multi-cuisine, Chinese, street food & cafés. Plan your meal and dine at TAB Bistro by XTSY. Open 9 AM–10:30 PM.',
    'Restaurants in Police Bazar, Shillong',
    'Police Bazar is the beating heart of Shillong\'s food scene — restaurants, cafés and street food in every direction. For multi-cuisine forest dining away from the crowds, TAB Bistro by XTSY is a short drive away.',
    [
      { heading: 'Dining in Police Bazar', content: 'The area\'s food highlights:', listItems: ['Multi-cuisine & family restaurants', 'Indo-Chinese & momo stalls', 'Cafés & bakeries', 'Quick street-food bites', 'Late-evening dining'] },
      { heading: 'Why Add TAB Bistro', content: 'A scenic alternative for a full meal:', listItems: ['10+ cuisines under one roof', 'Barbecue, tandoor & sizzlers', 'Veg & non-veg menus', 'Catering & bulk orders', 'In-house guest discount of 15%'] },
    ],
    [{ question: 'Which is the best restaurant in Police Bazar Shillong?', answer: 'Police Bazar has many multi-cuisine and Chinese restaurants. For barbecue, tandoor and global cuisine in a forest setting, TAB Bistro by XTSY nearby is a top pick.' }, tabFaq],
    ['restaurants-in-laitumkhrah', 'restaurant-in-shillong', 'street-food-police-bazar'],
    ['best restaurant in police bazar shillong', 'restaurants in shillong police bazar', 'restaurant in police bazar shillong', 'police bazar restaurant', 'pb restaurant shillong'],
  ),
  dish(
    'cafe-shillong',
    'Café in Shillong — Best Coffee, Music & Bites | XTSY',
    'Best café in Shillong for coffee, live music & cozy bites. Discover Shillong café culture and visit TAB Bistro by XTSY. Open 9 AM–10:30 PM.',
    'Café in Shillong',
    'Shillong is India\'s rock capital, and its café culture matches the music — artisan coffee, cozy interiors and weekend gigs. TAB Bistro by XTSY adds a forest-side café experience to the mix.',
    [
      { heading: 'Shillong Café Culture', content: 'What to expect:', listItems: ['Specialty coffee & espresso', 'Live music on weekends', 'All-day breakfast & bakes', 'Cozy work-friendly corners', 'Continental snacks & desserts'] },
      { heading: 'Café & Bistro at XTSY', content: 'TAB Bistro doubles as a café:', listItems: ['Coffee, teas & cold beverages', 'Breakfast served all morning', 'Light bites & desserts', 'WiFi-friendly seating', 'Forest views'] },
    ],
    [{ question: 'Is there a good café in Shillong?', answer: 'Yes — Shillong has a rich café culture with live music and specialty coffee. TAB Bistro by XTSY offers a forest-side café with coffee, breakfast and light bites.' }, tabFaq],
    ['cafes-in-shillong', 'restaurant-in-shillong', 'best-place-to-eat-in-shillong'],
    ['cafe shillong', 'best cafes in shillong', 'best cafe shillong', 'coffee shillong', 'breakfast near me'],
  ),
  dish(
    'family-restaurant-shillong',
    'Family Restaurant in Shillong — Group & Kid-Friendly Dining',
    'Best family restaurant in Shillong for groups and kids — multi-cuisine, veg & non-veg. Spacious dining at TAB Bistro by XTSY. Open 9 AM–10:30 PM.',
    'Family Restaurant in Shillong',
    'Dining with family or a large group? TAB Bistro by XTSY is a spacious, family-friendly multi-cuisine restaurant in Shillong with something for every age and appetite.',
    [
      { heading: 'Family-Friendly Features', content: 'Why families choose TAB Bistro:', listItems: ['Spacious indoor & forest seating', 'Veg & non-veg menus', 'Kid-friendly dishes', 'Group & party bookings', 'Catering for celebrations'] },
      { heading: 'Great for Groups', content: 'Built for gatherings:', listItems: ['Large-table reservations', 'Set menus for groups', 'Birthday & event hosting', 'Bulk & corporate orders', 'In-house guest discount of 15%'] },
    ],
    [tabFaq],
    ['restaurant-in-shillong', 'places-to-eat-in-shillong', 'wedding-catering-shillong'],
    ['family restaurants near me', 'family restaurant shillong', 'restaurants in shillong', 'dine in restaurants near me', 'best places to eat near me'],
  ),

  // ===== CATERING / WEDDING / BULK CLUSTER ================================
  dish(
    'wedding-catering-shillong',
    'Wedding Catering in Shillong — Menus & Packages | TAB Bistro',
    'Wedding & event catering in Shillong by TAB Bistro by XTSY. Multi-cuisine menus, live counters & bulk orders for weddings, parties & corporate events.',
    'Wedding Catering in Shillong',
    'Planning a wedding or big celebration in Shillong? TAB Bistro by XTSY offers full-service catering — multi-cuisine menus, live counters and barbecue stations tailored to your guest count and budget.',
    [
      { heading: 'Catering Services', content: 'What we cater:', listItems: ['Weddings & receptions', 'Engagements & pre-wedding events', 'Corporate & office events', 'Birthday & private parties', 'Bulk & party food orders'] },
      { heading: 'Menus & Live Counters', content: 'Crafted for every palate:', listItems: ['North Indian, Chinese, Continental & Thai', 'Live tandoor & barbecue counters', 'Veg, non-veg & Jain options', 'Custom set menus by headcount', 'Dessert & beverage stations'] },
    ],
    [{ question: 'Does TAB Bistro offer wedding catering in Shillong?', answer: 'Yes — TAB Bistro by XTSY provides multi-cuisine wedding and event catering in Shillong, with live counters, barbecue stations and custom menus by guest count.' }],
    ['bulk-food-order-shillong', 'corporate-catering-shillong', 'destination-wedding-shillong'],
    ['wedding catering shillong', 'event catering shillong', 'destination wedding packages', 'catering food near me', 'order party food near me'],
  ),
  dish(
    'bulk-food-order-shillong',
    'Bulk Food Order in Shillong — Party & Corporate | TAB Bistro',
    'Order bulk food in Shillong for parties, offices & events. Multi-cuisine bulk & party orders by TAB Bistro by XTSY. Open 9 AM–10:30 PM.',
    'Bulk Food Orders in Shillong',
    'Need food for a crowd? TAB Bistro by XTSY handles bulk and party food orders in Shillong — multi-cuisine spreads, barbecue platters and packed meals delivered for events of any size.',
    [
      { heading: 'Bulk Order Options', content: 'What you can order in bulk:', listItems: ['Party & event platters', 'Corporate lunch packs', 'Barbecue & tandoor trays', 'Veg & non-veg combos', 'Packed individual meals'] },
      { heading: 'How It Works', content: 'Simple bulk ordering:', listItems: ['Share headcount & cuisine', 'Choose a custom menu', 'Confirm date & delivery', 'On-time bulk preparation', 'Catering add-ons available'] },
    ],
    [{ question: 'Can I order food in bulk in Shillong?', answer: 'Yes — TAB Bistro by XTSY accepts bulk and party food orders in Shillong for events, offices and celebrations, with custom multi-cuisine menus.' }],
    ['wedding-catering-shillong', 'corporate-catering-shillong', 'family-restaurant-shillong'],
    ['bulk food order shillong', 'order bulk food online', 'buy bulk food online', 'bulk order food near me', 'catering food near me'],
  ),
  dish(
    'corporate-catering-shillong',
    'Corporate Catering in Shillong — Office Events | TAB Bistro',
    'Corporate & office catering in Shillong by TAB Bistro by XTSY. Multi-cuisine lunches, event spreads & bulk orders for teams. Open 9 AM–10:30 PM.',
    'Corporate Catering in Shillong',
    'From office lunches to conferences and team offsites, TAB Bistro by XTSY delivers reliable corporate catering in Shillong with multi-cuisine menus and on-time service.',
    [
      { heading: 'Corporate Catering Services', content: 'Built for business:', listItems: ['Daily & event office lunches', 'Conference & seminar catering', 'Team offsite & retreat meals', 'Live counters on request', 'Bulk packed meals'] },
      { heading: 'Why Choose TAB Bistro', content: 'Dependable for teams:', listItems: ['Multi-cuisine variety', 'Veg, non-veg & Jain options', 'Custom headcount menus', 'Punctual delivery', 'Transparent pricing'] },
    ],
    [{ question: 'Does TAB Bistro do corporate catering in Shillong?', answer: 'Yes — TAB Bistro by XTSY offers corporate and office catering in Shillong, including event lunches, conference spreads and bulk packed meals.' }],
    ['wedding-catering-shillong', 'bulk-food-order-shillong', 'corporate-retreat-shillong'],
    ['corporate catering shillong', 'event catering shillong', 'bulk order food near me', 'catering food near me', 'office catering shillong'],
  ),
];
