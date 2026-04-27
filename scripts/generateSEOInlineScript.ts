/**
 * Generate an inline <script> block that sets page-specific
 * <title>, <meta description>, AND injects rich AI-readable
 * descriptive content (H1, intro, FAQs, JSON-LD) into the DOM
 * BEFORE React loads.
 *
 * This solves two problems:
 *  1. Google sees unique metadata for each of the 1,300+ pages on first crawl
 *  2. AI crawlers (ChatGPT-User, PerplexityBot, GPTBot, ClaudeBot, Googlebot)
 *     that DO execute JS get unique, descriptive entity content per URL —
 *     not the duplicate homepage shell.
 */

import { ALL_SEO_PAGES } from '../src/data/seoPages';

interface SEOMapEntry {
  t: string;  // title
  d: string;  // meta description
  h?: string; // h1
  i?: string; // intro paragraph
  f?: Array<[string, string]>; // top FAQs [question, answer]
  s?: string; // schema.org @type (e.g. Hostel, TouristTrip, TouristAttraction, FAQPage)
  c?: string; // category label for breadcrumb
}

// Static routes that need unique metadata (not covered by programmatic SEO pages)
const STATIC_ROUTE_META: Record<string, SEOMapEntry> = {
  'about': { t: 'About XTSY — India\'s Biggest Hostel in Northeast', d: 'XTSY Travellers Hostel, Shillong. India\'s first 270° glass suite, NEITA 2025 nominated. 2.5 hrs from Guwahati airport. Learn our story.', h: 'About XTSY Travellers Hostel', i: 'XTSY Travellers Hostel is the biggest hostel in Northeast India, located in Shillong, Meghalaya. Home to India\'s first 270° panoramic glass suite, we host over 320 guests annually with a 4.8-star rating.', s: 'AboutPage' },
  'gallery': { t: 'XTSY Photo Gallery — Hostel & Glass Suite Photos', d: 'See inside XTSY Shillong — 270° glass suite, dormitories, common areas, mountain views. Real photos from India\'s biggest hostel.', h: 'XTSY Photo Gallery', i: 'Browse authentic photos of XTSY Travellers Hostel in Shillong: the 270° glass suite, mixed and female dormitories, common lounge, TAB Bistro restaurant, and surrounding Meghalaya mountain views.', s: 'ImageGallery' },
  'tours': { t: 'North East India Tour Packages 2026 | XTSY Travel', d: '30+ curated tours across Meghalaya, Nagaland, Assam, Arunachal Pradesh & Sikkim. Living root bridges, safaris, tribal festivals. From ₹7,999.', h: 'North East India Tour Packages', i: 'Explore 30+ curated tour packages across Northeast India: Meghalaya living root bridges, Kaziranga safaris in Assam, Hornbill Festival in Nagaland, Tawang in Arunachal Pradesh, and Gangtok in Sikkim. Packages start at ₹7,999.', s: 'TouristTrip' },
  'xtsy-270': { t: '270° Glass Suite — India\'s First Stargazing Room | XTSY', d: 'India\'s first 270° panoramic glass suite in Shillong. Stargazing, mountain views, luxury glamping. Perfect for couples & anniversaries.', h: 'XTSY 270° Glass Suite — India\'s First Panoramic Stargazing Room', i: 'XTSY\'s 270° Glass Suite is India\'s first floor-to-ceiling panoramic glass room. Located in Shillong, Meghalaya, it offers unobstructed mountain views, in-room stargazing, and a luxury glamping experience for couples and anniversaries.', s: 'LodgingBusiness' },
  'pet-friendly': { t: 'Pet-Friendly Hostel in Shillong | XTSY Travel', d: 'Travel with your pet to XTSY Shillong. Dog-friendly rooms, open spaces, mountain walks. Northeast India\'s pet-friendly hostel.', h: 'Pet-Friendly Hostel in Shillong', s: 'Hostel' },
  'female-travellers': { t: 'Safe Stays for Women — Female Dorms | XTSY Shillong', d: 'Female-only dorms with 24/7 security, CCTV, personal lockers. India\'s safest hostel for solo women travellers in Shillong.', h: 'Safe Stays for Female Travellers in Shillong', s: 'Hostel' },
  'work-from-home': { t: 'Workation in Shillong — Co-Working Hostel | XTSY', d: 'Remote work from XTSY Shillong. High-speed WiFi, mountain views, co-working space. The digital nomad\'s dream workation.', h: 'Workation Hostel in Shillong', s: 'Hostel' },
  'xtsy-vs-zostel': { t: 'XTSY vs Zostel — Honest Hostel Comparison 2026', d: 'How does XTSY compare to Zostel, The Hosteller, goSTOPS? Independent review. Side-by-side comparison.', h: 'XTSY vs Zostel — Honest 2026 Comparison', s: 'Article' },
  'xtsy-rentals': { t: 'Bike & Car Rentals in Shillong | XTSY Rentals', d: 'Rent bikes, scooters & cars in Shillong. Royal Enfield, self-drive options. Explore Meghalaya at your own pace from ₹800/day.', h: 'Bike & Car Rentals in Shillong', s: 'AutoRental' },
  'tab-bistro': { t: 'TAB Bistro — Best Restaurant in Shillong | XTSY', d: 'Dine at TAB Bistro, Shillong. Multi-cuisine restaurant with Khasi specialties, continental dishes, and mountain views.', h: 'TAB Bistro — Restaurant at XTSY Shillong', s: 'Restaurant' },
  'book': { t: 'Book Your Stay — XTSY Hostel Shillong | Best Rates', d: 'Book dorms from ₹450, private rooms from ₹2,500, 270° glass suite from ₹8,500. Best price guaranteed at XTSY Shillong.', h: 'Book Your Stay at XTSY Shillong' },
  'privacy-policy': { t: 'Privacy Policy | XTSY Travel', d: 'How XTSY protects your personal data. GDPR and India DPDP compliant privacy policy.', h: 'Privacy Policy' },
  'terms-of-service': { t: 'Terms of Service | XTSY Travel', d: 'Terms and conditions for booking at XTSY Travellers Hostel Shillong.', h: 'Terms of Service' },
  'pricing-cancellation-policy': { t: 'Pricing & Cancellation Policy | XTSY', d: 'XTSY booking pricing, cancellation, and refund policy. Transparent terms for hostel stays and tour packages.', h: 'Pricing & Cancellation Policy' },
  'faq': { t: 'FAQ — XTSY Travellers Hostel Shillong', d: 'Frequently asked questions about XTSY Hostel Shillong. Check-in times, pet policy, booking, tours, and more.', h: 'Frequently Asked Questions', s: 'FAQPage' },
  'things-to-do-in-meghalaya': { t: 'Things to Do in Meghalaya 2026 — Complete Guide | XTSY', d: 'Top 50+ things to do in Meghalaya. Waterfalls, caves, living root bridges, villages, adventure activities. Plan your trip.', h: 'Things to Do in Meghalaya', i: 'Discover 50+ things to do in Meghalaya: trek to the double-decker living root bridge in Nongriat, boat on Asia\'s clearest river at Dawki, explore Mawsmai cave in Cherrapunji, visit Asia\'s cleanest village Mawlynnong, and witness Nohkalikai — India\'s tallest waterfall.', s: 'TouristAttraction' },
  'meghalaya-tour-packages': { t: 'Meghalaya Tour Packages 2026 | Starting ₹7,999 | XTSY', d: 'Explore 30+ Meghalaya tour packages. Living root bridges, Dawki, Cherrapunji, caves. Customizable itineraries from ₹7,999.', h: 'Meghalaya Tour Packages 2026', i: '30+ curated Meghalaya tour packages covering Shillong, Cherrapunji, Dawki, Mawlynnong, living root bridges and caves. Customizable 3-day to 7-day itineraries from ₹7,999, including stay at XTSY hostel.', s: 'TouristTrip' },
  'shillong-tour-package': { t: 'Shillong Tour Package 2026 | Weekend Getaway | XTSY', d: 'Shillong tour packages from ₹5,999. Laitlum Canyons, Elephant Falls, Police Bazaar. 2-5 day itineraries.', h: 'Shillong Tour Package 2026', s: 'TouristTrip' },
  'meghalaya-couple-tour-package': { t: 'Meghalaya Couple Tour Package 2026 | Romantic Getaway', d: 'Romantic Meghalaya tour for couples. 270° glass suite, scenic drives, private dining. Starting ₹19,999.', h: 'Meghalaya Couple Tour Package', s: 'TouristTrip' },
  'best-hostel-in-shillong': { t: 'Best Hostel in Shillong 2026 — XTSY Travellers Hostel', d: 'XTSY is rated the best hostel in Shillong. Dorms from ₹450, 270° glass suite, 4.8★ Google rating. Book direct.', h: 'Best Hostel in Shillong — XTSY Travellers Hostel', i: 'XTSY Travellers Hostel is the highest-rated hostel in Shillong with a 4.8-star Google rating from 320+ reviews. Located on Mawdiangdiang Road, 2.5 hours from Guwahati airport. Dorms start at ₹329/night, private rooms from ₹2,500, and India\'s first 270° glass suite from ₹8,500.', s: 'Hostel' },
  'hotels-in-shillong': { t: 'Hotels in Shillong — Best Stays 2026 | XTSY Guide', d: 'Compare top hotels in Shillong from budget to luxury. XTSY offers the best value with private rooms from ₹2,500.', h: 'Hotels in Shillong — Best Stays', s: 'Hotel' },
  'homestays-in-shillong': { t: 'Homestays in Shillong 2026 | Local Experience | XTSY', d: 'Experience authentic Shillong homestays. Local families, home-cooked Khasi food, mountain views. From ₹1,500/night.', h: 'Homestays in Shillong', s: 'LodgingBusiness' },
  'luxury-glamping-shillong': { t: 'Luxury Glamping in Shillong — 270° Glass Suite | XTSY', d: 'India\'s first 270° panoramic glass suite. Luxury glamping with mountain views in Shillong, Meghalaya.', h: 'Luxury Glamping in Shillong', s: 'LodgingBusiness' },
  'destination-wedding-shillong': { t: 'Destination Wedding in Shillong | XTSY Events', d: 'Plan your dream destination wedding in Shillong, Meghalaya. Mountain venues, local cuisine, unique experiences.', h: 'Destination Wedding in Shillong', s: 'EventVenue' },
  'restaurant-in-shillong': { t: 'Best Restaurant in Shillong — TAB Bistro | XTSY', d: 'TAB Bistro at XTSY Shillong. Multi-cuisine restaurant with Khasi specialties and mountain views.', h: 'Best Restaurant in Shillong', s: 'Restaurant' },
  'best-time-to-visit-meghalaya': { t: 'Best Time to Visit Meghalaya — Month-by-Month Guide 2026', d: 'When to visit Meghalaya: monsoon waterfalls, winter clarity, spring festivals. Month-by-month weather and travel guide.', h: 'Best Time to Visit Meghalaya', s: 'Article' },
  'budget-trip-meghalaya': { t: 'Budget Trip to Meghalaya — Under ₹10,000 Guide | XTSY', d: 'Plan a budget Meghalaya trip under ₹10,000. Cheap stays, transport tips, free attractions. Complete money-saving guide.', h: 'Budget Trip to Meghalaya — Under ₹10,000', s: 'Article' },
  'hidden-places-meghalaya': { t: 'Hidden Places in Meghalaya — Secret Spots 2026 | XTSY', d: 'Discover Meghalaya\'s hidden gems. Off-the-beaten-path waterfalls, villages, viewpoints locals love.', h: 'Hidden Places in Meghalaya', s: 'TouristAttraction' },
  'meghalaya-3-day-itinerary': { t: '3-Day Meghalaya Itinerary — Weekend Trip | XTSY', d: 'Perfect 3-day Meghalaya itinerary. Day-wise plan covering Shillong, Cherrapunji, and Dawki.', h: '3-Day Meghalaya Itinerary', s: 'Article' },
  'meghalaya-5-day-itinerary': { t: '5-Day Meghalaya Itinerary — Complete Trip | XTSY', d: 'Comprehensive 5-day Meghalaya itinerary. Shillong, Cherrapunji, Dawki, living root bridges, Mawlynnong.', h: '5-Day Meghalaya Itinerary', s: 'Article' },
  'meghalaya-photo-gallery': { t: 'Meghalaya Photo Gallery — Best Travel Photos | XTSY', d: 'Stunning Meghalaya photos: waterfalls, living root bridges, Dawki, caves, and mountain views.', h: 'Meghalaya Photo Gallery', s: 'ImageGallery' },
  'all-pages': { t: 'All Pages — XTSY Travel Site Directory', d: 'Complete site directory of XTSY Travel. Browse all pages: hostel, tours, guides, destinations, and more.', h: 'All Pages — Site Directory' },
  'hostels-in-shillong-today': { t: 'Hostels in Shillong Available Today — Book Now | XTSY', d: 'Find hostels available in Shillong today. Dorm beds from ₹269/night, private rooms from ₹2,099. Real-time availability.', h: 'Hostels in Shillong Available Today', s: 'Hostel' },
  'shillong-last-minute-stays': { t: 'Last Minute Stays in Shillong — Available Now | XTSY', d: 'Need a last-minute stay in Shillong? Rooms and dorms available right now from ₹269/night. Instant booking.', h: 'Last Minute Stays in Shillong', s: 'Hostel' },
  'meghalaya-trip-today': { t: 'Start Your Meghalaya Trip Today — Stays & Tours | XTSY', d: 'Planning a spontaneous Meghalaya trip? Stays from ₹269/night and tours ready to start today. Book instantly.', h: 'Start Your Meghalaya Trip Today', s: 'TouristTrip' },
  'hotels-in-shillong-available-now': { t: 'Hotels in Shillong Available Now — Instant Booking | XTSY', d: 'Hotels and rooms in Shillong available right now. Private rooms from ₹2,099. Real-time availability.', h: 'Hotels in Shillong Available Now', s: 'Hotel' },
  'shillong-stay-tonight': { t: 'Stay in Shillong Tonight — Rooms & Beds Available | XTSY', d: 'Need a place to stay in Shillong tonight? Beds from ₹269, rooms from ₹2,099. Instant booking confirmation.', h: 'Stay in Shillong Tonight', s: 'Hostel' },
};

// Destination pages from meghalayaDestinations
const DESTINATION_SLUGS_META: Record<string, SEOMapEntry> = {
  'places-to-visit/nohkalikai-falls-meghalaya': { t: 'Nohkalikai Falls — India\'s Tallest Waterfall Guide 2026', d: 'Visit Nohkalikai Falls, India\'s tallest plunge waterfall at 1,115 ft. Location, timings, how to reach from Shillong.', h: 'Nohkalikai Falls — India\'s Tallest Plunge Waterfall', i: 'Nohkalikai Falls in Cherrapunji, Meghalaya is India\'s tallest plunge waterfall at 1,115 feet (340 m). Located 7 km from Cherrapunji and 60 km from Shillong, the waterfall is best visited between September and November when monsoon flow peaks.', s: 'TouristAttraction' },
  'places-to-visit/krang-suri-falls-meghalaya': { t: 'Krang Suri Falls — Best Waterfall in Meghalaya | Guide', d: 'Krang Suri Falls travel guide. Crystal-clear turquoise waters, swimming, camping. How to reach from Shillong.', h: 'Krang Suri Falls — Meghalaya\'s Most Beautiful Waterfall', i: 'Krang Suri Falls in Jaintia Hills is famed for its crystal-clear turquoise plunge pool, perfect for swimming. Located 80 km from Shillong, the waterfall offers camping, cliff jumping and short treks.', s: 'TouristAttraction' },
  'places-to-visit/dawki-umngot-river': { t: 'Dawki Umngot River — Asia\'s Clearest River | Guide', d: 'Dawki Umngot River boating guide. Crystal-clear waters, boating, Indo-Bangladesh border views. How to reach from Shillong.', h: 'Dawki Umngot River — Asia\'s Clearest River', i: 'The Umngot River at Dawki is Asia\'s clearest river — boats appear to float on glass. Located on the India-Bangladesh border, 95 km south of Shillong, best visited November to March for peak water clarity.', s: 'TouristAttraction' },
  'places-to-visit/mawlynnong-village-meghalaya': { t: 'Mawlynnong — Asia\'s Cleanest Village Guide 2026', d: 'Visit Mawlynnong, Asia\'s cleanest village. Living root bridge, sky walk, bamboo trail. 2.5 hrs from Shillong.', h: 'Mawlynnong — Asia\'s Cleanest Village', s: 'TouristAttraction' },
  'places-to-visit/living-root-bridges-meghalaya': { t: 'Living Root Bridges Meghalaya — Trek Guide 2026', d: 'Complete guide to Meghalaya\'s living root bridges. Double-decker trek, Nongriat village, difficulty level, what to carry.', h: 'Living Root Bridges of Meghalaya', s: 'TouristAttraction' },
  'places-to-visit/laitlum-canyons-shillong': { t: 'Laitlum Canyons — Best Viewpoint Near Shillong | Guide', d: 'Laitlum Canyons guide. Panoramic valley views, trekking trails, sunrise spots. 25 km from Shillong city.', h: 'Laitlum Canyons — Viewpoint Near Shillong', s: 'TouristAttraction' },
  'places-to-visit/mawsmai-cave-meghalaya': { t: 'Mawsmai Cave Cherrapunji — Walkthrough Guide 2026', d: 'Mawsmai Cave in Cherrapunji: the easiest cave to explore in Meghalaya. Lit walkthrough, stalactites, 150m long.', h: 'Mawsmai Cave — Cherrapunji', s: 'TouristAttraction' },
  'places-to-visit/double-decker-living-root-bridge': { t: 'Double Decker Living Root Bridge — Trek Guide', d: 'Trek to the famous double-decker living root bridge at Nongriat. 3,500 steps, difficulty, what to carry.', h: 'Double Decker Living Root Bridge', s: 'TouristAttraction' },
  'places-to-visit/elephant-falls-shillong': { t: 'Elephant Falls Shillong — Nearest Waterfall Guide', d: 'Elephant Falls: Shillong\'s most accessible waterfall. Just 12 km from city center. 3-tier cascade, easy steps.', h: 'Elephant Falls — Shillong', s: 'TouristAttraction' },
  'places-to-visit/shillong-peak': { t: 'Shillong Peak — Highest Point & Viewpoint Guide', d: 'Shillong Peak at 1,965m. Panoramic views of the city, Air Force radar station, best time to visit.', h: 'Shillong Peak', s: 'TouristAttraction' },
  'places-to-visit/umiam-lake-shillong': { t: 'Umiam Lake Shillong — Boating & Activities Guide', d: 'Umiam Lake (Barapani): water sports, boating, kayaking. Beautiful reservoir 15 km from Shillong.', h: 'Umiam Lake — Shillong', s: 'TouristAttraction' },
};

export function generateSEOMap(): Record<string, SEOMapEntry> {
  const map: Record<string, SEOMapEntry> = {};

  // 1. Programmatic SEO pages — pull rich content (h1, intro, top FAQs)
  for (const page of ALL_SEO_PAGES) {
    const topFaqs: Array<[string, string]> = (page.faqs || [])
      .slice(0, 3)
      .map(f => [f.question, f.answer]);
    map[page.slug] = {
      t: page.title,
      d: page.metaDescription,
      h: page.h1,
      i: page.intro,
      f: topFaqs.length ? topFaqs : undefined,
      s: page.schemaType,
      c: page.category,
    };
  }

  // 2. Static routes
  for (const [slug, meta] of Object.entries(STATIC_ROUTE_META)) {
    if (!map[slug]) map[slug] = meta;
  }

  // 3. Destination pages
  for (const [path, meta] of Object.entries(DESTINATION_SLUGS_META)) {
    map[path] = meta;
  }

  return map;
}

/**
 * Generates the inline runtime script that:
 *  1. Replaces <title>, meta description, OG/Twitter, canonical per route
 *  2. Injects a visible (but visually-collapsed) <section id="ai-seo-content">
 *     containing H1, intro, FAQs and JSON-LD entity data — so AI crawlers
 *     (ChatGPT-User, PerplexityBot, GPTBot, ClaudeBot, Googlebot) reading the
 *     post-JS DOM see unique, descriptive content per URL instead of the
 *     duplicate homepage shell.
 *
 * The injected section is screen-reader visible but visually hidden so it
 * doesn't disrupt the SPA's UI. React hydration leaves it untouched (it
 * lives outside #root).
 */
export function generateInlineScript(): string {
  const map = generateSEOMap();

  return `<script>
(function(){
var m=${JSON.stringify(map)};
var r={'travel':'tours','privacy':'privacy-policy','terms':'terms-of-service'};
var p=location.pathname.replace(/^\\/|\\/$/g,'');
if(r[p]){var cn=document.querySelector('link[rel="canonical"]');if(cn)cn.setAttribute('href','https://xtsy.one/'+r[p]);return;}
var u='https://xtsy.one/'+(p||'');
var e=m[p];
if(e){
document.title=e.t;
function S(sel,attr,val){var n=document.querySelector(sel);if(n)n.setAttribute(attr,val);}
S('meta[name="description"]','content',e.d);
S('link[rel="canonical"]','href',u);
S('meta[property="og:title"]','content',e.t);
S('meta[property="og:description"]','content',e.d);
S('meta[property="og:url"]','content',u);
S('meta[name="twitter:title"]','content',e.t);
S('meta[name="twitter:description"]','content',e.d);
// Inject AI-readable descriptive content into DOM (outside #root, won't conflict with React hydration)
try{
var sec=document.createElement('section');
sec.id='ai-seo-content';
sec.setAttribute('aria-label','Page summary for search engines');
sec.style.cssText='position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden';
var html='<h1>'+e.h+'</h1><p>'+(e.i||e.d)+'</p>';
if(e.f&&e.f.length){html+='<h2>Frequently Asked Questions</h2><dl>';
for(var i=0;i<e.f.length;i++){html+='<dt>'+e.f[i][0]+'</dt><dd>'+e.f[i][1]+'</dd>';}
html+='</dl>';}
sec.innerHTML=html;
(document.body||document.documentElement).insertBefore(sec,(document.body||document.documentElement).firstChild);
// JSON-LD entity
var ld={'@context':'https://schema.org','@type':e.s||'WebPage',name:e.h||e.t,description:e.d,url:u};
var s1=document.createElement('script');s1.type='application/ld+json';s1.text=JSON.stringify(ld);document.head.appendChild(s1);
if(e.f&&e.f.length){
var faq={'@context':'https://schema.org','@type':'FAQPage',mainEntity:e.f.map(function(q){return{'@type':'Question',name:q[0],acceptedAnswer:{'@type':'Answer',text:q[1]}};})};
var s2=document.createElement('script');s2.type='application/ld+json';s2.text=JSON.stringify(faq);document.head.appendChild(s2);
}
}catch(_){}
}else{S('link[rel="canonical"]','href',u);}
var hl=document.querySelectorAll('link[hreflang]');
hl.forEach(function(l){l.setAttribute('href',u)});
})();
</script>`;
}

// CLI usage
if (process.argv[1]?.includes('generateSEOInlineScript')) {
  console.log(generateInlineScript());
}
