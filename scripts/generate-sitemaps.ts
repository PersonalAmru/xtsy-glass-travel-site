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
  { path: '/faq', priority: '0.6', changefreq: 'monthly', lastmod: TODAY },
  { path: '/tours', priority: '0.9', changefreq: 'daily', lastmod: TODAY },
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
  { path: '/hotels-in-shillong', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/homestays-in-shillong', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/luxury-glamping-shillong', priority: '0.8', changefreq: 'weekly', lastmod: TODAY },
  { path: '/destination-wedding-shillong', priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
  { path: '/restaurant-in-shillong', priority: '0.7', changefreq: 'weekly', lastmod: TODAY },
  { path: '/things-to-do-in-meghalaya', priority: '0.9', changefreq: 'weekly', lastmod: TODAY },
  { path: '/meghalaya-tour-packages', priority: '0.9', changefreq: 'weekly', lastmod: TODAY },
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

  // Group SEO pages by sitemap category
  const sitemapGroups: Record<string, typeof ALL_SEO_PAGES> = {
    destinations: [],
    guides: [],
    tours: [],
    hostel: [],
    dining: [],
    misc: [],
  };

  for (const page of ALL_SEO_PAGES) {
    const cat = page.category;
    if (['destinations', 'attractions'].includes(cat)) {
      sitemapGroups.destinations.push(page);
    } else if (['travel-guides', 'itineraries', 'seasonal', 'events'].includes(cat)) {
      sitemapGroups.guides.push(page);
    } else if (['tours', 'activities'].includes(cat)) {
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

    const urls = pages.map(page => {
      const cfg = CATEGORY_CONFIG[page.category] || { priority: '0.6', changefreq: 'monthly' };
      // Determine URL path — programmatic pages use /:slug, destination pages use /places-to-visit/:slug
      const isDestination = page.category === 'destinations' || page.category === 'attractions';
      const urlPath = isDestination ? `/places-to-visit/${page.slug}` : `/${page.slug}`;
      return xmlUrl(`${BASE_URL}${urlPath}`, TODAY, cfg.changefreq, cfg.priority);
    });

    fs.writeFileSync(path.join(outDir, filename), wrapUrlset(urls));
  }

  // 3. Sitemap index
  fs.writeFileSync(path.join(outDir, 'sitemap_index.xml'), sitemapIndex(sitemapFiles));

  // 4. Also update the main sitemap.xml to be the sitemap index
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapIndex(sitemapFiles));

  console.log(`✅ Generated ${sitemapFiles.length} sitemaps with ${STATIC_ROUTES.length + ALL_SEO_PAGES.length} total URLs`);
  sitemapFiles.forEach(f => console.log(`   📄 ${f}`));
}

main().catch(console.error);
