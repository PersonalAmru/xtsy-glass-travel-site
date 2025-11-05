
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Read raw body for signature verification
    const rawBody = await req.text();
    let body: any;
    try {
      body = JSON.parse(rawBody || '{}');
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Verify Razorpay webhook signature when provided
    const razorpaySignature = req.headers.get('x-razorpay-signature');
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') ?? '';
    if (body?.event && razorpaySignature) {
      if (!webhookSecret) {
        return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(webhookSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
      const computed = Array.from(new Uint8Array(signatureBytes)).map(b => b.toString(16).padStart(2, '0')).join('');
      if (computed !== razorpaySignature) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Webhook received:', body);

    // Handle different webhook types
    if (body.event === 'payment.captured') {
      const payment = body.payload.payment.entity;
      
      // Extract payment details
      const amount = payment.amount; // in paise
      const razorpayPaymentId = payment.id;
      const txnId = `razorpay_${razorpayPaymentId}`;

      // Process payment verification
      const response = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/process-booking`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
          },
          body: JSON.stringify({
            action: 'verify_payment',
            data: {
              txn_id: txnId,
              amount: amount,
              source: 'razorpay',
              razorpay_payment_id: razorpayPaymentId
            }
          })
        }
      );

      const result = await response.json();
      console.log('Payment verification result:', result);

      return new Response(
        JSON.stringify({ success: true, message: 'Webhook processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle SMS/Email OTP verification
    if (body.type === 'sms_payment' || body.type === 'email_payment') {
      const { amount, transaction_id, source } = body;
      
      // Process payment verification
      const response = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/process-booking`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
          },
          body: JSON.stringify({
            action: 'verify_payment',
            data: {
              txn_id: transaction_id,
              amount: Math.round(amount * 100), // convert to paise
              source: source
            }
          })
        }
      );

      const result = await response.json();
      console.log('SMS/Email payment verification result:', result);

      return new Response(
        JSON.stringify({ success: true, message: 'Payment verified' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Webhook received but not processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Webhook processing failed. Please contact support if this persists.',
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
