// ============================================
// XTSY Voyage — Travel Data Module
// All tour packages, types, and constants
// ============================================

import { tourItineraries } from "./tourItineraries";

// Image imports — Domestic
import meghalayaBiodiversityAuthenticImg from "@/assets/meghalaya-biodiversity-authentic.jpg";
import wildernessSurvivalImg from "@/assets/wilderness-survival-authentic.jpg";
import wariChoraAuthenticImg from "@/assets/wari-chora-authentic.jpg";
import himachalYogaRetreatImg from "@/assets/himachal-yoga-retreat.jpg";
import kremChympeCaveImg from "@/assets/krem-chympe-cave-expedition.jpg";
import dawkiCrystalClearImg from "@/assets/dawki-crystal-clear-authentic.jpg";
import doubleDeckerBridgeNewImg from "@/assets/double-decker-bridge-new.jpg";
import shillongCherryBlossomImg from "@/assets/shillong-cherry-blossom.jpg";
import krangSuriWaterfallImg from "@/assets/krang-suri-waterfall.jpg";
import phiPhiWaterfallMeghalayaImg from "@/assets/phi-phi-waterfall-meghalaya.jpg";
import moopunWaterfallImg from "@/assets/moopun-waterfall.jpg";
import assamTeaGardensImg from "@/assets/assam-tea-gardens-premium.jpg";
import arunachalCulturalFestivalImg from "@/assets/arunachal-cultural-festival.jpg";
import arunachalTribalImg from "@/assets/arunachal-tribal-premium.jpg";
import tripuraBambooHeritageImg from "@/assets/tripura-bamboo-heritage.jpg";
import mizoramBambooImg from "@/assets/mizoram-bamboo-premium.jpg";
import bumlaPassBikeExpeditionImg from "@/assets/bumla-pass-bike-expedition.jpg";
import motorcycleMountainRoadImg from "@/assets/motorcycle-mountain-road.jpg";
import tawangMonasteryMountainsImg from "@/assets/tawang-monastery-mountains.jpg";
import gurudongmarLakeImg from "@/assets/gurudongmar-lake-high-altitude-stock.jpg";
import manipurLoktakImg from "@/assets/manipur-loktak-premium.jpg";
import keralaBackwatersImg from "@/assets/kerala-backwaters-authentic.jpg";
import thekkadyWildlifeImg from "@/assets/thekkady-wildlife.jpg";
import pellingKanchenjungaImg from "@/assets/pelling-kanchenjunga.jpg";
import sikkimRhododendronImg from "@/assets/sikkim-rhododendrons-premium.jpg";
import nainitalLakeImg from "@/assets/nainital-lake-district.jpg";
import charDhamYatraImg from "@/assets/char-dham-yatra.jpg";
import kulluValleyAdventureImg from "@/assets/kullu-valley-adventure-stock.jpg";
import dharamshalaMcleodGanjImg from "@/assets/dharamshala-mcleod-ganj-stock.jpg";
import tamilNaduMeenakshiTempleImg from "@/assets/tamil-nadu-meenakshi-temple.jpg";
import tamilNaduKanchipuramTempleImg from "@/assets/tamil-nadu-kanchipuram-temple.jpg";
import tamilNaduBrihadeeswraUnescoImg from "@/assets/tamil-nadu-brihadeeswara-unesco.jpg";
import ootyKodaikanalImg from "@/assets/ooty-kodaikanal.jpg";
import nagalandHornbillImg from "@/assets/nagaland-hornbill-premium.jpg";
import kohimaWarImg from "@/assets/kohima-war-cemetery-premium.jpg";

// ============================================
// Types
// ============================================

export interface ItineraryDay {
  day: string;
  title: string;
  route?: string;
  activities: string[];
  overnight?: string;
}

export interface TourPackage {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  price: string;
  image: string;
  images?: string[];
  rating: number;
  category: "adventure" | "cultural" | "leisure" | "educational";
  location: string;
  highlights: string[];
  bestSeason: string;
  exclusive?: boolean;
  international?: boolean;
  visaInfo?: string;
  groupSize?: string;
  region?: string;
  itinerary?: ItineraryDay[];
}

export type TravelTheme = "all" | "adventure" | "cultural" | "leisure" | "educational";
export type TravelDestination = "all" | "india" | "international";
export type DurationRange = "all" | "short" | "medium" | "long";
export type BudgetRange = "all" | "budget" | "mid" | "premium";
export type SeasonFilter = "all" | "winter" | "spring" | "summer" | "monsoon";

export interface TravelFilters {
  destination: TravelDestination;
  theme: TravelTheme;
  duration: DurationRange;
  budget: BudgetRange;
  season: SeasonFilter;
}

// Merge itinerary data into any tour by ID
export const mergeItinerary = (tour: TourPackage): TourPackage => {
  const itinerary = tourItineraries[tour.id];
  return itinerary ? { ...tour, itinerary } : tour;
};

// ============================================
// XTSY Exclusive Tours
// ============================================

const _exclusiveTours: TourPackage[] = [
  {
    id: 203,
    title: "Northeast Ecological Immersion",
    description: "Winter biodiversity program exploring endemic species, conservation science, and climate research with expert ecologists. Small groups only.",
    duration: "8 Days",
    difficulty: "Easy",
    price: "₹38,999",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg",
    rating: 4.9,
    category: "educational",
    location: "Northeast India",
    highlights: ["Wildlife Photography Workshops", "Plant Identification Hikes", "Ecosystem Mapping", "Citizen Science Projects", "Climate Change Field Studies", "Butterfly Tracking", "Bird Migration Observation"],
    bestSeason: "Oct-Mar",
    exclusive: true,
    groupSize: "6-10 people"
  },
  {
    id: 204,
    title: "Wari Chora — Hidden Gem of Meghalaya",
    description: "An adrenaline-fueled expedition through Meghalaya's most remote terrain. Trek through untamed forests, rappel down pristine waterfalls, and experience extreme wilderness camping.",
    duration: "5 Days",
    difficulty: "Challenging",
    price: "₹32,999",
    image: wariChoraAuthenticImg,
    rating: 4.9,
    category: "adventure",
    location: "Meghalaya",
    highlights: ["Waterfall Rappelling & Canyoning", "Multi-Day Mountain Trek", "Wild River Crossing", "Extreme Wilderness Camping", "Night Trek Through Sacred Forests", "Rock Climbing Expeditions", "Summit Sunrise Experience"],
    bestSeason: "Oct-Mar",
    exclusive: true,
    groupSize: "4-8 people"
  },
  {
    id: 201,
    title: "Meghalaya Biodiversity Research Expedition",
    description: "Comprehensive winter field study of Northeast's unique ecosystems with conservation experts and naturalist guides.",
    duration: "7 Days",
    difficulty: "Moderate",
    price: "₹34,999",
    image: meghalayaBiodiversityAuthenticImg,
    rating: 4.9,
    category: "educational",
    location: "Meghalaya",
    highlights: ["Expert Naturalist Expeditions", "Endemic Species Documentation", "Research Field Work", "Conservation Workshops", "Night Safari Adventures", "Botanical Garden Visits", "Scientific Photography"],
    bestSeason: "Oct-Mar",
    exclusive: true,
    groupSize: "6-12 people"
  },
  {
    id: 202,
    title: "Wilderness Survival Camp (Winter)",
    description: "Master winter survival skills, nature navigation, and sustainable living in pristine Northeast wilderness.",
    duration: "5 Days",
    difficulty: "Challenging",
    price: "₹22,999",
    image: wildernessSurvivalImg,
    rating: 4.8,
    category: "adventure",
    location: "Northeast India",
    highlights: ["Winter Survival Training", "Wilderness Navigation", "Natural Shelter Building", "Foraging & Wild Edibles", "Water Purification Techniques", "Fire Making Mastery", "Leave No Trace Ethics"],
    bestSeason: "Oct-Mar",
    exclusive: true,
    groupSize: "4-8 people"
  },
  {
    id: 206,
    title: "Khaddum Expedition — Krem Chympe",
    description: "Epic underground adventure through India's fifth longest cave system featuring limestone passages, underground rivers, cave boating, and a trek to the stunning Moopun Falls.",
    duration: "4 Days",
    difficulty: "Challenging",
    price: "₹24,999",
    image: kremChympeCaveImg,
    rating: 5.0,
    category: "adventure",
    location: "Meghalaya",
    highlights: ["Krem Chympe Cave Exploration", "Underground River & Cave Boating", "Stalactite & Stalagmite Photography", "Moopun Falls Trek & Swimming", "Speleology Training", "Jaintia Hills Scenic Drive"],
    bestSeason: "Oct-Mar",
    exclusive: true,
    groupSize: "4-6 people"
  },
  {
    id: 205,
    title: "Himachal Yoga Retreat Program",
    description: "Transformative yoga and meditation retreat in Dharamkot, Dharamshala — daily asana, pranayama, Tushita meditation, Kareri village trek, and Himalayan immersion.",
    duration: "6 Days",
    difficulty: "Easy",
    price: "₹28,999",
    image: himachalYogaRetreatImg,
    rating: 4.9,
    category: "cultural",
    location: "Himachal Pradesh",
    highlights: ["Daily Hatha & Ashtanga Yoga", "Tushita Meditation Centre Visit", "Kareri Village Nature Trek", "Pranayama & Breathwork", "Naddi Village Dhauladhar Views", "McLeod Ganj & Dalai Lama Temple", "Organic Sattvic Cuisine"],
    bestSeason: "Oct-Mar",
    exclusive: true,
    groupSize: "8-14 people"
  },
];

export const exclusiveTours = _exclusiveTours.map(mergeItinerary);

// ============================================
// Northeast India Tours
// ============================================

export const northeastTours: Record<string, TourPackage[]> = {
  "Meghalaya": [
    {
      id: 4,
      title: "Dawki Crystal Waters Winter Escape",
      description: "Experience the world's clearest river during perfect winter weather — boat rides reveal the riverbed 20 feet below like floating on glass.",
      duration: "3 Days",
      difficulty: "Easy",
    price: "₹12,999",
      image: dawkiCrystalClearImg,
      rating: 4.9,
      category: "leisure",
      location: "Meghalaya",
      highlights: ["Transparent River Boating", "Indo-Bangladesh Border Views", "Winter Photography", "Local Khasi Cuisine", "Riverside Camping"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 1,
      title: "Double Decker Root Bridge & Cherrapunji",
      description: "Trek through pristine winter forests to discover 500-year-old living bridges crafted by nature and tribal wisdom.",
      duration: "5 Days",
      difficulty: "Moderate",
    price: "₹22,999",
      image: doubleDeckerBridgeNewImg,
      rating: 4.8,
      category: "adventure",
      location: "Meghalaya",
      highlights: ["Double Decker Root Bridge Trek", "Rainbow Falls Swim", "Khasi Village Homestays", "Jungle Survival Skills", "Bio-Luminescent Cave Exploration"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 5,
      title: "Shillong Winter Cultural Sojourn",
      description: "Immerse in the Scotland of East during crisp winter months — explore colonial heritage, vibrant markets, and traditional Khasi culture.",
      duration: "2 Days",
      difficulty: "Easy",
    price: "₹8,999",
      image: shillongCherryBlossomImg,
      rating: 4.7,
      category: "cultural",
      location: "Meghalaya",
      highlights: ["Air Force Museum", "Shillong Golf Course", "Don Bosco Centre for Indigenous Cultures", "Cathedral of Mary Help", "Ward's Lake & Lady Hydari Park", "Elephant Falls", "Police Bazaar & Live Music"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 6,
      title: "Krang Suri Waterfall Budget Getaway",
      description: "Affordable 2-day escape to Meghalaya's stunning turquoise waterfall paradise — swim in crystal-clear natural pools surrounded by pristine jungle.",
      duration: "2 Days",
      difficulty: "Easy",
      price: "₹8,999",
      image: krangSuriWaterfallImg,
      rating: 4.6,
      category: "leisure",
      location: "Meghalaya",
      highlights: ["Crystal Clear Turquoise Pools", "Natural Swimming Experience", "Scenic Jungle Trek", "Photography Paradise", "Budget Homestay", "Local Jaintia Cuisine"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 7,
      title: "Phi Phi & Moopun Waterfalls Adventure",
      description: "Budget-friendly 3-day waterfall hopping tour through Meghalaya's hidden cascades — trek to pristine falls and swim in natural pools.",
      duration: "3 Days",
      difficulty: "Moderate",
    price: "₹13,999",
      image: phiPhiWaterfallMeghalayaImg,
      images: [phiPhiWaterfallMeghalayaImg, moopunWaterfallImg],
      rating: 4.7,
      category: "adventure",
      location: "Meghalaya",
      highlights: ["Phi Phi Falls Trek", "Moopun Waterfall Swim", "Hidden Cascade Exploration", "Jungle Trail Adventures", "Village Homestay Experience", "Photography Spots"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 8,
      title: "Meghalaya Waterfalls Budget Circuit",
      description: "Complete 3-day budget tour covering Krang Suri, Moopun, and multiple hidden waterfalls — perfect for nature lovers seeking affordable adventure.",
      duration: "3 Days",
      difficulty: "Easy",
    price: "₹12,999",
      image: moopunWaterfallImg,
      rating: 4.5,
      category: "leisure",
      location: "Meghalaya",
      highlights: ["Multiple Waterfall Visits", "Natural Swimming Pools", "Budget Accommodation", "Local Food Experience", "Nature Photography", "Eco-friendly Travel"],
      bestSeason: "Oct-Mar"
    },
  ],
  "Arunachal Pradesh": [
    {
      id: 21,
      title: "Arunachal Winter Cultural Festival",
      description: "Immerse in vibrant tribal traditions during peak festival season with traditional dances, crafts, and mountain vistas.",
      duration: "6 Days",
      difficulty: "Moderate",
    price: "₹28,999",
      image: arunachalCulturalFestivalImg,
      images: [arunachalCulturalFestivalImg, arunachalTribalImg],
      rating: 4.8,
      category: "cultural",
      location: "Arunachal Pradesh",
      highlights: ["Tribal Dance Performances", "Traditional Craft Markets", "Mountain Monastery Visits", "Local Cuisine Workshops", "Cultural Immersion Programs", "Sunrise Valley Views"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 29,
      title: "Tawang Monastery Exploration",
      description: "Discover the spiritual heart of Arunachal Pradesh — ancient monasteries, Bumla Pass at the India-China border, Sela Pass at 13,700 ft, and Monpa tribal culture.",
      duration: "6 Days",
      difficulty: "Moderate",
    price: "₹29,999",
      image: tawangMonasteryMountainsImg,
      rating: 4.8,
      category: "cultural",
      location: "Arunachal Pradesh",
      highlights: ["Tawang Monastery — India's Largest", "Bumla Pass — India-China Border (15,200 ft)", "Sela Pass Crossing (13,700 ft)", "Nuranang Waterfall (100m)", "Madhuri Lake (Sangetsar Tso)", "Dirang Hot Springs", "Monpa Tribal Culture & Weaving"],
      bestSeason: "Mar-Oct"
    },
    {
      id: 28,
      title: "Bumla Pass Bike Expedition",
      description: "Epic motorcycle journey to the Indo-China border at 15,200 feet — conquer high-altitude mountain passes through breathtaking Himalayan landscapes.",
      duration: "8 Days",
      difficulty: "Challenging",
    price: "₹39,999",
      image: bumlaPassBikeExpeditionImg,
      images: [bumlaPassBikeExpeditionImg, motorcycleMountainRoadImg],
      rating: 4.9,
      category: "adventure",
      location: "Arunachal Pradesh",
      highlights: ["Ride to Bumla Pass 15,200 ft", "Tawang Monastery Visit", "Sela Pass Crossing", "Indo-China Border Experience", "High Altitude Biking", "Mountain Valley Exploration"],
      bestSeason: "Apr-Oct"
    },
  ],
  "Assam": [
    {
      id: 22,
      title: "Assam Wildlife & Tea Heritage",
      description: "Winter wildlife safaris in Kaziranga followed by aromatic tea garden tours — perfect weather for rhino spotting.",
      duration: "6 Days",
      difficulty: "Easy",
      price: "₹29,999",
      image: assamTeaGardensImg,
      rating: 4.6,
      category: "leisure",
      location: "Assam",
      highlights: ["Kaziranga Elephant Safari", "One-Horned Rhino Encounters", "Tea Estate Tours", "Tea Tasting Sessions", "River Island Majuli", "Kamakhya Temple"],
      bestSeason: "Oct-Mar"
    },
  ],
  "Nagaland": [
    {
      id: 23,
      title: "Nagaland Dzukou Valley & Kohima Heritage",
      description: "Trek through the Valley of Flowers of the East and explore Kohima's WWII heritage and vibrant Naga tribal culture.",
      duration: "5 Days",
      difficulty: "Moderate",
    price: "₹23,999",
      image: nagalandHornbillImg,
      rating: 4.7,
      category: "adventure",
      location: "Nagaland",
      highlights: ["Dzukou Valley Trek", "Kohima War Cemetery", "Naga Tribal Villages", "Traditional Cuisine", "Handicraft Markets", "Tribal Dance Performances"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 230,
      title: "Kohima WWII Heritage & Tribal Culture",
      description: "Walk through history at the pivotal WWII battleground and explore the resilient tribal heritage of the Naga people.",
      duration: "4 Days",
      difficulty: "Easy",
      price: "₹23,500",
      image: kohimaWarImg,
      rating: 4.6,
      category: "cultural",
      location: "Nagaland",
      highlights: ["Kohima War Cemetery", "State Museum", "Naga Heritage Village", "Traditional Morung Houses", "Local Naga Cuisine", "Handicraft Shopping"],
      bestSeason: "Oct-Mar"
    },
  ],
  "Manipur": [
    {
      id: 24,
      title: "Manipur Loktak Lake Winter Discovery",
      description: "Explore the world's only floating national park during ideal winter conditions — witness dancing deer and floating villages.",
      duration: "4 Days",
      difficulty: "Easy",
      price: "₹23,500",
      image: manipurLoktakImg,
      rating: 4.7,
      category: "leisure",
      location: "Manipur",
      highlights: ["Keibul Lamjao Park Safari", "Sangai Deer Spotting", "Floating Village Visits", "Phumdi Island Exploration", "Traditional Boat Rides", "Ima Keithel Market"],
      bestSeason: "Oct-Mar"
    },
  ],
  "Tripura": [
    {
      id: 26,
      title: "Tripura Heritage & Craft Trail",
      description: "Winter journey through ancient palaces and bamboo craft villages — discover sustainable tribal artisan traditions.",
      duration: "4 Days",
      difficulty: "Moderate",
      price: "₹23,500",
      image: tripuraBambooHeritageImg,
      images: [tripuraBambooHeritageImg, mizoramBambooImg],
      rating: 4.5,
      category: "cultural",
      location: "Tripura",
      highlights: ["Ujjayanta Palace Tour", "Bamboo Craft Workshops", "Tribal Heritage Museums", "Neermahal Water Palace", "Handicraft Village Visits", "Traditional Weaving Demos"],
      bestSeason: "Oct-Mar"
    },
  ],
  "Sikkim": [
    {
      id: 53,
      title: "Pelling Kanchenjunga Winter Views",
      description: "Crystal-clear winter skies reveal stunning Kanchenjunga vistas — perfect season for Himalayan photography and monastery tours.",
      duration: "4 Days",
      difficulty: "Easy",
      price: "₹23,500",
      image: pellingKanchenjungaImg,
      rating: 4.6,
      category: "leisure",
      location: "Sikkim",
      highlights: ["Kanchenjunga Sunrise", "Buddhist Monasteries", "Sky Walk Glass Bridge", "Khecheopalri Sacred Lake", "Waterfall Hikes", "Traditional Sikkimese Cuisine"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 55,
      title: "North Sikkim Winter Expedition",
      description: "Adventure through snow-kissed valleys and pristine winter landscapes — challenging high-altitude exploration.",
      duration: "7 Days",
      difficulty: "Challenging",
      price: "₹42,500",
      image: gurudongmarLakeImg,
      rating: 4.9,
      category: "adventure",
      location: "Sikkim",
      highlights: ["Gurudongmar Sacred Lake", "Yumthang Valley Flowers", "Zero Point Snow", "Lachung Monastery", "Hot Spring Therapy", "High Altitude Acclimatization"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 52,
      title: "Sikkim Peaceful Winter Retreat",
      description: "Tranquil monastery stays and gentle valley walks during peaceful winter months — spiritual rejuvenation in the Himalayas.",
      duration: "4 Days",
      difficulty: "Moderate",
      price: "₹23,500",
      image: sikkimRhododendronImg,
      rating: 4.7,
      category: "leisure",
      location: "Sikkim",
      highlights: ["Rumtek Monastery", "Nature Valley Walks", "Mountain Panoramas", "Buddhist Meditation", "Local Homestays", "Organic Farm Visits"],
      bestSeason: "Oct-Mar"
    },
  ],
};

// ============================================
// Indian Himalayas & Heartland Tours
// ============================================

export const heartlandTours: Record<string, TourPackage[]> = {
  "Himachal Pradesh": [
    {
      id: 64,
      title: "Kullu Valley Winter Adventure",
      description: "Mild winter adventures with paragliding, river walks, and orchard tours — perfect blend of thrill and scenic beauty.",
      duration: "4 Days",
      difficulty: "Moderate",
      price: "₹23,500",
      image: kulluValleyAdventureImg,
      rating: 4.5,
      category: "adventure",
      location: "Himachal Pradesh",
      highlights: ["Winter Paragliding", "Beas River Walks", "Apple Orchard Visits", "Hot Spring Therapy", "Kasol Village Cafes", "Mountain Biking Trails"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 63,
      title: "Dharamshala McLeod Ganj Winter",
      description: "Experience Tibetan culture and peaceful mountain life during crisp winter months — meditation and trekking combined.",
      duration: "5 Days",
      difficulty: "Moderate",
      price: "₹29,500",
      image: dharamshalaMcleodGanjImg,
      rating: 4.7,
      category: "cultural",
      location: "Himachal Pradesh",
      highlights: ["Dalai Lama Temple Complex", "Tibetan Cultural Institute", "Triund Winter Trek", "Bhagsu Waterfall", "Norbulingka Monastery", "Tibetan Cuisine Workshops"],
      bestSeason: "Oct-Mar"
    },
  ],
  "Uttarakhand": [
    {
      id: 33,
      title: "Nainital Winter Lake Serenity",
      description: "Peaceful winter escape to pristine mountain lakes — colonial charm meets Kumaon hills beauty in perfect weather.",
      duration: "4 Days",
      difficulty: "Easy",
      price: "₹23,500",
      image: nainitalLakeImg,
      rating: 4.6,
      category: "leisure",
      location: "Uttarakhand",
      highlights: ["Naini Lake Boating", "Snow View Ropeway", "Mall Road Shopping", "Naina Devi Temple", "Eco Cave Gardens", "Winter Birdwatching"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 31,
      title: "Char Dham Winter Pilgrimage Prep",
      description: "Pre-season sacred sites exploration and winter yoga retreats — spiritual preparation in Himalayan foothills.",
      duration: "8 Days",
      difficulty: "Moderate",
      price: "₹48,500",
      image: charDhamYatraImg,
      rating: 4.9,
      category: "cultural",
      location: "Uttarakhand",
      highlights: ["Rishikesh Yoga Ashrams", "Haridwar Ganga Aarti", "Temple Circuit Tours", "Spiritual Discourses", "Meditation Retreats", "Himalayan Views"],
      bestSeason: "Oct-Mar"
    },
  ],
  "Tamil Nadu": [
    {
      id: 81,
      title: "Grand Tamil Nadu Temple Circuit — Premium Heritage",
      description: "Ultimate 10-day spiritual odyssey through Tamil Nadu's magnificent Dravidian temples — from Madurai's towering gopurams to Chidambaram's cosmic dance.",
      duration: "10 Days",
      difficulty: "Moderate",
      price: "₹62,500",
      image: tamilNaduMeenakshiTempleImg,
      rating: 4.9,
      category: "cultural",
      location: "Tamil Nadu",
      highlights: ["Meenakshi Temple Madurai", "Brihadeeswara Temple Thanjavur", "Rameswaram Sacred Pilgrimage", "Temple Architecture Workshops", "Classical Bharatanatyam Performances", "Traditional Temple Cuisine"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 82,
      title: "Sacred Temples of South India — 9 Day Spiritual Journey",
      description: "Immersive winter pilgrimage through Tamil Nadu's holiest shrines — witness ancient rituals, experience temple festivals.",
      duration: "9 Days",
      difficulty: "Easy",
      price: "₹56,500",
      image: tamilNaduKanchipuramTempleImg,
      rating: 4.8,
      category: "cultural",
      location: "Tamil Nadu",
      highlights: ["Kanchipuram 1000 Pillar Temple", "Tirupati Venkateswara Darshan", "Mahabalipuram Shore Temple Sunrise", "Vedic Chanting Ceremonies", "Temple Priest Interactions", "Sacred Kaveri River Rituals"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 84,
      title: "Dravidian Architecture Masterclass",
      description: "Exclusive deep dive into Tamil temple architecture with expert archaeologists — decode ancient inscriptions and Chola engineering genius.",
      duration: "10 Days",
      difficulty: "Moderate",
      price: "₹62,500",
      image: tamilNaduBrihadeeswraUnescoImg,
      rating: 4.9,
      category: "educational",
      location: "Tamil Nadu",
      highlights: ["UNESCO World Heritage Temples", "Bronze Sculpture Museums", "Ancient Inscription Study", "Gopuram Architecture Analysis", "Chola Art History Lectures", "Heritage Conservation Insights"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 83,
      title: "Kodaikanal Winter Hill Retreat",
      description: "Misty winter mornings and cool Western Ghats climate — romantic hill station escape with lakes and viewpoints.",
      duration: "3 Days",
      difficulty: "Easy",
      price: "₹16,500",
      image: ootyKodaikanalImg,
      rating: 4.4,
      category: "leisure",
      location: "Tamil Nadu",
      highlights: ["Kodai Lake Cycling", "Coaker's Walk Sunset", "Bryant Park Florals", "Pillar Rocks Vista", "Pine Forest Trails", "Homemade Chocolate Factory"],
      bestSeason: "Oct-Mar"
    },
  ],
  "Kerala": [
    {
      id: 71,
      title: "Kerala Winter Backwaters Paradise",
      description: "Luxurious houseboat cruises through tranquil winter backwaters — perfect weather for palm-fringed canal exploration.",
      duration: "5 Days",
      difficulty: "Easy",
      price: "₹29,500",
      image: keralaBackwatersImg,
      rating: 4.8,
      category: "leisure",
      location: "Kerala",
      highlights: ["Traditional Houseboat Stay", "Coconut Lagoon Cruises", "Authentic Kerala Cuisine", "Ayurvedic Spa Treatments", "Village Canoe Rides", "Sunset Photography"],
      bestSeason: "Oct-Mar"
    },
    {
      id: 73,
      title: "Thekkady Wildlife & Spice Winter",
      description: "Periyar tiger reserve safaris and aromatic winter spice plantations — ideal season for wildlife and harvest tours.",
      duration: "3 Days",
      difficulty: "Easy",
      price: "₹16,500",
      image: thekkadyWildlifeImg,
      rating: 4.6,
      category: "leisure",
      location: "Kerala",
      highlights: ["Periyar Lake Boat Safari", "Spice Plantation Tours", "Elephant Encounters", "Cardamom & Pepper Trails", "Bamboo Rafting", "Tribal Heritage Center"],
      bestSeason: "Oct-Mar"
    },
  ],
};

// ============================================
// International Tours (NEW)
// ============================================

export const internationalTours: Record<string, TourPackage[]> = {
  "Southeast Asia": [
    {
      id: 301,
      title: "Vietnam Discovery Trail",
      description: "From Hanoi's ancient quarters to Ha Long Bay's limestone karsts and Hoi An's lantern-lit streets — a curated journey through Vietnam's cultural heartbeat.",
      duration: "10 Days",
      difficulty: "Easy",
      price: "₹88,000",
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
      rating: 4.8,
      category: "cultural",
      location: "Vietnam",
      highlights: ["Hanoi Old Quarter Walking Tour", "Ha Long Bay Overnight Cruise", "Hoi An Lantern Festival", "Vietnamese Cooking Class", "Cu Chi Tunnels History", "Mekong Delta Exploration"],
      bestSeason: "Oct-Apr",
      international: true,
      visaInfo: "E-Visa Available",
      groupSize: "8-14 people",
      region: "Southeast Asia"
    },
    {
      id: 302,
      title: "Thailand Nature & Culture Escape",
      description: "Beyond the beaches — explore Chiang Mai's temple trails, Krabi's emerald pools, and authentic Thai village life curated the XTSY way.",
      duration: "8 Days",
      difficulty: "Easy",
      price: "₹78,000",
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
      rating: 4.7,
      category: "cultural",
      location: "Thailand",
      highlights: ["Chiang Mai Temple Circuit", "Doi Inthanon National Park", "Krabi Emerald Pool Trek", "Thai Cooking School", "Elephant Sanctuary Visit", "Night Bazaar Culture"],
      bestSeason: "Nov-Mar",
      international: true,
      visaInfo: "Visa-Free for Indians (60 days)",
      groupSize: "8-15 people",
      region: "Southeast Asia"
    },
    {
      id: 303,
      title: "Bali Wellness & Culture Retreat",
      description: "Yoga at sunrise over rice terraces, temple ceremonies, and holistic wellness — Bali as it was meant to be experienced, not as a party island.",
      duration: "7 Days",
      difficulty: "Easy",
      price: "₹72,000",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
      rating: 4.9,
      category: "leisure",
      location: "Bali, Indonesia",
      highlights: ["Ubud Rice Terrace Yoga", "Tirta Empul Water Temple", "Traditional Balinese Healing", "Tegallalang Rice Terraces", "Mount Batur Sunrise Trek", "Artisan Village Workshops"],
      bestSeason: "Apr-Oct",
      international: true,
      visaInfo: "Visa on Arrival",
      groupSize: "8-12 people",
      region: "Southeast Asia"
    },
  ],
  "South Asia & Near Abroad": [
    {
      id: 304,
      title: "Nepal Himalayan Culture & Trek Lite",
      description: "Kathmandu's living heritage meets Pokhara's serene lakeside — gentle treks with Annapurna views without the extreme altitude.",
      duration: "7 Days",
      difficulty: "Moderate",
      price: "₹45,000",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
      rating: 4.8,
      category: "adventure",
      location: "Nepal",
      highlights: ["Kathmandu Durbar Square", "Swayambhunath Stupa", "Pokhara Lakeside", "Poon Hill Sunrise Trek", "Annapurna Base Camp Views", "Nepali Thali Experience"],
      bestSeason: "Oct-Apr",
      international: true,
      visaInfo: "Visa on Arrival",
      groupSize: "6-12 people",
      region: "South Asia"
    },
    {
      id: 305,
      title: "Bhutan Mindful Kingdom Journey",
      description: "The last Shangri-La — Paro's Tiger's Nest, Thimphu's fortress monasteries, and Punakha's river valleys in the world's happiest country.",
      duration: "6 Days",
      difficulty: "Moderate",
      price: "₹95,000",
      image: "https://images.unsplash.com/photo-1553856622-d1b352e24a45?w=800&q=80",
      rating: 4.9,
      category: "cultural",
      location: "Bhutan",
      highlights: ["Tiger's Nest Monastery Trek", "Thimphu Dzong Fortress", "Punakha Valley Exploration", "Bhutanese Archery Session", "Prayer Flag Planting", "Farm-to-Table Bhutanese Cuisine"],
      bestSeason: "Mar-May, Sep-Nov",
      international: true,
      visaInfo: "Visa facilitated by XTSY",
      groupSize: "6-10 people",
      region: "South Asia"
    },
    {
      id: 306,
      title: "Sri Lanka Heritage & Wildlife Loop",
      description: "Ancient kingdoms, leopard safaris, and misty tea hills — Sri Lanka's extraordinary diversity compressed into one curated loop.",
      duration: "8 Days",
      difficulty: "Easy",
      price: "₹68,000",
      image: "https://images.unsplash.com/photo-1586523969720-7a4e7e4e37d4?w=800&q=80",
      rating: 4.7,
      category: "cultural",
      location: "Sri Lanka",
      highlights: ["Sigiriya Rock Fortress", "Yala National Park Safari", "Nuwara Eliya Tea Trails", "Temple of the Tooth", "Galle Fort Heritage Walk", "Train Through Hill Country"],
      bestSeason: "Dec-Apr",
      international: true,
      visaInfo: "E-Visa Available",
      groupSize: "8-14 people",
      region: "South Asia"
    },
  ],
  "Experiential International": [
    {
      id: 307,
      title: "Turkey History & Landscape Route",
      description: "Istanbul's Byzantine grandeur meets Cappadocia's surreal balloon-dotted skies — a journey through millennia of civilisation.",
      duration: "9 Days",
      difficulty: "Easy",
      price: "₹1,15,000",
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80",
      rating: 4.8,
      category: "cultural",
      location: "Turkey",
      highlights: ["Hagia Sophia & Blue Mosque", "Cappadocia Hot Air Balloon", "Underground City Exploration", "Bosphorus Cruise", "Turkish Hammam Experience", "Grand Bazaar Heritage Walk"],
      bestSeason: "Apr-Jun, Sep-Nov",
      international: true,
      visaInfo: "E-Visa Available",
      groupSize: "8-14 people",
      region: "Europe & Beyond"
    },
    {
      id: 308,
      title: "Morocco Culture & Desert Caravan",
      description: "Marrakech's medina maze, Atlas Mountain villages, and a night under Saharan stars — North Africa's most immersive experience.",
      duration: "8 Days",
      difficulty: "Moderate",
      price: "₹1,05,000",
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80",
      rating: 4.7,
      category: "adventure",
      location: "Morocco",
      highlights: ["Marrakech Medina & Souks", "Atlas Mountain Trek", "Sahara Desert Camp Night", "Camel Caravan Experience", "Fes Tanneries Visit", "Moroccan Cooking Class"],
      bestSeason: "Mar-May, Sep-Nov",
      international: true,
      visaInfo: "Visa-Free for Indians (90 days)",
      groupSize: "8-12 people",
      region: "Africa"
    },
    {
      id: 309,
      title: "Georgia Wine & Mountains Trail",
      description: "Europe's most surprising destination — ancient winemaking traditions, Caucasus mountain villages, and Tbilisi's eclectic charm.",
      duration: "7 Days",
      difficulty: "Easy",
      price: "₹82,000",
      image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80",
      rating: 4.6,
      category: "cultural",
      location: "Georgia",
      highlights: ["Tbilisi Old Town Walking", "Kakheti Wine Region", "Kazbegi Mountain Views", "Georgian Supra Feast", "Cave Monastery Visit", "Natural Hot Springs"],
      bestSeason: "May-Oct",
      international: true,
      visaInfo: "E-Visa Available",
      groupSize: "8-14 people",
      region: "Europe & Beyond"
    },
  ],
};

// ============================================
// Couple Luxury Packages (XTSY 270 Stay)
// ============================================

const _coupleLuxuryTours: TourPackage[] = [
  {
    id: 601,
    title: "XTSY 270 Romantic Meghalaya Escape",
    description: "3 nights in the XTSY 270 Panorama Glass Ensuite + curated couple experiences — stargazing, sunrise views, private waterfall trek, and candlelight Khasi dinner.",
    duration: "4 Days",
    difficulty: "Easy",
    price: "₹38,500",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/download%20(26).jpg",
    rating: 4.9,
    category: "leisure",
    location: "Meghalaya",
    highlights: ["XTSY 270 Panorama Suite — 3 Nights", "Private Waterfall Trek for Two", "Stargazing from Glass Room", "Candlelight Khasi Dinner", "Couple Spa & Wellness", "Sunrise Photography Session"],
    bestSeason: "Oct-Mar",
    exclusive: true,
    groupSize: "2 people (Couples only)"
  },
  {
    id: 602,
    title: "XTSY 270 Honeymoon Cloud Retreat",
    description: "Ultimate honeymoon experience — panoramic glass ensuite stay with Shillong city tour, Dawki boating, and premium couple dining under the stars.",
    duration: "5 Days",
    difficulty: "Easy",
    price: "₹52,500",
    image: shillongCherryBlossomImg,
    rating: 5.0,
    category: "leisure",
    location: "Meghalaya",
    highlights: ["XTSY 270 Panorama Suite — 4 Nights", "Dawki Crystal River Boating", "Shillong Scenic City Tour", "Private Dining Under Stars", "Couple Photography Package", "Cherry Blossom Walk (Seasonal)"],
    bestSeason: "Oct-Mar",
    exclusive: true,
    groupSize: "2 people (Couples only)"
  },
  {
    id: 603,
    title: "XTSY 270 Adventure Couple Circuit",
    description: "For adventurous couples — XTSY 270 luxury base camp with double decker root bridge trek, caving, and jungle camping under the Milky Way.",
    duration: "6 Days",
    difficulty: "Moderate",
    price: "₹62,500",
    image: doubleDeckerBridgeNewImg,
    rating: 4.9,
    category: "adventure",
    location: "Meghalaya",
    highlights: ["XTSY 270 Suite — 2 Nights Base Camp", "Double Decker Root Bridge Trek", "Couple Jungle Camping", "Cave Exploration Together", "Milky Way Night Session", "Adventure Photo Package"],
    bestSeason: "Oct-Mar",
    exclusive: true,
    groupSize: "2 people (Couples only)"
  },
];

export const coupleLuxuryTours = _coupleLuxuryTours.map(mergeItinerary);

// ============================================
// Solo Traveller & Bike Tours
// ============================================

const _soloAndBikeTours: TourPackage[] = [
  {
    id: 701,
    title: "XTSY Solo Traveller Pass — Meghalaya",
    description: "Safe, curated solo exploration with local buddy system, verified homestays, and 24/7 support. Women-only batches available. Making solo travel easy.",
    duration: "5 Days",
    difficulty: "Easy",
    price: "₹22,500",
    image: dawkiCrystalClearImg,
    rating: 4.8,
    category: "adventure",
    location: "Meghalaya",
    highlights: ["Verified Homestay Network", "Local Buddy System", "24/7 Safety Support", "Women-Only Batch Option", "Solo-Friendly Itinerary", "Community Meetups"],
    bestSeason: "Oct-Mar",
    groupSize: "Solo (1 person)"
  },
  {
    id: 702,
    title: "NE India Solo Bike Circuit — Meghalaya",
    description: "Royal Enfield solo expedition through Meghalaya's stunning roads — mechanic support vehicle, all gear included, GPS-tracked for safety.",
    duration: "6 Days",
    difficulty: "Challenging",
    price: "₹35,500",
    image: bumlaPassBikeExpeditionImg,
    rating: 4.9,
    category: "adventure",
    location: "Meghalaya",
    highlights: ["Royal Enfield Himalayan Provided", "Mechanic Support Vehicle", "All Riding Gear Included", "GPS-Tracked Route", "Scenic Highway Stops", "Biker Community Meetup"],
    bestSeason: "Oct-Mar",
    groupSize: "Solo / Small Group"
  },
  {
    id: 703,
    title: "Arunachal Bike Expedition — Solo Friendly",
    description: "Epic solo-friendly motorcycle journey through Arunachal — Sela Pass, Tawang, Bumla Pass with full support crew and safety net.",
    duration: "8 Days",
    difficulty: "Challenging",
    price: "₹48,500",
    image: tawangMonasteryMountainsImg,
    rating: 4.9,
    category: "adventure",
    location: "Arunachal Pradesh",
    highlights: ["Sela Pass 13,700 ft Crossing", "Tawang Monastery Visit", "Bumla Pass Border Ride", "Full Support Crew", "Solo-Safe Route Planning", "Royal Enfield + Gear Included"],
    bestSeason: "Apr-Oct",
    groupSize: "Solo / Small Group"
  },
  {
    id: 704,
    title: "Solo Female Traveller — NE Cultural Trail",
    description: "Exclusively designed for solo female travellers — curated cultural immersion with women guides, verified safe stays, and local sisterhood network.",
    duration: "5 Days",
    difficulty: "Easy",
    price: "₹24,500",
    image: arunachalCulturalFestivalImg,
    rating: 4.9,
    category: "cultural",
    location: "Northeast India",
    highlights: ["Women Guides Only", "Verified Safe Homestays", "Local Sisterhood Network", "Cultural Workshop Access", "Emergency Support Line", "Solo Female Community"],
    bestSeason: "Oct-Mar",
    groupSize: "Solo Female (1 person)"
  },
];

export const soloAndBikeTours = _soloAndBikeTours.map(mergeItinerary);

// ============================================
// RE Himalayan Expedition (Premium)
// ============================================

import reHimalayanNepalExpedition from "@/assets/re-himalayan-expedition-cover.jpg";

export const reHimalayanExpedition: TourPackage = {
  id: 500,
  title: "Tri-Nation Himalayan Motorbike Expedition",
  description: "Experience the ultimate cross-border adventure on a Royal Enfield Himalayan through Northeast India, Nepal, and Bhutan.",
  duration: "12-15 Days",
  difficulty: "Challenging",
  price: "₹1,85,000",
  image: reHimalayanNepalExpedition,
  rating: 4.9,
  category: "adventure",
  location: "India, Nepal, Bhutan",
  highlights: ["Royal Enfield Himalayan Bike", "Tawang Sela Pass 13,700 ft", "Kathmandu Valley & Pokhara", "Tiger's Nest Monastery Trek", "Dochula Pass 10,000 ft", "Premium Riding Gear Included"],
  bestSeason: "Oct-Mar",
  exclusive: true,
  international: true,
  groupSize: "6-10 riders"
};

// ============================================
// Filter Utilities
// ============================================

export const getAllTours = (): TourPackage[] => {
  const northeast = Object.values(northeastTours).flat().map(mergeItinerary);
  const heartland = Object.values(heartlandTours).flat().map(mergeItinerary);
  const international = Object.values(internationalTours).flat().map(mergeItinerary);
  return [...exclusiveTours, ...coupleLuxuryTours, ...soloAndBikeTours, ...northeast, ...heartland, ...international, mergeItinerary(reHimalayanExpedition)];
};

export const filterTours = (tours: TourPackage[], filters: TravelFilters): TourPackage[] => {
  return tours.filter(tour => {
    if (filters.destination === "india" && tour.international) return false;
    if (filters.destination === "international" && !tour.international) return false;
    if (filters.theme !== "all" && tour.category !== filters.theme) return false;

    if (filters.duration !== "all") {
      const days = parseInt(tour.duration);
      if (filters.duration === "short" && days > 3) return false;
      if (filters.duration === "medium" && (days < 4 || days > 7)) return false;
      if (filters.duration === "long" && days < 8) return false;
    }

    if (filters.budget !== "all") {
      const price = parseInt(tour.price.replace(/[^\d]/g, ''));
      if (filters.budget === "budget" && price > 20000) return false;
      if (filters.budget === "mid" && (price < 20000 || price > 50000)) return false;
      if (filters.budget === "premium" && price < 50000) return false;
    }

    if (filters.season !== "all") {
      const season = tour.bestSeason.toLowerCase();
      if (filters.season === "winter" && !season.includes("oct") && !season.includes("nov") && !season.includes("dec") && !season.includes("jan") && !season.includes("feb") && !season.includes("mar")) return false;
      if (filters.season === "summer" && !season.includes("apr") && !season.includes("may")) return false;
      if (filters.season === "monsoon" && !season.includes("jun") && !season.includes("jul") && !season.includes("aug") && !season.includes("sep")) return false;
      if (filters.season === "spring" && !season.includes("mar") && !season.includes("apr")) return false;
    }

    return true;
  });
};
