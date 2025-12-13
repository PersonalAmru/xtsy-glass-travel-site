import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { getCorsHeaders } from '../_shared/cors.ts';

interface TravellerProfile {
  visitor_id: string;
  traveller_segment: string;
  spend_tier: string;
  lifetime_value: number;
  total_bookings: number;
  booking_intent_score: number;
}

// Segment classification logic
function classifySegment(profile: TravellerProfile): string {
  if (profile.total_bookings >= 3) return 'loyal';
  if (profile.spend_tier === 'high_value' || profile.lifetime_value > 50000) return 'luxury';
  if (profile.booking_intent_score >= 70) return 'high_intent';
  return profile.traveller_segment || 'new_explorer';
}

// Spend tier calculation
function calculateSpendTier(lifetimeValue: number): string {
  if (lifetimeValue >= 50000) return 'high_value';
  if (lifetimeValue >= 15000) return 'medium';
  return 'budget';
}

// Demand level classification
function classifyDemandLevel(predicted: number, historical: number): string {
  const ratio = predicted / (historical || 1);
  if (ratio >= 1.5) return 'high';
  if (ratio >= 1.1) return 'above_normal';
  if (ratio <= 0.5) return 'low';
  if (ratio <= 0.8) return 'below_normal';
  return 'normal';
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'full';

    console.log(`[traveller-intelligence] Running action: ${action}`);

    const results: Record<string, unknown> = {};

    // ========================================
    // 1. UPDATE TRAVELLER PROFILES
    // ========================================
    if (action === 'full' || action === 'profiles') {
      console.log('[traveller-intelligence] Updating traveller profiles...');

      // Get all profiles that need updating
      const { data: profiles, error: profilesError } = await supabase
        .from('traveller_profiles')
        .select('*')
        .order('updated_at', { ascending: true })
        .limit(500);

      if (profilesError) {
        console.error('[traveller-intelligence] Error fetching profiles:', profilesError);
      } else if (profiles && profiles.length > 0) {
        let updatedCount = 0;

        for (const profile of profiles) {
          const newSpendTier = calculateSpendTier(profile.lifetime_value || 0);
          const newSegment = classifySegment({
            ...profile,
            spend_tier: newSpendTier,
          });

          if (newSpendTier !== profile.spend_tier || newSegment !== profile.traveller_segment) {
            await supabase
              .from('traveller_profiles')
              .update({
                spend_tier: newSpendTier,
                traveller_segment: newSegment,
                updated_at: new Date().toISOString(),
              })
              .eq('visitor_id', profile.visitor_id);
            updatedCount++;
          }
        }

        results.profiles_updated = updatedCount;
        console.log(`[traveller-intelligence] Updated ${updatedCount} profiles`);
      }
    }

    // ========================================
    // 2. UPDATE SEGMENT STATS
    // ========================================
    if (action === 'full' || action === 'segments') {
      console.log('[traveller-intelligence] Updating segment stats...');

      const segments = ['loyal', 'luxury', 'budget_explorer', 'solo', 'group_organizer', 'high_intent', 'new_explorer'];

      for (const segmentKey of segments) {
        // Count travellers in this segment
        const { count } = await supabase
          .from('traveller_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('traveller_segment', segmentKey);

        // Get aggregate stats
        const { data: stats } = await supabase
          .from('traveller_profiles')
          .select('lifetime_value, avg_booking_value, total_bookings')
          .eq('traveller_segment', segmentKey);

        const avgLtv = stats?.length
          ? stats.reduce((sum, s) => sum + (s.lifetime_value || 0), 0) / stats.length
          : 0;

        const avgBookingValue = stats?.length
          ? stats.reduce((sum, s) => sum + (s.avg_booking_value || 0), 0) / stats.length
          : 0;

        const totalRevenue = stats?.reduce((sum, s) => sum + (s.lifetime_value || 0), 0) || 0;

        const conversionRate = stats?.length
          ? (stats.filter(s => s.total_bookings > 0).length / stats.length) * 100
          : 0;

        await supabase
          .from('traveller_segments')
          .update({
            traveller_count: count || 0,
            avg_lifetime_value: avgLtv,
            avg_booking_value: avgBookingValue,
            total_revenue: totalRevenue,
            conversion_rate: conversionRate,
            updated_at: new Date().toISOString(),
          })
          .eq('segment_key', segmentKey);
      }

      results.segments_updated = segments.length;
      console.log(`[traveller-intelligence] Updated ${segments.length} segments`);
    }

    // ========================================
    // 3. GENERATE DEMAND FORECASTS
    // ========================================
    if (action === 'full' || action === 'forecasts') {
      console.log('[traveller-intelligence] Generating demand forecasts...');

      // Get room types
      const { data: roomTypes } = await supabase
        .from('room_types')
        .select('id, name')
        .eq('is_active', true);

      if (roomTypes) {
        const today = new Date();
        const forecasts = [];

        for (let i = 1; i <= 30; i++) {
          const forecastDate = new Date(today);
          forecastDate.setDate(today.getDate() + i);
          const dateStr = forecastDate.toISOString().split('T')[0];

          for (const room of roomTypes) {
            // Get historical bookings for same day of week
            const dayOfWeek = forecastDate.getDay();
            
            const { count: historicalCount } = await supabase
              .from('bookings')
              .select('*', { count: 'exact', head: true })
              .eq('room_type_id', room.id)
              .gte('check_in', new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

            // Simple forecast based on historical average + seasonality
            const baselineDemand = Math.ceil((historicalCount || 0) / 12); // 12 weeks
            const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 : 1.0;
            const predictedDemand = Math.round(baselineDemand * weekendMultiplier);
            
            const demandLevel = classifyDemandLevel(predictedDemand, baselineDemand);
            const confidence = Math.min(0.9, 0.5 + (historicalCount || 0) * 0.01);

            forecasts.push({
              forecast_date: dateStr,
              room_type_id: room.id,
              room_type_name: room.name,
              predicted_demand: predictedDemand,
              predicted_revenue: predictedDemand * 1500, // Avg booking value estimate
              confidence_score: confidence,
              demand_level: demandLevel,
              demand_factors: {
                day_of_week: dayOfWeek,
                is_weekend: dayOfWeek === 0 || dayOfWeek === 6,
                historical_bookings: historicalCount,
              },
            });
          }
        }

        // Upsert forecasts
        const { error: forecastError } = await supabase
          .from('demand_forecasts')
          .upsert(forecasts, { onConflict: 'forecast_date,room_type_id' });

        if (forecastError) {
          console.error('[traveller-intelligence] Forecast error:', forecastError);
        }

        results.forecasts_generated = forecasts.length;
        console.log(`[traveller-intelligence] Generated ${forecasts.length} forecasts`);
      }
    }

    // ========================================
    // 4. GENERATE REVENUE INTELLIGENCE
    // ========================================
    if (action === 'full' || action === 'revenue') {
      console.log('[traveller-intelligence] Generating revenue intelligence...');

      const today = new Date().toISOString().split('T')[0];

      // Get today's bookings
      const { data: todayBookings, count: bookingCount } = await supabase
        .from('bookings')
        .select('total_amount, room_type, source')
        .gte('created_at', today)
        .eq('booking_status', 'confirmed');

      // Get visitor count
      const { count: visitorCount } = await supabase
        .from('analytics_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', today);

      // Calculate metrics
      const totalRevenue = todayBookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
      const avgBookingValue = bookingCount ? totalRevenue / bookingCount : 0;
      const conversionRate = visitorCount ? ((bookingCount || 0) / visitorCount) * 100 : 0;

      // Get segment breakdown
      const { data: segmentData } = await supabase
        .from('traveller_segments')
        .select('segment_key, traveller_count, total_revenue');

      const segmentBreakdown: Record<string, unknown> = {};
      segmentData?.forEach(s => {
        segmentBreakdown[s.segment_key] = {
          count: s.traveller_count,
          revenue: s.total_revenue,
        };
      });

      // Revenue by source
      const revenueBySource: Record<string, number> = {};
      todayBookings?.forEach(b => {
        const source = b.source || 'direct';
        revenueBySource[source] = (revenueBySource[source] || 0) + (b.total_amount || 0);
      });

      // Get 7-day and 30-day forecasts
      const { data: forecasts7d } = await supabase
        .from('demand_forecasts')
        .select('predicted_revenue')
        .gte('forecast_date', today)
        .lte('forecast_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      const { data: forecasts30d } = await supabase
        .from('demand_forecasts')
        .select('predicted_revenue')
        .gte('forecast_date', today)
        .lte('forecast_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      const next7dForecast = forecasts7d?.reduce((sum, f) => sum + (f.predicted_revenue || 0), 0) || 0;
      const next30dForecast = forecasts30d?.reduce((sum, f) => sum + (f.predicted_revenue || 0), 0) || 0;

      // Upsert revenue intelligence
      await supabase
        .from('revenue_intelligence')
        .upsert({
          snapshot_date: today,
          total_revenue: totalRevenue,
          booking_count: bookingCount || 0,
          avg_booking_value: avgBookingValue,
          revenue_per_visitor: visitorCount ? totalRevenue / visitorCount : 0,
          total_visitors: visitorCount || 0,
          conversion_rate: conversionRate,
          segment_breakdown: segmentBreakdown,
          revenue_by_source: revenueBySource,
          next_7d_forecast: next7dForecast,
          next_30d_forecast: next30dForecast,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'snapshot_date' });

      results.revenue_snapshot = true;
      console.log('[traveller-intelligence] Revenue intelligence updated');
    }

    return new Response(
      JSON.stringify({
        success: true,
        action,
        results,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[traveller-intelligence] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});