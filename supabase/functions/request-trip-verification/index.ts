import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';
import { checkXtsyRateLimit } from '../_shared/xtsyRateLimit.ts';

function jsonResponse(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    return jsonResponse({ error: 'Booking Desk notification is not configured.' }, 500, corsHeaders);
  }

  try {
    const body = await req.json();
    const enquiryId = typeof body?.enquiryId === 'string' ? body.enquiryId.trim() : '';
    const guestEmail = typeof body?.guestEmail === 'string' ? body.guestEmail.trim().toLowerCase() : '';

    if (!enquiryId || enquiryId.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      return jsonResponse({ error: 'A valid enquiry reference and guest email are required.' }, 400, corsHeaders);
    }

    let rateAllowed = false;
    try {
      rateAllowed = await checkXtsyRateLimit(req, 'trip-verification', 10);
    } catch {
      return jsonResponse({ error: 'Booking Desk request protection is temporarily unavailable. Please contact XTSY on WhatsApp.' }, 503, corsHeaders);
    }
    if (!rateAllowed) {
      return jsonResponse({ error: 'Too many verification requests. Please retry later.' }, 429, corsHeaders);
    }


    // The email is always sent to the fixed XTSY Booking Desk address by the
    // registered template. Caller-supplied recipient addresses are never used.
    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: enquiry, error: enquiryError } = await admin
      .from('tour_enquiries')
      .select('enquiry_id, guest_name, email, whatsapp_number, preferred_date, travellers, package_duration, package_location, package_title, special_requests, status, created_at')
      .eq('enquiry_id', enquiryId)
      .maybeSingle();

    if (enquiryError) {
      console.error('[Trip verification] Enquiry lookup failed', enquiryError.message);
      return jsonResponse({ error: 'Could not verify the trip enquiry.' }, 500, corsHeaders);
    }
    if (!enquiry || String(enquiry.email).trim().toLowerCase() !== guestEmail) {
      return jsonResponse({ error: 'Trip enquiry not found.' }, 404, corsHeaders);
    }

    const notification = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: anonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateName: 'admin-trip-plan-review',
        idempotencyKey: `xtsy-trip-plan-review-${enquiry.enquiry_id}`,
        templateData: {
          enquiryId: enquiry.enquiry_id,
          guestName: enquiry.guest_name,
          email: enquiry.email,
          phone: enquiry.whatsapp_number,
          dates: enquiry.preferred_date,
          travellers: enquiry.travellers,
          duration: enquiry.package_duration,
          destinations: enquiry.package_location,
          tripTitle: enquiry.package_title,
          itinerary: enquiry.special_requests || 'Itinerary details were not supplied.',
          status: enquiry.status,
          submittedAt: enquiry.created_at,
        },
      }),
    });

    if (!notification.ok) {
      const detail = await notification.text();
      console.error('[Trip verification] Booking Desk email was not queued', {
        status: notification.status,
        detail: detail.slice(0, 400),
        enquiryId: enquiry.enquiry_id,
      });
      return jsonResponse({
        success: true,
        notified: false,
        enquiryId: enquiry.enquiry_id,
        message: 'The enquiry is saved, but the Booking Desk email could not be queued.',
      }, 200, corsHeaders);
    }

    const notificationResult = await notification.json();
    return jsonResponse({
      success: true,
      notified: notificationResult?.success === true && notificationResult?.queued === true,
      enquiryId: enquiry.enquiry_id,
    }, 200, corsHeaders);
  } catch (error) {
    console.error('[Trip verification] Request failed', error instanceof Error ? error.message : 'Unknown error');
    return jsonResponse({ error: 'The Booking Desk notification could not be completed.' }, 500, corsHeaders);
  }
});
