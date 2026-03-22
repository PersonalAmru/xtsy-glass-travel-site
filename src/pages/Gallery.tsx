
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import SEOContent from "@/components/SEOContent";

// Preload first row of gallery images (LCP candidates)
const PRELOAD_IMAGES = [
  "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140811.png",
  "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140029.png",
  "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/270/Gemini_Generated_Image_7so6yc7so6yc7so6%20(1)%20(1).png",
];

const Gallery = () => {
  const [searchParams] = useSearchParams();

  // Inject preload links for first-row images immediately
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    PRELOAD_IMAGES.forEach((src) => {
      // Avoid duplicate preloads
      if (document.querySelector(`link[href="${src}"]`)) return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      link.fetchPriority = "high";
      document.head.appendChild(link);
      links.push(link);
    });
    return () => links.forEach((l) => l.remove());
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    setTimeout(() => {
      const gallerySection = document.getElementById("gallery");
      if (gallerySection) {
        const headerHeight = 80;
        const targetPosition = gallerySection.offsetTop - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }

      if (category || tag) {
        window.dispatchEvent(
          new CustomEvent("galleryFilter", { detail: { category, tag } })
        );
      }
    }, 100);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <SEOContent page="gallery" />
      <Header />
      <div className="pt-4">
        <GallerySection />
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
