import { Link } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import PlanTripLinks from '@/components/PlanTripLinks';
import { Calendar } from 'lucide-react';

const BlogItinerary3Day = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>3-Day Meghalaya Itinerary 2026 — Weekend Trip Guide</title>
      <meta name="description" content="Perfect 3-day Meghalaya itinerary for a weekend trip. Shillong, Elephant Falls, Laitlum Canyons, and more. Day-by-day plan with tips." />
      <link rel="canonical" href="https://xtsy.one/3-day-meghalaya-itinerary" />
    </Helmet>
    <Header />
    <main className="pt-20">
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Things to Do', href: '/things-to-do-in-meghalaya' }, { label: '3-Day Itinerary' }]} />
        <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground">3-Day Meghalaya Itinerary — Perfect Weekend Trip</h1>
        <p className="mt-4 text-muted-foreground">A compact but complete weekend itinerary covering Shillong's best viewpoints, waterfalls, and cultural sites.</p>

        <div className="mt-8 space-y-6">
          {[
            { day: 'Day 1', title: 'Arrive in Shillong', places: ['Arrive at Guwahati Airport → Drive to Shillong (2.5 hrs)', 'Stop at Umiam Lake for photos', 'Check in at XTSY Hostel', 'Evening walk at Police Bazaar', 'Dinner at TAB Bistro'] },
            { day: 'Day 2', title: 'Waterfalls & Canyons', places: ['Sunrise at Shillong Peak', 'Elephant Falls (3 tiers)', 'Laitlum Canyons (cloud views)', 'Mawphlang Sacred Forest', 'Evening bonfire at XTSY'] },
            { day: 'Day 3', title: 'Hidden Gems & Departure', places: ['Sweet Falls & Bishop Falls', 'Spread Eagle Falls', 'Local market shopping', 'Departure to Guwahati Airport'] },
          ].map(item => (
            <div key={item.day} className="border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> {item.day}: {item.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {item.places.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <section className="mt-10 bg-primary/10 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-foreground">Want this trip planned for you?</h2>
          <Link to="/shillong-tour-package" className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">View Shillong Package</Link>
        </section>
        <nav className="mt-8 border-t border-border pt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link to="/5-day-meghalaya-itinerary" className="text-sm text-primary hover:underline">5-Day Itinerary</Link>
            <Link to="/budget-trip-to-meghalaya" className="text-sm text-primary hover:underline">Budget Trip</Link>
            <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">All Places to Visit</Link>
          </div>
        </nav>
        <PlanTripLinks
          source="3-day-meghalaya-itinerary"
          heading="Ready to run this itinerary? Book your stay"
          bookingAnchor="A 3-day Shillong–Cherrapunji–Dawki loop starts here — dorm beds from ₹369, private rooms & glamping"
          slugs={['umiam-lake', 'nohkalikai-falls', 'dawki-umngot-river', 'elephant-falls']}
        />
      </div>
    </main>
    <Footer />
  </div>
);

export default BlogItinerary3Day;
