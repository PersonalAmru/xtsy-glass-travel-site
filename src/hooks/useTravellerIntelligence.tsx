import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeOverview {
  realtime: {
    active_visitors: number;
    today_sessions: number;
    today_bookings: number;
    today_revenue: number;
  };
  forecasts: {
    next_7d: number;
    next_30d: number;
  };
  segments: Array<{
    segment_key: string;
    segment_name: string;
    segment_color: string;
    traveller_count: number;
    total_revenue: number;
  }>;
  conversion_rate: number;
}

interface SegmentData {
  segments: Array<{
    id: string;
    segment_name: string;
    segment_key: string;
    segment_description: string;
    segment_color: string;
    traveller_count: number;
    avg_lifetime_value: number;
    avg_booking_value: number;
    conversion_rate: number;
    total_revenue: number;
  }>;
  distribution: Record<string, number>;
  spend_distribution: Record<string, number>;
}

interface ForecastData {
  forecasts: Record<string, Array<{
    room_type_id: string;
    room_type_name: string;
    predicted_demand: number;
    predicted_revenue: number;
    demand_level: string;
    confidence_score: number;
  }>>;
}

interface RevenueHistory {
  revenue_history: Array<{
    snapshot_date: string;
    total_revenue: number;
    booking_count: number;
    avg_booking_value: number;
    conversion_rate: number;
    next_7d_forecast: number;
    segment_breakdown: Record<string, { count: number; revenue: number }>;
  }>;
}

interface HighIntentTraveller {
  visitor_id: string;
  traveller_segment: string;
  spend_tier: string;
  booking_intent_score: number;
  last_page_viewed: string;
  last_seen_at: string;
}

export function useTravellerIntelligence() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<RealtimeOverview | null>(null);
  const [segments, setSegments] = useState<SegmentData | null>(null);
  const [forecasts, setForecasts] = useState<ForecastData | null>(null);
  const [revenueHistory, setRevenueHistory] = useState<RevenueHistory | null>(null);
  const [highIntentTravellers, setHighIntentTravellers] = useState<HighIntentTraveller[]>([]);

  const fetchEndpoint = useCallback(async (endpoint: string) => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL || 'https://oidnydyyjyjfnyadhyzn.supabase.co'}/functions/v1/realtime-intelligence?endpoint=${endpoint}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZG55ZHl5anlqZm55YWRoeXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDEwNTUsImV4cCI6MjA2NjA3NzA1NX0.olHw9wNl8VNv-nM6heYMDpJJTARy9RxF30tvBfNLZNc',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }

    const result = await response.json();
    return result.data;
  }, []);

  const fetchOverview = useCallback(async () => {
    try {
      const data = await fetchEndpoint('overview');
      setOverview(data);
    } catch (err) {
      console.error('Error fetching overview:', err);
    }
  }, [fetchEndpoint]);

  const fetchSegments = useCallback(async () => {
    try {
      const data = await fetchEndpoint('segments');
      setSegments(data);
    } catch (err) {
      console.error('Error fetching segments:', err);
    }
  }, [fetchEndpoint]);

  const fetchForecasts = useCallback(async () => {
    try {
      const data = await fetchEndpoint('forecasts');
      setForecasts(data);
    } catch (err) {
      console.error('Error fetching forecasts:', err);
    }
  }, [fetchEndpoint]);

  const fetchRevenueHistory = useCallback(async () => {
    try {
      const data = await fetchEndpoint('revenue');
      setRevenueHistory(data);
    } catch (err) {
      console.error('Error fetching revenue history:', err);
    }
  }, [fetchEndpoint]);

  const fetchHighIntentTravellers = useCallback(async () => {
    try {
      const data = await fetchEndpoint('travellers');
      setHighIntentTravellers(data?.high_intent_travellers || []);
    } catch (err) {
      console.error('Error fetching high intent travellers:', err);
    }
  }, [fetchEndpoint]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchOverview(),
        fetchSegments(),
        fetchForecasts(),
        fetchRevenueHistory(),
        fetchHighIntentTravellers(),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch intelligence data');
    } finally {
      setLoading(false);
    }
  }, [fetchOverview, fetchSegments, fetchForecasts, fetchRevenueHistory, fetchHighIntentTravellers]);

  // Initial fetch
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Real-time refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOverview();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchOverview]);

  // Subscribe to real-time events
  useEffect(() => {
    const channel = supabase
      .channel('traveller-intelligence')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'traveller_events' },
        () => {
          // Refresh overview on new events
          fetchOverview();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOverview]);

  return {
    loading,
    error,
    overview,
    segments,
    forecasts,
    revenueHistory,
    highIntentTravellers,
    refresh: fetchAll,
    refreshOverview: fetchOverview,
  };
}