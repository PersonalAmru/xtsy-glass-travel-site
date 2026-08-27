/**
 * Traffic Analytics Hook
 * React hook for integrating traffic analytics with 3-layer defense system
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useLocation } from '@/lib/router-compat';
import { 
  trafficAnalytics, 
  initTrafficAnalytics 
} from '@/services/trafficAnalyticsService';
import { consentManager } from '@/services/consentManagementService';
import { 
  getDefenseEngine, 
  captureEnterpriseDeviceInfo,
  type SessionClassification 
} from '@/services/trafficDefenseService';
import {
  sendWhatsAppValidated,
  sendCallValidated,
  sendSessionQuality,
  setUserProperties,
} from '@/utils/ga4Integration';
import { supabase } from '@/integrations/supabase/client';
import { deferUntilIdle } from '@/utils/deferUntilIdle';

export interface TrafficAnalyticsState {
  sessionId: string;
  visitorId: string;
  deviceTier: 'premium' | 'standard' | 'neutral';
  defenseScore: number;
  intentScore: number;
  classification: SessionClassification;
  activeScrollSeconds: number;
  meetsScrollThreshold: boolean;
  isReturnVisitor: boolean;
  visitCount: number;
}

export const useTrafficAnalytics = () => {
  const location = useLocation();
  const isInitialized = useRef(false);
  const defenseEngineRef = useRef<ReturnType<typeof getDefenseEngine> | null>(null);
  
  const [state, setState] = useState<TrafficAnalyticsState>({
    sessionId: '',
    visitorId: '',
    deviceTier: 'neutral',
    defenseScore: 100,
    intentScore: 0,
    classification: 'low_intent',
    activeScrollSeconds: 0,
    meetsScrollThreshold: false,
    isReturnVisitor: false,
    visitCount: 1,
  });
  
  // Initialize analytics and defense engine on mount
  useEffect(() => {
    if (isInitialized.current) return;
    
    const init = async () => {
      // Initialize consent management first
      consentManager.initialize();
      
      // Then initialize traffic analytics
      await initTrafficAnalytics();
      
      const sessionId = trafficAnalytics.getSessionId();
      const visitorId = trafficAnalytics.getVisitorId();
      
      // Initialize defense engine
      defenseEngineRef.current = getDefenseEngine(sessionId, visitorId);
      
      // Run initial defense checks (Layer 1 & 2)
      const initialChecks = defenseEngineRef.current.runInitialChecks();
      
      // Capture enterprise device info
      const deviceInfo = captureEnterpriseDeviceInfo();
      
      // Update session with device info and defense results
      await supabase
        .from('traffic_sessions')
        .update({
          defense_layer_1_passed: initialChecks.layer1.passed,
          defense_layer_2_passed: initialChecks.layer2.passed,
          defense_score: Math.round((initialChecks.layer1.totalScore + initialChecks.layer2.totalScore) / 2),
          device_model: deviceInfo.deviceModel,
          device_vendor: deviceInfo.deviceVendor,
          browser_version: deviceInfo.browserVersion,
          os_version: deviceInfo.osVersion,
          connection_type: deviceInfo.connectionType,
          hardware_concurrency: deviceInfo.hardwareConcurrency,
          device_memory: deviceInfo.deviceMemory,
          touch_points: deviceInfo.touchPoints,
          platform: deviceInfo.platform,
          language: deviceInfo.language,
          languages: deviceInfo.languages,
          color_depth: deviceInfo.colorDepth,
          pixel_ratio: deviceInfo.pixelRatio,
          timezone_offset: deviceInfo.timezoneOffset,
        } as any)
        .eq('session_id', sessionId);
      
      // Check if return visitor
      const { data: sessionCount } = await supabase.rpc('get_visitor_session_count', {
        _visitor_id: visitorId,
      } as any);
      
      const totalSessions = Number(sessionCount) || 0;
      const isReturn = totalSessions > 1;
      const visitCount = totalSessions || 1;
      
      // Set GA4 user properties
      setUserProperties({
        deviceTier: trafficAnalytics.getDeviceTier(),
        intentCategory: 'low',
        isReturnVisitor: isReturn,
        visitCount,
      });
      
      setState({
        sessionId,
        visitorId,
        deviceTier: trafficAnalytics.getDeviceTier(),
        defenseScore: Math.round((initialChecks.layer1.totalScore + initialChecks.layer2.totalScore) / 2),
        intentScore: trafficAnalytics.getIntentScore(),
        classification: 'low_intent',
        activeScrollSeconds: 0,
        meetsScrollThreshold: false,
        isReturnVisitor: isReturn,
        visitCount,
      });
      
      isInitialized.current = true;
    };
    
    // Defer the full analytics + defense init (several Supabase round-trips)
    // until the browser is idle after LCP, so it never blocks hydration.
    // Tracking still runs in full — only its start is scheduled off the critical path.
    deferUntilIdle(() => { void init(); });
  }, []);
  
  // Update state periodically
  useEffect(() => {
    if (!isInitialized.current || !defenseEngineRef.current) return;
    
    const interval = setInterval(() => {
      const activeScrollSeconds = defenseEngineRef.current?.getActiveScrollSeconds() || 0;
      const meetsThreshold = defenseEngineRef.current?.meetsScrollThreshold() || false;
      const intentScore = trafficAnalytics.getIntentScore();
      
      setState(prev => ({
        ...prev,
        activeScrollSeconds: Math.round(activeScrollSeconds),
        meetsScrollThreshold: meetsThreshold,
        intentScore,
      }));
      
      // Update session with active scroll data
      if (meetsThreshold && !state.meetsScrollThreshold) {
        supabase
          .from('traffic_sessions')
          .update({
            active_scroll_seconds: Math.round(activeScrollSeconds),
            meets_15s_threshold: true,
          } as any)
          .eq('session_id', state.sessionId);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [state.sessionId, state.meetsScrollThreshold]);
  
  // Track page views on route change
  useEffect(() => {
    if (!isInitialized.current) return;
    
    trafficAnalytics.trackPageView({
      session_id: trafficAnalytics.getSessionId(),
      page_url: window.location.href,
      page_path: location.pathname,
      page_title: document.title,
    });
  }, [location.pathname]);
  
  // Track WhatsApp click with 3-layer validation
  const trackWhatsAppClick = useCallback(async (metadata?: Record<string, unknown>) => {
    if (!defenseEngineRef.current) return;
    
    // First track the raw click
    trafficAnalytics.trackWhatsAppEngagement(metadata);
    
    // Validate with defense engine
    const validation = await defenseEngineRef.current.validateWhatsAppEngagement();
    
    // Update session
    await supabase
      .from('traffic_sessions')
      .update({
        whatsapp_clicked: true,
        whatsapp_validated: validation.validated,
      } as any)
      .eq('session_id', state.sessionId);
    
    // Only send to GA4 if validated
    if (validation.validated) {
      sendWhatsAppValidated({
        sessionId: state.sessionId,
        value: 100 * (state.deviceTier === 'premium' ? 1.5 : 1),
        intentScore: state.intentScore,
        deviceTier: state.deviceTier,
        clickQualityScore: trafficAnalytics.getClickQualityScore(),
      });
    }
    
    console.log('[Analytics] WhatsApp click:', validation.validated ? 'VALIDATED' : 'NOT VALIDATED', validation.reason);
  }, [state.sessionId, state.deviceTier, state.intentScore]);
  
  // Track Call click with 3-layer validation
  const trackCallClick = useCallback(async (callDuration?: number, metadata?: Record<string, unknown>) => {
    if (!defenseEngineRef.current) return;
    
    // First track the raw click
    trafficAnalytics.trackCallEngagement(callDuration, metadata);
    
    // Validate with defense engine
    const validation = await defenseEngineRef.current.validateCallEngagement(callDuration);
    
    // Update session
    await supabase
      .from('traffic_sessions')
      .update({
        call_clicked: true,
        call_validated: validation.validated,
      } as any)
      .eq('session_id', state.sessionId);
    
    // Only send to GA4 if validated
    if (validation.validated) {
      sendCallValidated({
        sessionId: state.sessionId,
        value: 150 * (state.deviceTier === 'premium' ? 1.5 : 1),
        intentScore: state.intentScore,
        deviceTier: state.deviceTier,
        clickQualityScore: trafficAnalytics.getClickQualityScore(),
        callDuration,
      });
    }
    
    console.log('[Analytics] Call click:', validation.validated ? 'VALIDATED' : 'NOT VALIDATED', validation.reason);
  }, [state.sessionId, state.deviceTier, state.intentScore]);
  
  // Track lead qualification
  const trackLeadQualified = useCallback((leadData: {
    lead_source: string;
    contact_type: 'whatsapp' | 'call' | 'email' | 'form';
    lead_value?: number;
  }) => {
    trafficAnalytics.trackLeadQualified(leadData);
  }, []);
  
  // Track booking confirmed
  const trackBookingConfirmed = useCallback((bookingData: {
    booking_id: string;
    booking_value: number;
    room_type?: string;
  }) => {
    trafficAnalytics.trackBookingConfirmed(bookingData);
  }, []);
  
  // Track custom interaction
  const trackInteraction = useCallback((
    eventType: 'click' | 'scroll' | 'form' | 'video' | 'download' | 'share' | 'custom',
    eventName: string,
    metadata?: Record<string, unknown>
  ) => {
    trafficAnalytics.trackInteraction({
      session_id: trafficAnalytics.getSessionId(),
      event_type: eventType,
      event_name: eventName,
      page_url: window.location.pathname,
      metadata,
    });
  }, []);
  
  // Send session quality signal to GA4 on unmount
  useEffect(() => {
    return () => {
      if (state.meetsScrollThreshold && state.defenseScore >= 40) {
        sendSessionQuality({
          sessionId: state.sessionId,
          classification: state.classification,
          defenseScore: state.defenseScore,
          intentScore: state.intentScore,
          deviceTier: state.deviceTier,
          activeScrollSeconds: state.activeScrollSeconds,
        });
      }
    };
  }, [state]);
  
  return {
    // State
    ...state,
    
    // Legacy getters for compatibility
    sessionId: state.sessionId || trafficAnalytics.getSessionId(),
    visitorId: state.visitorId || trafficAnalytics.getVisitorId(),
    deviceTier: state.deviceTier,
    botLikelihood: trafficAnalytics.getBotLikelihood(),
    intentScore: state.intentScore,
    clickQualityScore: trafficAnalytics.getClickQualityScore(),
    
    // Tracking methods
    trackWhatsAppClick,
    trackCallClick,
    trackLeadQualified,
    trackBookingConfirmed,
    trackInteraction,
  };
};

/**
 * Traffic Analytics Provider Component
 * Add this to App.tsx to enable analytics with 3-layer defense
 */
export const TrafficAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useTrafficAnalytics();
  return <>{children}</>;
};

export default useTrafficAnalytics;
