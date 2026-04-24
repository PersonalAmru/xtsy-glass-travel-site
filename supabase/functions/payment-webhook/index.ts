import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
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
      return new Response(JSON.stringify({ error: 'Invalid request format' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Verify Razorpay webhook signature - MANDATORY for any event-bearing request
    const razorpaySignature = req.headers.get('x-razorpay-signature');
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') ?? '';
    if (body?.event) {
      if (!webhookSecret) {
        console.error('[Payment Webhook] Critical: Webhook secret not configured');
        return new Response(JSON.stringify({ error: 'Webhook processing failed. Please contact support.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (!razorpaySignature) {
        console.warn('[Payment Webhook] Rejected: missing signature header');
        return new Response(JSON.stringify({ error: 'Authentication failed' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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
        console.warn('[Payment Webhook] Rejected: signature mismatch');
        return new Response(JSON.stringify({ error: 'Authentication failed' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Verify SMS/email payment webhooks via shared secret HMAC
    if (body?.type === 'sms_payment' || body?.type === 'email_payment') {
      const altSecret = Deno.env.get('PAYMENT_WEBHOOK_SECRET') ?? '';
      const altSignature = req.headers.get('x-webhook-signature');
      if (!altSecret) {
        console.error('[Payment Webhook] Critical: PAYMENT_WEBHOOK_SECRET not configured');
        return new Response(JSON.stringify({ error: 'Webhook processing failed. Please contact support.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (!altSignature) {
        return new Response(JSON.stringify({ error: 'Authentication failed' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(altSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
      const computed = Array.from(new Uint8Array(signatureBytes)).map(b => b.toString(16).padStart(2, '0')).join('');
      if (computed !== altSignature) {
        return new Response(JSON.stringify({ error: 'Authentication failed' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Server-side logging only - no sensitive details in response
    console.log('[Payment Webhook] Received event:', body.event || body.type || 'unknown');

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
      // Server-side logging only
      console.log('[Payment Webhook] Payment verification completed:', result.success ? 'success' : 'failed');

      return new Response(
        JSON.stringify({ success: true, message: 'Processed' }),
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
      // Server-side logging only
      console.log('[Payment Webhook] Alternative payment verification completed:', result.success ? 'success' : 'failed');

      return new Response(
        JSON.stringify({ success: true, message: 'Processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Acknowledged' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Server-side error logging only
    console.error('[Payment Webhook] Processing error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Webhook processing failed. Please contact support if this persists.',
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});