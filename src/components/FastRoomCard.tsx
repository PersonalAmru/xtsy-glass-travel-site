
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

  // Check if this is the XTSY 270 room
  const isXTSY270 = room.name === "XTSY 270 Panorama Glass Ensuite";

  // Special container wrapper for XTSY 270
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isXTSY270) {
      return (
        <div className="flex justify-center w-full col-span-full">
          <div className={`${
            isMobile ? 'w-[115%] max-w-none' : isTablet ? 'w-[115%] max-w-none' : 'w-[115%] max-w-none'
          } -mx-[7.5%]`}>
            {children}
          </div>
        </div>
      );
    }
    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <Card 
        className={`transition-all duration-300 cursor-pointer hover:shadow-lg smooth-transition touch-feedback bg-black text-white border-gray-700 ${
          isSelected 
            ? 'ring-2 ring-primary shadow-lg bg-gray-900' 
            : 'hover:shadow-md hover:bg-gray-900'
        } ${isMobile ? 'mx-2' : ''} ${
          isXTSY270 ? 'h-auto landscape-card' : ''
        }`}
        onClick={() => onRoomSelect(room.id)}
      >
        <div className={`${isXTSY270 ? 'flex' : 'block'}`}>
          {/* Image Section */}
          <div className={`relative overflow-hidden ${
            isXTSY270 
              ? `${isMobile ? 'w-2/5 h-32' : isTablet ? 'w-2/5 h-36' : 'w-2/5 h-40'} rounded-l-lg`
              : 'rounded-t-lg'
          }`}>
            <img
              src={room.image}
              alt={room.name}
              className={`w-full object-cover transition-transform duration-300 hover:scale-105 ${
                isXTSY270 
                  ? 'h-full'
                  : (isMobile ? 'h-32' : isTablet ? 'h-36' : 'h-40')
              }`}
              loading="lazy"
            />
          </div>

          {/* Content Section */}
          <div className={`${isXTSY270 ? 'flex-1 flex flex-col' : ''}`}>
            <CardHeader className={`${
              isMobile ? 'pb-2 px-3 pt-2' : 'pb-2 pt-3'
            } ${isXTSY270 ? 'pb-1 pt-2 px-3' : ''}`}>
              <div className={`flex items-start justify-between ${
                isMobile ? 'flex-col space-y-1' : ''
              }`}>
                <CardTitle className={`font-semibold text-white ${
                  isMobile ? 'text-sm' : 'text-base'
                } ${isXTSY270 ? 'text-base' : ''} leading-tight`}>
                  {room.name}
                </CardTitle>
                <div className={`text-right ${isMobile ? 'self-end mt-1' : 'ml-2 flex-shrink-0'}`}>
                  <div className={`font-bold text-primary ${
                    isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-xl'
                  } ${isXTSY270 ? 'text-lg' : ''} leading-tight`}>
                    ₹{room.price?.toLocaleString() || '0'}
                  </div>
                  <div className={`text-gray-300 ${
                    isMobile ? 'text-xs' : 'text-sm'
                  } ${isXTSY270 ? 'text-xs' : ''} leading-tight`}>
                    per night
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className={`pt-0 px-3 pb-3 ${
              isXTSY270 ? 'flex-1 flex flex-col' : ''
            }`}>
              <p className={`text-gray-300 mb-2 ${
                isMobile ? 'text-xs' : 'text-sm'
              } ${isXTSY270 ? 'text-xs mb-2' : ''} leading-relaxed line-clamp-2`}>
                {room.description}
              </p>

              <div className={`flex flex-wrap mb-3 gap-1 ${
                isXTSY270 ? 'mb-2' : ''
              }`}>
                {room.amenities.slice(0, isMobile ? 2 : 3).map((amenity) => (
                  <Badge 
                    key={amenity} 
                    variant="outline" 
                    className={`text-xs px-2 py-0.5 border-gray-600 text-gray-200 bg-gray-800 ${
                      isXTSY270 ? 'text-xs px-2 py-0.5' : ''
                    }`}
                  >
                    {amenity}
                  </Badge>
                ))}
                {room.amenities.length > (isMobile ? 2 : 3) && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-0.5 border-gray-600 text-gray-200 bg-gray-800 ${
                      isXTSY270 ? 'text-xs px-2 py-0.5' : ''
                    }`}
                  >
                    +{room.amenities.length - (isMobile ? 2 : 3)} more
                  </Badge>
                )}
              </div>

              {isSelected && (
                <div className={`space-y-3 pt-3 border-t border-gray-700 ${
                  isMobile ? 'space-y-2 pt-2' : ''
                } ${isXTSY270 ? 'space-y-2 pt-2 mt-auto' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-medium text-white ${
                      isMobile ? 'text-xs' : 'text-sm'
                    } ${isXTSY270 ? 'text-xs' : ''}`}>
                      Guests:
                    </span>
                    <div className={`flex items-center gap-2`}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onGuestChange(room.id, Math.max(1, selection.guests - 1));
                        }}
                        disabled={selection.guests <= 1}
                        className={`touch-target border-gray-600 bg-gray-800 text-white hover:bg-gray-700 ${
                          isMobile ? 'h-6 w-6 p-0' : 'h-7 w-7 p-0'
                        } ${isXTSY270 ? 'h-6 w-6 p-0' : ''}`}
                      >
                        <Minus className={`${
                          isMobile ? 'h-3 w-3' : 'h-3 w-3'
                        } ${isXTSY270 ? 'h-3 w-3' : ''}`} />
                      </Button>
                      <span className={`text-center font-medium text-white ${
                        isMobile ? 'w-5 text-xs' : 'w-6 text-sm'
                      } ${isXTSY270 ? 'w-5 text-xs' : ''}`}>
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
                        className={`touch-target border-gray-600 bg-gray-800 text-white hover:bg-gray-700 ${
                          isMobile ? 'h-6 w-6 p-0' : 'h-7 w-7 p-0'
                        } ${isXTSY270 ? 'h-6 w-6 p-0' : ''}`}
                      >
                        <Plus className={`${
                          isMobile ? 'h-3 w-3' : 'h-3 w-3'
                        } ${isXTSY270 ? 'h-3 w-3' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`font-medium text-white ${
                      isMobile ? 'text-xs' : 'text-sm'
                    } ${isXTSY270 ? 'text-xs' : ''}`}>
                      Rooms:
                    </span>
                    <div className={`flex items-center gap-2`}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRoomChange(room.id, Math.max(1, selection.rooms - 1));
                        }}
                        disabled={selection.rooms <= 1}
                        className={`touch-target border-gray-600 bg-gray-800 text-white hover:bg-gray-700 ${
                          isMobile ? 'h-6 w-6 p-0' : 'h-7 w-7 p-0'
                        } ${isXTSY270 ? 'h-6 w-6 p-0' : ''}`}
                      >
                        <Minus className={`${
                          isMobile ? 'h-3 w-3' : 'h-3 w-3'
                        } ${isXTSY270 ? 'h-3 w-3' : ''}`} />
                      </Button>
                      <span className={`text-center font-medium text-white ${
                        isMobile ? 'w-5 text-xs' : 'w-6 text-sm'
                      } ${isXTSY270 ? 'w-5 text-xs' : ''}`}>
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
                        className={`touch-target border-gray-600 bg-gray-800 text-white hover:bg-gray-700 ${
                          isMobile ? 'h-6 w-6 p-0' : 'h-7 w-7 p-0'
                        } ${isXTSY270 ? 'h-6 w-6 p-0' : ''}`}
                      >
                        <Plus className={`${
                          isMobile ? 'h-3 w-3' : 'h-3 w-3'
                        } ${isXTSY270 ? 'h-3 w-3' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between pt-2 border-t border-gray-700 ${
                    isMobile ? 'pt-1.5' : ''
                  } ${isXTSY270 ? 'pt-1.5' : ''}`}>
                    <span className={`font-medium text-white ${
                      isMobile ? 'text-xs' : 'text-sm'
                    } ${isXTSY270 ? 'text-xs' : ''}`}>
                      Subtotal:
                    </span>
                    <span className={`font-bold text-primary ${
                      isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
                    } ${isXTSY270 ? 'text-sm' : ''}`}>
                      ₹{((room.price || 0) * selection.guests * selection.rooms).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    </CardWrapper>
  );
});

FastRoomCard.displayName = 'FastRoomCard';

export default FastRoomCard;
