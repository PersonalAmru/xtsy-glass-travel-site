import { Link, useParams } from '@/lib/router-compat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import { getStateBySlug, getDestinationsForState, destinationPath } from '@/data/neTaxonomy';
import { getStateContent } from '@/data/neStateContent';
import { Plane, MapPin, CalendarDays, AlertTriangle } from 'lucide-react';

const StateHub = () => {
  const { state: stateSlug } = useParams<{ state: string }>();
  const state = getStateBySlug(stateSlug);
  if (!state) return <NotFound />;

  const content = getStateContent(state.slug);
  const attractions = getDestinationsForState(state.slug).slice(0, 12);
  const pageUrl = `https://xtsy.one/destinations/${state.slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: 'https://xtsy.one/destinations' },
      { '@type': 'ListItem', position: 3, name: state.name, item: pageUrl },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': pageUrl,
    url: pageUrl,
    name: `${state.name} Travel Guide`,
    description: content?.quickAnswer ?? state.blurb,
    abstract: content?.quickAnswer ?? state.blurb,
    inLanguage: 'en-IN',
    isPartOf: { '@type': 'WebSite', name: 'XTSY', url: 'https://xtsy.one' },
    about: { '@type': 'Place', name: state.name, address: { '@type': 'PostalAddress', addressRegion: state.name, addressCountry: 'IN' } },
    publisher: {
      '@type': 'Organization',
      name: 'XTSY ONE Ventures Pvt Ltd',
      url: 'https://xtsy.one',
      logo: { '@type': 'ImageObject', url: 'https://xtsy.one/xtsy-logo.png' },
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#quick-answer', 'h1'],
    },
  };

  const faqSchema = content?.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: content.faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link> <span>/</span>{' '}
            <Link to="/destinations" className="hover:text-foreground">Destinations</Link> <span>/</span>{' '}
            <span>{state.name}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold mb-4">{state.name} Travel Guide</h1>
          <p className="text-muted-foreground max-w-3xl mb-6">{state.blurb}</p>

          {content && (
            <p
              id="quick-answer"
              className="text-base md:text-lg leading-relaxed rounded-xl border border-border bg-card p-5 mb-10 max-w-3xl"
            >
              {content.quickAnswer}
            </p>
          )}

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

          {content?.permitNote && (
            <div className="rounded-xl border border-border bg-muted/60 p-5 mb-10 flex gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden />
              <p className="text-sm leading-relaxed"><strong>Permits:</strong> {content.permitNote}</p>
            </div>
          )}

          {content && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">About {state.name}</h2>
              <div className="space-y-4 max-w-3xl">
                {content.overview.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
                ))}
              </div>
            </section>
          )}

          {content && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Best time to visit {state.name}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.bestTime.map(b => (
                  <div key={b.window} className="rounded-xl border border-border p-5 bg-card">
                    <p className="font-medium flex items-center gap-2 mb-1"><CalendarDays className="h-4 w-4" />{b.window}</p>
                    <p className="text-sm text-muted-foreground">{b.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {content && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">How to reach {state.name}</h2>
              <ul className="space-y-2 max-w-3xl list-disc pl-5">
                {content.howToReach.map((h, i) => (
                  <li key={i} className="text-muted-foreground leading-relaxed">{h}</li>
                ))}
              </ul>
            </section>
          )}

          {content && content.highlights.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Top attractions in {state.name}</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {content.highlights.map(h => (
                  <li key={h} className="rounded-lg border border-border px-4 py-3 text-sm bg-card">{h}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Base towns in {state.name}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
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
          </section>

          {attractions.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Attraction guides in {state.name}</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {attractions.map(d => (
                  <li key={d.slug}>
                    <Link
                      to={destinationPath(d.slug)}
                      className="block rounded-lg border border-border px-4 py-3 text-sm hover:bg-muted"
                    >
                      {d.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(state.slug === 'assam' || state.slug === 'meghalaya') && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-3">Adventure trips from {state.name}</h2>
              <p className="text-muted-foreground max-w-3xl mb-4">
                Explore nearby activities from the towns above, or plan a longer road journey from Guwahati or Shillong.
                Check seasons, road access and permits before departure.
              </p>
              <div className="flex flex-wrap gap-5 text-sm">
                <Link to="/things-to-do-in-meghalaya" className="text-primary underline">Meghalaya activities</Link>
                <Link to="/meghalaya-tour-packages" className="text-primary underline">Meghalaya adventure tours</Link>
                <Link to="/expeditions" className="text-primary underline">Northeast motorbike and 4x4 routes</Link>
              </div>
            </section>
          )}

          {content && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Where to stay & book with XTSY</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.stays.map(s => (
                  <Link
                    key={s.href + s.label}
                    to={s.href}
                    className="rounded-xl border border-border p-5 bg-card hover:bg-muted transition-colors"
                  >
                    <h3 className="font-semibold mb-1">{s.label}</h3>
                    <p className="text-sm text-muted-foreground">{s.note}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {content && content.faqs.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">{state.name} travel FAQs</h2>
              <div className="space-y-4 max-w-3xl">
                {content.faqs.map(f => (
                  <div key={f.q} className="rounded-xl border border-border p-5 bg-card">
                    <h3 className="font-medium mb-2">{f.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StateHub;
