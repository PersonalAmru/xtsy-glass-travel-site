/**
 * Admin · Competitor Analysis — benchmarks the exact pages and keywords
 * driving bookings for Meghalaya & Northeast India.
 *
 * Live data via the admin-only `semrush-seo-intel` edge function (Semrush
 * gateway). Focused on booking-intent (Hostel, TAB Bistro, XTSY Travel),
 * not informational traffic.
 */
import { useState, useEffect, useCallback } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleSectionHeader } from '@/components/admin/AppleCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  Loader2, RefreshCw, TrendingUp, Target, Swords, Trophy,
  AlertTriangle, ExternalLink, Building2,
} from 'lucide-react';

interface Competitor {
  domain: string; relevance: number; commonKeywords: number;
  organicKeywords: number; organicTraffic: number;
}
interface HeadToHead {
  domain: string; organicKeywords: number; organicTraffic: number;
  organicCost: number; rank: number;
}
interface Keyword {
  keyword: string; position: number; volume: number; cpc: number;
  url?: string; competitor?: string;
}
interface Benchmark {
  database: string; generatedAt: string;
  our: { domain: string; organicKeywords: number; organicTraffic: number; organicCost: number; rank: number };
  competitors: Competitor[];
  headToHead: HeadToHead[];
  ourBookingKeywords: Keyword[];
  competitorBookingKeywords: Keyword[];
}

const fmt = (n: number) => n.toLocaleString('en-IN');

const posClass = (p: number) =>
  p <= 3 ? 'text-emerald-400' : p <= 10 ? 'text-sky-400' : p <= 20 ? 'text-amber-400' : 'text-red-400';

const AdminCompetitorAnalysis = () => {
  const [database, setDatabase] = useState('in');
  const [data, setData] = useState<Benchmark | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (db: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res, error: fnError } = await supabase.functions.invoke('semrush-seo-intel', {
        body: { action: 'competitor-benchmark', database: db },
      });
      if (fnError) throw new Error(fnError.message);
      if ((res as any)?.error) throw new Error((res as any).error);
      setData(res as Benchmark);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load competitor data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(database); }, [load, database]);

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6">
        <AppleSectionHeader
          title="Competitor Analysis"
          subtitle="Booking-intent benchmark · Meghalaya & Northeast India · Semrush live"
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
              <Button variant="outline" size="sm" className="gap-2" disabled={loading}
                onClick={() => load(database)}>
                <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} /> Refresh
              </Button>
            </div>
          }
        />

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm">Pulling live Semrush benchmark…</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.05] p-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-white">Couldn’t load competitor data</p>
              <p className="text-sm text-slate-400 mt-1">{error}</p>
            </div>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Our snapshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Our organic keywords', value: fmt(data.our.organicKeywords) },
                { label: 'Our organic traffic', value: `${fmt(data.our.organicTraffic)}/mo` },
                { label: 'Booking keywords we rank', value: fmt(data.ourBookingKeywords.length) },
                { label: 'Booking gap vs leader', value: fmt(data.competitorBookingKeywords.length), sub: 'they rank, we don’t' },
              ].map((m) => (
                <div key={m.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="text-xs text-slate-500">{m.label}</div>
                  <div className="text-xl font-semibold text-white mt-1">{m.value}</div>
                  {m.sub && <div className="text-[10px] text-slate-500">{m.sub}</div>}
                </div>
              ))}
            </div>

            {/* Competitors */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-primary" /> Organic competitors (auto-discovered)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-white/5">
                      <th className="py-2 pr-4 font-medium">Domain</th>
                      <th className="py-2 px-4 font-medium">Relevance</th>
                      <th className="py-2 px-4 font-medium">Common kw</th>
                      <th className="py-2 px-4 font-medium">Organic kw</th>
                      <th className="py-2 pl-4 font-medium">Traffic/mo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.competitors.map((c) => (
                      <tr key={c.domain} className="border-b border-white/5 last:border-0">
                        <td className="py-2 pr-4 text-white font-medium">{c.domain}</td>
                        <td className="py-2 px-4 text-slate-400">{(c.relevance * 100).toFixed(0)}%</td>
                        <td className="py-2 px-4 text-slate-400">{fmt(c.commonKeywords)}</td>
                        <td className="py-2 px-4 text-slate-400">{fmt(c.organicKeywords)}</td>
                        <td className="py-2 pl-4 text-slate-300">{fmt(c.organicTraffic)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Head to head */}
            {data.headToHead.length > 0 && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                  <Swords className="w-4 h-4 text-primary" /> Head-to-head — top 3 competitors
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-white/5">
                        <th className="py-2 pr-4 font-medium">Domain</th>
                        <th className="py-2 px-4 font-medium">Organic kw</th>
                        <th className="py-2 pl-4 font-medium">Traffic/mo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5 bg-primary/[0.04]">
                        <td className="py-2 pr-4 text-primary font-semibold flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5" /> {data.our.domain} (us)
                        </td>
                        <td className="py-2 px-4 text-white">{fmt(data.our.organicKeywords)}</td>
                        <td className="py-2 pl-4 text-white">{fmt(data.our.organicTraffic)}</td>
                      </tr>
                      {data.headToHead.map((h) => (
                        <tr key={h.domain} className="border-b border-white/5 last:border-0">
                          <td className="py-2 pr-4 text-white font-medium">{h.domain}</td>
                          <td className="py-2 px-4 text-slate-400">{fmt(h.organicKeywords)}</td>
                          <td className="py-2 pl-4 text-slate-300">{fmt(h.organicTraffic)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Booking-intent gap */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-semibold text-white flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-amber-400" /> Booking-intent gap — leader ranks, we don’t
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Commercial keywords (hostel · stay · tour · restaurant) the top competitor captures and XTSY is missing. Prioritise for revenue pages.
              </p>
              {data.competitorBookingKeywords.length === 0 ? (
                <p className="text-sm text-slate-500">No booking-intent gap detected for the leader, or data unavailable.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-white/5">
                        <th className="py-2 pr-4 font-medium">Keyword</th>
                        <th className="py-2 px-4 font-medium">Vol/mo</th>
                        <th className="py-2 px-4 font-medium">Their pos</th>
                        <th className="py-2 px-4 font-medium">CPC</th>
                        <th className="py-2 pl-4 font-medium">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.competitorBookingKeywords.map((k, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0">
                          <td className="py-2 pr-4 text-white">{k.keyword}</td>
                          <td className="py-2 px-4 text-slate-300">{fmt(k.volume)}</td>
                          <td className={cn('py-2 px-4 font-medium', posClass(k.position))}>#{k.position}</td>
                          <td className="py-2 px-4 text-slate-400">${k.cpc.toFixed(2)}</td>
                          <td className="py-2 pl-4 text-slate-500 truncate max-w-[160px]">{k.competitor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Our booking footprint */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Our booking-intent footprint
              </h3>
              {data.ourBookingKeywords.length === 0 ? (
                <p className="text-sm text-slate-500">No booking-intent keywords ranking yet — the core opportunity.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-white/5">
                        <th className="py-2 pr-4 font-medium">Keyword</th>
                        <th className="py-2 px-4 font-medium">Vol/mo</th>
                        <th className="py-2 px-4 font-medium">Our pos</th>
                        <th className="py-2 pl-4 font-medium">Page</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.ourBookingKeywords.slice(0, 30).map((k, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0">
                          <td className="py-2 pr-4 text-white">{k.keyword}</td>
                          <td className="py-2 px-4 text-slate-300">{fmt(k.volume)}</td>
                          <td className={cn('py-2 px-4 font-medium', posClass(k.position))}>#{k.position}</td>
                          <td className="py-2 pl-4">
                            {k.url ? (
                              <a href={k.url} target="_blank" rel="noreferrer"
                                className="text-sky-400 hover:underline inline-flex items-center gap-1 truncate max-w-[220px]">
                                {k.url.replace('https://xtsy.one', '') || '/'}
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            ) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <p className="text-xs text-slate-600 text-center">
              Source: Semrush ({data.database.toUpperCase()}) · generated {new Date(data.generatedAt).toLocaleString()}
            </p>
          </>
        )}
      </div>
    </UnifiedAdminLayout>
  );
};

export default AdminCompetitorAnalysis;
