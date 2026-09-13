# XTSY.ONE SEO + AEO Master Plan

## Objective
Build sustainable top-page visibility for XTSY’s three revenue lines—Shillong hostel bookings, Meghalaya/Northeast tours, and TAB Bistro—while increasing citations in ChatGPT, Google AI Overviews/AI Mode, Gemini, and Perplexity.

Top rankings cannot be guaranteed. The plan prioritizes the pages already closest to page one, then strengthens commercial pages and authority signals.

## Evidence informing the plan

- Semrush India currently estimates **307 organic keywords and 294 monthly organic visits**. The screenshot shows traffic down **28.12%** while keyword coverage increased **10.43%**, indicating broader visibility but weak ranking depth/click capture.
- Current strongest opportunities:
  - `umngot river`: position 10, 8,100 searches/month.
  - `shnongpdeng`: position 16, 12,100/month.
  - `wah rilang`: position 13, 12,100/month.
  - `nohkalikai falls`: position 36, 49,500/month.
  - `dormitory in shillong`: position 9, 480/month.
  - `best time to visit meghalaya`: position 30, 18,100/month.
- Revenue keyword demand in India:
  - `meghalaya tour packages`: 4,400/month, difficulty 20.
  - `hostels in shillong`: 2,400/month, difficulty 21.
  - `hostel booking`: 1,300/month, difficulty 43.
  - `restaurants in shillong`: 6,600/month, difficulty 29.
  - `cafes in shillong`: 1,300/month, difficulty 32.
  - `cheap hostels in shillong`: 480/month, difficulty 28.
- Semrush reports **Authority Score 10**, 77 referring domains, and 104 backlinks. Many visible referring domains/anchors appear low-quality or manufactured, while authoritative tourism/local citations are limited.
- Semrush’s crawl screenshot covers only **100 pages**, not the full 600+ URL site. Its 73% health score and 205 errors therefore require a segmented/full crawl before being treated as sitewide totals.
- AI visibility is already emerging: screenshot evidence shows **AI Visibility 23, 23 mentions, and 52 cited pages**. This is a base to strengthen, not rebuild.
- Local directory evidence shows inconsistent or missing name/address/phone data across Google, Facebook, TripAdvisor, Bing, Siri, HERE, Waze and other discovery systems.
- Known technical risks include the published `(1970)` metadata bug, duplicate canonicals, the dead `/cheap-hostels-shillong` intent, short metadata/content, generic homepage H1, stale `llms.txt` pricing/routes, and conflicting entity/review facts.

## Priority model

1. **Protect existing rankings and revenue paths.** Fix indexation, canonical, metadata and broken-intent issues before adding content.
2. **Move striking-distance pages into the top 10.** Prioritize positions 4–20 with meaningful demand.
3. **Make informational traffic commercially useful.** Link destination and planning pages to tours, hostel availability and validated booking actions.
4. **Build verified entity authority.** Align site facts, business listings, reviews, sources and structured data.
5. **Expand only after validation.** No duplicate or programmatic page launches without keyword, intent, uniqueness and conversion checks.

## Phase 0 — Baseline and measurement integrity

- Create a canonical keyword-to-URL map for every tracked query; one primary intent per indexable URL.
- Configure Semrush Position Tracking for **India, mobile, English**, with a Shillong-local segment and groups for Hostel, Tours, Destinations, Expeditions and Bistro. The current 0% dashboard conflicts with the 307 organic-keyword report and should be rebuilt or corrected.
- Pull Search Console baselines by page/query for the last 28 and 90 days: clicks, impressions, CTR and average position. Use Search Console as ranking truth; Semrush remains competitive/demand evidence.
- Preserve the admin dashboard as the primary source for value. GA4 receives downstream reporting only. Booking success remains limited to the approved validated events: `whatsapp_engaged_validated`, `call_engaged_validated`, `lead_qualified`, and `booking_confirmed`.
- Record AI referrals separately for ChatGPT, Perplexity, Gemini and Google AI surfaces without treating raw visits/clicks as conversions.

**Exit criteria:** every priority keyword has one owner URL, a baseline, a target stage and an approved conversion path.

## Phase 1 — Critical technical and trust repairs

### 1.1 Published metadata integrity
- Replace runtime/module-load year generation with a deterministic SEO year source that cannot resolve to 1970 during publishing.
- Regenerate and validate all affected programmatic metadata before publication.
- Add an automated release check that fails if any public title, description, schema date or visible copy contains `1970`.

### 1.2 Canonical consolidation
- Ensure exactly one canonical per public route by removing legacy/duplicate head-management paths and relying on TanStack route `head()` output.
- Eliminate client-side canonical mutation as an indexing dependency.
- Validate canonical, `og:url`, redirects and sitemap URL are identical for each canonical page.
- Preserve hierarchical destination URLs; 301 legacy `/places-to-visit/*` variants rather than allowing both versions to rank.

### 1.3 Missing commercial intent
- Resolve `cheap hostels in shillong` to one canonical page. Recommended canonical: `/cheap-hostels-shillong`, subject to Search Console confirmation that no singular variant has stronger history.
- Redirect all singular/plural variants to the selected URL; do not create competing copies.
- Build the canonical page around real ₹369 dorm inventory, total-price clarity, location, inclusions, direct-booking comparison, availability CTA and booking FAQs.

### 1.4 Metadata, sitemap and crawl quality
- Rewrite titles outside roughly 50–62 characters and descriptions outside roughly 145–165 characters only when relevance/CTR improves; do not pad mechanically.
- Replace generated/build-date sitemap `lastmod` values with real page-level modification dates or omit them.
- Run segmented crawls covering every sitemap family because the current Semrush audit stops at 100 URLs.
- Keep admin, account, utility and private routes noindexed and excluded.

### 1.5 Entity consistency
- Establish one verified source for brand name, hostel name, address, phone, coordinates, prices, review count/rating, awards and property ownership.
- Correct conflicting facts across visible copy, schema, `llms.txt`, social metadata and templates. `llms.txt` currently says dorms from ₹329 and contains legacy routes; it must match the canonical ₹369 price and current URLs.
- Public business schema should describe the customer-facing XTSY entities. Do not expose information about XTSY ONE Ventures beyond the approved footer phrase.

**Exit criteria:** no 1970 metadata, one canonical per page, no commercial-intent soft 404, no stale prices/routes, and all indexable URLs return relevant 200 content.

## Phase 2 — Striking-distance ranking sprint

Improve existing pages before creating more URLs.

### Wave A: positions 4–15
- **Umngot River**: retain the hierarchical URL; answer boating cost, timing, water clarity, season, Dawki vs Shnongpdeng, travel time and responsible-tourism questions. Merge legacy authority via 301 and internal links.
- **Mawthadraishan Peak, Wah Rilang, Ranikor and Krem Liat Prah**: add verified logistics, current access notes, route maps/tables, firsthand XTSY planning value, nearby itinerary links and relevant tour/stay CTAs.
- **Shillong dormitory**: strengthen exact room details, ₹369 starting price, safety, lockers, check-in, location, availability and direct-booking proof.

### Wave B: positions 16–30
- **Shnongpdeng, Kynrem Falls, Krang Suri, Elephant Falls and Meghalaya waterfalls**: align H1/title to the proven query, answer the key planning question immediately, add original media/facts, and connect each to a logical itinerary/tour.
- **Best time to visit Meghalaya**: create a month-by-month decision table covering weather, waterfall strength, road risk, crowds, costs and best activities. Add concise question-led answers for its existing query variants.
- **Things to do in Meghalaya**: turn the page into a scannable activity hub with duration, best season, base location and matching tour links.

### Wave C: positions 30+
- **Nohkalikai Falls**: add verified fees/hours/access, viewpoint guidance, monsoon safety, Cherrapunji itinerary context and original local insight.
- Improve pages only where Search Console confirms impressions; consolidate or noindex weak near-duplicates instead of expanding all thin templates.

**Exit criteria:** measurable 28-day improvement in impressions, CTR or position for each edited owner URL; no cannibalization between legacy and hierarchical pages.

## Phase 3 — Revenue page dominance

### Hostel cluster
- Canonical owners:
  - `hostels in shillong` → `/best-hostel-in-shillong`.
  - `cheap hostels in shillong` → selected cheap-hostel canonical.
  - `dormitory in shillong` → `/shillong-dormitory`.
  - `hostel booking` / `online hostel booking` → `/hostel-booking` and `/book`, with clearly separated informational and transactional roles.
- Give each page unique room inventory, pricing, location, safety, check-in, cancellation, payment and availability answers.
- Use `Hostel`, `HotelRoom`, `Offer`, `AggregateRating` and `FAQPage` only when each field is verified and visible.

### Tour cluster
- Strengthen `/meghalaya-tour-packages` for the 4,400/month, difficulty-20 query with package comparison, duration, route, inclusions, starting price, permit needs and enquiry CTA.
- Connect high-traffic attraction pages to matching packages, not generic sales blocks.
- Validate every tour price, permit, season, altitude and itinerary fact from the admin-controlled source before publishing schema.

### TAB Bistro cluster
- Improve the cafes page with specific verified menu items, hours, location, photos and TAB Bistro relevance.
- Create a distinct intent map for `cafes in shillong`, `best cafe in shillong`, `restaurants in shillong`, catering and event dining to prevent overlap.
- Keep restaurant schema, menu data and local listing facts synchronized.

**Exit criteria:** each revenue cluster has a clear hub/spoke structure, unique intent, valid offers and a validated conversion path.

## Phase 4 — AEO and AI-citation leadership

- Add a short, visible **direct answer** below the H1 on priority pages: 40–80 words answering the exact query with verified numbers, dates and conditions.
- Use decision-ready blocks: comparison tables, month matrices, route distances, permit checklists, price inclusions and “best for” summaries.
- Add “Reviewed/updated” dates only when backed by a real editorial update; do not auto-refresh dates.
- Attribute factual guides to an identifiable XTSY editorial/local-expert source and cite authoritative sources for permits, emergency guidance, transport rules and public fees.
- Keep answer text visible; never add hidden SEO/AEO blocks.
- Use supported schema stacks by page type: `Hostel/HotelRoom/Offer`, `TouristTrip/Offer`, `TouristAttraction`, `Restaurant/Menu`, `Article`, `BreadcrumbList`, and visible `FAQPage` where appropriate.
- Remove duplicate BreadcrumbList/FAQ/schema entities and connect all entities with stable `@id` values.
- Refresh `llms.txt` to include current canonical revenue hubs, destination pillars, expeditions and planning guides, excluding admin/auth/private routes.
- Track monthly AI citations for a fixed query set: hostel booking, Meghalaya planning, destination facts, tour packages, road trips and Shillong dining. Record cited URL, answer accuracy, competitor citations and conversion-assisted visits.

**Exit criteria:** priority answers are factually consistent across visible copy/schema/feeds; AI citation share and cited-page coverage increase without unsupported claims.

## Phase 5 — Local SEO and reputation authority

- Confirm the exact canonical NAP before any listing work. The supplied directory report currently shows inconsistent address, phone and business name data.
- Correct Google Business Profile, Google Search, Facebook and TripAdvisor first; then Bing Places, Apple Maps, HERE, Waze, Uber and relevant travel directories.
- Remove duplicate listings and ensure the hostel and TAB Bistro remain distinct entities where appropriate.
- Use the same verified NAP, map coordinates, hours, booking URL, category, photos and descriptions everywhere.
- Build a compliant review workflow after completed stays/dining visits; never fabricate or gate reviews.
- Do not disavow links based on Semrush alone. First compare Search Console links/manual actions, then isolate clearly manipulative domains if warranted.
- Prioritize legitimate links from tourism bodies, travel publications, local institutions, event partners, suppliers and verified partner organizations.

**Exit criteria:** priority directory listings are claimed/correct, NAP consistency is verified, and authority growth comes from relevant sources rather than bulk links.

## Phase 6 — Internal linking and conversion architecture

- Enforce one keyword owner URL through the canonical map.
- Build contextual paths:
  - Attraction → relevant itinerary/tour → Shillong stay/availability.
  - Planning guide → transport/season page → tour comparison → enquiry.
  - Hostel guide → room type → availability check → validated booking event.
  - Café/restaurant guide → TAB Bistro menu/reservation/catering action.
- Fix currently reported footer path mismatches and validate every internal target during release.
- Use natural anchors matched to the destination, room or package; avoid sitewide exact-match repetition.
- On informational pages, show one primary contextual CTA and one secondary planning link rather than repeated generic booking buttons.

**Exit criteria:** no orphan pages or broken internal links; priority pages receive links from relevant high-traffic pages; destination-to-booking progression is visible in the admin funnel.

## Phase 7 — Programmatic SEO quality gate

Before any generated page becomes indexable, require:

1. Validated keyword demand or a defensible user need.
2. Unique search intent and a designated canonical owner.
3. Verified local facts, route/price/permit information and source dates.
4. Meaningfully unique visible content, not token-swapped templates.
5. A relevant internal-link path and commercial next step.
6. Correct metadata, one H1, one canonical and valid page-specific schema.
7. A working 200 page and sitemap inclusion.
8. No conflict with an existing ranking page.

Pages failing the gate should remain noindexed, be consolidated, or be removed from sitemaps.

## Phase 8 — Performance and mobile search experience

- Test the published site on mid-range Android and iPhone profiles, focusing on top landing and booking pages.
- Targets: LCP under 2.5s, INP under 200ms and CLS under 0.1 at the 75th percentile.
- Preserve consent, admin analytics, intent scoring and validated-conversion rules while deferring nonessential tracking after the first paint.
- Prioritize real LCP image preload, responsive image formats, stable dimensions, reduced initial JavaScript and no layout shifts around booking controls.

**Exit criteria:** field data trends toward all three Core Web Vitals targets and booking/consent behavior remains intact.

## Reporting cadence

### Weekly
- Search Console: winners/losers, pages moving through positions 4–10, 11–20 and 21–50.
- Semrush: tracked keyword movement, SERP-feature changes and competitor movement.
- Technical: indexable count, soft 404s, duplicate canonicals, metadata failures and sitemap drift.
- Admin funnel: destination visits → availability checks → validated booking actions.

### Monthly
- Revenue clusters: non-branded clicks, qualified intent sessions and validated bookings.
- AEO: mentions, cited pages, source accuracy and AI-assisted conversions.
- Local: map visibility, listing completeness, calls/directions and review velocity.
- Authority: relevant new referring domains and suspicious-link changes.

## First 30-day implementation order

1. Fix 1970 metadata and add release regression checks.
2. Remove duplicate canonicals/schema and validate redirects.
3. Resolve the cheap-hostels canonical and soft-404 intent.
4. Reconcile all entity, price, review, address and `llms.txt` facts.
5. Correct homepage H1 to describe the hostel/service while retaining the brand line as supporting copy.
6. Repair internal-link path mismatches.
7. Optimize Umngot, Shillong dormitory, Mawthadraishan, Wah Rilang, Shnongpdeng and Best Time pages.
8. Upgrade `/best-hostel-in-shillong`, `/meghalaya-tour-packages` and the café/Bistro cluster.
9. Correct top-priority local listings.
10. Establish weekly Search Console/Semrush and monthly AEO reporting.

## Technical implementation areas

- Route metadata and canonical generation: TanStack route `head()` and the shared head builder.
- Programmatic metadata/year logic: SEO page factory and normalization pipeline.
- Redirect/canonical registry: legacy redirect map, quality filter and route registry.
- Content templates: destination, programmatic SEO, hostel, tour and expedition templates.
- Entity data: centralized brand facts, room inventory, review stats, location facts and schema builders.
- Discovery files: sitemaps, robots.txt and `llms.txt`.
- Quality automation: route resolver, canonical/schema validator, metadata length/relevance checks, soft-404 detector and sitemap parity checks.
- Measurement: admin analytics, Search Console snapshots, Semrush tracking and AI referral/citation reporting.

## Guardrails

- No duplicate pages, doorway pages, hidden SEO text, fabricated reviews, invented prices or unsupported superlatives.
- No ranking claim is treated as guaranteed.
- No admin/private routes in sitemaps or AI discovery files.
- No broad backlink disavow without Search Console evidence.
- No GA4 or Google Ads conversion promotion from raw clicks; only approved validated events may optimize advertising.
- No bypass of Consent Mode v2 or privacy requirements.
