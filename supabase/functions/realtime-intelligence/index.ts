import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin authorization
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      
      const { data: roleCheck } = await userClient.rpc('get_user_role');
      if (roleCheck !== 'admin') {
        return new Response(
          JSON.stringify({ error: 'Admin access required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
        );
      }
    }

    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint') || 'overview';

    console.log(`[realtime-intelligence] Fetching: ${endpoint}`);

    let data: unknown = null;

    switch (endpoint) {
      case 'overview': {
        // Real-time overview stats
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const today = new Date().toISOString().split('T')[0];

        const [
          { count: activeVisitors },
          { count: todaySessions },
          { data: todayBookings },
          { data: revenueData },
          { data: segments },
        ] = await Promise.all([
          supabase.from('analytics_realtime').select('*', { count: 'exact', head: true }).gte('last_seen_at', fiveMinutesAgo),
          supabase.from('analytics_sessions').select('*', { count: 'exact', head: true }).gte('started_at', today),
          supabase.from('bookings').select('total_amount, booking_status').gte('created_at', today),
          supabase.from('revenue_intelligence').select('*').eq('snapshot_date', today).single(),
          supabase.from('traveller_segments').select('segment_key, segment_name, segment_color, traveller_count, total_revenue').eq('is_active', true),
        ]);

        const confirmedBookings = todayBookings?.filter(b => b.booking_status === 'confirmed') || [];
        const todayRevenue = confirmedBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);

        data = {
          realtime: {
            active_visitors: activeVisitors || 0,
            today_sessions: todaySessions || 0,
            today_bookings: confirmedBookings.length,
            today_revenue: todayRevenue,
          },
          forecasts: {
            next_7d: revenueData?.next_7d_forecast || 0,
            next_30d: revenueData?.next_30d_forecast || 0,
          },
          segments: segments || [],
          conversion_rate: revenueData?.conversion_rate || 0,
        };
        break;
      }

      case 'travellers': {
        // Recent high-intent travellers
        const { data: highIntent } = await supabase
          .from('traveller_profiles')
          .select('visitor_id, traveller_segment, spend_tier, booking_intent_score, last_page_viewed, last_seen_at')
          .gte('booking_intent_score', 50)
          .order('last_seen_at', { ascending: false })
          .limit(20);

        data = { high_intent_travellers: highIntent || [] };
        break;
      }

      case 'events': {
        // Recent events stream
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        
        const { data: events } = await supabase
          .from('traveller_events')
          .select('*')
          .gte('created_at', tenMinutesAgo)
          .order('created_at', { ascending: false })
          .limit(50);

        data = { recent_events: events || [] };
        break;
      }

      case 'segments': {
        // Detailed segment data
        const { data: segments } = await supabase
          .from('traveller_segments')
          .select('*')
          .eq('is_active', true)
          .order('traveller_count', { ascending: false });

        // Get segment distribution
        const { data: profiles } = await supabase
          .from('traveller_profiles')
          .select('traveller_segment, spend_tier');

        const distribution: Record<string, number> = {};
        const spendDistribution: Record<string, number> = {};

        profiles?.forEach(p => {
          distribution[p.traveller_segment] = (distribution[p.traveller_segment] || 0) + 1;
          spendDistribution[p.spend_tier] = (spendDistribution[p.spend_tier] || 0) + 1;
        });

        data = {
          segments: segments || [],
          distribution,
          spend_distribution: spendDistribution,
        };
        break;
      }

      case 'forecasts': {
        // Demand forecasts
        const today = new Date().toISOString().split('T')[0];
        const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const { data: forecasts } = await supabase
          .from('demand_forecasts')
          .select('*')
          .gte('forecast_date', today)
          .lte('forecast_date', thirtyDaysLater)
          .order('forecast_date', { ascending: true });

        // Group by date
        const byDate: Record<string, unknown[]> = {};
        forecasts?.forEach(f => {
          if (!byDate[f.forecast_date]) byDate[f.forecast_date] = [];
          byDate[f.forecast_date].push(f);
        });

        data = { forecasts: byDate };
        break;
      }

      case 'revenue': {
        // Revenue intelligence history
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const { data: revenueHistory } = await supabase
          .from('revenue_intelligence')
          .select('*')
          .gte('snapshot_date', thirtyDaysAgo)
          .order('snapshot_date', { ascending: true });

        data = { revenue_history: revenueHistory || [] };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown endpoint' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
    }

    return new Response(
      JSON.stringify({ success: true, data, endpoint }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('[realtime-intelligence] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});