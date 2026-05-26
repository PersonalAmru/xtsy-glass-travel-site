/**
 * Emits `public/seo-slim-map.json` — the slim title/description map keyed by
 * URL slug. Consumed by `cloudflare/worker.js` at edge to rewrite
 * canonical/og:url/og:title/og:description/<title> for non-JS clients
 * (Slackbot, Facebook, LinkedIn, vanilla curl) before the SPA hydrates.
 *
 * Output schema (one JSON object):
 *   {
 *     "<slug>": { "t": "Page Title", "d": "Meta description" },
 *     ...
 *   }
 *
 * Run as part of build (`prebuild`) — kept in /public so it ships next to
 * the SPA bundle and the worker can fetch it from the same origin.
 */
import fs from 'fs';
import path from 'path';

async function main() {
  const { generateSlimMap } = await import('./generateSEOInlineScript');
  const slim = generateSlimMap();
  const out = path.resolve(process.cwd(), 'public', 'seo-slim-map.json');
  fs.writeFileSync(out, JSON.stringify(slim));
  console.log(`✅ seo-slim-map.json: ${Object.keys(slim).length} entries → ${(JSON.stringify(slim).length / 1024).toFixed(1)} KB`);
}

main().catch(e => { console.error(e); process.exit(1); });
