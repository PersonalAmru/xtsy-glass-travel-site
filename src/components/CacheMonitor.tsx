import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CacheMetrics {
  endpoint: string;
  hits: number;
  misses: number;
  hitRate: number;
  lastChecked: Date;
}

export function CacheMonitor() {
  const [metrics, setMetrics] = useState<CacheMetrics[]>([]);
  const [loading, setLoading] = useState(false);

  const checkCacheStatus = async () => {
    setLoading(true);
    const endpoints = [
      { name: 'get-room-availability', fn: 'get-room-availability', body: { room_type_name: 'Deluxe Room', start_date: new Date().toISOString().split('T')[0], end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } },
      { name: 'get-room-types', fn: 'get-room-types', body: {} },
      { name: 'fetch-exchange-rates', fn: 'fetch-exchange-rates', body: {} },
    ];

    const newMetrics: CacheMetrics[] = [];

    for (const endpoint of endpoints) {
      try {
        // Make multiple requests to test caching
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        const requests = await Promise.all([
          fetch(`${supabaseUrl}/functions/v1/${endpoint.fn}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
            },
            body: JSON.stringify(endpoint.body),
          }),
          // Second request should hit cache
          fetch(`${supabaseUrl}/functions/v1/${endpoint.fn}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
            },
            body: JSON.stringify(endpoint.body),
          }),
        ]);

        const cacheStatuses = requests.map(r => r.headers.get('X-Cache'));
        const hits = cacheStatuses.filter(s => s === 'HIT').length;
        const misses = cacheStatuses.filter(s => s === 'MISS').length;

        newMetrics.push({
          endpoint: endpoint.name,
          hits,
          misses,
          hitRate: (hits / (hits + misses)) * 100,
          lastChecked: new Date(),
        });
      } catch (error) {
        console.error(`Error checking ${endpoint.name}:`, error);
      }
    }

    setMetrics(newMetrics);
    setLoading(false);
  };

  useEffect(() => {
    checkCacheStatus();
    const interval = setInterval(checkCacheStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (hitRate: number) => {
    if (hitRate >= 70) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (hitRate >= 40) return <Minus className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getHitRateColor = (hitRate: number) => {
    if (hitRate >= 70) return 'bg-green-500';
    if (hitRate >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cache Performance Monitor</CardTitle>
            <CardDescription>Real-time cache hit rates for edge functions</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkCacheStatus}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.endpoint} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{metric.endpoint}</h3>
                  {getTrendIcon(metric.hitRate)}
                </div>
                <Badge variant={metric.hitRate >= 70 ? 'default' : metric.hitRate >= 40 ? 'secondary' : 'destructive'}>
                  {metric.hitRate.toFixed(1)}% Hit Rate
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <span>Hits: {metric.hits}</span>
                <span>Misses: {metric.misses}</span>
                <span>Last checked: {metric.lastChecked.toLocaleTimeString()}</span>
              </div>

              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${getHitRateColor(metric.hitRate)} transition-all duration-300`}
                  style={{ width: `${metric.hitRate}%` }}
                />
              </div>
            </div>
          ))}

          {metrics.length === 0 && !loading && (
            <p className="text-center text-muted-foreground py-8">
              No cache metrics available yet. Click refresh to check.
            </p>
          )}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Cache Strategy</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Room Availability: 5 min cache + 10 min stale-while-revalidate</li>
            <li>• Room Types: 1 hour cache + 2 hour stale-while-revalidate</li>
            <li>• Exchange Rates: 12 hour cache + 24 hour stale-while-revalidate</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
