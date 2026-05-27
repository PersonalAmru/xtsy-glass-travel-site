# Cloudflare Worker Deploy — `xtsy-prerender`

Worker source: `cloudflare/worker.js` · Config: `cloudflare/wrangler.toml`
CI: `.github/workflows/cloudflare-deploy.yml` (runs on every push to `main`
that touches the worker or the slim SEO map).

## What the worker does

1. **Legacy 301 redirects** — looks slugs up via the `seo-redirect-resolver`
   Supabase function and issues real HTTP 301s for both bots and humans.
2. **Bot prerender** — if a route is cached in the `PRERENDER_CACHE` KV
   namespace, bots get the static HTML directly.
3. **Per-route SEO head rewrite** (the important one) — for every HTML
   response, reads `{title, description}` for the current slug from the
   `SEO_SLIM_MAP` KV namespace and rewrites `<title>`, `<meta
   name=description>`, `<link rel=canonical>`, `og:url`, `og:title`,
   `og:description`, `twitter:title`, `twitter:description` at the edge.
   This is what fixes the 1,573 "canonical mismatch" findings — non-JS
   crawlers (Slackbot, Facebook, LinkedIn, curl) see route-correct metadata
   before any JavaScript runs.

Response headers added: `x-rendered-by: cf-edge-rewrite` (or `cf-bot-rewrite`),
`x-seo-entry: matched | fallback`. Use these to verify the worker is live.

## One-time setup

### 1. Create the two KV namespaces

From your machine (requires `wrangler login` first):

```bash
npx wrangler kv namespace create PRERENDER_CACHE
npx wrangler kv namespace create SEO_SLIM_MAP
```

Each command prints an `id` like `id = "a1b2c3d4..."`. Copy both.

### 2. Add repo secrets

GitHub → repo → **Settings → Secrets and variables → Actions → New
repository secret**. Add:

| Secret name              | Value                                                              |
| ------------------------ | ------------------------------------------------------------------ |
| `CLOUDFLARE_API_TOKEN`   | The rolled CF token (Workers Scripts: Edit, KV: Edit, Zone: Read) |
| `CLOUDFLARE_ACCOUNT_ID`  | `37151e7742ed48a7311c121077d05877`                                |
| `CF_KV_PRERENDER_ID`     | The `id` from step 1 for `PRERENDER_CACHE`                        |
| `CF_KV_SLIM_MAP_ID`      | The `id` from step 1 for `SEO_SLIM_MAP`                           |
| `SUPABASE_ANON_KEY`      | (optional) enables legacy-redirect resolver                       |

> ⚠️ The Cloudflare API token previously exposed in chat must be **rolled**
> in Cloudflare dashboard before pasting the new value here.

### 3. Push to main

The workflow will:

1. Regenerate `public/seo-slim-map.json` from the SEO registry.
2. Render `wrangler.toml` with your real KV namespace IDs.
3. `wrangler kv bulk put` every slim-map entry to KV.
4. `wrangler deploy` the worker.
5. Run `scripts/verifyEdgeRewrite.ts` against 20 random sitemap URLs and
   fail the job if `x-rendered-by` is missing or canonicals are wrong.

You can also trigger it manually: **Actions → Deploy Cloudflare Worker →
Run workflow**.

## Local verify

```bash
VERIFY_BASE_URL=https://xtsy.one bunx tsx scripts/verifyEdgeRewrite.ts
```

A pass looks like:

```
✅ 200 rendered=cf-edge-rewrite entry=matched canonical=https://xtsy.one/<slug>
...
✅ Edge rewrite live and per-route canonicals match.
```
