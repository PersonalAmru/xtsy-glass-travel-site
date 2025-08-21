import React, { useState, useEffect, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Globe, Package, Bell, Mail, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TourPackageCard from "@/components/TourPackageCard";
import { LazyTourPackageModal } from "@/components/lazy/LazyTourPackageModal";
import { AuthModal } from "@/components/AuthModal";
import LazyWrapper from "@/components/LazyWrapper";
import SEOContent from "@/components/SEOContent";
import { TourPricingService } from "@/utils/tourPricingService";
import meghalayaLivingRootBridges from "@/assets/meghalaya-living-roots-premium.jpg";
import cherrapunjiNohkalikaiFalls from "@/assets/cherrapunji-waterfalls-premium.jpg";
import dawkiUmngotRiver from "@/assets/dawki-crystal-river-premium.jpg";
import mawlynnongCleanestVillage from "@/assets/mawlynnong-cleanest-village-premium.jpg";
import shillongCulturalCity from "@/assets/shillong-scotland-east-premium.jpg";
import keralaBackwaters from "@/assets/kerala-backwaters.jpg";
import uttarakhandHimalayas from "@/assets/uttarakhand-himalayas.jpg";
import sikkimRhododendrons from "@/assets/sikkim-rhododendrons-premium.jpg";
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
import assamTeaGardensNew from "@/assets/assam-tea-gardens-premium.jpg";
import tamilNaduTemplesNew from "@/assets/tamil-nadu-temples-new.jpg";
import arunachalTribalFestival from "@/assets/arunachal-tribal-premium.jpg";
import tamilNaduTemplesPinterest from "@/assets/tamil-nadu-temples-pinterest.jpg";
import munnarTeaGardensKerala from "@/assets/munnar-tea-gardens-kerala.jpg";
import nagalandHornbillFestival from "@/assets/nagaland-hornbill-premium.jpg";
import manipurLoktakFloatingIslands from "@/assets/manipur-loktak-premium.jpg";
// Additional premium images for unique coverage
import guwahatiKamakhya from "@/assets/guwahati-kamakhya-premium.jpg";
import tripuraTribal from "@/assets/tripura-tribal-premium.jpg";
import mizoramBamboo from "@/assets/mizoram-bamboo-premium.jpg";
import kohimaWarCemetery from "@/assets/kohima-war-cemetery-premium.jpg";
import unakotiSculptures from "@/assets/unakoti-sculptures-premium.jpg";
// New high-quality images - topic relevant
import meghalayaHiddenGemsFinal from "@/assets/meghalaya-hidden-gems-final.jpg";
import cherrapunjiMonsoonFinal from "@/assets/cherrapunji-monsoon-final.jpg";
import shillongCulturalNew from "@/assets/shillong-cultural-new.jpg";
import meghalayaBiodiversityFinal from "@/assets/biodiversity-research-final.jpg";
import wildernessSurvivalFinal from "@/assets/wilderness-survival-final.jpg";
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
    "XTSY Exclusive Tours": [
      {
        id: 201,
        title: "XTSY Exclusive: Meghalaya Biodiversity Research Program",
        description: "Educational wilderness expedition studying Northeast India's unique flora, fauna and ecosystems with expert naturalists",
        duration: "7 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("7 Days", "exclusive", "Moderate", "Northeast India", "Oct-Mar"),
        image: meghalayaLivingRootBridges,
        images: [meghalayaLivingRootBridges, cherrapunjiNohkalikaiFalls, dawkiUmngotRiver],
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
        image: cherrapunjiNohkalikaiFalls,
        images: [cherrapunjiNohkalikaiFalls, meghalayaLivingRootBridges, dawkiUmngotRiver],
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
        images: [meghalayaLivingRootBridges, cherrapunjiNohkalikaiFalls, dawkiUmngotRiver],
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
        image: shillongCulturalCity,
        images: [meghalayaLivingRootBridges, mawlynnongCleanestVillage, dawkiUmngotRiver],
        rating: 4.8,
        category: "cultural",
        location: "Northeast India",
        highlights: ["Medicinal Plant Studies", "Indigenous Knowledge", "Herbal Medicine Preparation", "Sacred Grove Visits", "Traditional Healing", "Cultural Exchange", "Documentation Methods"],
        bestSeason: "Nov-Apr",
        exclusive: true
      },
      {
        id: 205,
        title: "XTSY Exclusive: Himalayan Yoga & Meditation Retreat",
        description: "Transform your mind and body with authentic yoga practices in the serene Himalayan foothills of Northeast",
        duration: "7 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("7 Days", "exclusive", "Easy", "Northeast India", "Oct-May"),
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/download%20(26).jpg",
        images: [meghalayaLivingRootBridges, cherrapunjiNohkalikaiFalls, dawkiUmngotRiver],
        rating: 4.9,
        category: "wellness",
        location: "Northeast India",
        highlights: ["Daily Yoga Sessions", "Guided Meditation", "Pranayama Techniques", "Ayurvedic Meals", "Sound Healing", "Nature Walks", "Spiritual Guidance"],
        bestSeason: "Oct-May",
        exclusive: true
      },
      {
        id: 206,
        title: "XTSY Exclusive: Khasi Hills Wellness & Yoga Sanctuary",
        description: "Rejuvenate in the sacred Khasi Hills with holistic wellness practices, yoga, and traditional healing therapies",
        duration: "5 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("5 Days", "exclusive", "Easy", "Meghalaya", "Year Round"),
        image: mawlynnongCleanestVillage,
        images: [shillongCulturalNew, mawlynnongCleanestVillage, meghalayaLivingRootBridges],
        rating: 4.8,
        category: "wellness",
        location: "Meghalaya",
        highlights: ["Hatha Yoga", "Forest Bathing", "Traditional Massage", "Organic Detox", "Mindfulness Training", "Chakra Balancing", "Waterfall Meditation"],
        bestSeason: "Year Round",
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
        images: [arunachalTribalFestival, himachalValleys, sikkimRhododendrons],
        rating: 4.9,
        category: "wellness",
        location: "Arunachal Pradesh",
        highlights: ["Alpine Yoga", "Buddhist Meditation", "Mountain Trekking", "Monastery Visits", "Tibetan Healing", "High Altitude Training", "Sunrise Sadhana"],
        bestSeason: "Mar-Oct",
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
        price: TourPricingService.calculatePrice("3 Days", "cultural", "Easy", "Meghalaya", "Year Round"),
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
        price: TourPricingService.calculatePrice("4 Days", "adventure", "Challenging", "Meghalaya", "Jun-Sep"),
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
        price: TourPricingService.calculatePrice("2 Days", "leisure", "Easy", "Meghalaya", "Nov-May"),
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
        price: TourPricingService.calculatePrice("2 Days", "cultural", "Easy", "Meghalaya", "Oct-Apr"),
        image: mawlynnongCleanestVillage,
        images: [mawlynnongCleanestVillage, meghalayaLivingRootBridges, dawkiUmngotRiver],
        rating: 4.5,
        category: "cultural",
        location: "Meghalaya",
        highlights: ["Sky Walk", "Living Root Bridge", "Organic Gardens"],
        bestSeason: "Oct-Apr"
      }
    ],
    
    "Northeast States": [
      {
        id: 21,
        title: "Arunachal Pradesh Eagle Festival",
        description: "Experience the vibrant culture and traditions of Arunachal Pradesh",
        duration: "6 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("6 Days", "cultural", "Moderate", "Arunachal Pradesh", "Dec-Feb"),
        image: arunachalTribalFestival,
        images: [arunachalTribalFestival, tribalCircuit, uttarakhandHimalayas],
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
        image: assamTeaGardensNew,
        images: [assamTeaGardensNew, thekkadyWildlife, manipurLoktakFloatingIslands],
        rating: 4.6,
        category: "leisure",
        location: "Assam",
        highlights: ["Tea Plantation Tours", "One-horned Rhino", "River Cruises", "Traditional Villages"],
        bestSeason: "Nov-Apr"
      },
      {
        id: 23,
        title: "Nagaland Hornbill Festival Special",
        description: "Join the festival of festivals celebrating Naga culture and traditions",
        duration: "5 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("5 Days", "cultural", "Easy", "Nagaland", "Dec"),
        image: nagalandHornbillFestival,
        images: [nagalandHornbillFestival, tribalCircuit, kohimaWarCemetery],
        rating: 4.9,
        category: "cultural",
        location: "Nagaland",
        highlights: ["Traditional Performances", "Local Cuisine", "Handicrafts", "Cultural Exchange"],
        bestSeason: "Dec"
      },
      {
        id: 24,
        title: "Manipur Loktak Lake & Floating Islands",
        description: "Discover the unique ecosystem of Loktak Lake with floating phumdis",
        duration: "4 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("4 Days", "leisure", "Easy", "Manipur", "Oct-Mar"),
        image: manipurLoktakFloatingIslands,
        images: [manipurLoktakFloatingIslands, assamTeaGardensNew, tribalCircuit],
        rating: 4.7,
        category: "leisure",
        location: "Manipur",
        highlights: ["Floating Islands", "Unique Ecosystem", "Local Fishing", "Sangai Deer"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 35,
        title: "Northeast Monsoon Explorer (Jul-Oct)",
        description: "Experience the spectacular monsoon beauty across multiple Northeast states",
        duration: "8 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("8 Days", "adventure", "Moderate", "Assam", "Jul-Oct"),
        image: assamTeaGardensNew,
        images: [assamTeaGardensNew, manipurLoktakFloatingIslands, nagalandHornbillFestival],
        rating: 4.6,
        category: "adventure",
        location: "Assam",
        highlights: ["Wildlife Safaris", "Tea Tastings", "River Cruises", "Monsoon Landscapes"],
        bestSeason: "Jul-Oct"
      },
      {
        id: 36,
        title: "Northeast Winter Cultural Tour (Oct-Dec)",
        description: "Explore diverse cultures of Northeast states during perfect weather",
        duration: "12 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("12 Days", "cultural", "Easy", "Northeast India", "Oct-Dec"),
        image: tripuraTribal,
        images: [tripuraTribal, mizoramBamboo, kohimaWarCemetery],
        rating: 4.9,
        category: "cultural",
        location: "Northeast India",
        highlights: ["Seven Sisters Tour", "Cultural Diversity", "Local Festivals", "Perfect Weather"],
        bestSeason: "Oct-Dec"
      },
      {
        id: 37,
        title: "Tripura Heritage & Bamboo Crafts Tour",
        description: "Discover ancient temples and traditional bamboo craft heritage of Tripura",
        duration: "4 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("4 Days", "cultural", "Easy", "Tripura", "Oct-Mar"),
        image: tripuraTribal,
        images: [tripuraTribal, unakotiSculptures, kohimaWarCemetery],
        rating: 4.5,
        category: "cultural",
        location: "Tripura",
        highlights: ["Ujjayanta Palace", "Bamboo Workshops", "Tribal Culture", "Ancient Temples"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 38,
        title: "Nagaland-Manipur Cultural Journey (Oct-Dec)",
        description: "Discover the rich heritage and traditions of Nagaland and Manipur",
        duration: "6 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("6 Days", "cultural", "Easy", "Northeast India", "Oct-Dec"),
        image: nagalandHornbillFestival,
        images: [nagalandHornbillFestival, kohimaWarCemetery, unakotiSculptures],
        rating: 4.8,
        category: "cultural",
        location: "Northeast India",
        highlights: ["Traditional Arts", "Local Crafts", "Cultural Shows", "Regional Cuisine"],
        bestSeason: "Oct-Dec"
      }
    ],
    
    "Uttarakhand": [
      {
        id: 6,
        title: "Char Dham Yatra Complete",
        description: "Sacred pilgrimage to all four dhams - Kedarnath, Badrinath, Gangotri, and Yamunotri",
        duration: "12 Days",
        difficulty: "Challenging",
        price: TourPricingService.calculatePrice("12 Days", "cultural", "Challenging", "Uttarakhand", "May-Oct"),
        image: charDhamYatra,
        images: [charDhamYatra, uttarakhandHimalayas, rishikeshAdventure],
        rating: 4.9,
        category: "cultural",
        location: "Uttarakhand",
        highlights: ["Sacred Temples", "Spiritual Journey", "Mountain Views", "Holy Rivers"],
        bestSeason: "May-Oct"
      },
      {
        id: 7,
        title: "Rishikesh Adventure Sports",
        description: "Ultimate adventure experience with river rafting, bungee jumping, and yoga retreats",
        duration: "5 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("5 Days", "adventure", "Moderate", "Uttarakhand", "Sep-Nov, Mar-May"),
        image: rishikeshAdventure,
        images: [rishikeshAdventure, uttarakhandHimalayas, charDhamYatra],
        rating: 4.7,
        category: "adventure",
        location: "Uttarakhand",
        highlights: ["White Water Rafting", "Bungee Jumping", "Yoga Sessions", "Ganga Aarti"],
        bestSeason: "Sep-Nov, Mar-May"
      },
      {
        id: 8,
        title: "Nainital Lake District Tour",
        description: "Explore the beautiful lake district with boating, trekking, and hill station charm",
        duration: "4 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("4 Days", "leisure", "Easy", "Uttarakhand", "Mar-Jun, Sep-Nov"),
        image: nainitalLakeDistrict,
        images: [nainitalLakeDistrict, uttarakhandHimalayas, valleyOfFlowers],
        rating: 4.6,
        category: "leisure",
        location: "Uttarakhand",
        highlights: ["Naini Lake", "Snow View Point", "Mall Road", "Cable Car Rides"],
        bestSeason: "Mar-Jun, Sep-Nov"
      },
      {
        id: 9,
        title: "Valley of Flowers Trek",
        description: "UNESCO World Heritage site trek through alpine meadows filled with endemic flora",
        duration: "6 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("6 Days", "adventure", "Moderate", "Uttarakhand", "Jul-Sep"),
        image: valleyOfFlowers,
        images: [valleyOfFlowers, uttarakhandHimalayas, nainitalLakeDistrict],
        rating: 4.8,
        category: "adventure",
        location: "Uttarakhand",
        highlights: ["Endemic Flowers", "UNESCO Site", "Alpine Meadows", "Hemkund Sahib"],
        bestSeason: "Jul-Sep"
      },
      {
        id: 10,
        title: "Haridwar Spiritual Journey",
        description: "Sacred city experience with Ganga Aarti, temple visits, and spiritual cleansing",
        duration: "3 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "cultural", "Easy", "Uttarakhand", "Oct-Mar"),
        image: uttarakhandHimalayas,
        images: [uttarakhandHimalayas, charDhamYatra, rishikeshAdventure],
        rating: 4.7,
        category: "cultural",
        location: "Uttarakhand",
        highlights: ["Har Ki Pauri", "Ganga Aarti", "Temple Tours", "Holy Dip"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 11,
        title: "Jim Corbett Wildlife Safari",
        description: "India's oldest national park with tiger spotting, wildlife photography, and nature walks",
        duration: "3 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "adventure", "Easy", "Uttarakhand", "Nov-Jun"),
        image: uttarakhandHimalayas,
        images: [uttarakhandHimalayas, rishikeshAdventure, nainitalLakeDistrict],
        rating: 4.6,
        category: "adventure",
        location: "Uttarakhand",
        highlights: ["Tiger Safari", "Wildlife Photography", "Nature Walks", "Bird Watching"],
        bestSeason: "Nov-Jun"
      }
    ],
    
    "Sikkim": [
      {
        id: 12,
        title: "Gurudongmar Lake Expedition",
        description: "High-altitude sacred lake at 17,800 feet with breathtaking Himalayan views",
        duration: "5 Days",
        difficulty: "Challenging",
        price: TourPricingService.calculatePrice("5 Days", "adventure", "Challenging", "Sikkim", "Apr-Jun, Sep-Nov"),
        image: gurudongmarLake,
        images: [gurudongmarLake, sikkimRhododendrons, pellingKanchenjunga],
        rating: 4.9,
        category: "adventure",
        location: "Sikkim",
        highlights: ["Sacred Lake", "High Altitude", "Himalayan Views", "Photography"],
        bestSeason: "Apr-Jun, Sep-Nov"
      },
      {
        id: 13,
        title: "Rhododendron Trail Trek",
        description: "Spring trek through blooming rhododendron forests with panoramic mountain views",
        duration: "7 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("7 Days", "adventure", "Moderate", "Sikkim", "Mar-May"),
        image: sikkimRhododendrons,
        images: [sikkimRhododendrons, gurudongmarLake, pellingKanchenjunga],
        rating: 4.8,
        category: "adventure",
        location: "Sikkim",
        highlights: ["Rhododendron Blooms", "Mountain Views", "Forest Trek", "Local Villages"],
        bestSeason: "Mar-May"
      },
      {
        id: 14,
        title: "Pelling Kanchenjunga Views",
        description: "Spectacular sunrise views of Kanchenjunga with monastery visits and cultural experiences",
        duration: "4 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("4 Days", "leisure", "Easy", "Sikkim", "Oct-May"),
        image: pellingKanchenjunga,
        images: [pellingKanchenjunga, sikkimRhododendrons, gurudongmarLake],
        rating: 4.7,
        category: "leisure",
        location: "Sikkim",
        highlights: ["Kanchenjunga Views", "Monasteries", "Sunrise Points", "Local Culture"],
        bestSeason: "Oct-May"
      },
      {
        id: 15,
        title: "Gangtok Cultural Tour",
        description: "Capital city exploration with monasteries, markets, and panoramic cable car rides",
        duration: "3 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "cultural", "Easy", "Sikkim", "Year Round"),
        image: sikkimRhododendrons,
        images: [sikkimRhododendrons, pellingKanchenjunga, gurudongmarLake],
        rating: 4.6,
        category: "cultural",
        location: "Sikkim",
        highlights: ["Rumtek Monastery", "MG Road", "Cable Car", "Flower Exhibition"],
        bestSeason: "Year Round"
      },
      {
        id: 16,
        title: "Yumthang Valley & Zero Point",
        description: "Valley of flowers with hot springs, alpine meadows, and snow-capped peaks",
        duration: "6 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("6 Days", "adventure", "Moderate", "Sikkim", "Apr-Jun, Oct-Dec"),
        image: gurudongmarLake,
        images: [gurudongmarLake, sikkimRhododendrons, pellingKanchenjunga],
        rating: 4.8,
        category: "adventure",
        location: "Sikkim",
        highlights: ["Valley of Flowers", "Hot Springs", "Zero Point", "Yak Rides"],
        bestSeason: "Apr-Jun, Oct-Dec"
      }
    ],
    
    "Himachal Pradesh": [
      {
        id: 17,
        title: "Shimla Manali Honeymoon Special",
        description: "Romantic hill station tour with scenic drives, cozy hotels, and couple activities",
        duration: "6 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("6 Days", "leisure", "Easy", "Himachal Pradesh", "Apr-Jun, Sep-Nov"),
        image: shimlaManaliHoneymoon,
        images: [shimlaManaliHoneymoon, himachalValleys, dharamshalaMcleodganj],
        rating: 4.8,
        category: "leisure",
        location: "Himachal Pradesh",
        highlights: ["Romantic Settings", "Scenic Drives", "Mall Road", "Solang Valley"],
        bestSeason: "Apr-Jun, Sep-Nov"
      },
      {
        id: 18,
        title: "Spiti Valley Adventure",
        description: "Remote high-altitude desert with ancient monasteries and dramatic landscapes",
        duration: "8 Days",
        difficulty: "Challenging",
        price: TourPricingService.calculatePrice("8 Days", "adventure", "Challenging", "Himachal Pradesh", "Jun-Sep"),
        image: spitiValley,
        images: [spitiValley, himachalValleys, dharamshalaMcleodganj],
        rating: 4.9,
        category: "adventure",
        location: "Himachal Pradesh",
        highlights: ["High Altitude Desert", "Ancient Monasteries", "Dramatic Landscapes", "Remote Villages"],
        bestSeason: "Jun-Sep"
      },
      {
        id: 19,
        title: "Dharamshala McLeod Ganj Spiritual",
        description: "Dalai Lama's residence with Tibetan culture, meditation, and mountain views",
        duration: "4 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("4 Days", "cultural", "Easy", "Himachal Pradesh", "Mar-Jun, Sep-Nov"),
        image: dharamshalaMcleodganj,
        images: [dharamshalaMcleodganj, himachalValleys, shimlaManaliHoneymoon],
        rating: 4.7,
        category: "cultural",
        location: "Himachal Pradesh",
        highlights: ["Dalai Lama Temple", "Tibetan Culture", "Meditation Sessions", "Bhagsu Falls"],
        bestSeason: "Mar-Jun, Sep-Nov"
      },
      {
        id: 20,
        title: "Kasol Tosh Valley Trek",
        description: "Mini Israel of India with hippie culture, riverside camping, and mountain treks",
        duration: "5 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("5 Days", "adventure", "Moderate", "Himachal Pradesh", "Apr-Jun, Sep-Nov"),
        image: himachalValleys,
        images: [himachalValleys, dharamshalaMcleodganj, spitiValley],
        rating: 4.6,
        category: "adventure",
        location: "Himachal Pradesh",
        highlights: ["Parvati Valley", "Riverside Camping", "Mountain Treks", "Cafe Culture"],
        bestSeason: "Apr-Jun, Sep-Nov"
      },
      {
        id: 25,
        title: "Kullu Valley Adventure Sports",
        description: "River rafting, paragliding, and adventure sports in the beautiful Kullu Valley",
        duration: "4 Days",
        difficulty: "Moderate",
        price: TourPricingService.calculatePrice("4 Days", "adventure", "Moderate", "Himachal Pradesh", "Apr-Jun, Sep-Nov"),
        image: himachalValleys,
        images: [himachalValleys, shimlaManaliHoneymoon, dharamshalaMcleodganj],
        rating: 4.7,
        category: "adventure",
        location: "Himachal Pradesh",
        highlights: ["River Rafting", "Paragliding", "Valley Views", "Adventure Sports"],
        bestSeason: "Apr-Jun, Sep-Nov"
      }
    ],
    
    "Kerala": [
      {
        id: 26,
        title: "Kerala Backwaters Houseboat",
        description: "Luxury houseboat cruise through serene backwaters with traditional Kerala cuisine",
        duration: "5 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("5 Days", "leisure", "Easy", "Kerala", "Oct-Mar"),
        image: keralaBackwaters,
        images: [keralaBackwaters, munnarTeaGardensKerala, thekkadyWildlife],
        rating: 4.8,
        category: "leisure",
        location: "Kerala",
        highlights: ["Houseboat Cruise", "Backwater Views", "Kerala Cuisine", "Village Life"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 27,
        title: "Munnar Tea Gardens & Hills",
        description: "Rolling tea plantations, cool climate, and scenic hill station experiences",
        duration: "4 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("4 Days", "leisure", "Easy", "Kerala", "Sep-May"),
        image: munnarTeaGardensKerala,
        images: [munnarTeaGardensKerala, keralaBackwaters, thekkadyWildlife],
        rating: 4.7,
        category: "leisure",
        location: "Kerala",
        highlights: ["Tea Plantations", "Hill Station", "Cool Climate", "Scenic Views"],
        bestSeason: "Sep-May"
      },
      {
        id: 28,
        title: "Thekkady Wildlife Sanctuary",
        description: "Periyar Wildlife Sanctuary with elephant spotting, spice plantations, and boat rides",
        duration: "3 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "adventure", "Easy", "Kerala", "Oct-Apr"),
        image: thekkadyWildlife,
        images: [thekkadyWildlife, keralaBackwaters, munnarTeaGardensKerala],
        rating: 4.6,
        category: "adventure",
        location: "Kerala",
        highlights: ["Wildlife Safari", "Elephant Spotting", "Spice Gardens", "Boat Rides"],
        bestSeason: "Oct-Apr"
      },
      {
        id: 29,
        title: "Kochi Cultural Heritage",
        description: "Port city with colonial architecture, Chinese fishing nets, and cultural performances",
        duration: "3 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "cultural", "Easy", "Kerala", "Oct-Mar"),
        image: keralaBackwaters,
        images: [keralaBackwaters, munnarTeaGardensKerala, thekkadyWildlife],
        rating: 4.6,
        category: "cultural",
        location: "Kerala",
        highlights: ["Chinese Fishing Nets", "Colonial Architecture", "Kathakali Dance", "Spice Markets"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 30,
        title: "Kerala Ayurveda Wellness",
        description: "Authentic Ayurvedic treatments, yoga sessions, and holistic wellness experiences",
        duration: "7 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("7 Days", "wellness", "Easy", "Kerala", "Year Round"),
        image: munnarTeaGardensKerala,
        images: [munnarTeaGardensKerala, keralaBackwaters, thekkadyWildlife],
        rating: 4.9,
        category: "wellness",
        location: "Kerala",
        highlights: ["Ayurvedic Treatments", "Yoga Sessions", "Wellness Retreat", "Herbal Medicine"],
        bestSeason: "Year Round"
      }
    ],
    
    "Tamil Nadu": [
      {
        id: 31,
        title: "Tamil Nadu Temple Circuit",
        description: "Sacred temple tour covering Madurai, Thanjavur, and Chidambaram with cultural immersion",
        duration: "6 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("6 Days", "cultural", "Easy", "Tamil Nadu", "Nov-Mar"),
        image: tamilNaduTemplesPinterest,
        images: [tamilNaduTemplesPinterest, tamilNaduTemplesNew, ootyKodaikanal],
        rating: 4.8,
        category: "cultural",
        location: "Tamil Nadu",
        highlights: ["Ancient Temples", "Dravidian Architecture", "Cultural Heritage", "Religious Festivals"],
        bestSeason: "Nov-Mar"
      },
      {
        id: 32,
        title: "Ooty Kodaikanal Hill Stations",
        description: "Cool hill stations with toy train rides, botanical gardens, and scenic viewpoints",
        duration: "5 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("5 Days", "leisure", "Easy", "Tamil Nadu", "Apr-Jun, Sep-Nov"),
        image: ootyKodaikanal,
        images: [ootyKodaikanal, tamilNaduTemplesPinterest, tamilNaduTemplesNew],
        rating: 4.7,
        category: "leisure",
        location: "Tamil Nadu",
        highlights: ["Toy Train", "Botanical Gardens", "Lake Views", "Cool Climate"],
        bestSeason: "Apr-Jun, Sep-Nov"
      },
      {
        id: 33,
        title: "Mahabalipuram Heritage Tour",
        description: "UNESCO World Heritage rock-cut temples and sculptures with beach relaxation",
        duration: "3 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("3 Days", "cultural", "Easy", "Tamil Nadu", "Nov-Feb"),
        image: tamilNaduTemplesNew,
        images: [tamilNaduTemplesNew, tamilNaduTemplesPinterest, ootyKodaikanal],
        rating: 4.6,
        category: "cultural",
        location: "Tamil Nadu",
        highlights: ["Rock-cut Temples", "UNESCO Heritage", "Beach Views", "Ancient Sculptures"],
        bestSeason: "Nov-Feb"
      },
      {
        id: 34,
        title: "Chettinad Cuisine & Culture",
        description: "Culinary journey through Chettinad region with cooking classes and heritage mansions",
        duration: "4 Days",
        difficulty: "Easy",
        price: TourPricingService.calculatePrice("4 Days", "cultural", "Easy", "Tamil Nadu", "Oct-Dec"),
        image: ootyKodaikanal,
        images: [ootyKodaikanal, tamilNaduTemplesPinterest, tamilNaduTemplesNew],
        rating: 4.8,
        category: "leisure",
        location: "Tamil Nadu",
        highlights: ["Perfect Weather", "Scenic Views", "Tea Gardens", "Colonial Architecture"],
        bestSeason: "Oct-Dec"
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
      <SEOContent page="travel" />
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
                  <h1 className="text-2xl font-bold text-gray-900 mb-4 font-playfair">
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
                        className="ml-auto bg-white border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 hover:text-orange-800 font-medium px-4 py-2 shadow-sm transition-all duration-200"
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
                    
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
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
                               <div 
                                 className="text-5xl lg:text-6xl mb-3 leading-none flag-container"
                                 style={{
                                   fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Twemoji Mozilla", "Android Emoji", sans-serif',
                                   fontSize: 'clamp(3rem, 5vw, 4rem)',
                                   lineHeight: '1',
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center',
                                   height: '4rem',
                                   width: '100%',
                                   WebkitFontFeatureSettings: '"liga", "kern", "clig", "calt"',
                                   fontFeatureSettings: '"liga", "kern", "clig", "calt"',
                                   textRendering: 'optimizeLegibility',
                                   unicodeBidi: 'isolate',
                                   fontSynthesis: 'none',
                                   WebkitFontSmoothing: 'antialiased',
                                   MozOsxFontSmoothing: 'grayscale'
                                 }}
                               >
                                 {item.flag}
                               </div>
                             <h4 className="font-semibold text-gray-900 mb-1 text-lg">{item.country}</h4>
                             <p className="text-sm text-gray-600 mb-3">{item.highlight}</p>
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
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
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
                               <div 
                                 className="text-5xl lg:text-6xl mb-3 leading-none flag-container"
                                 style={{
                                   fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Twemoji Mozilla", "Android Emoji", sans-serif',
                                   fontSize: 'clamp(3rem, 5vw, 4rem)',
                                   lineHeight: '1',
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center',
                                   height: '4rem',
                                   width: '100%',
                                   WebkitFontFeatureSettings: '"liga", "kern", "clig", "calt"',
                                   fontFeatureSettings: '"liga", "kern", "clig", "calt"',
                                   textRendering: 'optimizeLegibility',
                                   unicodeBidi: 'isolate',
                                   fontSynthesis: 'none',
                                   WebkitFontSmoothing: 'antialiased',
                                   MozOsxFontSmoothing: 'grayscale'
                                 }}
                               >
                                 {item.flag}
                               </div>
                             <h4 className="font-semibold text-gray-900 mb-1 text-lg">{item.country}</h4>
                             <p className="text-sm text-gray-600 mb-3">{item.highlight}</p>
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
