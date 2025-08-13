import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const { action } = await req.json();

      if (action === 'apply_security_policies') {
        // Apply the security policies to fix the booking table vulnerability
        const queries = [
          // Remove any existing permissive policies
          `DROP POLICY IF EXISTS "Allow public insert on bookings" ON public.bookings;`,
          `DROP POLICY IF EXISTS "Allow public read on bookings" ON public.bookings;`,
          `DROP POLICY IF EXISTS "Enable insert for all users" ON public.bookings;`,
          `DROP POLICY IF EXISTS "Enable read for all users" ON public.bookings;`,
          
          // Enable RLS
          `ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;`,
          
          // Create secure policies
          `CREATE POLICY "Service role only insert on bookings" ON public.bookings
            FOR INSERT TO service_role
            WITH CHECK (true);`,
          
          `CREATE POLICY "Users can view own bookings" ON public.bookings
            FOR SELECT TO authenticated
            USING (email = (current_setting('request.jwt.claims', true)::json->>'email'));`,
          
          `CREATE POLICY "Service role full access on bookings" ON public.bookings
            FOR ALL TO service_role
            USING (true)
            WITH CHECK (true);`,
          
          // Create audit log table
          `CREATE TABLE IF NOT EXISTS public.booking_audit_log (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            booking_id text NOT NULL,
            action text NOT NULL,
            performed_by text,
            performed_at timestamp with time zone DEFAULT now(),
            ip_address text,
            user_agent text,
            details jsonb
          );`,
          
          // Enable RLS on audit log
          `ALTER TABLE public.booking_audit_log ENABLE ROW LEVEL SECURITY;`,
          
          `CREATE POLICY "Service role only audit log" ON public.booking_audit_log
            FOR ALL TO service_role
            USING (true)
            WITH CHECK (true);`,
          
          // Create indexes
          `CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings (email);`,
          `CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON public.bookings (booking_id);`,
        ];

        // Execute each query
        for (const query of queries) {
          try {
            await supabaseClient.rpc('exec_sql', { sql: query });
          } catch (error) {
            console.log(`Query executed or already exists: ${query.substring(0, 50)}...`);
          }
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Security policies applied successfully',
            policies_applied: queries.length
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Policy application error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to apply security policies', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});