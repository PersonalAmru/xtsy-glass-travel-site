/**
 * SEO Runtime Bridge — Performance-tuned for LCP/TTI.
 *
 * Architecture:
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │  HEAD (synchronous, ~6-12 KB, runs <2 ms before paint)      │
 *   │  - generateInlineHeadScript()                               │
 *   │  - Sets <title>, meta description, canonical, OG, Twitter   │
 *   │  - Handles legacy-slug redirects (history.replaceState)     │
 *   │  - Uses a SLIM map (title + desc + redirect target only)    │
 *   └─────────────────────────────────────────────────────────────┘
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │  BODY tail (deferred, runs after LCP via requestIdleCallback)│
 *   │  - generateInlineBodyScript()                               │
 *   │  - Injects hidden <section id="ai-seo-content"> with H1,    │
 *   │    intro, FAQs                                              │
 *   │  - Appends JSON-LD entity + FAQPage schemas                 │
 *   │  - Loads RICH map lazily via fetch('/seo-content.json')     │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Googlebot) wait for
 * network-idle before sampling the DOM, so the deferred body content is
 * still picked up. Real users get unblocked LCP because only ~8 KB of
 * head-critical JSON is parsed synchronously.
 */

import { ALL_SEO_PAGES } from '../src/data/seoPages';
import { RECOVERY_REDIRECTS } from '../src/data/seoAffectedSlugs';

interface SlimEntry {
  t: string; // title
  d: string; // meta description
}

interface RichEntry extends SlimEntry {
  h?: string;                       // h1
  i?: string;                       // intro paragraph
  f?: Array<[string, string]>;      // top 3 FAQs
  s?: string;                       // schema @type
  c?: string;                       // category label
}

// ---------------------------------------------------------------------------
// Static route metadata (overrides only — programmatic pages auto-import)
// ---------------------------------------------------------------------------
const STATIC_ROUTE_META: Record<string, RichEntry> = {
  'about': { t: 'About XTSY — India\'s Biggest Hostel in Northeast', d: 'XTSY Travellers Hostel, Shillong. India\'s first 270° glass suite, NEITA 2025 nominated. 2.5 hrs from Guwahati airport.', h: 'About XTSY Travellers Hostel', i: 'XTSY Travellers Hostel is the biggest hostel in Northeast India, located in Shillong, Meghalaya. Home to India\'s first 270° panoramic glass suite, hosting 320+ guests annually with a 4.8-star rating.', s: 'AboutPage' },
  'gallery': { t: 'XTSY Photo Gallery — Hostel & Glass Suite Photos', d: 'See inside XTSY Shillong — 270° glass suite, dormitories, common areas, mountain views.', h: 'XTSY Photo Gallery', i: 'Authentic photos of XTSY Travellers Hostel: the 270° glass suite, mixed and female dormitories, common lounge, TAB Bistro, and Meghalaya mountain views.', s: 'ImageGallery' },
  'tours': { t: 'North East India Tour Packages 2026 | XTSY Travel', d: '30+ curated tours across Meghalaya, Nagaland, Assam, Arunachal Pradesh & Sikkim. From ₹7,999.', h: 'North East India Tour Packages', i: 'Explore 30+ curated tour packages: Meghalaya living root bridges, Kaziranga safaris, Hornbill Festival, Tawang, and Gangtok. Packages start at ₹7,999.', s: 'TouristTrip' },
  'xtsy-270': { t: '270° Glass Suite — India\'s First Stargazing Room | XTSY', d: 'India\'s first 270° panoramic glass suite in Shillong. Stargazing, mountain views, luxury glamping.', h: 'XTSY 270° Glass Suite', i: 'India\'s first floor-to-ceiling 270° panoramic glass room. Located in Shillong, offers unobstructed mountain views and in-room stargazing.', s: 'LodgingBusiness' },
  'pet-friendly': { t: 'Pet-Friendly Hostel in Shillong | XTSY Travel', d: 'Travel with your pet to XTSY Shillong. Dog-friendly rooms, open spaces, mountain walks.', h: 'Pet-Friendly Hostel in Shillong', s: 'Hostel' },
  'female-travellers': { t: 'Safe Stays for Women — Female Dorms | XTSY Shillong', d: 'Female-only dorms with 24/7 security, CCTV, lockers. Safest hostel for solo women in Shillong.', h: 'Safe Stays for Female Travellers', s: 'Hostel' },
  'work-from-home': { t: 'Workation in Shillong — Co-Working Hostel | XTSY', d: 'Remote work from XTSY Shillong. High-speed WiFi, mountain views, co-working space.', h: 'Workation Hostel in Shillong', s: 'Hostel' },
  'xtsy-vs-zostel': { t: 'XTSY vs Zostel — Honest Hostel Comparison 2026', d: 'How does XTSY compare to Zostel, The Hosteller, goSTOPS? Independent side-by-side review.', h: 'XTSY vs Zostel — 2026 Comparison', s: 'Article' },
  'xtsy-rentals': { t: 'Bike & Car Rentals in Shillong | XTSY Rentals', d: 'Rent bikes, scooters & cars in Shillong. Royal Enfield, self-drive options. From ₹800/day.', h: 'Bike & Car Rentals in Shillong', s: 'AutoRental' },
  'tab-bistro': { t: 'TAB Bistro — Best Restaurant in Shillong | XTSY', d: 'Multi-cuisine restaurant with Khasi specialties, continental dishes, mountain views.', h: 'TAB Bistro Restaurant', s: 'Restaurant' },
  'book': { t: 'Book Your Stay — XTSY Hostel Shillong | Best Rates', d: 'Dorms from ₹450, private rooms from ₹2,500, 270° glass suite from ₹8,500. Best price guaranteed.', h: 'Book Your Stay at XTSY Shillong' },
  'privacy-policy': { t: 'Privacy Policy | XTSY Travel', d: 'How XTSY protects your personal data. GDPR and India DPDP compliant privacy policy.', h: 'Privacy Policy' },
  'terms-of-service': { t: 'Terms of Service | XTSY Travel', d: 'Terms and conditions for booking at XTSY Travellers Hostel Shillong.', h: 'Terms of Service' },
  'pricing-cancellation-policy': { t: 'Pricing & Cancellation Policy | XTSY', d: 'XTSY booking, cancellation, and refund policy. Transparent terms for stays and tours.', h: 'Pricing & Cancellation Policy' },
  'faq': { t: 'FAQ — XTSY Travellers Hostel Shillong', d: 'Check-in times, pet policy, booking, tours and more.', h: 'Frequently Asked Questions', s: 'FAQPage' },
  'things-to-do-in-meghalaya': { t: 'Things to Do in Meghalaya 2026 — Complete Guide | XTSY', d: 'Top 50+ things to do in Meghalaya. Waterfalls, caves, living root bridges, villages.', h: 'Things to Do in Meghalaya', i: '50+ activities in Meghalaya: trek to the double-decker living root bridge in Nongriat, boat on Asia\'s clearest river at Dawki, explore Mawsmai cave, visit Mawlynnong, witness Nohkalikai falls.', s: 'TouristAttraction' },
  'meghalaya-tour-packages': { t: 'Meghalaya Tour Packages 2026 | Starting ₹7,999 | XTSY', d: 'Explore 30+ Meghalaya tour packages. Living root bridges, Dawki, Cherrapunji. From ₹7,999.', h: 'Meghalaya Tour Packages 2026', i: '30+ curated Meghalaya packages covering Shillong, Cherrapunji, Dawki, Mawlynnong, root bridges and caves. Customizable 3-7 day itineraries from ₹7,999.', s: 'TouristTrip' },
  'shillong-tour-package': { t: 'Shillong Tour Package 2026 | Weekend Getaway | XTSY', d: 'Shillong packages from ₹5,999. Laitlum Canyons, Elephant Falls, Police Bazaar.', h: 'Shillong Tour Package 2026', s: 'TouristTrip' },
  'meghalaya-couple-tour-package': { t: 'Meghalaya Couple Tour Package 2026 | Romantic Getaway', d: 'Romantic tour for couples. 270° glass suite, scenic drives, private dining. From ₹19,999.', h: 'Meghalaya Couple Tour Package', s: 'TouristTrip' },
  'best-hostel-in-shillong': { t: 'Best Hostel in Shillong 2026 — XTSY Travellers Hostel', d: 'XTSY is the best hostel in Shillong. Dorms from ₹450, 270° glass suite, 4.8★ rating.', h: 'Best Hostel in Shillong', i: 'XTSY Travellers Hostel is Shillong\'s highest-rated hostel — 4.8 stars from 320+ reviews. Located on Mawdiangdiang Road, 2.5 hours from Guwahati airport. Dorms from ₹329, private rooms from ₹2,500, 270° glass suite from ₹8,500.', s: 'Hostel' },
  'hotels-in-shillong': { t: 'Hotels in Shillong — Best Stays 2026 | XTSY Guide', d: 'Compare top hotels in Shillong from budget to luxury. XTSY offers private rooms from ₹2,500.', h: 'Hotels in Shillong', s: 'Hotel' },
  'homestays-in-shillong': { t: 'Homestays in Shillong 2026 | Local Experience | XTSY', d: 'Authentic Shillong homestays. Local families, home-cooked Khasi food. From ₹1,500/night.', h: 'Homestays in Shillong', s: 'LodgingBusiness' },
  'luxury-glamping-shillong': { t: 'Luxury Glamping in Shillong — 270° Glass Suite | XTSY', d: 'India\'s first 270° panoramic glass suite. Luxury glamping with mountain views.', h: 'Luxury Glamping in Shillong', s: 'LodgingBusiness' },
  'destination-wedding-shillong': { t: 'Destination Wedding in Shillong | XTSY Events', d: 'Plan your dream wedding in Shillong. Mountain venues, local cuisine, unique experiences.', h: 'Destination Wedding in Shillong', s: 'EventVenue' },
  'restaurant-in-shillong': { t: 'Best Restaurant in Shillong — TAB Bistro | XTSY', d: 'TAB Bistro at XTSY Shillong. Multi-cuisine restaurant with Khasi specialties.', h: 'Best Restaurant in Shillong', s: 'Restaurant' },
  'best-time-to-visit-meghalaya': { t: 'Best Time to Visit Meghalaya — Month-by-Month Guide 2026', d: 'When to visit: monsoon waterfalls, winter clarity, spring festivals. Month-by-month guide.', h: 'Best Time to Visit Meghalaya', s: 'Article' },
  'budget-trip-meghalaya': { t: 'Budget Trip to Meghalaya — Under ₹10,000 Guide | XTSY', d: 'Plan a budget Meghalaya trip under ₹10,000. Cheap stays, transport tips, free attractions.', h: 'Budget Trip to Meghalaya', s: 'Article' },
  'hidden-places-meghalaya': { t: 'Hidden Places in Meghalaya — Secret Spots 2026 | XTSY', d: 'Off-the-beaten-path waterfalls, villages, viewpoints locals love.', h: 'Hidden Places in Meghalaya', s: 'TouristAttraction' },
  'meghalaya-3-day-itinerary': { t: '3-Day Meghalaya Itinerary — Weekend Trip | XTSY', d: 'Day-wise plan covering Shillong, Cherrapunji, and Dawki.', h: '3-Day Meghalaya Itinerary', s: 'Article' },
  'meghalaya-5-day-itinerary': { t: '5-Day Meghalaya Itinerary — Complete Trip | XTSY', d: 'Shillong, Cherrapunji, Dawki, root bridges, Mawlynnong.', h: '5-Day Meghalaya Itinerary', s: 'Article' },
  'meghalaya-photo-gallery': { t: 'Meghalaya Photo Gallery — Best Travel Photos | XTSY', d: 'Stunning Meghalaya photos: waterfalls, root bridges, Dawki, caves.', h: 'Meghalaya Photo Gallery', s: 'ImageGallery' },
  'all-pages': { t: 'All Pages — XTSY Travel Site Directory', d: 'Complete site directory of XTSY Travel. All pages: hostel, tours, guides, destinations.', h: 'Site Directory' },
  'hostels-in-shillong-today': { t: 'Hostels in Shillong Available Today — Book Now | XTSY', d: 'Hostels available today. Dorms from ₹269, private rooms from ₹2,099. Real-time availability.', h: 'Hostels in Shillong Available Today', s: 'Hostel' },
  'shillong-last-minute-stays': { t: 'Last Minute Stays in Shillong — Available Now | XTSY', d: 'Last-minute Shillong rooms and dorms from ₹269/night. Instant booking.', h: 'Last Minute Stays in Shillong', s: 'Hostel' },
  'meghalaya-trip-today': { t: 'Start Your Meghalaya Trip Today — Stays & Tours | XTSY', d: 'Spontaneous Meghalaya trip? Stays from ₹269 and tours ready today.', h: 'Start Your Meghalaya Trip Today', s: 'TouristTrip' },
  'hotels-in-shillong-available-now': { t: 'Hotels in Shillong Available Now — Instant Booking | XTSY', d: 'Hotels available right now in Shillong. Private rooms from ₹2,099.', h: 'Hotels in Shillong Available Now', s: 'Hotel' },
  'shillong-stay-tonight': { t: 'Stay in Shillong Tonight — Rooms & Beds Available | XTSY', d: 'Beds from ₹269, rooms from ₹2,099. Instant booking confirmation.', h: 'Stay in Shillong Tonight', s: 'Hostel' },
};

const DESTINATION_SLUGS_META: Record<string, RichEntry> = {
  'places-to-visit/nohkalikai-falls-meghalaya': { t: 'Nohkalikai Falls — India\'s Tallest Waterfall Guide 2026', d: 'India\'s tallest plunge waterfall at 1,115 ft. Location, timings, how to reach from Shillong.', h: 'Nohkalikai Falls', i: 'Nohkalikai Falls in Cherrapunji is India\'s tallest plunge waterfall at 1,115 feet. Located 7 km from Cherrapunji, 60 km from Shillong. Best visited Sept-Nov.', s: 'TouristAttraction' },
  'places-to-visit/krang-suri-falls-meghalaya': { t: 'Krang Suri Falls — Best Waterfall in Meghalaya | Guide', d: 'Crystal-clear turquoise waters, swimming, camping. How to reach from Shillong.', h: 'Krang Suri Falls', i: 'Krang Suri Falls in Jaintia Hills is famed for its crystal-clear turquoise plunge pool. Located 80 km from Shillong, offers swimming, cliff jumping and camping.', s: 'TouristAttraction' },
  'places-to-visit/dawki-umngot-river': { t: 'Dawki Umngot River — Asia\'s Clearest River | Guide', d: 'Crystal-clear waters, boating, India-Bangladesh border views. From Shillong.', h: 'Dawki Umngot River', i: 'The Umngot River at Dawki is Asia\'s clearest river — boats appear to float on glass. On the India-Bangladesh border, 95 km south of Shillong. Best Nov-March.', s: 'TouristAttraction' },
  'places-to-visit/mawlynnong-village-meghalaya': { t: 'Mawlynnong — Asia\'s Cleanest Village Guide 2026', d: 'Living root bridge, sky walk, bamboo trail. 2.5 hrs from Shillong.', h: 'Mawlynnong', s: 'TouristAttraction' },
  'places-to-visit/living-root-bridges-meghalaya': { t: 'Living Root Bridges Meghalaya — Trek Guide 2026', d: 'Double-decker trek, Nongriat village, difficulty level, what to carry.', h: 'Living Root Bridges of Meghalaya', s: 'TouristAttraction' },
  'places-to-visit/laitlum-canyons-shillong': { t: 'Laitlum Canyons — Best Viewpoint Near Shillong | Guide', d: 'Panoramic valley views, trekking, sunrise spots. 25 km from Shillong.', h: 'Laitlum Canyons', s: 'TouristAttraction' },
  'places-to-visit/mawsmai-cave-meghalaya': { t: 'Mawsmai Cave Cherrapunji — Walkthrough Guide 2026', d: 'Easiest cave to explore in Meghalaya. Lit walkthrough, 150m long.', h: 'Mawsmai Cave', s: 'TouristAttraction' },
  'places-to-visit/double-decker-living-root-bridge': { t: 'Double Decker Living Root Bridge — Trek Guide', d: '3,500 steps to Nongriat. Difficulty, what to carry.', h: 'Double Decker Living Root Bridge', s: 'TouristAttraction' },
  'places-to-visit/elephant-falls-shillong': { t: 'Elephant Falls Shillong — Nearest Waterfall Guide', d: 'Shillong\'s most accessible waterfall. 12 km from city. 3-tier cascade.', h: 'Elephant Falls', s: 'TouristAttraction' },
  'places-to-visit/shillong-peak': { t: 'Shillong Peak — Highest Point & Viewpoint Guide', d: 'Shillong Peak at 1,965m. Panoramic views, best time to visit.', h: 'Shillong Peak', s: 'TouristAttraction' },
  'places-to-visit/umiam-lake-shillong': { t: 'Umiam Lake Shillong — Boating & Activities Guide', d: 'Boating, kayaking. Beautiful reservoir 15 km from Shillong.', h: 'Umiam Lake', s: 'TouristAttraction' },
};

/** Build the rich, full-content map (used by deferred body script + manifest). */
export function generateSEOMap(): Record<string, RichEntry> {
  const map: Record<string, RichEntry> = {};
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
  for (const [slug, meta] of Object.entries(STATIC_ROUTE_META)) {
    if (!map[slug]) map[slug] = meta;
  }
  for (const [path, meta] of Object.entries(DESTINATION_SLUGS_META)) {
    map[path] = meta;
  }
  return map;
}

/** Build the slim head map (title + description only). Tiny, parses fast. */
export function generateSlimMap(): Record<string, SlimEntry> {
  const slim: Record<string, SlimEntry> = {};
  const rich = generateSEOMap();
  for (const [k, v] of Object.entries(rich)) {
    slim[k] = { t: v.t, d: v.d };
  }
  return slim;
}

/** Build the legacy-slug → canonical-path map for client-side redirect handling. */
export function generateRedirectMap(): Record<string, string> {
  // Normalize: store canonical path WITHOUT leading slash for compact key match.
  const out: Record<string, string> = {};
  for (const [from, to] of Object.entries(RECOVERY_REDIRECTS)) {
    const target = to.startsWith('/') ? to.slice(1) : to;
    out[from] = target;
  }
  return out;
}

// ---------------------------------------------------------------------------
// HEAD SCRIPT (synchronous, ~8-12 KB) — runs before paint, must stay tiny.
// Responsibilities:
//   1. Resolve legacy slugs → rewrite URL via history.replaceState
//   2. Set <title>, meta description, canonical, OG/Twitter
// Does NOT touch body or inject JSON-LD (deferred).
// ---------------------------------------------------------------------------
export function generateInlineHeadScript(): string {
  const slim = generateSlimMap();
  const redirects = generateRedirectMap();
  return `<script>
(function(){
var M=${JSON.stringify(slim)};
var R=${JSON.stringify(redirects)};
var p=location.pathname.replace(/^\\/|\\/$/g,'');
// Legacy slug? Rewrite the URL silently and continue with the canonical slug.
if(R[p]){
  var newP='/'+R[p];
  try{history.replaceState(null,'',newP+location.search+location.hash);}catch(_){}
  p=R[p];
}
// Built-in route aliases (kept inline for backward compat)
var A={'travel':'tours','privacy':'privacy-policy','terms':'terms-of-service'};
if(A[p]){
  try{history.replaceState(null,'','/'+A[p]+location.search+location.hash);}catch(_){}
  p=A[p];
}
var u='https://xtsy.one/'+p;
var e=M[p];
function S(sel,attr,val){var n=document.querySelector(sel);if(n)n.setAttribute(attr,val);}
if(e){
  document.title=e.t;
  S('meta[name="description"]','content',e.d);
  S('link[rel="canonical"]','href',u);
  S('meta[property="og:title"]','content',e.t);
  S('meta[property="og:description"]','content',e.d);
  S('meta[property="og:url"]','content',u);
  S('meta[name="twitter:title"]','content',e.t);
  S('meta[name="twitter:description"]','content',e.d);
}else{
  S('link[rel="canonical"]','href',u);
}
// Stash the resolved slug for the deferred body script
window.__xtsySlug=p;
})();
</script>`;
}

// ---------------------------------------------------------------------------
// BODY SCRIPT (deferred via requestIdleCallback) — runs AFTER LCP.
// Responsibilities:
//   1. Fetch /seo-content.json (the rich map) lazily — cached after first load
//   2. Inject hidden <section id="ai-seo-content"> with H1, intro, FAQs
//   3. Append JSON-LD entity + FAQPage to <head>
// Crawlers (GPTBot, PerplexityBot, ClaudeBot, Googlebot) wait for network
// idle, so they reliably see this content. Real users get unblocked LCP.
// ---------------------------------------------------------------------------
export function generateInlineBodyScript(versionHash?: string): string {
  // Append a content-hash query string so the manifest is cached forever
  // (immutable) at the CDN/browser, but invalidated on every deploy where
  // the SEO map changes. Falls back to no-version in dev.
  const v = versionHash ? `?v=${versionHash}` : '';
  return `<script>
(function(){
var V=${JSON.stringify(v)};
var LCP_DEADLINE=2500; // ms — must inject before this for SEO/LCP target
var injectedAt=null;
window.__xtsySEOInjected=false;
window.__xtsySEOInjectStart=performance.now();
var run=function(){
  var p=window.__xtsySlug||location.pathname.replace(/^\\/|\\/$/g,'');
  if(!p||document.getElementById('ai-seo-content'))return;
  fetch('/seo-content.json'+V,{credentials:'omit',cache:'force-cache'}).then(function(r){return r.ok?r.json():null;}).then(function(M){
    if(!M)return;
    var e=M[p];if(!e)return;
    var u='https://xtsy.one/'+p;
    try{
      var sec=document.createElement('section');
      sec.id='ai-seo-content';
      sec.setAttribute('aria-label','Page summary for search engines');
      sec.style.cssText='position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden';
      var html='<h1>'+e.h+'</h1><p>'+(e.i||e.d)+'</p>';
      if(e.f&&e.f.length){html+='<h2>Frequently Asked Questions</h2><dl>';
        for(var i=0;i<e.f.length;i++){html+='<dt>'+e.f[i][0]+'</dt><dd>'+e.f[i][1]+'</dd>';}
        html+='</dl>';
      }
      sec.innerHTML=html;
      (document.body||document.documentElement).insertBefore(sec,(document.body||document.documentElement).firstChild);
      var ld={'@context':'https://schema.org','@type':e.s||'WebPage',name:e.h||e.t,description:e.d,url:u};
      var s1=document.createElement('script');s1.type='application/ld+json';s1.text=JSON.stringify(ld);document.head.appendChild(s1);
      if(e.f&&e.f.length){
        var faq={'@context':'https://schema.org','@type':'FAQPage',mainEntity:e.f.map(function(q){return{'@type':'Question',name:q[0],acceptedAnswer:{'@type':'Answer',text:q[1]}};})};
        var s2=document.createElement('script');s2.type='application/ld+json';s2.text=JSON.stringify(faq);document.head.appendChild(s2);
      }
      window.__xtsySEOInjected=true;
      injectedAt=performance.now();
      var elapsed=injectedAt-window.__xtsySEOInjectStart;
      // Runtime LCP guard — log a beacon if injection missed the deadline so
      // useWebVitalsReporter / admin analytics can flag slow SEO hydration.
      if(elapsed>LCP_DEADLINE){
        try{(window.dataLayer=window.dataLayer||[]).push({event:'seo_inject_slow',slug:p,elapsed_ms:Math.round(elapsed),deadline_ms:LCP_DEADLINE});}catch(_){}
      }
      try{window.dispatchEvent(new CustomEvent('xtsy:seo-injected',{detail:{slug:p,elapsed:elapsed}}));}catch(_){}
    }catch(_){}
  }).catch(function(){});
};
// Crawlers (Googlebot, GPTBot, PerplexityBot, ClaudeBot, Bingbot) — run synchronously
// so they sample populated DOM. Real users — defer until idle (after LCP).
var ua=navigator.userAgent||'';
var isBot=/Googlebot|bingbot|GPTBot|ChatGPT-User|PerplexityBot|ClaudeBot|Applebot|YandexBot|DuckDuckBot|facebookexternalhit|Twitterbot|LinkedInBot/i.test(ua);
if(isBot){run();}
else if('requestIdleCallback' in window){requestIdleCallback(run,{timeout:1500});}
else{setTimeout(run,800);}
// Hard fallback — guarantee injection before LCP_DEADLINE for non-bots too.
setTimeout(function(){if(!window.__xtsySEOInjected)run();},LCP_DEADLINE-300);
})();
</script>`;
}

// ---------------------------------------------------------------------------
// Backward compat: original entrypoint used by vite.config.ts
// ---------------------------------------------------------------------------
export function generateInlineScript(): string {
  return generateInlineHeadScript();
}

// Compute a stable short content hash for the SEO map (used for cache-busting).
import crypto from 'crypto';
export function computeSEOMapHash(): string {
  const json = JSON.stringify(generateSEOMap());
  return crypto.createHash('sha256').update(json).digest('hex').slice(0, 10);
}

// CLI usage: prints HEAD + BODY scripts and the rich map JSON for inspection
if (process.argv[1]?.includes('generateSEOInlineScript')) {
  const arg = process.argv[2];
  if (arg === '--map') {
    process.stdout.write(JSON.stringify(generateSEOMap()));
  } else if (arg === '--hash') {
    process.stdout.write(computeSEOMapHash());
  } else if (arg === '--body') {
    const hash = process.argv[3] || computeSEOMapHash();
    process.stdout.write(generateInlineBodyScript(hash));
  } else {
    process.stdout.write(generateInlineHeadScript());
  }
}
