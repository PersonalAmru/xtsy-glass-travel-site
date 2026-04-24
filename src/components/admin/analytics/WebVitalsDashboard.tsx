import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, FileSearch, Activity, AlertTriangle, CheckCircle2, Database } from 'lucide-react';

interface RouteRow {
  route: string;
  samples: number;
  p75_lcp: number;
  p75_inp: number;
  p75_cls: number;
  deploy_versions: string[];
  skeleton_dismissed_pct: number;
  gtm_loaded_pct: number;
  jsonld_avg: number;
}

interface SitemapHealth {
  id: string;
  sitemap_url: string;
  http_status: number | null;
  response_time_ms: number;
  url_count: number;
  newest_lastmod: string | null;
  is_valid_xml: boolean;
  is_crawlable: boolean;
  error_message: string | null;
  checked_at: string;
}

const percentile = (arr: number[], p: number): number => {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor((p / 100) * (sorted.length - 1));
  return Math.round(sorted[idx] * 1000) / 1000;
};

const goodCls = "bg-success text-success-foreground";
const warnCls = "bg-warning text-warning-foreground";
const lcpBadge = (ms: number) => {
  if (!ms) return <Badge variant="outline">No data</Badge>;
  if (ms <= 2500) return <Badge className={goodCls}>{ms} ms · Good</Badge>;
  if (ms <= 4000) return <Badge className={warnCls}>{ms} ms · Needs work</Badge>;
  return <Badge variant="destructive">{ms} ms · Poor</Badge>;
};
const inpBadge = (ms: number) => {
  if (!ms) return <Badge variant="outline">No data</Badge>;
  if (ms <= 200) return <Badge className={goodCls}>{ms} ms · Good</Badge>;
  if (ms <= 500) return <Badge className={warnCls}>{ms} ms · Needs work</Badge>;
  return <Badge variant="destructive">{ms} ms · Poor</Badge>;
};
const clsBadge = (cls: number) => {
  if (!cls) return <Badge variant="outline">0</Badge>;
  if (cls <= 0.1) return <Badge className={goodCls}>{cls.toFixed(3)}</Badge>;
  if (cls <= 0.25) return <Badge className={warnCls}>{cls.toFixed(3)}</Badge>;
  return <Badge variant="destructive">{cls.toFixed(3)}</Badge>;
};

export const WebVitalsDashboard = () => {
  const [rows, setRows] = useState<RouteRow[]>([]);
  const [sitemap, setSitemap] = useState<SitemapHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from('route_performance_metrics')
      .select('route, lcp_ms, inp_ms, cls_score, deploy_version, skeleton_dismissed, gtm_loaded, seo_jsonld_size')
      .gte('created_at', since)
      .limit(5000);

    const grouped = new Map<string, any[]>();
    (data || []).forEach((r: any) => {
      const arr = grouped.get(r.route) || [];
      arr.push(r);
      grouped.set(r.route, arr);
    });

    const computed: RouteRow[] = Array.from(grouped.entries())
      .map(([route, samples]) => ({
        route,
        samples: samples.length,
        p75_lcp: percentile(samples.map((s) => s.lcp_ms).filter(Boolean), 75),
        p75_inp: percentile(samples.map((s) => s.inp_ms).filter(Boolean), 75),
        p75_cls: percentile(samples.map((s) => Number(s.cls_score)).filter((v) => v > 0), 75),
        deploy_versions: Array.from(new Set(samples.map((s) => s.deploy_version).filter(Boolean))).slice(0, 3),
        skeleton_dismissed_pct: Math.round((samples.filter((s) => s.skeleton_dismissed).length / samples.length) * 100),
        gtm_loaded_pct: Math.round((samples.filter((s) => s.gtm_loaded).length / samples.length) * 100),
        jsonld_avg: Math.round(samples.reduce((a, s) => a + (s.seo_jsonld_size || 0), 0) / samples.length),
      }))
      .sort((a, b) => b.p75_lcp - a.p75_lcp);

    setRows(computed);

    const { data: sm } = await supabase
      .from('sitemap_health_checks')
      .select('*')
      .order('checked_at', { ascending: false })
      .limit(1);
    setSitemap(sm?.[0] as any || null);

    setLoading(false);
  };

  const runSitemapCheck = async () => {
    setValidating(true);
    try {
      await supabase.functions.invoke('sitemap-validator', {
        body: { sitemap_url: 'https://xtsy.one/sitemap-priority.xml' },
      });
      await load();
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => { load(); }, []);

  const degrading = rows.filter((r) => r.p75_lcp > 2500 || r.p75_inp > 200);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5" /> Real User Web Vitals
          </h2>
          <p className="text-sm text-muted-foreground">P75 LCP / INP / CLS per route · Last 7 days</p>
        </div>
        <Button onClick={load} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Database className="h-4 w-4" /> Routes tracked</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{rows.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Degrading</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{degrading.length}</div><p className="text-xs text-muted-foreground">LCP &gt; 2.5s or INP &gt; 200ms</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total samples</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{rows.reduce((a, r) => a + r.samples, 0).toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Skeleton OK</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rows.length ? Math.round(rows.reduce((a, r) => a + r.skeleton_dismissed_pct, 0) / rows.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">avg dismissal rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Sitemap health */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><FileSearch className="h-5 w-5" /> Priority Sitemap Health</CardTitle>
            <Button onClick={runSitemapCheck} size="sm" disabled={validating}>
              {validating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              Run check now
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!sitemap ? (
            <p className="text-sm text-muted-foreground">No checks yet. Click "Run check now".</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><div className="text-muted-foreground">HTTP</div><div className="font-bold">{sitemap.http_status === 200 ? <span className="text-success">{sitemap.http_status}</span> : <span className="text-destructive">{sitemap.http_status ?? 'ERR'}</span>}</div></div>
              <div><div className="text-muted-foreground">URLs</div><div className="font-bold">{sitemap.url_count}</div></div>
              <div><div className="text-muted-foreground">Newest lastmod</div><div className="font-bold">{sitemap.newest_lastmod || '—'}</div></div>
              <div><div className="text-muted-foreground">Crawlable</div><div className="font-bold">{sitemap.is_crawlable ? <span className="text-success">Yes</span> : <span className="text-destructive">No</span>}</div></div>
              <div className="col-span-full text-xs text-muted-foreground">Checked: {new Date(sitemap.checked_at).toLocaleString()} · {sitemap.response_time_ms}ms{sitemap.error_message ? ` · ${sitemap.error_message}` : ''}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Per-route table */}
      <Card>
        <CardHeader><CardTitle>Per-route metrics</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No RUM samples yet — visit pages to collect data.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Samples</TableHead>
                    <TableHead>P75 LCP</TableHead>
                    <TableHead>P75 INP</TableHead>
                    <TableHead>P75 CLS</TableHead>
                    <TableHead>Skeleton</TableHead>
                    <TableHead>GTM</TableHead>
                    <TableHead>JSON-LD</TableHead>
                    <TableHead>Deploy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.slice(0, 50).map((r) => (
                    <TableRow key={r.route}>
                      <TableCell className="font-mono text-xs max-w-[220px] truncate">{r.route}</TableCell>
                      <TableCell>{r.samples}</TableCell>
                      <TableCell>{lcpBadge(r.p75_lcp)}</TableCell>
                      <TableCell>{inpBadge(r.p75_inp)}</TableCell>
                      <TableCell>{clsBadge(r.p75_cls)}</TableCell>
                      <TableCell><span className={r.skeleton_dismissed_pct < 95 ? 'text-destructive font-bold' : ''}>{r.skeleton_dismissed_pct}%</span></TableCell>
                      <TableCell>{r.gtm_loaded_pct}%</TableCell>
                      <TableCell className="text-xs">{(r.jsonld_avg / 1024).toFixed(1)} KB</TableCell>
                      <TableCell className="text-xs">{r.deploy_versions.join(', ') || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebVitalsDashboard;
