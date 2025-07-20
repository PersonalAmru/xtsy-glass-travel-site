
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
  propertyType: "hostel" | "luxury";
  onSelectRoom: () => void;
}

const PropertySection = ({ title, description, rooms, propertyType, onSelectRoom }: PropertySectionProps) => {
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
      const scrollAmount = 320; // Width of one card plus gap
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      // Update buttons after scroll animation
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
        <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-md">
          {description}
        </p>
      </div>

      {/* Scrollable Rooms Container */}
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

        {/* Rooms Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-12 py-4"
          onScroll={updateScrollButtons}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
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
    </div>
  );
};

export default PropertySection;
