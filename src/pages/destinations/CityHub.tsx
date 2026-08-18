import { Link, useParams } from '@/lib/router-compat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import DestinationCard from '@/components/destinations/DestinationCard';
import { getStateBySlug, getCityBySlug, getDestinationsForCity } from '@/data/neTaxonomy';

const CityHub = () => {
  const { state: stateSlug, city: citySlug } = useParams<{ state: string; city: string }>();
  const state = getStateBySlug(stateSlug);
  const city = getCityBySlug(stateSlug, citySlug);
  if (!state || !city) return <NotFound />;

  const destinations = getDestinationsForCity(state.slug, city.slug);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link> <span>/</span>{' '}
            <Link to="/destinations" className="hover:text-foreground">Destinations</Link> <span>/</span>{' '}
            <Link to={`/destinations/${state.slug}`} className="hover:text-foreground">{state.name}</Link>{' '}
            <span>/</span> <span>{city.name}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Places to Visit in {city.name}, {state.name}
          </h1>
          <p className="text-muted-foreground max-w-3xl mb-10">{city.blurb}</p>

          {destinations.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map(d => (
                <DestinationCard key={d.slug} destination={d} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Detailed attraction guides for {city.name} are being published in the next content phase.{' '}
              <Link to={`/destinations/${state.slug}`} className="underline">
                Back to the {state.name} guide
              </Link>
              .
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CityHub;
