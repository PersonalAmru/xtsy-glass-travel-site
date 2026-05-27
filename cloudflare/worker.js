/**
 * Cloudflare Worker — Dynamic Rendering for XTSY SEO Pages
 * 
 * Detects search engine bots and serves pre-rendered static HTML.
 * Regular users get the normal SPA experience.
 * 
 * Deploy: Workers & Pages → Create Worker → paste this code
 * Route: xtsy.one/* (after pointing DNS through Cloudflare)
 */

// Bot user-agent patterns
const BOT_AGENTS = [
  'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp',
  'baiduspider', 'facebookexternalhit', 'facebot', 'twitterbot',
  'linkedinbot', 'whatsapp', 'telegrambot', 'applebot', 'pinterest',
  'pinterestbot', 'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot',
  'petalbot', 'bytespider', 'gptbot', 'oai-searchbot', 'chatgpt-user',
  'perplexitybot', 'claudebot', 'claude-web', 'anthropic-ai',
  'ccbot', 'cohere-ai', 'mistralai-user',
  'ia_archiver', 'archive.org_bot',
  'slackbot', 'discordbot', 'redditbot', 'embedly', 'skypeuripreview',
  'msnbot', 'qwantbot', 'mojeekbot', 'seznambot',
  // Google specific
  'googlebot-mobile', 'google-inspectiontool', 'google-structured-data-testing-tool',
  'mediapartners-google', 'adsbot-google', 'apis-google',
  'feedfetcher-google', 'google-read-aloud',
];

function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_AGENTS.some(bot => ua.includes(bot));
}

// Generate pre-rendered HTML for SEO pages
function generateSEOHTML(url, originalHTML) {
  const path = new URL(url).pathname.replace(/\/$/, '') || '/';
  
  // For the homepage, return as-is (it's already indexed)
  if (path === '/' || path === '') return null;

  // Build a minimal but SEO-complete HTML page
  // The content will be injected before the SPA shell
  return null; // We'll use KV store for pre-rendered content
}

// In-memory micro-caches (per worker isolate)
const REDIRECT_CACHE = new Map();
const REDIRECT_TTL_MS = 60_000;

// SEO slim map cache — fetched from /seo-slim-map.json once per isolate.
let SLIM_MAP_CACHE = null;
let SLIM_MAP_FETCHED_AT = 0;
const SLIM_MAP_TTL_MS = 5 * 60_000;

async function getSlimMapEntry(slug, origin, env) {
  // KV path — fast per-slug lookup; populated by the deploy workflow.
  if (env && env.SEO_SLIM_MAP) {
    try {
      const v = await env.SEO_SLIM_MAP.get(slug, 'json');
      if (v) return v;
    } catch (_) { /* fall through */ }
  }
  // Origin fallback — fetched once per isolate, in-memory cached.
  if (!SLIM_MAP_CACHE || Date.now() - SLIM_MAP_FETCHED_AT >= SLIM_MAP_TTL_MS) {
    try {
      const res = await fetch(`${origin}/seo-slim-map.json`, {
        cf: { cacheTtl: 3600, cacheEverything: true },
      });
      if (res.ok) {
        SLIM_MAP_CACHE = await res.json();
        SLIM_MAP_FETCHED_AT = Date.now();
      }
    } catch (_) { /* keep prior cache */ }
  }
  return (SLIM_MAP_CACHE && SLIM_MAP_CACHE[slug]) || null;
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/**
 * Build an HTMLRewriter that bakes per-route canonical/og:url/og:title/
 * og:description/twitter/<title>/<meta name="description"> into the response
 * head. Runs for ALL HTML responses (users + bots) so non-JS preview crawlers
 * (Slack, Facebook, LinkedIn) see route-correct metadata before any JS.
 */
function makeSeoRewriter(canonical, entry, extraHeaderMeta) {
  let titleHandled = false;
  let descHandled = false;
  let canonicalHandled = false;
  let ogUrlHandled = false;
  let ogTitleHandled = false;
  let ogDescHandled = false;
  let twTitleHandled = false;
  let twDescHandled = false;

  const title = entry && entry.t;
  const desc = entry && entry.d;

  return new HTMLRewriter()
    .on('title', {
      text(text) {
        if (titleHandled || !title) return;
        if (text.lastInTextNode) {
          text.replace(title, { html: false });
          titleHandled = true;
        } else {
          text.remove();
        }
      },
    })
    .on('meta[name="description"]', {
      element(el) { if (desc) { el.setAttribute('content', desc); descHandled = true; } },
    })
    .on('link[rel="canonical"]', {
      element(el) { el.setAttribute('href', canonical); canonicalHandled = true; },
    })
    .on('meta[property="og:url"]', {
      element(el) { el.setAttribute('content', canonical); ogUrlHandled = true; },
    })
    .on('meta[property="og:title"]', {
      element(el) { if (title) { el.setAttribute('content', title); ogTitleHandled = true; } },
    })
    .on('meta[property="og:description"]', {
      element(el) { if (desc) { el.setAttribute('content', desc); ogDescHandled = true; } },
    })
    .on('meta[name="twitter:title"]', {
      element(el) { if (title) { el.setAttribute('content', title); twTitleHandled = true; } },
    })
    .on('meta[name="twitter:description"]', {
      element(el) { if (desc) { el.setAttribute('content', desc); twDescHandled = true; } },
    })
    .on('head', {
      element(el) {
        // Append fallbacks for tags that didn't exist in the static head.
        if (!canonicalHandled) el.append(`<link rel="canonical" href="${escapeAttr(canonical)}">`, { html: true });
        if (!ogUrlHandled)     el.append(`<meta property="og:url" content="${escapeAttr(canonical)}">`, { html: true });
        if (title) {
          if (!ogTitleHandled) el.append(`<meta property="og:title" content="${escapeAttr(title)}">`, { html: true });
          if (!twTitleHandled) el.append(`<meta name="twitter:title" content="${escapeAttr(title)}">`, { html: true });
        }
        if (desc) {
          if (!descHandled)    el.append(`<meta name="description" content="${escapeAttr(desc)}">`, { html: true });
          if (!ogDescHandled)  el.append(`<meta property="og:description" content="${escapeAttr(desc)}">`, { html: true });
          if (!twDescHandled)  el.append(`<meta name="twitter:description" content="${escapeAttr(desc)}">`, { html: true });
        }
        if (extraHeaderMeta) el.append(extraHeaderMeta, { html: true });
      },
    });
}

async function resolveLegacyRedirect(path, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_FUNCTIONS_HOST) return null;
  const cached = REDIRECT_CACHE.get(path);
  if (cached && cached.expires > Date.now()) return cached.value;

  try {
    const endpoint = `${env.SUPABASE_FUNCTIONS_HOST}/seo-redirect-resolver?path=${encodeURIComponent(path)}`;
    const res = await fetch(endpoint, {
      headers: env.SUPABASE_ANON_KEY
        ? { apikey: env.SUPABASE_ANON_KEY, authorization: `Bearer ${env.SUPABASE_ANON_KEY}` }
        : {},
      cf: { cacheTtl: 60, cacheEverything: true },
    });
    if (!res.ok) {
      REDIRECT_CACHE.set(path, { value: null, expires: Date.now() + REDIRECT_TTL_MS });
      return null;
    }
    const data = await res.json();
    const value = data && data.found ? { target: data.target, status: data.status || 301 } : null;
    REDIRECT_CACHE.set(path, { value, expires: Date.now() + REDIRECT_TTL_MS });
    return value;
  } catch (e) {
    console.error('redirect resolver error', e);
    return null;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('user-agent') || '';

    // Skip for non-HTML requests (assets, API calls, etc.)
    const path = url.pathname;
    if (
      path.startsWith('/assets/') ||
      path.startsWith('/api/') ||
      path.match(/\.(js|css|png|jpg|jpeg|webp|avif|svg|ico|woff2?|ttf|eot|map|json|xml|txt|pdf)$/i)
    ) {
      return fetch(request);
    }

    // --- Legacy URL → real 301 redirects (applies to bots AND users) ---
    // Looks up seo_redirects via the seo-redirect-resolver edge function and
    // issues a true HTTP 301 instead of relying on the SPA's <Navigate replace>.
    if (request.method === 'GET' || request.method === 'HEAD') {
      const redirect = await resolveLegacyRedirect(path, env);
      if (redirect && redirect.target) {
        const targetUrl = redirect.target.startsWith('http')
          ? redirect.target
          : `${url.origin}${redirect.target.startsWith('/') ? '' : '/'}${redirect.target}${url.search}`;
        return new Response(null, {
          status: redirect.status || 301,
          headers: {
            location: targetUrl,
            'cache-control': 'public, max-age=3600',
            'x-redirect-source': 'seo-redirect-resolver',
          },
        });
      }
    }

    // --- SEO head rewrite (applies to BOTH bots and human visitors) ---
    // Resolves the slim per-route map, then rewrites canonical/og:url/og:title/
    // og:description/twitter/<title>/<meta name="description"> at the edge so
    // non-JS preview crawlers (Slack, Facebook, LinkedIn) and curl-based audits
    // see route-correct metadata before the SPA hydrates.
    const slug = path.replace(/^\/|\/$/g, '');
    const canonical = `${url.origin}${slug ? '/' + slug : '/'}`;
    const entry = await getSlimMapEntry(slug, url.origin, env);

    // Bot path: try KV pre-render first, fall back to origin + rewrite
    if (isBot(userAgent)) {
      console.log(`🤖 Bot detected: ${userAgent.substring(0, 80)} → ${path}`);
      if (env.PRERENDER_CACHE) {
        const cacheKey = path === '/' ? '/' : path.replace(/\/$/, '');
        const cached = await env.PRERENDER_CACHE.get(cacheKey, 'text');
        if (cached) {
          console.log(`✅ Serving pre-rendered: ${cacheKey}`);
          return new Response(cached, {
            headers: {
              'content-type': 'text/html;charset=utf-8',
              'x-rendered-by': 'cloudflare-prerender',
              'cache-control': 'public, max-age=86400, s-maxage=604800',
            },
          });
        }
      }
    }

    // Fetch origin and rewrite head for ALL HTML responses
    const response = await fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    const extraMeta = isBot(userAgent) ? '<meta name="x-rendered-for" content="bot">' : null;
    const rewritten = makeSeoRewriter(canonical, entry, extraMeta).transform(response);
    const newResponse = new Response(rewritten.body, rewritten);
    newResponse.headers.set('x-rendered-by', isBot(userAgent) ? 'cf-bot-rewrite' : 'cf-edge-rewrite');
    newResponse.headers.set('x-seo-entry', entry ? 'matched' : 'fallback');
    return newResponse;
  },
};
