import { Link } from '@/lib/router-compat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { NE_STATES } from '@/data/neTaxonomy';
import { MapPin } from 'lucide-react';

const DestinationsIndex = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link> <span>/</span> <span>Destinations</span>
        </nav>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Northeast India Destinations</h1>
        <p className="text-muted-foreground max-w-3xl mb-10">
          Explore all seven Northeast Indian states covered by XTSY — state guides, base towns and
          individual attractions, organised so you can plan a route rather than a single stop.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {NE_STATES.map(state => (
            <article key={state.slug} className="rounded-2xl border border-border p-6 bg-card">
              <h2 className="text-xl font-semibold mb-2">
                <Link to={`/destinations/${state.slug}`} className="hover:underline">
                  {state.name}
                </Link>
              </h2>
              <p className="text-sm text-muted-foreground mb-4">{state.blurb}</p>
              <ul className="flex flex-wrap gap-2">
                {state.cities.map(city => (
                  <li key={city.slug}>
                    <Link
                      to={`/destinations/${state.slug}/${city.slug}`}
                      className="inline-flex items-center gap-1 text-xs rounded-full border border-border px-3 py-1 hover:bg-muted"
                    >
                      <MapPin className="h-3 w-3" /> {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default DestinationsIndex;
