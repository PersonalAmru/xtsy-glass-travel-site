import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { 
      room_type_id, 
      check_in, 
      check_out, 
      quantity = 1,
      amount,
      customer_email,
      customer_name,
      customer_phone 
    } = await req.json()

    console.log('Creating Cashfree order for:', { room_type_id, check_in, check_out, quantity, amount, customer_email })

    // Validate required fields
    if (!room_type_id || !check_in || !check_out || !amount || !customer_email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate room availability using the database function
    const { data: isAvailable, error: availabilityError } = await supabaseClient
      .rpc('is_room_available', {
        p_room_type_id: room_type_id,
        p_check_in: check_in,
        p_check_out: check_out,
        p_quantity: quantity
      })

    if (availabilityError) {
      console.error('Error checking availability:', availabilityError)
      return new Response(
        JSON.stringify({ error: 'Failed to check room availability' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!isAvailable) {
      return new Response(
        JSON.stringify({ error: 'Room not available for selected dates' }),
        { 
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Cashfree credentials
    const cashfreeAppId = Deno.env.get('CASHFREE_APP_ID')
    const cashfreeSecretKey = Deno.env.get('CASHFREE_SECRET_KEY')
    const cashfreeEnv = Deno.env.get('CASHFREE_ENV') || 'TEST'

    if (!cashfreeAppId || !cashfreeSecretKey) {
      console.error('Missing Cashfree credentials')
      return new Response(
        JSON.stringify({ error: 'Payment system configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate unique order ID
    const orderId = `XTSY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Prepare Cashfree order data
    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: customer_email.replace('@', '_at_').replace('.', '_dot_'),
        customer_name: customer_name || 'Guest',
        customer_email: customer_email,
        customer_phone: customer_phone || '9999999999'
      },
      order_meta: {
        return_url: `${Deno.env.get('PUBLIC_SITE_ORIGIN') || 'https://9a4a5e4b-f1f1-40f7-ba6f-5d944df4e08e.lovableproject.com'}/booking-success?order_id=${orderId}`,
        notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/cashfree-webhook`
      }
    }

    // Create Cashfree order
    const cashfreeUrl = cashfreeEnv === 'PROD' 
      ? 'https://api.cashfree.com/pg/orders' 
      : 'https://sandbox.cashfree.com/pg/orders'

    const cashfreeResponse = await fetch(cashfreeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': cashfreeAppId,
        'x-client-secret': cashfreeSecretKey,
        'x-api-version': '2022-09-01'
      },
      body: JSON.stringify(orderData)
    })

    if (!cashfreeResponse.ok) {
      const errorText = await cashfreeResponse.text()
      console.error('Cashfree API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to create payment order' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const cashfreeOrder = await cashfreeResponse.json()
    console.log('Cashfree order created:', cashfreeOrder)

    // Store pending order in database
    const { error: insertError } = await supabaseClient
      .from('pending_orders')
      .insert({
        order_id: orderId,
        room_type_id,
        check_in,
        check_out,
        quantity,
        customer_email,
        customer_name,
        customer_phone,
        amount
      })

    if (insertError) {
      console.error('Error storing pending order:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create order record' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Return order details for frontend
    return new Response(
      JSON.stringify({
        order_id: orderId,
        payment_session_id: cashfreeOrder.payment_session_id,
        payment_link: cashfreeOrder.order_meta?.payment_link,
        order_amount: cashfreeOrder.order_amount,
        order_currency: cashfreeOrder.order_currency,
        order_status: cashfreeOrder.order_status
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in cashfree-create-order:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})