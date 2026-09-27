/**
 * CI helper: screenshots key routes at desktop and mobile widths and records
 * console errors / HTTP status per route in report.json.
 * Used by .github/workflows/build-check.yml.
 */
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const OUT = process.env.OUT_DIR || 'shots';
const ROUTES = (process.env.ROUTES ||
  '/book,/book/select?location=shillong,/book/campsite,/auth,/places-to-visit-in-meghalaya,/things-to-do-in-meghalaya,/destinations,/destinations/meghalaya,/meghalaya-waterfalls,/hostels-in-shillong-today,/hotels-in-shillong,/luxury-glamping-shillong,/3-day-meghalaya-itinerary,/meghalaya-tour-packages,/cheap-hostels-shillong,/places-to-visit/umiam-lake'
).split(',');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const report: Record<string, unknown>[] = [];
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
    // Lovable CDN images (/__l5e/...) only exist on the hosted site: proxy them from xtsy.one.
    await ctx.route('**/__l5e/**', async (route) => {
      try {
        const u = new URL(route.request().url());
        const res = await route.fetch({ url: `https://xtsy.one${u.pathname}` });
        await route.fulfill({ response: res });
      } catch {
        await route.continue();
      }
    });
    // Pre-accept the cookie banner so it doesn't cover the page.
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem('xtsy_consent_v2', JSON.stringify({ necessary: true, analytics: true, marketing: false, personalization: false, timestamp: new Date().toISOString(), version: '2.0' }));
        localStorage.setItem('xtsy_consent_timestamp', new Date().toISOString());
      } catch { /* ignore */ }
    });
    for (const route of ROUTES) {
      const page = await ctx.newPage();
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
      let status = 0;
      try {
        const res = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 });
        status = res?.status() ?? 0;
        await page.waitForTimeout(1500);
        // Scroll through the page so lazy images load, then return to the top.
        await page.evaluate(async () => {
          const step = Math.max(400, Math.floor(window.innerHeight * 0.8));
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 150));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(800);
        const file = `${vp.name}${route === '/' ? '-home' : route.replace(/\//g, '-')}.png`;
        await page.screenshot({ path: path.join(OUT, file), fullPage: vp.name === 'mobile' ? false : true });
        report.push({ route, viewport: vp.name, status, file, errors });
      } catch (e) {
        report.push({ route, viewport: vp.name, status, error: String(e), errors });
      }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.map((r) => [r.viewport, r.route, r.status, (r.errors as string[]).length])));
}

main().catch((e) => { console.error(e); process.exit(1); });
