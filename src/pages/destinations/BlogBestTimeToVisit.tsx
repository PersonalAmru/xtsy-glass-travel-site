import { Link } from '@/lib/router-compat';
import { Helmet } from '@/lib/seo/helmet';
import PageFaqs from '@/components/seo/PageFaqs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Calendar, Sun, CloudRain, Leaf, Snowflake } from 'lucide-react';
import PlanTripLinks from '@/components/PlanTripLinks';

const BlogBestTimeToVisit = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Best Time to Visit Meghalaya 2026 — Month-by-Month Guide</title>
      <meta name="description" content="When is the best time to visit Meghalaya? Month-by-month weather guide for Shillong, Cherrapunji, Dawki. Best season for waterfalls, trekking, and river activities." />
      <link rel="canonical" href="https://xtsy.one/best-time-to-visit-meghalaya" />
    </Helmet>
    <Header />
    <main className="pt-20">
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Things to Do', href: '/things-to-do-in-meghalaya' }, { label: 'Best Time to Visit' }]} />
        <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground">Best Time to Visit Meghalaya — Complete Month-by-Month Guide</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Meghalaya's weather varies dramatically by season. The right timing can transform your trip — from crystal-clear rivers in winter to thundering waterfalls during monsoon. Here's everything you need to know to plan the perfect Meghalaya trip.
        </p>

        <div className="mt-10 space-y-8">
          {[
            { icon: Snowflake, season: 'Winter (October–February)', title: 'Best Overall Season', temp: '5°C – 20°C', desc: 'Clear skies, comfortable trekking weather, crystal-clear river water in Dawki. Best for: Root bridge treks, Dawki boating, sightseeing, photography. The Umngot River reaches peak transparency in December-January.' },
            { icon: Sun, season: 'Spring (March–May)', title: 'Pleasant & Green', temp: '15°C – 25°C', desc: 'Warm days with occasional showers. Flowers bloom across the hills. Best for: Nature walks, village visits, viewpoints. Less crowded than winter peak season.' },
            { icon: CloudRain, season: 'Monsoon (June–September)', title: 'Dramatic Waterfalls', temp: '18°C – 25°C', desc: 'Heavy rainfall — Cherrapunji and Mawsynram see extreme rain. Best for: Waterfall lovers, photographers seeking dramatic landscapes. Caution: Trails can be slippery, some roads may be affected.' },
            { icon: Leaf, season: 'Autumn (September–October)', title: 'Transition Season', temp: '15°C – 22°C', desc: 'Rainfall decreases, landscapes remain lush green. Best for: Budget travelers wanting fewer crowds with good weather. Waterfalls still flowing strong.' },
          ].map((item) => (
            <div key={item.season} className="border border-border rounded-xl p-6">
              <div className="flex items-center gap-3">
                <item.icon className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-lg font-bold text-foreground">{item.season}</h2>
                  <p className="text-sm text-muted-foreground">{item.title} · {item.temp}</p>
                </div>
              </div>
              <p className="mt-3 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <section className="mt-12 bg-primary/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">Plan Your Meghalaya Trip</h2>
          <p className="mt-2 text-muted-foreground">Book a curated tour package with XTSY — we'll handle the logistics.</p>
          <Link to="/meghalaya-tour-packages" className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">View Packages</Link>
        </section>

        <PlanTripLinks
          source="best-time-to-visit-meghalaya"
          heading="Timed your trip? Now pick your places & stay"
          bookingAnchor="Winter is peak season — book your Shillong base early. Dorm beds from ₹399, private rooms & glamping"
          slugs={['dawki-umngot-river', 'double-decker-living-root-bridge', 'nohkalikai-falls', 'umiam-lake']}
        />

        <nav className="mt-8 border-t border-border pt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link to="/places-to-visit-in-meghalaya" className="text-sm text-primary hover:underline">Places to Visit in Meghalaya</Link>
            <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">Things to Do in Meghalaya</Link>
            <Link to="/hidden-places-in-meghalaya" className="text-sm text-primary hover:underline">Hidden Places</Link>
            <Link to="/budget-trip-to-meghalaya" className="text-sm text-primary hover:underline">Budget Trip Guide</Link>
            <Link to="/3-day-meghalaya-itinerary" className="text-sm text-primary hover:underline">3-Day Itinerary</Link>
            <Link to="/5-day-meghalaya-itinerary" className="text-sm text-primary hover:underline">5-Day Itinerary</Link>
            <Link to="/travel-guide/how-to-reach-meghalaya" className="text-sm text-primary hover:underline">How to Reach Meghalaya</Link>
            <Link to="/travel-guide/meghalaya-for-international-tourists" className="text-sm text-primary hover:underline">Guide for International Tourists</Link>
          </div>
        </nav>
      </div>
        <div className="container mx-auto px-4 max-w-5xl pb-12">
        <PageFaqs
          faqs={[
          { q: "What is the best month to visit Meghalaya?", a: "October and November are the best all-round months: the monsoon has ended, the waterfalls are still full, the skies are clear for Dawki and the canyons, and the Shillong Cherry Blossom Festival falls in late November. March to May is the next best window, with warm days and fewer crowds." },
          { q: "Is it worth visiting Meghalaya during the monsoon?", a: "Yes, if waterfalls are your reason for coming. June to September is when Nohkalikai, Seven Sisters and Wei Sawdong are at their most powerful, and the hills are greenest. Expect rain most days, leeches on forest trails, and mist that can hide viewpoints by midday. Roads to Sohra and Dawki stay open, but plan loose days." },
          { q: "When is the Umngot River at Dawki clearest?", a: "November to April. After the monsoon silt settles, the water turns glass-clear and boats appear to float. During and just after heavy rain the river runs brown and boating can be suspended." },
          { q: "What is the weather like in Shillong through the year?", a: "Shillong sits at about 1,500 m, so it is mild year-round: roughly 15-24\u00b0C in summer and 4-15\u00b0C in winter, with cold nights from December to February. Carry a jacket in every season and a rain layer from May to September." },
          { q: "Which months are cheapest to travel in Meghalaya?", a: "June to September, the monsoon, is the low season, and stays and cabs are at their cheapest. At XTSY, dorm beds start at \u20b9399 a night all year, with a women-only dorm at \u20b9599 and the King Double at \u20b92,399." },
          { q: "How many days do you need for Meghalaya?", a: "Five days covers Shillong, Sohra and Dawki comfortably. Seven days adds the Double Decker root-bridge trek and the Jaintia Hills without rushing. XTSY runs a 6-night, 7-day Meghalaya group trip that departs every Saturday from October to May at \u20b918,500 per person, which a solo traveller can join." },
          ]}
        />
        </div>

    </main>
    <Footer />
  </div>
);

export default BlogBestTimeToVisit;
