# XTSY SEO Supreme Program — 4 Phases

You picked all four slices. They're ordered so each phase unblocks the next. I'll ship Phase 1 fully in the next turn, then we iterate phase-by-phase with checkpoints.

## Phase 1 — Wrangler deploy via GitHub Action (this turn, after approval)

**Goal:** every push to `main` deploys `cloudflare/worker.js` automatically, so the per-route canonical/og/title rewrite goes live without you running wrangler locally.

Deliverables:
- `.github/workflows/cloudflare-deploy.yml` — runs `npm i -g wrangler@latest && wrangler deploy` from `cloudflare/`, using `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` repo secrets.
- Workflow also uploads `public/seo-slim-map.json` to Cloudflare KV (so the worker reads it from KV, not by fetching the origin on every request — faster + cacheable).
- Updated `cloudflare/wrangler.toml` with a `[[kv_namespaces]]` binding `SEO_SLIM_MAP` and a `[triggers]` for the route pattern.
- Updated `cloudflare/worker.js` to read the slim map from KV first, fall back to origin fetch.
- New script `scripts/verifyEdgeRewrite.ts` — probes 20 random URLs after deploy and asserts `x-rendered-by: cf-edge-rewrite` header + per-route canonical. CI fails if rewrite isn't live.
- README block telling you to add `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` to **GitHub repo → Settings → Secrets and variables → Actions**.

**Your one manual step:** add those two secrets in GitHub (the Lovable secrets store I just saved doesn't propagate to GitHub Actions — different system).

## Phase 2 — Brand positioning rewrite across 1,583 existing pages

**Goal:** every page (static + programmatic) reflects the real XTSY story you described — Shillong-only properties, NE Tourism Award, "Biggest hostel in NE India", TAB Bistro catering, XTSY Tourism + Destination Weddings + Pluxee partner + upcoming Stargazing Resort.

Deliverables:
- New `src/data/brandFacts.ts` — single source of truth for all award lines, partner mentions, property positioning, USPs, and contact. Every page template imports from here. Edit once → propagates everywhere.
- Rewrite `src/data/seoPageFactory.ts` builders (`buildGlobalNEPage`, `buildIntentStayPage`, `buildRoutePage`, hospitality builders) to:
  - Inject 2-3 brand-fact sentences into every intro
  - Add a "Why XTSY" section with awards + Pluxee partner badge
  - Add an "About XTSY Group" footer section (Tourism + Weddings + Stargazing Resort + TAB Bistro + Hospitality Tech) on every programmatic page
  - Stop claiming properties exist outside Shillong; instead say "via our trusted accommodation partner network across Meghalaya + NE India + Sikkim"
- Rewrite meta description templates to include the strongest award line that fits within 155 chars.
- Update JSON-LD: add `Organization` with `award`, `parentOrganization: XTSY ONE Ventures Pvt Ltd`, `subOrganization` array (TAB Bistro, XTSY Tourism, XTSY Weddings), and `memberOf: Pluxee Partner Network`.
- Image relevance enforcement: every page that doesn't have a topic-matched Pexels/Supabase image gets routed through `batchGenerateSEOHeroes` with the page's primary keyword (already built). Phase 2 adds a strict pre-publish gate that refuses to render a page with a generic fallback hero.

Audit + verify: `bunx tsx scripts/auditSEOAIAnswers.ts` (already exists) gets extended to also check (a) brand-fact presence, (b) image-topic match score ≥ 0.6.

## Phase 3 — Expand to 4,000 new SEO pages

**Goal:** capture global travel awareness queries (the user searching "where to travel in India right now", "backpacking India 2026", "is Meghalaya safe for solo female travelers", etc.) without thin-content penalty risk.

New page families (built on existing `seoPageFactory`):

```text
Family                                          Count    Slug pattern
────────────────────────────────────────────────────────────────────────────────────
Global travel intent (when/where/is-it-safe)    ~600     /travel/{intent}-{country|state}
Backpacking India guides                        ~400     /backpacking/{state|circuit|month}
Destination wedding venues + city guides        ~250     /destination-weddings/{location}
Wedding planning by guest count + budget        ~200     /destination-weddings/{guests}-guests-{budget}
TAB Bistro catering by event type + city        ~300     /catering/{event-type}-in-{city}
Corporate catering + bulk orders                ~150     /corporate-catering/{city|industry}
Pluxee merchant pages (employee benefits)       ~200     /pluxee/{benefit-type}-{city}
Stargazing experiences pre-launch landing       ~100     /stargazing/{location|experience}
Travel from {country} to NE India               ~400     /travel-from/{country}-to-northeast-india
NE India month-by-month travel guides           ~300     /northeast-india/{month}-{year}
Hostel comparison + alternatives                ~250     /vs/{competitor-or-category}
AI travel planner intent pages                  ~250     /plan/{trip-type}-{duration}-{location}
Long-tail SGE/ChatGPT-targeted Q&A pages        ~600     /answers/{question-slug}
────────────────────────────────────────────────────────────────────────────────────
Total                                           ~4000
```

Each family gets its own builder in `seoPageFactory.ts`, its own slug generator in `scripts/generate-seo-slugs.ts`, and its own sitemap branch. Quality filter (`seoQualityFilter.ts`) is enforced — pages without ≥800 words, a unique H1, a topic-matched hero, and 3+ internal links get filtered before sitemap inclusion.

## Phase 4 — Monitoring + relevance enforcement

**Goal:** strict gate. Nothing thin, off-brand, or with a wrong hero image ever reaches Google.

Deliverables:
- New admin route `/admin/seo-quality` — table of all pages with columns: content score, image-relevance score, brand-fact presence, internal-link count, last crawl status, canonical health, indexed-in-GSC flag (manual upload).
- Bulk actions: "regenerate hero", "rewrite intro via Lovable AI", "exclude from sitemap until fixed".
- New edge function `seo-quality-scan` — nightly cron. For each page: fetches the live URL, computes (a) cosine similarity between page H1 and hero alt-text via Lovable AI embeddings, (b) brand-fact regex check, (c) word count, (d) canonical correctness. Writes results to a `seo_quality_scores` table.
- Slack/email alert (via `send-transactional-email`) when any score drops below threshold.
- Extends existing `scripts/sitemapHealthAudit.ts` to also fail CI when any sitemap URL has quality score < 70.
- New `scripts/seoMonitor.ts` — runs hourly via GitHub Action, smoke-tests 50 random URLs, posts a summary issue to GitHub if anything regresses.

## Technical notes

- Pages are SPA-rendered; the Cloudflare worker (Phase 1) handles per-route canonical/og/title injection for non-JS crawlers using the slim map.
- Image generation stays on **Pexels-only mode** with the existing fallback chain. AI image fallback stays opt-in to control spend.
- All Lovable AI calls (Phase 4 embeddings, Phase 2 rewrites if you opt in) go through `LOVABLE_API_KEY` already in your project secrets.
- 4,000 pages × ~5 KB HTML payload is fine; sitemap stays under the 50,000-URL / 50 MB per-file Google limit, but I'll split into branches of ~1,000.
- Memory updates: I'll write a new memory `mem://brand/positioning-master-v1` capturing the canonical brand fact list so future edits stay consistent.

## What I need from you to start Phase 1

1. Confirm I can proceed (approve this plan).
2. After Phase 1 ships, add `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` to GitHub repo secrets, then push to main — the workflow will deploy the worker and the verifier will report back.

Phases 2-4 each get their own checkpoint before I start — you'll see exactly what's about to change.
