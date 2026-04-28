/**
 * Sitemap ↔ Prerender Manifest Consistency Check
 *
 * Verifies that:
 *   1. Every <loc> URL across public/sitemap*.xml exists as a prerendered
 *      route in dist/prerender-manifest.json (or is an explicitly excluded
 *      static page like /, /book, /admin-login, /404 …).
 *   2. Every entry in robots.txt's `Sitemap:` directives resolves to a real
 *      sitemap file in /public.
 *   3. Every URL listed inside <sitemap><loc> in sitemap_index.xml exists.
 *
 * Exits with code 1 on any mismatch (so CI fails the build).
 */
import fs from 'fs';
import path from 'path';

const PUBLIC = path.resolve(process.cwd(), 'public');
const DIST = path.resolve(process.cwd(), 'dist');
const SITE = 'https://xtsy.one';

// Known SPA-only routes that won't appear in the prerender manifest.
const SPA_WHITELIST = new Set([
  '', '/', '/book', '/booking', '/admin', '/admin-login',
  '/franchise', '/franchise-login', '/404', '/profile',
  '/sign-in', '/sign-up', '/auth',
]);

function readFile(p: string): string | null {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : null;
}

function extractLocs(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) out.push(m[1].trim());
  return out;
}

function urlToSlug(u: string): string {
  try {
    const url = new URL(u);
    return url.pathname.replace(/^\/|\/$/g, '');
  } catch { return ''; }
}

function loadManifest(): { slugs: Set<string>; total: number } | null {
  const p = path.join(DIST, 'prerender-manifest.json');
  const raw = readFile(p);
  if (!raw) return null;
  try {
    const j = JSON.parse(raw);
    // Manifest may store only first 50 sample slugs; fall back to scanning dist/*.
    const fromDist = new Set<string>();
    for (const ent of fs.readdirSync(DIST, { withFileTypes: true })) {
      if (ent.isDirectory() && fs.existsSync(path.join(DIST, ent.name, 'index.html'))) {
        fromDist.add(ent.name);
      }
    }
    (j.slugs || []).forEach((s: string) => fromDist.add(s));
    return { slugs: fromDist, total: j.total || fromDist.size };
  } catch { return null; }
}

function main() {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1) Find sitemaps
  const sitemapFiles = fs.readdirSync(PUBLIC).filter(f => /^sitemap.*\.xml$/.test(f));
  if (!sitemapFiles.length) {
    errors.push('No sitemap*.xml files found in /public');
  }

  // 2) robots.txt Sitemap: directives
  const robots = readFile(path.join(PUBLIC, 'robots.txt')) || '';
  const robotsSitemaps = [...robots.matchAll(/^Sitemap:\s*(\S+)/gim)].map(m => m[1]);
  for (const s of robotsSitemaps) {
    const file = s.replace(`${SITE}/`, '');
    if (!fs.existsSync(path.join(PUBLIC, file))) {
      errors.push(`robots.txt references missing sitemap: ${s}`);
    }
  }

  // 3) sitemap_index.xml children must exist
  const idx = readFile(path.join(PUBLIC, 'sitemap_index.xml'));
  if (idx) {
    for (const loc of extractLocs(idx)) {
      const file = loc.replace(`${SITE}/`, '');
      if (!fs.existsSync(path.join(PUBLIC, file))) {
        errors.push(`sitemap_index.xml references missing file: ${loc}`);
      }
    }
  }

  // 4) Every <loc> in sitemaps should be in the prerender manifest.
  const manifest = loadManifest();
  if (!manifest) {
    warnings.push('dist/prerender-manifest.json not found — skipping URL-vs-prerender diff (build did not run yet)');
  } else {
    const allLocs = new Set<string>();
    for (const f of sitemapFiles) {
      if (f === 'sitemap_index.xml') continue;
      const xml = readFile(path.join(PUBLIC, f)) || '';
      extractLocs(xml).forEach(l => allLocs.add(l));
    }
    let missing = 0;
    const missingExamples: string[] = [];
    for (const url of allLocs) {
      const slug = urlToSlug(url);
      if (!slug || SPA_WHITELIST.has(slug) || SPA_WHITELIST.has(`/${slug}`)) continue;
      if (!manifest.slugs.has(slug)) {
        missing++;
        if (missingExamples.length < 10) missingExamples.push(`/${slug}`);
      }
    }
    if (missing) {
      errors.push(`${missing} sitemap URL(s) have no prerendered HTML. Examples: ${missingExamples.join(', ')}`);
    }

    // Reverse direction — prerendered slugs missing from any sitemap.
    const allSlugs = new Set([...allLocs].map(urlToSlug).filter(Boolean));
    let orphan = 0;
    const orphanExamples: string[] = [];
    for (const slug of manifest.slugs) {
      if (!allSlugs.has(slug)) {
        orphan++;
        if (orphanExamples.length < 10) orphanExamples.push(`/${slug}`);
      }
    }
    if (orphan) {
      warnings.push(`${orphan} prerendered slug(s) are NOT in any sitemap. Examples: ${orphanExamples.join(', ')}`);
    }

    console.log(`📊 Manifest: ${manifest.slugs.size} prerendered slugs`);
    console.log(`📊 Sitemaps: ${allLocs.size} <loc> URLs across ${sitemapFiles.length - 1} files`);
  }

  if (warnings.length) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(w => console.log('   - ' + w));
  }
  if (errors.length) {
    console.error('\n❌ Errors:');
    errors.forEach(e => console.error('   - ' + e));
    process.exit(1);
  }
  console.log('\n✅ Sitemap ↔ prerender manifest consistent.');
}

main();
