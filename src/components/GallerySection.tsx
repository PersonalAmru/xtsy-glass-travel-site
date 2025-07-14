
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Star } from "lucide-react";

const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const galleryItems = [
    {
      id: 1,
      title: "XTSY Travellers Hostel - Common Area",
      category: "hostel",
      image: "/lovable-uploads/6a7b3dad-87a3-49d9-98fa-919ff7b09dd0.png",
      description: "Relaxing common lounge area"
    },
    {
      id: 2,
      title: "Dormitory Room",
      category: "rooms",
      image: "/lovable-uploads/29371033-4f1b-4455-882e-ecaa3758aa7b.png",
      description: "Comfortable shared accommodation"
    },
    {
      id: 3,
      title: "Shillong City View",
      category: "views",
      image: "/lovable-uploads/3fb3e606-6b14-409a-b0ef-87fd12dbac22.png",
      description: "Beautiful city landscape"
    },
    {
      id: 4,
      title: "Adventure Activities",
      category: "activities",
      image: "/lovable-uploads/70b7c61f-c52c-479b-9663-3957d72f31b0.png",
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
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
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
