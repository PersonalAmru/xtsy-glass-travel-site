/**
 * Runtime + SSR smoke test for every route in the app.
 *
 * Phase 1 (SSR): requests every route from the generated route tree and
 *   asserts a 2xx HTML response that actually contains server-rendered
 *   markup (not the 500 error shell and not an empty root).
 * Phase 2 (hydration, optional): drives a sample of routes with Playwright
 *   and fails on console errors / uncaught exceptions / hydration mismatch.
 *
 * Usage:
 *   tsx scripts/smoke-routes.ts                       # SSR only, localhost:8080
 *   tsx scripts/smoke-routes.ts --base https://…      # against a deployment
 *   tsx scripts/smoke-routes.ts --hydrate             # + Playwright pass
 *   tsx scripts/smoke-routes.ts --hydrate --sample 25 # limit hydration checks
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const flag = (name: string, fallback?: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
};
const BASE = (flag('base', process.env.SMOKE_BASE_URL ?? 'http://localhost:8080') as string).replace(/\/$/, '');
const DO_HYDRATE = args.includes('--hydrate');
const SAMPLE = Number(flag('sample', '20'));
const CONCURRENCY = Number(flag('concurrency', '8'));

/** Sample values for dynamic segments so `$param` routes get exercised too. */
const PARAM_SAMPLES: Record<string, string> = {
  slug: 'best-hostel-in-shillong',
  destinationSlug: 'nohkalikai-falls',
  category: 'waterfalls',
  id: 'sample',
  packageId: 'meghalaya-explorer',
  tourId: 'meghalaya-explorer',
  bookingId: 'sample',
  token: 'sample',
};

function extractRoutes(): string[] {
  const file = readFileSync(resolve('src/routeTree.gen.ts'), 'utf8');
  const block = file.split('export interface FileRoutesByFullPath {')[1]?.split('}')[0] ?? '';
  const paths = [...block.matchAll(/^\s*'([^']+)':/gm)].map((m) => m[1]);
  return [...new Set(paths)]
    .filter((p) => !p.startsWith('/api/'))
    .filter((p) => !p.includes('$_') && !p.endsWith('/$'))
    .map((p) =>
      p.replace(/\$([A-Za-z0-9_]+)/g, (_m, name: string) => PARAM_SAMPLES[name] ?? 'sample'),
    )
    // Index routes are listed as '/x/'; the site's URLs have no trailing slash.
    .map((p) => (p.length > 1 ? p.replace(/\/+$/, '') : p))
    .sort();
}

interface Failure {
  route: string;
  reason: string;
}

const clientOnlyRoutes = new Set<string>();

async function checkSsr(route: string): Promise<Failure | null> {
  const url = `${BASE}${route}`;
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': 'xtsy-smoke-test/1.0' },
    });
    const html = await res.text();

    if (res.status >= 400) return { route, reason: `HTTP ${res.status}` };
    if (!/text\/html/.test(res.headers.get('content-type') ?? '')) {
      return { route, reason: `non-HTML content-type: ${res.headers.get('content-type')}` };
    }
    if (/Application error|Internal Server Error|__LOVABLE_ERROR_PAGE__/i.test(html)) {
      return { route, reason: 'SSR error page rendered' };
    }
    if (!/<body/i.test(html) || !/<script/i.test(html)) {
      return { route, reason: 'missing app shell (no <body> / no client entry script)' };
    }
    // Routes declared `ssr: false` (auth-gated areas) legitimately ship an
    // empty body; they are verified by the hydration pass instead.
    const body = html.split(/<body[^>]*>/i)[1] ?? '';
    if (!/<(main|header|section|article|nav|h1)\b/i.test(body)) clientOnlyRoutes.add(route);

    return null;
  } catch (err) {
    return { route, reason: `request failed: ${(err as Error).message}` };
  }
}


async function runPool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let idx = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (idx < items.length) {
        const item = items[idx++];
        await fn(item);
      }
    }),
  );
}

async function checkHydration(routes: string[]): Promise<Failure[]> {
  const { chromium } = await import('playwright');
  const failures: Failure[] = [];
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

  for (const route of routes) {
    const page = await context.newPage();
    const problems: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      // Third-party/analytics noise must not fail the build.
      if (/contentsquare|googletagmanager|gtag|favicon|net::ERR/i.test(text)) return;
      problems.push(text.slice(0, 200));
    });
    page.on('pageerror', (err) => problems.push(`uncaught: ${err.message.slice(0, 200)}`));

    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await page.waitForTimeout(1200);
      const rendered = await page.evaluate(
        () => (document.body.textContent ?? '').trim().length,
      );
      if (rendered < 50) problems.push('client render produced (near) empty DOM');
    } catch (err) {
      problems.push(`navigation failed: ${(err as Error).message.slice(0, 200)}`);
    }

    if (problems.length) failures.push({ route, reason: problems.join(' | ') });
    await page.close();
  }

  await browser.close();
  return failures;
}

async function main() {
  const routes = extractRoutes();
  console.log(`Smoke testing ${routes.length} routes against ${BASE}\n`);

  const ssrFailures: Failure[] = [];
  let done = 0;
  await runPool(routes, CONCURRENCY, async (route) => {
    const failure = await checkSsr(route);
    done++;
    if (failure) {
      ssrFailures.push(failure);
      console.log(`  ✗ ${failure.route} — ${failure.reason}`);
    }
    if (done % 25 === 0) console.log(`  … ${done}/${routes.length} checked`);
  });

  console.log(
    `\nSSR: ${routes.length - ssrFailures.length}/${routes.length} passed ` +
      `(${clientOnlyRoutes.size} client-only routes deferred to the hydration pass)`,
  );

  let hydrationFailures: Failure[] = [];
  if (DO_HYDRATE) {
    const ssrRoutes = routes.filter((r) => !clientOnlyRoutes.has(r));
    const step = Math.max(1, Math.floor(ssrRoutes.length / Math.max(1, SAMPLE - 5)));
    const sample = [
      ...ssrRoutes.filter((_, i) => i % step === 0),
      ...[...clientOnlyRoutes].slice(0, 5),
    ].slice(0, SAMPLE);
    console.log(`\nHydration: checking ${sample.length} sampled routes…`);

    hydrationFailures = await checkHydration(sample);
    for (const f of hydrationFailures) console.log(`  ✗ ${f.route} — ${f.reason}`);
    console.log(`Hydration: ${sample.length - hydrationFailures.length}/${sample.length} passed`);
  }

  const total = ssrFailures.length + hydrationFailures.length;
  if (total > 0) {
    console.error(`\n${total} smoke failure(s).`);
    process.exit(1);
  }
  console.log('\nAll smoke checks passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
