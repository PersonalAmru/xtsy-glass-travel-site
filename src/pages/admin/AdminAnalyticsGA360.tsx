/**
 * Admin Analytics - GA360 Grade Dashboard
 * Advanced analytics with real-time traffic, user segmentation, and conversion tracking
 */

import { useState, useEffect, useMemo } from 'react';
import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { useConsentAnalytics } from '@/hooks/useConsentAnalytics';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Users, Eye, Clock, Activity, RefreshCw, TrendingUp, TrendingDown,
  Smartphone, Monitor, Tablet, ArrowUpRight, ArrowDownRight,
  Sparkles, Zap, Apple, Tag
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { ConversionFunnelChart } from '@/components/admin/analytics/ConversionFunnelChart';
import { TagTimelineChart } from '@/components/admin/analytics/TagTimelineChart';
import { ConsentAnalyticsChart } from '@/components/admin/analytics/ConsentAnalyticsChart';

interface RealtimeVisitor {
  visitor_id: string;
  session_id: string;
  page_path: string;
  device_type: string;
  country_code: string;
  last_seen_at: string;
}

interface FunnelStep {
  step: string;
  count: number;
  dropoff: number;
}

const DEVICE_ICONS = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminAnalyticsGA360() {
  const [daysBack, setDaysBack] = useState(30);
  const { loading, error, overview, funnel, traffic, behavior, trends, refresh } = useAdminAnalytics(daysBack);
  const { consentData, tagData, funnelData, loading: consentLoading } = useConsentAnalytics(daysBack);
  const [realtimeVisitors, setRealtimeVisitors] = useState<RealtimeVisitor[]>([]);
  const [highIntentUsers, setHighIntentUsers] = useState<any[]>([]);

  // Fetch realtime visitors
  useEffect(() => {
    const fetchRealtime = async () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from('analytics_realtime')
        .select('visitor_id, session_id, page_path, device_type, country_code, last_seen_at')
        .gte('last_seen_at', fiveMinutesAgo)
        .order('last_seen_at', { ascending: false });
      
      if (data) setRealtimeVisitors(data as RealtimeVisitor[]);
    };

    fetchRealtime();
    const interval = setInterval(fetchRealtime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch high intent users
  useEffect(() => {
    const fetchHighIntent = async () => {
      const { data } = await supabase
        .from('traveller_profiles')
        .select('visitor_id, booking_intent_score, last_page_viewed, device_type, is_android, is_ios, last_seen_at')
        .eq('is_high_intent', true)
        .order('booking_intent_score', { ascending: false })
        .limit(20);
      
      if (data) setHighIntentUsers(data);
    };

    fetchHighIntent();
  }, []);

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const deviceBreakdown = useMemo(() => {
    if (!behavior?.devices) return [];
    return Object.entries(behavior.devices).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value as number,
    }));
  }, [behavior?.devices]);

  const sourceBreakdown = useMemo(() => {
    if (!traffic?.sources) return [];
    return traffic.sources.slice(0, 5).map((s: any) => ({
      name: s.source?.charAt(0).toUpperCase() + s.source?.slice(1) || 'Direct',
      value: s.visitors || 0,
    }));
  }, [traffic?.sources]);

  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-sm text-slate-400">GA360-grade insights & real-time monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={daysBack.toString()} onValueChange={(v) => setDaysBack(parseInt(v))}>
              <SelectTrigger className="w-[130px] bg-slate-800/50 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            </Button>
          </div>
        </header>

        {error && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Real-time Visitors Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent rounded-2xl p-4 border border-emerald-500/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{realtimeVisitors.length}</span>
                  <span className="text-emerald-400 text-sm font-medium">active now</span>
                </div>
                <p className="text-slate-400 text-sm">Real-time visitors on site</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {Object.entries(
                realtimeVisitors.reduce((acc, v) => {
                  const type = v.device_type || 'desktop';
                  acc[type] = (acc[type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([device, count]) => {
                const Icon = DEVICE_ICONS[device as keyof typeof DEVICE_ICONS] || Monitor;
                return (
                  <div key={device} className="flex items-center gap-2 text-slate-300">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-700/50">
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <MetricCard
                title="Total Visitors"
                value={overview?.total_visitors || 0}
                change={typeof overview?.new_visitor_rate === 'string' ? parseFloat(overview.new_visitor_rate) : overview?.new_visitor_rate}
                icon={<Users className="w-5 h-5" />}
                color="emerald"
              />
              <MetricCard
                title="Page Views"
                value={overview?.total_pageviews || 0}
                icon={<Eye className="w-5 h-5" />}
                color="blue"
              />
              <MetricCard
                title="Avg. Session"
                value={formatDuration(overview?.avg_session_duration || 0)}
                subtitle={`${overview?.bounce_rate || 0}% bounce`}
                icon={<Clock className="w-5 h-5" />}
                color="amber"
                isText
              />
              <MetricCard
                title="Sessions"
                value={overview?.total_sessions || 0}
                icon={<Activity className="w-5 h-5" />}
                color="purple"
              />
            </>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-slate-800/50 border-slate-700/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
            <TabsTrigger value="gtm" className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              GTM & Consent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Traffic Trends Chart */}
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Traffic Trends</CardTitle>
                <CardDescription>Daily visitors and sessions over time</CardDescription>
              </CardHeader>
              <CardContent>
                {trends?.daily && trends.daily.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trends.daily}>
                      <defs>
                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#64748b" tickFormatter={(v) => v ? format(new Date(v), 'MMM d') : ''} />
                      <YAxis stroke="#64748b" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="visitors" stroke="#22c55e" fill="url(#colorVisitors)" strokeWidth={2} />
                      <Area type="monotone" dataKey="sessions" stroke="#3b82f6" fill="url(#colorSessions)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500">
                    No trend data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Device & Source Breakdown */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-base">Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {deviceBreakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={deviceBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {deviceBreakdown.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-slate-500">No data</div>
                  )}
                  <div className="flex justify-center gap-4 mt-2">
                    {deviceBreakdown.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        {item.name}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-base">Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  {sourceBreakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={sourceBreakdown} layout="vertical">
                        <XAxis type="number" stroke="#64748b" />
                        <YAxis type="category" dataKey="name" stroke="#64748b" width={80} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-slate-500">No data</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Active Visitors</CardTitle>
                <CardDescription>Users currently on the site</CardDescription>
              </CardHeader>
              <CardContent>
                {realtimeVisitors.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No active visitors</div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {realtimeVisitors.map((visitor, i) => {
                      const Icon = DEVICE_ICONS[visitor.device_type as keyof typeof DEVICE_ICONS] || Monitor;
                      return (
                        <motion.div
                          key={visitor.session_id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-sm text-white font-mono">{visitor.page_path}</p>
                              <p className="text-xs text-slate-500">ID: {visitor.visitor_id.substring(0, 12)}...</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{visitor.country_code || 'Unknown'}</Badge>
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-4">
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">High Intent Users</CardTitle>
                <CardDescription>Users with highest booking intent scores</CardDescription>
              </CardHeader>
              <CardContent>
                {highIntentUsers.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No high intent users detected</div>
                ) : (
                  <div className="space-y-3">
                    {highIntentUsers.map((user, i) => (
                      <div key={user.visitor_id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                            {user.is_ios ? <Apple className="w-5 h-5 text-white" /> :
                             user.is_android ? <Smartphone className="w-5 h-5 text-white" /> :
                             <Monitor className="w-5 h-5 text-white" />}
                          </div>
                          <div>
                            <p className="text-sm text-white font-mono">{user.visitor_id.substring(0, 16)}...</p>
                            <p className="text-xs text-slate-500">{user.last_page_viewed || 'Unknown page'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-emerald-400">{user.booking_intent_score}%</p>
                            <p className="text-xs text-slate-500">Intent Score</p>
                          </div>
                          <Progress value={user.booking_intent_score} className="w-20 h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversions" className="space-y-4">
            {funnelData && (
              <ConversionFunnelChart data={funnelData} loading={consentLoading} />
            )}
          </TabsContent>

          {/* GTM & Consent Tab */}
          <TabsContent value="gtm" className="space-y-6">
            {tagData && (
              <TagTimelineChart data={tagData} loading={consentLoading} />
            )}
            {consentData && (
              <ConsentAnalyticsChart data={consentData} loading={consentLoading} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedAdminLayout>
  );
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  change, 
  subtitle, 
  icon, 
  color,
  isText = false
}: { 
  title: string;
  value: number | string;
  change?: number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'emerald' | 'blue' | 'amber' | 'purple';
  isText?: boolean;
}) {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400',
    blue: 'bg-blue-500/10 text-blue-400',
    amber: 'bg-amber-500/10 text-amber-400',
    purple: 'bg-purple-500/10 text-purple-400',
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={cn('p-2 rounded-lg', colorClasses[color])}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 text-xs font-medium', change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-white">
          {isText ? value : typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-xs text-slate-500 mt-1">{subtitle || title}</p>
      </CardContent>
    </Card>
  );
}
