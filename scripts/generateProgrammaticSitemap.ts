/**
 * Generates `public/sitemap-programmatic.xml` from the FILTERED page set.
 * Run as part of build to keep crawler discovery aligned with the
 * quality-filtered ~200 page surface.
 */
import fs from 'fs';
import path from 'path';

async function main() {
  const { ALL_SEO_PAGES } = await import('../src/data/seoPages');
  const today = new Date().toISOString().split('T')[0];
  const SITE = 'https://xtsy.one';

  // De-dupe by slug — ALL_SEO_PAGES can contain repeats after merges.
  const seen = new Set<string>();
  const unique: any[] = [];
  for (const p of ALL_SEO_PAGES as any[]) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    unique.push(p);
  }

  const urls = unique.map(p => `  <url>
    <loc>${SITE}/${p.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  const outPath = path.resolve(process.cwd(), 'public', 'sitemap-programmatic.xml');
  fs.writeFileSync(outPath, xml, 'utf-8');
  console.log(`✅ sitemap-programmatic.xml: ${unique.length} unique URLs (de-duped from ${ALL_SEO_PAGES.length})`);
}

main().catch(e => { console.error(e); process.exit(1); });
