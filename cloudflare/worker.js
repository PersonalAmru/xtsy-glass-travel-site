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
  'baiduspider', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'applebot', 'pinterest', 'semrushbot',
  'ahrefsbot', 'mj12bot', 'dotbot', 'petalbot', 'bytespider',
  'gptbot', 'ia_archiver', 'archive.org_bot',
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

    // If not a bot, serve normally
    if (!isBot(userAgent)) {
      return fetch(request);
    }

    // --- BOT DETECTED ---
    console.log(`🤖 Bot detected: ${userAgent.substring(0, 80)} → ${path}`);

    // Try to get pre-rendered content from KV store
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

    // Fallback: Fetch the page from origin and inject meta tags
    const response = await fetch(request);
    const contentType = response.headers.get('content-type') || '';
    
    if (!contentType.includes('text/html')) {
      return response;
    }

    // Use HTMLRewriter to add a header indicating bot rendering
    const rewritten = new HTMLRewriter()
      .on('head', {
        element(element) {
          // Add a meta tag so we can verify bot rendering is working
          element.append('<meta name="x-rendered-for" content="bot">', { html: true });
        },
      })
      .transform(response);

    // Clone with custom headers
    const newResponse = new Response(rewritten.body, rewritten);
    newResponse.headers.set('x-rendered-by', 'cloudflare-spa-passthrough');
    return newResponse;
  },
};
