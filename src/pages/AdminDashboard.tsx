import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Eye, MousePointer, Clock, TrendingUp, Globe, 
  Activity, RefreshCw, ArrowUpRight, ArrowDownRight,
  Monitor, Smartphone, Tablet, MapPin, Zap, Search, Target,
  BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import WorldMapHeatmap from '@/components/admin/WorldMapHeatmap';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

// Smart Metric Card with trend analysis
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; isUp: boolean };
  subtitle?: string;
  highlight?: boolean;
}> = ({ title, value, icon, trend, subtitle, highlight }) => (
  <Card className={`bg-card/50 backdrop-blur-sm border-border/50 transition-all hover:shadow-lg ${highlight ? 'ring-2 ring-primary/30' : ''}`}>
    <CardContent className="p-4 md:p-6">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <h3 className="text-xl md:text-2xl font-bold mt-1 truncate">{value}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center text-xs mt-2 ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isUp ? <ArrowUpRight className="w-3 h-3 mr-1 flex-shrink-0" /> : <ArrowDownRight className="w-3 h-3 mr-1 flex-shrink-0" />}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        <div className="p-2 md:p-3 bg-primary/10 rounded-full flex-shrink-0">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Intelligent Insight Card
const InsightCard: React.FC<{
  title: string;
  description: string;
  action?: string;
  type: 'opportunity' | 'warning' | 'success';
}> = ({ title, description, action, type }) => {
  const colors = {
    opportunity: 'bg-blue-500/10 border-blue-500/30 text-blue-600',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-600',
    success: 'bg-green-500/10 border-green-500/30 text-green-600',
  };
  
  return (
    <div className={`p-3 md:p-4 rounded-lg border ${colors[type]}`}>
      <div className="flex items-start gap-3">
        <Target className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs mt-1 opacity-80">{description}</p>
          {action && <p className="text-xs mt-2 font-medium">→ {action}</p>}
        </div>
      </div>
    </div>
  );
};

// Conversion Funnel Component
const ConversionFunnel: React.FC<{ data: any }> = ({ data }) => {
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
            <div className="flex justify-between text-xs md:text-sm">
              <span className="font-medium truncate">{step.step.replace(/_/g, ' ').toUpperCase()}</span>
              <span className="text-muted-foreground">{step.count.toLocaleString()}</span>
            </div>
            <div className="h-6 md:h-8 bg-muted rounded-lg overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                style={{ width: `${width}%` }}
              />
              {index > 0 && parseFloat(step.dropoff) > 0 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] md:text-xs text-red-500">
                  -{step.dropoff}%
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div className="mt-4 p-3 md:p-4 bg-green-500/10 rounded-lg border border-green-500/20">
        <div className="flex justify-between items-center">
          <span className="font-medium text-green-600 text-sm">Overall Conversion</span>
          <span className="text-xl md:text-2xl font-bold text-green-600">{bookingFunnel.conversion_rate}%</span>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [daysBack, setDaysBack] = useState(30);
  const { loading, error, overview, realtime, geoHeatmap, funnel, traffic, behavior, trends, refresh } = useAdminAnalytics(daysBack);

  // Check admin access
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin-login');
        return;
      }

      const { data: isAdminResult } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });

      if (!isAdminResult) {
        navigate('/');
        return;
      }

      setIsAdmin(true);
    };

    checkAdmin();
  }, [navigate]);

  // Generate intelligent insights
  const insights = useMemo(() => {
    const result: Array<{ title: string; description: string; action?: string; type: 'opportunity' | 'warning' | 'success' }> = [];
    
    if (geoHeatmap?.countries) {
      const highTrafficNoConversion = geoHeatmap.countries
        .filter((c: any) => c.visitors > 10 && (c.bookings || 0) === 0)
        .slice(0, 2);
      
      highTrafficNoConversion.forEach((c: any) => {
        result.push({
          title: `Untapped market: ${c.country_name || c.country_code}`,
          description: `${c.visitors} visitors, 0 bookings - potential conversion opportunity`,
          action: 'Consider targeted marketing for this region',
          type: 'opportunity',
        });
      });
    }
    
    if (overview?.bounce_rate && parseFloat(overview.bounce_rate) > 60) {
      result.push({
        title: 'High bounce rate detected',
        description: `${overview.bounce_rate}% of visitors leave without interaction`,
        action: 'Improve landing page engagement',
        type: 'warning',
      });
    }
    
    if (realtime?.active_visitors && realtime.active_visitors > 5) {
      result.push({
        title: 'High live traffic!',
        description: `${realtime.active_visitors} visitors browsing now`,
        type: 'success',
      });
    }
    
    return result;
  }, [geoHeatmap, overview, realtime]);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold truncate">Analytics Intelligence</h1>
              <p className="text-xs md:text-sm text-muted-foreground">XTSY Business Insights</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <Select value={daysBack.toString()} onValueChange={(v) => setDaysBack(parseInt(v))}>
                <SelectTrigger className="w-[100px] md:w-[140px] text-xs md:text-sm h-8 md:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={refresh} disabled={loading} className="h-8 md:h-10">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline ml-2">Refresh</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="h-8 md:h-10">
                <span className="hidden md:inline">← Back</span>
                <span className="md:hidden">←</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        {error && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="p-3 md:p-4 text-red-500 text-sm">{error}</CardContent>
          </Card>
        )}

        {/* Live Indicator */}
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-3 md:p-4 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-sm md:text-base">Live Now</span>
            </div>
            <div className="text-xl md:text-2xl font-bold">{realtime?.active_visitors || 0} active visitors</div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 md:p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <MetricCard
                title="Total Visitors"
                value={overview?.total_visitors?.toLocaleString() || 0}
                icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                subtitle={`${overview?.new_visitor_rate || 0}% new`}
                highlight
              />
              <MetricCard
                title="Page Views"
                value={overview?.total_pageviews?.toLocaleString() || 0}
                icon={<Eye className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
              />
              <MetricCard
                title="Avg. Session"
                value={formatDuration(overview?.avg_session_duration || 0)}
                icon={<Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                subtitle={`${overview?.bounce_rate || 0}% bounce`}
              />
              <MetricCard
                title="Sessions"
                value={(overview?.total_sessions || 0).toLocaleString()}
                icon={<Activity className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
              />
            </>
          )}
        </div>

        {/* Intelligent Insights */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm md:text-base font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Smart Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {insights.slice(0, 3).map((insight, i) => (
                <InsightCard key={i} {...insight} />
              ))}
            </div>
          </div>
        )}

        {/* World Map - Full Width */}
        <WorldMapHeatmap data={geoHeatmap} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Conversion Funnel */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm md:text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                Conversion Funnel
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Visitor journey to booking</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <ConversionFunnel data={funnel} />
              )}
            </CardContent>
          </Card>

          {/* Device & Traffic */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm md:text-base flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                Traffic Breakdown
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Device & source distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <div className="space-y-4">
                  {/* Device Stats */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Devices</p>
                    {Object.entries(behavior?.devices || {}).map(([device, count]) => {
                      const total = Object.values(behavior?.devices || {}).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? ((count as number) / total * 100).toFixed(0) : 0;
                      const Icon = device === 'mobile' ? Smartphone : device === 'tablet' ? Tablet : Monitor;
                      return (
                        <div key={device} className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between mb-1 text-xs">
                              <span className="capitalize truncate">{device}</span>
                              <span className="text-muted-foreground">{percentage}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Traffic Sources */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground">Top Sources</p>
                    {traffic?.sources?.slice(0, 4).map((source, i) => (
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
            </CardContent>
          </Card>
        </div>

        {/* Trends */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              Traffic Trends
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Daily visitors & sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-48 md:h-64 w-full" />
            ) : trends?.daily?.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trends.daily}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    className="text-[10px] md:text-xs"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis className="text-[10px] md:text-xs" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="total_visitors" name="Visitors" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                  <Area type="monotone" dataKey="total_sessions" name="Sessions" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary) / 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                Collecting trend data...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base flex items-center gap-2">
              <Search className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="space-y-2">
                {behavior?.top_pages?.slice(0, 6).map((page, i) => (
                  <div key={page.path} className="flex items-center justify-between text-xs md:text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge variant="outline" className="text-[10px] px-1.5 flex-shrink-0">{i + 1}</Badge>
                      <span className="truncate">{page.path}</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground flex-shrink-0">
                      <span>{page.views} views</span>
                      <span className="hidden md:inline">{formatDuration(page.avg_time)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
