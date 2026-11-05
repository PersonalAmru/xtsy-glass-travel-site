/**
 * Removes non-indexable URLs from every sitemap in public/: consolidated noindex pages,
 * transactional noindex routes, and registered legacy 301 aliases. Sitemaps should only
 * advertise canonical URLs that resolve directly to an indexable 200 response.
 */
import fs from 'fs';
import path from 'path';
import { isConsolidatedSEOSlug } from '../src/data/seoIndexPolicy';
import { RECOVERY_REDIRECTS } from '../src/data/seoAffectedSlugs';
import { STATIC_ROUTES } from '../src/utils/seoSlugRegistry';

const PUBLIC = path.resolve('public');
const NOINDEX_STATIC_ROUTES = new Set(['book', 'book/select', 'book/campsite']);
const STATIC_ROUTE_SET = new Set(STATIC_ROUTES.map((route) => route.startsWith('/') ? route.slice(1) : route));
let removed = 0;
for (const f of fs.readdirSync(PUBLIC).filter((x) => /^sitemap.*\.xml$/.test(x))) {
  const file = path.join(PUBLIC, f);
  const xml = fs.readFileSync(file, 'utf8');
  const out = xml.replace(/\s*<url>\s*<loc>https:\/\/xtsy\.one\/([^<]*)<\/loc>[\s\S]*?<\/url>/g, (m, slug: string) => {
    const cleanSlug = slug.endsWith('/') ? slug.slice(0, -1) : slug;
    const isKnownStaticRoute = STATIC_ROUTE_SET.has(cleanSlug);
    const isRecoveryRedirect = !isKnownStaticRoute && Object.prototype.hasOwnProperty.call(RECOVERY_REDIRECTS, cleanSlug);
    if (isConsolidatedSEOSlug(cleanSlug) || NOINDEX_STATIC_ROUTES.has(cleanSlug) || isRecoveryRedirect) {
      removed++;
      return '';
    }
    return m;
  });
  if (out !== xml) fs.writeFileSync(file, out);
}
console.log(`pruned ${removed} noindex/redirect URLs from sitemaps`);
