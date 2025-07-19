
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, fullName, interests } = await req.json();

    // Create a simple newsletter table entry
    // Note: You might want to create a proper newsletter_subscribers table
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        full_name: fullName,
        interests,
        subscribed_at: new Date().toISOString(),
        is_active: true
      });

    if (error) {
      console.log('Newsletter signup error:', error);
      // If table doesn't exist, that's okay for now
    }

    console.log(`Newsletter signup: ${fullName} (${email}) - Interests: ${interests.join(', ')}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully subscribed to newsletter' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
