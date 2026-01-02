/**
 * Admin Overview Page - Main dashboard metrics
 */

import { useState } from 'react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AppleCard, AppleMetricCard, AppleLiveIndicator } from '@/components/admin/AppleCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Users, Eye, Clock, Activity, RefreshCw } from 'lucide-react';

export default function AdminOverview() {
  const [daysBack, setDaysBack] = useState(30);
  const { loading, error, overview, realtime, refresh } = useAdminAnalytics(daysBack);

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

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
      </div>
    </AdminLayout>
  );
}
