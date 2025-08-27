
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  Car, 
  Coffee, 
  Utensils, 
  Gamepad2, 
  Shirt, 
  ShieldCheck, 
  MapPin, 
  Users, 
  Calendar,
  Phone,
  Clock,
  Sofa
} from "lucide-react";
import { useScreenSize, useIsMobile } from "@/hooks/use-mobile";
import { useState } from 'react';
import ServiceModal from './ServiceModal';

const ServicesSection = () => {
  const screenSize = useScreenSize();
  const isMobile = useIsMobile();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const services = [
    {
      icon: <Wifi className="h-5 w-5" />,
      title: "Free WiFi",
      description: "High-speed internet throughout the property",
      badge: "Free"
    },
    {
      icon: <Car className="h-5 w-5" />,
      title: "Free parking",
      description: "Secure parking available for guests",
      badge: "Free"
    },
    {
      icon: <Coffee className="h-5 w-5" />,
      title: "In-House Cafe",
      description: "24/7 cafe serving fresh coffee, snacks and local delicacies",
      badge: "9 AM to 9 PM"
    },
    {
      icon: <Sofa className="h-5 w-5" />,
      title: "Shared Lounge",
      description: "Netflix and chill",
      badge: "24/7"
    },
    {
      icon: <Gamepad2 className="h-5 w-5" />,
      title: "Games Room",
      description: "Recreation area with games and entertainment",
      badge: "Free Access"
    },
    {
      icon: <Shirt className="h-5 w-5" />,
      title: "Laundry",
      description: "Washing and drying facilities",
      badge: "Paid"
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "24/7 Security",
      description: "Round-the-clock security and reception",
      badge: "Always"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Tour Assistance",
      description: "Local tour planning and bookings",
      badge: "Expert Help"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Group Bookings",
      description: "Special rates for group reservations",
      badge: "Discounts"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Event Space",
      description: "Special events, photoshoots, retreats, and programs booking",
      badge: "Bookable"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "24/7 Support",
      description: "Round-the-clock guest assistance",
      badge: "Always Available"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Flexible Check-in",
      description: "Convenient check-in and check-out times",
      badge: "Flexible"
    }
  ];

  const getGridClasses = () => {
    if (isMobile) return "grid-cols-2";
    if (screenSize === 'tablet') return "grid-cols-3 md:grid-cols-4";
    return "grid-cols-4 lg:grid-cols-6";
  };

  const getCardHeight = () => {
    if (isMobile) return "h-52";
    if (screenSize === 'tablet') return "h-48";
    return "h-44 sm:h-48";
  };

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <section className="pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16 lg:pb-20 safe-area-padding bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-orange-900/20 relative overflow-hidden -mt-1">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/10 to-orange-100/20" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl" />

      <div className="responsive-container relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-12 sm:mb-16">
          <div className="glass-card inline-block p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600 mb-3 font-playfair">
              Amenities & Services
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 font-medium max-w-2xl mx-auto">
              From essential comforts to premium experiences - choose your perfect stay level
            </p>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 mx-auto mt-4 rounded-full" />
          </div>
        </div>

        <div className={`grid ${getGridClasses()} gap-4 sm:gap-6 mt-8 mobile-reduce-animations`}>
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`glass-card bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/15 hover:shadow-xl transition-all duration-500 ${getCardHeight()} flex flex-col group hover:scale-105 mobile-touch-target cursor-pointer`}
              onClick={() => handleServiceClick(service)}
            >
              <CardHeader className="p-3 pb-2 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-purple-600 group-hover:text-pink-600 transition-colors duration-300 flex-shrink-0">
                    {service.icon}
                  </div>
                  <Badge variant="outline" className="text-xs border-purple-300/50 text-purple-700 bg-white/20 backdrop-blur-sm px-2 py-1 flex-shrink-0 font-medium">
                    {service.badge}
                  </Badge>
                </div>
                <CardTitle className={`font-bold text-gray-900 leading-tight group-hover:text-purple-900 transition-colors duration-300 ${
                  isMobile ? 'text-sm' : 'text-sm sm:text-base'
                }`}>
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 flex-1 flex items-start overflow-hidden">
                <CardDescription className={`text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 ${
                  isMobile 
                    ? 'text-xs line-clamp-4' 
                    : screenSize === 'tablet' 
                      ? 'text-xs line-clamp-3'
                      : 'text-xs sm:text-sm line-clamp-3'
                }`}>
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ServiceModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </section>
  );
};

export default ServicesSection;
