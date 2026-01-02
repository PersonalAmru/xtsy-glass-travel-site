import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const siteId = Deno.env.get('HOTJAR_SITE_ID');
    
    if (!siteId) {
      console.error('HOTJAR_SITE_ID not configured');
      return new Response(
        JSON.stringify({ error: 'Hotjar not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Hotjar Site ID retrieved successfully');
    
    return new Response(
      JSON.stringify({ siteId }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching Hotjar config:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
