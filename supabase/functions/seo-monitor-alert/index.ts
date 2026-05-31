// supabase/functions/seo-monitor-alert/index.ts
//
// Receives the SEO deploy-gate monitor's failure report and dispatches an
// alert. Channel is auto-selected by which secret is configured:
//   • SLACK_WEBHOOK_URL  → posts a Slack message (preferred for CI alerts)
//   • SEO_ALERT_EMAIL    → sends an email via the send-transactional-email fn
// If neither is set the function still 200s (no-op) so the gate isn't blocked.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertPayload {
  base?: string;
  checked?: number;
  softCount?: number;
  failedCount?: number;
  hreflangCount?: number;
  failures?: { url: string; status: number; issues: string[] }[];
  hreflangIssues?: { url: string; issues: string[] }[];
  generatedAt?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json().catch(() => ({}))) as AlertPayload;
    const base = body.base ?? 'https://xtsy.one';
    const failed = body.failedCount ?? body.failures?.length ?? 0;
    const soft = body.softCount ?? 0;
    const hreflang = body.hreflangCount ?? body.hreflangIssues?.length ?? 0;

    if (failed === 0 && hreflang === 0) {
      return new Response(JSON.stringify({ ok: true, dispatched: false, reason: 'nothing to alert' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const failLines = (body.failures ?? [])
      .slice(0, 15)
      .map((f) => `• ${f.url} [${f.status}] — ${f.issues.join(', ')}`)
      .join('\n');
    const hreflangLines = (body.hreflangIssues ?? [])
      .slice(0, 10)
      .map((h) => `• ${h.url} — ${h.issues.join('; ')}`)
      .join('\n');

    const title = `🚨 SEO Deploy Gate — ${failed} issue(s), ${soft} soft-404(s), ${hreflang} hreflang issue(s)`;
    const text =
      `${title}\nBase: ${base}\nChecked: ${body.checked ?? '?'} URLs\n` +
      (failLines ? `\nMeta / soft-404 issues:\n${failLines}\n` : '') +
      (hreflangLines ? `\nhreflang issues:\n${hreflangLines}\n` : '');

    const dispatched: string[] = [];

    // 1) Slack
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

    // 2) Email (via existing transactional email function)
    const alertEmail = Deno.env.get('SEO_ALERT_EMAIL');
    if (alertEmail) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        );
        const htmlBody =
          `<h2>${title}</h2><p>Base: ${base} · Checked: ${body.checked ?? '?'} URLs</p>` +
          (failLines ? `<h3>Meta / soft-404 issues</h3><pre>${failLines}</pre>` : '') +
          (hreflangLines ? `<h3>hreflang issues</h3><pre>${hreflangLines}</pre>` : '');
        const { error } = await supabase.functions.invoke('send-transactional-email', {
          body: {
            to: alertEmail,
            subject: title,
            html: htmlBody,
            purpose: 'transactional',
            idempotency_key: `seo-alert-${body.generatedAt ?? Date.now()}`,
            template_name: 'seo-monitor-alert',
          },
        });
        if (error) console.error('Email dispatch failed:', error.message);
        else dispatched.push('email');
      } catch (e) {
        console.error('Email dispatch error:', (e as Error).message);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, dispatched: dispatched.length > 0, channels: dispatched }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    console.error('seo-monitor-alert fatal:', e);
    return new Response(JSON.stringify({ error: 'An internal error occurred.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
