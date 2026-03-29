import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import TourBookingModal from "./TourBookingModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, Star, MapPin, X, ChevronLeft, ChevronRight, Mountain, Sparkles, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { TourItineraryService } from "@/utils/tourItineraryService";
import { TourPricingService } from "@/utils/tourPricingService";
import UnifiedImage from "./UnifiedImage";
import { motion, AnimatePresence } from "framer-motion";

import meghalayaHiddenGemsImg from "@/assets/meghalaya-hidden-gems-new.jpg";
import meghalayaNatureAuthenticImg from "@/assets/meghalaya-nature-authentic.jpg";
import shillongCulturalImg from "@/assets/shillong-meghalaya-real.jpg";
import shillongCherryBlossomImg from "@/assets/shillong-cherry-blossom.jpg";
import cherrapunjiMonsoonImg from "@/assets/nohkalikai-falls-real.jpg";
import dawkiRiverImg from "@/assets/umngot-river-dawki-real.jpg";
import dawkiCrystalClearAuthenticImg from "@/assets/dawki-crystal-clear-authentic.jpg";
import mawlynnongVillageImg from "@/assets/mawlynnong-village.jpg";
import garoHillsTribalImg from "@/assets/garo-hills-tribal.jpg";
import jaintiaCavesImg from "@/assets/jaintia-caves.jpg";
import photographyTourImg from "@/assets/photography-tour.jpg";
const wellnessRetreatImg = "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/download%20(26).jpg";
import offbeatCircuitImg from "@/assets/offbeat-circuit.jpg";
import khasiHillsTrekImg from "@/assets/khasi-hills-trek.jpg";
import tribalCircuitImg from "@/assets/tribal-circuit.jpg";
import livingRootBridgesImg from "@/assets/living-root-bridges.jpg";
import livingRootBridgesAuthenticImg from "@/assets/living-root-bridges-authentic.jpg";
import monsoonChallengeImg from "@/assets/monsoon-challenge.jpg";
import cavesCanyonsImg from "@/assets/caves-canyons.jpg";
import highAltitudeTrekImg from "@/assets/high-altitude-trek.jpg";
import remoteVillagesImg from "@/assets/remote-villages.jpg";
import researchExpeditionImg from "@/assets/research-expedition.jpg";
import meghalayaBiodiversityAuthenticImg from "@/assets/meghalaya-biodiversity-authentic.jpg";
import heritageTrailImg from "@/assets/heritage-trail.jpg";
import extremeWeatherImg from "@/assets/extreme-weather.jpg";
import valleyOfFlowersImg from "@/assets/valley-of-flowers.jpg";
import spitivalleyImg from "@/assets/spiti-valley.jpg";
import shimlaManaliImg from "@/assets/shimla-manali-honeymoon.jpg";
import rishikeshAdventureImg from "@/assets/rishikesh-adventure.jpg";
import keralaBakwatersImg from "@/assets/kerala-backwaters.jpg";
import keralaBackwatersAuthenticImg from "@/assets/kerala-backwaters-authentic.jpg";
import thekkadyWildlifeImg from "@/assets/thekkady-wildlife.jpg";
import tamilNaduTemplesImg from "@/assets/tamil-nadu-temples-new.jpg";
import dharamshalaImg from "@/assets/dharamshala-mcleodganj.jpg";
import nainitalImg from "@/assets/nainital-lake-district.jpg";
import ootyImg from "@/assets/ooty-kodaikanal.jpg";
import charDhamImg from "@/assets/char-dham-yatra.jpg";
import uttarakhandHimalayasImg from "@/assets/uttarakhand-himalayas.jpg";
import himachalValleysImg from "@/assets/himachal-valleys.jpg";
import assamTeaGardensImg from "@/assets/assam-tea-gardens-new.jpg";
import teaGardensAuthenticImg from "@/assets/tea-gardens-authentic.jpg";
import nagalandHornbillImg from "@/assets/nagaland-hornbill-premium.jpg";
import sikkimRhododendronsImg from "@/assets/sikkim-rhododendrons-premium.jpg";
const arunachalTribalImg = "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/download%20(25).jpg";
import manipurLoktakImg from "@/assets/manipur-loktak-premium.jpg";
import mizoramBambooImg from "@/assets/mizoram-bamboo-premium.jpg";
import tripuraTribalImg from "@/assets/tripura-tribal-premium.jpg";
import unakotiSculpturesImg from "@/assets/unakoti-sculptures-premium.jpg";
import pellingKanchenjungaImg from "@/assets/pelling-kanchenjunga.jpg";
import gurudongmarLakeImg from "@/assets/gurudongmar-lake.jpg";
import guwahatiKamakhyaImg from "@/assets/guwahati-kamakhya-premium.jpg";
import kohimaWarCemeteryImg from "@/assets/kohima-war-cemetery-premium.jpg";
import wildernessImg from "@/assets/wilderness-survival-final.jpg";
import wildernessAuthenticImg from "@/assets/wilderness-survival-authentic.jpg";

const northeastEcologicalEducationImg = "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg";

interface ItineraryDay {
  day: string;
  title: string;
  route?: string;
  activities: string[];
  overnight?: string;
}

interface TourPackage {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  price: string;
  image: string;
  images?: string[];
  rating: number;
  category: string;
  highlights: string[];
  bestSeason: string;
  location: string;
  itinerary?: ItineraryDay[];
}

interface TourPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourPackage: TourPackage | null;
}

interface OverallItinerary {
  phase: string;
  duration: string;
  description: string;
  highlights: string[];
  activities: string[];
}

const categoryColors: Record<string, string> = {
  adventure: "from-red-500 to-orange-500",
  cultural: "from-purple-500 to-indigo-500",
  leisure: "from-emerald-500 to-teal-500",
  educational: "from-blue-500 to-cyan-500",
};

const TourPackageModal: React.FC<TourPackageModalProps> = ({ isOpen, onClose, tourPackage }) => {
  const [overallItinerary, setOverallItinerary] = useState<OverallItinerary[]>([]);
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { formatPrice } = useApp();

  const getRelevantImage = () => {
    if (!tourPackage) return meghalayaNatureAuthenticImg;
    
    const title = tourPackage.title.toLowerCase();
    const description = tourPackage.description.toLowerCase();
    const highlights = tourPackage.highlights.join(' ').toLowerCase();
    const content = `${title} ${description} ${highlights}`;

    if (content.includes('northeast ecological education') || content.includes('ecological education program')) return northeastEcologicalEducationImg;
    if (content.includes('biodiversity') || content.includes('research') || content.includes('ecological')) return meghalayaBiodiversityAuthenticImg;
    if (content.includes('wilderness') || content.includes('survival skills') || content.includes('bushcraft')) return wildernessAuthenticImg;
    if (content.includes('meghalaya hidden gems') || content.includes('hidden gems')) return meghalayaNatureAuthenticImg;
    if (content.includes('shillong day tour') || content.includes('cherry blossom')) return shillongCherryBlossomImg;
    if (content.includes('shillong') || content.includes('cultural experience')) return shillongCulturalImg;
    if (content.includes('cherrapunji') || content.includes('nohkalikai') || content.includes('monsoon trek')) return cherrapunjiMonsoonImg;
    if (content.includes('dawki') || content.includes('umngot') || content.includes('crystal clear')) return dawkiCrystalClearAuthenticImg;
    if (content.includes('mawlynnong') || content.includes('cleanest village')) return mawlynnongVillageImg;
    if (content.includes('garo hills') || content.includes('garo tribal')) return garoHillsTribalImg;
    if (content.includes('jaintia') || content.includes('caves') || content.includes('limestone')) return jaintiaCavesImg;
    if (content.includes('living root bridges') || content.includes('root bridge')) return livingRootBridgesAuthenticImg;
    if (content.includes('khasi hills') || content.includes('khasi')) return khasiHillsTrekImg;
    if (content.includes('photography') || content.includes('photo')) return photographyTourImg;
    if (content.includes('wellness') || content.includes('yoga') || content.includes('meditation')) return wellnessRetreatImg;
    if (content.includes('offbeat') || content.includes('circuit')) return offbeatCircuitImg;
    if (content.includes('tribal') && content.includes('circuit')) return tribalCircuitImg;
    if (content.includes('monsoon challenge') || content.includes('extreme')) return monsoonChallengeImg;
    if (content.includes('caves and canyons') || content.includes('spelunking')) return cavesCanyonsImg;
    if (content.includes('high altitude') || content.includes('technical climbing')) return highAltitudeTrekImg;
    if (content.includes('remote villages') || content.includes('isolated')) return remoteVillagesImg;
    if (content.includes('research') || content.includes('expedition')) return researchExpeditionImg;
    if (content.includes('heritage') || content.includes('historical')) return heritageTrailImg;
    if (content.includes('extreme weather') || content.includes('survival')) return extremeWeatherImg;
    if (content.includes('valley of flowers') || content.includes('uttarakhand flowers')) return valleyOfFlowersImg;
    if (content.includes('spiti') || content.includes('cold desert')) return spitivalleyImg;
    if (content.includes('shimla') || content.includes('manali') || content.includes('honeymoon')) return shimlaManaliImg;
    if (content.includes('rishikesh') || content.includes('rafting') || content.includes('yoga capital')) return rishikeshAdventureImg;
    if (content.includes('dharamshala') || content.includes('mcleodganj') || content.includes('dalai lama')) return dharamshalaImg;
    if (content.includes('nainital') || content.includes('lake district')) return nainitalImg;
    if (content.includes('char dham') || content.includes('pilgrimage')) return charDhamImg;
    if (content.includes('uttarakhand') || content.includes('himalaya')) return uttarakhandHimalayasImg;
    if (content.includes('himachal') || content.includes('valleys')) return himachalValleysImg;
    if (content.includes('kerala') || content.includes('backwater')) return keralaBackwatersAuthenticImg;
    if (content.includes('thekkady') || content.includes('wildlife') || content.includes('periyar')) return thekkadyWildlifeImg;
    if (content.includes('tamil nadu') || content.includes('temple') || content.includes('dravidian')) return tamilNaduTemplesImg;
    if (content.includes('ooty') || content.includes('kodaikanal') || content.includes('nilgiri')) return ootyImg;
    if (content.includes('assam') || content.includes('tea garden')) return teaGardensAuthenticImg;
    if (content.includes('nagaland') || content.includes('hornbill') || content.includes('festival')) return nagalandHornbillImg;
    if (content.includes('sikkim') || content.includes('rhododendron') || content.includes('flower')) return sikkimRhododendronsImg;
    if (content.includes('arunachal') || content.includes('tribal festival')) return arunachalTribalImg;
    if (content.includes('manipur') || content.includes('loktak') || content.includes('floating')) return manipurLoktakImg;
    if (content.includes('mizoram') || content.includes('bamboo')) return mizoramBambooImg;
    if (content.includes('tripura') || content.includes('tribal')) return tripuraTribalImg;
    if (content.includes('unakoti') || content.includes('sculpture')) return unakotiSculpturesImg;
    if (content.includes('pelling') || content.includes('kanchenjunga')) return pellingKanchenjungaImg;
    if (content.includes('gurudongmar') || content.includes('lake')) return gurudongmarLakeImg;
    if (content.includes('guwahati') || content.includes('kamakhya')) return guwahatiKamakhyaImg;
    if (content.includes('kohima') || content.includes('war cemetery')) return kohimaWarCemeteryImg;

    switch (tourPackage.category) {
      case 'adventure': return highAltitudeTrekImg;
      case 'cultural': return tribalCircuitImg;
      case 'leisure': return wellnessRetreatImg;
      default: return meghalayaNatureAuthenticImg;
    }
  };

  useEffect(() => {
    if (isOpen && tourPackage) {
      setActiveImageIndex(0);
      fetchOverallItinerary();
    }
  }, [isOpen, tourPackage]);

  useEffect(() => {
    if (isOpen && location.pathname === '/travel') {
      const urlParams = new URLSearchParams(location.search);
      const currentTab = urlParams.get('tab') || 'domestic';
      localStorage.setItem('lastTravelTab', currentTab);
    }
  }, [isOpen, location]);

  const handleClose = () => {
    if (location.pathname === '/travel') {
      const lastTab = localStorage.getItem('lastTravelTab') || 'domestic';
      navigate(`/travel?tab=${lastTab}`, { replace: true });
    }
    onClose();
  };

  const fetchOverallItinerary = async () => {
    if (!tourPackage) return;
    setIsLoadingItinerary(true);
    try {
      const days = TourItineraryService.extractDays(tourPackage.duration);
      const overallView = generateOverallItineraryView(tourPackage, days);
      setOverallItinerary(overallView);
    } catch (error) {
      console.error('Error generating overall itinerary:', error);
      setOverallItinerary(generateFallbackOverallItinerary());
    } finally {
      setIsLoadingItinerary(false);
    }
  };

  const generateOverallItineraryView = (tourPackage: TourPackage, totalDays: number): OverallItinerary[] => {
    const phases: OverallItinerary[] = [];
    const arrivalDuration = totalDays <= 3 ? "Day 1" : "Days 1-2";
    phases.push({ phase: "Arrival & Introduction", duration: arrivalDuration, description: getArrivalPhaseDescription(tourPackage), highlights: getArrivalHighlights(tourPackage.highlights), activities: getArrivalActivities(tourPackage) });
    if (totalDays > 1) {
      const coreDuration = totalDays <= 3 ? "Day 2" : totalDays <= 5 ? "Days 3-4" : `Days 3-${totalDays-1}`;
      phases.push({ phase: "Adventure & Exploration", duration: coreDuration, description: getCorePhaseDescription(tourPackage), highlights: getCoreHighlights(tourPackage.highlights), activities: getCoreActivities(tourPackage) });
    }
    if (totalDays >= 3) {
      phases.push({ phase: "Final Experiences & Farewell", duration: `Day ${totalDays}`, description: getFinalPhaseDescription(tourPackage), highlights: getFinalHighlights(tourPackage.highlights), activities: getFinalActivities(tourPackage) });
    }
    return phases;
  };

  const getArrivalPhaseDescription = (tp: TourPackage) => {
    const t = tp.title.toLowerCase();
    if (t.includes('meghalaya')) return "Welcome to the enchanting land of clouds! Experience traditional Khasi hospitality and begin your journey through mystical landscapes.";
    if (t.includes('biodiversity') || t.includes('research')) return "Meet expert naturalists and get introduced to the incredible ecosystems and wildlife you'll encounter during your adventure.";
    if (t.includes('wellness') || t.includes('yoga')) return "Arrive at your wellness sanctuary and begin your transformative journey with gentle introduction to healing practices.";
    return "Warm welcome and introduction to your adventure destination with local culture immersion and journey overview.";
  };
  const getCorePhaseDescription = (tp: TourPackage) => {
    const c = tp.category.toLowerCase(); const t = tp.title.toLowerCase();
    if (t.includes('biodiversity') || t.includes('research')) return "Deep exploration of pristine wilderness, wildlife tracking, and nature discovery with expert guides.";
    if (c === 'adventure') return "Thrilling adventures through breathtaking landscapes, challenging treks, and unforgettable experiences.";
    if (c === 'cultural') return "Immersive cultural experiences, traditional interactions, and authentic local lifestyle discovery.";
    return "Core adventure activities showcasing the best of your chosen destination with expert local guidance.";
  };
  const getFinalPhaseDescription = (_tp: TourPackage) => "Conclude your adventure with final explorations, souvenir collection, and cherished memories to last a lifetime.";
  const getArrivalHighlights = (h: string[]) => h.slice(0, Math.ceil(h.length * 0.3));
  const getCoreHighlights = (h: string[]) => { const s = Math.ceil(h.length * 0.3); return h.slice(s, s + Math.ceil(h.length * 0.5)); };
  const getFinalHighlights = (h: string[]) => h.slice(Math.ceil(h.length * 0.8));
  const getArrivalActivities = (_tp: TourPackage) => ["Welcome ceremony", "Local area orientation", "Cultural introduction", "Adventure briefing"];
  const getCoreActivities = (tp: TourPackage) => {
    const t = tp.title.toLowerCase();
    if (t.includes('trek') || t.includes('adventure')) return ["Guided expeditions", "Nature exploration", "Photography sessions", "Adventure activities"];
    if (t.includes('cultural')) return ["Village visits", "Cultural performances", "Traditional crafts", "Local interactions"];
    return ["Main attractions", "Adventure activities", "Local experiences", "Scenic exploration"];
  };
  const getFinalActivities = (_tp: TourPackage) => ["Final adventures", "Souvenir shopping", "Memory sharing", "Farewell celebration"];
  const generateFallbackOverallItinerary = (): OverallItinerary[] => [
    { phase: "Arrival & Welcome", duration: "Day 1", description: "Warm welcome and introduction to your adventure destination.", highlights: ["Local welcome", "Journey briefing"], activities: ["Arrival experience", "Local orientation"] },
    { phase: "Adventure & Exploration", duration: "Main Days", description: "Core adventure activities and unforgettable experiences.", highlights: ["Main attractions", "Adventure activities"], activities: ["Guided tours", "Adventure experiences"] }
  ];

  if (!tourPackage) return null;

  const handlePayAndConfirm = () => {
    const welcomeMessage = `🏠 *XTSY Travellers Hostel - Tour Inquiry*\n\nNamaste Team XTSY! 🙏\n\nI'd like to know more about the "${tourPackage.title}" tour package.\n\n📍 *Tour Details:*\n   • Duration: ${tourPackage.duration}\n   • Category: ${tourPackage.category}\n   • Best Season: ${tourPackage.bestSeason}\n   • Location: ${tourPackage.location}\n\nCould you please share availability and detailed pricing?\n\nLooking forward to exploring with XTSY! 🌟`;
    const whatsappURL = `https://api.whatsapp.com/send/?phone=918837317070&text=${encodeURIComponent(welcomeMessage)}&type=phone_number&app_absent=0`;
    window.open(whatsappURL, '_blank');
    handleClose();
  };

  const allImages = tourPackage.images && tourPackage.images.length > 1
    ? [...new Set([tourPackage.image, ...tourPackage.images])]
    : [tourPackage.image];

  const gradientClass = categoryColors[tourPackage.category] || "from-amber-500 to-orange-500";

  return (
    <>
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        data-testid="tour-package-modal"
        className="max-w-4xl p-0 gap-0 overflow-hidden bg-background border-0 shadow-2xl rounded-2xl"
        style={{
          position: 'fixed',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(calc(100vw - 16px), 56rem)',
          maxHeight: 'min(calc(100vh - 32px), 92vh)',
          margin: 0,
        }}
      >
        <div className="overflow-y-auto max-h-[min(calc(100vh-32px),92vh)]">
          {/* Immersive Hero Section */}
          <div className="relative h-72 sm:h-80 md:h-96 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <UnifiedImage
                  src={allImages[activeImageIndex] || getRelevantImage()}
                  alt={tourPackage.title}
                  className="w-full h-full object-cover"
                  threshold={0.1}
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-10`} />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2.5 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-full text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex(i => (i - 1 + allImages.length) % allImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-full text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIndex(i => (i + 1) % allImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-full text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === activeImageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Hero content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={`bg-gradient-to-r ${gradientClass} text-white border-0 text-xs font-semibold px-3 py-1`}>
                  {tourPackage.category}
                </Badge>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-medium">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {tourPackage.rating}
                </div>
              </div>
              <DialogHeader className="text-left space-y-0">
                <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                  {tourPackage.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Book your {tourPackage.title} tour package
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-1.5 mt-2 text-white/80 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                <span>{tourPackage.location}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-3 border-b border-border bg-muted/30">
            <div className="flex flex-col items-center py-4 gap-1 border-r border-border">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">{tourPackage.duration}</span>
              <span className="text-[10px] text-muted-foreground">Duration</span>
            </div>
            <div className="flex flex-col items-center py-4 gap-1 border-r border-border">
              <Mountain className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">{tourPackage.difficulty}</span>
              <span className="text-[10px] text-muted-foreground">Difficulty</span>
            </div>
            <div className="flex flex-col items-center py-4 gap-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">{tourPackage.bestSeason}</span>
              <span className="text-[10px] text-muted-foreground">Best Season</span>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-6 space-y-6">
            {/* Description */}
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {tourPackage.description}
            </p>

            {/* Highlights */}
            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Package Highlights
              </h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {tourPackage.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2.5 bg-muted/40 rounded-xl px-3 py-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                {tourPackage.itinerary ? "Day-by-Day Itinerary" : "Itinerary Overview"}
              </h4>
              {tourPackage.itinerary ? (
                <div className="space-y-3">
                  {tourPackage.itinerary.map((day, index) => (
                    <div key={index} className="relative pl-6 pb-3 border-l-2 border-primary/20 last:border-l-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background" />
                      <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h5 className="font-semibold text-foreground text-sm leading-tight">{day.title}</h5>
                          <Badge variant="outline" className="text-xs whitespace-nowrap border-primary/30 text-primary">{day.day}</Badge>
                        </div>
                        {day.route && (
                          <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/5 px-2.5 py-1 rounded-lg mb-2 w-fit">
                            <MapPin className="h-3 w-3" />
                            <span>{day.route}</span>
                          </div>
                        )}
                        <div className="space-y-1">
                          {day.activities.map((activity, aIndex) => (
                            <div key={aIndex} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-1.5 flex-shrink-0" />
                              <span className="text-xs text-muted-foreground">{activity}</span>
                            </div>
                          ))}
                        </div>
                        {day.overnight && (
                          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                            🏨 <span className="font-medium">Overnight:</span> {day.overnight}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : isLoadingItinerary ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">Creating tour overview...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {overallItinerary.map((phase, index) => (
                    <div key={index} className="relative pl-6 pb-3 border-l-2 border-primary/20 last:border-l-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background" />
                      <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-semibold text-foreground text-sm">{phase.phase}</h5>
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">{phase.duration}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">{phase.description}</p>
                        {phase.highlights.length > 0 && (
                          <div className="bg-primary/5 p-3 rounded-lg mb-2">
                            <p className="text-xs font-medium text-primary mb-1.5">Highlights:</p>
                            <div className="space-y-1">
                              {phase.highlights.map((h, hI) => (
                                <div key={hI} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                  <span className="text-xs text-foreground">{h}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {phase.activities.length > 0 && (
                          <div className="grid grid-cols-2 gap-1">
                            {phase.activities.map((a, aI) => (
                              <div key={aI} className="flex items-center gap-1.5">
                                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                <span className="text-xs text-muted-foreground">{a}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-primary/5 via-muted/30 to-primary/5 border border-primary/20 rounded-2xl p-5">
              <h4 className="font-bold text-foreground mb-1 text-center text-lg">Tour Package Pricing</h4>
              <p className="text-xs text-muted-foreground text-center mb-4">Starting from — Private Touring (per person)</p>
              {(() => {
                const basePrice = parseInt(tourPackage.price.replace(/[^\d]/g, ''));
                const group4PP = Math.round(basePrice * 0.90);
                const group6PP = Math.round(basePrice * 0.85);
                return (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center bg-card rounded-xl p-3 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Solo / Couple</p>
                      <p className="font-bold text-lg text-primary">{formatPrice(basePrice)}</p>
                      <p className="text-[10px] text-muted-foreground">per person</p>
                    </div>
                    <div className="text-center bg-card rounded-xl p-3 border border-emerald-500/30 relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">SAVE 10%</div>
                      <p className="text-xs text-muted-foreground mb-1">Group of 4</p>
                      <p className="font-bold text-lg text-emerald-600">{formatPrice(group4PP)}</p>
                      <p className="text-[10px] text-muted-foreground">per person</p>
                    </div>
                    <div className="text-center bg-card rounded-xl p-3 border border-emerald-500/40 relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">SAVE 15%</div>
                      <p className="text-xs text-muted-foreground mb-1">Group of 6</p>
                      <p className="font-bold text-lg text-emerald-700">{formatPrice(group6PP)}</p>
                      <p className="text-[10px] text-muted-foreground">per person</p>
                    </div>
                  </div>
                );
              })()}
              <p className="text-[10px] text-muted-foreground text-center mt-3">
                Prices exclude transport to base city • GST as applicable • Customisable for couples & families
              </p>
            </div>

            {/* CTA */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur-md pt-4 pb-2 -mx-5 sm:-mx-6 px-5 sm:px-6 border-t border-border">
              <Button
                onClick={() => setIsBookingOpen(true)}
                size="lg"
                className={`w-full bg-gradient-to-r ${gradientClass} hover:opacity-90 text-white font-bold py-6 rounded-xl text-base shadow-lg transition-all`}
              >
                Book This Tour
              </Button>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Submit an enquiry • Our travel curator will confirm within 2 hours
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <TourBookingModal
      isOpen={isBookingOpen}
      onClose={() => setIsBookingOpen(false)}
      tourPackage={tourPackage}
    />
    </>
  );
};

export default TourPackageModal;
