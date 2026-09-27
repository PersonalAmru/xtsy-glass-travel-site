/**
 * Google Search Console via the official API (service account):
 *  1. (Re)submits every sitemap in the sitemap index.
 *  2. Runs the URL Inspection API on the priority pages and prints their
 *     index status (verdict, coverage, last crawl, Google-selected canonical).
 *
 * Google's Indexing API is NOT used: Google only allows it for JobPosting and
 * BroadcastEvent pages; using it for hostel/travel pages breaks their policy.
 *
 * Setup (one time):
 *  - Google Cloud: create a service account, enable "Google Search Console API",
 *    create a JSON key.
 *  - Search Console → Settings → Users and permissions → add the service
 *    account email as an Owner of the property (sc-domain:xtsy.one or https://xtsy.one/).
 *  - GitHub → Settings → Secrets → GSC_SERVICE_ACCOUNT_JSON = the JSON key;
 *    optional GSC_SITE_URL (default "sc-domain:xtsy.one").
 */
import crypto from 'crypto';
import fs from 'fs';

const SITE = process.env.GSC_SITE_URL || 'sc-domain:xtsy.one';
const PRIORITY = ['/', '/best-hostel-in-shillong', '/cheap-hostels-shillong', '/xtsy-270', '/plan-trip-with-ai', '/tours', '/meghalaya-tour-packages', '/things-to-do-in-meghalaya', '/tab-bistro', '/pet-friendly', '/female-travellers', '/work-from-home', '/hostels-in-shillong-today', '/shillong-dormitory'];

const b64url = (b: Buffer | string) => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

async function token(sa: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/webmasters', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const sig = b64url(crypto.createSign('RSA-SHA256').update(`${head}.${claim}`).sign(sa.private_key));
  const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claim}.${sig}` }) });
  const j = await res.json() as { access_token?: string; error?: string };
  if (!j.access_token) throw new Error(`token error: ${JSON.stringify(j)}`);
  return j.access_token;
}

async function main() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!raw) { console.log('GSC_SERVICE_ACCOUNT_JSON not set — skipping (see setup notes in this file).'); return; }
  const t = await token(JSON.parse(raw));
  const auth = { Authorization: `Bearer ${t}` };
  const site = encodeURIComponent(SITE);

  const index = fs.readFileSync('public/sitemap_index.xml', 'utf8');
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const m of ['https://xtsy.one/sitemap_index.xml', ...maps]) {
    const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${site}/sitemaps/${encodeURIComponent(m)}`, { method: 'PUT', headers: auth });
    console.log(`sitemap ${m}: HTTP ${r.status}`);
  }

  const report: unknown[] = [];
  for (const p of PRIORITY) {
    const r = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ inspectionUrl: `https://xtsy.one${p}`, siteUrl: SITE, languageCode: 'en-IN' }) });
    const j = await r.json() as { inspectionResult?: { indexStatusResult?: Record<string, unknown> } };
    const s = j.inspectionResult?.indexStatusResult ?? {};
    report.push({ path: p, verdict: s.verdict, coverage: s.coverageState, lastCrawl: s.lastCrawlTime, googleCanonical: s.googleCanonical });
    console.log(p, s.verdict, s.coverageState, s.lastCrawlTime ?? '');
  }
  fs.mkdirSync('shots', { recursive: true });
  fs.writeFileSync('shots/gsc-index-status.json', JSON.stringify(report, null, 1));
}
main().catch((e) => { console.error(e); process.exit(1); });
