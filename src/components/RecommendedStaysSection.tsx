/**
 * Recommended Stays Section
 * Compact room showcase below tour packages (secondary, not primary)
 */

import { useNavigate } from '@/lib/router-compat';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Bed, Star, Users, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import UnifiedImage from './UnifiedImage';
import { trackRoomViewed } from '@/utils/dataLayerService';
import { ROOM_IMAGES } from '@/config/roomTypes';

// Room showcase data
const featuredRooms = [
  {
    id: 'xtsy-270',
    name: 'Experience by XTSY',
    type: 'Luxury Suite',
    tagline: 'Wake up to mountain views',
    price: 5399,
    originalPrice: 11999,
    image: ROOM_IMAGES['xtsy-270'][0],
    rating: 4.8,
    capacity: '2 Guests',
    highlight: 'Luxury Couple',
  },
  {
    id: 'dorm-mixed',
    name: 'Mixed Dormitory',
    type: 'Hostel Bed',
    tagline: 'Social travelers welcome',
    price: 399,
    originalPrice: 550,
    image: ROOM_IMAGES['6-bed-mixed-dorm'][0],
    rating: 4.8,
    capacity: '1 Bed',
    highlight: 'Bestseller',
  },
  {
    id: 'dorm-female',
    name: 'Female-Only Dormitory',
    type: 'Hostel Bed',
    tagline: 'Safe space for solo women',
    price: 599,
    originalPrice: 679,
    image: ROOM_IMAGES['4-bed-female-only-dorm'][0],
    rating: 4.8,
    capacity: '1 Bed',
    highlight: 'Preferred by Female',
  },
];

interface RoomCardProps {
  room: typeof featuredRooms[0];
  onBook: () => void;
}

const RoomCard = ({ room, onBook }: RoomCardProps) => {
  const { formatPrice } = useApp();
  
  const handleClick = () => {
    trackRoomViewed(room.type, room.name, room.price);
    onBook();
  };
  
  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 bg-card/80 backdrop-blur-xs hover:shadow-xl transition-all duration-300"
      onClick={handleClick}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-1/3 aspect-video sm:aspect-square overflow-hidden">
          <UnifiedImage
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            threshold={0.3}
          />
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
            {room.highlight}
          </Badge>
        </div>
        
        {/* Content */}
        <CardContent className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{room.type}</p>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {room.name}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{room.rating}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{room.tagline}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {room.capacity}
              </span>
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {room.type.includes('Hostel') ? 'Bunk Bed' : 'King Bed'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-primary">{formatPrice(room.price)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatPrice(room.originalPrice)}</span>
              <span className="text-xs text-emerald-500 font-medium">/ night</span>
            </div>
            <Button size="sm" variant="ghost" className="group/btn">
              Book
              <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const RecommendedStaysSection = () => {
  const navigate = useNavigate();
  
  const scrollToBooking = () => {
    const hero = document.getElementById('home');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth' });
      // Focus on the date input after scroll
      setTimeout(() => {
        const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
        dateInput?.focus();
      }, 800);
    }
  };
  
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">Recommended Stays</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Where to Stay</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Premium accommodations for every budget
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={scrollToBooking}
            className="w-fit"
          >
            View All Rooms
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        {/* Room Cards */}
        <div className="space-y-4">
          {featuredRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onBook={scrollToBooking}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedStaysSection;
