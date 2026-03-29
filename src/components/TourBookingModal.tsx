import React, { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon, Users, MapPin, Clock, Mountain, ChevronLeft, ChevronRight,
  User, Phone, Mail, MessageSquare, CheckCircle2, Loader2, Minus, Plus, Sparkles
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { createTourEnquiry } from "@/services/tourBookingService";
import { toast } from "sonner";

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

interface TourBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourPackage: TourPackage | null;
}

type GroupType = "solo" | "couple" | "group4" | "group6";

const GROUP_CONFIG: Record<GroupType, { label: string; discount: number; min: number; max: number }> = {
  solo: { label: "Solo", discount: 0, min: 1, max: 1 },
  couple: { label: "Couple", discount: 0, min: 2, max: 2 },
  group4: { label: "Group of 4", discount: 0.10, min: 3, max: 4 },
  group6: { label: "Group of 6", discount: 0.15, min: 5, max: 6 },
};

const TourBookingModal: React.FC<TourBookingModalProps> = ({ isOpen, onClose, tourPackage }) => {
  const { formatPrice } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [enquiryId, setEnquiryId] = useState("");

  // Step 1 state
  const [groupType, setGroupType] = useState<GroupType>("solo");
  const [travellers, setTravellers] = useState(1);
  const [preferredDate, setPreferredDate] = useState<Date>();

  // Step 2 state
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [city, setCity] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const resetForm = useCallback(() => {
    setStep(1);
    setGroupType("solo");
    setTravellers(1);
    setPreferredDate(undefined);
    setGuestName("");
    setEmail("");
    setWhatsappNumber("");
    setCity("");
    setSpecialRequests("");
    setIsSuccess(false);
    setEnquiryId("");
  }, []);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!tourPackage) return null;

  const basePrice = parseInt(tourPackage.price.replace(/[^\d]/g, ''));
  const config = GROUP_CONFIG[groupType];
  const perPersonPrice = Math.round(basePrice * (1 - config.discount));
  const totalAmount = perPersonPrice * travellers;

  const handleGroupChange = (type: GroupType) => {
    setGroupType(type);
    const c = GROUP_CONFIG[type];
    setTravellers(c.min);
  };

  const canProceedStep1 = preferredDate && travellers > 0;
  const canProceedStep2 = guestName.trim() && email.trim() && whatsappNumber.trim();

  const handleSubmit = async () => {
    if (!canProceedStep2 || !preferredDate) return;
    setIsSubmitting(true);

    const result = await createTourEnquiry({
      packageTitle: tourPackage.title,
      packageDuration: tourPackage.duration,
      packageDifficulty: tourPackage.difficulty,
      packageCategory: tourPackage.category,
      packageLocation: tourPackage.location,
      travellers,
      preferredDate: format(preferredDate, 'yyyy-MM-dd'),
      groupType,
      perPersonPrice,
      totalAmount,
      guestName: guestName.trim(),
      email: email.trim(),
      whatsappNumber: whatsappNumber.trim(),
      city: city.trim() || undefined,
      specialRequests: specialRequests.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setEnquiryId(result.enquiryId || '');
      setIsSuccess(true);
      setStep(3);
      toast.success("Tour enquiry submitted successfully!");
    } else {
      toast.error(result.error || "Failed to submit. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0 border-border">
        <DialogHeader className="p-5 pb-0">
          <DialogTitle className="text-lg font-bold text-foreground">
            {isSuccess ? "Booking Received!" : `Book: ${tourPackage.title}`}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isSuccess
              ? "Our travel curator will reach out within 2 hours."
              : `${tourPackage.duration} • ${tourPackage.location}`}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        {!isSuccess && (
          <div className="flex items-center gap-2 px-5 pt-3">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                  step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  step >= s ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s === 1 ? "Trip Details" : "Your Info"}
                </span>
                {s < 2 && <div className={cn("flex-1 h-0.5 rounded", step > s ? "bg-primary" : "bg-muted")} />}
              </div>
            ))}
          </div>
        )}

        <div className="p-5 space-y-5">
          {/* ── Step 1: Trip Details ── */}
          {step === 1 && (
            <>
              {/* Package Summary Card */}
              <div className="bg-muted/50 rounded-xl p-4 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground text-sm">{tourPackage.title}</h4>
                  <Badge variant="outline" className="text-xs capitalize">{tourPackage.category}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{tourPackage.duration}</span>
                  <span className="flex items-center gap-1"><Mountain className="w-3 h-3" />{tourPackage.difficulty}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{tourPackage.location}</span>
                </div>
              </div>

              {/* Group Type */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Group Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(GROUP_CONFIG) as [GroupType, typeof GROUP_CONFIG[GroupType]][]).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => handleGroupChange(key)}
                      className={cn(
                        "px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left",
                        groupType === key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      <span className="block">{val.label}</span>
                      {val.discount > 0 && (
                        <span className="text-[10px] text-emerald-600 font-bold">Save {val.discount * 100}%</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Traveller Count */}
              {(groupType === "group4" || groupType === "group6") && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">Number of Travellers</Label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTravellers(Math.max(config.min, travellers - 1))}
                      className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-bold text-foreground w-8 text-center">{travellers}</span>
                    <button
                      onClick={() => setTravellers(Math.min(config.max, travellers + 1))}
                      className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-muted-foreground">({config.min}–{config.max} travellers)</span>
                  </div>
                </div>
              )}

              {/* Preferred Date */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Preferred Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !preferredDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {preferredDate ? format(preferredDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={preferredDate}
                      onSelect={setPreferredDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Pricing Summary */}
              <div className="bg-gradient-to-br from-primary/5 to-muted/30 rounded-xl p-4 border border-primary/20 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Per person</span>
                  <span className="font-semibold text-foreground">{formatPrice(perPersonPrice)}</span>
                </div>
                {config.discount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-600">Group discount ({config.discount * 100}%)</span>
                    <span className="text-emerald-600 font-medium">-{formatPrice(Math.round(basePrice * config.discount))}/pp</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Travellers</span>
                  <span className="text-foreground">×{travellers}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-primary text-lg">{formatPrice(totalAmount)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Excludes transport to base city • GST as applicable
                </p>
              </div>

              {/* Next Button */}
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="w-full py-5 text-base font-bold"
              >
                Continue to Guest Details
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </>
          )}

          {/* ── Step 2: Guest Details ── */}
          {step === 2 && (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tour-guest-name" className="text-sm flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-primary" /> Full Name *
                  </Label>
                  <Input
                    id="tour-guest-name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tour-email" className="text-sm flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" /> Email *
                  </Label>
                  <Input
                    id="tour-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tour-whatsapp" className="text-sm flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" /> WhatsApp Number *
                  </Label>
                  <Input
                    id="tour-whatsapp"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+91 9876543210"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tour-city" className="text-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> Current City
                  </Label>
                  <Input
                    id="tour-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tour-requests" className="text-sm flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" /> Special Requests
                  </Label>
                  <Textarea
                    id="tour-requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Dietary needs, pickup preferences, fitness concerns..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Mini Summary */}
              <div className="bg-muted/50 rounded-lg p-3 border border-border text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{tourPackage.title}</span>
                  <span className="font-semibold text-foreground">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{travellers} traveller{travellers > 1 ? 's' : ''} • {preferredDate ? format(preferredDate, 'dd MMM yyyy') : ''}</span>
                  <span>{formatPrice(perPersonPrice)}/pp</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <ChevronLeft className="mr-1 w-4 h-4" /> Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceedStep2 || isSubmitting}
                  className="flex-[2] py-5 text-base font-bold"
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Submitting...</>
                  ) : (
                    <>Submit Enquiry</>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* ── Step 3: Success ── */}
          {step === 3 && isSuccess && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Tour Enquiry Received!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Reference: <span className="font-mono font-semibold text-primary">{enquiryId}</span>
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2 border border-border">
                <p className="text-sm font-semibold text-foreground">{tourPackage.title}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{travellers} traveller{travellers > 1 ? 's' : ''} • {preferredDate ? format(preferredDate, 'dd MMM yyyy') : ''}</p>
                  <p>Total: <span className="font-bold text-foreground">{formatPrice(totalAmount)}</span></p>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 inline mr-1 text-primary" />
                  Our travel curator will contact you on WhatsApp within 2 hours to finalize your itinerary and confirm availability.
                </p>
              </div>

              <Button onClick={handleClose} variant="outline" className="w-full">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TourBookingModal;
