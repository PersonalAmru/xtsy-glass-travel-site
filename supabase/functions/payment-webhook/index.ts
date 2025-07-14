
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
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
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
