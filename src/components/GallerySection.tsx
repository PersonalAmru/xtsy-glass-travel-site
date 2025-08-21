
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Eye, MapPin, Users, Mountain, Building, Image, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import UnifiedImage from "./UnifiedImage";

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

  // Comprehensive gallery with actual room images from the project
  const galleryItems = [
    // Luxury Suite Images - XTSY 270° Glass Suite
    {
      id: 1,
      title: "270° Panorama Glass Ensuite - Main View",
      category: "luxury-rooms",
      tags: ["panoramic-views", "glass-architecture", "premium-accommodation", "mountain-views"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140811.png",
      description: "Exclusive 270-degree panoramic views - First in Shillong",
      featured: true
    },
    {
      id: 2,
      title: "270° Panorama Glass Ensuite - Panoramic Vista",
      category: "luxury-rooms",
      tags: ["panoramic-views", "glass-architecture", "premium-accommodation", "mountain-views"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140029.png",
      description: "Breathtaking panoramic vista from the glass suite",
      featured: true
    },
    
    // Private Rooms - King Double Room
    {
      id: 3,
      title: "King Double Room - Luxury Comfort",
      category: "private-rooms",
      tags: ["private-accommodation", "king-bed", "luxury-amenities", "couple-friendly"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg",
      description: "Premium king double room with luxury amenities"
    },
    {
      id: 4,
      title: "King Double Room - Valley View",
      category: "private-rooms",
      tags: ["private-accommodation", "valley-view", "premium-amenities", "spacious"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/2.jpg",
      description: "Stunning valley views from the king double room"
    },
    {
      id: 5,
      title: "King Double Room - Interior Design",
      category: "private-rooms",
      tags: ["private-accommodation", "modern-design", "comfortable-space"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/3.JPG",
      description: "Modern interior design with comfort in mind"
    },
    {
      id: 6,
      title: "King Double Room - Premium Setup",
      category: "private-rooms",
      tags: ["private-accommodation", "premium-setup", "luxury-furnishing"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg",
      description: "Premium room setup with luxury furnishing"
    },

    // King Triple Room
    {
      id: 7,
      title: "King Triple Room - Family Space",
      category: "private-rooms",
      tags: ["private-accommodation", "family-room", "triple-occupancy", "spacious-layout"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg",
      description: "Spacious triple room perfect for families"
    },
    {
      id: 8,
      title: "King Triple Room - Panoramic View",
      category: "private-rooms",
      tags: ["private-accommodation", "panoramic-view", "family-friendly"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/2.jpg",
      description: "Panoramic views from the family triple room"
    },
    {
      id: 9,
      title: "King Triple Room - Comfort Layout",
      category: "private-rooms",
      tags: ["private-accommodation", "comfortable-layout", "extra-space"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/3.jpg",
      description: "Comfortable layout with extra space for families"
    },
    
    // 4 Bed Female Only Dorms
    {
      id: 10,
      title: "4 Bed Female Only Dorm - Interior View",
      category: "dormitories",
      tags: ["female-dormitory", "modern-amenities", "comfortable-beds", "social-spaces"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg",
      description: "Comfortable female-only dormitory with modern amenities"
    },
    {
      id: 11,
      title: "4 Bed Female Dorm - Bed Setup",
      category: "dormitories",
      tags: ["female-dormitory", "privacy-curtains", "individual-storage", "reading-lights"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/2.jpg",
      description: "Individual bed spaces with privacy and storage"
    },
    {
      id: 12,
      title: "4 Bed Female Dorm - Room Layout",
      category: "dormitories",
      tags: ["female-dormitory", "spacious-layout", "natural-lighting", "clean-environment"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/3.jpg",
      description: "Spacious layout with natural lighting"
    },
    {
      id: 13,
      title: "4 Bed Female Dorm - Premium View",
      category: "dormitories", 
      tags: ["female-dormitory", "premium-bedding", "organized-space", "comfort-features"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/4.JPG",
      description: "Premium bedding and organized sleeping space"
    },
    {
      id: 14,
      title: "4 Bed Female Dorm - Modern Facilities",
      category: "dormitories",
      tags: ["female-dormitory", "modern-facilities", "clean-space"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/5.JPG",
      description: "Modern facilities with clean and organized space"
    },
    
    // Mixed Dormitories - 4 Bed Mixed/Female
    {
      id: 15,
      title: "4 Bed Mixed Dorm - Social Space",
      category: "dormitories",
      tags: ["mixed-dormitory", "social-atmosphere", "modern-design", "shared-facilities"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg",
      description: "Mixed dormitory with vibrant social atmosphere"
    },
    {
      id: 16,
      title: "4 Bed Mixed Dorm - Comfort Setup",
      category: "dormitories",
      tags: ["mixed-dormitory", "comfortable-beds", "organized-layout"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/4.JPG",
      description: "Comfortable bed setup with organized layout"
    },
    
    // 6 Bed Mixed Dormitories
    {
      id: 17,
      title: "6 Bed Mixed Dorm - Large Space",
      category: "dormitories",
      tags: ["mixed-dormitory", "spacious-room", "multiple-beds", "shared-living"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG",
      description: "Spacious 6-bed mixed dormitory for budget travelers"
    },
    {
      id: 18,
      title: "6 Bed Mixed Dorm - Interior View",
      category: "dormitories",
      tags: ["mixed-dormitory", "budget-friendly", "social-space"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg",
      description: "Interior view of budget-friendly mixed dormitory"
    },
    {
      id: 19,
      title: "6 Bed Mixed Dorm - Bed Arrangement",
      category: "dormitories",
      tags: ["mixed-dormitory", "efficient-layout", "backpacker-friendly"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg",
      description: "Efficient bed arrangement for backpackers"
    },

    // 8 Bed Mixed Dormitories
    {
      id: 20,
      title: "8 Bed Mixed Dorm - Budget Space",
      category: "dormitories",
      tags: ["mixed-dormitory", "budget-accommodation", "backpacker-space"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg",
      description: "Most economical option for backpackers and budget travelers"
    },
    {
      id: 21,
      title: "8 Bed Mixed Dorm - Sleeping Area",
      category: "dormitories",
      tags: ["mixed-dormitory", "economical-stay", "shared-accommodation"],
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/4.jpg",
      description: "Economical sleeping area with essential amenities"
    }
  ];

  // Dynamic categories based on gallery items (accommodation only)
  const categories = [
    { id: "all", label: "All Photos", icon: Image, count: galleryItems.length },
    { id: "luxury-rooms", label: "Luxury Suite", icon: Star, count: galleryItems.filter(item => item.category === "luxury-rooms").length },
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
            📸 Gallery
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-seasons">
            Explore our beautiful property and room types through our photo gallery
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

        {/* Scrollable Gallery Container */}
        <div className="relative">
          {/* Scrollable Gallery Grid */}
          <div className="overflow-x-auto scrollbar-hide pb-6">
            <div className="flex gap-4 sm:gap-6" style={{ width: 'max-content' }}>
              {filteredItems.map((item) => (
                <Card key={item.id} className={`group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-shrink-0 w-80 sm:w-96 ${
                  item.featured ? "ring-2 ring-orange-500 ring-opacity-50" : ""
                }`}>
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      {item.image ? (
                        <UnifiedImage 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                          threshold={0.1}
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

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-4">
            <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2">
              ← Scroll to explore more →
            </div>
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
