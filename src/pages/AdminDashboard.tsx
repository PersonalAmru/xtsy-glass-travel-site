/**
 * Admin Dashboard - Apple UI/UX Design
 * Unified analytics, inventory management, and availability calendar
 */

import { useState, useEffect, useMemo } from 'react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AppleCard, AppleMetricCard, AppleLiveIndicator, AppleSectionHeader } from '@/components/admin/AppleCard';
import { InventoryManager } from '@/components/admin/InventoryManager';
import { AvailabilityCalendar } from '@/components/admin/AvailabilityCalendar';
import WorldMapHeatmap from '@/components/admin/WorldMapHeatmap';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Users, Eye, Clock, Activity, RefreshCw, TrendingUp,
  Monitor, Smartphone, Tablet, Target, Zap, BarChart3,
  ArrowUpRight, ArrowDownRight, Globe,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// Conversion Funnel Component
const ConversionFunnel = ({ data }: { data: any }) => {
  if (!data?.funnels?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        No conversion data yet
      </div>
    );
  }

  const bookingFunnel = data.funnels.find((f: any) => f.funnel === 'booking');
  if (!bookingFunnel) return null;

  const maxCount = Math.max(...bookingFunnel.steps.map((s: any) => s.count));

  return (
    <div className="space-y-3">
      {bookingFunnel.steps.map((step: any, index: number) => {
        const width = maxCount > 0 ? (step.count / maxCount) * 100 : 0;
        return (
          <div key={step.step} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium truncate">{step.step.replace(/_/g, ' ').toUpperCase()}</span>
              <span className="text-muted-foreground">{step.count.toLocaleString()}</span>
            </div>
            <div className="h-6 bg-muted rounded-lg overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                style={{ width: `${width}%` }}
              />
              {index > 0 && parseFloat(step.dropoff) > 0 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-destructive">
                  -{step.dropoff}%
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
        <div className="flex justify-between items-center">
          <span className="font-medium text-success text-sm">Overall Conversion</span>
          <span className="text-xl font-bold text-success">{bookingFunnel.conversion_rate}%</span>
        </div>
      </div>
    </div>
  );
};

// Insight Card Component
const InsightCard = ({ title, description, action, type }: {
  title: string;
  description: string;
  action?: string;
  type: 'opportunity' | 'warning' | 'success';
}) => {
  const colors = {
    opportunity: 'bg-primary/10 border-primary/30 text-primary',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    success: 'bg-success/10 border-success/30 text-success',
  };

  return (
    <AppleCard className={cn('border', colors[type])} padding="sm">
      <div className="flex items-start gap-3">
        <Target className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs mt-1 opacity-80">{description}</p>
          {action && <p className="text-xs mt-2 font-medium">→ {action}</p>}
        </div>
      </div>
    </AppleCard>
  );
};

export default function AdminDashboard() {
  const [daysBack, setDaysBack] = useState(30);
  const { loading, error, overview, realtime, geoHeatmap, funnel, traffic, behavior, trends, refresh } = useAdminAnalytics(daysBack);

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Generate intelligent insights
  const insights = useMemo(() => {
    const result: Array<{ title: string; description: string; action?: string; type: 'opportunity' | 'warning' | 'success' }> = [];

    if (geoHeatmap?.countries) {
      const highTrafficNoConversion = geoHeatmap.countries
        .filter((c: any) => c.visitors > 10 && (c.bookings || 0) === 0)
        .slice(0, 1);

      highTrafficNoConversion.forEach((c: any) => {
        result.push({
          title: `Untapped: ${c.country_name || c.country_code}`,
          description: `${c.visitors} visitors, 0 bookings`,
          action: 'Consider targeted marketing',
          type: 'opportunity',
        });
      });
    }

    if (overview?.bounce_rate && parseFloat(overview.bounce_rate) > 60) {
      result.push({
        title: 'High bounce rate',
        description: `${overview.bounce_rate}% leave without interaction`,
        action: 'Improve landing page',
        type: 'warning',
      });
    }

    if (realtime?.active_visitors && realtime.active_visitors > 5) {
      result.push({
        title: 'High live traffic!',
        description: `${realtime.active_visitors} visitors now`,
        type: 'success',
      });
    }

    return result;
  }, [geoHeatmap, overview, realtime]);

  return (
    <AdminLayout>
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Intelligence</h1>
            <p className="text-sm text-muted-foreground">XTSY Business Insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={daysBack.toString()} onValueChange={(v) => setDaysBack(parseInt(v))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            </Button>
          </div>
        </header>

        {error && (
          <AppleCard className="border-destructive/50 bg-destructive/10">
            <p className="text-destructive text-sm">{error}</p>
          </AppleCard>
        )}

        {/* Overview Section */}
        <section id="overview" className="space-y-6">
          <AppleLiveIndicator count={realtime?.active_visitors || 0} />

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <AppleCard key={i} variant="elevated">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </AppleCard>
              ))
            ) : (
              <>
                <AppleMetricCard
                  title="Total Visitors"
                  value={overview?.total_visitors || 0}
                  icon={<Users className="w-5 h-5" />}
                  subtitle={`${overview?.new_visitor_rate || 0}% new`}
                  accentColor="primary"
                />
                <AppleMetricCard
                  title="Page Views"
                  value={overview?.total_pageviews || 0}
                  icon={<Eye className="w-5 h-5" />}
                />
                <AppleMetricCard
                  title="Avg. Session"
                  value={formatDuration(overview?.avg_session_duration || 0)}
                  icon={<Clock className="w-5 h-5" />}
                  subtitle={`${overview?.bounce_rate || 0}% bounce`}
                />
                <AppleMetricCard
                  title="Sessions"
                  value={overview?.total_sessions || 0}
                  icon={<Activity className="w-5 h-5" />}
                />
              </>
            )}
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div>
              <AppleSectionHeader title="Smart Insights" subtitle="AI-powered recommendations" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {insights.slice(0, 3).map((insight, i) => (
                  <InsightCard key={i} {...insight} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Analytics Section */}
        <section id="analytics" className="space-y-6">
          <AppleSectionHeader title="Analytics" subtitle="Traffic and conversion data" />
          
          <WorldMapHeatmap data={geoHeatmap} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            <AppleCard variant="elevated">
              <AppleSectionHeader title="Conversion Funnel" subtitle="Visitor journey" />
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <ConversionFunnel data={funnel} />
              )}
            </AppleCard>

            {/* Traffic Breakdown */}
            <AppleCard variant="elevated">
              <AppleSectionHeader title="Traffic Breakdown" subtitle="Devices & sources" />
              {loading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Devices</p>
                    {Object.entries(behavior?.devices || {}).map(([device, count]) => {
                      const total = Object.values(behavior?.devices || {}).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? ((count as number) / total * 100).toFixed(0) : 0;
                      const Icon = device === 'mobile' ? Smartphone : device === 'tablet' ? Tablet : Monitor;
                      return (
                        <div key={device} className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex justify-between mb-1 text-xs">
                              <span className="capitalize">{device}</span>
                              <span className="text-muted-foreground">{percentage}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground">Top Sources</p>
                    {traffic?.sources?.slice(0, 4).map((source: any, i: number) => (
                      <div key={source.source} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5">{i + 1}</Badge>
                          <span className="truncate max-w-[100px]">{source.source || 'direct'}</span>
                        </div>
                        <span className="font-medium">{source.sessions}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AppleCard>
          </div>

          {/* Trends Chart */}
          <AppleCard variant="elevated">
            <AppleSectionHeader title="Traffic Trends" subtitle="Daily visitors & sessions" />
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : trends?.daily?.length ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends.daily}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" />
                    <Area type="monotone" dataKey="sessions" stroke="hsl(var(--success))" fill="hsl(var(--success)/0.2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No trend data available
              </div>
            )}
          </AppleCard>
        </section>

        {/* Inventory Section */}
        <section id="inventory">
          <InventoryManager />
        </section>

        {/* Calendar Section */}
        <section id="calendar">
          <AvailabilityCalendar />
        </section>

        {/* Activity Section */}
        <section id="activity" className="space-y-6">
          <AppleSectionHeader title="Live Activity" subtitle="Real-time visitor tracking" />
          <AppleCard variant="elevated" className="text-center py-12">
            <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Real-time activity feed coming soon</p>
          </AppleCard>
        </section>
      </div>
    </AdminLayout>
  );
}
