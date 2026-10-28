/**
 * Cross-device audit of the LIVE site, run manually from .github/workflows/device-audit.yml.
 *
 * Real browser engines, not just viewport sizes:
 *  - iOS / iPadOS → WebKit (Safari's engine) with iPhone / iPad device profiles
 *  - Android      → Chromium with high-end Pixel / Galaxy profiles
 *  - Desktop      → Chromium (Chrome) and WebKit (Safari)
 *
 * Per page and device: horizontal overflow (and the elements causing it), tap targets below
 * WCAG 2.2 sizes, text smaller than 12px, broken / alt-less images, H1 count, console errors,
 * LCP + CLS where the engine reports them, and an above-the-fold screenshot.
 * Writes <OUT>/devices.json, <OUT>/summary.json and screenshots.
 */
import { chromium, webkit, devices, type Browser, type BrowserContextOptions, type Page } from '@playwright/test';
import fs from 'fs';
import { blockAnalytics } from './no-analytics';

const BASE = (process.env.SITE_URL || 'https://xtsy.one').replace(/\/$/, '');
const OUT = process.env.OUT_DIR || 'device-audit';
const ROUTES = (process.env.ROUTES || [
  '/', '/best-hostel-in-shillong', '/xtsy-270', '/shillong-dormitory', '/book', '/tab-bistro', '/tours',
  '/tours/5n-6d-tawang-tour', '/destinations/meghalaya', '/contact', '/faq', '/gallery', '/female-travellers', '/hotels-in-shillong',
].join(',')).split(',').map((r) => r.trim()).filter(Boolean);

type Device = { id: string; engine: 'webkit' | 'chromium'; group: string; opts: BrowserContextOptions };
const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36';
const TAB_UA = 'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
const DEVICES: Device[] = [
  { id: 'iphone-15-pro', engine: 'webkit', group: 'iOS phone', opts: devices['iPhone 15 Pro'] },
  { id: 'iphone-se', engine: 'webkit', group: 'iOS phone', opts: devices['iPhone SE'] },
  { id: 'iphone-15-pro-max', engine: 'webkit', group: 'iOS phone', opts: devices['iPhone 15 Pro Max'] },
  { id: 'ipad-mini', engine: 'webkit', group: 'iPad', opts: devices['iPad Mini'] },
  { id: 'ipad-pro-11', engine: 'webkit', group: 'iPad', opts: devices['iPad Pro 11'] },
  { id: 'ipad-pro-11-landscape', engine: 'webkit', group: 'iPad', opts: devices['iPad Pro 11 landscape'] },
  { id: 'pixel-7', engine: 'chromium', group: 'Android phone', opts: devices['Pixel 7'] },
  { id: 'galaxy-s24-ultra', engine: 'chromium', group: 'Android phone', opts: { viewport: { width: 384, height: 832 }, deviceScaleFactor: 3.75, isMobile: true, hasTouch: true, userAgent: ANDROID_UA } },
  { id: 'galaxy-tab-s9', engine: 'chromium', group: 'Android tablet', opts: { viewport: { width: 800, height: 1280 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: TAB_UA } },
  { id: 'desktop-chrome-1920', engine: 'chromium', group: 'Desktop', opts: { viewport: { width: 1920, height: 1080 } } },
  { id: 'laptop-chrome-1366', engine: 'chromium', group: 'Desktop', opts: { viewport: { width: 1366, height: 768 } } },
  { id: 'desktop-safari-1440', engine: 'webkit', group: 'Desktop', opts: { viewport: { width: 1440, height: 900 } } },
];

async function measure(page: Page) {
  return page.evaluate(async () => {
    const vw = window.innerWidth;
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0;
    };
    const label = (el: Element) => {
      const id = el.id ? `#${el.id}` : '';
      const cls = typeof (el as HTMLElement).className === 'string' ? '.' + (el as HTMLElement).className.trim().split(/\s+/).slice(0, 3).join('.') : '';
      const txt = ((el as HTMLElement).innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      return `${el.tagName.toLowerCase()}${id}${cls === '.' ? '' : cls}${txt ? ` "${txt}"` : ''}`;
    };
    // Horizontal overflow: the page scrolls sideways, and which elements stick out.
    const overflowPx = document.documentElement.scrollWidth - vw;
    const clipped = (el: Element) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p);
        if (/(hidden|clip|auto|scroll)/.test(o.overflowX)) return true;
      }
      return false;
    };
    const wide: string[] = [];
    for (const el of Array.from(document.body.querySelectorAll('*'))) {
      if (wide.length >= 6) break;
      const r = el.getBoundingClientRect();
      if (r.right > vw + 2 && r.width > 0 && visible(el) && !clipped(el)) wide.push(`${label(el)} → right ${Math.round(r.right)}px`);
    }
    // Tap targets (WCAG 2.2: 24px minimum; 44px Apple / 48dp Android recommended).
    const targets = Array.from(document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button]')).filter(visible);
    const small24: string[] = []; let under44 = 0;
    for (const el of targets) {
      const r = el.getBoundingClientRect();
      const inline = el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p, li');
      if (inline) continue; // links inside sentences are exempt in WCAG 2.5.8
      if (r.width < 24 || r.height < 24) small24.push(`${label(el)} ${Math.round(r.width)}×${Math.round(r.height)}`);
      else if (r.width < 44 || r.height < 44) under44++;
    }
    // Small text
    let smallText = 0; const smallEx: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const t = (n.textContent || '').trim();
      const el = n.parentElement;
      if (!t || !el || !visible(el)) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 12) { smallText++; if (smallEx.length < 4) smallEx.push(`${fs}px "${t.slice(0, 30)}"`); }
    }
    const imgs = Array.from(document.images);
    const broken = imgs.filter((i) => i.complete && i.currentSrc && i.naturalWidth === 0).map((i) => i.currentSrc.slice(-60));
    const noAlt = imgs.filter((i) => !i.hasAttribute('alt')).length;
    const h1 = Array.from(document.querySelectorAll('h1')).filter(visible).map((h) => (h as HTMLElement).innerText.trim().slice(0, 60));
    // Content hidden behind the fixed header / floating buttons at the bottom of the first screen.
    const fixed = Array.from(document.querySelectorAll('body *')).filter((el) => { const s = getComputedStyle(el); return (s.position === 'fixed' || s.position === 'sticky') && visible(el); })
      .map((el) => { const r = el.getBoundingClientRect(); return { el: label(el), top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width) }; })
      .filter((f) => f.h < window.innerHeight * 0.9).slice(0, 8);
    return {
      vw, vh: window.innerHeight, overflowPx, wide, targets: targets.length, small24: small24.length, small24Ex: small24.slice(0, 5), under44,
      smallText, smallEx, images: imgs.length, broken, noAlt, h1, fixed,
      title: document.title, docHeight: document.documentElement.scrollHeight,
    };
  });
}

async function runDevice(browser: Browser, d: Device) {
  const rows: Record<string, unknown>[] = [];
  const ctx = await browser.newContext({ ...d.opts, locale: 'en-IN', timezoneId: 'Asia/Kolkata' });
  await blockAnalytics(ctx);
  // tsx/esbuild wraps functions in a __name() helper that does not exist inside the page.
  await ctx.addInitScript('globalThis.__name = (f) => f;');
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${String(e.message).slice(0, 160)}`));
    page.on('console', (m) => { if (m.type() === 'error') { const at = m.location()?.url ? ` @ ${m.location().url.slice(0, 90)}` : ''; errors.push(`${m.text().slice(0, 140)}${at}`); } });
    const failed: string[] = [];
    page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url().replace(BASE, '')}`.slice(0, 140)); });
    await page.addInitScript(() => {
      const w = window as unknown as { __lcp: number; __cls: number };
      w.__lcp = -1; w.__cls = 0;
      try { new PerformanceObserver((l) => { for (const e of l.getEntries()) w.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch { /* engine without LCP */ }
      try { new PerformanceObserver((l) => { for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) w.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch { /* engine without CLS */ }
    });
    const row: Record<string, unknown> = { device: d.id, group: d.group, engine: d.engine, route };
    try {
      const t0 = Date.now();
      const res = await page.goto(`${BASE}${route}${route.includes('?') ? '&' : '?'}device-audit=1`, { waitUntil: 'load', timeout: 60000 });
      row.status = res?.status();
      row.loadMs = Date.now() - t0;
      await page.waitForTimeout(1200);
      const name = `${d.id}__${route === '/' ? 'home' : route.slice(1).replace(/\//g, '_')}`;
      await page.screenshot({ path: `${OUT}/shots/${name}.jpg`, type: 'jpeg', quality: 50 });
      // Scroll through so lazy sections render, then measure the whole page.
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.8) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(500);
      Object.assign(row, await measure(page));
      const perf = await page.evaluate(() => { const w = window as unknown as { __lcp: number; __cls: number }; return { lcp: Math.round(w.__lcp), cls: Math.round(w.__cls * 1000) / 1000 }; });
      row.lcp = perf.lcp >= 0 ? perf.lcp : null;
      row.cls = d.engine === 'chromium' ? perf.cls : null;
      if (route === '/') await page.screenshot({ path: `${OUT}/shots/${name}__full.jpg`, type: 'jpeg', quality: 35, fullPage: true });
    } catch (e) {
      row.error = String(e).slice(0, 200);
    }
    row.errors = errors.filter((e) => !/favicon|ERR_BLOCKED_BY_CLIENT/.test(e)).slice(0, 6);
    row.failed = failed.slice(0, 6);
    rows.push(row);
    console.log(`${d.id} ${route} ${row.status ?? row.error} overflow=${row.overflowPx} tap<24=${row.small24} text<12=${row.smallText} lcp=${row.lcp} errors=${(row.errors as string[]).length}`);
    await page.close();
  }
  await ctx.close();
  return rows;
}

async function main() {
  fs.mkdirSync(`${OUT}/shots`, { recursive: true });
  const all: Record<string, unknown>[] = [];
  for (const engine of ['webkit', 'chromium'] as const) {
    const browser = await (engine === 'webkit' ? webkit : chromium).launch();
    for (const d of DEVICES.filter((x) => x.engine === engine)) all.push(...(await runDevice(browser, d)));
    await browser.close();
  }
  fs.writeFileSync(`${OUT}/devices.json`, JSON.stringify(all, null, 1));
  const issues = all.filter((r) => r.error || (r.status as number) >= 400 || (r.overflowPx as number) > 0 || (r.small24 as number) > 0 || (r.broken as string[] | undefined)?.length || (r.errors as string[]).length || (r.h1 as string[] | undefined)?.length !== 1);
  const summary = {
    site: BASE, pages: ROUTES.length, devices: DEVICES.map((d) => `${d.id} (${d.engine})`), checks: all.length,
    withIssues: issues.length,
    overflow: all.filter((r) => (r.overflowPx as number) > 0).map((r) => `${r.device} ${r.route} +${r.overflowPx}px ${(r.wide as string[]).slice(0, 2).join(' | ')}`),
    smallTargets: all.filter((r) => (r.small24 as number) > 0).map((r) => `${r.device} ${r.route}: ${r.small24} (${(r.small24Ex as string[]).slice(0, 2).join(' | ')})`),
    smallText: all.filter((r) => (r.smallText as number) > 0).map((r) => `${r.device} ${r.route}: ${r.smallText} (${(r.smallEx as string[]).slice(0, 2).join(' | ')})`),
    h1: all.filter((r) => (r.h1 as string[] | undefined)?.length !== 1).map((r) => `${r.device} ${r.route}: ${JSON.stringify(r.h1)}`),
    errors: all.filter((r) => (r.errors as string[]).length || r.error).map((r) => `${r.device} ${r.route}: ${r.error ?? ''} ${(r.errors as string[]).slice(0, 2).join(' | ')}`),
    broken: all.filter((r) => (r.broken as string[] | undefined)?.length).map((r) => `${r.device} ${r.route}: ${(r.broken as string[]).join(', ')}`),
    lcpByDevice: Object.fromEntries(DEVICES.map((d) => {
      const v = all.filter((r) => r.device === d.id && typeof r.lcp === 'number').map((r) => r.lcp as number).sort((a, b) => a - b);
      return [d.id, v.length ? { median: v[Math.floor(v.length / 2)], max: v[v.length - 1] } : null];
    })),
  };
  fs.writeFileSync(`${OUT}/summary.json`, JSON.stringify(summary, null, 1));
  console.log(JSON.stringify({ checks: summary.checks, withIssues: summary.withIssues }, null, 1));
}
main().catch((e) => { console.error(e); process.exit(1); });
