/**
 * Audit all pillar + destination + hostel SEO pages for AI-answer eligibility.
 *
 * Scoring (0-100, higher = better):
 *   +25  quickAnswer present, length 40-240 chars, ends with period
 *   +20  intro starts with a direct answer (first sentence ≥ 12 words, not "Looking for…")
 *   +15  ≥6 FAQs with answer length 25-280 chars
 *   +15  title 35-60 chars, contains primary keyword token from slug
 *   +10  metaDescription 130-160 chars
 *    +5  H1 distinct from title and present
 *   +10  ≥4 sections with at least one bulleted listItems block (entity facts)
 *
 * Intent classification (used to recommend rewrite format):
 *   - "comparison"  → slug starts with best/top/cheapest or contains "vs"
 *   - "informational" → contains how/what/why/when/where
 *   - "price"       → contains price/cost/rate/cheap/budget
 *   - "itinerary"   → contains days|itinerary|trip-plan|nights
 *   - "transactional" (default) → book/hostel/hotel/dorm/rental
 *
 * Outputs:
 *   /mnt/documents/seo-ai-answer-audit.csv
 *   /mnt/documents/seo-ai-answer-audit.md   (top issues + recommendations)
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { PILLAR_PAGES } from '../src/data/seoPillarPages';
import { DESTINATION_PAGES } from '../src/data/seoDestinationPages';
import { ALL_SEO_PAGES } from '../src/data/seoPages';
import type { SEOPageData } from '../src/data/seoPages';

mkdirSync('/mnt/documents', { recursive: true });

const isHostel = (p: SEOPageData) => p.category === 'hostels' || /hostel|dorm|backpacker|budget-stay/.test(p.slug);

// Build target set: pillars + destinations + hostels (deduped)
const seen = new Set<string>();
const targets: SEOPageData[] = [];
const addAll = (list: SEOPageData[]) => list.forEach((p) => {
  if (!seen.has(p.slug)) { seen.add(p.slug); targets.push(p); }
});
addAll(PILLAR_PAGES);
addAll(DESTINATION_PAGES);
addAll(ALL_SEO_PAGES.filter(isHostel));

function classifyIntent(slug: string): string {
  const s = slug.toLowerCase();
  if (/(^|-)vs(-|$)|^best-|^top-|^cheapest-/.test(s)) return 'comparison';
  if (/(^|-)(how|what|why|when|where)(-|$)/.test(s)) return 'informational';
  if (/(price|cost|rate|cheap|budget)/.test(s)) return 'price';
  if (/(\dd|days|nights|itinerary|trip-plan)/.test(s)) return 'itinerary';
  return 'transactional';
}

function recommendedFormat(intent: string): string {
  switch (intent) {
    case 'comparison': return 'comparison-table';
    case 'informational': return 'answer+bullets+FAQ';
    case 'price': return 'price-table+FAQ';
    case 'itinerary': return 'day-by-day-list';
    default: return 'answer+bullets+FAQ';
  }
}

function firstSentence(s: string): string {
  return (s ?? '').split(/(?<=[.!?])\s/)[0] ?? '';
}

function tokensFromSlug(slug: string): string[] {
  return slug.split('-').filter((t) => t.length > 2 && !['the', 'and', 'for', 'with', 'near', 'from'].includes(t));
}

function score(p: SEOPageData) {
  const issues: string[] = [];
  let s = 0;

  // quickAnswer
  const qa = p.quickAnswer ?? '';
  if (qa && qa.length >= 40 && qa.length <= 240 && /[.!?]$/.test(qa.trim())) s += 25;
  else issues.push(qa ? `quickAnswer length ${qa.length} (target 40-240, end punctuation)` : 'missing quickAnswer');

  // intro answer-first
  const intro = p.intro ?? '';
  const firstS = firstSentence(intro);
  const wc = firstS.split(/\s+/).filter(Boolean).length;
  const startsWeak = /^(Looking for|Planning|Welcome|Are you|Searching|If you)/i.test(firstS.trim());
  if (wc >= 12 && !startsWeak) s += 20;
  else issues.push(startsWeak ? 'intro opens with weak phrasing' : `intro 1st sentence too short (${wc} words)`);

  // FAQs
  const faqs = p.faqs ?? [];
  const goodFaqs = faqs.filter((f) => f.answer.length >= 25 && f.answer.length <= 280).length;
  if (faqs.length >= 6 && goodFaqs >= 6) s += 15;
  else issues.push(`only ${faqs.length} FAQs (${goodFaqs} well-sized; need ≥6 between 25-280 chars)`);

  // Title
  const t = p.title ?? '';
  const tokens = tokensFromSlug(p.slug);
  const titleHasKw = tokens.some((tok) => t.toLowerCase().includes(tok));
  if (t.length >= 35 && t.length <= 60 && titleHasKw) s += 15;
  else issues.push(`title length ${t.length} kw-match=${titleHasKw} (target 35-60 with slug keyword)`);

  // Meta
  const m = p.metaDescription ?? '';
  if (m.length >= 130 && m.length <= 160) s += 10;
  else issues.push(`meta length ${m.length} (target 130-160)`);

  // H1
  if (p.h1 && p.h1.trim() && p.h1 !== p.title) s += 5;
  else issues.push('H1 missing or identical to title');

  // Sections w/ bullets
  const sections = p.sections ?? [];
  const withBullets = sections.filter((sec) => (sec.listItems?.length ?? 0) >= 3).length;
  if (sections.length >= 4 && withBullets >= 1) s += 10;
  else issues.push(`sections=${sections.length} bulleted=${withBullets} (need ≥4 sections, ≥1 bulleted)`);

  return { score: s, issues };
}

interface Row {
  slug: string;
  category: string;
  intent: string;
  recommended: string;
  score: number;
  grade: string;
  issues: string[];
  title: string;
  titleLen: number;
  metaLen: number;
  faqCount: number;
  sectionCount: number;
  hasQuickAnswer: boolean;
  introLen: number;
}

const rows: Row[] = targets.map((p) => {
  const { score: sc, issues } = score(p);
  const intent = classifyIntent(p.slug);
  const grade = sc >= 85 ? 'A' : sc >= 70 ? 'B' : sc >= 55 ? 'C' : sc >= 40 ? 'D' : 'F';
  return {
    slug: p.slug,
    category: p.category,
    intent,
    recommended: recommendedFormat(intent),
    score: sc,
    grade,
    issues,
    title: p.title,
    titleLen: p.title.length,
    metaLen: p.metaDescription.length,
    faqCount: p.faqs?.length ?? 0,
    sectionCount: p.sections?.length ?? 0,
    hasQuickAnswer: !!p.quickAnswer,
    introLen: p.intro?.length ?? 0,
  };
});

rows.sort((a, b) => a.score - b.score);

// CSV
const csvCell = (v: unknown) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csvHeader = 'rank,score,grade,category,intent,recommended,slug,title,title_len,meta_len,faqs,sections,has_quick_answer,intro_len,issues\n';
const csvBody = rows.map((r, i) => [
  i + 1, r.score, r.grade, r.category, r.intent, r.recommended,
  r.slug, r.title, r.titleLen, r.metaLen, r.faqCount, r.sectionCount,
  r.hasQuickAnswer, r.introLen, r.issues.join(' | '),
].map(csvCell).join(',')).join('\n');
writeFileSync('/mnt/documents/seo-ai-answer-audit.csv', csvHeader + csvBody);

// Markdown summary
const total = rows.length;
const byGrade = rows.reduce<Record<string, number>>((acc, r) => { acc[r.grade] = (acc[r.grade] ?? 0) + 1; return acc; }, {});
const avg = Math.round(rows.reduce((s, r) => s + r.score, 0) / total);
const noQA = rows.filter((r) => !r.hasQuickAnswer).length;
const thinFaq = rows.filter((r) => r.faqCount < 6).length;
const longMeta = rows.filter((r) => r.metaLen > 160).length;
const shortMeta = rows.filter((r) => r.metaLen < 130).length;
const longTitle = rows.filter((r) => r.titleLen > 60).length;

const issueCounts = new Map<string, number>();
rows.forEach((r) => r.issues.forEach((i) => {
  const key = i.replace(/\d+/g, 'N');
  issueCounts.set(key, (issueCounts.get(key) ?? 0) + 1);
}));
const topIssues = [...issueCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

const intentBreakdown = rows.reduce<Record<string, number>>((acc, r) => { acc[r.intent] = (acc[r.intent] ?? 0) + 1; return acc; }, {});

const md = `# XTSY SEO — AI-Answer Eligibility Audit

Generated: ${new Date().toISOString()}
Scope: pillars (${PILLAR_PAGES.length}) + destinations (${DESTINATION_PAGES.length}) + hostel pages — total **${total}**

## Health snapshot

- **Average score**: ${avg}/100
- **Grades**: A:${byGrade.A ?? 0} · B:${byGrade.B ?? 0} · C:${byGrade.C ?? 0} · D:${byGrade.D ?? 0} · F:${byGrade.F ?? 0}
- Pages **without quickAnswer**: ${noQA} (${Math.round(noQA / total * 100)}%)
- Pages with **<6 FAQs**: ${thinFaq}
- Meta description out of range (130–160): short ${shortMeta}, long ${longMeta}
- Titles **>60 chars**: ${longTitle}

## Why CTR / rankings dropped

Google AI Overviews + traditional SERPs are weighting **answer-first content blocks**, **structured FAQs**, and **entity-rich bullets**. Pages that open with marketing copy ("Looking for…", "Welcome to…") rather than a direct answer get demoted in:

1. AI Overview citation eligibility (needs concise quickAnswer + Speakable)
2. Featured snippet selection (needs 40-60 word answer block early)
3. People-Also-Ask inclusion (needs ≥6 well-sized FAQs)
4. CTR (titles >60 chars get truncated; meta out of range gets rewritten)

The audit shows **${noQA}/${total}** of your priority pages are missing the quickAnswer block entirely — this alone explains a large share of the AI-answer drop.

## Intent breakdown (recommended rewrite format)

${Object.entries(intentBreakdown).map(([k, v]) => `- **${k}** → ${v} pages → format: \`${recommendedFormat(k)}\``).join('\n')}

## Top 10 recurring issues

${topIssues.map(([k, v], i) => `${i + 1}. ${k} — **${v} pages**`).join('\n')}

## Bottom-30 priority rewrite queue

| Rank | Score | Grade | Slug | Intent | Format | Top issues |
|---:|---:|:--:|---|---|---|---|
${rows.slice(0, 30).map((r, i) => `| ${i + 1} | ${r.score} | ${r.grade} | \`${r.slug}\` | ${r.intent} | ${r.recommended} | ${r.issues.slice(0, 2).join('; ')} |`).join('\n')}

## Next step (recommended)

Approve the **auto-rewrite pass** to regenerate overrides for every page scoring <70 using the per-intent format. Each rewrite enforces:

- 30-word direct lead answer (= quickAnswer, mirrored as intro opener)
- 5 entity-fact bullets (price · location · duration · contact · USP) for transactional/price intents
- Comparison table for \`comparison\` intent
- Day-by-day list for \`itinerary\` intent
- 8 FAQs, each 25–280 chars
- Title 50–58 chars with primary keyword + hook
- Meta 145–158 chars

Output → \`src/data/seoPagesOverrides.ts\` (extended) + Speakable + FAQPage schema already wired.

CSV with all ${total} pages: \`/mnt/documents/seo-ai-answer-audit.csv\`
`;

writeFileSync('/mnt/documents/seo-ai-answer-audit.md', md);

console.log(JSON.stringify({
  total, avg, byGrade, noQA, thinFaq, longTitle, shortMeta, longMeta,
  bottom5: rows.slice(0, 5).map((r) => ({ slug: r.slug, score: r.score, grade: r.grade })),
}, null, 2));
