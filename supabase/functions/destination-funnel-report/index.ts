import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

/**
 * Destination → Bookings Funnel Report (admin only)
 *
 * Measures how visits to high-traffic destination pages (/places-to-visit/*)
 * convert down the booking funnel:
 *
 *   Stage 1  Destination visit      — a session viewed any /places-to-visit/* page
 *   Stage 2  Availability check     — same session hit /book OR fired a
 *                                     search_availability / destination_to_booking
 *                                     (availability_check) signal
 *   Stage 3  Booking click          — same session fired a booking CTA / booking start
 *   Stage 4  Booking created        — same session completed a booking
 *
 * All stages are keyed by session_id so we only attribute downstream actions to
 * sessions that actually started on a destination page. Data lives in
 * service-role-only analytics tables, so this function verifies an admin JWT and
 * then reads with the service role.
 */

const DEST_PREFIX = '/places-to-visit/';
const BOOK_PATHS = ['/book', '/best-hostel-in-shillong'];

interface StageSets {
  visit: Set<string>;
  availability: Set<string>;
  bookingClick: Set<string>;
  bookingCreated: Set<string>;
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // --- Admin gate ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Unauthorized' }, 401, corsHeaders);
    }
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) return json({ error: 'Unauthorized' }, 401, corsHeaders);

    const { data: isAdmin } = await supabaseUser.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    });
    const { data: isStaff } = isAdmin
      ? { data: true }
      : await supabaseUser.rpc('has_role', { _user_id: user.id, _role: 'staff' });
    if (!isAdmin && !isStaff) {
      return json({ error: 'Admin access required' }, 403, corsHeaders);
    }

    // --- Params ---
    const url = new URL(req.url);
    const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '30', 10), 1), 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const supabase = createClient(supabaseUrl, serviceKey);

    // --- Pull raw signals (only what we need) ---
    const [pageviewsRes, eventsRes, conversionsRes] = await Promise.all([
      supabase
        .from('analytics_pageviews')
        .select('session_id, page_path, created_at')
        .gte('created_at', since)
        .limit(100000),
      supabase
        .from('analytics_events')
        .select('session_id, event_category, event_action, page_path, created_at')
        .gte('created_at', since)
        .in('event_category', ['booking'])
        .limit(100000),
      supabase
        .from('analytics_conversions')
        .select('session_id, funnel_name, funnel_step, is_completed, created_at')
        .gte('created_at', since)
        .limit(100000),
    ]);

    if (pageviewsRes.error) throw pageviewsRes.error;

    const pageviews = pageviewsRes.data ?? [];
    const events = eventsRes.data ?? [];
    const conversions = conversionsRes.data ?? [];

    // Session -> destination slug (first destination page seen in the session)
    const sessionDest = new Map<string, string>();
    const overall: StageSets = {
      visit: new Set(),
      availability: new Set(),
      bookingClick: new Set(),
      bookingCreated: new Set(),
    };
    // Per-destination stage sets
    const perDest = new Map<string, StageSets>();
    const ensureDest = (slug: string): StageSets => {
      let s = perDest.get(slug);
      if (!s) {
        s = { visit: new Set(), availability: new Set(), bookingClick: new Set(), bookingCreated: new Set() };
        perDest.set(slug, s);
      }
      return s;
    };

    // Stage 1 — destination visits + record where each session started
    for (const pv of pageviews) {
      const sid = pv.session_id as string;
      const path = (pv.page_path as string) || '';
      if (sid && path.startsWith(DEST_PREFIX)) {
        const slug = path.slice(DEST_PREFIX.length).split(/[/?#]/)[0];
        if (!slug) continue;
        if (!sessionDest.has(sid)) sessionDest.set(sid, slug);
        overall.visit.add(sid);
        ensureDest(slug).visit.add(sid);
      }
    }

    const attribute = (sid: string, stage: keyof StageSets) => {
      if (!overall.visit.has(sid)) return; // only sessions that started on a destination page
      overall[stage].add(sid);
      const slug = sessionDest.get(sid);
      if (slug) ensureDest(slug)[stage].add(sid);
    };

    // Stage 2 — availability checks (visits to booking paths)
    for (const pv of pageviews) {
      const sid = pv.session_id as string;
      const path = (pv.page_path as string) || '';
      if (sid && BOOK_PATHS.some((p) => path.startsWith(p))) {
        attribute(sid, 'availability');
      }
    }

    // Stage 2/3 — conversion signals fired from the destination CTA / booking flow
    for (const c of conversions) {
      const sid = c.session_id as string;
      if (!sid) continue;
      const step = (c.funnel_step as string) || '';
      if (step === 'availability_check' || (c.funnel_name === 'booking' && (c.funnel_step as string)?.includes('search'))) {
        attribute(sid, 'availability');
      }
      if (step === 'book_now' || step === 'room_selection' || step === 'guest_details') {
        attribute(sid, 'availability');
        attribute(sid, 'bookingClick');
      }
      if (c.is_completed) {
        attribute(sid, 'bookingCreated');
      }
    }

    // Stage 3 — booking CTA clicks / booking starts
    for (const e of events) {
      const sid = e.session_id as string;
      if (!sid) continue;
      const action = (e.event_action as string) || '';
      if (action === 'destination_cta_click' || action === 'start' || action === 'click') {
        attribute(sid, 'bookingClick');
        // A destination CTA click IS an availability-check intent too.
        if (action === 'destination_cta_click') attribute(sid, 'availability');
      }
      if (action === 'complete') attribute(sid, 'bookingCreated');
    }

    const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 1000) / 10 : 0);

    const funnel = [
      { key: 'visit', label: 'Destination page visits', sessions: overall.visit.size },
      { key: 'availability', label: 'Availability checks', sessions: overall.availability.size },
      { key: 'bookingClick', label: 'Booking clicks', sessions: overall.bookingClick.size },
      { key: 'bookingCreated', label: 'Bookings created', sessions: overall.bookingCreated.size },
    ].map((s) => ({
      ...s,
      pct_of_visits: pct(s.sessions, overall.visit.size),
    }));

    const destinations = Array.from(perDest.entries())
      .map(([slug, s]) => ({
        slug,
        visits: s.visit.size,
        availability_checks: s.availability.size,
        booking_clicks: s.bookingClick.size,
        bookings_created: s.bookingCreated.size,
        visit_to_availability_pct: pct(s.availability.size, s.visit.size),
        availability_to_click_pct: pct(s.bookingClick.size, s.availability.size),
        visit_to_booking_pct: pct(s.bookingCreated.size, s.visit.size),
      }))
      .sort((a, b) => b.visits - a.visits);

    return json(
      {
        window_days: days,
        since,
        generated_at: new Date().toISOString(),
        totals: {
          destination_pageviews: pageviews.filter((p) => (p.page_path as string)?.startsWith(DEST_PREFIX)).length,
          sessions_starting_on_destination: overall.visit.size,
        },
        funnel,
        destinations,
      },
      200,
      corsHeaders,
    );
  } catch (err) {
    console.error('[destination-funnel-report] error', err);
    return json({ error: String((err as Error)?.message ?? err) }, 500, getCorsHeaders(req));
  }
});

function json(body: unknown, status: number, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
