import { Link, useParams } from '@/lib/router-compat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import DestinationCard from '@/components/destinations/DestinationCard';
import { getStateBySlug, getCityBySlug, getDestinationsForCity } from '@/data/neTaxonomy';
import { NEARBY_ADVENTURES } from '@/data/nearbyAdventures';

/** States where Indian nationals need an Inner Line Permit. */
const ILP_STATES: Record<string, string> = {
  'arunachal-pradesh': 'Arunachal Pradesh needs an Inner Line Permit (ILP) for Indian nationals; foreign nationals need a Protected Area Permit arranged in advance.',
  nagaland: 'Nagaland needs an Inner Line Permit (ILP) for Indian nationals, issued online or at Dimapur.',
  mizoram: 'Mizoram needs an Inner Line Permit (ILP) for Indian nationals, issued online or on arrival at the entry points.',
  manipur: 'Manipur needs an Inner Line Permit (ILP) for Indian nationals, issued online before you travel.',
};

function cityFaqs(stateSlug: string, stateName: string, cityName: string) {
  const short = cityName.replace(/\s*\(.*?\)\s*/g, '').trim();
  const permit = ILP_STATES[stateSlug]
    ? `${ILP_STATES[stateSlug]} Carry photo ID. Foreign nationals should check the current rules before travelling; XTSY can help with the paperwork when you book a trip.`
    : `No Inner Line Permit is needed for ${stateName}. Carry a government photo ID; foreign nationals should carry their passport and visa.`;
  return [
    { q: `Do I need a permit to visit ${short}?`, a: permit },
    { q: `Can XTSY plan a trip to ${short}?`, a: `Yes. XTSY's own stay is XTSY Travellers Hostel on Mawdiangdiang Road, New Shillong Township. For ${short}, XTSY arranges stays, vehicles and guides through trusted travel partners, with one point of contact on WhatsApp (+91 88373 17070).` },
    { q: `How do I plan the route to ${short} from Shillong?`, a: `Most Northeast trips start from Guwahati (the region's main airport and railhead) or Shillong. Share your dates with the XTSY desk and we'll suggest a route, travel time and where to break the journey, or compare ready-made Northeast tours.` },
  ];
}

const CityHub = () => {
  const { state: stateSlug, city: citySlug } = useParams<{ state: string; city: string }>();
  const state = getStateBySlug(stateSlug);
  const city = getCityBySlug(stateSlug, citySlug);
  if (!state || !city) return <NotFound />;

  const destinations = getDestinationsForCity(state.slug, city.slug);
  const nearby = (state.slug === 'assam' || state.slug === 'meghalaya') ? NEARBY_ADVENTURES[city.slug] : undefined;

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

          {nearby && (
            <section className="mb-12" aria-labelledby="nearby-adventures">
              <h2 id="nearby-adventures" className="text-2xl font-semibold mb-3">Adventure activities near {city.name}</h2>
              <p className="text-muted-foreground mb-5 max-w-3xl">
                Searching for adventures near me while in {city.name}? These nearby and onward trip ideas
                are a starting point; check local access, weather and availability before travelling.
              </p>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {nearby.map(item => (
                  <li key={item.label}>
                    <Link to={item.href} className="block h-full border border-border bg-card p-5 hover:bg-muted transition-colors">
                      <h3 className="font-semibold mb-2">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-muted-foreground">
                <Link to="/things-to-do-in-meghalaya" className="text-primary underline">Explore Meghalaya activities</Link>{' '}
                or <Link to="/meghalaya-tour-packages" className="text-primary underline">compare guided tours</Link>.
              </p>
            </section>
          )}

          {destinations.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map(d => (
                <DestinationCard key={d.slug} destination={d} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground max-w-3xl">
              {city.name} is part of our {state.name} guide. Browse the{' '}
              <Link to={`/destinations/${state.slug}`} className="underline">places to visit across {state.name}</Link>, or{' '}
              <Link to="/tours?group=northeast" className="underline">compare Northeast tours</Link> that include {city.name}.
            </p>
          )}

          <section className="mt-14 max-w-3xl" aria-labelledby="city-faq">
            <h2 id="city-faq" className="text-2xl font-semibold mb-5">Plan your visit to {city.name}</h2>
            <div className="flex flex-col gap-5">
              {cityFaqs(state.slug, state.name, city.name).map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold mb-1.5">{f.q}</h3>
                  <p className="text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CityHub;
