
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
    <div className="w-full mb-12">
      {/* Property Header - Center Aligned with Glassmorphism */}
      <div className="section-header">
        <div className="glass-card inline-block px-8 py-6 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl max-w-4xl">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-playfair text-center">
            {title}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 text-center leading-relaxed max-w-2xl mx-auto mb-3">
            {description}
          </p>
          <div className="w-20 sm:w-28 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-4 rounded-full" />
        </div>
      </div>

      {/* Luxury Room - Center Aligned Display */}
      {isLuxury && rooms.length > 0 ? (
        <div className="w-full flex justify-center">
          <div className="max-w-4xl w-full">
            <RoomCard
              room={rooms[0]}
              propertyType={propertyType}
              onSelectRoom={onSelectRoom}
              isLuxury={true}
            />
          </div>
        </div>
      ) : (
        // Fixed 3-Column Center Aligned Layout
        <div className="w-full flex justify-center">
          {/* Center-aligned 3-tile grid with consistent spacing */}
          <div className="grid-3-fixed mx-auto">
            {rooms.map((room) => (
              <div key={room.id} className="flex justify-center">
                <RoomCard
                  room={room}
                  propertyType={propertyType}
                  onSelectRoom={onSelectRoom}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySection;
