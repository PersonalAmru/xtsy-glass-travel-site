/**
 * SEO Recovery Admin Page
 * -----------------------
 * `/admin/seo/recovery`
 *
 * - Live status of every recovered URL (200 / 301 / 404 / 410)
 * - Cross-references with GSC "Discovered – not indexed" list
 * - Lets admin queue another crawl request for the priority sitemap
 * - UI for adding/editing 301/410 redirects
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleCard, AppleSectionHeader } from '@/components/admin/AppleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  RECOVERY_LIVE_PAGES,
  RECOVERY_FILTERED_OUT,
  RECOVERY_PLACES_PATHS,
  RECOVERY_REDIRECTS,
} from '@/data/seoAffectedSlugs';
import { ALL_SEO_PAGES } from '@/data/seoPages';
import { isResolvable } from '@/utils/seoSlugRegistry';
import { supabase } from '@/integrations/supabase/client';
import {
  CheckCircle, AlertCircle, ExternalLink, RefreshCw, Plus, Trash2, Send, Loader2,
} from 'lucide-react';

type CoverageRow = {
  path: string;
  expected: 'live' | 'redirect' | 'place' | 'route';
  resolves: boolean;
  redirectTarget?: string;
  httpStatus?: number;
  lastCheckedAt?: string;
  lastCrawlRequestedAt?: string;
  gscStatus?: string;
};

type SeoRedirect = {
  id: string;
  source_path: string;
  target_path: string;
  status_code: number;
  is_active: boolean;
  notes: string | null;
  hit_count: number;
  last_hit_at: string | null;
  created_at: string;
};

const HOST = 'https://xtsy.one';

const AdminSEORecovery = () => {
  const [coverage, setCoverage] = useState<CoverageRow[]>([]);
  const [redirects, setRedirects] = useState<SeoRedirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ok' | 'broken'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // ── Build the full coverage matrix from registry + GSC list ──
  const buildCoverage = useCallback((): CoverageRow[] => {
    const slugSet = new Set(ALL_SEO_PAGES.map(p => p.slug));
    const rows: CoverageRow[] = [];

    for (const slug of RECOVERY_LIVE_PAGES) {
      rows.push({
        path: '/' + slug,
        expected: slugSet.has(slug) ? 'live' : 'route',
        resolves: isResolvable('/' + slug),
      });
    }
    for (const slug of RECOVERY_FILTERED_OUT) {
      rows.push({
        path: '/' + slug,
        expected: 'live',
        resolves: isResolvable('/' + slug),
      });
    }
    for (const slug of Object.keys(RECOVERY_REDIRECTS)) {
      rows.push({
        path: '/' + slug,
        expected: 'redirect',
        resolves: true,
        redirectTarget: RECOVERY_REDIRECTS[slug],
      });
    }
    for (const place of RECOVERY_PLACES_PATHS) {
      rows.push({
        path: '/' + place,
        expected: 'place',
        resolves: true,
      });
    }
    return rows;
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    const base = buildCoverage();

    // Pull stored coverage status for last-checked / GSC cross-ref
    const { data: status } = await supabase
      .from('seo_coverage_status')
      .select('url_path, http_status, gsc_status, last_checked_at, last_crawl_requested_at');

    const statusMap = new Map<string, any>();
    (status || []).forEach((r: any) => statusMap.set(r.url_path, r));

    setCoverage(base.map(row => {
      const s = statusMap.get(row.path);
      return s ? { ...row, httpStatus: s.http_status, gscStatus: s.gsc_status, lastCheckedAt: s.last_checked_at, lastCrawlRequestedAt: s.last_crawl_requested_at } : row;
    }));

    const { data: r } = await supabase
      .from('seo_redirects')
      .select('*')
      .order('created_at', { ascending: false });
    setRedirects((r as any) || []);

    setLoading(false);
  }, [buildCoverage]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Live HTTP status check ──
  const recheckHttpStatus = async () => {
    setSubmitting(true);
    const updates: { path: string; status: number }[] = [];
    // Batch in chunks of 8 to avoid hammering the origin
    const chunks: CoverageRow[][] = [];
    for (let i = 0; i < coverage.length; i += 8) chunks.push(coverage.slice(i, i + 8));
    for (const chunk of chunks) {
      const results = await Promise.all(
        chunk.map(async (row) => {
          try {
            const res = await fetch(`${HOST}${row.path}`, { method: 'HEAD', mode: 'no-cors' });
            return { path: row.path, status: res.status || 200 };
          } catch {
            return { path: row.path, status: 0 };
          }
        })
      );
      updates.push(...results);
    }

    // Persist
    const upserts = updates.map(u => ({
      url_path: u.path,
      http_status: u.status,
      last_checked_at: new Date().toISOString(),
      current_status: u.status >= 200 && u.status < 400 ? 'ok' : 'broken',
    }));
    await supabase.from('seo_coverage_status').upsert(upserts, { onConflict: 'url_path' });
    await loadData();
    toast.success(`Re-checked ${updates.length} URLs`);
    setSubmitting(false);
  };

  const queueCrawl = async (paths: string[]) => {
    if (paths.length === 0) {
      toast.error('Select at least one URL');
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke('seo-crawl-request', {
      body: { paths, mode: paths.length > 5 ? 'sitemap' : 'urls' },
    });
    setSubmitting(false);
    if (error) {
      toast.error(`Crawl request failed: ${error.message}`);
      return;
    }
    toast.success(`Queued ${paths.length} URL${paths.length === 1 ? '' : 's'} via IndexNow${data?.results?.google_indexing_api ? ' + Google Indexing API' : ''}`);
    await loadData();
  };

  const queueSitemap = () => queueCrawl(['/sitemap-priority.xml']);

  const filtered = useMemo(() => {
    if (filter === 'ok') return coverage.filter(r => r.resolves);
    if (filter === 'broken') return coverage.filter(r => !r.resolves);
    return coverage;
  }, [coverage, filter]);

  const stats = useMemo(() => ({
    total: coverage.length,
    ok: coverage.filter(r => r.resolves).length,
    broken: coverage.filter(r => !r.resolves).length,
    notIndexed: coverage.filter(r => r.gscStatus === 'not_indexed').length,
  }), [coverage]);

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6 p-4 md:p-6">
        <AppleSectionHeader
          title="SEO Coverage Recovery"
          subtitle="Track recovered URLs, queue crawl requests, manage redirects"
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AppleCard className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Tracked URLs</div>
          </AppleCard>
          <AppleCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.ok}</div>
            <div className="text-xs text-muted-foreground">Resolving (200/301)</div>
          </AppleCard>
          <AppleCard className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.broken}</div>
            <div className="text-xs text-muted-foreground">Broken</div>
          </AppleCard>
          <AppleCard className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.notIndexed}</div>
            <div className="text-xs text-muted-foreground">GSC: Not Indexed</div>
          </AppleCard>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={recheckHttpStatus} disabled={submitting} variant="outline" size="sm">
            {submitting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            Re-check HTTP status
          </Button>
          <Button onClick={queueSitemap} disabled={submitting} size="sm">
            <Send className="h-4 w-4 mr-1" />
            Submit priority sitemap
          </Button>
          <Button
            onClick={() => queueCrawl(Array.from(selected))}
            disabled={submitting || selected.size === 0}
            size="sm"
            variant="secondary"
          >
            <Send className="h-4 w-4 mr-1" />
            Queue selected ({selected.size})
          </Button>
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({stats.total})</SelectItem>
              <SelectItem value="ok">Resolving</SelectItem>
              <SelectItem value="broken">Broken</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Coverage table */}
        <AppleCard className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="p-3 w-8"></th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">URL</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">HTTP</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">GSC</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Last Crawl</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
              )}
              {!loading && filtered.map(row => {
                const isSel = selected.has(row.path);
                return (
                  <tr key={row.path} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={(e) => {
                          const next = new Set(selected);
                          e.target.checked ? next.add(row.path) : next.delete(row.path);
                          setSelected(next);
                        }}
                      />
                    </td>
                    <td className="p-3">
                      {row.resolves
                        ? <CheckCircle className="h-4 w-4 text-green-500" />
                        : <AlertCircle className="h-4 w-4 text-red-500" />}
                    </td>
                    <td className="p-3">
                      <a href={row.path} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        {row.path}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                      {row.redirectTarget && (
                        <div className="text-xs text-muted-foreground">→ {row.redirectTarget}</div>
                      )}
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">{row.expected}</Badge>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      {row.httpStatus
                        ? <Badge variant={row.httpStatus < 400 ? 'default' : 'destructive'}>{row.httpStatus}</Badge>
                        : <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                    <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">
                      {row.gscStatus || '—'}
                    </td>
                    <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">
                      {row.lastCrawlRequestedAt ? new Date(row.lastCrawlRequestedAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </AppleCard>

        {/* Destination 410 Gone toggles */}
        <AppleSectionHeader title="Destination 410 Gone" subtitle="Mark a destination guide as permanently removed — escalates to a 410 on /places-to-visit/<slug>" />
        <DestinationGoneManager />

        {/* UI-driven redirect map */}
        <AppleSectionHeader title="Redirect Map" subtitle="UI-managed 301/410 redirects, applied at the edge" />
        <RedirectsManager redirects={redirects} onChange={loadData} />
      </div>
    </UnifiedAdminLayout>
  );
};

// ── Destination 410 Gone manager ──
const DestinationGoneManager = () => {
  const [goneSlugs, setGoneSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('seo_redirects')
      .select('source_path, status_code, is_active')
      .eq('status_code', 410)
      .eq('is_active', true);
    const set = new Set<string>();
    (data || []).forEach((r: any) => {
      const m = String(r.source_path).match(/^\/places-to-visit\/(.+)$/);
      if (m) set.add(m[1]);
    });
    setGoneSlugs(set);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (slug: string, gone: boolean) => {
    setBusy(slug);
    const source = `/places-to-visit/${slug}`;
    if (gone) {
      const { error } = await supabase
        .from('seo_redirects')
        .upsert(
          { source_path: source, target_path: source, status_code: 410, is_active: true, notes: 'Destination retired via admin toggle' },
          { onConflict: 'source_path' },
        );
      if (error) toast.error(`Failed: ${error.message}`);
      else toast.success(`${slug} marked 410 Gone`);
    } else {
      const { error } = await supabase
        .from('seo_redirects')
        .update({ is_active: false })
        .eq('source_path', source);
      if (error) toast.error(`Failed: ${error.message}`);
      else toast.success(`${slug} restored (live)`);
    }
    await load();
    setBusy(null);
  };

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return meghalayaDestinations
      .filter((d) => !q || d.name.toLowerCase().includes(q) || d.slug.includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query]);

  return (
    <AppleCard className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">
          {goneSlugs.size} destination{goneSlugs.size === 1 ? '' : 's'} marked Gone
        </p>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations…"
          className="max-w-xs"
        />
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {list.map((d) => {
            const gone = goneSlugs.has(d.slug);
            return (
              <div key={d.slug} className="flex items-center justify-between gap-2 rounded-lg border border-border/40 px-3 py-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{d.name}</div>
                  <a
                    href={`/places-to-visit/${d.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:underline truncate block"
                  >
                    /places-to-visit/{d.slug}
                  </a>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {gone && <Badge variant="destructive" className="text-[10px]">410</Badge>}
                  {busy === d.slug ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Switch checked={gone} onCheckedChange={(v) => toggle(d.slug, v)} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppleCard>
  );
};

// ── Redirect manager ──
const RedirectsManager = ({ redirects, onChange }: { redirects: SeoRedirect[]; onChange: () => void }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ source: '', target: '', status: 301, notes: '' });

  const save = async () => {
    if (!form.source || (!form.target && form.status !== 410)) {
      toast.error('Source and target are required (target optional for 410)');
      return;
    }
    const source = form.source.startsWith('/') ? form.source : '/' + form.source;
    const target = form.target.startsWith('/') || form.target.startsWith('http')
      ? form.target
      : '/' + form.target;
    const { error } = await supabase.from('seo_redirects').insert({
      source_path: source,
      target_path: target || source,
      status_code: form.status,
      notes: form.notes || null,
      is_active: true,
    });
    if (error) {
      toast.error(`Failed: ${error.message}`);
      return;
    }
    toast.success(`Redirect ${form.status} added: ${source} → ${target}`);
    setOpen(false);
    setForm({ source: '', target: '', status: 301, notes: '' });
    onChange();
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from('seo_redirects').update({ is_active: active }).eq('id', id);
    onChange();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this redirect?')) return;
    await supabase.from('seo_redirects').delete().eq('id', id);
    toast.success('Redirect deleted');
    onChange();
  };

  return (
    <AppleCard className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{redirects.length} redirect{redirects.length === 1 ? '' : 's'}</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Redirect</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Redirect</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Source path</Label>
                <Input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} placeholder="/old-slug" />
              </div>
              <div>
                <Label>Target path or URL</Label>
                <Input value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} placeholder="/new-slug or https://…" />
              </div>
              <div>
                <Label>Status code</Label>
                <Select value={String(form.status)} onValueChange={v => setForm({ ...form, status: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="301">301 — Permanent</SelectItem>
                    <SelectItem value="302">302 — Temporary</SelectItem>
                    <SelectItem value="307">307 — Temporary (preserve method)</SelectItem>
                    <SelectItem value="308">308 — Permanent (preserve method)</SelectItem>
                    <SelectItem value="410">410 — Gone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes (optional)</Label>
                <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="GSC drilldown / consolidation reason" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-2 text-muted-foreground">Active</th>
              <th className="text-left p-2 text-muted-foreground">Source</th>
              <th className="text-left p-2 text-muted-foreground">Target</th>
              <th className="text-left p-2 text-muted-foreground">Code</th>
              <th className="text-left p-2 text-muted-foreground">Hits</th>
              <th className="text-left p-2 text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {redirects.map(r => (
              <tr key={r.id} className="border-b border-border/20">
                <td className="p-2"><Switch checked={r.is_active} onCheckedChange={c => toggle(r.id, c)} /></td>
                <td className="p-2 font-mono text-xs">{r.source_path}</td>
                <td className="p-2 font-mono text-xs">{r.target_path}</td>
                <td className="p-2"><Badge variant="outline">{r.status_code}</Badge></td>
                <td className="p-2 text-xs text-muted-foreground">{r.hit_count}</td>
                <td className="p-2">
                  <Button size="sm" variant="ghost" onClick={() => remove(r.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
            {redirects.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No redirects yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AppleCard>
  );
};

export default AdminSEORecovery;
