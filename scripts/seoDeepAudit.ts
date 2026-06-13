/**
 * Deep SEO health audit — validates every page in ALL_SEO_PAGES (pillar,
 * static and dynamically-generated) for ranking-readiness: meta tag length,
 * title/H1/description keyword relevance, duplication, content depth, schema,
 * internal-link integrity and CTA validity.
 *
 * Run: bun run scripts/seoDeepAudit.ts
 * Writes a full CSV + markdown report to /mnt/documents/.
 */
import { writeFileSync } from 'fs';
import { ALL_SEO_PAGES, findSEOPage } from '../src/data/seoPages';
import type { SEOPageData } from '../src/data/seoPages';


const TITLE_MIN = 30;
const TITLE_MAX = 60;
const DESC_MIN = 110;
const DESC_MAX = 160;
const THIN_WORDS = 300;

interface Issue { slug: string; sev: 'CRIT' | 'WARN' | 'INFO'; rule: string; detail: string; }
const issues: Issue[] = [];
const add = (slug: string, sev: Issue['sev'], rule: string, detail: string) =>
  issues.push({ slug, sev, rule, detail });

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const tokens = (s: string) => new Set(norm(s).split(' ').filter(w => w.length > 3));

// Stop-y/brand words excluded from "relevance" overlap so we measure topical match.
const STOP = new Set(['xtsy','best','book','your','with','from','near','2025','2026','travel','guide','stay','shillong','meghalaya']);

// Static routes that relatedSlugs may legitimately point to (not SEO registry).
const STATIC_SAFE = new Set([
  'meghalaya-travel-guide','things-to-do-in-meghalaya','meghalaya-tour-packages',
  'shillong-tour-package','best-hostel-in-shillong','meghalaya-waterfalls',
  'meghalaya-caves','meghalaya-villages','meghalaya-viewpoints','shillong-travel-guide',
  'cherrapunji-travel-guide','hotels-in-shillong','homestays-in-shillong',
  'places-to-visit-meghalaya','waterfalls-in-meghalaya','trekking-in-meghalaya',
  'things-to-do-meghalaya','meghalaya-itinerary',
]);

function pageWordCount(p: SEOPageData): number {
  let n = words(p.intro);
  for (const s of p.sections) {
    n += words(s.heading) + words(s.content);
    if (s.listItems) n += s.listItems.reduce((a, li) => a + words(li), 0);
  }
  for (const f of p.faqs) n += words(f.question) + words(f.answer);
  return n;
}

// Does the primary keyword (keywords[0]) appear in title & description?
function keywordRelevance(p: SEOPageData) {
  const kw = (p.keywords?.[0] ?? '').trim();
  if (!kw) { add(p.slug, 'WARN', 'keywords', 'No keywords defined'); return; }
  const nk = norm(kw);
  const kwTokens = norm(kw).split(' ').filter(w => w.length > 2);
  const inTitle = kwTokens.every(t => norm(p.title).includes(t));
  const inDesc = kwTokens.every(t => norm(p.metaDescription).includes(t));
  if (!inTitle) add(p.slug, 'WARN', 'kw-in-title', `Primary keyword "${kw}" not fully in <title>`);
  if (!inDesc) add(p.slug, 'INFO', 'kw-in-desc', `Primary keyword "${kw}" not fully in meta description`);
  void nk;
}

// H1 must be topically aligned with the title (shared meaningful tokens).
function h1TitleAlignment(p: SEOPageData) {
  const t = [...tokens(p.title)].filter(w => !STOP.has(w));
  const h = tokens(p.h1);
  if (t.length === 0) return;
  const overlap = t.filter(w => h.has(w)).length / t.length;
  if (overlap < 0.34) add(p.slug, 'WARN', 'h1-title-mismatch',
    `H1 ("${p.h1}") shares little topical overlap with title ("${p.title}")`);
}

// Description must actually describe the page (overlap with H1/intro topic).
function descRelevance(p: SEOPageData) {
  const body = tokens(p.h1 + ' ' + p.intro);
  const d = [...tokens(p.metaDescription)].filter(w => !STOP.has(w));
  if (d.length === 0) return;
  const overlap = d.filter(w => body.has(w)).length / d.length;
  if (overlap < 0.25) add(p.slug, 'WARN', 'desc-irrelevant',
    `Meta description topically diverges from page content (overlap ${(overlap*100|0)}%)`);
}

for (const p of ALL_SEO_PAGES) {
  // --- Meta title ---
  const tl = p.title?.length ?? 0;
  if (!p.title) add(p.slug, 'CRIT', 'title-missing', 'No title');
  else if (tl > TITLE_MAX) add(p.slug, 'WARN', 'title-long', `Title ${tl} chars (>${TITLE_MAX}, truncates in SERP)`);
  else if (tl < TITLE_MIN) add(p.slug, 'WARN', 'title-short', `Title ${tl} chars (<${TITLE_MIN}, under-optimised)`);

  // --- Meta description ---
  const dl = p.metaDescription?.length ?? 0;
  if (!p.metaDescription) add(p.slug, 'CRIT', 'desc-missing', 'No meta description');
  else if (dl > DESC_MAX) add(p.slug, 'WARN', 'desc-long', `Description ${dl} chars (>${DESC_MAX}, truncates)`);
  else if (dl < DESC_MIN) add(p.slug, 'WARN', 'desc-short', `Description ${dl} chars (<${DESC_MIN}, thin snippet)`);

  // --- H1 ---
  if (!p.h1) add(p.slug, 'CRIT', 'h1-missing', 'No H1');

  // --- Content depth ---
  const wc = pageWordCount(p);
  if (wc < THIN_WORDS) add(p.slug, 'WARN', 'thin-content', `Only ${wc} words (<${THIN_WORDS}, doorway-page risk)`);

  // --- FAQ / schema ---
  if (!p.faqs || p.faqs.length < 2) add(p.slug, 'INFO', 'few-faqs', `${p.faqs?.length ?? 0} FAQs (FAQ schema weak)`);
  if (!p.schemaType) add(p.slug, 'WARN', 'schema-missing', 'No schemaType');

  // --- Relevance checks ---
  keywordRelevance(p);
  h1TitleAlignment(p);
  descRelevance(p);

  // --- Internal links resolve ---
  const broken = (p.relatedSlugs ?? []).filter(s => !findSEOPage(s) && !STATIC_SAFE.has(s));
  if (broken.length) add(p.slug, 'INFO', 'related-unresolved', `relatedSlugs not in registry: ${broken.join(', ')}`);

  // --- CTA ---
  if (!p.ctaLink) add(p.slug, 'WARN', 'cta-missing', 'No CTA link');
}

// --- Duplicate detection ---
const byTitle = new Map<string, string[]>();
const byDesc = new Map<string, string[]>();
const byH1 = new Map<string, string[]>();
for (const p of ALL_SEO_PAGES) {
  (byTitle.get(norm(p.title)) ?? byTitle.set(norm(p.title), []).get(norm(p.title))!).push(p.slug);
  (byDesc.get(norm(p.metaDescription)) ?? byDesc.set(norm(p.metaDescription), []).get(norm(p.metaDescription))!).push(p.slug);
  (byH1.get(norm(p.h1)) ?? byH1.set(norm(p.h1), []).get(norm(p.h1))!).push(p.slug);
}
let dupTitles = 0, dupDescs = 0, dupH1 = 0;
for (const [, slugs] of byTitle) if (slugs.length > 1) { dupTitles++; add(slugs[0], 'CRIT', 'dup-title', `Duplicate title shared by ${slugs.length} pages: ${slugs.slice(0,5).join(', ')}${slugs.length>5?'…':''}`); }
for (const [, slugs] of byDesc) if (slugs.length > 1) { dupDescs++; add(slugs[0], 'CRIT', 'dup-desc', `Duplicate description shared by ${slugs.length} pages: ${slugs.slice(0,5).join(', ')}${slugs.length>5?'…':''}`); }
for (const [, slugs] of byH1) if (slugs.length > 1) { dupH1++; add(slugs[0], 'WARN', 'dup-h1', `Duplicate H1 shared by ${slugs.length} pages`); }

// ============ REPORT ============
const total = ALL_SEO_PAGES.length;
const crit = issues.filter(i => i.sev === 'CRIT');
const warn = issues.filter(i => i.sev === 'WARN');
const info = issues.filter(i => i.sev === 'INFO');

const byCat = new Map<string, number>();
for (const p of ALL_SEO_PAGES) byCat.set(p.category, (byCat.get(p.category) ?? 0) + 1);

const byRule = new Map<string, number>();
for (const i of issues) byRule.set(i.rule, (byRule.get(i.rule) ?? 0) + 1);

console.log('\n================ SEO DEEP AUDIT ================');
console.log(`Indexable pages audited : ${total}`);
console.log(`Critical issues         : ${crit.length}`);
console.log(`Warnings                : ${warn.length}`);
console.log(`Info / opportunities    : ${info.length}`);
const clean = total - new Set(issues.filter(i=>i.sev!=='INFO').map(i=>i.slug)).size;
console.log(`Pages with no CRIT/WARN : ${clean} (${(clean/total*100).toFixed(1)}%)`);

console.log('\n--- Pages per category ---');
[...byCat.entries()].sort((a,b)=>b[1]-a[1]).forEach(([c,n]) => console.log(`  ${c.padEnd(22)} ${n}`));

console.log('\n--- Issues grouped by rule ---');
[...byRule.entries()].sort((a,b)=>b[1]-a[1]).forEach(([r,n]) => console.log(`  ${r.padEnd(22)} ${n}`));

console.log('\n--- Duplicate summary ---');
console.log(`  Duplicate titles groups : ${dupTitles}`);
console.log(`  Duplicate descriptions  : ${dupDescs}`);
console.log(`  Duplicate H1 groups     : ${dupH1}`);

const show = (label: string, list: Issue[], n: number) => {
  console.log(`\n--- ${label} (showing ${Math.min(n,list.length)} of ${list.length}) ---`);
  list.slice(0, n).forEach(i => console.log(`  [${i.rule}] ${i.slug}: ${i.detail}`));
};
show('CRITICAL', crit, 40);
show('WARNINGS', warn, 50);
console.log('\n================ END ================\n');

// ============ FILE EXPORTS ============
// Detect true duplicate slugs (same slug defined twice in the registry).
const slugCounts = new Map<string, number>();
for (const p of ALL_SEO_PAGES) slugCounts.set(p.slug, (slugCounts.get(p.slug) ?? 0) + 1);
const dupSlugs = [...slugCounts.entries()].filter(([, n]) => n > 1);

const csv = ['slug,severity,rule,detail',
  ...issues.map(i => `"${i.slug}","${i.sev}","${i.rule}","${i.detail.replace(/"/g, "'")}"`)].join('\n');
writeFileSync('/mnt/documents/seo-audit-issues.csv', csv);

const md = `# XTSY — Deep SEO Health Audit
_Generated ${new Date().toISOString().slice(0,10)} • ${total} indexable pages_

## Scorecard
| Metric | Value |
|---|---|
| Indexable pages audited | ${total} |
| Critical issues | ${crit.length} |
| Warnings | ${warn.length} |
| Info / opportunities | ${info.length} |
| Pages clean (no CRIT/WARN) | ${clean} (${(clean/total*100).toFixed(1)}%) |
| Duplicate title groups | ${dupTitles} |
| Duplicate description groups | ${dupDescs} |
| Duplicate H1 groups | ${dupH1} |
| True duplicate slugs (registry bug) | ${dupSlugs.length} |

## Issues by rule
${[...byRule.entries()].sort((a,b)=>b[1]-a[1]).map(([r,n])=>`- \`${r}\` — ${n}`).join('\n')}

## True duplicate slugs (defined more than once)
${dupSlugs.length ? dupSlugs.map(([s,n])=>`- \`${s}\` ×${n}`).join('\n') : '_None_'}

## All CRITICAL issues
${crit.map(i=>`- **${i.slug}** \`${i.rule}\` — ${i.detail}`).join('\n')}

## All WARNINGS
${warn.map(i=>`- ${i.slug} \`${i.rule}\` — ${i.detail}`).join('\n')}
`;
writeFileSync('/mnt/documents/seo-audit-report.md', md);
console.log('Reports written: /mnt/documents/seo-audit-report.md , /mnt/documents/seo-audit-issues.csv');
console.log(`True duplicate slugs: ${dupSlugs.length}`, dupSlugs.map(d=>d[0]).join(', '));

