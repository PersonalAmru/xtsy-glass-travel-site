import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, GitCompare, TrendingDown, TrendingUp, Minus } from 'lucide-react';

/**
 * RUM deploy comparison — pick a baseline deploy_version and one or more
 * candidate versions. We compute P75 LCP/INP/TBT and a bootstrap 95% CI so
 * you can see whether a "win" is statistically meaningful, not just noise.
 *
 * Segmentation: device_type, connection_type, first-visit vs returning.
 */

type Row = {
  deploy_version: string;
  device_type: string | null;
  connection_type: string | null;
  is_returning_visitor: boolean | null;
  lcp_ms: number | null;
  inp_ms: number | null;
  tbt_ms: number | null;
};

const percentile = (arr: number[], p: number): number => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const idx = Math.floor((p / 100) * (s.length - 1));
  return s[idx];
};

// Bootstrap 95% CI for P75 of a metric — 200 resamples is plenty here.
const bootstrapCI = (values: number[], p = 75, reps = 200): [number, number] => {
  if (values.length < 5) return [0, 0];
  const stats: number[] = [];
  const n = values.length;
  for (let i = 0; i < reps; i++) {
    const sample: number[] = [];
    for (let j = 0; j < n; j++) sample.push(values[Math.floor(Math.random() * n)]);
    stats.push(percentile(sample, p));
  }
  stats.sort((a, b) => a - b);
  return [Math.round(stats[Math.floor(reps * 0.025)]), Math.round(stats[Math.floor(reps * 0.975)])];
};

type Segment = 'all' | 'mobile' | 'tablet' | 'desktop' | 'first_visit' | 'returning' | 'slow_net' | 'fast_net';

const applySegment = (rows: Row[], seg: Segment): Row[] => {
  switch (seg) {
    case 'mobile': return rows.filter(r => r.device_type === 'mobile');
    case 'tablet': return rows.filter(r => r.device_type === 'tablet');
    case 'desktop': return rows.filter(r => r.device_type === 'desktop');
    case 'first_visit': return rows.filter(r => r.is_returning_visitor === false);
    case 'returning': return rows.filter(r => r.is_returning_visitor === true);
    case 'slow_net': return rows.filter(r => ['slow-2g', '2g', '3g'].includes(r.connection_type || ''));
    case 'fast_net': return rows.filter(r => ['4g', '5g'].includes(r.connection_type || ''));
    default: return rows;
  }
};

const deltaBadge = (baseline: number, candidate: number, lowerIsBetter = true) => {
  if (!baseline || !candidate) return <Badge variant="outline">—</Badge>;
  const diff = candidate - baseline;
  const pct = Math.round((diff / baseline) * 100);
  const improved = lowerIsBetter ? diff < 0 : diff > 0;
  const Icon = Math.abs(pct) < 3 ? Minus : improved ? TrendingDown : TrendingUp;
  const cls = Math.abs(pct) < 3
    ? 'bg-muted text-muted-foreground'
    : improved
      ? 'bg-success text-success-foreground'
      : 'bg-destructive text-destructive-foreground';
  return (
    <Badge className={cls}>
      <Icon className="h-3 w-3 mr-1" />
      {diff > 0 ? '+' : ''}{Math.round(diff)}ms ({pct > 0 ? '+' : ''}{pct}%)
    </Badge>
  );
};

const AdminRUMCompare = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [baseline, setBaseline] = useState<string>('');
  const [candidate, setCandidate] = useState<string>('');
  const [segment, setSegment] = useState<Segment>('all');
  const [days, setDays] = useState('14');

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - parseInt(days) * 86400 * 1000).toISOString();
    const { data } = await supabase
      .from('route_performance_metrics')
      .select('deploy_version, device_type, connection_type, is_returning_visitor, lcp_ms, inp_ms, tbt_ms')
      .gte('created_at', since)
      .not('deploy_version', 'is', null)
      .limit(20000);
    setRows((data || []) as Row[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [days]);

  const versions = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach(r => map.set(r.deploy_version, (map.get(r.deploy_version) || 0) + 1));
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([v, c]) => ({ version: v, samples: c }));
  }, [rows]);

  useEffect(() => {
    if (!baseline && versions.length >= 2) setBaseline(versions[1].version);
    if (!candidate && versions.length >= 1) setCandidate(versions[0].version);
  }, [versions, baseline, candidate]);

  const stats = useMemo(() => {
    const compute = (v: string) => {
      const seg = applySegment(rows.filter(r => r.deploy_version === v), segment);
      const lcp = seg.map(r => r.lcp_ms).filter((n): n is number => !!n);
      const inp = seg.map(r => r.inp_ms).filter((n): n is number => !!n);
      const tbt = seg.map(r => r.tbt_ms).filter((n): n is number => !!n);
      return {
        samples: seg.length,
        p75_lcp: percentile(lcp, 75),
        p75_lcp_ci: bootstrapCI(lcp, 75),
        p75_inp: percentile(inp, 75),
        p75_inp_ci: bootstrapCI(inp, 75),
        p75_tbt: percentile(tbt, 75),
        p75_tbt_ci: bootstrapCI(tbt, 75),
      };
    };
    return { base: compute(baseline), cand: compute(candidate) };
  }, [rows, baseline, candidate, segment]);

  // Segment breakdown table — candidate vs baseline across every segment.
  const segments: Segment[] = ['all', 'mobile', 'tablet', 'desktop', 'first_visit', 'returning', 'slow_net', 'fast_net'];
  const segTable = useMemo(() => segments.map(seg => {
    const baseSeg = applySegment(rows.filter(r => r.deploy_version === baseline), seg);
    const candSeg = applySegment(rows.filter(r => r.deploy_version === candidate), seg);
    const p75 = (arr: Row[], k: 'lcp_ms' | 'inp_ms' | 'tbt_ms') =>
      percentile(arr.map(r => r[k]).filter((n): n is number => !!n), 75);
    return {
      seg,
      base_samples: baseSeg.length,
      cand_samples: candSeg.length,
      base_lcp: p75(baseSeg, 'lcp_ms'),
      cand_lcp: p75(candSeg, 'lcp_ms'),
      base_inp: p75(baseSeg, 'inp_ms'),
      cand_inp: p75(candSeg, 'inp_ms'),
      base_tbt: p75(baseSeg, 'tbt_ms'),
      cand_tbt: p75(candSeg, 'tbt_ms'),
    };
  }), [rows, baseline, candidate]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GitCompare className="h-6 w-6" /> RUM Deploy Comparison
          </h1>
          <p className="text-sm text-muted-foreground">
            P75 with bootstrap 95% CIs — segmented by device, connection, and visitor cohort.
          </p>
        </div>
        <Button onClick={load} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Baseline deploy</label>
            <Select value={baseline} onValueChange={setBaseline}>
              <SelectTrigger><SelectValue placeholder="Select baseline" /></SelectTrigger>
              <SelectContent>
                {versions.map(v => (
                  <SelectItem key={v.version} value={v.version}>
                    <span className="font-mono text-xs">{v.version}</span> · {v.samples}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Candidate deploy</label>
            <Select value={candidate} onValueChange={setCandidate}>
              <SelectTrigger><SelectValue placeholder="Select candidate" /></SelectTrigger>
              <SelectContent>
                {versions.map(v => (
                  <SelectItem key={v.version} value={v.version}>
                    <span className="font-mono text-xs">{v.version}</span> · {v.samples}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Segment</label>
            <Select value={segment} onValueChange={(v) => setSegment(v as Segment)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All traffic</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="first_visit">First-time visitors</SelectItem>
                <SelectItem value="returning">Returning visitors</SelectItem>
                <SelectItem value="slow_net">Slow network (2g/3g)</SelectItem>
                <SelectItem value="fast_net">Fast network (4g/5g)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Time window</label>
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Last 3 days</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <>
          {/* Delta cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'P75 LCP', base: stats.base.p75_lcp, cand: stats.cand.p75_lcp, baseCI: stats.base.p75_lcp_ci, candCI: stats.cand.p75_lcp_ci },
              { label: 'P75 INP', base: stats.base.p75_inp, cand: stats.cand.p75_inp, baseCI: stats.base.p75_inp_ci, candCI: stats.cand.p75_inp_ci },
              { label: 'P75 TBT', base: stats.base.p75_tbt, cand: stats.cand.p75_tbt, baseCI: stats.base.p75_tbt_ci, candCI: stats.cand.p75_tbt_ci },
            ].map(m => (
              <Card key={m.label}>
                <CardHeader className="pb-2"><CardTitle className="text-sm">{m.label}</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{m.cand}ms</div>
                  <div className="text-xs text-muted-foreground">
                    baseline {m.base}ms · CI [{m.baseCI[0]}, {m.baseCI[1]}] → [{m.candCI[0]}, {m.candCI[1]}]
                  </div>
                  <div className="mt-2">{deltaBadge(m.base, m.cand)}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Segment breakdown — candidate vs baseline (P75)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Segment</TableHead>
                      <TableHead>Samples (b/c)</TableHead>
                      <TableHead>LCP</TableHead>
                      <TableHead>Δ LCP</TableHead>
                      <TableHead>INP</TableHead>
                      <TableHead>Δ INP</TableHead>
                      <TableHead>TBT</TableHead>
                      <TableHead>Δ TBT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {segTable.map(s => (
                      <TableRow key={s.seg}>
                        <TableCell className="capitalize">{s.seg.replace('_', ' ')}</TableCell>
                        <TableCell className="text-xs">{s.base_samples}/{s.cand_samples}</TableCell>
                        <TableCell className="text-xs">{s.base_lcp} → {s.cand_lcp}</TableCell>
                        <TableCell>{deltaBadge(s.base_lcp, s.cand_lcp)}</TableCell>
                        <TableCell className="text-xs">{s.base_inp} → {s.cand_inp}</TableCell>
                        <TableCell>{deltaBadge(s.base_inp, s.cand_inp)}</TableCell>
                        <TableCell className="text-xs">{s.base_tbt} → {s.cand_tbt}</TableCell>
                        <TableCell>{deltaBadge(s.base_tbt, s.cand_tbt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            CIs are 95% bootstrap intervals (200 resamples). If baseline & candidate CIs overlap, the delta is likely noise.
          </p>
        </>
      )}
    </div>
  );
};

export default AdminRUMCompare;
