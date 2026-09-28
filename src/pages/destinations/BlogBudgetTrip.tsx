import { Link } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import PlanTripLinks from '@/components/PlanTripLinks';
import { IndianRupee, Bed, Car, UtensilsCrossed } from 'lucide-react';

const BlogBudgetTrip = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Budget Trip to Meghalaya 2026 — Complete Cost Breakdown</title>
      <meta name="description" content="Plan a budget trip to Meghalaya. Complete cost breakdown for 5 days — accommodation, food, transport, activities. Travel Meghalaya under ₹10,000." />
      <link rel="canonical" href="https://xtsy.one/budget-trip-to-meghalaya" />
    </Helmet>
    <Header />
    <main className="pt-20">
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Things to Do', href: '/things-to-do-in-meghalaya' }, { label: 'Budget Trip' }]} />
        <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground">Budget Trip to Meghalaya — Under ₹10,000 for 5 Days</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Meghalaya is one of the most budget-friendly destinations in India. With dorm beds starting at ₹389/night at XTSY and affordable local food, you can explore the state's best attractions without breaking the bank.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: Bed, title: 'Accommodation', cost: '₹450–₹800/night', desc: 'XTSY dorm beds from ₹389. Private King Double rooms from ₹2,200. Budget homestays in villages from ₹500.' },
            { icon: UtensilsCrossed, title: 'Food', cost: '₹300–₹500/day', desc: 'Local Khasi food at ₹80-150 per meal. TAB Bistro multi-cuisine from ₹150. Street food at Police Bazaar.' },
            { icon: Car, title: 'Transport', cost: '₹200–₹600/day', desc: 'Shared taxis Shillong-Cherrapunji ₹200. Dawki shared cab ₹300. Local Shillong taxis ₹100-200.' },
            { icon: IndianRupee, title: 'Activities', cost: '₹0–₹300/day', desc: 'Most viewpoints and waterfalls are free. Cave entries ₹20-50. Dawki boating ₹800/boat (shared).' },
          ].map(item => (
            <div key={item.title} className="border border-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <item.icon className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="font-bold text-foreground">{item.title}</h2>
                  <p className="text-sm text-primary font-medium">{item.cost}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-muted/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground">Total Estimated Cost: 5-Day Budget Trip</h2>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between"><span>Accommodation (5 nights × ₹500)</span><span className="font-medium text-foreground">₹2,500</span></div>
            <div className="flex justify-between"><span>Food (5 days × ₹400)</span><span className="font-medium text-foreground">₹2,000</span></div>
            <div className="flex justify-between"><span>Transport (shared cabs + local)</span><span className="font-medium text-foreground">₹2,500</span></div>
            <div className="flex justify-between"><span>Activities & entries</span><span className="font-medium text-foreground">₹1,000</span></div>
            <div className="flex justify-between border-t border-border pt-2 mt-2"><span className="font-bold text-foreground">Total</span><span className="font-bold text-foreground text-lg">₹8,000</span></div>
          </div>
        </div>

        <section className="mt-10 bg-primary/10 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-foreground">Stay at XTSY — Shillong's Best Budget Hostel</h2>
          <p className="mt-2 text-sm text-muted-foreground">Dorms from ₹389/night. Breakfast, WiFi, and community included.</p>
          <Link to="/book" className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">Book Now</Link>
        </section>
        <nav className="mt-8 border-t border-border pt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link to="/3-day-meghalaya-itinerary" className="text-sm text-primary hover:underline">3-Day Itinerary</Link>
            <Link to="/5-day-meghalaya-itinerary" className="text-sm text-primary hover:underline">5-Day Itinerary</Link>
            <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">All Places to Visit</Link>
          </div>
        </nav>
        <PlanTripLinks
          source="budget-trip-to-meghalaya"
          heading="Travelling on a budget? Book beds from ₹389"
          bookingAnchor="The cheapest comfortable base in Shillong — dorm beds from ₹389, private rooms from ₹2,200"
          slugs={['dawki-umngot-river', 'double-decker-living-root-bridge', 'nohkalikai-falls', 'mawlynnong-village']}
        />
      </div>
    </main>
    <Footer />
  </div>
);

export default BlogBudgetTrip;
