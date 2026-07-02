// Sitemap Validator — pings priority sitemap, parses URL count, lastmod
// freshness, validates XML, checks robots crawlability. Stores result in
// sitemap_health_checks for the admin console.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// SECURITY: restrict outbound fetches to our own hosts to prevent SSRF /
// anonymous fetch-proxy abuse via a caller-supplied sitemap_url.
const ALLOWED_HOSTS = new Set(['xtsy.one', 'www.xtsy.one', 'xtsy-one.lovable.app']);
const ALLOWED_HOST_SUFFIXES = ['.lovable.app', '.lovableproject.com'];
const FETCH_TIMEOUT_MS = 10_000;

function isAllowedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (ALLOWED_HOSTS.has(h)) return true;
  return ALLOWED_HOST_SUFFIXES.some((s) => h.endsWith(s));
}

interface ValidationResult {
  sitemap_url: string;
  http_status: number | null;
  response_time_ms: number;
  url_count: number;
  newest_lastmod: string | null;
  oldest_lastmod: string | null;
  is_valid_xml: boolean;
  is_crawlable: boolean;
  error_message: string | null;
}

const validateSitemap = async (url: string): Promise<ValidationResult> => {
  const result: ValidationResult = {
    sitemap_url: url,
    http_status: null,
    response_time_ms: 0,
    url_count: 0,
    newest_lastmod: null,
    oldest_lastmod: null,
    is_valid_xml: false,
    is_crawlable: false,
    error_message: null,
  };

  const start = Date.now();
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'XTSY-Sitemap-Validator/1.0' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    result.response_time_ms = Date.now() - start;
    result.http_status = res.status;
    if (!res.ok) {
      result.error_message = `HTTP ${res.status}`;
      return result;
    }
    const xml = await res.text();
    result.is_valid_xml = xml.includes('<urlset') && xml.includes('</urlset>');
    const locs = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
    result.url_count = locs.length;
    const lastmods = (xml.match(/<lastmod>([^<]+)<\/lastmod>/g) || [])
      .map((m) => m.replace(/<\/?lastmod>/g, ''))
      .sort();
    if (lastmods.length) {
      result.oldest_lastmod = lastmods[0].slice(0, 10);
      result.newest_lastmod = lastmods[lastmods.length - 1].slice(0, 10);
    }

    // Crawlability: fetch robots.txt, check sitemap not disallowed
    try {
      const origin = new URL(url).origin;
      const robotsRes = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
      if (robotsRes.ok) {
        const robots = await robotsRes.text();
        result.is_crawlable = !robots.match(/Disallow:\s*\/sitemap/i);
      } else {
        result.is_crawlable = true;
      }
    } catch {
      result.is_crawlable = true;
    }
  } catch (err) {
    result.error_message = err instanceof Error ? err.message.slice(0, 250) : 'Validation failed';
  }
  return result;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const url = body.sitemap_url || 'https://xtsy.one/sitemap-priority.xml';

    // SECURITY: only allow validating sitemaps on our own hosts to prevent
    // this function being used as an anonymous SSRF / fetch proxy.
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid sitemap_url' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (parsed.protocol !== 'https:' || !isAllowedHost(parsed.hostname)) {
      return new Response(
        JSON.stringify({ success: false, error: 'sitemap_url host not allowed. Only xtsy.one properties may be validated.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const result = await validateSitemap(parsed.toString());

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    await supabase.from('sitemap_health_checks').insert(result);

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
