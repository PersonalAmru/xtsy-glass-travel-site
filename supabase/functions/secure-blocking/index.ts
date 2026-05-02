import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";
import { invalidateCache } from '../_shared/cacheHeaders.ts';
import { getCorsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, room_type, date, room_type_id, available_count } = await req.json();
    
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') as string,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string,
      {
        global: {
          headers: { authorization: authHeader }
        }
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has admin role using the has_role RPC
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError || !isAdmin) {
      // Log unauthorized access attempt
      await supabase.from('security_alerts').insert({
        alert_type: 'unauthorized_room_blocking_attempt',
        severity: 'high',
        user_id: user.id,
        details: {
          action,
          room_type: room_type || room_type_id,
          date,
          email: user.email,
          timestamp: new Date().toISOString()
        }
      });

      return new Response(JSON.stringify({ error: 'Admin privileges required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!action) {
      return new Response(JSON.stringify({ error: 'Missing action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'block_date') {
      if (!room_type || !date) {
        return new Response(JSON.stringify({ error: 'room_type and date required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const { data, error } = await supabase
        .from('blocked_dates')
        .insert({ room_type, date, blocked: true })
        .select('id, created_at')
        .single();
      if (error) throw error;
      
      // Invalidate availability cache for this room type
      invalidateCache(`availability:${room_type}`);
      
      // Log successful admin action
      await supabase.from('security_alerts').insert({
        alert_type: 'admin_room_blocking',
        severity: 'low',
        user_id: user.id,
        details: {
          action: 'block_date',
          room_type,
          date,
          email: user.email,
          timestamp: new Date().toISOString()
        }
      });
      
      return new Response(JSON.stringify({ id: data.id, created_at: data.created_at }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'unblock_date') {
      if (!room_type || !date) {
        return new Response(JSON.stringify({ error: 'room_type and date required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('room_type', room_type)
        .eq('date', date);
      if (error) throw error;
      
      // Invalidate availability cache for this room type
      invalidateCache(`availability:${room_type}`);
      
      // Log successful admin action
      await supabase.from('security_alerts').insert({
        alert_type: 'admin_room_blocking',
        severity: 'low',
        user_id: user.id,
        details: {
          action: 'unblock_date',
          room_type,
          date,
          email: user.email,
          timestamp: new Date().toISOString()
        }
      });
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update_inventory') {
      if (!room_type_id || !date || typeof available_count !== 'number') {
        return new Response(JSON.stringify({ error: 'room_type_id, date and available_count required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const { error } = await supabase
        .from('room_inventory')
        .upsert({ room_type_id, date, available_count });
      if (error) throw error;
      
      // Invalidate availability cache for this room type
      invalidateCache(`availability:${room_type_id}`);
      
      // Log successful admin action
      await supabase.from('security_alerts').insert({
        alert_type: 'admin_room_blocking',
        severity: 'low',
        user_id: user.id,
        details: {
          action: 'update_inventory',
          room_type_id,
          date,
          available_count,
          email: user.email,
          timestamp: new Date().toISOString()
        }
      });
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('secure-blocking error', error);
    return new Response(JSON.stringify({ error: 'An internal error occurred. Please try again.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});