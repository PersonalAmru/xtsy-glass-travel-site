// @vitest-environment jsdom
/**
 * Legacy-slug rewrite tests
 * -------------------------
 * For every entry in RECOVERY_REDIRECTS, simulate a browser landing on the
 * legacy URL and verify the HEAD inline script:
 *   1. Rewrites window.location.pathname to the canonical target.
 *   2. Updates <link rel="canonical"> to the canonical URL.
 *   3. Sets a matching <title> + meta description from the slim map.
 *
 * Then run the BODY script and verify the right JSON-LD blocks land in <head>.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateInlineHeadScript,
  generateInlineBodyScript,
  generateSEOMap,
  generateRedirectMap,
} from '../scripts/generateSEOInlineScript';

const SITE = 'https://xtsy.one';

function bootDocument(pathname: string) {
  document.documentElement.innerHTML = `<head>
    <title>placeholder</title>
    <meta name="description" content="placeholder">
    <link rel="canonical" href="${SITE}/">
    <meta property="og:title" content="">
    <meta property="og:description" content="">
    <meta property="og:url" content="">
    <meta name="twitter:title" content="">
    <meta name="twitter:description" content="">
  </head><body></body>`;
  history.replaceState(null, '', pathname);
}

function runHeadScript() {
  const html = generateInlineHeadScript();
  const code = html.replace(/^<script>|<\/script>$/g, '');
  // eslint-disable-next-line no-new-func
  new Function(code)();
}

const REDIRECTS = generateRedirectMap();
const MAP = generateSEOMap();

describe('Legacy slug rewrites', () => {
  const samples = Object.entries(REDIRECTS).slice(0, 50); // hard-cap so suite runs fast
  if (samples.length === 0) {
    it.skip('no redirects configured', () => {});
    return;
  }

  beforeEach(() => {
    delete (window as any).__xtsySlug;
  });

  it.each(samples)('rewrites /%s → /%s with correct canonical + title', (from, to) => {
    bootDocument(`/${from}`);
    runHeadScript();

    // 1) URL rewritten
    expect(location.pathname).toBe(`/${to}`);
    // 2) Canonical updated
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href'))
      .toBe(`${SITE}/${to}`);
    // 3) Slug stashed for body script
    expect((window as any).__xtsySlug).toBe(to);
    // 4) Title matches the SEO map (only when target has metadata)
    const target = MAP[to];
    if (target) {
      expect(document.title).toBe(target.t);
      expect(document.querySelector('meta[name="description"]')?.getAttribute('content'))
        .toBe(target.d);
    }
  });
});

describe('BODY script injects JSON-LD for redirected target', () => {
  it('emits entity + FAQPage JSON-LD for a redirected route', async () => {
    const [from, to] = Object.entries(REDIRECTS).find(
      ([, t]) => MAP[t] && MAP[t].f && MAP[t].f!.length,
    ) || [];
    if (!from || !to) return; // skip if no redirect lands on a FAQ page

    bootDocument(`/${from}`);
    runHeadScript();
    expect((window as any).__xtsySlug).toBe(to);

    // Stub fetch to return our local map (avoids network in jsdom)
    (global as any).fetch = async () => ({ ok: true, json: async () => MAP });

    const body = generateInlineBodyScript('test');
    const code = body.replace(/^<script>|<\/script>$/g, '');
    // eslint-disable-next-line no-new-func
    new Function(code)();

    // Body script defers via setTimeout; flush both microtasks + timers.
    await new Promise(r => setTimeout(r, 50));
    // Force the hard-fallback timer (LCP guard) to fire.
    await new Promise(r => setTimeout(r, 2300));

    const ldNodes = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const types = ldNodes.map(n => {
      try { return JSON.parse(n.textContent || '{}')['@type']; } catch { return null; }
    });
    expect(types).toContain('FAQPage');
    expect((window as any).__xtsySEOInjected).toBe(true);
  }, 10000);
});

describe('LCP guard — runtime injection deadline', () => {
  it('marks injection complete before the 2500ms deadline for non-bot UAs', async () => {
    bootDocument('/best-hostel-in-shillong');
    runHeadScript();
    (global as any).fetch = async () => ({ ok: true, json: async () => MAP });

    const start = performance.now();
    const body = generateInlineBodyScript('test');
    new Function(body.replace(/^<script>|<\/script>$/g, ''))();

    // requestIdleCallback is unavailable in jsdom → falls through to setTimeout(800)
    await new Promise(r => setTimeout(r, 1200));
    const elapsed = performance.now() - start;
    expect((window as any).__xtsySEOInjected).toBe(true);
    expect(elapsed).toBeLessThan(2500);
  }, 5000);
});
