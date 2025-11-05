
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify admin role using user_roles table
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !userRole) {
      console.error('Authorization failed - admin role required');
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { action, data } = await req.json();
    console.log('Inventory sync request:', action);

    switch (action) {
      case 'sync_all_otas':
        await syncAllOTAs(supabase);
        break;
      case 'sync_specific_ota':
        await syncSpecificOTA(supabase, data.ota_name);
        break;
      case 'update_rates':
        await updateRates(supabase, data);
        break;
      case 'update_availability':
        await updateAvailability(supabase, data);
        break;
      default:
        throw new Error('Invalid sync action');
    }

    return new Response(JSON.stringify({ status: 'sync_completed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Inventory sync error:', error);
    return new Response(JSON.stringify({ 
      error: 'Sync failed',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncAllOTAs(supabase: any) {
  // Get all active OTA integrations
  const { data: otas, error } = await supabase
    .from('ota_integrations')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;

  for (const ota of otas || []) {
    try {
      await syncSpecificOTA(supabase, ota.ota_name);
      
      // Update last sync timestamp
      await supabase
        .from('ota_integrations')
        .update({ last_sync: new Date().toISOString() })
        .eq('id', ota.id);

    } catch (error) {
      console.error(`Failed to sync ${ota.ota_name}:`, error);
    }
  }
}

async function syncSpecificOTA(supabase: any, otaName: string) {
  console.log(`Syncing inventory with ${otaName}`);

  // Get OTA configuration
  const { data: ota, error: otaError } = await supabase
    .from('ota_integrations')
    .select('*')
    .eq('ota_name', otaName)
    .eq('is_active', true)
    .single();

  if (otaError || !ota) {
    throw new Error(`OTA ${otaName} not found or inactive`);
  }

  // Get current inventory
  const { data: inventory, error: inventoryError } = await supabase
    .from('inventory')
    .select(`
      *,
      room_types (
        id,
        name,
        description,
        capacity,
        base_price
      )
    `)
    .gte('date', new Date().toISOString().split('T')[0])
    .lte('date', getDateAfterDays(90)); // Next 90 days

  if (inventoryError) throw inventoryError;

  // Sync based on OTA type
  switch (otaName.toLowerCase()) {
    case 'booking.com':
      await syncBookingCom(ota, inventory);
      break;
    case 'expedia':
      await syncExpedia(ota, inventory);
      break;
    case 'hostelworld':
      await syncHostelworld(ota, inventory);
      break;
    case 'makemytrip':
      await syncMakeMyTrip(ota, inventory);
      break;
  }
}

async function syncBookingCom(ota: any, inventory: any[]) {
  const bookingComAPI = `${ota.endpoint_url}/rate-and-availability`;
  
  for (const item of inventory) {
    if (item.stop_sale) continue;

    const payload = {
      hotel_id: ota.mapping_config.hotel_id,
      room_id: ota.mapping_config.room_mappings[item.room_type_id],
      date: item.date,
      rate: item.rate / 100, // Convert from paise to rupees
      availability: item.available_units,
      restrictions: {
        closed_to_arrival: false,
        closed_to_departure: false,
        minimum_stay: 1
      }
    };

    try {
      const response = await fetch(bookingComAPI, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ota.api_key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error(`Booking.com sync failed for ${item.date}:`, await response.text());
      }
    } catch (error) {
      console.error(`Booking.com API error:`, error);
    }
  }
}

async function syncExpedia(ota: any, inventory: any[]) {
  // Implement Expedia EQC API sync
  console.log('Syncing with Expedia EQC API');
}

async function syncHostelworld(ota: any, inventory: any[]) {
  // Implement Hostelworld API sync
  console.log('Syncing with Hostelworld API');
}

async function syncMakeMyTrip(ota: any, inventory: any[]) {
  // Implement MakeMyTrip API sync
  console.log('Syncing with MakeMyTrip API');
}

async function updateRates(supabase: any, data: any) {
  const { room_type_id, date_range, new_rate } = data;

  // Update rates in inventory table
  const { error } = await supabase
    .from('inventory')
    .update({ rate: new_rate * 100 }) // Convert to paise
    .eq('room_type_id', room_type_id)
    .gte('date', date_range.start)
    .lte('date', date_range.end);

  if (error) throw error;

  // Trigger OTA sync
  await syncAllOTAs(supabase);
}

async function updateAvailability(supabase: any, data: any) {
  const { room_type_id, date, available_units } = data;

  // Update availability in inventory table
  const { error } = await supabase
    .from('inventory')
    .update({ available_units })
    .eq('room_type_id', room_type_id)
    .eq('date', date);

  if (error) throw error;

  // Trigger OTA sync
  await syncAllOTAs(supabase);
}

function getDateAfterDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}
