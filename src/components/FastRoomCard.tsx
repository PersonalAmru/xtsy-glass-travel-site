
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UnifiedImage from './UnifiedImage';
import { cn } from '@/lib/utils';

interface FastRoomCardProps {
  room: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    amenities: string[];
    type: 'dorm' | 'private';
    maxGuests: number;
  };
  isSelected: boolean;
  selection: { guests: number; rooms: number };
  onSelect: (roomId: string) => void;
  onGuestChange: (roomId: string, guests: number) => void;
  onRoomChange: (roomId: string, rooms: number) => void;
}

const FastRoomCard = memo<FastRoomCardProps>(({
  room,
  isSelected,
  selection,
  onSelect,
  onGuestChange,
  onRoomChange
}) => {
  // Ultra-fast button handlers
  const handleSelectClick = () => {
    onSelect(room.id);
  };

  const handleGuestIncrease = () => {
    if (selection.guests < room.maxGuests) {
      onGuestChange(room.id, selection.guests + 1);
    }
  };

  const handleGuestDecrease = () => {
    if (selection.guests > 1) {
      onGuestChange(room.id, selection.guests - 1);
    }
  };

  const handleRoomIncrease = () => {
    if (selection.rooms < 5) {
      onRoomChange(room.id, selection.rooms + 1);
    }
  };

  const handleRoomDecrease = () => {
    if (selection.rooms > 1) {
      onRoomChange(room.id, selection.rooms - 1);
    }
  };

  return (
    <Card className={cn("transition-all duration-150", isSelected && "ring-2 ring-orange-500")}>
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <UnifiedImage
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
            priority={true}
          />
          <Badge className="absolute top-2 right-2 bg-white/90 text-gray-900">
            ₹{room.price}/night
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">{room.name}</CardTitle>
        <p className="text-sm text-gray-600 mb-3">{room.description}</p>
        
        <div className="space-y-3">
          <Button
            onClick={handleSelectClick}
            className={cn(
              "w-full transition-colors duration-150",
              isSelected 
                ? "bg-orange-600 hover:bg-orange-700" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            )}
          >
            {isSelected ? 'Selected' : 'Select Room'}
          </Button>
          
          {isSelected && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Guests:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleGuestDecrease}
                    disabled={selection.guests <= 1}
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{selection.guests}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleGuestIncrease}
                    disabled={selection.guests >= room.maxGuests}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              {room.type === 'private' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rooms:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRoomDecrease}
                      disabled={selection.rooms <= 1}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{selection.rooms}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRoomIncrease}
                      disabled={selection.rooms >= 5}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

FastRoomCard.displayName = 'FastRoomCard';

export default FastRoomCard;
