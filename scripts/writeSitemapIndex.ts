/**
 * Writes public/sitemap_index.xml and public/sitemap.xml from the sitemap files
 * that actually exist, so a new or regenerated sitemap is never left out.
 */
import fs from 'fs';
import path from 'path';

const SITE = 'https://xtsy.one';
const dir = path.resolve('public');
const today = new Date().toISOString().split('T')[0];
const ORDER = ['sitemap-static.xml', 'sitemap-hostel.xml', 'sitemap-tour-packages.xml', 'sitemap-tours.xml', 'sitemap-destinations.xml', 'sitemap-guides.xml', 'sitemap-programmatic.xml', 'sitemap-priority.xml', 'sitemap-dining.xml', 'sitemap-misc.xml', 'sitemap-images.xml'];
const files = fs.readdirSync(dir)
  .filter((f) => /^sitemap-.*\.xml$/.test(f))
  .filter((f) => (fs.readFileSync(path.join(dir, f), 'utf8').match(/<loc>/g) ?? []).length > 0)
  .sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99) || a.localeCompare(b));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files.map((f) => `  <sitemap>
    <loc>${SITE}/${f}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>
`;
fs.writeFileSync(path.join(dir, 'sitemap_index.xml'), xml);
fs.writeFileSync(path.join(dir, 'sitemap.xml'), xml);
console.log(`✅ sitemap_index.xml: ${files.join(', ')}`);
