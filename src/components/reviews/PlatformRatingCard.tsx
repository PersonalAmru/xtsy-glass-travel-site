import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformRatingCardProps {
  platform: string;
  rating: number;
  maxRating: number;
  isMobile?: boolean;
}

const getPlatformGradient = (platform: string) => {
  switch (platform) {
    case "Google":
      return { bg: "from-blue-500/20 to-blue-600/20", border: "border-blue-500/30", text: "text-blue-400" };
    case "Booking.com":
      return { bg: "from-blue-600/20 to-blue-800/20", border: "border-blue-600/30", text: "text-blue-400" };
    case "Expedia":
      return { bg: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/30", text: "text-yellow-400" };
    case "MakeMyTrip":
      return { bg: "from-red-500/20 to-red-600/20", border: "border-red-500/30", text: "text-red-400" };
    default:
      return { bg: "from-gray-500/20 to-gray-600/20", border: "border-gray-500/30", text: "text-gray-400" };
  }
};

const PlatformRatingCard = ({ platform, rating, maxRating, isMobile }: PlatformRatingCardProps) => {
  const colors = getPlatformGradient(platform);
  const fullStars = Math.floor(rating / (maxRating / 5));
  const hasHalfStar = (rating / (maxRating / 5)) % 1 >= 0.3;

  return (
    <div 
      className={cn(
        "group relative rounded-2xl p-5 transition-all duration-500",
        "bg-white/[0.03] backdrop-blur-xl border border-white/10",
        `bg-gradient-to-br ${colors.bg} ${colors.border}`,
        !isMobile && "hover:bg-white/[0.08] hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]"
      )}
    >
      {/* Glow effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none",
          !isMobile && "group-hover:opacity-50"
        )}
        style={{
          background: `radial-gradient(circle at center, ${platform === "Google" ? "rgba(59,130,246,0.3)" : platform === "Booking.com" ? "rgba(37,99,235,0.3)" : platform === "Expedia" ? "rgba(234,179,8,0.3)" : "rgba(239,68,68,0.3)"} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 text-center">
        {/* Platform name */}
        <h4 className={cn(
          "text-lg font-bold mb-2 transition-transform duration-300",
          colors.text,
          !isMobile && "group-hover:scale-110"
        )}>
          {platform}
        </h4>

        {/* Rating number */}
        <div className={cn(
          "text-4xl font-bold text-white mb-3 transition-all duration-300",
          !isMobile && "group-hover:text-5xl"
        )}>
          {rating}
          <span className="text-lg text-white/40">/{maxRating}</span>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={cn(
                "w-4 h-4 transition-all duration-300",
                i < fullStars 
                  ? "fill-yellow-400 text-yellow-400" 
                  : i === fullStars && hasHalfStar 
                    ? "fill-yellow-400/50 text-yellow-400"
                    : "fill-white/10 text-white/10",
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
