/**
 * Hook to fetch aggregate availability across all room types
 * Used for the booking calendar to show overall property availability
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AggregateAvailabilityData {
  totalAvailable: number;
  totalUnits: number;
  roomTypesAvailable: number;
  roomTypesTotal: number;
  isFullySoldOut: boolean;
  isLimited: boolean; // Less than 30% available
  isPopular: boolean; // More than 50% booked
}

interface UseAggregateAvailabilityReturn {
  availability: Record<string, AggregateAvailabilityData>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAggregateAvailability = (
  enabled: boolean = true
): UseAggregateAvailabilityReturn => {
  const [availability, setAvailability] = useState<Record<string, AggregateAvailabilityData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);

  const loadAvailability = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Prevent duplicate fetches within 5 seconds
    const now = Date.now();
    if (now - lastFetchRef.current < 5000 && Object.keys(availability).length > 0) {
      return;
    }
    lastFetchRef.current = now;

    try {
      setLoading(true);
      setError(null);

      // Get all active room types
      const { data: roomTypes, error: roomTypesError } = await supabase
        .from('room_types')
        .select('id, name, total_units')
        .eq('is_active', true);

      if (roomTypesError) {
        throw new Error('Failed to fetch room types');
      }

      if (!roomTypes || roomTypes.length === 0) {
        setAvailability({});
        setLoading(false);
        return;
      }

      // Get date range - next 3 months
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Get inventory data for all room types
      const roomTypeIds = roomTypes.map(rt => rt.id);
      const { data: inventory, error: inventoryError } = await supabase
        .from('room_inventory')
        .select('date, available_count, room_type_id')
        .in('room_type_id', roomTypeIds)
        .gte('date', startDateStr)
        .lte('date', endDateStr);

      if (inventoryError) {
        console.log('Inventory query error:', inventoryError);
      }

      // Get confirmed bookings
      const roomTypeNames = roomTypes.map(rt => rt.name);
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('check_in, check_out, quantity, room_type')
        .in('room_type', roomTypeNames)
        .eq('booking_status', 'confirmed')
        .gte('check_out', startDateStr)
        .lte('check_in', endDateStr);

      if (bookingsError) {
        console.log('Bookings query error:', bookingsError);
      }

      // Build inventory map by date and room type
      const inventoryMap: Record<string, Record<string, number>> = {};
      if (inventory) {
        inventory.forEach(item => {
          if (!item.room_type_id) return;
          if (!inventoryMap[item.date]) {
            inventoryMap[item.date] = {};
          }
          inventoryMap[item.date][item.room_type_id] = item.available_count;
        });
      }

      // Build bookings map by date and room type
      const bookingsMap: Record<string, Record<string, number>> = {};
      if (bookings) {
        bookings.forEach(booking => {
          const checkIn = new Date(booking.check_in);
          const checkOut = new Date(booking.check_out);
          
          for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            if (!bookingsMap[dateStr]) {
              bookingsMap[dateStr] = {};
            }
            const roomType = booking.room_type;
            if (!roomType) continue;
            bookingsMap[dateStr][roomType] = (bookingsMap[dateStr][roomType] || 0) + (booking.quantity || 1);
          }
        });
      }

      // Calculate aggregate availability for each date
      const aggregateAvailability: Record<string, AggregateAvailabilityData> = {};
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        
        let totalAvailable = 0;
        let totalUnits = 0;
        let roomTypesAvailable = 0;
        const roomTypesTotal = roomTypes.length;

        roomTypes.forEach(roomType => {
          const units = roomType.total_units ?? 0;
          totalUnits += units;

          // Get available from inventory or default to total units
          const inventoryAvailable = inventoryMap[dateStr]?.[roomType.id] ?? units;
          
          // Get booked count
          const bookedCount = bookingsMap[dateStr]?.[roomType.name] || 0;
          
          // Calculate final available
          const available = Math.max(0, inventoryAvailable - bookedCount);
          totalAvailable += available;
          
          if (available > 0) {
            roomTypesAvailable++;
          }
        });

        const occupancyRate = totalUnits > 0 ? (totalUnits - totalAvailable) / totalUnits : 0;
        const availabilityRate = totalUnits > 0 ? totalAvailable / totalUnits : 0;

        aggregateAvailability[dateStr] = {
          totalAvailable,
          totalUnits,
          roomTypesAvailable,
          roomTypesTotal,
          isFullySoldOut: totalAvailable === 0,
          isLimited: availabilityRate > 0 && availabilityRate < 0.3,
          isPopular: occupancyRate >= 0.5 && totalAvailable > 0
        };
      }

      setAvailability(aggregateAvailability);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load availability';
      setError(errorMessage);
      console.error('Aggregate availability error:', err);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const refetch = useCallback(async () => {
    lastFetchRef.current = 0; // Reset throttle
    await loadAvailability();
  }, [loadAvailability]);

  useEffect(() => {
    if (enabled) {
      loadAvailability();
    }
  }, [enabled, loadAvailability]);

  // Real-time updates for bookings
  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel('aggregate_availability_bookings')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, () => {
        // Debounce refetch
        setTimeout(() => refetch(), 500);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, refetch]);

  return {
    availability,
    loading,
    error,
    refetch
  };
};

// Helper to get display status for calendar dots
export const getCalendarDots = (
  date: Date,
  availability: Record<string, AggregateAvailabilityData>
): string[] => {
  const dateStr = date.toISOString().split('T')[0];
  const dayData = availability[dateStr];

  if (!dayData) return [];

  const dots: string[] = [];

  if (dayData.isFullySoldOut) {
    // No dots for sold out - or could show red
    return [];
  }

  if (dayData.totalAvailable > 0 && !dayData.isLimited) {
    dots.push('#4ade80'); // Green - Available
  }

  if (dayData.isLimited) {
    dots.push('#60a5fa'); // Blue - Limited
  }

  if (dayData.isPopular) {
    dots.push('#f472b6'); // Pink - Popular
  }

  return dots;
};
