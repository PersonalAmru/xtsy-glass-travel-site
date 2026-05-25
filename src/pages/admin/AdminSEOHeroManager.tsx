/**
 * Admin SEO Hero Manager — list slugs missing from SEO_HERO_MANIFEST and
 * trigger reprocessing for selected ones via the generate-seo-hero edge
 * function (Pexels-only mode). Also surfaces edge-function health.
 */
import { useEffect, useMemo, useState } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleCard, AppleSectionHeader } from '@/components/admin/AppleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, RefreshCw, PlayCircle, Activity } from 'lucide-react';
import { ALL_SEO_PAGES } from '@/data/seoPages';
import { SEO_HERO_MANIFEST } from '@/data/seoHeroManifest';
import { supabase } from '@/integrations/supabase/client';

interface RowState {
  slug: string;
  category: string;
  title: string;
  lastError?: string;
  lastSource?: string;
  status: 'pending' | 'running' | 'ok' | 'fail';
}

export default function AdminSEOHeroManager() {
  const initial = useMemo<RowState[]>(
    () =>
      ALL_SEO_PAGES
        .filter((p) => !SEO_HERO_MANIFEST[p.slug])
        .map((p) => ({
          slug: p.slug,
          category: p.category,
          title: p.title,
          status: 'pending' as const,
        })),
    [],
  );

  const [rows, setRows] = useState<RowState[]>(initial);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [maxAttempts, setMaxAttempts] = useState(4);
  const [backoffMs, setBackoffMs] = useState(1500);
  const [running, setRunning] = useState(false);
  const [health, setHealth] = useState<any>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [summary, setSummary] = useState<string>('');

  const cachedCount = Object.keys(SEO_HERO_MANIFEST).length;
  const totalSlugs = ALL_SEO_PAGES.length;

  const filtered = rows.filter(
    (r) =>
      !filter ||
      r.slug.toLowerCase().includes(filter.toLowerCase()) ||
      r.category.toLowerCase().includes(filter.toLowerCase()),
  );

  const toggle = (slug: string) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(slug) ? n.delete(slug) : n.add(slug);
      return n;
    });
  };

  const selectAllVisible = () => {
    setSelected(new Set(filtered.map((r) => r.slug)));
  };

  const clearSelection = () => setSelected(new Set());

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const { data, error } = await supabase.functions.invoke('seo-hero-health');
      if (error) throw error;
      setHealth(data);
    } catch (e) {
      setHealth({ ok: false, error: e instanceof Error ? e.message : String(e) });
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const reprocess = async () => {
    if (selected.size === 0) return;
    setRunning(true);
    setSummary('');
    const targets = rows.filter((r) => selected.has(r.slug));
    const results: { slug: string; ok: boolean; source?: string; error?: string }[] = [];

    for (let idx = 0; idx < targets.length; idx++) {
      const t = targets[idx];
      const page = ALL_SEO_PAGES.find((p) => p.slug === t.slug);
      if (!page) continue;

      setRows((prev) =>
        prev.map((r) => (r.slug === t.slug ? { ...r, status: 'running' } : r)),
      );

      let lastErr = '';
      let ok = false;
      let source = '';

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const { data, error } = await supabase.functions.invoke('generate-seo-hero', {
            body: {
              slug: page.slug,
              title: page.title,
              metaDescription: page.metaDescription,
              category: page.category,
              h1: page.h1 ?? page.title,
              useAI: false,
              force: false,
            },
          });
          if (error) throw error;
          if (data?.url) {
            ok = true;
            source = data.source ?? 'unknown';
            break;
          }
          lastErr = data?.error ?? 'no url returned';
        } catch (e) {
          lastErr = e instanceof Error ? e.message : String(e);
        }
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, backoffMs * attempt * attempt));
        }
      }

      results.push({ slug: t.slug, ok, source, error: ok ? undefined : lastErr });
      setRows((prev) =>
        prev.map((r) =>
          r.slug === t.slug
            ? {
                ...r,
                status: ok ? 'ok' : 'fail',
                lastSource: source,
                lastError: ok ? undefined : lastErr,
              }
            : r,
        ),
      );
    }

    const okCount = results.filter((r) => r.ok).length;
    const failCount = results.length - okCount;
    const bySource: Record<string, number> = {};
    for (const r of results) if (r.ok && r.source) bySource[r.source] = (bySource[r.source] ?? 0) + 1;

    const report = [
      `──── Reprocess Summary ────`,
      `Selected:        ${results.length}`,
      `Succeeded:       ${okCount}`,
      `Still failing:   ${failCount}`,
      `Cached total:    ${cachedCount + okCount} / ${totalSlugs}`,
      `Sources:         ${JSON.stringify(bySource)}`,
      ``,
      ...(failCount
        ? [`Failing slugs:`, ...results.filter((r) => !r.ok).map((r) => `  - ${r.slug}: ${r.error}`)]
        : []),
    ].join('\n');
    setSummary(report);
    setRunning(false);
  };

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6 p-6">
        <AppleSectionHeader
          title="SEO Hero Manager"
          subtitle={`${cachedCount} / ${totalSlugs} slugs cached · ${rows.length} missing`}
        />

        <AppleCard>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" /> Edge function health
            </h3>
            <Button size="sm" variant="outline" onClick={fetchHealth} disabled={loadingHealth}>
              {loadingHealth ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
          {health ? (
            <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-72">
              {JSON.stringify(health, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">Loading…</p>
          )}
        </AppleCard>

        <AppleCard>
          <div className="flex flex-wrap gap-3 items-end mb-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground">Filter (slug or category)</label>
              <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="hostel…" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Max attempts</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 1)}
                className="w-24"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Backoff ms (× attempt²)</label>
              <Input
                type="number"
                min={100}
                step={100}
                value={backoffMs}
                onChange={(e) => setBackoffMs(parseInt(e.target.value) || 100)}
                className="w-32"
              />
            </div>
            <Button variant="outline" size="sm" onClick={selectAllVisible}>
              Select visible ({filtered.length})
            </Button>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear
            </Button>
            <Button onClick={reprocess} disabled={running || selected.size === 0}>
              {running ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Running…
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" /> Reprocess {selected.size}
                </>
              )}
            </Button>
          </div>

          {summary && (
            <pre className="text-xs bg-muted p-3 rounded-md whitespace-pre-wrap mb-4">{summary}</pre>
          )}

          <div className="border rounded-md overflow-auto max-h-[60vh]">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="p-2 w-8"></th>
                  <th className="p-2 text-left">Slug</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Last error / source</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 500).map((r) => (
                  <tr key={r.slug} className="border-t hover:bg-muted/30">
                    <td className="p-2">
                      <Checkbox
                        checked={selected.has(r.slug)}
                        onCheckedChange={() => toggle(r.slug)}
                      />
                    </td>
                    <td className="p-2 font-mono text-xs">{r.slug}</td>
                    <td className="p-2">
                      <Badge variant="outline">{r.category}</Badge>
                    </td>
                    <td className="p-2">
                      {r.status === 'running' && <Loader2 className="h-3 w-3 animate-spin" />}
                      {r.status === 'ok' && <Badge className="bg-green-600">ok</Badge>}
                      {r.status === 'fail' && <Badge variant="destructive">fail</Badge>}
                      {r.status === 'pending' && <Badge variant="secondary">pending</Badge>}
                    </td>
                    <td className="p-2 text-xs text-muted-foreground max-w-md truncate">
                      {r.lastError || r.lastSource || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 500 && (
              <p className="p-2 text-xs text-muted-foreground">
                Showing first 500 of {filtered.length}. Use filter to narrow.
              </p>
            )}
          </div>
        </AppleCard>
      </div>
    </UnifiedAdminLayout>
  );
}
