// Edge Function: Compute Demand Signals
// Scheduled to run daily to compute demand signals for all properties

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OccupancyMetrics {
  occupancy_7d: number;
  occupancy_14d: number;
  occupancy_30d: number;
  occupancy_delta_7d: number;
}

interface BookingVelocity {
  last_24h: number;
  last_7d: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all active properties
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('id, name')
      .eq('is_active', true);

    if (propError) {
      throw new Error(`Failed to fetch properties: ${propError.message}`);
    }

    const results = {
      processed: 0,
      errors: [] as string[],
      signals: [] as { property_id: string; action: string; confidence: string }[],
    };

    for (const property of properties || []) {
      try {
        // Calculate metrics
        const today = new Date();
        const dates = {
          day7: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          day14: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          day30: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };

        // Get booking counts
        const [result7d, result14d, result30d] = await Promise.all([
          supabase.from('bookings')
            .select('id', { count: 'exact' })
            .eq('property_id', property.id)
            .gte('check_in', dates.day7)
            .in('booking_status', ['confirmed', 'approved']),
          supabase.from('bookings')
            .select('id', { count: 'exact' })
            .eq('property_id', property.id)
            .gte('check_in', dates.day14)
            .in('booking_status', ['confirmed', 'approved']),
          supabase.from('bookings')
            .select('id', { count: 'exact' })
            .eq('property_id', property.id)
            .gte('check_in', dates.day30)
            .in('booking_status', ['confirmed', 'approved']),
        ]);

        // Assume 10 units per property for now (can be made dynamic)
        const totalUnits = 10;
        const maxRoomNights7d = totalUnits * 7;
        const maxRoomNights14d = totalUnits * 14;
        const maxRoomNights30d = totalUnits * 30;

        const occupancy_7d = maxRoomNights7d > 0 
          ? ((result7d.count || 0) / maxRoomNights7d) * 100 
          : 0;
        const occupancy_14d = maxRoomNights14d > 0 
          ? ((result14d.count || 0) / maxRoomNights14d) * 100 
          : 0;
        const occupancy_30d = maxRoomNights30d > 0 
          ? ((result30d.count || 0) / maxRoomNights30d) * 100 
          : 0;

        // Get booking velocity
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const prevWeek = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

        const [vel24h, vel7d, velPrev7d] = await Promise.all([
          supabase.from('bookings')
            .select('id', { count: 'exact' })
            .eq('property_id', property.id)
            .gte('created_at', yesterday),
          supabase.from('bookings')
            .select('id', { count: 'exact' })
            .eq('property_id', property.id)
            .gte('created_at', lastWeek),
          supabase.from('bookings')
            .select('id', { count: 'exact' })
            .eq('property_id', property.id)
            .gte('created_at', prevWeek)
            .lt('created_at', lastWeek),
        ]);

        const bookings_last_24h = vel24h.count || 0;
        const bookings_last_7d = vel7d.count || 0;
        const prev_7d = velPrev7d.count || 0;

        let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
        if (bookings_last_7d > prev_7d * 1.2) trend = 'increasing';
        else if (bookings_last_7d < prev_7d * 0.8) trend = 'decreasing';

        // Get channel mix
        const { data: channelBookings } = await supabase
          .from('bookings')
          .select('source')
          .eq('property_id', property.id)
          .gte('check_in', dates.day30)
          .in('booking_status', ['confirmed', 'approved']);

        let directCount = 0;
        let otaCount = 0;
        (channelBookings || []).forEach((b) => {
          if (b.source === 'direct') directCount++;
          else otaCount++;
        });

        const total = directCount + otaCount;
        const direct_ratio = total > 0 ? (directCount / total) * 100 : 0;
        const ota_ratio = total > 0 ? (otaCount / total) * 100 : 0;

        // Generate suggestion
        let suggested_action = 'Performance is stable. No immediate action recommended.';
        let action_type = 'none';
        let confidence_level = 'low';
        let confidence_score = 30;

        if (occupancy_7d >= 85 && trend === 'increasing') {
          suggested_action = `Occupancy at ${Math.round(occupancy_7d)}% with increasing demand. Consider raising rates by 10-15%.`;
          action_type = 'rate_increase';
          confidence_level = 'high';
          confidence_score = 85;
        } else if (occupancy_7d >= 90) {
          suggested_action = `Occupancy at ${Math.round(occupancy_7d)}%. Consider closing OTA inventory to prioritize direct bookings.`;
          action_type = 'close_ota';
          confidence_level = 'medium';
          confidence_score = 70;
        } else if (occupancy_7d <= 40 && trend === 'decreasing') {
          suggested_action = `Occupancy at ${Math.round(occupancy_7d)}% with declining demand. Consider promotional rates.`;
          action_type = 'rate_decrease';
          confidence_level = 'medium';
          confidence_score = 65;
        }

        // Upsert signal
        const signalDate = today.toISOString().split('T')[0];
        const { error: signalError } = await supabase
          .from('demand_signals')
          .upsert({
            property_id: property.id,
            signal_date: signalDate,
            occupancy_7d: Math.round(occupancy_7d * 100) / 100,
            occupancy_14d: Math.round(occupancy_14d * 100) / 100,
            occupancy_30d: Math.round(occupancy_30d * 100) / 100,
            occupancy_delta_7d: 0,
            bookings_last_24h,
            bookings_last_7d,
            booking_velocity_trend: trend,
            direct_booking_ratio: Math.round(direct_ratio * 100) / 100,
            ota_booking_ratio: Math.round(ota_ratio * 100) / 100,
            suggested_action,
            action_type,
            confidence_level,
            confidence_score,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'property_id,room_type_id,signal_date',
          });

        if (signalError) {
          results.errors.push(`${property.name}: ${signalError.message}`);
        } else {
          results.processed++;
          if (action_type !== 'none') {
            results.signals.push({
              property_id: property.id,
              action: action_type,
              confidence: confidence_level,
            });
          }
        }
      } catch (err) {
        results.errors.push(`${property.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Processed ${results.processed} properties`,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Compute demand signals error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to compute demand signals. Check server logs.',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
