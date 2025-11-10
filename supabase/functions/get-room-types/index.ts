
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { createOptimizedClient } from '../_shared/supabaseClient.ts'
import { checkRateLimit, getClientIp, getRateLimitHeaders } from '../_shared/rateLimiter.ts'
import { getCacheHeaders } from '../_shared/cacheHeaders.ts'
import { PerformanceMonitor } from '../_shared/performanceMonitor.ts'

serve(async (req) => {
  const monitor = new PerformanceMonitor('get-room-types');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createOptimizedClient({ useServiceRole: true });
    
    // Rate limiting
    const clientIp = getClientIp(req);
    const rateLimitResult = await checkRateLimit(supabaseClient, clientIp, 'get-room-types');
    
    if (!rateLimitResult.allowed) {
      monitor.complete(429);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429,
          headers: { 
            ...corsHeaders,
            ...getCacheHeaders('get-room-types'),
            ...getRateLimitHeaders(rateLimitResult),
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Query room types
    const { data, error } = await supabaseClient
      .from('room_types')
      .select('*')
      .eq('is_active', true)
      .order('created_at')

    if (error) {
      throw error
    }

    monitor.complete(200, { cacheHit: false });
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          ...getCacheHeaders('get-room-types'),
          ...getRateLimitHeaders(rateLimitResult),
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error fetching room types:', error);
    monitor.complete(500, { error: error.message });
    
    return new Response(
      JSON.stringify({ 
        error: 'Unable to fetch room information. Please try again or contact support.',
        success: false
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          ...getCacheHeaders('get-room-types'),
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
