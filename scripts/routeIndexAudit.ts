/**
 * ROUTE ⇄ SITEMAP INDEXATION AUDIT
 * Emits a markdown table: every live URL + sitemap presence + resolution + tier.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ALL_SEO_PAGES, findSEOPage } from '../src/data/seoPages';
import { getDestinationBySlug, meghalayaDestinations } from '../src/data/meghalayaDestinations';
import {
  NE_STATES,
  EXPEDITION_ROUTES,
  buildDestinationSitemapPaths,
  destinationPath,
} from '../src/data/neTaxonomy';
import { getAllTours } from '../src/data/travelData';
import { SIGNATURE_PACKAGES } from '../src/data/signaturePackages';

const BASE = 'https://xtsy.one';
const toSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// ---------- sitemap URLs ----------
const sitemapFiles = fs.readdirSync('public').filter(f => /^sitemap.*\.xml$/.test(f));
const sitemapMap = new Map<string, string[]>(); // path -> files
for (const f of sitemapFiles) {
  const xml = fs.readFileSync(path.join('public', f), 'utf8');
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const u = m[1].trim();
    if (!u.startsWith(BASE)) continue;
    let p = u.slice(BASE.length) || '/';
    if (p.length > 1) p = p.replace(/\/$/, '');
    if (/sitemap.*\.xml$/.test(p)) continue; // index entries
    const arr = sitemapMap.get(p) ?? [];
    arr.push(f);
    sitemapMap.set(p, arr);
  }
}

// ---------- live route enumeration ----------
type Row = { url: string; type: string; resolves: boolean; note: string; tier: number };
const rows: Row[] = [];
const add = (r: Row) => rows.push(r);

const bodyLen = (p: any) =>
  (p.intro?.length || 0) + p.sections.reduce((a: number, s: any) => a + (s.content?.length || 0), 0);
const isThin = (p: any) => p.sections.length < 3 || bodyLen(p) < 600;

// static route files -> urls
const routeDir = 'src/routes';
const staticUrls: string[] = [];
const walk = (dir: string, prefix: string) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('__') || e.name.startsWith('[.]')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { walk(full, `${prefix}/${e.name}`); continue; }
    if (!e.name.endsWith('.tsx')) continue;
    const base = e.name.replace(/\.tsx$/, '');
    if (base.startsWith('$')) continue; // dynamic, handled below
    const url = base === 'index' ? (prefix || '/') : `${prefix}/${base}`;
    staticUrls.push(url || '/');
  }
};
walk(routeDir, '');

const utilityRe = /^\/(admin|franchise|auth|admin-login|profile|install|unsubscribe|book\/select|lovable)/;
const classifyStatic = (u: string): string => {
  if (u === '/') return 'homepage';
  if (utilityRe.test(u)) return 'utility';
  if (/^\/(book|hostel-booking|book-hostel-shillong|best-hostel-in-shillong|hostel-near-me|xtsy-270|hotels-in-shillong|homestays-in-shillong|luxury-glamping-shillong|xtsy-adventure-campsite-dawki)/.test(u))
    return 'property/booking page';
  if (/^\/(tab-bistro|restaurant-in-shillong|catering-shillong)/.test(u)) return 'property/booking page';
  if (/^\/tours/.test(u)) return 'tour/booking page';
  if (/^\/(destinations|expeditions|places-to-visit)/.test(u)) return 'destination guide';
  if (/^\/(privacy|terms|refund|pricing-cancellation|contact|about|gallery|meghalaya-photo-gallery)/.test(u)) return 'utility';
  return 'blog/content page';
};
const tierFor = (type: string, u: string): number => {
  if (u === '/') return 1;
  if (type === 'utility') return 4;
  if (type.startsWith('property') || type.startsWith('tour')) return 1;
  if (type === 'destination guide') return 2;
  return 3;
};

for (const u of [...new Set(staticUrls)]) {
  const type = classifyStatic(u);
  add({ url: u, type, resolves: true, note: '', tier: tierFor(type, u) });
}

// dynamic: /$slug programmatic SEO
for (const p of ALL_SEO_PAGES) {
  const thin = isThin(p);
  add({
    url: `/${p.slug}`,
    type: 'blog/content page (programmatic)',
    resolves: !thin,
    note: thin ? `THIN → <NotFound/> (sections=${p.sections.length}, body=${bodyLen(p)})` : '',
    tier: thin ? 5 : 3,
  });
}

// dynamic: destinations hierarchy
for (const p of buildDestinationSitemapPaths()) {
  add({ url: p, type: 'destination/attraction guide', resolves: true, note: '', tier: 2 });
}

// legacy places-to-visit (301 → destinations)
for (const d of meghalayaDestinations) {
  const target = destinationPath(d.slug);
  add({
    url: `/places-to-visit/${d.slug}`,
    type: 'legacy redirect',
    resolves: !!getDestinationBySlug(d.slug),
    note: `301 → ${target}`,
    tier: 5,
  });
}

// expeditions
for (const r of EXPEDITION_ROUTES) {
  for (const t of r.types) add({ url: `/expeditions/${t}/${r.slug}`, type: 'expedition guide', resolves: true, note: '', tier: 2 });
}

// tours
const tourSlugs = new Set<string>([
  ...getAllTours().map((t: any) => toSlug(t.title)),
  ...SIGNATURE_PACKAGES.map((s: any) => s.slug),
]);
for (const s of tourSlugs) add({ url: `/tours/${s}`, type: 'tour/booking page', resolves: true, note: '', tier: 1 });

// ---------- cross reference ----------
const liveMap = new Map(rows.map(r => [r.url, r]));
const inSitemapNotResolving: { url: string; files: string[]; why: string }[] = [];
for (const [u, files] of sitemapMap) {
  const r = liveMap.get(u);
  if (!r) inSitemapNotResolving.push({ url: u, files, why: 'no matching route/data entry' });
  else if (!r.resolves) inSitemapNotResolving.push({ url: u, files, why: r.note || 'falls through to <NotFound/>' });
  else if (r.type === 'legacy redirect') inSitemapNotResolving.push({ url: u, files, why: r.note });
}
const missingFromSitemap = rows.filter(r => r.resolves && r.tier <= 3 && !sitemapMap.has(r.url));

// ---------- output ----------
const esc = (s: string) => s.replace(/\|/g, '\\|');
const out: string[] = [];
out.push('# XTSY.one — Route ⇄ Sitemap Indexation Audit', '');
out.push(`Generated ${new Date().toISOString().slice(0, 10)} · live URLs: ${rows.length} · sitemap URLs: ${sitemapMap.size}`, '');
out.push('| Tier | URL | Page type | In sitemap | Resolves | Notes |');
out.push('|---|---|---|---|---|---|');
const sorted = [...rows].sort((a, b) => a.tier - b.tier || a.url.localeCompare(b.url));
for (const r of sorted) {
  const files = sitemapMap.get(r.url);
  out.push(
    `| ${r.tier} | ${esc(r.url)} | ${r.type} | ${files ? files.join(', ').replace(/sitemap-|\.xml/g, '') : 'MISSING'} | ${r.resolves ? 'yes' : 'NO — NotFound'} | ${esc(r.note)} |`,
  );
}
out.push('', `## A. In sitemap but does NOT resolve (remove from sitemap) — ${inSitemapNotResolving.length}`, '');
out.push('| URL | Sitemap file(s) | Reason |', '|---|---|---|');
for (const x of inSitemapNotResolving.sort((a, b) => a.url.localeCompare(b.url)))
  out.push(`| ${esc(x.url)} | ${x.files.join(', ')} | ${esc(x.why)} |`);
out.push('', `## B. Live & indexable but MISSING from sitemap — ${missingFromSitemap.length}`, '');
out.push('| URL | Page type | Tier |', '|---|---|---|');
for (const x of missingFromSitemap.sort((a, b) => a.tier - b.tier || a.url.localeCompare(b.url)))
  out.push(`| ${esc(x.url)} | ${x.type} | ${x.tier} |`);

fs.mkdirSync('/mnt/documents', { recursive: true });
fs.writeFileSync('/mnt/documents/route-index-audit.md', out.join('\n'));
console.log(`live=${rows.length} sitemap=${sitemapMap.size} badInSitemap=${inSitemapNotResolving.length} missing=${missingFromSitemap.length}`);
console.log('thin=', rows.filter(r => !r.resolves).length);
