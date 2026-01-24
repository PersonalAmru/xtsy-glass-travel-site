/**
 * Conversion Funnel Chart - Visual funnel with dropoff analysis
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  ArrowDown, Users, Eye, MousePointer, MessageCircle, 
  Phone, CheckCircle, TrendingDown 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FunnelStep {
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface ConversionFunnelChartProps {
  data: {
    visitors: number;
    pageViews: number;
    engagements: number;
    whatsappClicks: number;
    callClicks: number;
    bookings: number;
  };
  loading?: boolean;
}

export function ConversionFunnelChart({ data, loading }: ConversionFunnelChartProps) {
  const funnelSteps: FunnelStep[] = useMemo(() => [
    { name: 'Visitors', count: data.visitors, icon: <Users className="w-4 h-4" />, color: 'bg-slate-500' },
    { name: 'Page Views', count: data.pageViews, icon: <Eye className="w-4 h-4" />, color: 'bg-blue-500' },
    { name: 'Engagements', count: data.engagements, icon: <MousePointer className="w-4 h-4" />, color: 'bg-purple-500' },
    { name: 'WhatsApp Clicks', count: data.whatsappClicks, icon: <MessageCircle className="w-4 h-4" />, color: 'bg-emerald-500' },
    { name: 'Call Clicks', count: data.callClicks, icon: <Phone className="w-4 h-4" />, color: 'bg-amber-500' },
    { name: 'Bookings', count: data.bookings, icon: <CheckCircle className="w-4 h-4" />, color: 'bg-primary' },
  ], [data]);

  const maxCount = Math.max(...funnelSteps.map(s => s.count), 1);

  const getDropoffRate = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((previous - current) / previous) * 100);
  };

  const getConversionRate = (step: number, baseline: number) => {
    if (baseline === 0) return '0%';
    return `${((step / baseline) * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-6 h-[400px] flex items-center justify-center">
          <div className="animate-pulse text-slate-500">Loading funnel data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-primary" />
          Conversion Funnel
        </CardTitle>
        <CardDescription>
          End-to-end conversion tracking with dropoff analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {funnelSteps.map((step, index) => {
          const widthPercent = (step.count / maxCount) * 100;
          const previousStep = index > 0 ? funnelSteps[index - 1] : null;
          const dropoff = previousStep ? getDropoffRate(step.count, previousStep.count) : 0;
          
          return (
            <motion.div 
              key={step.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Dropoff indicator */}
              {index > 0 && dropoff > 0 && (
                <div className="flex items-center gap-2 py-1 pl-4">
                  <ArrowDown className="w-3 h-3 text-red-400" />
                  <span className="text-xs text-red-400">-{dropoff}% dropoff</span>
                </div>
              )}
              
              {/* Funnel step */}
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  step.color.replace('bg-', 'bg-') + '/20'
                )}>
                  <div className={cn("text-white", step.color.replace('bg-', 'text-'))}>
                    {step.icon}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white font-medium">{step.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{step.count.toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {getConversionRate(step.count, data.visitors)}
                      </Badge>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className={cn("h-full rounded-full", step.color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-slate-700/50 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-400">
              {getConversionRate(data.bookings, data.visitors)}
            </p>
            <p className="text-xs text-slate-500">Overall Conversion</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">
              {getConversionRate(data.whatsappClicks + data.callClicks, data.visitors)}
            </p>
            <p className="text-xs text-slate-500">Engagement Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-400">
              {getConversionRate(data.bookings, data.whatsappClicks + data.callClicks || 1)}
            </p>
            <p className="text-xs text-slate-500">Lead to Booking</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
