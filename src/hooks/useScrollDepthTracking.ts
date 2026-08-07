/**
 * useScrollDepthTracking - Track scroll depth milestones for GA4
 * 
 * Fires scroll_depth events at 25%, 50%, 75%, 100% milestones
 * Each milestone fires only once per page session
 */

import { useEffect, useRef, useCallback } from 'react';
import { routeGTMEvent } from '@/utils/gtmEventRouter';

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;
type ScrollMilestone = typeof SCROLL_MILESTONES[number];

interface ScrollDepthOptions {
  /** Debounce delay in ms (default: 100) */
  debounceMs?: number;
  /** Enable tracking (default: true) */
  enabled?: boolean;
  /** Page identifier for multi-page tracking */
  pageId?: string;
}

export const useScrollDepthTracking = (options: ScrollDepthOptions = {}) => {
  const { debounceMs = 100, enabled = true, pageId = window.location.pathname } = options;
  
  const firedMilestones = useRef<Set<ScrollMilestone>>(new Set());
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const startTimeRef = useRef<number>(Date.now());
  const maxDepthRef = useRef<number>(0);

  // Reset milestones on page change
  useEffect(() => {
    firedMilestones.current.clear();
    startTimeRef.current = Date.now();
    maxDepthRef.current = 0;
  }, [pageId]);

  const calculateScrollDepth = useCallback((): number => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Handle edge case where document fits in viewport
    if (documentHeight <= windowHeight) return 100;
    
    const scrollableHeight = documentHeight - windowHeight;
    const scrollPercent = (scrollTop / scrollableHeight) * 100;
    
    return Math.min(Math.round(scrollPercent), 100);
  }, []);

  const fireMilestoneEvent = useCallback((milestone: ScrollMilestone, currentDepth: number) => {
    if (firedMilestones.current.has(milestone)) return;
    
    firedMilestones.current.add(milestone);
    const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);
    
    routeGTMEvent({
      eventName: 'scroll_depth',
      params: {
        scroll_depth_percent: currentDepth,
        scroll_milestone: milestone,
        time_to_milestone_seconds: timeOnPage,
        page_path: pageId,
        milestones_reached: Array.from(firedMilestones.current),
      },
    });

    console.log(`[Scroll Tracking] Milestone ${milestone}% reached (actual: ${currentDepth}%)`);
  }, [pageId]);

  const handleScroll = useCallback(() => {
    if (!enabled) return;
    
    // Clear any pending timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Debounce the actual tracking
    scrollTimeoutRef.current = setTimeout(() => {
      const currentDepth = calculateScrollDepth();
      
      // Track max depth for session analytics
      if (currentDepth > maxDepthRef.current) {
        maxDepthRef.current = currentDepth;
      }
      
      // Fire events for each milestone crossed
      for (const milestone of SCROLL_MILESTONES) {
        if (currentDepth >= milestone && !firedMilestones.current.has(milestone)) {
          fireMilestoneEvent(milestone, currentDepth);
        }
      }
    }, debounceMs);
  }, [enabled, debounceMs, calculateScrollDepth, fireMilestoneEvent]);

  useEffect(() => {
    if (!enabled) return;
    
    // Check initial scroll position (user may have scrolled before JS loaded)
    handleScroll();
    
    // Add scroll listener with passive flag for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [enabled, handleScroll]);

  // Return current state for debugging/display
  return {
    currentMaxDepth: maxDepthRef.current,
    firedMilestones: Array.from(firedMilestones.current),
    resetTracking: () => {
      firedMilestones.current.clear();
      maxDepthRef.current = 0;
    },
  };
};

export default useScrollDepthTracking;
