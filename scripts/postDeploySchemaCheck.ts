/**
 * Post-deploy SEO Schema Validator
 * --------------------------------
 * Re-fetches every prerendered route over HTTP and verifies:
 *   1. HTTP 200 (or expected 410 for GONE_SLUGS)
 *   2. Has at least one <script type="application/ld+json"> block
 *   3. JSON-LD parses + every block has @context + @type
 *   4. If page is meant to have FAQs (route in FAQ_ROUTES or HTML contains
 *      "Frequently Asked"), confirms a valid FAQPage block with ≥1 question.
 *   5. <title>, <meta description>, canonical, h1 are non-empty.
 *
 * Outputs HTML + JSON to dist/seo-reports/post-deploy-schema.* (or
 * --out path). Exits 1 on errors so CI can block.
 *
 * Usage:
 *   npx tsx scripts/postDeploySchemaCheck.ts                  (build-time, dist/)
 *   npx tsx scripts/postDeploySchemaCheck.ts --base https://xtsy.one --routes top
 */
import fs from 'fs';
import path from 'path';

interface RouteResult {
  route: string;
  status: number;
  hasJsonLd: boolean;
  jsonLdCount: number;
  hasFAQ: boolean;
  faqQuestions: number;
  hasTitle: boolean;
  hasDescription: boolean;
  hasCanonical: boolean;
  canonicalCount: number;
  hasH1: boolean;
  errors: string[];
  warnings: string[];
}

const args = process.argv.slice(2);
const argVal = (k: string, d?: string) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const BASE = argVal('--base', '');
const OUT_DIR = argVal('--out', 'dist/seo-reports');
const MODE = argVal('--routes', 'all'); // all | top
const TIMEOUT_MS = 15000;

// Top SEO routes (kept short — used by post-deploy + Lighthouse CI)
export const TOP_SEO_ROUTES = [
  '/',
  '/best-hostel-in-shillong',
  '/hotels-in-shillong',
  '/homestays-in-shillong',
  '/luxury-glamping-shillong',
  '/restaurant-in-shillong',
  '/meghalaya-tour-packages',
  '/meghalaya-couple-tour-package',
  '/shillong-tour-package',
  '/things-to-do-in-meghalaya',
  '/best-time-to-visit-meghalaya',
  '/3-day-meghalaya-itinerary',
  '/5-day-meghalaya-itinerary',
  '/budget-trip-to-meghalaya',
  '/hidden-places-in-meghalaya',
  '/tours',
  '/gallery',
  '/about',
  '/faq',
];

// Routes that MUST have a FAQPage block.
const FAQ_REQUIRED = new Set<string>([
  '/best-hostel-in-shillong',
  '/hotels-in-shillong',
  '/meghalaya-tour-packages',
  '/shillong-tour-package',
  '/faq',
  '/things-to-do-in-meghalaya',
]);

function discoverRoutes(): string[] {
  if (MODE === 'top') return TOP_SEO_ROUTES;
  // Build-time: enumerate dist/*/index.html and add '/'
  const dist = path.resolve('dist');
  if (!fs.existsSync(dist)) return TOP_SEO_ROUTES;
  const out: string[] = ['/'];
  for (const e of fs.readdirSync(dist, { withFileTypes: true })) {
    if (e.isDirectory() && fs.existsSync(path.join(dist, e.name, 'index.html'))) {
      out.push('/' + e.name);
    }
  }
  return out;
}

async function fetchRoute(route: string): Promise<{ status: number; html: string }> {
  if (BASE) {
    const url = BASE.replace(/\/$/, '') + route;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: { 'User-Agent': 'XTSY-PostDeployValidator/1.0 (+seo-audit)' },
      });
      const html = await res.text();
      return { status: res.status, html };
    } finally { clearTimeout(t); }
  }
  // Build-time: read from dist/
  const slug = route.replace(/^\//, '');
  const file = slug ? path.resolve('dist', slug, 'index.html') : path.resolve('dist/index.html');
  if (!fs.existsSync(file)) return { status: 404, html: '' };
  return { status: 200, html: fs.readFileSync(file, 'utf-8') };
}

function extract(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function validateRoute(route: string, status: number, html: string): RouteResult {
  const r: RouteResult = {
    route, status,
    hasJsonLd: false, jsonLdCount: 0,
    hasFAQ: false, faqQuestions: 0,
    hasTitle: false, hasDescription: false, hasCanonical: false, canonicalCount: 0, hasH1: false,
    errors: [], warnings: [],
  };

  if (status >= 400) { r.errors.push(`HTTP ${status}`); return r; }

  r.hasTitle = !!extract(html, /<title>([^<]+)<\/title>/i);
  r.hasDescription = /<meta\s+name=["']description["']\s+content=["'][^"']{10,}["']/i.test(html);
  r.canonicalCount = (html.match(/<link\s+rel=["']canonical["']/gi) || []).length;
  r.hasCanonical = r.canonicalCount > 0;
  r.hasH1 = /<h1[^>]*>[\s\S]*?\S[\s\S]*?<\/h1>/i.test(html);

  if (!r.hasTitle) r.errors.push('Missing <title>');
  if (!r.hasDescription) r.errors.push('Missing meta description');
  if (!r.hasCanonical) r.errors.push('Missing canonical link');
  if (r.canonicalCount !== 1) r.errors.push(`Expected exactly one canonical; found ${r.canonicalCount}: ${(html.match(/<link\s+rel=["']canonical["'][^>]*>/gi) || []).join(' ')}`);
  if (/\(1970\)|1970-01-01/i.test(html)) r.errors.push('Epoch year 1970 found in public HTML');
  if (!r.hasH1) r.warnings.push('No <h1> in static HTML (may be injected by SEO body script)');

  const ldRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = ldRe.exec(html))) {
    r.jsonLdCount++;
    const raw = m[1].trim();
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch (e) {
      r.errors.push(`JSON-LD #${r.jsonLdCount} unparseable: ${(e as Error).message.slice(0, 80)}`);
      continue;
    }
    const top = Array.isArray(parsed) ? parsed : [parsed];
    // A {"@context", "@graph": [...]} block holds several nodes that share its @context.
    const blocks: any[] = top.flatMap((b: any) =>
      Array.isArray(b?.['@graph']) ? b['@graph'].map((n: any) => ({ '@context': b['@context'], ...n })) : [b]);
    for (const b of blocks) {
      if (!b['@context']) r.errors.push('JSON-LD block missing @context');
      if (!b['@type']) r.errors.push('JSON-LD block missing @type');
      if (b['@type'] === 'FAQPage') {
        r.hasFAQ = true;
        const q = Array.isArray(b.mainEntity) ? b.mainEntity : [];
        r.faqQuestions += q.length;
        for (const item of q) {
          if (!item.name || !item.acceptedAnswer?.text) {
            r.errors.push('FAQPage question missing name/acceptedAnswer.text');
          }
        }
        if (!q.length) r.errors.push('FAQPage block has zero questions');
      }
    }
  }
  r.hasJsonLd = r.jsonLdCount > 0;
  if (!r.hasJsonLd) r.errors.push('No JSON-LD blocks found');

  const looksLikeFaqPage = FAQ_REQUIRED.has(route) || /Frequently Asked/i.test(html);
  if (looksLikeFaqPage && !r.hasFAQ) r.errors.push('Page advertises FAQs but has no FAQPage JSON-LD');
  if (looksLikeFaqPage && r.hasFAQ && r.faqQuestions < 3) r.warnings.push(`FAQPage has only ${r.faqQuestions} question(s) (recommend ≥3)`);

  return r;
}

async function main() {
  const routes = discoverRoutes();
  console.log(`🔍 Validating ${routes.length} route(s) ${BASE ? `against ${BASE}` : '(local dist/)'}\n`);

  const results: RouteResult[] = [];
  // Limit concurrency to avoid hammering origin
  const CONCURRENCY = BASE ? 6 : 20;
  let i = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (i < routes.length) {
      const route = routes[i++];
      try {
        const { status, html } = await fetchRoute(route);
        const r = validateRoute(route, status, html);
        results.push(r);
        process.stdout.write(r.errors.length ? '✗' : '·');
      } catch (e) {
        results.push({
          route, status: 0,
          hasJsonLd: false, jsonLdCount: 0, hasFAQ: false, faqQuestions: 0,
          hasTitle: false, hasDescription: false, hasCanonical: false, canonicalCount: 0, hasH1: false,
          errors: [`Fetch failed: ${(e as Error).message}`], warnings: [],
        });
        process.stdout.write('!');
      }
    }
  }));
  console.log('\n');

  results.sort((a, b) => a.route.localeCompare(b.route));
  const errored = results.filter(r => r.errors.length);
  const warned = results.filter(r => r.warnings.length && !r.errors.length);

  // Reports
  const outDir = path.resolve(OUT_DIR);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'post-deploy-schema.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), base: BASE || 'local', total: results.length, errored: errored.length, warned: warned.length, results }, null, 2));

  const html = renderHtml(results, BASE);
  fs.writeFileSync(path.join(outDir, 'post-deploy-schema.html'), html);

  console.log(`📊 ${results.length} routes · ${errored.length} errored · ${warned.length} warning-only`);
  console.log(`📝 ${path.relative(process.cwd(), outDir)}/post-deploy-schema.{html,json}\n`);

  if (errored.length) {
    console.error('❌ Errors found in:');
    errored.slice(0, 20).forEach(r => console.error(`   ${r.route} → ${r.errors.join(' | ')}`));
    process.exit(1);
  }
  console.log('✅ All routes pass schema/FAQ validation.');
}

function renderHtml(rs: RouteResult[], base: string): string {
  const row = (r: RouteResult) => {
    const cls = r.errors.length ? 'err' : r.warnings.length ? 'warn' : 'ok';
    const url = base ? `${base.replace(/\/$/, '')}${r.route}` : r.route;
    return `<tr class="${cls}">
      <td><a href="${url}" target="_blank" rel="noopener">${r.route}</a></td>
      <td>${r.status}</td>
      <td>${r.jsonLdCount}</td>
      <td>${r.hasFAQ ? `✅ ${r.faqQuestions}` : '—'}</td>
      <td>${r.hasTitle ? '✅' : '❌'}/${r.hasDescription ? '✅' : '❌'}/${r.hasCanonical ? '✅' : '❌'}/${r.hasH1 ? '✅' : '⚠️'}</td>
      <td>${r.errors.map(e => `<div class="msg err">❌ ${e}</div>`).join('')}${r.warnings.map(w => `<div class="msg warn">⚠️ ${w}</div>`).join('')}</td>
    </tr>`;
  };
  return `<!doctype html><html><head><meta charset="utf-8"><title>XTSY Post-Deploy Schema Report</title>
<style>
body{font-family:-apple-system,system-ui,sans-serif;background:#0f172a;color:#e2e8f0;margin:0;padding:24px}
h1{color:#fff}
table{width:100%;border-collapse:collapse;background:#1e293b;border-radius:8px;overflow:hidden}
th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #334155;font-size:13px;vertical-align:top}
th{background:#0f172a;color:#94a3b8;text-transform:uppercase;font-size:11px;letter-spacing:.05em}
tr.err{background:rgba(239,68,68,.08)}
tr.warn{background:rgba(234,179,8,.06)}
tr.ok td:first-child{color:#10b981}
.msg{font-size:12px;margin:2px 0}
.msg.err{color:#fca5a5}
.msg.warn{color:#fde68a}
a{color:#60a5fa;text-decoration:none}
.summary{display:flex;gap:16px;margin:16px 0}
.kpi{background:#1e293b;padding:16px;border-radius:8px;flex:1}
.kpi b{display:block;font-size:24px;color:#fff}
</style></head><body>
<h1>XTSY · Post-Deploy Schema & FAQ Report</h1>
<p>Base: <code>${base || 'local dist/'}</code> · Generated ${new Date().toISOString()}</p>
<div class="summary">
  <div class="kpi"><span>Total routes</span><b>${rs.length}</b></div>
  <div class="kpi"><span>Errored</span><b style="color:#fca5a5">${rs.filter(r => r.errors.length).length}</b></div>
  <div class="kpi"><span>Warnings</span><b style="color:#fde68a">${rs.filter(r => r.warnings.length && !r.errors.length).length}</b></div>
  <div class="kpi"><span>FAQPage blocks</span><b>${rs.filter(r => r.hasFAQ).length}</b></div>
</div>
<table>
  <thead><tr><th>Route</th><th>HTTP</th><th>JSON-LD</th><th>FAQ</th><th>T/D/C/H1</th><th>Issues</th></tr></thead>
  <tbody>${rs.map(row).join('')}</tbody>
</table></body></html>`;
}

main().catch(e => { console.error(e); process.exit(2); });
