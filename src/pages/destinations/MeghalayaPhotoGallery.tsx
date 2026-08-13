import { Link } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationGallery from '@/components/destinations/DestinationGallery';
import { getFeaturedDestinations, getDestinationImages } from '@/data/meghalayaDestinations';

const MeghalayaPhotoGallery = () => {
  const featured = getFeaturedDestinations();
  const allImages = featured.flatMap(d =>
    getDestinationImages(d.slug, 3).map(img => ({
      ...img,
      alt: `${d.name} Meghalaya — ${img.alt}`,
    }))
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Meghalaya Photo Gallery — Stunning Images of Northeast India</title>
        <meta name="description" content="Browse stunning photos of Meghalaya — living root bridges, crystal rivers, dramatic waterfalls, and misty viewpoints. Real images from XTSY travel experiences." />
        <link rel="canonical" href="https://xtsy.one/meghalaya-photo-gallery" />
      </Helmet>
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 max-w-6xl py-12">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Things to Do', href: '/things-to-do-in-meghalaya' }, { label: 'Photo Gallery' }]} />
          <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground">Meghalaya Photo Gallery</h1>
          <p className="mt-4 text-muted-foreground max-w-3xl">
            Explore Meghalaya through stunning photography — waterfalls, rivers, canyons, and villages captured across the state's most beautiful destinations.
          </p>

          <DestinationGallery
            images={allImages}
            destinationName="Meghalaya"
            className="mt-8"
          />

          <section className="mt-12 bg-primary/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Experience These Places Yourself</h2>
            <Link to="/meghalaya-tour-packages" className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">View Tour Packages</Link>
          </section>
          <nav className="mt-8 border-t border-border pt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">All Places to Visit</Link>
              <Link to="/meghalaya-tour-packages" className="text-sm text-primary hover:underline">Tour Packages</Link>
              <Link to="/gallery" className="text-sm text-primary hover:underline">XTSY Gallery</Link>
            </div>
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MeghalayaPhotoGallery;
