/**
 * usePageTracking - Centralized GTM Page Navigation & Button Action Tracking
 * 
 * Implements comprehensive page-wise GTM triggers for:
 * 1. Page navigation tracking (virtual page views for SPA)
 * 2. Button action tracking (all CTAs and interactive elements)
 * 3. Session-based navigation flow
 * 4. Admin traffic filtering
 */

import { useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { pushToDataLayer } from '@/utils/dataLayerService';
import { isLovableSession } from '@/utils/analyticsFilters';

// Page category mapping for better analytics segmentation
const PAGE_CATEGORIES: Record<string, string> = {
  '/': 'home',
  '/travel': 'tour_packages',
  '/properties': 'accommodation',
  '/book': 'booking',
  '/female-travellers': 'xtsy_prime',
  '/pet-friendly': 'xtsy_prime',
  '/xtsy-vs-zostel': 'xtsy_prime',
  '/xtsy-270': 'xtsy_prime',
  '/work-from-home': 'xtsy_prime',
  '/xtsy-rentals': 'xtsy_prime',
  '/admin': 'admin',
  '/contact': 'contact',
  '/privacy-policy': 'legal',
  '/terms-of-service': 'legal',
};

// Get page category from path
const getPageCategory = (path: string): string => {
  // Exact match first
  if (PAGE_CATEGORIES[path]) return PAGE_CATEGORIES[path];
  
  // Check prefixes
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/properties/')) return 'property_detail';
  if (path.startsWith('/travel')) return 'tour_packages';
  
  return 'other';
};

// Track page view event
const trackPageNavigation = (
  path: string, 
  prevPath: string | null, 
  navigationType: string
) => {
  // Skip admin sessions
  if (isLovableSession()) {
    console.log('[PageTracking] Skipped (admin session)');
    return;
  }

  const pageCategory = getPageCategory(path);
  const isReturningUser = sessionStorage.getItem('xtsy_returning_user') === 'true';
  
  pushToDataLayer({
    event: 'page_navigation',
    page_path: path,
    page_category: pageCategory,
    previous_page: prevPath,
    navigation_type: navigationType, // 'PUSH', 'POP', 'REPLACE'
    is_returning_user: isReturningUser,
    session_page_count: incrementPageCount(),
    timestamp: new Date().toISOString(),
  });
  
  console.log(`[PageTracking] page_navigation: ${path} (${pageCategory})`);
};

// Session page count for funnel tracking
const incrementPageCount = (): number => {
  const current = parseInt(sessionStorage.getItem('xtsy_page_count') || '0', 10);
  const next = current + 1;
  sessionStorage.setItem('xtsy_page_count', String(next));
  return next;
};

// Button tracking helper
export const trackButtonClick = (
  buttonName: string,
  buttonLocation: string,
  metadata?: Record<string, unknown>
) => {
  if (isLovableSession()) return;

  pushToDataLayer({
    event: 'button_click',
    button_name: buttonName,
    button_location: buttonLocation,
    page_path: window.location.pathname,
    page_category: getPageCategory(window.location.pathname),
    ...metadata,
  });
  
  console.log(`[PageTracking] button_click: ${buttonName} in ${buttonLocation}`);
};

// Section view tracking (for scroll-based visibility)
export const trackSectionView = (
  sectionId: string,
  sectionName: string
) => {
  if (isLovableSession()) return;

  pushToDataLayer({
    event: 'section_view',
    section_id: sectionId,
    section_name: sectionName,
    page_path: window.location.pathname,
  });
};

// Modal interaction tracking
export const trackModalInteraction = (
  modalName: string,
  action: 'open' | 'close' | 'submit',
  metadata?: Record<string, unknown>
) => {
  if (isLovableSession()) return;

  pushToDataLayer({
    event: 'modal_interaction',
    modal_name: modalName,
    modal_action: action,
    page_path: window.location.pathname,
    ...metadata,
  });
};

// Navigation CTA tracking
export const trackNavigationAction = (
  actionType: 'back' | 'forward' | 'scroll_to_section',
  destination: string,
  origin: string
) => {
  if (isLovableSession()) return;

  pushToDataLayer({
    event: 'navigation_action',
    action_type: actionType,
    destination,
    origin,
    page_path: window.location.pathname,
  });
};

/**
 * Hook for automatic page tracking on route changes
 */
export const usePageTracking = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPathRef = useRef<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip first render to avoid double-tracking initial load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPathRef.current = location.pathname;
      
      // Track initial page load
      if (!isLovableSession()) {
        pushToDataLayer({
          event: 'page_load',
          page_path: location.pathname,
          page_category: getPageCategory(location.pathname),
          is_returning_user: sessionStorage.getItem('xtsy_returning_user') === 'true',
        });
      }
      return;
    }

    // Track navigation
    trackPageNavigation(
      location.pathname,
      prevPathRef.current,
      navigationType
    );

    // Update previous path
    prevPathRef.current = location.pathname;
  }, [location.pathname, navigationType]);

  // Helper to track back navigation with section return
  const trackBackToSection = useCallback((sectionId: string) => {
    trackNavigationAction('back', sectionId, location.pathname);
  }, [location.pathname]);

  return {
    currentPath: location.pathname,
    currentCategory: getPageCategory(location.pathname),
    trackButtonClick,
    trackSectionView,
    trackModalInteraction,
    trackBackToSection,
  };
};

export default usePageTracking;
