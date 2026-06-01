// supabase/functions/analytics-loader-summary/index.ts
//
// Daily summary of the analytics loader health from `analytics_loader_events`.
//
// Computes, over a rolling window (default 24h):
//   • First-party (/cs) vs CDN load success rates
//   • Overall load success rate
//   • Top block reasons (with counts)
//   • Breakdown by browser / device for blocked loads
// …then dispatches a digest via Slack (SLACK_WEBHOOK_URL) and/or email
// (SEO_ALERT_EMAIL via the send-transactional-email function).
//
// Designed to be invoked by a daily pg_cron job, but can also be called
// manually (POST { "hours": 24 }). Always 200s with the computed summary so a
// scheduler never sees a hard failure for a no-op.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoaderRow {
  status: string;
  block_reason: string | null;
  used_first_party: boolean | null;
  browser: string | null;
  device_type: string | null;
}

function pct(n: number, d: number): string {
  if (d <= 0) return '—';
  return `${((n / d) * 100).toFixed(1)}%`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const hours = Math.min(Math.max(Number(body?.hours) || 24, 1), 168);
    const since = new Date(Date.now() - hours * 3600_000).toISOString();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Pull the window (paginate defensively up to ~5k rows).
    const rows: LoaderRow[] = [];
    const PAGE = 1000;
    for (let from = 0; from < 5000; from += PAGE) {
      const { data, error } = await supabase
        .from('analytics_loader_events')
        .select('status, block_reason, used_first_party, browser, device_type')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .range(from, from + PAGE - 1);
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) break;
      rows.push(...(data as LoaderRow[]));
      if (data.length < PAGE) break;
    }

    const total = rows.length;
    const loaded = rows.filter((r) => r.status === 'loaded');
    const fp = rows.filter((r) => r.used_first_party === true);
    const cdn = rows.filter((r) => r.used_first_party === false);
    const fpLoaded = fp.filter((r) => r.status === 'loaded');
    const cdnLoaded = cdn.filter((r) => r.status === 'loaded');

    // Top block reasons
    const reasonCounts: Record<string, number> = {};
    for (const r of rows) {
      if (r.status === 'blocked' || r.status === 'error') {
        const k = r.block_reason || 'unknown';
        reasonCounts[k] = (reasonCounts[k] || 0) + 1;
      }
    }
    const topReasons = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    // Blocked-by-browser
    const browserBlocks: Record<string, number> = {};
    for (const r of rows) {
      if (r.status === 'blocked' || r.status === 'error') {
        const k = r.browser || 'unknown';
        browserBlocks[k] = (browserBlocks[k] || 0) + 1;
      }
    }
    const topBrowsers = Object.entries(browserBlocks)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const summary = {
      windowHours: hours,
      since,
      total,
      overallSuccessRate: pct(loaded.length, total),
      firstParty: { attempts: fp.length, loaded: fpLoaded.length, successRate: pct(fpLoaded.length, fp.length) },
      cdn: { attempts: cdn.length, loaded: cdnLoaded.length, successRate: pct(cdnLoaded.length, cdn.length) },
      topBlockReasons: topReasons.map(([reason, count]) => ({ reason, count })),
      topBlockedBrowsers: topBrowsers.map(([browser, count]) => ({ browser, count })),
    };

    // No data → 200 no-op (do not spam channels with empty digests).
    if (total === 0) {
      return new Response(JSON.stringify({ ok: true, dispatched: false, reason: 'no events in window', summary }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const title = `📊 Analytics Loader Daily Summary — ${total} events / ${hours}h`;
    const lines = [
      title,
      ``,
      `Overall load success: ${summary.overallSuccessRate}`,
      `First-party (/cs): ${summary.firstParty.loaded}/${summary.firstParty.attempts} (${summary.firstParty.successRate})`,
      `CDN fallback: ${summary.cdn.loaded}/${summary.cdn.attempts} (${summary.cdn.successRate})`,
      ``,
      `Top block reasons:`,
      ...(topReasons.length ? topReasons.map(([r, c]) => `• ${r}: ${c}`) : ['• none 🎉']),
      ``,
      `Blocked by browser:`,
      ...(topBrowsers.length ? topBrowsers.map(([b, c]) => `• ${b}: ${c}`) : ['• none']),
    ];
    const text = lines.join('\n');

    const dispatched: string[] = [];

    const slackUrl = Deno.env.get('SLACK_WEBHOOK_URL');
    if (slackUrl) {
      const res = await fetch(slackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) dispatched.push('slack');
      else console.error('Slack dispatch failed:', res.status, await res.text());
    }

    const alertEmail = Deno.env.get('SEO_ALERT_EMAIL');
    if (alertEmail) {
      try {
        const htmlBody =
          `<h2>${title}</h2>` +
          `<p><strong>Overall load success:</strong> ${summary.overallSuccessRate}</p>` +
          `<p><strong>First-party (/cs):</strong> ${summary.firstParty.loaded}/${summary.firstParty.attempts} (${summary.firstParty.successRate})<br/>` +
          `<strong>CDN fallback:</strong> ${summary.cdn.loaded}/${summary.cdn.attempts} (${summary.cdn.successRate})</p>` +
          `<h3>Top block reasons</h3><ul>${(topReasons.length ? topReasons : [['none', 0]]).map(([r, c]) => `<li>${r}: ${c}</li>`).join('')}</ul>` +
          `<h3>Blocked by browser</h3><ul>${(topBrowsers.length ? topBrowsers : [['none', 0]]).map(([b, c]) => `<li>${b}: ${c}</li>`).join('')}</ul>`;
        const { error } = await supabase.functions.invoke('send-transactional-email', {
          body: {
            to: alertEmail,
            subject: title,
            html: htmlBody,
            purpose: 'transactional',
            idempotency_key: `loader-summary-${since}`,
            template_name: 'analytics-loader-summary',
          },
        });
        if (error) console.error('Email dispatch failed:', error.message);
        else dispatched.push('email');
      } catch (e) {
        console.error('Email dispatch error:', (e as Error).message);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, dispatched: dispatched.length > 0, channels: dispatched, summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    console.error('analytics-loader-summary fatal:', e);
    return new Response(JSON.stringify({ error: 'An internal error occurred.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
