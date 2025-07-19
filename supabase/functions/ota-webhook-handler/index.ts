
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  source: string;
  event_type: string;
  data: any;
  timestamp: string;
  signature?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const payload: WebhookPayload = await req.json();
    
    console.log('Received webhook:', payload.source, payload.event_type);

    // Store webhook event for processing
    const { data: webhookEvent, error: webhookError } = await supabase
      .from('webhook_events')
      .insert({
        source: payload.source,
        event_type: payload.event_type,
        payload: payload.data,
        processed: false,
        processing_attempts: 0
      })
      .select()
      .single();

    if (webhookError) {
      console.error('Error storing webhook:', webhookError);
      throw webhookError;
    }

    // Process different webhook types
    switch (payload.source.toLowerCase()) {
      case 'booking.com':
        await processBookingComWebhook(supabase, payload);
        break;
      case 'expedia':
        await processExpediaWebhook(supabase, payload);
        break;
      case 'hostelworld':
        await processHostelworldWebhook(supabase, payload);
        break;
      case 'makemytrip':
        await processMakeMyTripWebhook(supabase, payload);
        break;
      default:
        console.log('Unknown webhook source:', payload.source);
    }

    // Mark webhook as processed
    await supabase
      .from('webhook_events')
      .update({ 
        processed: true, 
        processed_at: new Date().toISOString() 
      })
      .eq('id', webhookEvent.id);

    return new Response(JSON.stringify({ status: 'processed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ 
      error: 'Webhook processing failed',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processBookingComWebhook(supabase: any, payload: WebhookPayload) {
  console.log('Processing Booking.com webhook:', payload.event_type);
  
  switch (payload.event_type) {
    case 'reservation':
      await createBookingFromOTA(supabase, payload.data, 'Booking.com');
      break;
    case 'cancellation':
      await cancelBookingFromOTA(supabase, payload.data, 'Booking.com');
      break;
    case 'modification':
      await modifyBookingFromOTA(supabase, payload.data, 'Booking.com');
      break;
  }
}

async function processExpediaWebhook(supabase: any, payload: WebhookPayload) {
  console.log('Processing Expedia webhook:', payload.event_type);
  // Similar processing logic for Expedia
}

async function processHostelworldWebhook(supabase: any, payload: WebhookPayload) {
  console.log('Processing Hostelworld webhook:', payload.event_type);
  // Similar processing logic for Hostelworld
}

async function processMakeMyTripWebhook(supabase: any, payload: WebhookPayload) {
  console.log('Processing MakeMyTrip webhook:', payload.event_type);
  // Similar processing logic for MakeMyTrip
}

async function createBookingFromOTA(supabase: any, bookingData: any, otaSource: string) {
  try {
    // Map OTA booking data to our booking format
    const mappedBooking = {
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      nights: calculateNights(bookingData.check_in, bookingData.check_out),
      guests: bookingData.guests || 1,
      guest_name: bookingData.guest_name,
      email: bookingData.email,
      whatsapp_number: bookingData.phone || '',
      room_details: mapOTARoomDetails(bookingData.rooms, otaSource),
      subtotal: bookingData.total_amount * 100, // Convert to paise
      gst_amount: Math.round(bookingData.total_amount * 0.12 * 100),
      total_amount: Math.round(bookingData.total_amount * 1.12 * 100),
      booking_status: 'confirmed',
      payment_method: 'ota',
      ota_booking_id: bookingData.booking_id,
      ota_source: otaSource
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert(mappedBooking)
      .select()
      .single();

    if (error) throw error;

    console.log('OTA booking created:', data.booking_id);
    
    // Log audit trail
    await supabase.from('audit_logs').insert({
      table_name: 'bookings',
      record_id: data.id,
      action: 'INSERT',
      new_values: mappedBooking,
      user_agent: `OTA-Webhook-${otaSource}`
    });

  } catch (error) {
    console.error('Error creating OTA booking:', error);
    throw error;
  }
}

async function cancelBookingFromOTA(supabase: any, cancellationData: any, otaSource: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        booking_status: 'cancelled',
        cancellation_reason: `Cancelled via ${otaSource}`,
        cancelled_at: new Date().toISOString()
      })
      .eq('ota_booking_id', cancellationData.booking_id)
      .select()
      .single();

    if (error) throw error;

    console.log('OTA booking cancelled:', data.booking_id);

  } catch (error) {
    console.error('Error cancelling OTA booking:', error);
    throw error;
  }
}

async function modifyBookingFromOTA(supabase: any, modificationData: any, otaSource: string) {
  // Handle booking modifications from OTAs
  console.log('Booking modification received from', otaSource);
}

function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
}

function mapOTARoomDetails(otaRooms: any[], otaSource: string): any[] {
  // Map OTA room structure to our internal format
  return otaRooms.map(room => ({
    room_type_name: room.room_type,
    quantity: room.quantity || 1,
    rate: room.rate * 100, // Convert to paise
    ota_room_id: room.id,
    ota_source: otaSource
  }));
}
