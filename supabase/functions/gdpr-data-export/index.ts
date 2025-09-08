import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface DataExportRequest {
  email?: string;
  userId?: string;
}

interface ExportedData {
  user_id: string;
  export_timestamp: string;
  profile: any;
  bookings: any[];
  transactions: any[];
  metadata: {
    export_reason: string;
    retention_period: string;
    data_controller: string;
  };
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

    // Parse request body for admin requests
    let targetUserId = user.id;
    if (req.method === 'POST') {
      const body: DataExportRequest = await req.json();
      
      // Check if user is admin for cross-user exports
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (body.userId && body.userId !== user.id) {
        if (profile?.role !== 'admin') {
          return new Response(
            JSON.stringify({ error: 'Admin privileges required for cross-user exports' }),
            { 
              status: 403, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        targetUserId = body.userId;
      }
    }

    console.log(`Starting GDPR data export for user: ${targetUserId}`);

    // Collect user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    // Collect booking data
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Bookings fetch error:', bookingsError);
    }

    // Collect transaction data (admin only or own data)
    let transactionsData = [];
    if (user.id === targetUserId || (await isAdmin(user.id))) {
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('id, booking_id, amount, currency, payment_status, created_at, txn_id')
        .in('booking_id', (bookingsData || []).map(b => b.id));

      if (transError) {
        console.error('Transactions fetch error:', transError);
      } else {
        transactionsData = transactions || [];
      }
    }

    // Log the export request
    await supabase
      .from('security_alerts')
      .insert({
        alert_type: 'gdpr_data_export',
        severity: 'low',
        details: {
          exported_by: user.id,
          target_user: targetUserId,
          export_timestamp: new Date().toISOString(),
          data_types: ['profile', 'bookings', 'transactions']
        },
        user_id: user.id
      });

    // Prepare export data
    const exportData: ExportedData = {
      user_id: targetUserId,
      export_timestamp: new Date().toISOString(),
      profile: profileData || null,
      bookings: bookingsData || [],
      transactions: transactionsData,
      metadata: {
        export_reason: 'GDPR Article 15 - Right of Access',
        retention_period: 'Data retained according to business requirements and GDPR guidelines',
        data_controller: 'XTSY Tourism Services'
      }
    };

    console.log(`GDPR export completed for user: ${targetUserId}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: exportData,
        export_id: crypto.randomUUID(),
        message: 'Your personal data has been exported successfully'
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="gdpr-export-${targetUserId}-${Date.now()}.json"`
        }
      }
    );

  } catch (error) {
    console.error('GDPR export error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error during data export',
        message: 'Please contact support if this issue persists'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  return data?.role === 'admin';
}