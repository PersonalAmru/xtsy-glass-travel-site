/**
 * Admin · SEO Position Tracking
 *
 * Ongoing Semrush-backed position tracking focused on PROGRAMMATIC pages and
 * the exact striking-distance keywords (Google positions 11–20) we're pushing
 * into the top 10.
 *
 * How it works:
 *  - "Capture snapshot" calls the admin-only `semrush-seo-intel` edge function
 *    (action: position-capture), which reads our live Google organic positions
 *    from Semrush and stores a timestamped snapshot in seo_position_snapshots.
 *  - This page reads the stored snapshots (admin-only RLS) and charts movement
 *    run-over-run so we can confirm keywords crossing into the top 10.
 *
 * Device note: Semrush organic positions reflect Google's index — the same
 * results Chrome, Safari and mobile browsers all read from. A true device-split
 * (Safari-only / mobile-only) feed requires a paid Semrush Position Tracking
 * campaign, which the connector can only read, not create.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleSectionHeader } from '@/components/admin/AppleCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  Loader2, RefreshCw, Camera, ArrowUp, ArrowDown, Minus, Trophy,
  Target, AlertTriangle, ExternalLink, LineChart as LineChartIcon, Info,
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

interface Snapshot {
  id: string;
  run_id: string;
  captured_at: string;
  database: string;
  keyword: string;
  position: number;
  previous_position: number | null;
  delta: number | null;
  volume: number | null;
  cpc: number | null;
  url: string | null;
  traffic_pct: number | null;
  is_programmatic: boolean;
  is_striking_distance: boolean;
}

const fmt = (n: number) => n.toLocaleString('en-IN');

const posClass = (p: number) =>
  p <= 3 ? 'text-emerald-400' : p <= 10 ? 'text-sky-400' : p <= 20 ? 'text-amber-400' : 'text-red-400';

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

const AdminSEOPositionTracking = () => {
  const [database, setDatabase] = useState('in');
  const [onlyProgrammatic, setOnlyProgrammatic] = useState(true);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadHistory = useCallback(async (db: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbErr } = await (supabase as any)
        .from('seo_position_snapshots')
        .select('*')
        .eq('database', db)
        .order('captured_at', { ascending: false })
        .limit(2000);
      if (dbErr) throw new Error(dbErr.message);
      setSnapshots((data ?? []) as Snapshot[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tracking history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(database); }, [loadHistory, database]);

  const capture = useCallback(async () => {
    setCapturing(true);
    setError(null);
    setNotice(null);
    try {
      const { data: res, error: fnErr } = await supabase.functions.invoke('semrush-seo-intel', {
        body: { action: 'position-capture', database },
      });
      if (fnErr) throw new Error(fnErr.message);
      if ((res as any)?.error) throw new Error((res as any).error);
      const r = res as any;
      setNotice(
        `Snapshot captured · ${fmt(r.totalTracked)} keywords tracked · ` +
        `${fmt(r.strikingCount)} in striking distance · ${fmt(r.top10Count)} already top 10.`,
      );
      await loadHistory(database);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to capture snapshot');
    } finally {
      setCapturing(false);
    }
  }, [database, loadHistory]);

  // ── Derive runs (most recent first) ──────────────────────────────────────
  const runs = useMemo(() => {
    const map = new Map<string, { runId: string; capturedAt: string; rows: Snapshot[] }>();
    for (const s of snapshots) {
      if (!map.has(s.run_id)) map.set(s.run_id, { runId: s.run_id, capturedAt: s.captured_at, rows: [] });
      map.get(s.run_id)!.rows.push(s);
    }
    return [...map.values()].sort(
      (a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime(),
    );
  }, [snapshots]);

  const latest = runs[0];
  const previous = runs[1];

  const scope = (rows: Snapshot[]) =>
    onlyProgrammatic ? rows.filter((r) => r.is_programmatic) : rows;

  // ── KPIs from latest run ─────────────────────────────────────────────────
  const kpis = useMemo(() => {
    if (!latest) return null;
    const rows = scope(latest.rows);
    const top10 = rows.filter((r) => r.position <= 10);
    const striking = rows.filter((r) => r.is_striking_distance);
    const prevTop10 = previous ? scope(previous.rows).filter((r) => r.position <= 10).length : null;
    return {
      tracked: rows.length,
      top10: top10.length,
      striking: striking.length,
      top10Delta: prevTop10 === null ? null : top10.length - prevTop10,
    };
  }, [latest, previous, onlyProgrammatic]);

  // ── Striking-distance keyword movement table (latest run) ────────────────
  const strikingRows = useMemo(() => {
    if (!latest) return [];
    return scope(latest.rows)
      .filter((r) => r.is_striking_distance)
      .sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));
  }, [latest, onlyProgrammatic]);

  // ── Trend chart: striking & top-10 counts per run (chronological) ────────
  const trendData = useMemo(() => {
    return [...runs].reverse().map((run) => {
      const rows = scope(run.rows);
      return {
        date: shortDate(run.capturedAt),
        'Top 10': rows.filter((r) => r.position <= 10).length,
        'Striking (11–20)': rows.filter((r) => r.is_striking_distance).length,
      };
    });
  }, [runs, onlyProgrammatic]);

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6">
        <AppleSectionHeader
          title="SEO Position Tracking"
          subtitle="Programmatic pages · striking-distance keywords (11–20) → top 10 · Semrush"
          action={
            <div className="flex items-center gap-2">
              <Select value={database} onValueChange={setDatabase}>
                <SelectTrigger className="w-28 h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">India</SelectItem>
                  <SelectItem value="us">US</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-2" disabled={loading || capturing}
                onClick={() => loadHistory(database)}>
                <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} /> Reload
              </Button>
              <Button size="sm" className="gap-2" disabled={capturing}
                onClick={capture}>
                {capturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                Capture snapshot
              </Button>
            </div>
          }
        />

        {/* Filter toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={onlyProgrammatic ? 'default' : 'outline'}
            size="sm"
            onClick={() => setOnlyProgrammatic(true)}
          >
            Programmatic pages
          </Button>
          <Button
            variant={!onlyProgrammatic ? 'default' : 'outline'}
            size="sm"
            onClick={() => setOnlyProgrammatic(false)}
          >
            All pages
          </Button>
        </div>

        {notice && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4 flex items-start gap-3">
            <Trophy className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-200">{notice}</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.05] p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-white">Something went wrong</p>
              <p className="text-sm text-slate-400 mt-1">{error}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm">Loading tracking history…</p>
          </div>
        )}

        {!loading && runs.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center space-y-3">
            <Camera className="w-8 h-8 text-primary mx-auto" />
            <p className="text-white font-medium">No snapshots yet</p>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Capture your first snapshot to start tracking how your programmatic pages
              move from striking distance (positions 11–20) into the Google top 10.
            </p>
            <Button className="gap-2 mx-auto" disabled={capturing} onClick={capture}>
              {capturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              Capture first snapshot
            </Button>
          </div>
        )}

        {!loading && latest && kpis && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Keywords tracked', value: fmt(kpis.tracked), sub: `latest run · ${shortDate(latest.capturedAt)}` },
                {
                  label: 'In top 10', value: fmt(kpis.top10),
                  sub: kpis.top10Delta === null ? 'first run' :
                    kpis.top10Delta > 0 ? `▲ +${kpis.top10Delta} vs last` :
                    kpis.top10Delta < 0 ? `▼ ${kpis.top10Delta} vs last` : 'no change',
                  tone: kpis.top10Delta && kpis.top10Delta > 0 ? 'up' : kpis.top10Delta && kpis.top10Delta < 0 ? 'down' : undefined,
                },
                { label: 'Striking distance (11–20)', value: fmt(kpis.striking), sub: 'next to push to top 10' },
                { label: 'Snapshots captured', value: fmt(runs.length), sub: 'history depth' },
              ].map((m) => (
                <div key={m.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-xs text-slate-500">{m.label}</div>
                  <div className="text-2xl font-semibold text-white mt-1">{m.value}</div>
                  {m.sub && (
                    <div className={cn(
                      'text-[10px] mt-0.5',
                      (m as any).tone === 'up' ? 'text-emerald-400' :
                      (m as any).tone === 'down' ? 'text-red-400' : 'text-slate-500',
                    )}>{m.sub}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Trend chart */}
            {trendData.length >= 2 && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                  <LineChartIcon className="w-4 h-4 text-primary" /> Movement over time
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 4, right: 12, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="Top 10" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Striking (11–20)" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

            {/* Striking-distance movement table */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-amber-400" />
                Striking-distance keywords {onlyProgrammatic ? '(programmatic pages)' : '(all pages)'}
              </h3>
              {strikingRows.length === 0 ? (
                <p className="text-sm text-slate-400 py-4">
                  No keywords in positions 11–20 for this scope in the latest snapshot.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-white/5">
                        <th className="py-2 pr-4 font-medium">Keyword</th>
                        <th className="py-2 px-4 font-medium">Pos</th>
                        <th className="py-2 px-4 font-medium">Move</th>
                        <th className="py-2 px-4 font-medium">Volume</th>
                        <th className="py-2 pl-4 font-medium">Page</th>
                      </tr>
                    </thead>
                    <tbody>
                      {strikingRows.map((r) => {
                        const d = r.delta;
                        return (
                          <tr key={r.id} className="border-b border-white/5 last:border-0">
                            <td className="py-2 pr-4 text-white font-medium max-w-[220px] truncate">{r.keyword}</td>
                            <td className={cn('py-2 px-4 font-semibold', posClass(r.position))}>{r.position}</td>
                            <td className="py-2 px-4">
                              {d === null || d === 0 ? (
                                <span className="inline-flex items-center gap-1 text-slate-500"><Minus className="w-3 h-3" />—</span>
                              ) : d > 0 ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400"><ArrowUp className="w-3 h-3" />{d}</span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-400"><ArrowDown className="w-3 h-3" />{Math.abs(d)}</span>
                              )}
                            </td>
                            <td className="py-2 px-4 text-slate-300">{fmt(r.volume ?? 0)}</td>
                            <td className="py-2 pl-4">
                              {r.url ? (
                                <a href={r.url.startsWith('http') ? r.url : `https://${r.url}`} target="_blank" rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-sky-400 hover:underline max-w-[260px] truncate">
                                  {r.url.replace(/^https?:\/\/xtsy\.one/, '') || '/'}
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              ) : <span className="text-slate-600">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Device note */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Positions come from Semrush's Google organic index — the same results served to
                Chrome, Safari and mobile browsers. Capture a snapshot on your usual cadence (e.g.
                weekly) to confirm keywords crossing from striking distance into the top 10. A
                dedicated device-split (Safari-only / mobile-only) feed needs a paid Semrush
                Position Tracking campaign, which the connector can read but not create.
              </p>
            </div>
          </>
        )}
      </div>
    </UnifiedAdminLayout>
  );
};

export default AdminSEOPositionTracking;
