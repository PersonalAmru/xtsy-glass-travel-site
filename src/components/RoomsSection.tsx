
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
      price: Math.round(XTSY270_DATA.price * 0.9), // 10% winter discount
      originalPrice: XTSY270_DATA.price,
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
      id: "king-double-room",
      name: "King Double Room",
      price: 1620, // 10% winter discount (1800 * 0.9)
      originalPrice: 1800,
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
      id: "4-bed-female-only-dorm",
      name: "Bed in 4-Bed Female Dormitory",
      price: 360, // 10% winter discount (400 * 0.9)
      originalPrice: 400,
      description: "Female-only dormitory with modern amenities and comfortable beds",
      features: generateFeatures('hostel', 'Bed in 4-Bed Female Dormitory', 'dorm'),
      maxGuests: 4,
      maxRooms: 4,
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
      price: 450, // 10% winter discount (500 * 0.9)
      originalPrice: 500,
      description: "Mixed dormitory with shared facilities and social atmosphere",
      features: generateFeatures('hostel', 'Bed in 4-Bed Mixed Dormitory', 'dorm'),
      maxGuests: 4,
      maxRooms: 4,
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
      price: 315, // 10% winter discount (350 * 0.9)
      originalPrice: 350,
      description: "Spacious female dormitory with modern amenities",
      features: generateFeatures('hostel', 'Bed in 6-Bed Female Dormitory', 'dorm'),
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
      id: "6-bed-mixed-dorm",
      name: "Bed in 6-Bed Mixed Dormitory",
      price: 360, // 10% winter discount (400 * 0.9)
      originalPrice: 400,
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
      id: "8-bed-mixed-dorm",
      name: "Bed in 8-Bed Mixed Dormitory",
      price: 270, // 10% winter discount (300 * 0.9)
      originalPrice: 300,
      description: "Best value mixed dormitory for budget-conscious backpackers",
      features: generateFeatures('hostel', 'Bed in 8-Bed Mixed Dormitory', 'dorm'),
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

        {/* Winter Offer Banner */}
        <div className="relative max-w-4xl mx-auto mb-12 sm:mb-16 px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 border-2 border-blue-200 shadow-xl">
            {/* Snowflake decorations */}
            <div className="absolute top-4 left-4 text-blue-300 opacity-50 animate-pulse">❄</div>
            <div className="absolute top-8 right-8 text-blue-400 opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}>❄</div>
            <div className="absolute bottom-4 left-12 text-cyan-300 opacity-30 animate-pulse" style={{ animationDelay: '1s' }}>❄</div>
            <div className="absolute bottom-8 right-16 text-blue-300 opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}>❄</div>
            
            {/* Frosty overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
            
            <div className="relative z-10 py-8 px-6 sm:py-10 sm:px-8 text-center">
              <div className="inline-block mb-3 px-4 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full shadow-md">
                ❄️ WINTER SPECIAL ❄️
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-2 font-playfair">
                10% Flat Off
              </h3>
              <p className="text-lg sm:text-xl text-blue-800 font-medium">
                Winter Offer by XTSY
              </p>
              <div className="mt-4 text-sm text-blue-700">
                Limited time offer on all properties
              </div>
            </div>
          </div>
        </div>

        {/* XTSY Experience Section - Center Aligned */}
        <div className="center-aligned mb-16">
          <PropertySection
            title="XTSY Experience"
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
        @keyframes shimmer {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
        `}
      </style>
    </section>
  );
};

export default RoomsSection;
