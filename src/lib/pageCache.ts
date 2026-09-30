/**
 * Page cache for server-rendered public HTML.
 *
 * Every page used to be rendered from scratch on every visit (the host sends no-cache), so real
 * visitors waited ~1–4 s for the first byte. This keeps rendered pages for a few minutes:
 *  - in memory (always available, per server instance), and
 *  - in the platform's shared edge cache (Cloudflare Cache API) when the host provides it.
 * Fresh for 5 minutes; from 5 to 60 minutes the stored copy is served instantly while a fresh
 * copy renders in the background; after that it renders fresh. The key includes the build id,
 * so a new publish never serves an old page. Anything that could be personal or dynamic is
 * never cached (see BYPASS), and any cache failure falls back to a normal render.
 */

declare const __XTSY_BUILD_ID__: string | undefined;
const BUILD = typeof __XTSY_BUILD_ID__ === 'string' ? __XTSY_BUILD_ID__ : 'dev';

export const FRESH_MS = 5 * 60_000;
export const STALE_MS = 60 * 60_000;
const MAX_ENTRIES = 120;

/** Paths that must always render fresh: booking, accounts, search, server functions, APIs, files. */
const BYPASS = /^\/(?:_serverFn|_server|api|auth|login|signup|profile|user|account|franchise|book|booking|checkout|payment|search|install|admin|__[^/]*)(?:\/|$)|\.[a-z0-9]{2,5}$/i;
/** Tracking parameters that never change the page. */
const TRACKING = /^(utm_[a-z]+|gclid|fbclid|gbraid|wbraid|msclkid|ref|mc_[a-z]+|_ga|lcpaudit|v|check)$/i;

type Entry = { t: number; status: number; headers: [string, string][]; body: ArrayBuffer };
const memory = new Map<string, Entry>();
const inflight = new Map<string, Promise<Response>>();

export function cacheKey(request: Request): string | null {
  if (request.method !== 'GET') return null;
  if (request.headers.get('authorization')) return null;
  const url = new URL(request.url);
  if (BYPASS.test(url.pathname)) return null;
  const params = [...url.searchParams.entries()].filter(([k]) => !TRACKING.test(k)).sort(([a], [b]) => a.localeCompare(b));
  const q = params.length ? `?${new URLSearchParams(params).toString()}` : '';
  return `https://page-cache.xtsy.internal/${BUILD}${url.pathname.replace(/\/+$/, '') || '/'}${q}`;
}

function storable(res: Response): boolean {
  return res.status === 200 && (res.headers.get('content-type') ?? '').includes('text/html') && !res.headers.has('set-cookie');
}

function edgeCache(): Cache | null {
  try {
    const c = (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default;
    return c && typeof c.match === 'function' ? c : null;
  } catch {
    return null;
  }
}

async function read(key: string): Promise<Entry | null> {
  const m = memory.get(key);
  if (m) return m;
  const edge = edgeCache();
  if (!edge) return null;
  try {
    const hit = await edge.match(key);
    if (!hit) return null;
    const t = Number(hit.headers.get('x-xtsy-stored-at')) || 0;
    const headers = [...hit.headers.entries()].filter(([k]) => !/^(x-xtsy-stored-at|cache-control|age|cf-cache-status)$/i.test(k));
    const orig = hit.headers.get('x-xtsy-orig-cache-control');
    const entry: Entry = { t, status: hit.status, headers: headers.filter(([k]) => k !== 'x-xtsy-orig-cache-control').concat(orig ? [['cache-control', orig]] : []), body: await hit.arrayBuffer() };
    remember(key, entry);
    return entry;
  } catch {
    return null;
  }
}

function remember(key: string, entry: Entry) {
  memory.delete(key);
  memory.set(key, entry);
  while (memory.size > MAX_ENTRIES) memory.delete(memory.keys().next().value as string);
}

async function write(key: string, entry: Entry) {
  remember(key, entry);
  const edge = edgeCache();
  if (!edge) return;
  try {
    const h = new Headers(entry.headers);
    const orig = h.get('cache-control');
    if (orig) h.set('x-xtsy-orig-cache-control', orig);
    h.set('cache-control', `public, max-age=${Math.round(STALE_MS / 1000)}`);
    h.set('x-xtsy-stored-at', String(entry.t));
    await edge.put(key, new Response(entry.body, { status: entry.status, headers: h }));
  } catch {
    /* edge cache unavailable — memory cache still works */
  }
}

function respond(entry: Entry, state: string): Response {
  const h = new Headers(entry.headers);
  h.set('x-xtsy-cache', state);
  h.delete('content-length');
  h.delete('content-encoding');
  return new Response(entry.body, { status: entry.status, headers: h });
}

const decode = (v: string) => v.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

/**
 * Turn the page's own high-priority image preloads (the hero) into an HTTP Link header, so the
 * browser starts the hero as soon as the response headers arrive — ahead of the ~30 script
 * preloads that come first in <head>. (Hosts that support 103 Early Hints can send it even earlier.)
 */
export function heroLinkHeader(html: string): string | null {
  const head = html.slice(0, html.indexOf('</head>') > 0 ? html.indexOf('</head>') : 20000);
  const out: string[] = [];
  for (const m of head.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    const attr = (name: string) => {
      const r = new RegExp(`\\s${name}="([^"]*)"`, 'i').exec(tag);
      return r ? decode(r[1]) : null;
    };
    if (attr('rel')?.toLowerCase() !== 'preload' || attr('as')?.toLowerCase() !== 'image') continue;
    if ((attr('fetchpriority') ?? '').toLowerCase() !== 'high') continue;
    const href = attr('href');
    if (!href || /[<>\r\n]/.test(href)) continue;
    const parts = [`<${href}>`, 'rel=preload', 'as=image', 'fetchpriority=high'];
    for (const k of ['imagesrcset', 'imagesizes', 'media', 'type']) {
      const v = attr(k);
      if (v && !/["\r\n]/.test(v)) parts.push(`${k}="${v}"`);
    }
    out.push(parts.join('; '));
    if (out.length >= 3) break;
  }
  const value = out.join(', ');
  return value && value.length < 4000 ? value : null;
}

/** Render, store if cacheable, and return a fresh response. Concurrent requests share one render. */
async function renderAndStore(key: string, render: () => Promise<Response>): Promise<Response> {
  const running = inflight.get(key);
  if (running) return (await running).clone();
  const p = (async () => {
    const res = await render();
    if (!storable(res)) return res;
    const body = await res.arrayBuffer();
    const headers = [...res.headers.entries()].filter(([k]) => !/^(content-length|content-encoding)$/i.test(k));
    try {
      const link = heroLinkHeader(new TextDecoder().decode(body.slice(0, 60000)));
      if (link && !res.headers.has('link')) headers.push(['link', link]);
    } catch {
      /* no hint — page still works */
    }
    const entry: Entry = { t: Date.now(), status: res.status, headers, body };
    await write(key, entry);
    return respond(entry, 'MISS');
  })();
  inflight.set(key, p);
  try {
    return (await p).clone();
  } finally {
    inflight.delete(key);
  }
}

type Ctx = { waitUntil?: (p: Promise<unknown>) => void } | undefined;

export async function withPageCache(request: Request, ctx: unknown, render: () => Promise<Response>): Promise<Response> {
  let key: string | null = null;
  try {
    key = cacheKey(request);
  } catch {
    key = null;
  }
  if (!key) {
    const res = await render();
    return res;
  }
  // Cache-layer problems never break a page: a failed lookup just renders normally.
  let hit: Entry | null = null;
  try {
    hit = await read(key);
  } catch {
    hit = null;
  }
  if (hit) {
    const age = Date.now() - hit.t;
    if (age < FRESH_MS) return respond(hit, 'HIT');
    const waitUntil = (ctx as Ctx)?.waitUntil;
    if (age < STALE_MS && typeof waitUntil === 'function') {
      const k = key;
      try {
        waitUntil.call(ctx, renderAndStore(k, render).catch(() => undefined));
        return respond(hit, 'STALE');
      } catch {
        /* no background work available — render now */
      }
    }
  }
  // Render errors propagate unchanged to the server's error handler.
  return renderAndStore(key, render);
}

/** Test hook: clears the in-memory cache. */
export function clearPageCache() {
  memory.clear();
}
