/**
 * seo-position-cron
 *
 * Scheduled (daily) capture of our Google organic keyword positions from
 * Semrush into public.seo_position_snapshots. Triggered by pg_cron via
 * pg_net — NOT by the browser. Because it runs without a user JWT it is
 * protected by a shared secret (SEO_CRON_SECRET) that the cron job passes
 * in the `x-cron-secret` header.
 *
 * The admin dashboard (/admin/seo/tracking) reads the same table, so the
 * daily automated snapshots power the trend charts and valuation-momentum
 * reporting without anyone having to click "Capture" manually.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { capturePositions } from '../_shared/semrushPositions.ts';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Shared-secret gate — the endpoint is public (no JWT), so require the
  // cron secret. Accept it from a dedicated header or the JSON body.
  const cronSecret = Deno.env.get('SEO_CRON_SECRET');
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const provided = req.headers.get('x-cron-secret') ?? (body as any)?.secret ?? '';
  if (!cronSecret || provided !== cronSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  const database = String((body as any)?.database ?? 'in');

  try {
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const result = await capturePositions(database, supabaseService, 'cron');

    console.log(
      `[seo-position-cron] captured ${result.totalTracked} keywords ` +
      `(${result.strikingCount} striking, ${result.top10Count} top10) ` +
      `run=${result.runId}`,
    );

    return new Response(JSON.stringify({
      ok: true,
      runId: result.runId,
      capturedAt: result.capturedAt,
      totalTracked: result.totalTracked,
      strikingCount: result.strikingCount,
      programmaticStrikingCount: result.programmaticStrikingCount,
      top10Count: result.top10Count,
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    console.error('[seo-position-cron]', message);
    const quota = /limit exceeded|134/i.test(message);
    return new Response(JSON.stringify({
      ok: false,
      error: quota
        ? 'Semrush API quota exhausted — snapshot skipped, will retry next run.'
        : message,
      quota,
    }), {
      status: quota ? 429 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
