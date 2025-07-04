
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filters = [
    { id: "all", label: "All Photos" },
    { id: "dorms", label: "Dorms" },
    { id: "private", label: "Private Rooms" },
    { id: "common", label: "Common Areas" },
    { id: "outdoors", label: "Outdoors" }
  ];

  // Sample gallery data - replace with actual Supabase images
  const galleryImages = [
    {
      id: 1,
      url: "/lovable-uploads/0ef988f7-b7f3-4d1f-80e3-fc2a04acd9cb.png",
      title: "Mountain View Dorm",
      category: "dorms",
      description: "Cozy dormitory with stunning mountain views"
    },
    {
      id: 2,
      url: "/lovable-uploads/db863c94-a5db-4aa4-afa6-e11364e4b9d7.png",
      title: "Common Area",
      category: "common",
      description: "Spacious common area for socializing"
    },
    {
      id: 3,
      url: "/lovable-uploads/0ef988f7-b7f3-4d1f-80e3-fc2a04acd9cb.png",
      title: "King Double Room",
      category: "private",
      description: "Luxurious private room with king bed"
    },
    {
      id: 4,
      url: "/lovable-uploads/db863c94-a5db-4aa4-afa6-e11364e4b9d7.png",
      title: "Outdoor Garden",
      category: "outdoors",
      description: "Beautiful garden area for relaxation"
    },
    {
      id: 5,
      url: "/lovable-uploads/0ef988f7-b7f3-4d1f-80e3-fc2a04acd9cb.png",
      title: "Mixed Dorm",
      category: "dorms",
      description: "Comfortable mixed dormitory"
    },
    {
      id: 6,
      url: "/lovable-uploads/db863c94-a5db-4aa4-afa6-e11364e4b9d7.png",
      title: "Dining Area",
      category: "common",
      description: "Modern dining and kitchen area"
    }
  ];

  const filteredImages = selectedFilter === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedFilter);

  const openLightbox = (imageUrl: string) => {
    const index = filteredImages.findIndex(img => img.url === imageUrl);
    setCurrentImageIndex(index);
    setSelectedImage(imageUrl);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex].url);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex].url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex flex-col px-3 sm:px-4 pt-14 sm:pt-16 pb-6 sm:pb-8 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90">
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif-sans bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">
              Gallery
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto font-seasons leading-relaxed">
              Explore our beautiful spaces and get inspired for your stay at XTSY
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-2 font-bold transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl border-orange-400"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-orange-400 hover:text-orange-600"
                } font-seasons`}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <Card 
                key={image.id} 
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => openLightbox(image.url)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                        <p className="text-sm">{image.description}</p>
                        <Badge className="mt-2 bg-orange-500">
                          {filters.find(f => f.id === image.category)?.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No images found for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              onClick={closeLightbox}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="h-6 w-6" />
            </Button>
            
            <Button
              onClick={prevImage}
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              onClick={nextImage}
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            <img
              src={selectedImage}
              alt="Gallery Image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
              <h3 className="text-lg font-bold mb-1">
                {filteredImages[currentImageIndex]?.title}
              </h3>
              <p className="text-sm opacity-80">
                {filteredImages[currentImageIndex]?.description}
              </p>
              <p className="text-xs opacity-60 mt-2">
                {currentImageIndex + 1} of {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
