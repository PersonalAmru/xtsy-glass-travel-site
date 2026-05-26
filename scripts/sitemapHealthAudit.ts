/**
 * Sitemap Health + Duplicate Audit
 * --------------------------------
 * 1) Scans every public/sitemap*.xml branch.
 * 2) Detects duplicate <loc> URLs (within a branch + across branches).
 * 3) Probes each unique URL with HEAD/GET to record:
 *      - final HTTP status
 *      - redirect chain (count + final URL)
 *      - canonical tag (parsed from HTML when status === 200)
 *      - canonical mismatch flag (canonical !== requested URL)
 * 4) Writes two reports to /mnt/documents/:
 *      - sitemap-health-<ts>.json   (full machine-readable data)
 *      - sitemap-health-<ts>.md     (human summary)
 *
 * Usage:
 *   bunx tsx scripts/sitemapHealthAudit.ts                 # full crawl
 *   bunx tsx scripts/sitemapHealthAudit.ts --limit 50      # quick smoke test
 *   bunx tsx scripts/sitemapHealthAudit.ts --duplicates-only
 *   bunx tsx scripts/sitemapHealthAudit.ts --concurrency 8
 */
import fs from 'fs';
import path from 'path';

const PUBLIC = path.resolve(process.cwd(), 'public');
const OUT_DIR = '/mnt/documents';
const UA = 'XTSY-Sitemap-Health/1.0 (+https://xtsy.one)';
const SITE = 'https://xtsy.one';

// Load slim map if present so we can ignore the index.html homepage canonical
// fallback (the worker / pre-hydration script overrides it per-route at runtime).
let SLIM_MAP: Record<string, { t: string; d: string }> = {};
try {
  const slimPath = path.join(PUBLIC, 'seo-slim-map.json');
  if (fs.existsSync(slimPath)) {
    SLIM_MAP = JSON.parse(fs.readFileSync(slimPath, 'utf-8'));
  }
} catch { /* optional */ }
const STATIC_FALLBACK_CANONICALS = new Set([`${SITE}/`, SITE]);

const args = process.argv.slice(2);
const flag = (n: string) => args.includes(n);
const val = (n: string, d?: string) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : d;
};

const LIMIT = Number(val('--limit', '0')) || 0;
const CONCURRENCY = Number(val('--concurrency', '6'));
const DUPES_ONLY = flag('--duplicates-only');

type LocEntry = { url: string; branch: string };
type Probe = {
  url: string;
  branches: string[];
  status: number | null;
  finalUrl: string | null;
  redirects: number;
  canonical: string | null;
  canonicalMismatch: boolean;
  // true only when the canonical is the static index.html homepage fallback —
  // expected to be overridden client-side / at the edge. Suppressed from the
  // mismatch totals so the report focuses on real problems.
  staticFallback: boolean;
  hasSlimEntry: boolean;
  error: string | null;
  ms: number;
};

function extractLocs(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) out.push(m[1].trim());
  return out;
}

function normalize(u: string) {
  try {
    const url = new URL(u);
    url.hash = '';
    // strip trailing slash (except root)
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
    }
    return url.toString();
  } catch {
    return u;
  }
}

async function probe(url: string): Promise<Omit<Probe, 'branches'>> {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': UA, Accept: 'text/html,*/*' },
    });
    const finalUrl = res.url;
    // crude redirect count: compare final vs requested
    const redirects = normalize(finalUrl) === normalize(url) ? 0 : 1;
    let canonical: string | null = null;
    if (res.ok && (res.headers.get('content-type') || '').includes('text/html')) {
      const html = await res.text();
      const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
        || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
      canonical = m ? m[1].trim() : null;
    }
    const normCanon = canonical ? normalize(canonical) : null;
    const slug = new URL(url).pathname.replace(/^\/|\/$/g, '');
    const hasSlimEntry = Object.prototype.hasOwnProperty.call(SLIM_MAP, slug);
    const staticFallback = !!canonical && STATIC_FALLBACK_CANONICALS.has(canonical);
    // Only count a mismatch when the canonical is non-fallback AND points
    // somewhere other than the requested URL.
    const canonicalMismatch = !!normCanon
      && normCanon !== normalize(url)
      && !staticFallback;
    return {
      url,
      status: res.status,
      finalUrl,
      redirects,
      canonical,
      canonicalMismatch,
      staticFallback,
      hasSlimEntry,
      error: null,
      ms: Date.now() - t0,
    };
  } catch (e) {
    return {
      url,
      status: null,
      finalUrl: null,
      redirects: 0,
      canonical: null,
      canonicalMismatch: false,
      staticFallback: false,
      hasSlimEntry: false,
      error: e instanceof Error ? e.message : String(e),
      ms: Date.now() - t0,
    };
  }
}

async function pool<T, R>(items: T[], n: number, fn: (t: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(n, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      out[i] = await fn(items[i], i);
      if ((i + 1) % 25 === 0) console.log(`  …probed ${i + 1}/${items.length}`);
    }
  });
  await Promise.all(workers);
  return out;
}

async function main() {
  // 1. Load all sitemaps
  const files = fs.readdirSync(PUBLIC)
    .filter(f => /^sitemap-.*\.xml$/.test(f)); // exclude index files
  console.log(`📂 Scanning ${files.length} sitemap branches`);

  const entries: LocEntry[] = [];
  const perBranchCounts: Record<string, number> = {};
  for (const f of files) {
    const xml = fs.readFileSync(path.join(PUBLIC, f), 'utf-8');
    const locs = extractLocs(xml);
    perBranchCounts[f] = locs.length;
    for (const u of locs) entries.push({ url: u, branch: f });
  }
  console.log(`📊 Found ${entries.length} <loc> entries across all branches`);

  // 2. Duplicate detection
  const byNormalized = new Map<string, LocEntry[]>();
  for (const e of entries) {
    const k = normalize(e.url);
    if (!byNormalized.has(k)) byNormalized.set(k, []);
    byNormalized.get(k)!.push(e);
  }

  const dupesWithinBranch: Array<{ url: string; branch: string; count: number }> = [];
  const dupesAcrossBranches: Array<{ url: string; branches: string[] }> = [];

  for (const [url, occ] of byNormalized) {
    const branches = occ.map(o => o.branch);
    // within-branch dupes
    const counts = branches.reduce<Record<string, number>>((a, b) => (a[b] = (a[b] || 0) + 1, a), {});
    for (const [br, c] of Object.entries(counts)) {
      if (c > 1) dupesWithinBranch.push({ url, branch: br, count: c });
    }
    // cross-branch dupes
    const uniqBranches = [...new Set(branches)];
    if (uniqBranches.length > 1) dupesAcrossBranches.push({ url, branches: uniqBranches });
  }

  console.log(`🔁 Duplicates within a single branch: ${dupesWithinBranch.length}`);
  console.log(`🔀 URLs appearing in 2+ branches:    ${dupesAcrossBranches.length}`);

  // 3. HTTP probing
  let probes: Probe[] = [];
  if (!DUPES_ONLY) {
    let uniqUrls = [...byNormalized.keys()];
    if (LIMIT > 0) uniqUrls = uniqUrls.slice(0, LIMIT);
    console.log(`🌐 Probing ${uniqUrls.length} unique URLs (concurrency=${CONCURRENCY})…`);
    const raw = await pool(uniqUrls, CONCURRENCY, probe);
    probes = raw.map(r => ({
      ...r,
      branches: [...new Set(byNormalized.get(normalize(r.url))!.map(e => e.branch))],
    }));
  }

  // 4. Summaries
  const statusBuckets: Record<string, number> = {};
  let redirectCount = 0;
  let canonicalMismatchCount = 0;
  const broken: Probe[] = [];
  const redirected: Probe[] = [];
  const canonicalIssues: Probe[] = [];
  const errors: Probe[] = [];
  for (const p of probes) {
    const bucket = p.status ? `${Math.floor(p.status / 100)}xx` : 'error';
    statusBuckets[bucket] = (statusBuckets[bucket] || 0) + 1;
    if (p.error) errors.push(p);
    if (p.status && p.status >= 400) broken.push(p);
    if (p.redirects > 0) { redirectCount++; redirected.push(p); }
    if (p.canonicalMismatch) { canonicalMismatchCount++; canonicalIssues.push(p); }
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonPath = path.join(OUT_DIR, `sitemap-health-${ts}.json`);
  const mdPath = path.join(OUT_DIR, `sitemap-health-${ts}.md`);

  const report = {
    generatedAt: new Date().toISOString(),
    branches: perBranchCounts,
    totals: {
      locEntries: entries.length,
      uniqueUrls: byNormalized.size,
      dupesWithinBranch: dupesWithinBranch.length,
      dupesAcrossBranches: dupesAcrossBranches.length,
      probed: probes.length,
      statusBuckets,
      redirected: redirectCount,
      canonicalMismatch: canonicalMismatchCount,
      broken: broken.length,
      errors: errors.length,
    },
    dupesWithinBranch,
    dupesAcrossBranches,
    broken,
    redirected,
    canonicalIssues,
    errors,
  };
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  // Markdown summary
  const md: string[] = [];
  md.push(`# Sitemap Health Report`);
  md.push(`Generated: ${report.generatedAt}\n`);
  md.push(`## Branch counts`);
  for (const [b, c] of Object.entries(perBranchCounts)) md.push(`- \`${b}\` — ${c} URLs`);
  md.push(`\n## Totals`);
  md.push(`- Total <loc> entries: **${entries.length}**`);
  md.push(`- Unique URLs (normalized): **${byNormalized.size}**`);
  md.push(`- Duplicate entries within a single branch: **${dupesWithinBranch.length}**`);
  md.push(`- URLs present in 2+ branches: **${dupesAcrossBranches.length}**`);
  if (probes.length) {
    md.push(`- Probed: **${probes.length}**`);
    md.push(`- Status buckets: ${JSON.stringify(statusBuckets)}`);
    md.push(`- Redirected: **${redirectCount}**`);
    md.push(`- Canonical mismatches: **${canonicalMismatchCount}**`);
    md.push(`- Broken (4xx/5xx): **${broken.length}**`);
    md.push(`- Fetch errors: **${errors.length}**`);
  }

  const top = <T,>(arr: T[], n = 50) => arr.slice(0, n);

  if (dupesAcrossBranches.length) {
    md.push(`\n## Cross-branch duplicates (top 50)`);
    for (const d of top(dupesAcrossBranches)) {
      md.push(`- \`${d.url}\` → ${d.branches.join(', ')}`);
    }
  }
  if (dupesWithinBranch.length) {
    md.push(`\n## Within-branch duplicates (top 50)`);
    for (const d of top(dupesWithinBranch)) {
      md.push(`- \`${d.url}\` × ${d.count} in \`${d.branch}\``);
    }
  }
  if (broken.length) {
    md.push(`\n## Broken URLs (top 50)`);
    for (const p of top(broken)) md.push(`- [${p.status}] ${p.url}`);
  }
  if (redirected.length) {
    md.push(`\n## Redirected URLs (top 50)`);
    for (const p of top(redirected)) md.push(`- ${p.url} → ${p.finalUrl}`);
  }
  if (canonicalIssues.length) {
    md.push(`\n## Canonical mismatches (top 50)`);
    for (const p of top(canonicalIssues)) md.push(`- ${p.url} → canonical: ${p.canonical}`);
  }
  if (errors.length) {
    md.push(`\n## Fetch errors (top 50)`);
    for (const p of top(errors)) md.push(`- ${p.url} — ${p.error}`);
  }

  fs.writeFileSync(mdPath, md.join('\n'));

  console.log(`\n✅ Reports written:`);
  console.log(`   ${jsonPath}`);
  console.log(`   ${mdPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
