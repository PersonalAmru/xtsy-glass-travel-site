import { destinationPath } from '@/data/neTaxonomy';
import { Link } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import { MapPin, Waves, Mountain, Home, Droplets, Eye, Trees } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import PlanTripLinks from '@/components/PlanTripLinks';
import { meghalayaDestinations, type MeghalayaDestination } from '@/data/meghalayaDestinations';

const CANONICAL = 'https://xtsy.one/places-to-visit-in-meghalaya';

const CATEGORY_GROUPS: {
  category: MeghalayaDestination['category'];
  title: string;
  blurb: string;
  icon: typeof Waves;
}[] = [
  { category: 'waterfall', title: 'Waterfalls', blurb: 'From Nohkalikai to Krang Suri — the tallest and bluest falls in India.', icon: Waves },
  { category: 'village', title: 'Villages & Root Bridges', blurb: "Asia's cleanest village and the living-root bridges of Nongriat.", icon: Home },
  { category: 'lake', title: 'Lakes', blurb: 'Umiam (Barapani) and serene reservoirs framed by pine forest.', icon: Droplets },
  { category: 'cave', title: 'Caves', blurb: 'Mawsmai, Arwah and the longest cave systems in the subcontinent.', icon: Mountain },
  { category: 'viewpoint', title: 'Viewpoints & Peaks', blurb: 'Laitlum canyons, Shillong Peak and sunrise over the clouds.', icon: Eye },
  { category: 'river', title: 'Rivers', blurb: "Boat over the glass-clear Umngot at Dawki and Shnongpdeng.", icon: Trees },
];

const FAQS = [
  {
    q: 'What are the top places to visit in Meghalaya?',
    a: 'The most visited places in Meghalaya are Nohkalikai Falls, the Dawki (Umngot) River, the Double-Decker Living Root Bridge at Nongriat, Mawlynnong (Asia\u2019s cleanest village), Umiam Lake, Elephant Falls, Laitlum Canyons and Mawsmai Cave.',
  },
  {
    q: 'How many days do you need to see Meghalaya?',
    a: 'A 3-day trip covers Shillong, Cherrapunji and Dawki at a relaxed pace, while 5\u20136 days lets you add Mawlynnong, the root-bridge trek at Nongriat and the Jaintia Hills.',
  },
  {
    q: 'Where should I stay to visit these places?',
    a: 'Shillong is the ideal base \u2014 it is central to Cherrapunji, Dawki and Mawlynnong. XTSY Travellers Hostel in Shillong offers dorm beds from \u20b9369, private rooms and glamping.',
  },
];

const PlacesToVisitMeghalaya = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'ItemList',
        itemListElement: meghalayaDestinations
          .filter((d) => d.featured)
          .slice(0, 15)
          .map((d, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: d.name,
            url: `https://xtsy.one${destinationPath(d.slug)}`,
          })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Places to Visit in Meghalaya (2026) — Top Tourist Places</title>
        <meta
          name="description"
          content="The complete list of places to visit in Meghalaya — waterfalls, living root bridges, Dawki river, caves, villages & viewpoints, with travel tips and where to stay."
        />
        <meta name="keywords" content="places to visit in meghalaya, meghalaya tourist places, meghalaya places to visit, tourist places in meghalaya, meghalaya sightseeing" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Places to Visit in Meghalaya (2026) — Top Tourist Places" />
        <meta property="og:description" content="Waterfalls, living root bridges, Dawki river, caves and viewpoints — the complete Meghalaya sightseeing guide." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={CANONICAL} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 max-w-5xl py-12">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Things to Do', href: '/things-to-do-in-meghalaya' }, { label: 'Places to Visit' }]} />

          <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground">
            Places to Visit in Meghalaya — Top Tourist Places
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground leading-relaxed">
            Meghalaya packs more natural wonders per kilometre than almost anywhere in India —
            the world&apos;s tallest plunge waterfalls, living root bridges grown over centuries,
            glass-clear rivers and cloud-wrapped viewpoints. Here are the best places to visit,
            grouped by type, with a link to a full guide for each. Base yourself in Shillong and
            most are a comfortable day trip away.
          </p>

          <div className="mt-10 space-y-12">
            {CATEGORY_GROUPS.map((group) => {
              const items = meghalayaDestinations.filter((d) => d.category === group.category);
              if (items.length === 0) return null;
              return (
                <section key={group.category}>
                  <div className="flex items-center gap-3">
                    <group.icon className="h-6 w-6 text-primary" />
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground">
                        {group.title} in Meghalaya
                      </h2>
                      <p className="text-sm text-muted-foreground">{group.blurb}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((d) => (
                      <Link
                        key={d.slug}
                        to={destinationPath(d.slug)}
                        className="group rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/50"
                      >
                        <span className="flex items-center gap-2 font-semibold text-foreground group-hover:text-primary">
                          <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                          {d.name}
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground line-clamp-2">
                          {d.shortDescription}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <PlanTripLinks
            source="places-to-visit-in-meghalaya"
            heading="Ready to see these places? Book your Shillong base"
            bookingAnchor="Stay central in Shillong to reach Cherrapunji, Dawki & Mawlynnong — dorm beds from ₹369, private rooms & glamping"
            slugs={['dawki-umngot-river', 'double-decker-living-root-bridge', 'nohkalikai-falls', 'mawlynnong-village']}
          />

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="mt-4 space-y-4">
              {FAQS.map((f) => (
                <div key={f.q} className="rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-foreground">{f.q}</h3>
                  <p className="mt-2 text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <nav className="mt-10 border-t border-border pt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/best-time-to-visit-meghalaya" className="text-sm text-primary hover:underline">Best Time to Visit Meghalaya</Link>
              <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">Things to Do in Meghalaya</Link>
              <Link to="/3-day-meghalaya-itinerary" className="text-sm text-primary hover:underline">3-Day Itinerary</Link>
              <Link to="/5-day-meghalaya-itinerary" className="text-sm text-primary hover:underline">5-Day Itinerary</Link>
              <Link to="/meghalaya-tour-packages" className="text-sm text-primary hover:underline">Meghalaya Tour Packages</Link>
              <Link to="/hidden-places-in-meghalaya" className="text-sm text-primary hover:underline">Hidden Places</Link>
            </div>
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlacesToVisitMeghalaya;
