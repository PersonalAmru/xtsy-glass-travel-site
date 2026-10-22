/**
 * Google Search Console daily pull.
 *
 * Reads the service-account key from GSC_SERVICE_ACCOUNT_JSON (a GitHub secret, never in code),
 * signs a JWT with node:crypto (no extra packages), and asks the Search Console API for the last
 * 28 days of clicks, impressions, CTR and position: totals by day, top queries and top pages.
 * Writes <OUT>/gsc.json and <OUT>/report.md. Exits 0 with a note when the secret is not set, so
 * the scheduled workflow stays green until access is granted.
 *
 * Setup (one time, by the site owner):
 *   1. Google Cloud console → create a project → enable "Google Search Console API".
 *   2. Create a service account → Keys → Add key → JSON (download).
 *   3. Search Console → xtsy.one property → Settings → Users and permissions → Add user →
 *      the service account's email, permission "Restricted".
 *   4. GitHub → repo Settings → Secrets → Actions → GSC_SERVICE_ACCOUNT_JSON = the JSON file's text.
 *   Optional: GSC_SITE (default "sc-domain:xtsy.one"; use "https://xtsy.one/" for a URL-prefix property).
 */
import { createSign } from 'node:crypto';
import fs from 'node:fs';

const OUT = process.env.OUT_DIR || 'gsc-out';
const SITE = process.env.GSC_SITE || 'sc-domain:xtsy.one';
const raw = process.env.GSC_SERVICE_ACCOUNT_JSON || '';

const b64url = (b: Buffer | string) => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

async function token(key: { client_email: string; private_key: string }) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: key.client_email, scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  }));
  const signer = createSign('RSA-SHA256');
  signer.update(`${head}.${claim}`);
  const jwt = `${head}.${claim}.${b64url(signer.sign(key.private_key))}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  if (!res.ok) throw new Error(`token request failed: HTTP ${res.status}`);
  return (await res.json()).access_token as string;
}

type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };

async function query(at: string, body: Record<string, unknown>): Promise<Row[]> {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
    method: 'POST', headers: { authorization: `Bearer ${at}`, 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`searchAnalytics ${JSON.stringify(body.dimensions)}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).rows || [];
}

const day = (d: Date) => d.toISOString().slice(0, 10);

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  if (!raw) {
    const note = 'GSC_SERVICE_ACCOUNT_JSON is not set: Search Console data not pulled. See setup steps in scripts/audit/gsc-pull.ts.';
    console.log(note);
    fs.writeFileSync(`${OUT}/report.md`, `# Search Console\n\n${note}\n`);
    return;
  }
  const key = JSON.parse(raw);
  const at = await token(key);
  // Search Console data lags about 2-3 days.
  const end = new Date(Date.now() - 2 * 86400e3);
  const start = new Date(end.getTime() - 27 * 86400e3);
  const range = { startDate: day(start), endDate: day(end) };
  const [byDate, queries, pages, countries] = await Promise.all([
    query(at, { ...range, dimensions: ['date'], rowLimit: 100 }),
    query(at, { ...range, dimensions: ['query'], rowLimit: 100 }),
    query(at, { ...range, dimensions: ['page'], rowLimit: 100 }),
    query(at, { ...range, dimensions: ['country'], rowLimit: 20 }),
  ]);
  const sum = (rows: Row[], k: 'clicks' | 'impressions') => rows.reduce((s, r) => s + r[k], 0);
  const totals = { clicks: sum(byDate, 'clicks'), impressions: sum(byDate, 'impressions') };
  const data = { site: SITE, ...range, pulledAt: new Date().toISOString(), totals, byDate, queries, pages, countries };
  fs.writeFileSync(`${OUT}/gsc.json`, JSON.stringify(data, null, 1));
  const fmt = (r: Row) => `| ${r.keys?.[0]} | ${r.clicks} | ${r.impressions} | ${(r.ctr * 100).toFixed(1)}% | ${r.position.toFixed(1)} |`;
  const md = [
    `# Search Console — ${SITE} — ${range.startDate} to ${range.endDate}`, '',
    `Clicks ${totals.clicks} · Impressions ${totals.impressions}`, '',
    '## Top queries', '', '| Query | Clicks | Impressions | CTR | Position |', '|---|---|---|---|---|', ...queries.slice(0, 30).map(fmt), '',
    '## Top pages', '', '| Page | Clicks | Impressions | CTR | Position |', '|---|---|---|---|---|', ...pages.slice(0, 30).map(fmt), '',
  ];
  fs.writeFileSync(`${OUT}/report.md`, md.join('\n'));
  console.log(`clicks ${totals.clicks}, impressions ${totals.impressions}, ${queries.length} queries, ${pages.length} pages`);
}

main().catch((e) => { console.error(String(e)); process.exit(1); });
