/**
 * Admin Search Console — what visitors are searching across XTSY.
 *
 * Sources: every keystroke from <SearchHintBar/> (homepage hero) and
 * <IntelligentSearchOverlay/> (header full-screen search). Stored in the
 * `search_queries` Supabase table and queried client-side.
 */

import { useEffect, useMemo, useState, useCallback } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleCard, AppleSectionHeader } from '@/components/admin/AppleCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  RefreshCw, Search as SearchIcon, AlertTriangle, MousePointerClick,
  TrendingUp, Smartphone, Monitor, Tablet, ExternalLink, Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface SearchRow {
  id: string;
  query: string;
  query_normalized: string;
  source: string | null;
  page_path: string | null;
  result_count: number | null;
  zero_results: boolean;
  clicked_result_url: string | null;
  clicked_result_title: string | null;
  visitor_id: string | null;
  session_id: string | null;
  device_type: string | null;
  created_at: string;
}

type Range = '24h' | '7d' | '30d' | 'all';

const RANGE_HOURS: Record<Range, number | null> = {
  '24h': 24,
  '7d': 24 * 7,
  '30d': 24 * 30,
  all: null,
};

function deviceIcon(device: string | null | undefined) {
  if (device === 'mobile') return <Smartphone className="w-3.5 h-3.5" />;
  if (device === 'tablet') return <Tablet className="w-3.5 h-3.5" />;
  return <Monitor className="w-3.5 h-3.5" />;
}

function exportCsv(rows: Array<Record<string, unknown>>, filename: string) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => escape(r[c])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminSearchConsole() {
  const [range, setRange] = useState<Range>('7d');
  const [filter, setFilter] = useState('');
  const [rows, setRows] = useState<SearchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('search_queries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2000);
      const hours = RANGE_HOURS[range];
      if (hours != null) {
        const since = new Date(Date.now() - hours * 3600_000).toISOString();
        query = query.gte('created_at', since);
      }
      const { data, error } = await query;
      if (error) throw error;
      setRows((data || []) as SearchRow[]);
    } catch (e: any) {
      setError(e?.message || 'Failed to load search analytics');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Live updates
  useEffect(() => {
    const channel = supabase
      .channel('search_queries_live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'search_queries' },
        (payload) => setRows((prev) => [payload.new as SearchRow, ...prev].slice(0, 2000)),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return rows;
    return rows.filter(
      (r) =>
        r.query.toLowerCase().includes(f) ||
        (r.page_path || '').toLowerCase().includes(f) ||
        (r.clicked_result_title || '').toLowerCase().includes(f),
    );
  }, [rows, filter]);

  // Aggregations
  const stats = useMemo(() => {
    const total = filtered.length;
    const zero = filtered.filter((r) => r.zero_results && !r.source?.endsWith('_click')).length;
    const clicks = filtered.filter((r) => !!r.clicked_result_url).length;
    const uniqueQueries = new Set(filtered.map((r) => r.query_normalized)).size;
    const uniqueVisitors = new Set(filtered.map((r) => r.visitor_id).filter(Boolean)).size;
    return { total, zero, clicks, uniqueQueries, uniqueVisitors };
  }, [filtered]);

  const topQueries = useMemo(() => {
    const map = new Map<string, { query: string; count: number; zero: number; lastAt: string }>();
    filtered
      .filter((r) => !r.source?.endsWith('_click'))
      .forEach((r) => {
        const key = r.query_normalized || r.query.toLowerCase().trim();
        const cur = map.get(key) || { query: r.query, count: 0, zero: 0, lastAt: r.created_at };
        cur.count += 1;
        if (r.zero_results) cur.zero += 1;
        if (r.created_at > cur.lastAt) cur.lastAt = r.created_at;
        map.set(key, cur);
      });
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 25);
  }, [filtered]);

  const zeroResultQueries = useMemo(() => {
    const map = new Map<string, { query: string; count: number; lastAt: string }>();
    filtered
      .filter((r) => r.zero_results && !r.source?.endsWith('_click'))
      .forEach((r) => {
        const key = r.query_normalized || r.query.toLowerCase().trim();
        const cur = map.get(key) || { query: r.query, count: 0, lastAt: r.created_at };
        cur.count += 1;
        if (r.created_at > cur.lastAt) cur.lastAt = r.created_at;
        map.set(key, cur);
      });
    return Array.from(map.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 25);
  }, [filtered]);

  const topClicks = useMemo(() => {
    const map = new Map<string, { url: string; title: string; count: number }>();
    filtered
      .filter((r) => !!r.clicked_result_url)
      .forEach((r) => {
        const key = r.clicked_result_url!;
        const cur = map.get(key) || { url: key, title: r.clicked_result_title || key, count: 0 };
        cur.count += 1;
        map.set(key, cur);
      });
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 25);
  }, [filtered]);

  const recent = filtered.slice(0, 50);

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <SearchIcon className="w-6 h-6 text-primary" /> Search Console
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              What visitors are searching for across the XTSY website — live.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={range} onValueChange={(v) => setRange(v as Range)}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchData}
              className="border-white/10 bg-white/5 text-slate-200 hover:text-white"
            >
              <RefreshCw className={cn('w-4 h-4 mr-1.5', loading && 'animate-spin')} /> Refresh
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                exportCsv(
                  filtered.map((r) => ({
                    created_at: r.created_at,
                    query: r.query,
                    source: r.source,
                    page_path: r.page_path,
                    result_count: r.result_count,
                    zero_results: r.zero_results,
                    clicked_result_url: r.clicked_result_url,
                    clicked_result_title: r.clicked_result_title,
                    device_type: r.device_type,
                    visitor_id: r.visitor_id,
                  })),
                  `search-queries-${range}.csv`,
                )
              }
              className="border-white/10 bg-white/5 text-slate-200 hover:text-white"
            >
              <Download className="w-4 h-4 mr-1.5" /> Export
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <AppleCard className="p-4">
            <p className="text-xs text-slate-400">Total searches</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total.toLocaleString()}</p>
          </AppleCard>
          <AppleCard className="p-4">
            <p className="text-xs text-slate-400">Unique queries</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.uniqueQueries.toLocaleString()}</p>
          </AppleCard>
          <AppleCard className="p-4">
            <p className="text-xs text-slate-400">Unique visitors</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.uniqueVisitors.toLocaleString()}</p>
          </AppleCard>
          <AppleCard className="p-4">
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MousePointerClick className="w-3 h-3" /> Result clicks
            </p>
            <p className="text-2xl font-bold text-white mt-1">{stats.clicks.toLocaleString()}</p>
          </AppleCard>
          <AppleCard className="p-4">
            <p className="text-xs text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Zero-result
            </p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.zero.toLocaleString()}</p>
          </AppleCard>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter by query, page or clicked title..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 max-w-md"
          />
          {filter && (
            <Button size="sm" variant="ghost" onClick={() => setFilter('')} className="text-slate-300">
              Clear
            </Button>
          )}
        </div>

        {error && (
          <AppleCard className="p-4 border-red-500/40 bg-red-500/10">
            <p className="text-sm text-red-300">{error}</p>
          </AppleCard>
        )}

        <Tabs defaultValue="top" className="w-full">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="top">Top queries</TabsTrigger>
            <TabsTrigger value="zero">
              Zero results <Badge variant="outline" className="ml-2 border-amber-500/40 text-amber-400">{zeroResultQueries.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="clicks">Top clicks</TabsTrigger>
            <TabsTrigger value="recent">Live feed</TabsTrigger>
          </TabsList>

          {/* TOP QUERIES */}
          <TabsContent value="top" className="mt-4">
            <AppleCard>
              <AppleSectionHeader
                title="Top Search Queries"
                subtitle="Most-searched terms across the site"

              />
              {loading ? (
                <div className="p-4 space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 bg-white/5" />)}</div>
              ) : topQueries.length === 0 ? (
                <EmptyState message="No searches recorded yet in this range." />
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-slate-500 border-b border-white/5">
                    <tr>
                      <th className="text-left px-4 py-2">Query</th>
                      <th className="text-right px-4 py-2">Count</th>
                      <th className="text-right px-4 py-2">Zero %</th>
                      <th className="text-right px-4 py-2">Last seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topQueries.map((q) => (
                      <tr key={q.query} className="border-b border-white/5 hover:bg-white/[0.03]">
                        <td className="px-4 py-2.5 text-white font-medium">{q.query}</td>
                        <td className="px-4 py-2.5 text-right text-slate-200">{q.count}</td>
                        <td className="px-4 py-2.5 text-right">
                          {q.zero > 0 ? (
                            <span className="text-amber-400">{Math.round((q.zero / q.count) * 100)}%</span>
                          ) : (
                            <span className="text-emerald-400">0%</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs text-slate-400">
                          {formatDistanceToNow(new Date(q.lastAt), { addSuffix: true })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </AppleCard>
          </TabsContent>

          {/* ZERO RESULTS */}
          <TabsContent value="zero" className="mt-4">
            <AppleCard>
              <AppleSectionHeader
                title="Zero-Result Queries"
                subtitle="Searches that returned nothing — content gaps to fill"

              />
              {loading ? (
                <div className="p-4 space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 bg-white/5" />)}</div>
              ) : zeroResultQueries.length === 0 ? (
                <EmptyState message="🎉 No zero-result queries — your search index is covering everything!" />
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-slate-500 border-b border-white/5">
                    <tr>
                      <th className="text-left px-4 py-2">Query</th>
                      <th className="text-right px-4 py-2">Times</th>
                      <th className="text-right px-4 py-2">Last seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zeroResultQueries.map((q) => (
                      <tr key={q.query} className="border-b border-white/5 hover:bg-white/[0.03]">
                        <td className="px-4 py-2.5 text-amber-300 font-medium">{q.query}</td>
                        <td className="px-4 py-2.5 text-right text-slate-200">{q.count}</td>
                        <td className="px-4 py-2.5 text-right text-xs text-slate-400">
                          {formatDistanceToNow(new Date(q.lastAt), { addSuffix: true })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </AppleCard>
          </TabsContent>

          {/* TOP CLICKS */}
          <TabsContent value="clicks" className="mt-4">
            <AppleCard>
              <AppleSectionHeader
                title="Top Clicked Results"
                subtitle="Where searchers actually went"

              />
              {loading ? (
                <div className="p-4 space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 bg-white/5" />)}</div>
              ) : topClicks.length === 0 ? (
                <EmptyState message="No clicks recorded yet." />
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase text-slate-500 border-b border-white/5">
                    <tr>
                      <th className="text-left px-4 py-2">Result</th>
                      <th className="text-left px-4 py-2">URL</th>
                      <th className="text-right px-4 py-2">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topClicks.map((c) => (
                      <tr key={c.url} className="border-b border-white/5 hover:bg-white/[0.03]">
                        <td className="px-4 py-2.5 text-white font-medium">{c.title}</td>
                        <td className="px-4 py-2.5">
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            {c.url} <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-200">{c.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </AppleCard>
          </TabsContent>

          {/* LIVE FEED */}
          <TabsContent value="recent" className="mt-4">
            <AppleCard>
              <AppleSectionHeader
                title="Live Search Feed"
                subtitle="Newest searches first — auto-updates as visitors type"
              />
              {loading ? (
                <div className="p-4 space-y-2">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-8 bg-white/5" />)}</div>
              ) : recent.length === 0 ? (
                <EmptyState message="No searches yet." />
              ) : (
                <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                  {recent.map((r) => (
                    <div key={r.id} className="px-4 py-3 hover:bg-white/[0.03] flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-white truncate">{r.query}</span>
                          {r.zero_results && !r.source?.endsWith('_click') && (
                            <Badge variant="outline" className="border-amber-500/40 text-amber-400 text-[10px]">
                              0 results
                            </Badge>
                          )}
                          {r.source?.endsWith('_click') && (
                            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
                              clicked
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 flex-wrap text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">{deviceIcon(r.device_type)} {r.device_type || 'unknown'}</span>
                          {r.page_path && <span>📍 {r.page_path}</span>}
                          {r.source && <span>🔍 {r.source.replace('_click', '')}</span>}
                          {r.clicked_result_title && (
                            <span>→ <span className="text-emerald-400">{r.clicked_result_title}</span></span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </AppleCard>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedAdminLayout>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-4 py-10 text-center text-sm text-slate-500">{message}</div>
  );
}
