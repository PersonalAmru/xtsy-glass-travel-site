// Edge Function: Auto-Settle Bookings
// Scheduled to run daily to transition booking settlement states

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // SECURITY: privileged settlement transitions must never run for an
    // anonymous caller. Allow either the cron secret OR an admin JWT.
    const cronSecret = Deno.env.get('CRON_SECRET');
    const incomingSecret = req.headers.get('x-cron-secret');
    const authHeader = req.headers.get('Authorization');
    let authorized = !!(cronSecret && incomingSecret && incomingSecret === cronSecret);
    if (!authorized && authHeader?.startsWith('Bearer ')) {
      const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: role } = await userClient.rpc('get_user_role');
      authorized = role === 'admin';
    }
    if (!authorized) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const results = {
      confirmed_to_stayed: 0,
      stayed_to_settled: 0,
      no_shows_marked: 0,
      errors: [] as string[],
    };

    // 1. Transition confirmed bookings to stayed (check-out passed)
    const { data: confirmedBookings, error: confirmedError } = await supabase
      .from('bookings')
      .select('id, booking_id, check_out, total_amount')
      .eq('settlement_status', 'confirmed')
      .lt('check_out', today);

    if (confirmedError) {
      results.errors.push(`Confirmed query: ${confirmedError.message}`);
    } else {
      for (const booking of confirmedBookings || []) {
        const { error } = await supabase.rpc('record_settlement_transition', {
          p_booking_id: booking.id,
          p_booking_reference: booking.booking_id,
          p_new_status: 'stayed',
          p_amount: booking.total_amount || 0,
          p_notes: 'Auto-transitioned: check-out date passed',
          p_actor_id: null,
        });

        if (error) {
          results.errors.push(`${booking.booking_id}: ${error.message}`);
        } else {
          results.confirmed_to_stayed++;
        }
      }
    }

    // 2. Auto-settle stayed bookings after 24 hours
    const { data: stayedBookings, error: stayedError } = await supabase
      .from('bookings')
      .select('id, booking_id, check_out, total_amount, payment_status')
      .eq('settlement_status', 'stayed')
      .lt('check_out', yesterday)
      .eq('payment_status', 'paid'); // Only settle paid bookings

    if (stayedError) {
      results.errors.push(`Stayed query: ${stayedError.message}`);
    } else {
      for (const booking of stayedBookings || []) {
        const { error } = await supabase.rpc('record_settlement_transition', {
          p_booking_id: booking.id,
          p_booking_reference: booking.booking_id,
          p_new_status: 'settled',
          p_amount: booking.total_amount || 0,
          p_notes: 'Auto-settled: 24 hours after check-out',
          p_actor_id: null,
        });

        if (error) {
          results.errors.push(`${booking.booking_id}: ${error.message}`);
        } else {
          results.stayed_to_settled++;
        }
      }
    }

    // 3. Mark no-shows for confirmed bookings where check-in passed but no check-in recorded
    // This is a simplified version - in production you'd have actual check-in tracking
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const { data: potentialNoShows, error: noShowError } = await supabase
      .from('bookings')
      .select('id, booking_id, check_in, total_amount')
      .eq('settlement_status', 'confirmed')
      .lt('check_in', threeDaysAgo);

    if (noShowError) {
      results.errors.push(`No-show query: ${noShowError.message}`);
    } else {
      for (const booking of potentialNoShows || []) {
        // In production, check if guest actually checked in
        // For now, we'll just mark very old confirmed bookings as no-shows
        const { error } = await supabase.rpc('record_settlement_transition', {
          p_booking_id: booking.id,
          p_booking_reference: booking.booking_id,
          p_new_status: 'no_show',
          p_amount: 0,
          p_notes: 'Auto-marked: no check-in 3+ days after booking date',
          p_actor_id: null,
        });

        if (error) {
          results.errors.push(`${booking.booking_id}: ${error.message}`);
        } else {
          results.no_shows_marked++;
        }
      }
    }

    // Create audit log for the batch operation
    await supabase.from('audit_logs').insert({
      action: 'AUTO_SETTLE_BATCH',
      table_name: 'bookings',
      actor_role: 'system',
      snapshot_type: 'system',
      metadata: {
        confirmed_to_stayed: results.confirmed_to_stayed,
        stayed_to_settled: results.stayed_to_settled,
        no_shows_marked: results.no_shows_marked,
        errors_count: results.errors.length,
        run_date: today,
      },
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Auto-settlement complete',
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Auto-settle error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Auto-settle operation failed. Check server logs.',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
