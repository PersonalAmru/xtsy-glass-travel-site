import { Link, useParams } from '@/lib/router-compat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import { Button } from '@/components/ui/button';
import { getExpeditionRoute, EXPEDITION_ROUTES, type ExpeditionType } from '@/data/neTaxonomy';
import { AlertTriangle, Mountain, Route as RouteIcon, ShieldCheck, CalendarDays, IndianRupee } from 'lucide-react';

const typeLabel = (t: string) => (t === '4x4' ? '4x4' : 'Motorbike');

const ExpeditionRoutePage = () => {
  const { type, route } = useParams<{ type: string; route: string }>();
  const expedition = getExpeditionRoute(type, route);
  if (!expedition || !type) return <NotFound />;

  const detail = expedition.byType[type as ExpeditionType];
  const label = typeLabel(type);
  const highAltitude = expedition.maxAltitude.includes('13,700') || expedition.maxAltitude.includes('15,200');

  const facts: Array<{ label: string; value: string }> = [
    { label: 'Distance', value: `${expedition.distanceKm} km` },
    { label: 'Duration', value: detail?.duration ?? 'Flexible' },
    { label: 'Difficulty', value: expedition.difficulty },
    { label: 'Vehicle', value: detail?.vehicle ?? label },
    { label: 'Best season', value: expedition.bestSeason },
    { label: 'Maximum altitude', value: expedition.maxAltitude },
    { label: 'Permits', value: expedition.permits.length ? expedition.permits[0] : 'None' },
    ...(detail ? [{ label: 'From', value: `Rs ${detail.priceFrom.toLocaleString('en-IN')} per person` }] : []),
  ];

  const others = EXPEDITION_ROUTES.filter((r) => r.slug !== expedition.slug);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link> <span>/</span>{' '}
            <Link to="/expeditions" className="hover:text-foreground">Expeditions</Link> <span>/</span>{' '}
            <span>{label}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {expedition.name} — {label} Expedition
          </h1>

          <section aria-label="Quick answer" className="mb-8 rounded-2xl border border-primary/25 bg-primary/5 p-5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">In short</h2>
            <p className="leading-relaxed text-foreground/90">
              {expedition.summary}{' '}
              {detail
                ? `By ${label.toLowerCase()} it takes ${detail.duration} and starts from Rs ${detail.priceFrom.toLocaleString('en-IN')} per person with XTSY support.`
                : ''}
            </p>
          </section>

          {highAltitude && (
            <section
              aria-label="Altitude warning"
              className="mb-8 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5"
            >
              <h2 className="flex items-center gap-2 font-semibold mb-2">
                <Mountain className="h-4 w-4" /> High-altitude warning
              </h2>
              <p className="text-sm leading-relaxed text-foreground/85">
                This route crosses Sela Pass at 4,170 m (13,700 ft) and, with an army permit, Bumla Pass at
                4,633 m (15,200 ft). Acute Mountain Sickness is a real risk above 3,000 m. Acclimatise with at
                least one night at Dirang or Bomdila, drink 3-4 litres of water a day, avoid alcohol, and
                descend immediately if you get a persistent headache, breathlessness at rest or vomiting.
                Travellers with heart or lung conditions should consult a doctor before booking.
              </p>
            </section>
          )}

          <section aria-labelledby="permits" className="mb-8 rounded-xl border border-border bg-muted/30 p-5">
            <h2 id="permits" className="flex items-center gap-2 text-xl font-bold mb-3">
              <ShieldCheck className="h-5 w-5" /> Permits and paperwork
            </h2>
            <ul className="space-y-2 text-sm text-foreground/85">
              {expedition.permits.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="facts" className="mb-8">
            <h2 id="facts" className="mb-3 text-xl font-bold">{expedition.name} at a glance</h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {facts.map((f, i) => (
                    <tr key={f.label} className={i % 2 === 0 ? 'bg-muted/40' : ''}>
                      <th scope="row" className="w-1/2 px-4 py-2.5 text-left font-medium text-muted-foreground">
                        {f.label}
                      </th>
                      <td className="px-4 py-2.5">{f.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-3">
              <RouteIcon className="h-5 w-5" /> Route highlights
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2 text-sm text-foreground/85">
              {expedition.highlights.map((h) => (
                <li key={h} className="rounded-lg border border-border p-3">{h}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-3">
              <AlertTriangle className="h-5 w-5" /> Road and riding conditions
            </h2>
            <p className="text-sm leading-relaxed text-foreground/85 mb-3">{expedition.roadNotes}</p>
            {detail && <p className="text-sm leading-relaxed text-foreground/85">{detail.notes}</p>}
          </section>

          <section className="mb-8">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-3">
              <CalendarDays className="h-5 w-5" /> When to go
            </h2>
            <p className="text-sm leading-relaxed text-foreground/85">
              <strong>Best:</strong> {expedition.bestSeason}.{' '}
              <strong>Avoid:</strong> {expedition.avoidSeason}.
            </p>
          </section>

          <section className="mb-10 rounded-xl border border-primary/25 bg-primary/5 p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-2">
              <IndianRupee className="h-5 w-5" /> Ride it with XTSY
            </h2>
            <p className="text-sm text-foreground/85 mb-4">
              XTSY arranges the vehicle, permits, fuel planning, backup contacts and Shillong stay for this
              route. Beds at XTSY Travellers Hostel start at Rs 369 per person per night between legs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild><Link to="/book">Check availability</Link></Button>
              <Button asChild variant="outline"><Link to="/tours">See guided tours</Link></Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://wa.me/918837317070?text=${encodeURIComponent(`Hi! I'd like details on the ${expedition.name} ${label.toLowerCase()} expedition.`)}`,
                    '_blank',
                  )
                }
              >
                Ask on WhatsApp
              </Button>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Other expedition routes</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {others.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/expeditions/${type}/${r.slug}`}
                    className="block rounded-lg border border-border p-3 text-sm hover:bg-muted"
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExpeditionRoutePage;
