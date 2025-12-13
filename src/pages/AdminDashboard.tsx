import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { useTravellerIntelligence } from '@/hooks/useTravellerIntelligence';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, Eye, MousePointer, Clock, TrendingUp, Globe, 
  BarChart3, Activity, RefreshCw, ArrowUpRight, ArrowDownRight,
  Monitor, Smartphone, Tablet, MapPin, DollarSign, Brain, Zap, Calendar, IndianRupee
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TravellerSegmentsPanel } from '@/components/admin/TravellerSegmentsPanel';
import { DemandForecastPanel } from '@/components/admin/DemandForecastPanel';
import { RevenueIntelligencePanel } from '@/components/admin/RevenueIntelligencePanel';
import { RealtimeTravellerActivity } from '@/components/admin/RealtimeTravellerActivity';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#10b981', '#f59e0b', '#ef4444'];

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; isUp: boolean };
  subtitle?: string;
}> = ({ title, value, icon, trend, subtitle }) => (
  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center text-xs mt-2 ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
              {trend.value}%
            </div>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

// World Map Placeholder (simple country list heatmap)
const GeoHeatMap: React.FC<{ data: any }> = ({ data }) => {
  if (!data?.countries?.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No geographic data available yet
      </div>
    );
  }

  const maxVisitors = Math.max(...data.countries.map((c: any) => c.visitors));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.countries.slice(0, 10).map((country: any, index: number) => {
          const intensity = country.visitors / maxVisitors;
          return (
            <div 
              key={country.country_code}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              style={{ 
                borderLeft: `4px solid hsl(var(--primary) / ${0.3 + intensity * 0.7})`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                <div>
                  <p className="font-medium">{country.country_name || country.country_code}</p>
                  <p className="text-xs text-muted-foreground">
                    {country.cities?.length || 0} cities tracked
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{country.visitors.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">visitors</p>
                {country.bookings > 0 && (
                  <p className="text-xs text-green-500">₹{country.revenue?.toLocaleString()}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Opportunity Indicators */}
      <Card className="mt-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Sales Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {data.countries
              .filter((c: any) => c.visitors > 10 && c.bookings === 0)
              .slice(0, 3)
              .map((c: any) => (
                <div key={c.country_code} className="flex justify-between items-center">
                  <span>{c.country_name || c.country_code}</span>
                  <span className="text-amber-500">{c.visitors} visitors, 0 bookings</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Conversion Funnel Component
const ConversionFunnel: React.FC<{ data: any }> = ({ data }) => {
  if (!data?.funnels?.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No conversion data available yet
      </div>
    );
  }

  const bookingFunnel = data.funnels.find((f: any) => f.funnel === 'booking');

  if (!bookingFunnel) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Booking funnel not configured
      </div>
    );
  }

  const maxCount = Math.max(...bookingFunnel.steps.map((s: any) => s.count));

  return (
    <div className="space-y-4">
      {bookingFunnel.steps.map((step: any, index: number) => {
        const width = maxCount > 0 ? (step.count / maxCount) * 100 : 0;
        return (
          <div key={step.step} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{step.step.replace(/_/g, ' ').toUpperCase()}</span>
              <span className="text-muted-foreground">{step.count.toLocaleString()}</span>
            </div>
            <div className="h-8 bg-muted rounded-lg overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                style={{ width: `${width}%` }}
              />
              {index > 0 && parseFloat(step.dropoff) > 0 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500">
                  -{step.dropoff}% dropoff
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
        <div className="flex justify-between items-center">
          <span className="font-medium text-green-600">Conversion Rate</span>
          <span className="text-2xl font-bold text-green-600">{bookingFunnel.conversion_rate}%</span>
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

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">XTSY Business Intelligence</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={daysBack.toString()} onValueChange={(v) => setDaysBack(parseInt(v))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                ← Back to Site
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {error && (
          <Card className="mb-6 border-red-500/50 bg-red-500/10">
            <CardContent className="p-4 text-red-500">{error}</CardContent>
          </Card>
        )}

        {/* Real-time Indicator */}
        <Card className="mb-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Live Now</span>
            </div>
            <div className="text-2xl font-bold">{realtime?.active_visitors || 0} active visitors</div>
          </CardContent>
        </Card>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
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
                icon={<Users className="w-5 h-5 text-primary" />}
                subtitle={`${overview?.new_visitor_rate || 0}% new`}
              />
              <MetricCard
                title="Page Views"
                value={overview?.total_pageviews?.toLocaleString() || 0}
                icon={<Eye className="w-5 h-5 text-primary" />}
              />
              <MetricCard
                title="Avg. Session Duration"
                value={formatDuration(overview?.avg_session_duration || 0)}
                icon={<Clock className="w-5 h-5 text-primary" />}
                subtitle={`${overview?.bounce_rate || 0}% bounce rate`}
              />
              <MetricCard
                title="Revenue"
                value={`₹${(overview?.total_revenue || 0).toLocaleString()}`}
                icon={<DollarSign className="w-5 h-5 text-green-500" />}
                subtitle={`${overview?.conversion_rate || 0}% conversion`}
              />
            </>
          )}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="geo" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="geo" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Geography</span>
            </TabsTrigger>
            <TabsTrigger value="funnel" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Funnel</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              <span className="hidden sm:inline">Behavior</span>
            </TabsTrigger>
            <TabsTrigger value="traffic" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Traffic</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
          </TabsList>

          {/* Geographic Heatmap */}
          <TabsContent value="geo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Geographic Distribution & Sales Opportunities
                </CardTitle>
                <CardDescription>
                  Visitor locations with booking conversion analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <GeoHeatMap data={geoHeatmap} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversion Funnel */}
          <TabsContent value="funnel">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Booking Conversion Funnel
                </CardTitle>
                <CardDescription>
                  Track visitor journey from landing to booking completion
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <ConversionFunnel data={funnel} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Behavior Analytics */}
          <TabsContent value="behavior">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <div className="space-y-3">
                      {behavior?.top_pages?.slice(0, 8).map((page, i) => (
                        <div key={page.path} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-6">{i + 1}</span>
                            <span className="text-sm truncate max-w-[200px]">{page.path}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{page.views} views</span>
                            <span>{formatDuration(page.avg_time)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(behavior?.devices || {}).map(([device, count]) => {
                        const total = Object.values(behavior?.devices || {}).reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((count as number) / total * 100).toFixed(1) : 0;
                        const Icon = device === 'mobile' ? Smartphone : device === 'tablet' ? Tablet : Monitor;
                        return (
                          <div key={device} className="flex items-center gap-4">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="capitalize">{device}</span>
                                <span className="text-muted-foreground">{percentage}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
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
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Traffic Sources */}
          <TabsContent value="traffic">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : traffic?.sources?.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={traffic.sources.slice(0, 6)}
                          dataKey="sessions"
                          nameKey="source"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ source, percent }) => `${source} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {traffic.sources.slice(0, 6).map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      No traffic data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : traffic?.campaigns?.length ? (
                    <div className="space-y-3">
                      {traffic.campaigns.slice(0, 10).map((campaign) => (
                        <div key={campaign.name} className="flex justify-between items-center">
                          <span className="text-sm truncate max-w-[200px]">{campaign.name}</span>
                          <span className="font-medium">{campaign.count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      No campaigns tracked yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends */}
          <TabsContent value="trends">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Visitors & Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : trends?.daily?.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={trends.daily}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          className="text-xs"
                        />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="total_visitors" name="Visitors" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                        <Area type="monotone" dataKey="total_sessions" name="Sessions" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary) / 0.2)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      Collecting trend data...
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Today's Hourly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-48 w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={trends?.hourly || []}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip labelFormatter={(h) => `${h}:00 - ${h}:59`} />
                        <Bar dataKey="sessions" name="Sessions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
