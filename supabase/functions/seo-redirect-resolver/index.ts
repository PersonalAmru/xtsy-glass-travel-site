// supabase/functions/seo-redirect-resolver/index.ts
//
// True 301 redirect resolver. Looks up `seo_redirects` for the given path
// and returns the appropriate HTTP redirect response. Used by the edge
// proxy / Cloudflare worker layer to issue real 301s instead of SPA
// client-side <Navigate replace>.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const sourcePath = url.searchParams.get('path');

    if (!sourcePath) {
      return new Response(
        JSON.stringify({ error: 'Missing ?path= parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Normalize: strip leading slash for lookup, but match either form
    const normalized = sourcePath.startsWith('/') ? sourcePath : `/${sourcePath}`;

    const { data, error } = await supabase
      .from('seo_redirects')
      .select('source_path, target_path, status_code, is_active')
      .eq('source_path', normalized)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('seo_redirects lookup error:', error);
      return new Response(
        JSON.stringify({ found: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({ found: false }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Bump hit counter (fire-and-forget)
    supabase
      .from('seo_redirects')
      .update({ hit_count: (data as any).hit_count ? undefined : 1, last_hit_at: new Date().toISOString() })
      .eq('source_path', normalized)
      .then(() => {});

    // Edge layer can read this JSON and issue a true HTTP 301.
    return new Response(
      JSON.stringify({
        found: true,
        target: data.target_path,
        status: data.status_code,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
        },
      }
    );
  } catch (e) {
    console.error('seo-redirect-resolver fatal:', e);
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
