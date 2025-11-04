
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Minus, Plus, Bed, AlertTriangle } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';
import { useApp } from '@/contexts/AppContext';
import ImageLightbox from './ImageLightbox';
import MobileImageCarousel from './MobileImageCarousel';
import { generateStandardizedFeatures } from '@/utils/roomFeatures';
import RoomAvailabilityCalendar from './RoomAvailabilityCalendar';
import { useRoomAvailabilityStatus } from '@/hooks/useRoomAvailabilityStatus';

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
    isBlocked?: boolean;
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
  
  // Get admin-controlled availability status
  const { status: adminStatus, isSoldOut: adminSoldOut, isMaintenance, adminNote } = useRoomAvailabilityStatus(room.id);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Get all available images for the room
  const roomImages = room.images && room.images.length > 0 ? room.images : [room.image];

  // Memoize the handleImageClick callback to prevent unnecessary re-renders
  const handleImageClick = React.useCallback((images: string[], currentIndex: number) => {
    setLightboxImages(images);
    setLightboxInitialIndex(currentIndex);
    setLightboxOpen(true);
  }, []);

  // Memoize image components to prevent flickering
  const memoizedImageCarousel = React.useMemo(() => (
    <MobileImageCarousel
      images={roomImages}
      alt={room.name}
      className={`w-full ${isMobile ? 'h-32' : isTablet ? 'h-36' : 'h-40'}`}
      aspectRatio="photo"
      showIndicators={true}
      showArrows={true}
      onImageClick={handleImageClick}
    />
  ), [roomImages, room.name, isMobile, isTablet, handleImageClick]);

  const memoizedXTSYImage = React.useMemo(() => (
    <>
      <img
        src={room.image}
        alt={room.name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
        loading="lazy"
        onClick={(e) => { e.stopPropagation(); handleImageClick(roomImages, 0); }}
      />
      {/* Image count indicator */}
      {roomImages.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
          {roomImages.length} photos
        </div>
      )}
    </>
  ), [room.image, room.name, roomImages, handleImageClick]);

  // Check if this is the XTSY 270 room
  const isXTSY270 = room.name === "XTSY 270 Panorama Glass Ensuite";
  
  // Check if this is a luxury room
  const isLuxury = room.propertyType === "luxury";
  
  // Check if room is blocked/sold out (combine admin status with inventory blocking)
  const isSoldOut = room.isBlocked || adminSoldOut;
  
  // Get availability status for enhanced UI
  const getAvailabilityStatus = () => {
    if (isMaintenance) return { 
      status: 'maintenance', 
      label: 'MAINTENANCE', 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/90',
      icon: AlertTriangle 
    };
    if (isSoldOut) return { 
      status: 'soldout', 
      label: 'SOLD OUT', 
      color: 'text-red-400',
      bgColor: 'bg-red-500/90',
      icon: null 
    };
    if (isSelected) return { 
      status: 'selected', 
      label: 'SELECTED', 
      color: 'text-green-400',
      bgColor: 'bg-green-500/90',
      icon: null 
    };
    return { 
      status: 'available', 
      label: 'AVAILABLE', 
      color: 'text-green-500',
      bgColor: 'bg-green-600/90',
      icon: null 
    };
  };
  
  const availabilityStatus = getAvailabilityStatus();

  // Availability lookup key to align with admin and edge function naming
  const availabilityKey = React.useMemo(() => {
    switch (room.id) {
      case '8-bed-mixed-economy-dorm':
        return '8-Bed Mixed Economy Dormitory';
      case '6-bed-mixed-economy-dorm':
        return '6-Bed Mixed Economy Dormitory';
      case '6-bed-mixed-dorm':
        return '6-Bed Mixed Dormitory';
      case '6-bed-mixed-female-dorm':
        return '6-Bed Female Only Dormitory';
      case '4-bed-mixed-female-dorm':
        return '4-Bed Mixed Dormitory';
      case '4-bed-female-only-dorm':
        return '4-Bed Female Only Dormitory';
      case 'king-double-room':
        return 'King Double Room';
      case 'king-triple-room':
        return 'King Triple Room';
      case 'xtsy-270':
        return '270° Panorama Glass Ensuite';
      default:
        return room.name;
    }
  }, [room.id, room.name]);

  // Name to use for availability/blocked-dates lookups (exact admin naming)
  const availabilityName = React.useMemo(() => {
    switch (room.id) {
      case '8-bed-mixed-economy-dorm':
        // Matches admin dashboard entry and blocked_dates.room_type
        return 'Bed in 8 bed mixed economy dorm';
      default:
        return availabilityKey;
    }
  }, [room.id, availabilityKey]);

  // Calculate subtotal: price × nights × selected rooms/beds
  const calculateSubtotal = () => {
    return (room.price || 0) * nights * selection.rooms;
  };

  // Handle increment with proper event prevention
  const handleIncrement = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔵 Increment clicked:', { roomId: room.id, currentRooms: selection.rooms, maxRooms: room.maxRooms });
    
    const maxSelection = room.maxRooms || 5;
    if (selection.rooms < maxSelection) {
      console.log('🟢 Calling onRoomChange with:', room.id, selection.rooms + 1);
      onRoomChange(room.id, selection.rooms + 1);
    } else {
      console.log('🔴 Max rooms reached');
    }
  }, [room.id, room.maxRooms, selection.rooms, onRoomChange]);

  // Handle decrement with proper event prevention
  const handleDecrement = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔵 Decrement clicked:', { roomId: room.id, currentRooms: selection.rooms });
    
    if (selection.rooms > 0) {
      console.log('🟢 Calling onRoomChange with:', room.id, selection.rooms - 1);
      onRoomChange(room.id, selection.rooms - 1);
    } else {
      console.log('🟡 Already at 0 rooms');
    }
  }, [room.id, selection.rooms, onRoomChange]);

  // Handle card selection - ONLY for non-button areas
  const handleCardClick = React.useCallback((e: React.MouseEvent) => {
    // Prevent card selection if room is sold out or under maintenance
    if (isSoldOut || isMaintenance) {
      return;
    }
    
    // CRITICAL: Don't interfere with button clicks
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.closest('button') || 
      target.closest('[data-toggle-container]')
    ) {
      // Let button handle its own event
      e.stopPropagation();
      return;
    }
    
    onRoomSelect(room.id);
  }, [room.id, onRoomSelect, isSoldOut, isMaintenance]);

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
          className={`relative transition-all duration-300 overflow-hidden ${
            isSoldOut 
              ? 'bg-gray-800 text-gray-400 border-gray-600 cursor-not-allowed opacity-75'
              : `cursor-pointer hover:shadow-lg bg-black text-white border-gray-700 ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-lg bg-gray-900' 
                    : 'hover:shadow-md hover:bg-gray-900'
                }`
          } ${isMobile ? 'mx-2' : ''} ${
            isXTSY270 ? 'h-auto landscape-card' : ''
          }`}
          onClick={isSoldOut || isMaintenance ? undefined : handleCardClick}
        >
          {/* Sold Out / Maintenance Overlay */}
          {(isSoldOut || isMaintenance) && (
            <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
              <div className="text-center px-4">
                <div className={`font-bold text-2xl mb-2 flex items-center justify-center gap-2 ${
                  isMaintenance ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {isMaintenance && <AlertTriangle size={24} />}
                  {isMaintenance ? 'UNDER MAINTENANCE' : 'SOLD OUT'}
                </div>
                <div className="text-gray-300 text-sm">
                  {adminNote || (isMaintenance ? 'Temporarily unavailable' : 'Check availability later')}
                </div>
              </div>
            </div>
          )}
          <div className={`${isXTSY270 ? 'flex' : 'block'}`}>
            {/* Image Section */}
            <div className={`relative overflow-hidden ${
              isXTSY270 
                ? `${isMobile ? 'w-2/5 h-32' : isTablet ? 'w-2/5 h-36' : 'w-2/5 h-40'} rounded-l-lg`
                : 'rounded-t-lg w-full'
            }`}>
              {isXTSY270 ? (
                // For XTSY 270, use memoized image display
                memoizedXTSYImage
              ) : (
                // For other rooms, use memoized carousel
                <div className="w-full">
                  {memoizedImageCarousel}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className={`${isXTSY270 ? 'flex-1 flex flex-col' : ''}`}>
              <CardHeader className={`${
                isMobile ? 'pb-2 px-3 pt-2' : 'pb-2 pt-3'
              } ${isXTSY270 ? 'pb-2 pt-2 px-3' : ''}`}>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className={`font-semibold text-white ${isLuxury ? 'text-center' : 'text-center'} flex-1 ${
                    isMobile ? 'text-sm' : 'text-base'
                  } ${isXTSY270 ? 'text-sm leading-tight' : 'leading-tight'}`}>
                    {room.name}
                  </CardTitle>
                  <div className={`text-right flex-shrink-0 min-w-0`}>
                    {isSoldOut ? (
                      <div className={`font-bold text-red-400 text-right ${
                        isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-xl'
                      } ${isXTSY270 ? 'text-base' : ''} leading-tight`}>
                        SOLD OUT
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className={`pt-0 px-3 pb-3 ${
                isXTSY270 ? 'flex-1 flex flex-col' : ''
              }`}>
                <p className={`text-gray-300 mb-2 ${isLuxury ? 'text-center text-justify' : 'text-center'} ${
                  isMobile ? 'text-xs' : 'text-sm'
                } ${isXTSY270 ? 'text-xs mb-2' : ''} leading-relaxed`}>
                  {isXTSY270 
                    ? "Experience India's most innovative architectural marvel — a 200% luxury ensuite with stunning 270° mountain panoramas"
                    : room.description
                  }
                </p>

                <div className={`flex flex-wrap mb-3 gap-1 justify-center ${
                  isXTSY270 ? 'mb-2' : ''
                }`}>
                  {(() => {
                    // Use standardized feature generation utility
                    const roomType = (room.name.includes("King Double") || room.name.includes("King Triple") || room.name === "XTSY 270 Panorama Glass Ensuite") ? 'private' : 'dorm';
                    const standardizedFeatures = generateStandardizedFeatures(room.propertyType || 'hostel', room.name, roomType);
                    
                    return standardizedFeatures.map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className={`text-xs px-2 py-0.5 border-gray-600 text-gray-200 bg-gray-800 ${
                          isXTSY270 ? 'text-xs px-2 py-0.5 bg-gradient-to-r from-orange-800 to-red-900 text-orange-200 border-orange-600' : ''
                        }`}
                      >
                        {feature}
                      </Badge>
                    ));
                  })()}
                </div>

                {/* Subtotal - Only show when rooms > 0 and not sold out */}
                {!isSoldOut && selection.rooms > 0 && (
                  <div className={`flex items-center justify-between pt-2 border-t border-gray-700 ${
                    isMobile ? 'pt-1.5' : ''
                  } ${isXTSY270 ? 'pt-1.5' : ''}`}>
                    <span className={`font-medium text-white text-center ${
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

                {/* Calendar toggle for selected room */}
                {!isSoldOut && isSelected && (
                  <div className={`mt-3 ${isXTSY270 ? 'mt-2' : ''}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Calendar functionality would go here
                      }}
                      className="w-full text-xs text-white border-gray-600 bg-gray-800 hover:bg-gray-700"
                    >
                      View Availability Calendar
                    </Button>
                  </div>
                )}
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
