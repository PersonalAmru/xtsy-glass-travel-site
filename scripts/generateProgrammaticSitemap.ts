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

  // Slugs already owned by curated branches — never re-emit here.
  const CURATED = [
    'sitemap-destinations.xml', 'sitemap-guides.xml', 'sitemap-tours.xml',
    'sitemap-hostel.xml', 'sitemap-dining.xml', 'sitemap-misc.xml',
    'sitemap-static.xml',
  ];
  const owned = new Set<string>();
  for (const f of CURATED) {
    const p = path.resolve(process.cwd(), 'public', f);
    if (!fs.existsSync(p)) continue;
    const xml = fs.readFileSync(p, 'utf-8');
    const re = /<loc>([^<]+)<\/loc>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml))) owned.add(m[1].trim().replace(/\/$/, ''));
  }

  const seen = new Set<string>();
  const unique: any[] = [];
  let skippedOwned = 0;
  for (const p of ALL_SEO_PAGES as any[]) {
    if (seen.has(p.slug)) continue;
    const full = `${SITE}/${p.slug}`;
    if (owned.has(full)) { skippedOwned++; continue; }
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
  console.log(`✅ sitemap-programmatic.xml: ${unique.length} URLs (skipped ${skippedOwned} owned by curated branches)`);
}

main().catch(e => { console.error(e); process.exit(1); });
