import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle, XCircle, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RoomAvailabilityControlProps {
  roomTypeId: string;
  roomName: string;
}

export const RoomAvailabilityControl: React.FC<RoomAvailabilityControlProps> = ({
  roomTypeId,
  roomName
}) => {
  const [status, setStatus] = useState<'available' | 'soldout' | 'maintenance'>('available');
  const [adminNote, setAdminNote] = useState('');
  const [overrideUntil, setOverrideUntil] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCurrentStatus();
  }, [roomTypeId]);

  const fetchCurrentStatus = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('room_availability_status')
        .select('*')
        .eq('room_type_id', roomTypeId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching status:', error);
        return;
      }

      if (data) {
        // Validate status value
        const statusValue = data.status as string;
        if (statusValue === 'soldout' || statusValue === 'maintenance') {
          setStatus(statusValue);
        } else {
          setStatus('available');
        }
        setAdminNote(data.admin_note || '');
        setOverrideUntil(data.override_until ? new Date(data.override_until).toISOString().slice(0, 16) : '');
      }
    } catch (error) {
      console.error('Error in fetchCurrentStatus:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    // Store previous state for rollback
    const previousStatus = status;
    const previousAdminNote = adminNote;
    const previousOverrideUntil = overrideUntil;

    try {
      setIsUpdating(true);
      
      // Optimistic update - show immediate feedback
      toast.info(`Updating room status to ${status.toUpperCase()}...`, { duration: 1000 });
      
      const updateData = {
        room_type_id: roomTypeId,
        status,
        admin_note: adminNote || null,
        override_until: overrideUntil ? new Date(overrideUntil).toISOString() : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('room_availability_status')
        .upsert(updateData, {
          onConflict: 'room_type_id'
        });

      if (error) {
        console.error('Error updating status:', error);
        
        // Rollback optimistic update
        setStatus(previousStatus);
        setAdminNote(previousAdminNote);
        setOverrideUntil(previousOverrideUntil);
        
        toast.error('Failed to update room status');
        return;
      }

      toast.success(`Room status updated to ${status.toUpperCase()}`);
    } catch (error) {
      console.error('Error in updateStatus:', error);
      
      // Rollback optimistic update
      setStatus(previousStatus);
      setAdminNote(previousAdminNote);
      setOverrideUntil(previousOverrideUntil);
      
      toast.error('Failed to update room status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (currentStatus: string) => {
    switch (currentStatus) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'soldout':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (currentStatus: string) => {
    switch (currentStatus) {
      case 'available':
        return 'bg-green-500';
      case 'soldout':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getStatusIcon(status)}
          {roomName}
          <Badge className={`ml-auto ${getStatusColor(status)} text-white`}>
            {status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Availability Status</label>
          <Select value={status} onValueChange={(value: any) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Available
                </div>
              </SelectItem>
              <SelectItem value="soldout">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Sold Out
                </div>
              </SelectItem>
              <SelectItem value="maintenance">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Maintenance
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Admin Note (Optional)</label>
          <Textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Add a note for guests (e.g., 'Temporarily unavailable due to maintenance')"
            className="h-20"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Override Until (Optional)</label>
          <input
            type="datetime-local"
            value={overrideUntil}
            onChange={(e) => setOverrideUntil(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
          />
        </div>

        <Button 
          onClick={updateStatus} 
          disabled={isUpdating}
          className="w-full"
        >
          {isUpdating ? 'Updating...' : 'Update Status'}
        </Button>
      </CardContent>
    </Card>
  );
};