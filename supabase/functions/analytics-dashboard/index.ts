import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client with user's auth token to check admin status
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUser = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify admin role
    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: roleData } = await supabaseUser.rpc('has_role', { 
      _user_id: user.id, 
      _role: 'admin' 
    });

    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role for data access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();
    const daysBack = parseInt(url.searchParams.get('days') || '30');

    console.log(`[Analytics Dashboard] ${endpoint} for ${daysBack} days`);

    switch (endpoint) {
      case 'realtime': {
        const { data: realtime } = await supabase
          .from('analytics_realtime')
          .select('*')
          .gte('last_seen_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

        const activeByPage = realtime?.reduce((acc: Record<string, number>, r) => {
          acc[r.page_path || '/'] = (acc[r.page_path || '/'] || 0) + 1;
          return acc;
        }, {}) || {};

        const activeByCountry = realtime?.reduce((acc: Record<string, number>, r) => {
          acc[r.country_code || 'Unknown'] = (acc[r.country_code || 'Unknown'] || 0) + 1;
          return acc;
        }, {}) || {};

        return new Response(JSON.stringify({
          active_visitors: realtime?.length || 0,
          by_page: activeByPage,
          by_country: activeByCountry,
          visitors: realtime?.slice(0, 50) || [],
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'overview': {
        const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

        // Get session metrics
        const { data: sessions } = await supabase
          .from('analytics_sessions')
          .select('visitor_id, is_bounce, is_new_visitor, session_duration_seconds, page_views')
          .gte('started_at', startDate);

        // Get conversions
        const { data: conversions } = await supabase
          .from('analytics_conversions')
          .select('conversion_value, is_completed')
          .gte('created_at', startDate)
          .eq('is_completed', true);

        // Get today's metrics
        const today = new Date().toISOString().split('T')[0];
        const { data: todaySessions } = await supabase
          .from('analytics_sessions')
          .select('id')
          .gte('started_at', today);

        const { data: todayConversions } = await supabase
          .from('analytics_conversions')
          .select('conversion_value')
          .gte('created_at', today)
          .eq('is_completed', true);

        const totalVisitors = new Set(sessions?.map(s => s.visitor_id) || []).size;
        const totalSessions = sessions?.length || 0;
        const totalPageviews = sessions?.reduce((sum, s) => sum + (s.page_views || 0), 0) || 0;
        const bounces = sessions?.filter(s => s.is_bounce).length || 0;
        const newVisitors = sessions?.filter(s => s.is_new_visitor).length || 0;
        const avgDuration = sessions?.length 
          ? Math.round(sessions.reduce((sum, s) => sum + (s.session_duration_seconds || 0), 0) / sessions.length)
          : 0;

        const totalRevenue = conversions?.reduce((sum, c) => sum + (c.conversion_value || 0), 0) || 0;
        const todayRevenue = todayConversions?.reduce((sum, c) => sum + (c.conversion_value || 0), 0) || 0;

        return new Response(JSON.stringify({
          total_visitors: totalVisitors,
          total_sessions: totalSessions,
          total_pageviews: totalPageviews,
          bounce_rate: totalSessions ? ((bounces / totalSessions) * 100).toFixed(1) : 0,
          new_visitor_rate: totalSessions ? ((newVisitors / totalSessions) * 100).toFixed(1) : 0,
          avg_session_duration: avgDuration,
          total_conversions: conversions?.length || 0,
          total_revenue: totalRevenue,
          today_visitors: todaySessions?.length || 0,
          today_revenue: todayRevenue,
          conversion_rate: totalSessions 
            ? ((conversions?.length || 0) / totalSessions * 100).toFixed(2) 
            : 0,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'geo-heatmap': {
        const { data: geoData } = await supabase
          .from('analytics_geo_heatmap')
          .select('*')
          .gte('date', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('visitor_count', { ascending: false });

        // Aggregate by country
        const byCountry = geoData?.reduce((acc: Record<string, any>, g) => {
          if (!acc[g.country_code]) {
            acc[g.country_code] = {
              country_code: g.country_code,
              country_name: g.country_name,
              latitude: g.latitude,
              longitude: g.longitude,
              visitors: 0,
              sessions: 0,
              pageviews: 0,
              bookings: 0,
              revenue: 0,
              cities: [],
            };
          }
          acc[g.country_code].visitors += g.visitor_count || 0;
          acc[g.country_code].sessions += g.session_count || 0;
          acc[g.country_code].pageviews += g.pageview_count || 0;
          acc[g.country_code].bookings += g.booking_count || 0;
          acc[g.country_code].revenue += g.revenue_total || 0;
          if (g.city) {
            acc[g.country_code].cities.push({
              city: g.city,
              region: g.region,
              lat: g.latitude,
              lng: g.longitude,
              visitors: g.visitor_count,
              bookings: g.booking_count,
            });
          }
          return acc;
        }, {}) || {};

        return new Response(JSON.stringify({
          countries: Object.values(byCountry).sort((a: any, b: any) => b.visitors - a.visitors),
          raw: geoData?.slice(0, 100) || [],
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'funnel': {
        const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

        const { data: funnelData } = await supabase
          .from('analytics_conversions')
          .select('funnel_name, funnel_step, step_order, visitor_id, is_completed')
          .gte('created_at', startDate)
          .order('funnel_name')
          .order('step_order');

        // Group by funnel
        const funnels = funnelData?.reduce((acc: Record<string, any>, f) => {
          if (!acc[f.funnel_name]) {
            acc[f.funnel_name] = { steps: {}, completed: 0 };
          }
          if (!acc[f.funnel_name].steps[f.funnel_step]) {
            acc[f.funnel_name].steps[f.funnel_step] = {
              step: f.funnel_step,
              order: f.step_order,
              visitors: new Set(),
            };
          }
          acc[f.funnel_name].steps[f.funnel_step].visitors.add(f.visitor_id);
          if (f.is_completed) acc[f.funnel_name].completed++;
          return acc;
        }, {}) || {};

        // Convert to array format with drop-off calculations
        const result = Object.entries(funnels).map(([name, data]: [string, any]) => {
          const steps = Object.values(data.steps)
            .sort((a: any, b: any) => a.order - b.order)
            .map((s: any, i: number, arr: any[]) => ({
              step: s.step,
              order: s.order,
              count: s.visitors.size,
              dropoff: i > 0 ? ((arr[i-1].visitors.size - s.visitors.size) / arr[i-1].visitors.size * 100).toFixed(1) : 0,
            }));

          return {
            funnel: name,
            steps,
            total_completed: data.completed,
            conversion_rate: steps.length > 0 
              ? ((steps[steps.length - 1].count / steps[0].count) * 100).toFixed(1)
              : 0,
          };
        });

        return new Response(JSON.stringify({ funnels: result }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'traffic-sources': {
        const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

        const { data: sessions } = await supabase
          .from('analytics_sessions')
          .select('referrer_source, referrer_medium, utm_source, utm_medium, utm_campaign, visitor_id')
          .gte('started_at', startDate);

        // Group by source/medium
        const sources = sessions?.reduce((acc: Record<string, any>, s) => {
          const source = s.utm_source || s.referrer_source || 'direct';
          const medium = s.utm_medium || s.referrer_medium || 'none';
          const key = `${source}/${medium}`;

          if (!acc[key]) {
            acc[key] = { source, medium, visitors: new Set(), sessions: 0 };
          }
          acc[key].visitors.add(s.visitor_id);
          acc[key].sessions++;
          return acc;
        }, {}) || {};

        const result = Object.values(sources)
          .map((s: any) => ({
            source: s.source,
            medium: s.medium,
            visitors: s.visitors.size,
            sessions: s.sessions,
          }))
          .sort((a, b) => b.sessions - a.sessions);

        // Campaign breakdown
        const campaigns = sessions?.reduce((acc: Record<string, number>, s) => {
          if (s.utm_campaign) {
            acc[s.utm_campaign] = (acc[s.utm_campaign] || 0) + 1;
          }
          return acc;
        }, {}) || {};

        return new Response(JSON.stringify({
          sources: result.slice(0, 20),
          campaigns: Object.entries(campaigns)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'behavior': {
        const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

        // Top pages
        const { data: pageviews } = await supabase
          .from('analytics_pageviews')
          .select('page_path, time_on_page_seconds, scroll_depth_percent, is_entrance, is_exit')
          .gte('created_at', startDate);

        const pageStats = pageviews?.reduce((acc: Record<string, any>, p) => {
          if (!acc[p.page_path]) {
            acc[p.page_path] = {
              path: p.page_path,
              views: 0,
              entrances: 0,
              exits: 0,
              total_time: 0,
              total_scroll: 0,
            };
          }
          acc[p.page_path].views++;
          if (p.is_entrance) acc[p.page_path].entrances++;
          if (p.is_exit) acc[p.page_path].exits++;
          acc[p.page_path].total_time += p.time_on_page_seconds || 0;
          acc[p.page_path].total_scroll += p.scroll_depth_percent || 0;
          return acc;
        }, {}) || {};

        const pages = Object.values(pageStats)
          .map((p: any) => ({
            path: p.path,
            views: p.views,
            entrances: p.entrances,
            exits: p.exits,
            exit_rate: p.views ? ((p.exits / p.views) * 100).toFixed(1) : 0,
            avg_time: p.views ? Math.round(p.total_time / p.views) : 0,
            avg_scroll: p.views ? Math.round(p.total_scroll / p.views) : 0,
          }))
          .sort((a, b) => b.views - a.views);

        // Top events
        const { data: events } = await supabase
          .from('analytics_events')
          .select('event_category, event_action, event_label')
          .gte('created_at', startDate);

        const eventStats = events?.reduce((acc: Record<string, number>, e) => {
          const key = `${e.event_category}:${e.event_action}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {}) || {};

        const topEvents = Object.entries(eventStats)
          .map(([key, count]) => {
            const [category, action] = key.split(':');
            return { category, action, count };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 20);

        // Device breakdown
        const { data: sessions } = await supabase
          .from('analytics_sessions')
          .select('device_type, browser, os')
          .gte('started_at', startDate);

        const devices = sessions?.reduce((acc: Record<string, number>, s) => {
          acc[s.device_type || 'unknown'] = (acc[s.device_type || 'unknown'] || 0) + 1;
          return acc;
        }, {}) || {};

        const browsers = sessions?.reduce((acc: Record<string, number>, s) => {
          acc[s.browser || 'unknown'] = (acc[s.browser || 'unknown'] || 0) + 1;
          return acc;
        }, {}) || {};

        return new Response(JSON.stringify({
          top_pages: pages.slice(0, 20),
          top_events: topEvents,
          devices,
          browsers,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'trends': {
        // Get daily metrics
        const { data: dailyMetrics } = await supabase
          .from('analytics_daily_metrics')
          .select('*')
          .gte('date', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('date', { ascending: true });

        // Get hourly data for today
        const today = new Date().toISOString().split('T')[0];
        const { data: todaySessions } = await supabase
          .from('analytics_sessions')
          .select('started_at')
          .gte('started_at', today);

        const hourlyData = todaySessions?.reduce((acc: Record<number, number>, s) => {
          const hour = new Date(s.started_at).getHours();
          acc[hour] = (acc[hour] || 0) + 1;
          return acc;
        }, {}) || {};

        const hourly = Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          sessions: hourlyData[i] || 0,
        }));

        return new Response(JSON.stringify({
          daily: dailyMetrics || [],
          hourly,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown endpoint' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('[Analytics Dashboard Error]', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
