import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationCard from '@/components/destinations/DestinationCard';
import { destinationCategories, getDestinationsByCategory } from '@/data/meghalayaDestinations';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = destinationCategories.find(c => c.slug === slug);

  if (!category) {
    return <Navigate to="/things-to-do-in-meghalaya" replace />;
  }

  const destinations = getDestinationsByCategory(category.category);
  const pageTitle = `Best ${category.name} in Meghalaya — Travel Guide 2026`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={category.description} />
        <link rel="canonical" href={`https://xtsy.one/${category.slug}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={category.description} />
      </Helmet>
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 max-w-5xl py-12">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Things to Do', href: '/things-to-do-in-meghalaya' },
            { label: `Meghalaya ${category.name}` },
          ]} />
          <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground">
            Best {category.name} in Meghalaya
          </h1>
          <p className="mt-4 text-muted-foreground max-w-3xl">{category.description}</p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map(dest => (
              <DestinationCard key={dest.slug} destination={dest} />
            ))}
          </div>

          <section className="mt-12 bg-primary/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Explore Meghalaya with XTSY</h2>
            <p className="mt-2 text-muted-foreground">Book curated tour packages covering the best {category.name.toLowerCase()} in Meghalaya.</p>
            <Link to="/meghalaya-tour-packages" className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
              View Tour Packages
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
