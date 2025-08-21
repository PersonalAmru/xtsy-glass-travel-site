import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Users, Star, MapPin, Minus, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { TourItineraryService } from "@/utils/tourItineraryService";
import { TourPricingService } from "@/utils/tourPricingService";
import OptimizedLazyImage from "./OptimizedLazyImage";

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
import northeastBikeExpeditionImg from "@/assets/royal-enfield-himalayan-group.jpg";
// Northeast Ecological Education Program - using Supabase URL
const northeastEcologicalEducationImg = "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/Complete%20Guide%20To%20Backpacking%20In%20Arunachal%20Pradesh%20-%20Lost%20With%20Purpose.jpg";

interface TourPackage {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  price: string;
  image: string;
  rating: number;
  category: string;
  highlights: string[];
  bestSeason: string;
  location: string;
}

interface TourPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourPackage: TourPackage | null;
}

const TourPackageModal: React.FC<TourPackageModalProps> = ({ isOpen, onClose, tourPackage }) => {
  const [guests, setGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [itineraryHighlights, setItineraryHighlights] = useState<any[]>([]);
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: ""
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { currency, formatPrice } = useApp();

  // Function to get appropriate image based on tour package content with authentic sourced images
  const getRelevantImage = () => {
    if (!tourPackage) return meghalayaNatureAuthenticImg;
    
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

  // Fetch itinerary highlights when modal opens
  useEffect(() => {
    if (isOpen && tourPackage) {
      fetchItineraryHighlights();
    }
  }, [isOpen, tourPackage]);

  // Store current tab when modal opens
  useEffect(() => {
    if (isOpen && location.pathname === '/travel') {
      const urlParams = new URLSearchParams(location.search);
      const currentTab = urlParams.get('tab') || 'domestic';
      localStorage.setItem('lastTravelTab', currentTab);
    }
  }, [isOpen, location]);

  // Custom close handler that preserves tab state
  const handleClose = () => {
    if (location.pathname === '/travel') {
      const lastTab = localStorage.getItem('lastTravelTab') || 'domestic';
      navigate(`/travel?tab=${lastTab}`, { replace: true });
    }
    onClose();
  };

  // Fetch itinerary highlights based on tour package details
  const fetchItineraryHighlights = async () => {
    if (!tourPackage) return;
    
    setIsLoadingItinerary(true);
    try {
      // Generate dynamic itinerary based on tour package specifics
      const dynamicItinerary = TourItineraryService.generateItineraryHighlights(tourPackage);
      setItineraryHighlights(dynamicItinerary);
    } catch (error) {
      console.error('Error generating itinerary highlights:', error);
      // Fallback to basic itinerary if generation fails
      setItineraryHighlights(generateFallbackItinerary());
    } finally {
      setIsLoadingItinerary(false);
    }
  };

  // Generate pricing based on group type and duration
  const generatePricing = (type: 'person' | 'group4' | 'group10') => {
    if (!tourPackage) return '₹0';
    
    const days = TourItineraryService.extractDays(tourPackage.duration);
    const basePricing = TourItineraryService.generateDurationBasedPricing(tourPackage.price, type, days);
    
    // Convert to selected currency if needed
    if (currency.code !== 'INR') {
      const priceValue = parseInt(basePricing.replace(/[^\d]/g, ''));
      return currency.code === 'USD' ? `$${Math.round(priceValue * 0.012)}` :
             `€${Math.round(priceValue * 0.011)}`;
    }
    
    return basePricing;
  };

  // Fallback itinerary data from travel sites
  const generateFallbackItinerary = () => [
    {
      id: 1,
      title: "Day 1-2: Arrival & Local Exploration",
      description: "Welcome reception, local sightseeing, cultural orientation, and acclimatization activities with guided tours.",
      pricing: {
        perPerson: generatePricing('person'),
        group4: generatePricing('group4'),
        group10: generatePricing('group10')
      },
      source: "TripAdvisor"
    },
    {
      id: 2,
      title: "Day 3-4: Main Attractions & Adventures",
      description: "Visit primary destinations, adventure activities, guided tours, local experiences, and cultural immersion.",
      pricing: {
        perPerson: generatePricing('person'),
        group4: generatePricing('group4'),
        group10: generatePricing('group10')
      },
      source: "Thrillophilia"
    },
    {
      id: 3,
      title: "Final Day: Departure & Memories",
      description: "Last-minute shopping, farewell activities, departure preparations, and transfer arrangements with souvenirs.",
      pricing: {
        perPerson: generatePricing('person'),
        group4: generatePricing('group4'),
        group10: generatePricing('group10')
      },
      source: "Travel Guide"
    }
  ];

  // Calculate end date based on selected start date and package duration
  const calculateEndDate = (startDate: string, duration: string) => {
    if (!startDate) return "";
    const days = parseInt(duration.split(" ")[0]);
    const start = new Date(startDate);
    const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
    return end.toISOString().split('T')[0];
  };

  const endDate = calculateEndDate(selectedDate, tourPackage?.duration || "");
  const { toast } = useToast();

  if (!tourPackage) return null;

  // Calculate pricing using EXACT same logic as TourPackageCard
  const calculatePricing = () => {
    // Use the exact same calculation as TourPackageCard
    const basePrice = parseInt(tourPackage.price.replace(/[^\d]/g, ''));
    let displayPrice = basePrice;
    
    // Check if selected date is weekend (for USD/EUR pricing)
    const isWeekend = selectedDate ? 
      [0, 6].includes(new Date(selectedDate).getDay()) : false;
    
    // For USD/EUR guests: Add 10% base hike (15% on weekends)
    if (currency.code !== 'INR') {
      const weekendHike = isWeekend ? 1.15 : 1.10; // 15% weekend, 10% weekday
      displayPrice = Math.round(basePrice * weekendHike);
    }
    
    // Get the final converted price (this is what shows as $164)
    // We need to extract the numeric value from formatPrice result
    const formattedPrice = formatPrice(displayPrice);
    // Extract just the number from the formatted price (e.g., "$164" -> 164)
    const finalDisplayPrice = parseFloat(formattedPrice.replace(/[^\d.]/g, ''));
    
    const days = parseInt(tourPackage.duration.split(" ")[0]);
    
    // Calculate all amounts using the final display price
    const subtotal = finalDisplayPrice * guests;
    const gstRate = 0.05;
    const gstAmount = Math.round(subtotal * gstRate);
    const finalTotal = subtotal + gstAmount;
    
    // For WhatsApp (always in INR)
    const baseRateINR = currency.code !== 'INR' ? displayPrice : basePrice;
    const subtotalINR = baseRateINR * guests;
    const gstAmountINR = Math.round(subtotalINR * gstRate);
    const finalTotalINR = subtotalINR + gstAmountINR;
    
    return {
      basePrice: finalDisplayPrice,
      subtotal: subtotal,
      gstAmount: gstAmount,
      finalTotal: finalTotal,
      gstRate: gstRate * 100,
      days,
      isWeekend,
      rawSubtotal: subtotalINR, // for WhatsApp message in INR
      rawGstAmount: gstAmountINR,
      rawTotal: finalTotalINR
    };
  };

  const pricing = calculatePricing();

  const handlePayAndConfirm = () => {
    if (!selectedDate || !guestDetails.name || !guestDetails.email || !guestDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create WhatsApp message for availability inquiry
    const whatsappMessage = `Tour Package Availability Inquiry - XTSY Travellers Hostel & XTSY Luxury

*Package Details:*
Package: ${tourPackage.title}
Duration: ${tourPackage.duration} (${selectedDate} to ${endDate})
Difficulty: ${tourPackage.difficulty}
Category: ${tourPackage.category}

*Guest Details:*
Name: ${guestDetails.name}
Email: ${guestDetails.email}
Phone: ${guestDetails.phone}
Number of Guests: ${guests}
${guestDetails.emergencyContact ? `Emergency Contact: ${guestDetails.emergencyContact}` : ''}

*Booking Details:*
Preferred Start Date: ${selectedDate}
End Date: ${endDate}
Total Guests: ${guests}

*Package Highlights:*
${tourPackage.highlights.map(highlight => `• ${highlight}`).join('\n')}

Please check availability for these dates and share pricing details for this exclusive tour package.`;

    // Redirect to WhatsApp
    const whatsappURL = `https://wa.me/918837317070?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappURL, '_blank');

    toast({
      title: "Redirecting to WhatsApp",
      description: "Please check availability via WhatsApp",
    });

    handleClose();
  };

  const selectedImage = getRelevantImage();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {tourPackage.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6">
          {/* Large Cover Image */}
          <div className="w-full">
            <div className="relative">
              <OptimizedLazyImage
                src={selectedImage}
                alt={tourPackage.title}
                className="w-full h-80 lg:h-96 object-cover rounded-lg"
                threshold={0.1}
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 text-black">
                  {tourPackage.category}
                </Badge>
              </div>
              {/* Price tag removed as requested */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{tourPackage.rating}</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Package Details */}
            <div className="space-y-6">
              <div>
              <p className="text-gray-600 mb-4">{tourPackage.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-sm text-gray-600">{tourPackage.duration}</p>
                </div>
                <div className="text-center">
                  <Users className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-sm text-gray-600">{tourPackage.difficulty}</p>
                </div>
                <div className="text-center">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-sm text-gray-600">{tourPackage.bestSeason}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Package Highlights:</h4>
                <div className="space-y-1">
                  {tourPackage.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      <span className="text-sm text-gray-600">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary Highlights Section */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Itinerary Highlights:</h4>
                {isLoadingItinerary ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-2 text-sm text-gray-600">Loading itinerary...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {itineraryHighlights.map((item) => (
                      <Card key={item.id} className="p-4 border border-gray-200">
                        <div className="space-y-2">
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm">{item.title}</h5>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                      </Card>
                    ))}
                    
                    {/* Single Pricing Tile at Bottom */}
                    <Card className="bg-orange-50 border-orange-200 mt-6">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 text-center">Package Pricing</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center bg-white rounded-lg p-3 border border-orange-100">
                            <p className="text-xs text-gray-500 mb-1">Per Person</p>
                            <p className="font-bold text-lg text-orange-600">{itineraryHighlights[0]?.pricing.perPerson}</p>
                          </div>
                          <div className="text-center bg-white rounded-lg p-3 border border-orange-100">
                            <p className="text-xs text-gray-500 mb-1">Group of 4</p>
                            <p className="font-bold text-lg text-orange-600">{itineraryHighlights[0]?.pricing.group4}</p>
                          </div>
                          <div className="text-center bg-white rounded-lg p-3 border border-orange-100">
                            <p className="text-xs text-gray-500 mb-1">Group of 10</p>
                            <p className="font-bold text-lg text-orange-600">{itineraryHighlights[0]?.pricing.group10}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 text-center mt-3">
                          *Pricing sourced from international travel platforms
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
            </div>

            {/* Booking Form */}
            <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Book This Journey</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center font-medium">{guests}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuests(guests + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="date">Preferred Start Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-2"
                  />
                </div>

                {selectedDate && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium">{endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Days:</span>
                        <span className="font-medium">{parseInt(tourPackage.duration.split(" ")[0])} days</span>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Lead Guest Details</h4>
                  
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={guestDetails.name}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={guestDetails.phone}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input
                      id="emergency"
                      value={guestDetails.emergencyContact}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      placeholder="Emergency contact number"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Pricing Summary removed for exclusive packages */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Exclusive Tour Package</h3>
                <p className="text-gray-600 text-sm">
                  This is an exclusive tour experience. Contact us to check availability and get personalized pricing.
                </p>
                
                <Button 
                  onClick={handlePayAndConfirm}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3"
                >
                  Check for Availability
                </Button>
              </div>
            </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TourPackageModal;
