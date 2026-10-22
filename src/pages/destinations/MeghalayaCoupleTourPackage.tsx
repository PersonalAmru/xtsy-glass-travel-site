import { Link } from '@/lib/router-compat';
import { Helmet } from '@/lib/seo/helmet';
import PageFaqs from '@/components/seo/PageFaqs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Heart, Check, Calendar } from 'lucide-react';

const MeghalayaCoupleTourPackage = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Meghalaya Couple Tour Package 2026 — Romantic Getaway | XTSY</title>
      <meta name="description" content="Romantic Meghalaya tour for couples. Experience by XTSY, private Dawki boating, sunset viewpoints, candlelight dining. Starting ₹18,999 per couple." />
      <meta name="keywords" content="Meghalaya couple tour, romantic trip Meghalaya, honeymoon Shillong, couple getaway Meghalaya" />
      <link rel="canonical" href="https://xtsy.one/meghalaya-couple-tour-package" />
    </Helmet>
    <Header />
    <main className="pt-20">
      <div className="container mx-auto px-4 max-w-5xl py-12">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Tour Packages', href: '/meghalaya-tour-packages' },
          { label: 'Couple Package' },
        ]} />
        <div className="flex items-center gap-3 mt-6">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Meghalaya Couple Tour Package</h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
          A romantic 5-day getaway designed for couples — featuring Experience by XTSY, private river experiences, sunset viewpoints, and candlelight dining at TAB Bistro.
        </p>

        <div className="mt-8 rounded-xl border border-border p-6">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">Romantic Getaway</span>
          <h2 className="text-xl font-bold text-foreground">5-Day Romantic Meghalaya</h2>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
            <Calendar className="h-4 w-4" /> 5 Days / 4 Nights
          </div>
          <p className="mt-4 text-3xl font-bold text-foreground">₹18,999 <span className="text-sm font-normal text-muted-foreground">/ per couple</span></p>
          <ul className="mt-4 space-y-2">
            {[
              '2 nights in Experience by XTSY',
              '2 nights in XTSY Private Room',
              'Private boating on Dawki crystal river',
              'Sunset picnic at Laitlum Canyons',
              'Candlelight dinner at TAB Bistro',
              'Guided Cherrapunji & waterfalls tour',
              'All breakfasts + 2 special dinners',
              'Airport/station transfers',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <a
            href="https://wa.me/918837317070?text=Hi, I'm interested in the Meghalaya Couple Tour Package."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block w-full text-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90"
          >
            Book via WhatsApp
          </a>
        </div>

        <nav className="mt-12 border-t border-border pt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">Things to Do in Meghalaya</Link>
            <Link to="/meghalaya-tour-packages" className="text-sm text-primary hover:underline">All Tour Packages</Link>
            <Link to="/shillong-tour-package" className="text-sm text-primary hover:underline">Shillong Tour</Link>
          </div>
        </nav>
      </div>
        <div className="container mx-auto px-4 max-w-5xl pb-12">
        <PageFaqs
          faqs={[
          { q: "What is included in the Meghalaya couple tour package?", a: "The 6-day honeymoon package at \u20b926,000 per person covers stays, private transport with a driver-guide, daily breakfast, and the couple-friendly circuit through Shillong, Sohra, Mawlynnong and Dawki. Flights and trains to Guwahati are not included." },
          { q: "Is there a private stay for couples at XTSY?", a: "Yes. The King Double room is \u20b92,399 a night, all inclusive. Experience by XTSY, a glass sky room with a queen-size bed, is \u20b95,999 a night for the stay, with an optional decoration add-on at \u20b92,500 plus \u20b9450 GST." },
          { q: "When is the best time for a honeymoon in Meghalaya?", a: "October to April. Skies are clearest, the Umngot River at Dawki runs glass-clear, and evenings are cool rather than cold. The monsoon from June to September is dramatic and green, but rain can shorten viewpoint days." },
          { q: "How many days do couples need in Meghalaya?", a: "Five to six days is comfortable: two nights in or near Shillong, one or two near Sohra, and a night by the river at Dawki or Shnongpdeng, with time left for slow mornings." },
          { q: "Can you arrange a surprise or celebration?", a: "Yes. Tell the XTSY desk before you arrive and the Experience by XTSY decoration add-on can be arranged for an anniversary, proposal or birthday, at \u20b92,500 plus \u20b9450 GST, once per stay." },
          ]}
        />
        </div>

    </main>
    <Footer />
  </div>
);

export default MeghalayaCoupleTourPackage;
