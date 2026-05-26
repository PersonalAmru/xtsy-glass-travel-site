/**
 * Cross-branch sitemap dedupe.
 *
 * Given a priority order, walks each branch and removes any <url> block whose
 * <loc> already appeared in a higher-priority branch. First-write wins.
 *
 * Order (highest → lowest priority for ownership):
 *   destinations > hostel > tours > dining > misc > guides > programmatic > static > priority
 *
 * Run after every sitemap regeneration.
 */
import fs from 'fs';
import path from 'path';

const PUBLIC = path.resolve(process.cwd(), 'public');

const ORDER = [
  'sitemap-destinations.xml',
  'sitemap-hostel.xml',
  'sitemap-tours.xml',
  'sitemap-dining.xml',
  'sitemap-misc.xml',
  'sitemap-guides.xml',
  'sitemap-programmatic.xml',
  'sitemap-static.xml',
  'sitemap-priority.xml',
];

const seen = new Set<string>();
let totalRemoved = 0;
for (const f of ORDER) {
  const p = path.join(PUBLIC, f);
  if (!fs.existsSync(p)) continue;
  const xml = fs.readFileSync(p, 'utf-8');
  let removed = 0;
  const out = xml.replace(/\s*<url>[\s\S]*?<\/url>/g, (block) => {
    const m = block.match(/<loc>([^<]+)<\/loc>/);
    if (!m) return block;
    const url = m[1].trim().replace(/\/$/, '');
    if (seen.has(url)) { removed++; return ''; }
    seen.add(url);
    return block;
  });
  if (removed > 0) fs.writeFileSync(p, out);
  console.log(`${removed > 0 ? '🧹' : '✔'} ${f}: removed ${removed} cross-branch dupes`);
  totalRemoved += removed;
}
console.log(`\nTotal cross-branch dupes removed: ${totalRemoved}`);
console.log(`Unique URLs across all branches:  ${seen.size}`);
