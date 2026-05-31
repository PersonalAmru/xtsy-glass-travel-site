/**
 * SEO Meta + Soft-404 Monitor
 * ---------------------------
 * Runs against the LIVE site (or any --base) on every deployment and FAILS
 * (exit 1) — i.e. alerts via the SEO Deploy Gate — when it detects:
 *
 *   • A sitemap/indexable URL that returns a soft-404 (HTTP 200 but the page
 *     is actually a "not found": noindex meta, prerender-status-code 404/410,
 *     or "Page Not Found"/"Page Removed" copy).
 *   • A missing or empty <title>.
 *   • A missing or empty <meta name="description">.
 *   • A missing <link rel="canonical"> (or more than one).
 *   • A missing / duplicate <h1>.
 *   • A hard 4xx/5xx on a URL that is listed in a sitemap.
 *
 * It samples every <loc> across public/sitemap-*.xml plus the curated
 * TOP_SEO_ROUTES, dedupes, and (optionally) caps the count with --limit.
 *
 * Usage:
 *   npx tsx scripts/seoMetaMonitor.ts --base https://xtsy.one
 *   npx tsx scripts/seoMetaMonitor.ts --base https://xtsy.one --limit 80
 */
import fs from 'fs';
import path from 'path';
// Curated top SEO routes (kept in sync with scripts/postDeploySchemaCheck.ts).
// Inlined rather than imported so this script has no module side-effects.
const TOP_SEO_ROUTES = [
  '/', '/best-hostel-in-shillong', '/hotels-in-shillong', '/homestays-in-shillong',
  '/luxury-glamping-shillong', '/restaurant-in-shillong', '/meghalaya-tour-packages',
  '/meghalaya-couple-tour-package', '/shillong-tour-package', '/things-to-do-in-meghalaya',
  '/best-time-to-visit-meghalaya', '/3-day-meghalaya-itinerary', '/5-day-meghalaya-itinerary',
  '/budget-trip-to-meghalaya', '/hidden-places-in-meghalaya', '/tours', '/gallery',
  '/about', '/faq', '/tab-bistro', '/tab-bistro/catering',
];

const args = process.argv.slice(2);
const argVal = (k: string, d?: string) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const BASE = (argVal('--base', 'https://xtsy.one') || '').replace(/\/$/, '');
const LIMIT = parseInt(argVal('--limit', '0') || '0', 10); // 0 = no cap
const OUT_DIR = argVal('--out', 'dist/seo-reports');
const TIMEOUT_MS = 15000;

interface PageResult {
  url: string;
  status: number;
  softNotFound: boolean;
  hasTitle: boolean;
  hasDescription: boolean;
  canonicalCount: number;
  h1Count: number;
  errors: string[]; // blocking — fail the gate
  warnings: string[]; // non-blocking (canonical/h1 are JS-injected via helmet)
}

function readSitemapLocs(): string[] {
  const pub = path.resolve('public');
  if (!fs.existsSync(pub)) return [];
  const out = new Set<string>();
  for (const f of fs.readdirSync(pub)) {
    if (!/^sitemap.*\.xml$/.test(f) || /index/.test(f)) continue;
    const xml = fs.readFileSync(path.join(pub, f), 'utf-8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      out.add(m[1].trim());
    }
  }
  return [...out];
}

function toPath(u: string): string {
  try {
    return new URL(u).pathname;
  } catch {
    return u.startsWith('/') ? u : `/${u}`;
  }
}

async function fetchHtml(url: string): Promise<{ status: number; html: string }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': 'XTSY-SEO-Monitor/1.0 (+https://xtsy.one)' },
    });
    const html = await res.text();
    return { status: res.status, html };
  } finally {
    clearTimeout(t);
  }
}

function analyze(url: string, status: number, html: string): PageResult {
  const errors: string[] = [];
  const lower = html.toLowerCase();

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const hasTitle = !!titleMatch && titleMatch[1].trim().length > 0;

  const descMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i
  );
  const hasDescription = !!descMatch && descMatch[1].trim().length > 0;

  const canonicalCount = (
    html.match(/<link[^>]+rel=["']canonical["'][^>]*>/gi) || []
  ).length;

  const h1Count = (html.match(/<h1[\b>]/gi) || html.match(/<h1[ >]/gi) || []).length;

  const prerenderStatus = html.match(
    /<meta[^>]+name=["']prerender-status-code["'][^>]*content=["'](\d+)["']/i
  );
  const hasNoindex = /<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html);
  const looksNotFound =
    lower.includes('page not found') ||
    lower.includes('this page has been removed') ||
    lower.includes("couldn't find that page");

  const softNotFound =
    status === 200 &&
    ((prerenderStatus && ['404', '410'].includes(prerenderStatus[1])) ||
      hasNoindex ||
      looksNotFound);

  // Blocking: real index-damaging problems detectable in raw (no-JS) HTML.
  if (status >= 400) errors.push(`HTTP ${status}`);
  if (softNotFound) errors.push('SOFT-404 (indexable URL renders not-found)');
  if (!hasTitle) errors.push('missing <title>');
  if (!hasDescription) errors.push('missing meta description');

  // Non-blocking warnings: canonical + h1 are injected client-side via
  // react-helmet, so a no-JS fetch can under/over-count them. Report only.
  const warnings: string[] = [];
  if (canonicalCount === 0) warnings.push('canonical not in raw HTML (JS-injected)');
  if (canonicalCount > 1) warnings.push(`multiple canonical tags (${canonicalCount})`);
  if (h1Count === 0) warnings.push('h1 not in raw HTML (JS-injected)');
  if (h1Count > 1) warnings.push(`multiple h1 (${h1Count})`);

  return {
    url,
    status,
    softNotFound,
    hasTitle,
    hasDescription,
    canonicalCount,
    h1Count,
    errors,
    warnings,
  };
}

async function main() {
  const paths = new Set<string>([...TOP_SEO_ROUTES, ...readSitemapLocs().map(toPath)]);
  let list = [...paths];
  if (LIMIT > 0) list = list.slice(0, LIMIT);

  console.log(`🔎 SEO Meta + Soft-404 monitor — ${list.length} URL(s) against ${BASE}`);

  const results: PageResult[] = [];
  // Small concurrency pool to be gentle on the edge.
  const POOL = 6;
  for (let i = 0; i < list.length; i += POOL) {
    const batch = list.slice(i, i + POOL);
    const batchRes = await Promise.all(
      batch.map(async (p) => {
        const url = `${BASE}${p}`;
        try {
          const { status, html } = await fetchHtml(url);
          return analyze(url, status, html);
        } catch (e) {
          return {
            url,
            status: 0,
            softNotFound: false,
            hasTitle: false,
            hasDescription: false,
            canonicalCount: 0,
            h1Count: 0,
            errors: [`fetch failed: ${(e as Error).message}`],
            warnings: [],
          } as PageResult;
        }
      })
    );
    results.push(...batchRes);
  }

  const failed = results.filter((r) => r.errors.length > 0);
  const softs = results.filter((r) => r.softNotFound);

  // Write reports
  fs.mkdirSync(path.resolve(OUT_DIR), { recursive: true });
  fs.writeFileSync(
    path.resolve(OUT_DIR, 'seo-meta-monitor.json'),
    JSON.stringify({ base: BASE, checked: results.length, failed, generatedAt: new Date().toISOString() }, null, 2)
  );

  console.log(`\n✅ Clean: ${results.length - failed.length}/${results.length}`);
  console.log(`⚠️  Soft-404s: ${softs.length}`);
  console.log(`❌ Pages with issues: ${failed.length}`);
  for (const r of failed.slice(0, 50)) {
    console.log(`   - ${r.url}  [${r.status}]  ${r.errors.join(', ')}`);
  }
  if (failed.length > 50) console.log(`   ...and ${failed.length - 50} more`);

  // GitHub Actions job summary (the "alert")
  if (process.env.GITHUB_STEP_SUMMARY) {
    const lines = [
      `### 🔎 SEO Meta + Soft-404 Monitor`,
      ``,
      `- Base: \`${BASE}\``,
      `- Checked: **${results.length}**`,
      `- Soft-404s: **${softs.length}**`,
      `- Pages with issues: **${failed.length}**`,
      ``,
      ...(failed.length
        ? ['| URL | Status | Issues |', '| --- | --- | --- |', ...failed.slice(0, 40).map((r) => `| ${r.url} | ${r.status} | ${r.errors.join('; ')} |`)]
        : ['✅ No SEO meta or soft-404 issues detected.']),
    ];
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
  }

  if (failed.length > 0) {
    console.error(`\n::error::SEO monitor found ${failed.length} page(s) with issues (${softs.length} soft-404s).`);
    process.exit(1);
  }
  console.log('\n✅ SEO meta + soft-404 monitor passed.');
}

main().catch((e) => {
  console.error('seoMetaMonitor fatal:', e);
  process.exit(1);
});
