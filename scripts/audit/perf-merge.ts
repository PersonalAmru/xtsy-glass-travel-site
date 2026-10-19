/**
 * Merge the perf-full lab shards and PageSpeed shards into one report:
 *   <OUT>/lab.json, <OUT>/psi.json  — every URL
 *   <OUT>/summary.json              — totals, per-template medians and p75s, worst pages, uncached files
 *   <OUT>/report.md                 — the same, readable
 * Pass/fail thresholds follow Google's Core Web Vitals: LCP ≤ 2.5 s, CLS ≤ 0.1, (TBT ≤ 200 ms as INP proxy).
 */
import fs from 'fs';

const OUT = process.env.OUT_DIR || 'perf';
const LABEL = process.env.LABEL || 'run';
const read = (prefix: string) => fs.readdirSync(OUT).filter((f) => f.startsWith(prefix + '-') && f.endsWith('.json'))
  .flatMap((f) => JSON.parse(fs.readFileSync(`${OUT}/${f}`, 'utf8')) as Record<string, any>[]);

const lab = read('lab');
const psi = read('psi');
fs.writeFileSync(`${OUT}/lab.json`, JSON.stringify(lab));
fs.writeFileSync(`${OUT}/psi.json`, JSON.stringify(psi));

const q = (xs: number[], p: number) => { const s = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : 0; };
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
const okLab = lab.filter((r) => r.cold && !r.error);
const okPsi = psi.filter((r) => typeof r.score === 'number');

const templates = [...new Set(lab.map((r) => r.sitemap as string))].sort();
const byTemplate = templates.map((t) => {
  const L = okLab.filter((r) => r.sitemap === t); const P = okPsi.filter((r) => r.sitemap === t);
  return {
    template: t, pages: lab.filter((r) => r.sitemap === t).length,
    labLcpMedian: q(L.map((r) => r.cold.lcp), 0.5), labLcpP75: q(L.map((r) => r.cold.lcp), 0.75),
    labFcpMedian: q(L.map((r) => r.cold.fcp), 0.5), clsMax: Math.max(0, ...L.map((r) => r.cold.cls)),
    labGoodLcp: pct(L.filter((r) => r.cold.lcp <= 2500).length, L.length),
    coldKbMedian: q(L.map((r) => r.cold.bytes), 0.5), warmKbMedian: q(L.filter((r) => r.warm).map((r) => r.warm.bytes), 0.5),
    jsKbMedian: q(L.map((r) => r.cold.jsKb), 0.5), requestsMedian: q(L.map((r) => r.cold.requests), 0.5),
    psiScoreMedian: q(P.map((r) => r.score), 0.5), psiScoreMin: P.length ? Math.min(...P.map((r) => r.score)) : null,
    psiLcpMedian: q(P.map((r) => r.lcp), 0.5), psiTbtMedian: q(P.map((r) => r.tbt), 0.5),
  };
});

const uncached = new Map<string, { kb: number; cc: string; pages: number }>();
for (const r of okLab) for (const u of r.uncached ?? []) {
  const k = u.url.replace(/\?.*$/, ''); const e = uncached.get(k) ?? { kb: u.kb, cc: u.cc, pages: 0 }; e.pages++; uncached.set(k, e);
}
const opCount = new Map<string, { title: string; pages: number; lcpMs: number }>();
for (const r of okPsi) for (const o of r.ops ?? []) {
  const e = opCount.get(o.id) ?? { title: o.title, pages: 0, lcpMs: 0 }; e.pages++; e.lcpMs += o.lcpMs; opCount.set(o.id, e);
}
const errorsByMsg = new Map<string, number>();
for (const r of okLab) for (const e of r.errors ?? []) errorsByMsg.set(e, (errorsByMsg.get(e) ?? 0) + 1);

const summary = {
  label: LABEL, at: new Date().toISOString(), pages: lab.length,
  lab: {
    measured: okLab.length, failed: lab.length - okLab.length,
    lcpMedian: q(okLab.map((r) => r.cold.lcp), 0.5), lcpP75: q(okLab.map((r) => r.cold.lcp), 0.75), lcpP95: q(okLab.map((r) => r.cold.lcp), 0.95),
    fcpMedian: q(okLab.map((r) => r.cold.fcp), 0.5), ttfbMedian: q(okLab.map((r) => r.cold.ttfb), 0.5),
    goodLcpPct: pct(okLab.filter((r) => r.cold.lcp <= 2500).length, okLab.length),
    poorLcpPct: pct(okLab.filter((r) => r.cold.lcp > 4000).length, okLab.length),
    clsOverPointOne: okLab.filter((r) => r.cold.cls > 0.1).map((r) => ({ path: r.path, cls: r.cold.cls })),
    tbtMedian: q(okLab.map((r) => r.cold.tbt), 0.5),
    coldKbMedian: q(okLab.map((r) => r.cold.bytes), 0.5), warmKbMedian: q(okLab.filter((r) => r.warm).map((r) => r.warm.bytes), 0.5),
    jsKbMedian: q(okLab.map((r) => r.cold.jsKb), 0.5), jsFilesMedian: q(okLab.map((r) => r.cold.jsFiles), 0.5),
    thirdParties: [...new Set(okLab.flatMap((r) => r.cold.thirdParty ?? []))],
    non200: lab.filter((r) => r.cold && r.cold.status !== 200).map((r) => ({ path: r.path, status: r.cold.status })),
  },
  psi: {
    measured: okPsi.length, failed: psi.length - okPsi.length,
    scoreMedian: q(okPsi.map((r) => r.score), 0.5), scoreP25: q(okPsi.map((r) => r.score), 0.25),
    score90plusPct: pct(okPsi.filter((r) => r.score >= 90).length, okPsi.length),
    lcpMedian: q(okPsi.map((r) => r.lcp), 0.5), fcpMedian: q(okPsi.map((r) => r.fcp), 0.5), tbtMedian: q(okPsi.map((r) => r.tbt), 0.5),
    withFieldData: okPsi.filter((r) => r.field).length, originField: okPsi.find((r) => r.fieldOrigin)?.fieldOrigin ?? null,
    topOpportunities: [...opCount.entries()].map(([id, v]) => ({ id, ...v, avgLcpMs: Math.round(v.lcpMs / v.pages) })).sort((a, b) => b.pages - a.pages).slice(0, 10),
  },
  byTemplate,
  worstLab: [...okLab].sort((a, b) => b.cold.lcp - a.cold.lcp).slice(0, 25).map((r) => ({ path: r.path, lcp: r.cold.lcp, fcp: r.cold.fcp, el: r.cold.lcpEl, kb: r.cold.bytes })),
  worstPsi: [...okPsi].sort((a, b) => a.score - b.score).slice(0, 25).map((r) => ({ path: r.path, score: r.score, lcp: r.lcp, tbt: r.tbt })),
  uncached: [...uncached.entries()].map(([url, v]) => ({ url, ...v })).sort((a, b) => b.pages - a.pages).slice(0, 40),
  uncachedFilesTotal: uncached.size,
  consoleErrors: [...errorsByMsg.entries()].map(([msg, pages]) => ({ msg, pages })).sort((a, b) => b.pages - a.pages).slice(0, 15),
};
fs.writeFileSync(`${OUT}/summary.json`, JSON.stringify(summary, null, 1));

const s = (ms: number) => (ms / 1000).toFixed(2) + ' s';
const md = [
  `# Full-site performance — ${LABEL} (${summary.at.slice(0, 16)} UTC)`, '',
  `Pages: ${summary.pages}. Lab profile: mid-range phone, Slow 4G, 4x CPU, cold cache (warm = repeat visit).`, '',
  `| Measure | Value |`, `|---|---|`,
  `| Lab LCP median / p75 / p95 | ${s(summary.lab.lcpMedian)} / ${s(summary.lab.lcpP75)} / ${s(summary.lab.lcpP95)} |`,
  `| Pages with good LCP (≤ 2.5 s) | ${summary.lab.goodLcpPct}% (poor > 4 s: ${summary.lab.poorLcpPct}%) |`,
  `| FCP median / TTFB median | ${s(summary.lab.fcpMedian)} / ${summary.lab.ttfbMedian} ms |`,
  `| Pages with CLS > 0.1 | ${summary.lab.clsOverPointOne.length} |`,
  `| Data per first visit / repeat visit (median) | ${summary.lab.coldKbMedian} KB / ${summary.lab.warmKbMedian} KB |`,
  `| JavaScript (median) | ${summary.lab.jsKbMedian} KB in ${summary.lab.jsFilesMedian} files |`,
  `| PageSpeed score median (p25) | ${summary.psi.scoreMedian} (${summary.psi.scoreP25}); ${summary.psi.score90plusPct}% of pages ≥ 90 |`,
  `| PageSpeed LCP / FCP / TBT median | ${s(summary.psi.lcpMedian)} / ${s(summary.psi.fcpMedian)} / ${summary.psi.tbtMedian} ms |`,
  `| Static files without long caching | ${summary.uncachedFilesTotal} |`, '',
  `## By template`, '', `| Template | Pages | Lab LCP med / p75 | Good LCP | PSI score med (min) | PSI LCP med | KB first / repeat |`, `|---|---|---|---|---|---|---|`,
  ...byTemplate.map((t) => `| ${t.template} | ${t.pages} | ${s(t.labLcpMedian)} / ${s(t.labLcpP75)} | ${t.labGoodLcp}% | ${t.psiScoreMedian} (${t.psiScoreMin ?? '-'}) | ${s(t.psiLcpMedian)} | ${t.coldKbMedian} / ${t.warmKbMedian} |`), '',
  `## Most common PageSpeed opportunities`, '', ...summary.psi.topOpportunities.map((o) => `- ${o.title} — ${o.pages} pages, ~${o.avgLcpMs} ms LCP saving each`), '',
  `## Slowest pages (lab LCP)`, '', ...summary.worstLab.slice(0, 15).map((w) => `- ${w.path} — ${s(w.lcp)} (${w.el})`), '',
  `## Lowest PageSpeed scores`, '', ...summary.worstPsi.slice(0, 15).map((w) => `- ${w.path} — ${w.score} (LCP ${s(w.lcp)})`), '',
  `## Console errors`, '', ...summary.consoleErrors.map((e) => `- ${e.pages} pages: ${e.msg}`),
].join('\n');
fs.writeFileSync(`${OUT}/report.md`, md);
console.log(md);
