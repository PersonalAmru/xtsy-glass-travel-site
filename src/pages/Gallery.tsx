
import { useEffect } from "react";
import { useSearchParams } from "@/lib/router-compat";
import Header from "@/components/Header";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";

import SEOHead from "@/components/SEOHead";
import { ROOM_IMAGES } from "@/config/roomTypes";

// Preload first row of gallery images (LCP candidates) — CDN-mapped 270° suite shots
const PRELOAD_IMAGES = ROOM_IMAGES['xtsy-270'].slice(0, 3);

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

    const tryScroll = () => {
      const gallerySection = document.getElementById("gallery");
      if (gallerySection) {
        const headerHeight = 80;
        const targetPosition = gallerySection.offsetTop - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });

        if (category || tag) {
          window.dispatchEvent(
            new CustomEvent("galleryFilter", { detail: { category, tag } })
          );
        }
        return true;
      }
      return false;
    };

    if (!tryScroll()) {
      const observer = new MutationObserver(() => {
        if (tryScroll()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const timeout = setTimeout(() => observer.disconnect(), 3000);
      return () => { observer.disconnect(); clearTimeout(timeout); };
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead structuredDataOnly
        title="XTSY Gallery — Hostel, Glass Suite & Meghalaya Photos"
        description="See inside XTSY Shillong — Experience by XTSY, dormitories, common areas, mountain views. Real photos from India's biggest hostel in Meghalaya."
        keywords="XTSY photos, Shillong hostel gallery, glass suite photos, hostel rooms Meghalaya, XTSY Shillong images"
        canonicalUrl="https://xtsy.one/gallery"
      />
      
      <Header />
      <div className="pt-4">
        <GallerySection asPageHeading />
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
