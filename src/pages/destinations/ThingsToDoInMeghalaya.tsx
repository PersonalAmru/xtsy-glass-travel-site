import { useState } from 'react';
import heroImage from '@/assets/northeast-ecological-education-authentic.jpg';
import { Link, useNavigate } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationCard from '@/components/destinations/DestinationCard';
import PlanTripLinks from '@/components/PlanTripLinks';
import { PhotoGallery } from '@/components/ui/photo-gallery';
import { MapPin, Calendar, Mountain, TreePine, Waves, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  meghalayaDestinations,
  getDestinationsByRegion,
  getDestinationsByCategory,
  getFeaturedDestinations,
  getDestinationImageUrl,
  destinationCategories,
} from '@/data/meghalayaDestinations';

const ThingsToDoInMeghalaya = () => {
  const navigate = useNavigate();
  const nearShillong = getDestinationsByRegion('Near Shillong');
  const cherrapunji = getDestinationsByRegion('Cherrapunji & Sohra');
  const adventures = getDestinationsByCategory('adventure');
  const villages = getDestinationsByCategory('village');
  const featured = getFeaturedDestinations();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: 'Meghalaya',
    description: 'Explore 50+ breathtaking places to visit in Meghalaya — living root bridges, crystal-clear rivers, dramatic waterfalls, and ancient caves.',
    touristType: ['Adventure', 'Nature', 'Culture', 'Photography'],
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the best things to do in Meghalaya?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The top things to do in Meghalaya include visiting the Double Decker Living Root Bridge, boating on the crystal-clear Umngot River in Dawki, exploring Mawsmai Cave, trekking at Laitlum Canyons, and witnessing Nohkalikai Falls — India\'s tallest plunge waterfall.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best time to visit Meghalaya?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'October to March is the best time to visit Meghalaya for clear skies, trekking, and sightseeing. June to September (monsoon) offers dramatic waterfalls but trails can be slippery.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many days do you need in Meghalaya?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A minimum of 5-7 days is recommended to explore Meghalaya properly — covering Shillong, Cherrapunji, Dawki, and the living root bridges trek.',
        },
      },
    ],
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Things to Do in Meghalaya', item: 'https://xtsy.one/things-to-do-in-meghalaya' },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Things to Do in Meghalaya: 50 Most Beautiful Places to Visit (2026)</title>
        <meta name="description" content="Discover 50+ best things to do in Meghalaya — living root bridges, crystal-clear rivers, ancient caves, dramatic waterfalls. Complete travel guide with photos, tips & booking." />
        <meta name="keywords" content="things to do in Meghalaya, places to visit in Meghalaya, Meghalaya travel guide, Meghalaya tour package, best places Meghalaya 2026" />
        <link rel="canonical" href="https://xtsy.one/things-to-do-in-meghalaya" />
        <meta property="og:title" content="Things to Do in Meghalaya: 50 Most Beautiful Places to Visit" />
        <meta property="og:description" content="Complete guide to the best places in Meghalaya — living root bridges, crystal rivers, ancient caves, and dramatic waterfalls." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://xtsy.one/things-to-do-in-meghalaya" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbData)}</script>
      </Helmet>

      <Header />

      <main>
        {/* Hero — flush against header */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Hero background image */}
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Meghalaya landscape — lush green hills and waterfalls"
              className="w-full h-full object-cover"
              fetchPriority="high"
              loading="eager"
            />
            <div className="absolute inset-0 bg-black/65" />
          </div>
          <div className="relative container mx-auto px-4 max-w-5xl">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Things to Do in Meghalaya' }]} />
            <h1 className="mt-6 text-3xl md:text-5xl font-bold text-white leading-tight">
              Things to Do in Meghalaya: 50 Most Beautiful Places to Visit
            </h1>
            <p className="mt-4 text-lg text-white/80 max-w-3xl">
              Meghalaya — the "Abode of Clouds" — is home to India's tallest waterfalls, crystal-clear rivers, living root bridges, and ancient caves. From the dramatic canyons near Shillong to the unexplored Garo Hills, here's your complete guide to the best experiences in Northeast India's most stunning state.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {destinationCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/${cat.slug}`}
                  className="px-4 py-2 rounded-full border border-white/30 text-sm text-white hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Photo Gallery — Explore Meghalaya's Icons */}
        <PhotoGallery
          images={featured.slice(0, 8).map((dest) => ({
            src: getDestinationImageUrl(dest.slug),
            alt: `${dest.name} Meghalaya`,
            label: dest.name,
            slug: dest.slug,
          }))}
          onPhotoClick={(index) => {
            const dest = featured[index];
            if (dest) navigate(`/places-to-visit/${dest.slug}`);
          }}
          title={
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Explore Meghalaya's Icons
            </h2>
          }
          subtitle={
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Click any destination to discover waterfalls, caves, living root bridges & more
            </p>
          }
          cta={
            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              <Link
                to="/meghalaya-tour-packages"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                View Tour Packages
              </Link>
              <Link
                to="/meghalaya-photo-gallery"
                className="px-5 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                Photo Gallery
              </Link>
            </div>
          }
        />

        {/* Content Sections */}
        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-16">

          {/* Introduction */}
          <section>
            <p className="text-muted-foreground leading-relaxed">
              Meghalaya sits in the northeastern tip of India, bordered by Assam to the north and Bangladesh to the south. The state is divided into three main hill regions — the Khasi Hills, Jaintia Hills, and Garo Hills — each with its own unique landscape, culture, and attractions.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The state receives some of the highest rainfall in the world, which feeds hundreds of waterfalls, underground rivers, and dense tropical forests. This abundant rainfall has also created one of the most extensive cave systems in Asia, with discoveries still being made. But what truly sets Meghalaya apart is its living root bridges — structures grown over centuries by the Khasi and War communities, representing one of the most remarkable examples of bioengineering on Earth.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Whether you're trekking to the Double Decker Root Bridge, boating on the transparent Umngot River in Dawki, exploring the longest caves in India, or watching sunrise from a cloud-covered peak — Meghalaya offers experiences that are genuinely unlike anything else in the country. This guide covers {meghalayaDestinations.length} destinations across all regions, with practical tips for planning your trip.
            </p>
          </section>

          {/* Best Places Near Shillong */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Mountain className="h-6 w-6 text-primary" />
              Best Places Near Shillong
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Shillong, Meghalaya's capital, is your gateway to the state. Known as the "Scotland of the East," the city is surrounded by viewpoints, waterfalls, and sacred forests — all within easy day-trip distance. Start your Meghalaya adventure with these must-visit spots near Shillong.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearShillong.map((dest) => (
                <DestinationCard key={dest.slug} destination={dest} />
              ))}
            </div>
          </section>

          {/* Best Places in Cherrapunji */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Waves className="h-6 w-6 text-primary" />
              Best Places in Cherrapunji & Sohra
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Cherrapunji (locally known as Sohra) was once the wettest place on Earth. This region is home to India's tallest plunge waterfall, the world-famous living root bridges, and dramatic cliff-edge viewpoints overlooking the plains of Bangladesh. Allow at least 2-3 days to explore Cherrapunji properly.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cherrapunji.map((dest) => (
                <DestinationCard key={dest.slug} destination={dest} />
              ))}
            </div>
          </section>

          {/* Best Adventure Experiences */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Mountain className="h-6 w-6 text-primary" />
              Best Adventure Experiences
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              From trekking through rainforests to cliff jumping into crystal-clear rivers, Meghalaya offers some of the most unique adventure experiences in India. These destinations are perfect for adrenaline seekers and outdoor enthusiasts.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {adventures.map((dest) => (
                <DestinationCard key={dest.slug} destination={dest} />
              ))}
            </div>
          </section>

          {/* Best Villages */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <TreePine className="h-6 w-6 text-primary" />
              Best Villages to Visit
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Meghalaya's villages offer authentic cultural experiences — from Asia's cleanest village to remote communities living alongside centuries-old root bridges. These visits give travelers a deeper understanding of Khasi and Garo traditions.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {villages.map((dest) => (
                <DestinationCard key={dest.slug} destination={dest} />
              ))}
            </div>
          </section>

          {/* Suggested Itinerary */}
          <section className="bg-muted/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Suggested 7-Day Meghalaya Itinerary
            </h2>
            <div className="mt-6 space-y-4">
              {[
                { day: 'Day 1-2', title: 'Shillong & Surroundings', desc: 'Umiam Lake, Shillong Peak, Elephant Falls, Laitlum Canyons, Mawphlang Sacred Forest' },
                { day: 'Day 3-4', title: 'Cherrapunji', desc: 'Nohkalikai Falls, Mawsmai Cave, Seven Sisters Falls, Eco Park, Arwah Cave, Garden of Caves' },
                { day: 'Day 5', title: 'Nongriat Trek', desc: 'Double Decker Living Root Bridge, Rainbow Falls, swim in natural pools, overnight in Nongriat' },
                { day: 'Day 6', title: 'Dawki & Mawlynnong', desc: 'Crystal-clear Umngot River boating, Mawlynnong cleanest village, bamboo skywalk' },
                { day: 'Day 7', title: 'Adventure Day', desc: 'Shnongpdeng kayaking, cliff jumping, riverside camping, or Mawryngkhang bamboo trail' },
              ].map((item) => (
                <div key={item.day} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-20 text-sm font-bold text-primary">{item.day}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* All Destinations with Show More */}
          <AllDestinationsSection />


          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-6">
              {(faqData.mainEntity as any[]).map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-foreground">{faq.name}</h3>
                  <p className="mt-1 text-muted-foreground text-sm">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-primary/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Ready to Explore Meghalaya?</h2>
            <p className="mt-2 text-muted-foreground">Book curated Meghalaya tour packages with XTSY — stays, tours, and experiences combined.</p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link to="/meghalaya-tour-packages" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                View Tour Packages
              </Link>
              <Link to="/tours" className="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors">
                Browse All Tours
              </Link>
            </div>
          </section>

          {/* Internal Links */}
          <nav className="border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Explore More</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/meghalaya-tour-packages" className="text-sm text-primary hover:underline">Meghalaya Tour Packages</Link>
              <Link to="/meghalaya-couple-tour-package" className="text-sm text-primary hover:underline">Couple Tour Package</Link>
              <Link to="/shillong-tour-package" className="text-sm text-primary hover:underline">Shillong Tour Package</Link>
              <Link to="/best-time-to-visit-meghalaya" className="text-sm text-primary hover:underline">Best Time to Visit</Link>
              <Link to="/hidden-places-in-meghalaya" className="text-sm text-primary hover:underline">Hidden Places</Link>
              <Link to="/budget-trip-to-meghalaya" className="text-sm text-primary hover:underline">Budget Trip Guide</Link>
              <Link to="/meghalaya-waterfalls" className="text-sm text-primary hover:underline">Meghalaya Waterfalls</Link>
              <Link to="/meghalaya-caves" className="text-sm text-primary hover:underline">Meghalaya Caves</Link>
              <Link to="/meghalaya-photo-gallery" className="text-sm text-primary hover:underline">Photo Gallery</Link>
            </div>
          </nav>
          <PlanTripLinks
            source="things-to-do-in-meghalaya"
            heading="Turn your list into a trip — book your base"
            bookingAnchor="Stay central in Shillong to tick off every activity — dorm beds from ₹369, private rooms & glamping"
            slugs={['dawki-umngot-river', 'double-decker-living-root-bridge', 'nohkalikai-falls', 'laitlum-canyons']}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

const INITIAL_SHOW = 12;

const AllDestinationsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? meghalayaDestinations : meghalayaDestinations.slice(0, INITIAL_SHOW);

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
        All {meghalayaDestinations.length} Places to Visit in Meghalaya
      </h2>
      <p className="mt-3 text-muted-foreground">
        The complete list of destinations across Meghalaya — waterfalls, caves, viewpoints, villages, and adventure spots.
      </p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((dest) => (
          <DestinationCard key={dest.slug} destination={dest} />
        ))}
      </div>
      {!showAll && meghalayaDestinations.length > INITIAL_SHOW && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            className="gap-2"
          >
            Show All {meghalayaDestinations.length} Destinations
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default ThingsToDoInMeghalaya;
