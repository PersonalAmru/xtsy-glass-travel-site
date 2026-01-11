/**
 * Channel Performance Dashboard
 * Shows OTA channel health, metrics, and controls
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Globe,
} from 'lucide-react';
import { 
  getChannelStrategies, 
  toggleChannelStatus, 
  updateInventoryCap,
  getChannelPerformance 
} from '@/services/channelStrategyService';
import { supabase } from '@/integrations/supabase/client';
import type { ChannelStrategy, ChannelPerformance, ChannelName } from '@/types/commercial';

const CHANNEL_ICONS: Record<string, string> = {
  booking_com: '🏨',
  airbnb: '🏡',
  goibibo: '✈️',
  makemytrip: '🎫',
  agoda: '🌏',
  direct: '🎯',
};

export function ChannelPerformanceDashboard() {
  const [strategies, setStrategies] = useState<ChannelStrategy[]>([]);
  const [performance, setPerformance] = useState<ChannelPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchChannelData();
    }
  }, [selectedProperty]);

  const fetchProperties = async () => {
    const { data } = await supabase.from('properties').select('id, name');
    setProperties(data || []);
    if (data?.length) {
      setSelectedProperty(data[0].id);
    }
  };

  const fetchChannelData = async () => {
    if (!selectedProperty) return;
    setLoading(true);
    try {
      const [strategyData, perfData] = await Promise.all([
        getChannelStrategies(selectedProperty),
        getChannelPerformance(selectedProperty),
      ]);
      setStrategies(strategyData);
      setPerformance(perfData);
    } catch (error) {
      console.error('Error fetching channel data:', error);
      toast.error('Failed to load channel data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChannel = async (channelName: ChannelName, currentActive: boolean) => {
    const result = await toggleChannelStatus(selectedProperty, channelName, !currentActive);
    if (result.success) {
      toast.success(`${channelName} ${!currentActive ? 'enabled' : 'disabled'}`);
      fetchChannelData();
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateCap = async (channelName: ChannelName, cap: number) => {
    const result = await updateInventoryCap(selectedProperty, channelName, cap);
    if (result.success) {
      toast.success('Inventory cap updated');
      fetchChannelData();
    } else {
      toast.error(result.error);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-destructive';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Channel Strategy
          </h2>
          <p className="text-sm text-muted-foreground">Manage OTA distribution and performance</p>
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
          <Button variant="outline" size="sm" onClick={fetchChannelData} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {performance.slice(0, 4).map((perf) => (
          <Card key={perf.channel_name}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{CHANNEL_ICONS[perf.channel_name] || '📊'}</span>
                <span className="font-medium text-sm">{perf.display_name}</span>
                {getTrendIcon(perf.trend)}
              </div>
              <p className="text-2xl font-bold">₹{(perf.revenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">{perf.bookings} bookings</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Channel Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {strategies.map((strategy) => {
          const perf = performance.find(p => p.channel_name === strategy.channel_name);
          return (
            <Card key={strategy.id} className={cn(!strategy.is_active && 'opacity-60')}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-xl">{CHANNEL_ICONS[strategy.channel_name] || '📊'}</span>
                    {strategy.channel_name.replace('_', '.').toUpperCase()}
                  </CardTitle>
                  <Switch
                    checked={strategy.is_active}
                    onCheckedChange={() => handleToggleChannel(strategy.channel_name, strategy.is_active)}
                  />
                </div>
                <CardDescription>
                  {strategy.is_active ? 'Active' : 'Paused'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Health Score */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Health Score</span>
                    <span className={cn('font-bold', getHealthColor(strategy.health_score))}>
                      {strategy.health_score}%
                    </span>
                  </div>
                  <Progress value={strategy.health_score} className="h-2" />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Conversion</p>
                    <p className="font-semibold">{strategy.conversion_rate?.toFixed(1) || 0}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cancellation</p>
                    <p className="font-semibold text-destructive">{strategy.cancellation_rate?.toFixed(1) || 0}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Inventory Cap</p>
                    <p className="font-semibold">{strategy.inventory_cap_percent}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lead Time</p>
                    <p className="font-semibold">{strategy.avg_lead_time_days || 0} days</p>
                  </div>
                </div>

                {/* Inventory Cap Control */}
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Set Inventory Cap</p>
                  <div className="flex gap-2">
                    {[25, 50, 75, 100].map((cap) => (
                      <Button
                        key={cap}
                        variant={strategy.inventory_cap_percent === cap ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUpdateCap(strategy.channel_name, cap)}
                      >
                        {cap}%
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Warnings */}
                {strategy.parity_violations && strategy.parity_violations.length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-amber-500">
                      {strategy.parity_violations.length} parity violation(s) detected
                    </span>
                  </div>
                )}

                {strategy.sync_status === 'error' && (
                  <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-xs text-destructive">Sync error: {strategy.sync_error}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && strategies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No channels configured for this property</p>
            <Button className="mt-4" variant="outline">
              Initialize Channels
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
