import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { requireAdminOrStaff, corsHeaders } from "../_shared/authGuard.ts";

interface RequestBody {
  limit?: number;
  booking_id?: string;
  date_from?: string; // yyyy-mm-dd
  date_to?: string;   // yyyy-mm-dd
}

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
    const { limit = 50, booking_id, date_from, date_to }: RequestBody = await req.json().catch(() => ({}));

    console.log(`Admin ${authCheck.user.email} retrieving bookings with filters:`, { limit, booking_id, date_from, date_to });

    let query = supabase
      .from('bookings')
      .select(`
        id,
        booking_id,
        guest_name,
        email,
        whatsapp_number,
        room_type,
        check_in,
        check_out,
        quantity,
        booking_status,
        payment_status,
        total_amount,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (booking_id) {
      query = query.eq('booking_id', booking_id);
    }

    if (date_from) {
      query = query.gte('created_at', new Date(date_from).toISOString());
    }
    if (date_to) {
      query = query.lte('created_at', new Date(date_to).toISOString());
    }

    const { data, error } = await query;
    if (error) {
      // Log detailed error information for debugging
      console.error('admin-recent-bookings error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      // Return generic error message to client
      return new Response(JSON.stringify({ success: false, error: 'Failed to retrieve bookings. Please try again.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true, bookings: data ?? [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (e: any) {
    // Log detailed error information for debugging
    console.error('admin-recent-bookings exception:', {
      message: e?.message,
      stack: e?.stack,
      name: e?.name
    });
    // Return generic error message to client
    return new Response(JSON.stringify({ success: false, error: 'Unable to process request. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});