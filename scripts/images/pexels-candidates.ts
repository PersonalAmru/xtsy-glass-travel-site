/**
 * Step 1 of 2 (CI, needs PEXELS_API_KEY): search Pexels for every target in
 * photoTargets.ts, keep up to 6 on-topic landscape candidates each, and build
 * numbered contact sheets for a human/visual review.
 *
 * Writes scripts/images/pexels-candidates.json (committed) and
 * shots/pexels/sheet-NN.jpg (published to the ci-screenshots branch).
 */
import fs from 'fs';
import sharp from 'sharp';
import { PHOTO_TARGETS } from './photoTargets';

const KEY = process.env.PEXELS_API_KEY;
const OUT = 'shots/pexels';
const PER = 6;
const TW = 300, TH = 200, LABEL = 300, ROWS = 8;

type Cand = { n: number; id: number; alt: string; url: string; photographer: string; photographerUrl: string; w: number; h: number; src: string; thumb: string };

let remaining = 200;
async function search(q: string) {
  if (remaining < 3) return [];
  const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&orientation=landscape&per_page=20`, { headers: { Authorization: KEY! } });
  remaining = Number(r.headers.get('x-ratelimit-remaining') ?? remaining - 1);
  if (r.status === 429) { remaining = 0; console.log('::warning::Pexels rate limit reached; remaining targets skipped'); return []; }
  if (!r.ok) { console.log(`::warning::Pexels ${r.status} for "${q}"`); return []; }
  return ((await r.json()) as { photos: any[] }).photos ?? [];
}

const esc = (s: string) => s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]!));

async function main() {
  if (!KEY) { console.log('::error::PEXELS_API_KEY secret is not set'); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  const all: Record<string, Cand[]> = {};
  for (const tg of PHOTO_TARGETS) {
    const seen = new Set<number>();
    const list: Cand[] = [];
    for (const q of tg.queries) {
      if (list.length >= PER) break;
      for (const p of await search(q)) {
        if (list.length >= PER || seen.has(p.id)) continue;
        seen.add(p.id);
        const text = `${p.alt ?? ''} ${p.url ?? ''}`.replace(/-/g, ' ');
        if (tg.match && !tg.match.test(text)) continue;
        if (p.width < 1200) continue;
        list.push({ n: list.length + 1, id: p.id, alt: p.alt ?? '', url: p.url, photographer: p.photographer, photographerUrl: p.photographer_url, w: p.width, h: p.height, src: p.src.original, thumb: p.src.medium });
      }
    }
    all[tg.key] = list;
    console.log(`${tg.key}: ${list.length} candidates`);
  }
  fs.writeFileSync('scripts/images/pexels-candidates.json', JSON.stringify(all, null, 1));

  // Contact sheets: one row per target, label + numbered thumbnails.
  const keys = PHOTO_TARGETS.map((t) => t.key);
  for (let s = 0; s * ROWS < keys.length; s++) {
    const rows = keys.slice(s * ROWS, s * ROWS + ROWS);
    const W = LABEL + PER * (TW + 6), H = rows.length * (TH + 8);
    const layers: sharp.OverlayOptions[] = [];
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#fff"/>`;
    for (const [ri, key] of rows.entries()) {
      const y = ri * (TH + 8);
      const tg = PHOTO_TARGETS.find((t) => t.key === key)!;
      svg += `<text x="8" y="${y + 24}" font-family="sans-serif" font-size="15" font-weight="700">${esc(key)}</text>`;
      svg += `<text x="8" y="${y + 46}" font-family="sans-serif" font-size="14">${esc(tg.label.slice(0, 38))}</text>`;
      if (!all[key].length) svg += `<text x="8" y="${y + 70}" font-family="sans-serif" font-size="14" fill="#b3262f">no on-topic photo</text>`;
      for (const c of all[key]) {
        try {
          const buf = Buffer.from(await (await fetch(c.thumb)).arrayBuffer());
          const img = await sharp(buf).resize(TW, TH, { fit: 'cover' }).jpeg({ quality: 70 }).toBuffer();
          const x = LABEL + (c.n - 1) * (TW + 6);
          layers.push({ input: img, left: x, top: y });
          svg += `<rect x="${x}" y="${y}" width="34" height="26" fill="#000" opacity="0.75"/><text x="${x + 9}" y="${y + 19}" font-family="sans-serif" font-size="17" font-weight="700" fill="#fff">${c.n}</text>`;
          svg += `<rect x="${x}" y="${y + TH - 22}" width="${TW}" height="22" fill="#000" opacity="0.6"/><text x="${x + 5}" y="${y + TH - 6}" font-family="sans-serif" font-size="11" fill="#fff">${esc(c.alt.slice(0, 48))}</text>`;
        } catch { /* skip thumbnail */ }
      }
    }
    svg += '</svg>';
    // Text overlay must sit above the photos: composite photos onto white, then the SVG with a transparent background.
    const textOnly = Buffer.from(svg.replace('<rect width="100%" height="100%" fill="#fff"/>', ''));
    await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
      .composite([...layers, { input: textOnly, left: 0, top: 0 }])
      .jpeg({ quality: 78 })
      .toFile(`${OUT}/sheet-${String(s + 1).padStart(2, '0')}.jpg`);
  }
  console.log(`::notice::Pexels candidates written; API calls left this hour: ${remaining}`);
}
main();
