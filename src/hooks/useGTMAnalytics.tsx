/**
 * GTM Analytics Hook
 * Fetch and aggregate GTM/conversion-specific metrics
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ConversionMetrics {
  bookings: number;
  whatsappEngaged: number;
  callsEngaged: number;
  leadsQualified: number;
  formSubmits: number;
  sessionQualitySignals: number;
}

export interface ConsentMetrics {
  totalConsents: number;
  analyticsGranted: number;
  marketingGranted: number;
  analyticsRate: number;
  marketingRate: number;
  byMethod: {
    banner: number;
    settings: number;
    implied: number;
    explicit: number;
  };
}

export interface GTMHealthStatus {
  containerActive: boolean;
  containerId: string;
  lastEventTime: string | null;
  eventsInSession: number;
  consentState: {
    analytics: boolean;
    marketing: boolean;
  };
}

export interface DataLayerEvent {
  event: string;
  timestamp: string;
  [key: string]: unknown;
}

export const useGTMAnalytics = (daysBack: number = 7) => {
  const [loading, setLoading] = useState(true);
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetrics>({
    bookings: 0,
    whatsappEngaged: 0,
    callsEngaged: 0,
    leadsQualified: 0,
    formSubmits: 0,
    sessionQualitySignals: 0,
  });
  const [consentMetrics, setConsentMetrics] = useState<ConsentMetrics>({
    totalConsents: 0,
    analyticsGranted: 0,
    marketingGranted: 0,
    analyticsRate: 0,
    marketingRate: 0,
    byMethod: { banner: 0, settings: 0, implied: 0, explicit: 0 },
  });
  const [gtmHealth, setGtmHealth] = useState<GTMHealthStatus>({
    containerActive: false,
    containerId: 'GTM-5FXJ9QBK',
    lastEventTime: null,
    eventsInSession: 0,
    consentState: { analytics: false, marketing: false },
  });
  const [liveEvents, setLiveEvents] = useState<DataLayerEvent[]>([]);

  // Fetch conversion metrics from database
  const fetchConversionMetrics = useCallback(async () => {
    try {
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();
      
      // Fetch from analytics_conversions or traffic_sessions
      const { data: sessionsData } = await supabase
        .from('traffic_sessions')
        .select('intent_category, unified_intent_score')
        .gte('created_at', startDate);

      // Count validated conversions from bookings
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startDate);

      // For now, estimate other metrics from session data
      const hotLeads = sessionsData?.filter(s => s.intent_category === 'hot').length || 0;
      const highIntent = sessionsData?.filter(s => s.intent_category === 'high').length || 0;

      setConversionMetrics({
        bookings: bookingsCount || 0,
        whatsappEngaged: Math.round(hotLeads * 0.6), // Estimate
        callsEngaged: Math.round(hotLeads * 0.3), // Estimate
        leadsQualified: hotLeads + highIntent,
        formSubmits: Math.round(highIntent * 0.2),
        sessionQualitySignals: sessionsData?.filter(s => (s.unified_intent_score || 0) > 40).length || 0,
      });
    } catch (err) {
      console.error('Error fetching conversion metrics:', err);
    }
  }, [daysBack]);

  // Fetch consent metrics
  const fetchConsentMetrics = useCallback(async () => {
    try {
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

      const { data, count } = await supabase
        .from('consent_records')
        .select('analytics_storage, ad_storage, consent_method', { count: 'exact' })
        .gte('granted_at', startDate);

      if (data && count) {
        const analyticsGranted = data.filter(r => r.analytics_storage).length;
        const marketingGranted = data.filter(r => r.ad_storage).length;
        
        const byMethod = data.reduce((acc, r) => {
          const method = r.consent_method as keyof typeof acc;
          if (method && acc[method] !== undefined) {
            acc[method]++;
          }
          return acc;
        }, { banner: 0, settings: 0, implied: 0, explicit: 0 });

        setConsentMetrics({
          totalConsents: count,
          analyticsGranted,
          marketingGranted,
          analyticsRate: count > 0 ? Math.round((analyticsGranted / count) * 100) : 0,
          marketingRate: count > 0 ? Math.round((marketingGranted / count) * 100) : 0,
          byMethod,
        });
      }
    } catch (err) {
      console.error('Error fetching consent metrics:', err);
    }
  }, [daysBack]);

  // Monitor live GTM health via dataLayer
  const monitorGTMHealth = useCallback(() => {
    if (typeof window === 'undefined') return;

    const dataLayer = (window as any).dataLayer || [];
    const consent = localStorage.getItem('xtsy_consent_v2');
    let consentState = { analytics: false, marketing: false };

    if (consent) {
      try {
        const parsed = JSON.parse(consent);
        consentState = {
          analytics: parsed.analytics ?? false,
          marketing: parsed.marketing ?? false,
        };
      } catch {
        // Ignore parse errors
      }
    }

    // Find last event timestamp
    let lastEventTime: string | null = null;
    for (let i = dataLayer.length - 1; i >= 0; i--) {
      if (dataLayer[i]?.timestamp) {
        lastEventTime = dataLayer[i].timestamp;
        break;
      }
    }

    setGtmHealth({
      containerActive: dataLayer.length > 0,
      containerId: 'GTM-5FXJ9QBK',
      lastEventTime,
      eventsInSession: dataLayer.length,
      consentState,
    });
  }, []);

  // Subscribe to live dataLayer events
  useEffect(() => {
    const handleDataLayerPush = (event: CustomEvent<DataLayerEvent>) => {
      setLiveEvents(prev => [event.detail, ...prev].slice(0, 50));
    };

    window.addEventListener('datalayer-push' as any, handleDataLayerPush);
    return () => {
      window.removeEventListener('datalayer-push' as any, handleDataLayerPush);
    };
  }, []);

  // Initial fetch and periodic refresh
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchConversionMetrics(),
        fetchConsentMetrics(),
      ]);
      monitorGTMHealth();
      setLoading(false);
    };

    fetchAll();
    
    // Refresh GTM health every 10 seconds
    const healthInterval = setInterval(monitorGTMHealth, 10000);
    
    return () => {
      clearInterval(healthInterval);
    };
  }, [fetchConversionMetrics, fetchConsentMetrics, monitorGTMHealth]);

  return {
    loading,
    conversionMetrics,
    consentMetrics,
    gtmHealth,
    liveEvents,
    refresh: async () => {
      setLoading(true);
      await Promise.all([fetchConversionMetrics(), fetchConsentMetrics()]);
      monitorGTMHealth();
      setLoading(false);
    },
  };
};
