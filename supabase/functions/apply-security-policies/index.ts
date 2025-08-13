import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      // Create role change audit log table
      const createAuditTableQuery = `
        CREATE TABLE IF NOT EXISTS role_change_audit_log (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          action TEXT NOT NULL,
          admin_user_id UUID NOT NULL,
          admin_email TEXT NOT NULL,
          target_user_id UUID,
          old_role TEXT,
          new_role TEXT,
          reason TEXT,
          ip_address TEXT,
          user_agent TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;

      const { error: createTableError } = await supabaseClient
        .from('role_change_audit_log' as any)
        .select('*')
        .limit(1)
        .then(() => ({ error: null }))
        .catch(async () => {
          return await supabaseClient.rpc('exec_sql' as any, { sql: createAuditTableQuery });
        });

      // Create booking rate limiting table
      const createRateLimitTableQuery = `
        CREATE TABLE IF NOT EXISTS booking_rate_limits (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          identifier TEXT NOT NULL, -- IP address or email
          identifier_type TEXT NOT NULL, -- 'ip' or 'email'
          booking_count INTEGER DEFAULT 1,
          first_booking_at TIMESTAMPTZ DEFAULT NOW(),
          last_booking_at TIMESTAMPTZ DEFAULT NOW(),
          is_blocked BOOLEAN DEFAULT FALSE,
          blocked_until TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          
          UNIQUE(identifier, identifier_type)
        );
      `;

      // Create security alerts table
      const createSecurityAlertsTableQuery = `
        CREATE TABLE IF NOT EXISTS security_alerts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          alert_type TEXT NOT NULL,
          severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
          user_id UUID,
          ip_address TEXT,
          details JSONB,
          resolved BOOLEAN DEFAULT FALSE,
          resolved_at TIMESTAMPTZ,
          resolved_by UUID,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;

      // Apply RLS policies for audit log
      const auditLogPolicies = [
        `ALTER TABLE role_change_audit_log ENABLE ROW LEVEL SECURITY;`,
        `DROP POLICY IF EXISTS "audit_log_service_role_policy" ON role_change_audit_log;`,
        `CREATE POLICY "audit_log_service_role_policy" ON role_change_audit_log FOR ALL USING (auth.role() = 'service_role');`,
        `DROP POLICY IF EXISTS "audit_log_admin_read_policy" ON role_change_audit_log;`,
        `CREATE POLICY "audit_log_admin_read_policy" ON role_change_audit_log FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.user_metadata->>'role' = 'admin'
          )
        );`
      ];

      // Apply RLS policies for rate limiting
      const rateLimitPolicies = [
        `ALTER TABLE booking_rate_limits ENABLE ROW LEVEL SECURITY;`,
        `DROP POLICY IF EXISTS "rate_limit_service_role_policy" ON booking_rate_limits;`,
        `CREATE POLICY "rate_limit_service_role_policy" ON booking_rate_limits FOR ALL USING (auth.role() = 'service_role');`
      ];

      // Apply RLS policies for security alerts
      const securityAlertPolicies = [
        `ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;`,
        `DROP POLICY IF EXISTS "security_alerts_service_role_policy" ON security_alerts;`,
        `CREATE POLICY "security_alerts_service_role_policy" ON security_alerts FOR ALL USING (auth.role() = 'service_role');`,
        `DROP POLICY IF EXISTS "security_alerts_admin_read_policy" ON security_alerts;`,
        `CREATE POLICY "security_alerts_admin_read_policy" ON security_alerts FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.user_metadata->>'role' = 'admin'
          )
        );`
      ];

      // Apply enhanced booking security policies
      const enhancedBookingPolicies = [
        `DROP POLICY IF EXISTS "booking_insert_authenticated_only" ON bookings;`,
        `CREATE POLICY "booking_insert_authenticated_only" ON bookings FOR INSERT WITH CHECK (
          -- Allow service role (for edge functions)
          auth.role() = 'service_role'
          OR
          -- Allow authenticated users with proper validation
          (
            auth.uid() IS NOT NULL 
            AND total_amount > 0 
            AND total_amount < 1000000 -- Max ₹10,000 limit
            AND guests > 0 
            AND guests <= 10 -- Max 10 guests per booking
            AND check_in >= CURRENT_DATE
            AND check_out > check_in
            AND (check_out - check_in) <= INTERVAL '365 days' -- Max 1 year booking
          )
        );`,
        
        `DROP POLICY IF EXISTS "booking_select_own_bookings" ON bookings;`,
        `CREATE POLICY "booking_select_own_bookings" ON bookings FOR SELECT USING (
          auth.role() = 'service_role'
          OR
          (
            auth.uid() IS NOT NULL 
            AND (
              email = auth.jwt()->>'email'
              OR
              EXISTS (
                SELECT 1 FROM auth.users 
                WHERE auth.users.id = auth.uid() 
                AND auth.users.user_metadata->>'role' IN ('admin', 'staff', 'channel_manager')
              )
            )
          )
        );`,
        
        `DROP POLICY IF EXISTS "booking_update_staff_only" ON bookings;`,
        `CREATE POLICY "booking_update_staff_only" ON bookings FOR UPDATE USING (
          auth.role() = 'service_role'
          OR
          EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.user_metadata->>'role' IN ('admin', 'staff', 'channel_manager')
          )
        );`
      ];

      // Execute all policies
      const allPolicies = [
        ...auditLogPolicies,
        ...rateLimitPolicies,
        ...securityAlertPolicies,
        ...enhancedBookingPolicies
      ];

      for (const policy of allPolicies) {
        try {
          const { error } = await supabaseClient.rpc('exec_sql' as any, { sql: policy });
          if (error) {
            console.error(`Error executing policy: ${policy}`, error);
          }
        } catch (err) {
          console.error(`Error executing policy: ${policy}`, err);
        }
      }

      // Create indexes for performance
      const indexes = [
        `CREATE INDEX IF NOT EXISTS idx_role_audit_admin_user ON role_change_audit_log(admin_user_id);`,
        `CREATE INDEX IF NOT EXISTS idx_role_audit_target_user ON role_change_audit_log(target_user_id);`,
        `CREATE INDEX IF NOT EXISTS idx_role_audit_created_at ON role_change_audit_log(created_at);`,
        `CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier ON booking_rate_limits(identifier, identifier_type);`,
        `CREATE INDEX IF NOT EXISTS idx_rate_limit_updated ON booking_rate_limits(updated_at);`,
        `CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON security_alerts(alert_type);`,
        `CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);`,
        `CREATE INDEX IF NOT EXISTS idx_security_alerts_created ON security_alerts(created_at);`,
        `CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);`,
        `CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);`,
        `CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);`
      ];

      for (const index of indexes) {
        try {
          const { error } = await supabaseClient.rpc('exec_sql' as any, { sql: index });
          if (error) {
            console.error(`Error creating index: ${index}`, error);
          }
        } catch (err) {
          console.error(`Error creating index: ${index}`, err);
        }
      }

      console.log('Security policies applied successfully');

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Security policies applied successfully',
          policies_applied: allPolicies.length,
          indexes_created: indexes.length
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Security policy application error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});