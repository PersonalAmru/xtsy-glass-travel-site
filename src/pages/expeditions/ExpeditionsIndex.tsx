import { Link } from '@/lib/router-compat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EXPEDITION_ROUTES, EXPEDITION_TYPES } from '@/data/neTaxonomy';

const ExpeditionsIndex = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Motorbike &amp; 4x4 Expeditions in Northeast India</h1>
        <p className="text-muted-foreground mb-6 max-w-3xl leading-relaxed">
          Start in Guwahati or Shillong and compare four real road circuits: the Meghalaya loop,
          Guwahati–Shillong, Tawang via Assam and Kohima via Dimapur. Each route guide covers distance,
          road conditions, best season, permits and a motorbike or 4x4 option. Check current access
          and weather before setting off.
        </p>
        <p className="text-muted-foreground mb-10 max-w-3xl leading-relaxed">
          Looking for adventure tours in Northeast India beyond the road? Explore{' '}
          <Link to="/meghalaya-tour-packages" className="text-primary underline">Meghalaya guided trips</Link>{' '}
          or compare <Link to="/things-to-do-in-meghalaya" className="text-primary underline">treks, caves and river activities</Link>.
        </p>
        {EXPEDITION_TYPES.map(type => (
          <section key={type} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">{type === '4x4' ? '4x4 expedition routes' : 'Motorbike expedition routes'}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {EXPEDITION_ROUTES.filter(r => r.types.includes(type)).map(r => (
                <li key={r.slug}>
                  <Link
                    to={`/expeditions/${type}/${r.slug}`}
                    className="block rounded-xl border border-border p-4 hover:bg-muted"
                  >
                    <span className="block font-semibold">{r.name}</span>
                    <span className="block mt-2 text-sm text-muted-foreground">{r.distanceKm} km · {r.difficulty} · {r.byType[type]?.duration}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="text-sm text-muted-foreground max-w-3xl">
          For a 4x4 expedition in Meghalaya, start with the <Link to="/expeditions/4x4/meghalaya-loop" className="text-primary underline">Shillong–Dawki–Mawlynnong–Cherrapunji loop</Link>.
          Riders can compare the same circuit in the <Link to="/expeditions/motorbike/meghalaya-loop" className="text-primary underline">motorbike guide</Link>.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default ExpeditionsIndex;
