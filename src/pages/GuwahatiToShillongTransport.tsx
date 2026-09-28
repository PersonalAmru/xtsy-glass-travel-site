import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link } from "@/lib/router-compat";
import { Card } from "@/components/ui/card";
import { Bus, Car, Users, Plane, ArrowRight } from "lucide-react";

const CANONICAL = "https://xtsy.one/travel-guide/guwahati-to-shillong-transport";

const faqs = [
  { q: "How much does a shared taxi from Guwahati to Shillong cost?", a: "Shared Sumo/Innova taxis from Paltan Bazaar and Guwahati Airport (GAU) charge ₹400–₹600 per seat. Full cab hire ranges from ₹2,800 to ₹4,200 one-way depending on vehicle." },
  { q: "How long does the drive from Guwahati to Shillong take?", a: "The 100 km route on NH6 takes about 3 to 3.5 hours in normal traffic, and up to 4.5 hours during monsoon or on weekends." },
  { q: "Are there buses from Guwahati to Shillong?", a: "Yes. Meghalaya Transport Corporation (MTC) and private operators run AC and non-AC buses from Guwahati ISBT to Shillong Police Bazaar. Fares are ₹250–₹550. Buses take 4–5 hours." },
  { q: "Where do shared taxis drop passengers in Shillong?", a: "Most shared taxis drop at Police Bazaar or Khyndailad. Pre-book a private cab from there to XTSY on Mawdiangdiang Road, New Shillong Township, or book an XTSY transfer from Guwahati." },
  { q: "Is it safe to travel from Guwahati Airport to Shillong at night?", a: "Roads are safe but poorly lit after 8 PM. We recommend arriving before dusk. If your flight lands late, pre-book an XTSY airport transfer instead of a shared taxi." },
  { q: "Can I book an airport pickup with XTSY?", a: "Yes — XTSY guests can pre-book a private cab from Guwahati Airport (GAU) to the hostel at fixed rates. Message us on WhatsApp after booking your room." },
];

export default function GuwahatiToShillongTransport() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "How to Reach Shillong from Guwahati: Shared Taxis, Cabs & Buses (2026)",
      description: "Complete transport guide from Guwahati Airport & ISBT to Shillong — shared taxi rates, cab fares, bus timings, travel duration, and pickup points.",
      author: { "@type": "Organization", name: "XTSY Travel" },
      publisher: { "@type": "Organization", name: "XTSY", logo: { "@type": "ImageObject", url: "https://xtsy.one/xtsy-logo.png" } },
      datePublished: "2026-07-21",
      dateModified: "2026-07-21",
      mainEntityOfPage: CANONICAL,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://xtsy.one/" },
        { "@type": "ListItem", position: 2, name: "Travel Guide", item: "https://xtsy.one/travel-guide/guwahati-to-shillong-transport" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Guwahati to Shillong: Shared Taxi, Cab & Bus Guide 2026"
        description="How to reach Shillong from Guwahati Airport (GAU) & ISBT — shared taxi rates from ₹400, private cabs, bus timings, travel time & pickup points. Budget traveler guide by XTSY."
        keywords="guwahati to shillong, shared taxi guwahati shillong, guwahati airport to shillong, guwahati shillong bus, how to reach shillong"
        canonicalUrl={CANONICAL}
        ogType="article"
        structuredData={structuredData}
      />
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-10 sm:py-16">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link> / Travel Guide / Guwahati → Shillong Transport
        </nav>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          How to Reach Shillong from Guwahati: Shared Taxis, Cabs & Bus Options
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          A budget traveler's logistics guide — current 2026 rates, exact pickup points at Guwahati Airport (GAU) and ISBT, travel durations, and the smartest option depending on your arrival time and group size.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Quick answer</h2>
          <p className="text-foreground/90 leading-relaxed">
            Guwahati (GAU) to Shillong is <strong>100 km, roughly 3–3.5 hours</strong> on NH6. Cheapest option: shared Sumo/Innova taxi from Paltan Bazaar (~₹400/seat). Fastest & most comfortable: private cab from the airport (₹2,800–₹4,200). Buses run from ISBT if you have 4–5 hours to spare.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3 mb-12">
          <Card className="p-5">
            <Users className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Shared Taxi</h3>
            <p className="text-sm text-muted-foreground">₹400–₹600 / seat • 3–3.5 hr • Sumo / Innova</p>
          </Card>
          <Card className="p-5">
            <Car className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Private Cab</h3>
            <p className="text-sm text-muted-foreground">₹2,800–₹4,200 • 3 hr • Sedan / SUV</p>
          </Card>
          <Card className="p-5">
            <Bus className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Bus (MTC / Private)</h3>
            <p className="text-sm text-muted-foreground">₹250–₹550 • 4–5 hr • AC / non-AC</p>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Shared taxis (cheapest & most popular)</h2>
          <p className="mb-3">Sumo, Innova and Xylo shared taxis are the backbone of Guwahati–Shillong transport. They leave when full (7–10 passengers), no fixed timetable.</p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li><strong>Paltan Bazaar (Guwahati Railway Station):</strong> The busiest pickup. Departures every 20–30 minutes, 6 AM – 6 PM. Fare ₹400–₹450/seat.</li>
            <li><strong>Guwahati Airport (GAU):</strong> Pre-paid counter outside arrivals. ₹500–₹600/seat because of the airport surcharge. Last shared taxi ~5 PM.</li>
            <li><strong>ISBT Guwahati:</strong> Fewer options, mostly non-AC Sumos, ₹350–₹400/seat.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. Private cabs & airport transfers</h2>
          <p className="mb-3">Best choice if you land late, travel with luggage, or are a group of 3+.</p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>Sedan (Dzire, Etios): ₹2,800–₹3,200 one-way</li>
            <li>SUV (Innova, Ertiga): ₹3,600–₹4,200 one-way</li>
            <li>Tempo Traveller (10–12 pax): ₹6,500–₹7,500 one-way</li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">XTSY guests can pre-book a fixed-rate GAU → hostel transfer at check-in — no surge, no negotiation.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. Buses from Guwahati ISBT</h2>
          <p className="mb-3">MTC (Meghalaya Transport Corporation) and private operators like Blue Hill and Network run daily buses.</p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li>MTC AC bus: 7 AM, 2 PM — ₹450–₹550</li>
            <li>Non-AC deluxe: hourly 6 AM – 4 PM — ₹250–₹300</li>
            <li>Drop point: Shillong Police Bazaar / MTC bus stand</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">4. From Shillong drop-off to XTSY</h2>
          <p>From Police Bazaar, take a cab to XTSY on Mawdiangdiang Road, New Shillong Township (near NIFT and IIM Shillong). If you booked an XTSY airport transfer, the driver takes you door-to-door.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Continuing to Dawki, Cherrapunji or the villages?</h2>
          <p>Most travelers spend 1–2 nights in Shillong first, then head to <Link className="text-primary underline" to="/dawki-umngot-river-guide">Dawki</Link>, <Link className="text-primary underline" to="/cherrapunji-travel-guide">Cherrapunji</Link>, or <Link className="text-primary underline" to="/meghalaya-villages">Mawlynnong & Kongthong</Link>. Book onward transport at the hostel front desk — better rates than street cabs.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">FAQs</h2>
          <div className="space-y-4">
            {faqs.map(f => (
              <div key={f.q} className="border-l-4 border-primary/40 pl-4">
                <h3 className="font-semibold mb-1">{f.q}</h3>
                <p className="text-foreground/90">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-gradient-to-br from-primary/10 to-rose-500/10 p-6 sm:p-8 border border-primary/20">
          <div className="flex items-start gap-3 mb-3">
            <Plane className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-1">Book your Shillong stay with airport transfer</h2>
              <p className="text-muted-foreground">Dorms from ₹389/night. Add a pre-booked GAU pickup at checkout — fixed price, no haggling.</p>
            </div>
          </div>
          <Link to="/book" className="inline-flex items-center gap-2 mt-2 bg-primary text-primary-foreground px-5 py-3 rounded-lg font-semibold hover:opacity-90">
            Book Hostel Online <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
