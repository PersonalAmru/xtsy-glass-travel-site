import { Star, BadgeCheck, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  source: string;
  roomType?: string;
  property: string;
  highlights?: string;
}

interface PremiumReviewCardProps {
  review: Review;
  onClick?: () => void;
  variant?: "carousel" | "grid" | "featured";
  isMobile?: boolean;
  index?: number;
}

// Generate consistent gradient based on name
const getAvatarGradient = (name: string) => {
  const gradients = [
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-cyan-500 via-teal-500 to-emerald-500",
    "from-orange-500 via-amber-500 to-yellow-500",
    "from-rose-500 via-pink-500 to-fuchsia-500",
    "from-blue-500 via-indigo-500 to-purple-500",
    "from-emerald-500 via-green-500 to-lime-500",
    "from-red-500 via-rose-500 to-pink-500",
    "from-sky-500 via-blue-500 to-indigo-500",
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
};

const getSourceColor = (source: string) => {
  switch (source) {
    case "Google":
      return "from-blue-500 to-blue-600";
    case "Booking.com":
      return "from-blue-600 to-blue-800";
    case "MakeMyTrip":
      return "from-red-500 to-red-600";
    case "Expedia":
      return "from-yellow-500 to-orange-500";
    default:
      return "from-gray-500 to-gray-600";
  }
};

const getPropertyColor = (property: string) => {
  if (property === "XTSY Luxury") return "from-purple-500 to-purple-600";
  return "from-orange-500 to-amber-500";
};

const PremiumReviewCard = ({ 
  review, 
  onClick, 
  variant = "carousel", 
  isMobile = false,
  index = 0 
}: PremiumReviewCardProps) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const ratingDisplay = review.source === "Google" || review.source === "MakeMyTrip" 
    ? `${review.rating}/5` 
    : `${review.rating}/10`;

  const isHighRating = review.rating >= 9 || (review.rating >= 4.5 && review.rating <= 5);

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer rounded-2xl transition-all duration-500",
        // Glassmorphism base
        "bg-white/[0.03] backdrop-blur-xl border border-white/10",
        // Subtle glow effect on hover
        !isMobile && "hover:bg-white/[0.06] hover:border-white/15 hover:shadow-lg hover:shadow-violet-500/10",
        !isMobile && "hover:scale-[1.02] hover:-translate-y-1",
        // Animation delay based on index
        "animate-fade-in",
        // Variant-specific sizing - compact cards with reduced padding
        variant === "carousel" && "h-[240px] p-4",
        variant === "grid" && "p-4",
        variant === "featured" && "p-5 md:p-6"
      )}
      style={{ 
        animationDelay: `${index * 100}ms`,
        animationFillMode: "both"
      }}
    >
      {/* Subtle glow behind card */}
      <div 
        className={cn(
          "absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none",
          !isMobile && "group-hover:opacity-30"
        )} 
        style={{ 
          background: "linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(217,70,239,0.2) 100%)",
          filter: "blur(12px)",
          zIndex: -1 
        }} 
      />

      {/* Quote icon */}
      <Quote 
        className={cn(
          "absolute top-4 right-4 text-white/5 transition-all duration-500",
          !isMobile && "group-hover:text-white/10 group-hover:scale-110",
          variant === "featured" ? "w-12 h-12" : "w-8 h-8"
        )} 
      />

      {/* Header with avatar and info */}
      <div className="flex items-start gap-2.5 mb-3">
        {/* Gradient Avatar */}
        <div 
          className={cn(
            "relative flex-shrink-0 rounded-full p-[2px]",
            `bg-gradient-to-br ${getAvatarGradient(review.name)}`,
            "shadow-md",
            !isMobile && "group-hover:shadow-lg group-hover:shadow-violet-500/20"
          )}
        >
          <div className={cn(
            "flex items-center justify-center rounded-full bg-slate-900/90 font-bold text-white",
            variant === "featured" ? "w-14 h-14 text-lg" : "w-11 h-11 text-sm"
          )}>
            {initials}
          </div>
          
          {/* Verified badge */}
          {isHighRating && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full p-0.5 shadow-lg">
              <BadgeCheck className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Name and meta */}
        <div className="flex-1 min-w-0">
          {/* Guest name */}
          <h4 className={cn(
            "font-semibold text-white truncate mb-1.5",
            variant === "featured" ? "text-lg" : "text-sm"
          )}>
            {review.name}
          </h4>
          
          {/* Rating badge - below name */}
          <div className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full mb-1.5",
            "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30"
          )}>
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-bold">{ratingDisplay}</span>
          </div>

          {/* Property badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium text-white",
              `bg-gradient-to-r ${getPropertyColor(review.property)}`
            )}>
              {review.property}
            </span>
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium text-white",
              `bg-gradient-to-r ${getSourceColor(review.source)}`
            )}>
              {review.source}
            </span>
          </div>

          {/* Date and room type */}
          <p className="text-[10px] text-white/40 mt-1 truncate">
            {review.date} {review.roomType && `• ${review.roomType}`}
          </p>
        </div>
      </div>

      {/* Review content */}
      <div className="flex-1">
        <p className={cn(
          "text-white/70 leading-relaxed",
          variant === "featured" ? "text-sm" : "text-xs",
          variant === "carousel" && "line-clamp-4"
        )}>
          {variant === "carousel" 
            ? truncateText(review.comment, 120) 
            : variant === "grid" 
              ? truncateText(review.comment, 200) 
              : review.comment}
        </p>
        
        {review.comment.length > (variant === "carousel" ? 120 : 200) && variant !== "featured" && (
          <p className={cn(
            "text-xs mt-2 font-medium transition-colors",
            "bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent",
            !isMobile && "group-hover:from-violet-300 group-hover:to-fuchsia-300"
          )}>
            Read full review →
          </p>
        )}
      </div>

      {/* Highlights */}
      {review.highlights && variant === "featured" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {review.highlights.split(" · ").slice(0, 4).map((highlight, i) => (
            <span 
              key={i}
              className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/60 border border-white/10"
            >
              {highlight}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PremiumReviewCard;
