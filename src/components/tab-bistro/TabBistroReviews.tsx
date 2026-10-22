import { memo, useState } from "react";
import { Helmet } from '@/lib/seo/helmet';
import { Star, BadgeCheck, MessageSquare, Camera, Loader2, Send, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRestaurantReviews, type RestaurantReview } from "@/hooks/useRestaurantReviews";

const VISIT_TYPES = ["Dine in", "Takeaway", "Delivery", "Lunch", "Dinner", "Breakfast"];

const Stars = ({ value, className = "" }: { value: number; className?: string }) => (
  <div className={`flex items-center gap-0.5 ${className}`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const ReviewCard = memo(({ r }: { r: RestaurantReview }) => {
  const initials = r.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className="rounded-xl bg-card border border-border p-5 flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-foreground text-sm truncate">{r.name}</span>
            {r.verified && <BadgeCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Stars value={r.rating} />
            <span className="text-[11px] text-muted-foreground">{r.date}</span>
          </div>
          {(r.visitType || r.priceRange || r.localGuide) && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {[r.localGuide ? "Local Guide" : null, r.visitType, r.priceRange]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{r.comment}</p>

      {r.photos.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {r.photos.map((p) => (
            <img
              key={p}
              src={p}
              alt={`Photo from ${r.name}'s review of TAB Bistro`}
              loading="lazy"
              className="w-20 h-20 object-cover rounded-lg border border-border"
            />
          ))}
        </div>
      )}

      {r.ownerReply && (
        <div className="mt-3 pt-3 border-t border-border/60">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[11px] font-semibold text-amber-400">TAB Bistro by XTSY · Owner</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed mt-0.5">{r.ownerReply}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
ReviewCard.displayName = "ReviewCard";

interface Props {
  reviews: RestaurantReview[];
  stats: { count: number; average: number };
  submitReview: ReturnType<typeof useRestaurantReviews>["submitReview"];
  onSubmitted: () => void;
}

const TabBistroReviews = memo(({ reviews, stats, submitReview, onSubmitted }: Props) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [visitType, setVisitType] = useState("Dine in");
  const [photo, setPhoto] = useState<File | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? reviews : reviews.slice(0, 6);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "Please add your name", variant: "destructive" });
      return;
    }
    if (photo && photo.size > 5 * 1024 * 1024) {
      toast({ title: "Photo too large", description: "Please keep photos under 5 MB.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const res = await submitReview({ guestName: name, rating, reviewText: text, visitType, photo });
    setSubmitting(false);
    if (res.success) {
      toast({
        title: "Thank you! 🎉",
        description: "Your review was submitted and will appear once approved.",
      });
      setName("");
      setText("");
      setRating(5);
      setPhoto(null);
      setVisitType("Dine in");
      setOpen(false);
      onSubmitted();
    } else {
      toast({ title: "Could not submit review", description: res.error, variant: "destructive" });
    }
  };

  const aggSchema = stats.count
    ? {
        "@context": "https://schema.org",
        "@type": "AggregateRating",
        itemReviewed: { "@type": "Restaurant", name: "TAB Bistro by XTSY", servesCuisine: "Multi-cuisine" },
        ratingValue: stats.average.toFixed(1),
        reviewCount: stats.count,
        bestRating: 5,
        worstRating: 1,
      }
    : null;

  return (
    <section id="reviews">
      {aggSchema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(aggSchema)}</script>
        </Helmet>
      )}

      <div className="flex items-center gap-2 text-amber-400 mb-2">
        <Star className="w-5 h-5" />
        <span className="text-xs uppercase tracking-[0.15em] font-semibold">Guest Reviews</span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-2">
            What Diners Say About TAB Bistro
          </h2>
          {stats.count > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">{stats.average.toFixed(1)}</span>
              <div>
                <Stars value={Math.round(stats.average)} className="mb-0.5" />
                <span className="text-xs text-muted-foreground">{stats.count} reviews · Shillong</span>
              </div>
            </div>
          )}
        </div>
        <Button
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          onClick={() => setOpen((o) => !o)}
        >
          <Camera className="w-4 h-4 mr-2" /> Write a Review
        </Button>
      </div>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-card border border-border p-5 sm:p-6 mb-8 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rev-name">Your name</Label>
              <Input
                id="rev-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                placeholder="e.g. Aditi S."
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="rev-visit">Visit type</Label>
              <select
                id="rev-visit"
                value={visitType}
                onChange={(e) => setVisitType(e.target.value)}
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {VISIT_TYPES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Your rating</Label>
            <div className="flex items-center gap-1 mt-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${i} star`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(i)}
                  className="p-1"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      i <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="rev-text">Your review</Label>
            <Textarea
              id="rev-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="Tell other foodies about the food, cuisines, service and ambiance…"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="rev-photo" className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
              <ImagePlus className="w-4 h-4 text-amber-400" />
              {photo ? photo.name : "Add a photo (optional)"}
            </Label>
            <input
              id="rev-photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
          </div>

          <Button type="submit" disabled={submitting} className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
            {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Submit Review
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Reviews are published after a quick moderation check to keep ratings genuine.
          </p>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">Be the first to review TAB Bistro by XTSY.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((r) => (
              <ReviewCard key={r.id} r={r} />
            ))}
          </div>
          {reviews.length > 6 && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => setShowAll((s) => !s)}>
                {showAll ? "Show fewer" : `Show all ${reviews.length} reviews`}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
});

TabBistroReviews.displayName = "TabBistroReviews";
export default TabBistroReviews;
