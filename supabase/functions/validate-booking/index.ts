import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { getCorsHeaders } from '../_shared/cors.ts'
import { createOptimizedClient } from '../_shared/supabaseClient.ts'
import { checkRateLimit, getClientIp, getRateLimitHeaders } from '../_shared/rateLimiter.ts'
import { getCacheHeaders } from '../_shared/cacheHeaders.ts'
import { PerformanceMonitor } from '../_shared/performanceMonitor.ts'

// Room selection schema with strict validation to prevent injection
const roomSelectionSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9_-]+$/).min(1).max(100),
  name: z.string().regex(/^[a-zA-Z0-9\s_-]+$/).min(1).max(100),
  price: z.number().int().positive(),
  type: z.enum(['dorm', 'private']),
  selection: z.object({
    guests: z.number().int().min(1).max(50),
    rooms: z.number().int().min(0).max(10)
  })
});

// Booking validation schema
const bookingValidationSchema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1).max(50),
  nights: z.number().int().min(1),
  selectedRooms: z.array(roomSelectionSchema).min(1),
  totalAmount: z.number().int().min(100)
});

serve(async (req) => {
  const monitor = new PerformanceMonitor('validate-booking');
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createOptimizedClient({ useServiceRole: true });
    
    // Rate limiting
    const clientIp = getClientIp(req);
    const rateLimitResult = await checkRateLimit(supabase, clientIp, 'validate-booking');
    
    if (!rateLimitResult.allowed) {
      monitor.complete(429);
      return new Response(
        JSON.stringify({ error: 'Please wait a moment before trying again.' }),
        { 
          status: 429,
          headers: { 
            ...corsHeaders,
            ...getCacheHeaders('validate-booking'),
            ...getRateLimitHeaders(rateLimitResult),
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const requestBody = await req.json();
    
    // Validate request structure
    const validationResult = bookingValidationSchema.safeParse(requestBody);
    if (!validationResult.success) {
      // Generic error - don't expose validation schema details
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid booking data. Please refresh and try again.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { checkIn, checkOut, selectedRooms, nights } = validationResult.data;

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please select a future check-in date.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (checkOutDate <= checkInDate) {
      return new Response(
        JSON.stringify({ success: false, error: 'Check-out must be after check-in.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // CRITICAL SECURITY: Re-calculate prices server-side
    const priceValidationResults = [];
    let serverCalculatedTotal = 0;

    for (const room of selectedRooms) {
      // Fetch actual room pricing from database - using parameterized query to prevent SQL injection
      const { data: roomType, error: roomError } = await supabase
        .from('room_types')
        .select('id, name, base_price')
        .eq('id', room.id)
        .single();

      if (roomError || !roomType) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Selected room is unavailable. Please refresh and try again.' 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const actualPrice = roomType.base_price;
      const roomQuantity = room.type === 'dorm' ? room.selection.guests : room.selection.rooms;
      const roomTotal = actualPrice * roomQuantity * nights;

      // SECURITY CHECK: Verify client-submitted price matches server price
      if (room.price !== actualPrice) {
        // Server-side logging only
        console.warn('[Booking Validation] Price verification failed - code: PV001');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Pricing has been updated. Please refresh and try again.'
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      serverCalculatedTotal += roomTotal;
      priceValidationResults.push({
        room_name: room.name,
        quantity: roomQuantity,
        price_per_unit: actualPrice,
        total: roomTotal
      });
    }

    // Calculate GST (12%)
    const gstAmount = Math.round(serverCalculatedTotal * 0.12);
    const totalWithGst = serverCalculatedTotal + gstAmount;

    // Server-side logging only - no sensitive details
    console.log('[Booking Validation] Completed successfully');

    monitor.complete(200);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        validation: {
          subtotal: serverCalculatedTotal,
          gst_amount: gstAmount,
          total_amount: totalWithGst,
          rooms: priceValidationResults
        }
      }),
      { headers: { 
        ...corsHeaders,
        ...getCacheHeaders('validate-booking'),
        ...getRateLimitHeaders(rateLimitResult),
        'Content-Type': 'application/json' 
      } }
    );

  } catch (error) {
    // Server-side error logging only
    console.error('[Booking Validation] Error - code: BV001');
    monitor.complete(500, { error: 'Processing error' });
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Unable to validate booking. Please try again or contact support.' 
      }),
      { status: 500, headers: { 
        ...corsHeaders,
        ...getCacheHeaders('validate-booking'),
        'Content-Type': 'application/json' 
      } }
    );
  }
});