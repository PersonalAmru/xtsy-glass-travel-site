/**
 * Merge error-sweep shards into one report: errors grouped by kind and message, each with the
 * pages it appears on. Also checks every internal link seen on any page that the sweep did not
 * visit itself. Writes <OUT>/errors.json, <OUT>/summary.json and <OUT>/report.md.
 */
import fs from 'fs';

const OUT = process.env.OUT_DIR || 'errors';
const BASE = (process.env.BASE_URL || 'https://xtsy.one').replace(/\/$/, '');
type Row = Record<string, any>;

const rows: Row[] = fs.readdirSync(OUT).filter((f) => /^errors-\d+\.json$/.test(f))
  .flatMap((f) => JSON.parse(fs.readFileSync(`${OUT}/${f}`, 'utf8')));
rows.sort((a, b) => a.path.localeCompare(b.path));

type Group = { kind: string; severity: 'high' | 'medium' | 'low'; message: string; pages: string[]; detail?: string };
const groups = new Map<string, Group>();
function add(kind: string, severity: Group['severity'], message: string, page: string, detail?: string) {
  const key = `${kind}|${message}`;
  const g = groups.get(key) || { kind, severity, message, pages: [], detail };
  if (!g.pages.includes(page)) g.pages.push(page);
  groups.set(key, g);
}
// Collapse ids, hashes and numbers so the same error on different pages groups together.
const norm = (s: string) => s.replace(/https?:\/\/[^\s'")]+/g, (u) => u.replace(/[?#].*$/, '').replace(/[a-f0-9]{8,}/gi, '…'))
  .replace(/\b\d{3,}\b/g, 'N').replace(/-[A-Za-z0-9_]{8}\.js/g, '.js').slice(0, 220);

const titles = new Map<string, string[]>();
const descs = new Map<string, string[]>();
for (const r of rows) {
  const p = r.path;
  const inSitemap = !['app-route', 'probe-404'].includes(r.source);
  if (r.source === 'probe-404') {
    if (r.status !== 404) add('Status', 'high', `Missing page returns HTTP ${r.status} instead of 404 (soft 404)`, p);
    continue;
  }
  if (r.loadError) add('Status', 'high', `Page failed to load: ${norm(r.loadError)}`, p);
  else if (r.status >= 500) add('Status', 'high', `HTTP ${r.status} server error`, p);
  else if (r.status >= 400) add('Status', 'high', `HTTP ${r.status}`, p);
  if (r.retriedAfter429) add('Status', 'medium', 'Page answered 429 Too Many Requests (worked on retry)', p);
  if (inSitemap && r.redirects?.length) add('Sitemap', 'medium', 'Sitemap URL redirects', p, `${r.redirects.join(' → ')} → ${r.finalPath}`);
  for (const m of r.jsErrors || []) add('JavaScript exception', 'high', norm(m), p);
  for (const m of r.hydration || []) add('Hydration', 'high', norm(m), p);
  for (const m of r.consoleErrors || []) {
    if ((r.hydration || []).includes(m)) continue;
    const sev = /Content Security Policy directive 'frame-ancestors'|X-Frame-Options may only be set/.test(m) ? 'low' : 'medium';
    add('Console error', sev, norm(m), p);
  }
  for (const f of r.failedRequests || []) {
    const sev = f.host.endsWith('xtsy.one') && ['document', 'script', 'stylesheet', 'image', 'font', 'fetch', 'xhr'].includes(f.type) ? 'high' : 'medium';
    add('Failed request', sev, `${f.status} ${f.type} ${f.host}${norm(new URL(f.url).pathname)}`, p);
  }
  for (const i of r.brokenImages || []) add('Broken image', 'high', norm(i), p);
  if ((r.noAlt || []).length) add('Accessibility', 'low', 'Images without alt attribute', p, String(r.noAlt.length));
  for (const m of r.mixed || []) add('Mixed content', 'medium', norm(m), p);
  if (r.status === 200 && !r.loadError) {
    if (!r.title) add('SEO', 'high', 'Missing <title>', p);
    if (r.titleCount > 1) add('SEO', 'medium', 'More than one <title>', p);
    if (!r.descriptions?.length || !r.descriptions[0]) add('SEO', 'medium', 'Missing meta description', p);
    if (r.descriptions?.length > 1) add('SEO', 'medium', 'More than one meta description', p);
    if (!r.canonical) add('SEO', 'medium', 'Missing canonical', p);
    if (r.canonicalCount > 1) add('SEO', 'high', 'More than one canonical', p);
    const want = BASE + (p.split('?')[0] === '/' ? '/' : p.split('?')[0]);
    if (inSitemap && r.canonical && r.canonical.replace(/\/$/, '') !== want.replace(/\/$/, '')) add('SEO', 'medium', 'Sitemap page canonical points to another URL', p, r.canonical);
    if (/noindex/i.test(r.robots || '') && inSitemap) add('SEO', 'high', 'Sitemap page is noindex', p);
    if ((r.h1 || []).length === 0) add('SEO', 'medium', 'No H1', p);
    if ((r.h1 || []).length > 1) add('SEO', 'low', 'More than one H1', p, r.h1.join(' | '));
    if (!r.lang) add('SEO', 'low', 'Missing <html lang>', p);
    for (const e of r.ldErrors || []) add('Structured data', 'high', `JSON-LD does not parse: ${norm(e)}`, p);
    if (r.soft404) add('Content', 'high', 'Page says "not found" but returns 200 (soft 404)', p);
    if (r.errorBoundary) add('Content', 'high', 'Page shows an error message ("Something went wrong" / "Failed to load")', p);
    if (r.title && inSitemap) titles.set(r.title, [...(titles.get(r.title) || []), p]);
    if (r.descriptions?.[0] && inSitemap) descs.set(r.descriptions[0], [...(descs.get(r.descriptions[0]) || []), p]);
  }
}
for (const [t, ps] of titles) if (ps.length > 1) for (const p of ps) add('SEO', 'medium', `Duplicate title: "${t.slice(0, 80)}"`, p);
for (const [d, ps] of descs) if (ps.length > 1) for (const p of ps) add('SEO', 'low', `Duplicate meta description: "${d.slice(0, 70)}…"`, p);

async function checkLinks() {
  const visited = new Set(rows.map((r) => r.path));
  const linkFrom = new Map<string, string[]>();
  for (const r of rows) for (const l of r.links || []) {
    if (!l || visited.has(l) || /^\/(api|admin|franchise\/dashboard)/.test(l)) continue;
    linkFrom.set(l, [...(linkFrom.get(l) || []), r.path]);
  }
  const todo = [...linkFrom.keys()];
  let i = 0, bad = 0;
  async function worker() {
    while (i < todo.length) {
      const l = todo[i++];
      try {
        let res = await fetch(BASE + l, { redirect: 'manual' });
        if (res.status === 429) { await new Promise((r) => setTimeout(r, 5000)); res = await fetch(BASE + l, { redirect: 'manual' }); }
        if (res.status >= 400) { bad++; for (const src of linkFrom.get(l)!) add('Broken link', 'high', `Link to ${l} returns HTTP ${res.status}`, src); }
        else if (res.status >= 300) for (const src of linkFrom.get(l)!.slice(0, 50)) add('Link redirect', 'low', `Link to ${l} redirects to ${res.headers.get('location')}`, src);
      } catch (e) { for (const src of linkFrom.get(l)!) add('Broken link', 'high', `Link to ${l} failed: ${String(e).slice(0, 80)}`, src); }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  return { checked: todo.length, broken: bad };
}

async function main() {
  const links = await checkLinks();
  const list = [...groups.values()].sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity]) || b.pages.length - a.pages.length);
  const pagesWith = (sev: string[]) => new Set(list.filter((g) => sev.includes(g.severity)).flatMap((g) => g.pages)).size;
  const summary = {
    checkedAt: new Date().toISOString(), site: BASE,
    pages: rows.length,
    sitemapPages: rows.filter((r) => !['app-route', 'probe-404'].includes(r.source)).length,
    appRoutes: rows.filter((r) => r.source === 'app-route').length,
    statusCounts: rows.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m; }, {}),
    pagesWithHigh: pagesWith(['high']), pagesWithMedium: pagesWith(['medium']), pagesClean: rows.length - pagesWith(['high', 'medium']),
    distinctErrors: list.length,
    byKind: list.reduce((m: Record<string, number>, g) => { m[g.kind] = (m[g.kind] || 0) + 1; return m; }, {}),
    internalLinksChecked: links.checked, brokenInternalLinks: links.broken,
  };
  fs.writeFileSync(`${OUT}/errors.json`, JSON.stringify({ summary, groups: list, rows: rows.map(({ links: _l, ...r }) => r) }));
  fs.writeFileSync(`${OUT}/summary.json`, JSON.stringify(summary, null, 1));
  const md = [`# Error sweep — ${BASE} — ${summary.checkedAt}`, '', '```', JSON.stringify(summary, null, 1), '```', ''];
  for (const g of list) md.push(`- **[${g.severity}] ${g.kind}** — ${g.message}${g.detail ? ` (${g.detail})` : ''} — ${g.pages.length} page(s): ${g.pages.slice(0, 8).join(', ')}${g.pages.length > 8 ? ' …' : ''}`);
  fs.writeFileSync(`${OUT}/report.md`, md.join('\n'));
  console.log(JSON.stringify(summary, null, 1));
}
main().catch((e) => { console.error(e); process.exit(1); });
