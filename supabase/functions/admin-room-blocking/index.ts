import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { requireAdminOrStaff, corsHeaders } from "../_shared/authGuard.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin/staff authentication
    const authCheck = await requireAdminOrStaff(req);
    if (!authCheck.authorized) {
      return authCheck.error!;
    }

    const { supabase } = authCheck;
    const { action, room_type, date, block_count, unblock_count } = await req.json();
    
    console.log('Admin room blocking request:', { action, room_type, date, block_count, unblock_count, user: authCheck.user.email });

    if (!action || !room_type || !date) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters: action, room_type, date' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call the secure database function with the action parameter
    const { data, error } = await supabase.rpc('admin_block_room_date_secure', {
      p_room_type: room_type,
      p_date: date,
      p_block_count: block_count || unblock_count,
      p_action: action
    });

    if (error) {
      // Log detailed error information for debugging
      console.error('Database function error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      // Return generic error message to client
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to update room blocking. Please try again.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Blocking operation result:', data);

    return new Response(JSON.stringify({ 
      success: true,
      ...data
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    // Log detailed error information for debugging
    console.error('Admin room blocking error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    // Return generic error message to client
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to process room blocking request. Please try again.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});