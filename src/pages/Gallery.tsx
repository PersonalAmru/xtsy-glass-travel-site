
import { useEffect } from "react";
import Header from "@/components/Header";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import SEOContent from "@/components/SEOContent";

const Gallery = () => {
  useEffect(() => {
    // Scroll to gallery section after header when navigating to /gallery
    setTimeout(() => {
      const gallerySection = document.getElementById('gallery');
      if (gallerySection) {
        const headerHeight = 80; // Adjust based on your header height
        const targetPosition = gallerySection.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOContent page="gallery" />
      <Header />
      <div className="pt-20"> {/* Add padding to account for fixed header */}
        <GallerySection />
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
