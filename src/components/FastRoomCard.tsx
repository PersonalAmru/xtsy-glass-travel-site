
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Minus, Plus, Bed } from 'lucide-react';
import { useScreenSize } from '@/hooks/use-mobile';

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
    propertyType: string;
  };
  isSelected: boolean;
  selection: { guests: number; rooms: number };
  onRoomSelect: (roomId: string) => void;
  onGuestChange: (roomId: string, guests: number) => void;
  onRoomChange: (roomId: string, rooms: number) => void;
}

const FastRoomCard: React.FC<FastRoomCardProps> = React.memo(({
  room,
  isSelected,
  selection,
  onRoomSelect,
  onGuestChange,
  onRoomChange
}) => {
  const screenSize = useScreenSize();
  const isMobileView = screenSize === 'mobile';
  const isTabletView = screenSize === 'tablet';

  return (
    <Card 
      className={`transition-all duration-300 cursor-pointer hover:shadow-lg ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
          : 'hover:shadow-md'
      } ${isMobileView ? 'mx-2' : ''}`}
      onClick={() => onRoomSelect(room.id)}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={room.image}
          alt={room.name}
          className={`w-full object-cover transition-transform duration-300 hover:scale-105 ${
            isMobileView ? 'h-40' : isTabletView ? 'h-44' : 'h-48'
          }`}
          loading="lazy"
        />
      </div>

      <CardHeader className={`${isMobileView ? 'pb-2 px-3 pt-3' : 'pb-3'}`}>
        <div className={`flex items-start justify-between ${
          isMobileView ? 'flex-col space-y-2' : ''
        }`}>
          <CardTitle className={`font-semibold ${
            isMobileView ? 'text-base' : 'text-lg'
          }`}>
            {room.name}
          </CardTitle>
          <div className={`text-right ${isMobileView ? 'self-end' : ''}`}>
            <div className={`font-bold text-primary ${
              isMobileView ? 'text-lg' : isTabletView ? 'text-xl' : 'text-2xl'
            }`}>
              ₹{room.price?.toLocaleString() || '0'}
            </div>
            <div className={`text-muted-foreground ${
              isMobileView ? 'text-xs' : 'text-sm'
            }`}>
              per night
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={`pt-0 ${isMobileView ? 'px-3 pb-3' : ''}`}>
        <p className={`text-muted-foreground mb-4 line-clamp-2 ${
          isMobileView ? 'text-xs' : 'text-sm'
        }`}>
          {room.description}
        </p>

        <div className={`flex flex-wrap gap-2 mb-4 ${
          isMobileView ? 'gap-1' : ''
        }`}>
          {room.amenities.slice(0, isMobileView ? 2 : 3).map((amenity) => (
            <Badge 
              key={amenity} 
              variant="outline" 
              className={isMobileView ? 'text-xs px-2 py-0.5' : 'text-xs'}
            >
              {amenity}
            </Badge>
          ))}
          {room.amenities.length > (isMobileView ? 2 : 3) && (
            <Badge 
              variant="outline" 
              className={isMobileView ? 'text-xs px-2 py-0.5' : 'text-xs'}
            >
              +{room.amenities.length - (isMobileView ? 2 : 3)} more
            </Badge>
          )}
        </div>

        {isSelected && (
          <div className={`space-y-4 pt-4 border-t ${
            isMobileView ? 'space-y-3 pt-3' : ''
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${
                isMobileView ? 'text-xs' : 'text-sm'
              }`}>
                Guests:
              </span>
              <div className={`flex items-center ${
                isMobileView ? 'space-x-2' : 'space-x-3'
              }`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGuestChange(room.id, Math.max(1, selection.guests - 1));
                  }}
                  disabled={selection.guests <= 1}
                  className={isMobileView ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}
                >
                  <Minus className={isMobileView ? 'h-3 w-3' : 'h-4 w-4'} />
                </Button>
                <span className={`text-center font-medium ${
                  isMobileView ? 'w-6 text-xs' : 'w-8 text-sm'
                }`}>
                  {selection.guests}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGuestChange(room.id, Math.min(room.maxGuests, selection.guests + 1));
                  }}
                  disabled={selection.guests >= room.maxGuests}
                  className={isMobileView ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}
                >
                  <Plus className={isMobileView ? 'h-3 w-3' : 'h-4 w-4'} />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`font-medium ${
                isMobileView ? 'text-xs' : 'text-sm'
              }`}>
                Rooms:
              </span>
              <div className={`flex items-center ${
                isMobileView ? 'space-x-2' : 'space-x-3'
              }`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRoomChange(room.id, Math.max(1, selection.rooms - 1));
                  }}
                  disabled={selection.rooms <= 1}
                  className={isMobileView ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}
                >
                  <Minus className={isMobileView ? 'h-3 w-3' : 'h-4 w-4'} />
                </Button>
                <span className={`text-center font-medium ${
                  isMobileView ? 'w-6 text-xs' : 'w-8 text-sm'
                }`}>
                  {selection.rooms}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRoomChange(room.id, Math.min(5, selection.rooms + 1));
                  }}
                  disabled={selection.rooms >= 5}
                  className={isMobileView ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}
                >
                  <Plus className={isMobileView ? 'h-3 w-3' : 'h-4 w-4'} />
                </Button>
              </div>
            </div>

            <div className={`flex items-center justify-between pt-2 border-t ${
              isMobileView ? 'pt-1.5' : ''
            }`}>
              <span className={`font-medium ${
                isMobileView ? 'text-xs' : 'text-sm'
              }`}>
                Subtotal:
              </span>
              <span className={`font-bold text-primary ${
                isMobileView ? 'text-base' : isTabletView ? 'text-lg' : 'text-xl'
              }`}>
                ₹{((room.price || 0) * selection.guests * selection.rooms).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

FastRoomCard.displayName = 'FastRoomCard';

export default FastRoomCard;
