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
              <img 
                src={tourPackage.image} 
                alt={tourPackage.title}
                className="w-full h-80 lg:h-96 object-cover rounded-lg"
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