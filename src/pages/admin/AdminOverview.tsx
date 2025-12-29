/**
 * Admin Overview Page - Main dashboard metrics
 */

import { useState, useMemo } from 'react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AppleCard, AppleMetricCard, AppleLiveIndicator, AppleSectionHeader } from '@/components/admin/AppleCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Users, Eye, Clock, Activity, RefreshCw, Target,
} from 'lucide-react';

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

export default function AdminOverview() {
  const [daysBack, setDaysBack] = useState(30);
  const { loading, error, overview, realtime, geoHeatmap, refresh } = useAdminAnalytics(daysBack);

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
      <div className="p-6 space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
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

        {/* Live Indicator */}
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
      </div>
    </AdminLayout>
  );
}
