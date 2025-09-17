import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RoomAvailability {
  date: string;
  available_count: number;
  is_sold_out: boolean;
}

export interface RoomType {
  id: string;
  name: string;
  category: string;
  kind: string;
  capacity: number;
  total_units: number;
  base_price: number;
  is_active: boolean;
}

export const useRoomAvailability = (roomTypeId?: string, fromDate?: string, toDate?: string) => {
  const [availability, setAvailability] = useState<RoomAvailability[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch room types
  const fetchRoomTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .eq('is_active', true)
        .order('base_price');

      if (error) throw error;
      setRoomTypes(data || []);
    } catch (err) {
      console.error('Error fetching room types:', err);
      setError('Failed to load room types');
    }
  };

  // Fetch availability data
  const fetchAvailability = async () => {
    if (!roomTypeId || !fromDate || !toDate) return;

    try {
      setLoading(true);
      
      // Get inventory data for the specified room type and date range
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('room_inventory')
        .select('date, available_count')
        .eq('room_type_id', roomTypeId)
        .gte('date', fromDate)
        .lte('date', toDate)
        .order('date');

      if (inventoryError) throw inventoryError;

      // Get room type details for total units
      const roomType = roomTypes.find(rt => rt.id === roomTypeId);
      const totalUnits = roomType?.total_units || 0;

      // Create availability map with sold out status
      const availabilityMap: RoomAvailability[] = [];
      
      // Generate all dates in range
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const inventoryRecord = inventoryData?.find(inv => inv.date === dateStr);
        const availableCount = inventoryRecord?.available_count ?? totalUnits;
        
        availabilityMap.push({
          date: dateStr,
          available_count: availableCount,
          is_sold_out: availableCount <= 0
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setAvailability(availabilityMap);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load availability data');
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time inventory changes
  useEffect(() => {
    if (!roomTypeId) return;

    const channel = supabase
      .channel('room-inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_inventory',
          filter: `room_type_id=eq.${roomTypeId}`
        },
        (payload) => {
          console.log('Real-time inventory update:', payload);
          
          // Update availability data when inventory changes
          if (payload.new && typeof payload.new === 'object') {
            const updatedRecord = payload.new as any;
            setAvailability(prev => 
              prev.map(item => 
                item.date === updatedRecord.date
                  ? {
                      ...item,
                      available_count: updatedRecord.available_count,
                      is_sold_out: updatedRecord.available_count <= 0
                    }
                  : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomTypeId]);

  // Initial data fetch
  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (roomTypes.length > 0) {
      fetchAvailability();
    }
  }, [roomTypeId, fromDate, toDate, roomTypes.length]);

  // Helper functions
  const isSoldOut = (date: string): boolean => {
    const availabilityRecord = availability.find(item => item.date === date);
    return availabilityRecord?.is_sold_out || false;
  };

  const getAvailableCount = (date: string): number => {
    const availabilityRecord = availability.find(item => item.date === date);
    return availabilityRecord?.available_count || 0;
  };

  const isRoomAvailable = (checkIn: string, checkOut: string, quantity: number = 1): boolean => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const currentDate = new Date(startDate);

    // Check each night in the booking period
    while (currentDate < endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const availableCount = getAvailableCount(dateStr);
      
      if (availableCount < quantity) {
        return false;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return true;
  };

  return {
    availability,
    roomTypes,
    loading,
    error,
    isSoldOut,
    getAvailableCount,
    isRoomAvailable,
    refetch: fetchAvailability
  };
};