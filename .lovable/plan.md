

# SEO Indexing, Pre-rendering & Growth Strategy

## What This Plan Covers

This plan addresses four objectives: (1) Google Search Console setup, (2) pre-rendering so Google can crawl all 300+ SPA pages, (3) a backlinks strategy document, and (4) a content marketing plan. Items 3 and 4 are strategy documents delivered as downloadable artifacts since they're not code changes.

---

## Step 1: Add Google Search Console Verification Meta Tag

Add the GSC verification meta tag to `index.html`. You'll need to provide your verification code from Google Search Console (Settings > Ownership verification > HTML tag method).

**File**: `index.html`
- Add `<meta name="google-site-verification" content="YOUR_CODE" />` in the `<head>` section
- I'll add a placeholder that you replace with your actual code, or you can provide it now

**Sitemap submission**: Once verified, submit `https://xtsy.one/sitemap.xml` in GSC under Sitemaps. This is a manual step in the GSC UI — no code change needed.

---

## Step 2: Build-Time Pre-rendering for All SEO Pages

**The problem**: xtsy.one is a React SPA. Google sees the same empty `index.html` for all 300+ routes. Even though `react-helmet` updates meta tags client-side, many crawlers and social bots don't execute JavaScript, so they only see homepage metadata.

**The solution**: Create a Vite plugin that runs after the build, uses `react-dom/server` to render each SEO page route to static HTML, and writes those HTML files into the build output directory. This gives crawlers fully-rendered HTML with correct meta tags, structured data, and content.

**How it works**:

```text
Build Pipeline:
  vite build (normal SPA build)
       ↓
  Post-build prerender script
       ↓
  For each of 300+ SEO slugs:
    1. Import the page component via SSR bundle
    2. Render to static HTML string
    3. Inject into index.html template (meta tags, JSON-LD, content)
    4. Write to dist/{slug}/index.html
       ↓
  Result: dist/backpacker-hostel-shillong/index.html (fully rendered)
         dist/car-rental-shillong/index.html (fully rendered)
         ... 300+ static HTML files
```

**Files to create/modify**:
1. **`scripts/prerender.ts`** — Node script that:
   - Reads all slugs from `seoPages.ts` and `seoPagesExpansion.ts`
   - For each slug, generates a complete HTML page with correct `<title>`, `<meta>`, JSON-LD, and visible content
   - Writes to `dist/{slug}/index.html`
2. **`vite.config.ts`** — Add a post-build hook to run the prerender script
3. **`package.json`** — Add `"build:seo": "vite build && tsx scripts/prerender.ts"` script

**Key constraint**: Since Lovable's build runs `vite build`, the prerender script will be integrated as a Vite plugin (runs automatically at build end), not a separate manual step.

**Important**: The pre-rendered HTML includes the full page content and meta tags. When JS loads, React hydrates and takes over — the user still gets the full SPA experience.

---

## Step 3: Backlinks Strategy Document

Generate a comprehensive backlinks strategy as a downloadable PDF/document covering:

- **Travel directory submissions** (TripAdvisor, Hostelworld, MakeMyTrip, Goibibo business listings)
- **Tourism board partnerships** (Meghalaya Tourism, Incredible India, Northeast Tourism)
- **Travel blogger outreach** (target list of 50+ India travel bloggers with DA 30+)
- **Guest posting targets** (travel publications accepting guest content)
- **Local business citations** (Google Business Profile, Justdial, Sulekha, IndiaMART)
- **University/backpacker community links** (hostel review sites, backpacker forums)
- **Social proof amplification** (Google Reviews, TripAdvisor reviews driving authority)
- **PR & media outreach** (NEITA 2025 nomination angle, "India's biggest hostel" angle)

**Output**: `/mnt/documents/XTSY_Backlinks_Strategy.md`

---

## Step 4: Content Marketing Plan

Generate a 12-month content marketing calendar as a downloadable document:

- **Monthly content themes** aligned with Meghalaya travel seasons
- **Blog post topics** (20+ article ideas with target keywords and word counts)
- **Social media content pillars** (Instagram, YouTube, Pinterest strategies)
- **User-generated content campaigns** (guest photo contests, review incentives)
- **Video content roadmap** (destination walkthroughs, hostel tours, travel guides)
- **Email marketing sequences** (pre-trip, during-stay, post-stay nurture flows)
- **Partnership content** (co-branded guides with local tour operators)
- **KPIs and milestones** toward 100K organic traffic goal

**Output**: `/mnt/documents/XTSY_Content_Marketing_Plan.md`

---

## Technical Details

| Item | Files Changed | Complexity |
|------|--------------|------------|
| GSC meta tag | `index.html` | Trivial |
| Pre-render plugin | `scripts/prerender.ts`, `vite.config.ts` | Medium |
| Backlinks doc | New artifact file | Document only |
| Content plan | New artifact file | Document only |

**Pre-rendering approach chosen over alternatives because**:
- Prerender.io (SaaS) costs $49+/month and requires server config Lovable doesn't expose
- Next.js migration would break the entire project
- Build-time static HTML generation works within Lovable's Vite pipeline and is free

