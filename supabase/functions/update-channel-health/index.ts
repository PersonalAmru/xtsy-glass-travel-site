// Edge Function: Update Channel Health Scores
// Scheduled to run daily to compute channel health metrics

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HealthFactors {
  conversion_score: number;
  cancellation_score: number;
  revenue_score: number;
  reliability_score: number;
}

function calculateHealthScore(metrics: {
  conversion_rate: number;
  cancellation_rate: number;
  avg_booking_value: number;
  target_booking_value: number;
  sync_failures: number;
}): { score: number; factors: HealthFactors } {
  const conversionScore = Math.min(25, (metrics.conversion_rate / 5) * 25);
  const cancellationScore = Math.max(0, 25 - (metrics.cancellation_rate * 2.5));
  const revenueRatio = metrics.avg_booking_value / metrics.target_booking_value;
  const revenueScore = Math.min(25, revenueRatio * 25);
  const reliabilityScore = Math.max(0, 25 - (metrics.sync_failures * 5));

  return {
    score: Math.round(conversionScore + cancellationScore + revenueScore + reliabilityScore),
    factors: {
      conversion_score: Math.round(conversionScore),
      cancellation_score: Math.round(cancellationScore),
      revenue_score: Math.round(revenueScore),
      reliability_score: Math.round(reliabilityScore),
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all channel strategies
    const { data: strategies, error: stratError } = await supabase
      .from('channel_strategy')
      .select('*')
      .eq('is_active', true);

    if (stratError) {
      throw new Error(`Failed to fetch strategies: ${stratError.message}`);
    }

    const results = {
      updated: 0,
      errors: [] as string[],
    };

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    for (const strategy of strategies || []) {
      try {
        // Get bookings for this channel
        const { data: bookings, error: bookError } = await supabase
          .from('bookings')
          .select('id, total_amount, booking_status, source')
          .eq('property_id', strategy.property_id)
          .eq('source', strategy.channel_name)
          .gte('check_in', thirtyDaysAgo);

        if (bookError) {
          results.errors.push(`${strategy.channel_name}: ${bookError.message}`);
          continue;
        }

        const totalBookings = bookings?.length || 0;
        const cancelledBookings = bookings?.filter(b => b.booking_status === 'cancelled').length || 0;
        const confirmedBookings = bookings?.filter(b => 
          ['confirmed', 'approved', 'completed'].includes(b.booking_status)
        ) || [];
        
        const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
        const avgBookingValue = confirmedBookings.length > 0 
          ? totalRevenue / confirmedBookings.length 
          : 0;
        const cancellationRate = totalBookings > 0 
          ? (cancelledBookings / totalBookings) * 100 
          : 0;

        // Get sync failures from iCal events (if applicable)
        const { data: syncEvents } = await supabase
          .from('ical_sync_events')
          .select('event_status')
          .eq('event_type', strategy.channel_name)
          .eq('event_status', 'error')
          .gte('created_at', thirtyDaysAgo);

        const syncFailures = syncEvents?.length || 0;

        // Calculate health score
        const { score, factors } = calculateHealthScore({
          conversion_rate: 3, // Placeholder - would need actual conversion data
          cancellation_rate: cancellationRate,
          avg_booking_value: avgBookingValue,
          target_booking_value: 2000, // Default target
          sync_failures: syncFailures,
        });

        // Calculate lead time
        let avgLeadTime = 0;
        if (confirmedBookings.length > 0) {
          const leadTimes = confirmedBookings.map(b => {
            // This is a simplification - would need created_at from bookings
            return 7; // Default to 7 days
          });
          avgLeadTime = Math.round(leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length);
        }

        // Update the strategy
        const { error: updateError } = await supabase
          .from('channel_strategy')
          .update({
            total_bookings: totalBookings,
            total_revenue: totalRevenue,
            cancellation_count: cancelledBookings,
            cancellation_rate: Math.round(cancellationRate * 100) / 100,
            avg_lead_time_days: avgLeadTime,
            health_score: score,
            health_factors: factors,
            updated_at: new Date().toISOString(),
          })
          .eq('id', strategy.id);

        if (updateError) {
          results.errors.push(`${strategy.channel_name}: ${updateError.message}`);
        } else {
          results.updated++;
        }
      } catch (err) {
        results.errors.push(`${strategy.channel_name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Updated ${results.updated} channel strategies`,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Update channel health error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
