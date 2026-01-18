/**
 * WhatsApp Business API Edge Function
 * Sends templated WhatsApp messages for booking notifications
 * Requires: WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID secrets
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
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If starts with 0, assume India and add 91
  if (cleaned.startsWith('0')) {
    cleaned = '91' + cleaned.substring(1);
  }
  
  // If doesn't have country code (10 digits for India), add 91
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
    const WHATSAPP_ACCESS_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    const WHATSAPP_PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body: WhatsAppRequest = await req.json();
    const { template_key, phone_number, variables } = body;

    console.log(`[WhatsApp] Sending ${template_key} to ${phone_number.substring(0, 5)}***`);

    // Validate required fields
    if (!template_key || !phone_number) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing template_key or phone_number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch template from database
    const { data: template, error: templateError } = await supabase
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
    // Using interactive message with CTA button if available
    let payload: any = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
    };

    if (template.cta_button_text && ctaUrl) {
      // Interactive message with CTA button
      payload.type = 'interactive';
      payload.interactive = {
        type: 'cta_url',
        body: {
          text: messageBody
        },
        action: {
          name: 'cta_url',
          parameters: {
            display_text: template.cta_button_text,
            url: ctaUrl
          }
        }
      };
    } else {
      // Simple text message
      payload.type = 'text';
      payload.text = {
        preview_url: true,
        body: messageBody
      };
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
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
