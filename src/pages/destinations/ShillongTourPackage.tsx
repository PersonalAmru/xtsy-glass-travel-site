import { Link } from '@/lib/router-compat';
import { Helmet } from '@/lib/seo/helmet';
import PageFaqs from '@/components/seo/PageFaqs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationCard from '@/components/destinations/DestinationCard';
import { getDestinationsByRegion } from '@/data/meghalayaDestinations';
import { Check, Calendar } from 'lucide-react';

const ShillongTourPackage = () => {
  const nearShillong = getDestinationsByRegion('Near Shillong').slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Shillong Tour Package 2026 — 3 Days from ₹7,999 | XTSY</title>
        <meta name="description" content="Explore Shillong with a 3-day curated tour package. Umiam Lake, Shillong Peak, Elephant Falls, Laitlum Canyons. Stay at XTSY Hostel. Starting ₹7,999." />
        <meta name="keywords" content="Shillong tour package, Shillong trip, things to do in Shillong, Shillong hostel, weekend trip Shillong" />
        <link rel="canonical" href="https://xtsy.one/shillong-tour-package" />
      </Helmet>
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 max-w-5xl py-12">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Tour Packages', href: '/meghalaya-tour-packages' },
            { label: 'Shillong Tour' },
          ]} />
          <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground">Shillong Tour Package 2026</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            The perfect 3-day introduction to Meghalaya's capital. Explore viewpoints, waterfalls, sacred forests, and canyons — all from the comfort of XTSY Hostel in Shillong.
          </p>

          <div className="mt-8 bg-muted/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> 3-Day Itinerary
            </h2>
            <div className="mt-4 space-y-4">
              {[
                { day: 'Day 1', title: 'Arrival & Shillong Sightseeing', desc: 'Check in at XTSY → Umiam Lake viewpoint → Ward\'s Lake → Police Bazaar → Dinner at TAB Bistro' },
                { day: 'Day 2', title: 'Waterfalls & Canyons', desc: 'Elephant Falls → Shillong Peak (sunrise) → Laitlum Canyons → Mawphlang Sacred Forest → Bonfire at XTSY' },
                { day: 'Day 3', title: 'Hidden Gems & Departure', desc: 'Sweet Falls → Spread Eagle Falls → Local Khasi market → Departure' },
              ].map(item => (
                <div key={item.day} className="flex gap-4">
                  <div className="flex-shrink-0 w-16 font-bold text-primary text-sm">{item.day}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="mt-12 text-2xl font-bold text-foreground">Places You'll Visit</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearShillong.map(d => <DestinationCard key={d.slug} destination={d} />)}
          </div>

          <section className="mt-12 bg-primary/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Book Shillong Tour — Starting ₹7,999</h2>
            <p className="mt-2 text-muted-foreground">Includes stay at XTSY, breakfast, guided tours, and transfers.</p>
            <a
              href="https://wa.me/918837317070?text=Hi, I'm interested in the Shillong tour package."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
            >
              Book via WhatsApp
            </a>
          </section>

          <nav className="mt-8 border-t border-border pt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">Things to Do in Meghalaya</Link>
              <Link to="/meghalaya-tour-packages" className="text-sm text-primary hover:underline">All Tour Packages</Link>
              <Link to="/meghalaya-couple-tour-package" className="text-sm text-primary hover:underline">Couple Package</Link>
            </div>
          </nav>
        </div>
        <div className="container mx-auto px-4 max-w-5xl pb-12">
        <PageFaqs
          faqs={[
          { q: "What does the Shillong tour package include?", a: "The 3-day Shillong package covers your stay at XTSY Travellers Hostel, transport for sightseeing, and the main Shillong circuit: Umiam Lake, Shillong Peak, Elephant Falls and Laitlum Canyons, with dinner at TAB Bistro. Flights and trains to Guwahati are not included." },
          { q: "How much is a Shillong tour package per person?", a: "The 3-day Shillong tour starts at \u20b97,999 per person. Longer Meghalaya packages that add Sohra, Dawki and Mawlynnong start at \u20b915,500 per person for four or more travellers." },
          { q: "How do I reach Shillong for the tour?", a: "Fly or take a train to Guwahati, then drive about 3 to 3.5 hours to Shillong. Shared taxis run all day from Guwahati's Paltan Bazar, and XTSY can arrange a private cab. Shillong also has a small airport at Umroi with limited flights." },
          { q: "Can the Shillong package be customised?", a: "Yes. Dates, stays and the pace can be changed, and the package can be extended into Sohra, Dawki or the Jaintia Hills. Message the XTSY desk with your dates and group size." },
          { q: "Is this package suitable for solo travellers?", a: "It can be run for one person as a private trip, which costs more per head. Solo travellers who want to share costs can join XTSY's fixed Saturday Meghalaya group departure instead, at \u20b918,500 per person for 6 nights and 7 days." },
          ]}
        />
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default ShillongTourPackage;
