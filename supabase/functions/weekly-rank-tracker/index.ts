import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

/**
 * weekly-rank-tracker
 *
 * Pulls xtsy.one organic positions from Semrush (via the Lovable connector
 * gateway), stores a weekly snapshot per target keyword in
 * `seo_position_snapshots`, compares to the previous run, and writes an
 * `admin_notifications` row whenever a tracked keyword's rank changes.
 *
 * Scheduled weekly via pg_cron. Can also be invoked ad-hoc (POST { dryRun }).
 */

const GATEWAY = 'https://connector-gateway.lovable.dev/semrush';
const DATABASE = 'in'; // India market — matches the target audience
const DOMAIN = 'xtsy.one';

// Target keywords mapped to the page each should rank (see keyword→page map).
const TARGET_KEYWORDS: { keyword: string; targetPath: string }[] = [
  { keyword: 'best time to visit meghalaya', targetPath: '/best-time-to-visit-meghalaya' },
  { keyword: 'places to visit in meghalaya', targetPath: '/places-to-visit-in-meghalaya' },
  { keyword: 'meghalaya tourist places', targetPath: '/places-to-visit-in-meghalaya' },
  { keyword: 'meghalaya places to visit', targetPath: '/places-to-visit-in-meghalaya' },
  { keyword: 'things to do in meghalaya', targetPath: '/things-to-do-in-meghalaya' },
  { keyword: 'meghalaya tour package', targetPath: '/meghalaya-tour-packages' },
  { keyword: 'meghalaya tour packages', targetPath: '/meghalaya-tour-packages' },
  { keyword: 'shillong tour package', targetPath: '/shillong-tour-package' },
  { keyword: 'hidden places in meghalaya', targetPath: '/hidden-places-in-meghalaya' },
  { keyword: 'nohkalikai falls', targetPath: '/places-to-visit/nohkalikai-falls' },
  { keyword: 'dawki river', targetPath: '/places-to-visit/dawki-umngot-river' },
  { keyword: 'umiam lake', targetPath: '/places-to-visit/umiam-lake' },
  { keyword: 'elephant falls shillong', targetPath: '/places-to-visit/elephant-falls' },
  { keyword: 'double decker living root bridge', targetPath: '/places-to-visit/double-decker-living-root-bridge' },
  { keyword: 'best hostel in shillong', targetPath: '/best-hostel-in-shillong' },
];

interface KeywordRank {
  position: number | null;
  volume: number | null;
  cpc: number | null;
  url: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // ---- Auth gate: shared cron secret OR verified admin/staff JWT ----------
  // This endpoint burns paid Semrush quota and writes admin notifications,
  // so it must never be callable anonymously.
  const rawBody = await req.text();
  let parsedBody: Record<string, unknown> = {};
  if (rawBody) {
    try { parsedBody = JSON.parse(rawBody); } catch { /* ignore */ }
  }

  const cronSecret = Deno.env.get('SEO_CRON_SECRET') ?? Deno.env.get('CRON_SECRET');
  const providedSecret =
    req.headers.get('x-cron-secret') ?? (parsedBody as any)?.secret ?? '';
  let authorized = !!cronSecret && providedSecret === cronSecret;

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authorized && authHeader.startsWith('Bearer ')) {
    try {
      const authClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } },
      );
      const { data: userData } = await authClient.auth.getUser();
      if (userData?.user) {
        const { data: isStaff } = await authClient.rpc('is_admin_or_staff');
        authorized = isStaff === true;
      }
    } catch (_e) {
      authorized = false;
    }
  }

  if (!authorized) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const SEMRUSH_API_KEY = Deno.env.get('SEMRUSH_API_KEY');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!LOVABLE_API_KEY || !SEMRUSH_API_KEY) {
    return json({ error: 'Semrush connector is not configured' }, 500);
  }
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return json({ error: 'Backend credentials missing' }, 500);
  }

  const dryRun = (parsedBody as any)?.dryRun === true;

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  // 1. Fetch the domain's organic keyword table from Semrush.
  const params = new URLSearchParams({
    domain: DOMAIN,
    database: DATABASE,
    export_columns: 'Ph,Po,Nq,Cp,Ur',
    display_limit: '500',
  });
  const semrushRes = await fetch(`${GATEWAY}/domains/domain_organic?${params}`, {
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': SEMRUSH_API_KEY,
      'Allow-Limit-Offset': 'true',
    },
  });

  const rawText = await semrushRes.text();
  if (!semrushRes.ok) {
    console.error(`Semrush request failed [${semrushRes.status}]: ${rawText}`);
    if (rawText.includes('TOTAL LIMIT EXCEEDED')) {
      return json({ error: 'Semrush API quota exhausted — upgrade your plan or wait for reset.' }, 429);
    }
    return json({ error: 'Semrush request failed', status: semrushRes.status, details: rawText }, semrushRes.status);
  }

  // 2. Build a keyword → rank map from the Semrush response.
  const ranks = new Map<string, KeywordRank>();
  try {
    const parsed = JSON.parse(rawText);
    const rows: string[][] = parsed?.data?.rows ?? [];
    for (const row of rows) {
      const [phrase, pos, vol, cpc, url] = row;
      if (!phrase) continue;
      ranks.set(phrase.toLowerCase().trim(), {
        position: pos ? parseInt(pos, 10) : null,
        volume: vol ? parseInt(vol, 10) : null,
        cpc: cpc ? parseFloat(cpc) : null,
        url: url ?? null,
      });
    }
  } catch (e) {
    console.error('Failed to parse Semrush response:', e, rawText.slice(0, 500));
    return json({ error: 'Could not parse Semrush response' }, 502);
  }

  // 3. Compare against the most recent previous snapshot per keyword.
  const runId = crypto.randomUUID();
  const capturedAt = new Date().toISOString();
  const snapshotRows: Record<string, unknown>[] = [];
  const changes: { keyword: string; from: number | null; to: number | null; delta: number }[] = [];

  for (const target of TARGET_KEYWORDS) {
    const key = target.keyword.toLowerCase().trim();
    const current = ranks.get(key) ?? { position: null, volume: null, cpc: null, url: null };

    const { data: prev } = await supabase
      .from('seo_position_snapshots')
      .select('position')
      .eq('keyword', target.keyword)
      .eq('database', DATABASE)
      .order('captured_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const previousPosition: number | null = prev?.position ?? null;
    const delta =
      current.position != null && previousPosition != null
        ? previousPosition - current.position // positive = improved (moved up)
        : 0;

    snapshotRows.push({
      run_id: runId,
      captured_at: capturedAt,
      database: DATABASE,
      keyword: target.keyword,
      position: current.position,
      previous_position: previousPosition,
      delta,
      volume: current.volume,
      cpc: current.cpc,
      url: current.url ?? `https://${DOMAIN}${target.targetPath}`,
      is_striking_distance: current.position != null && current.position >= 11 && current.position <= 20,
    });

    const enteredTop10 = previousPosition != null && previousPosition > 10 && current.position != null && current.position <= 10;
    const leftTop10 = previousPosition != null && previousPosition <= 10 && (current.position == null || current.position > 10);
    const newlyRanking = previousPosition == null && current.position != null;
    const droppedOut = previousPosition != null && current.position == null;

    if (delta !== 0 || enteredTop10 || leftTop10 || newlyRanking || droppedOut) {
      changes.push({ keyword: target.keyword, from: previousPosition, to: current.position, delta });
    }
  }

  if (dryRun) {
    return json({ dryRun: true, runId, tracked: snapshotRows.length, changes });
  }

  // 4. Persist snapshots.
  const { error: insertErr } = await supabase.from('seo_position_snapshots').insert(snapshotRows);
  if (insertErr) {
    console.error('Snapshot insert failed:', insertErr);
    return json({ error: 'Failed to store snapshots', details: insertErr.message }, 500);
  }

  // 5. Notify on any ranking change.
  if (changes.length > 0) {
    const improved = changes.filter((c) => c.delta > 0).length;
    const dropped = changes.filter((c) => c.delta < 0).length;
    const summary = changes
      .map((c) => {
        const from = c.from ?? '—';
        const to = c.to ?? 'out';
        const arrow = c.delta > 0 ? '▲' : c.delta < 0 ? '▼' : '•';
        return `${arrow} "${c.keyword}": ${from} → ${to}`;
      })
      .join('\n');

    await supabase.from('admin_notifications').insert({
      type: 'rank_change',
      title: `Keyword rankings changed (${improved} up, ${dropped} down)`,
      message: summary,
      is_read: false,
      metadata: { runId, database: DATABASE, changes },
    });
  }

  return json({ ok: true, runId, tracked: snapshotRows.length, changed: changes.length, changes });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
