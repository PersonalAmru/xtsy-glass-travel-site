
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Eye, MapPin, Users, Mountain, Building, Image, Star, ChevronLeft, ChevronRight } from "lucide-react";

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

  // Updated gallery with available image assets
  const galleryItems = [
    // Luxury Suite Images
    {
      id: 1,
      title: "270° Panorama Glass Ensuite",
      category: "luxury-rooms",
      tags: ["panoramic-views", "glass-architecture", "premium-accommodation", "mountain-views"],
      images: [
        "/lovable-uploads/0ef988f7-b7f3-4d1f-80e3-fc2a04acd9cb.png",
        "/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png",
        "/lovable-uploads/1dc183db-b406-4fa4-a670-ba8b1b0e7c0f.png"
      ],
      description: "Exclusive 270-degree panoramic views - First in Shillong",
      featured: true
    },
    
    // Dormitory Images
    {
      id: 2,
      title: "Female Only Dormitory",
      category: "dormitories",
      tags: ["female-dormitory", "modern-amenities", "comfortable-beds", "social-spaces"],
      images: [
        "/lovable-uploads/29371033-4f1b-4455-882e-ecaa3758aa7b.png",
        "/lovable-uploads/3fb3e606-6b14-409a-b0ef-87fd12dbac22.png"
      ],
      description: "Comfortable female-only dormitory with modern amenities"
    },
    {
      id: 3,
      title: "Mixed Dormitory",
      category: "dormitories",
      tags: ["mixed-dormitory", "social-atmosphere", "modern-design", "shared-facilities"],
      images: [
        "/lovable-uploads/6a7b3dad-87a3-49d9-98fa-919ff7b09dd0.png",
        "/lovable-uploads/70b7c61f-c52c-479b-9663-3957d72f31b0.png"
      ],
      description: "Mixed dormitory with vibrant social atmosphere"
    },
    
    // Private Rooms
    {
      id: 4,
      title: "King Double Room",
      category: "private-rooms",
      tags: ["private-accommodation", "king-bed", "luxury-amenities", "couple-friendly"],
      images: [
        "/lovable-uploads/784b2108-6432-4589-b79b-0433fa26bc3b.png",
        "/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png"
      ],
      description: "Premium king double room with luxury amenities"
    },
    {
      id: 5,
      title: "King Triple Room",
      category: "private-rooms",
      tags: ["private-accommodation", "family-room", "triple-occupancy", "spacious-layout"],
      images: [
        "/lovable-uploads/9190ba64-4f45-45e8-b15d-981db2e861b3.png",
        "/lovable-uploads/db863c94-a5db-4aa4-afa6-e11364e4b9d7.png"
      ],
      description: "Spacious triple room perfect for families"
    },

    // Tourist Destinations
    {
      id: 6,
      title: "Meghalaya Hidden Gems",
      category: "destinations",
      tags: ["hidden-waterfalls", "nature-exploration", "adventure-tours"],
      images: [
        "/src/assets/meghalaya-hidden-gems-final.jpg",
        "/src/assets/meghalaya-hidden-gems-new.jpg",
        "/src/assets/meghalaya-hidden-gems-better.jpg"
      ],
      description: "Discover hidden waterfalls and secret spots in Meghalaya"
    },
    {
      id: 7,
      title: "Living Root Bridges",
      category: "destinations", 
      tags: ["living-root-bridges", "natural-wonders", "trekking"],
      images: [
        "/src/assets/living-root-bridges.jpg",
        "/src/assets/meghalaya-living-root-bridges.jpg",
        "/src/assets/meghalaya-living-roots-premium.jpg"
      ],
      description: "Marvel at nature's engineering - Living Root Bridges"
    },
    {
      id: 8,
      title: "Cherrapunji Monsoon",
      category: "destinations",
      tags: ["monsoon-experience", "waterfalls", "world-wettest-place"],
      images: [
        "/src/assets/cherrapunji-monsoon-final.jpg",
        "/src/assets/cherrapunji-monsoon-new.jpg",
        "/src/assets/cherrapunji-nohkalikai-falls.jpg"
      ],
      description: "Experience the wettest place on earth during monsoon"
    }
  ];

  // Dynamic categories based on gallery items
  const categories = [
    { id: "all", label: "All Photos", icon: Image, count: galleryItems.length },
    { id: "luxury-rooms", label: "Luxury Suite", icon: Star, count: galleryItems.filter(item => item.category === "luxury-rooms").length },
    { id: "dormitories", label: "Dormitories", icon: Users, count: galleryItems.filter(item => item.category === "dormitories").length },
    { id: "private-rooms", label: "Private Rooms", icon: Building, count: galleryItems.filter(item => item.category === "private-rooms").length },
    { id: "destinations", label: "Destinations", icon: Mountain, count: galleryItems.filter(item => item.category === "destinations").length }
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

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-serif-sans">
            📸 Gallery
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-seasons">
            Explore our beautiful property and stunning destinations through our photo gallery
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

        {/* Enhanced Gallery Grid with Instagram-style Image Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <GalleryCard key={item.id} item={item} categories={categories} />
          ))}
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
    </section>
  );
};

// Instagram-style Gallery Card Component
const GalleryCard = ({ item, categories }: { item: any, categories: any[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };
  
  return (
    <Card 
      className={`group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
        item.featured ? "ring-2 ring-orange-500 ring-opacity-50" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          {/* Image Display */}
          <div className="relative w-full h-48 sm:h-56">
            <img 
              src={item.images[currentImageIndex]} 
              alt={`${item.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* Instagram-style Navigation Arrows */}
            {item.images.length > 1 && isHovered && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            
            {/* Image Indicators */}
            {item.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {item.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      currentImageIndex === index 
                        ? 'bg-white scale-110 shadow-md' 
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Image Counter */}
            {item.images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                {currentImageIndex + 1}/{item.images.length}
              </div>
            )}
          </div>
          
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
              {item.tags.slice(0, 2).map((tag: string) => (
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
  );
};

export default GallerySection;
