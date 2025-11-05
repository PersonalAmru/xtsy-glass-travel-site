
import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PropertySection from "./PropertySection";
import GalleryImage from "./GalleryImage";
import { XTSY270_DATA } from "@/data/rooms/xtsy270";
import { generateStandardizedFeatures } from "@/utils/roomFeatures";

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
      name: XTSY270_DATA.name,
      price: XTSY270_DATA.price,
      description: XTSY270_DATA.description,
      features: XTSY270_DATA.features,
      maxGuests: XTSY270_DATA.maxGuests,
      maxRooms: XTSY270_DATA.maxRooms,
      image: XTSY270_DATA.image,
      images: XTSY270_DATA.images
    }
  ];

  // Use shared standardized feature generation utility
  const generateFeatures = generateStandardizedFeatures;

  const hostelRooms = [
    {
      id: "4-bed-female-only-dorm",
      name: "Bed in 4-Bed Female Dormitory",
      price: 850,
      description: "Female-only dormitory with modern amenities and comfortable beds",
      features: generateFeatures('hostel', 'Bed in 4-Bed Female Dormitory', 'dorm'),
      maxGuests: 4,
      maxRooms: 1,
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg",
      images: [
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/2.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/3.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/4.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/5.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/6.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/7.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/IMG_5161.png"
      ]
    },
    {
      id: "4-bed-mixed-female-dorm",
      name: "Bed in 4-Bed Mixed Dormitory", 
      price: 800,
      description: "Mixed dormitory with shared facilities and social atmosphere",
      features: generateFeatures('hostel', 'Bed in 4-Bed Mixed Dormitory', 'dorm'),
      maxGuests: 4,
      maxRooms: 1,
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg",
      images: [
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/4.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/5.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/IMG_5161.png"
      ]
    },
    {
      id: "6-bed-mixed-female-dorm",
      name: "Bed in 6-Bed Female Dormitory",
      price: 750,
      description: "Spacious female dormitory with modern amenities",
      features: generateFeatures('hostel', 'Bed in 6-Bed Female Dormitory', 'dorm'),
      maxGuests: 6,
      maxRooms: 5,
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG",
      images: [
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png"
      ]
    },
    {
      id: "6-bed-mixed-economy-dorm",
      name: "Bed in 6-Bed Mixed Dormitory",
      price: 700,
      description: "Budget-friendly mixed dormitory with essential amenities",
      features: generateFeatures('hostel', 'Bed in 6-Bed Mixed Dormitory', 'dorm'),
      maxGuests: 6,
      maxRooms: 6,
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG",
      images: [
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png"
      ]
    },
    {
      id: "king-double-room",
      name: "King Double Room",
      price: 2800,
      description: "Spacious private room with king bed for two guests",
      features: generateFeatures('hostel', 'King Double Room', 'private'),
      maxGuests: 2,
      maxRooms: 2,
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg",
      images: [
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/2.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/3.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg"
      ]
    },
    {
      id: "king-triple-room",
      name: "King Triple Room",
      price: 3500,
      description: "Luxurious private room accommodating up to three guests",
      features: generateFeatures('hostel', 'King Triple Room', 'private'),
      maxGuests: 3,
      maxRooms: 1,
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg",
      images: [
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/2.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/3.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/5.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg"
      ]
    }
  ];

  const economyRooms = [
    {
      id: "6-bed-mixed-economy-dorm",
      name: "Bed in 6-Bed Female Dormitory",
      price: 325,
      description: "Budget-friendly female dormitory with essential amenities",
      features: generateFeatures('economy', 'Bed in 6-Bed Female Dormitory', 'dorm'),
      maxGuests: 6,
      maxRooms: 6,
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG",
      images: [
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png"
      ]
    },
    {
      id: "8-bed-mixed-economy-dorm",
      name: "Bed in 8-Bed Mixed Dormitory", 
      price: 399,
      description: "Most economical option for backpackers and budget travelers",
      features: generateFeatures('economy', 'Bed in 8-Bed Mixed Dormitory', 'dorm'),
      maxGuests: 8,
      maxRooms: 8,
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg",
      images: [
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/4.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/5.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/6.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/8.jpg",
        "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/9.jpg"
      ]
    }
  ];

  return (
    <section id="rooms" className="pb-8 sm:pb-12 md:pb-16 lg:pb-20 safe-area-padding bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-purple-100/30" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      <div className="absolute -top-16 sm:-top-24 -right-16 sm:-right-24 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 sm:-bottom-24 -left-16 sm:-left-24 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-purple-200/30 rounded-full blur-3xl" />

      <div className="responsive-container relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="text-center mb-12 sm:mb-16 mt-16 sm:mt-20 md:mt-24 lg:mt-28 tablet-padding-fix">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 font-playfair px-2 sm:px-4 leading-tight">
            Our Properties
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-4 leading-relaxed">
            Choose from our range of accommodations designed for every traveler's needs and budget
          </p>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full" />
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
            description="Your Ultra-Budget Stay Without Compromise  Simple, clean, and affordable. Designed for backpackers who need a safe, reliable place to crash with all the essentials"
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
