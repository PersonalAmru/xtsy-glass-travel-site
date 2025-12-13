import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OverviewData {
  total_visitors: number;
  total_sessions: number;
  total_pageviews: number;
  bounce_rate: string;
  new_visitor_rate: string;
  avg_session_duration: number;
  total_conversions: number;
  total_revenue: number;
  today_visitors: number;
  today_revenue: number;
  conversion_rate: string;
}

interface RealtimeData {
  active_visitors: number;
  by_page: Record<string, number>;
  by_country: Record<string, number>;
  visitors: Array<{
    session_id: string;
    visitor_id: string;
    page_path: string;
    country_code: string;
    device_type: string;
    last_seen_at: string;
  }>;
}

interface GeoHeatmapData {
  countries: Array<{
    country_code: string;
    country_name: string;
    latitude: number;
    longitude: number;
    visitors: number;
    sessions: number;
    pageviews: number;
    bookings: number;
    revenue: number;
    cities: Array<{
      city: string;
      region: string;
      lat: number;
      lng: number;
      visitors: number;
      bookings: number;
    }>;
  }>;
}

interface FunnelData {
  funnels: Array<{
    funnel: string;
    steps: Array<{
      step: string;
      order: number;
      count: number;
      dropoff: string;
    }>;
    total_completed: number;
    conversion_rate: string;
  }>;
}

interface TrafficData {
  sources: Array<{
    source: string;
    medium: string;
    visitors: number;
    sessions: number;
  }>;
  campaigns: Array<{
    name: string;
    count: number;
  }>;
}

interface BehaviorData {
  top_pages: Array<{
    path: string;
    views: number;
    entrances: number;
    exits: number;
    exit_rate: string;
    avg_time: number;
    avg_scroll: number;
  }>;
  top_events: Array<{
    category: string;
    action: string;
    count: number;
  }>;
  devices: Record<string, number>;
  browsers: Record<string, number>;
}

interface TrendsData {
  daily: Array<{
    date: string;
    total_visitors: number;
    total_sessions: number;
    total_pageviews: number;
    bounce_rate: number;
    avg_session_duration: number;
    total_revenue: number;
  }>;
  hourly: Array<{
    hour: number;
    sessions: number;
  }>;
}

export const useAdminAnalytics = (daysBack: number = 30) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [realtime, setRealtime] = useState<RealtimeData | null>(null);
  const [geoHeatmap, setGeoHeatmap] = useState<GeoHeatmapData | null>(null);
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [behavior, setBehavior] = useState<BehaviorData | null>(null);
  const [trends, setTrends] = useState<TrendsData | null>(null);

  const fetchEndpoint = useCallback(async (endpoint: string) => {
    const { data, error } = await supabase.functions.invoke('analytics-dashboard', {
      body: null,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Since we can't pass query params easily, let's make a direct fetch
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `https://oidnydyyjyjfnyadhyzn.supabase.co/functions/v1/analytics-dashboard/${endpoint}?days=${daysBack}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch analytics');
    }

    return response.json();
  }, [daysBack]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        overviewData,
        realtimeData,
        geoData,
        funnelData,
        trafficData,
        behaviorData,
        trendsData,
      ] = await Promise.all([
        fetchEndpoint('overview'),
        fetchEndpoint('realtime'),
        fetchEndpoint('geo-heatmap'),
        fetchEndpoint('funnel'),
        fetchEndpoint('traffic-sources'),
        fetchEndpoint('behavior'),
        fetchEndpoint('trends'),
      ]);

      setOverview(overviewData);
      setRealtime(realtimeData);
      setGeoHeatmap(geoData);
      setFunnel(funnelData);
      setTraffic(trafficData);
      setBehavior(behaviorData);
      setTrends(trendsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchEndpoint]);

  // Refresh realtime data every 30 seconds
  useEffect(() => {
    const fetchRealtime = async () => {
      try {
        const data = await fetchEndpoint('realtime');
        setRealtime(data);
      } catch (err) {
        console.error('Realtime refresh error:', err);
      }
    };

    const interval = setInterval(fetchRealtime, 30000);
    return () => clearInterval(interval);
  }, [fetchEndpoint]);

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    loading,
    error,
    overview,
    realtime,
    geoHeatmap,
    funnel,
    traffic,
    behavior,
    trends,
    refresh: fetchAllData,
  };
};
