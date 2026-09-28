/**
 * Live-site search health report for xtsy.one (run on demand, no schedule).
 * Crawls every URL in the live sitemaps the way a non-JS crawler would and records:
 * HTTP status, redirects, response time, title, meta description, canonical,
 * robots meta / X-Robots-Tag, H1, JSON-LD types, word count, quick-answer block.
 * Also checks robots.txt, sitemap index, llms.txt, the IndexNow key file and
 * the dorm price shown in titles. Writes health/health.json + health/summary.json.
 */
import fs from 'fs';

const SITE = process.env.SITE_URL || 'https://xtsy.one';
const OUT = process.env.OUT_DIR || 'health';
const UA = 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) xtsy-health';
const pick = (h: string, re: RegExp) => (h.match(re)?.[1] ?? '').replace(/\s+/g, ' ').trim();

async function get(url: string) {
  const t = Date.now();
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'manual' });
    return { status: r.status, ms: Date.now() - t, location: r.headers.get('location') ?? undefined, xrobots: r.headers.get('x-robots-tag') ?? undefined, text: r.status < 300 ? await r.text() : '' };
  } catch (e) { return { status: 0, ms: Date.now() - t, error: String(e), text: '' }; }
}

function types(n: unknown, out: string[] = []): string[] {
  if (Array.isArray(n)) n.forEach((x) => types(x, out));
  else if (n && typeof n === 'object') {
    const t = (n as Record<string, unknown>)['@type']; if (t) out.push(...(Array.isArray(t) ? t : [t]).map(String));
    Object.values(n as object).forEach((v) => typeof v === 'object' && types(v, out));
  }
  return out;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const index = await get(`${SITE}/sitemap_index.xml`);
  const maps = [...index.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls: { url: string; sitemap: string }[] = [];
  const sitemapRows = [];
  for (const m of maps) {
    const r = await get(m);
    const locs = [...r.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]).filter((u) => !/\.(jpe?g|png|webp)$/i.test(u));
    sitemapRows.push({ sitemap: m, status: r.status, urls: locs.length });
    if (!/sitemap-images/.test(m)) locs.forEach((u) => urls.push({ url: u, sitemap: m.split('/').pop()! }));
  }
  const seen = new Set<string>(); const list = urls.filter((u) => !seen.has(u.url) && seen.add(u.url));

  const rows: Record<string, unknown>[] = [];
  let i = 0;
  async function worker() {
    while (i < list.length) {
      const { url, sitemap } = list[i++];
      const r = await get(url);
      const h = r.text;
      const ld = [...h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { return { '@type': 'INVALID_JSON' }; } });
      const robots = pick(h, /<meta[^>]*name="robots"[^>]*content="([^"]*)"/);
      const canonical = pick(h, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/);
      const body = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
      const title = pick(h, /<title[^>]*>([\s\S]*?)<\/title>/);
      const norm = (u: string) => u.replace(/\/$/, '');
      const issues: string[] = [];
      if (r.status !== 200) issues.push(`HTTP ${r.status}${r.location ? ` → ${r.location}` : ''}`);
      else {
        if (/noindex/i.test(robots) || /noindex/i.test(r.xrobots ?? '')) issues.push('noindex but listed in sitemap');
        if (!canonical) issues.push('no canonical'); else if (norm(canonical) !== norm(url)) issues.push(`canonical points elsewhere: ${canonical}`);
        if (!title) issues.push('no title'); else if (title.length > 65) issues.push(`long title (${title.length})`);
        if (!pick(h, /<meta[^>]*name="description"[^>]*content="([^"]*)"/)) issues.push('no meta description');
        if (!/<h1[\s>]/.test(h)) issues.push('no H1');
        if (!ld.length) issues.push('no structured data');
        if (/₹\s?(369|399)\b(?![^<]{0,40}(Tandoori|chicken))/i.test(body)) issues.push('old dorm price (₹369/₹399) on page');
        if (r.ms > 2500) issues.push(`slow response (${r.ms} ms)`);
      }
      rows.push({ url, sitemap, status: r.status, ms: r.ms, title, canonical, robots: robots || 'index', h1: /<h1[\s>]/.test(h), jsonLd: [...new Set(types(ld))].slice(0, 12), words: body.split(/\s+/).filter(Boolean).length, quickAnswer: /data-quick-answer/.test(h), issues });
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker));

  const extra = {
    robots: (await get(`${SITE}/robots.txt`)).status,
    llms: (await get(`${SITE}/llms.txt`)).status,
    llmsFull: (await get(`${SITE}/llms-full.txt`)).status,
    indexNowKey: (await get(`${SITE}/8a7d1f4e2b6c4d5e9f3a7b1c2d4e5f6a.txt`)).status,
    home: pick((await get(`${SITE}/`)).text, /<title[^>]*>([\s\S]*?)<\/title>/),
  };
  const ok = rows.filter((r) => (r.issues as string[]).length === 0).length;
  const byIssue: Record<string, number> = {};
  rows.forEach((r) => (r.issues as string[]).forEach((x) => { const k = x.replace(/\(.*\)|: .*|→ .*/g, '').trim(); byIssue[k] = (byIssue[k] ?? 0) + 1; }));
  const ms = rows.map((r) => r.ms as number).sort((a, b) => a - b);
  const summary = { checkedAt: new Date().toISOString(), site: SITE, sitemaps: sitemapRows, urlsChecked: rows.length, healthy: ok, withIssues: rows.length - ok, byIssue, medianMs: ms[Math.floor(ms.length / 2)], p95Ms: ms[Math.floor(ms.length * 0.95)], withStructuredData: rows.filter((r) => (r.jsonLd as string[]).length).length, withQuickAnswer: rows.filter((r) => r.quickAnswer).length, extra };
  fs.writeFileSync(`${OUT}/health.json`, JSON.stringify(rows, null, 1));
  fs.writeFileSync(`${OUT}/summary.json`, JSON.stringify(summary, null, 1));
  console.log(`::notice::Checked ${rows.length} URLs: ${ok} healthy, ${rows.length - ok} with issues. ${JSON.stringify(byIssue)}`);
}
main();
