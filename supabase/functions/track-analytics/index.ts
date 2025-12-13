import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting - simple in-memory (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100; // requests per minute per visitor
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(visitorId: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(visitorId);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(visitorId, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Country lookup from IP using free API
async function getGeoFromIP(ip: string): Promise<{ 
  country_code?: string; 
  country_name?: string;
  region?: string; 
  city?: string;
  latitude?: number;
  longitude?: number;
} | null> {
  try {
    // Skip for localhost/private IPs
    if (!ip || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return null;
    }

    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,lat,lon`, {
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (data.status !== 'success') return null;

    return {
      country_code: data.countryCode,
      country_name: data.country,
      region: data.regionName,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
    };
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP for geo lookup
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || '';

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { endpoint, data } = body;

    if (!endpoint || !data) {
      return new Response(JSON.stringify({ error: 'Missing endpoint or data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limit check
    const visitorId = data.visitorId || data.visitor_id || 'unknown';
    if (!checkRateLimit(visitorId)) {
      return new Response(JSON.stringify({ error: 'Rate limited' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get geo data (only once per session)
    let geoData: Awaited<ReturnType<typeof getGeoFromIP>> = null;
    if (endpoint === 'pageview' && data.is_entrance) {
      geoData = await getGeoFromIP(clientIP);
    }

    console.log(`[Analytics] ${endpoint} from ${visitorId}`, { 
      page: data.page_path,
      geo: geoData?.country_code,
    });

    switch (endpoint) {
      case 'pageview': {
        // Check if session exists, create if not
        const { data: existingSession } = await supabase
          .from('analytics_sessions')
          .select('id, page_views')
          .eq('session_id', data.sessionId)
          .single();

        if (!existingSession) {
          // Create new session
          await supabase.from('analytics_sessions').insert({
            session_id: data.sessionId,
            visitor_id: data.visitorId,
            country_code: geoData?.country_code || data.country_code,
            region: geoData?.region,
            city: geoData?.city,
            latitude: geoData?.latitude,
            longitude: geoData?.longitude,
            device_type: data.deviceType,
            browser: data.browser,
            os: data.os,
            screen_width: data.screen_width,
            screen_height: data.screen_height,
            referrer_source: data.source,
            referrer_medium: data.medium,
            referrer_url: data.url,
            utm_source: data.utm_source,
            utm_medium: data.utm_medium,
            utm_campaign: data.utm_campaign,
            utm_term: data.utm_term,
            utm_content: data.utm_content,
            landing_page: data.page_path,
            is_new_visitor: !localStorage?.getItem?.('xtsy_returning') || true,
            page_views: 1,
          });

          // Update geo heatmap
          if (geoData?.country_code) {
            await supabase.rpc('upsert_geo_heatmap', {
              p_country_code: geoData.country_code,
              p_country_name: geoData.country_name,
              p_region: geoData.region,
              p_city: geoData.city,
              p_latitude: geoData.latitude,
              p_longitude: geoData.longitude,
            }).catch(() => {
              // Fallback insert if RPC doesn't exist yet
              supabase.from('analytics_geo_heatmap').upsert({
                country_code: geoData.country_code,
                country_name: geoData.country_name,
                region: geoData.region,
                city: geoData.city,
                latitude: geoData.latitude,
                longitude: geoData.longitude,
                visitor_count: 1,
                session_count: 1,
                date: new Date().toISOString().split('T')[0],
              }, {
                onConflict: 'country_code,region,city,date',
              });
            });
          }
        } else {
          // Update existing session
          await supabase.from('analytics_sessions')
            .update({ 
              page_views: (existingSession.page_views || 0) + 1,
              is_bounce: false,
              last_activity_at: new Date().toISOString(),
            })
            .eq('session_id', data.sessionId);
        }

        // Insert pageview record
        await supabase.from('analytics_pageviews').insert({
          session_id: data.sessionId,
          visitor_id: data.visitorId,
          page_path: data.page_path,
          page_title: data.page_title,
          referrer_path: data.referrer_path,
          is_entrance: data.is_entrance || false,
        });

        break;
      }

      case 'pageview-end': {
        // Update pageview with time on page and scroll depth
        await supabase.from('analytics_pageviews')
          .update({
            time_on_page_seconds: data.time_on_page_seconds,
            scroll_depth_percent: data.scroll_depth_percent,
            is_exit: data.is_exit || false,
          })
          .eq('session_id', data.sessionId)
          .eq('page_path', data.page_path)
          .order('created_at', { ascending: false })
          .limit(1);

        // Update session exit page and duration
        if (data.is_exit) {
          const { data: session } = await supabase
            .from('analytics_sessions')
            .select('started_at')
            .eq('session_id', data.sessionId)
            .single();

          if (session) {
            const duration = Math.round(
              (Date.now() - new Date(session.started_at).getTime()) / 1000
            );

            await supabase.from('analytics_sessions')
              .update({
                exit_page: data.page_path,
                ended_at: new Date().toISOString(),
                session_duration_seconds: duration,
              })
              .eq('session_id', data.sessionId);
          }
        }

        break;
      }

      case 'event': {
        // Insert event
        await supabase.from('analytics_events').insert({
          session_id: data.sessionId,
          visitor_id: data.visitorId,
          event_category: data.event_category,
          event_action: data.event_action,
          event_label: data.event_label,
          event_value: data.event_value,
          page_path: data.page_path,
          element_id: data.element_id,
          element_class: data.element_class,
          element_text: data.element_text,
          metadata: data.metadata || {},
        });

        // Update session events count
        await supabase.rpc('increment_session_events', { 
          p_session_id: data.sessionId 
        }).catch(() => {
          // Fallback if RPC doesn't exist
          supabase.from('analytics_sessions')
            .update({ events_count: supabase.rpc('increment', { x: 1 }) })
            .eq('session_id', data.sessionId);
        });

        break;
      }

      case 'conversion': {
        await supabase.from('analytics_conversions').insert({
          session_id: data.sessionId,
          visitor_id: data.visitorId,
          funnel_name: data.funnel_name,
          funnel_step: data.funnel_step,
          step_order: data.step_order,
          room_type: data.room_type,
          package_type: data.package_type,
          conversion_value: data.conversion_value,
          currency: data.currency || 'INR',
          is_completed: data.is_completed || false,
          metadata: data.metadata || {},
        });

        // Update geo heatmap with booking if completed
        if (data.is_completed && data.conversion_value) {
          const { data: session } = await supabase
            .from('analytics_sessions')
            .select('country_code, region, city')
            .eq('session_id', data.sessionId)
            .single();

          if (session?.country_code) {
            await supabase.from('analytics_geo_heatmap')
              .upsert({
                country_code: session.country_code,
                region: session.region,
                city: session.city,
                booking_count: 1,
                revenue_total: data.conversion_value,
                date: new Date().toISOString().split('T')[0],
              }, {
                onConflict: 'country_code,region,city,date',
              });
          }
        }

        break;
      }

      case 'realtime': {
        // Upsert realtime presence
        await supabase.from('analytics_realtime').upsert({
          session_id: data.sessionId,
          visitor_id: data.visitorId,
          page_path: data.page_path,
          country_code: data.country_code,
          device_type: data.deviceType,
          last_seen_at: new Date().toISOString(),
        }, {
          onConflict: 'session_id',
        });

        // Cleanup stale entries (older than 5 min)
        await supabase.rpc('cleanup_stale_realtime_visitors').catch(() => {
          supabase.from('analytics_realtime')
            .delete()
            .lt('last_seen_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());
        });

        break;
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown endpoint' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Analytics Error]', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
