
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, data } = await req.json();
    console.log('Secure payment action:', action);

    switch (action) {
      case 'create_order': {
        const { amount, bookingId, currency = 'INR' } = data;
        
        // Validate input
        if (!amount || amount <= 0) {
          throw new Error('Invalid amount');
        }
        
        if (!bookingId) {
          throw new Error('Booking ID is required');
        }

        // Create Razorpay order with secure API key
        const razorpayKey = Deno.env.get('RAZORPAY_KEY_ID');
        const razorpaySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
        
        if (!razorpayKey || !razorpaySecret) {
          throw new Error('Payment gateway not configured');
        }

        const orderData = {
          amount: Math.round(amount * 100), // Convert to paise
          currency,
          receipt: bookingId,
        };

        const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${razorpayKey}:${razorpaySecret}`)}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!razorpayResponse.ok) {
          throw new Error('Failed to create payment order');
        }

        const order = await razorpayResponse.json();
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            orderId: order.id,
            keyId: razorpayKey,
            amount: order.amount,
            currency: order.currency
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'verify_payment': {
        const { razorpayPaymentId, razorpayOrderId, razorpaySignature, bookingId } = data;
        
        // Verify payment signature
        const razorpaySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
        const crypto = await import("https://deno.land/std@0.177.0/crypto/mod.ts");
        
        const expectedSignature = await crypto.crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(razorpaySecret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        ).then(key => 
          crypto.crypto.subtle.sign(
            "HMAC",
            key,
            new TextEncoder().encode(`${razorpayOrderId}|${razorpayPaymentId}`)
          )
        ).then(signature => 
          Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
        );

        if (expectedSignature !== razorpaySignature) {
          throw new Error('Payment verification failed');
        }

        // Update booking status
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            booking_status: 'confirmed',
            payment_verified_at: new Date().toISOString()
          })
          .eq('booking_id', bookingId);

        if (updateError) {
          throw updateError;
        }

        // Create transaction record
        const { error: txnError } = await supabase
          .from('transactions')
          .insert({
            txn_id: razorpayPaymentId,
            booking_id: bookingId,
            razorpay_payment_id: razorpayPaymentId,
            amount: Math.round(data.amount * 100),
            source: 'razorpay',
            payment_status: 'success',
            matched: true,
            verified_at: new Date().toISOString()
          });

        if (txnError) {
          console.error('Transaction record error:', txnError);
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Payment verified successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Secure payment error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
