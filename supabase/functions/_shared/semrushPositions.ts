/**
 * Shared Semrush position-capture logic.
 *
 * Used by:
 *  - semrush-seo-intel  (admin-triggered, on-demand capture)
 *  - seo-position-cron   (scheduled daily capture via pg_cron)
 *
 * All Semrush credentials (LOVABLE_API_KEY + SEMRUSH_API_KEY) stay
 * server-side. Snapshots are written to public.seo_position_snapshots.
 */

const GATEWAY = 'https://connector-gateway.lovable.dev/semrush';
export const OUR_DOMAIN = 'xtsy.one';

type Row = Record<string, string>;

interface Parsed {
  columns: string[];
  rows: Row[];
}

export async function semrush(
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
  if (!url) return false;
  if (seg === 'tours') {
    try {
      const u = url.startsWith('http') ? new URL(url) : new URL('https://xtsy.one' + url);
      return u.pathname.split('/').filter(Boolean).length > 1;
    } catch { return false; }
  }
  return !STATIC_PATHS.has(seg);
};

export interface CaptureRow {
  keyword: string;
  position: number;
  previousPosition: number | null;
  delta: number | null;
  volume: number;
  cpc: number;
  url: string;
  trafficPct: number;
  isProgrammatic: boolean;
  isStrikingDistance: boolean;
}

export interface CaptureResult {
  runId: string;
  capturedAt: string;
  database: string;
  totalTracked: number;
  strikingCount: number;
  programmaticStrikingCount: number;
  top10Count: number;
  rows: CaptureRow[];
}

/**
 * Pull our organic positions from Semrush and persist a timestamped
 * snapshot into seo_position_snapshots. `trigger` records who initiated
 * the run (e.g. 'admin' or 'cron') — stored in the run's rows so trend
 * charts can distinguish automated vs manual captures.
 */
export async function capturePositions(
  database: string,
  supabaseService: any,
  trigger = 'admin',
): Promise<CaptureResult> {
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
