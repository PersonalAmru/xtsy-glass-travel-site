import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Bike, User, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const promos = [
  {
    id: "couple",
    icon: Heart,
    label: "XTSY 270 Couple Retreat",
    highlight: "15% OFF",
    desc: "Luxury stay + curated tour",
    color: "from-rose-500 to-pink-600",
    anchor: "#travel-couple-luxury",
  },
  {
    id: "solo",
    icon: User,
    label: "Solo Traveller Pass",
    highlight: "NEW",
    desc: "Safe solo trips for him & her",
    color: "from-violet-500 to-indigo-600",
    anchor: "#travel-solo-bike",
  },
  {
    id: "bike",
    icon: Bike,
    label: "NE India Bike Tours",
    highlight: "ADVENTURE",
    desc: "Royal Enfield expeditions",
    color: "from-amber-500 to-orange-600",
    anchor: "#travel-solo-bike",
  },
];

const TravelPromoBanners = () => {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [currentIdx, setCurrentIdx] = useState(0);

  const visible = promos.filter((p) => !dismissed.has(p.id));

  useEffect(() => {
    if (visible.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % visible.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [visible.length]);

  if (visible.length === 0) return null;

  const current = visible[currentIdx % visible.length];

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-xs">
      <AnimatePresence mode="wait">
        <motion.a
          key={current.id}
          href={current.anchor}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`block relative bg-gradient-to-r ${current.color} text-white rounded-2xl p-4 pr-10 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform`}
          onClick={(e) => {
            e.preventDefault();
            const el = document.querySelector(current.anchor);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setDismissed((prev) => new Set([...prev, current.id]));
            }}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <current.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{current.label}</span>
                <span className="text-[10px] bg-white/30 px-1.5 py-0.5 rounded-full font-bold">
                  {current.highlight}
                </span>
              </div>
              <p className="text-xs text-white/80">{current.desc}</p>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-2">
            {visible.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === currentIdx % visible.length ? "w-4 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </motion.a>
      </AnimatePresence>
    </div>
  );
};

export default TravelPromoBanners;
