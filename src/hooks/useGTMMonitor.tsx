/**
 * useGTMMonitor - Real-time GTM Event Monitoring Hook for Admin Dashboard
 * 
 * Provides live visibility into all GTM events being routed through the system.
 * This is the admin's "backend GA4 brain" interface.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getEventStats, getRegisteredTriggers, getConversionEvents, GTM_TRIGGERS } from '@/utils/gtmEventRouter';

export interface GTMEventRecord {
  id: string;
  eventName: string;
  category: string;
  priority: string;
  isConversion: boolean;
  params: Record<string, unknown>;
  timestamp: string;
  pagePath: string;
}

export interface GTMCategoryStats {
  category: string;
  count: number;
  lastFired: string;
  events: string[];
}

export interface GTMMonitorState {
  // Live event stream
  recentEvents: GTMEventRecord[];
  
  // Aggregated stats
  totalEvents: number;
  conversionEvents: number;
  eventsByCategory: GTMCategoryStats[];
  eventsByHour: { hour: number; count: number }[];
  topEvents: { name: string; count: number }[];
  topPages: { path: string; count: number }[];
  
  // Health indicators
  isHealthy: boolean;
  lastEventTime: string | null;
  eventsPerMinute: number;
}

const MAX_RECENT_EVENTS = 100;

export const useGTMMonitor = () => {
  const [state, setState] = useState<GTMMonitorState>({
    recentEvents: [],
    totalEvents: 0,
    conversionEvents: 0,
    eventsByCategory: [],
    eventsByHour: [],
    topEvents: [],
    topPages: [],
    isHealthy: true,
    lastEventTime: null,
    eventsPerMinute: 0,
  });
  
  const eventCountRef = useRef<number[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  // Listen for routed GTM events
  useEffect(() => {
    const handleGTMEvent = (e: CustomEvent) => {
      const { eventName, category, priority, isConversion, params, timestamp } = e.detail;
      
      const newEvent: GTMEventRecord = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        eventName,
        category,
        priority,
        isConversion,
        params,
        timestamp,
        pagePath: (params.page_path as string) || window.location.pathname,
      };
      
      // Track event count for rate calculation
      eventCountRef.current.push(Date.now());
      
      setState(prev => {
        const recentEvents = [newEvent, ...prev.recentEvents].slice(0, MAX_RECENT_EVENTS);
        
        return {
          ...prev,
          recentEvents,
          totalEvents: prev.totalEvents + 1,
          conversionEvents: prev.conversionEvents + (isConversion ? 1 : 0),
          lastEventTime: timestamp,
        };
      });
    };
    
    window.addEventListener('gtm-event-routed', handleGTMEvent as EventListener);
    return () => window.removeEventListener('gtm-event-routed', handleGTMEvent as EventListener);
  }, []);

  // Calculate events per minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      
      // Filter to last minute
      eventCountRef.current = eventCountRef.current.filter(t => t > oneMinuteAgo);
      
      setState(prev => ({
        ...prev,
        eventsPerMinute: eventCountRef.current.length,
        isHealthy: prev.lastEventTime 
          ? (now - new Date(prev.lastEventTime).getTime()) < 300000 // No events in 5 min = unhealthy
          : true,
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Compute aggregated stats
  const computeStats = useCallback(() => {
    const stats = getEventStats();
    
    // Events by category
    const categoryMap = new Map<string, GTMCategoryStats>();
    Object.entries(stats).forEach(([eventName, eventStats]) => {
      const config = GTM_TRIGGERS[eventName];
      const category = config?.category || 'unknown';
      
      const existing = categoryMap.get(category) || {
        category,
        count: 0,
        lastFired: '',
        events: [],
      };
      
      existing.count += eventStats.totalCount;
      if (!existing.lastFired || eventStats.lastFired > existing.lastFired) {
        existing.lastFired = eventStats.lastFired;
      }
      if (!existing.events.includes(eventName)) {
        existing.events.push(eventName);
      }
      
      categoryMap.set(category, existing);
    });
    
    // Events by hour (aggregate)
    const hourMap = new Map<number, number>();
    Object.values(stats).forEach(eventStats => {
      Object.entries(eventStats.byHour).forEach(([hour, count]) => {
        hourMap.set(parseInt(hour), (hourMap.get(parseInt(hour)) || 0) + count);
      });
    });
    
    // Top events
    const topEvents = Object.entries(stats)
      .map(([name, s]) => ({ name, count: s.totalCount }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Top pages
    const pageMap = new Map<string, number>();
    Object.values(stats).forEach(eventStats => {
      Object.entries(eventStats.byPage).forEach(([path, count]) => {
        pageMap.set(path, (pageMap.get(path) || 0) + count);
      });
    });
    
    const topPages = Array.from(pageMap.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    setState(prev => ({
      ...prev,
      eventsByCategory: Array.from(categoryMap.values()).sort((a, b) => b.count - a.count),
      eventsByHour: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: hourMap.get(i) || 0,
      })),
      topEvents,
      topPages,
    }));
  }, []);

  // Refresh stats periodically
  useEffect(() => {
    computeStats();
    const interval = setInterval(computeStats, 10000);
    return () => clearInterval(interval);
  }, [computeStats]);

  // Get registered triggers info
  const registeredTriggers = getRegisteredTriggers();
  const conversionEventNames = getConversionEvents();

  return {
    ...state,
    registeredTriggers,
    conversionEventNames,
    refreshStats: computeStats,
  };
};

export default useGTMMonitor;
