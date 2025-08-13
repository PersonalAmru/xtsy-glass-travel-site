import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoleUpdateRequest {
  userId: string;
  newRole: string;
  adminEmail: string;
  reason?: string;
}

interface AuditLogEntry {
  action: string;
  admin_user_id: string;
  admin_email: string;
  target_user_id: string;
  old_role: string;
  new_role: string;
  reason?: string;
  ip_address?: string;
  user_agent?: string;
}

const VALID_ROLES = ['guest', 'staff', 'channel_manager', 'admin'];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the Authorization header to verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the JWT and get user info
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if the requesting user is an admin
    const adminRole = user.user_metadata?.role;
    if (adminRole !== 'admin') {
      console.log(`Unauthorized role update attempt by user ${user.id} with role ${adminRole}`);
      
      // Log the unauthorized attempt
      await supabaseClient
        .from('role_change_audit_log')
        .insert({
          action: 'unauthorized_attempt',
          admin_user_id: user.id,
          admin_email: user.email || '',
          target_user_id: '',
          old_role: '',
          new_role: '',
          reason: 'Unauthorized role update attempt',
          ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
          user_agent: req.headers.get('user-agent') || '',
          created_at: new Date().toISOString()
        });

      return new Response(
        JSON.stringify({ error: 'Insufficient permissions. Admin role required.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'POST') {
      const { action, data } = await req.json();

      switch (action) {
        case 'update_role': {
          const { userId, newRole, adminEmail, reason }: RoleUpdateRequest = data;

          // Validate input
          if (!userId || !newRole || !adminEmail) {
            return new Response(
              JSON.stringify({ error: 'Missing required fields: userId, newRole, adminEmail' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Validate role
          if (!VALID_ROLES.includes(newRole)) {
            return new Response(
              JSON.stringify({ error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Prevent self-role modification
          if (userId === user.id) {
            return new Response(
              JSON.stringify({ error: 'Cannot modify your own role' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Get current user role before update
          const { data: targetUser, error: fetchError } = await supabaseClient.auth.admin.getUserById(userId);
          
          if (fetchError || !targetUser.user) {
            return new Response(
              JSON.stringify({ error: 'Target user not found' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          const oldRole = targetUser.user.user_metadata?.role || 'guest';

          // Update user metadata with new role
          const { error: updateError } = await supabaseClient.auth.admin.updateUserById(userId, {
            user_metadata: {
              ...targetUser.user.user_metadata,
              role: newRole,
              role_updated_by: user.id,
              role_updated_at: new Date().toISOString()
            }
          });

          if (updateError) {
            console.error('Role update error:', updateError);
            return new Response(
              JSON.stringify({ error: 'Failed to update user role', details: updateError.message }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Create audit log entry
          const auditEntry: AuditLogEntry = {
            action: 'role_update',
            admin_user_id: user.id,
            admin_email: user.email || '',
            target_user_id: userId,
            old_role: oldRole,
            new_role: newRole,
            reason: reason || 'No reason provided',
            ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
            user_agent: req.headers.get('user-agent') || ''
          };

          const { error: auditError } = await supabaseClient
            .from('role_change_audit_log')
            .insert({
              ...auditEntry,
              created_at: new Date().toISOString()
            });

          if (auditError) {
            console.error('Audit log error:', auditError);
            // Don't fail the operation, just log the error
          }

          console.log(`Role updated: User ${userId} from ${oldRole} to ${newRole} by admin ${user.id}`);

          return new Response(
            JSON.stringify({
              success: true,
              message: 'Role updated successfully',
              audit: {
                old_role: oldRole,
                new_role: newRole,
                updated_by: user.email,
                updated_at: new Date().toISOString()
              }
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        case 'get_audit_log': {
          const { limit = 50, offset = 0 } = data || {};

          const { data: auditLog, error: auditError } = await supabaseClient
            .from('role_change_audit_log')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

          if (auditError) {
            console.error('Audit log fetch error:', auditError);
            return new Response(
              JSON.stringify({ error: 'Failed to fetch audit log' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify({ success: true, audit_log: auditLog }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        default:
          return new Response(
            JSON.stringify({ error: 'Invalid action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Secure role management function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});