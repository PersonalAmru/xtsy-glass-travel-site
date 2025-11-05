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
    const { type } = await req.json();
    
    console.log('Admin data request:', { type, user: authCheck.user.email });

    let result = {};

    switch (type) {
      case 'room_types':
        const { data: roomTypes, error: roomTypesError } = await supabase
          .from('room_types')
          .select('*')
          .eq('is_active', true)
          .order('name', { ascending: true });

        if (roomTypesError) throw roomTypesError;
        result = { room_types: roomTypes || [] };
        break;

      case 'room_inventory':
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const { data: inventory, error: inventoryError } = await supabase
          .from('room_inventory')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate);

        if (inventoryError) throw inventoryError;
        result = { room_inventory: inventory || [] };
        break;

      case 'blocked_dates':
        const { data: blockedDates, error: blockedError } = await supabase
          .from('blocked_dates')
          .select('*')
          .eq('blocked', true)
          .order('date', { ascending: true });

        if (blockedError) throw blockedError;
        result = { blocked_dates: blockedDates || [] };
        break;

      case 'all':
        // Get all admin data in one request
        const [roomTypesRes, inventoryRes, blockedRes] = await Promise.all([
          supabase
            .from('room_types')
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true }),
          supabase
            .from('room_inventory')
            .select('*')
            .gte('date', new Date().toISOString().split('T')[0])
            .lte('date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
          supabase
            .from('blocked_dates')
            .select('*')
            .eq('blocked', true)
            .order('date', { ascending: true })
        ]);

        if (roomTypesRes.error) throw roomTypesRes.error;
        if (inventoryRes.error) throw inventoryRes.error;
        if (blockedRes.error) throw blockedRes.error;

        result = {
          room_types: roomTypesRes.data || [],
          room_inventory: inventoryRes.data || [],
          blocked_dates: blockedRes.data || []
        };
        break;

      default:
        throw new Error(`Unknown data type: ${type}`);
    }

    console.log('Admin data result:', Object.keys(result));

    return new Response(JSON.stringify({ 
      success: true,
      data: result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    // Log detailed error information for debugging
    console.error('Admin get data error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });
    // Return generic error message to client
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to retrieve data. Please try again.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});