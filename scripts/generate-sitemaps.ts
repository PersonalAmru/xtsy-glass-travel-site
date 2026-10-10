/**
 * Dynamic Sitemap Generator
 * Generates sitemap index + category sitemaps from the SEO page registry
 * Run: npx tsx scripts/generate-sitemaps.ts
 */

const BASE_URL = 'https://xtsy.one';
const TODAY = new Date().toISOString().split('T')[0];

// Category → priority & changefreq mapping
const CATEGORY_CONFIG: Record<string, { priority: string; changefreq: string }> = {
  'destinations': { priority: '0.8', changefreq: 'weekly' },
  'attractions': { priority: '0.7', changefreq: 'weekly' },
  'travel-guides': { priority: '0.9', changefreq: 'weekly' },
  'hostels': { priority: '0.8', changefreq: 'weekly' },
  'hotels': { priority: '0.8', changefreq: 'weekly' },
  'homestays': { priority: '0.7', changefreq: 'weekly' },
  'glamping': { priority: '0.7', changefreq: 'weekly' },
  'accommodation': { priority: '0.7', changefreq: 'weekly' },
  'tours': { priority: '0.9', changefreq: 'daily' },
  'itineraries': { priority: '0.8', changefreq: 'weekly' },
  'activities': { priority: '0.7', changefreq: 'weekly' },
  'restaurants': { priority: '0.7', changefreq: 'weekly' },
  'rentals': { priority: '0.7', changefreq: 'weekly' },
  'transport': { priority: '0.6', changefreq: 'monthly' },
  'competitor-capture': { priority: '0.6', changefreq: 'monthly' },
  'food-dining': { priority: '0.7', changefreq: 'weekly' },
  'seasonal': { priority: '0.7', changefreq: 'monthly' },
  'events': { priority: '0.7', changefreq: 'monthly' },
  'travel-agency': { priority: '0.7', changefreq: 'monthly' },
  'hospitals': { priority: '0.6', changefreq: 'monthly' },
  'weddings': { priority: '0.7', changefreq: 'monthly' },
};

// Static routes with their config
const STATIC_ROUTES: { path: string; priority: string; changefreq: string; lastmod: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'daily', lastmod: TODAY },
  { path: '/about', priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { path: '/gallery', priority: '0.7', changefreq: 'weekly', lastmod: TODAY },
  { path: '/guides', priority: '0.7', changefreq: 'weekly', lastmod: TODAY },
  { path: '/faq', priority: '0.6', changefreq: 'monthly', lastmod: TODAY },
  { path: '/safety-house-rules', priority: '0.6', changefreq: 'monthly', lastmod: TODAY },
  { path: '/tours', priority: '0.9', changefreq: 'daily', lastmod: TODAY },
  { path: '/expeditions', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/adventure-tours-northeast-india', priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { path: '/meghalaya-adventure-tour', priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { path: '/motorbike-expedition-northeast-india', priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { path: '/4x4-expedition-meghalaya', priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { path: '/merch', priority: '0.6', changefreq: 'monthly', lastmod: TODAY },
  { path: '/plan-trip-with-ai', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/travel', priority: '0.9', changefreq: 'daily', lastmod: TODAY },
  { path: '/xtsy-270', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/xtsy-rentals', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/work-from-home', priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { path: '/female-travellers', priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { path: '/pet-friendly', priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { path: '/tab-bistro', priority: '0.7', changefreq: 'weekly', lastmod: TODAY },
  { path: '/xtsy-vs-zostel', priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { path: '/book', priority: '0.9', changefreq: 'daily', lastmod: TODAY },
  { path: '/best-hostel-in-shillong', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/cheap-hostels-shillong', priority: '0.9', changefreq: 'weekly', lastmod: TODAY },
  { path: '/hotels-in-shillong', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/homestays-in-shillong', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/luxury-glamping-shillong', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/destination-wedding-shillong', priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { path: '/restaurant-in-shillong', priority: '0.7', changefreq: 'weekly', lastmod: TODAY },
  { path: '/things-to-do-in-meghalaya', priority: '0.9', changefreq: 'weekly', lastmod: TODAY },
  { path: '/meghalaya-tour-packages', priority: '0.9', changefreq: 'weekly', lastmod: TODAY },
  { path: '/group-bookings-meghalaya', priority: '0.9', changefreq: 'weekly', lastmod: TODAY },
  { path: '/meghalaya-couple-tour-package', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/shillong-tour-package', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/meghalaya-photo-gallery', priority: '0.7', changefreq: 'weekly', lastmod: TODAY },
  { path: '/best-time-to-visit-meghalaya', priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { path: '/hidden-places-in-meghalaya', priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { path: '/3-day-meghalaya-itinerary', priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { path: '/5-day-meghalaya-itinerary', priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { path: '/budget-trip-to-meghalaya', priority: '0.8', changefreq: 'monthly', lastmod: TODAY },
  { path: '/meghalaya-waterfalls', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/meghalaya-caves', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/meghalaya-villages', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/meghalaya-viewpoints', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly', lastmod: TODAY },
  { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly', lastmod: TODAY },
  { path: '/pricing-cancellation-policy', priority: '0.4', changefreq: 'monthly', lastmod: TODAY },
  { path: '/all-pages', priority: '0.5', changefreq: 'weekly', lastmod: TODAY },
];

function xmlUrl(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function wrapUrlset(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
}

function sitemapIndex(sitemaps: string[]): string {
  const entries = sitemaps.map(s =>
    `  <sitemap>\n    <loc>${BASE_URL}/${s}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </sitemap>`
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</sitemapindex>`;
}

async function main() {
  // Dynamic import of SEO data (ESM modules with TypeScript)
  const { ALL_SEO_PAGES } = await import('../src/data/seoPages');
  const { buildDestinationSitemapPaths, destinationPath } = await import('../src/data/neTaxonomy');
  const { getDestinationBySlug } = await import('../src/data/meghalayaDestinations');

  // Group SEO pages by sitemap category
  const sitemapGroups: Record<string, typeof ALL_SEO_PAGES> = {
    destinations: [],
    guides: [],
    tours: [],
    hostel: [],
    dining: [],
    misc: [],
  };

  const { isIndexableSEOSlug } = await import('../src/data/seoIndexPolicy');
  for (const page of ALL_SEO_PAGES) {
    if (!isIndexableSEOSlug(page.slug)) continue;
    const cat = page.category;
    if (['destinations', 'attractions'].includes(cat)) {
      sitemapGroups.destinations.push(page);
    } else if (['travel-guides', 'itineraries', 'seasonal', 'events'].includes(cat)) {
      sitemapGroups.guides.push(page);
    } else if (['tours', 'activities', 'group-tours', 'corporate', 'themed-trips', 'road-bike-trips'].includes(cat)) {
      sitemapGroups.tours.push(page);
    } else if (['hostels', 'hotels', 'homestays', 'glamping', 'accommodation', 'hospitals', 'weddings'].includes(cat)) {
      sitemapGroups.hostel.push(page);
    } else if (['restaurants', 'food-dining'].includes(cat)) {
      sitemapGroups.dining.push(page);
    } else {
      sitemapGroups.misc.push(page);
    }
  }

  const fs = await import('fs');
  const path = await import('path');
  const outDir = path.resolve(process.cwd(), 'public');

  // 1. Static sitemap
  const staticUrls = STATIC_ROUTES.map(r =>
    xmlUrl(`${BASE_URL}${r.path}`, r.lastmod, r.changefreq, r.priority)
  );
  fs.writeFileSync(path.join(outDir, 'sitemap-static.xml'), wrapUrlset(staticUrls));

  // 2. Category sitemaps
  const sitemapFiles = ['sitemap-static.xml'];

  for (const [group, pages] of Object.entries(sitemapGroups)) {
    if (pages.length === 0) continue;
    const filename = `sitemap-${group}.xml`;
    sitemapFiles.push(filename);

    const urls: string[] = [];
    for (const page of pages) {
      const cfg = CATEGORY_CONFIG[page.category] || { priority: '0.6', changefreq: 'monthly' };
      // Determine URL path — programmatic pages use /:slug, destination pages use /places-to-visit/:slug
      // Destination/attraction pages live in the hierarchical taxonomy:
      // /destinations/:state/:city/:attraction (legacy /places-to-visit/* now 301s).
      const isDestination = page.category === 'destinations' || page.category === 'attractions';
      let urlPath = `/${page.slug}`;
      if (isDestination) {
        // Resolve aliases to their canonical attraction, then to the hierarchy.
        const dest = getDestinationBySlug(page.slug);
        if (!dest) continue; // no canonical attraction → covered by the hub pages
        urlPath = destinationPath(dest.slug);
      }
      urls.push(xmlUrl(`${BASE_URL}${urlPath}`, TODAY, cfg.changefreq, cfg.priority));
    }

    if (group === 'destinations') {
      // Hierarchy hubs: /destinations, /destinations/:state, /destinations/:state/:city
      for (const hubPath of buildDestinationSitemapPaths()) {
        const depth = hubPath.split('/').filter(Boolean).length;
        const priority = depth === 1 ? '0.9' : depth === 2 ? '0.8' : depth === 3 ? '0.7' : '0.7';
        urls.push(xmlUrl(`${BASE_URL}${hubPath}`, TODAY, 'weekly', priority));
      }
    }

    // De-duplicate by <loc> — a URL must appear exactly once per sitemap.
    const seen = new Set<string>();
    const deduped = urls.filter(u => {
      const loc = /<loc>([^<]+)<\/loc>/.exec(u)?.[1] ?? u;
      if (seen.has(loc)) return false;
      seen.add(loc);
      return true;
    });

    fs.writeFileSync(path.join(outDir, filename), wrapUrlset(deduped));
  }

  // 3. Sitemap index
  fs.writeFileSync(path.join(outDir, 'sitemap_index.xml'), sitemapIndex(sitemapFiles));
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapIndex(sitemapFiles));

  // 4. Cross-check against prerender manifest (if available) — flags drift
  const distManifest = path.resolve(process.cwd(), 'dist/prerender-manifest.json');
  if (fs.existsSync(distManifest)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(distManifest, 'utf-8'));
      const sitemapSlugs = new Set(ALL_SEO_PAGES.map(p => p.slug));
      const manifestSlugs = new Set<string>(manifest.slugs || []);
      const missing: string[] = [];
      manifestSlugs.forEach(s => { if (!sitemapSlugs.has(s)) missing.push(s); });
      if (missing.length) {
        console.warn(`⚠️  ${missing.length} prerender slugs missing from sitemap:`, missing.slice(0, 10));
      } else {
        console.log('🔗 Sitemap ↔ prerender manifest: in sync');
      }
    } catch (e) {
      console.warn('⚠️  Could not cross-check prerender manifest:', (e as Error).message);
    }
  }

  // 5. Regenerate robots.txt — references the canonical sitemap index
  const robots = `# XTSY Travel — robots.txt (auto-generated ${TODAY})
# Canonical: https://xtsy.one
# Total indexable URLs: ${STATIC_ROUTES.length + ALL_SEO_PAGES.length}

# ── Search engines ───────────────────────────────────────────────
User-agent: Googlebot
Allow: /
Allow: /places-to-visit/
Disallow: /admin
Disallow: /admin-login
Disallow: /all-pages
Disallow: /franchise
Disallow: /franchise-login
Disallow: /api/

User-agent: Bingbot
Allow: /
Allow: /places-to-visit/
Disallow: /admin
Disallow: /admin-login
Disallow: /all-pages
Disallow: /franchise
Disallow: /franchise-login

User-agent: Yandex
Allow: /
Allow: /places-to-visit/
Disallow: /admin
Disallow: /franchise
Crawl-delay: 2

User-agent: Baiduspider
Allow: /
Allow: /places-to-visit/
Disallow: /admin
Disallow: /franchise

User-agent: NaverBot
Allow: /
Allow: /places-to-visit/
Disallow: /admin
Disallow: /franchise

User-agent: DuckDuckBot
Allow: /

User-agent: Sogou
Allow: /
Disallow: /admin
Disallow: /franchise

User-agent: Applebot
Allow: /

# ── Social previews ──────────────────────────────────────────────
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: PinterestBot
Allow: /

# ── AI crawlers & answer engines (explicitly welcomed) ───────────
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Claude-User
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Meta-ExternalFetcher
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: MistralAI-User
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: YouBot
Allow: /

User-agent: ImagesiftBot
Allow: /

User-agent: Diffbot
Allow: /

User-agent: Timpibot
Allow: /

User-agent: CCBot
Allow: /

# ── Default ──────────────────────────────────────────────────────
User-agent: *
Allow: /
Allow: /places-to-visit/
Disallow: /admin
Disallow: /admin-login
Disallow: /all-pages
Disallow: /franchise
Disallow: /franchise-login
Disallow: /api/

# Sitemap
Sitemap: https://xtsy.one/sitemap_index.xml
Sitemap: https://xtsy.one/sitemap.xml
`;
  fs.writeFileSync(path.join(outDir, 'robots.txt'), robots);

  console.log(`\n✅ Generated ${sitemapFiles.length} sitemaps with ${STATIC_ROUTES.length + ALL_SEO_PAGES.length} total URLs`);
  sitemapFiles.forEach(f => console.log(`   📄 ${f}`));
  console.log(`   📄 robots.txt (${(robots.length / 1024).toFixed(1)} KB)`);
}

main().catch(err => {
  console.error('❌ Sitemap generation failed:', err);
  process.exit(1);
});
