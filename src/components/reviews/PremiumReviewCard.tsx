import { Star, BadgeCheck, Quote, MessageSquare } from "lucide-react";
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
  ownerReply?: string;
  travelType?: string;
  localGuide?: boolean;
}

interface PremiumReviewCardProps {
  review: Review;
  onClick?: () => void;
  variant?: "carousel" | "grid" | "featured";
  isMobile?: boolean;
  index?: number;
}

// Generate consistent gradient based on name — brand-aligned warm tones
const getAvatarGradient = (name: string) => {
  const gradients = [
    "from-primary via-brand-gold to-brand-accent",
    "from-brand-ember via-primary to-brand-gold",
    "from-brand-copper via-brand-ember to-primary",
    "from-brand-gold via-primary to-brand-ember",
    "from-primary via-brand-ember to-brand-copper",
    "from-brand-accent via-brand-gold to-primary",
    "from-brand-ember via-brand-copper to-brand-gold",
    "from-brand-gold via-brand-accent to-brand-ember",
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
};

const getSourceColor = (source: string) => {
  switch (source) {
    case "Google":
      return "bg-brand-verified";
    case "Booking.com":
      return "bg-brand-verified/80";
    case "MakeMyTrip":
      return "bg-brand-secondary";
    case "Goibibo":
      return "bg-brand-ember";
    case "Agoda":
      return "bg-brand-copper";
    case "Hostelworld":
      return "bg-brand-gold";
    case "Airbnb":
      return "bg-brand-secondary/80";
    case "Instagram":
      return "bg-gradient-to-r from-brand-ember to-brand-copper";
    case "Expedia":
      return "bg-brand-gold";
    default:
      return "bg-muted";
  }
};

// Sources rated on a 5-point scale (others use 10-point)
const FIVE_POINT_SOURCES = ["Google", "MakeMyTrip", "Goibibo", "Airbnb", "Instagram"];

const getPropertyColor = (property: string) => {
  if (property === "Experience by XTSY") return "bg-gradient-to-r from-brand-copper to-brand-ember";
  return "bg-gradient-to-r from-primary to-brand-gold";
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
        "group relative cursor-pointer rounded-2xl transition-all duration-300",
        // Glassmorphism base — brand aligned
        "bg-card/60 backdrop-blur-xl border border-border",
        // Subtle glow effect on hover
        !isMobile && "hover:bg-card/80 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10",
        !isMobile && "hover:scale-[1.02] hover:-translate-y-1",
        // Variant-specific sizing
        variant === "carousel" && "min-h-[260px] p-4",
        variant === "grid" && "p-4 animate-fade-in",
        variant === "featured" && "p-5 md:p-6 animate-fade-in"
      )}
      style={variant !== "carousel" ? { 
        animationDelay: `${index * 100}ms`,
        animationFillMode: "both"
      } : undefined}
    >
      {/* Subtle glow behind card */}
      <div 
        className={cn(
          "absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none",
          !isMobile && "group-hover:opacity-20"
        )} 
        style={{ 
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.3) 0%, hsl(var(--brand-ember) / 0.2) 100%)",
          filter: "blur(12px)",
          zIndex: -1 
        }} 
      />

      {/* Quote icon */}
      <Quote 
        className={cn(
          "absolute top-4 right-4 text-muted-foreground/10 transition-all duration-300",
          !isMobile && "group-hover:text-primary/15 group-hover:scale-110",
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
            !isMobile && "group-hover:shadow-lg group-hover:shadow-primary/20"
          )}
        >
          <div className={cn(
            "flex items-center justify-center rounded-full bg-background font-bold text-foreground",
            variant === "featured" ? "w-14 h-14 text-lg" : "w-11 h-11 text-sm"
          )}>
            {initials}
          </div>
          
          {/* Verified badge */}
          {isHighRating && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-success to-success/80 rounded-full p-0.5 shadow-lg">
              <BadgeCheck className="w-4 h-4 text-success-foreground" />
            </div>
          )}
        </div>

        {/* Name and meta */}
        <div className="flex-1 min-w-0">
          {/* Guest name */}
          <h4 className={cn(
            "font-semibold text-foreground truncate mb-1.5",
            variant === "featured" ? "text-lg" : "text-sm"
          )}>
            {review.name}
          </h4>
          
          {/* Rating badge - below name */}
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full mb-1.5 bg-primary/15 border border-primary/30">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="text-primary text-xs font-bold">{ratingDisplay}</span>
          </div>

          {/* Property badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium text-primary-foreground",
              getPropertyColor(review.property)
            )}>
              {review.property}
            </span>
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium text-primary-foreground",
              getSourceColor(review.source)
            )}>
              {review.source}
            </span>
          </div>

          {/* Date and room type */}
          <p className="text-[10px] text-muted-foreground mt-1 truncate">
            {review.date} {review.roomType && `• ${review.roomType}`}
          </p>
        </div>
      </div>

      {/* Review content */}
      <div className="flex-1">
        <p className={cn(
          "text-muted-foreground leading-relaxed",
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
            "text-xs mt-2 font-medium transition-colors text-primary",
            !isMobile && "group-hover:text-brand-gold"
          )}>
            Read full review →
          </p>
        )}
      </div>

      {/* Owner Reply */}
      {review.ownerReply && variant !== "carousel" && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
              <MessageSquare className="w-3 h-3 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-primary mb-0.5">XTSY Travellers Hostel · Owner</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {variant === "grid" ? (review.ownerReply.length > 80 ? review.ownerReply.slice(0, 80) + "..." : review.ownerReply) : review.ownerReply}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Owner Reply - Carousel compact */}
      {review.ownerReply && variant === "carousel" && (
        <div className="mt-2 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3 text-primary/60 flex-shrink-0" />
            <p className="text-[10px] text-muted-foreground truncate">
              <span className="font-medium text-primary/70">Owner: </span>
              {review.ownerReply.length > 50 ? review.ownerReply.slice(0, 50) + "..." : review.ownerReply}
            </p>
          </div>
        </div>
      )}

      {/* Highlights */}
      {review.highlights && variant === "featured" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {review.highlights.split(" · ").slice(0, 4).map((highlight, i) => (
            <span 
              key={i}
              className="text-[10px] px-2 py-1 rounded-full bg-secondary text-secondary-foreground border border-border"
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
