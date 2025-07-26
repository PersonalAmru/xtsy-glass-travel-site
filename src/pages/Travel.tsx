import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Globe, Package, Bell, Mail, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TourPackageCard from "@/components/TourPackageCard";
import TourPackageModal from "@/components/TourPackageModal";
import { AuthModal } from "@/components/AuthModal";
import meghalayaLivingRootBridges from "@/assets/meghalaya-living-root-bridges.jpg";
import cherrapunjiNohkalikaiFalls from "@/assets/cherrapunji-nohkalikai-falls.jpg";
import dawkiUmngotRiver from "@/assets/dawki-umngot-river.jpg";
import mawlynnongCleanestVillage from "@/assets/mawlynnong-cleanest-village.jpg";
import shillongCulturalCity from "@/assets/shillong-cultural-city.jpg";
import keralaBackwaters from "@/assets/kerala-backwaters.jpg";
import uttarakhandHimalayas from "@/assets/uttarakhand-himalayas.jpg";
import sikkimRhododendrons from "@/assets/sikkim-rhododendrons.jpg";
import himachalValleys from "@/assets/himachal-valleys.jpg";
import tamilNaduTemples from "@/assets/tamil-nadu-temples.jpg";
import tribalCircuit from "@/assets/tribal-circuit.jpg";
// New optimized images
import charDhamYatra from "@/assets/char-dham-yatra.jpg";
import rishikeshAdventure from "@/assets/rishikesh-adventure.jpg";
import nainitalLakeDistrict from "@/assets/nainital-lake-district.jpg";
import valleyOfFlowers from "@/assets/valley-of-flowers.jpg";
import gurudongmarLake from "@/assets/gurudongmar-lake.jpg";
import shimlaManaliHoneymoon from "@/assets/shimla-manali-honeymoon.jpg";
import spitiValley from "@/assets/spiti-valley.jpg";
import munnarTeaGardensNew from "@/assets/munnar-tea-gardens-new.jpg";
import thekkadyWildlife from "@/assets/thekkady-wildlife.jpg";
import ootyKodaikanal from "@/assets/ooty-kodaikanal.jpg";
import dharamshalaMcleodganj from "@/assets/dharamshala-mcleodganj.jpg";
import pellingKanchenjunga from "@/assets/pelling-kanchenjunga.jpg";
import assamTeaGardensNew from "@/assets/assam-tea-gardens-new.jpg";
import tamilNaduTemplesNew from "@/assets/tamil-nadu-temples-new.jpg";
import arunachalTribalFestival from "@/assets/arunachal-tribal-festival.jpg";
import tamilNaduTemplesPinterest from "@/assets/tamil-nadu-temples-pinterest.jpg";
import munnarTeaGardensKerala from "@/assets/munnar-tea-gardens-kerala.jpg";
import nagalandHornbillFestival from "@/assets/nagaland-hornbill-festival.jpg";
import manipurLoktakFloatingIslands from "@/assets/manipur-loktak-floating-islands.jpg";
// Optimized local images to improve performance and reduce API calls
const meghalayaImages = [
  meghalayaLivingRootBridges,
  cherrapunjiNohkalikaiFalls,
  dawkiUmngotRiver
];

const himachalImages = [
  himachalValleys,
  dharamshalaMcleodganj,
  shimlaManaliHoneymoon
];

const keralImages = [
  keralaBackwaters,
  munnarTeaGardensKerala,
  thekkadyWildlife
];

const uttarakhandImages = [
  uttarakhandHimalayas,
  charDhamYatra,
  rishikeshAdventure
];

const sikkimImages = [
  sikkimRhododendrons,
  gurudongmarLake,
  pellingKanchenjunga
];

const tamilNaduImages = [
  tamilNaduTemplesPinterest,
  tamilNaduTemplesNew,
  ootyKodaikanal
];

// Individual destination images
const meghalayaHero = meghalayaImages[0];
const uttarakhandImage = uttarakhandImages[0];
const sikkimImage = sikkimImages[0];
const himachalImage = himachalImages[0];
const keralaImage = keralImages[0];
const tamilNaduImage = tamilNaduImages[0];

// Additional categorized images
const waterfallImage = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80";
const mountainImage = "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=80";
const lakeImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80";
const templeImage = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80";
const forestImage = "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&q=80";
const cultureImage = "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80";
const adventureImage = "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80";
const hillStationImage = "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80";

// International travel images
const internationalTravelImage = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"; // World travel
const asiaImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"; // Asian landscapes
const merchandiseImage = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"; // Travel gear

const Travel = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [daysFilter, setDaysFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    if (tab === 'domestic' || tab === 'international') {
      setActiveTab(tab);
    }
    // Scroll to top when navigating to this page
    window.scrollTo(0, 0);
  }, [location.search]);

  const handlePackageClick = (itinerary: any) => {
    setSelectedPackage(itinerary);
    setIsModalOpen(true);
  };

  const handleNewsletterClick = () => {
    setIsAuthModalOpen(true);
  };

  // Enhanced tour packages data organized by states
  const stateWiseTourPackages = {
    "Meghalaya": [
      {
        id: 1,
        title: "Meghalaya Hidden Gems",
        description: "Discover the unexplored waterfalls and living root bridges of Meghalaya",
        duration: "5 Days",
        difficulty: "Moderate",
        price: "₹12,999",
        image: meghalayaLivingRootBridges,
        images: [meghalayaLivingRootBridges, meghalayaImages[1], meghalayaImages[2]],
        rating: 4.8,
        category: "adventure",
        location: "Meghalaya",
        highlights: ["Double Decker Root Bridge", "Rainbow Falls", "Crystal Clear Pools"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 2,
        title: "Shillong Cultural Experience",
        description: "Immerse yourself in Khasi culture, local markets, and traditional cuisine",
        duration: "3 Days",
        difficulty: "Easy",
        price: "₹8,999",
        image: shillongCulturalCity,
        images: [shillongCulturalCity, meghalayaImages[1], meghalayaImages[2]],
        rating: 4.6,
        category: "cultural",
        location: "Meghalaya",
        highlights: ["Police Bazaar", "Don Bosco Museum", "Local Food Tours"],
        bestSeason: "Year Round"
      },
      {
        id: 3,
        title: "Cherrapunji Monsoon Trek",
        description: "Experience the wettest place on earth during monsoon season",
        duration: "4 Days",
        difficulty: "Challenging",
        price: "₹15,999",
        image: cherrapunjiNohkalikaiFalls,
        images: [cherrapunjiNohkalikaiFalls, meghalayaLivingRootBridges, dawkiUmngotRiver],
        rating: 4.9,
        category: "adventure",
        location: "Meghalaya",
        highlights: ["Nohkalikai Falls", "Mawsmai Caves", "Living Root Bridges"],
        bestSeason: "Jun-Sep"
      },
      {
        id: 4,
        title: "Dawki River Adventure",
        description: "Crystal clear waters and boating experience at Indo-Bangladesh border",
        duration: "2 Days",
        difficulty: "Easy",
        price: "₹6,999",
        image: dawkiUmngotRiver,
        images: [dawkiUmngotRiver, cherrapunjiNohkalikaiFalls, mawlynnongCleanestVillage],
        rating: 4.7,
        category: "leisure",
        location: "Meghalaya",
        highlights: ["Umngot River", "Transparent Water Boating", "Border Views"],
        bestSeason: "Nov-May"
      },
      {
        id: 5,
        title: "Mawlynnong Clean Village Tour",
        description: "Visit Asia's cleanest village and experience sustainable living",
        duration: "2 Days", 
        difficulty: "Easy",
        price: "₹7,499",
        image: mawlynnongCleanestVillage,
        images: [mawlynnongCleanestVillage, meghalayaLivingRootBridges, dawkiUmngotRiver],
        rating: 4.5,
        category: "cultural",
        location: "Meghalaya",
        highlights: ["Sky Walk", "Living Root Bridge", "Organic Gardens"],
        bestSeason: "Oct-Apr"
      }
    ],
    
    "Uttarakhand": [
      {
        id: 6,
        title: "Char Dham Yatra Complete",
        description: "Sacred pilgrimage to all four dhams - Kedarnath, Badrinath, Gangotri, and Yamunotri",
        duration: "12 Days",
        difficulty: "Challenging",
        price: "₹35,999",
        image: charDhamYatra,
        images: [charDhamYatra, rishikeshAdventure, valleyOfFlowers],
        rating: 4.9,
        category: "cultural",
        location: "Uttarakhand",
        highlights: ["Four Sacred Dhams", "Helicopter Options", "Guided Tours"],
        bestSeason: "May-Oct"
      },
      {
        id: 7,
        title: "Rishikesh Adventure Special",
        description: "World capital of yoga, river rafting, and spiritual experiences",
        duration: "4 Days",
        difficulty: "Moderate",
        price: "₹11,999",
        image: rishikeshAdventure,
        images: [rishikeshAdventure, charDhamYatra, nainitalLakeDistrict],
        rating: 4.8,
        category: "adventure",
        location: "Uttarakhand",
        highlights: ["River Rafting", "Yoga Sessions", "Ganga Aarti"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 8,
        title: "Nainital Lake District",
        description: "Explore the lake district of Uttarakhand with scenic hill stations",
        duration: "6 Days",
        difficulty: "Easy",
        price: "₹18,999",
        image: nainitalLakeDistrict,
        images: [nainitalLakeDistrict, uttarakhandHimalayas, charDhamYatra],
        rating: 4.7,
        category: "leisure",
        location: "Uttarakhand",
        highlights: ["Naini Lake", "Bhimtal", "Mall Road"],
        bestSeason: "Mar-Jun"
      },
      {
        id: 9,
        title: "Valley of Flowers Trek",
        description: "UNESCO World Heritage site with rare alpine flowers and meadows",
        duration: "8 Days",
        difficulty: "Challenging",
        price: "₹24,999",
        image: valleyOfFlowers,
        images: [valleyOfFlowers, uttarakhandHimalayas, rishikeshAdventure],
        rating: 4.9,
        category: "adventure",
        location: "Uttarakhand",
        highlights: ["Alpine Flowers", "Hemkund Sahib", "Ghangaria"],
        bestSeason: "Jul-Sep"
      }
    ],
    
    "Sikkim": [
      {
        id: 10,
        title: "Sikkim Himalayan Explorer",
        description: "Complete Sikkim tour covering all major attractions and monasteries",
        duration: "7 Days",
        difficulty: "Moderate",
        price: "₹22,999",
        image: sikkimRhododendrons,
        images: [sikkimRhododendrons, gurudongmarLake, pellingKanchenjunga],
        rating: 4.8,
        category: "cultural",
        location: "Sikkim",
        highlights: ["Gangtok", "Rumtek Monastery", "Tsomgo Lake"],
        bestSeason: "Mar-Jun"
      },
      {
        id: 11,
        title: "Gurudongmar Lake Expedition",
        description: "High altitude sacred lake adventure with breathtaking mountain views",
        duration: "5 Days",
        difficulty: "Challenging",
        price: "₹19,999",
        image: gurudongmarLake,
        images: [gurudongmarLake, sikkimRhododendrons, pellingKanchenjunga],
        rating: 4.9,
        category: "adventure",
        location: "Sikkim",
        highlights: ["Gurudongmar Lake", "Lachung", "Yumthang Valley"],
        bestSeason: "Apr-Jun"
      },
      {
        id: 12,
        title: "Pelling Kanchenjunga View",
        description: "Witness the third highest peak in the world from scenic Pelling",
        duration: "4 Days",
        difficulty: "Easy",
        price: "₹13,999",
        image: pellingKanchenjunga,
        images: [pellingKanchenjunga, sikkimRhododendrons, gurudongmarLake],
        rating: 4.6,
        category: "leisure",
        location: "Sikkim",
        highlights: ["Kanchenjunga View", "Pemayangtse Monastery", "Khecheopalri Lake"],
        bestSeason: "Oct-Dec"
      }
    ],
    
    "Himachal Pradesh": [
      {
        id: 13,
        title: "Shimla Manali Honeymoon",
        description: "Romantic hill station package perfect for couples and honeymooners",
        duration: "6 Days",
        difficulty: "Easy",
        price: "₹16,999",
        image: shimlaManaliHoneymoon,
        images: [shimlaManaliHoneymoon, himachalValleys, dharamshalaMcleodganj],
        rating: 4.7,
        category: "leisure",
        location: "Himachal Pradesh",
        highlights: ["Mall Road", "Rohtang Pass", "Solang Valley"],
        bestSeason: "Mar-Jun"
      },
      {
        id: 14,
        title: "Spiti Valley Circuit",
        description: "High altitude cold desert adventure through remote Spiti Valley",
        duration: "10 Days",
        difficulty: "Challenging",
        price: "₹32,999",
        image: spitiValley,
        images: [spitiValley, himachalValleys, dharamshalaMcleodganj],
        rating: 4.9,
        category: "adventure",
        location: "Himachal Pradesh",
        highlights: ["Key Monastery", "Chandratal Lake", "Kaza"],
        bestSeason: "Jun-Sep"
      },
      {
        id: 15,
        title: "Dharamshala McLeod Ganj",
        description: "Explore the Dalai Lama's residence and Tibetan culture",
        duration: "4 Days",
        difficulty: "Easy",
        price: "₹12,999",
        image: dharamshalaMcleodganj,
        images: [dharamshalaMcleodganj, himachalValleys, shimlaManaliHoneymoon],
        rating: 4.6,
        category: "cultural",
        location: "Himachal Pradesh",
        highlights: ["Dalai Lama Temple", "Bhagsu Waterfall", "Tibetan Market"],
        bestSeason: "Mar-Jun"
      }
    ],
    
    "Kerala": [
      {
        id: 16,
        title: "Kerala Backwaters & Beaches",
        description: "God's Own Country - backwaters, beaches, and hill stations",
        duration: "8 Days",
        difficulty: "Easy",
        price: "₹25,999",
        image: keralaBackwaters,
        images: [keralaBackwaters, munnarTeaGardensKerala, thekkadyWildlife],
        rating: 4.8,
        category: "leisure",
        location: "Kerala",
        highlights: ["Alleppey Houseboat", "Munnar Hills", "Kovalam Beach"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 17,
        title: "Munnar Tea Garden Experience",
        description: "Explore the lush tea plantations and spice gardens of Munnar",
        duration: "5 Days",
        difficulty: "Easy",
        price: "₹14,999",
        image: munnarTeaGardensKerala,
        images: [munnarTeaGardensKerala, munnarTeaGardensNew, keralaBackwaters],
        rating: 4.7,
        category: "cultural",
        location: "Kerala",
        highlights: ["Tea Museum", "Mattupetty Dam", "Spice Plantations"],
        bestSeason: "Sep-Mar"
      },
      {
        id: 18,
        title: "Thekkady Wildlife Safari",
        description: "Wildlife adventure in Periyar National Park with boat safaris",
        duration: "3 Days",
        difficulty: "Easy",
        price: "₹9,999",
        image: thekkadyWildlife,
        images: [thekkadyWildlife, keralaBackwaters, munnarTeaGardensKerala],
        rating: 4.5,
        category: "adventure",
        location: "Kerala",
        highlights: ["Periyar National Park", "Boat Safari", "Spice Gardens"],
        bestSeason: "Dec-Apr"
      }
    ],
    
    "Tamil Nadu": [
      {
        id: 19,
        title: "Tamil Nadu Temple Circuit",
        description: "Spiritual journey through ancient temples and cultural heritage",
        duration: "7 Days",
        difficulty: "Easy",
        price: "₹17,999",
        image: tamilNaduTemplesPinterest,
        images: [tamilNaduTemplesPinterest, tamilNaduTemplesNew, tamilNaduTemples],
        rating: 4.6,
        category: "cultural",
        location: "Tamil Nadu",
        highlights: ["Meenakshi Temple", "Brihadeeswarar Temple", "Kanyakumari"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 20,
        title: "Ooty Kodaikanal Hill Stations",
        description: "Queen of hill stations with scenic beauty and pleasant weather",
        duration: "6 Days",
        difficulty: "Easy",
        price: "₹15,999",
        image: ootyKodaikanal,
        images: [ootyKodaikanal, tamilNaduTemplesPinterest, tamilNaduTemplesNew],
        rating: 4.7,
        category: "leisure",
        location: "Tamil Nadu",
        highlights: ["Ooty Lake", "Doddabetta Peak", "Kodai Lake"],
        bestSeason: "Oct-Jun"
      }
    ],
    
    "Northeast States": [
      {
        id: 21,
        title: "Arunachal Pradesh Eagle Festival",
        description: "Experience the vibrant culture and traditions of Arunachal Pradesh",
        duration: "6 Days",
        difficulty: "Moderate",
        price: "₹18,999",
        image: arunachalTribalFestival,
        images: [arunachalTribalFestival, tribalCircuit, uttarakhandHimalayas],
        rating: 4.7,
        category: "cultural",
        location: "Arunachal Pradesh",
        highlights: ["Traditional Dances", "Local Tribes", "Mountain Views"],
        bestSeason: "Dec-Feb"
      },
      {
        id: 22,
        title: "Nagaland Hornbill Festival",
        description: "Witness the spectacular Hornbill Festival showcasing Naga culture",
        duration: "5 Days",
        difficulty: "Easy",
        price: "₹16,999",
        image: nagalandHornbillFestival,
        images: [nagalandHornbillFestival, tribalCircuit, shillongCulturalCity],
        rating: 4.8,
        category: "cultural",
        location: "Nagaland",
        highlights: ["Hornbill Festival", "Naga Cuisine", "Traditional Crafts"],
        bestSeason: "Dec"
      },
      {
        id: 23,
        title: "Assam Tea Garden Safari",
        description: "Explore the lush tea gardens and wildlife sanctuaries of Assam",
        duration: "7 Days",
        difficulty: "Moderate",
        price: "₹19,999",
        image: assamTeaGardensNew,
        images: [assamTeaGardensNew, munnarTeaGardensKerala, keralaBackwaters],
        rating: 4.6,
        category: "adventure",
        location: "Assam",
        highlights: ["Tea Plantation Tours", "Kaziranga National Park", "River Safari"],
        bestSeason: "Nov-Apr"
      },
      {
        id: 24,
        title: "Manipur Loktak Lake Adventure",
        description: "Discover the floating islands and unique ecosystem of Loktak Lake",
        duration: "4 Days",
        difficulty: "Easy",
        price: "₹12,999",
        image: manipurLoktakFloatingIslands,
        images: [manipurLoktakFloatingIslands, dawkiUmngotRiver, keralaBackwaters],
        rating: 4.5,
        category: "adventure",
        location: "Manipur",
        highlights: ["Floating Islands", "Phumdis", "Sangai Deer"],
        bestSeason: "Oct-Mar"
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

  const difficulties = ["all", "Easy", "Moderate", "Challenging"];
  const days = ["all", "1-3 Days", "4-6 Days", "7+ Days"];
  const locations = ["all", "Meghalaya", "Uttarakhand", "Sikkim", "Himachal Pradesh", "Kerala", "Tamil Nadu", "Assam", "Arunachal Pradesh", "Nagaland", "Manipur"];

  const filteredItineraries = allItineraries.filter(item => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const difficultyMatch = difficultyFilter === "all" || item.difficulty === difficultyFilter;
    const locationMatch = locationFilter === "all" || item.location === locationFilter;
    
    let daysMatch = true;
    if (daysFilter !== "all") {
      const itemDays = parseInt(item.duration);
      if (daysFilter === "1-3 Days") daysMatch = itemDays >= 1 && itemDays <= 3;
      else if (daysFilter === "4-6 Days") daysMatch = itemDays >= 4 && itemDays <= 6;
      else if (daysFilter === "7+ Days") daysMatch = itemDays >= 7;
    }
    
    return categoryMatch && difficultyMatch && daysMatch && locationMatch;
  });

  const meghalayaPackages = filteredItineraries.filter(item => item.location === "Meghalaya");
  const otherPackages = filteredItineraries.filter(item => item.location !== "Meghalaya");

  const clearFilters = () => {
    setSelectedCategory("all");
    setDifficultyFilter("all");
    setDaysFilter("all");
    setLocationFilter("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-transparent to-red-100/30" />
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-200/30 rounded-full blur-3xl" />
          
          <div className="relative z-10 py-20">
            <div className="container mx-auto px-4">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-block p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mb-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 font-playfair">
                    XTSY Travel
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full" />
                </div>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  Embark on extraordinary journeys with XTSY Travel - your gateway to incredible experiences across India and beyond.
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex justify-center mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg">
                  <Button
                    onClick={() => setActiveTab('domestic')}
                    variant={activeTab === 'domestic' ? 'default' : 'ghost'}
                    className={`mr-2 ${
                      activeTab === 'domestic' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Domestic Travel
                  </Button>
                  <Button
                    onClick={() => setActiveTab('international')}
                    variant={activeTab === 'international' ? 'default' : 'ghost'}
                    className={`${
                      activeTab === 'international' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    International Travel
                  </Button>
                </div>
              </div>

              {/* Content */}
              {activeTab === 'domestic' && (
                <div>

                  {/* Filters */}
                  <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-600" />
                        <span className="font-semibold text-gray-900">Filters:</span>
                      </div>
                      
                       <div className="flex flex-wrap gap-4">
                         <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                           <SelectTrigger className="w-40 bg-white text-gray-900 border-gray-300">
                             <SelectValue placeholder="Category" />
                           </SelectTrigger>
                           <SelectContent>
                             {categories.map((category) => (
                               <SelectItem key={category.id} value={category.id}>
                                 {category.label}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>

                         <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                           <SelectTrigger className="w-40 bg-white text-gray-900 border-gray-300">
                             <SelectValue placeholder="Difficulty" />
                           </SelectTrigger>
                           <SelectContent>
                             {difficulties.map((difficulty) => (
                               <SelectItem key={difficulty} value={difficulty}>
                                 {difficulty === "all" ? "All Levels" : difficulty}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>

                         <Select value={daysFilter} onValueChange={setDaysFilter}>
                           <SelectTrigger className="w-40 bg-white text-gray-900 border-gray-300">
                             <SelectValue placeholder="Duration" />
                           </SelectTrigger>
                           <SelectContent>
                             {days.map((day) => (
                               <SelectItem key={day} value={day}>
                                 {day === "all" ? "Any Duration" : day}
                                 </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>

                         <Select value={locationFilter} onValueChange={setLocationFilter}>
                           <SelectTrigger className="w-40 bg-white text-gray-900 border-gray-300">
                             <SelectValue placeholder="Location" />
                           </SelectTrigger>
                           <SelectContent>
                             {locations.map((location) => (
                               <SelectItem key={location} value={location}>
                                 {location === "all" ? "All Locations" : location}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        onClick={clearFilters}
                        className="ml-auto"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* State-wise Packages Organization */}
                  {Object.entries(stateWiseTourPackages).map(([state, packages]) => {
                    const filteredStatePackages = packages.filter(pkg => {
                      const categoryMatch = selectedCategory === "all" || pkg.category === selectedCategory;
                      const difficultyMatch = difficultyFilter === "all" || pkg.difficulty === difficultyFilter;
                      const locationMatch = locationFilter === "all" || pkg.location === locationFilter;
                      
                      let daysMatch = true;
                      if (daysFilter !== "all") {
                        const itemDays = parseInt(pkg.duration);
                        if (daysFilter === "1-3 Days") daysMatch = itemDays >= 1 && itemDays <= 3;
                        else if (daysFilter === "4-6 Days") daysMatch = itemDays >= 4 && itemDays <= 6;
                        else if (daysFilter === "7+ Days") daysMatch = itemDays >= 7;
                      }
                      
                      return categoryMatch && difficultyMatch && daysMatch && locationMatch;
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
                      "Northeast States": { icon: "🌿", desc: "Seven Sisters Region" }
                    };

                    const info = stateInfo[state] || { icon: "🗺️", desc: "Incredible Destination" };

                    return (
                      <div key={state} className="mb-16">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center gap-2 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg mb-4">
                            <span className="text-2xl">{info.icon}</span>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {state}
                            </h3>
                          </div>
                          <p className="text-gray-600 text-lg">
                            {info.desc}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {filteredStatePackages.map((itinerary) => (
                            <TourPackageCard
                              key={itinerary.id}
                              tourPackage={itinerary}
                              onPackageClick={() => handlePackageClick(itinerary)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {filteredItineraries.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No packages found matching your filters.</p>
                      <Button 
                        onClick={clearFilters}
                        className="mt-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'international' && (
                <div className="max-w-6xl mx-auto">
                  {/* Header Section */}
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mb-6">
                      <span className="text-4xl">🌏</span>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        XTSY Asia & Europe
                      </h2>
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Launching Soon
                      </span>
                    </div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                      Get ready to explore the world with XTSY! We're expanding to bring you unforgettable experiences across Asia and Europe.
                    </p>
                  </div>

                  {/* Asian Countries Section */}
                  <div className="mb-16">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                        🏯 Asian Destinations
                      </h3>
                      <p className="text-gray-600">Discover the diverse cultures and landscapes of Asia</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                      {[
                        { country: "Japan", flag: "🇯🇵", highlight: "Cherry Blossoms & Culture" },
                        { country: "Thailand", flag: "🇹🇭", highlight: "Tropical Paradise" },
                        { country: "Vietnam", flag: "🇻🇳", highlight: "Street Food & History" },
                        { country: "South Korea", flag: "🇰🇷", highlight: "K-Culture & Tech" },
                        { country: "Malaysia", flag: "🇲🇾", highlight: "Multicultural Hub" },
                        { country: "Singapore", flag: "🇸🇬", highlight: "Modern City-State" },
                        { country: "Indonesia", flag: "🇮🇩", highlight: "Island Adventures" },
                        { country: "Philippines", flag: "🇵🇭", highlight: "Beach & Diving" },
                        { country: "Cambodia", flag: "🇰🇭", highlight: "Ancient Temples" },
                        { country: "Laos", flag: "🇱🇦", highlight: "Peaceful Landscapes" },
                        { country: "Myanmar", flag: "🇲🇲", highlight: "Golden Pagodas" },
                        { country: "Nepal", flag: "🇳🇵", highlight: "Himalayan Peaks" }
                      ].map((item) => (
                        <Card key={item.country} className="group hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-200">
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">{item.flag}</div>
                            <h4 className="font-semibold text-gray-900 mb-1">{item.country}</h4>
                            <p className="text-xs text-gray-600">{item.highlight}</p>
                            <div className="mt-2">
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Soon</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* European Countries Section */}
                  <div className="mb-16">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                        🏰 European Destinations
                      </h3>
                      <p className="text-gray-600">Experience the rich history and diverse cultures of Europe</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                      {[
                        { country: "France", flag: "🇫🇷", highlight: "Romance & Cuisine" },
                        { country: "Italy", flag: "🇮🇹", highlight: "Art & History" },
                        { country: "Spain", flag: "🇪🇸", highlight: "Passion & Festivals" },
                        { country: "Germany", flag: "🇩🇪", highlight: "Castles & Beer" },
                        { country: "Switzerland", flag: "🇨🇭", highlight: "Alpine Beauty" },
                        { country: "Netherlands", flag: "🇳🇱", highlight: "Tulips & Canals" },
                        { country: "United Kingdom", flag: "🇬🇧", highlight: "Royal Heritage" },
                        { country: "Austria", flag: "🇦🇹", highlight: "Music & Mountains" },
                        { country: "Czech Republic", flag: "🇨🇿", highlight: "Medieval Charm" },
                        { country: "Greece", flag: "🇬🇷", highlight: "Ancient Wonders" },
                        { country: "Portugal", flag: "🇵🇹", highlight: "Coastal Beauty" },
                        { country: "Norway", flag: "🇳🇴", highlight: "Fjords & Aurora" }
                      ].map((item) => (
                        <Card key={item.country} className="group hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-200">
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">{item.flag}</div>
                            <h4 className="font-semibold text-gray-900 mb-1">{item.country}</h4>
                            <p className="text-xs text-gray-600">{item.highlight}</p>
                            <div className="mt-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Soon</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Newsletter Signup Section */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white">
                    <Bell className="h-16 w-16 mx-auto mb-4 opacity-90" />
                    <h3 className="text-2xl font-bold mb-4">Be the First to Know!</h3>
                    <p className="text-lg mb-6 opacity-90">
                      Join our newsletter to get exclusive early access to XTSY Asia & Europe packages, special discounts, and travel tips.
                    </p>
                    <Button 
                      onClick={handleNewsletterClick}
                      className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
                    >
                      <Mail className="h-5 w-5 mr-2" />
                      Join Newsletter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <TourPackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tourPackage={selectedPackage}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="newsletter"
      />
    </div>
  );
};

export default Travel;
