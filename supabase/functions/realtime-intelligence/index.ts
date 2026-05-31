import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { getCorsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // SECURITY: Admin authorization is REQUIRED. A missing/invalid token must
    // never be allowed to reach the sensitive revenue/booking/traveller data.
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: roleCheck, error: roleError } = await userClient.rpc('get_user_role');
    if (roleError || roleCheck !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
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
          { data: recentEvents },
          { data: highIntentProfiles },
        ] = await Promise.all([
          supabase.from('analytics_realtime').select('*', { count: 'exact', head: true }).gte('last_seen_at', fiveMinutesAgo),
          supabase.from('analytics_sessions').select('*', { count: 'exact', head: true }).gte('started_at', today),
          supabase.from('bookings').select('total_amount, booking_status').gte('created_at', today),
          supabase.from('revenue_intelligence').select('*').eq('snapshot_date', today).single(),
          supabase.from('traveller_segments').select('segment_key, segment_name, segment_color, traveller_count, total_revenue').eq('is_active', true),
          supabase.from('traveller_events').select('event_type, event_category, event_action, page_path, created_at, visitor_id').order('created_at', { ascending: false }).limit(20),
          supabase.from('traveller_profiles').select('visitor_id, booking_intent_score, last_page_viewed, last_seen_at, traveller_segment').gte('booking_intent_score', 50).order('booking_intent_score', { ascending: false }).limit(10),
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
          recent_events: recentEvents || [],
          high_intent_travellers: highIntentProfiles || [],
        };
        break;
      }

      case 'travellers': {
        // Recent high-intent travellers with activity
        const { data: highIntent } = await supabase
          .from('traveller_profiles')
          .select('visitor_id, traveller_segment, spend_tier, booking_intent_score, last_page_viewed, last_seen_at, lifetime_value, total_bookings')
          .gte('booking_intent_score', 30)
          .order('last_seen_at', { ascending: false })
          .limit(50);

        // Get recent activity for each
        const visitorIds = highIntent?.map(t => t.visitor_id) || [];
        const { data: activities } = await supabase
          .from('traveller_events')
          .select('visitor_id, event_type, event_category, page_path, created_at')
          .in('visitor_id', visitorIds)
          .order('created_at', { ascending: false })
          .limit(200);

        // Group by visitor
        const activityMap: Record<string, any[]> = {};
        activities?.forEach(a => {
          if (!activityMap[a.visitor_id]) activityMap[a.visitor_id] = [];
          if (activityMap[a.visitor_id].length < 5) activityMap[a.visitor_id].push(a);
        });

        data = { 
          high_intent_travellers: (highIntent || []).map(t => ({
            ...t,
            recent_activity: activityMap[t.visitor_id] || [],
          }))
        };
        break;
      }

      case 'events': {
        // Recent events stream including errors and exit surveys
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        
        const { data: events } = await supabase
          .from('traveller_events')
          .select('*')
          .gte('created_at', tenMinutesAgo)
          .order('created_at', { ascending: false })
          .limit(100);

        // Separate error events
        const errors = events?.filter(e => e.event_type === 'error') || [];
        const exitSurveys = events?.filter(e => e.event_type === 'exit_survey') || [];
        const regularEvents = events?.filter(e => e.event_type !== 'error' && e.event_type !== 'exit_survey') || [];

        data = { 
          recent_events: regularEvents,
          errors,
          exit_surveys: exitSurveys,
        };
        break;
      }

      case 'segments': {
        // Detailed segment data
        const { data: segments } = await supabase
          .from('traveller_segments')
          .select('*')
          .eq('is_active', true)
          .order('traveller_count', { ascending: false });

        // Get segment distribution from profiles
        const { data: profiles } = await supabase
          .from('traveller_profiles')
          .select('traveller_segment, spend_tier, lifetime_value');

        const distribution: Record<string, { count: number; revenue: number }> = {};
        const spendDistribution: Record<string, number> = {};

        profiles?.forEach(p => {
          const seg = p.traveller_segment || 'new_explorer';
          if (!distribution[seg]) distribution[seg] = { count: 0, revenue: 0 };
          distribution[seg].count += 1;
          distribution[seg].revenue += p.lifetime_value || 0;
          spendDistribution[p.spend_tier || 'budget'] = (spendDistribution[p.spend_tier || 'budget'] || 0) + 1;
        });

        data = {
          segments: (segments || []).map(s => ({
            ...s,
            actual_count: distribution[s.segment_key]?.count || 0,
            actual_revenue: distribution[s.segment_key]?.revenue || 0,
          })),
          distribution: Object.entries(distribution).map(([name, d]) => ({
            segment: name,
            count: d.count,
            revenue: d.revenue,
            percentage: profiles?.length ? Math.round((d.count / profiles.length) * 100) : 0,
          })),
          spend_distribution: Object.entries(spendDistribution).map(([tier, count]) => ({
            tier,
            count,
            percentage: profiles?.length ? Math.round((count / profiles.length) * 100) : 0,
          })),
          total_profiles: profiles?.length || 0,
        };
        break;
      }

      case 'forecasts': {
        // Demand forecasts for next 14 days
        const today = new Date().toISOString().split('T')[0];
        const fourteenDaysLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const { data: forecasts } = await supabase
          .from('demand_forecasts')
          .select('*')
          .gte('forecast_date', today)
          .lte('forecast_date', fourteenDaysLater)
          .order('forecast_date', { ascending: true });

        // Get historical for comparison
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const { data: historicalBookings } = await supabase
          .from('bookings')
          .select('check_in, room_type, total_amount, booking_status')
          .gte('check_in', thirtyDaysAgo)
          .in('booking_status', ['confirmed', 'completed']);

        const bookingsByDate: Record<string, number> = {};
        historicalBookings?.forEach(b => {
          bookingsByDate[b.check_in] = (bookingsByDate[b.check_in] || 0) + 1;
        });

        data = { 
          forecasts: forecasts || [],
          historical: Object.entries(bookingsByDate).map(([date, count]) => ({ date, demand: count })),
          avg_daily_demand: historicalBookings?.length ? Math.round(historicalBookings.length / 30) : 0,
        };
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

        // Get actual booking data for comparison
        const { data: recentBookings } = await supabase
          .from('bookings')
          .select('created_at, total_amount, room_type, booking_status')
          .gte('created_at', thirtyDaysAgo + 'T00:00:00Z');

        const dailyRevenue: Record<string, { revenue: number; bookings: number }> = {};
        recentBookings?.forEach(b => {
          if (b.booking_status === 'confirmed' || b.booking_status === 'completed') {
            const date = b.created_at.split('T')[0];
            if (!dailyRevenue[date]) dailyRevenue[date] = { revenue: 0, bookings: 0 };
            dailyRevenue[date].revenue += b.total_amount || 0;
            dailyRevenue[date].bookings += 1;
          }
        });

        const totalRevenue = Object.values(dailyRevenue).reduce((s, d) => s + d.revenue, 0);
        const totalBookings = Object.values(dailyRevenue).reduce((s, d) => s + d.bookings, 0);

        data = { 
          revenue_history: revenueHistory || [],
          daily_revenue: Object.entries(dailyRevenue)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, d]) => ({ date, revenue: d.revenue, bookings: d.bookings })),
          summary: {
            total_revenue_30d: totalRevenue,
            total_bookings_30d: totalBookings,
            avg_booking_value: totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0,
          }
        };
        break;
      }

      case 'errors': {
        // Error tracking and exit survey data
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: errors } = await supabase
          .from('traveller_events')
          .select('*')
          .eq('event_type', 'error')
          .gte('created_at', oneDayAgo)
          .order('created_at', { ascending: false })
          .limit(50);

        const { data: exitSurveys } = await supabase
          .from('traveller_events')
          .select('*')
          .eq('event_type', 'exit_survey')
          .order('created_at', { ascending: false })
          .limit(100);

        // Aggregate exit reasons
        const exitReasons: Record<string, number> = {};
        exitSurveys?.forEach(s => {
          const reason = s.event_label || 'unknown';
          exitReasons[reason] = (exitReasons[reason] || 0) + 1;
        });

        data = {
          errors: errors || [],
          exit_surveys: exitSurveys || [],
          exit_reason_summary: Object.entries(exitReasons)
            .sort(([,a], [,b]) => b - a)
            .map(([reason, count]) => ({ reason, count })),
        };
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
    // Log detailed error server-side only
    console.error('[realtime-intelligence] Error:', error.message, error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Unable to fetch analytics data. Please try again or contact support.',
        code: 'RI_ERR_001'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});