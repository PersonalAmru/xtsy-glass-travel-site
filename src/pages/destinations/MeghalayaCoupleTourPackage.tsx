import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Heart, Check, Calendar } from 'lucide-react';

const MeghalayaCoupleTourPackage = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Meghalaya Couple Tour Package 2026 — Romantic Getaway | XTSY</title>
      <meta name="description" content="Romantic Meghalaya tour for couples. 270° Glass Suite, private Dawki boating, sunset viewpoints, candlelight dining. Starting ₹18,999 per couple." />
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
          A romantic 5-day getaway designed for couples — featuring XTSY's 270° Glass Suite, private river experiences, sunset viewpoints, and candlelight dining at TAB Bistro.
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
              '2 nights in XTSY 270° Glass Suite',
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
            href="https://wa.me/918787537633?text=Hi, I'm interested in the Meghalaya Couple Tour Package."
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
    </main>
    <Footer />
  </div>
);

export default MeghalayaCoupleTourPackage;
