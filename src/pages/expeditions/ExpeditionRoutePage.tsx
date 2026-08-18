import { Link, useParams } from '@/lib/router-compat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import { getExpeditionRoute } from '@/data/neTaxonomy';

const ExpeditionRoutePage = () => {
  const { type, route } = useParams<{ type: string; route: string }>();
  const expedition = getExpeditionRoute(type, route);
  if (!expedition) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link> <span>/</span>{' '}
            <Link to="/expeditions" className="hover:text-foreground">Expeditions</Link> <span>/</span>{' '}
            <span className="capitalize">{type}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{expedition.name}</h1>
          <p className="text-muted-foreground">
            Route guide in preparation — distance, difficulty, permits, best season and XTSY
            logistics support are published in the expeditions content phase.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpeditionRoutePage;
