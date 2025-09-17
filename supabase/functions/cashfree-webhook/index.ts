import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to verify Cashfree webhook signature
async function verifyCashfreeSignature(
  rawBody: string,
  signature: string,
  timestamp: string,
  secretKey: string
): Promise<boolean> {
  try {
    const signatureData = timestamp + rawBody
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(signatureData))
    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    return signature === expectedSignatureHex
  } catch (error) {
    console.error('Error verifying signature:', error)
    return false
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const rawBody = await req.text()
    const webhookData = JSON.parse(rawBody)
    
    console.log('Received Cashfree webhook:', webhookData)

    // Get webhook verification settings
    const shouldVerifySignature = Deno.env.get('WEBHOOK_VERIFY_SIGNING') === 'true'
    const cashfreeSecretKey = Deno.env.get('CASHFREE_SECRET_KEY')

    // Verify webhook signature if enabled
    if (shouldVerifySignature && cashfreeSecretKey) {
      const signature = req.headers.get('x-webhook-signature')
      const timestamp = req.headers.get('x-webhook-timestamp')
      
      if (!signature || !timestamp) {
        console.error('Missing signature or timestamp headers')
        return new Response('Unauthorized', { status: 401 })
      }

      const isValidSignature = await verifyCashfreeSignature(
        rawBody,
        signature,
        timestamp,
        cashfreeSecretKey
      )

      if (!isValidSignature) {
        console.error('Invalid webhook signature')
        return new Response('Unauthorized', { status: 401 })
      }
    }

    // Extract order and payment details
    const { 
      type: eventType, 
      data: eventData 
    } = webhookData

    // Handle different event types
    if (eventType === 'PAYMENT_SUCCESS' || eventType === 'ORDER_PAID') {
      const { 
        order_id,
        cf_payment_id,
        payment_status,
        payment_amount,
        payment_currency = 'INR'
      } = eventData

      if (!order_id) {
        console.error('Missing order_id in webhook data')
        return new Response('Bad Request', { status: 400 })
      }

      // Get pending order details
      const { data: pendingOrder, error: orderError } = await supabaseClient
        .from('pending_orders')
        .select('*')
        .eq('order_id', order_id)
        .single()

      if (orderError || !pendingOrder) {
        console.error('Pending order not found:', order_id, orderError)
        return new Response('Order not found', { status: 404 })
      }

      console.log('Processing successful payment for order:', pendingOrder)

      // Create booking record - this will trigger inventory decrement via trigger
      const { data: booking, error: bookingError } = await supabaseClient
        .from('bookings')
        .insert({
          room_type_id: pendingOrder.room_type_id,
          check_in: pendingOrder.check_in,
          check_out: pendingOrder.check_out,
          quantity: pendingOrder.quantity,
          guest_name: pendingOrder.customer_name || 'Guest',
          email: pendingOrder.customer_email,
          whatsapp_number: pendingOrder.customer_phone || '9999999999',
          guests: pendingOrder.quantity,
          total_amount: pendingOrder.amount,
          subtotal: Math.round(pendingOrder.amount * 0.88), // Assuming 12% tax
          taxes: Math.round(pendingOrder.amount * 0.12),
          booking_status: 'confirmed',
          payment_status: 'paid',
          source: 'cashfree_online'
        })
        .select()
        .single()

      if (bookingError) {
        console.error('Error creating booking:', bookingError)
        
        // If it's an inventory error, return specific message
        if (bookingError.message?.includes('Insufficient inventory')) {
          return new Response(
            JSON.stringify({ 
              error: 'Room no longer available',
              message: 'The room was booked by another customer. Refund will be processed.'
            }),
            { 
              status: 409,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        return new Response(
          JSON.stringify({ error: 'Failed to create booking' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Create transaction record
      const { error: transactionError } = await supabaseClient
        .from('transactions')
        .insert({
          booking_id: booking.id,
          amount: pendingOrder.amount,
          currency: payment_currency,
          payment_status: 'completed',
          razorpay_payment_id: cf_payment_id, // Store Cashfree payment ID here
          txn_id: cf_payment_id,
          source: 'cashfree',
          gateway_response: eventData,
          verified_at: new Date().toISOString()
        })

      if (transactionError) {
        console.error('Error creating transaction record:', transactionError)
      }

      // Remove pending order
      const { error: deleteError } = await supabaseClient
        .from('pending_orders')
        .delete()
        .eq('order_id', order_id)

      if (deleteError) {
        console.error('Error deleting pending order:', deleteError)
      }

      console.log('Successfully processed payment and created booking:', booking.id)

      return new Response(
        JSON.stringify({ 
          status: 'success', 
          booking_id: booking.id,
          message: 'Payment processed and booking confirmed'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Handle failed payments
    if (eventType === 'PAYMENT_FAILED' || eventType === 'ORDER_FAILED') {
      const { order_id } = eventData

      if (order_id) {
        // Clean up pending order on failure
        const { error: deleteError } = await supabaseClient
          .from('pending_orders')
          .delete()
          .eq('order_id', order_id)

        if (deleteError) {
          console.error('Error deleting failed pending order:', deleteError)
        }

        console.log('Payment failed for order:', order_id)
      }

      return new Response(
        JSON.stringify({ status: 'failed', message: 'Payment failed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // For other event types, just acknowledge
    console.log('Received unhandled webhook event:', eventType)
    return new Response(
      JSON.stringify({ status: 'acknowledged' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in cashfree-webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})