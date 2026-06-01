/**
 * cs-proxy — First-party reverse proxy for the Contentsquare / Hotjar tag
 * AND its runtime subresources.
 *
 * Goal: serve Contentsquare/Hotjar assets from a first-party path so
 * domain-based blocklists (uBlock, Brave Shields, AdGuard, Pi-hole, NextDNS)
 * that target `contentsquare.net` / `hotjar.com` do not stop the requests.
 *
 * Public routes (production), via the Cloudflare Worker which rewrites
 * `xtsy.one/cs/<sub>` ──▶ `<project>.functions.supabase.co/cs-proxy/<sub>`:
 *
 *   Entry tag (prefix form):
 *     xtsy.one/cs/uxa/<id>.js              → t.contentsquare.net/uxa/<id>.js
 *   Same-origin subresources (prefix form):
 *     xtsy.one/cs/t/...  /cs/log/...  etc. → t.contentsquare.net/<path>
 *   Cross-host subresources (host form):
 *     xtsy.one/cs/h/<host>/<path>          → https://<host>/<path>
 *       where <host> ends with .contentsquare.net / .hotjar.com / .hotjar.io
 *
 * Security (mirrors src/utils/csProxyPath.ts — kept in sync by tests):
 *   • Path traversal rejected; conservative charset enforced.
 *   • Prefix and upstream host are strictly allow-listed (no open proxy).
 *   • GET/HEAD only. Long edge/browser cache + CORS on success.
 */

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, range',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// ── Inlined copy of src/utils/csProxyPath.ts (Deno can't import `src`) ──
const CS_DEFAULT_ORIGIN = 'https://t.contentsquare.net';
const CS_ALLOWED_HOST_SUFFIXES = ['.contentsquare.net', '.hotjar.com', '.hotjar.io'];
const CS_ALLOWED_PREFIXES = ['uxa', 't', 'log', 'logs', 'b', 'bb', 'pl', 'c', 'm', 'd', 'i', 's', 'hm'];

interface CsProxyResolution {
  ok: boolean;
  upstreamUrl?: string;
  reason?: string;
  status?: number;
}

function resolveCsProxyTarget(subPath: string, search = ''): CsProxyResolution {
  const sub = (subPath || '').replace(/^\/+/, '');
  if (!sub) return { ok: false, reason: 'empty path', status: 404 };
  if (sub.includes('..') || !/^[A-Za-z0-9._/-]+$/.test(sub)) {
    return { ok: false, reason: 'invalid path', status: 400 };
  }
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
  const prefix = sub.split('/')[0];
  if (!CS_ALLOWED_PREFIXES.includes(prefix)) {
    return { ok: false, reason: `prefix not allowed: ${prefix}`, status: 403 };
  }
  return { ok: true, upstreamUrl: `${CS_DEFAULT_ORIGIN}/${sub}${search}` };
}

function inferContentType(path: string): string {
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

/** Extract the upstream sub-path (everything after `/cs-proxy/` or `/cs/`). */
function extractSubPath(pathname: string): string | null {
  for (const m of ['/cs-proxy/', '/cs/']) {
    const idx = pathname.indexOf(m);
    if (idx !== -1) return pathname.slice(idx + m.length);
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const sub = extractSubPath(url.pathname);

    if (sub === null) {
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    }

    const resolved = resolveCsProxyTarget(sub, url.search);
    if (!resolved.ok || !resolved.upstreamUrl) {
      return new Response(resolved.reason ?? 'Invalid path', {
        status: resolved.status ?? 400,
        headers: { ...corsHeaders, 'cache-control': 'no-store' },
      });
    }

    const upstream = await fetch(resolved.upstreamUrl, {
      method: req.method,
      headers: {
        'user-agent': req.headers.get('user-agent') ?? 'xtsy-cs-proxy/1.0',
        'accept': req.headers.get('accept') ?? '*/*',
        'accept-encoding': 'gzip, br',
        ...(req.headers.get('range') ? { range: req.headers.get('range')! } : {}),
      },
    });

    if (!upstream.ok) {
      return new Response(`Upstream error ${upstream.status}`, {
        status: upstream.status,
        headers: { ...corsHeaders, 'cache-control': 'no-store' },
      });
    }

    const body = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get('content-type') ?? inferContentType(sub);

    return new Response(body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'content-type': contentType,
        // Cache hard at the edge/browser — asset paths are versioned upstream.
        'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        'x-proxied-by': 'xtsy-cs-proxy',
        'x-upstream': new URL(resolved.upstreamUrl).origin,
      },
    });
  } catch (err) {
    return new Response(`Proxy failure: ${err instanceof Error ? err.message : String(err)}`, {
      status: 502,
      headers: { ...corsHeaders, 'cache-control': 'no-store' },
    });
  }
});
