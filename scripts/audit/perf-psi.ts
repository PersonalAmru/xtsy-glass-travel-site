/**
 * Google PageSpeed Insights (Lighthouse, mobile) for every sitemap URL, with the repo secret PSI_KEY.
 * Keeps a compact record per URL: score, LCP, FCP, TBT, CLS, Speed Index, page weight, the top
 * opportunities with their estimated savings, and real-user (CrUX) data when Google has it.
 * Sharded: SHARD of SHARDS, CONCURRENCY requests at a time. Writes <OUT>/psi-<SHARD>.json.
 */
import fs from 'fs';
import { sitemapUrls } from './perf-sitemap';

const BASE = (process.env.BASE_URL || 'https://xtsy.one').replace(/\/$/, '');
const OUT = process.env.OUT_DIR || 'perf';
const SHARD = Number(process.env.SHARD || 0);
const SHARDS = Number(process.env.SHARDS || 1);
const CONC = Number(process.env.CONCURRENCY || 4);
const LIMIT = Number(process.env.LIMIT || 0);
const KEY = process.env.PSI_KEY || '';

type Audit = { score?: number | null; numericValue?: number; displayValue?: string; scoreDisplayMode?: string; title?: string; metricSavings?: Record<string, number>; details?: { items?: Record<string, unknown>[] } };

async function run(path: string) {
  const u = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(BASE + path)}&strategy=mobile&category=performance${KEY ? '&key=' + KEY : ''}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await fetch(u);
    if (r.ok) {
      const d = await r.json();
      const a: Record<string, Audit> = d.lighthouseResult?.audits ?? {};
      const num = (k: string) => Math.round(a[k]?.numericValue ?? 0);
      const diag = (a.diagnostics?.details?.items?.[0] ?? {}) as Record<string, number>;
      const ops = Object.entries(a)
        .filter(([, v]) => v.scoreDisplayMode === 'metricSavings' && typeof v.score === 'number' && v.score < 0.9)
        .map(([k, v]) => ({ id: k, title: v.title, value: v.displayValue ?? '', lcpMs: v.metricSavings?.LCP ?? 0, fcpMs: v.metricSavings?.FCP ?? 0 }))
        .sort((x, y) => (y.lcpMs + y.fcpMs) - (x.lcpMs + x.fcpMs)).slice(0, 6);
      const field = d.loadingExperience?.metrics ? Object.fromEntries(Object.entries(d.loadingExperience.metrics as Record<string, { percentile: number; category: string }>).map(([k, v]) => [k, { p75: v.percentile, cat: v.category }])) : null;
      return {
        path, score: Math.round((d.lighthouseResult?.categories?.performance?.score ?? 0) * 100),
        lcp: num('largest-contentful-paint'), fcp: num('first-contentful-paint'), tbt: num('total-blocking-time'),
        cls: Math.round((a['cumulative-layout-shift']?.numericValue ?? 0) * 1000) / 1000, si: num('speed-index'),
        kb: Math.round((diag.totalByteWeight ?? 0) / 1024), requests: diag.numRequests ?? 0, scripts: diag.numScripts ?? 0,
        ops, field, fieldOrigin: d.originLoadingExperience?.overall_category ?? null,
      };
    }
    const body = (await r.text()).slice(0, 160);
    if (attempt === 3 || (r.status !== 429 && r.status < 500)) return { path, error: `${r.status} ${body}` };
    await new Promise((res) => setTimeout(res, 15000 * attempt));
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  let urls = await sitemapUrls(BASE);
  if (LIMIT) urls = urls.slice(0, LIMIT);
  const mine = urls.filter((_, i) => i % SHARDS === SHARD);
  console.log(`psi shard ${SHARD}/${SHARDS}: ${mine.length} URLs, key ${KEY ? 'set' : 'MISSING'}`);
  const out: unknown[] = [];
  let next = 0;
  const worker = async () => {
    while (next < mine.length) {
      const u = mine[next++];
      try {
        const r = await run(u.path);
        out.push({ sitemap: u.sitemap, ...r });
        console.log(`${out.length}/${mine.length} ${u.path} ${'score' in (r ?? {}) ? `score ${(r as { score: number }).score} LCP ${(r as { lcp: number }).lcp}` : (r as { error?: string })?.error}`);
      } catch (e) { out.push({ sitemap: u.sitemap, path: u.path, error: String(e).slice(0, 160) }); }
      if (out.length % 20 === 0) fs.writeFileSync(`${OUT}/psi-${SHARD}.json`, JSON.stringify(out));
    }
  };
  await Promise.all(Array.from({ length: CONC }, worker));
  fs.writeFileSync(`${OUT}/psi-${SHARD}.json`, JSON.stringify(out));
}

main().catch((e) => { console.error(e); process.exit(1); });
