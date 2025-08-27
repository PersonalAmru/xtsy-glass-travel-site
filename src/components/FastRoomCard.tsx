
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Minus, Plus, Bed } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';
import { useApp } from '@/contexts/AppContext';
import ImageLightbox from './ImageLightbox';
import MobileImageCarousel from './MobileImageCarousel';

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
    maxRooms?: number;
    images?: string[];
  };
  isSelected: boolean;
  selection: { guests: number; rooms: number };
  onRoomSelect: (roomId: string) => void;
  onGuestChange: (roomId: string, guests: number) => void;
  onRoomChange: (roomId: string, rooms: number) => void;
  nights: number;
}

const FastRoomCard: React.FC<FastRoomCardProps> = React.memo(({
  room,
  isSelected,
  selection,
  onRoomSelect,
  onGuestChange,
  onRoomChange,
  nights
}) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const { formatPrice } = useApp();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);

  // Get all available images for the room
  const roomImages = room.images && room.images.length > 0 ? room.images : [room.image];

  const handleImageClick = (images: string[], currentIndex: number) => {
    setLightboxImages(images);
    setLightboxInitialIndex(currentIndex);
    setLightboxOpen(true);
  };

  // Check if this is the XTSY 270 room
  const isXTSY270 = room.name === "XTSY 270 Panorama Glass Ensuite";

  // Calculate subtotal: price × nights × selected rooms/beds
  const calculateSubtotal = () => {
    return (room.price || 0) * nights * selection.rooms;
  };

  // Handle increment with proper event prevention
  const handleIncrement = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const maxSelection = room.maxRooms || 5;
    if (selection.rooms < maxSelection) {
      onRoomChange(room.id, selection.rooms + 1);
    }
  }, [room.id, room.maxRooms, selection.rooms, onRoomChange]);

  // Handle decrement with proper event prevention
  const handleDecrement = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (selection.rooms > 0) {
      onRoomChange(room.id, selection.rooms - 1);
    }
  }, [room.id, selection.rooms, onRoomChange]);

  // Handle card selection with proper event checking
  const handleCardClick = React.useCallback((e: React.MouseEvent) => {
    // Prevent card selection if clicking on buttons or their containers
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-toggle-container]')) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onRoomSelect(room.id);
  }, [room.id, onRoomSelect]);

  // Calculate button sizing and styling
  const getButtonStyles = () => ({
    base: `border-gray-600 bg-gray-800 text-white hover:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200`,
    disabled: `disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800`,
    mobile: isMobile ? 'h-8 w-8 p-0' : isTablet ? 'h-9 w-9 p-0' : 'h-10 w-10 p-0',
    xtsy270: isXTSY270 ? 'h-8 w-8 p-0' : ''
  });

  const buttonStyles = getButtonStyles();
  const buttonClasses = `${buttonStyles.base} ${buttonStyles.disabled} ${buttonStyles.mobile} ${buttonStyles.xtsy270}`;

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
    <>
      <CardWrapper>
        <Card 
          className={`transition-all duration-300 cursor-pointer hover:shadow-lg bg-black text-white border-gray-700 overflow-hidden ${
            isSelected 
              ? 'ring-2 ring-primary shadow-lg bg-gray-900' 
              : 'hover:shadow-md hover:bg-gray-900'
          } ${isMobile ? 'mx-2' : ''} ${
            isXTSY270 ? 'h-auto landscape-card' : ''
          }`}
          onClick={handleCardClick}
        >
          <div className={`${isXTSY270 ? 'flex' : 'block'}`}>
            {/* Image Section */}
            <div className={`relative overflow-hidden ${
              isXTSY270 
                ? `${isMobile ? 'w-2/5 h-32' : isTablet ? 'w-2/5 h-36' : 'w-2/5 h-40'} rounded-l-lg`
                : 'rounded-t-lg w-full'
            }`}>
              {isXTSY270 ? (
                // For XTSY 270, keep the simple image display
                <>
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                    loading="lazy"
                    onClick={() => handleImageClick(roomImages, 0)}
                  />
                  {/* Image count indicator */}
                  {roomImages.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                      {roomImages.length} photos
                    </div>
                  )}
                </>
              ) : (
                // For other rooms, use the mobile carousel with full width
                <div className="w-full">
                  <MobileImageCarousel
                    images={roomImages}
                    alt={room.name}
                    className={`w-full ${isMobile ? 'h-32' : isTablet ? 'h-36' : 'h-40'}`}
                    aspectRatio="photo"
                    showIndicators={true}
                    showArrows={true}
                    onImageClick={handleImageClick}
                  />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className={`${isXTSY270 ? 'flex-1 flex flex-col' : ''}`}>
              <CardHeader className={`${
                isMobile ? 'pb-2 px-3 pt-2' : 'pb-2 pt-3'
              } ${isXTSY270 ? 'pb-2 pt-2 px-3' : ''}`}>
                <div className="flex items-start justify-between">
                  <CardTitle className={`font-semibold text-white text-left ${
                    isMobile ? 'text-sm' : 'text-base'
                  } ${isXTSY270 ? 'text-sm leading-tight' : 'leading-tight'}`}>
                    {room.name}
                  </CardTitle>
                  <div className={`text-right ml-2 flex-shrink-0`}>
                    <div className={`font-bold text-primary text-right ${
                      isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-xl'
                    } ${isXTSY270 ? 'text-base' : ''} leading-tight`}>
                      {formatPrice(room.price || 0)}
                    </div>
                    <div className={`text-gray-300 text-right ${
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
                <p className={`text-gray-300 mb-2 text-left ${
                  isMobile ? 'text-xs' : 'text-sm'
                } ${isXTSY270 ? 'text-xs mb-2' : ''} leading-relaxed`}>
                  {isXTSY270 
                    ? "Experience India's most innovative architectural marvel — a 200% luxury ensuite with stunning 270° mountain panoramas"
                    : room.description
                  }
                </p>

                <div className={`flex flex-wrap mb-3 gap-1 ${
                  isXTSY270 ? 'mb-2' : ''
                }`}>
                  {(() => {
                    let displayAmenities = room.amenities;
                    
                    // Replace "Common area" with "Free Breakfast" for dormitory rooms in XTSY Travellers Hostel
                    if (room.propertyType === "hostel" && room.name.toLowerCase().includes("dormitory")) {
                      displayAmenities = room.amenities.map(amenity => 
                        amenity === "Common area" ? "Free Breakfast" : amenity
                      );
                    }
                    
                    return displayAmenities.map((amenity) => (
                      <Badge 
                        key={amenity} 
                        variant="outline" 
                        className={`text-xs px-2 py-0.5 border-gray-600 text-gray-200 bg-gray-800 ${
                          isXTSY270 ? 'text-xs px-2 py-0.5' : ''
                        }`}
                      >
                        {amenity}
                      </Badge>
                    ));
                  })()}
                </div>

                {/* Room selection only */}
                <div className={`space-y-2 pt-2 border-t border-gray-700 ${
                  isMobile ? 'space-y-2 pt-2' : ''
                } ${isXTSY270 ? 'space-y-2 pt-2 mt-auto' : ''}`}>
                {/* Bed/Room Selection */}
                  <div className="flex items-center justify-between" data-toggle-container onClick={(e) => e.stopPropagation()}>
                    <span className={`font-medium text-white text-left ${
                      isMobile ? 'text-xs' : 'text-sm'
                    } ${isXTSY270 ? 'text-xs' : ''}`}>
                      {room.type === 'dorm' ? 'Beds:' : 'Rooms:'}
                    </span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDecrement}
                        disabled={selection.rooms <= 0}
                        className={buttonClasses}
                        aria-label={`Decrease ${room.type === 'dorm' ? 'beds' : 'rooms'}`}
                        type="button"
                      >
                        <Minus className={`${
                          isMobile ? 'h-4 w-4' : 'h-4 w-4'
                        } ${isXTSY270 ? 'h-4 w-4' : ''}`} />
                      </Button>
                      <span className={`text-center font-medium text-white min-w-[2rem] flex items-center justify-center ${
                        isMobile ? 'text-sm' : 'text-base'
                      } ${isXTSY270 ? 'text-sm' : ''}`}>
                        {selection.rooms}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleIncrement}
                        disabled={selection.rooms >= (room.maxRooms || 5)}
                        className={buttonClasses}
                        aria-label={`Increase ${room.type === 'dorm' ? 'beds' : 'rooms'}`}
                        type="button"
                      >
                        <Plus className={`${
                          isMobile ? 'h-4 w-4' : 'h-4 w-4'
                        } ${isXTSY270 ? 'h-4 w-4' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal - Only show when rooms > 0 */}
                  {selection.rooms > 0 && (
                    <div className={`flex items-center justify-between pt-2 border-t border-gray-700 ${
                      isMobile ? 'pt-1.5' : ''
                    } ${isXTSY270 ? 'pt-1.5' : ''}`}>
                      <span className={`font-medium text-white text-left ${
                        isMobile ? 'text-xs' : 'text-sm'
                      } ${isXTSY270 ? 'text-xs' : ''}`}>
                        Subtotal:
                      </span>
                      <span className={`font-bold text-primary text-right ${
                        isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
                      } ${isXTSY270 ? 'text-sm' : ''}`}>
                        {formatPrice(calculateSubtotal())}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </CardWrapper>

      <ImageLightbox
        isOpen={lightboxOpen}
        images={lightboxImages}
        initialIndex={lightboxInitialIndex}
        onClose={() => setLightboxOpen(false)}
        alt={room.name}
      />
    </>
  );
});

FastRoomCard.displayName = 'FastRoomCard';

export default FastRoomCard;
