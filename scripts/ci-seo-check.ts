/**
 * CI: what a crawler that does NOT run JavaScript (most AI crawlers) receives.
 * Fetches raw server HTML and reports title, meta description, canonical,
 * robots, H1, JSON-LD types, quick-answer block and word count per route.
 * Writes shots/seo-ssr.json and fails loudly (exit 0, ::warning::) on gaps.
 */
import fs from 'fs';
import path from 'path';

const BASE = process.env.BASE_URL || 'http://localhost:4174';
const OUT = process.env.OUT_DIR || 'shots';
const ROUTES = (process.env.SEO_ROUTES || '/,/best-hostel-in-shillong,/cheap-hostels-shillong,/xtsy-270,/faq,/plan-trip-with-ai,/hostels-in-shillong-today,/shillong-dormitory,/3-day-meghalaya-itinerary,/hostel-in-guwahati-tonight,/guwahati-to-tawang').split(',');

const pick = (html: string, re: RegExp) => (html.match(re)?.[1] ?? '').replace(/\s+/g, ' ').trim();

function typesOf(node: unknown, out: string[] = []): string[] {
  if (Array.isArray(node)) node.forEach((n) => typesOf(n, out));
  else if (node && typeof node === 'object') {
    const t = (node as Record<string, unknown>)['@type'];
    if (t) out.push(...(Array.isArray(t) ? t : [t]).map(String));
    for (const v of Object.values(node as Record<string, unknown>)) if (typeof v === 'object') typesOf(v, out);
  }
  return out;
}

async function main() {
  const rows = [];
  for (const r of ROUTES) {
    try {
      const res = await fetch(BASE + r, { headers: { 'User-Agent': 'GPTBot/1.0 (+ci-seo-check)' }, redirect: 'manual' });
      const html = await res.text();
      const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1]); } catch { return { '@type': 'INVALID_JSON' }; } });
      const body = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
      const row = {
        route: r,
        status: res.status,
        location: res.headers.get('location') ?? undefined,
        title: pick(html, /<title[^>]*>([\s\S]*?)<\/title>/),
        description: pick(html, /<meta[^>]*name="description"[^>]*content="([^"]*)"/),
        canonical: pick(html, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/),
        robots: pick(html, /<meta[^>]*name="robots"[^>]*content="([^"]*)"/),
        h1: pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/).replace(/<[^>]+>/g, ''),
        quickAnswer: /data-quick-answer/.test(html),
        jsonLdTypes: [...new Set(typesOf(ld))],
        words: body.split(/\s+/).filter(Boolean).length,
        preload: [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="image"[^>]*>/g)].length,
      };
      rows.push(row);
      const gaps = [!row.title && 'title', !row.description && 'description', !row.canonical && 'canonical', !row.h1 && 'h1', !row.jsonLdTypes.length && 'json-ld'].filter(Boolean);
      console.log(`${r} → ${row.status} | ${row.robots || 'index'} | ld: ${row.jsonLdTypes.join(',')} | words ${row.words}${gaps.length ? ` | MISSING ${gaps.join(',')}` : ''}`);
      if (gaps.length && row.status === 200) console.log(`::warning::SSR SEO gaps on ${r}: ${gaps.join(', ')}`);
    } catch (e) {
      rows.push({ route: r, error: String(e) });
      console.log(`::warning::${r} fetch failed: ${e}`);
    }
  }
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'seo-ssr.json'), JSON.stringify(rows, null, 1));
}
main();
