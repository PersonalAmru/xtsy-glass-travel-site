/**
 * semrush-seo-intel
 * Admin-only proxy to the Semrush connector gateway.
 *
 * Powers the Competitor Analysis dashboard. All Semrush credentials
 * (LOVABLE_API_KEY + SEMRUSH_API_KEY) stay server-side — the browser
 * never sees them. Caller must be an authenticated admin.
 *
 * POST body: { action: 'competitor-benchmark', database?: string }
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

const GATEWAY = 'https://connector-gateway.lovable.dev/semrush';
const OUR_DOMAIN = 'xtsy.one';

type Row = Record<string, string>;

interface Parsed {
  columns: string[];
  rows: Row[];
}

async function semrush(
  path: string,
  params: Record<string, string>,
  extraHeaders: Record<string, string> = {},
): Promise<Parsed> {
  const lovableKey = Deno.env.get('LOVABLE_API_KEY');
  const semrushKey = Deno.env.get('SEMRUSH_API_KEY');
  if (!lovableKey || !semrushKey) {
    throw new Error('Semrush connector is not configured. Connect Semrush in Connectors.');
  }
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${GATEWAY}/${path}?${qs}`, {
    headers: {
      'Authorization': `Bearer ${lovableKey}`,
      'X-Connection-Api-Key': semrushKey,
      ...extraHeaders,
    },
  });
  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Semrush gateway returned non-JSON (HTTP ${res.status}): ${text.slice(0, 200)}`);
  }
  if (json?.error) {
    // Surface quota errors clearly.
    throw new Error(String(json.error));
  }
  const columnNames: string[] = json?.data?.columnNames ?? [];
  const rawRows: string[][] = json?.data?.rows ?? [];
  const rows: Row[] = rawRows.map((r) => {
    const obj: Row = {};
    columnNames.forEach((c, i) => { obj[c] = r[i]; });
    return obj;
  });
  return { columns: columnNames, rows };
}

const num = (v: string | undefined) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// Keywords that signal booking / revenue intent (Hostel, Bistro, Travel).
const BOOKING_INTENT = [
  'hostel', 'stay', 'hotel', 'homestay', 'dormitory', 'glamping', 'camp',
  'booking', 'book', 'accommodation', 'lodge', 'resort', 'room',
  'tour', 'package', 'trip', 'itinerary', 'travel agen', 'cab', 'taxi',
  'restaurant', 'cafe', 'bistro', 'dining', 'food', 'catering',
];
const isBookingIntent = (kw: string) =>
  BOOKING_INTENT.some((t) => kw.toLowerCase().includes(t));

// ─────────────────────────────────────────────────────────────────────────────
// Position tracking — striking-distance keywords on programmatic pages.
//
// Semrush's API surfaces Google organic positions (the same index Chrome,
// Safari and mobile browsers all read from). True device-split / Safari-only
// tracking requires a paid Position Tracking campaign, which the connector
// scope can only READ, not create — so we track movement from the organic
// positions report and snapshot it over time into seo_position_snapshots.
// ─────────────────────────────────────────────────────────────────────────────

// Known static/hand-built routes — anything else ranking is treated as a
// programmatic page. Keep first path segment only.
const STATIC_PATHS = new Set([
  '', 'about', 'gallery', 'travel', 'tours', 'xtsy-270', 'pet-friendly',
  'xtsy-vs-zostel', 'female-travellers', 'work-from-home', 'xtsy-rentals',
  'tab-bistro', 'catering-shillong', 'xtsy-adventure-campsite-dawki',
  'privacy-policy', 'privacy', 'terms-of-service', 'terms',
  'pricing-cancellation-policy', 'refund-cancellation-policy', 'contact',
  'contact-us', 'unsubscribe', 'book', 'auth', 'profile',
  'group-bookings-meghalaya', 'all-pages',
]);

function firstSegment(url: string): string {
  try {
    const u = url.startsWith('http') ? new URL(url) : new URL('https://xtsy.one/' + url.replace(/^\//, ''));
    return u.pathname.split('/').filter(Boolean)[0] ?? '';
  } catch {
    return '';
  }
}

const isProgrammatic = (url: string) => {
  const seg = firstSegment(url);
  // Programmatic if it's a deeper slug not in the static set, or under tours/:slug.
  if (!url) return false;
  if (seg === 'tours') {
    try {
      const u = url.startsWith('http') ? new URL(url) : new URL('https://xtsy.one' + url);
      return u.pathname.split('/').filter(Boolean).length > 1; // /tours/:slug
    } catch { return false; }
  }
  return !STATIC_PATHS.has(seg);
};

interface CaptureRow {
  keyword: string;
  position: number;
  previousPosition: number | null;
  delta: number | null; // positive = improved (moved up)
  volume: number;
  cpc: number;
  url: string;
  trafficPct: number;
  isProgrammatic: boolean;
  isStrikingDistance: boolean;
}

async function capturePositions(database: string, supabaseService: any) {
  // Pull our organic positions (up to 250). Allow-Limit-Offset unlocks >10.
  const parsed = await semrush(
    'domains/domain_organic',
    {
      domain: OUR_DOMAIN,
      database,
      display_limit: '250',
      display_sort: 'po_asc',
      export_columns: 'Ph,Po,Pp,Nq,Cp,Ur,Tr',
    },
    { 'Allow-Limit-Offset': 'true' },
  );

  const rows: CaptureRow[] = parsed.rows
    .map((r) => {
      const position = num(r['Position']);
      const prevRaw = r['Previous Position'];
      const previousPosition = prevRaw && num(prevRaw) > 0 ? num(prevRaw) : null;
      const url = r['Url'] ?? '';
      return {
        keyword: r['Keyword'] ?? '',
        position,
        previousPosition,
        // Positive delta = improved (previous higher number → now lower number).
        delta: previousPosition ? previousPosition - position : null,
        volume: num(r['Search Volume']),
        cpc: num(r['CPC']),
        url,
        trafficPct: num(r['Traffic (%)']),
        isProgrammatic: isProgrammatic(url),
        isStrikingDistance: position >= 11 && position <= 20,
      };
    })
    .filter((r) => r.keyword && r.position > 0);

  const runId = crypto.randomUUID();
  const capturedAt = new Date().toISOString();

  if (rows.length > 0) {
    const dbRows = rows.map((r) => ({
      run_id: runId,
      captured_at: capturedAt,
      database,
      keyword: r.keyword,
      position: r.position,
      previous_position: r.previousPosition,
      delta: r.delta,
      volume: r.volume,
      cpc: r.cpc,
      url: r.url,
      traffic_pct: r.trafficPct,
      is_programmatic: r.isProgrammatic,
      is_striking_distance: r.isStrikingDistance,
    }));
    const { error: insErr } = await supabaseService
      .from('seo_position_snapshots')
      .insert(dbRows);
    if (insErr) throw new Error(`Failed to store snapshot: ${insErr.message}`);
  }

  const striking = rows.filter((r) => r.isStrikingDistance);
  const programmaticStriking = striking.filter((r) => r.isProgrammatic);

  return {
    runId,
    capturedAt,
    database,
    totalTracked: rows.length,
    strikingCount: striking.length,
    programmaticStrikingCount: programmaticStriking.length,
    top10Count: rows.filter((r) => r.position <= 10).length,
    rows,
  };
}

async function competitorBenchmark(database: string) {
  // 1. Our overview
  const ourOverview = await semrush('domains/domain_ranks', {
    domain: OUR_DOMAIN, database, export_columns: 'Dn,Rk,Or,Ot,Oc,Ad',
  });

  // 2. Organic competitors
  const competitorsRaw = await semrush('domains/domain_organic_organic', {
    domain: OUR_DOMAIN, database, display_limit: '10',
    export_columns: 'Dn,Cr,Np,Or,Ot',
  });
  const competitors = competitorsRaw.rows
    .map((r) => ({
      domain: r['Domain'],
      relevance: num(r['Competitor Relevance']),
      commonKeywords: num(r['Common Keywords']),
      organicKeywords: num(r['Organic Keywords']),
      organicTraffic: num(r['Organic Traffic']),
    }))
    .filter((c) => c.domain && c.domain !== OUR_DOMAIN)
    .sort((a, b) => b.organicTraffic - a.organicTraffic);

  // 3. Head-to-head overview for top 3 competitors by traffic.
  const top3 = competitors.slice(0, 3);
  const headToHead: any[] = [];
  for (const c of top3) {
    try {
      const ov = await semrush('domains/domain_ranks', {
        domain: c.domain, database, export_columns: 'Dn,Rk,Or,Ot,Oc,Ad',
      });
      const row = ov.rows[0];
      headToHead.push({
        domain: c.domain,
        organicKeywords: num(row?.['Organic Keywords']),
        organicTraffic: num(row?.['Organic Traffic']),
        organicCost: num(row?.['Organic Cost']),
        rank: num(row?.['Rank']),
      });
    } catch (_) { /* skip on quota */ }
  }

  // 4. Booking-intent keywords WE rank for (our revenue footprint).
  const ourKw = await semrush('domains/domain_organic', {
    domain: OUR_DOMAIN, database, display_limit: '100',
    export_columns: 'Ph,Po,Nq,Cp,Ur,Td',
  });
  const ourBookingKeywords = ourKw.rows
    .map((r) => ({
      keyword: r['Keyword'],
      position: num(r['Position']),
      volume: num(r['Search Volume']),
      cpc: num(r['CPC']),
      url: r['Url'],
    }))
    .filter((k) => k.keyword && isBookingIntent(k.keyword))
    .sort((a, b) => b.volume - a.volume);

  // 5. Booking-intent keywords the TOP competitor ranks for — the gap.
  let competitorBookingKeywords: any[] = [];
  if (top3[0]) {
    try {
      const compKw = await semrush('domains/domain_organic', {
        domain: top3[0].domain, database, display_limit: '100',
        export_columns: 'Ph,Po,Nq,Cp,Ur,Td',
      });
      const ourKwSet = new Set(ourBookingKeywords.map((k) => k.keyword.toLowerCase()));
      competitorBookingKeywords = compKw.rows
        .map((r) => ({
          keyword: r['Keyword'],
          position: num(r['Position']),
          volume: num(r['Search Volume']),
          cpc: num(r['CPC']),
          url: r['Url'],
          competitor: top3[0].domain,
        }))
        .filter((k) => k.keyword && isBookingIntent(k.keyword) && !ourKwSet.has(k.keyword.toLowerCase()))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 40);
    } catch (_) { /* skip on quota */ }
  }

  const ourRow = ourOverview.rows[0];
  return {
    database,
    generatedAt: new Date().toISOString(),
    our: {
      domain: OUR_DOMAIN,
      organicKeywords: num(ourRow?.['Organic Keywords']),
      organicTraffic: num(ourRow?.['Organic Traffic']),
      organicCost: num(ourRow?.['Organic Cost']),
      rank: num(ourRow?.['Rank']),
    },
    competitors,
    headToHead,
    ourBookingKeywords,
    competitorBookingKeywords,
  };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUser = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { data: isAdmin } = await supabaseUser.rpc('has_role', { _user_id: user.id, _role: 'admin' });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action ?? 'competitor-benchmark';
    const database = (body.database ?? 'in').toString();

    if (action === 'competitor-benchmark') {
      const data = await competitorBenchmark(database);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    console.error('[semrush-seo-intel]', message);
    const quota = /limit exceeded|134/i.test(message);
    return new Response(JSON.stringify({
      error: quota
        ? 'Semrush API quota exhausted — upgrade your Semrush plan or wait for the quota to reset.'
        : message,
      quota,
    }), {
      status: quota ? 429 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
