import { Link } from '@/lib/router-compat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EXPEDITION_ROUTES, EXPEDITION_TYPES } from '@/data/neTaxonomy';

const ExpeditionsIndex = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Northeast India Expeditions</h1>
        <p className="text-muted-foreground mb-10">
          Motorbike and 4x4 route structure. Full route guides — distances, permits, seasons and
          logistics — are published in the next content phase.
        </p>
        {EXPEDITION_TYPES.map(type => (
          <section key={type} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 capitalize">{type} routes</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {EXPEDITION_ROUTES.filter(r => r.types.includes(type)).map(r => (
                <li key={r.slug}>
                  <Link
                    to={`/expeditions/${type}/${r.slug}`}
                    className="block rounded-xl border border-border p-4 hover:bg-muted"
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default ExpeditionsIndex;
