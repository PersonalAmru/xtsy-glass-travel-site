import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from '../_shared/cors.ts';

interface MobileUILogPayload {
  user_agent?: string;
  screen_width?: number;
  screen_height?: number;
  viewport_width?: number;
  viewport_height?: number;
  device_pixel_ratio?: number;
  component_name: string;
  error_type: string;
  error_message?: string;
  page_url?: string;
  extra_data?: Record<string, unknown>;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: MobileUILogPayload = await req.json();
    
    // Validate required fields
    if (!payload.component_name || !payload.error_type) {
      console.error('Missing required fields:', { 
        component_name: payload.component_name, 
        error_type: payload.error_type 
      });
      return new Response(
        JSON.stringify({ error: 'component_name and error_type are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log the incoming request for debugging
    console.log('Mobile UI Debug Log:', {
      component: payload.component_name,
      error_type: payload.error_type,
      viewport: `${payload.viewport_width}x${payload.viewport_height}`,
      screen: `${payload.screen_width}x${payload.screen_height}`,
      device_pixel_ratio: payload.device_pixel_ratio,
      user_agent: payload.user_agent?.substring(0, 100),
    });

    // Detect potential issues
    const issues: string[] = [];
    
    if (payload.viewport_width && payload.screen_width) {
      // Check for viewport overflow
      if (payload.viewport_width > payload.screen_width) {
        issues.push('viewport_overflow');
      }
    }
    
    // Check for very small viewports (possible modal cutoff)
    if (payload.viewport_width && payload.viewport_width < 320) {
      issues.push('very_small_viewport');
    }

    // Create Supabase client with service role for insert
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert log into database
    const { data, error } = await supabase
      .from('mobile_ui_logs')
      .insert({
        user_agent: payload.user_agent,
        screen_width: payload.screen_width,
        screen_height: payload.screen_height,
        viewport_width: payload.viewport_width,
        viewport_height: payload.viewport_height,
        device_pixel_ratio: payload.device_pixel_ratio,
        component_name: payload.component_name,
        error_type: payload.error_type,
        error_message: payload.error_message,
        page_url: payload.page_url,
        extra_data: {
          ...payload.extra_data,
          detected_issues: issues,
        },
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to insert mobile UI log:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to log error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Mobile UI log created:', data?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        log_id: data?.id,
        detected_issues: issues,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in mobile-ui-debug function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
