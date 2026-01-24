/**
 * Tag Firing Timeline Chart - Shows GTM tag fires over time
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { Tag, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TagEvent {
  event_type: string;
  count: number;
  hour?: number;
  date?: string;
}

interface TagTimelineChartProps {
  data: {
    hourly: TagEvent[];
    daily: TagEvent[];
    eventCounts: {
      booking_confirmed: number;
      whatsapp_engaged_validated: number;
      call_engaged_validated: number;
      lead_qualified: number;
      consent_update: number;
    };
    tagHealth: {
      status: 'healthy' | 'degraded' | 'critical';
      successRate: number;
      lastFired: string | null;
    };
  };
  loading?: boolean;
}

const EVENT_COLORS: Record<string, string> = {
  booking_confirmed: '#22c55e',
  whatsapp_engaged_validated: '#10b981',
  call_engaged_validated: '#f59e0b',
  lead_qualified: '#3b82f6',
  consent_update: '#8b5cf6',
  page_view: '#64748b',
};

export function TagTimelineChart({ data, loading }: TagTimelineChartProps) {
  const chartData = useMemo(() => {
    if (!data.hourly?.length) return [];
    
    // Group by hour and aggregate
    const hourMap = new Map<number, Record<string, number>>();
    data.hourly.forEach(item => {
      const hour = item.hour ?? 0;
      if (!hourMap.has(hour)) {
        hourMap.set(hour, { hour });
      }
      const entry = hourMap.get(hour)!;
      entry[item.event_type] = (entry[item.event_type] || 0) + item.count;
    });
    
    return Array.from(hourMap.values()).sort((a, b) => a.hour - b.hour);
  }, [data.hourly]);

  const healthColor = {
    healthy: 'text-emerald-400 bg-emerald-500/20',
    degraded: 'text-amber-400 bg-amber-500/20',
    critical: 'text-red-400 bg-red-500/20',
  };

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-6 h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-slate-500">Loading tag timeline...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              Tag Firing Timeline
            </CardTitle>
            <CardDescription>
              GTM conversion tag activity over the last 24 hours
            </CardDescription>
          </div>
          <Badge className={cn('px-3 py-1', healthColor[data.tagHealth.status])}>
            {data.tagHealth.status === 'healthy' && <CheckCircle className="w-3 h-3 mr-1" />}
            {data.tagHealth.status === 'degraded' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {data.tagHealth.status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {data.tagHealth.successRate}% Success Rate
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Event counts summary */}
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(data.eventCounts).map(([event, count]) => (
            <div key={event} className="bg-slate-800/50 rounded-lg p-3 text-center">
              <div 
                className="w-2 h-2 rounded-full mx-auto mb-2"
                style={{ backgroundColor: EVENT_COLORS[event] || '#64748b' }}
              />
              <p className="text-lg font-bold text-white">{count}</p>
              <p className="text-[10px] text-slate-500 truncate">
                {event.replace(/_/g, ' ').replace('validated', '')}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline chart */}
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="hour" 
                stroke="#64748b" 
                tickFormatter={(v) => `${v}:00`}
                fontSize={11}
              />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155', 
                  borderRadius: '8px' 
                }}
                labelFormatter={(v) => `${v}:00`}
              />
              <Bar dataKey="booking_confirmed" stackId="a" fill={EVENT_COLORS.booking_confirmed} name="Bookings" />
              <Bar dataKey="whatsapp_engaged_validated" stackId="a" fill={EVENT_COLORS.whatsapp_engaged_validated} name="WhatsApp" />
              <Bar dataKey="call_engaged_validated" stackId="a" fill={EVENT_COLORS.call_engaged_validated} name="Calls" />
              <Bar dataKey="lead_qualified" stackId="a" fill={EVENT_COLORS.lead_qualified} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-slate-500">
            No tag activity data available
          </div>
        )}

        {/* Last fired info */}
        <div className="flex items-center justify-between text-sm border-t border-slate-700/50 pt-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4" />
            Last conversion tag fired:
          </div>
          <span className="text-white font-mono">
            {data.tagHealth.lastFired 
              ? format(parseISO(data.tagHealth.lastFired), 'MMM d, HH:mm:ss')
              : 'No recent activity'
            }
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
