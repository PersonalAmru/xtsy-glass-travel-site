/**
 * useBookingSession - Session storage management for booking flow
 * Stores search params, property selection, and multi-room selections
 */

import { useState, useCallback } from 'react';

export interface SearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface RoomSelection {
  roomTypeId: string;
  quantity: number;
}

interface BookingSession {
  searchParams: SearchParams | null;
  propertyId: string | null;
  propertyName: string | null;
  roomSelections: RoomSelection[];
}

const STORAGE_KEY = 'xtsy_booking_session';
const SEARCH_PARAMS_KEY = 'xtsy_search_params';

export const useBookingSession = () => {
  const getSession = useCallback((): BookingSession | null => {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }, []);

  const getSearchParams = useCallback((): SearchParams | null => {
    try {
      const data = sessionStorage.getItem(SEARCH_PARAMS_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }, []);

  const saveSearchParams = useCallback((params: SearchParams) => {
    sessionStorage.setItem(SEARCH_PARAMS_KEY, JSON.stringify(params));
  }, []);

  const saveSession = useCallback((session: Partial<BookingSession>) => {
    const current = getSession() || {
      searchParams: null,
      propertyId: null,
      propertyName: null,
      roomSelections: [],
    };
    const updated = { ...current, ...session };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [getSession]);

  const saveRoomSelections = useCallback((selections: RoomSelection[]) => {
    saveSession({ roomSelections: selections });
  }, [saveSession]);

  const getRoomSelections = useCallback((): RoomSelection[] => {
    const session = getSession();
    return session?.roomSelections || [];
  }, [getSession]);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasValidDates = useCallback((): boolean => {
    const params = getSearchParams();
    return !!(params?.checkIn && params?.checkOut);
  }, [getSearchParams]);

  return {
    getSession,
    getSearchParams,
    saveSearchParams,
    saveSession,
    saveRoomSelections,
    getRoomSelections,
    clearSession,
    hasValidDates,
  };
};

export default useBookingSession;
