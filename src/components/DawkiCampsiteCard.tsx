/**
 * DawkiCampsiteCard - Minimal "Camping Experience" homepage card.
 * NOT a room card. Highlights experience + pricing + CTA to property page.
 */

import { memo } from "react";
import { Link } from "@/lib/router-compat";
import { motion } from "framer-motion";
import { Tent, Flame, Waves, ArrowRight, MapPin } from "lucide-react";
import UnifiedImage from "@/components/UnifiedImage";
import { Button } from "@/components/ui/button";
import { DAWKI_CAMPING_IMAGES } from "@/data/properties";

const DawkiCampsiteCard = memo(() => {
  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">New · Camping Experience</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">XTSY Adventure Campsite, Dawki</h2>
          </div>
          <Link
            to="/xtsy-adventure-campsite-dawki"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View campsite <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden border border-border bg-card group"
        >
          <div className="grid lg:grid-cols-5 min-h-[320px]">
            {/* Image side */}
            <div className="relative lg:col-span-3 aspect-[16/10] lg:aspect-auto">
              <UnifiedImage
                src={DAWKI_CAMPING_IMAGES[3]}
                alt="XTSY Adventure Campsite on the Umngot River in Dawki, Meghalaya"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs">
                <MapPin className="w-3.5 h-3.5" /> Dawki · Umngot Riverside
              </div>
            </div>

            {/* Content side */}
            <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Riverside tents on Asia's clearest river. Bonfires, kayaks and starlit skies for 80+ guests.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Tent className="w-4 h-4 text-primary" />
                    <span className="text-foreground/80">Pre-pitched riverside tents</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Flame className="w-4 h-4 text-primary" />
                    <span className="text-foreground/80">Bonfire under Khasi skies</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Waves className="w-4 h-4 text-primary" />
                    <span className="text-foreground/80">Kayak & boat on Umngot</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-3xl font-bold text-foreground">₹800</span>
                  <span className="text-sm text-muted-foreground">/ person · only camping</span>
                </div>
                 <p className="text-xs text-muted-foreground mb-1">Camping + Breakfast: <span className="font-semibold text-foreground">₹1,000</span> / person / night</p>
              </div>
              <Button asChild className="w-full mt-4">
                <Link to="/xtsy-adventure-campsite-dawki">
                  Explore the Campsite <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

DawkiCampsiteCard.displayName = "DawkiCampsiteCard";

export default DawkiCampsiteCard;
