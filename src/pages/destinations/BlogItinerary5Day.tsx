import { Link } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import PlanTripLinks from '@/components/PlanTripLinks';
import { Calendar } from 'lucide-react';

const BlogItinerary5Day = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>5-Day Meghalaya Itinerary 2026 — Complete Travel Plan</title>
      <meta name="description" content="The ultimate 5-day Meghalaya itinerary. Shillong, Cherrapunji waterfalls, Nongriat root bridge trek, Dawki river. Day-by-day plan with booking tips." />
      <link rel="canonical" href="https://xtsy.one/5-day-meghalaya-itinerary" />
    </Helmet>
    <Header />
    <main className="pt-20">
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Things to Do', href: '/things-to-do-in-meghalaya' }, { label: '5-Day Itinerary' }]} />
        <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground">5-Day Meghalaya Itinerary — The Complete Trip</h1>
        <p className="mt-4 text-muted-foreground">Covering Shillong, Cherrapunji, the Living Root Bridge trek, and Dawki — this is the definitive Meghalaya travel plan.</p>

        <div className="mt-8 space-y-6">
          {[
            { day: 'Day 1', title: 'Shillong Arrival', places: ['Guwahati Airport → Shillong', 'Umiam Lake stop', 'XTSY check-in', 'Police Bazaar walk', 'TAB Bistro dinner'] },
            { day: 'Day 2', title: 'Shillong Sightseeing', places: ['Shillong Peak sunrise', 'Elephant Falls', 'Laitlum Canyons', 'Mawphlang Sacred Forest', 'Don Bosco Museum'] },
            { day: 'Day 3', title: 'Cherrapunji Day', places: ['Drive to Cherrapunji', 'Nohkalikai Falls', 'Mawsmai Cave', 'Seven Sisters Falls viewpoint', 'Eco Park Sohra', 'Return to Shillong or stay at Cherrapunji'] },
            { day: 'Day 4', title: 'Nongriat Trek', places: ['Tyrna village start', 'Descend 3,500 steps', 'Double Decker Living Root Bridge', 'Swim in rock pools', 'Rainbow Falls', 'Overnight in Nongriat or climb back'] },
            { day: 'Day 5', title: 'Dawki & Departure', places: ['Drive to Dawki', 'Crystal-clear Umngot River boating', 'Mawlynnong cleanest village', 'Bamboo skywalk', 'Return to Shillong for departure'] },
          ].map(item => (
            <div key={item.day} className="border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> {item.day}: {item.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {item.places.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <section className="mt-10 bg-primary/10 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-foreground">Book the 5-Day Meghalaya Package</h2>
          <Link to="/meghalaya-tour-packages" className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">View Packages</Link>
        </section>
        <nav className="mt-8 border-t border-border pt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link to="/3-day-meghalaya-itinerary" className="text-sm text-primary hover:underline">3-Day Itinerary</Link>
            <Link to="/budget-trip-to-meghalaya" className="text-sm text-primary hover:underline">Budget Trip</Link>
            <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">All Places to Visit</Link>
          </div>
        </nav>
        <PlanTripLinks
          source="5-day-meghalaya-itinerary"
          heading="Planning 5 days? Lock in your Shillong base"
          bookingAnchor="A 5-day Meghalaya loop with Mawlynnong & the root-bridge trek — dorm beds from ₹399, private rooms & glamping"
          slugs={['nohkalikai-falls', 'dawki-umngot-river', 'mawlynnong-village', 'double-decker-living-root-bridge']}
        />
      </div>
    </main>
    <Footer />
  </div>
);

export default BlogItinerary5Day;
