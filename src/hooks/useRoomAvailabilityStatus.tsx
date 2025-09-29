import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RoomAvailabilityStatus {
  roomTypeId: string;
  status: 'available' | 'soldout' | 'maintenance';
  adminNote?: string;
  overrideUntil?: string;
}

export const useRoomAvailabilityStatus = (roomTypeId: string) => {
  const [status, setStatus] = useState<'available' | 'soldout' | 'maintenance'>('available');
  const [loading, setLoading] = useState(true);
  const [adminNote, setAdminNote] = useState<string>('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        
        // Call the database function to get current status
        const { data, error } = await supabase.rpc('get_room_availability_status', {
          p_room_type_id: roomTypeId
        });

        if (error) {
          console.error('Error fetching room availability status:', error);
          setStatus('available'); // Default fallback
          return;
        }

        // Validate and set status
        const statusValue = data as string;
        if (statusValue === 'soldout' || statusValue === 'maintenance') {
          setStatus(statusValue);
        } else {
          setStatus('available');
        }

        // Also fetch admin note if available
        const { data: statusData } = await supabase
          .from('room_availability_status')
          .select('admin_note')
          .eq('room_type_id', roomTypeId)
          .single();

        if (statusData?.admin_note) {
          setAdminNote(statusData.admin_note);
        }
      } catch (error) {
        console.error('Error in useRoomAvailabilityStatus:', error);
        setStatus('available');
      } finally {
        setLoading(false);
      }
    };

    if (roomTypeId) {
      fetchStatus();
    }
  }, [roomTypeId]);

  // Set up real-time subscription for status changes
  useEffect(() => {
    if (!roomTypeId) return;

    const channel = supabase
      .channel(`room-status-${roomTypeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_availability_status',
          filter: `room_type_id=eq.${roomTypeId}`
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setStatus('available');
            setAdminNote('');
          } else if (payload.new) {
            const newData = payload.new as any;
            
            // Check if override has expired
            if (newData.override_until && new Date(newData.override_until) < new Date()) {
              setStatus('available');
            } else {
              // Validate status value
              const statusValue = newData.status as string;
              if (statusValue === 'soldout' || statusValue === 'maintenance') {
                setStatus(statusValue);
              } else {
                setStatus('available');
              }
            }
            
            setAdminNote(newData.admin_note || '');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomTypeId]);

  return {
    status,
    loading,
    adminNote,
    isAvailable: status === 'available',
    isSoldOut: status === 'soldout',
    isMaintenance: status === 'maintenance'
  };
};