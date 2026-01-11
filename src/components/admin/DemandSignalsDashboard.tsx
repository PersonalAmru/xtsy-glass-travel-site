/**
 * Demand Signals Dashboard
 * Shows demand intelligence and suggested actions
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Lightbulb,
  Calendar,
  BarChart3,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { getDemandSignals, markActionTaken, computeDemandSignal } from '@/services/demandSignalService';
import { supabase } from '@/integrations/supabase/client';
import type { DemandSignal, ConfidenceLevel, ActionType } from '@/types/commercial';

const CONFIDENCE_CONFIG: Record<ConfidenceLevel, { color: string; label: string }> = {
  high: { color: 'bg-emerald-500/10 text-emerald-500', label: 'High Confidence' },
  medium: { color: 'bg-amber-500/10 text-amber-500', label: 'Medium Confidence' },
  low: { color: 'bg-gray-500/10 text-gray-500', label: 'Low Confidence' },
};

const ACTION_CONFIG: Record<ActionType, { icon: React.ElementType; color: string; label: string }> = {
  rate_increase: { icon: ArrowUpRight, color: 'text-emerald-500', label: 'Increase Rates' },
  rate_decrease: { icon: ArrowDownRight, color: 'text-amber-500', label: 'Decrease Rates' },
  close_ota: { icon: Minus, color: 'text-destructive', label: 'Close OTA' },
  open_ota: { icon: TrendingUp, color: 'text-blue-500', label: 'Open OTA' },
  none: { icon: Minus, color: 'text-muted-foreground', label: 'No Action' },
};

export function DemandSignalsDashboard() {
  const [signals, setSignals] = useState<DemandSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchSignals();
    }
  }, [selectedProperty]);

  const fetchProperties = async () => {
    const { data } = await supabase.from('properties').select('id, name');
    setProperties(data || []);
    if (data?.length) {
      setSelectedProperty(data[0].id);
    }
  };

  const fetchSignals = async () => {
    if (!selectedProperty) return;
    setLoading(true);
    try {
      const data = await getDemandSignals(selectedProperty);
      setSignals(data);
    } catch (error) {
      console.error('Error fetching signals:', error);
      toast.error('Failed to load demand signals');
    } finally {
      setLoading(false);
    }
  };

  const handleCompute = async () => {
    setLoading(true);
    const result = await computeDemandSignal(selectedProperty);
    if (result.success) {
      toast.success('Demand signals updated');
      fetchSignals();
    } else {
      toast.error(result.error);
      setLoading(false);
    }
  };

  const handleMarkAction = async (signalId: string, notes: string) => {
    const result = await markActionTaken(signalId, notes);
    if (result.success) {
      toast.success('Action recorded');
      fetchSignals();
    } else {
      toast.error(result.error);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  // Get latest signal for overview
  const latestSignal = signals[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Demand Intelligence
          </h2>
          <p className="text-sm text-muted-foreground">Rule-based demand signals and recommendations</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleCompute} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
            Compute
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {latestSignal && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">7-Day Occupancy</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{latestSignal.occupancy_7d?.toFixed(0) || 0}%</p>
                {latestSignal.occupancy_delta_7d !== undefined && (
                  <Badge variant="outline" className={cn(
                    latestSignal.occupancy_delta_7d >= 0 ? 'text-emerald-500' : 'text-destructive'
                  )}>
                    {latestSignal.occupancy_delta_7d >= 0 ? '+' : ''}{latestSignal.occupancy_delta_7d.toFixed(1)}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Booking Velocity</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{latestSignal.bookings_last_7d || 0}</p>
                {getTrendIcon(latestSignal.booking_velocity_trend)}
              </div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Avg Lead Time</p>
              <p className="text-2xl font-bold">{latestSignal.avg_lead_time_days?.toFixed(0) || 0} days</p>
              {latestSignal.lead_time_compression && (
                <Badge variant="outline" className="text-amber-500 mt-1">Compressing</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Direct vs OTA</p>
              <p className="text-2xl font-bold">{((latestSignal.direct_booking_ratio || 0) * 100).toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Direct bookings</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weekend vs Weekday */}
      {latestSignal && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Day Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Weekday Occupancy</p>
                <p className="text-3xl font-bold">{latestSignal.weekday_occupancy?.toFixed(0) || 0}%</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Weekend Occupancy</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold">{latestSignal.weekend_occupancy?.toFixed(0) || 0}%</p>
                  {latestSignal.weekend_rate_premium > 0 && (
                    <Badge className="bg-emerald-500/10 text-emerald-500">
                      +{latestSignal.weekend_rate_premium}% premium
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Signals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Suggested Actions
          </CardTitle>
          <CardDescription>Non-automatic recommendations based on demand patterns</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : signals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No demand signals available</p>
              <Button className="mt-4" variant="outline" onClick={handleCompute}>
                Generate Signals
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {signals.filter(s => s.suggested_action && s.action_type !== 'none').map((signal) => {
                const actionConfig = ACTION_CONFIG[signal.action_type];
                const confConfig = CONFIDENCE_CONFIG[signal.confidence_level];
                const ActionIcon = actionConfig.icon;

                return (
                  <div key={signal.id} className={cn(
                    'p-4 rounded-lg border',
                    signal.action_taken ? 'bg-muted/30 opacity-60' : 'bg-muted/50'
                  )}>
                    <div className="flex items-start gap-4">
                      <div className={cn('p-2 rounded-lg', confConfig.color)}>
                        <ActionIcon className={cn('w-5 h-5', actionConfig.color)} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{signal.suggested_action}</p>
                          <Badge className={cn('text-xs', confConfig.color)}>{confConfig.label}</Badge>
                          {signal.action_taken && (
                            <Badge variant="outline" className="text-emerald-500">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Done
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Signal date: {format(new Date(signal.signal_date), 'MMM d, yyyy')}
                        </p>
                        {signal.action_notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Notes: {signal.action_notes}
                          </p>
                        )}
                      </div>
                      {!signal.action_taken && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAction(signal.id, 'Action implemented')}
                        >
                          Mark Done
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
