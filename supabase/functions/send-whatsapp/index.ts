/**
 * WhatsApp Business API Edge Function
 * Sends templated WhatsApp messages for booking notifications
 * Requires: WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID secrets
 * AUTH: Admin-only — requires valid JWT with admin role
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppRequest {
  template_key: string;
  phone_number: string;
  variables: Record<string, string>;
}

// Replace template variables like {{guest_name}} with actual values
function replaceVariables(text: string, variables: Record<string, string>): string {
  let result = text;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

// Format phone number to international format (remove spaces, add country code)
function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '91' + cleaned.substring(1);
  }
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ============================================
    // P0 SECURITY: Authenticate & authorize caller
    // ============================================
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized — missing token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Verify the caller's JWT
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized — invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub as string;

    // Check admin role using service client
    const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: roleData } = await serviceClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .in('role', ['admin', 'moderator'])
      .limit(1);

    if (!roleData || roleData.length === 0) {
      console.warn(`[WhatsApp] Forbidden: user ${userId} is not admin`);
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden — admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // ============================================
    // END AUTH CHECK
    // ============================================

    const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
      console.error('WhatsApp credentials not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'WhatsApp not configured. Add WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID secrets.' 
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: WhatsAppRequest = await req.json();
    const { template_key, phone_number, variables } = body;

    console.log(`[WhatsApp] Admin ${userId} sending ${template_key} to ${phone_number.substring(0, 5)}***`);

    // Validate required fields
    if (!template_key || !phone_number) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing template_key or phone_number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch template from database
    const { data: template, error: templateError } = await serviceClient
      .from('whatsapp_templates')
      .select('*')
      .eq('template_key', template_key)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      console.error('Template not found:', template_key, templateError);
      return new Response(
        JSON.stringify({ success: false, error: `Template '${template_key}' not found or inactive` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Replace variables in message body and CTA URL
    const messageBody = replaceVariables(template.message_body, variables || {});
    const ctaUrl = template.cta_button_url 
      ? replaceVariables(template.cta_button_url, variables || {})
      : null;

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone_number);

    // Build WhatsApp API payload
    let payload: any = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
    };

    if (template.cta_button_text && ctaUrl) {
      payload.type = 'interactive';
      payload.interactive = {
        type: 'cta_url',
        body: { text: messageBody },
        action: {
          name: 'cta_url',
          parameters: {
            display_text: template.cta_button_text,
            url: ctaUrl
          }
        }
      };
    } else {
      payload.type = 'text';
      payload.text = { preview_url: true, body: messageBody };
    }

    console.log('[WhatsApp] Sending payload:', JSON.stringify(payload, null, 2));

    // Send to WhatsApp Business API
    const whatsappResponse = await fetch(
      `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const responseData = await whatsappResponse.json();

    if (!whatsappResponse.ok) {
      console.error('[WhatsApp] API Error:', responseData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: responseData.error?.message || 'WhatsApp API error',
          details: responseData 
        }),
        { status: whatsappResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[WhatsApp] Message sent successfully:', responseData.messages?.[0]?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message_id: responseData.messages?.[0]?.id,
        phone: formattedPhone 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[WhatsApp] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to send WhatsApp message. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
