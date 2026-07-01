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

// Position tracking — striking-distance keywords on programmatic pages.
// The capture logic now lives in ../_shared/semrushPositions.ts so the
// scheduled cron function (seo-position-cron) can reuse it verbatim.

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

    if (action === 'position-capture') {
      // Service-role client to write snapshots (RLS lets only admins read).
      const supabaseService = createClient(
        supabaseUrl,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      );
      const data = await capturePositions(database, supabaseService);
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
