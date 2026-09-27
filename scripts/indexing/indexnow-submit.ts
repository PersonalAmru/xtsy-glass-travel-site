/**
 * Submit xtsy.one URLs to IndexNow (Bing, Yandex, Seznam, Naver, Yep — shared
 * instantly between participating engines). Key file: public/<KEY>.txt.
 *
 *   bun scripts/indexing/indexnow-submit.ts            # every URL in the sitemaps
 *   bun scripts/indexing/indexnow-submit.ts /a /b      # just these paths
 *
 * Run AFTER the site is published, so crawlers fetch the new version.
 */
import fs from 'fs';
import path from 'path';

const HOST = 'xtsy.one';
const KEY = '8a7d1f4e2b6c4d5e9f3a7b1c2d4e5f6a';

function sitemapUrls(): string[] {
  const dir = path.resolve('public');
  const urls = new Set<string>();
  for (const f of fs.readdirSync(dir).filter((x) => /^sitemap-.*\.xml$/.test(x) && x !== 'sitemap-images.xml')) {
    for (const m of fs.readFileSync(path.join(dir, f), 'utf8').matchAll(/<loc>(https:\/\/xtsy\.one[^<]*)<\/loc>/g)) urls.add(m[1]);
  }
  return [...urls];
}

async function main() {
  const args = process.argv.slice(2);
  const urls = args.length ? args.map((p) => `https://${HOST}${p.startsWith('/') ? p : `/${p}`}`) : sitemapUrls();
  console.log(`Submitting ${urls.length} URLs to IndexNow…`);
  for (let i = 0; i < urls.length; i += 10000) {
    const batch = urls.slice(i, i + 10000);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: batch }),
    });
    console.log(`batch ${i / 10000 + 1}: HTTP ${res.status} ${await res.text()}`);
    if (res.status >= 400 && res.status !== 422) process.exitCode = 1;
  }
}
main();
