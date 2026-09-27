/**
 * Removes URLs that are served `noindex` (see src/data/seoIndexPolicy.ts) from
 * every sitemap in public/. A sitemap must only list canonical, indexable URLs.
 */
import fs from 'fs';
import path from 'path';
import { isConsolidatedSEOSlug } from '../src/data/seoIndexPolicy';

const PUBLIC = path.resolve('public');
let removed = 0;
for (const f of fs.readdirSync(PUBLIC).filter((x) => /^sitemap.*\.xml$/.test(x))) {
  const file = path.join(PUBLIC, f);
  const xml = fs.readFileSync(file, 'utf8');
  const out = xml.replace(/\s*<url>\s*<loc>https:\/\/xtsy\.one\/([^<]*)<\/loc>[\s\S]*?<\/url>/g, (m, slug: string) => {
    if (isConsolidatedSEOSlug(slug.replace(/\/$/, ''))) { removed++; return ''; }
    return m;
  });
  if (out !== xml) fs.writeFileSync(file, out);
}
console.log(`pruned ${removed} noindex URLs from sitemaps`);
