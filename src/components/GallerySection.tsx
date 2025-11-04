
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Eye, MapPin, Users, Mountain, Building, Image, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import OptimizedImage from "./OptimizedImage";

const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Listen for URL parameter changes
  useEffect(() => {
    const handleGalleryFilter = (event: CustomEvent) => {
      const { category, tag } = event.detail;
      if (category) {
        setActiveCategory(category);
      }
      // Could also implement tag filtering here
    };
    
    window.addEventListener('galleryFilter', handleGalleryFilter as EventListener);
    return () => window.removeEventListener('galleryFilter', handleGalleryFilter as EventListener);
  }, []);

    // Comprehensive gallery with ALL room images organized by property
    const galleryItems = [
      // XTSY 270° Panorama Glass Suite (Luxury Property - Featured)
      {
        id: 1,
        title: "270° Panorama Glass Ensuite - Main View",
        category: "luxury-suite",
        property: "XTSY 270° Glass Suite",
        tags: ["panoramic-views", "glass-architecture", "premium-accommodation", "mountain-views"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140811.png",
        description: "Exclusive 270-degree panoramic views - First in Shillong",
        featured: true
      },
      {
        id: 2,
        title: "270° Panorama Glass Ensuite - Panoramic Vista",
        category: "luxury-suite",
        property: "XTSY 270° Glass Suite",
        tags: ["panoramic-views", "glass-architecture", "premium-accommodation", "mountain-views"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140029.png",
        description: "Breathtaking panoramic vista from the glass suite",
        featured: true
      },
      
      // King Double Room (Private Room)
      {
        id: 3,
        title: "King Double Room - Luxury Comfort",
        category: "private-rooms",
        property: "King Double Room",
        tags: ["private-accommodation", "king-bed", "luxury-amenities", "couple-friendly"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg",
        description: "Premium king double room with luxury amenities"
      },
      {
        id: 4,
        title: "King Double Room - Valley View",
        category: "private-rooms",
        property: "King Double Room",
        tags: ["private-accommodation", "valley-view", "premium-amenities", "spacious"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/2.jpg",
        description: "Stunning valley views from the king double room"
      },
      {
        id: 5,
        title: "King Double Room - Interior Design",
        category: "private-rooms",
        property: "King Double Room",
        tags: ["private-accommodation", "modern-design", "comfortable-space"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/3.JPG",
        description: "Modern interior design with comfort in mind"
      },
      {
        id: 6,
        title: "King Double Room - Premium Setup",
        category: "private-rooms",
        property: "King Double Room",
        tags: ["private-accommodation", "premium-setup", "luxury-furnishing"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg",
        description: "Premium room setup with luxury furnishing"
      },

      // King Triple Room (Private Room)
      {
        id: 7,
        title: "King Triple Room - Family Space",
        category: "private-rooms",
        property: "King Triple Room",
        tags: ["private-accommodation", "family-room", "triple-occupancy", "spacious-layout"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg",
        description: "Spacious triple room perfect for families"
      },
      {
        id: 8,
        title: "King Triple Room - Panoramic View",
        category: "private-rooms",
        property: "King Triple Room",
        tags: ["private-accommodation", "panoramic-view", "family-friendly"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/2.jpg",
        description: "Panoramic views from the family triple room"
      },
      {
        id: 9,
        title: "King Triple Room - Comfort Layout",
        category: "private-rooms",
        property: "King Triple Room",
        tags: ["private-accommodation", "comfortable-layout", "extra-space"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/3.jpg",
        description: "Comfortable layout with extra space for families"
      },
      {
        id: 10,
        title: "King Triple Room - Additional View",
        category: "private-rooms",
        property: "King Triple Room",
        tags: ["private-accommodation", "spacious", "family-friendly"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/5.jpg",
        description: "Additional view of the spacious family room"
      },
      
      // 4 Bed Female Only Dormitory
      {
        id: 11,
        title: "4 Bed Female Only Dorm - Interior View",
        category: "dormitories",
        property: "4-Bed Female Only Dorm",
        tags: ["female-dormitory", "modern-amenities", "comfortable-beds", "social-spaces"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg",
        description: "Comfortable female-only dormitory with modern amenities"
      },
      {
        id: 12,
        title: "4 Bed Female Dorm - Bed Setup",
        category: "dormitories",
        property: "4-Bed Female Only Dorm",
        tags: ["female-dormitory", "privacy-curtains", "individual-storage", "reading-lights"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/2.jpg",
        description: "Individual bed spaces with privacy and storage"
      },
      {
        id: 13,
        title: "4 Bed Female Dorm - Room Layout",
        category: "dormitories",
        property: "4-Bed Female Only Dorm",
        tags: ["female-dormitory", "spacious-layout", "natural-lighting", "clean-environment"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/3.jpg",
        description: "Spacious layout with natural lighting"
      },
      {
        id: 14,
        title: "4 Bed Female Dorm - Premium View",
        category: "dormitories", 
        property: "4-Bed Female Only Dorm",
        tags: ["female-dormitory", "premium-bedding", "organized-space", "comfort-features"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/4.JPG",
        description: "Premium bedding and organized sleeping space"
      },
      {
        id: 15,
        title: "4 Bed Female Dorm - Modern Facilities",
        category: "dormitories",
        property: "4-Bed Female Only Dorm",
        tags: ["female-dormitory", "modern-facilities", "clean-space"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/5.JPG",
        description: "Modern facilities with clean and organized space"
      },
      {
        id: 16,
        title: "4 Bed Female Dorm - Cozy Setup",
        category: "dormitories",
        property: "4-Bed Female Only Dorm",
        tags: ["female-dormitory", "cozy-atmosphere", "comfortable"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/6.JPG",
        description: "Cozy and comfortable dormitory atmosphere"
      },
      {
        id: 17,
        title: "4 Bed Female Dorm - Additional Space",
        category: "dormitories",
        property: "4-Bed Female Only Dorm",
        tags: ["female-dormitory", "spacious", "well-maintained"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/7.JPG",
        description: "Well-maintained space with ample room"
      },
      {
        id: 18,
        title: "4 Bed Female Dorm - Overview",
        category: "dormitories",
        property: "4-Bed Female Only Dorm",
        tags: ["female-dormitory", "overview", "clean-organized"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/IMG_5161.png",
        description: "Overview of the clean and organized dorm"
      },
      
      // 4 Bed Mixed Dormitory
      {
        id: 19,
        title: "4 Bed Mixed Dorm - Social Space",
        category: "dormitories",
        property: "4-Bed Mixed Dorm",
        tags: ["mixed-dormitory", "social-atmosphere", "modern-design", "shared-facilities"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg",
        description: "Mixed dormitory with vibrant social atmosphere"
      },
      {
        id: 20,
        title: "4 Bed Mixed Dorm - Comfort Setup",
        category: "dormitories",
        property: "4-Bed Mixed Dorm",
        tags: ["mixed-dormitory", "comfortable-beds", "organized-layout"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/4.JPG",
        description: "Comfortable bed setup with organized layout"
      },
      {
        id: 21,
        title: "4 Bed Mixed Dorm - Interior",
        category: "dormitories",
        property: "4-Bed Mixed Dorm",
        tags: ["mixed-dormitory", "budget-friendly", "backpacker"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/5.jpg",
        description: "Budget-friendly interior for backpackers"
      },
      {
        id: 22,
        title: "4 Bed Mixed Dorm - Overview",
        category: "dormitories",
        property: "4-Bed Mixed Dorm",
        tags: ["mixed-dormitory", "overview", "social"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/IMG_5161.png",
        description: "Overview of the social mixed dorm space"
      },
      
      // 6 Bed Mixed/Female Dormitory
      {
        id: 23,
        title: "6 Bed Mixed Dorm - Large Space",
        category: "dormitories",
        property: "6-Bed Mixed/Female Dorm",
        tags: ["mixed-dormitory", "spacious-room", "multiple-beds", "shared-living"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG",
        description: "Spacious 6-bed dormitory for budget travelers"
      },
      {
        id: 24,
        title: "6 Bed Mixed Dorm - Interior View",
        category: "dormitories",
        property: "6-Bed Mixed/Female Dorm",
        tags: ["mixed-dormitory", "budget-friendly", "social-space"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg",
        description: "Interior view of budget-friendly dormitory"
      },
      {
        id: 25,
        title: "6 Bed Mixed Dorm - Bed Arrangement",
        category: "dormitories",
        property: "6-Bed Mixed/Female Dorm",
        tags: ["mixed-dormitory", "efficient-layout", "backpacker-friendly"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg",
        description: "Efficient bed arrangement for backpackers"
      },
      {
        id: 26,
        title: "6 Bed Mixed Dorm - Sleeping Area",
        category: "dormitories",
        property: "6-Bed Mixed/Female Dorm",
        tags: ["mixed-dormitory", "comfortable", "organized"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/5.JPG",
        description: "Comfortable and organized sleeping area"
      },
      {
        id: 27,
        title: "6 Bed Mixed Dorm - Additional Space",
        category: "dormitories",
        property: "6-Bed Mixed/Female Dorm",
        tags: ["mixed-dormitory", "spacious", "well-maintained"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/6.JPG",
        description: "Well-maintained additional space"
      },
      {
        id: 28,
        title: "6 Bed Mixed Dorm - Overview",
        category: "dormitories",
        property: "6-Bed Mixed/Female Dorm",
        tags: ["mixed-dormitory", "overview", "budget"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/IMG_5160.png",
        description: "Overview of the budget dormitory space"
      },

      // 8 Bed Mixed Dormitory
      {
        id: 29,
        title: "8 Bed Mixed Dorm - Budget Space",
        category: "dormitories",
        property: "8-Bed Mixed Dorm",
        tags: ["mixed-dormitory", "budget-accommodation", "backpacker-space"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg",
        description: "Most economical option for backpackers"
      },
      {
        id: 30,
        title: "8 Bed Mixed Dorm - Sleeping Area",
        category: "dormitories",
        property: "8-Bed Mixed Dorm",
        tags: ["mixed-dormitory", "economical-stay", "shared-accommodation"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/4.jpg",
        description: "Economical sleeping area with essential amenities"
      },
      {
        id: 31,
        title: "8 Bed Mixed Dorm - Interior",
        category: "dormitories",
        property: "8-Bed Mixed Dorm",
        tags: ["mixed-dormitory", "budget", "basic-amenities"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/5.jpg",
        description: "Basic amenities for budget travelers"
      },
      {
        id: 32,
        title: "8 Bed Mixed Dorm - Bed Layout",
        category: "dormitories",
        property: "8-Bed Mixed Dorm",
        tags: ["mixed-dormitory", "efficient", "backpacker"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/6.jpg",
        description: "Efficient bed layout for backpackers"
      },
      {
        id: 33,
        title: "8 Bed Mixed Dorm - Sleeping Quarters",
        category: "dormitories",
        property: "8-Bed Mixed Dorm",
        tags: ["mixed-dormitory", "budget-friendly", "shared"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/8.jpg",
        description: "Budget-friendly shared sleeping quarters"
      },
      {
        id: 34,
        title: "8 Bed Mixed Dorm - Additional View",
        category: "dormitories",
        property: "8-Bed Mixed Dorm",
        tags: ["mixed-dormitory", "economical", "basic"],
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/9.jpg",
        description: "Additional view of economical accommodation"
      }
    ];


  // Dynamic categories organized by property type
  const categories = [
    { id: "all", label: "All Photos", icon: Image, count: galleryItems.length },
    { id: "luxury-suite", label: "Luxury Suite", icon: Star, count: galleryItems.filter(item => item.category === "luxury-suite").length },
    { id: "private-rooms", label: "Private Rooms", icon: Building, count: galleryItems.filter(item => item.category === "private-rooms").length },
    { id: "dormitories", label: "Dormitories", icon: Users, count: galleryItems.filter(item => item.category === "dormitories").length }
  ];

  const filteredItems = activeCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="py-16 sm:py-20 px-3 sm:px-4 bg-white relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-xl animate-pulse"
            style={{
              left: `${15 + i * 20}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-serif-sans">
            📸 Property Gallery
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-seasons">
            Explore all our accommodation options - from luxury suites to cozy dormitories
          </p>
        </div>

        {/* Enhanced Category Filter with Icons and Counts */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                    : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {category.label}
                <Badge variant="secondary" className={`text-xs ${
                  activeCategory === category.id ? "bg-white/20 text-white" : "bg-gray-100"
                }`}>
                  {category.count}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Vertical Gallery Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className={`group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                item.featured ? "ring-2 ring-orange-500 ring-opacity-50" : ""
              }`}>
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      {item.image ? (
                        <OptimizedImage 
                          src={item.image} 
                          alt={item.title}
                          variant="gallery"
                          className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                          priority={item.featured}
                        />
                      ) : (
                        <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">Gallery Image</p>
                            <p className="text-gray-400 text-xs">Coming Soon</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Featured Badge */}
                      {item.featured && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-orange-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-black/70 text-white border-0">
                          {categories.find(cat => cat.id === item.category)?.label || "Gallery"}
                        </Badge>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-2">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 mb-2">{item.description}</p>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs text-white border-white/30 bg-white/10">
                              {tag.replace("-", " ")}
                            </Badge>
                          ))}
                          {item.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs text-white border-white/30 bg-white/10">
                              +{item.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
        
        {/* Gallery Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                Showing {filteredItems.length} of {galleryItems.length} images
              </span>
            </div>
            {activeCategory !== "all" && (
              <button
                onClick={() => setActiveCategory("all")}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                View All →
              </button>
            )}
          </div>
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

export default GallerySection;
