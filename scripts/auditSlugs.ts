/**
 * BUILD-TIME SLUG AUDIT
 * ---------------------
 * Scans the codebase for `to="/xxx"`, `href="/xxx"`, and `<Link to="/xxx">`
 * references and flags any that don't resolve to a real React route, a
 * programmatic SEO entry, or an active redirect.
 *
 * Usage:  npm run audit:slugs   (or)   bun scripts/auditSlugs.ts
 *
 * Exits non-zero on unresolved slugs (will fail CI if wired up).
 */
import * as fs from 'fs';
import * as path from 'path';
import { auditSlugs } from '../src/utils/seoSlugRegistry';

const SRC_DIR = path.join(__dirname, '..', 'src');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'build']);
const EXTERNAL_PROTOCOLS = /^(https?:|mailto:|tel:|wa\.me|sms:|#|javascript:)/i;

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx?|jsx?)$/.test(entry.name)) files.push(full);
  }
  return files;
}

// Match  to="/xxx"  /  href="/xxx"  /  navigate("/xxx")
const RE = /(?:\bto=|\bhref=|navigate\(|<Navigate\s+to=)["'`](\/[a-z0-9][a-z0-9/_-]*)["'`]/gi;

const found = new Set<string>();
for (const file of walk(SRC_DIR)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(RE)) {
    const url = m[1].split('?')[0].split('#')[0];
    if (EXTERNAL_PROTOCOLS.test(url)) continue;
    // Skip dynamic segments — they always have :param
    if (url.includes(':')) continue;
    // Skip admin / franchise / api / book sub-paths
    if (/^\/(admin|franchise|api|book|auth|profile|install|tours\/)/.test(url)) continue;
    found.add(url);
  }
}

const result = auditSlugs(Array.from(found));

console.log('═══════════════════════════════════════════════');
console.log(' SLUG AUDIT REPORT');
console.log('═══════════════════════════════════════════════');
console.log(` References scanned : ${result.totalReferenced}`);
console.log(` Resolved           : ${result.resolved}`);
console.log(` Unresolved         : ${result.unresolved.length}`);
console.log('───────────────────────────────────────────────');

if (result.unresolved.length === 0) {
  console.log(' ✅ All slugs resolve to a React route, SEO entry, or redirect.');
  process.exit(0);
}

console.log(' ❌ Unresolved slugs (add to seoPages.ts, App.tsx routes, or seo_redirects):');
for (const s of result.unresolved.sort()) console.log('   ' + s);
process.exit(1);
