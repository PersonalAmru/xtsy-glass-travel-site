import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';

// DPDP/GDPR consent recorder.
// Consent records can no longer be inserted directly by clients (the public
// INSERT RLS policy was removed). This function validates the payload, captures
// the visitor IP server-side (never trusting the client), and writes with the
// service role. verify_jwt is false because anonymous visitors must be able to
// record consent before authenticating.

const ConsentItem = z.object({
  consent_type: z.enum(['necessary', 'analytics', 'marketing', 'personalization']),
  granted: z.boolean(),
});

const BodySchema = z.object({
  visitor_id: z.string().trim().min(1).max(128),
  consent_version: z.string().trim().min(1).max(32),
  consents: z.array(ConsentItem).min(1).max(10),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { visitor_id, consent_version, consents } = parsed.data;

    // Capture IP server-side from trusted proxy headers — never from the body.
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('cf-connecting-ip') ||
      null;
    const userAgent = req.headers.get('user-agent') ?? null;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const nowIso = new Date().toISOString();
    const rows = consents.map(({ consent_type, granted }) => ({
      visitor_id,
      consent_type,
      granted,
      granted_at: granted ? nowIso : null,
      consent_version,
      ip_address: ipAddress,
      user_agent: userAgent,
    }));

    const { error } = await supabase
      .from('dpdp_consents')
      .upsert(rows, { onConflict: 'visitor_id,consent_type' });

    if (error) {
      console.error('[record-consent] upsert error:', error.message);
      return new Response(JSON.stringify({ error: 'Failed to record consent' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, recorded: rows.length }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[record-consent] error:', err instanceof Error ? err.message : String(err));
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
