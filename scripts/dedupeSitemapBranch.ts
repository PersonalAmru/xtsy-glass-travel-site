/**
 * In-place de-duplicate any sitemap-*.xml branch — removes <url>…</url>
 * blocks whose <loc> already appeared earlier in the same file. Preserves
 * order, formatting, and the first occurrence's lastmod/priority.
 *
 * Usage:
 *   bunx tsx scripts/dedupeSitemapBranch.ts public/sitemap-guides.xml
 *   bunx tsx scripts/dedupeSitemapBranch.ts public/sitemap-*.xml
 */
import fs from 'fs';

const args = process.argv.slice(2);
if (!args.length) {
  console.error('Pass one or more sitemap XML paths.');
  process.exit(1);
}

let totalRemoved = 0;
for (const f of args) {
  if (!fs.existsSync(f)) { console.warn(`skip (missing): ${f}`); continue; }
  const xml = fs.readFileSync(f, 'utf-8');
  const seen = new Set<string>();
  let removed = 0;
  const out = xml.replace(/\s*<url>[\s\S]*?<\/url>/g, (block) => {
    const m = block.match(/<loc>([^<]+)<\/loc>/);
    if (!m) return block;
    const url = m[1].trim().replace(/\/$/, '');
    if (seen.has(url)) { removed++; return ''; }
    seen.add(url);
    return block;
  });
  if (removed > 0) fs.writeFileSync(f, out);
  console.log(`${removed > 0 ? '🧹' : '✔'} ${f}: removed ${removed} dupes (${seen.size} unique)`);
  totalRemoved += removed;
}
console.log(`\nDone. Total removed: ${totalRemoved}`);
