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

// Import images for tour packages
import meghalayaBiodiversityAuthenticImg from "@/assets/meghalaya-biodiversity-authentic.jpg";
import wildernessSurvivalImg from "@/assets/wilderness-survival-authentic.jpg";

import arunachalTribalImg from "@/assets/arunachal-tribal-premium.jpg";
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
    "XTSY Exclusive Tours": [
      {
        id: 203,
        title: "XTSY Exclusive: Northeast Ecological Immersion",
        description: "Winter biodiversity program exploring endemic species, conservation science, and climate research with expert ecologists",
        duration: "8 Days",
        difficulty: "Easy",
        price: "₹48,500",
        image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg",
        images: [
          "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg",
          "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg",
          "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg"
        ],
        rating: 4.9,
        category: "educational",
        location: "Northeast India",
        highlights: ["Wildlife Photography Workshops", "Plant Identification Hikes", "Ecosystem Mapping", "Citizen Science Projects", "Climate Change Field Studies", "Butterfly Tracking", "Bird Migration Observation"],
        bestSeason: "Oct-Mar",
        exclusive: true
      },
      {
        id: 204,
        title: "XTSY Exclusive: Traditional Ethnobotany & Healing Arts",
        description: "Learn ancient indigenous plant medicine and sustainable harvesting from tribal healers in winter abundance season",
        duration: "6 Days",
        difficulty: "Moderate",
        price: "₹36,500",
        image: arunachalTribalImg,
        images: [arunachalTribalImg, arunachalTribalImg, arunachalTribalImg],
        rating: 4.8,
        category: "cultural",
        location: "Northeast India",
        highlights: ["Medicinal Plant Walks", "Indigenous Healer Sessions", "Herbal Remedy Preparation", "Sacred Grove Ceremonies", "Traditional Healing Rituals", "Documentation Workshops", "Forest Therapy"],
        bestSeason: "Oct-Mar",
        exclusive: true
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
    ],
    
    "Meghalaya": [
      {
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
      },
      {
        id: 1,
        title: "Double Decker Root Bridge and Cherrapunji Exploration",
        description: "Trek through pristine winter forests to discover 500-year-old living bridges crafted by nature and tribal wisdom",
        duration: "5 Days",
        difficulty: "Moderate",
        price: "₹29,500",
        image: doubleDeckerRootBridgeImg,
        images: [doubleDeckerRootBridgeImg, doubleDeckerRootBridgeImg, doubleDeckerRootBridgeImg],
        rating: 4.8,
        category: "adventure",
        location: "Meghalaya",
        highlights: ["Double Decker Root Bridge Trek", "Rainbow Falls Swim", "Khasi Village Homestays", "Jungle Survival Skills", "Bio-Luminescent Cave Exploration"],
        bestSeason: "Oct-Mar"
      },
      {
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
      },
      {
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
      },
      {
        id: 7,
        title: "Phi Phi & Moopun Waterfalls Adventure",
        description: "Budget-friendly 3-day waterfall hopping tour through Meghalaya's hidden cascades - trek to pristine falls, swim in natural pools, and explore untouched landscapes",
        duration: "3 Days",
        difficulty: "Moderate",
        price: "₹16,500",
        image: phiPhiWaterfallTrekImg,
        images: [phiPhiWaterfallTrekImg, moopunWaterfallImg, phiPhiWaterfallTrekImg],
        rating: 4.7,
        category: "adventure",
        location: "Meghalaya",
        highlights: ["Phi Phi Falls Trek", "Moopun Waterfall Swim", "Hidden Cascade Exploration", "Jungle Trail Adventures", "Village Homestay Experience", "Photography Spots", "Local Guide Tours"],
        bestSeason: "Oct-Mar"
      },
      {
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
      },
    ],
    
    "Northeast States": [
      {
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
      },
      {
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
      },
      {
        id: 21,
        title: "Arunachal Winter Cultural Festival",
        description: "Immerse in vibrant tribal traditions during peak festival season with traditional dances, crafts, and mountain vistas",
        duration: "6 Days",
        difficulty: "Moderate",
        price: "₹36,500",
        image: arunachalEagleFestivalImg,
        images: [arunachalEagleFestivalImg, arunachalTribalImg, arunachalEagleFestivalImg],
        rating: 4.8,
        category: "cultural",
        location: "Arunachal Pradesh",
        highlights: ["Tribal Dance Performances", "Traditional Craft Markets", "Mountain Monastery Visits", "Local Cuisine Workshops", "Cultural Immersion Programs", "Sunrise Valley Views"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 26,
        title: "Tripura Heritage & Craft Trail",
        description: "Winter journey through ancient palaces and bamboo craft villages - discover sustainable tribal artisan traditions",
        duration: "4 Days",
        difficulty: "Moderate",
        price: "₹23,500",
        image: tripuraTribalImg,
        images: [tripuraTribalImg, mizoramBambooImg, tripuraTribalImg],
        rating: 4.5,
        category: "cultural",
        location: "Tripura",
        highlights: ["Ujjayanta Palace Tour", "Bamboo Craft Workshops", "Tribal Heritage Museums", "Neermahal Water Palace", "Handicraft Village Visits", "Traditional Weaving Demos"],
        bestSeason: "Oct-Mar"
      },
      {
        id: 28,
        title: "Arunachal - Bumla Pass Bike Expedition",
        description: "Epic motorcycle journey to the Indo-China border at 15,200 feet - conquer high-altitude mountain passes through breathtaking Himalayan landscapes and pristine valleys",
        duration: "8 Days",
        difficulty: "Challenging",
        price: "₹48,500",
        image: royalEnfieldHimalayanImg,
        images: [royalEnfieldHimalayanImg, motorcycleMountainRoadImg, royalEnfieldHimalayanImg],
        rating: 4.9,
        category: "adventure",
        location: "Arunachal Pradesh",
        highlights: ["Ride to Bumla Pass 15,200 ft", "Tawang Monastery Visit", "Sela Pass Crossing", "Indo-China Border Experience", "High Altitude Biking", "Mountain Valley Exploration"],
        bestSeason: "Apr-Oct"
      },
      {
        id: 29,
        title: "Arunachal - Tawang Exploration",
        description: "Discover the spiritual heart of Arunachal Pradesh with ancient monasteries, pristine mountain valleys, and Monpa tribal culture in the serene Himalayan highlands",
        duration: "6 Days",
        difficulty: "Moderate",
        price: "₹36,500",
        image: arunachalTribalImg,
        images: [arunachalTribalImg, gurudongmarLakeImg, arunachalTribalImg],
        rating: 4.8,
        category: "cultural",
        location: "Arunachal Pradesh",
        highlights: ["Tawang Monastery - 400 years old", "Sela Pass Scenic Beauty", "Monpa Tribal Culture", "Madhuri Lake & Waterfalls", "War Memorial Visit", "Traditional Markets"],
        bestSeason: "Mar-Oct"
      },
    ],
    
    "Kerala": [
      {
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
      },
      {
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
      }
    ],
    
    "Sikkim": [
      {
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
      },
      {
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
      },
      {
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
      }
    ],
    
    "Uttarakhand": [
      {
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
      },
      {
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
      },
    ],
    
    "Himachal Pradesh": [
      {
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
      },
      {
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
      },
    ],
    
    "Tamil Nadu": [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
                        "Tamil Nadu": { icon: "🏛️", desc: "Western Ghats" },
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
                    {/* Updated International Header to match XTSY Exclusive Tours styling */}
                    <div className="text-center mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                      <div className="inline-flex items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-md shadow-md mb-1 sm:mb-2">
                        <span className="text-sm sm:text-base md:text-lg lg:text-xl">🌏</span>
                        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
                          XTSY Asia & Europe
                        </h3>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg">
                        Global Adventures Coming Soon
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
                                     <h3 className="destination-title emoji-text font-semibold text-gray-900 mb-1 text-xs sm:text-sm leading-tight truncate w-full flex items-center justify-center gap-1">
                                       <span className="emoji-text">{item.flag}</span>
                                       {item.country}
                                     </h3>
                                   </div>
                                    <p className="text-xs text-gray-600 mb-2 leading-tight truncate w-full">{item.highlight}</p>
                                    <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">Soon</span>
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
    </div>
  );
};

export default Travel;
