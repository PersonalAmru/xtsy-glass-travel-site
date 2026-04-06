import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationCard from '@/components/destinations/DestinationCard';
import { meghalayaDestinations } from '@/data/meghalayaDestinations';

const hiddenSlugs = ['wah-rilang-viewpoint', 'phe-phe-falls', 'nongkhnum-island', 'ranikor', 'shnongpdeng', 'nongjrong-sunrise-viewpoint', 'mawthadraishan-peak', 'jakrem-hot-springs'];
const hidden = hiddenSlugs.map(s => meghalayaDestinations.find(d => d.slug === s)).filter(Boolean) as typeof meghalayaDestinations;

const BlogHiddenPlaces = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Hidden Places in Meghalaya — 8 Secret Destinations You Must Visit</title>
      <meta name="description" content="Discover Meghalaya's best-kept secrets — hidden waterfalls, offbeat viewpoints, and unexplored villages that most tourists miss. Curated by XTSY." />
      <link rel="canonical" href="https://xtsy.one/hidden-places-in-meghalaya" />
    </Helmet>
    <Header />
    <main className="pt-20">
      <div className="container mx-auto px-4 max-w-5xl py-12">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Things to Do', href: '/things-to-do-in-meghalaya' }, { label: 'Hidden Places' }]} />
        <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground">Hidden Places in Meghalaya: 8 Secret Destinations</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-3xl">
          Beyond Dawki and Cherrapunji lies a Meghalaya that most travelers never see. These offbeat destinations offer untouched beauty, fewer crowds, and experiences that feel genuinely exclusive.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hidden.map(d => <DestinationCard key={d.slug} destination={d} />)}
        </div>
        <section className="mt-12 bg-primary/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">Explore Off-the-Beaten-Path Meghalaya</h2>
          <Link to="/meghalaya-tour-packages" className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">View Tour Packages</Link>
        </section>
        <nav className="mt-8 border-t border-border pt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">All Places to Visit</Link>
            <Link to="/best-time-to-visit-meghalaya" className="text-sm text-primary hover:underline">Best Time to Visit</Link>
            <Link to="/budget-trip-to-meghalaya" className="text-sm text-primary hover:underline">Budget Trip Guide</Link>
          </div>
        </nav>
      </div>
    </main>
    <Footer />
  </div>
);

export default BlogHiddenPlaces;
