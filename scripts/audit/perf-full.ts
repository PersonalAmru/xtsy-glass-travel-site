/**
 * Full-site performance lab test — every URL in the sitemaps, on an emulated mid-range phone
 * (Lighthouse mobile profile: Slow 4G 150 ms RTT / 1.6 Mbps down / 750 kbps up, 4x CPU slowdown,
 * 412x823 @ 1.75x), measured the way a first-time visitor and a returning visitor see the page.
 *
 * Per URL:
 *   cold visit (empty cache): TTFB, FCP, LCP (+ element), CLS, long-task time (TBT proxy),
 *     bytes and requests in total and before LCP, JS bytes, render-blocking files, console errors
 *   warm visit (same browser, cache kept): bytes transferred again and LCP — shows caching
 *   cache check: static files (images, fonts, CSS, JS) served without a long Cache-Control
 * A cold LCP over 2.5 s is measured a second time and the mean of both runs is kept.
 *
 * Sharded: SHARD (0-based) of SHARDS. Writes <OUT>/lab-<SHARD>.json.
 */
import { chromium, devices, type Browser } from '@playwright/test';
import fs from 'fs';
import { sitemapUrls } from './perf-sitemap';

const BASE = (process.env.BASE_URL || 'https://xtsy.one').replace(/\/$/, '');
const OUT = process.env.OUT_DIR || 'perf';
const SHARD = Number(process.env.SHARD || 0);
const SHARDS = Number(process.env.SHARDS || 1);
const LIMIT = Number(process.env.LIMIT || 0);

const OBSERVER = `
window.__lcp = null; window.__lt = []; window.__cls = 0;
new PerformanceObserver((l) => { for (const e of l.getEntries()) { const el = e.element;
  window.__lcp = { t: e.startTime, url: e.url || '', tag: el ? el.tagName : '', text: el ? (el.textContent || '').trim().slice(0, 50) : '' }; } })
  .observe({ type: 'largest-contentful-paint', buffered: true });
new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push({ s: e.startTime, d: e.duration }); }).observe({ type: 'longtask', buffered: true });
new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
window.__name = (f) => f;
`;

type Visit = Record<string, unknown> & { lcp: number; bytes: number };

async function visit(browser: Browser, url: string, warm: boolean): Promise<{ cold: Visit; warm?: Visit; uncached: { url: string; kb: number; cc: string }[]; errors: string[] }> {
  const ctx = await browser.newContext({ ...devices['Moto G4'], viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, locale: 'en-IN' });
  // Consent already given, so the privacy bar does not sit over the page while measuring.
  await ctx.addInitScript(`try{localStorage.setItem('xtsy_consent_v2', JSON.stringify({necessary:true,analytics:true,marketing:false,personalization:false,timestamp:new Date().toISOString(),version:'2.0'}))}catch(e){}`);
  await ctx.addInitScript(OBSERVER);
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => errors.push(('pageerror: ' + e.message).slice(0, 160)));
  const uncached: { url: string; kb: number; cc: string }[] = [];
  page.on('response', async (r) => {
    const u = r.url();
    if (!/\.(avif|webp|jpe?g|png|svg|woff2?|css|m?js)(\?|$)/.test(u)) return;
    const cc = r.headers()['cache-control'] || '';
    const age = Number(/max-age=(\d+)/.exec(cc)?.[1] ?? 0);
    if (age < 86400 && !/immutable/.test(cc)) {
      const len = Number(r.headers()['content-length'] || 0);
      uncached.push({ url: u.replace(/^https?:\/\/[^/]+/, '').slice(0, 90), kb: Math.round(len / 1024), cc: cc || '(none)' });
    }
  });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const one = async (settle: number): Promise<Visit> => {
    let bytes = 0; let requests = 0;
    const onData = (e: { encodedDataLength: number }) => { bytes += e.encodedDataLength; };
    const onReq = () => { requests++; };
    cdp.on('Network.loadingFinished', onData);
    cdp.on('Network.requestWillBeSent', onReq);
    const res = await page.goto(url, { waitUntil: 'load', timeout: 90000 });
    await page.waitForTimeout(settle);
    cdp.off('Network.loadingFinished', onData);
    cdp.off('Network.requestWillBeSent', onReq);
    const m = await page.evaluate(() => {
      const w = window as unknown as { __lcp: { t: number; url: string; tag: string; text: string } | null; __lt: { s: number; d: number }[]; __cls: number };
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const rs = performance.getEntriesByType('resource') as (PerformanceResourceTiming & { renderBlockingStatus?: string })[];
      const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0;
      const t = w.__lcp?.t ?? 0;
      const sz = (r: PerformanceResourceTiming) => r.transferSize || r.encodedBodySize || 0;
      const pre = rs.filter((r) => r.startTime < t);
      const isJs = (r: PerformanceResourceTiming) => /\.m?js(\?|$)/.test(r.name);
      return {
        ttfb: Math.round(nav.responseStart), fcp: Math.round(fcp), lcp: Math.round(t),
        lcpEl: w.__lcp ? `${w.__lcp.tag} ${w.__lcp.url ? w.__lcp.url.replace(location.origin, '').slice(-60) : w.__lcp.text}` : '',
        cls: Math.round(w.__cls * 1000) / 1000,
        tbt: Math.round(w.__lt.filter((x) => x.s > fcp).reduce((a, x) => a + Math.max(0, x.d - 50), 0)),
        htmlKb: Math.round((nav.transferSize || nav.encodedBodySize) / 1024),
        jsKb: Math.round(rs.filter(isJs).reduce((a, r) => a + sz(r), 0) / 1024),
        jsFiles: rs.filter(isJs).length,
        beforeLcp: { requests: pre.length, jsKb: Math.round(pre.filter(isJs).reduce((a, r) => a + sz(r), 0) / 1024), kb: Math.round(pre.reduce((a, r) => a + sz(r), 0) / 1024) },
        blocking: rs.filter((r) => r.renderBlockingStatus === 'blocking').map((r) => r.name.replace(location.origin, '').slice(-60)),
        thirdParty: [...new Set(rs.filter((r) => !r.name.includes(location.host)).map((r) => new URL(r.name).host))],
      };
    });
    return { status: res?.status() ?? 0, ...m, bytes: Math.round(bytes / 1024), requests } as Visit;
  };

  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  let cold = await one(5000);
  if (cold.lcp > 2500) {
    const again = await one(5000);
    cold = { ...cold, lcp: Math.round((cold.lcp + again.lcp) / 2), fcp: Math.round(((cold.fcp as number) + (again.fcp as number)) / 2), lcpRuns: [cold.lcp, again.lcp] };
  }
  let warmV: Visit | undefined;
  if (warm) {
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: false });
    await one(1500); // prime the cache the way a first visit would
    warmV = await one(2500);
  }
  await ctx.close();
  const dedup = [...new Map(uncached.map((u) => [u.url, u])).values()];
  return { cold, warm: warmV, uncached: dedup, errors: [...new Set(errors)].slice(0, 5) };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  let urls = await sitemapUrls(BASE);
  if (LIMIT) urls = urls.slice(0, LIMIT);
  const mine = urls.filter((_, i) => i % SHARDS === SHARD);
  console.log(`shard ${SHARD}/${SHARDS}: ${mine.length} of ${urls.length} URLs`);
  const browser = await chromium.launch();
  const out: unknown[] = [];
  for (const [i, u] of mine.entries()) {
    try {
      const r = await visit(browser, BASE + u.path, true);
      out.push({ ...u, ...r });
      console.log(`${i + 1}/${mine.length} ${u.path} LCP ${r.cold.lcp} FCP ${r.cold.fcp} CLS ${r.cold.cls} warm ${r.warm?.bytes}KB`);
    } catch (e) {
      out.push({ ...u, error: String(e).slice(0, 200) });
      console.log(`${i + 1}/${mine.length} ${u.path} ERROR ${String(e).slice(0, 120)}`);
    }
    if (i % 10 === 0) fs.writeFileSync(`${OUT}/lab-${SHARD}.json`, JSON.stringify(out));
  }
  await browser.close();
  fs.writeFileSync(`${OUT}/lab-${SHARD}.json`, JSON.stringify(out));
}

main().catch((e) => { console.error(e); process.exit(1); });
