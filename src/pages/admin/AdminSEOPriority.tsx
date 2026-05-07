/**
 * Admin SEO Priority — 4-tab dashboard:
 *  1. Overrides Status — top-20 pages: AI override + sitemap + prerender presence (live HTML check)
 *  2. URL Verifier — single URL fetch, exact normalized title/meta comparison + diff report
 *  3. Top-20 Export — CSV/TXT download for GSC "Request Indexing"
 *  4. GSC CSV Re-rank — upload Performance export, persist queue in localStorage, re-open last run
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleCard, AppleSectionHeader } from '@/components/admin/AppleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2,
  XCircle,
  Download,
  Upload,
  Loader2,
  ExternalLink,
  PlayCircle,
  RefreshCw,
} from 'lucide-react';
import { findSEOPage } from '@/data/seoPages';
import { OVERRIDE_SLUGS, OVERRIDES_LAST_UPDATED } from '@/data/seoPagesOverridesMeta';
import { supabase } from '@/integrations/supabase/client';

const SITE = 'https://xtsy.one';
const GSC_STORAGE_KEY = 'xtsy.seo.gscRerank.v1';
const BATCH_STORAGE_KEY = 'xtsy.seo.batchVerify.v1';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function normalize(s: string | undefined | null): string {
  return (s ?? '')
    .replace(/\s+/g, ' ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2014/g, '—')
    .trim()
    .toLowerCase();
}

function downloadBlob(content: string, filename: string, type = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function csvCell(v: unknown): string {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// ─────────────────────────────────────────────────────────────────────────────
// Edge-function wrapper
// ─────────────────────────────────────────────────────────────────────────────
interface VerifyData {
  ok?: boolean;
  status?: number;
  finalUrl?: string;
  durationMs?: number;
  title?: string;
  metaDescription?: string;
  h1?: string;
  bytes?: number;
  error?: string;
}

async function fetchVerify(url: string): Promise<VerifyData> {
  const { data, error } = await supabase.functions.invoke('seo-url-verifier', { body: { url } });
  if (error) return { error: error.message };
  return data as VerifyData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 1: Overrides Status — sitemap + live prerender check
// ─────────────────────────────────────────────────────────────────────────────
interface BatchRow {
  slug: string;
  url: string;
  expectedTitle: string;
  expectedMeta: string;
  liveTitle?: string;
  liveMeta?: string;
  status?: number;
  titleMatch?: boolean;
  metaMatch?: boolean;
  inPrerender?: boolean; // true if liveTitle non-empty (server returned a real page)
  matchedSource?: 'override+prerender' | 'sitemap' | 'override-only' | 'missing';
  error?: string;
}

function useOverrideStatus() {
  const [sitemapSlugs, setSitemapSlugs] = useState<Set<string> | null>(null);
  useEffect(() => {
    fetch('/sitemap-priority.xml')
      .then((r) => r.text())
      .then((xml) => {
        const slugs = new Set<string>();
        for (const m of xml.matchAll(/<loc>https?:\/\/[^<]+\/([^<]+?)<\/loc>/g)) {
          slugs.add(m[1].replace(/\/$/, ''));
        }
        setSitemapSlugs(slugs);
      })
      .catch(() => setSitemapSlugs(new Set()));
  }, []);
  return { sitemapSlugs };
}

function OverridesStatusTab() {
  const { sitemapSlugs } = useOverrideStatus();
  const [batch, setBatch] = useState<BatchRow[]>(() => {
    try {
      const raw = localStorage.getItem(BATCH_STORAGE_KEY);
      return raw ? (JSON.parse(raw).rows ?? []) : [];
    } catch {
      return [];
    }
  });
  const [batchTs, setBatchTs] = useState<string | null>(() => {
    try {
      const raw = localStorage.getItem(BATCH_STORAGE_KEY);
      return raw ? JSON.parse(raw).ts ?? null : null;
    } catch {
      return null;
    }
  });
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const baseRows = useMemo(() => {
    return OVERRIDE_SLUGS.map((slug) => {
      const page = findSEOPage(slug);
      return {
        slug,
        url: `${SITE}/${slug}`,
        expectedTitle: page?.title ?? '',
        expectedMeta: page?.metaDescription ?? '',
        hasOverride: !!page,
        inSitemap: sitemapSlugs ? sitemapSlugs.has(slug) : null,
      };
    });
  }, [sitemapSlugs]);

  const merged = useMemo(() => {
    const byMap = new Map(batch.map((b) => [b.slug, b]));
    return baseRows.map((r) => ({ ...r, batch: byMap.get(r.slug) }));
  }, [baseRows, batch]);

  const runBatch = useCallback(async () => {
    setRunning(true);
    setProgress(0);
    const results: BatchRow[] = [];
    // Parallel pool of 4
    const queue = [...baseRows];
    const workers = Array.from({ length: 4 }).map(async () => {
      while (queue.length) {
        const r = queue.shift();
        if (!r) break;
        const v = await fetchVerify(r.url);
        const titleMatch = !!v.title && normalize(v.title) === normalize(r.expectedTitle);
        const metaMatch =
          !!v.metaDescription && normalize(v.metaDescription) === normalize(r.expectedMeta);
        const inPrerender = !!v.title && (v.bytes ?? 0) > 2000;
        const matchedSource: BatchRow['matchedSource'] = titleMatch && inPrerender
          ? 'override+prerender'
          : r.inSitemap
            ? 'sitemap'
            : r.hasOverride
              ? 'override-only'
              : 'missing';
        results.push({
          slug: r.slug,
          url: r.url,
          expectedTitle: r.expectedTitle,
          expectedMeta: r.expectedMeta,
          liveTitle: v.title,
          liveMeta: v.metaDescription,
          status: v.status,
          titleMatch,
          metaMatch,
          inPrerender,
          matchedSource,
          error: v.error,
        });
        setProgress((p) => p + 1);
      }
    });
    await Promise.all(workers);
    results.sort((a, b) => OVERRIDE_SLUGS.indexOf(a.slug) - OVERRIDE_SLUGS.indexOf(b.slug));
    const ts = new Date().toISOString();
    setBatch(results);
    setBatchTs(ts);
    localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify({ ts, rows: results }));
    setRunning(false);
  }, [baseRows]);

  const exportBatchCSV = () => {
    const header =
      'slug,url,status,title_match,meta_match,in_prerender,matched_source,expected_title,live_title,expected_meta,live_meta,error\n';
    const body = batch
      .map((r) =>
        [
          r.slug,
          r.url,
          r.status ?? '',
          r.titleMatch ?? '',
          r.metaMatch ?? '',
          r.inPrerender ?? '',
          r.matchedSource ?? '',
          r.expectedTitle,
          r.liveTitle ?? '',
          r.expectedMeta,
          r.liveMeta ?? '',
          r.error ?? '',
        ]
          .map(csvCell)
          .join(','),
      )
      .join('\n');
    downloadBlob(header + body, `xtsy-batch-verify-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const passed = batch.filter((b) => b.titleMatch && b.metaMatch).length;

  return (
    <AppleCard>
      <AppleSectionHeader
        title="Overrides Status"
        subtitle={`${baseRows.filter((r) => r.hasOverride).length}/${baseRows.length} have overrides · last updated ${OVERRIDES_LAST_UPDATED}`}
      />
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Button onClick={runBatch} disabled={running}>
          {running ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Verifying {progress}/{baseRows.length}</>
          ) : (
            <><PlayCircle className="h-4 w-4 mr-2" />Batch verify all 20</>
          )}
        </Button>
        {batch.length > 0 && (
          <>
            <Button variant="outline" onClick={exportBatchCSV}>
              <Download className="h-4 w-4 mr-2" />Download pass/fail CSV
            </Button>
            <span className="text-xs text-muted-foreground">
              {passed}/{batch.length} fully matched · run {batchTs ? new Date(batchTs).toLocaleString() : ''}
            </span>
          </>
        )}
      </div>
      <div className="overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-2">Slug</th>
              <th className="text-left p-2">Title</th>
              <th className="p-2">Override</th>
              <th className="p-2">Sitemap</th>
              <th className="p-2">Prerender</th>
              <th className="p-2">Title=</th>
              <th className="p-2">Meta=</th>
              <th className="p-2">Source</th>
              <th className="p-2">Open</th>
            </tr>
          </thead>
          <tbody>
            {merged.map((r) => (
              <tr key={r.slug} className="border-t">
                <td className="p-2 font-mono text-xs">{r.slug}</td>
                <td className="p-2 truncate max-w-[28ch]" title={r.expectedTitle}>{r.expectedTitle || '(missing)'}</td>
                <td className="p-2 text-center">
                  {r.hasOverride ? <CheckCircle2 className="inline h-4 w-4 text-green-600" /> : <XCircle className="inline h-4 w-4 text-red-500" />}
                </td>
                <td className="p-2 text-center">
                  {r.inSitemap === null ? <Loader2 className="inline h-4 w-4 animate-spin text-muted-foreground" /> :
                    r.inSitemap ? <CheckCircle2 className="inline h-4 w-4 text-green-600" /> : <Badge variant="outline" className="text-xs">missing</Badge>}
                </td>
                <td className="p-2 text-center">
                  {r.batch?.inPrerender === undefined ? <span className="text-muted-foreground text-xs">—</span> :
                    r.batch.inPrerender ? <CheckCircle2 className="inline h-4 w-4 text-green-600" /> : <XCircle className="inline h-4 w-4 text-red-500" />}
                </td>
                <td className="p-2 text-center">
                  {r.batch?.titleMatch === undefined ? <span className="text-muted-foreground text-xs">—</span> :
                    r.batch.titleMatch ? <CheckCircle2 className="inline h-4 w-4 text-green-600" /> : <XCircle className="inline h-4 w-4 text-red-500" />}
                </td>
                <td className="p-2 text-center">
                  {r.batch?.metaMatch === undefined ? <span className="text-muted-foreground text-xs">—</span> :
                    r.batch.metaMatch ? <CheckCircle2 className="inline h-4 w-4 text-green-600" /> : <XCircle className="inline h-4 w-4 text-red-500" />}
                </td>
                <td className="p-2 text-center">
                  {r.batch?.matchedSource ? <Badge variant="secondary" className="text-xs">{r.batch.matchedSource}</Badge> : <span className="text-muted-foreground text-xs">—</span>}
                </td>
                <td className="p-2 text-center">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary">
                    <ExternalLink className="inline h-4 w-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppleCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 2: URL Verifier — exact normalized comparison + diff
// ─────────────────────────────────────────────────────────────────────────────
interface VerifyResult extends VerifyData {
  expectedTitle?: string;
  expectedMeta?: string;
}

function diffLine(expected: string, actual: string): { match: boolean; reason?: string } {
  const e = normalize(expected);
  const a = normalize(actual);
  if (e === a) return { match: true };
  if (!a) return { match: false, reason: 'live value is empty' };
  if (!e) return { match: false, reason: 'no expected value (override missing)' };
  // Find first divergence
  let i = 0;
  while (i < e.length && i < a.length && e[i] === a[i]) i++;
  const around = (s: string) => s.slice(Math.max(0, i - 10), i + 30);
  return {
    match: false,
    reason: `differs at char ${i}: expected "…${around(e)}…" vs live "…${around(a)}…" · len ${e.length} vs ${a.length}`,
  };
}

function VerifierTab() {
  const [url, setUrl] = useState(`${SITE}/best-hostel-in-shillong`);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const run = async () => {
    setLoading(true);
    setResult(null);
    try {
      const slug = url.replace(/^https?:\/\/[^/]+\//, '').replace(/\/$/, '').split(/[?#]/)[0];
      const expected = findSEOPage(slug);
      const data = await fetchVerify(url);
      setResult({ ...data, expectedTitle: expected?.title, expectedMeta: expected?.metaDescription });
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : String(e) });
    } finally {
      setLoading(false);
    }
  };

  const titleDiff = result?.expectedTitle ? diffLine(result.expectedTitle, result.title ?? '') : null;
  const metaDiff = result?.expectedMeta ? diffLine(result.expectedMeta, result.metaDescription ?? '') : null;

  return (
    <AppleCard>
      <AppleSectionHeader
        title="URL Verifier"
        subtitle="Live-fetches the URL, normalizes whitespace/quotes, and confirms title + meta description match exactly."
      />
      <div className="flex gap-2 mb-4">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://xtsy.one/..." />
        <Button onClick={run} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
        </Button>
      </div>
      {result?.error && <Badge variant="destructive">{result.error}</Badge>}
      {result && !result.error && (
        <div className="space-y-3 text-sm">
          <Row label="HTTP" value={`${result.status} (${result.durationMs}ms, ${result.bytes} bytes)`} ok={result.ok} />
          <Row label="Final URL" value={result.finalUrl ?? ''} />
          <Row label="Live <title>" value={result.title ?? ''} ok={titleDiff?.match} />
          {result.expectedTitle && (
            <div className="text-xs text-muted-foreground pl-4">expected: {result.expectedTitle}</div>
          )}
          {titleDiff && !titleDiff.match && (
            <div className="text-xs text-red-600 pl-4">↳ {titleDiff.reason}</div>
          )}
          <Row label="Live meta" value={result.metaDescription ?? ''} ok={metaDiff?.match} />
          {result.expectedMeta && (
            <div className="text-xs text-muted-foreground pl-4">expected: {result.expectedMeta}</div>
          )}
          {metaDiff && !metaDiff.match && (
            <div className="text-xs text-red-600 pl-4">↳ {metaDiff.reason}</div>
          )}
          <Row label="Live <h1>" value={result.h1 ?? ''} />
        </div>
      )}
    </AppleCard>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean | null }) {
  return (
    <div className="flex items-start gap-3 border-b pb-2">
      <div className="w-32 text-muted-foreground text-xs uppercase tracking-wide">{label}</div>
      <div className="flex-1 break-all">{value || <span className="text-muted-foreground">—</span>}</div>
      {ok === true && <CheckCircle2 className="h-4 w-4 text-green-600" />}
      {ok === false && <XCircle className="h-4 w-4 text-red-500" />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 3: Top-20 Export
// ─────────────────────────────────────────────────────────────────────────────
function ExportTab() {
  const rows = useMemo(
    () =>
      OVERRIDE_SLUGS.map((slug) => {
        const page = findSEOPage(slug);
        return {
          slug,
          url: `${SITE}/${slug}`,
          title: page?.title ?? '(missing)',
          metaDescription: page?.metaDescription ?? '',
        };
      }),
    [],
  );
  const downloadCSV = () => {
    const header = 'priority,slug,url,title,meta_description\n';
    const body = rows
      .map((r, i) => [i + 1, r.slug, r.url, r.title, r.metaDescription].map(csvCell).join(','))
      .join('\n');
    downloadBlob(header + body, `xtsy-top20-request-indexing-${new Date().toISOString().slice(0, 10)}.csv`);
  };
  const downloadTxt = () => {
    downloadBlob(rows.map((r) => r.url).join('\n'), 'xtsy-top20-urls.txt', 'text/plain');
  };
  return (
    <AppleCard>
      <AppleSectionHeader
        title="Top 20 — Request Indexing Export"
        subtitle="Submit each URL in Google Search Console → URL Inspection → Request Indexing."
      />
      <div className="flex gap-2 mb-4">
        <Button onClick={downloadCSV}><Download className="h-4 w-4 mr-2" />CSV</Button>
        <Button variant="outline" onClick={downloadTxt}><Download className="h-4 w-4 mr-2" />Plain URLs</Button>
      </div>
      <ol className="space-y-1 text-sm">
        {rows.map((r, i) => (
          <li key={r.slug} className="flex items-center gap-3 border-b py-1">
            <span className="font-mono text-xs text-muted-foreground w-6">{i + 1}.</span>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
              {r.url}
            </a>
          </li>
        ))}
      </ol>
    </AppleCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 4: GSC Re-rank — persist last upload in localStorage
// ─────────────────────────────────────────────────────────────────────────────
interface GSCRow {
  url: string;
  slug: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  opportunity: number;
  hasOverride: boolean;
}

function parseGSC(csv: string): GSCRow[] {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const header = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  const idx = (names: string[]) => header.findIndex((h) => names.some((n) => h.includes(n)));
  const iUrl = idx(['page', 'url', 'top page', 'landing page']);
  const iImp = idx(['impression']);
  const iClk = idx(['click']);
  const iPos = idx(['position']);
  const iCtr = idx(['ctr']);
  if (iUrl < 0 || iImp < 0) return [];
  const overrideSet = new Set(OVERRIDE_SLUGS);
  return lines
    .slice(1)
    .map((line) => {
      const cells = line.match(/("([^"]|"")*"|[^,]+)/g)?.map((c) => c.replace(/^"|"$/g, '').replace(/""/g, '"')) ?? [];
      const url = cells[iUrl] ?? '';
      const impressions = Number(cells[iImp]?.replace(/[,%]/g, '')) || 0;
      const clicks = iClk >= 0 ? Number(cells[iClk]?.replace(/[,%]/g, '')) || 0 : 0;
      const ctr = iCtr >= 0
        ? (Number(cells[iCtr]?.replace(/[,%]/g, '')) / (cells[iCtr]?.includes('%') ? 100 : 1)) || 0
        : impressions ? clicks / impressions : 0;
      const position = iPos >= 0 ? Number(cells[iPos]) || 0 : 0;
      const slug = url.replace(/^https?:\/\/[^/]+\//, '').replace(/\/$/, '').split(/[?#]/)[0];
      const opportunity = impressions * Math.max(0, 1 - ctr) * (position > 7 ? 1.5 : 1);
      return { url, slug, impressions, clicks, ctr, position, opportunity: Math.round(opportunity), hasOverride: overrideSet.has(slug) };
    })
    .filter((r) => r.slug && r.impressions > 0)
    .sort((a, b) => b.opportunity - a.opportunity);
}

function GSCRerankTab() {
  const [rows, setRows] = useState<GSCRow[]>([]);
  const [ts, setTs] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load persisted on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(GSC_STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setRows(p.rows ?? []);
        setTs(p.ts ?? null);
        setFilename(p.filename ?? null);
      }
    } catch { /* ignore */ }
  }, []);

  const onFile = async (file: File) => {
    setError(null);
    try {
      const text = await file.text();
      const parsed = parseGSC(text);
      if (!parsed.length) throw new Error('No rows parsed. Expected GSC Performance CSV with Page + Impressions columns.');
      const newTs = new Date().toISOString();
      setRows(parsed);
      setTs(newTs);
      setFilename(file.name);
      localStorage.setItem(GSC_STORAGE_KEY, JSON.stringify({ ts: newTs, filename: file.name, rows: parsed }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const clear = () => {
    localStorage.removeItem(GSC_STORAGE_KEY);
    setRows([]);
    setTs(null);
    setFilename(null);
  };

  const exportRanked = () => {
    const header = 'rank,opportunity,url,slug,impressions,clicks,ctr,position,has_override\n';
    const body = rows.slice(0, 50)
      .map((r, i) => [i + 1, r.opportunity, r.url, r.slug, r.impressions, r.clicks, r.ctr.toFixed(4), r.position.toFixed(2), r.hasOverride].map(csvCell).join(','))
      .join('\n');
    downloadBlob(header + body, `xtsy-seo-priority-queue-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <AppleCard>
      <AppleSectionHeader
        title="GSC CSV — Re-rank Priority Queue"
        subtitle="Upload Google Search Console Performance export. Opportunity = impressions × (1 − CTR), boosted ×1.5 when avg position > 7. Last upload persists in this browser."
      />
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer border rounded-lg p-3 hover:bg-muted/30 w-fit">
            <Upload className="h-4 w-4" />
            <span>Upload GSC Performance CSV</span>
            <input type="file" accept=".csv,text/csv" className="hidden"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>
          {rows.length > 0 && (
            <>
              <Button onClick={exportRanked} variant="outline">
                <Download className="h-4 w-4 mr-2" />Export top-50
              </Button>
              <Button onClick={clear} variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />Clear saved
              </Button>
            </>
          )}
        </div>
        {ts && (
          <span className="text-xs text-muted-foreground">
            Last upload: {filename ?? '(file)'} · {new Date(ts).toLocaleString()} · {rows.length} rows
          </span>
        )}
        {error && <Badge variant="destructive">{error}</Badge>}
      </div>
      {rows.length > 0 && (
        <div className="overflow-auto rounded-lg border max-h-[60vh]">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 sticky top-0">
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">URL</th>
                <th className="p-2 text-right">Opportunity</th>
                <th className="p-2 text-right">Impr.</th>
                <th className="p-2 text-right">Clicks</th>
                <th className="p-2 text-right">CTR</th>
                <th className="p-2 text-right">Pos.</th>
                <th className="p-2">Override</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map((r, i) => (
                <tr key={r.slug + i} className="border-t">
                  <td className="p-2 text-muted-foreground">{i + 1}</td>
                  <td className="p-2 truncate max-w-[36ch]" title={r.url}>{r.slug}</td>
                  <td className="p-2 text-right font-mono">{r.opportunity.toLocaleString()}</td>
                  <td className="p-2 text-right">{r.impressions.toLocaleString()}</td>
                  <td className="p-2 text-right">{r.clicks.toLocaleString()}</td>
                  <td className="p-2 text-right">{(r.ctr * 100).toFixed(1)}%</td>
                  <td className="p-2 text-right">{r.position.toFixed(1)}</td>
                  <td className="p-2 text-center">
                    {r.hasOverride
                      ? <Badge variant="secondary" className="text-xs">live</Badge>
                      : <Badge variant="outline" className="text-xs">queue</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppleCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminSEOPriority() {
  return (
    <UnifiedAdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">SEO Priority — Top-7 Push</h1>
        <p className="text-sm text-muted-foreground">
          Verify, export, and re-rank the high-impression optimization queue.
        </p>
      </div>
      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Overrides Status</TabsTrigger>
          <TabsTrigger value="verify">URL Verifier</TabsTrigger>
          <TabsTrigger value="export">Top-20 Export</TabsTrigger>
          <TabsTrigger value="rerank">GSC Re-rank</TabsTrigger>
        </TabsList>
        <TabsContent value="status"><OverridesStatusTab /></TabsContent>
        <TabsContent value="verify"><VerifierTab /></TabsContent>
        <TabsContent value="export"><ExportTab /></TabsContent>
        <TabsContent value="rerank"><GSCRerankTab /></TabsContent>
      </Tabs>
    </UnifiedAdminLayout>
  );
}
