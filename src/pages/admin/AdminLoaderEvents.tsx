/**
 * Admin — Analytics Loader Events
 * `/admin/analytics/loader-events`
 *
 * Filter & visualise `analytics_loader_events` (the Contentsquare/Hotjar
 * first-party loader diagnostics) by device, browser, consent state and block
 * reason. Surfaces first-party (/cs) vs CDN success rates and the top reasons
 * the tag gets blocked at runtime.
 *
 * Read access is admin-only (RLS: `is_admin()`).
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleCard, AppleSectionHeader } from '@/components/admin/AppleCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Download, Loader2, ShieldAlert } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';

type LoaderEvent = {
  id: string;
  created_at: string;
  tag: string;
  status: string;
  block_reason: string | null;
  consent_source: string | null;
  analytics_consent: boolean | null;
  used_first_party: boolean | null;
  device_type: string | null;
  browser: string | null;
  online: boolean | null;
  page_path: string | null;
  error_message: string | null;
  attempts: number | null;
  duration_ms: number | null;
};

const ALL = '__all__';
const WINDOWS = [
  { label: 'Last 24 hours', hours: 24 },
  { label: 'Last 7 days', hours: 24 * 7 },
  { label: 'Last 30 days', hours: 24 * 30 },
];
const BAR_COLORS = ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'];

const uniq = (rows: LoaderEvent[], key: keyof LoaderEvent): string[] =>
  Array.from(new Set(rows.map((r) => (r[key] == null ? '' : String(r[key]))).filter(Boolean))).sort();

const pct = (n: number, d: number) => (d <= 0 ? '—' : `${((n / d) * 100).toFixed(1)}%`);

const AdminLoaderEvents = () => {
  const [rows, setRows] = useState<LoaderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [hours, setHours] = useState(24);

  // Filters
  const [device, setDevice] = useState(ALL);
  const [browser, setBrowser] = useState(ALL);
  const [consent, setConsent] = useState(ALL); // granted | denied
  const [reason, setReason] = useState(ALL);
  const [status, setStatus] = useState(ALL);

  const load = useCallback(async () => {
    setLoading(true);
    setDenied(false);
    const since = new Date(Date.now() - hours * 3600_000).toISOString();
    const { data, error } = await supabase
      .from('analytics_loader_events')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(1000);
    if (error) {
      setDenied(true);
      setRows([]);
    } else {
      setRows((data as LoaderEvent[]) || []);
    }
    setLoading(false);
  }, [hours]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (device !== ALL && (r.device_type || '') !== device) return false;
      if (browser !== ALL && (r.browser || '') !== browser) return false;
      if (status !== ALL && r.status !== status) return false;
      if (reason !== ALL && (r.block_reason || 'none') !== reason) return false;
      if (consent === 'granted' && r.analytics_consent !== true) return false;
      if (consent === 'denied' && r.analytics_consent === true) return false;
      return true;
    });
  }, [rows, device, browser, status, reason, consent]);

  // Aggregates over the filtered set
  const stats = useMemo(() => {
    const total = filtered.length;
    const loaded = filtered.filter((r) => r.status === 'loaded').length;
    const fp = filtered.filter((r) => r.used_first_party === true);
    const cdn = filtered.filter((r) => r.used_first_party === false);
    const fpLoaded = fp.filter((r) => r.status === 'loaded').length;
    const cdnLoaded = cdn.filter((r) => r.status === 'loaded').length;

    const reasonCounts: Record<string, number> = {};
    const browserBlocks: Record<string, number> = {};
    for (const r of filtered) {
      if (r.status === 'blocked' || r.status === 'error') {
        const k = r.block_reason || 'unknown';
        reasonCounts[k] = (reasonCounts[k] || 0) + 1;
        const b = r.browser || 'unknown';
        browserBlocks[b] = (browserBlocks[b] || 0) + 1;
      }
    }
    return {
      total,
      successRate: pct(loaded, total),
      fp: { n: fp.length, loaded: fpLoaded, rate: pct(fpLoaded, fp.length) },
      cdn: { n: cdn.length, loaded: cdnLoaded, rate: pct(cdnLoaded, cdn.length) },
      reasonChart: Object.entries(reasonCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      browserChart: Object.entries(browserBlocks).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    };
  }, [filtered]);

  const deviceOpts = useMemo(() => uniq(rows, 'device_type'), [rows]);
  const browserOpts = useMemo(() => uniq(rows, 'browser'), [rows]);
  const statusOpts = useMemo(() => uniq(rows, 'status'), [rows]);
  const reasonOpts = useMemo(
    () => Array.from(new Set(rows.map((r) => r.block_reason || 'none'))).sort(),
    [rows],
  );

  const exportCsv = () => {
    const cols: (keyof LoaderEvent)[] = [
      'created_at', 'status', 'block_reason', 'used_first_party', 'consent_source',
      'analytics_consent', 'device_type', 'browser', 'online', 'attempts', 'duration_ms',
      'page_path', 'error_message',
    ];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [cols.join(',')];
    for (const r of filtered) lines.push(cols.map((c) => esc(r[c])).join(','));
    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loader-events-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setDevice(ALL); setBrowser(ALL); setConsent(ALL); setReason(ALL); setStatus(ALL);
  };

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <AppleSectionHeader
            title="Analytics Loader Events"
            subtitle="First-party vs CDN load health for the Contentsquare/Hotjar tag"
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={filtered.length === 0}>
              <Download className="h-4 w-4" /><span className="ml-2">CSV</span>
            </Button>
          </div>
        </div>

        {denied && (
          <AppleCard>
            <div className="flex items-center gap-3 text-amber-600">
              <ShieldAlert className="h-5 w-5" />
              <p className="text-sm">No access to loader events. Admin sign-in is required to view this data.</p>
            </div>
          </AppleCard>
        )}

        {/* Filters */}
        <AppleCard>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Window</Label>
              <Select value={String(hours)} onValueChange={(v) => setHours(Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WINDOWS.map((w) => <SelectItem key={w.hours} value={String(w.hours)}>{w.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Device</Label>
              <Select value={device} onValueChange={setDevice}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All devices</SelectItem>
                  {deviceOpts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Browser</Label>
              <Select value={browser} onValueChange={setBrowser}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All browsers</SelectItem>
                  {browserOpts.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Consent</Label>
              <Select value={consent} onValueChange={setConsent}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Any</SelectItem>
                  <SelectItem value="granted">Granted</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Block reason</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All reasons</SelectItem>
                  {reasonOpts.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All statuses</SelectItem>
                  {statusOpts.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={resetFilters}>Reset filters</Button>
            <span className="text-xs text-muted-foreground">{filtered.length} of {rows.length} events</span>
          </div>
        </AppleCard>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <AppleCard><div className="text-xs text-muted-foreground">Overall success</div><div className="text-2xl font-semibold">{stats.successRate}</div><div className="text-xs text-muted-foreground">{stats.total} events</div></AppleCard>
          <AppleCard><div className="text-xs text-muted-foreground">First-party (/cs)</div><div className="text-2xl font-semibold">{stats.fp.rate}</div><div className="text-xs text-muted-foreground">{stats.fp.loaded}/{stats.fp.n} loaded</div></AppleCard>
          <AppleCard><div className="text-xs text-muted-foreground">CDN fallback</div><div className="text-2xl font-semibold">{stats.cdn.rate}</div><div className="text-xs text-muted-foreground">{stats.cdn.loaded}/{stats.cdn.n} loaded</div></AppleCard>
          <AppleCard><div className="text-xs text-muted-foreground">Blocked / errored</div><div className="text-2xl font-semibold">{stats.reasonChart.reduce((a, b) => a + b.value, 0)}</div><div className="text-xs text-muted-foreground">across {stats.reasonChart.length} reasons</div></AppleCard>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AppleCard>
            <h3 className="text-sm font-medium mb-3">Top block reasons</h3>
            {stats.reasonChart.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">No blocked loads in this selection 🎉</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.reasonChart} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="name" width={110} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {stats.reasonChart.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </AppleCard>
          <AppleCard>
            <h3 className="text-sm font-medium mb-3">Blocked loads by browser</h3>
            {stats.browserChart.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">No blocked loads in this selection 🎉</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.browserChart} margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {stats.browserChart.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </AppleCard>
        </div>

        {/* Recent events table */}
        <AppleCard>
          <h3 className="text-sm font-medium mb-3">Recent events</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/40 text-left text-muted-foreground">
                  <th className="p-2">Time</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Reason</th>
                  <th className="p-2">Source</th>
                  <th className="p-2">Consent</th>
                  <th className="p-2">Device</th>
                  <th className="p-2">Browser</th>
                  <th className="p-2">Page</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map((r) => (
                  <tr key={r.id} className="border-b border-border/20">
                    <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="p-2">
                      <Badge variant={r.status === 'loaded' ? 'default' : 'destructive'}>{r.status}</Badge>
                    </td>
                    <td className="p-2">{r.block_reason || '—'}</td>
                    <td className="p-2">{r.used_first_party ? 'first-party' : 'CDN'}</td>
                    <td className="p-2">{r.analytics_consent ? 'granted' : 'denied'}</td>
                    <td className="p-2">{r.device_type || '—'}</td>
                    <td className="p-2">{r.browser || '—'}</td>
                    <td className="p-2 font-mono max-w-[180px] truncate" title={r.page_path || ''}>{r.page_path || '—'}</td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr><td colSpan={8} className="p-4 text-center text-muted-foreground">No events match the current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </AppleCard>
      </div>
    </UnifiedAdminLayout>
  );
};

export default AdminLoaderEvents;
