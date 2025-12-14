import { useRef, useCallback, useEffect } from 'react';
import { useEnhancedAnalytics } from './useEnhancedAnalytics';

interface FieldEngagement {
  fieldName: string;
  focusCount: number;
  totalTimeMs: number;
  lastFocusAt: number | null;
}

interface FormEngagementData {
  formName: string;
  startedAt: number;
  fieldsEngaged: Map<string, FieldEngagement>;
  scrollDepth: number;
  abandonmentPoint: string | null;
}

export function useFormEngagement(formName: string) {
  const { trackEvent } = useEnhancedAnalytics();
  
  const engagementData = useRef<FormEngagementData>({
    formName,
    startedAt: 0,
    fieldsEngaged: new Map(),
    scrollDepth: 0,
    abandonmentPoint: null,
  });
  
  const currentFieldRef = useRef<{ name: string; startTime: number } | null>(null);
  const hasStarted = useRef(false);

  // Track form start
  const trackFormStart = useCallback(() => {
    if (hasStarted.current) return;
    
    hasStarted.current = true;
    engagementData.current.startedAt = Date.now();
    
    trackEvent('form_engagement', 'form_start', formName, 0);
  }, [formName, trackEvent]);

  // Track field focus
  const trackFieldFocus = useCallback((fieldName: string) => {
    // Start form tracking on first field focus
    if (!hasStarted.current) {
      trackFormStart();
    }
    
    currentFieldRef.current = { name: fieldName, startTime: Date.now() };
    
    const existing = engagementData.current.fieldsEngaged.get(fieldName) || {
      fieldName,
      focusCount: 0,
      totalTimeMs: 0,
      lastFocusAt: null,
    };
    
    existing.focusCount++;
    existing.lastFocusAt = Date.now();
    engagementData.current.fieldsEngaged.set(fieldName, existing);
    engagementData.current.abandonmentPoint = fieldName;
    
    trackEvent('form_engagement', 'field_focus', fieldName, 0);
  }, [trackFormStart, trackEvent]);

  // Track field blur
  const trackFieldBlur = useCallback((fieldName: string, hasValue: boolean) => {
    if (currentFieldRef.current?.name === fieldName) {
      const timeSpent = Date.now() - currentFieldRef.current.startTime;
      
      const existing = engagementData.current.fieldsEngaged.get(fieldName);
      if (existing) {
        existing.totalTimeMs += timeSpent;
        engagementData.current.fieldsEngaged.set(fieldName, existing);
      }
      
      trackEvent('form_engagement', 'field_blur', fieldName, timeSpent);
      
      if (hasValue) {
        trackEvent('form_engagement', 'field_completed', fieldName, 0);
      }
      
      currentFieldRef.current = null;
    }
  }, [trackEvent]);

  // Track scroll depth within form
  const trackScrollDepth = useCallback((depth: number) => {
    if (depth > engagementData.current.scrollDepth) {
      engagementData.current.scrollDepth = depth;
    }
  }, []);

  // Track form completion
  const trackFormComplete = useCallback(() => {
    const totalTime = Date.now() - engagementData.current.startedAt;
    const fieldsCompleted = Array.from(engagementData.current.fieldsEngaged.keys());
    
    trackEvent('form_engagement', 'form_complete', formName, totalTime);
    
    // Send summary event with all engagement data
    trackEvent('form_engagement', 'form_summary', formName, totalTime);
  }, [formName, trackEvent]);

  // Track form abandonment
  const trackFormAbandon = useCallback(() => {
    if (!hasStarted.current) return;
    
    const totalTime = Date.now() - engagementData.current.startedAt;
    const abandonPoint = engagementData.current.abandonmentPoint || 'unknown';
    
    trackEvent('form_engagement', 'form_abandon', abandonPoint, totalTime);
  }, [trackEvent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // If form was started but not completed, track as abandonment
      if (hasStarted.current && engagementData.current.abandonmentPoint) {
        trackFormAbandon();
      }
    };
  }, [trackFormAbandon]);

  // Reset for new form session
  const resetEngagement = useCallback(() => {
    hasStarted.current = false;
    engagementData.current = {
      formName,
      startedAt: 0,
      fieldsEngaged: new Map(),
      scrollDepth: 0,
      abandonmentPoint: null,
    };
    currentFieldRef.current = null;
  }, [formName]);

  return {
    trackFormStart,
    trackFieldFocus,
    trackFieldBlur,
    trackScrollDepth,
    trackFormComplete,
    trackFormAbandon,
    resetEngagement,
    getEngagementSummary: () => ({
      formName: engagementData.current.formName,
      totalTimeMs: Date.now() - engagementData.current.startedAt,
      fieldsEngaged: engagementData.current.fieldsEngaged.size,
      scrollDepth: engagementData.current.scrollDepth,
      abandonmentPoint: engagementData.current.abandonmentPoint,
    }),
  };
}
