/**
 * public/sitemap-tour-packages.xml — every tour and signature-package detail page
 * (/tours/<slug>). These revenue pages were missing from all sitemaps.
 * Committed like the other curated sitemaps; re-run with `npm run sitemaps:tours`
 * (uses Bun, because the tour data imports .jpg assets) whenever tours change.
 */
import fs from 'fs';
import path from 'path';
import { getAllTours } from '../src/data/travelData';
import { SIGNATURE_PACKAGES } from '../src/data/signaturePackages';

const SITE = 'https://xtsy.one';
const today = new Date().toISOString().split('T')[0];
const toSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const slugs = new Set<string>();
for (const p of SIGNATURE_PACKAGES) slugs.add(p.slug);
for (const t of getAllTours()) slugs.add(toSlug(t.title));

const urls = [...slugs].sort().map((s) => `  <url>
    <loc>${SITE}/tours/${s}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${SIGNATURE_PACKAGES.some((p) => p.slug === s) ? '0.9' : '0.8'}</priority>
  </url>`);

fs.writeFileSync(path.resolve('public', 'sitemap-tour-packages.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`);
console.log(`✅ sitemap-tour-packages.xml: ${urls.length} URLs`);
