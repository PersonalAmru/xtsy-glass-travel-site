
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
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-block p-3 sm:p-4 bg-card/90 backdrop-blur-sm rounded-xl shadow-lg mb-4 border border-border">
          <h3 className="text-fluid-xl sm:text-fluid-2xl md:text-fluid-3xl lg:text-fluid-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2 font-playfair">
            {title}
          </h3>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full" />
        </div>
      </div>

      {/* Luxury Room - Responsive Display */}
      {isLuxury && rooms.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <RoomCard
            room={rooms[0]}
            propertyType={propertyType}
            onSelectRoom={onSelectRoom}
            isLuxury={true}
          />
        </div>
      ) : (
        // Fixed 3-Column Responsive Layout
        <div className="relative">
          {/* Fixed 3-tile grid that scales content */}
          <div className="grid-3-fixed max-w-7xl mx-auto">
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
