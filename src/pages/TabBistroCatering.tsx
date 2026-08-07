import { memo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "@/lib/router-compat";
import {
  PartyPopper, Loader2, Send, Users, CalendarDays, Utensils, Briefcase, Heart,
  Cake, Soup, CheckCircle2, Phone,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createCateringEnquiry } from "@/services/cateringService";
import { cdn } from "@/data/cdnImages";

const HERO_IMG = cdn("xtsy/TAB Bistro by XTSY 1.jpeg");

const EVENT_TYPES = [
  "Wedding",
  "Corporate Event / Offsite",
  "Conference / Seminar",
  "Birthday / Private Party",
  "Bulk / Party Order",
  "Group Dining",
  "Other",
];

const services = [
  { title: "Wedding Catering", icon: <Heart className="w-5 h-5" />, desc: "Custom multi-cuisine wedding menus, live BBQ & dessert counters." },
  { title: "Corporate Catering", icon: <Briefcase className="w-5 h-5" />, desc: "Offsites, conferences & office parties with buffets and meal boxes." },
  { title: "Birthday & Parties", icon: <Cake className="w-5 h-5" />, desc: "Themed spreads, cakes and beverages for private celebrations." },
  { title: "Bulk Food Orders", icon: <Soup className="w-5 h-5" />, desc: "Large-volume Indian, Chinese, Continental & Northeast platters." },
];

const minimums = [
  { label: "Bulk / Party Orders", value: "From 15 plates", note: "Mixed cuisines, 24 hrs notice" },
  { label: "Corporate Catering", value: "From 25 guests", note: "Buffet or packed meal boxes" },
  { label: "Wedding & Events", value: "From 50 guests", note: "Custom menus & live counters" },
];

const corporateFaqs = [
  {
    q: "What is the minimum order for catering or bulk food in Shillong?",
    a: "Bulk and party orders start from 15 plates (24 hours' notice). Corporate catering starts from 25 guests, and wedding/event catering from 50 guests. Share your headcount for an exact quote.",
  },
  {
    q: "How much notice do you need for corporate catering?",
    a: "For corporate events and conferences we recommend 48–72 hours' notice so we can plan menus, live counters and logistics. Smaller bulk orders can often be arranged with 24 hours' notice.",
  },
  {
    q: "Do you provide GST invoices for corporate bookings?",
    a: "Yes. TAB Bistro by XTSY provides proper GST invoices for all corporate and bulk orders (GSTIN 17QSKPK1714H1ZE), making reimbursement and accounting simple.",
  },
  {
    q: "Can you cater multiple cuisines at one event?",
    a: "Absolutely. We specialise in multi-cuisine spreads — North Indian, Tandoor, Indo-Chinese, Thai, Continental, Italian, seafood and Northeast dishes can all be combined into a single buffet or menu.",
  },
  {
    q: "Do you deliver catering across Shillong and Meghalaya?",
    a: "Yes, we cater across Shillong and travel to nearby Meghalaya venues for weddings, offsites and destination events. Travel and setup are quoted based on location and headcount.",
  },
  {
    q: "Can you handle on-site live counters and BBQ stations?",
    a: "Yes — live BBQ stations, tandoor counters, mocktail bars and dessert counters are available for weddings and large corporate events.",
  },
];

const TabBistroCatering = memo(() => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    eventType: EVENT_TYPES[0],
    eventDate: "",
    guestCount: "",
    cuisinePreferences: "",
    message: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || form.phone.trim().length < 5) {
      toast({ title: "Please add your name and a valid phone number", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const res = await createCateringEnquiry({
      fullName: form.fullName,
      phone: form.phone,
      email: form.email || undefined,
      eventType: form.eventType,
      eventDate: form.eventDate || undefined,
      guestCount: form.guestCount ? parseInt(form.guestCount, 10) : undefined,
      cuisinePreferences: form.cuisinePreferences || undefined,
      message: form.message || undefined,
    });
    setSubmitting(false);
    if (res.success) {
      setDone(true);
      toast({ title: "Enquiry received! 🎉", description: "Our catering team will reach out shortly." });
    } else {
      toast({ title: "Could not send enquiry", description: res.error, variant: "destructive" });
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: corporateFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "TAB Bistro by XTSY — Catering & Bulk Orders",
    url: "https://xtsy.one/tab-bistro/catering",
    telephone: "+918837317070",
    servesCuisine: ["North Indian", "Indo-Chinese", "Thai", "Continental", "Italian", "Seafood", "Northeast Indian"],
    areaServed: ["Shillong", "Meghalaya"],
    address: { "@type": "PostalAddress", addressLocality: "Shillong", addressRegion: "Meghalaya", addressCountry: "IN" },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Catering & Bulk Food Orders in Shillong | TAB Bistro by XTSY"
        description="Wedding, corporate & event catering plus bulk and party food orders in Shillong. Multi-cuisine buffets, live counters & meal boxes by TAB Bistro by XTSY. Get a quote."
        keywords="catering shillong, wedding catering shillong, corporate catering shillong, event catering shillong, bulk food order shillong, party order shillong, office catering shillong, conference catering shillong, multi cuisine catering shillong, TAB Bistro catering"
        canonicalUrl="https://xtsy.one/tab-bistro/catering"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <Header />

      {/* Hero */}
      <section className="bg-background pt-20 pb-12 sm:pt-28 sm:pb-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-amber-400 font-medium text-xs tracking-[0.2em] uppercase mb-4">
            <PartyPopper className="w-4 h-4" /> Catering & Bulk Orders
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 font-playfair leading-tight">
            Catering & Bulk Food Orders in Shillong
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Multi-cuisine catering for weddings, corporate events, parties and bulk orders across Shillong
            and Meghalaya — by <Link to="/tab-bistro" className="text-amber-400 underline">TAB Bistro by XTSY</Link>.
          </p>
          <div className="relative max-w-3xl mx-auto mt-8 rounded-2xl overflow-hidden border border-border shadow-lg aspect-[16/9]">
            <img
              src={HERO_IMG}
              alt="TAB Bistro by XTSY — multi-cuisine catering and forest dining in Shillong"
              className="w-full h-full object-cover"
              fetchPriority="high"
              width={1280}
              height={720}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      </section>


      <main className="max-w-5xl mx-auto px-4 sm:px-8 pb-20 space-y-16">
        {/* Services */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-6">What We Cater</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s) => (
              <div key={s.title} className="p-5 rounded-xl bg-card border border-border">
                <span className="text-amber-400 mb-2 block">{s.icon}</span>
                <h3 className="text-base font-semibold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Minimum order details */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-6">Minimum Order Details</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {minimums.map((m) => (
              <div key={m.label} className="p-5 rounded-xl bg-card border border-border">
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold text-amber-400 mt-1">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.note}</p>
              </div>
            ))}
          </div>
          <ul className="mt-5 space-y-2">
            {[
              "Multi-cuisine buffets, live counters, BBQ & dessert stations available",
              "GST invoices provided for all corporate & bulk orders (GSTIN 17QSKPK1714H1ZE)",
              "Veg, non-veg and Jain-friendly menus on request",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </section>

        {/* Enquiry form */}
        <section id="enquiry">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-2">Request a Catering Quote</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Share your event details and our team will get back with a tailored menu and quote.
          </p>

          {done ? (
            <div className="rounded-xl bg-card border border-emerald-500/30 p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-foreground mb-2">Thank you!</h3>
              <p className="text-muted-foreground text-sm mb-5">
                Your catering enquiry has been received. We'll contact you shortly. For anything urgent,
                reach us directly on WhatsApp.
              </p>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
                onClick={() => window.open("https://wa.me/918837317070?text=Hi,%20I%20just%20submitted%20a%20catering%20enquiry%20for%20TAB%20Bistro.", "_blank")}
              >
                <Phone className="w-4 h-4 mr-2" /> Chat on WhatsApp
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl bg-card border border-border p-5 sm:p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="c-name">Full name *</Label>
                  <Input id="c-name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} maxLength={120} required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="c-phone">Phone / WhatsApp *</Label>
                  <Input id="c-phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} maxLength={20} required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="c-email">Email</Label>
                  <Input id="c-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="c-type">Event type</Label>
                  <select id="c-type" value={form.eventType} onChange={(e) => set("eventType", e.target.value)} className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="c-date"><CalendarDays className="w-3.5 h-3.5 inline mr-1 text-amber-400" />Event date</Label>
                  <Input id="c-date" type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="c-guests"><Users className="w-3.5 h-3.5 inline mr-1 text-amber-400" />Number of guests</Label>
                  <Input id="c-guests" type="number" min={1} value={form.guestCount} onChange={(e) => set("guestCount", e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="c-cuisine"><Utensils className="w-3.5 h-3.5 inline mr-1 text-amber-400" />Cuisine preferences</Label>
                <Input id="c-cuisine" value={form.cuisinePreferences} onChange={(e) => set("cuisinePreferences", e.target.value)} placeholder="e.g. North Indian + Chinese, veg-heavy" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="c-msg">Message / requirements</Label>
                <Textarea id="c-msg" rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} maxLength={2000} placeholder="Tell us about your event, budget, venue, dietary needs…" className="mt-1.5" />
              </div>
              <Button type="submit" disabled={submitting} className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                Send Catering Enquiry
              </Button>
            </form>
          )}
        </section>

        {/* Corporate FAQs */}
        <section id="corporate-faqs">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-6">Corporate & Catering FAQs</h2>
          <div className="space-y-3">
            {corporateFaqs.map((f) => (
              <details key={f.q} className="group rounded-xl bg-card border border-border p-5 hover:border-amber-500/30 transition-colors">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-base font-semibold text-foreground">
                  {f.q}
                  <span className="text-amber-400 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
});

TabBistroCatering.displayName = "TabBistroCatering";
export default TabBistroCatering;
