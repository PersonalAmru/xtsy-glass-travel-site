/**
 * Admin SEO Priority — 4-tab dashboard:
 *  1. Overrides Status — which top-20 pages have AI overrides + sitemap/prerender presence
 *  2. URL Verifier — live-fetch a URL via edge function, confirm rendered title/meta
 *  3. Top-20 Export — CSV download for GSC "Request Indexing" workflow
 *  4. GSC CSV Re-rank — upload Performance export, recompute optimization queue
 */
import { useEffect, useMemo, useState } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleCard, AppleSectionHeader } from '@/components/admin/AppleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, Download, Upload, Loader2, ExternalLink } from 'lucide-react';
import { findSEOPage } from '@/data/seoPages';
import { OVERRIDE_SLUGS, OVERRIDES_LAST_UPDATED } from '@/data/seoPagesOverridesMeta';
import { supabase } from '@/integrations/supabase/client';

const SITE = 'https://xtsy.one';

// ─────────────────────────────────────────────────────────────────────────────
// Tab 1 + 3: Overrides status + CSV export
// ─────────────────────────────────────────────────────────────────────────────
function useOverrideStatus() {
  const [sitemapSlugs, setSitemapSlugs] = useState<Set<string> | null>(null);
  useEffect(() => {
    fetch('/sitemap-priority.xml')
      .then((r) => r.text())
      .then((xml) => {
        const slugs = new Set<string>();
        for (const m of xml.matchAll(/<loc>https?:\/\/[^<]+\/([^<\/]+)<\/loc>/g)) {
          slugs.add(m[1]);
        }
        setSitemapSlugs(slugs);
      })
      .catch(() => setSitemapSlugs(new Set()));
  }, []);

  return useMemo(() => {
    return OVERRIDE_SLUGS.map((slug) => {
      const page = findSEOPage(slug);
      return {
        slug,
        url: `${SITE}/${slug}`,
        title: page?.title ?? '(missing)',
        metaDescription: page?.metaDescription ?? '',
        hasOverride: !!page,
        inSitemap: sitemapSlugs ? sitemapSlugs.has(slug) : null,
      };
    });
  }, [sitemapSlugs]);
}

function OverridesStatusTab() {
  const rows = useOverrideStatus();
  const ok = rows.filter((r) => r.hasOverride).length;
  return (
    <AppleCard>
      <AppleSectionHeader
        title="Overrides Status"
        subtitle={`${ok}/${rows.length} pages have AI overrides · last updated ${OVERRIDES_LAST_UPDATED}`}
      />
      <div className="overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left p-2">Slug</th>
              <th className="text-left p-2">Title</th>
              <th className="p-2">Override</th>
              <th className="p-2">Sitemap</th>
              <th className="p-2">Open</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t">
                <td className="p-2 font-mono text-xs">{r.slug}</td>
                <td className="p-2 truncate max-w-[28ch]" title={r.title}>{r.title}</td>
                <td className="p-2 text-center">
                  {r.hasOverride ? (
                    <CheckCircle2 className="inline h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="inline h-4 w-4 text-red-500" />
                  )}
                </td>
                <td className="p-2 text-center">
                  {r.inSitemap === null ? (
                    <Loader2 className="inline h-4 w-4 animate-spin text-muted-foreground" />
                  ) : r.inSitemap ? (
                    <CheckCircle2 className="inline h-4 w-4 text-green-600" />
                  ) : (
                    <Badge variant="outline" className="text-xs">missing</Badge>
                  )}
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

function ExportTab() {
  const rows = useOverrideStatus();
  const downloadCSV = () => {
    const header = 'priority,slug,url,title,meta_description\n';
    const body = rows
      .map(
        (r, i) =>
          `${i + 1},${r.slug},${r.url},"${r.title.replace(/"/g, '""')}","${r.metaDescription.replace(/"/g, '""')}"`,
      )
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xtsy-top20-request-indexing-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const downloadTxt = () => {
    const txt = rows.map((r) => r.url).join('\n');
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xtsy-top20-urls.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
// Tab 2: URL Verifier (uses edge function for CORS-safe fetch)
// ─────────────────────────────────────────────────────────────────────────────
interface VerifyResult {
  ok?: boolean;
  status?: number;
  finalUrl?: string;
  durationMs?: number;
  title?: string;
  metaDescription?: string;
  h1?: string;
  bytes?: number;
  error?: string;
  expectedTitle?: string;
  expectedMeta?: string;
}

function VerifierTab() {
  const [url, setUrl] = useState(`${SITE}/best-hostel-in-shillong`);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const run = async () => {
    setLoading(true);
    setResult(null);
    try {
      const slug = url.replace(/^https?:\/\/[^/]+\//, '').split(/[?#]/)[0];
      const expected = findSEOPage(slug);
      const { data, error } = await supabase.functions.invoke('seo-url-verifier', {
        body: { url },
      });
      if (error) throw error;
      setResult({
        ...data,
        expectedTitle: expected?.title,
        expectedMeta: expected?.metaDescription,
      });
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : String(e) });
    } finally {
      setLoading(false);
    }
  };

  const titleMatches =
    result?.title && result.expectedTitle && result.title.includes(result.expectedTitle.slice(0, 30));
  const metaMatches =
    result?.metaDescription &&
    result.expectedMeta &&
    result.metaDescription.includes(result.expectedMeta.slice(0, 40));

  return (
    <AppleCard>
      <AppleSectionHeader
        title="URL Verifier"
        subtitle="Live-fetches the URL server-side and confirms the rendered title/meta match the expected override."
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
          <Row label="Rendered <title>" value={result.title ?? ''} ok={titleMatches} />
          {result.expectedTitle && (
            <div className="text-xs text-muted-foreground pl-4">expected: {result.expectedTitle}</div>
          )}
          <Row label="Rendered meta" value={result.metaDescription ?? ''} ok={metaMatches} />
          {result.expectedMeta && (
            <div className="text-xs text-muted-foreground pl-4">expected: {result.expectedMeta}</div>
          )}
          <Row label="Rendered <h1>" value={result.h1 ?? ''} />
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
// Tab 4: GSC CSV upload + re-rank
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
      const ctr = iCtr >= 0 ? Number(cells[iCtr]?.replace(/[,%]/g, '')) / (cells[iCtr]?.includes('%') ? 100 : 1) || 0 : impressions ? clicks / impressions : 0;
      const position = iPos >= 0 ? Number(cells[iPos]) || 0 : 0;
      const slug = url.replace(/^https?:\/\/[^/]+\//, '').replace(/\/$/, '').split(/[?#]/)[0];
      const opportunity = impressions * Math.max(0, 1 - ctr) * (position > 7 ? 1.5 : 1);
      return {
        url,
        slug,
        impressions,
        clicks,
        ctr,
        position,
        opportunity: Math.round(opportunity),
        hasOverride: overrideSet.has(slug),
      };
    })
    .filter((r) => r.slug && r.impressions > 0)
    .sort((a, b) => b.opportunity - a.opportunity);
}

function GSCRerankTab() {
  const [rows, setRows] = useState<GSCRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file: File) => {
    setError(null);
    try {
      const text = await file.text();
      const parsed = parseGSC(text);
      if (!parsed.length) throw new Error('No rows parsed. Expected GSC Performance CSV with Page, Impressions columns.');
      setRows(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const exportRanked = () => {
    const header = 'rank,opportunity,url,slug,impressions,clicks,ctr,position,has_override\n';
    const body = rows
      .slice(0, 50)
      .map(
        (r, i) =>
          `${i + 1},${r.opportunity},${r.url},${r.slug},${r.impressions},${r.clicks},${r.ctr.toFixed(4)},${r.position.toFixed(2)},${r.hasOverride}`,
      )
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xtsy-seo-priority-queue-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppleCard>
      <AppleSectionHeader
        title="GSC CSV — Re-rank Priority Queue"
        subtitle="Upload your Google Search Console Performance export. We compute opportunity = impressions × (1 − CTR), boost rank > 7, and re-rank the queue."
      />
      <div className="flex flex-col gap-3 mb-4">
        <label className="flex items-center gap-2 cursor-pointer border rounded-lg p-3 hover:bg-muted/30 w-fit">
          <Upload className="h-4 w-4" />
          <span>Upload GSC Performance CSV</span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
        </label>
        {error && <Badge variant="destructive">{error}</Badge>}
        {rows.length > 0 && (
          <Button onClick={exportRanked} variant="outline" className="w-fit">
            <Download className="h-4 w-4 mr-2" />Export top-50 priority queue
          </Button>
        )}
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
                    {r.hasOverride ? (
                      <Badge variant="secondary" className="text-xs">live</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">queue</Badge>
                    )}
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
    <UnifiedAdminLayout title="SEO Priority — Top-7 Push" subtitle="Verify, export, and re-rank the high-impression optimization queue.">
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
