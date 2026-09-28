import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-compat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Train, Bus, Car, Clock, MapPin } from "lucide-react";

export const howToReachFaqs = [
  {
    q: "What is the nearest airport to Shillong?",
    a: "Shillong Airport (SHL) at Umroi is 30 km away but has very limited flights. Almost all travellers fly into Guwahati Airport (GAU) in Assam, 100 km from Shillong, and drive 3 to 3.5 hours on NH6.",
  },
  {
    q: "Can I fly directly to Shillong?",
    a: "Only on a handful of ATR services from Kolkata and Guwahati into Shillong Umroi (SHL). Schedules change seasonally, so most visitors book into Guwahati (GAU), which has daily flights from Delhi, Mumbai, Bengaluru, Kolkata and Chennai.",
  },
  {
    q: "Is there a railway station in Shillong?",
    a: "No. Meghalaya has no passenger railway line to Shillong. The nearest railheads are Guwahati (GHY) and Kamakhya (KYQ), both about 100 km away, followed by a road transfer.",
  },
  {
    q: "How long does it take to reach Shillong from Guwahati Airport?",
    a: "About 3 to 3.5 hours by road for 100 km on NH6. Allow 4 to 4.5 hours in monsoon, on weekends, or if you stop at Umiam Lake on the way.",
  },
  {
    q: "What is the cheapest way to reach Shillong?",
    a: "A shared Sumo or Innova taxi from Paltan Bazaar in Guwahati costs Rs 400 to Rs 600 per seat. Government and private buses from Guwahati ISBT cost Rs 250 to Rs 550 and take 4 to 5 hours.",
  },
  {
    q: "Do I need a permit to enter Meghalaya?",
    a: "No Inner Line Permit is required for Meghalaya. Indian and foreign nationals can travel freely, though foreigners must be registered by their accommodation. Neighbouring Arunachal Pradesh and Nagaland do require permits.",
  },
  {
    q: "What time should I land in Guwahati?",
    a: "Land before 3 PM. Hill roads are unlit after dusk and shared taxis stop running around 5 PM. A morning or early-afternoon arrival gets you into Shillong comfortably before dark.",
  },
];

export default function HowToReachMeghalaya() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-10 sm:py-16">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link> / Travel Guide / How to Reach Meghalaya
        </nav>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          How to Reach Meghalaya &amp; Shillong: Flights, Trains &amp; Road Transfers
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Every realistic route into Meghalaya in 2026 — which airport to book, why there is no train to Shillong,
          what the road transfer actually costs, and how to time your arrival so you are not driving hill roads
          after dark.
        </p>

        <section className="mb-10 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <h2 className="text-xl font-bold mb-2">Quick answer</h2>
          <p className="text-foreground/90 leading-relaxed">
            Fly into <strong>Guwahati Airport (GAU)</strong> in Assam, then travel <strong>100 km / 3–3.5 hours</strong> by
            road on NH6 to Shillong. Shared taxi Rs 400–600 per seat, private cab Rs 2,800–4,200, bus Rs 250–550.
            Shillong&apos;s own airport (SHL, Umroi) has very few flights, and Meghalaya has no passenger railway —
            the nearest railheads are Guwahati (GHY) and Kamakhya (KYQ).
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card className="p-5">
            <Plane className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Guwahati (GAU)</h3>
            <p className="text-sm text-muted-foreground">Main gateway • 100 km • daily flights nationwide</p>
          </Card>
          <Card className="p-5">
            <Plane className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Shillong (SHL)</h3>
            <p className="text-sm text-muted-foreground">Umroi • 30 km • limited ATR services</p>
          </Card>
          <Card className="p-5">
            <Train className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Guwahati rail (GHY/KYQ)</h3>
            <p className="text-sm text-muted-foreground">Nearest railhead • then 3–3.5 hr by road</p>
          </Card>
          <Card className="p-5">
            <Bus className="w-6 h-6 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Road into Shillong</h3>
            <p className="text-sm text-muted-foreground">NH6 • shared taxi, cab, bus or helicopter</p>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. By air — Guwahati (GAU) is the practical gateway</h2>
          <p className="mb-3 text-foreground/90">
            Lokpriya Gopinath Bordoloi International Airport in Guwahati is the busiest airport in Northeast India and
            the airport nearly every Meghalaya itinerary starts from. It has daily direct flights from Delhi, Mumbai,
            Bengaluru, Kolkata, Chennai and Hyderabad, plus regional connections across the Northeast.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li><strong>Distance to Shillong:</strong> 100 km via NH6, about 3–3.5 hours.</li>
            <li><strong>Airport transfer options:</strong> pre-paid shared taxi counter outside arrivals (Rs 500–600 per seat), private cab (Rs 2,800–4,200), or a pre-booked XTSY transfer at a fixed rate.</li>
            <li><strong>Last practical departure:</strong> shared taxis thin out after 5 PM; private cabs run later but the drive is unlit.</li>
          </ul>
          <p className="mt-3 text-foreground/90">
            Full fares, pickup points and timings are broken down in our{" "}
            <Link className="text-primary underline" to="/travel-guide/guwahati-to-shillong-transport">
              Guwahati to Shillong transport guide
            </Link>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. Shillong Airport (SHL, Umroi) — useful but limited</h2>
          <p className="text-foreground/90">
            Shillong has its own airport at Umroi, 30 km from the city (about 45 minutes by road). It handles small
            ATR aircraft on a thin schedule, mainly from Kolkata and Guwahati, and services are frequently rescheduled
            in monsoon. Book it only if the timing genuinely fits — otherwise treat Guwahati as your gateway and keep
            SHL as a bonus option on the return leg.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. By train — there is no railway to Shillong</h2>
          <p className="mb-3 text-foreground/90">
            Meghalaya&apos;s hill terrain means no passenger line reaches Shillong. Rail travellers get off in Assam:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li><strong>Guwahati Junction (GHY):</strong> the main station, with trains from Delhi, Kolkata, Chennai and Bengaluru. Shared taxis to Shillong leave from Paltan Bazaar right outside.</li>
            <li><strong>Kamakhya (KYQ):</strong> 8 km from GHY, handles many long-distance services; take a local cab to Paltan Bazaar for onward taxis.</li>
            <li><strong>Mendipathar (MDPR):</strong> Meghalaya&apos;s only railway station, in the far Garo Hills — not useful for Shillong.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">4. By road from Guwahati — costs at a glance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-semibold">Option</th>
                  <th className="text-left p-3 font-semibold">Cost</th>
                  <th className="text-left p-3 font-semibold">Duration</th>
                  <th className="text-left p-3 font-semibold">Best for</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-t [&>tr]:border-border">
                <tr><td className="p-3">Shared Sumo / Innova</td><td className="p-3">Rs 400–600 / seat</td><td className="p-3">3–3.5 hr</td><td className="p-3">Solo budget travellers</td></tr>
                <tr><td className="p-3">Private cab (sedan)</td><td className="p-3">Rs 2,800–3,200</td><td className="p-3">3 hr</td><td className="p-3">Couples, late arrivals</td></tr>
                <tr><td className="p-3">Private cab (SUV)</td><td className="p-3">Rs 3,600–4,200</td><td className="p-3">3 hr</td><td className="p-3">Groups of 3–5 with luggage</td></tr>
                <tr><td className="p-3">Bus (MTC / private)</td><td className="p-3">Rs 250–550</td><td className="p-3">4–5 hr</td><td className="p-3">Cheapest, daytime only</td></tr>
                <tr><td className="p-3">Helicopter (MTC service)</td><td className="p-3">Rs 1,500–2,000</td><td className="p-3">~25 min</td><td className="p-3">Weather-dependent, limited seats</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Rates are 2026 indicative ranges and move with fuel prices and peak season demand.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">5. Onward travel inside Meghalaya</h2>
          <p className="mb-3 text-foreground/90">
            Shillong is the hub. Almost every Meghalaya itinerary uses it as a base for one or two nights before
            heading out:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-foreground/90">
            <li><Link className="text-primary underline" to="/dawki-umngot-river-guide">Dawki &amp; Umngot River</Link> — 82 km, ~2.5 hr</li>
            <li><Link className="text-primary underline" to="/cherrapunji-travel-guide">Cherrapunji (Sohra)</Link> — 54 km, ~1.5 hr</li>
            <li><Link className="text-primary underline" to="/meghalaya-villages">Mawlynnong &amp; Kongthong</Link> — 78–90 km, 2.5–3 hr</li>
            <li><Link className="text-primary underline" to="/umiam-lake-shillong">Umiam Lake</Link> — 15 km, on the drive in from Guwahati</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">6. Planning your arrival day</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <Clock className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Land before 3 PM</h3>
              <p className="text-sm text-muted-foreground">Shared taxis dry up by 5 PM and NH6 is unlit after dusk.</p>
            </Card>
            <Card className="p-5">
              <Car className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Pre-book late arrivals</h3>
              <p className="text-sm text-muted-foreground">If you land after 6 PM, arrange a private transfer instead of negotiating at the kerb.</p>
            </Card>
            <Card className="p-5">
              <MapPin className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Drop point matters</h3>
              <p className="text-sm text-muted-foreground">Most taxis stop at Police Bazaar. XTSY is in New Shillong Township (Mawdiangdiang Road) — take a cab from there, or ask the XTSY desk to arrange a direct transfer.</p>
            </Card>
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="text-2xl font-bold mb-2">Where to stay when you land</h2>
          <p className="text-foreground/90 mb-4">
            XTSY Travellers Hostel in Shillong has mixed dorm beds from <strong>Rs 389 per person per night</strong>,
            private rooms, TAB Bistro on site, and front-desk help with onward Dawki and Cherrapunji transport.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild><Link to="/book">Check availability</Link></Button>
            <Button asChild variant="outline"><Link to="/best-hostel-in-shillong">See dorms &amp; rooms</Link></Button>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {howToReachFaqs.map((f) => (
              <div key={f.q} className="border-l-4 border-primary/40 pl-4">
                <h3 className="font-semibold mb-1">{f.q}</h3>
                <p className="text-foreground/80 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Keep planning</h2>
          <ul className="grid gap-2 sm:grid-cols-2 text-primary">
            <li><Link className="underline" to="/best-time-to-visit-meghalaya">Best time to visit Meghalaya</Link></li>
            <li><Link className="underline" to="/travel-guide/meghalaya-for-international-tourists">Meghalaya guide for international tourists</Link></li>
            <li><Link className="underline" to="/3-day-meghalaya-itinerary">3-day Meghalaya itinerary</Link></li>
            <li><Link className="underline" to="/budget-trip-to-meghalaya">Budget trip to Meghalaya</Link></li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
