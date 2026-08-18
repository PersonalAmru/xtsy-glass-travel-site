import { Link } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Check, Star, Calendar, Users, MapPin } from 'lucide-react';

const packages = [
  {
    title: '5-Day Meghalaya Explorer',
    price: '₹13,999',
    duration: '5 Days / 4 Nights',
    highlights: ['Shillong city tour', 'Cherrapunji waterfalls', 'Dawki boating', 'Mawlynnong village', 'All meals included'],
    tag: 'Most Popular',
  },
  {
    title: '3-Day Shillong Weekend',
    price: '₹7,999',
    duration: '3 Days / 2 Nights',
    highlights: ['Shillong Peak & Umiam Lake', 'Elephant Falls', 'Laitlum Canyons', 'Stay at XTSY Hostel', 'Breakfast included'],
    tag: 'Budget Friendly',
  },
  {
    title: '7-Day Complete Meghalaya',
    price: '₹22,999',
    duration: '7 Days / 6 Nights',
    highlights: ['Nongriat trek & Root Bridges', 'All Cherrapunji attractions', 'Dawki & Shnongpdeng camping', 'Mawryngkhang bamboo trail', 'All meals + transfers'],
    tag: 'Best Value',
  },
  {
    title: 'Couple Romantic Getaway',
    price: '₹18,999',
    duration: '5 Days / 4 Nights',
    highlights: ['270° Glass Suite at XTSY', 'Private Dawki boating', 'Sunset at Laitlum', 'Candlelight dinner at TAB Bistro', 'All transfers'],
    tag: 'For Couples',
  },
];

const MeghalayaTourPackages = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
      </Helmet>
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 max-w-5xl py-12">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Things to Do', href: '/things-to-do-in-meghalaya' },
            { label: 'Tour Packages' },
          ]} />
          <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground">
            Meghalaya Tour Packages 2026
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Curated tour packages combining stays at XTSY Hostel Shillong, guided tours to Meghalaya's best destinations, and dining at TAB Bistro. Everything included — just pack your bags.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.title} className="rounded-xl border border-border p-6 hover:border-primary/30 transition-colors">
                {pkg.tag && (
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
                    {pkg.tag}
                  </span>
                )}
                <h2 className="text-xl font-bold text-foreground">{pkg.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{pkg.duration}</span>
                </div>
                <p className="mt-4 text-3xl font-bold text-foreground">{pkg.price}<span className="text-sm font-normal text-muted-foreground"> / person</span></p>
                <ul className="mt-4 space-y-2">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/918787537633?text=Hi, I'm interested in the ${pkg.title} package.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block w-full text-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Book via WhatsApp
                </a>
              </div>
            ))}
          </div>

          <nav className="mt-12 border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Pages</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">Things to Do in Meghalaya</Link>
              <Link to="/meghalaya-couple-tour-package" className="text-sm text-primary hover:underline">Couple Tour Package</Link>
              <Link to="/shillong-tour-package" className="text-sm text-primary hover:underline">Shillong Tour Package</Link>
              <Link to="/best-time-to-visit-meghalaya" className="text-sm text-primary hover:underline">Best Time to Visit</Link>
              <Link to="/budget-trip-to-meghalaya" className="text-sm text-primary hover:underline">Budget Trip Guide</Link>
            </div>
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MeghalayaTourPackages;
