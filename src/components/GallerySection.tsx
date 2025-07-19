
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";

const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const galleryItems = [
    {
      id: 1,
      title: "XTSY Travellers Hostel - Common Area",
      category: "hostel",
      image: "",
      description: "Relaxing common lounge area"
    },
    {
      id: 2,
      title: "Dormitory Room",
      category: "rooms",
      image: "",
      description: "Comfortable shared accommodation"
    },
    {
      id: 3,
      title: "Shillong City View",
      category: "views",
      image: "",
      description: "Beautiful city landscape"
    },
    {
      id: 4,
      title: "Adventure Activities",
      category: "activities",
      image: "",
      description: "Exciting outdoor experiences"
    }
  ];

  const categories = [
    { id: "all", label: "All Photos" },
    { id: "hostel", label: "Hostel" },
    { id: "rooms", label: "Rooms" },
    { id: "views", label: "Views" },
    { id: "activities", label: "Activities" }
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
            Explore our beautiful property and surroundings through our photo gallery
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b group-hover:scale-110 transition-transform duration-500">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Gallery Image</p>
                      <p className="text-gray-400 text-xs">Ready for Supabase URL</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-bold text-sm sm:text-base mb-1">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-200">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
