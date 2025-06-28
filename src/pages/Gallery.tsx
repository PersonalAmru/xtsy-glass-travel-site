
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryImages = [
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Hero/DJI_20250324_105854_074.jpg",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/DJI_20250324_105812_929.jpg",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/DJI_20250324_110947_725.jpg",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/DJI_20250324_122946_523.jpg",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/DJI_20250324_123023_584.jpg",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/DJI_20250324_123045_068.jpg",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/DJI_20250324_123545_627.jpg",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/DJI_20250324_132355_288.jpg",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/DJI_20250324_132437_518.jpg",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/DJI_20250324_133117_632.jpg",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/P1010742.JPG",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/IMG_3896.JPG",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/IMG_4019.JPG",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/IMG_4082.JPG",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/IMG_4083.JPG",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/IMG_4087.JPG",
    "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Gallery/IMG_4095.jpg"
  ];

  const openLightbox = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400/10 via-orange-400/15 to-red-400/10">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-24 h-24 bg-gradient-to-r from-yellow-400/15 to-orange-400/15 rounded-full blur-xl animate-pulse"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${3 + i * 0.4}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent font-serif-sans">
            Our Gallery
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-seasons">
            Discover the beauty of XTSY and the stunning landscapes of Shillong through our lens
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                onClick={() => openLightbox(image, index)}
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-bold font-seasons">View Image</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2 z-10"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2 z-10"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          <img
            src={selectedImage}
            alt="Selected gallery image"
            className="max-w-full max-h-full object-contain"
          />
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
            <p className="text-sm font-seasons">
              {currentIndex + 1} of {galleryImages.length}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
