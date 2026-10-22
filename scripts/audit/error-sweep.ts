/**
 * Error sweep — loads every page a visitor or crawler can reach and records what goes wrong.
 *
 * Pages: every URL in the live sitemaps, plus every non-parameter app route (booking flow,
 * account, AI planner, franchise, legal…) and a deliberate 404 probe.
 *
 * Per page (Chromium, mid-range phone viewport, no throttling):
 *   - HTTP status, redirect chain, final URL
 *   - uncaught JavaScript exceptions and console errors (with the script location)
 *   - hydration / React errors
 *   - every failed request: network failure or HTTP >= 400, with its host and resource type
 *   - images that failed to load (naturalWidth 0) and images without alt text
 *   - SEO errors: missing/duplicate title, description, canonical (and canonical pointing
 *     elsewhere), H1 count, noindex, <html lang>, broken JSON-LD, soft 404 (200 with "not found")
 *   - mixed content (http:// resources)
 *   - internal links found on the page (checked later by error-merge.ts)
 *
 * Polite: CONCURRENCY tabs per shard and one retry (after a pause) for a 429 document response,
 * so the sweep itself doesn't trip rate limits.
 * Sharded: SHARD of SHARDS. Writes <OUT>/errors-<SHARD>.json.
 */
import { chromium, devices, type Browser, type Page } from '@playwright/test';
import fs from 'fs';
import { sitemapUrls } from './perf-sitemap';
import { blockAnalytics } from './no-analytics';

const BASE = (process.env.BASE_URL || 'https://xtsy.one').replace(/\/$/, '');
const OUT = process.env.OUT_DIR || 'errors';
const SHARD = Number(process.env.SHARD || 0);
const SHARDS = Number(process.env.SHARDS || 1);
const CONCURRENCY = Number(process.env.CONCURRENCY || 2);
const LIMIT = Number(process.env.LIMIT || 0);

/** App routes that are not (or not necessarily) in the sitemaps. */
const APP_ROUTES = [
  '/', '/book', '/book/select', '/book/campsite', '/auth', '/profile', '/plan-trip-with-ai', '/install',
  '/franchise', '/franchise/install', '/franchise/login', '/unsubscribe', '/terms', '/terms-of-service',
  '/privacy-policy', '/pricing-cancellation-policy', '/safety-house-rules', '/contact', '/faq', '/guides',
  '/tours', '/tours?group=northeast', '/destinations', '/expeditions', '/tab-bistro', '/tab-bistro/catering',
  '/gallery', '/merch', '/xtsy-rentals', '/xtsy-270', '/work-from-home', '/female-travellers', '/pet-friendly',
  '/cheap-hostel-shillong', '/cheap-hostel-in-shillong', '/cheap-hostels-shillong',
  '/travel-guide/guwahati-to-shillong-transport', '/travel-guide/how-to-reach-meghalaya',
  '/travel-guide/meghalaya-for-international-tourists',
];
const NOT_FOUND_PROBE = '/xtsy-error-sweep-missing-page';

type Row = Record<string, unknown>;

async function checkPage(browser: Browser, path: string, source: string): Promise<Row> {
  const ctx = await browser.newContext({ ...devices['Pixel 7'], locale: 'en-IN', timezoneId: 'Asia/Kolkata' });
  await blockAnalytics(ctx);
  // Treat the visitor as having chosen cookies already, so the consent bar does not hide content.
  await ctx.addInitScript(`try{localStorage.setItem('xtsy_consent_v2',JSON.stringify({necessary:true,analytics:true,marketing:false,personalization:false,timestamp:new Date().toISOString(),version:'2.0'}))}catch(e){}`);
  await ctx.addInitScript('globalThis.__name = (f) => f;');
  const page: Page = await ctx.newPage();
  const jsErrors: string[] = [];
  const consoleErrors: string[] = [];
  const failed: { url: string; status: number | string; type: string; host: string }[] = [];
  page.on('pageerror', (e) => jsErrors.push(String(e.message).slice(0, 220)));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const loc = m.location()?.url ? ` @ ${m.location().url.replace(BASE, '').slice(0, 100)}` : '';
    consoleErrors.push(`${m.text().slice(0, 200)}${loc}`);
  });
  page.on('requestfailed', (r) => {
    const f = r.failure()?.errorText || 'failed';
    if (/ERR_ABORTED/.test(f)) return; // navigation-cancelled prefetches are not errors
    failed.push({ url: r.url().slice(0, 200), status: f, type: r.resourceType(), host: new URL(r.url()).host });
  });
  page.on('response', (r) => {
    if (r.status() >= 400 && r.url() !== BASE + path) {
      failed.push({ url: r.url().slice(0, 200), status: r.status(), type: r.request().resourceType(), host: new URL(r.url()).host });
    }
  });

  const row: Row = { path, source };
  try {
    let resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 45000 });
    if (resp && resp.status() === 429) {
      row.retriedAfter429 = true;
      await page.waitForTimeout(8000);
      resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 45000 });
    }
    row.status = resp?.status() ?? 0;
    const chain: string[] = [];
    let req = resp?.request().redirectedFrom();
    while (req) { chain.unshift(req.url().replace(BASE, '')); req = req.redirectedFrom(); }
    row.redirects = chain;
    row.finalPath = page.url().replace(BASE, '');
    // Let client code run (hydration, lazy chunks, analytics) before reading the page.
    await page.waitForTimeout(3500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)).catch(() => {});
    await page.waitForTimeout(1500);

    const info = await page.evaluate(() => {
      const q = (s: string) => document.querySelector(s);
      const metas = (n: string) => [...document.querySelectorAll(`meta[name="${n}"]`)].map((m) => m.getAttribute('content') || '');
      const ld: string[] = [];
      for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
        try { JSON.parse(s.textContent || ''); } catch (e) { ld.push(String(e).slice(0, 120)); }
      }
      const imgs = [...document.images];
      const text = (document.body?.innerText || '').replace(/\s+/g, ' ');
      const links = [...document.querySelectorAll('a[href]')].map((a) => (a as HTMLAnchorElement).href)
        .filter((h) => h.startsWith(location.origin)).map((h) => h.replace(location.origin, '').split('#')[0]);
      return {
        title: document.title,
        titleCount: document.querySelectorAll('head title').length,
        descriptions: metas('description'),
        canonical: q('link[rel="canonical"]')?.getAttribute('href') || '',
        canonicalCount: document.querySelectorAll('link[rel="canonical"]').length,
        robots: metas('robots').join(','),
        h1: [...document.querySelectorAll('h1')].map((h) => (h.textContent || '').trim().slice(0, 80)),
        lang: document.documentElement.lang,
        ldErrors: ld,
        ldCount: document.querySelectorAll('script[type="application/ld+json"]').length,
        brokenImages: imgs.filter((i) => i.complete && i.currentSrc && i.naturalWidth === 0).map((i) => i.currentSrc.slice(0, 160)),
        noAlt: imgs.filter((i) => !i.hasAttribute('alt')).map((i) => (i.currentSrc || i.src).slice(0, 120)),
        mixed: [...document.querySelectorAll('[src^="http://"],link[href^="http://"]')].map((e) => (e.getAttribute('src') || e.getAttribute('href') || '').slice(0, 120)),
        words: text.split(' ').length,
        soft404: /page not found|404|doesn['’]t exist|could not be found/i.test(text.slice(0, 600)),
        errorBoundary: /something went wrong|unexpected error|failed to load/i.test(text.slice(0, 2000)),
        links: [...new Set(links)].slice(0, 400),
      };
    });
    Object.assign(row, info);
  } catch (e) {
    row.status = row.status ?? 0;
    row.loadError = String((e as Error).message).slice(0, 200);
  }
  row.jsErrors = [...new Set(jsErrors)];
  row.consoleErrors = [...new Set(consoleErrors)];
  const seen = new Set<string>();
  row.failedRequests = failed.filter((f) => { const k = `${f.url}|${f.status}`; if (seen.has(k)) return false; seen.add(k); return true; });
  row.hydration = (row.consoleErrors as string[]).concat(row.jsErrors as string[]).filter((m) => /hydrat|did not match|Minified React error #4(18|19|21|23|25)/i.test(m));
  await ctx.close();
  return row;
}

async function main() {
  const fromSitemap = await sitemapUrls(BASE);
  const all = new Map<string, string>();
  for (const u of fromSitemap) all.set(u.path, u.sitemap);
  for (const r of APP_ROUTES) if (!all.has(r)) all.set(r, 'app-route');
  all.set(NOT_FOUND_PROBE, 'probe-404');
  let list = [...all.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  if (LIMIT) list = list.slice(0, LIMIT);
  const mine = list.filter((_, i) => i % SHARDS === SHARD);
  console.log(`shard ${SHARD}/${SHARDS}: ${mine.length} of ${list.length} pages`);

  const browser = await chromium.launch();
  const rows: Row[] = [];
  let next = 0;
  async function worker() {
    while (next < mine.length) {
      const [path, source] = mine[next++];
      const row = await checkPage(browser, path, source);
      rows.push(row);
      const n = (row.jsErrors as string[]).length + (row.failedRequests as unknown[]).length + ((row.brokenImages as unknown[]) || []).length;
      console.log(`${row.status} ${path} js=${(row.jsErrors as string[]).length} console=${(row.consoleErrors as string[]).length} failed=${(row.failedRequests as unknown[]).length} issues=${n}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await browser.close();
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(`${OUT}/errors-${SHARD}.json`, JSON.stringify(rows));
}

main().catch((e) => { console.error(e); process.exit(1); });
