# XTSY Master Supreme SEO + Performance Program

Grounded in live Semrush data (India market) + your open SEO findings. The strategy is sequenced so each phase unblocks the next: **fix the foundation → harvest the near-wins → speed → scale → defend.**

## Where you are right now (the numbers)

```text
Metric                         Value          Read
──────────────────────────────────────────────────────────────────────
Indexed organic keywords       64             Just started ranking (was 0 in Mar)
Est. organic traffic           ~92/mo (IN)    Early — momentum since Apr 2026
Pages built                    ~1,583         Huge surface, thin harvest so far
Best opportunity               5 page-2 terms ~104K combined monthly volume
Authority Score                Low/new        New pages take weeks-months to rank
```

The gap is **not content volume** — you have 1,583 pages. The gap is (1) crawlability of an SPA, (2) the page-2 terms not yet pushed to page 1, and (3) Core Web Vitals dragging rankings + UX.

---

## Phase 1 — Foundation: make every page crawlable & unique (highest priority)

Google can't rank what it can't read cleanly. Today every route serves an identical static head to non-JS crawlers.

- **Connect Google Search Console** (currently failing). Verify `https://xtsy.one/` via META, submit `sitemap_index.xml`. This is your feedback loop — without it you're flying blind on indexing, coverage errors, and which queries actually convert.
- **Fix `index.html` duplicate-head signals**: remove the hardcoded `<link rel="canonical">`, `og:title`, `og:description`, `og:url` so per-route Helmet tags own them. Keep only sitewide fallbacks.
- **Shorten over-length titles** in `SEOHead.tsx` SEO_CONFIG: `home` (66→<60), `travel` (73), `booking` (74), `tours` (70). Same for og:title.
- **Verify the Cloudflare edge-rewrite worker is live** on all programmatic routes (per-route canonical/og/title injection from the slim map) — this is what gives non-JS crawlers unique heads. Run `verifyEdgeRewrite.ts` and confirm `x-rendered-by: cf-edge-rewrite` on a random sample.
- **Add `/llms.txt`** (public/) so AI assistants (ChatGPT, Perplexity, Gemini) can map the site without parsing the JS shell.
- **Add missing structured data**: `Organization` + `WebSite` sitewide; `Article`/`BreadcrumbList`/`FAQPage` per programmatic page; `LodgingBusiness` on property pages; `TouristAttraction` on destination pages.

## Phase 2 — Harvest: push page-2 terms onto page 1 (fastest traffic ROI)

These pages already rank — they just need a focused push. This is where you'll see traffic move in weeks, not months.

**Priority is now grounded in LIVE Google Search Console data (last 28 days)** —
real pages already earning impressions on page 2 with weak/zero CTR. These are
the genuine near-wins (impressions = Google already trusts the page; we just
need to push it up). Volume from Semrush (India market).

```text
Rank Page                              Term                     Pos  GSC imp  Vol/mo  KDI  Status
────────────────────────────────────────────────────────────────────────────────────────────────
 1  /destination-wedding-shillong      destination wedding shg   11   108     —       —   DONE (enriched)
 2  /budget-stay-shillong              budget hotels in shillong 9-30  17     590    25   DONE (enriched)
 3  /hostel-in-cherrapunji-tonight     hostel in cherrapunji     10    57     260    23   NEXT
 4  /cheap-homestay-in-cherrapunji     cheap homestay cherrapunji 8.6  37     170    23   NEXT
 5  /tab-bistro                        breakfast places shillong  22     9     140    29   QUEUED
 6  /workation-gangtok                 gangtok workation           9    21     —      —   QUEUED
 7  /remote-work-stay-meghalaya        workation in meghalaya    8.6    17     —      —   QUEUED
 8  /meghalaya-waterfalls              best waterfalls meghalaya  21     6   12,100   —   QUEUED (high vol)
 9  /places-to-visit/elephant-falls    elephant falls meghalaya   23     6   49,500   —   QUEUED (high vol)
```

Read: #1–#2 shipped this pass (highest impressions / cleanest pages). #3–#4 are
the fastest remaining wins — KDI 23, position 8–10, real demand. #8–#9 are huge
volume but lower current impressions, so they're a depth/rewrite job for later.

Per page:
- Expand to 1,200–1,800 words of genuinely useful, E-E-A-T content (how to reach, best time, entry fee, nearby stays, real tips) — not boilerplate.
- Topic-matched hero image (no generic fallback) + descriptive alt text with the keyword.
- 8–10 contextual internal links from related guides into these pages (internal linking wheel) to concentrate authority.
- Tighten H1 + meta to exact-match the target query; add a 3–5 question FAQ block with `FAQPage` schema for SERP real estate.
- Add `BreadcrumbList` so Google shows the breadcrumb trail.

## Phase 3 — Speed: Core Web Vitals as a ranking + conversion lever

LCP is currently flagged. CWV is a confirmed ranking factor and directly affects bounce.

- **LCP**: identify the above-the-fold hero per template; set explicit `width`/`height`, remove `loading="lazy"` on it, add `fetchpriority="high"`, and `<link rel="preload" as="image">` the LCP image. Serve AVIF/WebP via your existing image pipeline.
- **Fonts**: `font-display: swap` on every `@font-face` to stop text being invisible while fonts load.
- **CLS**: reserve dimensions on all images/embeds (aspect-ratio utilities), avoid layout shift from late-loading sections.
- **JS payload**: keep route-level code splitting; defer non-critical third-party scripts (GTM, analytics) so they never block paint — without breaking the admin-first tracking/consent architecture.
- **Edge caching**: long cache-control on static/hashed assets + immutable headers; serve the slim map from KV (already planned).
- Target: mobile LCP < 2.5s, CLS < 0.1, INP < 200ms. Verify with Lighthouse CI (already wired) + field data once GSC/CrUX is connected.

## Phase 4 — Scale: quality-gated content expansion

Only after Phases 1–3 prove the engine converts. Avoid thin-content penalty.

- Enforce the existing `seoQualityFilter.ts` as a hard pre-sitemap gate: no page enters the sitemap without ≥800 words, a unique H1, a topic-matched hero, and 3+ internal links.
- Prioritize new pages by **validated demand** (Semrush volume + low difficulty), not raw count. Target long-tail "page-2 adjacent" clusters around your winning topics (waterfalls, viewpoints, homestays, road trips).
- Every page reflects the real brand story (Shillong-only properties, awards, partners) via `brandFacts.ts` single source of truth.

## Phase 5 — Defend: monitoring & relevance enforcement

- GSC-driven weekly review: coverage errors, queries gaining/losing position, CTR opportunities (high-impression low-CTR = rewrite the title).
- `seoMonitor.ts` smoke test of random URLs (canonical health, edge-rewrite header, quality score) — fail CI on regression.
- Semrush position tracking on the Phase-2 target terms to confirm the page-1 push lands.
- A11y: fix low-contrast text findings (use `text-foreground`/`text-muted-foreground` tokens, not arbitrary grays) — accessibility overlaps with rankings and is currently flagged.

---

## The "Master Supreme Prompt" (reusable execution prompt)

Paste this back to me (or any agent) to run a full pass any time:

```text
Run the XTSY Master SEO pass. In strict order:
1. FOUNDATION — confirm GSC connected + sitemap submitted; verify Cloudflare
   edge-rewrite serves unique canonical/og/title per route (run verifyEdgeRewrite);
   ensure index.html has NO hardcoded canonical/og; confirm /llms.txt exists;
   validate Organization/WebSite/Article/Breadcrumb/FAQ/LodgingBusiness schema.
2. HARVEST — pull current Semrush positions; for every term at position 11-30 with
   volume >1,000, deepen the page to 1,200+ words, topic-match the hero + alt,
   add 8-10 inbound internal links, add FAQPage + BreadcrumbList, exact-match H1/meta.
3. SPEED — audit LCP/CLS/INP per template; preload + fetchpriority the hero;
   font-display swap; reserve image dimensions; defer non-critical 3p scripts
   WITHOUT breaking consent/admin-first tracking. Target LCP<2.5s, CLS<0.1, INP<200ms.
4. SCALE — only add pages that pass seoQualityFilter (800+ words, unique H1,
   matched hero, 3+ links); prioritize by validated Semrush demand.
5. DEFEND — report GSC coverage + CTR opportunities; fail CI on canonical/quality
   regression; fix a11y contrast with design tokens.
Output: what changed, before/after metric, and the next single highest-ROI action.
```

---

## What I need from you to start

1. **Approve this plan.**
2. Tell me where to start — I recommend **Phase 1 + the Phase 2 top-3 waterfall pages** in the first build (foundation fixes are quick and unblock everything; the waterfall pages are your fastest traffic win).
3. For GSC, I can run the META verification + sitemap submission directly once you confirm the connector is authorized.

Each phase ships behind a checkpoint — you'll see exactly what changes before I run it.

## Technical notes

- SPA crawlability hinges on the Cloudflare worker; if edge-rewrite isn't live, Phase 1 fixes nothing for non-JS crawlers — that's why it's gate #1.
- Speed work must stay non-destructive to the admin-first analytics + Consent Mode v2 architecture (per project knowledge) — tracking correctness outranks Lighthouse score.
- All content rewrites pull from `brandFacts.ts` so positioning stays consistent across 1,583 pages.
- Sitemap stays under Google's 50K-URL / 50MB per-file limits via branched sitemaps (already in place).
