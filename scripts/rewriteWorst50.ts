/**
 * Auto-rewrite the 50 lowest-scoring SEO pages using Lovable AI Gateway.
 * Output → src/data/seoPagesOverridesBottom50.ts
 *
 * Resilient: checkpoints to /tmp/rewrite50-checkpoint.json after each success.
 * Run twice (BATCH_OFFSET=0 then 25) or pass --batch=0 / --batch=1.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { ALL_SEO_PAGES } from '../src/data/seoPages';
import { getWheelLinks } from '../src/data/seoLinkingWheel';
import type { SEOPageData } from '../src/data/seoPages';
import { PILLAR_PAGES } from '../src/data/seoPillarPages';
import { DESTINATION_PAGES } from '../src/data/seoDestinationPages';

const CHECKPOINT = '/tmp/rewrite50-checkpoint.json';
const OUT_FILE = 'src/data/seoPagesOverridesBottom50.ts';
const BATCH_SIZE = 25;
const arg = process.argv.find((a) => a.startsWith('--batch='));
const BATCH = arg ? parseInt(arg.split('=')[1], 10) : 0; // 0 → first 25, 1 → next 25
const ONLY_BATCH = process.argv.includes('--only-batch');

const isHostel = (p: SEOPageData) => p.category === 'hostels' || /hostel|dorm|backpacker|budget-stay/.test(p.slug);
const seen = new Set<string>();
const targets: SEOPageData[] = [];
const addAll = (list: SEOPageData[]) => list.forEach((p) => {
  if (!seen.has(p.slug)) { seen.add(p.slug); targets.push(p); }
});
addAll(PILLAR_PAGES);
addAll(DESTINATION_PAGES);
addAll(ALL_SEO_PAGES.filter(isHostel));

function score(p: SEOPageData) {
  let s = 0;
  const qa = p.quickAnswer ?? '';
  if (qa.length >= 40 && qa.length <= 240 && /[.!?]$/.test(qa.trim())) s += 25;
  const intro = p.intro ?? '';
  const firstS = (intro.split(/(?<=[.!?])\s/)[0] ?? '');
  const wc = firstS.split(/\s+/).filter(Boolean).length;
  if (wc >= 12 && !/^(Looking for|Planning|Welcome|Are you|Searching|If you)/i.test(firstS.trim())) s += 20;
  const faqs = p.faqs ?? [];
  const goodFaqs = faqs.filter((f) => f.answer.length >= 25 && f.answer.length <= 280).length;
  if (faqs.length >= 6 && goodFaqs >= 6) s += 15;
  const tokens = p.slug.split('-').filter((t) => t.length > 2);
  const titleHasKw = tokens.some((tok) => p.title.toLowerCase().includes(tok));
  if (p.title.length >= 35 && p.title.length <= 60 && titleHasKw) s += 15;
  if (p.metaDescription.length >= 130 && p.metaDescription.length <= 160) s += 10;
  if (p.h1 && p.h1 !== p.title) s += 5;
  const sections = p.sections ?? [];
  const withBullets = sections.filter((sec) => (sec.listItems?.length ?? 0) >= 3).length;
  if (sections.length >= 4 && withBullets >= 1) s += 10;
  return s;
}

const ranked = targets
  .map((p) => ({ p, s: score(p) }))
  .sort((a, b) => a.s - b.s)
  .slice(0, 50)
  .map((x) => x.p);

const checkpoint: Record<string, any> = existsSync(CHECKPOINT)
  ? JSON.parse(readFileSync(CHECKPOINT, 'utf8'))
  : {};
console.log(`Loaded checkpoint with ${Object.keys(checkpoint).length} prior rewrites.`);

const start = BATCH * BATCH_SIZE;
const end = ONLY_BATCH ? start + BATCH_SIZE : ranked.length;
const slice = ranked.slice(start, end).filter((p) => !checkpoint[p.slug]);
console.log(`Rewriting batch ${BATCH}: ${slice.length} pending pages (range ${start}..${end - 1}).`);

const KEY = process.env.LOVABLE_API_KEY;
if (!KEY) { console.error('LOVABLE_API_KEY missing'); process.exit(1); }

const SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    metaDescription: { type: 'string' },
    h1: { type: 'string' },
    intro: { type: 'string' },
    quickAnswer: { type: 'string' },
    sections: {
      type: 'array', minItems: 5, maxItems: 5,
      items: {
        type: 'object',
        properties: {
          heading: { type: 'string' },
          content: { type: 'string' },
          listItems: { type: 'array', minItems: 5, maxItems: 6, items: { type: 'string' } },
        },
        required: ['heading', 'content', 'listItems'],
      },
    },
    faqs: {
      type: 'array', minItems: 8, maxItems: 8,
      items: {
        type: 'object',
        properties: { question: { type: 'string' }, answer: { type: 'string' } },
        required: ['question', 'answer'],
      },
    },
    keywords: { type: 'array', minItems: 6, maxItems: 10, items: { type: 'string' } },
  },
  required: ['title', 'metaDescription', 'h1', 'intro', 'quickAnswer', 'sections', 'faqs', 'keywords'],
} as const;

interface AIResp { title: string; metaDescription: string; h1: string; intro: string; quickAnswer: string; sections: { heading: string; content: string; listItems: string[] }[]; faqs: { question: string; answer: string }[]; keywords: string[]; }

function classifyIntent(slug: string): string {
  const s = slug.toLowerCase();
  if (/(^|-)vs(-|$)|^best-|^top-|^cheapest-/.test(s)) return 'comparison';
  if (/(^|-)(how|what|why|when|where)(-|$)/.test(s)) return 'informational';
  if (/(price|cost|rate|cheap|budget)/.test(s)) return 'price';
  if (/(\dd|days|nights|itinerary|trip-plan)/.test(s)) return 'itinerary';
  return 'transactional';
}

async function rewrite(p: SEOPageData, timeoutMs = 45000): Promise<AIResp | null> {
  const intent = classifyIntent(p.slug);
  const wheel = getWheelLinks(p.slug).slice(0, 8).map((l) => l.slug || '/').join(', ');
  const sys = `You are a senior SEO + AI-Overview editor for XTSY (xtsy.one), a Northeast India travel marketplace based in Shillong, Meghalaya. WhatsApp: +91 8837317070. Always rewrite for AI-answer eligibility (Google AI Overviews, ChatGPT, Gemini): direct answer first, entity-rich bullets, structured FAQs. NEVER fabricate prices — say "from request" or omit. Mention WhatsApp +91 8837317070 once for booking intent. British English, factual, concise.`;
  const usr = `Rewrite slug "${p.slug}" (intent=${intent}, category=${p.category}). Lift to grade A AI-answer.
Internal link context: ${wheel}.

Existing title: ${p.title}
Existing meta: ${p.metaDescription}
Existing intro: ${(p.intro ?? '').slice(0, 400)}
Existing FAQs: ${(p.faqs ?? []).slice(0, 3).map((f) => f.question).join(' | ')}

Constraints: title 45–58 chars; metaDescription 140–158 chars; intro 120–220 words with first sentence ≥14 words & direct answer; quickAnswer 80–220 chars period-terminated; exactly 5 sections each with 5–6 listItems; exactly 8 FAQs with 60–260 char answers; keywords 6–10 lower-case tokens.`;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [{ role: 'system', content: sys }, { role: 'user', content: usr }],
        tools: [{ type: 'function', function: { name: 'emit_rewrite', description: 'Emit rewritten SEO page', parameters: SCHEMA } }],
        tool_choice: { type: 'function', function: { name: 'emit_rewrite' } },
      }),
    });
    const text = await r.text();
    if (!r.ok) { console.error(`  ${p.slug}: HTTP ${r.status} ${text.slice(0, 160)}`); return null; }
    const j: any = JSON.parse(text);
    const tc = j.choices?.[0]?.message?.tool_calls?.[0];
    if (!tc) { console.error(`  ${p.slug}: no tool_call`); return null; }
    return JSON.parse(tc.function.arguments) as AIResp;
  } catch (e: any) {
    console.error(`  ${p.slug}: ${e?.name === 'AbortError' ? 'timeout' : e?.message ?? e}`);
    return null;
  } finally {
    clearTimeout(t);
  }
}

function flushOutput() {
  const banner = `/**
 * Auto-generated rewrites for the 50 lowest-scoring AI-answer pages.
 * Generated: ${new Date().toISOString()}
 * Source: scripts/rewriteWorst50.ts (Lovable AI Gateway, gemini-3-flash-preview)
 */
import type { SEOPageData } from './seoPages';

type SEOOverride = Partial<SEOPageData> & { slug: string };

export const BOTTOM50_SEO_REWRITES: SEOOverride[] = ${JSON.stringify(
    Object.entries(checkpoint).map(([slug, data]) => ({ slug, ...(data as object) })),
    null,
    2,
  )};
`;
  writeFileSync(OUT_FILE, banner);
  writeFileSync(CHECKPOINT, JSON.stringify(checkpoint, null, 2));
}

const CONCURRENCY = 3;
let cursor = 0;
let completed = 0;
async function worker() {
  while (cursor < slice.length) {
    const i = cursor++;
    const p = slice[i];
    process.stdout.write(`[${i + 1}/${slice.length}] ${p.slug} … `);
    let attempt = 0;
    let ok = false;
    while (attempt < 2 && !ok) {
      const out = await rewrite(p);
      if (out) {
        checkpoint[p.slug] = out;
        completed++;
        if (completed % 3 === 0) flushOutput();
        process.stdout.write('✓\n');
        ok = true;
      } else {
        attempt++;
        if (attempt < 2) await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }
    if (!ok) process.stdout.write('✗\n');
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
flushOutput();
console.log(`\n✅ Done. Total in checkpoint: ${Object.keys(checkpoint).length}/50`);
console.log(`📁 wrote ${OUT_FILE}`);
