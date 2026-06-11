# XTSY.one — Full SEO, Indexing, Sitemap & Topical Authority Audit
**Date:** 11 Jun 2026 · **Domain:** https://www.xtsy.one · **Market DB:** `in` (India)
**Auditor framing:** Booking.com / Hostelworld / Airbnb / MakeMyTrip growth-team standards.

> All numbers below are pulled from the live site (sitemaps, robots.txt), the in-repo SEO page
> registry (`src/data/seoPages.ts` + factories), and **Semrush live organic data** — not generic advice.

---

## EXECUTIVE SUMMARY — THE ONE THING THAT MATTERS

The site has **1,636 registered programmatic pages** (robots.txt advertises 1,674 indexable URLs),
yet Semrush shows **only 109 ranking keywords and ~281 organic visits/month**, and **every single
ranking page is informational** (waterfalls, viewpoints, "best time to visit"). **Zero commercial,
booking, restaurant, catering, or tour keywords rank.**

This is the classic **doorway-page over-expansion trap**: a low-authority domain (AS is effectively
new — 109 keywords) cannot earn crawl budget or rank for 1,600+ near-duplicate pages. The bloat is
*actively suppressing* the handful of genuinely strong pages.

**Strategic verdict:** Stop expanding. **Cut ~60% of programmatic pages**, consolidate
cannibalizing clusters, and pour authority into the ~40 pages that already rank on pages 2–4 and
into the **commercial money pages** (hostel, TAB Bistro, catering, tours) that currently rank for
nothing. Growth comes from consolidation + internal linking, not more pages.

---

## PHASE 1 — SITEMAP INVENTORY REPORT

### Live sitemap structure (`/sitemap_index.xml`)
| Child sitemap | URLs (local file) | Notes |
|---|---|---|
| sitemap-static.xml | 38 | Core static routes — healthy |
| sitemap-destinations.xml | 25 | Destination/attraction pages — **strongest assets** |
| sitemap-guides.xml | 273 | Tourism guides + itineraries |
| sitemap-tours.xml | 28 | Tour packages |
| sitemap-hostel.xml | 145 | Accommodation cluster |
| sitemap-dining.xml | 113 | Restaurant/catering (recently expanded) |
| sitemap-misc.xml | **1,049** | **Thin programmatic dumping ground — the core problem** |

### Orphan / inconsistent sitemaps (not in live index but present in repo)
- `public/sitemap-images.xml` (3 URLs), `public/sitemap-priority.xml` (24), `public/sitemap-programmatic.xml` (1,265) — **referenced inconsistently**. The live `sitemap_index.xml` omits `sitemap-images.xml`, while `public/sitemap.xml` includes it. **Fix: one canonical index, no orphans.**

### Categorization of all URLs (from registry, 1,636 pages)
| # | Category bucket | Count | Tier verdict |
|---|---|---|---|
| 1 | Commercial booking (hostels) | 56 | Tier 1–2 (consolidate) |
| 2 | Tour packages (tours) | 21 | Tier 1 |
| 3 | Tourism guides (travel-guides + itineraries + seasonal) | 273 | Mixed T2/T3 |
| 4 | Accommodation (homestays/glamping/accommodation/hotels) | 84 | Tier 1–2 |
| 5 | Restaurant (restaurants) | 116 | T1 money pages + T3 thin |
| 6 | Rental (rentals) | 8 | Tier 2 |
| 7 | Glamping | 28 | Tier 2 |
| 8 | Administrative (/admin, /franchise) | excluded via robots | Correct (noindex) |
| 9 | Dynamic SEO (themed-trips 380, group-tours 200, corporate 181, road-bike-trips 160, workation 120) | **1,041** | **Tier 3/5 — mass thin** |
| 10 | Thin content (sub-100 vol, near-duplicate) | ~900 est. | Tier 5 delete |

### Data-quality defects found
- **9 duplicate slugs** in the registry (same URL emitted twice): `waterfalls-in-meghalaya`,
  `trekking-in-meghalaya`, `meghalaya-backpacking-guide`, `homestay-in-mawlynnong`,
  `how-to-reach-shillong`, `10-day-meghalaya-itinerary`, `4-day-meghalaya-itinerary`,
  `cafes-in-shillong`, `corporate-retreat-shillong`. → causes self-competing entries / wasted crawl.
- robots.txt count (1,674) ≠ registry (1,636) ≠ filter output (1,636, filter passes everything). **The "quality filter" filters nothing** — every category cap is set ≥ the actual count.

---

## PHASE 2 — INDEXING PRIORITY MATRIX

The quality filter (`seoQualityFilter.ts`) currently passes **all 1,636 pages**. It must be re-tuned
to a real ~500-page ceiling. Tier assignment:

| Tier | Action | Page buckets | Approx count |
|---|---|---|---|
| **T1 — Index now** | Crawl-priority, internal-link hubs | 25 destination pages, top 12 guide/itinerary pages already ranking p2–4, /best-hostel-in-shillong, /hotels-in-shillong, /tab-bistro, /tab-bistro catering, 21 tours, core static | ~90 |
| **T2 — Index + improve** | Have potential, need depth/links | homestays, glamping, ~30 best restaurant cluster pages, ~20 guides | ~150 |
| **T3 — Noindex (keep for UX)** | Thin but useful to users | low-vol locality rentals, niche FAQ pages | ~120 |
| **T4 — Merge/canonicalize** | Cannibalizing duplicates | hostel-intent cluster, cafe duplicates, falls dupes | ~80 |
| **T5 — Delete** | Doorway pages, no demand | bulk of themed-trips (380), group-tours (200), corporate (181), road-bike-trips (160), workation (120) where no Semrush volume exists | **~1,000** |

### TOP 100 PRIORITY URLs (ranked by revenue × demand × booking intent)
Ranked using **live Semrush volume + position** where available. Tier-1 revenue pages first even
where they don't yet rank (the gap = the opportunity).

**A. Already-ranking assets to push to page 1 (highest ROI — they're at #15–37):**
1. /places-to-visit/seven-sisters-falls — 49.5k vol, pos 24 → 18% of all site traffic
2. /places-to-visit/laitlum-canyons — 90.5k vol, pos 21/37
3. /places-to-visit/elephant-falls — 49.5k vol, pos 21
4. /places-to-visit/nohkalikai-falls — 40.5k vol, pos 18
5. /places-to-visit/krang-suri-falls — 22.2k vol, pos 7–25 (closest to page 1)
6. /best-time-to-visit-meghalaya — 18.1k vol, pos 16 (12 keywords)
7. /meghalaya-waterfalls — 12.1k vol, pos 15
8. /places-to-visit/dawki-umngot-river — pos 9
9. /best-homestay-in-cherrapunji — 5.4k vol, pos 16 (**only ranking commercial page**)
10. /places-to-visit/umiam-lake, /meghalaya-caves, /meghalaya-viewpoints, /3-day & /7-day itineraries (all p16–31)

**B. Money pages that MUST rank but currently rank for nothing (build these up):**
11–25. /best-hostel-in-shillong, /hostel-shillong, /hotels-in-shillong, /homestays-in-shillong,
/luxury-glamping-shillong, /tab-bistro, /restaurant-in-shillong, /tours, /meghalaya-tour-packages,
/meghalaya-couple-tour-package, /shillong-tour-package, /book, /xtsy-rentals, /xtsy-270, /tab-bistro catering.

**C. 26–100:** locality + intent commercial pages with proven Semrush demand (youth hostel shillong
6.6k, dormitory in shillong, cheap hotels in shillong, homestay in cherrapunji), plus the 21 tour
pages and the ~30 highest-volume restaurant cluster pages. Everything outside this ~100 set is
T3–T5.

---

## PHASE 3 — CANNIBALIZATION AUDIT (confirmed in live data)

Semrush shows **multiple URLs competing for the same query** — proven, not theoretical:

| Cannibalizing cluster | Competing URLs | Same query | Fix |
|---|---|---|---|
| Cheap/youth hostel | /cheap-hostel-shillong (pos19), /cheap-hostel-in-shillong (pos46), /best-hostel-in-shillong (pos34) | "youth hostel shillong price", "dormitory in shillong" | **Merge → 1 page** `/best-hostel-in-shillong`, 301 the rest |
| Hostel landing | /, /hostel-shillong, /best-hostel-in-shillong | "youth hostel shillong" (homepage ranks pos29) | Canonical to /best-hostel-in-shillong; homepage targets brand |
| Cafe duplicate | `cafes-in-shillong` registered **twice** | "cafes in shillong" | De-dupe slug |
| Falls duplicates | krang-suri-falls returns 2 keyword rows (pos25 & 28); nehu-hostel 2 rows (pos9 & 12) | same keyword | Duplicate registry/keyword entries — clean |
| Corporate retreat | `corporate-retreat-shillong` in both `weddings` AND `corporate` | corporate retreat | De-dupe; assign one category |
| Itinerary dupes | 4-day & 10-day meghalaya-itinerary registered twice each | itinerary queries | De-dupe |

**Recommendation:** Consolidate the hostel cluster from ~6 thin pages into **one authoritative
booking page** + 301 redirects, fix the 9 duplicate slugs, and dedupe keyword rows. Consolidation
alone should lift the hostel pages from p30–46 toward p1.

---

## PHASE 4 — RESTAURANT & CATERING SEO ARCHITECTURE (TAB Bistro)

116 restaurant pages exist but **none rank** — they're thin and orphaned. Restructure into a
**hub-and-spoke** with real depth, not 116 doorway variants.

### Recommended live page set (cut 116 → ~30 strong)
**Hub:** `/tab-bistro` (Restaurant + Menu + AggregateRating schema — already present).

**Restaurant spokes (keep, deepen each to 800–1,200 words + FAQ + photos + menu embed):**
- /restaurant-in-shillong · /best-restaurant-in-shillong · /family-restaurant-shillong
- /rooftop-restaurant-shillong · /cafe-in-shillong · /breakfast-in-shillong
- /english-breakfast-shillong · /american-breakfast-shillong · /best-lunch-in-shillong
- /best-dinner-in-shillong · /best-cafes-in-shillong · /chinese-restaurant-shillong
- /barbecue-restaurant-shillong · /restaurant-in-police-bazar · /restaurant-in-laitumkhrah

**Catering hub:** `/tab-bistro/catering` (Service + Event schema). Spokes:
- /catering-services-shillong · /corporate-catering-shillong · /wedding-catering-shillong
- /event-catering-shillong · /birthday-catering-shillong · /party-catering-shillong
- /bulk-food-supply-shillong · /hostel-catering-shillong

**Each restaurant/catering page MUST have:** unique H1, Restaurant/Service + FAQPage + Breadcrumb
JSON-LD, a 40–60 word quick-answer block (for AI Overviews), menu/pricing signals, NAP
(+91 8837317070, GSTIN 17QSKPK1714H1ZE), and a CTA to `/tab-bistro` / WhatsApp. Delete the rest of
the 116 thin variants (locality×cuisine combos with no search volume).

---

## PHASE 5 — NORTHEAST TOURISM AUTHORITY

Current ranking footprint is **100% Meghalaya** (falls/viewpoints). The 8-state expansion already
exists in code (`seoPagesGlobalNE.ts`, group-tours 200, themed-trips 380) but as **thin doorway
pages with zero rankings** — they are liabilities, not assets.

### Coverage verdict by state
| State | Editorial depth | Commercial pages | Verdict |
|---|---|---|---|
| Meghalaya | Strong (25 destinations rank) | Weak (no booking page ranks) | Build commercial layer |
| Assam | Thin programmatic only | Thin | Build 1 real pillar (Kaziranga) |
| Arunachal | Thin | Thin | 1 pillar (Tawang/Ziro) |
| Nagaland | Thin | Thin | 1 pillar (Hornbill/Kohima) |
| Manipur/Mizoram/Tripura | Thin | None | Defer — no authority yet |
| Sikkim | Thin | Thin | 1 pillar (Gangtok/Pelling) |

### Top missing COMMERCIAL pages (prioritize ~30, not 200)
Build deep pillars for proven-demand clusters only: Northeast tour packages, Kaziranga safari
package, Tawang tour package, Sikkim package, group tours (real itinerary + pricing, not 200
locality stubs), corporate retreats Northeast (one strong page, not 181), honeymoon Northeast,
backpacking Northeast, workation Shillong (one page).

> Of the 200 group-tours / 380 themed-trips / 181 corporate / 160 road-bike pages, keep ~10–15
> per cluster with real itineraries + pricing + schema; **delete the rest** — they have no Semrush
> volume and dilute crawl budget.

---

## PHASE 6 — AI SEARCH READINESS (AI Overviews / ChatGPT / Gemini / Perplexity)

| Signal | Status | Action |
|---|---|---|
| Quick-answer blocks (40–60 words at top) | Partial | Add to all T1/T2 pages — biggest AI-Overview lever |
| FAQ depth + FAQPage schema | Present on some (FAQSection.tsx) | Roll out to all commercial + falls pages |
| Entity coverage (NAP, geo, GSTIN) | Strong on TAB/hostel | Extend geo to falls/destination pages |
| Speakable schema | **Missing** | Add to top 20 informational pages |
| Structured answers / lists/tables | Weak | Add comparison tables (price, distance, time) |
| llms.txt | Present | Keep curated to T1 pages only |

**Pages most likely to win AI answers** (high vol + question intent): best-time-to-visit-meghalaya,
meghalaya-waterfalls, the falls pages, 3/7-day itineraries, best-homestay-in-cherrapunji. Add a
crisp quick-answer + FAQ + Speakable to each → these are your AI-citation engines.

**AI Readiness Score (current, by cluster, 0–100):** Falls/destinations 55 · Guides 50 ·
Hostel/commercial 35 · Restaurant 30 · Catering 25 · NE-expansion 15.

---

## PHASE 7 — INTERNAL LINKING GRAPH

Today the ranking falls pages are **topical dead-ends** — they pass no equity to money pages. That's
why nothing commercial ranks despite the falls pulling traffic.

### Required link wheel (each falls/guide page → 3–5 commercial targets)
```
seven-sisters-falls ─┐
elephant-falls       ├─► /shillong-tour-package ─► /book
nohkalikai-falls     ├─► /best-hostel-in-shillong ─► /book
laitlum-canyons      ├─► /tab-bistro (eat nearby)
krang-suri-falls     └─► /best-homestay-in-cherrapunji
best-time-to-visit ──► itineraries ──► tour-packages ──► /book
itineraries ◄────────► tours ◄────────► hostel/glamping
tab-bistro ◄────────► catering ◄────────► weddings/corporate
```
**Missing links to add:** every destination page needs a "Where to stay / Where to eat / Tours from
here" module linking to hostel + TAB + tours. Every itinerary needs in-line booking + hostel links.
TAB ↔ catering ↔ wedding cross-links. This is the single highest-leverage on-page change.

---

## PHASE 8 — SCHEMA AUDIT

| Schema | Present? | Gap / action |
|---|---|---|
| LodgingBusiness / Hotel | ✅ (LodgingBusiness) | Add `priceRange`, `aggregateRating`, `amenityFeature` to all stay pages |
| Restaurant / FoodEstablishment | ✅ | Roll out to all restaurant spokes (only ~2 instances now) |
| Menu / MenuSection / MenuItem | ✅ | Good — extend |
| FAQPage | ✅ (limited) | Roll out site-wide on T1/T2 |
| BreadcrumbList | ✅ | Ensure on **every** page (some missing) |
| Review / AggregateRating | ✅ | Extend to hostel + tours |
| Campground (glamping) | ✅ | Good |
| **TouristAttraction** | ❌ **Missing** | **Add to all 25 destination/falls pages — your top traffic pages have no attraction schema** |
| **Event** | ❌ Missing | Add to catering/wedding pages |
| LocalBusiness | Partial | Add explicit LocalBusiness to TAB + hostel |
| TouristTrip / Trip | ❌ Missing | Add to tour-package pages |
| Speakable | ❌ Missing | Add to AI-target pages |

**Biggest schema win:** `TouristAttraction` on the falls pages (they drive 80% of traffic and have
no attraction markup) and `TouristTrip` on tour packages.

---

## PHASE 9 — CORE WEB VITALS & TECHNICAL SEO

Per existing project memory (LCP-optimized heroes, lazy loading, hidden scrollbars, 16px inputs,
`contain: style` on #root, animation keyframes in global CSS) the technical baseline is solid.
Watch-items:
- **Crawl budget** is the #1 technical SEO issue here — 1,600+ URLs on a new domain. Cutting to
  ~500 indexable directly improves crawl/discovery of the pages that matter.
- **Image LCP** on destination heroes: ensure CDN-mapped Supabase URLs (recent migration) + width/height + `fetchpriority=high` on hero.
- **INP**: heavy analytics/consent stack — keep deferred; verify it never blocks main thread on falls pages (top traffic).
- **Mobile UX**: 48px touch targets, no backdrop-blur on large scroll areas (per memory) — maintain.
- Fix sitemap inconsistency (orphan sitemaps) so Search Console stops reporting discovery errors.

---

## PHASE 10 — FINAL ACTION PLAN

### 1. Top 100 URLs to prioritize
The ranking falls/guides (Phase 2A) + commercial money pages (Phase 2B) + proven-demand commercial
locality pages. Everything else → T3–T5.

### 2. Pages to REMOVE (~1,000)
Bulk of themed-trips (380), group-tours (200→keep ~15), corporate (181→keep ~5), road-bike-trips
(160→keep ~5), workation (120→keep 1), thin restaurant variants (116→keep ~30), thin NE stubs.

### 3. Pages to MERGE
Hostel intent cluster (6→1), cheap-hostel dupes, 9 duplicate slugs, cafe dupes, itinerary dupes.

### 4. Pages to IMPROVE
The 25 falls/destination pages (TouristAttraction + quick-answer + FAQ + internal links), top
itineraries, best-time-to-visit, best-homestay-in-cherrapunji, all surviving commercial pages.

### 5. Missing RESTAURANT pages
~15 deep restaurant spokes (Phase 4) replacing 116 thin variants.

### 6. Missing CATERING pages
8 catering spokes with Service + Event schema (Phase 4).

### 7. Missing TOURISM pages
Real pillars: NE tour packages, Kaziranga, Tawang, Sikkim, Hornbill — depth over breadth.

### 8. Missing GROUP-TOUR pages
~10–15 real group-tour itineraries with pricing/schema (replace 200 stubs).

### 9. Missing CORPORATE-RETREAT pages
1 strong corporate-retreat-shillong + 1 NE corporate retreats (replace 181 stubs).

### 10. Missing NORTHEAST authority pages
~30 deep state pillars (replace thin 8-state expansion).

### 11. Sitemap restructuring plan
- One canonical `sitemap_index.xml` (remove orphan sitemaps).
- Re-tune `seoQualityFilter.ts` caps to enforce a real ~500-URL indexable ceiling.
- Add 301 map for merged/deleted URLs; serve 410 for permanently deleted doorway pages.
- Keep image sitemap referenced from the index.

### 12. Internal linking roadmap
Implement the Phase 7 link wheel: destination → stay/eat/tour modules; itinerary → book; TAB ↔
catering ↔ weddings. Target 5–10 contextual internal links per money page.

### 13. 90-DAY SEO GROWTH ROADMAP
**Days 1–30 — Stop the bleed & consolidate**
- Fix 9 duplicate slugs + dedupe keyword rows.
- Merge hostel cluster (6→1) with 301s. Re-tune quality filter → ~500 indexable.
- Rebuild canonical sitemap index; submit in Search Console; 410 the deleted doorway pages.
- Add TouristAttraction schema to 25 destination pages.

**Days 31–60 — Strengthen winners & money pages**
- Add quick-answer + FAQ + Speakable to top 20 traffic pages (push falls from p15–24 → p1).
- Deepen 15 restaurant + 8 catering spokes; ship the internal link wheel.
- Build /shillong-tour-package, /meghalaya-tour-packages depth + TouristTrip schema.

**Days 61–90 — Expand on proven authority**
- Build ~30 deep NE/commercial pillars (only proven-demand clusters).
- Roll out AggregateRating/Review across stays & tours.
- Re-measure in Semrush; expect falls pages on page 1, first commercial + restaurant rankings.

**90-day target:** 109 → 400+ ranking keywords; 281 → 1,500+ est. organic visits/mo; first-ever
commercial/restaurant/catering rankings; falls pages on page 1.
