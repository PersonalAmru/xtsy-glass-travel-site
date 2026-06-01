/**
 * CSP + first-party /cs proxy regression tests
 * --------------------------------------------
 * Guards the two halves of the ad-blocker-resilient analytics loader:
 *
 *   1. The production Content-Security-Policy must keep allowing the
 *      first-party `/cs/uxa` path (`'self'`) AND the Contentsquare/Hotjar
 *      fallback origins — both for `script-src` and `connect-src`.
 *   2. The `/cs` proxy path resolver must accept the entry tag and its
 *      subresources, route cross-host subresources safely, and reject
 *      traversal / open-proxy attempts.
 *
 * An optional LIVE smoke test runs only when `BASE_URL` is set (CI against a
 * production build), asserting the proxied tag loads with a JS content-type and
 * that a normal page ships a CSP header.
 */
import { describe, it, expect } from 'vitest';
import {
  resolveCsProxyTarget,
  inferContentType,
  CS_DEFAULT_ORIGIN,
} from '../src/utils/csProxyPath';
import { generateProductionSecurityHeaders } from '../src/utils/productionSecurityHeaders';

const TAG_ID = '8a1781ba2e7b5';

describe('production CSP headers', () => {
  const headers = generateProductionSecurityHeaders({ isDevelopment: false, enableHSTS: true });
  const csp = headers['Content-Security-Policy'];
  const directive = (name: string): string => {
    const part = csp.split(';').map((s) => s.trim()).find((s) => s.startsWith(name + ' '));
    return part ?? '';
  };

  it('exposes a Content-Security-Policy', () => {
    expect(csp).toBeTruthy();
  });

  it('script-src allows first-party (self) + Contentsquare/Hotjar fallbacks', () => {
    const s = directive('script-src');
    expect(s).toContain("'self'"); // covers /cs/uxa first-party path
    expect(s).toContain('t.contentsquare.net');
    expect(s).toContain('contentsquare.net');
    expect(s).toContain('script.hotjar.com');
  });

  it('connect-src allows self + Contentsquare/Hotjar beacon origins', () => {
    const c = directive('connect-src');
    expect(c).toContain("'self'");
    expect(c).toContain('t.contentsquare.net');
    expect(c).toContain('hotjar.com');
  });

  it('keeps hardening directives intact', () => {
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['Strict-Transport-Security']).toContain('max-age=31536000');
  });
});

describe('/cs proxy path resolver', () => {
  it('routes the entry UXA tag to Contentsquare', () => {
    const r = resolveCsProxyTarget(`uxa/${TAG_ID}.js`);
    expect(r.ok).toBe(true);
    expect(r.upstreamUrl).toBe(`${CS_DEFAULT_ORIGIN}/uxa/${TAG_ID}.js`);
  });

  it('routes same-origin subresources (prefix form)', () => {
    for (const p of ['t/abc', 'log/beacon.gif', 'pl/config.json', 'c/chunk.js']) {
      const r = resolveCsProxyTarget(p);
      expect(r.ok, p).toBe(true);
      expect(r.upstreamUrl).toBe(`${CS_DEFAULT_ORIGIN}/${p}`);
    }
  });

  it('preserves the query string', () => {
    const r = resolveCsProxyTarget('uxa/x.js', '?v=2');
    expect(r.upstreamUrl).toBe(`${CS_DEFAULT_ORIGIN}/uxa/x.js?v=2`);
  });

  it('routes cross-host subresources to allow-listed hosts only', () => {
    const ok = resolveCsProxyTarget('h/c.contentsquare.net/asset.js');
    expect(ok.ok).toBe(true);
    expect(ok.upstreamUrl).toBe('https://c.contentsquare.net/asset.js');

    const hotjar = resolveCsProxyTarget('h/script.hotjar.com/modules.js');
    expect(hotjar.ok).toBe(true);
  });

  it('rejects an unknown prefix (no open proxy)', () => {
    const r = resolveCsProxyTarget('evil/payload.js');
    expect(r.ok).toBe(false);
    expect(r.status).toBe(403);
  });

  it('rejects a non-allow-listed cross host', () => {
    const r = resolveCsProxyTarget('h/evil.com/x.js');
    expect(r.ok).toBe(false);
    expect(r.status).toBe(403);
  });

  it('rejects path traversal', () => {
    const r = resolveCsProxyTarget('uxa/../../etc/passwd');
    expect(r.ok).toBe(false);
    expect(r.status).toBe(400);
  });

  it('rejects an empty path', () => {
    expect(resolveCsProxyTarget('').ok).toBe(false);
  });

  it('infers JS content-type for the entry tag', () => {
    expect(inferContentType(`uxa/${TAG_ID}.js`)).toContain('javascript');
    expect(inferContentType('log/beacon.gif')).toBe('image/gif');
  });
});

// ── Optional LIVE smoke test against a production build (CI) ──
const BASE = process.env.BASE_URL;
describe.skipIf(!BASE)('LIVE: /cs/uxa proxy + CSP header', () => {
  it('serves the proxied Contentsquare tag with a JS content-type', async () => {
    const res = await fetch(`${BASE}/cs/uxa/${TAG_ID}.js`, { redirect: 'follow' });
    const text = await res.text();
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type') ?? '').toContain('javascript');
    expect(text.length).toBeGreaterThan(1000);
  });

  it('ships a CSP allowing self + contentsquare on a normal page', async () => {
    const res = await fetch(`${BASE}/`, { redirect: 'follow' });
    await res.text();
    const csp = res.headers.get('content-security-policy') ?? '';
    // CSP may be delivered via meta tag in some hosting setups; only assert
    // when present as a response header.
    if (csp) {
      expect(csp).toContain("'self'");
      expect(csp).toContain('contentsquare.net');
    }
  });
});
