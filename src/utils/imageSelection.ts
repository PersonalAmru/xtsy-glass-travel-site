// Import available image assets (including new authentic sourced images)
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
import northeastBikeExpeditionImg from "@/assets/motorcycle-mountain-road.jpg";
// Northeast Ecological Education Program - using Supabase URL
const northeastEcologicalEducationImg = "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg";

export interface TourPackage {
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
  exclusive?: boolean;
}

/**
 * Intelligently selects the most appropriate image for a tour package
 * based on its content, title, description, and highlights
 */
export const getRelevantTourImage = (tourPackage: TourPackage): string => {
  // If there's a specific image provided, use it
  if (tourPackage.image) {
    return tourPackage.image;
  }

  // If there are multiple images, use the first one
  if (tourPackage.images && tourPackage.images.length > 0) {
    return tourPackage.images[0];
  }

  const title = tourPackage.title.toLowerCase();
  const description = tourPackage.description.toLowerCase();
  const highlights = tourPackage.highlights.join(' ').toLowerCase();
  const content = `${title} ${description} ${highlights}`;

  // XTSY Exclusive packages with authentic images - prioritize specific matches
  if (content.includes('northeast ecological education') || content.includes('ecological education program')) return northeastEcologicalEducationImg;
  if (content.includes('bike expedition') || content.includes('motorcycle') || content.includes('assam arunachal meghalaya')) return northeastBikeExpeditionImg;
  if (content.includes('biodiversity') || content.includes('research') || content.includes('ecological')) return meghalayaBiodiversityAuthenticImg;
  if (content.includes('wilderness') || content.includes('survival skills') || content.includes('bushcraft')) return wildernessAuthenticImg;
  
  // Meghalaya specific tours with authentic images
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