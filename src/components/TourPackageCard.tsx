import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Calendar, Mountain, Camera } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import OptimizedLazyImage from "./OptimizedLazyImage";

// Import available image assets (including new authentic sourced images)
import meghalayaHiddenGemsImg from "@/assets/meghalaya-hidden-gems-new.jpg";
import meghalayaNatureAuthenticImg from "@/assets/meghalaya-nature-authentic.jpg";
import shillongCulturalImg from "@/assets/shillong-meghalaya-real.jpg";
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
import munnarTeaGardensImg from "@/assets/munnar-tea-gardens-kerala.jpg";
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
// Northeast Ecological Education Program - using Supabase URL
const northeastEcologicalEducationImg = "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg";

interface TourPackageCardProps {
  tourPackage: {
    id: number;
    title: string;
    description: string;
    duration: string;
    difficulty: string;
    price: string;
    rating: number;
    category: string;
    location: string;
    highlights: string[];
    bestSeason: string;
    image?: string;
    images?: string[];
  };
  onPackageClick: () => void;
}

const TourPackageCard = ({ tourPackage, onPackageClick }: TourPackageCardProps) => {
  const { currency, formatPrice } = useApp();
  
  // Function to get appropriate image based on tour package content with authentic sourced images
  const getRelevantImage = () => {
    const title = tourPackage.title.toLowerCase();
    const description = tourPackage.description.toLowerCase();
    const highlights = tourPackage.highlights.join(' ').toLowerCase();
    const content = `${title} ${description} ${highlights}`;

    // XTSY Exclusive packages with authentic images - prioritize specific matches
    if (content.includes('northeast ecological education') || content.includes('ecological education program')) return northeastEcologicalEducationImg;
    if (content.includes('biodiversity') || content.includes('research') || content.includes('ecological')) return meghalayaBiodiversityAuthenticImg;
    if (content.includes('wilderness') || content.includes('survival skills') || content.includes('bushcraft')) return wildernessAuthenticImg;
    
    // Meghalaya specific tours with authentic images
    if (content.includes('meghalaya hidden gems') || content.includes('hidden gems')) return meghalayaNatureAuthenticImg;
    if (content.includes('shillong') || content.includes('cultural experience')) return shillongCulturalImg;
    if (content.includes('cherrapunji') || content.includes('nohkalikai') || content.includes('monsoon trek')) return cherrapunjiMonsoonImg;
    if (content.includes('dawki') || content.includes('umngot') || content.includes('crystal clear')) return dawkiCrystalClearAuthenticImg;
    if (content.includes('mawlynnong') || content.includes('cleanest village')) return mawlynnongVillageImg;
    if (content.includes('garo hills') || content.includes('garo tribal')) return garoHillsTribalImg;
    if (content.includes('jaintia') || content.includes('caves') || content.includes('limestone')) return jaintiaCavesImg;
    if (content.includes('living root bridges') || content.includes('root bridge')) return livingRootBridgesAuthenticImg;
    if (content.includes('khasi hills') || content.includes('khasi')) return khasiHillsTrekImg;
    
    // Adventure and activity based
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

    // North India destinations
    if (content.includes('valley of flowers') || content.includes('uttarakhand flowers')) return valleyOfFlowersImg;
    if (content.includes('spiti') || content.includes('cold desert')) return spitivalleyImg;
    if (content.includes('shimla') || content.includes('manali') || content.includes('honeymoon')) return shimlaManaliImg;
    if (content.includes('rishikesh') || content.includes('rafting') || content.includes('yoga capital')) return rishikeshAdventureImg;
    if (content.includes('dharamshala') || content.includes('mcleodganj') || content.includes('dalai lama')) return dharamshalaImg;
    if (content.includes('nainital') || content.includes('lake district')) return nainitalImg;
    if (content.includes('char dham') || content.includes('pilgrimage')) return charDhamImg;
    if (content.includes('uttarakhand') || content.includes('himalaya')) return uttarakhandHimalayasImg;
    if (content.includes('himachal') || content.includes('valleys')) return himachalValleysImg;

    // South India destinations with authentic images
    if (content.includes('kerala') || content.includes('backwater')) return keralaBackwatersAuthenticImg;
    if (content.includes('munnar') || content.includes('tea garden') || content.includes('tea plantation')) return munnarTeaGardensImg;
    if (content.includes('thekkady') || content.includes('wildlife') || content.includes('periyar')) return thekkadyWildlifeImg;
    if (content.includes('tamil nadu') || content.includes('temple') || content.includes('dravidian')) return tamilNaduTemplesImg;
    if (content.includes('ooty') || content.includes('kodaikanal') || content.includes('nilgiri')) return ootyImg;

    // Northeast India destinations with authentic images
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

    // Default fallback images based on category with authentic images
    switch (tourPackage.category) {
      case 'adventure':
        return highAltitudeTrekImg;
      case 'cultural':
        return tribalCircuitImg;
      case 'leisure':
        return wellnessRetreatImg;
      default:
        return meghalayaNatureAuthenticImg;
    }
  };

  // Calculate proper pricing with currency conversion and weekend/weekday logic
  const calculateDisplayPrice = () => {
    const basePrice = parseInt(tourPackage.price.replace(/[^\d]/g, ''));
    let displayPrice = basePrice;
    
    // For USD/EUR guests: Add 10% base hike (15% on weekends handled in modal)
    if (currency.code !== 'INR') {
      displayPrice = Math.round(basePrice * 1.10);
    }
    
    return formatPrice(displayPrice);
  };

  const selectedImage = getRelevantImage();

  return (
    <Card 
      className="group hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden border-0 bg-card/90 backdrop-blur-md h-[600px] flex flex-col"
    >
      <div className="relative overflow-hidden">
        <OptimizedLazyImage
          src={selectedImage}
          alt={tourPackage.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          threshold={0.3}
        />
        {tourPackage.images && tourPackage.images.length > 1 && (
          <div className="absolute top-4 left-4 bg-background/90 text-foreground px-2 py-1 rounded text-xs font-semibold border border-border">
            +{tourPackage.images.length - 1} more
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-background/90 text-foreground border border-border">
            {tourPackage.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {tourPackage.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium text-foreground">{tourPackage.rating}</span>
          </div>
        </div>
        <CardDescription className="text-muted-foreground line-clamp-3 flex-grow">
          {tourPackage.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{tourPackage.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mountain className="h-4 w-4" />
            <span>{tourPackage.difficulty}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{tourPackage.bestSeason}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Highlights:</h4>
          <div className="flex flex-wrap gap-1">
            {tourPackage.highlights.slice(0, 3).map((highlight, index) => (
              <Badge key={index} variant="outline" className="text-xs border-border">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            className="w-full bg-gradient-to-r from-primary to-destructive hover:from-primary/80 hover:to-destructive/80 text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onPackageClick();
            }}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Book This Journey
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourPackageCard;
