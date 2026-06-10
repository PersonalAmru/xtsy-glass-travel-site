// ============================================================================
// TAB BISTRO BY XTSY — DINING SEO EXPANSION (100+ programmatic pages)
// ----------------------------------------------------------------------------
// Data-driven expansion of the restaurant/café/catering keyword surface for
// TAB Bistro by XTSY. Every page carries `schemaType: 'Restaurant'` (rendered
// as unique Restaurant JSON-LD in ProgrammaticSEOPage.tsx) and routes its CTA
// to /tab-bistro.
//
// Clusters covered:
//   • Cuisine / food-type pages (Chinese, North Indian, Thai, pizza, momos …)
//   • Meal & occasion pages (breakfast, brunch, rooftop, romantic, fine dining)
//   • Service pages (food delivery, takeaway, online order, party orders)
//   • General "best / top / where to eat" pages
//   • Locality pages (Police Bazar, Laitumkhrah, Mawlai, Umiam …)
//   • Cuisine × locality combos
//   • Catering / wedding / bulk / corporate pages
//
// NOTE: the `restaurants` category cap in seoQualityFilter.ts must stay large
// enough to keep these pages indexable.
//
// Irrelevant keywords from the brief were intentionally dropped:
//   • Competitor brand names (Burger King, Centre Point, Deja Vu, Hong Kong
//     Restaurant, Madras Cafe, Little Chef, Poinisuk, PB Restaurant) — we do
//     not build doorway pages on rival brand terms.
//   • Pure generic "near me" terms with no Shillong intent are folded in as
//     secondary keywords only, never as their own thin pages.
// ============================================================================
import type { SEOPageData, SchemaType } from './seoPages';

const TAB_CTA = 'Dine at TAB Bistro';
const TAB_LINK = '/tab-bistro';
const HOURS = 'open 9 AM–10:30 PM';

const tabFaq = {
  question: 'Where can I eat near XTSY in Shillong?',
  answer:
    'TAB Bistro by XTSY is a multi-cuisine forest-dining restaurant in New Shillong Township serving North Indian, tandoor, Indo-Chinese, Thai, Continental, Italian, seafood and Northeast cuisine. It is open 9 AM–10:30 PM, takes reservations, and also handles catering and bulk orders.',
};

const dish = (
  slug: string,
  title: string,
  metaDescription: string,
  h1: string,
  intro: string,
  sections: { heading: string; content: string; listItems?: string[] }[],
  faqs: { question: string; answer: string }[],
  relatedSlugs: string[],
  keywords: string[],
  quickAnswer?: string,
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
  ctaText: TAB_CTA,
  ctaLink: TAB_LINK,
  keywords,
  quickAnswer,
});

const pages: SEOPageData[] = [];

// ===========================================================================
// 1) CUISINE / FOOD-TYPE CLUSTER
// ===========================================================================
interface Cuisine {
  slug: string;
  label: string; // e.g. "North Indian"
  noun: string; // e.g. "North Indian restaurant"
  dishes: string[];
  why: string[];
  keywords: string[];
  quick: string;
}

const cuisines: Cuisine[] = [
  {
    slug: 'north-indian-restaurant-shillong',
    label: 'North Indian',
    noun: 'North Indian restaurant',
    dishes: ['Butter chicken & dal makhani', 'Tandoori chicken, fish & paneer', 'Shahi paneer & kadhai dishes', 'Biryani & jeera pulao', 'Fresh naan, roti & kulcha'],
    why: ['Live tandoor & charcoal grill', 'Rich, slow-cooked gravies', 'Veg & non-veg thalis', 'Generous family portions', 'Catering & bulk orders'],
    keywords: ['north indian restaurant in shillong', 'indian restaurant in shillong', 'indian food near me', 'indian restaurant near me', 'best indian restaurant near me'],
    quick: 'TAB Bistro by XTSY is a leading North Indian restaurant in Shillong — live tandoor, rich curries, biryani and fresh naan, open 9 AM–10:30 PM.',
  },
  {
    slug: 'south-indian-restaurant-shillong',
    label: 'South Indian',
    noun: 'South Indian restaurant',
    dishes: ['Crispy masala dosa', 'Idli, vada & sambar', 'Uttapam & rava dosa', 'Filter coffee', 'South Indian veg thali'],
    why: ['Fresh batter prepared daily', 'Pure-veg friendly', 'Great for breakfast', 'Coconut chutneys & sambar', 'Light, wholesome meals'],
    keywords: ['south indian restaurant shillong', 'south indian restaurants near me', 'dosa shillong', 'vegetarian food near me', 'breakfast places in shillong'],
    quick: 'TAB Bistro by XTSY serves South Indian favourites in Shillong — dosa, idli, vada and filter coffee — alongside its multi-cuisine menu, open 9 AM–10:30 PM.',
  },
  {
    slug: 'thai-restaurant-shillong',
    label: 'Thai',
    noun: 'Thai restaurant',
    dishes: ['Thai red & green curry', 'Tom yum & tom kha soup', 'Thai fried rice & noodles', 'Stir-fried basil chicken', 'Veg & non-veg Thai bowls'],
    why: ['Authentic Thai spice balance', 'Veg & seafood options', 'Aromatic curries with rice', 'Hand-tossed wok dishes', 'Dine-in & catering'],
    keywords: ['thai food shillong', 'thai restaurant shillong', 'asian food shillong', 'best food near me', 'places to eat in shillong'],
    quick: 'TAB Bistro by XTSY plates up Thai curries, soups and stir-fries in Shillong as part of its multi-cuisine menu, open 9 AM–10:30 PM.',
  },
  {
    slug: 'continental-restaurant-shillong',
    label: 'Continental',
    noun: 'Continental restaurant',
    dishes: ['Grilled chicken steak', 'Sizzlers with sides', 'Soups & salads', 'Wood-fired pizza', 'Pasta in creamy & red sauces'],
    why: ['European-style mains', 'Forest-side fine dining', 'Veg & non-veg options', 'Great for date nights', 'Reservations welcome'],
    keywords: ['continental food shillong', 'continental restaurant shillong', 'italian restaurants near me', 'romantic restaurants near me', 'fine dining shillong'],
    quick: 'TAB Bistro by XTSY offers Continental dining in Shillong — grilled steaks, sizzlers, pizza and pasta in a forest setting, open 9 AM–10:30 PM.',
  },
  {
    slug: 'italian-restaurant-shillong',
    label: 'Italian',
    noun: 'Italian restaurant',
    dishes: ['Wood-fired Margherita & veggie pizza', 'Penne & spaghetti in red/white sauce', 'Garlic bread & bruschetta', 'Cheesy baked dishes', 'Fresh salads & soups'],
    why: ['Hand-tossed pizza dough', 'Creamy & arrabbiata pastas', 'Veg & non-veg toppings', 'Family & group friendly', 'Catering for events'],
    keywords: ['italian restaurant shillong', 'pizza in shillong', 'italian restaurants near me', 'pasta shillong', 'best food places in shillong'],
    quick: 'TAB Bistro by XTSY is an Italian-friendly restaurant in Shillong serving wood-fired pizza and pasta, open 9 AM–10:30 PM.',
  },
  {
    slug: 'seafood-restaurant-shillong',
    label: 'Seafood',
    noun: 'seafood restaurant',
    dishes: ['Grilled & tandoori fish', 'Fish curry & masala', 'Prawn dishes', 'Fish & chips', 'Spiced fish fry'],
    why: ['Fresh fish preparations', 'Tandoor & grill options', 'Indian & continental styles', 'Veg sides available', 'Group & catering orders'],
    keywords: ['seafood restaurant shillong', 'seafood restaurants near me', 'fish curry shillong', 'best seafood near me', 'food in shillong'],
    quick: 'TAB Bistro by XTSY serves seafood in Shillong — grilled and tandoori fish, fish curry and prawns — as part of its multi-cuisine menu, open 9 AM–10:30 PM.',
  },
  {
    slug: 'tandoor-restaurant-shillong',
    label: 'Tandoor & Grill',
    noun: 'tandoor restaurant',
    dishes: ['Tandoori chicken & tangri kebab', 'Paneer tikka & seekh kebab', 'Tandoori fish & prawns', 'Fresh tandoori naan & roti', 'Smoky veg tandoor'],
    why: ['Live clay-oven tandoor', 'Charcoal-grilled flavour', 'Veg & non-veg kebabs', 'Great for groups', 'Catering & barbecue nights'],
    keywords: ['tandoor restaurant shillong', 'kebab shillong', 'grill restaurant shillong', 'barbecue restaurant shillong', 'best food near me'],
    quick: 'TAB Bistro by XTSY runs a live tandoor in Shillong — tandoori chicken, kebabs, paneer tikka and fresh naan, open 9 AM–10:30 PM.',
  },
  {
    slug: 'indo-chinese-restaurant-shillong',
    label: 'Indo-Chinese',
    noun: 'Indo-Chinese restaurant',
    dishes: ['Hakka & Schezwan noodles', 'Chilli chicken & paneer', 'Manchurian (veg & chicken)', 'Fried rice', 'Spring rolls & momos'],
    why: ['Wok-tossed street flavours', 'Veg & non-veg options', 'Spice levels to order', 'Generous portions', 'Takeaway & bulk orders'],
    keywords: ['chinese restaurant in shillong', 'best chinese restaurant in shillong', 'chinese food', 'chinese food near me', 'chinese restaurant near me'],
    quick: 'TAB Bistro by XTSY serves Indo-Chinese food in Shillong — Hakka noodles, chilli chicken, Manchurian and fried rice, open 9 AM–10:30 PM.',
  },
  {
    slug: 'multi-cuisine-restaurant-shillong',
    label: 'Multi-Cuisine',
    noun: 'multi-cuisine restaurant',
    dishes: ['North Indian & tandoor', 'Indo-Chinese & Thai', 'Continental & Italian', 'Seafood & barbecue', 'All-day breakfast & café'],
    why: ['10+ cuisines under one roof', 'Something for every craving', 'Veg & non-veg menus', 'Forest-side ambiance', 'Reservations, catering & bulk orders'],
    keywords: ['multi cuisine restaurant shillong', 'cuisine restaurant shillong', 'best restaurant in shillong', 'restaurants in shillong', 'restaurants near me'],
    quick: 'TAB Bistro by XTSY is a multi-cuisine restaurant in Shillong with 10+ cuisines — North Indian, Chinese, Thai, Continental, Italian and more, open 9 AM–10:30 PM.',
  },
  {
    slug: 'khasi-food-restaurant-shillong',
    label: 'Khasi & Northeast',
    noun: 'Northeast cuisine restaurant',
    dishes: ['Jadoh — Khasi rice with meat', 'Doh khlieh — spiced pork salad', 'Tungrymbai', 'Smoked pork dishes', 'Local greens & rice'],
    why: ['Authentic Northeast flavours', 'Local Khasi specialities', 'Pairs with global menu', 'Forest-side setting', 'Great for first-time visitors'],
    keywords: ['khasi food shillong', 'northeast food shillong', 'local food shillong', 'best food in shillong', 'food in shillong'],
    quick: 'TAB Bistro by XTSY offers Khasi and Northeast dishes in Shillong alongside its global multi-cuisine menu, open 9 AM–10:30 PM.',
  },
  {
    slug: 'pizza-in-shillong',
    label: 'Pizza',
    noun: 'pizza place',
    dishes: ['Wood-fired Margherita', 'Loaded veggie pizza', 'Chicken & pepperoni pizza', 'Cheese-burst options', 'Garlic bread sides'],
    why: ['Hand-tossed fresh dough', 'Generous cheese & toppings', 'Veg & non-veg', 'Dine-in & takeaway', 'Family & group friendly'],
    keywords: ['pizza in shillong', 'best pizza shillong', 'italian restaurants near me', 'places to eat in shillong', 'food near me'],
    quick: 'TAB Bistro by XTSY serves wood-fired pizza in Shillong — Margherita, veggie, chicken and more, open 9 AM–10:30 PM.',
  },
  {
    slug: 'momos-in-shillong',
    label: 'Momos & Dumplings',
    noun: 'momo spot',
    dishes: ['Steamed veg & chicken momos', 'Pan-fried momos', 'Tandoori momos', 'Thukpa & noodle soup', 'Spicy momo chutney'],
    why: ['Hand-folded daily', 'Veg & non-veg fillings', 'Steamed, fried & tandoori', 'Perfect snack or meal', 'Takeaway available'],
    keywords: ['momos in shillong', 'best momos shillong', 'chinese food near me', 'street food shillong', 'food places near me'],
    quick: 'TAB Bistro by XTSY serves momos and dumplings in Shillong — steamed, fried and tandoori, with thukpa, open 9 AM–10:30 PM.',
  },
  {
    slug: 'biryani-in-shillong',
    label: 'Biryani',
    noun: 'biryani restaurant',
    dishes: ['Chicken & mutton biryani', 'Veg & paneer biryani', 'Egg biryani', 'Raita & salan', 'Pulao & jeera rice'],
    why: ['Slow-dum cooked rice', 'Aromatic whole spices', 'Veg & non-veg options', 'Generous portions', 'Takeaway & bulk orders'],
    keywords: ['biryani in shillong', 'best biryani near me', 'best biryani shillong', 'indian food near me', 'food near me'],
    quick: 'TAB Bistro by XTSY serves dum biryani in Shillong — chicken, mutton, veg and egg — open 9 AM–10:30 PM.',
  },
  {
    slug: 'burger-and-fast-food-shillong',
    label: 'Burgers & Fast Food',
    noun: 'fast food restaurant',
    dishes: ['Chicken & veg burgers', 'Crispy fried chicken', 'Loaded fries', 'Wraps & rolls', 'Sandwiches & shakes'],
    why: ['Quick, fresh bites', 'Veg & non-veg', 'Great for groups & kids', 'Takeaway friendly', 'Casual all-day menu'],
    keywords: ['fast food shillong', 'burger shillong', 'fried chicken near me', 'fast food places near me', 'food near me'],
    quick: 'TAB Bistro by XTSY serves burgers, fried chicken and fast-food bites in Shillong, open 9 AM–10:30 PM.',
  },
  {
    slug: 'sizzlers-in-shillong',
    label: 'Sizzlers',
    noun: 'sizzler restaurant',
    dishes: ['Chicken & fish sizzlers', 'Paneer & veg sizzlers', 'Sizzling brownie', 'Grilled sides & sauces', 'Loaded rice/noodle base'],
    why: ['Served hot on the plate', 'Veg & non-veg options', 'Hearty single-plate meal', 'Continental-style grills', 'Dine-in favourite'],
    keywords: ['sizzlers shillong', 'continental food shillong', 'best food in shillong', 'places to eat in shillong', 'food near me'],
    quick: 'TAB Bistro by XTSY serves sizzlers in Shillong — chicken, fish, paneer and veg — plus a sizzling brownie, open 9 AM–10:30 PM.',
  },
  {
    slug: 'coffee-shop-shillong',
    label: 'Coffee & Café',
    noun: 'coffee shop',
    dishes: ['Espresso, cappuccino & latte', 'Cold coffee & frappes', 'Teas & hot chocolate', 'Cakes & desserts', 'Light café bites'],
    why: ['Forest-side café setting', 'Work-friendly seating', 'All-day breakfast', 'Coffee & desserts', 'Cozy weekend spot'],
    keywords: ['coffee shop shillong', 'cafe shillong', 'best cafes in shillong', 'brunch near me', 'breakfast near me'],
    quick: 'TAB Bistro by XTSY doubles as a coffee shop and café in Shillong with espresso, cold coffee, desserts and breakfast, open 9 AM–10:30 PM.',
  },
  {
    slug: 'pure-vegetarian-restaurant-shillong',
    label: 'Pure Vegetarian',
    noun: 'pure veg restaurant',
    dishes: ['Veg thali & North Indian curries', 'Paneer tikka & tandoori veg', 'Veg Hakka noodles & Manchurian', 'Veggie pizza & pasta', 'Dosa & idli (breakfast)'],
    why: ['Dedicated vegetarian section', 'Jain-friendly on request', 'Multi-cuisine veg variety', 'Veg catering & bulk orders', 'No-fuss veg breakfast'],
    keywords: ['pure veg restaurant in shillong', 'pure veg restaurants in shillong', 'vegetarian restaurant near me', 'vegetarian food near me', 'best veg restaurants in shillong'],
    quick: 'TAB Bistro by XTSY has an extensive pure-veg menu in Shillong with Jain-friendly options on request, open 9 AM–10:30 PM.',
  },
  {
    slug: 'healthy-food-restaurant-shillong',
    label: 'Healthy & Light',
    noun: 'healthy food restaurant',
    dishes: ['Fresh salads & soups', 'Grilled (not fried) mains', 'Veg & protein bowls', 'Smoothies & fresh juices', 'Light breakfast options'],
    why: ['Grilled over fried', 'Fresh seasonal produce', 'Balanced veg & non-veg', 'Customisable portions', 'Great for fitness travellers'],
    keywords: ['healthy food shillong', 'salad shillong', 'vegetarian food near me', 'best food in shillong', 'food places near me'],
    quick: 'TAB Bistro by XTSY offers healthy, grilled and salad-forward options in Shillong, open 9 AM–10:30 PM.',
  },
  {
    slug: 'noodles-in-shillong',
    label: 'Noodles & Soups',
    noun: 'noodle bar',
    dishes: ['Hakka & Schezwan noodles', 'Chowmein (veg & chicken)', 'Thukpa & noodle soup', 'Pan-fried noodles', 'Manchurian with noodles'],
    why: ['Wok-tossed fresh', 'Veg & non-veg options', 'Spice levels to order', 'Hearty single bowls', 'Takeaway available'],
    keywords: ['noodles in shillong', 'chinese food near me', 'chinese food', 'best food in shillong', 'food places near me'],
    quick: 'TAB Bistro by XTSY serves noodles and soups in Shillong — Hakka, Schezwan, chowmein and thukpa, open 9 AM–10:30 PM.',
  },
  {
    slug: 'thali-restaurant-shillong',
    label: 'Thali',
    noun: 'thali restaurant',
    dishes: ['Veg & non-veg thalis', 'Dal, sabzi & rice', 'Roti & paratha', 'Curry of the day', 'Salad, papad & dessert'],
    why: ['Complete, value meals', 'Veg & non-veg options', 'Generous portions', 'Great for lunch', 'Takeaway friendly'],
    keywords: ['thali shillong', 'veg thali shillong', 'best food in shillong', 'indian food near me', 'lunch near me'],
    quick: 'TAB Bistro by XTSY serves hearty veg and non-veg thalis in Shillong, open 9 AM–10:30 PM.',
  },
  {
    slug: 'bakery-and-desserts-shillong',
    label: 'Bakery & Desserts',
    noun: 'dessert café',
    dishes: ['Cakes & pastries', 'Brownies & cookies', 'Sizzling brownie', 'Ice cream & shakes', 'Coffee & hot chocolate'],
    why: ['Freshly baked treats', 'Coffee & desserts', 'Birthday cakes on order', 'Cosy café setting', 'Takeaway available'],
    keywords: ['bakery shillong', 'desserts shillong', 'cake shillong', 'cafe shillong', 'best cafes in shillong'],
    quick: 'TAB Bistro by XTSY offers cakes, brownies and desserts in Shillong alongside coffee and shakes, open 9 AM–10:30 PM.',
  },
  {
    slug: 'juices-and-shakes-shillong',
    label: 'Juices & Shakes',
    noun: 'juice & shakes bar',
    dishes: ['Fresh fruit juices', 'Thick milkshakes', 'Cold coffee & frappes', 'Smoothies', 'Lemonades & coolers'],
    why: ['Fresh, no-preservative drinks', 'Pairs with breakfast', 'Veg & vegan options', 'Great in summer', 'Takeaway friendly'],
    keywords: ['juice shop shillong', 'milkshake shillong', 'cold coffee shillong', 'cafe shillong', 'breakfast near me'],
    quick: 'TAB Bistro by XTSY serves fresh juices, shakes and cold coffee in Shillong, open 9 AM–10:30 PM.',
  },
  {
    slug: 'chinese-food-in-shillong',
    label: 'Chinese',
    noun: 'Chinese restaurant',
    dishes: ['Hakka & Schezwan noodles', 'Chilli chicken & paneer', 'Manchurian & fried rice', 'Momos & spring rolls', 'Thai curries'],
    why: ['Authentic wok flavours', 'Veg & non-veg options', 'Spice to taste', 'Generous portions', 'Takeaway & bulk orders'],
    keywords: ['chinese food in shillong', 'chinese food', 'best chinese restaurant in shillong', 'chinese food near me', 'chinese restaurant near me'],
    quick: 'TAB Bistro by XTSY serves Chinese food in Shillong — noodles, chilli chicken, Manchurian and fried rice, open 9 AM–10:30 PM.',
  },
];

const cuisineRelated = ['restaurant-in-shillong', 'best-restaurants-shillong', 'best-place-to-eat-in-shillong', 'multi-cuisine-restaurant-shillong'];

cuisines.forEach((c) => {
  pages.push(
    dish(
      c.slug,
      `${c.label} Restaurant in Shillong — ${c.label === 'Coffee & Café' ? 'Café & Coffee' : c.label} Menu | TAB Bistro`,
      `Best ${c.label.toLowerCase()} in Shillong at TAB Bistro by XTSY — ${c.dishes[0].toLowerCase()}, ${c.dishes[1].toLowerCase()} & more. ${HOURS}.`,
      `${c.label} in Shillong`,
      `Craving ${c.label.toLowerCase()} food in Shillong? TAB Bistro by XTSY is a multi-cuisine forest-dining restaurant where ${c.label.toLowerCase()} sits alongside 10+ other cuisines — cooked fresh, served generously, and ${HOURS}.`,
      [
        { heading: `${c.label} Dishes to Try`, content: 'What to order:', listItems: c.dishes },
        { heading: `Why TAB Bistro for ${c.label}`, content: `A reliable ${c.noun} in Shillong:`, listItems: c.why },
      ],
      [
        { question: `Where can I find ${c.label.toLowerCase()} food in Shillong?`, answer: `${c.quick}` },
        tabFaq,
      ],
      cuisineRelated.filter((s) => s !== c.slug).slice(0, 4),
      c.keywords,
      c.quick,
    ),
  );
});

// ===========================================================================
// 2) MEAL & OCCASION CLUSTER
// ===========================================================================
interface Occasion {
  slug: string;
  h1: string;
  title: string;
  metaWord: string; // for description
  intro: string;
  points1: { h: string; items: string[] };
  points2: { h: string; items: string[] };
  keywords: string[];
  quick: string;
  faqQ: string;
}

const occasions: Occasion[] = [
  {
    slug: 'breakfast-in-shillong',
    h1: 'Breakfast in Shillong',
    title: 'Breakfast in Shillong — Best Morning Cafés & Spots | TAB Bistro',
    metaWord: 'breakfast spots in Shillong',
    intro: 'Start your Shillong morning right. From hearty all-day breakfast to filter coffee and continental plates, TAB Bistro by XTSY serves breakfast in a pine-forest setting.',
    points1: { h: 'Breakfast Menu Highlights', items: ['Eggs your way & omelettes', 'Toast, pancakes & waffles', 'Dosa, idli & paratha', 'Fresh juices & coffee', 'Continental breakfast platters'] },
    points2: { h: 'Why Breakfast Here', items: ['Served fresh all morning', 'Veg & non-veg options', 'Coffee & teas', 'Quiet forest views', 'Work-friendly seating'] },
    keywords: ['breakfast in shillong', 'breakfast places in shillong', 'breakfast near me', 'breakfast places near me', 'best breakfast near me'],
    quick: 'TAB Bistro by XTSY serves all-day breakfast in Shillong — eggs, pancakes, dosa, coffee and continental plates, open 9 AM–10:30 PM.',
    faqQ: 'Where can I get breakfast in Shillong?',
  },
  {
    slug: 'brunch-in-shillong',
    h1: 'Brunch in Shillong',
    title: 'Brunch in Shillong — Best Weekend Brunch Spot | TAB Bistro',
    metaWord: 'brunch in Shillong',
    intro: 'Lazy weekend mornings call for brunch. TAB Bistro by XTSY blends breakfast and lunch favourites with coffee, in a relaxed forest-side setting.',
    points1: { h: 'Brunch Picks', items: ['Eggs, pancakes & waffles', 'Sandwiches & burgers', 'Pizza & pasta', 'Fresh juices & coffee', 'Desserts & bakes'] },
    points2: { h: 'Why Brunch at TAB Bistro', items: ['Relaxed forest ambiance', 'Veg & non-veg menus', 'Great for groups & families', 'Coffee & cold beverages', 'Reservations welcome'] },
    keywords: ['brunch in shillong', 'brunch near me', 'brunch places near me', 'sunday brunch near me', 'best brunch near me'],
    quick: 'TAB Bistro by XTSY is a great brunch spot in Shillong — breakfast classics, burgers, pizza and coffee, open 9 AM–10:30 PM.',
    faqQ: 'Where can I have brunch in Shillong?',
  },
  {
    slug: 'lunch-in-shillong',
    h1: 'Lunch in Shillong',
    title: 'Lunch in Shillong — Best Places for Lunch | TAB Bistro',
    metaWord: 'lunch in Shillong',
    intro: 'Hungry mid-day? TAB Bistro by XTSY serves a full multi-cuisine lunch in Shillong — thalis, biryani, Chinese, continental and more.',
    points1: { h: 'Lunch Options', items: ['Veg & non-veg thalis', 'Biryani & rice bowls', 'Indo-Chinese & noodles', 'Continental mains', 'Quick combos & set menus'] },
    points2: { h: 'Why Lunch Here', items: ['Fast, fresh service', 'Multi-cuisine variety', 'Group & corporate lunches', 'Takeaway available', 'In-house guest discount of 15%'] },
    keywords: ['lunch in shillong', 'lunch near me', 'best lunch near me', 'places to eat in shillong', 'restaurants near me'],
    quick: 'TAB Bistro by XTSY serves multi-cuisine lunch in Shillong — thalis, biryani, Chinese and continental — open 9 AM–10:30 PM.',
    faqQ: 'Where can I have lunch in Shillong?',
  },
  {
    slug: 'dinner-in-shillong',
    h1: 'Dinner in Shillong',
    title: 'Dinner in Shillong — Best Dinner Restaurants | TAB Bistro',
    metaWord: 'dinner in Shillong',
    intro: 'For dinner in Shillong, TAB Bistro by XTSY pairs barbecue, tandoor and global mains with a warm forest-side ambiance — open till 10:30 PM.',
    points1: { h: 'Dinner Favourites', items: ['Barbecue & tandoor platters', 'North Indian curries & naan', 'Sizzlers & continental mains', 'Indo-Chinese & Thai', 'Desserts & beverages'] },
    points2: { h: 'Why Dinner Here', items: ['Open till 10:30 PM', 'Cosy forest setting', 'Veg & non-veg menus', 'Reservations for groups', 'Great for couples & families'] },
    keywords: ['dinner in shillong', 'dinner near me', 'romantic restaurants near me', 'late night food shillong', 'restaurants near me'],
    quick: 'TAB Bistro by XTSY is a top dinner restaurant in Shillong — barbecue, tandoor and global mains — open 9 AM–10:30 PM.',
    faqQ: 'Where can I have dinner in Shillong?',
  },
  {
    slug: 'late-night-food-shillong',
    h1: 'Late Night Food in Shillong',
    title: 'Late Night Food in Shillong — Dinner Till Late | TAB Bistro',
    metaWord: 'late night food in Shillong',
    intro: 'Shillong winds down early, but TAB Bistro by XTSY keeps the kitchen open till 10:30 PM for late dinners, barbecue and comfort food.',
    points1: { h: 'Late Evening Menu', items: ['Barbecue & grilled platters', 'Noodles, fried rice & momos', 'Burgers & fast bites', 'Pizza & pasta', 'Coffee & desserts'] },
    points2: { h: 'Good to Know', items: ['Kitchen open till 10:30 PM', 'Veg & non-veg options', 'Takeaway available', 'Group bookings welcome', 'Forest-side seating'] },
    keywords: ['late night food shillong', 'late night food near me', 'food near me open now', 'food near me open', 'restaurants near me'],
    quick: 'TAB Bistro by XTSY serves late-night food in Shillong with the kitchen open till 10:30 PM — barbecue, noodles, burgers and more.',
    faqQ: 'Where can I get late night food in Shillong?',
  },
  {
    slug: 'rooftop-restaurant-shillong',
    h1: 'Rooftop & Open-Air Dining in Shillong',
    title: 'Rooftop Restaurant in Shillong — Open-Air Dining | TAB Bistro',
    metaWord: 'rooftop & open-air dining in Shillong',
    intro: 'For open-air dining with a view, TAB Bistro by XTSY offers forest-side and open seating in Shillong — perfect for a relaxed meal under the pines.',
    points1: { h: 'Open-Air Experience', items: ['Forest-side seating', 'Fresh mountain air', 'Barbecue & grill nights', 'Coffee & sundowners', 'Great for photos'] },
    points2: { h: 'Menu to Match', items: ['Barbecue & tandoor', 'Multi-cuisine mains', 'Veg & non-veg', 'Desserts & beverages', 'Reservations recommended'] },
    keywords: ['rooftop restaurants in shillong', 'rooftop cafe in shillong', 'open air restaurant shillong', 'best food in shillong', 'romantic restaurants near me'],
    quick: 'TAB Bistro by XTSY offers open-air, forest-side dining in Shillong — barbecue, multi-cuisine mains and coffee, open 9 AM–10:30 PM.',
    faqQ: 'Is there a rooftop or open-air restaurant in Shillong?',
  },
  {
    slug: 'fine-dining-shillong',
    h1: 'Fine Dining in Shillong',
    title: 'Fine Dining in Shillong — Best Upscale Restaurant | TAB Bistro',
    metaWord: 'fine dining in Shillong',
    intro: 'Looking for an upscale meal? TAB Bistro by XTSY brings multi-cuisine fine dining to Shillong with a scenic forest setting and attentive service.',
    points1: { h: 'Fine Dining Menu', items: ['Continental grills & steaks', 'Tandoor & barbecue', 'Italian & Thai mains', 'Curated set menus', 'Desserts & beverages'] },
    points2: { h: 'The Experience', items: ['Scenic forest ambiance', 'Attentive table service', 'Ideal for celebrations', 'Reservations recommended', 'Veg & non-veg menus'] },
    keywords: ['fine dining shillong', 'fancy restaurants near me', 'nice restaurants near me', 'best restaurant in shillong', 'romantic restaurants near me'],
    quick: 'TAB Bistro by XTSY offers multi-cuisine fine dining in Shillong in a scenic forest setting, open 9 AM–10:30 PM.',
    faqQ: 'Is there fine dining in Shillong?',
  },
  {
    slug: 'romantic-restaurant-shillong',
    h1: 'Romantic Restaurant in Shillong',
    title: 'Romantic Restaurant in Shillong — Couple Dining | TAB Bistro',
    metaWord: 'romantic restaurants in Shillong',
    intro: 'Planning a date or anniversary? TAB Bistro by XTSY is a romantic forest-side restaurant in Shillong — perfect for couples seeking a quiet, scenic meal.',
    points1: { h: 'Why It\'s Romantic', items: ['Quiet forest setting', 'Cosy seating for two', 'Candlelight on request', 'Desserts to share', 'Reservations for special dates'] },
    points2: { h: 'What to Order', items: ['Continental grills & sizzlers', 'Tandoor & barbecue', 'Pizza & pasta', 'Coffee & desserts', 'Veg & non-veg menus'] },
    keywords: ['romantic restaurants near me', 'candlelight dinner shillong', 'couple restaurant shillong', 'date night shillong', 'best restaurant in shillong'],
    quick: 'TAB Bistro by XTSY is a romantic forest-side restaurant in Shillong, ideal for couples and anniversaries, open 9 AM–10:30 PM.',
    faqQ: 'Where is a good romantic restaurant in Shillong?',
  },
  {
    slug: 'rooftop-cafe-shillong',
    h1: 'Café with a View in Shillong',
    title: 'Café with a View in Shillong — Coffee & Bites | TAB Bistro',
    metaWord: 'a café with a view in Shillong',
    intro: 'Sip coffee surrounded by pines. TAB Bistro by XTSY is a forest-side café in Shillong with specialty coffee, breakfast and light bites.',
    points1: { h: 'Café Menu', items: ['Espresso, latte & cold coffee', 'Teas & hot chocolate', 'All-day breakfast', 'Cakes & desserts', 'Light snacks & bites'] },
    points2: { h: 'Café Vibes', items: ['Forest views', 'Work-friendly seating', 'Cosy interiors', 'Weekend favourite', 'WiFi-friendly'] },
    keywords: ['rooftop cafe in shillong', 'cafe shillong', 'best cafes in shillong', 'coffee shop shillong', 'brunch near me'],
    quick: 'TAB Bistro by XTSY is a forest-side café in Shillong with coffee, breakfast and desserts, open 9 AM–10:30 PM.',
    faqQ: 'Is there a café with a view in Shillong?',
  },
  {
    slug: 'group-dining-shillong',
    h1: 'Group Dining in Shillong',
    title: 'Group Dining in Shillong — Large Tables & Parties | TAB Bistro',
    metaWord: 'group dining in Shillong',
    intro: 'Dining with a big group? TAB Bistro by XTSY has spacious seating, set menus and party bookings in Shillong for friends, families and teams.',
    points1: { h: 'Built for Groups', items: ['Large-table reservations', 'Set menus by headcount', 'Birthday & event hosting', 'Barbecue group nights', 'Bulk & catering orders'] },
    points2: { h: 'Why Choose Us', items: ['Spacious forest seating', 'Multi-cuisine variety', 'Veg & non-veg options', 'Custom budgets', 'In-house guest discount of 15%'] },
    keywords: ['group dining shillong', 'family restaurants near me', 'party restaurant shillong', 'restaurants for groups shillong', 'best places to eat near me'],
    quick: 'TAB Bistro by XTSY offers group dining in Shillong — large tables, set menus and party bookings, open 9 AM–10:30 PM.',
    faqQ: 'Where can large groups dine in Shillong?',
  },
  {
    slug: 'birthday-party-restaurant-shillong',
    h1: 'Birthday Party Restaurant in Shillong',
    title: 'Birthday Party Restaurant in Shillong — Celebrations | TAB Bistro',
    metaWord: 'a birthday party venue in Shillong',
    intro: 'Celebrate a birthday in a beautiful forest setting. TAB Bistro by XTSY hosts birthday parties in Shillong with set menus, cakes and group bookings.',
    points1: { h: 'Birthday Packages', items: ['Group table reservations', 'Custom set menus', 'Cake & dessert arrangements', 'Barbecue & multi-cuisine spreads', 'Veg & non-veg options'] },
    points2: { h: 'Why Celebrate Here', items: ['Scenic forest ambiance', 'Space for families & friends', 'Catering add-ons', 'Flexible budgets', 'Easy reservations'] },
    keywords: ['birthday party shillong', 'birthday restaurant shillong', 'party restaurant shillong', 'celebration restaurant shillong', 'family restaurants near me'],
    quick: 'TAB Bistro by XTSY hosts birthday parties in Shillong with set menus, cakes and group bookings, open 9 AM–10:30 PM.',
    faqQ: 'Can I host a birthday party at a restaurant in Shillong?',
  },
  {
    slug: 'anniversary-dinner-shillong',
    h1: 'Anniversary Dinner in Shillong',
    title: 'Anniversary Dinner in Shillong — Special Evenings | TAB Bistro',
    metaWord: 'an anniversary dinner in Shillong',
    intro: 'Mark your anniversary with a special meal. TAB Bistro by XTSY offers a romantic forest-side dinner in Shillong with candlelight on request.',
    points1: { h: 'Make It Special', items: ['Candlelight on request', 'Cosy table for two', 'Desserts to share', 'Continental & tandoor mains', 'Reservations for special dates'] },
    points2: { h: 'Why TAB Bistro', items: ['Quiet forest ambiance', 'Attentive service', 'Veg & non-veg menus', 'Coffee & desserts', 'Ideal for couples'] },
    keywords: ['anniversary dinner shillong', 'candlelight dinner shillong', 'romantic restaurants near me', 'couple restaurant shillong', 'best restaurant in shillong'],
    quick: 'TAB Bistro by XTSY is ideal for an anniversary dinner in Shillong — romantic forest-side dining with candlelight on request, open 9 AM–10:30 PM.',
    faqQ: 'Where can I have an anniversary dinner in Shillong?',
  },
  {
    slug: 'buffet-restaurant-shillong',
    h1: 'Buffet & Spreads in Shillong',
    title: 'Buffet Restaurant in Shillong — Group Spreads | TAB Bistro',
    metaWord: 'buffet-style dining in Shillong',
    intro: 'For big appetites and groups, TAB Bistro by XTSY arranges multi-cuisine buffet-style spreads in Shillong — perfect for events and celebrations.',
    points1: { h: 'Buffet Spread Options', items: ['North Indian & tandoor', 'Indo-Chinese & Thai', 'Continental & Italian', 'Live barbecue counters', 'Desserts & beverages'] },
    points2: { h: 'Good to Know', items: ['Best for groups & events', 'Custom menus by headcount', 'Veg & non-veg options', 'Advance booking needed', 'Catering add-ons'] },
    keywords: ['buffet restaurant shillong', 'buffet in shillong', 'group dining shillong', 'best food in shillong', 'restaurants near me'],
    quick: 'TAB Bistro by XTSY arranges multi-cuisine buffet-style spreads in Shillong for groups and events, open 9 AM–10:30 PM.',
    faqQ: 'Is there a buffet restaurant in Shillong?',
  },
  {
    slug: 'pet-friendly-restaurant-shillong',
    h1: 'Pet-Friendly Restaurant in Shillong',
    title: 'Pet-Friendly Restaurant in Shillong — Dine with Pets | TAB Bistro',
    metaWord: 'a pet-friendly restaurant in Shillong',
    intro: 'Travelling with your pet? TAB Bistro by XTSY offers pet-friendly outdoor seating in a forest setting in Shillong — bring your dog along for a relaxed meal.',
    points1: { h: 'Why Pet-Friendly', items: ['Open-air forest seating', 'Space for pets to relax', 'Water bowls on request', 'Quiet, green surroundings', 'Friendly staff'] },
    points2: { h: 'What to Order', items: ['Barbecue & grills', 'Multi-cuisine mains', 'Coffee & desserts', 'Veg & non-veg menus', 'Takeaway available'] },
    keywords: ['pet friendly restaurant shillong', 'dog friendly restaurant shillong', 'best food in shillong', 'places to eat in shillong', 'restaurants near me'],
    quick: 'TAB Bistro by XTSY is a pet-friendly restaurant in Shillong with open-air forest seating, open 9 AM–10:30 PM.',
    faqQ: 'Is there a pet-friendly restaurant in Shillong?',
  },
  {
    slug: 'live-music-restaurant-shillong',
    h1: 'Live Music Dining in Shillong',
    title: 'Live Music Restaurant in Shillong — Dine & Listen | TAB Bistro',
    metaWord: 'live music dining in Shillong',
    intro: 'Shillong is India\'s rock capital, and TAB Bistro by XTSY pairs its multi-cuisine menu with a relaxed, music-loving forest-side atmosphere.',
    points1: { h: 'The Vibe', items: ['Relaxed forest ambiance', 'Music-loving setting', 'Coffee & sundowners', 'Great for evenings', 'Group-friendly'] },
    points2: { h: 'Menu', items: ['Barbecue & tandoor', 'Multi-cuisine mains', 'Snacks & starters', 'Desserts & beverages', 'Veg & non-veg'] },
    keywords: ['live music restaurant shillong', 'best restaurant in shillong', 'places to eat in shillong', 'dinner in shillong', 'restaurants near me'],
    quick: 'TAB Bistro by XTSY offers a relaxed, music-loving forest-side dining experience in Shillong, open 9 AM–10:30 PM.',
    faqQ: 'Is there a live music restaurant in Shillong?',
  },
  {
    slug: 'pre-wedding-shoot-venue-shillong',
    h1: 'Pre-Wedding Shoot & Dining Venue in Shillong',
    title: 'Pre-Wedding Shoot Venue in Shillong — Forest Setting | TAB Bistro',
    metaWord: 'a pre-wedding shoot and dining venue in Shillong',
    intro: 'Looking for a scenic spot to shoot and dine? TAB Bistro by XTSY offers a pine-forest setting in Shillong — ideal for pre-wedding photos paired with a meal or catering.',
    points1: { h: 'Why Shoot Here', items: ['Pine-forest backdrop', 'Open-air seating', 'Scenic dining areas', 'Catering for the day', 'Group bookings'] },
    points2: { h: 'Plan Your Day', items: ['Reserve the space', 'Choose a menu or catering', 'Add barbecue counters', 'Veg & non-veg options', 'Flexible budgets'] },
    keywords: ['pre wedding photoshoot locations', 'pre wedding shoot shillong', 'destination wedding locations', 'wedding catering shillong', 'best food in shillong'],
    quick: 'TAB Bistro by XTSY offers a pine-forest pre-wedding shoot and dining venue in Shillong, with catering available, open 9 AM–10:30 PM.',
    faqQ: 'Is TAB Bistro a good pre-wedding shoot venue in Shillong?',
  },
  {
    slug: 'best-food-places-in-shillong',
    h1: 'Best Food Places in Shillong',
    title: 'Best Food Places in Shillong — Top Eateries Guide | TAB Bistro',
    metaWord: 'the best food places in Shillong',
    intro: 'From street food to fine dining, here are the best food places in Shillong — with TAB Bistro by XTSY as the multi-cuisine all-rounder.',
    points1: { h: 'Best Food Places', items: ['TAB Bistro by XTSY — multi-cuisine & barbecue', 'Police Bazaar street food', 'Laitumkhrah cafés', 'Khasi jadoh stalls', 'Family restaurants'] },
    points2: { h: 'Why TAB Bistro', items: ['10+ cuisines', 'Live grill & tandoor', 'Forest-side ambiance', 'Catering & bulk orders', 'In-house guest discount of 15%'] },
    keywords: ['best food places in shillong', 'food places near me', 'best food in shillong', 'places to eat in shillong', 'food places'],
    quick: 'The best food places in Shillong span street food, cafés and fine dining — TAB Bistro by XTSY is the multi-cuisine standout, open 9 AM–10:30 PM.',
    faqQ: 'What are the best food places in Shillong?',
  },
  {
    slug: 'vegetarian-food-in-shillong',
    h1: 'Vegetarian Food in Shillong',
    title: 'Vegetarian Food in Shillong — Where to Eat Veg | TAB Bistro',
    metaWord: 'vegetarian food in Shillong',
    intro: 'Vegetarian travellers eat well in Shillong. TAB Bistro by XTSY offers an extensive veg menu spanning Indian, Chinese, Italian and continental favourites.',
    points1: { h: 'Veg Dishes to Try', items: ['Paneer tikka & tandoori veg', 'Veg thalis & curries', 'Veg Hakka noodles & Manchurian', 'Veggie pizza & pasta', 'Dosa & idli (breakfast)'] },
    points2: { h: 'Veg-Friendly Dining', items: ['Dedicated vegetarian section', 'Jain-friendly on request', 'Multi-cuisine variety', 'Veg catering & bulk orders', 'Veg breakfast all morning'] },
    keywords: ['vegetarian food near me', 'vegetarian restaurant near me', 'pure veg restaurant in shillong', 'best veg restaurants in shillong', 'vegetarian cafe near me'],
    quick: 'TAB Bistro by XTSY offers extensive vegetarian food in Shillong — Indian, Chinese, Italian and continental veg dishes, open 9 AM–10:30 PM.',
    faqQ: 'Where can I find vegetarian food in Shillong?',
  },
];

const occasionRelated = ['restaurant-in-shillong', 'best-place-to-eat-in-shillong', 'best-restaurants-shillong', 'cafe-shillong'];

occasions.forEach((o) => {
  pages.push(
    dish(
      o.slug,
      o.title,
      `Best ${o.metaWord} at TAB Bistro by XTSY — forest-side multi-cuisine dining. ${o.points1.items[0]}, ${o.points1.items[1].toLowerCase()} & more. ${HOURS}.`,
      o.h1,
      o.intro,
      [
        { heading: o.points1.h, content: 'Highlights:', listItems: o.points1.items },
        { heading: o.points2.h, content: 'Good to know:', listItems: o.points2.items },
      ],
      [
        { question: o.faqQ, answer: o.quick },
        tabFaq,
      ],
      occasionRelated.filter((s) => s !== o.slug).slice(0, 4),
      o.keywords,
      o.quick,
    ),
  );
});

// ===========================================================================
// 3) SERVICE CLUSTER (delivery / takeaway / online order / party)
// ===========================================================================
interface Service {
  slug: string;
  h1: string;
  title: string;
  metaWord: string;
  intro: string;
  items1: { h: string; items: string[] };
  items2: { h: string; items: string[] };
  keywords: string[];
  quick: string;
  faqQ: string;
}

const services: Service[] = [
  {
    slug: 'food-delivery-shillong',
    h1: 'Food Delivery in Shillong',
    title: 'Food Delivery in Shillong — Order Multi-Cuisine | TAB Bistro',
    metaWord: 'food delivery in Shillong',
    intro: 'Want food delivered in Shillong? TAB Bistro by XTSY prepares multi-cuisine meals for delivery and takeaway — barbecue, Chinese, North Indian and more.',
    items1: { h: 'What You Can Order', items: ['North Indian & tandoor', 'Indo-Chinese & noodles', 'Pizza & pasta', 'Biryani & rice bowls', 'Desserts & beverages'] },
    items2: { h: 'How to Order', items: ['Call to place an order', 'Choose delivery or pickup', 'Bulk & party orders welcome', 'Veg & non-veg menus', 'Freshly packed meals'] },
    keywords: ['food delivery shillong', 'restaurants that deliver near me', 'food near me', 'online food order shillong', 'takeout food near me'],
    quick: 'TAB Bistro by XTSY offers food delivery and takeaway in Shillong — multi-cuisine meals freshly packed, open 9 AM–10:30 PM.',
    faqQ: 'Does TAB Bistro deliver food in Shillong?',
  },
  {
    slug: 'online-food-order-shillong',
    h1: 'Order Food Online in Shillong',
    title: 'Order Food Online in Shillong — Multi-Cuisine | TAB Bistro',
    metaWord: 'online food ordering in Shillong',
    intro: 'Order food online in Shillong from TAB Bistro by XTSY — a full multi-cuisine menu for pickup, delivery and party orders.',
    items1: { h: 'Menu to Order', items: ['Barbecue & tandoor', 'Chinese & Thai', 'Continental & Italian', 'Veg & non-veg combos', 'Snacks & desserts'] },
    items2: { h: 'Easy Ordering', items: ['Call or message to order', 'Pickup or delivery', 'Bulk & catering options', 'Custom menus on request', 'Transparent pricing'] },
    keywords: ['online food order shillong', 'order food online shillong', 'food near me', 'takeaway food near me', 'restaurants that deliver near me'],
    quick: 'TAB Bistro by XTSY lets you order food online in Shillong for pickup or delivery — multi-cuisine meals, open 9 AM–10:30 PM.',
    faqQ: 'Can I order food online in Shillong?',
  },
  {
    slug: 'takeaway-food-shillong',
    h1: 'Takeaway Food in Shillong',
    title: 'Takeaway Food in Shillong — Pickup Meals | TAB Bistro',
    metaWord: 'takeaway food in Shillong',
    intro: 'Grab-and-go in Shillong made easy. TAB Bistro by XTSY packs multi-cuisine meals for takeaway — barbecue, noodles, biryani and more.',
    items1: { h: 'Takeaway Favourites', items: ['Barbecue & tandoor packs', 'Noodles & fried rice', 'Biryani & combos', 'Burgers & wraps', 'Desserts & beverages'] },
    items2: { h: 'Quick & Fresh', items: ['Freshly packed meals', 'Veg & non-veg options', 'Bulk & party packs', 'Call ahead to save time', 'Easy pickup'] },
    keywords: ['takeaway food near me', 'takeout restaurants near me', 'takeaway restaurants near me', 'food near me', 'takeout food near me'],
    quick: 'TAB Bistro by XTSY offers takeaway food in Shillong — freshly packed multi-cuisine meals, open 9 AM–10:30 PM.',
    faqQ: 'Where can I get takeaway food in Shillong?',
  },
  {
    slug: 'party-food-order-shillong',
    h1: 'Party Food Orders in Shillong',
    title: 'Party Food Orders in Shillong — Platters & Combos | TAB Bistro',
    metaWord: 'party food orders in Shillong',
    intro: 'Hosting a party in Shillong? TAB Bistro by XTSY prepares party food platters and bulk combos — barbecue, multi-cuisine spreads and packed meals.',
    items1: { h: 'Party Order Menu', items: ['Barbecue & tandoor trays', 'Party platters & combos', 'Veg & non-veg spreads', 'Snacks & starters', 'Desserts & beverages'] },
    items2: { h: 'How It Works', items: ['Share headcount & cuisine', 'Pick a custom menu', 'Confirm date & delivery', 'On-time bulk preparation', 'Catering add-ons available'] },
    keywords: ['order party food near me', 'party order shillong', 'bulk order food near me', 'catering food near me', 'food deals today'],
    quick: 'TAB Bistro by XTSY handles party food orders in Shillong — platters, combos and bulk spreads, open 9 AM–10:30 PM.',
    faqQ: 'Can I order party food in Shillong?',
  },
];

const serviceRelated = ['bulk-food-order-shillong', 'corporate-catering-shillong', 'wedding-catering-shillong', 'restaurant-in-shillong'];

services.forEach((s) => {
  pages.push(
    dish(
      s.slug,
      s.title,
      `${s.metaWord.charAt(0).toUpperCase() + s.metaWord.slice(1)} from TAB Bistro by XTSY — multi-cuisine meals, ${s.items1.items[0].toLowerCase()} & more. ${HOURS}.`,
      s.h1,
      s.intro,
      [
        { heading: s.items1.h, content: 'Menu:', listItems: s.items1.items },
        { heading: s.items2.h, content: 'Details:', listItems: s.items2.items },
      ],
      [
        { question: s.faqQ, answer: s.quick },
        tabFaq,
      ],
      serviceRelated.filter((x) => x !== s.slug).slice(0, 4),
      s.keywords,
      s.quick,
    ),
  );
});

// ===========================================================================
// 4) GENERAL "BEST / TOP / WHERE TO EAT" CLUSTER
// ===========================================================================
const generals: Occasion[] = [
  {
    slug: 'best-restaurant-in-shillong',
    h1: 'Best Restaurant in Shillong',
    title: 'Best Restaurant in Shillong 2026 — Top Multi-Cuisine | TAB Bistro',
    metaWord: 'the best restaurant in Shillong',
    intro: 'Searching for the single best restaurant in Shillong? TAB Bistro by XTSY combines 10+ cuisines, live barbecue and a forest-side setting that locals and travellers return to.',
    points1: { h: 'Why TAB Bistro Tops the List', items: ['10+ cuisines under one roof', 'Live tandoor & barbecue', 'Veg & non-veg menus', 'Scenic forest dining', 'In-house guest discount of 15%'] },
    points2: { h: 'What to Order', items: ['Barbecue & sizzlers', 'North Indian thalis', 'Indo-Chinese & Thai', 'Pizza & pasta', 'Coffee & desserts'] },
    keywords: ['best restaurant in shillong', 'shillong best restaurant', 'best restaurants shillong', 'best food in shillong', 'best restaurant'],
    quick: 'TAB Bistro by XTSY is among the best restaurants in Shillong — a multi-cuisine forest-dining spot with barbecue and global flavours, open 9 AM–10:30 PM.',
    faqQ: 'Which is the best restaurant in Shillong?',
  },
  {
    slug: 'top-restaurants-in-shillong',
    h1: 'Top Restaurants in Shillong',
    title: 'Top Restaurants in Shillong — Curated Dining Guide | TAB Bistro',
    metaWord: 'top restaurants in Shillong',
    intro: 'Here is a curated guide to the top restaurants in Shillong — from cafés and barbecue to Khasi food — with TAB Bistro by XTSY as the multi-cuisine all-rounder.',
    points1: { h: 'Top Dining Picks', items: ['TAB Bistro by XTSY — multi-cuisine & barbecue', 'Cafés in Laitumkhrah', 'Police Bazaar eateries', 'Khasi jadoh stalls', 'Family restaurants'] },
    points2: { h: 'Why TAB Bistro Stands Out', items: ['10+ cuisines', 'Live grill & tandoor', 'Forest-side ambiance', 'Catering & bulk orders', 'Reservations welcome'] },
    keywords: ['top restaurants near me', 'top restaurants in shillong', 'best restaurants shillong', 'good restaurants near me', 'restaurants near me'],
    quick: 'Top restaurants in Shillong span cafés, barbecue and Khasi food — TAB Bistro by XTSY is the multi-cuisine standout, open 9 AM–10:30 PM.',
    faqQ: 'What are the top restaurants in Shillong?',
  },
  {
    slug: 'where-to-eat-in-shillong',
    h1: 'Where to Eat in Shillong',
    title: 'Where to Eat in Shillong — Local Food Guide | TAB Bistro',
    metaWord: 'where to eat in Shillong',
    intro: 'Not sure where to eat in Shillong? This quick guide covers neighbourhoods, cuisines and the best all-rounder — TAB Bistro by XTSY.',
    points1: { h: 'Where to Go', items: ['TAB Bistro by XTSY — multi-cuisine forest dining', 'Police Bazaar — cafés & street food', 'Laitumkhrah — cafés & casual eats', 'Iewduh — Khasi jadoh', 'Ward\'s Lake area — heritage cafés'] },
    points2: { h: 'Plan Your Meal', items: ['Most kitchens close by 10:30 PM', 'Reserve ahead on weekends', 'Veg & non-veg widely available', 'TAB Bistro offers catering', 'In-house guests get 15% off'] },
    keywords: ['where to eat in shillong', 'places to eat in shillong', 'best places to eat near me', 'food places near me', 'eat near me'],
    quick: 'For where to eat in Shillong, TAB Bistro by XTSY is a multi-cuisine forest restaurant covering barbecue, Chinese, continental and more, open 9 AM–10:30 PM.',
    faqQ: 'Where should I eat in Shillong?',
  },
  {
    slug: 'famous-restaurants-in-shillong',
    h1: 'Famous Restaurants in Shillong',
    title: 'Famous Restaurants in Shillong — Must-Visit Spots | TAB Bistro',
    metaWord: 'famous restaurants in Shillong',
    intro: 'Shillong has its share of famous eateries — and TAB Bistro by XTSY has quickly become a must-visit for its multi-cuisine menu and forest setting.',
    points1: { h: 'Must-Visit Restaurants', items: ['TAB Bistro by XTSY — multi-cuisine & barbecue', 'Cafés with live music', 'Chinese & momo specialists', 'Khasi food stalls', 'Family dining spots'] },
    points2: { h: 'Why Visit TAB Bistro', items: ['10+ cuisines', 'Live tandoor & barbecue', 'Forest-side ambiance', 'Catering & bulk orders', 'Reservations welcome'] },
    keywords: ['famous restaurants in shillong', 'best restaurants shillong', 'nice restaurants near me', 'recommended restaurants near me', 'good restaurants in shillong'],
    quick: 'Among the famous restaurants in Shillong, TAB Bistro by XTSY stands out for multi-cuisine forest dining and live barbecue, open 9 AM–10:30 PM.',
    faqQ: 'What are the famous restaurants in Shillong?',
  },
  {
    slug: 'cafes-in-shillong',
    h1: 'Cafés in Shillong',
    title: 'Cafés in Shillong — Best Coffee & Hangouts | TAB Bistro',
    metaWord: 'cafés in Shillong',
    intro: 'Shillong\'s café culture is legendary. From artisan coffee to live music, here are the best cafés — with TAB Bistro by XTSY adding a forest-side café experience.',
    points1: { h: 'Best Cafés to Try', items: ['TAB Bistro by XTSY — forest-side café', 'Laitumkhrah coffee houses', 'Police Bazaar bakeries', 'Live-music cafés', 'Work-friendly spots'] },
    points2: { h: 'Café at XTSY', items: ['Specialty coffee & cold brew', 'All-day breakfast', 'Cakes & desserts', 'Cosy forest seating', 'WiFi-friendly'] },
    keywords: ['best cafes in shillong', 'cafe shillong', 'coffee shop shillong', 'best cafe shillong', 'brunch near me'],
    quick: 'The best cafés in Shillong span Laitumkhrah and Police Bazaar — TAB Bistro by XTSY adds a forest-side café with coffee and breakfast, open 9 AM–10:30 PM.',
    faqQ: 'What are the best cafés in Shillong?',
  },
  {
    slug: 'cheap-restaurants-in-shillong',
    h1: 'Affordable Restaurants in Shillong',
    title: 'Affordable Restaurants in Shillong — Value Dining | TAB Bistro',
    metaWord: 'affordable restaurants in Shillong',
    intro: 'Eat well without overspending. TAB Bistro by XTSY offers value-packed multi-cuisine meals in Shillong with generous portions and an in-house guest discount.',
    points1: { h: 'Value Picks', items: ['Combo & set menus', 'Veg & non-veg thalis', 'Noodles & fried rice', 'Snacks & quick bites', 'Family-size portions'] },
    points2: { h: 'Save More', items: ['In-house guest discount of 15%', 'Group & bulk pricing', 'Generous portions', 'Takeaway available', 'Transparent prices'] },
    keywords: ['cheap restaurants shillong', 'budget restaurants shillong', 'food deals today', 'affordable food shillong', 'food places near me'],
    quick: 'TAB Bistro by XTSY offers affordable, value-packed multi-cuisine meals in Shillong with combos and an in-house guest discount, open 9 AM–10:30 PM.',
    faqQ: 'Where can I find affordable restaurants in Shillong?',
  },
];

const generalRelated = ['restaurant-in-shillong', 'best-restaurants-shillong', 'best-place-to-eat-in-shillong', 'places-to-eat-in-shillong'];

generals.forEach((o) => {
  pages.push(
    dish(
      o.slug,
      o.title,
      `${o.metaWord.charAt(0).toUpperCase() + o.metaWord.slice(1)} — discover ${o.points1.items[0].split(' — ')[0]} and more. Dine at TAB Bistro by XTSY. ${HOURS}.`,
      o.h1,
      o.intro,
      [
        { heading: o.points1.h, content: 'Highlights:', listItems: o.points1.items },
        { heading: o.points2.h, content: 'Good to know:', listItems: o.points2.items },
      ],
      [
        { question: o.faqQ, answer: o.quick },
        tabFaq,
      ],
      generalRelated.filter((s) => s !== o.slug).slice(0, 4),
      o.keywords,
      o.quick,
    ),
  );
});

// ===========================================================================
// 5) LOCALITY CLUSTER
// ===========================================================================
interface Locality {
  slug: string;
  area: string;
  known: string; // what the area is known for
  keywords: string[];
}

const localities: Locality[] = [
  { slug: 'best-restaurant-in-police-bazar-shillong', area: 'Police Bazar', known: 'cafés, multi-cuisine restaurants and street food', keywords: ['best restaurant in police bazar shillong', 'restaurant in police bazar shillong', 'police bazar restaurant', 'restaurants in shillong police bazar', 'best restaurants in shillong police bazar'] },
  { slug: 'best-restaurants-in-laitumkhrah', area: 'Laitumkhrah', known: 'cafés, Chinese eateries and casual dining', keywords: ['best restaurants in laitumkhrah', 'restaurant in laitumkhrah', 'restaurants in laitumkhrah shillong', 'best restaurants in shillong laitumkhrah', 'restaurants in laitumkhrah'] },
  { slug: 'restaurants-near-police-bazar', area: 'near Police Bazar', known: 'quick bites, cafés and family restaurants', keywords: ['restaurants near police bazar', 'pb restaurant shillong', 'police bazar restaurant', 'restaurants in shillong police bazar', 'places to eat in shillong'] },
  { slug: 'restaurants-in-mawlai-shillong', area: 'Mawlai', known: 'local eateries and casual dining', keywords: ['restaurants in mawlai shillong', 'restaurants in shillong', 'places to eat in shillong', 'food places near me', 'restaurants near me'] },
  { slug: 'restaurants-in-nongthymmai-shillong', area: 'Nongthymmai', known: 'neighbourhood cafés and eateries', keywords: ['restaurants in nongthymmai shillong', 'restaurants in shillong', 'places to eat in shillong', 'restaurants near me', 'food places near me'] },
  { slug: 'restaurants-in-new-shillong-township', area: 'New Shillong Township', known: 'modern dining, including TAB Bistro by XTSY', keywords: ['restaurants in new shillong township', 'restaurants in shillong', 'best restaurant in shillong', 'restaurants near me', 'food places near me'] },
  { slug: 'restaurants-in-mawkhar-shillong', area: 'Mawkhar', known: 'old-town eateries and cafés', keywords: ['restaurants in mawkhar shillong', 'restaurants in shillong', 'places to eat in shillong', 'restaurants near me', 'food places near me'] },
  { slug: 'restaurants-near-ward-lake-shillong', area: 'near Ward\'s Lake', known: 'heritage cafés and tourist-friendly dining', keywords: ['restaurants near ward lake shillong', 'places to eat in shillong', 'restaurants in shillong', 'best food in shillong', 'restaurants near me'] },
  { slug: 'restaurants-near-umiam-lake', area: 'near Umiam Lake', known: 'lakeside cafés and scenic dining', keywords: ['restaurants near umiam lake', 'umiam lake restaurant', 'places to eat near shillong', 'best food in shillong', 'restaurants near me'] },
  { slug: 'restaurants-near-shillong-peak', area: 'near Shillong Peak', known: 'viewpoint cafés and casual eats', keywords: ['restaurants near shillong peak', 'places to eat in shillong', 'restaurants in shillong', 'best food in shillong', 'restaurants near me'] },
  { slug: 'restaurants-in-rilbong-shillong', area: 'Rilbong', known: 'local cafés and casual dining', keywords: ['restaurants in rilbong shillong', 'restaurants in shillong', 'places to eat in shillong', 'restaurants near me', 'food places near me'] },
  { slug: 'restaurants-in-nongrim-hills-shillong', area: 'Nongrim Hills', known: 'cafés and neighbourhood eateries', keywords: ['restaurants in nongrim hills shillong', 'restaurants in shillong', 'places to eat in shillong', 'restaurants near me', 'food places near me'] },
  { slug: 'restaurants-near-don-bosco-museum', area: 'near Don Bosco Museum', known: 'tourist-friendly cafés and dining', keywords: ['restaurants near don bosco museum', 'places to eat in shillong', 'restaurants in shillong', 'best food in shillong', 'restaurants near me'] },
  { slug: 'restaurants-near-iewduh-bara-bazaar', area: 'near Iewduh (Bara Bazaar)', known: 'authentic Khasi jadoh stalls and local food', keywords: ['restaurants near bara bazaar shillong', 'khasi food shillong', 'places to eat in shillong', 'best food in shillong', 'restaurants near me'] },
];

const localityRelated = ['restaurants-in-police-bazar-shillong', 'restaurants-in-laitumkhrah', 'restaurant-in-shillong', 'best-place-to-eat-in-shillong'];

localities.forEach((l) => {
  pages.push(
    dish(
      l.slug,
      `Restaurants ${l.area.startsWith('near') ? l.area : `in ${l.area}`}, Shillong — Dining Guide | TAB Bistro`,
      `Best restaurants ${l.area.startsWith('near') ? l.area : `in ${l.area}`}, Shillong — ${l.known}. Plan your meal and dine at TAB Bistro by XTSY. ${HOURS}.`,
      `Restaurants ${l.area.startsWith('near') ? l.area : `in ${l.area}`}, Shillong`,
      `${l.area.startsWith('near') ? `Eating ${l.area}` : `${l.area} is one of Shillong's`} ${l.area.startsWith('near') ? 'in Shillong gives you' : 'food-friendly areas, known for'} ${l.known}. For a full multi-cuisine experience, TAB Bistro by XTSY in New Shillong Township is a short hop away.`,
      [
        { heading: `Dining ${l.area.startsWith('near') ? l.area : `in ${l.area}`}`, content: 'What the area offers:', listItems: ['Local cafés & casual eateries', 'Chinese & momo joints', 'Quick bites & street food', 'Family-friendly options', 'Easy access to TAB Bistro nearby'] },
        { heading: 'Pair It With TAB Bistro', content: 'When you want more variety:', listItems: ['Multi-cuisine forest dining', 'Barbecue & tandoor', 'Veg & non-veg menus', 'Reservations & catering', 'In-house guest discount of 15%'] },
      ],
      [
        { question: `Which are the best restaurants ${l.area.startsWith('near') ? l.area : `in ${l.area}`}, Shillong?`, answer: `${l.area.startsWith('near') ? `Dining ${l.area}` : l.area} in Shillong offers ${l.known}. For a full multi-cuisine spread with barbecue and global cuisine, TAB Bistro by XTSY nearby is a top pick, open 9 AM–10:30 PM.` },
        tabFaq,
      ],
      localityRelated.filter((s) => s !== l.slug).slice(0, 4),
      l.keywords,
      `For dining ${l.area.startsWith('near') ? l.area : `in ${l.area}`}, Shillong (${l.known}), TAB Bistro by XTSY nearby serves multi-cuisine food and barbecue, open 9 AM–10:30 PM.`,
    ),
  );
});

// ===========================================================================
// 6) CUISINE × LOCALITY COMBOS
// ===========================================================================
interface Combo {
  slug: string;
  food: string; // e.g. "Chinese restaurant"
  area: string; // e.g. "Police Bazar"
  dishes: string[];
  keywords: string[];
}

const combos: Combo[] = [
  { slug: 'chinese-restaurant-in-police-bazar-shillong', food: 'Chinese restaurant', area: 'Police Bazar', dishes: ['Hakka & Schezwan noodles', 'Chilli chicken & paneer', 'Manchurian & fried rice', 'Momos & spring rolls', 'Thai curries'], keywords: ['chinese restaurant in police bazar shillong', 'chinese restaurant in shillong', 'best chinese restaurant in shillong', 'restaurants in shillong police bazar', 'chinese food near me'] },
  { slug: 'chinese-restaurant-in-laitumkhrah', food: 'Chinese restaurant', area: 'Laitumkhrah', dishes: ['Hakka & Schezwan noodles', 'Chilli chicken & paneer', 'Manchurian & fried rice', 'Momos & dumplings', 'Thai bowls'], keywords: ['chinese restaurant in laitumkhrah', 'chinese restaurant in shillong', 'best chinese restaurant in shillong', 'restaurants in laitumkhrah', 'chinese food near me'] },
  { slug: 'veg-restaurant-in-police-bazar-shillong', food: 'pure veg restaurant', area: 'Police Bazar', dishes: ['Veg thali & curries', 'Paneer tikka & tandoori veg', 'Veg Hakka noodles', 'Veggie pizza & pasta', 'Dosa & idli'], keywords: ['veg restaurant in police bazar shillong', 'pure veg restaurant in shillong', 'best veg restaurants in shillong', 'restaurants in shillong police bazar', 'vegetarian food near me'] },
  { slug: 'cafe-in-laitumkhrah-shillong', food: 'café', area: 'Laitumkhrah', dishes: ['Specialty coffee & cold brew', 'All-day breakfast', 'Cakes & desserts', 'Sandwiches & bites', 'Teas & shakes'], keywords: ['cafe in laitumkhrah', 'cafe shillong', 'best cafes in shillong', 'restaurants in laitumkhrah', 'brunch near me'] },
  { slug: 'cafe-in-police-bazar-shillong', food: 'café', area: 'Police Bazar', dishes: ['Espresso & cold coffee', 'Breakfast & bakes', 'Cakes & desserts', 'Light snacks', 'Teas & shakes'], keywords: ['cafe in police bazar shillong', 'cafe shillong', 'best cafes in shillong', 'restaurants in shillong police bazar', 'breakfast near me'] },
  { slug: 'barbecue-restaurant-in-police-bazar-shillong', food: 'barbecue restaurant', area: 'Police Bazar', dishes: ['Charcoal barbecue platters', 'Tandoori chicken & fish', 'Sizzlers & kebabs', 'Veg barbecue', 'Grilled sides'], keywords: ['barbecue restaurant in police bazar shillong', 'barbeque restaurant shillong', 'barbecue restaurant shillong', 'restaurants in shillong police bazar', 'best food near me'] },
  { slug: 'north-indian-restaurant-in-police-bazar-shillong', food: 'North Indian restaurant', area: 'Police Bazar', dishes: ['Butter chicken & dal makhani', 'Tandoori platters', 'Paneer & kadhai dishes', 'Biryani & pulao', 'Naan & roti'], keywords: ['north indian restaurant in police bazar shillong', 'indian restaurant in shillong', 'restaurants in shillong police bazar', 'indian food near me', 'best food in shillong'] },
  { slug: 'family-restaurant-in-police-bazar-shillong', food: 'family restaurant', area: 'Police Bazar', dishes: ['Multi-cuisine spreads', 'Veg & non-veg thalis', 'Pizza & pasta', 'Indo-Chinese', 'Kid-friendly dishes'], keywords: ['family restaurant in police bazar shillong', 'family restaurants near me', 'restaurants in shillong police bazar', 'best places to eat near me', 'restaurants near me'] },
  { slug: 'multi-cuisine-restaurant-in-laitumkhrah', food: 'multi-cuisine restaurant', area: 'Laitumkhrah', dishes: ['North Indian & tandoor', 'Indo-Chinese & Thai', 'Continental & Italian', 'Barbecue & sizzlers', 'Café & desserts'], keywords: ['multi cuisine restaurant shillong', 'restaurants in laitumkhrah', 'best restaurants in laitumkhrah', 'restaurants in shillong', 'best food in shillong'] },
];

const comboRelated = ['restaurants-in-police-bazar-shillong', 'restaurants-in-laitumkhrah', 'best-chinese-restaurant-shillong', 'restaurant-in-shillong'];

combos.forEach((c) => {
  const areaPhrase = `${c.food} in ${c.area}, Shillong`;
  pages.push(
    dish(
      c.slug,
      `${c.food.charAt(0).toUpperCase() + c.food.slice(1)} in ${c.area} Shillong — ${c.dishes[0].split(' & ')[0]} & More | TAB Bistro`,
      `Looking for a ${c.food} in ${c.area}, Shillong? TAB Bistro by XTSY nearby serves ${c.dishes[0].toLowerCase()}, ${c.dishes[1].toLowerCase()} & more. ${HOURS}.`,
      `${c.food.charAt(0).toUpperCase() + c.food.slice(1)} in ${c.area}, Shillong`,
      `Hunting for a ${areaPhrase}? ${c.area} has plenty of options, and for a full multi-cuisine spread TAB Bistro by XTSY is a short hop away in New Shillong Township — serving ${c.food === 'café' ? 'coffee, breakfast' : c.dishes[0].toLowerCase()} and much more.`,
      [
        { heading: 'What to Order', content: 'Popular picks:', listItems: c.dishes },
        { heading: 'Why TAB Bistro Nearby', content: 'A reliable choice close to ' + c.area + ':', listItems: ['10+ cuisines under one roof', 'Live tandoor & barbecue', 'Veg & non-veg menus', 'Reservations & catering', 'In-house guest discount of 15%'] },
      ],
      [
        { question: `Where is a good ${c.food} in ${c.area}, Shillong?`, answer: `${c.area} has several options for a ${c.food}. For ${c.food === 'café' ? 'coffee and breakfast' : c.dishes[0].toLowerCase()} plus a full multi-cuisine menu, TAB Bistro by XTSY nearby is a top pick, open 9 AM–10:30 PM.` },
        tabFaq,
      ],
      comboRelated.filter((s) => s !== c.slug).slice(0, 4),
      c.keywords,
      `For a ${areaPhrase}, TAB Bistro by XTSY nearby serves ${c.food === 'café' ? 'coffee and breakfast' : c.dishes[0].toLowerCase()} and a full multi-cuisine menu, open 9 AM–10:30 PM.`,
    ),
  );
});

// ===========================================================================
// 7) CATERING / WEDDING / BULK CLUSTER (extended)
// ===========================================================================
const catering: Service[] = [
  {
    slug: 'destination-wedding-catering-shillong',
    h1: 'Destination Wedding Catering in Shillong',
    title: 'Destination Wedding Catering in Shillong — Menus | TAB Bistro',
    metaWord: 'destination wedding catering in Shillong',
    intro: 'Planning a destination wedding in Meghalaya? TAB Bistro by XTSY caters weddings in Shillong with multi-cuisine menus, live counters and barbecue stations tailored to your guest count.',
    items1: { h: 'Wedding Catering Menus', items: ['North Indian, Chinese & Continental', 'Live tandoor & barbecue counters', 'Veg, non-veg & Jain options', 'Custom set menus by headcount', 'Dessert & beverage stations'] },
    items2: { h: 'Plan Your Event', items: ['Share date & guest count', 'Choose cuisines & counters', 'Taste & confirm the menu', 'On-time execution', 'Bulk & add-on orders'] },
    keywords: ['destination wedding packages', 'destination wedding locations', 'wedding catering shillong', 'destination wedding planners', 'luxury destination wedding'],
    quick: 'TAB Bistro by XTSY provides destination wedding catering in Shillong — multi-cuisine menus, live counters and barbecue, tailored to your guest count.',
    faqQ: 'Do you cater destination weddings in Shillong?',
  },
  {
    slug: 'event-catering-shillong',
    h1: 'Event Catering in Shillong',
    title: 'Event Catering in Shillong — Parties & Functions | TAB Bistro',
    metaWord: 'event catering in Shillong',
    intro: 'From private parties to corporate functions, TAB Bistro by XTSY handles event catering in Shillong with reliable multi-cuisine menus and on-time service.',
    items1: { h: 'Events We Cater', items: ['Weddings & receptions', 'Birthday & private parties', 'Corporate & office events', 'Conferences & seminars', 'Festivals & gatherings'] },
    items2: { h: 'Menus & Service', items: ['Multi-cuisine spreads', 'Live counters on request', 'Veg, non-veg & Jain', 'Custom headcount menus', 'Punctual delivery'] },
    keywords: ['event catering shillong', 'catering services shillong', 'catering food near me', 'order party food near me', 'wedding catering shillong'],
    quick: 'TAB Bistro by XTSY offers event catering in Shillong for weddings, parties, corporate functions and more — multi-cuisine menus with live counters.',
    faqQ: 'Does TAB Bistro do event catering in Shillong?',
  },
  {
    slug: 'birthday-party-catering-shillong',
    h1: 'Birthday Party Catering in Shillong',
    title: 'Birthday Party Catering in Shillong — Menus | TAB Bistro',
    metaWord: 'birthday party catering in Shillong',
    intro: 'Throw a memorable birthday with TAB Bistro by XTSY catering in Shillong — party platters, cakes and multi-cuisine spreads delivered to your venue.',
    items1: { h: 'Party Catering Menu', items: ['Party platters & combos', 'Barbecue & tandoor trays', 'Veg & non-veg spreads', 'Snacks & starters', 'Cakes & desserts'] },
    items2: { h: 'How It Works', items: ['Share headcount & theme', 'Choose a custom menu', 'Confirm date & delivery', 'On-time preparation', 'Add-on cakes & beverages'] },
    keywords: ['birthday party catering shillong', 'order party food near me', 'catering food near me', 'party order shillong', 'bulk order food near me'],
    quick: 'TAB Bistro by XTSY caters birthday parties in Shillong — platters, barbecue trays, cakes and multi-cuisine spreads delivered to your venue.',
    faqQ: 'Can I get birthday party catering in Shillong?',
  },
  {
    slug: 'bulk-food-supply-shillong',
    h1: 'Bulk Food Supply in Shillong',
    title: 'Bulk Food Supply in Shillong — Online Bulk Orders | TAB Bistro',
    metaWord: 'bulk food supply in Shillong',
    intro: 'Need food for a crowd or recurring orders? TAB Bistro by XTSY supplies bulk food in Shillong — multi-cuisine spreads, packed meals and party platters.',
    items1: { h: 'Bulk Supply Options', items: ['Party & event platters', 'Corporate lunch packs', 'Barbecue & tandoor trays', 'Veg & non-veg combos', 'Packed individual meals'] },
    items2: { h: 'How to Order in Bulk', items: ['Share headcount & cuisine', 'Choose a custom menu', 'Confirm date & delivery', 'On-time bulk preparation', 'Recurring orders welcome'] },
    keywords: ['bulk food online', 'order bulk food online', 'buy bulk food online', 'bulk food delivery near me', 'bulk food purchases online'],
    quick: 'TAB Bistro by XTSY supplies bulk food in Shillong — party platters, corporate packs and packed meals, with recurring orders welcome.',
    faqQ: 'Can I order food in bulk in Shillong?',
  },
  {
    slug: 'office-lunch-catering-shillong',
    h1: 'Office Lunch Catering in Shillong',
    title: 'Office Lunch Catering in Shillong — Daily Meals | TAB Bistro',
    metaWord: 'office lunch catering in Shillong',
    intro: 'Keep your team fed with TAB Bistro by XTSY office lunch catering in Shillong — daily multi-cuisine meals and event spreads delivered on time.',
    items1: { h: 'Office Catering Menu', items: ['Daily lunch packs', 'Veg, non-veg & Jain options', 'Conference & seminar spreads', 'Team offsite meals', 'Bulk packed meals'] },
    items2: { h: 'Why Teams Choose Us', items: ['Multi-cuisine variety', 'Punctual delivery', 'Custom headcount menus', 'Transparent pricing', 'Recurring orders welcome'] },
    keywords: ['office catering shillong', 'corporate catering shillong', 'bulk order food near me', 'catering food near me', 'event catering shillong'],
    quick: 'TAB Bistro by XTSY provides office lunch catering in Shillong — daily meals, event spreads and bulk packed meals delivered on time.',
    faqQ: 'Does TAB Bistro do office lunch catering in Shillong?',
  },
];

const cateringRelated = ['wedding-catering-shillong', 'bulk-food-order-shillong', 'corporate-catering-shillong', 'event-catering-shillong'];

catering.forEach((s) => {
  pages.push(
    dish(
      s.slug,
      s.title,
      `${s.metaWord.charAt(0).toUpperCase() + s.metaWord.slice(1)} by TAB Bistro by XTSY — ${s.items1.items[0].toLowerCase()}, live counters & custom menus. ${HOURS}.`,
      s.h1,
      s.intro,
      [
        { heading: s.items1.h, content: 'What we offer:', listItems: s.items1.items },
        { heading: s.items2.h, content: 'How it works:', listItems: s.items2.items },
      ],
      [
        { question: s.faqQ, answer: s.quick },
      ],
      cateringRelated.filter((x) => x !== s.slug).slice(0, 4),
      s.keywords,
      s.quick,
    ),
  );
});

// ===========================================================================
// EXPORT (deduped against any accidental slug collisions)
// ===========================================================================
const seen = new Set<string>();
export const DINING_EXPANSION_SEO_PAGES: SEOPageData[] = pages.filter((p) => {
  if (seen.has(p.slug)) return false;
  seen.add(p.slug);
  return true;
});
