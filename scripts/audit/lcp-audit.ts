/**
 * LCP audit — one route per page template, emulated mid-range phone (Lighthouse mobile:
 * Slow 4G 150 ms / 1.6 Mbps, 4x CPU), cold cache, 3 runs each (median reported).
 *
 * For every run it records the LCP element and splits LCP into Google's four sub-parts:
 *   TTFB → resource load delay → resource load duration → element render delay
 * plus: render-blocking resources, main-thread long-task time before LCP, JS/CSS/3rd-party
 * bytes before LCP, and LCP-image hygiene (in server HTML? preloaded? fetchpriority? lazy?).
 * Optional: PageSpeed Insights field data (CrUX, real users) for the origin and key URLs.
 *
 * Writes <OUT>/lcp.json and <OUT>/lcp-summary.json.
 */
import { chromium, type Page } from '@playwright/test';
import fs from 'fs';

const BASE = (process.env.BASE_URL || 'https://xtsy.one').replace(/\/$/, '');
const OUT = process.env.OUT_DIR || 'shots/lcp';
const RUNS = Number(process.env.RUNS || 3);
const ROUTES = (process.env.LCP_ROUTES || [
  '/', '/best-hostel-in-shillong', '/xtsy-270', '/tab-bistro', '/tours', '/tours/5n-6d-tawang-tour',
  '/destinations/meghalaya', '/destinations/meghalaya/shillong', '/destinations/meghalaya/cherrapunji/nohkalikai-falls',
  '/living-root-bridges-meghalaya', '/cheap-hostels-shillong', '/travel-guide/how-to-reach-meghalaya',
  '/female-travellers', '/xtsy-adventure-campsite-dawki', '/guides', '/faq', '/book',
].join(',')).split(',');
const PSI = process.env.PSI === '1';
const PSI_URLS = (process.env.PSI_URLS || '/,/best-hostel-in-shillong,/xtsy-270,/tours/5n-6d-tawang-tour').split(',');

const OBSERVER = `
window.__lcp = []; window.__lt = []; window.__cls = 0;
new PerformanceObserver((l) => { for (const e of l.getEntries()) {
  const el = e.element; window.__lcp.push({ t: e.startTime, size: e.size, url: e.url || '', tag: el ? el.tagName : '',
    cls: el && typeof el.className === 'string' ? el.className.slice(0, 120) : '',
    text: el ? (el.textContent || '').trim().slice(0, 60) : '',
    lazy: el && el.getAttribute ? el.getAttribute('loading') : null,
    fp: el && el.getAttribute ? el.getAttribute('fetchpriority') : null,
    sizes: el && el.getAttribute ? el.getAttribute('sizes') : null,
    natural: el && el.naturalWidth ? el.naturalWidth + 'x' + el.naturalHeight : null,
    shown: el ? Math.round(el.getBoundingClientRect().width) + 'x' + Math.round(el.getBoundingClientRect().height) : null,
    bg: el && !e.url ? null : null });
} }).observe({ type: 'largest-contentful-paint', buffered: true });
new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push({ s: e.startTime, d: e.duration }); }).observe({ type: 'longtask', buffered: true });
new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
window.__name = (f) => f;
`;

type Run = Record<string, unknown>;

async function measure(page: Page, url: string): Promise<Run> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const res = await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  const html = (await res?.text().catch(() => '')) ?? '';
  // Let late LCP candidates land, then freeze LCP with an input-free wait.
  await page.waitForTimeout(6000);
  const data = await page.evaluate(() => {
    const w = window as unknown as { __lcp: { t: number; url: string }[]; __lt: { s: number; d: number }[]; __cls: number };
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const res = performance.getEntriesByType('resource') as (PerformanceResourceTiming & { renderBlockingStatus?: string })[];
    const lcp = w.__lcp[w.__lcp.length - 1] ?? null;
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0;
    const lcpRes = lcp?.url ? res.find((r) => r.name === lcp.url) : undefined;
    const before = (t: number) => res.filter((r) => r.startTime < t);
    const kb = (rs: PerformanceResourceTiming[]) => Math.round(rs.reduce((a, r) => a + (r.transferSize || r.encodedBodySize || 0), 0) / 1024);
    const t = lcp?.t ?? 0;
    const host = location.host;
    const pre = before(t);
    return {
      ttfb: Math.round(nav.responseStart), htmlKb: Math.round((nav.transferSize || nav.encodedBodySize) / 1024), domInteractive: Math.round(nav.domInteractive),
      fcp: Math.round(fcp), lcp, cls: Math.round(w.__cls * 1000) / 1000,
      lcpRes: lcpRes ? { start: Math.round(lcpRes.startTime), end: Math.round(lcpRes.responseEnd), kb: Math.round((lcpRes.transferSize || lcpRes.encodedBodySize) / 1024), initiator: lcpRes.initiatorType } : null,
      blocking: res.filter((r) => r.renderBlockingStatus === 'blocking').map((r) => ({ url: r.name.replace(location.origin, ''), kb: Math.round((r.transferSize || r.encodedBodySize) / 1024), end: Math.round(r.responseEnd) })),
      longTaskMsBeforeLcp: Math.round(w.__lt.filter((x) => x.s < t).reduce((a, x) => a + x.d, 0)),
      beforeLcp: {
        jsKb: kb(pre.filter((r) => r.initiatorType === 'script' || /\.m?js(\?|$)/.test(r.name))),
        cssKb: kb(pre.filter((r) => r.initiatorType === 'link' && /\.css(\?|$)/.test(r.name))),
        imgKb: kb(pre.filter((r) => r.initiatorType === 'img' || /\.(webp|avif|jpe?g|png)(\?|$)/.test(r.name))),
        thirdPartyKb: kb(pre.filter((r) => !r.name.includes(host))),
        requests: pre.length,
        images: pre.filter((r) => r.initiatorType === 'img' || /\.(webp|avif|jpe?g|png)(\?|$)/.test(r.name))
          .map((r) => ({ url: r.name.replace(location.origin, '').slice(-70), kb: Math.round((r.transferSize || r.encodedBodySize) / 1024), start: Math.round(r.startTime) }))
          .sort((a, b) => b.kb - a.kb).slice(0, 10),
        scripts: pre.filter((r) => r.initiatorType === 'script' || r.initiatorType === 'link' && /\.m?js(\?|$)/.test(r.name) || /\.m?js(\?|$)/.test(r.name))
          .map((r) => ({ url: r.name.replace(location.origin, '').slice(-60), kb: Math.round((r.transferSize || r.encodedBodySize) / 1024), start: Math.round(r.startTime), end: Math.round(r.responseEnd) }))
          .sort((a, b) => a.start - b.start).slice(0, 30),
      },
      headOrder: [...document.head.querySelectorAll('link[rel=preload],link[rel=modulepreload],link[rel=stylesheet],script[src]')].slice(0, 40)
        .map((l) => `${l.tagName === 'SCRIPT' ? 'script' : l.getAttribute('rel')}${l.getAttribute('as') ? ':' + l.getAttribute('as') : ''} ${(l.getAttribute('href') || l.getAttribute('src') || l.getAttribute('imagesrcset') || '').slice(-50)}`),
      thirdParty: Object.entries(res.filter((r) => !r.name.includes(host)).reduce((m, r) => { const h = new URL(r.name).host; m[h] = (m[h] ?? 0) + (r.transferSize || r.encodedBodySize || 0); return m; }, {} as Record<string, number>))
        .map(([h, b]) => ({ host: h, kb: Math.round(b / 1024) })).sort((a, b) => b.kb - a.kb).slice(0, 8),
      preloads: [...document.querySelectorAll('link[rel="preload"]')].map((l) => `${l.getAttribute('as')}:${(l.getAttribute('href') || l.getAttribute('imagesrcset') || '').slice(0, 90)}${l.getAttribute('fetchpriority') ? ' fp=' + l.getAttribute('fetchpriority') : ''}`),
    };
  });
  await cdp.detach().catch(() => {});
  const lcp = data.lcp as ({ t: number; url: string } & Record<string, unknown>) | null;
  const path = lcp?.url ? lcp.url.replace(/^https?:\/\/[^/]+/, '') : '';
  const file = path.split('?')[0].split('/').pop() ?? '';
  const inHtml = !!file && html.includes(file);
  const preloaded = !!file && (data.preloads as string[]).some((p) => p.includes(file) || p.includes(file.replace(/-\d+\.(webp|avif|jpe?g)$/, '')));
  const t = lcp?.t ?? 0;
  const r = data.lcpRes as { start: number; end: number } | null;
  const breakdown = lcp
    ? r
      ? { ttfb: data.ttfb, loadDelay: Math.max(0, r.start - data.ttfb), loadDuration: Math.max(0, r.end - r.start), renderDelay: Math.max(0, Math.round(t - Math.max(r.end, data.ttfb))) }
      : { ttfb: data.ttfb, loadDelay: 0, loadDuration: 0, renderDelay: Math.max(0, Math.round(t - data.ttfb)) }
    : null;
  return { ...data, lcpMs: Math.round(t), breakdown, lcpImage: lcp?.url ? { file, inServerHtml: inHtml, preloaded } : null };
}

const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

async function psi() {
  const out: Record<string, unknown> = {};
  for (const p of PSI_URLS) {
    const u = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent('https://xtsy.one' + p)}&strategy=mobile&category=performance${process.env.PSI_KEY ? '&key=' + process.env.PSI_KEY : ''}`;
    try {
      const r = await fetch(u);
      const j = (await r.json()) as Record<string, any>;
      if (!r.ok) { out[p] = { error: r.status, message: j?.error?.message?.slice(0, 160) }; continue; }
      const f = (x: any) => x ? { lcp: x.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile, lcpCategory: x.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.category, inp: x.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile, cls: x.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile, ttfb: x.metrics?.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.percentile, fcp: x.metrics?.FIRST_CONTENTFUL_PAINT_MS?.percentile, overall: x.overall_category } : null;
      const a = j.lighthouseResult?.audits ?? {};
      out[p] = {
        field: f(j.loadingExperience), originField: f(j.originLoadingExperience),
        lab: { score: Math.round((j.lighthouseResult?.categories?.performance?.score ?? 0) * 100), lcp: a['largest-contentful-paint']?.displayValue, fcp: a['first-contentful-paint']?.displayValue, tbt: a['total-blocking-time']?.displayValue, si: a['speed-index']?.displayValue, cls: a['cumulative-layout-shift']?.displayValue },
        lcpBreakdown: a['lcp-breakdown-insight']?.details?.items ?? a['largest-contentful-paint-element']?.details?.items?.[1]?.items ?? null,
        opportunities: Object.values(a).filter((x: any) => x?.details?.type === 'opportunity' && (x.numericValue ?? 0) > 100).map((x: any) => `${x.title}: ${x.displayValue ?? ''}`).slice(0, 8),
      };
    } catch (e) { out[p] = { error: String(e).slice(0, 120) }; }
  }
  return out;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const rows: Record<string, unknown>[] = [];
  for (const route of ROUTES) {
    const runs: Run[] = [];
    for (let i = 0; i < RUNS; i++) {
      const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36 xtsy-lcp-audit' });
      await ctx.addInitScript({ content: OBSERVER });
      const page = await ctx.newPage();
      try {
        const sep = route.includes('?') ? '&' : '?';
        runs.push(await measure(page, `${BASE}${route}${BASE.includes('xtsy.one') ? `${sep}lcpaudit=${Date.now()}` : ''}`));
      } catch (e) { runs.push({ error: String(e).slice(0, 160) }); }
      await ctx.close();
    }
    const ok = runs.filter((r) => typeof r.lcpMs === 'number') as (Run & { lcpMs: number })[];
    const med = ok.length ? ok.find((r) => r.lcpMs === median(ok.map((x) => x.lcpMs)))! : runs[0];
    const row = { route, lcpRuns: ok.map((r) => r.lcpMs), ...med };
    rows.push(row);
    const b = (med as Record<string, any>).breakdown;
    console.log(`${route}  LCP ${(med as any).lcpMs}ms [${ok.map((r) => r.lcpMs).join(', ')}]  ttfb ${b?.ttfb} delay ${b?.loadDelay} load ${b?.loadDuration} render ${b?.renderDelay}  el=${(med as any).lcp?.tag} ${((med as any).lcp?.url || (med as any).lcp?.text || '').slice(-60)}`);
  }
  await browser.close();
  const summary: Record<string, unknown> = {
    base: BASE, profile: 'Slow 4G (150ms, 1.6Mbps) + 4x CPU, 412x823 @1.75x, cold cache',
    routes: rows.map((r: any) => ({ route: r.route, lcp: r.lcpMs, fcp: r.fcp, cls: r.cls, el: r.lcp ? `${r.lcp.tag}${r.lcp.url ? ' ' + r.lcp.url.split('/').pop() : ' "' + r.lcp.text + '"'}` : null, breakdown: r.breakdown, image: r.lcpImage, longTasks: r.longTaskMsBeforeLcp, before: r.beforeLcp, blocking: r.blocking })),
  };
  if (PSI) summary.pageSpeed = await psi();
  fs.writeFileSync(`${OUT}/lcp.json`, JSON.stringify(rows, null, 1));
  fs.writeFileSync(`${OUT}/lcp-summary.json`, JSON.stringify(summary, null, 1));
  const lcps = rows.map((r: any) => r.lcpMs).filter((x: unknown) => typeof x === 'number') as number[];
  console.log(`::notice::LCP audit (${BASE}): median ${median(lcps)}ms, worst ${Math.max(...lcps)}ms, ${lcps.filter((x) => x <= 2500).length}/${lcps.length} routes ≤ 2.5s`);
}
main();
