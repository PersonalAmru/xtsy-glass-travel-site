/**
 * CampsiteBookingFlow — /book/campsite
 * Lightweight enquiry-driven booking flow for XTSY Adventure Campsite (Dawki).
 * NOT a room-based flow — it's package-based: ₹800 (camping) or ₹1,000 (camping + breakfast).
 */

import { memo, useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "@/lib/router-compat";
import { motion } from "framer-motion";
import { addDays, differenceInDays, format, parseISO } from "date-fns";
import {
  Tent, Coffee, Users, Calendar, MapPin, Check, ChevronLeft,
  Phone, MessageCircle, Sparkles, Loader2,
} from "lucide-react";
import { toast } from "sonner";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { bookingPageSource } from "@/utils/privacyCompliantWhatsApp";
import { DAWKI_CAMPING_IMAGES, getPropertyById } from "@/data/properties";

const PACKAGES = [
  {
    id: "camping-breakfast",
    title: "Camping + Breakfast",
    price: 1000,
    icon: Coffee,
    highlight: true,
    perks: ["Riverside tent pitch", "Hot Indian breakfast", "Welcome chai", "Bonfire access (1 hr)"],
  },
  {
    id: "camping-only",
    title: "Only Camping",
    price: 800,
    icon: Tent,
    highlight: false,
    perks: ["Riverside tent pitch", "Welcome chai", "Shared washrooms"],
  },
] as const;

type PackageId = typeof PACKAGES[number]["id"];
type Step = "package" | "details" | "confirmation";

const WHATSAPP = "https://wa.me/918837317070";

const CampsiteBookingFlow = memo(() => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const property = getPropertyById("xtsy-adventure-campsite-dawki");

  const [step, setStep] = useState<Step>("package");
  const [packageId, setPackageId] = useState<PackageId>("camping-breakfast");
  const [guests, setGuests] = useState<number>(() => Math.max(1, parseInt(searchParams.get("guests") || "2") || 2));
  const [checkIn, setCheckIn] = useState<Date | undefined>(() => {
    const v = searchParams.get("checkIn");
    return v ? parseISO(v) : undefined;
  });
  const [checkOut, setCheckOut] = useState<Date | undefined>(() => {
    const v = searchParams.get("checkOut");
    return v ? parseISO(v) : undefined;
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [enquiryId, setEnquiryId] = useState("");

  const selectedPkg = useMemo(() => PACKAGES.find(p => p.id === packageId)!, [packageId]);

  const nights = useMemo(() => {
    if (checkIn && checkOut) return Math.max(0, differenceInDays(checkOut, checkIn));
    return 0;
  }, [checkIn, checkOut]);

  const total = useMemo(() => selectedPkg.price * guests * nights, [selectedPkg, guests, nights]);

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  /** Why the dates can't be used yet, or null when they're fine. */
  const dateProblem = !checkIn || !checkOut
    ? "Pick your check-in and check-out dates"
    : nights < 1
      ? "Check-out must be at least one night after check-in"
      : null;

  const pickCheckIn = (v: string) => {
    const d = v ? parseISO(v) : undefined;
    setCheckIn(d);
    // Keep check-out at least one night after the new check-in.
    if (d && (!checkOut || differenceInDays(checkOut, d) < 1)) setCheckOut(addDays(d, 1));
  };

  const handleSubmit = async () => {
    if (dateProblem) {
      toast.error(dateProblem);
      setStep("package");
      return;
    }
    const missing = [!name.trim() && "name", !email.trim() && "email", !phone.trim() && "phone"].filter(Boolean);
    if (missing.length) {
      toast.error(`Please add your ${missing.join(", ")}`);
      return;
    }
    if (!checkIn || !checkOut) return;
    setSubmitting(true);
    try {
      const { data: saved, error } = await supabase.rpc('create_enquiry', {
        p_guest_name: name, p_email: email, p_phone: phone,
        p_check_in: format(checkIn, 'yyyy-MM-dd'), p_check_out: format(checkOut, 'yyyy-MM-dd'),
        p_room_type: 'campsite-dawki', p_room_name: `XTSY Adventure Campsite — ${selectedPkg.title}`,
        p_quantity: guests, p_nights: nights, p_rate_per_night: selectedPkg.price,
        p_subtotal: total, p_gst_rate: 0, p_gst_amount: 0, p_total_amount: total,
        p_special_requests: [`[WhatsApp] Page: ${bookingPageSource()}`, notes].filter(Boolean).join(' | '),
      });
      if (error || !saved?.[0]?.enquiry_id) throw error || new Error('Could not save enquiry');
      setEnquiryId(saved[0].enquiry_id);
      setStep("confirmation");
    } catch (err: any) {
      toast.error(err.message || "Could not submit enquiry. Please WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  };

  const seoTitle = "Book XTSY Adventure Campsite, Dawki | Riverside Camping";
  const seoDesc = `Book your Umngot riverside camping experience in Dawki, Meghalaya. Packages from ₹800/person/night. Bonfire, kayaking & starlit nights.`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta name="geo.region" content="IN-ML" />
        <meta name="geo.placename" content="Dawki, Meghalaya" />
        <meta property="og:locality" content="Dawki" />
        <meta property="og:region" content="Meghalaya" />
        <link rel="canonical" href="https://xtsy.one/book/campsite" />
      </Helmet>
      <SEOHead title={seoTitle} description={seoDesc} />

      <Header />

      <main className="pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Back */}
          {step !== "confirmation" && (
            <button
              onClick={() => step === "details" ? setStep("package") : navigate(-1)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1 bg-emerald-600/10 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2">
              <MapPin className="w-3 h-3" /> Dawki, Meghalaya
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">XTSY Adventure Campsite</h1>
            <p className="text-sm text-muted-foreground">Riverside camping on the Umngot</p>
          </div>

          {/* STEP 1: Package picker */}
          {step === "package" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">
                  Choose your package
                </Label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {PACKAGES.map((pkg) => {
                    const Icon = pkg.icon;
                    const selected = packageId === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setPackageId(pkg.id)}
                        className={cn(
                          "text-left p-5 rounded-2xl border-2 transition-all relative",
                          selected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border bg-card hover:border-border/80"
                        )}
                      >
                        {pkg.highlight && (
                          <div className="absolute -top-2 right-4 inline-flex items-center gap-1 bg-amber-700 text-white text-[12px] font-bold px-2 py-0.5 rounded-full">
                            <Sparkles className="w-2.5 h-2.5" /> POPULAR
                          </div>
                        )}
                        <Icon className={cn("w-6 h-6 mb-2", selected ? "text-primary" : "text-muted-foreground")} />
                        <p className="font-semibold">{pkg.title}</p>
                        <p className="text-2xl font-bold mt-1">
                          ₹{pkg.price}
                          <span className="text-xs font-normal text-muted-foreground"> /person/night</span>
                        </p>
                        <ul className="mt-3 space-y-1">
                          {pkg.perks.map((p) => (
                            <li key={p} className="text-xs text-muted-foreground flex items-start gap-1">
                              <Check className="w-3 h-3 mt-0.5 flex-shrink-0 text-emerald-600" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dates & guests */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="ci" className="text-xs uppercase tracking-wider text-muted-foreground">Check-in</Label>
                  <Input id="ci" type="date" value={checkIn ? format(checkIn, "yyyy-MM-dd") : ""}
                    min={format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) => pickCheckIn(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="co" className="text-xs uppercase tracking-wider text-muted-foreground">Check-out</Label>
                  <Input id="co" type="date" value={checkOut ? format(checkOut, "yyyy-MM-dd") : ""}
                    min={format(addDays(checkIn ?? new Date(), 1), "yyyy-MM-dd")}
                    onChange={(e) => setCheckOut(e.target.value ? parseISO(e.target.value) : undefined)} />
                </div>
                <div>
                  <Label htmlFor="g" className="text-xs uppercase tracking-wider text-muted-foreground">Guests</Label>
                  <Input id="g" type="number" min={1} max={80} value={guests}
                    onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))} />
                </div>
              </div>

              {/* Total preview */}
              <div className="bg-muted/40 rounded-xl p-4 flex items-center justify-between">
                <div>
                  {nights > 0 ? (
                    <>
                      <p className="text-xs text-muted-foreground">{guests} {guests === 1 ? "guest" : "guests"} × {nights} {nights === 1 ? "night" : "nights"} × ₹{selectedPkg.price.toLocaleString("en-IN")}</p>
                      <p className="text-xl font-bold">₹{total.toLocaleString("en-IN")}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground">{dateProblem ?? "Pick your dates"} to see your total</p>
                      <p className="text-xl font-bold">₹{selectedPkg.price.toLocaleString("en-IN")} <span className="text-xs font-normal text-muted-foreground">/person/night</span></p>
                    </>
                  )}
                </div>
                <Button size="lg" onClick={() => {
                  if (dateProblem) { toast.error(dateProblem); return; }
                  setStep("details");
                }}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Guest details */}
          {step === "details" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <Label htmlFor="n">Full name *</Label>
                <Input id="n" value={name} onChange={(e) => setName(e.target.value)} placeholder="As per ID" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="e">Email *</Label>
                  <Input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="p">Phone (WhatsApp) *</Label>
                  <Input id="p" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91..." />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Anything we should know?</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Bonfire, dinner, kayaking add-ons..." rows={3} />
              </div>

              <div className="bg-muted/40 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>{selectedPkg.title}</span>
                  <span className="font-semibold">₹{selectedPkg.price}/person/night</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{guests} {guests === 1 ? "guest" : "guests"} × {nights} {nights === 1 ? "night" : "nights"}</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-border mt-2 pt-2 flex items-center justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Button size="lg" className="w-full" disabled={submitting} onClick={handleSubmit}>
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Confirm Enquiry"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Our team will WhatsApp you within 30 mins to confirm.
              </p>
            </motion.div>
          )}

          {/* STEP 3: Confirmation */}
          {step === "confirmation" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Enquiry Received!</h2>
              <p className="text-muted-foreground mb-1">Reference: <span className="font-mono font-semibold">{enquiryId}</span></p>
              <p className="text-sm text-muted-foreground mb-6">
                Our team will WhatsApp you within 30 mins to confirm your camping dates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                 <a href={`${WHATSAPP}?text=${encodeURIComponent(`Namaste XTSY Team! I'd like to enquire about ${selectedPkg.title} at XTSY Adventure Campsite, Dawki. Enquiry ID: ${enquiryId}. Check-in: ${checkIn ? format(checkIn, 'yyyy-MM-dd') : ''}; check-out: ${checkOut ? format(checkOut, 'yyyy-MM-dd') : ''}; ${guests} guests × ${nights} nights at ₹${selectedPkg.price}/person/night. Estimated total ₹${total.toLocaleString('en-IN')}. Name: ${name}; email: ${email}; phone: ${phone}.${notes ? ` Requests: ${notes}.` : ''} Page: ${bookingPageSource()}. Please confirm availability.`)}`}
                  target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                    <MessageCircle className="w-4 h-4 mr-2" /> Open WhatsApp
                  </Button>
                </a>
                <Button size="lg" variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
});

CampsiteBookingFlow.displayName = "CampsiteBookingFlow";
export default CampsiteBookingFlow;
