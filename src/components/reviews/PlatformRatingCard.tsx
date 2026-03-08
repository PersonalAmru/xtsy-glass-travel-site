import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformRatingCardProps {
  platform: string;
  rating: number;
  maxRating: number;
  isMobile?: boolean;
}

const PlatformRatingCard = ({ platform, rating, maxRating, isMobile }: PlatformRatingCardProps) => {
  const fullStars = Math.floor(rating / (maxRating / 5));
  const hasHalfStar = (rating / (maxRating / 5)) % 1 >= 0.3;

  return (
    <div 
      className={cn(
        "group relative rounded-2xl p-5 transition-all duration-300",
        "bg-card/60 backdrop-blur-xl border border-border",
        !isMobile && "hover:bg-card/80 hover:scale-105 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10"
      )}
    >
      {/* Glow effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none",
          !isMobile && "group-hover:opacity-30"
        )}
        style={{
          background: "radial-gradient(circle at center, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 text-center">
        {/* Platform name */}
        <h4 className={cn(
          "text-lg font-bold mb-2 transition-transform duration-300 text-foreground",
          !isMobile && "group-hover:scale-110"
        )}>
          {platform}
        </h4>

        {/* Rating number */}
        <div className={cn(
          "text-4xl font-bold text-primary mb-3 transition-all duration-300",
          !isMobile && "group-hover:text-5xl"
        )}>
          {rating}
          <span className="text-lg text-muted-foreground">/{maxRating}</span>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={cn(
                "w-4 h-4 transition-all duration-300",
                i < fullStars 
                  ? "fill-primary text-primary" 
                  : i === fullStars && hasHalfStar 
                    ? "fill-primary/50 text-primary"
                    : "fill-muted text-muted",
                !isMobile && "group-hover:scale-110"
              )}
              style={{ transitionDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformRatingCard;
