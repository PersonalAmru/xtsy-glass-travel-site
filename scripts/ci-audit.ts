/**
 * CI audit helper (run by .github/workflows/build-check.yml, never shipped):
 *
 *  1. IMAGE AUDIT — renders every real photo in src/data/cdnImageMap.ts into
 *     labelled contact sheets and records each file's bytes and pixel size,
 *     so cover images can be chosen by eye and oversized files spotted.
 *  2. PERF AUDIT — loads key routes on an emulated mid-range phone (4x CPU
 *     slowdown, ~1.6 Mbps / 150 ms RTT like Lighthouse mobile) and records
 *     LCP (time + element), CLS, requests and bytes by type.
 *
 * Output goes to OUT_DIR/audit/ (images.json, sheet-N.png, perf.json).
 */
import { chromium, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { CDN_IMAGE_MAP } from '../src/data/cdnImageMap';
import { blockAnalytics } from './audit/no-analytics';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const OUT = path.join(process.env.OUT_DIR || 'shots', 'audit');
const ORIGIN = 'https://xtsy.one';
const PERF_ROUTES = (process.env.PERF_ROUTES || '/,/xtsy-270,/tours,/pet-friendly,/places-to-visit/nohkalikai-falls,/book').split(',');

async function imageAudit(page: Page) {
  const entries = Object.entries(CDN_IMAGE_MAP);
  const rows: { key: string; url: string; bytes: number; type: string; w?: number; h?: number }[] = [];
  for (const [key, p] of entries) {
    const url = ORIGIN + p;
    let bytes = 0;
    let type = '';
    try {
      const r = await fetch(url);
      const buf = await r.arrayBuffer();
      bytes = buf.byteLength;
      type = r.headers.get('content-type') || '';
    } catch { /* keep zero */ }
    rows.push({ key, url, bytes, type });
  }
  const PER = 24;
  for (let s = 0; s * PER < rows.length; s++) {
    const chunk = rows.slice(s * PER, (s + 1) * PER);
    const html = `<!doctype html><meta charset="utf-8"><body style="margin:0;font:12px system-ui;background:#fff">
      <div style="display:grid;grid-template-columns:repeat(6,300px);gap:8px;padding:8px">
      ${chunk.map((r, i) => `<figure style="margin:0"><img data-i="${s * PER + i}" src="${r.url}" style="width:300px;height:220px;object-fit:cover;display:block;background:#eee">
      <figcaption style="padding:2px 0"><b>#${s * PER + i}</b> ${r.key.replace(/</g, '')} · ${(r.bytes / 1024).toFixed(0)} KB</figcaption></figure>`).join('')}
      </div></body>`;
    await page.setContent(html, { waitUntil: 'networkidle', timeout: 120000 });
    const dims = await page.$$eval('img', (imgs) => imgs.map((im) => [Number((im as HTMLImageElement).dataset.i), (im as HTMLImageElement).naturalWidth, (im as HTMLImageElement).naturalHeight]));
    for (const [i, w, h] of dims) { rows[i].w = w; rows[i].h = h; }
    await page.screenshot({ path: path.join(OUT, `sheet-${s}.png`), fullPage: true });
  }
  fs.writeFileSync(path.join(OUT, 'images.json'), JSON.stringify(rows.map((r, i) => ({ i, ...r })), null, 1));
}

async function perfAudit() {
  const browser = await chromium.launch();
  const results: unknown[] = [];
  const targets: [string, string][] = [...PERF_ROUTES.map((r) => [BASE, r] as [string, string]), ...(process.env.BASELINE_URL ? [[process.env.BASELINE_URL, '/'] as [string, string]] : [])];
  for (const [base, route] of targets) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await blockAnalytics(ctx);
    await ctx.route('**/__l5e/**', async (r) => {
      try {
        const u = new URL(r.request().url());
        if (u.origin === ORIGIN) return r.continue();
        const res = await r.fetch({ url: ORIGIN + u.pathname });
        await r.fulfill({ response: res });
      } catch { await r.continue(); }
    });
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem('xtsy_consent_v2', JSON.stringify({ necessary: true, analytics: true, marketing: false, personalization: false, timestamp: new Date().toISOString(), version: '2.0' }));
      } catch { /* ignore */ }
      (window as unknown as { __lcp: unknown[]; __cls: number }).__lcp = [];
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as PerformanceEntry[]) {
          const x = e as unknown as { startTime: number; size: number; url: string; element?: Element };
          const el = x.element;
          (window as unknown as { __lcp: unknown[] }).__lcp.push({ t: Math.round(x.startTime), size: x.size, url: x.url, tag: el?.tagName, cls: (el as HTMLElement | undefined)?.className?.toString().slice(0, 120), text: el?.textContent?.slice(0, 60) });
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      (window as unknown as { __shifts: unknown[] }).__shifts = [];
      new PerformanceObserver((l) => {
        for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean; startTime: number; sources?: { node?: Element; previousRect?: DOMRectReadOnly; currentRect?: DOMRectReadOnly }[] }[]) {
          if (e.hadRecentInput) continue;
          (window as unknown as { __cls: number }).__cls += e.value;
          (window as unknown as { __shifts: unknown[] }).__shifts.push({ v: Number(e.value.toFixed(4)), t: Math.round(e.startTime), nodes: (e.sources ?? []).map((s) => s.node ? `${s.node.nodeName}.${String((s.node as HTMLElement).className ?? '').slice(0, 80)}` : '?'), rects: (e.sources ?? []).map((s) => { const a = s.previousRect, b = s.currentRect; return a && b ? `${Math.round(a.x)},${Math.round(a.y)} ${Math.round(a.width)}x${Math.round(a.height)} -> ${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}x${Math.round(b.height)}` : ''; }), text: (e.sources ?? []).map((s) => (s.node?.textContent ?? '').slice(0, 40)) });
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const reqs: { url: string; type: string; bytes: number }[] = [];
    page.on('response', async (res) => {
      try {
        const len = Number(res.headers()['content-length'] || 0) || (await res.body().catch(() => Buffer.alloc(0))).length;
        reqs.push({ url: res.url().slice(0, 160), type: res.request().resourceType(), bytes: len });
      } catch { /* ignore */ }
    });
    const t0 = Date.now();
    let status = 0;
    try {
      const res = await page.goto(base + route, { waitUntil: 'load', timeout: 120000 });
      status = res?.status() ?? 0;
      await page.waitForTimeout(6000);
      const data = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        return {
          lcp: (window as unknown as { __lcp: unknown[] }).__lcp,
          cls: (window as unknown as { __cls: number }).__cls,
          shifts: (window as unknown as { __shifts: unknown[] }).__shifts,
          ttfb: nav ? Math.round(nav.responseStart) : null,
          fcp: fcp ? Math.round(fcp.startTime) : null,
          domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
        };
      });
      const byType: Record<string, { n: number; kb: number }> = {};
      for (const r of reqs) { byType[r.type] ??= { n: 0, kb: 0 }; byType[r.type].n++; byType[r.type].kb += r.bytes / 1024; }
      for (const k of Object.keys(byType)) byType[k].kb = Math.round(byType[k].kb);
      const biggest = [...reqs].sort((a, b) => b.bytes - a.bytes).slice(0, 12).map((r) => ({ ...r, kb: Math.round(r.bytes / 1024) }));
      const lcpList = data.lcp as { t: number }[];
      results.push({ route: base === BASE ? route : `${base}${route}`, status, wallMs: Date.now() - t0, ttfb: data.ttfb, fcp: data.fcp, lcp: lcpList[lcpList.length - 1] ?? null, lcpCandidates: lcpList, cls: Number(data.cls.toFixed(3)), shifts: data.shifts, requests: reqs.length, byType, biggest });
    } catch (e) {
      results.push({ route, status, error: String(e) });
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'perf.json'), JSON.stringify(results, null, 1));
  console.log(JSON.stringify(results.map((r) => { const x = r as { route: string; lcp?: { t: number } | null; cls?: number }; return [x.route, x.lcp?.t, x.cls]; })));
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  if (process.env.SKIP_IMAGES !== '1') {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1880, height: 1000 } });
    await imageAudit(page).catch((e) => console.error('image audit failed', e));
    await browser.close();
  }
  await perfAudit().catch((e) => console.error('perf audit failed', e));
}

main().catch((e) => { console.error(e); process.exit(1); });
