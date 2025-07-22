
import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PropertySection from "./PropertySection";

const RoomsSection = () => {
  const scrollToCalendar = () => {
    const element = document.querySelector('#home');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const checkInInput = document.querySelector('input[type="date"]') as HTMLInputElement;
        if (checkInInput) {
          checkInInput.focus();
        }
      }, 1000);
    }
  };

  const luxuryRooms = [
    {
      id: "signature-270-glass-suite",
      name: "Signature 270° Glass Suite",
      price: 18000,
      description: "Premium suite with 270-degree panoramic views and luxury amenities. Experience unparalleled comfort with breathtaking mountain and valley views.",
      features: ["270° Panoramic view", "Luxury amenities", "Attached bath", "Wi-Fi", "Premium service", "Mountain views", "Valley views", "Complimentary breakfast"],
      maxGuests: 2,
      maxRooms: 1,
      image: ""
    }
  ];

  const hostelRooms = [
    {
      id: "4-bed-female-only-dorm",
      name: "Bed in 4 Bed Female Only Dorm",
      price: 850,
      description: "Female-only dormitory with modern amenities and comfortable beds",
      features: ["Female only", "Shared bathroom", "Wi-Fi", "Locker", "Common area", "Reading lights", "Power outlets"],
      maxGuests: 4,
      maxRooms: 1,
      image: ""
    },
    {
      id: "4-bed-mixed-female-dorm",
      name: "Bed in 4 Bed Mixed/Female Dorm", 
      price: 800,
      description: "Mixed or female dormitory with shared facilities and social atmosphere",
      features: ["Mixed/Female", "Shared bathroom", "Wi-Fi", "Locker", "Common area", "Reading lights", "Power outlets"],
      maxGuests: 4,
      maxRooms: 1,
      image: ""
    },
    {
      id: "6-bed-mixed-female-dorm",
      name: "Bed in 6 Bed Mixed/Female Dorm",
      price: 700,
      description: "Spacious mixed or female dormitory with modern amenities",
      features: ["Mixed/Female", "Shared bathroom", "Wi-Fi", "Locker", "Common area", "Reading lights", "Power outlets"],
      maxGuests: 30,
      maxRooms: 5,
      image: ""
    },
    {
      id: "8-bed-mixed-dorm",
      name: "Bed in 8 Bed Mixed Dorm",
      price: 600,
      description: "Large mixed dormitory for budget travelers seeking social experience",
      features: ["Mixed dorm", "Shared bathroom", "Wi-Fi", "Locker", "Common area", "Reading lights", "Power outlets"],
      maxGuests: 8,
      maxRooms: 1,
      image: ""
    },
    {
      id: "king-double-room",
      name: "King Double Room",
      price: 3200,
      description: "Spacious private room with king bed for two guests",
      features: ["King bed", "Valley view", "Attached bath", "Wi-Fi", "Premium amenities", "Mini fridge"],
      maxGuests: 4,
      maxRooms: 2,
      image: ""
    },
    {
      id: "king-triple-room",
      name: "King Triple Room",
      price: 4200,
      description: "Luxurious private room accommodating up to three guests",
      features: ["King bed + extra bed", "Panoramic view", "Attached bath", "Wi-Fi", "Premium amenities", "Mini fridge"],
      maxGuests: 3,
      maxRooms: 1,
      image: ""
    }
  ];

  const economyRooms = [
    {
      id: "6-bed-female-economy-dorm",
      name: "Bed in 6 Bed Female Economy Dorm",
      price: 550,
      description: "Budget-friendly female dormitory with essential amenities",
      features: ["Female only", "Shared bathroom", "Wi-Fi", "Locker", "Common area", "Basic amenities"],
      maxGuests: 6,
      maxRooms: 1,
      image: ""
    },
    {
      id: "6-bed-mixed-economy-dorm",
      name: "Bed in 6 Bed Mixed Economy Dorm",
      price: 500,
      description: "Affordable mixed dormitory perfect for budget travelers",
      features: ["Mixed dorm", "Shared bathroom", "Wi-Fi", "Locker", "Common area", "Basic amenities"],
      maxGuests: 6,
      maxRooms: 1,
      image: ""
    },
    {
      id: "8-bed-mixed-economy-dorm",
      name: "Bed in 8 Bed Mixed Economy Dorm",
      price: 450,
      description: "Most economical option for backpackers and budget travelers",
      features: ["Mixed dorm", "Shared bathroom", "Wi-Fi", "Locker", "Common area", "Basic amenities"],
      maxGuests: 8,
      maxRooms: 1,
      image: ""
    }
  ];

  return (
    <section id="rooms" className="py-8 sm:py-12 md:py-16 lg:py-20 safe-area-padding bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-purple-100/30" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      <div className="absolute -top-16 sm:-top-24 -right-16 sm:-right-24 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 sm:-bottom-24 -left-16 sm:-left-24 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-purple-200/30 rounded-full blur-3xl" />

      <div className="responsive-container relative z-10">
        <div className="section-header">
          <div className="section-title-card">
            <h2 className="text-fluid-2xl sm:text-fluid-3xl md:text-fluid-4xl lg:text-fluid-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 font-playfair">
              Our Properties
            </h2>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          </div>
        </div>

        {/* XTSY Luxury Section - Center Aligned */}
        <div className="center-aligned mb-16">
          <PropertySection
            title="XTSY Luxury"
            description="Premium accommodation with breathtaking 270-degree views, luxury amenities, and exceptional service for discerning travelers"
            rooms={luxuryRooms}
            propertyType="luxury"
            onSelectRoom={scrollToCalendar}
            isLuxury={true}
          />
        </div>

        {/* XTSY Travellers Hostel Section - Center Aligned */}
        <div className="center-aligned mb-16">
          <PropertySection
            title="XTSY Travellers Hostel"
            description="Budget-friendly and premium accommodation options in the heart of Shillong with modern amenities and vibrant community spaces"
            rooms={hostelRooms}
            propertyType="hostel"
            onSelectRoom={scrollToCalendar}
          />
        </div>

        {/* XTSY Economy Section - Center Aligned */}
        <div className="center-aligned mb-16">
          <PropertySection
            title="XTSY Economy"
            description="Most affordable accommodation options perfect for backpackers and budget travelers without compromising on essential amenities"
            rooms={economyRooms}
            propertyType="economy"
            onSelectRoom={scrollToCalendar}
          />
        </div>
      </div>

      <style>
        {`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        `}
      </style>
    </section>
  );
};

export default RoomsSection;
