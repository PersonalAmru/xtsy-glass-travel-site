
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoomCard from "./RoomCard";

interface Room {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  maxGuests: number;
  maxRooms: number;
  image: string;
}

interface PropertySectionProps {
  title: string;
  description: string;
  rooms: Room[];
  propertyType: "hostel" | "luxury" | "economy";
  onSelectRoom: () => void;
  isLuxury?: boolean;
}

const PropertySection = ({ title, description, rooms, propertyType, onSelectRoom, isLuxury = false }: PropertySectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = isLuxury ? 800 : 320;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      setTimeout(updateScrollButtons, 300);
    }
  };

  return (
    <div className="mb-12">
      {/* Property Header */}
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg mb-4">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2 font-playfair">
            {title}
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </div>
      </div>

      {/* Luxury Room - Full Width Display */}
      {isLuxury && rooms.length > 0 ? (
        <div className="max-w-6xl mx-auto">
          <RoomCard
            room={rooms[0]}
            propertyType={propertyType}
            onSelectRoom={onSelectRoom}
            isLuxury={true}
          />
        </div>
      ) : (
        // Regular Scrollable Rooms Container
        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${
              !canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
            }`}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${
              !canScrollRight ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
            }`}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Rooms Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                propertyType={propertyType}
                onSelectRoom={onSelectRoom}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySection;
