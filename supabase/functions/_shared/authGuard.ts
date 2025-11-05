import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export interface AuthCheckResult {
  authorized: boolean;
  user?: any;
  supabase?: any;
  error?: Response;
}

/**
 * Verifies JWT token and checks if user has required role (admin or staff)
 * Returns authorized: true if user is authenticated and has proper role
 * Returns error Response if authentication/authorization fails
 */
export async function requireAdminOrStaff(req: Request): Promise<AuthCheckResult> {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader) {
    return {
      authorized: false,
      error: new Response(
        JSON.stringify({ error: 'Unauthorized - Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  const token = authHeader.replace('Bearer ', '');
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Verify token and get user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    console.error('Authentication error:', { error: authError?.message });
    return {
      authorized: false,
      error: new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  // Check if user has admin or staff role
  const { data: hasAdminRole, error: roleError } = await supabase
    .rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

  const { data: hasStaffRole, error: staffRoleError } = await supabase
    .rpc('has_role', {
      _user_id: user.id,
      _role: 'staff'
    });

  if (roleError || staffRoleError) {
    console.error('Role check error:', { roleError, staffRoleError });
    return {
      authorized: false,
      error: new Response(
        JSON.stringify({ error: 'Authorization check failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  if (!hasAdminRole && !hasStaffRole) {
    // Log unauthorized access attempt
    await supabase.from('security_alerts').insert({
      alert_type: 'unauthorized_admin_access_attempt',
      severity: 'high',
      details: {
        user_id: user.id,
        email: user.email,
        attempted_at: new Date().toISOString(),
        endpoint: req.url
      },
      user_id: user.id
    });

    return {
      authorized: false,
      error: new Response(
        JSON.stringify({ error: 'Forbidden - Admin or staff access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  // Log successful admin access for audit trail
  await supabase.from('security_alerts').insert({
    alert_type: 'admin_function_access',
    severity: 'low',
    details: {
      user_id: user.id,
      email: user.email,
      role: hasAdminRole ? 'admin' : 'staff',
      accessed_at: new Date().toISOString(),
      endpoint: req.url
    },
    user_id: user.id
  });

  return {
    authorized: true,
    user,
    supabase
  };
}

export { corsHeaders };
