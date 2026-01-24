/**
 * Consent Analytics Chart - Consent rates, methods, and impact analysis
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend,
  LineChart, Line, ComposedChart
} from 'recharts';
import { Shield, Cookie, TrendingUp, Users, Check, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ConsentTrend {
  date: string;
  totalConsents: number;
  analyticsGranted: number;
  marketingGranted: number;
  analyticsRate: number;
  marketingRate: number;
}

interface ConsentMethod {
  method: 'banner' | 'settings' | 'implied' | 'explicit';
  count: number;
  analyticsRate: number;
  marketingRate: number;
}

interface ConsentConversionCorrelation {
  consentType: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
}

interface ConsentAnalyticsChartProps {
  data: {
    trends: ConsentTrend[];
    byMethod: ConsentMethod[];
    correlation: ConsentConversionCorrelation[];
    summary: {
      totalConsents: number;
      analyticsRate: number;
      marketingRate: number;
      adsEligibleRate: number;
    };
  };
  loading?: boolean;
}

const METHOD_COLORS: Record<string, string> = {
  banner: '#3b82f6',
  settings: '#8b5cf6',
  implied: '#f59e0b',
  explicit: '#22c55e',
};

const CONSENT_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export function ConsentAnalyticsChart({ data, loading }: ConsentAnalyticsChartProps) {
  const methodChartData = useMemo(() => {
    return data.byMethod.map(m => ({
      name: m.method.charAt(0).toUpperCase() + m.method.slice(1),
      value: m.count,
      analyticsRate: m.analyticsRate,
      marketingRate: m.marketingRate,
    }));
  }, [data.byMethod]);

  const correlationChartData = useMemo(() => {
    return data.correlation.map(c => ({
      name: c.consentType,
      sessions: c.sessions,
      conversions: c.conversions,
      rate: c.conversionRate,
    }));
  }, [data.correlation]);

  if (loading) {
    return (
      <div className="grid gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-6 h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-slate-500">Loading consent analytics...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{data.summary.totalConsents.toLocaleString()}</p>
            <p className="text-xs text-slate-500">Total Consents</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">{data.summary.analyticsRate}%</p>
            <p className="text-xs text-slate-500">Analytics Consent</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
              <Cookie className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-400">{data.summary.marketingRate}%</p>
            <p className="text-xs text-slate-500">Marketing Consent</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-400">{data.summary.adsEligibleRate}%</p>
            <p className="text-xs text-slate-500">Google Ads Eligible</p>
          </CardContent>
        </Card>
      </div>

      {/* Consent Trends Over Time */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Consent Rate Trends
          </CardTitle>
          <CardDescription>Analytics & marketing consent rates over time</CardDescription>
        </CardHeader>
        <CardContent>
          {data.trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.trends}>
                <defs>
                  <linearGradient id="colorAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMarketing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  tickFormatter={(v) => v ? format(new Date(v), 'MMM d') : ''}
                  fontSize={11}
                />
                <YAxis stroke="#64748b" domain={[0, 100]} tickFormatter={(v) => `${v}%`} fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="analyticsRate" 
                  stroke="#22c55e" 
                  fill="url(#colorAnalytics)" 
                  strokeWidth={2}
                  name="Analytics"
                />
                <Area 
                  type="monotone" 
                  dataKey="marketingRate" 
                  stroke="#f59e0b" 
                  fill="url(#colorMarketing)" 
                  strokeWidth={2}
                  name="Marketing"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-slate-500">
              No consent trend data available
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Consent by Method */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Cookie className="w-4 h-4 text-primary" />
              Consent by Method
            </CardTitle>
            <CardDescription>How users provide consent</CardDescription>
          </CardHeader>
          <CardContent>
            {methodChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={methodChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {methodChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={METHOD_COLORS[entry.name.toLowerCase()] || '#64748b'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {methodChartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs text-slate-400">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: METHOD_COLORS[item.name.toLowerCase()] || '#64748b' }} 
                      />
                      {item.name}: {item.value}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-slate-500">
                No method data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consent vs Conversion Correlation */}
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Consent Impact on Conversions
            </CardTitle>
            <CardDescription>Conversion rates by consent type</CardDescription>
          </CardHeader>
          <CardContent>
            {correlationChartData.length > 0 ? (
              <div className="space-y-4">
                {correlationChartData.map((item, index) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CONSENT_COLORS[index] || '#64748b' }}
                        />
                        <span className="text-sm text-white">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{item.sessions} sessions</span>
                        <Badge variant="outline" className={cn(
                          'text-xs',
                          item.rate > 5 ? 'text-emerald-400 border-emerald-500/30' : 
                          item.rate > 2 ? 'text-amber-400 border-amber-500/30' : 
                          'text-slate-400 border-slate-500/30'
                        )}>
                          {item.rate.toFixed(1)}% conv.
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={item.rate * 10} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-slate-500">
                No correlation data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
