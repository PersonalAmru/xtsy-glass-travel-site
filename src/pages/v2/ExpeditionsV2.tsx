/**
 * /expeditions and /expeditions/$type/$route — motorbike & 4x4 route guides (redesign).
 */
import { Link, useParams } from '@/lib/router-compat';
import NotFound from '@/pages/NotFound';
import { EXPEDITION_ROUTES, EXPEDITION_TYPES, getExpeditionRoute, type ExpeditionType, type ExpeditionRouteStub } from '@/data/neTaxonomy';
import { photoFor } from '@/data/v2TourImages';
import { IMG } from '@/data/v2Images';
import { inr, lowestDormPrice } from '@/components/v2/pricing';
import { PageShell, PageHero, Btn, Section, H2, Breadcrumbs, PAD } from '@/components/v2/blocks';
import { Photo, waLink } from '@/components/v2/primitives';

const typeLabel = (t: string) => (t === '4x4' ? '4x4' : 'Motorbike');
const PARTNER_NOTE = 'XTSY’s own stay is in New Shillong Township. Vehicles, stays and support further along each route are arranged through trusted travel partners, with the XTSY desk as your single point of contact.';

function RouteCard({ r, type }: { r: ExpeditionRouteStub; type: ExpeditionType }) {
  const d = r.byType[type];
  return (
    <Link to={`/expeditions/${type}/${r.slug}`} className="xt-reveal xt-lift flex flex-col overflow-hidden rounded-3xl bg-white text-xt-ink hover:text-xt-ink">
      <Photo src={photoFor(r.name, r.highlights.join(' '))} alt={r.name} tone="slate" className="aspect-[421/220]" />
      <div className="flex flex-col gap-2 p-6">
        <span className="text-[20px] font-extrabold leading-tight">{r.name}</span>
        <span className="text-[14px] text-xt-mute">{r.distanceKm} km · {r.difficulty} · {d?.duration}</span>
        {d && <span className="text-[17px] font-extrabold">From {inr(d.priceFrom)} <span className="text-[13px] font-semibold text-xt-mute">/person</span></span>}
      </div>
    </Link>
  );
}

export function ExpeditionsIndexV2() {
  return (
    <PageShell cta={{ title: 'Ride the Northeast with backup.', sub: 'Tell us your route, dates and whether you ride or drive. We’ll sort vehicle, permits and stays.', bookTo: '/xtsy-rentals', bookLabel: 'Rent a bike or car' }}>
      <PageHero
        bg="#1F2230"
        fg="#F5EFE6"
        muted="#C9CDD8"
        eyebrowColor="#E07A8B"
        eyebrow="XTSY Expeditions · Motorbike & 4x4"
        title="Roads worth the ride."
        text="Start in Shillong or Guwahati and compare four real road circuits: the Meghalaya loop, Guwahati–Shillong, Tawang via Assam and Kohima via Dimapur. Each guide covers distance, road conditions, best season, permits and a motorbike or 4x4 option. Check current access and weather before setting off."
        actions={<><Btn to="#routes">See the routes</Btn><Btn to={waLink('Hi XTSY! I want to plan an expedition. Route: … Dates: … Riders: …')} kind="outline-light">Ask on WhatsApp</Btn></>}
        media={<Photo src={IMG.bumla} alt="Bumla Pass bike expedition" eager tone="night" className="aspect-[628/520] rounded-[32px]" />}
      />
      {EXPEDITION_TYPES.map((type, i) => (
        <Section key={type} id={i === 0 ? 'routes' : undefined} className={i % 2 ? 'bg-xt-cream' : undefined}>
          <H2 eyebrow={`${typeLabel(type)} routes`}>{type === '4x4' ? '4x4 expeditions' : 'Motorbike expeditions'}</H2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {EXPEDITION_ROUTES.filter((r) => r.types.includes(type)).map((r) => <RouteCard key={r.slug} r={r} type={type} />)}
          </div>
        </Section>
      ))}
      <section className={`${PAD} flex flex-col gap-3 pb-16 text-[15px] leading-relaxed text-xt-mute`}>
        <p className="m-0">For a 4x4 expedition in Meghalaya, start with the <Link to="/expeditions/4x4/meghalaya-loop" className="font-bold text-xt-crimson">Shillong–Dawki–Mawlynnong–Cherrapunji loop</Link>. Riders can compare the same circuit in the <Link to="/expeditions/motorbike/meghalaya-loop" className="font-bold text-xt-crimson">motorbike guide</Link>.</p>
        <p className="m-0">Looking beyond the road? Explore <Link to="/meghalaya-tour-packages" className="font-bold text-xt-crimson">Meghalaya guided trips</Link> or compare <Link to="/things-to-do-in-meghalaya" className="font-bold text-xt-crimson">treks, caves and river activities</Link>.</p>
        <p className="m-0 text-[13px]">{PARTNER_NOTE}</p>
      </section>
    </PageShell>
  );
}

export function ExpeditionRouteV2() {
  const { type, route } = useParams<{ type: string; route: string }>();
  const expedition = getExpeditionRoute(type, route);
  if (!expedition || !type) return <NotFound />;

  const detail = expedition.byType[type as ExpeditionType];
  const label = typeLabel(type);
  const highAltitude = expedition.maxAltitude.includes('13,700') || expedition.maxAltitude.includes('15,200');
  const facts = [
    { label: 'Distance', value: `${expedition.distanceKm} km` },
    { label: 'Duration', value: detail?.duration ?? 'Flexible' },
    { label: 'Difficulty', value: expedition.difficulty },
    { label: 'Vehicle', value: detail?.vehicle ?? label },
    { label: 'Best season', value: expedition.bestSeason },
    { label: 'Maximum altitude', value: expedition.maxAltitude },
    { label: 'Permits', value: expedition.permits.length ? expedition.permits[0] : 'None' },
    ...(detail ? [{ label: 'From', value: `${inr(detail.priceFrom)} per person` }] : []),
  ];
  const others = EXPEDITION_ROUTES.filter((r) => r.slug !== expedition.slug && r.types.includes(type as ExpeditionType));
  const wa = waLink(`Hi! I'd like details on the ${expedition.name} ${label.toLowerCase()} expedition.`);

  return (
    <PageShell cta={false}>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Expeditions', to: '/expeditions' }, { label }]} />
      <PageHero
        size="md"
        eyebrow={`${label} expedition · ${expedition.name.split(' — ')[1] ?? `${expedition.distanceKm} km`}`}
        title={expedition.name.split(' — ')[0]}
        text={<>{expedition.summary}{detail ? ` By ${label.toLowerCase()} it takes ${detail.duration} and starts from ${inr(detail.priceFrom)} per person with XTSY support.` : ''}</>}
        actions={<><Btn to={wa}>Ask on WhatsApp</Btn><Btn to="/book" kind="outline">Check availability</Btn></>}
        media={<Photo src={photoFor(expedition.name, expedition.highlights.join(' '))} alt={expedition.name} eager tone="slate" className="aspect-[628/480] rounded-[32px]" />}
      />

      {highAltitude && (
        <section className={`${PAD} pt-10`}>
          <div className="xt-reveal rounded-3xl border-2 border-[#C98A1B] bg-[#FFF4DD] p-7">
            <h2 className="m-0 mb-2 text-[20px] font-extrabold">High-altitude warning</h2>
            <p className="m-0 text-[15px] leading-relaxed">This route crosses Sela Pass at 4,170 m (13,700 ft) and, with an army permit, Bumla Pass at 4,633 m (15,200 ft). Acute Mountain Sickness is a real risk above 3,000 m. Acclimatise with at least one night at Dirang or Bomdila, drink 3-4 litres of water a day, avoid alcohol, and descend immediately if you get a persistent headache, breathlessness at rest or vomiting. Travellers with heart or lung conditions should consult a doctor before booking.</p>
          </div>
        </section>
      )}

      <section className={`${PAD} grid gap-8 py-14 lg:grid-cols-2`}>
        <div className="xt-reveal overflow-hidden rounded-[28px] bg-white">
          <h2 className="xt-display m-0 px-7 pt-7 text-[36px] leading-none">{expedition.name} at a glance</h2>
          <dl className="m-0 mt-4">
            {facts.map((f) => (
              <div key={f.label} className="grid grid-cols-2 gap-4 border-t border-xt-cream px-7 py-3.5 text-[15px]">
                <dt className="font-bold text-xt-mute">{f.label}</dt>
                <dd className="m-0 font-extrabold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex flex-col gap-6">
          <div className="xt-reveal rounded-[28px] bg-xt-slate p-7 text-xt-paper">
            <h2 className="xt-display m-0 mb-3 text-[32px] leading-none">Permits and paperwork</h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15px]">
              {expedition.permits.map((p) => <li key={p}>• {p}</li>)}
            </ul>
          </div>
          <div className="xt-reveal rounded-[28px] bg-xt-cream p-7">
            <h2 className="xt-display m-0 mb-3 text-[32px] leading-none">When to go</h2>
            <p className="m-0 text-[15px] leading-relaxed"><strong>Best:</strong> {expedition.bestSeason}. <strong>Avoid:</strong> {expedition.avoidSeason}.</p>
          </div>
        </div>
      </section>

      <Section className="pt-0">
        <H2 eyebrow="On the road">Route highlights</H2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {expedition.highlights.map((h) => <div key={h} className="xt-reveal rounded-2xl bg-white p-5 text-[15px] font-bold">{h}</div>)}
        </div>
        <div className="xt-reveal flex flex-col gap-3 text-[16px] leading-relaxed text-xt-mute">
          <h3 className="m-0 text-[20px] font-extrabold text-xt-ink">Road and riding conditions</h3>
          <p className="m-0">{expedition.roadNotes}</p>
          {detail && <p className="m-0">{detail.notes}</p>}
        </div>
      </Section>

      <section className={`${PAD} pb-14`}>
        <div className="xt-reveal flex flex-col gap-4 rounded-[28px] bg-xt-crimson p-8 text-white sm:p-10">
          <h2 className="xt-display m-0 text-[44px] leading-none">Ride it with XTSY</h2>
          <p className="m-0 max-w-[760px] text-[16px] leading-relaxed">XTSY arranges the vehicle, permits, fuel planning, backup contacts and your stay in New Shillong for this route. Beds at XTSY Travellers Hostel start at {inr(lowestDormPrice())} per person per night between legs. {PARTNER_NOTE}</p>
          <div className="flex flex-wrap gap-3">
            <Btn to="/book" kind="light">Check availability</Btn>
            <Btn to="/tours" kind="outline-light">See guided tours</Btn>
            <Btn to={wa} kind="outline-light">Ask on WhatsApp</Btn>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <Section className="pt-0">
          <H2 eyebrow={`More ${label.toLowerCase()} routes`}>Other expedition routes</H2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((r) => <RouteCard key={r.slug} r={r} type={type as ExpeditionType} />)}
          </div>
        </Section>
      )}
    </PageShell>
  );
}

