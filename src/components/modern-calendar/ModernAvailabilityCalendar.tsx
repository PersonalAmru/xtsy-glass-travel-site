import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Lock, Unlock, Calendar as CalendarIcon, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RoomType {
  id: string;
  name: string;
  total_units: number;
  is_active: boolean;
}

interface RoomInventory {
  room_type_id: string;
  date: string;
  available_count: number;
}

interface AvailabilityData {
  [roomTypeId: string]: {
    [date: string]: number;
  };
}

export default function ModernAvailabilityCalendar() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<string>('');
  const [availability, setAvailability] = useState<AvailabilityData>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load room types
      const { data: roomTypesData, error: roomTypesError } = await supabase
        .from('room_types')
        .select('*')
        .eq('is_active', true);

      if (roomTypesError) throw roomTypesError;

      setRoomTypes(roomTypesData || []);
      
      if (roomTypesData && roomTypesData.length > 0) {
        setSelectedRoomType(roomTypesData[0].id);
        await loadAvailabilityData(roomTypesData);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load room availability data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailabilityData = async (roomTypesData: RoomType[]) => {
    try {
      const startDate = format(startOfMonth(addDays(new Date(), -30)), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(addDays(new Date(), 365)), 'yyyy-MM-dd');

      const { data: inventoryData, error } = await supabase
        .from('room_inventory')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;

      const availabilityMap: AvailabilityData = {};
      
      // Initialize with default values
      roomTypesData.forEach(roomType => {
        availabilityMap[roomType.id] = {};
        const dateRange = eachDayOfInterval({
          start: new Date(startDate),
          end: new Date(endDate)
        });
        
        dateRange.forEach(date => {
          availabilityMap[roomType.id][format(date, 'yyyy-MM-dd')] = roomType.total_units;
        });
      });

      // Override with actual inventory data
      inventoryData?.forEach((inventory: RoomInventory) => {
        if (!availabilityMap[inventory.room_type_id]) {
          availabilityMap[inventory.room_type_id] = {};
        }
        availabilityMap[inventory.room_type_id][inventory.date] = inventory.available_count;
      });

      setAvailability(availabilityMap);
    } catch (error) {
      console.error('Error loading availability data:', error);
    }
  };

  const toggleDateAvailability = async (date: Date, roomTypeId: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    if (!roomType) return;

    const currentAvailability = availability[roomTypeId]?.[dateStr] ?? roomType.total_units;
    const newAvailability = currentAvailability === 0 ? roomType.total_units : 0;

    try {
      const { error } = await supabase
        .from('room_inventory')
        .upsert({
          room_type_id: roomTypeId,
          date: dateStr,
          available_count: newAvailability,
        });

      if (error) throw error;

      setAvailability(prev => ({
        ...prev,
        [roomTypeId]: {
          ...prev[roomTypeId],
          [dateStr]: newAvailability
        }
      }));

      toast({
        title: "Updated",
        description: `${format(date, 'MMM d, yyyy')} ${newAvailability === 0 ? 'blocked' : 'unblocked'}`,
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
    }
  };

  const bulkToggleAvailability = async (dates: Date[], block: boolean) => {
    if (dates.length === 0 || !selectedRoomType) return;

    const roomType = roomTypes.find(rt => rt.id === selectedRoomType);
    if (!roomType) return;

    const newAvailability = block ? 0 : roomType.total_units;

    try {
      const updates = dates.map(date => ({
        room_type_id: selectedRoomType,
        date: format(date, 'yyyy-MM-dd'),
        available_count: newAvailability,
      }));

      const { error } = await supabase
        .from('room_inventory')
        .upsert(updates);

      if (error) throw error;

      // Update local state
      setAvailability(prev => {
        const newState = { ...prev };
        dates.forEach(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          if (!newState[selectedRoomType]) newState[selectedRoomType] = {};
          newState[selectedRoomType][dateStr] = newAvailability;
        });
        return newState;
      });

      setSelectedDates([]);
      toast({
        title: "Updated",
        description: `${dates.length} dates ${block ? 'blocked' : 'unblocked'}`,
      });
    } catch (error) {
      console.error('Error bulk updating:', error);
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
    }
  };

  const getAvailabilityColor = (date: Date, roomTypeId: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    if (!roomType) return 'bg-muted';
    
    const available = availability[roomTypeId]?.[dateStr] ?? roomType.total_units;
    const percentage = available / roomType.total_units;
    
    if (percentage === 0) return 'bg-destructive text-destructive-foreground';
    if (percentage < 0.3) return 'bg-orange-500 text-white';
    if (percentage < 0.7) return 'bg-yellow-500 text-black';
    return 'bg-green-500 text-white';
  };

  const getAvailabilityText = (date: Date, roomTypeId: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const roomType = roomTypes.find(rt => rt.id === roomTypeId);
    if (!roomType) return '';
    
    const available = availability[roomTypeId]?.[dateStr] ?? roomType.total_units;
    return `${available}/${roomType.total_units}`;
  };

  const DayContent = ({ date, roomTypeId }: { date: Date; roomTypeId: string }) => {
    const isSelected = selectedDates.some(d => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`
                relative w-full h-full min-h-[2.5rem] p-1 cursor-pointer border-2 rounded-md
                transition-all duration-200 hover:scale-105
                ${getAvailabilityColor(date, roomTypeId)}
                ${isSelected ? 'ring-2 ring-primary' : 'border-transparent'}
              `}
              onClick={(e) => {
                e.preventDefault();
                if (e.ctrlKey || e.metaKey) {
                  setSelectedDates(prev => 
                    isSelected 
                      ? prev.filter(d => format(d, 'yyyy-MM-dd') !== format(date, 'yyyy-MM-dd'))
                      : [...prev, date]
                  );
                } else {
                  toggleDateAvailability(date, roomTypeId);
                }
              }}
            >
              <div className="text-sm font-medium">{date.getDate()}</div>
              <div className="text-xs opacity-80">{getAvailabilityText(date, roomTypeId)}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{format(date, 'MMM d, yyyy')}</p>
            <p>Available: {getAvailabilityText(date, roomTypeId)}</p>
            <p className="text-xs opacity-80">Click to toggle, Ctrl+Click to select</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading room availability...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Room Availability Calendar</h2>
        </div>
        
        {selectedDates.length > 0 && (
          <div className="flex gap-2">
            <Badge variant="secondary">{selectedDates.length} dates selected</Badge>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => bulkToggleAvailability(selectedDates, true)}
            >
              <Lock className="h-4 w-4 mr-1" />
              Block Selected
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => bulkToggleAvailability(selectedDates, false)}
            >
              <Unlock className="h-4 w-4 mr-1" />
              Unblock Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedDates([])}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      <Tabs value={selectedRoomType} onValueChange={setSelectedRoomType}>
        <TabsList className="grid w-full grid-cols-3">
          {roomTypes.map((roomType) => (
            <TabsTrigger key={roomType.id} value={roomType.id} className="text-xs">
              <div className="flex flex-col items-center">
                <Users className="h-4 w-4 mb-1" />
                <span className="font-medium">{roomType.name}</span>
                <span className="text-xs opacity-70">{roomType.total_units} beds</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {roomTypes.map((roomType) => (
          <TabsContent key={roomType.id} value={roomType.id} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {roomType.name}
                  <Badge variant="secondary">{roomType.total_units} Total Beds</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center font-medium text-sm text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="w-full"
                  components={{
                    Day: ({ day }) => <DayContent date={day.date} roomTypeId={roomType.id} />
                  }}
                />

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm">Available (70%+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm">Limited (30-70%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-sm">Few Left (&lt;30%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-destructive rounded"></div>
                    <span className="text-sm">Fully Booked</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}