import { useState, useEffect, useCallback, useRef, memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Image, Star, Users, Building } from "lucide-react";
import ImageLightbox from "./ImageLightbox";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  property: string;
  featured?: boolean;
  image: string;
}

// Memoized single gallery tile — prevents re-render cascade on sibling load
const GalleryTile = memo(({
  item,
  index,
  onClick,
}: {
  item: GalleryItem;
  index: number;
  onClick: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);

  // Use IntersectionObserver for true lazy loading (below row 2)
  const shouldEager = index < 3; // first row on 3-col grid

  return (
    <div
      ref={tileRef}
      role="button"
      tabIndex={0}
      className="gallery-tile relative group cursor-pointer overflow-hidden bg-muted"
      style={{ aspectRatio: "1 / 1" }}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      {/* Low-cost skeleton */}
      {!loaded && (
        <div className="absolute inset-0 z-0 bg-muted animate-pulse pointer-events-none" />
      )}

      <img
        ref={imgRef}
        src={item.image}
        alt={item.title}
        width={600}
        height={600}
        loading={shouldEager ? "eager" : "lazy"}
        decoding={shouldEager ? "sync" : "async"}
        fetchPriority={shouldEager ? "high" : "auto"}
        sizes="(max-width: 640px) 50vw, 33vw"
        onClick={onClick}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
          setLoaded(true);
        }}
        className={`w-full h-full object-cover relative z-10 cursor-pointer ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transition: "opacity 0.3s ease, transform 0.5s ease" }}
      />

      {/* Hover overlay — CSS only, no JS animation lib */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Info on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <p className="text-white text-xs sm:text-sm font-semibold leading-tight line-clamp-1">
          {item.title}
        </p>
        <p className="text-white/70 text-[10px] sm:text-xs mt-0.5">
          {item.property}
        </p>
      </div>

      {/* Featured badge */}
      {item.featured && (
        <div className="absolute top-2 left-2 pointer-events-none">
          <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
            <Star className="h-2.5 w-2.5 mr-0.5" />
            Featured
          </Badge>
        </div>
      )}
    </div>
  );
});

GalleryTile.displayName = "GalleryTile";

const GALLERY_ITEMS: GalleryItem[] = [
  // XTSY 270° Glass Suite
  { id: 1, title: "270° Panorama Glass Suite", category: "luxury-suite", property: "XTSY 270° Glass Suite", featured: true, image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/270/ChatGPT%20Image%20Mar%207,%202026,%2008_23_20%20PM.png" },
  { id: 2, title: "270° Glass Suite - Panoramic Vista", category: "luxury-suite", property: "XTSY 270° Glass Suite", featured: true, image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/270/ChatGPT%20Image%20Feb%2028,%202026,%2002_15_59%20PM.png" },
  { id: 35, title: "270° Glass Suite - Stargazing", category: "luxury-suite", property: "XTSY 270° Glass Suite", featured: true, image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/270/Gemini_Generated_Image_7so6yc7so6yc7so6%20(1)%20(1).png" },
  // King Double Room
  { id: 3, title: "King Double Room", category: "private-rooms", property: "King Double Room", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/1.jpg" },
  { id: 4, title: "King Double - Valley View", category: "private-rooms", property: "King Double Room", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/2.jpg" },
  { id: 5, title: "King Double - Interior", category: "private-rooms", property: "King Double Room", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/3.JPG" },
  { id: 6, title: "King Double - Premium Setup", category: "private-rooms", property: "King Double Room", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Double%20Room/IMG_4077.jpg" },
  // King Triple Room
  { id: 7, title: "King Triple Room", category: "private-rooms", property: "King Triple Room", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/1.jpg" },
  { id: 8, title: "King Triple - Panoramic", category: "private-rooms", property: "King Triple Room", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/2.jpg" },
  { id: 9, title: "King Triple - Layout", category: "private-rooms", property: "King Triple Room", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/3.jpg" },
  { id: 10, title: "King Triple - Additional", category: "private-rooms", property: "King Triple Room", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/King%20Triple%20Room/5.jpg" },
  // 4 Bed Female Only Dorm
  { id: 11, title: "4-Bed Female Dorm", category: "dormitories", property: "4-Bed Female Only Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/1.jpg" },
  { id: 12, title: "Female Dorm - Bed Setup", category: "dormitories", property: "4-Bed Female Only Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/2.jpg" },
  { id: 13, title: "Female Dorm - Layout", category: "dormitories", property: "4-Bed Female Only Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/3.jpg" },
  { id: 14, title: "Female Dorm - Premium", category: "dormitories", property: "4-Bed Female Only Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/4.JPG" },
  { id: 15, title: "Female Dorm - Facilities", category: "dormitories", property: "4-Bed Female Only Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/5.JPG" },
  { id: 16, title: "Female Dorm - Cozy", category: "dormitories", property: "4-Bed Female Only Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20Female%20Only%20Dorms/6.JPG" },
  // 4 Bed Mixed Dorm
  { id: 19, title: "4-Bed Mixed Dorm", category: "dormitories", property: "4-Bed Mixed Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/3.jpg" },
  { id: 20, title: "Mixed Dorm - Comfort", category: "dormitories", property: "4-Bed Mixed Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/4.JPG" },
  { id: 21, title: "Mixed Dorm - Interior", category: "dormitories", property: "4-Bed Mixed Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/4%20Bed%20MixedFemale%20Dorms/5.jpg" },
  // 6 Bed Mixed Dorm
  { id: 23, title: "6-Bed Mixed Dorm", category: "dormitories", property: "6-Bed Mixed/Female Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/1.JPG" },
  { id: 24, title: "6-Bed Dorm - Interior", category: "dormitories", property: "6-Bed Mixed/Female Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/3.jpg" },
  { id: 25, title: "6-Bed Dorm - Layout", category: "dormitories", property: "6-Bed Mixed/Female Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/6%20Bed%20MixedFemale%20Dorms/4.jpg" },
  // 8 Bed Mixed Dorm
  { id: 29, title: "8-Bed Mixed Dorm", category: "dormitories", property: "8-Bed Mixed Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/3.jpg" },
  { id: 30, title: "8-Bed Dorm - Sleeping", category: "dormitories", property: "8-Bed Mixed Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/4.jpg" },
  { id: 31, title: "8-Bed Dorm - Interior", category: "dormitories", property: "8-Bed Mixed Dorm", image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/8%20Bed%20Mixed%20Dorms/5.jpg" },
];

const CATEGORIES = [
  { id: "all", label: "All Photos", icon: Image, count: GALLERY_ITEMS.length },
  { id: "luxury-suite", label: "Luxury Suite", icon: Star, count: GALLERY_ITEMS.filter(i => i.category === "luxury-suite").length },
  { id: "private-rooms", label: "Private Rooms", icon: Building, count: GALLERY_ITEMS.filter(i => i.category === "private-rooms").length },
  { id: "dormitories", label: "Dormitories", icon: Users, count: GALLERY_ITEMS.filter(i => i.category === "dormitories").length },
];

const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [gridKey, setGridKey] = useState(0);

  useEffect(() => {
    const handleGalleryFilter = (event: CustomEvent) => {
      const { category } = event.detail;
      if (category) setActiveCategory(category);
    };
    window.addEventListener("galleryFilter", handleGalleryFilter as EventListener);
    return () => window.removeEventListener("galleryFilter", handleGalleryFilter as EventListener);
  }, []);

  const filteredItems = activeCategory === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(i => i.category === activeCategory);

  const handleCategoryChange = useCallback((catId: string) => {
    setActiveCategory(catId);
    setGridKey(k => k + 1); // force CSS animation restart
  }, []);

  const handleImageClick = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const allImageUrls = filteredItems.map(i => i.image);

  return (
    <section id="gallery" className="py-16 sm:py-20 px-3 sm:px-4 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
            📸 Gallery
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Explore all our accommodation options — from luxury suites to cozy dormitories
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-300 text-sm ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-muted-foreground"
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Instagram-grade Square Grid — Pure CSS animations, no framer-motion */}
        <div
          key={gridKey}
          className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-1.5 animate-fade-in"
        >
          {filteredItems.map((item, index) => (
            <GalleryTile
              key={item.id}
              item={item}
              index={index}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 bg-muted rounded-full px-5 py-2.5">
            <Image className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {filteredItems.length} of {GALLERY_ITEMS.length} photos
            </span>
            {activeCategory !== "all" && (
              <button
                onClick={() => handleCategoryChange("all")}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View All →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        images={allImageUrls}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        alt="Gallery Image"
      />
    </section>
  );
};

export default GallerySection;
