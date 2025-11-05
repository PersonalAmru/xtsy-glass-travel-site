import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface DataDeletionRequest {
  confirmDeletion: boolean;
  reason?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user from JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (req.method === 'GET') {
      // Return deletion preview - what data would be affected
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, booking_id, booking_status, check_in, check_out')
        .eq('user_id', user.id);

      const activeBookings = (bookings || []).filter(b => 
        b.booking_status === 'confirmed' && new Date(b.check_out) >= new Date()
      );

      return new Response(
        JSON.stringify({
          user_id: user.id,
          can_delete: activeBookings.length === 0,
          active_bookings: activeBookings.length,
          total_bookings: (bookings || []).length,
          message: activeBookings.length > 0 
            ? 'Cannot delete account with active bookings. Please contact support.'
            : 'Account can be deleted. All personal data will be anonymized.',
          warning: 'This action cannot be undone. All your personal data will be permanently anonymized.'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (req.method === 'POST') {
      const body: DataDeletionRequest = await req.json();

      if (!body.confirmDeletion) {
        return new Response(
          JSON.stringify({ error: 'Deletion confirmation required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`Starting GDPR data deletion for user: ${user.id}`);

      // Check for active bookings
      const { data: activeBookings } = await supabase
        .from('bookings')
        .select('id, booking_status, check_out')
        .eq('user_id', user.id)
        .in('booking_status', ['confirmed', 'pending'])
        .gte('check_out', new Date().toISOString().split('T')[0]);

      if (activeBookings && activeBookings.length > 0) {
        return new Response(
          JSON.stringify({
            error: 'Cannot delete account with active bookings',
            active_bookings: activeBookings.length,
            message: 'Please complete or cancel all active bookings before requesting deletion'
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Log the deletion request before processing
      await supabase
        .from('security_alerts')
        .insert({
          alert_type: 'gdpr_data_deletion',
          severity: 'medium',
          details: {
            user_id: user.id,
            deletion_timestamp: new Date().toISOString(),
            reason: body.reason || 'User requested GDPR deletion',
            ip_address: req.headers.get('x-forwarded-for') || 'unknown'
          },
          user_id: user.id
        });

      // Execute the anonymization process
      try {
        // Anonymize completed bookings (preserve for business records)
        const { error: bookingError } = await supabase
          .from('bookings')
          .update({
            email: 'deleted@privacy.local',
            whatsapp_number: 'DELETED',
            guest_name: 'DELETED USER',
            address: null,
            city: null,
            state: null,
            pincode: null,
            emergency_contact: null,
            special_requests: 'USER DATA DELETED FOR PRIVACY'
          })
          .eq('user_id', user.id);

        if (bookingError) {
          console.error('Booking anonymization error:', bookingError);
          throw bookingError;
        }

        // Delete user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id);

        if (profileError) {
          console.error('Profile deletion error:', profileError);
          throw profileError;
        }

        // Delete the user from auth (this will cascade)
        const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id);
        
        if (authDeleteError) {
          console.error('Auth user deletion error:', authDeleteError);
          // Don't throw here as profile and booking data is already anonymized
        }

        console.log(`GDPR deletion completed for user: ${user.id}`);

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Your account and personal data have been successfully anonymized',
            deletion_id: crypto.randomUUID(),
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );

      } catch (error) {
        console.error('Deletion process error:', error);
        
        // Log the failure
        await supabase
          .from('security_alerts')
          .insert({
            alert_type: 'gdpr_deletion_failure',
            severity: 'high',
            details: {
              user_id: user.id,
              error_type: 'deletion_error',
              timestamp: new Date().toISOString()
            },
            user_id: user.id
          });

        return new Response(
          JSON.stringify({
            error: 'Deletion process failed',
            message: 'Please contact support for assistance',
            support_reference: crypto.randomUUID()
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('GDPR deletion handler error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'Please contact support if this issue persists'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});