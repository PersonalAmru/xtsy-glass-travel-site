import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Minus, Plus, Bed } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';

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
  // Use the new responsive hooks
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)');

  return (
    <Card 
      className={`transition-all duration-300 cursor-pointer hover:shadow-lg smooth-transition touch-feedback bg-black text-white border-gray-700 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg bg-gray-900' 
          : 'hover:shadow-md hover:bg-gray-900'
      } ${isMobile ? 'mx-2' : ''}`}
      onClick={() => onRoomSelect(room.id)}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={room.image}
          alt={room.name}
          className={`w-full object-cover transition-transform duration-300 hover:scale-105 ${
            isMobile ? 'h-40' : isTablet ? 'h-44' : 'h-48'
          }`}
          loading="lazy"
        />
      </div>

      <CardHeader className={`spacing-responsive ${isMobile ? 'pb-2 px-3 pt-3' : 'pb-3'}`}>
        <div className={`flex items-start justify-between ${
          isMobile ? 'flex-col space-y-2' : ''
        }`}>
          <CardTitle className={`font-semibold text-white ${
            isMobile ? 'text-responsive-sm' : 'text-responsive-base'
          }`}>
            {room.name}
          </CardTitle>
          <div className={`text-right ${isMobile ? 'self-end' : ''}`}>
            <div className={`font-bold text-primary ${
              isMobile ? 'text-responsive-base' : isTablet ? 'text-responsive-lg' : 'text-responsive-xl'
            }`}>
              ₹{room.price?.toLocaleString() || '0'}
            </div>
            <div className={`text-gray-300 ${
              isMobile ? 'text-responsive-xs' : 'text-responsive-sm'
            }`}>
              per night
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={`pt-0 spacing-responsive`}>
        <p className={`text-gray-300 mb-4 ${
          isMobile ? 'text-responsive-xs' : 'text-responsive-sm'
        }`}>
          {room.description}
        </p>

        <div className={`flex flex-wrap mb-4 gap-responsive`}>
          {room.amenities.slice(0, isMobile ? 2 : 3).map((amenity) => (
            <Badge 
              key={amenity} 
              variant="outline" 
              className={`${isMobile ? 'text-xs px-2 py-0.5' : 'text-xs'} border-gray-600 text-gray-200 bg-gray-800`}
            >
              {amenity}
            </Badge>
          ))}
          {room.amenities.length > (isMobile ? 2 : 3) && (
            <Badge 
              variant="outline" 
              className={`${isMobile ? 'text-xs px-2 py-0.5' : 'text-xs'} border-gray-600 text-gray-200 bg-gray-800`}
            >
              +{room.amenities.length - (isMobile ? 2 : 3)} more
            </Badge>
          )}
        </div>

        {isSelected && (
          <div className={`space-y-4 pt-4 border-t border-gray-700 gap-responsive ${
            isMobile ? 'space-y-3 pt-3' : ''
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium text-white ${
                isMobile ? 'text-responsive-xs' : 'text-responsive-sm'
              }`}>
                Guests:
              </span>
              <div className={`flex items-center gap-responsive`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGuestChange(room.id, Math.max(1, selection.guests - 1));
                  }}
                  disabled={selection.guests <= 1}
                  className={`touch-target border-gray-600 bg-gray-800 text-white hover:bg-gray-700 ${isMobile ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}`}
                >
                  <Minus className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                </Button>
                <span className={`text-center font-medium text-white ${
                  isMobile ? 'w-6 text-xs' : 'w-8 text-sm'
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
                  className={`touch-target border-gray-600 bg-gray-800 text-white hover:bg-gray-700 ${isMobile ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}`}
                >
                  <Plus className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`font-medium text-white ${
                isMobile ? 'text-responsive-xs' : 'text-responsive-sm'
              }`}>
                Rooms:
              </span>
              <div className={`flex items-center gap-responsive`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRoomChange(room.id, Math.max(1, selection.rooms - 1));
                  }}
                  disabled={selection.rooms <= 1}
                  className={`touch-target border-gray-600 bg-gray-800 text-white hover:bg-gray-700 ${isMobile ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}`}
                >
                  <Minus className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                </Button>
                <span className={`text-center font-medium text-white ${
                  isMobile ? 'w-6 text-xs' : 'w-8 text-sm'
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
                  className={`touch-target border-gray-600 bg-gray-800 text-white hover:bg-gray-700 ${isMobile ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}`}
                >
                  <Plus className={isMobile ? 'h-3 w-3' : 'h-4 w-4'} />
                </Button>
              </div>
            </div>

            <div className={`flex items-center justify-between pt-2 border-t border-gray-700 ${
              isMobile ? 'pt-1.5' : ''
            }`}>
              <span className={`font-medium text-white ${
                isMobile ? 'text-responsive-xs' : 'text-responsive-sm'
              }`}>
                Subtotal:
              </span>
              <span className={`font-bold text-primary ${
                isMobile ? 'text-responsive-base' : isTablet ? 'text-responsive-lg' : 'text-responsive-xl'
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
