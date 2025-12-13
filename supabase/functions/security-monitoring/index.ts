import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { getCorsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // CRITICAL SECURITY: Verify user is authenticated and is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin using proper role check
    const { data: roleCheck, error: roleError } = await supabase
      .rpc('has_role', { 
        _user_id: user.id, 
        _role: 'admin' 
      });

    if (roleError || !roleCheck) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, email, timeWindow } = await req.json();

    console.log('Security monitoring request:', { action, email, timeWindow });

    switch (action) {
      case 'check_suspicious_activity':
        const { data: suspiciousData, error: suspiciousError } = await supabase
          .rpc('check_suspicious_booking_activity', {
            email_param: email,
            time_window_hours: timeWindow || 24
          });

        if (suspiciousError) {
          console.error('Error checking suspicious activity:', suspiciousError);
          throw suspiciousError;
        }

        console.log('Suspicious activity check result:', suspiciousData);
        
        return new Response(
          JSON.stringify({
            success: true,
            data: suspiciousData[0] || {
              suspicious_indicators: [],
              risk_score: 0,
              recent_bookings_count: 0
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );

      case 'get_audit_logs':
        const { data: auditLogs, error: auditError } = await supabase
          .from('booking_audit_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (auditError) {
          console.error('Error fetching audit logs:', auditError);
          throw auditError;
        }

        return new Response(
          JSON.stringify({
            success: true,
            data: auditLogs
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );

      case 'get_security_metrics':
        // Get recent booking statistics
        const { data: recentBookings, error: bookingError } = await supabase
          .from('bookings')
          .select('created_at, email, total_amount, booking_status')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        if (bookingError) {
          console.error('Error fetching recent bookings:', bookingError);
          throw bookingError;
        }

        // Get security alerts
        const { data: securityAlerts, error: alertsError } = await supabase
          .from('security_alerts')
          .select('severity, alert_type, created_at')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        if (alertsError) {
          console.error('Error fetching security alerts:', alertsError);
          throw alertsError;
        }

        // Calculate enhanced security metrics
        const totalBookings = recentBookings?.length || 0;
        const uniqueEmails = new Set(recentBookings?.map(b => b.email) || []).size;
        const highValueBookings = recentBookings?.filter(b => b.total_amount > 50000).length || 0;
        
        // Count alerts by severity
        const alertCounts = securityAlerts?.reduce((acc: any, alert: any) => {
          acc[alert.severity] = (acc[alert.severity] || 0) + 1;
          return acc;
        }, {}) || {};

        // Determine overall alert level
        const alertLevel = alertCounts.critical > 0 ? 'critical' : 
                          alertCounts.high > 0 ? 'high' :
                          alertCounts.medium > 0 ? 'medium' : 'low';

        const securityMetrics = {
          total_bookings_24h: totalBookings,
          unique_users_24h: uniqueEmails,
          high_value_bookings_24h: highValueBookings,
          alert_level: alertLevel,
          alert_counts: alertCounts,
          total_alerts_24h: securityAlerts?.length || 0
        };

        console.log('Enhanced security metrics calculated:', securityMetrics);

        return new Response(
          JSON.stringify({
            success: true,
            data: securityMetrics
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );

      case 'get_security_alerts':
        const { data: alerts, error: alertsError } = await supabase
          .from('security_alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(timeWindow || 50);

        if (alertsError) {
          console.error('Error fetching security alerts:', alertsError);
          throw alertsError;
        }

        return new Response(
          JSON.stringify({
            success: true,
            data: alerts
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );

      case 'cleanup_rate_limits':
        const { error: cleanupError } = await supabase.rpc('cleanup_rate_limits');
        
        if (cleanupError) {
          console.error('Error cleaning up rate limits:', cleanupError);
          throw cleanupError;
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Rate limits cleaned up successfully'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Invalid action'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
    }

  } catch (error) {
    console.error('Security monitoring error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Security monitoring operation failed. Please try again or contact support.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
})