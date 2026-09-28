/**
 * Whole-site navigation + SEO crawl (server HTML, like a search engine).
 * Starts from "/" and every sitemap URL, follows every internal <a href>, and reports:
 *  - broken internal links (4xx/5xx) with the pages linking to them
 *  - internal links that hit a redirect (should link to the final URL)
 *  - orphan pages (in a sitemap, but no internal link points to them)
 *  - click depth from the homepage
 *  - duplicate titles / descriptions, missing or multiple H1s
 *  - which design each page renders (new v2 header vs legacy)
 *  - what the header, menu and footer link to
 * Writes <OUT>/crawl.json and <OUT>/crawl-summary.json.
 */
import fs from 'fs';

const SITE = process.env.SITE_URL || 'http://localhost:4174';
const OUT = process.env.OUT_DIR || 'shots/crawl';
const MAX = Number(process.env.MAX_PAGES || 2500);
const HOST_RE = /^https?:\/\/(www\.)?xtsy\.one/;

const norm = (href: string, from: string): string | null => {
  try {
    if (!href || /^(mailto:|tel:|sms:|whatsapp:|javascript:|#)/i.test(href)) return null;
    const u = new URL(href.replace(HOST_RE, SITE), SITE + from);
    if (u.origin !== new URL(SITE).origin) return null;
    if (/\.(png|jpe?g|webp|svg|gif|pdf|xml|txt|ico|json|js|css|woff2?)$/i.test(u.pathname)) return null;
    let p = u.pathname.replace(/\/+$/, '') || '/';
    return p + (u.search && !/^\?(utm_|ref=|fbclid)/.test(u.search) ? u.search : '');
  } catch { return null; }
};
const decode = (x: string) => x.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const pick = (h: string, re: RegExp) => decode(h.match(re)?.[1] ?? '');

type Page = { url: string; status: number; location?: string; title?: string; description?: string; canonical?: string; robots?: string; h1: number; design?: string; links: string[]; depth: number; ms: number; inSitemap: boolean };

async function fetchPage(path: string) {
  const t = Date.now();
  try {
    const r = await fetch(SITE + path, { redirect: 'manual', headers: { 'User-Agent': 'xtsy-site-audit' } });
    const html = r.status === 200 ? await r.text() : '';
    return { status: r.status, location: r.headers.get('location') ?? undefined, html, ms: Date.now() - t };
  } catch (e) { return { status: 0, html: '', ms: Date.now() - t, location: String(e).slice(0, 80) }; }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  // Sitemap URLs
  const sitemapUrls = new Set<string>();
  const idx = (await fetchPage('/sitemap_index.xml')).html || (await (await fetch(SITE + '/sitemap_index.xml')).text());
  for (const m of idx.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const sm = m[1].replace(HOST_RE, '');
    if (/images/.test(sm)) continue;
    const xml = await (await fetch(SITE + sm)).text();
    for (const u of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) { const p = norm(u[1], '/'); if (p) sitemapUrls.add(p); }
  }

  const pages = new Map<string, Page>();
  const inbound = new Map<string, Set<string>>();
  const depth = new Map<string, number>([['/', 0]]);
  const queue: string[] = ['/'];
  const queued = new Set(['/']);
  // BFS from home first (for click depth), then sitemap pages nobody links to.
  const addQ = (p: string, d: number) => { if (!queued.has(p) && queued.size < MAX) { queued.add(p); queue.push(p); } if (!depth.has(p)) depth.set(p, d); };

  let navLinks: string[] = [], footerLinks: string[] = [], menuLinks: string[] = [];
  async function worker() {
    while (queue.length) {
      const p = queue.shift()!;
      const r = await fetchPage(p);
      const h = r.html;
      const links = new Set<string>();
      for (const m of h.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) { const n = norm(decode(m[1]), p); if (n && n !== p) links.add(n); }
      const d = depth.get(p) ?? 99;
      for (const l of links) { if (!inbound.has(l)) inbound.set(l, new Set()); inbound.get(l)!.add(p); addQ(l, d + 1); }
      if (r.status >= 300 && r.status < 400 && r.location) { const n = norm(r.location, p); if (n) addQ(n, d); }
      if (p === '/') {
        const sect = (re: RegExp) => [...(h.match(re)?.[0] ?? '').matchAll(/href="([^"]+)"/g)].map((m) => norm(decode(m[1]), '/')).filter(Boolean) as string[];
        navLinks = sect(/<nav aria-label="Main"[\s\S]*?<\/nav>/);
        footerLinks = sect(/<footer[\s\S]*?<\/footer>/);
        menuLinks = sect(/role="dialog" aria-modal="true" aria-label="Menu"[\s\S]*?<\/nav>/);
      }
      pages.set(p, {
        url: p, status: r.status, location: r.location, ms: r.ms, depth: d, inSitemap: sitemapUrls.has(p),
        title: pick(h, /<title[^>]*>([\s\S]*?)<\/title>/), description: pick(h, /<meta[^>]*name="description"[^>]*content="([^"]*)"/),
        canonical: pick(h, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/), robots: pick(h, /<meta[^>]*name="robots"[^>]*content="([^"]*)"/),
        h1: (h.match(/<h1[\s>]/g) ?? []).length,
        design: r.status !== 200 ? undefined : /aria-label="Main"/.test(h) ? 'v2' : 'legacy',
        links: [...links],
      });
    }
  }
  // Phase 1: crawl from home. Phase 2: sitemap pages not reached by links.
  await Promise.all(Array.from({ length: 8 }, worker));
  for (const s of sitemapUrls) if (!queued.has(s)) { queued.add(s); queue.push(s); }
  await Promise.all(Array.from({ length: 8 }, worker));

  const all = [...pages.values()];
  const ok = all.filter((p) => p.status === 200);
  const broken = all.filter((p) => p.status >= 400 || p.status === 0).map((p) => ({ url: p.url, status: p.status, from: [...(inbound.get(p.url) ?? [])].slice(0, 8), fromCount: inbound.get(p.url)?.size ?? 0 }));
  const redirects = all.filter((p) => p.status >= 300 && p.status < 400).map((p) => ({ url: p.url, to: p.location, fromCount: inbound.get(p.url)?.size ?? 0, from: [...(inbound.get(p.url) ?? [])].slice(0, 5) })).filter((r) => r.fromCount > 0);
  const orphans = [...sitemapUrls].filter((u) => !(inbound.get(u)?.size));
  const dup = (key: 'title' | 'description') => {
    const m = new Map<string, string[]>();
    for (const p of ok) if (p[key] && !/noindex/.test(p.robots ?? '')) { const k = p[key]!.toLowerCase(); m.set(k, [...(m.get(k) ?? []), p.url]); }
    return [...m.entries()].filter(([, v]) => v.length > 1).map(([k, v]) => ({ value: k, urls: v }));
  };
  const depthHist: Record<string, number> = {};
  for (const p of ok) { const d = p.depth >= 99 ? 'unreachable' : String(p.depth); depthHist[d] = (depthHist[d] ?? 0) + 1; }
  const summary = {
    site: SITE, crawled: all.length, ok: ok.length, sitemapUrls: sitemapUrls.size,
    broken: broken.length, internalRedirects: redirects.length, orphans: orphans.length,
    depthHistogram: depthHist,
    deepPages: ok.filter((p) => p.depth >= 4 && p.depth < 99 && p.inSitemap).map((p) => `${p.depth} ${p.url}`).slice(0, 40),
    unreachableFromHome: ok.filter((p) => p.depth >= 99 && p.inSitemap).length,
    legacyDesignPages: ok.filter((p) => p.design === 'legacy').map((p) => p.url),
    h1Problems: ok.filter((p) => p.h1 !== 1 && !/noindex/.test(p.robots ?? '')).map((p) => `${p.h1} ${p.url}`).slice(0, 40),
    duplicateTitles: dup('title').slice(0, 30), duplicateDescriptions: dup('description').slice(0, 30),
    navLinks, menuLinks, footerLinks,
    brokenList: broken.slice(0, 80), redirectList: redirects.slice(0, 60), orphanList: orphans.slice(0, 120),
  };
  fs.writeFileSync(`${OUT}/crawl.json`, JSON.stringify(all.map(({ links, ...p }) => ({ ...p, linksOut: links.length, linksIn: inbound.get(p.url)?.size ?? 0 })), null, 1));
  fs.writeFileSync(`${OUT}/crawl-summary.json`, JSON.stringify(summary, null, 1));
  console.log(`::notice::Crawled ${all.length} URLs: ${ok.length} OK, ${broken.length} broken, ${redirects.length} linked redirects, ${orphans.length} orphans, ${summary.legacyDesignPages.length} legacy-design pages`);
}
main();
