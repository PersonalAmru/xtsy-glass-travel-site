import { useState, useEffect, useCallback, useRef, memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Image, Star, Users, Building } from "lucide-react";
import InstagramPreviewModal from "./InstagramPreviewModal";
import { ROOM_IMAGES } from "@/config/roomTypes";
import { handleImageError } from "@/components/SafeImage";

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
          handleImageError(e);
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

// Gallery items are generated from the CDN-mapped room image sets (single source of truth).
// This guarantees every tile resolves to a real uploaded asset — no dead Supabase links.
interface GallerySource {
  property: string;
  category: string;
  title: string;
  roomId: string;
  featured?: boolean;
}

const GALLERY_SOURCES: GallerySource[] = [
  { property: "Experience by XTSY", category: "luxury-suite", title: "Experience by XTSY", roomId: "xtsy-270", featured: true },
  { property: "King Double Room", category: "private-rooms", title: "King Double Room", roomId: "king-double-room" },
  { property: "4-Bed Female Only Dorm", category: "dormitories", title: "4-Bed Female Dorm", roomId: "4-bed-female-only-dorm" },
  { property: "4-Bed Mixed Dorm", category: "dormitories", title: "4-Bed Mixed Dorm", roomId: "4-bed-mixed-female-dorm" },
  { property: "6-Bed Mixed Dorm", category: "dormitories", title: "6-Bed Mixed Dorm", roomId: "6-bed-mixed-dorm" },
  { property: "8-Bed Mixed Dorm", category: "dormitories", title: "8-Bed Mixed Dorm", roomId: "8-bed-mixed-dorm" },
];

const GALLERY_ITEMS: GalleryItem[] = (() => {
  let id = 0;
  return GALLERY_SOURCES.flatMap((src) => {
    const images = ROOM_IMAGES[src.roomId] ?? [];
    return images.map((image, idx) => ({
      id: ++id,
      title: idx === 0 ? src.title : `${src.title} — ${idx + 1}`,
      category: src.category,
      property: src.property,
      featured: src.featured && idx === 0,
      image,
    }));
  });
})();


const CATEGORIES = [
  { id: "all", label: "All Photos", icon: Image, count: GALLERY_ITEMS.length },
  { id: "luxury-suite", label: "Luxury Suite", icon: Star, count: GALLERY_ITEMS.filter(i => i.category === "luxury-suite").length },
  { id: "private-rooms", label: "Private Rooms", icon: Building, count: GALLERY_ITEMS.filter(i => i.category === "private-rooms").length },
  { id: "dormitories", label: "Dormitories", icon: Users, count: GALLERY_ITEMS.filter(i => i.category === "dormitories").length },
];

const GallerySection = ({ asPageHeading = false }: { asPageHeading?: boolean } = {}) => {
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
          {asPageHeading ? (
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
              XTSY Photo Gallery — Shillong Hostel, Experience by XTSY & Meghalaya
            </h1>
          ) : (
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
              📸 Gallery
            </h2>
          )}
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Explore real photos of our dorms, private rooms, Experience by XTSY and Meghalaya experiences
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

      {/* Instagram-grade Preview */}
      <InstagramPreviewModal
        isOpen={lightboxOpen}
        images={allImageUrls}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        alt="XTSY Gallery"
      />
    </section>
  );
};

export default GallerySection;
