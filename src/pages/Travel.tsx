import React, { useState, useEffect, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Globe, Package, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompactTourPackageCard from "@/components/CompactTourPackageCard";
import { LazyTourPackageModal } from "@/components/lazy/LazyTourPackageModal";
import LazyWrapper from "@/components/LazyWrapper";
import SEOContent from "@/components/SEOContent";
import { TourPricingService } from "@/utils/tourPricingService";
import UnifiedImage from "@/components/UnifiedImage"; // Updated to UnifiedImage
import incredibleIndiaLogo from "@/assets/incredible-india-logo.png";
import reHimalayanNepalExpedition from "@/assets/re-himalayan-expedition-cover.jpg";

// Import images for tour packages
import meghalayaBiodiversityAuthenticImg from "@/assets/meghalaya-biodiversity-authentic.jpg";
import wildernessSurvivalImg from "@/assets/wilderness-survival-authentic.jpg";
import arunachalTribalImg from "@/assets/arunachal-tribal-premium.jpg";
import wariChoraAuthenticImg from "@/assets/wari-chora-authentic.jpg";
import doubleDeckerRootBridgeImg from "@/assets/double-decker-root-bridge-cherrapunji.jpg";
import himachalYogaRetreatImg from "@/assets/himachal-yoga-retreat.jpg";
import kremChympeCaveImg from "@/assets/krem-chympe-cave-expedition.jpg";
import dawkiCrystalClearImg from "@/assets/dawki-crystal-clear-authentic.jpg";
import assamTeaGardensImg from "@/assets/assam-tea-gardens-premium.jpg";
import krangSuriWaterfallImg from "@/assets/krang-suri-waterfall.jpg";
import phiPhiWaterfallTrekImg from "@/assets/phi-phi-waterfall-trek.jpg";
import moopunWaterfallImg from "@/assets/moopun-waterfall.jpg";
import manipurLoktakImg from "@/assets/manipur-loktak-premium.jpg";
import tripuraTribalImg from "@/assets/tripura-tribal-premium.jpg";
import charDhamYatraImg from "@/assets/char-dham-yatra.jpg";
import nainitalLakeImg from "@/assets/nainital-lake-district.jpg";
import sikkimRhododendronImg from "@/assets/sikkim-rhododendrons-premium.jpg";
import pellingKanchenjungaImg from "@/assets/pelling-kanchenjunga.jpg";
import gurudongmarLakeImg from "@/assets/gurudongmar-lake-high-altitude-stock.jpg";
import keralaBackwatersImg from "@/assets/kerala-backwaters-authentic.jpg";
import thekkadyWildlifeImg from "@/assets/thekkady-wildlife.jpg";
import tamilNaduMeenakshiTempleImg from "@/assets/tamil-nadu-meenakshi-temple.jpg";
import tamilNaduKanchipuramTempleImg from "@/assets/tamil-nadu-kanchipuram-temple.jpg";
import tamilNaduBrihadeeswraUnescoImg from "@/assets/tamil-nadu-brihadeeswara-unesco.jpg";
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
import arunachalEagleFestivalImg from "@/assets/arunachal-eagle-festival-stock.jpg";
import dharamshalaMcleodGanjImg from "@/assets/dharamshala-mcleod-ganj-stock.jpg";
import kulluValleyAdventureImg from "@/assets/kullu-valley-adventure-stock.jpg";
import royalEnfieldHimalayanImg from "@/assets/royal-enfield-himalayan-mountain.jpg";
import motorcycleMountainRoadImg from "@/assets/motorcycle-mountain-road.jpg";
import phiPhiWaterfallMeghalayaImg from "@/assets/phi-phi-waterfall-meghalaya.jpg";
import bumlaPassBikeExpeditionImg from "@/assets/bumla-pass-bike-expedition.jpg";
import arunachalCulturalFestivalImg from "@/assets/arunachal-cultural-festival.jpg";
import tripuraBambooHeritageImg from "@/assets/tripura-bamboo-heritage.jpg";
import tawangMonasteryMountainsImg from "@/assets/tawang-monastery-mountains.jpg";
import doubleDeckerBridgeNewImg from "@/assets/double-decker-bridge-new.jpg";
import hornbillFestivalHeroImg from "@/assets/hornbill-festival-nagaland-hero.jpg";

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
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  // Enhanced tour packages data organized by states - All Oct-Mar friendly & shuffled
  const stateWiseTourPackages = {
    "XTSY Exclusive Tours": [{
      id: 203,
      title: "XTSY Exclusive: Northeast Ecological Immersion",
      description: "Winter biodiversity program exploring endemic species, conservation science, and climate research with expert ecologists",
      duration: "8 Days",
      difficulty: "Easy",
      price: "₹48,500",
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg",
      images: ["https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg", "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg", "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg"],
      rating: 4.9,
      category: "educational",
      location: "Northeast India",
      highlights: ["Wildlife Photography Workshops", "Plant Identification Hikes", "Ecosystem Mapping", "Citizen Science Projects", "Climate Change Field Studies", "Butterfly Tracking", "Bird Migration Observation"],
      bestSeason: "Oct-Mar",
      exclusive: true
    }, {
      id: 204,
      title: "XTSY Exclusive: Wari Chora - Hidden Gem of Meghalaya",
      description: "An adrenaline-fueled expedition through Meghalaya's most remote terrain. Trek through untamed forests, rappel down pristine waterfalls, navigate challenging mountain trails, and experience extreme wilderness camping in one of Northeast India's most exclusive adventure destinations",
      duration: "5 Days",
      difficulty: "Challenging",
      price: "₹48,500",
      image: wariChoraAuthenticImg,
      images: [wariChoraAuthenticImg, wariChoraAuthenticImg, wariChoraAuthenticImg],
      rating: 4.9,
      category: "adventure",
      location: "Meghalaya",
      highlights: ["Waterfall Rappelling & Canyoning", "Multi-Day Mountain Trek", "Wild River Crossing", "Extreme Wilderness Camping", "Night Trek Through Sacred Forests", "Rock Climbing Expeditions", "Survival Skills Training", "Summit Sunrise Experience"],
      bestSeason: "Oct-Mar",
      exclusive: true
    }, {
      id: 201,
      title: "XTSY Exclusive: Meghalaya Biodiversity Research",
      description: "Comprehensive winter field study of Northeast's unique ecosystems with conservation experts and naturalist guides",
      duration: "7 Days",
      difficulty: "Moderate",
      price: "₹42,500",
      image: meghalayaBiodiversityAuthenticImg,
      images: [meghalayaBiodiversityAuthenticImg, meghalayaBiodiversityAuthenticImg, meghalayaBiodiversityAuthenticImg],
      rating: 4.9,
      category: "cultural",
      location: "Northeast India",
      highlights: ["Expert Naturalist Expeditions", "Endemic Species Documentation", "Research Field Work", "Conservation Workshops", "Night Safari Adventures", "Botanical Garden Visits", "Scientific Photography"],
      bestSeason: "Oct-Mar",
      exclusive: true
    }, {
      id: 202,
      title: "XTSY Exclusive: Wilderness Survival Winter Camp",
      description: "Master winter survival skills, nature navigation, and sustainable living in pristine Northeast wilderness",
      duration: "5 Days",
      difficulty: "Challenging",
      price: "₹29,500",
      image: wildernessSurvivalImg,
      images: [wildernessSurvivalImg, wildernessSurvivalImg, wildernessSurvivalImg],
      rating: 4.8,
      category: "adventure",
      location: "Northeast India",
      highlights: ["Winter Survival Training", "Wilderness Navigation", "Natural Shelter Building", "Foraging & Wild Edibles", "Water Purification Techniques", "Fire Making Mastery", "Leave No Trace Ethics"],
      bestSeason: "Oct-Mar",
      exclusive: true
    }, {
      id: 205,
      title: "XTSY Exclusive: Himachal Yoga Retreat Program",
      description: "Transformative winter yoga and meditation retreat in the peaceful Himalayan foothills - daily asana practice, pranayama, and spiritual workshops",
      duration: "7 Days",
      difficulty: "Easy",
      price: "₹42,500",
      image: himachalYogaRetreatImg,
      images: [himachalYogaRetreatImg, himachalYogaRetreatImg, himachalYogaRetreatImg],
      rating: 4.9,
      category: "cultural",
      location: "Himachal Pradesh",
      highlights: ["Daily Hatha Yoga Sessions", "Guided Meditation Practices", "Pranayama Breathwork", "Ayurvedic Spa Treatments", "Himalayan Nature Walks", "Spiritual Philosophy Classes", "Organic Sattvic Cuisine", "Sound Healing Therapy"],
      bestSeason: "Oct-Mar",
      exclusive: true
    }, {
      id: 206,
      title: "XTSY Exclusive: Khaddum Expedition - Krem Chympe",
      description: "Epic underground adventure through India's fifth longest cave system - UNESCO World Heritage Site featuring 21+ km of limestone passages, underground rivers, and spectacular geological formations",
      duration: "6 Days",
      difficulty: "Challenging",
      price: "₹36,500",
      image: kremChympeCaveImg,
      images: [kremChympeCaveImg, kremChympeCaveImg, kremChympeCaveImg],
      rating: 5.0,
      category: "adventure",
      location: "Meghalaya",
      highlights: ["UNESCO Cave System Exploration", "Technical Caving & Rappelling", "Underground River Navigation", "Limestone Formation Study", "Professional Speleology Training", "Cave Photography Workshops", "Geological Heritage Tours", "Expert Cave Guide Team", "Premium Expedition Gear Included"],
      bestSeason: "Oct-Mar",
      exclusive: true
    }],
    "Meghalaya": [{
      id: 4,
      title: "Dawki Crystal Waters Winter Escape",
      description: "Experience the world's clearest river during perfect winter weather - boat rides reveal the riverbed 20 feet below like floating on glass",
      duration: "3 Days",
      difficulty: "Easy",
      price: "₹16,500",
      image: dawkiCrystalClearImg,
      images: [dawkiCrystalClearImg, dawkiCrystalClearImg, dawkiCrystalClearImg],
      rating: 4.9,
      category: "leisure",
      location: "Meghalaya",
      highlights: ["Transparent River Boating", "Indo-Bangladesh Border Views", "Winter Photography", "Local Khasi Cuisine", "Riverside Camping"],
      bestSeason: "Oct-Mar"
    }, {
      id: 1,
      title: "Double Decker Root Bridge and Cherrapunji Exploration",
      description: "Trek through pristine winter forests to discover 500-year-old living bridges crafted by nature and tribal wisdom",
      duration: "5 Days",
      difficulty: "Moderate",
      price: "₹29,500",
      image: doubleDeckerBridgeNewImg,
      images: [doubleDeckerBridgeNewImg, doubleDeckerBridgeNewImg, doubleDeckerBridgeNewImg],
      rating: 4.8,
      category: "adventure",
      location: "Meghalaya",
      highlights: ["Double Decker Root Bridge Trek", "Rainbow Falls Swim", "Khasi Village Homestays", "Jungle Survival Skills", "Bio-Luminescent Cave Exploration"],
      bestSeason: "Oct-Mar"
    }, {
      id: 5,
      title: "Shillong Winter Cultural Sojourn",
      description: "Immerse in the Scotland of East during crisp winter months - explore colonial heritage, vibrant markets, and traditional Khasi culture",
      duration: "2 Days",
      difficulty: "Easy",
      price: "₹10,500",
      image: shillongCherryBlossomImg,
      images: [shillongCherryBlossomImg, shillongCherryBlossomImg, shillongCherryBlossomImg],
      rating: 4.7,
      category: "cultural",
      location: "Meghalaya",
      highlights: ["Don Bosco Museum", "Police Bazaar Shopping", "Ward's Lake", "Elephant Falls", "Local Music Scene", "Pine Forest Walks"],
      bestSeason: "Oct-Mar"
    }, {
      id: 6,
      title: "Krang Suri Waterfall Budget Getaway",
      description: "Affordable 2-day escape to Meghalaya's stunning turquoise waterfall paradise - swim in crystal-clear natural pools surrounded by pristine jungle",
      duration: "2 Days",
      difficulty: "Easy",
      price: "₹10,500",
      image: krangSuriWaterfallImg,
      images: [krangSuriWaterfallImg, krangSuriWaterfallImg, krangSuriWaterfallImg],
      rating: 4.6,
      category: "leisure",
      location: "Meghalaya",
      highlights: ["Crystal Clear Turquoise Pools", "Natural Swimming Experience", "Scenic Jungle Trek", "Photography Paradise", "Budget Homestay", "Local Jaintia Cuisine"],
      bestSeason: "Oct-Mar"
    }, {
      id: 7,
      title: "Phi Phi & Moopun Waterfalls Adventure",
      description: "Budget-friendly 3-day waterfall hopping tour through Meghalaya's hidden cascades - trek to pristine falls, swim in natural pools, and explore untouched landscapes",
      duration: "3 Days",
      difficulty: "Moderate",
      price: "₹16,500",
      image: phiPhiWaterfallMeghalayaImg,
      images: [phiPhiWaterfallMeghalayaImg, moopunWaterfallImg, phiPhiWaterfallMeghalayaImg],
      rating: 4.7,
      category: "adventure",
      location: "Meghalaya",
      highlights: ["Phi Phi Falls Trek", "Moopun Waterfall Swim", "Hidden Cascade Exploration", "Jungle Trail Adventures", "Village Homestay Experience", "Photography Spots", "Local Guide Tours"],
      bestSeason: "Oct-Mar"
    }, {
      id: 8,
      title: "Meghalaya Waterfalls Budget Circuit",
      description: "Complete 3-day budget tour covering Krang Suri, Moopun, and multiple hidden waterfalls - perfect for nature lovers seeking affordable adventure",
      duration: "3 Days",
      difficulty: "Easy",
      price: "₹16,500",
      image: moopunWaterfallImg,
      images: [moopunWaterfallImg, krangSuriWaterfallImg, moopunWaterfallImg],
      rating: 4.5,
      category: "leisure",
      location: "Meghalaya",
      highlights: ["Multiple Waterfall Visits", "Natural Swimming Pools", "Budget Accommodation", "Local Food Experience", "Nature Photography", "Relaxed Pace Tour", "Eco-friendly Travel"],
      bestSeason: "Oct-Mar"
    }],
    "Northeast States": [{
      id: 24,
      title: "Manipur Loktak Lake Winter Discovery",
      description: "Explore the world's only floating national park during ideal winter conditions - witness dancing deer and floating villages",
      duration: "4 Days",
      difficulty: "Easy",
      price: "₹23,500",
      image: manipurLoktakImg,
      images: [manipurLoktakImg, manipurLoktakImg, manipurLoktakImg],
      rating: 4.7,
      category: "leisure",
      location: "Manipur",
      highlights: ["Keibul Lamjao Park Safari", "Sangai Deer Spotting", "Floating Village Visits", "Phumdi Island Exploration", "Traditional Boat Rides", "Ima Keithel Market"],
      bestSeason: "Oct-Mar"
    }, {
      id: 22,
      title: "Assam Wildlife & Tea Heritage",
      description: "Winter wildlife safaris in Kaziranga followed by aromatic tea garden tours - perfect weather for rhino spotting",
      duration: "6 Days",
      difficulty: "Easy",
      price: "₹36,500",
      image: assamTeaGardensImg,
      images: [assamTeaGardensImg, assamTeaGardensImg, assamTeaGardensImg],
      rating: 4.6,
      category: "leisure",
      location: "Assam",
      highlights: ["Kaziranga Elephant Safari", "One-Horned Rhino Encounters", "Tea Estate Tours", "Tea Tasting Sessions", "River Island Majuli", "Kamakhya Temple"],
      bestSeason: "Oct-Mar"
    }, {
      id: 21,
      title: "Arunachal Winter Cultural Festival",
      description: "Immerse in vibrant tribal traditions during peak festival season with traditional dances, crafts, and mountain vistas",
      duration: "6 Days",
      difficulty: "Moderate",
      price: "₹36,500",
      image: arunachalCulturalFestivalImg,
      images: [arunachalCulturalFestivalImg, arunachalTribalImg, arunachalCulturalFestivalImg],
      rating: 4.8,
      category: "cultural",
      location: "Arunachal Pradesh",
      highlights: ["Tribal Dance Performances", "Traditional Craft Markets", "Mountain Monastery Visits", "Local Cuisine Workshops", "Cultural Immersion Programs", "Sunrise Valley Views"],
      bestSeason: "Oct-Mar"
    }, {
      id: 26,
      title: "Tripura Heritage & Craft Trail",
      description: "Winter journey through ancient palaces and bamboo craft villages - discover sustainable tribal artisan traditions",
      duration: "4 Days",
      difficulty: "Moderate",
      price: "₹23,500",
      image: tripuraBambooHeritageImg,
      images: [tripuraBambooHeritageImg, mizoramBambooImg, tripuraBambooHeritageImg],
      rating: 4.5,
      category: "cultural",
      location: "Tripura",
      highlights: ["Ujjayanta Palace Tour", "Bamboo Craft Workshops", "Tribal Heritage Museums", "Neermahal Water Palace", "Handicraft Village Visits", "Traditional Weaving Demos"],
      bestSeason: "Oct-Mar"
    }, {
      id: 28,
      title: "Arunachal - Bumla Pass Bike Expedition",
      description: "Epic motorcycle journey to the Indo-China border at 15,200 feet - conquer high-altitude mountain passes through breathtaking Himalayan landscapes and pristine valleys",
      duration: "8 Days",
      difficulty: "Challenging",
      price: "₹48,500",
      image: bumlaPassBikeExpeditionImg,
      images: [bumlaPassBikeExpeditionImg, motorcycleMountainRoadImg, bumlaPassBikeExpeditionImg],
      rating: 4.9,
      category: "adventure",
      location: "Arunachal Pradesh",
      highlights: ["Ride to Bumla Pass 15,200 ft", "Tawang Monastery Visit", "Sela Pass Crossing", "Indo-China Border Experience", "High Altitude Biking", "Mountain Valley Exploration"],
      bestSeason: "Apr-Oct"
    }, {
      id: 29,
      title: "Arunachal - Tawang Exploration",
      description: "Discover the spiritual heart of Arunachal Pradesh with ancient monasteries, pristine mountain valleys, and Monpa tribal culture in the serene Himalayan highlands",
      duration: "6 Days",
      difficulty: "Moderate",
      price: "₹36,500",
      image: tawangMonasteryMountainsImg,
      images: [tawangMonasteryMountainsImg, gurudongmarLakeImg, tawangMonasteryMountainsImg],
      rating: 4.8,
      category: "cultural",
      location: "Arunachal Pradesh",
      highlights: ["Tawang Monastery - 400 years old", "Sela Pass Scenic Beauty", "Monpa Tribal Culture", "Madhuri Lake & Waterfalls", "War Memorial Visit", "Traditional Markets"],
      bestSeason: "Mar-Oct"
    }],
    "Kerala": [{
      id: 71,
      title: "Kerala Winter Backwaters Paradise",
      description: "Luxurious houseboat cruises through tranquil winter backwaters - perfect weather for palm-fringed canal exploration",
      duration: "5 Days",
      difficulty: "Easy",
      price: "₹29,500",
      image: keralaBackwatersImg,
      images: [keralaBackwatersImg, keralaBackwatersImg, keralaBackwatersImg],
      rating: 4.8,
      category: "leisure",
      location: "Kerala",
      highlights: ["Traditional Houseboat Stay", "Coconut Lagoon Cruises", "Authentic Kerala Cuisine", "Ayurvedic Spa Treatments", "Village Canoe Rides", "Sunset Photography"],
      bestSeason: "Oct-Mar"
    }, {
      id: 73,
      title: "Thekkady Wildlife & Spice Winter",
      description: "Periyar tiger reserve safaris and aromatic winter spice plantations - ideal season for wildlife and harvest tours",
      duration: "3 Days",
      difficulty: "Easy",
      price: "₹16,500",
      image: thekkadyWildlifeImg,
      images: [thekkadyWildlifeImg, thekkadyWildlifeImg, thekkadyWildlifeImg],
      rating: 4.6,
      category: "leisure",
      location: "Kerala",
      highlights: ["Periyar Lake Boat Safari", "Spice Plantation Tours", "Elephant Encounters", "Cardamom & Pepper Trails", "Bamboo Rafting", "Tribal Heritage Center"],
      bestSeason: "Oct-Mar"
    }],
    "Sikkim": [{
      id: 53,
      title: "Pelling Kanchenjunga Winter Views",
      description: "Crystal-clear winter skies reveal stunning Kanchenjunga vistas - perfect season for Himalayan photography and monastery tours",
      duration: "4 Days",
      difficulty: "Easy",
      price: "₹23,500",
      image: pellingKanchenjungaImg,
      images: [pellingKanchenjungaImg, pellingKanchenjungaImg, pellingKanchenjungaImg],
      rating: 4.6,
      category: "leisure",
      location: "Sikkim",
      highlights: ["Kanchenjunga Sunrise", "Buddhist Monasteries", "Sky Walk Glass Bridge", "Khecheopalri Sacred Lake", "Waterfall Hikes", "Traditional Sikkimese Cuisine"],
      bestSeason: "Oct-Mar"
    }, {
      id: 55,
      title: "North Sikkim Winter Expedition",
      description: "Adventure through snow-kissed valleys and pristine winter landscapes - challenging high-altitude exploration",
      duration: "7 Days",
      difficulty: "Challenging",
      price: "₹42,500",
      image: gurudongmarLakeImg,
      images: [gurudongmarLakeImg, gurudongmarLakeImg, gurudongmarLakeImg],
      rating: 4.9,
      category: "adventure",
      location: "Sikkim",
      highlights: ["Gurudongmar Sacred Lake", "Yumthang Valley Flowers", "Zero Point Snow", "Lachung Monastery", "Hot Spring Therapy", "High Altitude Acclimatization"],
      bestSeason: "Oct-Mar"
    }, {
      id: 52,
      title: "Sikkim Peaceful Winter Retreat",
      description: "Tranquil monastery stays and gentle valley walks during peaceful winter months - spiritual rejuvenation in the Himalayas",
      duration: "4 Days",
      difficulty: "Moderate",
      price: "₹23,500",
      image: sikkimRhododendronImg,
      images: [sikkimRhododendronImg, sikkimRhododendronImg, sikkimRhododendronImg],
      rating: 4.7,
      category: "leisure",
      location: "Sikkim",
      highlights: ["Rumtek Monastery", "Nature Valley Walks", "Mountain Panoramas", "Buddhist Meditation", "Local Homestays", "Organic Farm Visits"],
      bestSeason: "Oct-Mar"
    }],
    "Uttarakhand": [{
      id: 33,
      title: "Nainital Winter Lake Serenity",
      description: "Peaceful winter escape to pristine mountain lakes - colonial charm meets Kumaon hills beauty in perfect weather",
      duration: "4 Days",
      difficulty: "Easy",
      price: "₹23,500",
      image: nainitalLakeImg,
      images: [nainitalLakeImg, nainitalLakeImg, nainitalLakeImg],
      rating: 4.6,
      category: "leisure",
      location: "Uttarakhand",
      highlights: ["Naini Lake Boating", "Snow View Ropeway", "Mall Road Shopping", "Naina Devi Temple", "Eco Cave Gardens", "Winter Birdwatching"],
      bestSeason: "Oct-Mar"
    }, {
      id: 31,
      title: "Char Dham Winter Pilgrimage Prep",
      description: "Pre-season sacred sites exploration and winter yoga retreats - spiritual preparation in Himalayan foothills",
      duration: "8 Days",
      difficulty: "Moderate",
      price: "₹48,500",
      image: charDhamYatraImg,
      images: [charDhamYatraImg, charDhamYatraImg, charDhamYatraImg],
      rating: 4.9,
      category: "cultural",
      location: "Uttarakhand",
      highlights: ["Rishikesh Yoga Ashrams", "Haridwar Ganga Aarti", "Temple Circuit Tours", "Spiritual Discourses", "Meditation Retreats", "Himalayan Views"],
      bestSeason: "Oct-Mar"
    }],
    "Himachal Pradesh": [{
      id: 64,
      title: "Kullu Valley Winter Adventure",
      description: "Mild winter adventures with paragliding, river walks, and orchard tours - perfect blend of thrill and scenic beauty",
      duration: "4 Days",
      difficulty: "Moderate",
      price: "₹23,500",
      image: kulluValleyAdventureImg,
      images: [kulluValleyAdventureImg, kulluValleyAdventureImg, kulluValleyAdventureImg],
      rating: 4.5,
      category: "adventure",
      location: "Himachal Pradesh",
      highlights: ["Winter Paragliding", "Beas River Walks", "Apple Orchard Visits", "Hot Spring Therapy", "Kasol Village Cafes", "Mountain Biking Trails"],
      bestSeason: "Oct-Mar"
    }, {
      id: 63,
      title: "Dharamshala McLeod Ganj Winter",
      description: "Experience Tibetan culture and peaceful mountain life during crisp winter months - meditation and trekking combined",
      duration: "5 Days",
      difficulty: "Moderate",
      price: "₹29,500",
      image: dharamshalaMcleodGanjImg,
      images: [dharamshalaMcleodGanjImg, dharamshalaMcleodGanjImg, dharamshalaMcleodGanjImg],
      rating: 4.7,
      category: "cultural",
      location: "Himachal Pradesh",
      highlights: ["Dalai Lama Temple Complex", "Tibetan Cultural Institute", "Triund Winter Trek", "Bhagsu Waterfall", "Norbulingka Monastery", "Tibetan Cuisine Workshops"],
      bestSeason: "Oct-Mar"
    }],
    "Tamil Nadu": [{
      id: 81,
      title: "Grand Tamil Nadu Temple Circuit - Premium Heritage",
      description: "Ultimate 10-day spiritual odyssey through Tamil Nadu's magnificent Dravidian temples - from Madurai's towering gopurams to Chidambaram's cosmic dance, experience architectural marvels and living traditions",
      duration: "10 Days",
      difficulty: "Moderate",
      price: "₹62,500",
      image: tamilNaduMeenakshiTempleImg,
      images: [tamilNaduMeenakshiTempleImg, tamilNaduMeenakshiTempleImg, tamilNaduMeenakshiTempleImg],
      rating: 4.9,
      category: "cultural",
      location: "Tamil Nadu",
      highlights: ["Meenakshi Temple Madurai", "Brihadeeswara Temple Thanjavur", "Rameswaram Sacred Pilgrimage", "Chidambaram Nataraja Temple", "Tiruchirappalli Rock Fort", "Temple Architecture Workshops", "Classical Bharatanatyam Performances", "Traditional Temple Cuisine", "Expert Heritage Guides", "Luxury Heritage Hotels"],
      bestSeason: "Oct-Mar"
    }, {
      id: 82,
      title: "Sacred Temples of South India - 9 Day Spiritual Journey",
      description: "Immersive winter pilgrimage through Tamil Nadu's holiest shrines - witness ancient rituals, experience temple festivals, and explore the profound spirituality of Chola dynasty architecture",
      duration: "9 Days",
      difficulty: "Easy",
      price: "₹56,500",
      image: tamilNaduKanchipuramTempleImg,
      images: [tamilNaduKanchipuramTempleImg, tamilNaduKanchipuramTempleImg, tamilNaduKanchipuramTempleImg],
      rating: 4.8,
      category: "cultural",
      location: "Tamil Nadu",
      highlights: ["Kanchipuram 1000 Pillar Temple", "Tirupati Venkateswara Darshan", "Mahabalipuram Shore Temple Sunrise", "Kumbakonam Temple Town", "Vedic Chanting Ceremonies", "Temple Priest Interactions", "Sacred Kaveri River Rituals", "Premium AC Transport", "Temple Festival Experiences"],
      bestSeason: "Oct-Mar"
    }, {
      id: 84,
      title: "Dravidian Architecture Masterclass - Premium Cultural Tour",
      description: "Exclusive 10-day deep dive into Tamil temple architecture with expert archaeologists - decode ancient inscriptions, study sculptural masterpieces, and understand Chola engineering genius",
      duration: "10 Days",
      difficulty: "Moderate",
      price: "₹62,500",
      image: tamilNaduBrihadeeswraUnescoImg,
      images: [tamilNaduBrihadeeswraUnescoImg, tamilNaduBrihadeeswraUnescoImg, tamilNaduBrihadeeswraUnescoImg],
      rating: 4.9,
      category: "cultural",
      location: "Tamil Nadu",
      highlights: ["UNESCO World Heritage Temples", "Bronze Sculpture Museums", "Ancient Inscription Study", "Gopuram Architecture Analysis", "Chola Art History Lectures", "Temple Astronomy Secrets", "Stone Carving Demonstrations", "Heritage Conservation Insights", "Photography Masterclass", "Luxury Boutique Stays"],
      bestSeason: "Oct-Mar"
    }, {
      id: 83,
      title: "Kodaikanal Winter Hill Retreat",
      description: "Misty winter mornings and cool Western Ghats climate - romantic hill station escape with lakes and viewpoints",
      duration: "3 Days",
      difficulty: "Easy",
      price: "₹16,500",
      image: ootyKodaikanalImg,
      images: [ootyKodaikanalImg, ootyKodaikanalImg, ootyKodaikanalImg],
      rating: 4.4,
      category: "leisure",
      location: "Tamil Nadu",
      highlights: ["Kodai Lake Cycling", "Coaker's Walk Sunset", "Bryant Park Florals", "Pillar Rocks Vista", "Pine Forest Trails", "Homemade Chocolate Factory"],
      bestSeason: "Oct-Mar"
    }]
  };

  // Flatten all packages for filtering
  const allItineraries = Object.values(stateWiseTourPackages).flat();
  const categories = [{
    id: "all",
    label: "All Packages"
  }, {
    id: "adventure",
    label: "Adventure"
  }, {
    id: "cultural",
    label: "Cultural"
  }, {
    id: "leisure",
    label: "Leisure"
  }];
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
  return <div className="min-h-screen flex flex-col">
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
                <div className="inline-flex items-center gap-1 sm:gap-2 p-2 sm:p-3 md:p-4 bg-white/80 backdrop-blur-sm rounded-md shadow-md mb-2 sm:mb-3 md:mb-4">
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl">🧳</span>
                  <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
                    XTSY Travel
                  </h1>
                </div>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto mb-2 sm:mb-3 md:mb-4 bg-white/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 md:p-4 shadow-md mx-2">
                  Embark on extraordinary journeys with XTSY Travel - your gateway to incredible experiences.
                </p>
              </div>

              {/* Ultra-compact Tab Navigation */}
              <div className="flex justify-center mb-1 sm:mb-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-md p-0.5 shadow-md flex w-full max-w-64">
                  <Button onClick={() => setActiveTab('domestic')} variant={activeTab === 'domestic' ? 'default' : 'ghost'} className={`flex-1 px-1.5 py-0.5 rounded-sm text-xs font-medium transition-all duration-200 h-6 ${activeTab === 'domestic' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-sm' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'}`}>
                    <MapPin className="h-2.5 w-2.5 mr-0.5" />
                    <span className="text-xs">DOM</span>
                  </Button>
                  <Button onClick={() => setActiveTab('international')} variant={activeTab === 'international' ? 'default' : 'ghost'} className={`flex-1 px-1.5 py-0.5 rounded-sm text-xs font-medium transition-all duration-200 h-6 ${activeTab === 'international' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-sm' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80'}`}>
                    <Globe className="h-2.5 w-2.5 mr-0.5" />
                    <span className="text-xs">INT</span>
                  </Button>
                </div>
              </div>

              {/* Content */}
              {activeTab === 'domestic' && <LazyWrapper fallback={<div className="animate-pulse bg-gray-100 h-64 rounded"></div>}>
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
                    "Meghalaya": {
                      icon: "🏔️",
                      desc: "The Abode of Clouds"
                    },
                    "Uttarakhand": {
                      icon: "🏔️",
                      desc: "Land of the Gods"
                    },
                    "Sikkim": {
                      icon: "🗻",
                      desc: "Gateway to the Himalayas"
                    },
                    "Himachal Pradesh": {
                      icon: "⛰️",
                      desc: "Land of Snow"
                    },
                    "Kerala": {
                      icon: "🌴",
                      desc: "God's Own Country"
                    },
                    "Tamil Nadu": {
                      icon: "🏛️",
                      desc: "Western Ghats"
                    },
                    "Northeast States": {
                      icon: "🌿",
                      desc: "Seven Sisters Region"
                    },
                    "XTSY Exclusive Tours": {
                      icon: "⭐",
                      desc: "Premium Experiences"
                    }
                  };
                  const info = stateInfo[state] || {
                    icon: "🗺️",
                    desc: "Incredible Destination"
                  };
                  return <div key={state} className="mb-6 sm:mb-8 md:mb-12 lg:mb-16">
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

                          {/* Featured Hornbill Festival Landscape Card - Only for XTSY Exclusive Tours */}
                          {state === "XTSY Exclusive Tours" && <div className="mb-6 sm:mb-8 md:mb-10 animate-fade-in">
                              <Card className="group overflow-hidden border-2 border-primary/30 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
                                <CardContent className="p-0">
                                  <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden">
                                    {/* Hero Image */}
                                    <img src={hornbillFestivalHeroImg} alt="Hornbill Festival Nagaland - Premium Cultural Experience" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" loading="eager" fetchPriority="high" />
                                    
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                    
                                    {/* Premium Badge */}
                                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex gap-2">
                                      <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-xl backdrop-blur-sm border border-white/20">
                                        🎭 PREMIUM EXPERIENCE
                                      </span>
                                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-xl backdrop-blur-sm border border-white/20">
                                        ⭐ FEATURED TOUR
                                      </span>
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                                      <div className="max-w-4xl">
                                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 drop-shadow-2xl">Hornbill Festival Nagaland



                                </h3>
                                        <p className="text-sm sm:text-base md:text-lg text-white/95 mb-3 sm:mb-4 leading-relaxed drop-shadow-lg max-w-3xl">Experience Northeast India's most spectacular cu</p>
                                        
                                        {/* Quick Info Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                                          <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 sm:p-3 border border-white/20">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                              <span className="text-lg sm:text-xl">📅</span>
                                              <div>
                                                <div className="text-white/80 text-xs font-medium">Duration</div>
                                                <div className="text-white font-bold text-xs sm:text-sm">7 Days</div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 sm:p-3 border border-white/20">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                              <span className="text-lg sm:text-xl">⭐</span>
                                              <div>
                                                <div className="text-white/80 text-xs font-medium">Difficulty</div>
                                                <div className="text-white font-bold text-xs sm:text-sm">Easy</div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 sm:p-3 border border-white/20">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                              <span className="text-lg sm:text-xl">🎯</span>
                                              <div>
                                                <div className="text-white/80 text-xs font-medium">Category</div>
                                                <div className="text-white font-bold text-xs sm:text-sm">Cultural</div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 sm:p-3 border border-white/20">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                              <span className="text-lg sm:text-xl">💰</span>
                                              <div>
                                                <div className="text-white/80 text-xs font-medium">Price</div>
                                                <div className="text-orange-300 font-bold text-xs sm:text-sm">₹58,500</div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* CTA Button */}
                                        <div className="flex gap-2 sm:gap-3">
                                          <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300 text-xs sm:text-sm" onClick={() => handlePackageClick({
                                    id: 999,
                                    title: "Hornbill Festival Nagaland",
                                    description: "Experience Northeast India's most spectacular cultural celebration - the 'Festival of Festivals'. Witness ancient Naga warrior traditions, vibrant tribal dances, indigenous handicrafts, folk songs, and fierce traditional competitions set against the stunning backdrop of the Naga Hills during this week-long cultural extravaganza.",
                                    duration: "7 Days",
                                    difficulty: "Easy",
                                    price: "₹58,500",
                                    image: hornbillFestivalHeroImg,
                                    images: [hornbillFestivalHeroImg, hornbillFestivalHeroImg, hornbillFestivalHeroImg],
                                    rating: 5.0,
                                    category: "cultural",
                                    location: "Nagaland",
                                    highlights: ["Naga Warrior Traditional Ceremonies", "Tribal Dance Performances", "Indigenous Handicraft Exhibitions", "Traditional Food Festival", "Naga Wrestling Championships", "Rock Concert & Night Festival", "WWII Museum & Kohima War Cemetery", "Premium Accommodation Near Festival Grounds", "Expert Cultural Guides", "All Festival Entry Passes Included"],
                                    bestSeason: "Dec 1-10",
                                    exclusive: true
                                  })}>
                                            🎉 Book Festival Experience
                                          </Button>
                                          <a href="https://wa.me/918837317070?text=Hi%2C%20I%27m%20interested%20in%20the%20Hornbill%20Festival%20Nagaland%20tour%20package" target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" className="bg-white/90 hover:bg-white text-gray-900 font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-xl border-2 border-white/50 transform hover:scale-105 transition-all duration-300 text-xs sm:text-sm">
                                              💬 WhatsApp Enquiry
                                            </Button>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>}

                          {/* Comprehensive responsive layout with animations and lazy loading */}
                          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 mb-6 md:mb-10 lg:mb-14 animate-fade-in">
                            {filteredStatePackages.map(itinerary => <LazyWrapper key={itinerary.id} fallback={<div className="animate-pulse bg-gray-100 h-64 rounded-lg"></div>} threshold={0.2}>
                                <CompactTourPackageCard tourPackage={itinerary} onPackageClick={() => handlePackageClick(itinerary)} />
                              </LazyWrapper>)}
                          </div>
                        </div>;
                })}

                    {filteredItineraries.length === 0 && <div className="text-center py-3 sm:py-4">
                        <p className="text-gray-500 text-xs sm:text-sm">No packages found matching your filters.</p>
                        <Button onClick={clearFilters} className="mt-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs px-2 py-0.5 h-6">
                          Clear All Filters
                        </Button>
                      </div>}
                  </div>
                </LazyWrapper>}

              {activeTab === 'international' && <LazyWrapper fallback={<div className="animate-pulse bg-gray-100 h-96 rounded"></div>}>
                  <div className="max-w-6xl mx-auto">
                    {/* XTSY International Premium Package */}
                    <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                      <div className="text-center mb-4 sm:mb-6 md:mb-8">
                        <div className="inline-flex items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-gradient-to-r from-amber-500 to-orange-600 backdrop-blur-sm rounded-md shadow-lg mb-1 sm:mb-2">
                          <span className="text-sm sm:text-base md:text-lg lg:text-xl">🏍️</span>
                          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white">
                            XTSY International Expedition
                          </h3>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                          Premium Cross-Border Adventures
                        </p>
                      </div>

                      {/* RE Himalayan Expedition Package */}
                      <div className="mb-8 sm:mb-10 px-2">
                        <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-slate-50 to-orange-50 border-2 border-amber-200 overflow-hidden">
                          <CardContent className="p-0">
                            <div className="grid md:grid-cols-2 gap-0">
                              {/* Image Section */}
                              <div className="relative h-64 md:h-auto overflow-hidden">
                                <img src={reHimalayanNepalExpedition} alt="Royal Enfield Himalayan Expedition - Nepal, Bhutan, Northeast India" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" loading="eager" fetchPriority="high" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                  <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    🌟 PREMIUM
                                  </span>
                                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    🎯 NOW BOOKING
                                  </span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-white text-sm">
                                      <span>🏍️</span>
                                      <span className="font-semibold">Royal Enfield Himalayan Expedition</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Content Section */}
                              <div className="p-6 sm:p-8">
                                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                                  Tri-Nation Himalayan Motorbike Expedition
                                </h4>
                                <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
                                  Experience the ultimate cross-border adventure on a <strong>Royal Enfield Himalayan</strong> through <strong>Northeast India</strong>, <strong>Nepal</strong>, and <strong>Bhutan</strong>. Ride through mountain passes, ancient monasteries, and pristine valleys across three nations.
                                </p>

                                {/* Key Highlights */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-xl">📅</span>
                                    <div>
                                      <div className="font-semibold text-gray-900">Duration</div>
                                      <div className="text-gray-600">12-15 Days</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-xl">🏔️</span>
                                    <div>
                                      <div className="font-semibold text-gray-900">Difficulty</div>
                                      <div className="text-gray-600">Challenging</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-xl">🌍</span>
                                    <div>
                                      <div className="font-semibold text-gray-900">Countries</div>
                                      <div className="text-gray-600">India, Nepal, Bhutan</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-xl">💰</span>
                                    <div>
                                      <div className="font-semibold text-gray-900">Starting From</div>
                                      <div className="text-amber-600 font-bold">₹1,85,000</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Itinerary Highlights */}
                                <div className="mb-4">
                                  <h5 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <span>✨</span> Expedition Highlights
                                  </h5>
                                  <div className="space-y-1 text-sm text-gray-700">
                                    <div className="flex items-start gap-2">
                                      <span className="text-amber-600 mt-0.5">▸</span>
                                      <span><strong>Day 1-3:</strong> Guwahati → Tawang - World War II Cemetery, Sela Pass (13,700 ft)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-amber-600 mt-0.5">▸</span>
                                      <span><strong>Day 4-6:</strong> Cross into Nepal - Kathmandu Valley, Pokhara, Annapurna Views</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-amber-600 mt-0.5">▸</span>
                                      <span><strong>Day 7-9:</strong> Nepal Hill Stations - Nagarkot Sunrise, Bhaktapur Durbar Square</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-amber-600 mt-0.5">▸</span>
                                      <span><strong>Day 10-12:</strong> Enter Bhutan - Paro Valley, Tiger's Nest Monastery Trek</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-amber-600 mt-0.5">▸</span>
                                      <span><strong>Day 13-15:</strong> Thimphu → Return via Phuentsholing - Dochula Pass (10,000 ft)</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Package Inclusions */}
                                <div className="bg-amber-50 rounded-lg p-3 mb-4">
                                  <h5 className="font-bold text-gray-900 mb-2 text-sm">Premium Package Includes:</h5>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-700">
                                    <div className="flex items-center gap-1">
                                      <span className="text-green-600">✓</span>
                                      <span>Royal Enfield Himalayan Bike</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-green-600">✓</span>
                                      <span>Premium Riding Gear</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-green-600">✓</span>
                                      <span>Visa Assistance (Nepal, Bhutan)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-green-600">✓</span>
                                      <span>Luxury Accommodations</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-green-600">✓</span>
                                      <span>All Meals & Permits</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-green-600">✓</span>
                                      <span>Expert Ride Marshals</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-green-600">✓</span>
                                      <span>Support Vehicle & Mechanic</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-green-600">✓</span>
                                      <span>Travel Insurance Coverage</span>
                                    </div>
                                  </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <a href={`https://api.whatsapp.com/send/?phone=918837317070&text=${encodeURIComponent("Hello XTSY Team! 👋\n\nI'm interested in the \"Royal Enfield Himalayan Tri-Nation Expedition\" tour package. Could you please share more details about availability, itinerary, and pricing?\n\nLooking forward to an amazing adventure! ✨")}&type=phone_number&app_absent=0`} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm group">
                                    <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    <span>Book Expedition</span>
                                  </a>
                                  <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-amber-200 hover:border-amber-300 transition-all duration-300 text-sm">
                                    <span>📄</span>
                                    <span>View Full Itinerary</span>
                                  </button>
                                </div>

                                {/* Additional Info */}
                                <div className="mt-4 pt-4 border-t border-amber-200">
                                  <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <span>📅</span> Next Departure: <strong className="text-gray-900">March 2025</strong>
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span>👥</span> Limited to <strong className="text-amber-600">12 Riders</strong>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Updated International Header to match XTSY Exclusive Tours styling */}
                    <div className="text-center mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                      <div className="inline-flex items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-md shadow-md mb-1 sm:mb-2">
                        <span className="text-sm sm:text-base md:text-lg lg:text-xl">🌏</span>
                        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
                          XTSY Asia & Europe
                        </h3>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg">
                        More Global Adventures Coming Soon
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
                         {[{
                      country: "Japan",
                      flag: "🇯🇵",
                      highlight: "Cherry Blossoms"
                    }, {
                      country: "Thailand",
                      flag: "🇹🇭",
                      highlight: "Tropical Paradise"
                    }, {
                      country: "Vietnam",
                      flag: "🇻🇳",
                      highlight: "Street Food"
                    }, {
                      country: "Korea",
                      flag: "🇰🇷",
                      highlight: "K-Culture"
                    }, {
                      country: "Malaysia",
                      flag: "🇲🇾",
                      highlight: "Multicultural"
                    }, {
                      country: "Singapore",
                      flag: "🇸🇬",
                      highlight: "Modern City"
                    }, {
                      country: "Indonesia",
                      flag: "🇮🇩",
                      highlight: "Islands"
                    }, {
                      country: "Philippines",
                      flag: "🇵🇭",
                      highlight: "Beaches"
                    }].map(item => <LazyWrapper key={item.country} fallback={<div className="animate-pulse bg-gray-100 h-32 rounded"></div>} threshold={0.3}>
                              <Card className="group hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-200 h-32 sm:h-36 md:h-40">
                                <CardContent className="flex flex-col items-center justify-center p-2 sm:p-3 text-center h-full">
                                   <div className="flex items-center justify-center mb-3 flex-shrink-0">
                                      <span className="flag-emoji">{item.flag}</span>
                                   </div>
                                   <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm leading-tight">
                                     {item.country}
                                   </h3>
                                   <p className="text-xs text-gray-600 mb-2 leading-tight truncate w-full">{item.highlight}</p>
                                   <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">Soon</span>
                                </CardContent>
                              </Card>
                           </LazyWrapper>)}
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
                         {[{
                      country: "France",
                      flag: "🇫🇷",
                      highlight: "Romance"
                    }, {
                      country: "Italy",
                      flag: "🇮🇹",
                      highlight: "Art & History"
                    }, {
                      country: "Spain",
                      flag: "🇪🇸",
                      highlight: "Festivals"
                    }, {
                      country: "Germany",
                      flag: "🇩🇪",
                      highlight: "Castles"
                    }, {
                      country: "Switzerland",
                      flag: "🇨🇭",
                      highlight: "Alps"
                    }, {
                      country: "Netherlands",
                      flag: "🇳🇱",
                      highlight: "Canals"
                    }, {
                      country: "UK",
                      flag: "🇬🇧",
                      highlight: "Royal Heritage"
                    }, {
                      country: "Austria",
                      flag: "🇦🇹",
                      highlight: "Music"
                    }].map(item => <LazyWrapper key={item.country} fallback={<div className="animate-pulse bg-gray-100 h-32 rounded"></div>} threshold={0.3}>
                              <Card className="group hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-200 h-32 sm:h-36 md:h-40">
                                <CardContent className="flex flex-col items-center justify-center p-2 sm:p-3 text-center h-full">
                                   <div className="flex items-center justify-center mb-3 flex-shrink-0">
                                     <span className="flag-emoji">{item.flag}</span>
                                   </div>
                                   <h4 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm leading-tight">
                                     {item.country}
                                   </h4>
                                   <p className="text-xs text-gray-600 mb-2 leading-tight truncate w-full">{item.highlight}</p>
                                   <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Soon</span>
                                </CardContent>
                              </Card>
                            </LazyWrapper>)}
                       </div>
                    </div>
                  </div>
                </LazyWrapper>}
            </div>

            {/* XTSY Tourism Story Section - SEO Optimized - Dynamic based on tab */}
            <div className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24 border-t border-gray-200/50">
              <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="max-w-5xl mx-auto">
                  {activeTab === 'domestic' ? <>
                      {/* Domestic India Tourism Content */}
                      <div className="text-center mb-8 sm:mb-10 md:mb-12">
                        <div className="inline-flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg mb-4">
                          <span className="text-2xl sm:text-3xl md:text-4xl">🗺️</span>
                          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                            XTSY Tourism
                          </h2>
                        </div>
                        <p className="text-base sm:text-lg md:text-xl text-gray-700 font-semibold">
                          Your Gateway to Authentic India Travel Experiences
                        </p>
                      </div>

                      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 space-y-6 sm:space-y-8">
                        <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-800">
                          Welcome to <strong>XTSY Tourism</strong>, India's premier destination for curated <strong>domestic travel experiences</strong> and <strong>international tour packages</strong>. As a leading <strong>travel company in India</strong>, we specialize in crafting unforgettable journeys across <strong>Northeast India tourism</strong>, <strong>Himalayan adventures</strong>, <strong>cultural heritage tours</strong>, and <strong>eco-tourism expeditions</strong>.
                        </p>

                        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                          Our expertise spans the enchanting landscapes of <strong>Meghalaya tourism</strong>, <strong>Himachal Pradesh travel packages</strong>, <strong>Uttarakhand pilgrimage tours</strong>, <strong>Sikkim adventure trips</strong>, <strong>Kerala backwater holidays</strong>, and <strong>Tamil Nadu temple circuits</strong>. We are passionate about showcasing India's incredible diversity through <strong>responsible tourism</strong> and <strong>sustainable travel practices</strong>.
                        </p>

                        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                          From the <strong>living root bridges of Cherrapunji</strong> to the <strong>crystal-clear waters of Dawki</strong>, from <strong>Himalayan trekking expeditions</strong> to <strong>wildlife safaris in Kaziranga</strong>, from <strong>spiritual journeys to Char Dham</strong> to <strong>adventure sports in Rishikesh</strong> – XTSY offers comprehensive <strong>India tour packages</strong> designed for every traveler.
                        </p>

                        <div className="sr-only">
                          India tourism, domestic travel India, Northeast India tours, Meghalaya packages, Himachal Pradesh trips, Kerala holidays, Tamil Nadu tours, Uttarakhand pilgrimage, Sikkim travel, adventure tourism India, cultural tours India, eco-tourism packages, heritage tourism, sustainable travel, responsible tourism, offbeat destinations India
                        </div>

                        <div className="text-center pt-6 sm:pt-8 border-t border-gray-200">
                          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                            Ready to Experience Incredible India?
                          </p>
                          <p className="text-sm sm:text-base text-gray-600 mb-6">
                            Explore our curated tour packages above and start your journey with XTSY Tourism.
                          </p>
                          
                          <a href="https://wa.me/919366074889?text=Hi%20XTSY%20Tourism!%20I'm%20interested%20in%20your%20India%20tour%20packages.%20Can%20you%20help%20me%20plan%20my%20trip?" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in text-sm sm:text-base md:text-lg group">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            <span className="font-bold">Chat with Us on WhatsApp</span>
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </a>
                          
                          <p className="text-xs sm:text-sm text-gray-500 mt-4">
                            💬 Available 24/7 for instant tour planning assistance
                          </p>
                          
                          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
                            <div className="flex justify-center items-center animate-fade-in">
                              <img src={incredibleIndiaLogo} alt="Incredible India - Official Tourism Logo" className="h-12 sm:h-16 md:h-20 w-auto object-contain hover:scale-105 transition-transform duration-300" loading="eager" fetchPriority="high" />
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 text-center mt-3 sm:mt-4">
                              Proud Partner of India Tourism
                            </p>
                          </div>
                        </div>
                      </div>
                    </> : <>
                      {/* International Tourism Content */}
                      <div className="text-center mb-8 sm:mb-10 md:mb-12">
                        <div className="inline-flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg mb-4">
                          <span className="text-2xl sm:text-3xl md:text-4xl">🌍</span>
                          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            XTSY Global Travel
                          </h2>
                        </div>
                        <p className="text-base sm:text-lg md:text-xl text-gray-700 font-semibold">
                          Your Gateway to Extraordinary International Adventures
                        </p>
                      </div>

                      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 space-y-6 sm:space-y-8">
                        <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-800">
                          Welcome to <strong>XTSY Global Travel</strong>, your trusted partner for curated <strong>international tour packages</strong> and <strong>overseas vacation experiences</strong>. From India, we connect you to the world's most captivating destinations across <strong>Asia</strong>, <strong>Europe</strong>, <strong>Australia</strong>, <strong>Americas</strong>, and beyond.
                        </p>

                        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                          Discover the magic of <strong>cherry blossoms in Japan</strong>, experience <strong>K-Culture in South Korea</strong>, explore the <strong>tropical paradise of Thailand</strong>, savor authentic <strong>street food in Vietnam</strong>, marvel at Singapore's iconic <strong>Gardens by the Bay</strong> where futuristic supertrees meet lush tropical gardens, island-hop through the enchanting archipelagos of <strong>Indonesia and Philippines</strong>, and immerse yourself in the <strong>multicultural charm of Malaysia</strong>. Our <strong>Asia tour packages</strong> blend adventure, culture, and relaxation into unforgettable journeys.
                        </p>

                        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                          Experience the grandeur of <strong>Europe tours from India</strong> – from the <strong>romantic streets of Paris</strong> to the <strong>art and history of Italy</strong>, from <strong>Alpine adventures in Switzerland</strong> to the <strong>royal heritage of UK</strong>. Explore <strong>Spanish festivals</strong>, <strong>German castles</strong>, <strong>Dutch canals</strong>, and <strong>Austrian music heritage</strong> with our expertly crafted <strong>European vacation packages</strong>.
                        </p>

                        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                          As an <strong>international travel agency in India</strong>, XTSY specializes in <strong>customized overseas trips</strong>, <strong>honeymoon packages abroad</strong>, <strong>family international vacations</strong>, <strong>group tours overseas</strong>, and <strong>solo travel adventures worldwide</strong>. We handle <strong>visa assistance</strong>, <strong>flight bookings</strong>, <strong>hotel reservations</strong>, <strong>travel insurance</strong>, and <strong>guided tours</strong> for seamless global experiences.
                        </p>

                        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                          Whether you seek <strong>luxury international tours</strong>, <strong>budget-friendly overseas packages</strong>, <strong>adventure travel abroad</strong>, <strong>cultural immersion experiences</strong>, or <strong>wellness retreats worldwide</strong>, XTSY Global Travel designs journeys that create lifelong memories. From <strong>beach holidays in Bali</strong> to <strong>Northern Lights in Iceland</strong>, from <strong>safaris in Africa</strong> to <strong>city breaks in Dubai</strong> – the world awaits you.
                        </p>

                        <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                          Join thousands of Indian travelers who have explored the globe with XTSY. Book your <strong>international vacation package</strong> today and embark on extraordinary journeys across continents. <strong>Coming Soon</strong> – experience the world with India's most trusted <strong>overseas tour operator</strong>.
                        </p>

                        {/* Keywords Section (Hidden but SEO friendly) */}
                        <div className="sr-only">
                          international travel packages from India, overseas tour packages, Asia tour packages, Europe tours from India, Thailand tour packages, Japan tours, Korea travel packages, Vietnam tours, Singapore Malaysia packages, Indonesia tours, Philippines vacation, international honeymoon packages, family overseas trips, Europe vacation packages, France tour packages, Italy tours, Switzerland packages, Spain travel, Germany tours, UK vacation packages, international travel agency India, overseas travel from India, foreign tour packages, international vacation deals, world tour packages, global travel India, visa assistance, flight booking services, international hotels, guided tours abroad, luxury international tours, budget overseas packages, adventure travel worldwide, cultural tours abroad, beach holidays international, Europe group tours, Asia backpacking, honeymoon destinations abroad, family vacations overseas, solo travel international, cruise packages, wellness retreats abroad, safari tours, Northern Lights tours, Dubai packages, Bali holidays, Australia tours, New Zealand packages, USA vacation, Canada tours, South America travel, African safaris, international tourism India, overseas tour operator, global adventures, world travel specialist
                        </div>

                        {/* Call to Action */}
                        <div className="text-center pt-6 sm:pt-8 border-t border-gray-200">
                          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                            Ready to Explore the World?
                          </p>
                          <p className="text-sm sm:text-base text-gray-600 mb-6">
                            Discover our upcoming international destinations and be among the first to book your global adventure with XTSY.
                          </p>
                          
                          {/* WhatsApp Button */}
                          <a href={`https://api.whatsapp.com/send/?phone=918837317070&text=${encodeURIComponent("🌍 *International Travel Inquiry - XTSY Global Tours*\n\nHi XTSY Team! I'm excited about exploring international destinations! ✈️\n\nI'm interested in:\n• International tour packages\n• Overseas vacation planning\n• Global adventure experiences\n• Custom travel itineraries\n\nPlease share details about upcoming international tours and help me plan my perfect global getaway!\n\nReady to explore the world! 🌏✨")}&type=phone_number&app_absent=0`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in text-sm sm:text-base md:text-lg group">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            <span className="font-bold">Chat About International Tours</span>
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </a>
                          
                          <p className="text-xs sm:text-sm text-gray-500 mt-4">
                            🌏 Available 24/7 for international travel planning
                          </p>
                          
                          {/* Global Travel Badge */}
                          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
                            <div className="flex justify-center items-center gap-4 flex-wrap animate-fade-in">
                              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                                <span className="text-2xl">✈️</span>
                                <span className="text-sm font-semibold text-blue-900">International Friendly</span>
                              </div>
                              <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full">
                                <span className="text-2xl">🎯</span>
                                <span className="text-sm font-semibold text-pink-900">Coming Soon 2025</span>
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 text-center mt-4">
                              Your Trusted Partner for Global Adventures
                            </p>
                          </div>
                        </div>
                      </div>
                    </>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {isModalOpen && <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-white p-4 rounded">Loading...</div></div>}>
          <LazyTourPackageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} tourPackage={selectedPackage} />
        </Suspense>}
    </div>;
};
export default Travel;