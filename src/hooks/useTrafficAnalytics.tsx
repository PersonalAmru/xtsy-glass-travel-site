/**
 * Traffic Analytics Hook
 * React hook for integrating traffic analytics in components
 */

import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  trafficAnalytics, 
  initTrafficAnalytics 
} from '@/services/trafficAnalyticsService';
import { consentManager } from '@/services/consentManagementService';

export const useTrafficAnalytics = () => {
  const location = useLocation();
  const isInitialized = useRef(false);
  
  // Initialize analytics on mount
  useEffect(() => {
    if (isInitialized.current) return;
    
    const init = async () => {
      // Initialize consent management first
      consentManager.initialize();
      
      // Then initialize traffic analytics
      await initTrafficAnalytics();
      isInitialized.current = true;
    };
    
    init();
  }, []);
  
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
  
  // Track WhatsApp click with validation
  const trackWhatsAppClick = useCallback((metadata?: Record<string, unknown>) => {
    trafficAnalytics.trackWhatsAppEngagement(metadata);
  }, []);
  
  // Track Call click with validation
  const trackCallClick = useCallback((callDuration?: number, metadata?: Record<string, unknown>) => {
    trafficAnalytics.trackCallEngagement(callDuration, metadata);
  }, []);
  
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
  
  return {
    // Getters
    sessionId: trafficAnalytics.getSessionId(),
    visitorId: trafficAnalytics.getVisitorId(),
    deviceTier: trafficAnalytics.getDeviceTier(),
    botLikelihood: trafficAnalytics.getBotLikelihood(),
    intentScore: trafficAnalytics.getIntentScore(),
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
 * Add this to App.tsx to enable analytics
 */
export const TrafficAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useTrafficAnalytics();
  return <>{children}</>;
};

export default useTrafficAnalytics;
