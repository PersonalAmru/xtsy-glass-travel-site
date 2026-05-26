/**
 * AUTO SITEMAP GENERATOR
 * ----------------------
 * Generates `public/sitemap-priority.xml` and `public/sitemap-static.xml`
 * directly from the SEO registry on every deploy.
 *
 * Also cross-checks the GSC coverage drilldown (RECOVERY_LIVE_PAGES +
 * RECOVERY_FILTERED_OUT) and alerts (exit 2) if any flagged slug is missing
 * from the generated sitemap.
 */
import * as fs from 'fs';
import * as path from 'path';
import { ALL_SEO_PAGES } from '../src/data/seoPages';
import { STATIC_ROUTES } from '../src/utils/seoSlugRegistry';
import {
  RECOVERY_FILTERED_OUT,
  RECOVERY_LIVE_PAGES,
  RECOVERY_PLACES_PATHS,
} from '../src/data/seoAffectedSlugs';

const PUBLIC = path.join(__dirname, '..', 'public');
const HOST = 'https://xtsy.one';
const TODAY = new Date().toISOString().split('T')[0];

function xmlUrl(loc: string, priority: number, changefreq = 'weekly'): string {
  return `  <url>
    <loc>${HOST}${loc.startsWith('/') ? loc : '/' + loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

function wrap(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

// ── Static sitemap (hand-coded routes) ──
const staticUrls = STATIC_ROUTES.map(p =>
  xmlUrl(p, p === '/' ? 1.0 : 0.8, p === '/' ? 'daily' : 'weekly')
);
fs.writeFileSync(path.join(PUBLIC, 'sitemap-static.xml'), wrap(staticUrls));

// ── Priority sitemap (programmatic SEO + recovery list) ──
// Enforce: each URL appears in EXACTLY ONE sitemap branch.
// Curated branches "own" specific slugs; priority skips anything they list.
const OWNED_BY_OTHER_BRANCH: Set<string> = new Set();
const branchFiles = [
  'sitemap-destinations.xml', 'sitemap-guides.xml', 'sitemap-tours.xml',
  'sitemap-hostel.xml', 'sitemap-dining.xml', 'sitemap-misc.xml',
  'sitemap-programmatic.xml', 'sitemap-static.xml',
];
for (const f of branchFiles) {
  const p = path.join(PUBLIC, f);
  if (!fs.existsSync(p)) continue;
  const xml = fs.readFileSync(p, 'utf-8');
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    OWNED_BY_OTHER_BRANCH.add(m[1].trim().replace(/\/$/, ''));
  }
}

const priorityUrls: string[] = [];
const includedSlugs = new Set<string>();
const seenUrls = new Set<string>();
let skippedOwned = 0;
let skippedDupe = 0;

function pushUnique(url: string, priority: number) {
  const full = `${HOST}${url.startsWith('/') ? url : '/' + url}`.replace(/\/$/, '');
  if (OWNED_BY_OTHER_BRANCH.has(full)) { skippedOwned++; return; }
  if (seenUrls.has(full))               { skippedDupe++; return; }
  seenUrls.add(full);
  priorityUrls.push(xmlUrl(url, priority));
}

for (const page of ALL_SEO_PAGES) {
  const isDest = page.category === 'destinations' || page.category === 'attractions';
  const url = isDest ? `/places-to-visit/${page.slug}` : `/${page.slug}`;
  pushUnique(url, 1.0);
  includedSlugs.add(page.slug);
}

// Force-include recovery places-to-visit/* paths (still de-duped)
for (const placePath of RECOVERY_PLACES_PATHS) {
  pushUnique('/' + placePath, 0.9);
}

fs.writeFileSync(path.join(PUBLIC, 'sitemap-priority.xml'), wrap(priorityUrls));
console.log(` ↳ Skipped (owned by other branch) : ${skippedOwned}`);
console.log(` ↳ Skipped (in-branch duplicate)   : ${skippedDupe}`);

// ── Coverage cross-check ──
const coverageSlugs = [...RECOVERY_LIVE_PAGES, ...RECOVERY_FILTERED_OUT];
const missing = coverageSlugs.filter(s => !includedSlugs.has(s));

console.log('═══════════════════════════════════════════════');
console.log(' SITEMAP GENERATION REPORT');
console.log('═══════════════════════════════════════════════');
console.log(` Static URLs        : ${staticUrls.length}`);
console.log(` Priority URLs      : ${priorityUrls.length}`);
console.log(` GSC coverage slugs : ${coverageSlugs.length}`);
console.log(` Missing from map   : ${missing.length}`);
console.log('───────────────────────────────────────────────');

if (missing.length > 0) {
  console.error(' ⚠️  GSC coverage slugs missing from generated sitemap:');
  for (const s of missing) console.error('   - ' + s);
  process.exit(2);
}

console.log(' ✅ All GSC coverage slugs present in sitemap.');
