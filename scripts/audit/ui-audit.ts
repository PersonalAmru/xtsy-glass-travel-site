/**
 * UI + accessibility audit, one page per template, phone and desktop.
 *  - axe-core (WCAG 2.1 A/AA): violations by rule with counts and examples
 *  - interactions: menu opens/closes (Escape too), search opens, trip-planner
 *    chat opens, WhatsApp button present, primary "Book" CTA visible above the fold
 *  - keyboard: first Tab lands on "Skip to content"; focus is visible
 *  - console errors
 * Writes <OUT>/ui.json and a screenshot per page/viewport.
 */
import { chromium, type Page } from '@playwright/test';
import fs from 'fs';
import { blockAnalytics } from './no-analytics';

const BASE = process.env.BASE_URL || 'http://localhost:4174';
const OUT = process.env.OUT_DIR || 'shots/ui';
const AXE = fs.readFileSync(process.env.AXE_PATH || 'node_modules/axe-core/axe.min.js', 'utf8');
const ROUTES = (process.env.UI_ROUTES || [
  '/', '/best-hostel-in-shillong', '/xtsy-270', '/book', '/book/campsite', '/tours', '/tours/5n-6d-tawang-tour', '/tours/bhutan-mindful-kingdom-journey',
  '/expeditions', '/destinations', '/destinations/meghalaya', '/destinations/meghalaya/shillong', '/destinations/meghalaya/cherrapunji/nohkalikai-falls',
  '/shillong-dormitory', '/meghalaya-waterfalls', '/plan-trip-with-ai', '/tab-bistro', '/gallery', '/about', '/contact', '/faq', '/pet-friendly',
  '/female-travellers', '/work-from-home', '/group-bookings-meghalaya', '/merch', '/meghalaya-tour-packages', '/things-to-do-in-meghalaya',
  '/hotels-in-shillong', '/travel-guide/how-to-reach-meghalaya', '/pricing-cancellation-policy', '/guides', '/this-page-does-not-exist',
].join(',')).split(',');
const VPS = [{ name: 'phone', width: 390, height: 844, mobile: true }, { name: 'desktop', width: 1440, height: 900, mobile: false }];

async function interactions(page: Page, mobile: boolean) {
  const r: Record<string, unknown> = {};
  const vis = async (sel: string) => page.locator(sel).first().isVisible().catch(() => false);
  // Skip link
  await page.keyboard.press('Tab');
  r.firstTab = await page.evaluate(() => (document.activeElement?.textContent ?? '').trim().slice(0, 40));
  r.focusVisible = await page.evaluate(() => { const el = document.activeElement as HTMLElement | null; if (!el) return false; const s = getComputedStyle(el); return s.outlineStyle !== 'none' || s.boxShadow !== 'none'; });
  // Menu
  const menuBtn = page.getByRole('button', { name: 'Open menu' });
  if (await menuBtn.isVisible().catch(() => false)) {
    await menuBtn.click();
    r.menuOpens = await vis('[role="dialog"][aria-label="Menu"]');
    r.menuLinks = await page.locator('[role="dialog"][aria-label="Menu"] a').count();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
    r.menuClosesOnEscape = !(await vis('[role="dialog"][aria-label="Menu"]'));
    if (!r.menuClosesOnEscape) await page.getByRole('button', { name: 'Close menu' }).click().catch(() => {});
  } else r.menuButton = 'missing';
  // Search
  const search = page.getByRole('button', { name: 'Search' }).first();
  if (await search.isVisible().catch(() => false)) {
    await search.click();
    await page.waitForTimeout(300);
    r.searchOpens = await page.locator('input[type="search"], [role="dialog"] input, [role="combobox"]').first().isVisible().catch(() => false);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  } else r.searchButton = 'missing';
  // Trip chat
  const chat = page.getByRole('button', { name: 'Plan a trip with AI', exact: true }).last();
  if (await chat.isVisible().catch(() => false)) {
    await chat.click({ timeout: 8000 }).catch((e) => { r.chatClickError = String(e).split('\n').filter((l) => /intercept|not stable|outside/.test(l)).slice(0, 2).join(' | ').slice(0, 300) || 'click failed'; });
    await page.waitForTimeout(700);
    r.chatOpens = await vis('[role="dialog"][aria-label="Plan a trip with AI"]');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  } else r.chatButton = 'missing';
  r.whatsapp = await vis('[aria-label="Chat on WhatsApp"]');
  // Booking CTA visible in the first screen
  r.bookAboveFold = await page.evaluate(() => [...document.querySelectorAll('a,button')].some((el) => /book|check availability|reserve/i.test(el.textContent ?? '') && (() => { const b = el.getBoundingClientRect(); return b.top >= 0 && b.bottom <= innerHeight && b.width > 0; })()));
  void mobile;
  return r;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const rows: Record<string, unknown>[] = [];
  for (const vp of VPS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, reducedMotion: 'reduce' });
    await blockAnalytics(ctx);
    await ctx.addInitScript({ content: 'window.__name = (f) => f;' });
    await ctx.addInitScript(() => { try { localStorage.setItem('xtsy_consent_v2', JSON.stringify({ necessary: true, analytics: true, marketing: false, personalization: false, timestamp: new Date().toISOString(), version: '2.0' })); } catch { /* */ } });
    await ctx.route('**/__l5e/**', async (route) => { try { const u = new URL(route.request().url()); await route.fulfill({ response: await route.fetch({ url: `https://xtsy.one${u.pathname}` }) }); } catch { await route.continue(); } });
    for (const route of ROUTES) {
      const page = await ctx.newPage();
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message.slice(0, 200)));
      page.on('console', (m) => { if (m.type() === 'error' && !/frame-ancestors|X-Frame-Options|Failed to load resource/.test(m.text())) errors.push(m.text().slice(0, 200)); });
      const row: Record<string, unknown> = { viewport: vp.name, route };
      try {
        const res = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 60000 });
        row.status = res?.status();
        await page.waitForTimeout(800);
        row.title = await page.title();
        row.design = (await page.locator('nav[aria-label="Main"]').count()) ? 'v2' : 'legacy';
        await page.screenshot({ path: `${OUT}/${vp.name}-${route === '/' ? 'home' : route.slice(1).replace(/\//g, '_')}.jpg`, type: 'jpeg', quality: 55 });
        await page.addScriptTag({ content: AXE });
        const axe = await page.evaluate(async () => {
          // @ts-expect-error injected
          const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }, resultTypes: ['violations'] });
          return r.violations.map((v: { id: string; impact: string; help: string; nodes: { target: string[]; failureSummary?: string }[] }) => ({ id: v.id, impact: v.impact, help: v.help, count: v.nodes.length, examples: v.nodes.slice(0, 3).map((n) => n.target.join(' ')), detail: v.nodes.slice(0, 3).map((n) => (n.failureSummary || '').slice(0, 240)) }));
        });
        row.axe = axe;
        row.ui = await interactions(page, vp.mobile);
      } catch (e) { row.error = String(e).slice(0, 600); }
      row.errors = errors.slice(0, 5);
      rows.push(row);
      console.log(`${vp.name} ${route} ${row.status} ${row.design} axe=${(row.axe as unknown[] | undefined)?.length ?? '?'} ${JSON.stringify(row.ui ?? {}).slice(0, 160)}`);
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(`${OUT}/ui.json`, JSON.stringify(rows, null, 1));
}
main();
