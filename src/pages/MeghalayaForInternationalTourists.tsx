import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-compat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, ShieldCheck, Smartphone, Wallet, Users, Car } from "lucide-react";

export const internationalFaqs = [
  {
    q: "Do foreign tourists need a permit for Meghalaya?",
    a: "No Inner Line Permit is needed for Meghalaya. Foreign nationals only need a valid Indian visa, and their hotel or hostel files a Form C registration on arrival. Arunachal Pradesh, Nagaland, Mizoram and Manipur do require a Protected Area or Inner Line Permit.",
  },
  {
    q: "Can I enter India on an e-Visa and travel to Meghalaya?",
    a: "Yes. The Indian e-Visa is valid for tourism in Meghalaya and can be used at designated airports including Guwahati, Kolkata and Delhi. Apply online at least 4 days before travel and carry a printed copy of the approved ETA.",
  },
  {
    q: "Which airport should international travellers fly into?",
    a: "Fly into Guwahati (GAU) via Delhi, Kolkata, Mumbai or Bengaluru. Guwahati is 100 km from Shillong, a 3 to 3.5 hour road transfer on NH6. Shillong Umroi (SHL) has only a handful of ATR flights.",
  },
  {
    q: "Is Meghalaya safe for solo female travellers?",
    a: "Meghalaya is among the safest states in India for solo travellers. Khasi society is matrilineal, English is widely spoken, and Shillong is comfortable to walk in during the day. Standard precautions apply after dark and on remote treks, where a local guide is recommended.",
  },
  {
    q: "Which SIM card works best in Meghalaya?",
    a: "Airtel and Jio have the widest coverage in Shillong, Cherrapunji and Dawki. Foreign visitors can buy a prepaid tourist SIM at Guwahati airport with a passport, visa copy and photo. Expect patchy data in Mawlynnong and the root bridge trails.",
  },
  {
    q: "How much cash should I carry?",
    a: "Cards and UPI work in Shillong hotels, hostels and cafes, but carry Rs 5,000 to Rs 10,000 in cash for taxis, village entry fees, boats at Dawki and rural homestays. ATMs are reliable in Shillong and scarce beyond Cherrapunji.",
  },
  {
    q: "How do I get from Guwahati airport to my Shillong hostel?",
    a: "Pre-booked private cabs cost Rs 3,000 to Rs 4,500 and take 3 to 3.5 hours. Shared Sumo taxis from Paltan Bazaar cost Rs 400 to Rs 600 per seat. Land before 3 PM so you are not on unlit hill roads after dark.",
  },
  {
    q: "What language is spoken in Shillong?",
    a: "Khasi is the local language, but English is an official language of Meghalaya and is spoken almost everywhere, including by taxi drivers and shopkeepers. Hindi is understood in most of Shillong.",
  },
];

export default function MeghalayaForInternationalTourists() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-10 sm:py-16">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link> / Travel Guide / Meghalaya for International Tourists
        </nav>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
          Meghalaya Travel Guide for International Tourists: Visas, Permits &amp; Arrival
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          What foreign visitors actually need to enter Meghalaya in 2026 — e-Visa rules, which Northeast states
          require permits, SIM cards and money, solo-traveller safety, and how to get from Guwahati airport to a
          bed in Shillong the same day.
        </p>

        <section className="mb-10 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <h2 className="text-xl font-bold mb-2">Quick answer</h2>
          <p className="text-foreground/90 leading-relaxed">
            International tourists need only a valid <strong>Indian e-Visa</strong> to visit Meghalaya — there is
            <strong> no Inner Line Permit</strong>. Fly into <strong>Guwahati (GAU)</strong>, transfer 100 km by road
            (3–3.5 hours) to Shillong, and have your accommodation file the routine Form C registration. English is
            widely spoken and Meghalaya is one of India's safest states for solo travellers.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Indian e-Visa basics</h2>
          <ul className="space-y-2 text-foreground/85 leading-relaxed list-disc pl-5">
            <li>Apply online for the <strong>e-Tourist Visa</strong> at least 4 days before departure; 30-day, 1-year and 5-year variants are issued.</li>
            <li>Valid for arrival at Guwahati, Kolkata, Delhi, Mumbai, Bengaluru and other designated airports.</li>
            <li>Carry a printed ETA, a passport valid 6 months beyond arrival, and proof of onward travel.</li>
            <li>Nationals of a few countries still require a regular visa from an Indian mission — check before booking flights.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. Permits across the seven Northeast states</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-muted/60">
                <tr>
                  <th className="text-left p-3">State</th>
                  <th className="text-left p-3">Foreign nationals</th>
                  <th className="text-left p-3">Indian nationals</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Meghalaya", "No permit — Form C registration by hotel", "No permit"],
                  ["Assam", "No permit", "No permit"],
                  ["Arunachal Pradesh", "Protected Area Permit (PAP)", "Inner Line Permit (ILP)"],
                  ["Nagaland", "Registration on arrival", "Inner Line Permit (ILP)"],
                  ["Mizoram", "Registration on arrival", "Inner Line Permit (ILP)"],
                  ["Manipur", "Protected Area Permit for some areas", "Inner Line Permit (ILP)"],
                  ["Tripura", "No permit", "No permit"],
                ].map(([s, f, i]) => (
                  <tr key={s} className="border-t border-border">
                    <td className="p-3 font-medium">{s}</td>
                    <td className="p-3 text-muted-foreground">{f}</td>
                    <td className="p-3 text-muted-foreground">{i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Permit rules change; confirm with the state tourism department before travel.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. Money, SIM cards &amp; connectivity</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <Wallet className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Cash and cards</h3>
              <p className="text-sm text-muted-foreground">Cards and UPI work in Shillong. Carry Rs 5,000–10,000 cash for taxis, boats and village fees.</p>
            </Card>
            <Card className="p-5">
              <Smartphone className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Tourist SIM</h3>
              <p className="text-sm text-muted-foreground">Buy an Airtel or Jio prepaid SIM at Guwahati airport with passport, visa and photo.</p>
            </Card>
            <Card className="p-5">
              <Plane className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Offline maps</h3>
              <p className="text-sm text-muted-foreground">Download Shillong, Cherrapunji and Dawki offline — data drops on root bridge trails.</p>
            </Card>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">4. Safety for solo and female travellers</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <ShieldCheck className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Matrilineal Khasi society</h3>
              <p className="text-sm text-muted-foreground">Women travel and work visibly across Meghalaya; harassment levels are low compared to most Indian states.</p>
            </Card>
            <Card className="p-5">
              <Users className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Use guides on remote treks</h3>
              <p className="text-sm text-muted-foreground">Double Decker root bridge, Laitlum and cave trails are best done with a local guide, especially in monsoon.</p>
            </Card>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">5. Guwahati airport to Shillong transfer</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <Car className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Private cab</h3>
              <p className="text-sm text-muted-foreground">Rs 3,000–4,500 · 3–3.5 hrs · door to door, best for late arrivals.</p>
            </Card>
            <Card className="p-5">
              <Car className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Shared Sumo</h3>
              <p className="text-sm text-muted-foreground">Rs 400–600 per seat from Paltan Bazaar · departs until roughly 5 PM.</p>
            </Card>
            <Card className="p-5">
              <Car className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Bus</h3>
              <p className="text-sm text-muted-foreground">Rs 250–550 from Guwahati ISBT · 4–5 hrs · cheapest option.</p>
            </Card>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Full breakdown in our <Link className="text-primary underline" to="/travel-guide/how-to-reach-meghalaya">how to reach Meghalaya guide</Link>.
          </p>
        </section>

        <section className="mb-10 rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="text-2xl font-bold mb-2">Where international travellers stay in Shillong</h2>
          <p className="text-foreground/90 mb-4">
            XTSY Travellers Hostel handles Form C registration for foreign guests, has mixed dorm beds from{" "}
            <strong>Rs 389 per person per night</strong>, private rooms, TAB Bistro on site, and a front desk that
            arranges Dawki and Cherrapunji transport.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild><Link to="/book">Check availability</Link></Button>
            <Button asChild variant="outline"><Link to="/best-hostel-in-shillong">See dorms &amp; rooms</Link></Button>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
          <div className="space-y-4">
            {internationalFaqs.map((f) => (
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
            <li><Link className="underline" to="/travel-guide/how-to-reach-meghalaya">How to reach Meghalaya &amp; Shillong</Link></li>
            <li><Link className="underline" to="/best-time-to-visit-meghalaya">Best time to visit Meghalaya</Link></li>
            <li><Link className="underline" to="/3-day-meghalaya-itinerary">3-day Meghalaya itinerary</Link></li>
            <li><Link className="underline" to="/meghalaya-tour-packages">Meghalaya tour packages</Link></li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
