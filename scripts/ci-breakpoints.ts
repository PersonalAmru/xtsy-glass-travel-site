/**
 * CI: end-to-end layout / SEO / AEO / performance audit across breakpoints.
 * For each route × viewport it records:
 *  - horizontal overflow (page wider than the screen) and the elements causing it
 *  - tap targets smaller than 44×44 px (phones and tablets)
 *  - text smaller than 12 px
 *  - images that failed to load, have no alt text, or are stretched
 *  - LCP, CLS and the LCP element (unthrottled, per viewport)
 *  - H1 count, JSON-LD types and quick-answer block as rendered
 * plus an above-the-fold screenshot. Writes shots/bp/report.json.
 */
import { chromium } from '@playwright/test';
import fs from 'fs';

const BASE = process.env.BASE_URL || 'http://localhost:4174';
const OUT = process.env.OUT_DIR || 'shots/bp';
const ROUTES = (process.env.BP_ROUTES || '/,/best-hostel-in-shillong,/cheap-hostels-shillong,/xtsy-270,/tours,/tours/tawang-monastery-exploration,/expeditions,/destinations/meghalaya/cherrapunji/nohkalikai-falls,/shillong-dormitory,/plan-trip-with-ai,/tab-bistro,/faq,/book,/gallery').split(',');
const VIEWPORTS = [
  { name: 'phone-s', width: 360, height: 740, touch: true },
  { name: 'phone', width: 390, height: 844, touch: true },
  { name: 'tablet', width: 768, height: 1024, touch: true },
  { name: 'tablet-l', width: 1024, height: 768, touch: true },
  { name: 'laptop', width: 1280, height: 800, touch: false },
  { name: 'desktop', width: 1440, height: 900, touch: false },
  { name: 'wide', width: 1920, height: 1080, touch: false },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const rows: Record<string, unknown>[] = [];
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.touch, isMobile: vp.touch && vp.width < 800, reducedMotion: 'reduce' });
    await ctx.route('**/__l5e/**', async (route) => {
      try { const u = new URL(route.request().url()); await route.fulfill({ response: await route.fetch({ url: `https://xtsy.one${u.pathname}` }) }); } catch { await route.continue(); }
    });
    // tsx/esbuild wraps named helpers in __name(); define it inside the page too.
    await ctx.addInitScript({ content: 'window.__name = (f) => f;' });
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem('xtsy_consent_v2', JSON.stringify({ necessary: true, analytics: true, marketing: false, personalization: false, timestamp: new Date().toISOString(), version: '2.0' }));
        localStorage.setItem('xtsy_consent_timestamp', new Date().toISOString());
      } catch { /* ignore */ }
      (window as unknown as { __cls: number; __lcp: unknown }).__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((l) => { const e = l.getEntries().pop() as unknown as { startTime: number; element?: Element; url?: string }; (window as unknown as { __lcp: unknown }).__lcp = { t: Math.round(e.startTime), tag: e.element?.tagName, url: e.url, cls: String((e.element as HTMLElement | undefined)?.className ?? '').slice(0, 60) }; }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    for (const route of ROUTES) {
      const page = await ctx.newPage();
      let status = 0;
      try {
        const res = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 });
        status = res?.status() ?? 0;
        await page.waitForTimeout(1200);
        const name = `${vp.name}-${route === '/' ? 'home' : route.slice(1).replace(/\//g, '_')}`;
        await page.screenshot({ path: `${OUT}/${name}.jpg`, type: 'jpeg', quality: 60 });
        // Scroll so lazy content renders, then measure.
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
        await page.waitForTimeout(600);
        const m = await page.evaluate(({ touch }) => {
          const W = document.documentElement.clientWidth;
          const vis = (el: Element) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0 && r.width > 0 && r.height > 0; };
          const label = (el: Element) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String((el as HTMLElement).className ?? '').split(' ').slice(0, 3).join('.')}`.slice(0, 90);
          const overflowers: string[] = [];
          for (const el of Array.from(document.querySelectorAll('body *'))) {
            if (!vis(el)) continue;
            const r = el.getBoundingClientRect();
            if (r.right > W + 2 || r.left < -2) {
              // Skip children of horizontally scrolling containers and fixed decorations.
              let p: Element | null = el.parentElement, clipped = false;
              while (p) { const s = getComputedStyle(p); if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) { clipped = true; break; } p = p.parentElement; }
              if (!clipped && getComputedStyle(el).position !== 'fixed') overflowers.push(label(el));
            }
          }
          const small: string[] = [];
          if (touch) for (const el of Array.from(document.querySelectorAll('a[href], button, [role="button"], input, select, textarea'))) {
            if (!vis(el)) continue;
            const r = el.getBoundingClientRect();
            if ((r.width < 44 || r.height < 44) && (r.width * r.height) > 0) {
              // Inline text links inside paragraphs are exempt (WCAG 2.5.8 inline exception).
              if (el.tagName === 'A' && el.closest('p, li') && getComputedStyle(el).display === 'inline') continue;
              small.push(`${label(el)} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.textContent ?? '').trim().slice(0, 24)}"`);
            }
          }
          let tinyText = 0; const tinyEx: string[] = [];
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const n = walker.currentNode; const el = n.parentElement;
            if (!el || !(n.textContent ?? '').trim() || !vis(el) || el.closest('.sr-only,[aria-hidden="true"]')) continue;
            const fs = parseFloat(getComputedStyle(el).fontSize);
            if (fs < 12) { tinyText++; if (tinyEx.length < 5) tinyEx.push(`${fs}px "${(n.textContent ?? '').trim().slice(0, 30)}"`); }
          }
          const imgs = Array.from(document.images).filter(vis);
          const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src).slice(0, 8);
          const noAlt = imgs.filter((i) => !i.hasAttribute('alt')).map((i) => i.currentSrc || i.src).slice(0, 8);
          const stretched = imgs.filter((i) => { if (!i.naturalWidth) return false; const r = i.getBoundingClientRect(); const fit = getComputedStyle(i).objectFit; if (fit === 'cover' || fit === 'contain') return false; return Math.abs(r.width / r.height - i.naturalWidth / i.naturalHeight) > 0.08; }).map((i) => i.currentSrc || i.src).slice(0, 8);
          const ld = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).length;
          return {
            scrollW: document.documentElement.scrollWidth, W,
            overflow: document.documentElement.scrollWidth > W + 1,
            overflowers: [...new Set(overflowers)].slice(0, 8),
            smallTargets: small.length, smallEx: small.slice(0, 8),
            tinyText, tinyEx,
            images: imgs.length, broken, noAlt, stretched,
            h1: document.querySelectorAll('h1').length, jsonLd: ld, quickAnswer: !!document.querySelector('[data-quick-answer]'),
            cls: Number(((window as unknown as { __cls: number }).__cls).toFixed(3)), lcp: (window as unknown as { __lcp: unknown }).__lcp,
          };
        }, { touch: vp.touch });
        rows.push({ viewport: vp.name, width: vp.width, route, status, shot: `${name}.jpg`, ...m });
        console.log(`${vp.name.padEnd(8)} ${route.padEnd(45)} ${status} overflow=${m.overflow} small=${m.smallTargets} tiny=${m.tinyText} broken=${m.broken.length} cls=${m.cls} lcp=${(m.lcp as { t?: number } | undefined)?.t}`);
      } catch (e) {
        rows.push({ viewport: vp.name, width: vp.width, route, status, error: String(e).slice(0, 200) });
      }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(rows, null, 1));
}
main();
