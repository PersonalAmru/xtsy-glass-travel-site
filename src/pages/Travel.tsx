import React, { useState, useEffect, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Globe, Package, Bell, Mail, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompactTourPackageCard from "@/components/CompactTourPackageCard";
import { LazyTourPackageModal } from "@/components/lazy/LazyTourPackageModal";
import { AuthModal } from "@/components/AuthModal";
import LazyWrapper from "@/components/LazyWrapper";
import SEOContent from "@/components/SEOContent";
import { TourPricingService } from "@/utils/tourPricingService";
import OptimizedLazyImage from "@/components/OptimizedLazyImage";

// Import images for tour packages
import meghalayaBiodiversityAuthenticImg from "@/assets/meghalaya-biodiversity-authentic.jpg";
import wildernessSurvivalImg from "@/assets/wilderness-survival-authentic.jpg";
import northeastBikeExpeditionImg from "@/assets/motorcycle-group-adventure.jpg";
import arunachalTribalImg from "@/assets/arunachal-tribal-premium.jpg";
import livingRootBridgesImg from "@/assets/living-root-bridges-authentic.jpg";
import dawkiCrystalClearImg from "@/assets/dawki-crystal-clear-authentic.jpg";
import assamTeaGardensImg from "@/assets/assam-tea-gardens-premium.jpg";
import manipurLoktakImg from "@/assets/manipur-loktak-premium.jpg";
import tripuraTribalImg from "@/assets/tripura-tribal-premium.jpg";
import charDhamYatraImg from "@/assets/char-dham-yatra.jpg";
import nainitalLakeImg from "@/assets/nainital-lake-district.jpg";
import sikkimRhododendronImg from "@/assets/sikkim-rhododendrons-premium.jpg";
import pellingKanchenjungaImg from "@/assets/pelling-kanchenjunga.jpg";
import gurudongmarLakeImg from "@/assets/gurudongmar-lake-high-altitude-stock.jpg";
import keralaBackwatersImg from "@/assets/kerala-backwaters-authentic.jpg";

import thekkadyWildlifeImg from "@/assets/thekkady-wildlife.jpg";
import tamilNaduTemplesImg from "@/assets/tamil-nadu-temples-new.jpg";
import ootyKodaikanalImg from "@/assets/ooty-kodaikanal.jpg";
import meghalayaHiddenGemsImg from "@/assets/meghalaya-hidden-gems-final.jpg";
import cherrapunjiWaterfallsImg from "@/assets/cherrapunji-waterfalls-premium.jpg";
import shillongCulturalImg from "@/assets/shillong-cultural-new.jpg";
import shillongCherryBlossomImg from "@/assets/shillong-cherry-blossom.jpg";
import mawlynnongCleanImg from "@/assets/mawlynnong-cleanest-village-premium.jpg";
import nagalandHornbillImg from "@/assets/nagaland-hornbill-premium.jpg";
import mizoramBambooImg from "@/assets/mizoram-bamboo-premium.jpg";
import kohimaWarImg from "@/assets/kohima-war-cemetery-premium.jpg";
import valleyOfFlowersImg from "@/assets/valley-of-flowers-stock.jpg";
import kedarnathTrekImg from "@/assets/kedarnath-temple-trek-stock.jpg";
import rishikeshAdventureImg from "@/assets/rishikesh-adventure-sports-stock.jpg";
import haridwarSpiritualImg from "@/assets/haridwar-rishikesh-spiritual-stock.jpg";
import spitiValleyImg from "@/assets/spiti-valley-adventure-stock.jpg";
import shimlaManaliImg from "@/assets/shimla-manali-honeymoon-stock.jpg";
import kasauliSolanImg from "@/assets/kasauli-solan-hill-station-stock.jpg";

// Lazy load image imports using dynamic imports
const loadImages = {
  arunachalEagleFestival: () => import("@/assets/arunachal-eagle-festival-stock.jpg"),
  dharamshalaMcleodGanj: () => import("@/assets/dharamshala-mcleod-ganj-stock.jpg"),
  kulluValleyAdventure: () => import("@/assets/kullu-valley-adventure-stock.jpg")
};

// All image assets removed - Supabase ready
// Image arrays for future Supabase URL assignments
const meghalayaImages = ["", "", ""];
const himachalImages = ["", "", ""];
const keralImages = ["", "", ""];
const uttarakhandImages = ["", "", ""];
const sikkimImages = ["", "", ""];
const tamilNaduImages = ["", "", ""];

// Individual destination images - placeholders for Supabase URLs
const meghalayaHero = "";
const uttarakhandImage = "";
const sikkimImage = "";
const himachalImage = "";
const keralaImage = "";
const tamilNaduImage = "";

// Additional categorized images - placeholders for Supabase URLs
const waterfallImage = "";
const mountainImage = "";
const lakeImage = "";
const templeImage = "";
const forestImage = "";
const cultureImage = "";
const adventureImage = "";
const hillStationImage = "";

// International travel images - placeholders for Supabase URLs
const internationalTravelImage = "";
const asiaImage = "";
const merchandiseImage = "";

const Travel = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [loadedImages, setLoadedImages] = useState<{[key: string]: string}>({});

  // Lazy load images on demand
  const loadImageAsync = async (imageKey: string) => {
    if (loadedImages[imageKey]) return loadedImages[imageKey];
    
    try {
      const imageModule = await loadImages[imageKey as keyof typeof loadImages]();
      const imageSrc = imageModule.default;
      setLoadedImages(prev => ({ ...prev, [imageKey]: imageSrc }));
      return imageSrc;
    } catch (error) {
      console.warn(`Failed to load image: ${imageKey}`);
      return "";
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab === 'domestic' || tab === 'international') {
      setActiveTab(tab);
    }
    // Scroll to top when navigating to this page
    window.scrollTo(0, 0);
  }, [location.search]);

  // Preload critical images after component mounts
  useEffect(() => {
    const preloadCriticalImages = async () => {
      await Promise.all([
        loadImageAsync('arunachalEagleFestival'),
        loadImageAsync('dharamshalaMcleodGanj'),
        loadImageAsync('kulluValleyAdventure')
      ]);
    };
    
    // Delay preloading to not block initial render
    const timer = setTimeout(preloadCriticalImages, 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePackageClick = (itinerary: any) => {
    setSelectedPackage(itinerary);
    setIsModalOpen(true);
  };

  const handleNewsletterClick = () => {
    setIsAuthModalOpen(true);
  };

  // Enhanced tour packages data organized by states
  const stateWiseTourPackages = {
    "XTSY Exclusive Tours": [
      {
        id: 201,
        title: "XTSY Exclusive: Meghalaya Biodiversity Research Program",
        description: "Educational wilderness expedition studying Northeast India's unique flora, fauna and ecosystems with expert naturalists",
        duration: "7 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("7 Days", "exclusive", "Moderate", "Northeast India", "Oct-Mar"),
        image: meghalayaBiodiversityAuthenticImg,
        images: [meghalayaBiodiversityAuthenticImg, meghalayaBiodiversityAuthenticImg, meghalayaBiodiversityAuthenticImg],
        rating: 4.9,
        category: "cultural",
        location: "Northeast India",
        highlights: ["Expert Naturalist Guides", "Endemic Species Study", "Research Documentation", "Conservation Workshops", "Field Studies", "Night Safari", "Botanical Gardens"],
        bestSeason: "Oct-Mar",
        exclusive: true
      },
      {
        id: 202,
        title: "XTSY Exclusive: Wilderness Survival & Nature Immersion",
        description: "Ultimate wilderness education program teaching survival skills, nature connection and sustainable living practices",
        duration: "5 Days", 
        difficulty: "Challenging",
        price: TourPricingService.calculatePrice("5 Days", "exclusive", "Challenging", "Northeast India", "Nov-Apr"),
        image: wildernessSurvivalImg,
        images: [wildernessSurvivalImg, wildernessSurvivalImg, wildernessSurvivalImg],
        rating: 4.8,
        category: "adventure",
        location: "Northeast India",
        highlights: ["Survival Skills Training", "Wilderness Navigation", "Natural Shelter Building", "Foraging Education", "Water Purification", "Fire Making", "Leave No Trace Principles"],
        bestSeason: "Nov-Apr",
        exclusive: true
      },
      {
        id: 203,
        title: "XTSY Exclusive: Northeast Ecological Education Program",
        description: "Comprehensive nature education course exploring biodiversity hotspots, endemic species, and conservation efforts",
        duration: "8 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("8 Days", "exclusive", "Easy", "Northeast India", "Oct-Mar"),
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg",
        images: ["", "", ""],
        rating: 4.9,
        category: "educational",
        location: "Northeast India",
        highlights: ["Environmental Science", "Wildlife Photography", "Plant Identification", "Ecosystem Mapping", "Citizen Science Projects", "Climate Change Studies", "Sustainable Practices"],
        bestSeason: "Oct-Mar",
        exclusive: true
      },
      {
        id: 204,
        title: "XTSY Exclusive: Traditional Knowledge & Ethnobotany Course",
        description: "Learn indigenous plant wisdom, traditional medicine, and sustainable harvesting practices from tribal communities",
        duration: "6 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("6 Days", "exclusive", "Moderate", "Northeast India", "Nov-Apr"),
        image: arunachalTribalImg,
        images: [arunachalTribalImg, arunachalTribalImg, arunachalTribalImg],
        rating: 4.8,
        category: "cultural",
        location: "Northeast India",
        highlights: ["Medicinal Plant Studies", "Indigenous Knowledge", "Herbal Medicine Preparation", "Sacred Grove Visits", "Traditional Healing", "Cultural Exchange", "Documentation Methods"],
        bestSeason: "Nov-Apr",
        exclusive: true
      },
      {
        id: 207,
        title: "XTSY Exclusive: Arunachal Pradesh Mountain Yoga Retreat",
        description: "Experience profound peace and spiritual awakening amidst the pristine peaks of Arunachal Pradesh",
        duration: "8 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("8 Days", "exclusive", "Moderate", "Arunachal Pradesh", "Mar-Oct"),
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/download%20(25).jpg",
        images: ["https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/download%20(25).jpg", "", ""],
        rating: 4.9,
        category: "wellness",
        location: "Arunachal Pradesh",
        highlights: ["Alpine Yoga", "Buddhist Meditation", "Mountain Trekking", "Monastery Visits", "Tibetan Healing", "High Altitude Training", "Sunrise Sadhana"],
        bestSeason: "Mar-Oct",
        exclusive: true
      },
      {
        id: 208,
        title: "XTSY Exclusive: Assam - Arunachal - Meghalaya RE Expedition",
        description: "Epic motorcycle adventure across Northeast India's three jewels - from Assam's tea gardens through Arunachal's mountains to Meghalaya's living bridges",
        duration: "12 Days",
        difficulty: "Challenging",
        price: TourPricingService.calculatePrice("12 Days", "exclusive", "Challenging", "Northeast India", "Oct-Apr"),
        image: northeastBikeExpeditionImg,
        images: [northeastBikeExpeditionImg, northeastBikeExpeditionImg, northeastBikeExpeditionImg],
        rating: 4.9,
        category: "adventure",
        location: "Northeast India",
        highlights: ["Royal Enfield Bikes", "Mountain Passes", "Tea Garden Rides", "Tribal Villages", "Living Root Bridges", "Border Roads", "Mechanic Support", "Local Guides"],
        bestSeason: "Oct-Apr",
        exclusive: true
      }
    ],
    
    "Meghalaya": [
      {
        id: 1,
        title: "Meghalaya Hidden Gems",
        description: "Discover the unexplored waterfalls and living root bridges of Meghalaya",
        duration: "5 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("5 Days", "adventure", "Moderate", "Meghalaya", "Oct-Mar"),
        image: livingRootBridgesImg,
        images: [livingRootBridgesImg, livingRootBridgesImg, livingRootBridgesImg],
        rating: 4.8,
        category: "adventure",
        location: "Meghalaya",
        highlights: ["Double Decker Root Bridge", "Rainbow Falls", "Crystal Clear Pools"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 4,
        title: "Dawki River Adventure",
        description: "Crystal clear waters and boating experience at Indo-Bangladesh border",
        duration: "2 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("2 Days", "leisure", "Easy", "Meghalaya", "Nov-May"),
        image: dawkiCrystalClearImg,
        images: [dawkiCrystalClearImg, dawkiCrystalClearImg, dawkiCrystalClearImg],
        rating: 4.7,
        category: "leisure",
        location: "Meghalaya",
        highlights: ["Umngot River", "Transparent Water Boating", "Border Views"],
        bestSeason: "Nov-May"
      },
      {
        id: 5,
        title: "Shillong Day Tour",
        description: "Explore the Scotland of East with cherry blossoms, colonial architecture, and vibrant local markets",
        duration: "1 Day",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("1 Day", "cultural", "Easy", "Meghalaya", "Mar-May"),
        image: shillongCherryBlossomImg,
        images: [shillongCherryBlossomImg, shillongCherryBlossomImg, shillongCherryBlossomImg],
        rating: 4.6,
        category: "cultural",
        location: "Meghalaya",
        highlights: ["Cherry Blossom Gardens", "Don Bosco Museum", "Police Bazaar", "Ward's Lake", "Elephant Falls"],
        bestSeason: "Mar-May"
      },
    ],
    
    "Northeast States": [
      {
        id: 21,
        title: "Arunachal Pradesh Eagle Festival",
        description: "Experience the vibrant culture and traditions of Arunachal Pradesh",
        duration: "6 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("6 Days", "cultural", "Moderate", "Arunachal Pradesh", "Dec-Feb"),
        image: loadedImages.arunachalEagleFestival || "",
        images: [loadedImages.arunachalEagleFestival || "", "", ""],
        rating: 4.8,
        category: "cultural",
        location: "Arunachal Pradesh",
        highlights: ["Traditional Dances", "Local Crafts", "Mountain Views", "Cultural Immersion"],
        bestSeason: "Dec-Feb"
      },
      {
        id: 22,
        title: "Assam Tea Gardens & Wildlife",
        description: "Explore the famous tea gardens of Assam and spot wildlife in Kaziranga",
        duration: "7 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("7 Days", "leisure", "Easy", "Assam", "Nov-Apr"),
        image: assamTeaGardensImg,
        images: [assamTeaGardensImg, assamTeaGardensImg, assamTeaGardensImg],
        rating: 4.6,
        category: "leisure",
        location: "Assam",
        highlights: ["Tea Garden Tours", "Kaziranga National Park", "One Horn Rhinos"],
        bestSeason: "Nov-Apr"
      },
      {
        id: 24,
        title: "Manipur Loktak Lake & Floating Islands",
        description: "Discover the unique floating islands and phumdis of Loktak Lake",
        duration: "4 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("4 Days", "leisure", "Easy", "Manipur", "Oct-Mar"),
        image: manipurLoktakImg,
        images: [manipurLoktakImg, manipurLoktakImg, manipurLoktakImg],
        rating: 4.7,
        category: "leisure",
        location: "Manipur",
        highlights: ["Keibul Lamjao National Park", "Sangai Deer", "Floating Gardens"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 26,
        title: "Tripura Heritage & Bamboo Trail",
        description: "Explore ancient kingdoms and sustainable bamboo crafts of Tripura",
        duration: "4 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("4 Days", "cultural", "Moderate", "Tripura", "Oct-Mar"),
        image: tripuraTribalImg,
        images: [tripuraTribalImg, tripuraTribalImg, tripuraTribalImg],
        rating: 4.5,
        category: "cultural",
        location: "Tripura",
        highlights: ["Ujjayanta Palace", "Bamboo Handicrafts", "Tribal Museums"],
        bestSeason: "Oct-Mar"
      },
    ],
    
    "Uttarakhand": [
      {
        id: 31,
        title: "Char Dham Yatra",
        description: "Sacred pilgrimage to the four holy shrines in the Himalayas",
        duration: "12 Days",
        difficulty: "Challenging",
        price: TourPricingService.calculatePrice("12 Days", "cultural", "Challenging", "Uttarakhand", "May-Oct"),
        image: charDhamYatraImg,
        images: [charDhamYatraImg, charDhamYatraImg, charDhamYatraImg],
        rating: 4.9,
        category: "cultural",
        location: "Uttarakhand",
        highlights: ["Yamunotri", "Gangotri", "Kedarnath", "Badrinath"],
        bestSeason: "May-Oct"
      },
      {
        id: 33,
        title: "Nainital Lake District",
        description: "Serene lakes, hill stations, and colonial charm in Kumaon hills",
        duration: "5 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("5 Days", "leisure", "Easy", "Uttarakhand", "Mar-Jun, Sep-Nov"),
        image: nainitalLakeImg,
        images: [nainitalLakeImg, nainitalLakeImg, nainitalLakeImg],
        rating: 4.6,
        category: "leisure",
        location: "Uttarakhand",
        highlights: ["Naini Lake", "Snow View Point", "Mall Road"],
        bestSeason: "Mar-Jun, Sep-Nov"
      },
    ],
    
    "Sikkim": [
      {
        id: 52,
        title: "Sikkim Rhododendron Trail",
        description: "Spectacular rhododendron blooms in the Himalayan foothills",
        duration: "4 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("4 Days", "leisure", "Moderate", "Sikkim", "Mar-May"),
        image: sikkimRhododendronImg,
        images: [sikkimRhododendronImg, sikkimRhododendronImg, sikkimRhododendronImg],
        rating: 4.7,
        category: "leisure",
        location: "Sikkim",
        highlights: ["Rhododendron Forests", "Nature Walks", "Mountain Views"],
        bestSeason: "Mar-May"
      },
      {
        id: 53,
        title: "Pelling Kanchenjunga Views",
        description: "Magnificent views of Kanchenjunga peak from Pelling",
        duration: "3 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "leisure", "Easy", "Sikkim", "Oct-May"),
        image: pellingKanchenjungaImg,
        images: [pellingKanchenjungaImg, pellingKanchenjungaImg, pellingKanchenjungaImg],
        rating: 4.6,
        category: "leisure",
        location: "Sikkim",
        highlights: ["Kanchenjunga Views", "Monasteries", "Waterfalls"],
        bestSeason: "Oct-May"
      },
      {
        id: 55,
        title: "North Sikkim Adventure",
        description: "Remote mountain landscapes and pristine lakes of North Sikkim",
        duration: "6 Days",
        difficulty: "Challenging",
        price: TourPricingService.calculatePrice("6 Days", "adventure", "Challenging", "Sikkim", "Mar-Jun"),
        image: gurudongmarLakeImg,
        images: [gurudongmarLakeImg, gurudongmarLakeImg, gurudongmarLakeImg],
        rating: 4.9,
        category: "adventure",
        location: "Sikkim",
        highlights: ["Yumthang Valley", "Zero Point", "Hot Springs"],
        bestSeason: "Mar-Jun"
      }
    ],
    
    "Himachal Pradesh": [
      {
        id: 63,
        title: "Dharamshala McLeod Ganj",
        description: "Dalai Lama's residence, Tibetan culture, and mountain trekking",
        duration: "5 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("5 Days", "cultural", "Moderate", "Himachal Pradesh", "Mar-Jun, Sep-Nov"),
        image: loadedImages.dharamshalaMcleodGanj || "",
        images: [loadedImages.dharamshalaMcleodGanj || "", "", ""],
        rating: 4.7,
        category: "cultural",
        location: "Himachal Pradesh",
        highlights: ["Dalai Lama Temple", "Tibetan Culture", "Triund Trek"],
        bestSeason: "Mar-Jun, Sep-Nov"
      },
      {
        id: 64,
        title: "Kullu Valley Adventure",
        description: "River rafting, paragliding, and mountain adventures in Kullu",
        duration: "4 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("4 Days", "adventure", "Moderate", "Himachal Pradesh", "Apr-Oct"),
        image: loadedImages.kulluValleyAdventure || "",
        images: [loadedImages.kulluValleyAdventure || "", "", ""],
        rating: 4.5,
        category: "adventure",
        location: "Himachal Pradesh",
        highlights: ["River Rafting", "Paragliding", "Apple Orchards"],
        bestSeason: "Apr-Oct"
      },
    ],
    
    "Kerala": [
      {
        id: 71,
        title: "Kerala Backwaters & Houseboats",
        description: "Serene backwater cruise through palm-fringed canals and lagoons",
        duration: "5 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("5 Days", "leisure", "Easy", "Kerala", "Oct-Mar"),
        image: keralaBackwatersImg,
        images: [keralaBackwatersImg, keralaBackwatersImg, keralaBackwatersImg],
        rating: 4.8,
        category: "leisure",
        location: "Kerala",
        highlights: ["Houseboat Cruise", "Coconut Lagoons", "Local Cuisine"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 73,
        title: "Thekkady Wildlife & Spice Gardens",
        description: "Periyar Wildlife Sanctuary and aromatic spice plantation tours",
        duration: "3 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "leisure", "Easy", "Kerala", "Oct-Feb"),
        image: thekkadyWildlifeImg,
        images: [thekkadyWildlifeImg, thekkadyWildlifeImg, thekkadyWildlifeImg],
        rating: 4.6,
        category: "leisure",
        location: "Kerala",
        highlights: ["Elephant Rides", "Spice Gardens", "Boat Safari"],
        bestSeason: "Oct-Feb"
      }
    ],
    
    "Tamil Nadu": [
      {
        id: 82,
        title: "Ooty Hill Station Experience", 
        description: "Queen of Hill Stations with botanical gardens, toy train, and tea plantations",
        duration: "3 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "leisure", "Easy", "Tamil Nadu", "Apr-Jun, Sep-Nov"),
        image: ootyKodaikanalImg,
        images: [ootyKodaikanalImg, ootyKodaikanalImg, ootyKodaikanalImg],
        rating: 4.6,
        category: "leisure",
        location: "Tamil Nadu",
        highlights: ["Nilgiri Toy Train", "Botanical Gardens", "Rose Garden", "Tea Factory Visit"],
        bestSeason: "Apr-Jun, Sep-Nov"
      },
      {
        id: 83,
        title: "Kodaikanal Princess of Hills",
        description: "Misty mountains, pristine lakes, and cool climate in the Western Ghats",
        duration: "3 Days", 
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "leisure", "Easy", "Tamil Nadu", "Apr-Jun, Sep-Nov"),
        image: ootyKodaikanalImg,
        images: [ootyKodaikanalImg, ootyKodaikanalImg, ootyKodaikanalImg],
        rating: 4.4,
        category: "leisure",
        location: "Tamil Nadu",
        highlights: ["Kodai Lake", "Coaker's Walk", "Bryant Park", "Pillar Rocks"],
        bestSeason: "Apr-Jun, Sep-Nov"
      }
    ]
  };

  // Flatten all packages for filtering
  const allItineraries = Object.values(stateWiseTourPackages).flat();

  const categories = [
    { id: "all", label: "All Packages" },
    { id: "adventure", label: "Adventure" },
    { id: "cultural", label: "Cultural" },
    { id: "leisure", label: "Leisure" }
  ];

  const locations = ["all", "Meghalaya", "Uttarakhand", "Sikkim", "Himachal Pradesh", "Kerala", "Tamil Nadu", "Assam", "Arunachal Pradesh", "Manipur", "Tripura"];

  const filteredItineraries = allItineraries.filter(item => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const locationMatch = locationFilter === "all" || item.location === locationFilter;
    
    return categoryMatch && locationMatch;
  });

  const meghalayaPackages = filteredItineraries.filter(item => item.location === "Meghalaya");
  const otherPackages = filteredItineraries.filter(item => item.location !== "Meghalaya");

  const clearFilters = () => {
    setSelectedCategory("all");
    setLocationFilter("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOContent page="travel" />
      <Header />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-transparent to-red-100/30" />
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-200/30 rounded-full blur-3xl" />
          
          {/* Optimized mobile padding with proper lazy loading */}
          <div className="relative z-10 py-6 sm:py-8 md:py-12 lg:py-16">
            <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
              {/* Mobile-optimized Header */}
              <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
                <div className="inline-block p-2 sm:p-3 md:p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg mb-2 sm:mb-3 md:mb-4">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 font-playfair">
                    XTSY Travel
                  </h1>
                  <div className="w-12 sm:w-16 md:w-20 lg:w-24 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full" />
                </div>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto mb-2 sm:mb-3 md:mb-4 bg-white/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4 shadow-md mx-2">
                  Embark on extraordinary journeys with XTSY Travel - your gateway to incredible experiences.
                </p>
              </div>

              {/* Ultra-compact Tab Navigation */}
              <div className="flex justify-center mb-1 sm:mb-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-md p-0.5 shadow-md flex w-full max-w-64">
                  <Button
                    onClick={() => setActiveTab('domestic')}
                    variant={activeTab === 'domestic' ? 'default' : 'ghost'}
                    className={`flex-1 px-1.5 py-0.5 rounded-sm text-xs font-medium transition-all duration-200 h-6 ${
                      activeTab === 'domestic' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-sm' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                  >
                    <MapPin className="h-2.5 w-2.5 mr-0.5" />
                    <span className="text-xs">DOM</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('international')}
                    variant={activeTab === 'international' ? 'default' : 'ghost'}
                    className={`flex-1 px-1.5 py-0.5 rounded-sm text-xs font-medium transition-all duration-200 h-6 ${
                      activeTab === 'international' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-sm' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                  >
                    <Globe className="h-2.5 w-2.5 mr-0.5" />
                    <span className="text-xs">INT</span>
                  </Button>
                </div>
              </div>

              {/* Content */}
              {activeTab === 'domestic' && (
                <LazyWrapper fallback={<div className="animate-pulse bg-gray-100 h-64 rounded"></div>}>
                  <div>
                    {/* Enhanced State-wise Packages with lazy loading */}
                    {Object.entries(stateWiseTourPackages).map(([state, packages]) => {
                      const filteredStatePackages = packages.filter(pkg => {
                        const categoryMatch = selectedCategory === "all" || pkg.category === selectedCategory;
                        const locationMatch = locationFilter === "all" || pkg.location === locationFilter;
                        
                        return categoryMatch && locationMatch;
                      });

                      if (filteredStatePackages.length === 0) return null;

                      // State-specific icons and descriptions
                      const stateInfo = {
                        "Meghalaya": { icon: "🏔️", desc: "The Abode of Clouds" },
                        "Uttarakhand": { icon: "🏔️", desc: "Land of the Gods" },
                        "Sikkim": { icon: "🗻", desc: "Gateway to the Himalayas" },
                        "Himachal Pradesh": { icon: "⛰️", desc: "Land of Snow" },
                        "Kerala": { icon: "🌴", desc: "God's Own Country" },
                        "Tamil Nadu": { icon: "🏛️", desc: "Land of Temples" },
                        "Northeast States": { icon: "🌿", desc: "Seven Sisters Region" },
                        "XTSY Exclusive Tours": { icon: "⭐", desc: "Premium Experiences" }
                      };

                      const info = stateInfo[state] || { icon: "🗺️", desc: "Incredible Destination" };

                      return (
                        <div key={state} className="mb-6 sm:mb-8 md:mb-12 lg:mb-16">
                          <div className="text-center mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                            <div className="inline-flex items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-md shadow-md mb-1 sm:mb-2">
                              <span className="text-sm sm:text-base md:text-lg lg:text-xl">{info.icon}</span>
                              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
                                {state}
                              </h3>
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg">
                              {info.desc}
                            </p>
                          </div>
                          {/* Comprehensive responsive layout with animations and lazy loading */}
                          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 mb-6 md:mb-10 lg:mb-14 animate-fade-in">
                            {filteredStatePackages.map((itinerary) => (
                              <LazyWrapper 
                                key={itinerary.id}
                                fallback={<div className="animate-pulse bg-gray-100 h-64 rounded-lg"></div>}
                                threshold={0.2}
                              >
                                <CompactTourPackageCard
                                  tourPackage={itinerary}
                                  onPackageClick={() => handlePackageClick(itinerary)}
                                />
                              </LazyWrapper>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {filteredItineraries.length === 0 && (
                      <div className="text-center py-3 sm:py-4">
                        <p className="text-gray-500 text-xs sm:text-sm">No packages found matching your filters.</p>
                        <Button 
                          onClick={clearFilters}
                          className="mt-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs px-2 py-0.5 h-6"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </LazyWrapper>
              )}

              {activeTab === 'international' && (
                <LazyWrapper fallback={<div className="animate-pulse bg-gray-100 h-96 rounded"></div>}>
                  <div className="max-w-6xl mx-auto">
                    {/* Compact International Header */}
                    <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                      <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg mb-3 sm:mb-4 md:mb-6">
                        <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">🌏</span>
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                          XTSY Asia & Europe
                        </h2>
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold">
                          Soon
                        </span>
                      </div>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
                        Get ready to explore the world with XTSY! We're expanding to bring you unforgettable experiences.
                      </p>
                    </div>

                    {/* Enhanced Asian Countries with Unicode emoji flags */}
                    <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                      <div className="text-center mb-4 sm:mb-6 md:mb-8">
                        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                          🏯 Asian Destinations
                        </h3>
                      </div>
                      
                       <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 px-2">
                         {[
                           { country: "Japan", flag: "🇯🇵", highlight: "Cherry Blossoms" },
                           { country: "Thailand", flag: "🇹🇭", highlight: "Tropical Paradise" },
                           { country: "Vietnam", flag: "🇻🇳", highlight: "Street Food" },
                           { country: "Korea", flag: "🇰🇷", highlight: "K-Culture" },
                           { country: "Malaysia", flag: "🇲🇾", highlight: "Multicultural" },
                           { country: "Singapore", flag: "🇸🇬", highlight: "Modern City" },
                           { country: "Indonesia", flag: "🇮🇩", highlight: "Islands" },
                           { country: "Philippines", flag: "🇵🇭", highlight: "Beaches" }
                         ].map((item) => (
                           <LazyWrapper 
                             key={item.country}
                             fallback={<div className="animate-pulse bg-gray-100 h-32 rounded"></div>}
                             threshold={0.3}
                           >
                             <Card className="group hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-200 h-32 sm:h-36 md:h-40">
                               <CardContent className="flex flex-col items-center justify-center p-2 sm:p-3 text-center h-full">
                                  <div className="flex items-center justify-center mb-2 flex-shrink-0">
                                    <span 
                                      className="leading-none"
                                      style={{
                                        fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
                                        fontSize: 'clamp(1.2rem, 4vw, 2rem)',
                                        lineHeight: 1
                                      }}
                                    >
                                      {item.flag}
                                    </span>
                                  </div>
                                 <div className="flex flex-col items-center justify-center flex-1 min-h-0">
                                   <h4 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm leading-tight truncate w-full">{item.country}</h4>
                                   <p className="text-xs text-gray-600 mb-2 leading-tight truncate w-full">{item.highlight}</p>
                                   <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">Soon</span>
                                 </div>
                               </CardContent>
                             </Card>
                           </LazyWrapper>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced European Countries with Unicode emoji flags */}
                    <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                      <div className="text-center mb-4 sm:mb-6 md:mb-8">
                        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                          🏰 European Destinations
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 px-2">
                         {[
                           { country: "France", flag: "🇫🇷", highlight: "Romance" },
                           { country: "Italy", flag: "🇮🇹", highlight: "Art & History" },
                           { country: "Spain", flag: "🇪🇸", highlight: "Festivals" },
                           { country: "Germany", flag: "🇩🇪", highlight: "Castles" },
                           { country: "Switzerland", flag: "🇨🇭", highlight: "Alps" },
                           { country: "Netherlands", flag: "🇳🇱", highlight: "Canals" },
                           { country: "UK", flag: "🇬🇧", highlight: "Royal Heritage" },
                           { country: "Austria", flag: "🇦🇹", highlight: "Music" }
                         ].map((item) => (
                           <LazyWrapper 
                             key={item.country}
                             fallback={<div className="animate-pulse bg-gray-100 h-32 rounded"></div>}
                             threshold={0.3}
                           >
                             <Card className="group hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-200 h-32 sm:h-36 md:h-40">
                               <CardContent className="flex flex-col items-center justify-center p-2 sm:p-3 text-center h-full">
                                  <div className="flex items-center justify-center mb-2 flex-shrink-0">
                                    <span 
                                      className="leading-none"
                                      style={{
                                        fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
                                        fontSize: 'clamp(1.2rem, 4vw, 2rem)',
                                        lineHeight: 1
                                      }}
                                    >
                                      {item.flag}
                                    </span>
                                  </div>
                                 <div className="flex flex-col items-center justify-center flex-1 min-h-0">
                                   <h4 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm leading-tight truncate w-full">{item.country}</h4>
                                   <p className="text-xs text-gray-600 mb-2 leading-tight truncate w-full">{item.highlight}</p>
                                   <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Soon</span>
                                 </div>
                               </CardContent>
                             </Card>
                           </LazyWrapper>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Newsletter Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 sm:p-6 md:p-8 text-center text-white mx-1">
                      <Bell className="h-10 sm:h-12 md:h-16 w-10 sm:w-12 md:w-16 mx-auto mb-3 sm:mb-4 opacity-90" />
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">Be the First to Know!</h3>
                      <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 opacity-90">
                        Join our newsletter for exclusive early access and special discounts.
                      </p>
                      <Button 
                        onClick={handleNewsletterClick}
                        className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg"
                      >
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Join Newsletter
                      </Button>
                    </div>
                  </div>
                </LazyWrapper>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {isModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-white p-4 rounded">Loading...</div></div>}>
          <LazyTourPackageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            tourPackage={selectedPackage}
          />
        </Suspense>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="newsletter"
      />
    </div>
  );
};

export default Travel;
