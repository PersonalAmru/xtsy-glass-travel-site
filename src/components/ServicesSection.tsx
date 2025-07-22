
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
  Clock
} from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <Wifi className="h-5 w-5" />,
      title: "Free WiFi",
      description: "High-speed internet throughout the property",
      badge: "Free"
    },
    {
      icon: <Car className="h-5 w-5" />,
      title: "Parking",
      description: "Secure parking available for guests",
      badge: "Available"
    },
    {
      icon: <Coffee className="h-5 w-5" />,
      title: "Café & Snacks",
      description: "On-site café with local delicacies",
      badge: "24/7"
    },
    {
      icon: <Utensils className="h-5 w-5" />,
      title: "Kitchen Access",
      description: "Shared kitchen facilities for guests",
      badge: "Self-service"
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
      description: "Common areas for small gatherings",
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

  return (
    <section className="py-12 md:py-16 lg:py-20 safe-area-padding bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-purple-100/30" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-200/30 rounded-full blur-3xl" />

      <div className="responsive-container relative z-10">
        <div className="section-header">
          <div className="section-title-card">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 font-playfair">
              Amenities & Services
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mt-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300 h-32 sm:h-36 flex flex-col">
              <CardHeader className="p-3 pb-1 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-orange-500">
                    {service.icon}
                  </div>
                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-600 bg-orange-50 px-1 py-0.5">
                    {service.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xs sm:text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <CardDescription className="text-xs text-gray-600 line-clamp-2">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
