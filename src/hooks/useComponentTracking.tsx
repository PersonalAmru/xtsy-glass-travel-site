/**
 * useComponentTracking - Universal component tracking hook
 * 
 * Provides tracking helpers for any component to report to GTM Brain.
 * Integrates with gtmEventRouter for unified analytics.
 */

import { useCallback, useRef, useEffect } from 'react';
import { 
  routeButtonEvent, 
  routeCTAEvent, 
  routeEngagementEvent,
  routeFormEvent,
  routeGTMEvent 
} from '@/utils/gtmEventRouter';

interface TrackingLocation {
  section: string;
  page?: string;
}

export const useComponentTracking = (location: TrackingLocation) => {
  const { section, page = window.location.pathname } = location;
  const interactionCount = useRef(0);
  const startTime = useRef(Date.now());

  // Reset on mount
  useEffect(() => {
    startTime.current = Date.now();
    interactionCount.current = 0;
  }, [section]);

  /**
   * Track a button click
   */
  const trackButton = useCallback((buttonName: string, metadata?: Record<string, unknown>) => {
    interactionCount.current++;
    routeButtonEvent(buttonName, section, {
      page_path: page,
      interaction_count: interactionCount.current,
      ...metadata,
    });
  }, [section, page]);

  /**
   * Track a CTA click (high priority)
   */
  const trackCTA = useCallback((ctaName: string, metadata?: Record<string, unknown>) => {
    interactionCount.current++;
    routeCTAEvent(ctaName, section, {
      page_path: page,
      time_to_action_ms: Date.now() - startTime.current,
      ...metadata,
    });
  }, [section, page]);

  /**
   * Track a card/item click
   */
  const trackCardClick = useCallback((cardName: string, cardType: string, metadata?: Record<string, unknown>) => {
    routeGTMEvent({
      eventName: 'card_click',
      params: {
        card_name: cardName,
        card_type: cardType,
        card_location: section,
        page_path: page,
        ...metadata,
      },
    });
  }, [section, page]);

  /**
   * Track a modal open
   */
  const trackModalOpen = useCallback((modalName: string, metadata?: Record<string, unknown>) => {
    routeEngagementEvent('modal_interaction', {
      modal_name: modalName,
      modal_action: 'open',
      modal_location: section,
      page_path: page,
      ...metadata,
    });
  }, [section, page]);

  /**
   * Track a modal close
   */
  const trackModalClose = useCallback((modalName: string, metadata?: Record<string, unknown>) => {
    routeEngagementEvent('modal_interaction', {
      modal_name: modalName,
      modal_action: 'close',
      modal_location: section,
      page_path: page,
      time_in_modal_ms: Date.now() - startTime.current,
      ...metadata,
    });
  }, [section, page]);

  /**
   * Track carousel/slider navigation
   */
  const trackCarousel = useCallback((direction: 'next' | 'prev' | 'dot', index: number) => {
    routeGTMEvent({
      eventName: 'carousel_navigate',
      params: {
        carousel_location: section,
        navigation_direction: direction,
        slide_index: index,
        page_path: page,
      },
    });
  }, [section, page]);

  /**
   * Track section becoming visible
   */
  const trackSectionView = useCallback((sectionName: string, metadata?: Record<string, unknown>) => {
    routeEngagementEvent('section_view', {
      section_name: sectionName,
      section_location: section,
      page_path: page,
      ...metadata,
    });
  }, [section, page]);

  /**
   * Track form start (first interaction)
   */
  const trackFormStart = useCallback((formName: string) => {
    routeFormEvent('form_start', formName, {
      form_location: section,
    });
  }, [section]);

  /**
   * Track form field focus
   */
  const trackFormField = useCallback((formName: string, fieldName: string) => {
    routeFormEvent('form_field_focus', formName, {
      field_name: fieldName,
      form_location: section,
    });
  }, [section]);

  /**
   * Track form submission
   */
  const trackFormSubmit = useCallback((formName: string, metadata?: Record<string, unknown>) => {
    routeFormEvent('form_submit', formName, {
      form_location: section,
      time_to_submit_ms: Date.now() - startTime.current,
      ...metadata,
    });
  }, [section]);

  /**
   * Track form abandonment
   */
  const trackFormAbandon = useCallback((formName: string, lastField?: string) => {
    routeFormEvent('form_abandon', formName, {
      last_field: lastField,
      form_location: section,
      time_spent_ms: Date.now() - startTime.current,
    });
  }, [section]);

  /**
   * Track link click with destination
   */
  const trackLink = useCallback((linkName: string, destination: string, isExternal = false) => {
    routeGTMEvent({
      eventName: 'link_click',
      params: {
        link_name: linkName,
        link_destination: destination,
        link_location: section,
        is_external: isExternal,
        page_path: page,
      },
    });
  }, [section, page]);

  /**
   * Track package/room viewed
   */
  const trackItemView = useCallback((itemType: 'package' | 'room' | 'property', itemName: string, metadata?: Record<string, unknown>) => {
    const eventName = itemType === 'package' ? 'package_viewed' : 
                      itemType === 'room' ? 'room_viewed' : 
                      'property_viewed';
    
    routeEngagementEvent(eventName as any, {
      item_name: itemName,
      item_type: itemType,
      item_location: section,
      page_path: page,
      ...metadata,
    });
  }, [section, page]);

  return {
    trackButton,
    trackCTA,
    trackCardClick,
    trackModalOpen,
    trackModalClose,
    trackCarousel,
    trackSectionView,
    trackFormStart,
    trackFormField,
    trackFormSubmit,
    trackFormAbandon,
    trackLink,
    trackItemView,
  };
};

export default useComponentTracking;
