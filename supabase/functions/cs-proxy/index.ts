/**
 * cs-proxy — First-party reverse proxy for the Contentsquare / Hotjar tag.
 *
 * Goal: serve `https://t.contentsquare.net/uxa/<id>.js` from a first-party
 * path so domain-based blocklists (uBlock, Brave Shields, AdGuard, Pi-hole,
 * NextDNS) that target `contentsquare.net` do not stop the request.
 *
 * Public routes (production):
 *   xtsy.one/cs/uxa/<id>.js   ── Cloudflare Worker rewrites to ──▶
 *   <project>.functions.supabase.co/cs-proxy/uxa/<id>.js
 *
 * Security:
 *   • ONLY paths under `uxa/` are proxied (no open proxy).
 *   • Path is sanitised to `[A-Za-z0-9._/-]` and `..` is rejected.
 *   • Response is returned as `application/javascript` with long cache + CORS.
 *
 * NOTE: This proxies the *loader* script first-party. The script may still
 * fetch sub-resources from contentsquare.net at runtime; those remain subject
 * to client blockers. Proxying the entry script is the highest-leverage step.
 */

const UPSTREAM_ORIGIN = 'https://t.contentsquare.net';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, range',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

/** Extract the upstream sub-path (everything after `/cs-proxy` or `/cs`). */
function extractSubPath(pathname: string): string | null {
  // Strip a leading function mount segment, regardless of which gateway called us.
  let p = pathname;
  const markers = ['/cs-proxy/', '/cs/'];
  for (const m of markers) {
    const idx = p.indexOf(m);
    if (idx !== -1) {
      p = p.slice(idx + m.length);
      return p;
    }
  }
  // Bare invocation (e.g. `/cs-proxy` with the file in query) — not supported.
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

    if (!sub) {
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    }

    // --- Hardening: only allow the Contentsquare UXA tag namespace ---
    if (!sub.startsWith('uxa/')) {
      return new Response('Forbidden path', { status: 403, headers: corsHeaders });
    }
    if (sub.includes('..') || !/^[A-Za-z0-9._/-]+$/.test(sub)) {
      return new Response('Invalid path', { status: 400, headers: corsHeaders });
    }

    const upstreamUrl = `${UPSTREAM_ORIGIN}/${sub}${url.search}`;

    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers: {
        // Forward only safe headers; present a clean UA to the CDN.
        'user-agent': req.headers.get('user-agent') ?? 'xtsy-cs-proxy/1.0',
        'accept': req.headers.get('accept') ?? '*/*',
        'accept-encoding': 'gzip, br',
      },
    });

    if (!upstream.ok) {
      return new Response(`Upstream error ${upstream.status}`, {
        status: upstream.status,
        headers: { ...corsHeaders, 'cache-control': 'no-store' },
      });
    }

    const body = await upstream.arrayBuffer();
    const contentType = upstream.headers.get('content-type') ?? 'application/javascript; charset=utf-8';

    return new Response(body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'content-type': contentType,
        // Cache hard at the edge/browser — the tag id is versioned in the path.
        'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        'x-proxied-by': 'xtsy-cs-proxy',
        'x-upstream': UPSTREAM_ORIGIN,
      },
    });
  } catch (err) {
    return new Response(`Proxy failure: ${err instanceof Error ? err.message : String(err)}`, {
      status: 502,
      headers: { ...corsHeaders, 'cache-control': 'no-store' },
    });
  }
});
