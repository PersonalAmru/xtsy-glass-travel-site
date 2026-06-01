/**
 * csProxyPath — pure resolver for the first-party Contentsquare/Hotjar proxy.
 *
 * Shared, framework-free logic used by:
 *   • supabase/functions/cs-proxy (inlined copy — Deno can't import `src`)
 *   • tests/cspAndProxy.test.ts (imports this module directly)
 *
 * It maps a first-party sub-path (everything after `/cs/` or `/cs-proxy/`) to a
 * validated upstream Contentsquare/Hotjar URL. Two path forms are supported:
 *
 *   1. Prefix form  — `uxa/<id>.js`, `t/...`, `log/...`  → t.contentsquare.net
 *      (covers the entry UXA tag AND its same-origin subresources)
 *   2. Host form     — `h/<host>/<path>`                  → https://<host>/<path>
 *      (covers subresources served from other *.contentsquare.net / *.hotjar.com
 *       hosts; host is strictly allow-listed)
 *
 * Security: rejects path traversal, restricts the character set, allow-lists
 * both the path prefixes and the upstream host suffixes. It is NOT an open proxy.
 */

export interface CsProxyResolution {
  ok: boolean;
  /** Fully-qualified upstream URL to fetch when ok. */
  upstreamUrl?: string;
  /** Human-readable reason when !ok. */
  reason?: string;
  /** Suggested HTTP status to return when !ok. */
  status?: number;
}

/** Default Contentsquare origin for the prefix form. */
export const CS_DEFAULT_ORIGIN = 'https://t.contentsquare.net';

/** Upstream host suffixes allowed for the host-routed form. */
export const CS_ALLOWED_HOST_SUFFIXES = [
  '.contentsquare.net',
  '.hotjar.com',
  '.hotjar.io',
];

/**
 * First path segment allow-list for the prefix form (proxied to the default
 * Contentsquare origin). `uxa` is the entry tag; the rest are the namespaces
 * the UXA runtime fetches its subresources, beacons and config from.
 */
export const CS_ALLOWED_PREFIXES = [
  'uxa', 't', 'log', 'logs', 'b', 'bb', 'pl', 'c', 'm', 'd', 'i', 's', 'hm',
];

/** Resolve a sub-path to a validated upstream URL (or an error result). */
export function resolveCsProxyTarget(subPath: string, search = ''): CsProxyResolution {
  const sub = (subPath || '').replace(/^\/+/, '');

  if (!sub) return { ok: false, reason: 'empty path', status: 404 };

  // Reject traversal and anything outside a conservative URL-path charset.
  if (sub.includes('..') || !/^[A-Za-z0-9._/-]+$/.test(sub)) {
    return { ok: false, reason: 'invalid path', status: 400 };
  }

  // --- Host-routed form: h/<host>/<path> ---
  if (sub.startsWith('h/')) {
    const rest = sub.slice(2);
    const slash = rest.indexOf('/');
    if (slash <= 0) return { ok: false, reason: 'missing host or path', status: 400 };
    const host = rest.slice(0, slash).toLowerCase();
    const path = rest.slice(slash + 1);
    if (!/^[a-z0-9.-]+$/.test(host) || !CS_ALLOWED_HOST_SUFFIXES.some((s) => host.endsWith(s))) {
      return { ok: false, reason: `host not allowed: ${host}`, status: 403 };
    }
    if (!path) return { ok: false, reason: 'empty host path', status: 400 };
    return { ok: true, upstreamUrl: `https://${host}/${path}${search}` };
  }

  // --- Prefix form → default Contentsquare origin ---
  const prefix = sub.split('/')[0];
  if (!CS_ALLOWED_PREFIXES.includes(prefix)) {
    return { ok: false, reason: `prefix not allowed: ${prefix}`, status: 403 };
  }
  return { ok: true, upstreamUrl: `${CS_DEFAULT_ORIGIN}/${sub}${search}` };
}

/** Infer a sensible content-type from a path when upstream omits one. */
export function inferContentType(path: string): string {
  const p = path.toLowerCase().split('?')[0];
  if (p.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (p.endsWith('.json')) return 'application/json; charset=utf-8';
  if (p.endsWith('.css')) return 'text/css; charset=utf-8';
  if (p.endsWith('.gif')) return 'image/gif';
  if (p.endsWith('.png')) return 'image/png';
  if (p.endsWith('.svg')) return 'image/svg+xml';
  if (p.endsWith('.html')) return 'text/html; charset=utf-8';
  return 'application/octet-stream';
}
