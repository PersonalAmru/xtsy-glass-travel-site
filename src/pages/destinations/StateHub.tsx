import { Link, useParams } from '@/lib/router-compat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import { getStateBySlug, getDestinationsForState } from '@/data/neTaxonomy';
import { Plane, MapPin } from 'lucide-react';

const StateHub = () => {
  const { state: stateSlug } = useParams<{ state: string }>();
  const state = getStateBySlug(stateSlug);
  if (!state) return <NotFound />;

  const attractions = getDestinationsForState(state.slug).slice(0, 12);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link> <span>/</span>{' '}
            <Link to="/destinations" className="hover:text-foreground">Destinations</Link> <span>/</span>{' '}
            <span>{state.name}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">{state.name} Travel Guide</h1>
          <p className="text-muted-foreground max-w-3xl mb-8">{state.blurb}</p>

          <div className="grid gap-4 sm:grid-cols-2 mb-10">
            <div className="rounded-xl border border-border p-5 bg-card">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Gateway city</p>
              <p className="font-medium flex items-center gap-2"><MapPin className="h-4 w-4" />{state.gatewayCity}</p>
            </div>
            <div className="rounded-xl border border-border p-5 bg-card">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Nearest airport</p>
              <p className="font-medium flex items-center gap-2"><Plane className="h-4 w-4" />{state.nearestAirport}</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-4">Base towns in {state.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2 mb-12">
            {state.cities.map(city => (
              <Link
                key={city.slug}
                to={`/destinations/${state.slug}/${city.slug}`}
                className="rounded-xl border border-border p-5 bg-card hover:bg-muted transition-colors"
              >
                <h3 className="font-semibold mb-1">{city.name}</h3>
                <p className="text-sm text-muted-foreground">{city.blurb}</p>
              </Link>
            ))}
          </div>

          {attractions.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Top attractions in {state.name}</h2>
              <ul className="grid gap-2 sm:grid-cols-2 mb-12">
                {attractions.map(d => (
                  <li key={d.slug}>
                    <Link
                      to={`/destinations/${state.slug}/${
                        // city resolved by the taxonomy helper at build of the link
                        d.region === 'Cherrapunji & Sohra' ? 'cherrapunji' : ''
                      }`}
                      className="hidden"
                      aria-hidden="true"
                    />
                    <Link
                      to={`/destinations/${state.slug}`}
                      className="hidden"
                      aria-hidden="true"
                    />
                    <span className="sr-only" />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StateHub;
