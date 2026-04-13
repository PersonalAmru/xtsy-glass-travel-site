/**
 * Generate an inline <script> block that sets page-specific
 * <title> and <meta description> BEFORE React loads.
 * 
 * This ensures Google's initial HTML crawl sees unique metadata
 * for each of the 300+ programmatic SEO pages AND destination pages,
 * even though Lovable hosting serves the same index.html for all routes.
 */

import { ALL_SEO_PAGES } from '../src/data/seoPages';

interface SEOMapEntry {
  t: string;  // title
  d: string;  // meta description
}

// Static routes that need unique metadata (not covered by programmatic SEO pages)
const STATIC_ROUTE_META: Record<string, SEOMapEntry> = {
  'about': { t: 'About XTSY — India\'s Biggest Hostel in Northeast', d: 'XTSY Travellers Hostel, Shillong. India\'s first 270° glass suite, NEITA 2025 nominated. 2.5 hrs from Guwahati airport. Learn our story.' },
  'gallery': { t: 'XTSY Photo Gallery — Hostel & Glass Suite Photos', d: 'See inside XTSY Shillong — 270° glass suite, dormitories, common areas, mountain views. Real photos from India\'s biggest hostel.' },
  'tours': { t: 'North East India Tour Packages 2026 | XTSY Travel', d: '30+ curated tours across Meghalaya, Nagaland, Assam, Arunachal Pradesh & Sikkim. Living root bridges, safaris, tribal festivals. From ₹7,999.' },
  // /travel redirects to /tours — no metadata here to avoid canonical conflict
  'xtsy-270': { t: '270° Glass Suite — India\'s First Stargazing Room | XTSY', d: 'India\'s first 270° panoramic glass suite in Shillong. Stargazing, mountain views, luxury glamping. Perfect for couples & anniversaries.' },
  'pet-friendly': { t: 'Pet-Friendly Hostel in Shillong | XTSY Travel', d: 'Travel with your pet to XTSY Shillong. Dog-friendly rooms, open spaces, mountain walks. Northeast India\'s pet-friendly hostel.' },
  'female-travellers': { t: 'Safe Stays for Women — Female Dorms | XTSY Shillong', d: 'Female-only dorms with 24/7 security, CCTV, personal lockers. India\'s safest hostel for solo women travellers in Shillong.' },
  'work-from-home': { t: 'Workation in Shillong — Co-Working Hostel | XTSY', d: 'Remote work from XTSY Shillong. High-speed WiFi, mountain views, co-working space. The digital nomad\'s dream workation.' },
  'xtsy-vs-zostel': { t: 'XTSY vs Zostel — Honest Hostel Comparison 2026', d: 'How does XTSY compare to Zostel, The Hosteller, goSTOPS? Independent review. Side-by-side comparison.' },
  'xtsy-rentals': { t: 'Bike & Car Rentals in Shillong | XTSY Rentals', d: 'Rent bikes, scooters & cars in Shillong. Royal Enfield, self-drive options. Explore Meghalaya at your own pace from ₹800/day.' },
  'tab-bistro': { t: 'TAB Bistro — Best Restaurant in Shillong | XTSY', d: 'Dine at TAB Bistro, Shillong. Multi-cuisine restaurant with Khasi specialties, continental dishes, and mountain views.' },
  'book': { t: 'Book Your Stay — XTSY Hostel Shillong | Best Rates', d: 'Book dorms from ₹450, private rooms from ₹2,500, 270° glass suite from ₹8,500. Best price guaranteed at XTSY Shillong.' },
  'privacy-policy': { t: 'Privacy Policy | XTSY Travel', d: 'How XTSY protects your personal data. GDPR and India DPDP compliant privacy policy.' },
  'terms-of-service': { t: 'Terms of Service | XTSY Travel', d: 'Terms and conditions for booking at XTSY Travellers Hostel Shillong.' },
  'pricing-cancellation-policy': { t: 'Pricing & Cancellation Policy | XTSY', d: 'XTSY booking pricing, cancellation, and refund policy. Transparent terms for hostel stays and tour packages.' },
  'faq': { t: 'FAQ — XTSY Travellers Hostel Shillong', d: 'Frequently asked questions about XTSY Hostel Shillong. Check-in times, pet policy, booking, tours, and more.' },
  'things-to-do-in-meghalaya': { t: 'Things to Do in Meghalaya 2026 — Complete Guide | XTSY', d: 'Top 50+ things to do in Meghalaya. Waterfalls, caves, living root bridges, villages, adventure activities. Plan your trip.' },
  'meghalaya-tour-packages': { t: 'Meghalaya Tour Packages 2026 | Starting ₹7,999 | XTSY', d: 'Explore 30+ Meghalaya tour packages. Living root bridges, Dawki, Cherrapunji, caves. Customizable itineraries from ₹7,999.' },
  'shillong-tour-package': { t: 'Shillong Tour Package 2026 | Weekend Getaway | XTSY', d: 'Shillong tour packages from ₹5,999. Laitlum Canyons, Elephant Falls, Police Bazaar. 2-5 day itineraries.' },
  'meghalaya-couple-tour-package': { t: 'Meghalaya Couple Tour Package 2026 | Romantic Getaway', d: 'Romantic Meghalaya tour for couples. 270° glass suite, scenic drives, private dining. Starting ₹19,999.' },
  'best-hostel-in-shillong': { t: 'Best Hostel in Shillong 2026 — XTSY Travellers Hostel', d: 'XTSY is rated the best hostel in Shillong. Dorms from ₹450, 270° glass suite, 4.8★ Google rating. Book direct.' },
  'hotels-in-shillong': { t: 'Hotels in Shillong — Best Stays 2026 | XTSY Guide', d: 'Compare top hotels in Shillong from budget to luxury. XTSY offers the best value with private rooms from ₹2,500.' },
  'homestays-in-shillong': { t: 'Homestays in Shillong 2026 | Local Experience | XTSY', d: 'Experience authentic Shillong homestays. Local families, home-cooked Khasi food, mountain views. From ₹1,500/night.' },
  'luxury-glamping-shillong': { t: 'Luxury Glamping in Shillong — 270° Glass Suite | XTSY', d: 'India\'s first 270° panoramic glass suite. Luxury glamping with mountain views in Shillong, Meghalaya.' },
  'destination-wedding-shillong': { t: 'Destination Wedding in Shillong | XTSY Events', d: 'Plan your dream destination wedding in Shillong, Meghalaya. Mountain venues, local cuisine, unique experiences.' },
  'restaurant-in-shillong': { t: 'Best Restaurant in Shillong — TAB Bistro | XTSY', d: 'TAB Bistro at XTSY Shillong. Multi-cuisine restaurant with Khasi specialties and mountain views.' },
  'best-time-to-visit-meghalaya': { t: 'Best Time to Visit Meghalaya — Month-by-Month Guide 2026', d: 'When to visit Meghalaya: monsoon waterfalls, winter clarity, spring festivals. Month-by-month weather and travel guide.' },
  'budget-trip-meghalaya': { t: 'Budget Trip to Meghalaya — Under ₹10,000 Guide | XTSY', d: 'Plan a budget Meghalaya trip under ₹10,000. Cheap stays, transport tips, free attractions. Complete money-saving guide.' },
  'hidden-places-meghalaya': { t: 'Hidden Places in Meghalaya — Secret Spots 2026 | XTSY', d: 'Discover Meghalaya\'s hidden gems. Off-the-beaten-path waterfalls, villages, viewpoints locals love.' },
  'meghalaya-3-day-itinerary': { t: '3-Day Meghalaya Itinerary — Weekend Trip | XTSY', d: 'Perfect 3-day Meghalaya itinerary. Day-wise plan covering Shillong, Cherrapunji, and Dawki.' },
  'meghalaya-5-day-itinerary': { t: '5-Day Meghalaya Itinerary — Complete Trip | XTSY', d: 'Comprehensive 5-day Meghalaya itinerary. Shillong, Cherrapunji, Dawki, living root bridges, Mawlynnong.' },
  'meghalaya-photo-gallery': { t: 'Meghalaya Photo Gallery — Best Travel Photos | XTSY', d: 'Stunning Meghalaya photos: waterfalls, living root bridges, Dawki, caves, and mountain views.' },
  'all-pages': { t: 'All Pages — XTSY Travel Site Directory', d: 'Complete site directory of XTSY Travel. Browse all pages: hostel, tours, guides, destinations, and more.' },
  // Last-minute high-intent pages
  'hostels-in-shillong-today': { t: 'Hostels in Shillong Available Today — Book Now | XTSY', d: 'Find hostels available in Shillong today. Dorm beds from ₹269/night, private rooms from ₹2,099. Real-time availability.' },
  'shillong-last-minute-stays': { t: 'Last Minute Stays in Shillong — Available Now | XTSY', d: 'Need a last-minute stay in Shillong? Rooms and dorms available right now from ₹269/night. Instant booking.' },
  'meghalaya-trip-today': { t: 'Start Your Meghalaya Trip Today — Stays & Tours | XTSY', d: 'Planning a spontaneous Meghalaya trip? Stays from ₹269/night and tours ready to start today. Book instantly.' },
  'hotels-in-shillong-available-now': { t: 'Hotels in Shillong Available Now — Instant Booking | XTSY', d: 'Hotels and rooms in Shillong available right now. Private rooms from ₹2,099. Real-time availability.' },
  'shillong-stay-tonight': { t: 'Stay in Shillong Tonight — Rooms & Beds Available | XTSY', d: 'Need a place to stay in Shillong tonight? Beds from ₹269, rooms from ₹2,099. Instant booking confirmation.' },
};

// Destination pages from meghalayaDestinations — need to import slugs
// These are rendered at /places-to-visit/:slug
const DESTINATION_SLUGS_META: Record<string, SEOMapEntry> = {
  'places-to-visit/nohkalikai-falls-meghalaya': { t: 'Nohkalikai Falls — India\'s Tallest Waterfall Guide 2026', d: 'Visit Nohkalikai Falls, India\'s tallest plunge waterfall at 1,115 ft. Location, timings, how to reach from Shillong.' },
  'places-to-visit/krang-suri-falls-meghalaya': { t: 'Krang Suri Falls — Best Waterfall in Meghalaya | Guide', d: 'Krang Suri Falls travel guide. Crystal-clear turquoise waters, swimming, camping. How to reach from Shillong.' },
  'places-to-visit/dawki-umngot-river': { t: 'Dawki Umngot River — Asia\'s Clearest River | Guide', d: 'Dawki Umngot River boating guide. Crystal-clear waters, boating, Indo-Bangladesh border views. How to reach from Shillong.' },
  'places-to-visit/mawlynnong-village-meghalaya': { t: 'Mawlynnong — Asia\'s Cleanest Village Guide 2026', d: 'Visit Mawlynnong, Asia\'s cleanest village. Living root bridge, sky walk, bamboo trail. 2.5 hrs from Shillong.' },
  'places-to-visit/living-root-bridges-meghalaya': { t: 'Living Root Bridges Meghalaya — Trek Guide 2026', d: 'Complete guide to Meghalaya\'s living root bridges. Double-decker trek, Nongriat village, difficulty level, what to carry.' },
  'places-to-visit/laitlum-canyons-shillong': { t: 'Laitlum Canyons — Best Viewpoint Near Shillong | Guide', d: 'Laitlum Canyons guide. Panoramic valley views, trekking trails, sunrise spots. 25 km from Shillong city.' },
  'places-to-visit/mawsmai-cave-meghalaya': { t: 'Mawsmai Cave Cherrapunji — Walkthrough Guide 2026', d: 'Mawsmai Cave in Cherrapunji: the easiest cave to explore in Meghalaya. Lit walkthrough, stalactites, 150m long.' },
  'places-to-visit/double-decker-living-root-bridge': { t: 'Double Decker Living Root Bridge — Trek Guide', d: 'Trek to the famous double-decker living root bridge at Nongriat. 3,500 steps, difficulty, what to carry.' },
  'places-to-visit/elephant-falls-shillong': { t: 'Elephant Falls Shillong — Nearest Waterfall Guide', d: 'Elephant Falls: Shillong\'s most accessible waterfall. Just 12 km from city center. 3-tier cascade, easy steps.' },
  'places-to-visit/shillong-peak': { t: 'Shillong Peak — Highest Point & Viewpoint Guide', d: 'Shillong Peak at 1,965m. Panoramic views of the city, Air Force radar station, best time to visit.' },
  'places-to-visit/umiam-lake-shillong': { t: 'Umiam Lake Shillong — Boating & Activities Guide', d: 'Umiam Lake (Barapani): water sports, boating, kayaking. Beautiful reservoir 15 km from Shillong.' },
};

export function generateSEOMap(): Record<string, SEOMapEntry> {
  const map: Record<string, SEOMapEntry> = {};
  
  // 1. Add all programmatic SEO pages (300+)
  for (const page of ALL_SEO_PAGES) {
    map[page.slug] = { t: page.title, d: page.metaDescription };
  }
  
  // 2. Add static route metadata
  for (const [slug, meta] of Object.entries(STATIC_ROUTE_META)) {
    if (!map[slug]) {
      map[slug] = meta;
    }
  }
  
  // 3. Add destination detail pages (/places-to-visit/:slug)
  for (const [path, meta] of Object.entries(DESTINATION_SLUGS_META)) {
    map[path] = meta;
  }
  
  return map;
}

export function generateInlineScript(): string {
  const map = generateSEOMap();
  
  // Minified inline script that runs synchronously before React
  return `<script>
(function(){
var m=${JSON.stringify(map)};
var p=location.pathname.replace(/^\\/|\\/$$/g,'');
if(m[p]){
document.title=m[p].t;
var d=document.querySelector('meta[name="description"]');
if(d)d.setAttribute('content',m[p].d);
var u='https://xtsy.one/'+(p||'');
var c=document.querySelector('link[rel="canonical"]');
if(c)c.setAttribute('href',u);
var ot=document.querySelector('meta[property="og:title"]');
if(ot)ot.setAttribute('content',m[p].t);
var od=document.querySelector('meta[property="og:description"]');
if(od)od.setAttribute('content',m[p].d);
var ou=document.querySelector('meta[property="og:url"]');
if(ou)ou.setAttribute('content',u);
var tt=document.querySelector('meta[name="twitter:title"]');
if(tt)tt.setAttribute('content',m[p].t);
var td=document.querySelector('meta[name="twitter:description"]');
if(td)td.setAttribute('content',m[p].d);
}
var hp='https://xtsy.one/'+p;
var hl=document.querySelectorAll('link[hreflang]');
hl.forEach(function(l){l.setAttribute('href',hp)});
if(!p){hp='https://xtsy.one/';}
var cn=document.querySelector('link[rel="canonical"]');
if(cn&&!m[p])cn.setAttribute('href',hp);
})();
</script>`;
}

// CLI usage
if (process.argv[1]?.includes('generateSEOInlineScript')) {
  console.log(generateInlineScript());
}
