/**
 * Auto-rewrite the 50 lowest-scoring SEO pages using Lovable AI Gateway.
 * Output → src/data/seoPagesOverridesBottom50.ts
 *
 * Each rewrite enforces the AI-answer eligibility template:
 *  - quickAnswer 80–220 chars ending with period
 *  - intro lead sentence ≥ 14 words, no weak openers
 *  - 5 sections, each with 5–6 listItems
 *  - 8 FAQs, answers 60–260 chars
 *  - title 45–58 chars including a slug keyword
 *  - meta 140–158 chars
 *  - h1 distinct from title
 *  - keywords 6–10 tokens
 */
import { writeFileSync } from 'node:fs';
import { ALL_SEO_PAGES } from '../src/data/seoPages';
import { getWheelLinks } from '../src/data/seoLinkingWheel';
import type { SEOPageData } from '../src/data/seoPages';

// Bottom 50 slugs (from latest audit run; deterministic by score asc).
// We re-derive at runtime so it stays in sync.
import { PILLAR_PAGES } from '../src/data/seoPillarPages';
import { DESTINATION_PAGES } from '../src/data/seoDestinationPages';

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

console.log(`Rewriting ${ranked.length} pages…`);

const KEY = process.env.LOVABLE_API_KEY;
if (!KEY) { console.error('LOVABLE_API_KEY missing'); process.exit(1); }

const SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string', description: '45-58 chars, include a slug keyword + a hook' },
    metaDescription: { type: 'string', description: '140-158 chars, action-oriented, mentions XTSY/WhatsApp' },
    h1: { type: 'string', description: 'Distinct from title' },
    intro: { type: 'string', description: '120-220 words; first sentence ≥14 words and a direct answer (no "Looking for"/"Welcome")' },
    quickAnswer: { type: 'string', description: '80-220 chars, ends with period; 1–2 sentence direct answer' },
    sections: {
      type: 'array', minItems: 5, maxItems: 5,
      items: {
        type: 'object',
        properties: {
          heading: { type: 'string' },
          content: { type: 'string', description: '4–6 sentences with concrete entities (places, prices, distances).' },
          listItems: { type: 'array', minItems: 5, maxItems: 6, items: { type: 'string' } },
        },
        required: ['heading', 'content', 'listItems'],
      },
    },
    faqs: {
      type: 'array', minItems: 8, maxItems: 8,
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string', description: '60–260 chars' },
        },
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

async function rewrite(p: SEOPageData): Promise<AIResp | null> {
  const intent = classifyIntent(p.slug);
  const wheel = getWheelLinks(p.slug).slice(0, 8).map((l) => l.slug || '/').join(', ');
  const sys = `You are a senior SEO + AI-Overview editor for XTSY (xtsy.one), a Northeast India travel marketplace based in Shillong, Meghalaya. WhatsApp: +91 8837317070. Always rewrite for AI-answer eligibility (Google AI Overviews, ChatGPT, Gemini): direct answer first, entity-rich bullets, structured FAQs. NEVER fabricate prices — if a price must appear say "from request" or omit. Mention WhatsApp +91 8837317070 once for booking intent. British English, factual, concise.`;
  const usr = `Rewrite the page below for slug "${p.slug}" (intent=${intent}, category=${p.category}).
Goal: lift it to grade A on AI-answer audit.
Internal link context (already wired in template, just inform tone): ${wheel}.

Existing title: ${p.title}
Existing meta: ${p.metaDescription}
Existing intro: ${p.intro?.slice(0, 400)}
Existing FAQs (sample): ${(p.faqs ?? []).slice(0, 3).map((f) => f.question).join(' | ')}

Return STRICT JSON via the tool call. Constraints:
- title 45–58 chars
- metaDescription 140–158 chars
- intro 120–220 words, first sentence ≥14 words and a direct answer
- quickAnswer 80–220 chars, period-terminated
- exactly 5 sections, each with 5–6 listItems and 4–6 sentence content
- exactly 8 FAQs, answers 60–260 chars
- keywords 6–10 lower-case tokens including the primary slug keyword`;

  const body = {
    model: 'google/gemini-3-flash-preview',
    messages: [{ role: 'system', content: sys }, { role: 'user', content: usr }],
    tools: [{ type: 'function', function: { name: 'emit_rewrite', description: 'Emit the rewritten SEO page', parameters: SCHEMA } }],
    tool_choice: { type: 'function', function: { name: 'emit_rewrite' } },
  };
  const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST', headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!r.ok) { console.error(`  ${p.slug}: HTTP ${r.status}`, (await r.text()).slice(0, 200)); return null; }
  const j: any = await r.json();
  const tc = j.choices?.[0]?.message?.tool_calls?.[0];
  if (!tc) { console.error(`  ${p.slug}: no tool_call`, JSON.stringify(j).slice(0, 200)); return null; }
  try { return JSON.parse(tc.function.arguments) as AIResp; } catch (e) { console.error(`  ${p.slug}: bad JSON`, e); return null; }
}

const results: { slug: string; data: AIResp }[] = [];

// Run with limited concurrency
const CONCURRENCY = 4;
let cursor = 0;
async function worker(id: number) {
  while (cursor < ranked.length) {
    const i = cursor++;
    const p = ranked[i];
    process.stdout.write(`[${i + 1}/${ranked.length}] ${p.slug} … `);
    let attempt = 0;
    while (attempt < 3) {
      const out = await rewrite(p);
      if (out) {
        results.push({ slug: p.slug, data: out });
        process.stdout.write('✓\n');
        break;
      }
      attempt++;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
    if (attempt === 3) process.stdout.write('✗\n');
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));

console.log(`\n✅ ${results.length}/${ranked.length} rewrites complete`);

const banner = `/**
 * Auto-generated rewrites for the 50 lowest-scoring AI-answer pages.
 * Generated: ${new Date().toISOString()}
 * Source: scripts/rewriteWorst50.ts (Lovable AI Gateway, gemini-3-flash-preview)
 * Merged into ALL_SEO_PAGES via seoPagesOverrides.applySEOOverrides.
 */
import type { SEOPageData } from './seoPages';

type SEOOverride = Partial<SEOPageData> & { slug: string };

export const BOTTOM50_SEO_REWRITES: SEOOverride[] = ${JSON.stringify(results.map((r) => ({ slug: r.slug, ...r.data })), null, 2)};
`;
writeFileSync('src/data/seoPagesOverridesBottom50.ts', banner);
console.log('📁 wrote src/data/seoPagesOverridesBottom50.ts');
