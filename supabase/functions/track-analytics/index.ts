import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

// ============= TRAFFIC FILTERING =============
// Lovable/Admin URL patterns to block at INSERT time
const LOVABLE_URL_PARAMS = ['__lovable_token', 'forceHideBadge', '__lovable', '__lovable_session'];
const LOVABLE_DOMAINS = ['lovable.dev', 'lovable.app', 'gptengineer.app', 'preview.lovable.app', 'sandbox.lovable.app'];

// Bot/crawler User-Agent patterns
const BOT_USER_AGENT_PATTERNS = [
  /bot/i, /crawler/i, /spider/i, /scraper/i,
  /headless/i, /phantom/i, /selenium/i, /puppeteer/i, /playwright/i,
  /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i, /baiduspider/i,
  /yandexbot/i, /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i,
  /whatsapp/i, /telegrambot/i, /discordbot/i,
  /applebot/i, /semrush/i, /ahrefsbot/i, /mj12bot/i,
  /dotbot/i, /petalbot/i, /bytespider/i,
  /curl/i, /wget/i, /httpie/i, /postman/i, /insomnia/i,
  /python-requests/i, /axios/i, /node-fetch/i, /go-http-client/i,
  /java\//i, /okhttp/i, /apache-httpclient/i,
  /lovable/i, // Block any Lovable-related user agents
];

/**
 * Check if traffic should be blocked (Lovable admin, bots, crawlers)
 * Returns { blocked: true, reason: string } or { blocked: false }
 */
function shouldBlockTraffic(data: {
  page_path?: string;
  landing_page?: string;
  referrer_url?: string;
  referrer?: string;
  source?: string;
  user_agent?: string;
  url?: string;
}): { blocked: boolean; reason?: string } {
  // 1. Check URL parameters for Lovable markers
  const urlsToCheck = [data.page_path, data.landing_page, data.url].filter(Boolean);
  for (const url of urlsToCheck) {
    for (const param of LOVABLE_URL_PARAMS) {
      if (url?.includes(param)) {
        return { blocked: true, reason: `lovable_url_param:${param}` };
      }
    }
  }

  // 2. Check referrer for Lovable domains
  const referrersToCheck = [data.referrer_url, data.referrer, data.source].filter(Boolean);
  for (const referrer of referrersToCheck) {
    for (const domain of LOVABLE_DOMAINS) {
      if (referrer?.includes(domain)) {
        return { blocked: true, reason: `lovable_referrer:${domain}` };
      }
    }
  }

  // 3. Check User-Agent for bots/crawlers
  if (data.user_agent) {
    for (const pattern of BOT_USER_AGENT_PATTERNS) {
      if (pattern.test(data.user_agent)) {
        return { blocked: true, reason: `bot_user_agent:${pattern.source}` };
      }
    }
  }

  return { blocked: false };
}

// Rate limiting - simple in-memory (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100;
const RATE_WINDOW = 60000;

// In-memory geo cache to avoid repeated lookups for same IP
const geoCache = new Map<string, { data: any; expiresAt: number }>();
const GEO_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function checkRateLimitLocal(visitorId: string): boolean {
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

// Country lookup from IP
async function getGeoFromIP(ip: string): Promise<{ 
  country_code?: string; 
  country_name?: string;
  region?: string; 
  city?: string;
  latitude?: number;
  longitude?: number;
} | null> {
  try {
    if (!ip || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return null;
    }

    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,lat,lon`, {
      signal: AbortSignal.timeout(2000),
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

// Calculate booking intent score based on behavior
function calculateIntentScore(events: { event_type: string; event_category?: string }[]): number {
  let score = 0;
  
  for (const event of events) {
    if (event.event_type === 'pageview' && event.event_category?.includes('room')) score += 10;
    if (event.event_type === 'click' && event.event_category === 'booking') score += 25;
    if (event.event_type === 'modal_open' && event.event_category?.includes('booking')) score += 30;
    if (event.event_type === 'form_start') score += 20;
    if (event.event_type === 'booking_start') score += 40;
  }
  
  return Math.min(score, 100);
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

    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || '';

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid request format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { endpoint, data } = body;

    if (!endpoint || !data) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const visitorId = data.visitorId || data.visitor_id || 'unknown';
    const userAgent = req.headers.get('user-agent') || data.user_agent || '';

    // ============= SERVER-SIDE TRAFFIC FILTERING =============
    // Block Lovable admin/preview traffic and bots at INSERT time
    const trafficCheck = shouldBlockTraffic({
      page_path: data.page_path,
      landing_page: data.landing_page,
      referrer_url: data.referrer_url,
      referrer: data.referrer,
      source: data.source,
      user_agent: userAgent,
      url: data.url,
    });

    if (trafficCheck.blocked) {
      console.log(`[Analytics] Blocked traffic: ${trafficCheck.reason} - visitorId: ${visitorId.substring(0, 8)}...`);
      // Return success but don't insert - silent drop for bots/admin traffic
      return new Response(JSON.stringify({ success: true, filtered: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!checkRateLimitLocal(visitorId)) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get geo data on entrance
    let geoData: Awaited<ReturnType<typeof getGeoFromIP>> = null;
    if (endpoint === 'pageview' && data.is_entrance) {
      geoData = await getGeoFromIP(clientIP);
    }

    // Server-side logging only - no internal details exposed
    console.log(`[Analytics] Event received: ${endpoint}`);

    // ============ TRAVELLER INTELLIGENCE INTEGRATION ============
    // Insert into traveller_events for all event types
    const eventData = {
      visitor_id: visitorId,
      session_id: data.sessionId,
      event_type: endpoint,
      event_category: data.event_category || null,
      event_action: data.event_action || null,
      event_label: data.event_label || null,
      event_value: data.event_value || data.conversion_value || null,
      page_path: data.page_path,
      referrer: data.referrer_url || null,
      device_type: data.deviceType || data.device_type || null,
      country_code: geoData?.country_code || data.country_code || null,
      city: geoData?.city || null,
      properties: {
        browser: data.browser,
        os: data.os,
        screen_width: data.screen_width,
        screen_height: data.screen_height,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        scroll_depth: data.scroll_depth_percent,
        time_on_page: data.time_on_page_seconds,
        is_entrance: data.is_entrance,
        is_exit: data.is_exit,
        room_type: data.room_type,
        package_type: data.package_type,
        funnel_step: data.funnel_step,
        error_type: data.error_type,
        error_message: data.error_message,
        exit_reason: data.exit_reason,
        ...data.metadata
      }
    };

    // Insert event into traveller_events
    const { error: eventError } = await supabase.from('traveller_events').insert(eventData);
    if (eventError) {
      // Server-side only - generic code for debugging
      console.error('[Analytics] Event insert failed - code: TE001');
    }

    // Upsert traveller profile
    const profileUpdate: Record<string, any> = {
      visitor_id: visitorId,
      last_seen_at: new Date().toISOString(),
      last_page_viewed: data.page_path,
      updated_at: new Date().toISOString(),
    };

    // Set first touch attribution on first visit
    if (data.is_entrance) {
      profileUpdate.first_touch_source = data.source || data.utm_source || 'direct';
      profileUpdate.first_touch_medium = data.medium || data.utm_medium || null;
      profileUpdate.first_touch_campaign = data.utm_campaign || null;
    }

    // Always update last touch
    profileUpdate.last_touch_source = data.source || data.utm_source || null;
    profileUpdate.last_touch_medium = data.medium || data.utm_medium || null;

    // Upsert profile
    const { error: profileError } = await supabase.from('traveller_profiles').upsert(profileUpdate, {
      onConflict: 'visitor_id',
    });
    if (profileError) {
      // Server-side only - generic code for debugging
      console.error('[Analytics] Profile upsert failed - code: TP001');
    }

    // Increment session/pageview counts
    if (endpoint === 'pageview') {
      const { error: rpcError } = await supabase.rpc('increment_traveller_stats', {
        p_visitor_id: visitorId,
        p_is_new_session: data.is_entrance || false
      });
      if (rpcError) {
        // Server-side only - generic code for debugging
        console.warn('[Analytics] Stats increment unavailable - code: TS001');
      }
    }

    // ============ EXISTING ANALYTICS LOGIC ============
    switch (endpoint) {
      case 'pageview': {
        const { data: existingSession } = await supabase
          .from('analytics_sessions')
          .select('id, page_views')
          .eq('session_id', data.sessionId)
          .single();

        if (!existingSession) {
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
            is_new_visitor: true,
            page_views: 1,
          });

          if (geoData?.country_code) {
            const { error: geoError } = await supabase.from('analytics_geo_heatmap').upsert({
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
              onConflict: 'country_code,date',
            });

            if (geoError) {
              console.warn('[Analytics] Geo heatmap update failed - code: GH001');
            }
          }
        } else {
          await supabase.from('analytics_sessions')
            .update({ 
              page_views: (existingSession.page_views || 0) + 1,
              is_bounce: false,
              last_activity_at: new Date().toISOString(),
            })
            .eq('session_id', data.sessionId);
        }

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
              
            // Update traveller profile with session duration
            await supabase.from('traveller_profiles')
              .update({
                avg_session_duration: duration,
              })
              .eq('visitor_id', visitorId);
          }
        }

        break;
      }

      case 'event': {
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

        // Update booking intent score
        if (data.event_category === 'booking' || data.event_category === 'room') {
          const { data: recentEvents } = await supabase
            .from('traveller_events')
            .select('event_type, event_category')
            .eq('visitor_id', visitorId)
            .order('created_at', { ascending: false })
            .limit(20);
            
          if (recentEvents) {
            const intentScore = calculateIntentScore(recentEvents);
            await supabase.from('traveller_profiles')
              .update({ booking_intent_score: intentScore })
              .eq('visitor_id', visitorId);
          }
        }

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

        // Update traveller profile on completed booking
        if (data.is_completed && data.conversion_value) {
          await supabase.from('traveller_profiles')
            .update({
              total_bookings: supabase.rpc('increment', { x: 1 }),
              lifetime_value: supabase.rpc('add_to_lifetime_value', { amount: data.conversion_value }),
              last_booking_at: new Date().toISOString(),
              preferred_room_category: data.room_type?.includes('270') ? 'luxury' : 
                                       data.room_type?.includes('Dormitory') ? 'dormitory' : 'private',
              is_repeat_traveller: true,
            })
            .eq('visitor_id', visitorId);

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
                onConflict: 'country_code,date',
              });
          }
        }

        break;
      }

      case 'realtime': {
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

        const { error: cleanupError } = await supabase.rpc('cleanup_stale_realtime_visitors');
        if (cleanupError) {
          // Fallback cleanup - no internal details exposed
          console.warn('[Analytics] Realtime cleanup fallback triggered - code: RC001');

          const { error: fallbackError } = await supabase
            .from('analytics_realtime')
            .delete()
            .lt('last_seen_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

          if (fallbackError) {
            console.warn('[Analytics] Fallback cleanup failed - code: RC002');
          }
        }

        break;
      }

      // Error tracking endpoint
      case 'error': {
        await supabase.from('traveller_events').insert({
          visitor_id: visitorId,
          session_id: data.sessionId,
          event_type: 'error',
          event_category: 'error',
          event_action: data.error_type || 'unknown',
          event_label: data.error_message?.substring(0, 500),
          page_path: data.page_path,
          properties: {
            stack: data.stack?.substring(0, 2000),
            component: data.component,
            user_agent: data.user_agent,
            url: data.url,
          }
        });
        break;
      }

      // Exit survey endpoint
      case 'exit_survey': {
        await supabase.from('traveller_events').insert({
          visitor_id: visitorId,
          session_id: data.sessionId,
          event_type: 'exit_survey',
          event_category: 'feedback',
          event_action: 'exit_reason',
          event_label: data.exit_reason,
          properties: {
            additional_feedback: data.feedback,
            was_looking_for: data.was_looking_for,
            would_return: data.would_return,
          }
        });
        break;
      }

      // Profile update endpoint (progressive profiling)
      case 'profile_update': {
        const profileData: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };
        
        // Only update non-PII fields in traveller_profiles
        if (data.is_solo_traveller !== undefined) profileData.is_solo_traveller = data.is_solo_traveller;
        if (data.is_group_organizer !== undefined) profileData.is_group_organizer = data.is_group_organizer;
        if (data.preferred_season) profileData.preferred_season = data.preferred_season;
        if (data.tour_interest_score) profileData.tour_interest_score = data.tour_interest_score;
        
        // Travel intelligence fields from booking form
        if (data.travel_style) profileData.preferred_room_category = data.travel_style === 'luxury' ? 'luxury' : data.travel_style === 'budget' ? 'dormitory' : 'private';
        if (data.trip_purpose) profileData.preferred_season = data.trip_purpose; // Reusing field for trip type
        
        await supabase.from('traveller_profiles')
          .update(profileData)
          .eq('visitor_id', visitorId);
          
        break;
      }

      // Form engagement tracking endpoint
      case 'form_engagement': {
        await supabase.from('traveller_events').insert({
          visitor_id: visitorId,
          session_id: data.sessionId,
          event_type: 'form_engagement',
          event_category: 'booking_form',
          event_action: data.event_action || data.action,
          event_label: data.event_label || data.field_name,
          event_value: data.event_value || data.time_spent,
          page_path: data.page_path,
          properties: {
            form_name: data.form_name,
            scroll_depth: data.scroll_depth,
            total_time: data.total_form_time,
            fields_completed: data.fields_completed,
            location_granted: data.location_granted,
            location_city: data.location_city,
            location_country: data.location_country,
            trip_purpose: data.trip_purpose,
            travel_style: data.travel_style,
            traveling_with: data.traveling_with,
            heard_from: data.heard_from,
          }
        });
        
        // Update booking intent score on form engagement
        if (data.event_action === 'form_start' || data.event_action === 'field_focus') {
          const { data: profile } = await supabase
            .from('traveller_profiles')
            .select('booking_intent_score')
            .eq('visitor_id', visitorId)
            .single();
          
          let newScore = (profile?.booking_intent_score || 0) + 5;
          if (data.event_action === 'form_start') newScore += 15;
          
          await supabase.from('traveller_profiles')
            .update({ 
              booking_intent_score: Math.min(newScore, 100),
              updated_at: new Date().toISOString()
            })
            .eq('visitor_id', visitorId);
        }
        
        break;
      }

      // Session end for traffic_sessions table
      case 'session-end': {
        const sessionUpdate = {
          ended_at: data.ended_at || new Date().toISOString(),
          duration_seconds: data.duration_seconds || 0,
          exit_page: data.exit_page,
          max_scroll_depth: data.max_scroll_depth || 0,
          total_interactions: data.total_interactions || 0,
          unified_intent_score: data.unified_intent_score || 0,
          intent_category: data.intent_category || 'low',
          click_quality_score: data.click_quality_score || 50,
          traffic_quality: data.traffic_quality || 'medium',
          last_activity_at: new Date().toISOString(),
        };

        await supabase
          .from('traffic_sessions')
          .update(sessionUpdate)
          .eq('session_id', data.session_id);

        break;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Server-side logging only - no internal details exposed
    console.error('[Analytics] Processing error - code: ERR001');
    return new Response(JSON.stringify({ error: 'Unable to process request' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});