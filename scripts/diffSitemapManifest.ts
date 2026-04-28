/**
 * Sitemap ↔ Prerender Manifest Diff (standalone CLI)
 * --------------------------------------------------
 * Purpose: surface DRIFT between what we tell Google exists (sitemaps + robots)
 * and what we actually pre-rendered to disk. Complements
 * `checkSitemapConsistency.ts` (which is wired into the build) by producing a
 * human + machine readable report that can be run anytime.
 *
 * Outputs:
 *   - dist/seo-reports/sitemap-diff.json
 *   - dist/seo-reports/sitemap-diff.md
 *   - console summary (always)
 *
 * Exit codes: 0 OK, 1 mismatch, 2 missing inputs.
 *
 * Usage:
 *   npx tsx scripts/diffSitemapManifest.ts
 *   npx tsx scripts/diffSitemapManifest.ts --strict  (fail on warnings too)
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');
const REPORT_DIR = path.join(DIST, 'seo-reports');
const SITE = 'https://xtsy.one';

const SPA_WHITELIST = new Set([
  '', '/', '/book', '/booking', '/admin', '/admin-login',
  '/franchise', '/franchise-login', '/404', '/profile',
  '/sign-in', '/sign-up', '/auth', '/install',
]);

const strict = process.argv.includes('--strict');

const read = (p: string) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : null);
const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
const slugOf = (u: string) => { try { return new URL(u).pathname.replace(/^\/|\/$/g, ''); } catch { return ''; } };

function loadManifest(): { slugs: Set<string>; source: string } | null {
  // Prefer the build manifest; otherwise scan dist/*/index.html.
  const slugs = new Set<string>();
  const manifestPath = path.join(DIST, 'prerender-manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const j = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      (j.slugs || []).forEach((s: string) => slugs.add(s.replace(/^\/|\/$/g, '')));
    } catch {/* ignore */}
  }
  if (fs.existsSync(DIST)) {
    for (const ent of fs.readdirSync(DIST, { withFileTypes: true })) {
      if (ent.isDirectory() && fs.existsSync(path.join(DIST, ent.name, 'index.html'))) {
        slugs.add(ent.name);
      }
    }
  }
  if (!slugs.size) return null;
  return { slugs, source: fs.existsSync(manifestPath) ? 'manifest+dist' : 'dist-scan' };
}

function main() {
  const errors: string[] = [];
  const warnings: string[] = [];
  const sitemapFiles = fs.existsSync(PUBLIC)
    ? fs.readdirSync(PUBLIC).filter(f => /^sitemap.*\.xml$/.test(f) && f !== 'sitemap_index.xml')
    : [];

  if (!sitemapFiles.length) errors.push('No sitemap*.xml files found in /public');

  // robots.txt sitemap directives
  const robots = read(path.join(PUBLIC, 'robots.txt')) || '';
  const robotsSitemaps = [...robots.matchAll(/^Sitemap:\s*(\S+)/gim)].map(m => m[1]);
  for (const s of robotsSitemaps) {
    const file = s.replace(`${SITE}/`, '');
    if (!fs.existsSync(path.join(PUBLIC, file))) errors.push(`robots.txt → missing sitemap: ${s}`);
  }

  // sitemap_index children must exist
  const idx = read(path.join(PUBLIC, 'sitemap_index.xml')) || read(path.join(PUBLIC, 'sitemap.xml')) || '';
  for (const loc of locs(idx)) {
    const file = loc.replace(`${SITE}/`, '');
    if (!fs.existsSync(path.join(PUBLIC, file))) errors.push(`sitemap_index → missing file: ${loc}`);
  }

  // Collect every URL across sitemaps
  const allUrls = new Set<string>();
  const perSitemap: Record<string, number> = {};
  for (const f of sitemapFiles) {
    const xml = read(path.join(PUBLIC, f)) || '';
    const ls = locs(xml);
    perSitemap[f] = ls.length;
    ls.forEach(l => allUrls.add(l));
  }

  const manifest = loadManifest();
  const missingFromManifest: string[] = [];
  const orphanPrerendered: string[] = [];

  if (!manifest) {
    warnings.push('No prerender manifest or dist/ scan available — run `npm run build` first.');
  } else {
    const sitemapSlugs = new Set<string>();
    for (const u of allUrls) {
      const s = slugOf(u);
      if (s) sitemapSlugs.add(s);
      if (!s || SPA_WHITELIST.has(s) || SPA_WHITELIST.has(`/${s}`)) continue;
      if (!manifest.slugs.has(s)) missingFromManifest.push(`/${s}`);
    }
    for (const s of manifest.slugs) {
      if (SPA_WHITELIST.has(s) || SPA_WHITELIST.has(`/${s}`)) continue;
      if (!sitemapSlugs.has(s)) orphanPrerendered.push(`/${s}`);
    }
    if (missingFromManifest.length) errors.push(`${missingFromManifest.length} sitemap URL(s) not prerendered`);
    if (orphanPrerendered.length) warnings.push(`${orphanPrerendered.length} prerendered slug(s) not in any sitemap`);
  }

  // Write report
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const json = {
    generatedAt: new Date().toISOString(),
    summary: {
      sitemapFiles: sitemapFiles.length,
      sitemapUrls: allUrls.size,
      robotsSitemaps: robotsSitemaps.length,
      prerenderedSlugs: manifest?.slugs.size ?? 0,
      missingFromManifest: missingFromManifest.length,
      orphanPrerendered: orphanPrerendered.length,
      errors: errors.length,
      warnings: warnings.length,
    },
    perSitemap,
    missingFromManifest: missingFromManifest.slice(0, 500),
    orphanPrerendered: orphanPrerendered.slice(0, 500),
    errors,
    warnings,
  };
  fs.writeFileSync(path.join(REPORT_DIR, 'sitemap-diff.json'), JSON.stringify(json, null, 2));
  const md =
    `# Sitemap ↔ Prerender Diff\n\n` +
    `_Generated ${json.generatedAt}_\n\n` +
    `| Metric | Value |\n|---|---|\n` +
    Object.entries(json.summary).map(([k, v]) => `| ${k} | ${v} |`).join('\n') + '\n\n' +
    (errors.length ? `## ❌ Errors\n${errors.map(e => `- ${e}`).join('\n')}\n\n` : '') +
    (warnings.length ? `## ⚠️ Warnings\n${warnings.map(w => `- ${w}`).join('\n')}\n\n` : '') +
    (missingFromManifest.length ? `## Missing from prerender (first 50)\n${missingFromManifest.slice(0, 50).map(s => `- \`${s}\``).join('\n')}\n\n` : '') +
    (orphanPrerendered.length ? `## Prerendered but not in any sitemap (first 50)\n${orphanPrerendered.slice(0, 50).map(s => `- \`${s}\``).join('\n')}\n` : '');
  fs.writeFileSync(path.join(REPORT_DIR, 'sitemap-diff.md'), md);

  console.log('\n📊 Sitemap Diff Summary');
  console.table(json.summary);
  console.log(`📝 Report: ${path.relative(ROOT, REPORT_DIR)}/sitemap-diff.{json,md}`);

  if (errors.length) { console.error('\n❌ Diff failed.'); process.exit(1); }
  if (strict && warnings.length) { console.error('\n⚠️ Strict mode: warnings present.'); process.exit(1); }
  console.log('\n✅ Sitemaps and prerender output are aligned.');
}

main();
