/**
 * Admin · Destination → Bookings Funnel
 *
 * Shows how visits to high-traffic destination pages (/places-to-visit/*)
 * convert into availability checks, booking clicks, and completed bookings.
 * Data comes from the admin-only `destination-funnel-report` edge function
 * (service-role reads of the analytics tables, session-keyed attribution).
 */
import { useState, useEffect, useCallback } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleSectionHeader } from '@/components/admin/AppleCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw, TrendingDown, Users, CalendarCheck, MousePointerClick, BedDouble } from 'lucide-react';

interface FunnelStage {
  key: string;
  label: string;
  sessions: number;
  pct_of_visits: number;
}
interface DestRow {
  slug: string;
  visits: number;
  availability_checks: number;
  booking_clicks: number;
  bookings_created: number;
  visit_to_availability_pct: number;
  availability_to_click_pct: number;
  visit_to_booking_pct: number;
}
interface Report {
  window_days: number;
  totals: { destination_pageviews: number; sessions_starting_on_destination: number };
  funnel: FunnelStage[];
  destinations: DestRow[];
}

const stageIcon: Record<string, typeof Users> = {
  visit: Users,
  availability: CalendarCheck,
  bookingClick: MousePointerClick,
  bookingCreated: BedDouble,
};

const AdminDestinationFunnel = () => {
  const [days, setDays] = useState('30');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (d: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke(
        `destination-funnel-report?days=${d}`,
        { method: 'GET' },
      );
      if (fnErr) throw new Error(fnErr.message);
      if ((data as any)?.error) throw new Error((data as any).error);
      setReport(data as Report);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load funnel report');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(days); }, [load, days]);

  const maxVisits = report?.funnel[0]?.sessions || 1;

  return (
    <UnifiedAdminLayout>
      <div className="space-y-6">
        <AppleSectionHeader
          title="Destination → Bookings Funnel"
          subtitle="How destination-page visits convert into availability checks, booking clicks and bookings"
        />

        <div className="flex flex-wrap items-center gap-3">
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => load(days)} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && !report && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading funnel…
          </div>
        )}

        {report && (
          <>
            {report.totals.sessions_starting_on_destination === 0 && (
              <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                No destination-originated sessions recorded in this window yet. Once live visitors
                land on <code>/places-to-visit/*</code> pages and interact with the booking CTAs,
                the funnel will populate here.
              </div>
            )}

            {/* Funnel stages */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {report.funnel.map((s) => {
                const Icon = stageIcon[s.key] ?? Users;
                return (
                  <div key={s.key} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">{s.pct_of_visits}%</span>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-foreground">{s.sessions.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((s.sessions / maxVisits) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Per-destination breakdown */}
            <div className="rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border p-4">
                <TrendingDown className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Per-destination conversion</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="p-3 font-medium">Destination</th>
                      <th className="p-3 font-medium text-right">Visits</th>
                      <th className="p-3 font-medium text-right">Avail. checks</th>
                      <th className="p-3 font-medium text-right">Booking clicks</th>
                      <th className="p-3 font-medium text-right">Bookings</th>
                      <th className="p-3 font-medium text-right">Visit→Avail</th>
                      <th className="p-3 font-medium text-right">Visit→Booking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.destinations.length === 0 && (
                      <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">No data in this window.</td></tr>
                    )}
                    {report.destinations.map((d) => (
                      <tr key={d.slug} className="border-t border-border">
                        <td className="p-3 font-medium text-foreground">{d.slug}</td>
                        <td className="p-3 text-right">{d.visits.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right">{d.availability_checks.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right">{d.booking_clicks.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right">{d.bookings_created.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right text-muted-foreground">{d.visit_to_availability_pct}%</td>
                        <td className="p-3 text-right text-muted-foreground">{d.visit_to_booking_pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </UnifiedAdminLayout>
  );
};

export default AdminDestinationFunnel;
