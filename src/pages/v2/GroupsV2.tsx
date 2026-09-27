/**
 * /group-bookings-meghalaya — group trips, offsites and whole-dorm stays (redesign).
 */
import { Helmet } from 'react-helmet-async';
import SEOHead from '@/components/SEOHead';
import { COVERS } from '@/data/v2Images';
import { PageShell, PageHero, Btn, Section, H2, FaqList, Breadcrumbs, PAD } from '@/components/v2/blocks';
import { EnquiryForm } from '@/components/v2/EnquiryForm';
import { Photo, waLink } from '@/components/v2/primitives';

const GROUP_WA = waLink('Hi XTSY! Group enquiry. Group size: __, dates: __, trip type: __.');

const BRANCHES = [
  { t: 'Group tour packages', d: 'Custom Meghalaya trips for 6–60 travellers: Shillong, Cherrapunji, Dawki, Mawlynnong and the living root bridges. Stays, transport, permits and guides handled end to end.', pts: ['Per-person group rates', 'Dedicated tempo or SUV transport', 'XTSY desk in New Shillong; trusted partners on the road'], cta: 'View tour packages', to: '/meghalaya-tour-packages', cls: 'bg-xt-crimson text-white', kind: 'light' as const },
  { t: 'Corporate offsites', d: 'Team retreats with conference space, AV, twin-share stays, food and curated activities, with a GST invoice on your company name.', pts: ['Conference + AV setup', 'GST invoice (GSTIN 17QSKPK1714H1ZE)', 'Caving, river days and treks'], cta: 'Request a corporate quote', to: waLink("Hi XTSY, I'd like a corporate offsite quote in Meghalaya. Team size: __, dates: __."), cls: 'bg-white text-xt-ink', kind: 'primary' as const },
  { t: 'Whole-dorm stays', d: 'Book entire dorms or a block of rooms at XTSY Travellers Hostel, New Shillong Township, so college trips and friend groups stay together at direct rates.', pts: ['Whole-dorm buy-outs', 'Direct rates, no OTA mark-ups', 'Common areas for your crew'], cta: 'Book a group stay', to: '/book', cls: 'bg-xt-slate text-xt-paper', kind: 'light' as const },
  { t: 'Group catering', d: 'Set menus, buffets and on-site catering by TAB Bistro by XTSY for offsites, college trips and celebrations.', pts: ['Set menus & buffets', 'Veg, non-veg and Jain options', 'On-site & event catering'], cta: 'Plan group catering', to: '/tab-bistro/catering', cls: 'bg-xt-cream text-xt-ink', kind: 'primary' as const },
  { t: 'Shillong weekend tours', d: 'A 2–3 day group tour around Umiam Lake, Laitlum Canyons, Elephant Falls and Mawphlang sacred forest, shaped around your group’s size, pace and budget.', pts: ['2–3 day weekend formats', 'Flexible pickup points', 'Quote within an hour'], cta: 'Build a custom itinerary', to: '/shillong-tour-package', cls: 'bg-xt-ink text-xt-paper', kind: 'light' as const },
];

const STEPS = [
  { t: 'Share your brief', d: 'Send group size, dates and trip type on WhatsApp or the form below.' },
  { t: 'Get a quote in ~1 hour', d: 'Transparent per-person pricing, no hidden mark-ups.' },
  { t: 'Lock the dates', d: 'Confirm with a deposit; we hold stays and transport.' },
  { t: 'Travel worry-free', d: '24/7 on-ground support throughout your trip.' },
];

const FAQS = [
  { q: 'What is the minimum group size for a Meghalaya group tour?', a: 'XTSY runs group tours and group bookings for 6 to 60 travellers. Smaller crews of 4–5 can also be quoted — just share your dates and headcount on WhatsApp.' },
  { q: 'Do you offer group discounts and per-person rates?', a: 'Yes. Group tour packages, whole-dorm stays and corporate offsites are priced per person, with the rate improving as group size grows. Direct booking saves 20–30% versus OTAs.' },
  { q: 'Can you handle corporate offsites with GST invoicing?', a: 'Absolutely. Corporate offsites include conference space, AV, F&B and a proper GST invoice (GSTIN 17QSKPK1714H1ZE) raised on your company name for bookkeeping.' },
  { q: 'Can a whole group stay together at XTSY Travellers Hostel?', a: 'Yes — you can buy out an entire dormitory or book a block of rooms at XTSY Travellers Hostel in New Shillong Township so your group stays together, with common areas reserved for your crew.' },
  { q: 'Do you arrange group catering for trips and events?', a: 'TAB Bistro by XTSY provides set menus, buffets and on-site catering for groups, with veg, non-veg and Jain options for offsites, college trips and celebrations.' },
  { q: 'How early should we book a group trip to Meghalaya?', a: 'Lock dates 4–8 weeks ahead in peak season (October–March). Off-season groups can usually confirm in 7–10 days, and last-minute bookings are handled on WhatsApp.' },
];

export default function GroupsV2() {
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristTrip',
        name: 'Meghalaya group tours & group bookings',
        description: 'Custom group tour packages, corporate offsites, whole-dorm stays and group catering in Meghalaya for groups of 6–60.',
        provider: { '@type': 'TravelAgency', name: 'XTSY', url: 'https://xtsy.one', telephone: '+918837317070' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
          { '@type': 'ListItem', position: 2, name: 'Tours', item: 'https://xtsy.one/tours' },
          { '@type': 'ListItem', position: 3, name: 'Group Bookings Meghalaya', item: 'https://xtsy.one/group-bookings-meghalaya' },
        ],
      },
    ],
  };
  return (
    <>
      <SEOHead
        title="Meghalaya Group Tours & Group Bookings — Groups of 6–60 | XTSY"
        description="Custom group tour packages, corporate offsites, whole-dorm stays at XTSY Travellers Hostel (New Shillong Township) and group catering by TAB Bistro. Quote within about an hour."
        keywords="meghalaya group tour, group tour packages, group travel packages, corporate tour packages, shillong group tour"
        canonicalUrl="https://xtsy.one/group-bookings-meghalaya"
      />
      <Helmet><script type="application/ld+json">{JSON.stringify(ld)}</script></Helmet>
      <PageShell cta={{ title: 'Bring the whole crew.', sub: 'Share group size and dates on WhatsApp. We’ll send per-person pricing within about an hour.' }}>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tours', to: '/tours' }, { label: 'Group bookings' }]} />
        <PageHero
          eyebrow="Groups of 6–60 · Friends · Colleges · Corporates"
          title="One team for the whole group."
          text="Custom group tour packages, corporate offsites, whole-dorm stays at XTSY Travellers Hostel and group catering by TAB Bistro. Quote within ~1 hour · per-person group rates · direct booking saves 20–30% vs OTAs."
          actions={<><Btn to={GROUP_WA}>Get a group quote</Btn><Btn to="/book" kind="outline">Book a group stay</Btn></>}
          media={<Photo src={COVERS.groups} alt="The games room at XTSY Travellers Hostel, New Shillong Township" eager tone="sand" className="aspect-[628/520] rounded-[32px]" />}
        />

        <Section>
          <H2 eyebrow="What we arrange">Five ways to travel together</H2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BRANCHES.map((b) => (
              <article key={b.t} className={`xt-reveal xt-lift flex flex-col gap-4 rounded-[26px] p-8 ${b.cls}`}>
                <h3 className="xt-display m-0 text-[36px] leading-none">{b.t}</h3>
                <p className="m-0 text-[15px] leading-relaxed opacity-90">{b.d}</p>
                <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[14px] font-bold">
                  {b.pts.map((p) => <li key={p}>✓ {p}</li>)}
                </ul>
                <div className="mt-auto pt-2"><Btn to={b.to} kind={b.kind} className="h-12 px-6 text-[15px]">{b.cta}</Btn></div>
              </article>
            ))}
          </div>
        </Section>

        <section className={`${PAD} pb-16`}>
          <div className="xt-reveal grid gap-6 rounded-[28px] bg-xt-ink p-8 text-xt-paper sm:grid-cols-2 sm:p-10 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.t} className="flex flex-col gap-2 border-l-2 border-xt-crimson pl-4">
                <span className="font-display text-[40px] leading-none text-xt-rose">0{i + 1}</span>
                <span className="text-[18px] font-extrabold">{s.t}</span>
                <span className="text-[14px] text-xt-fog">{s.d}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${PAD} grid items-start gap-10 pb-16 lg:grid-cols-12`}>
          <div className="xt-reveal flex flex-col gap-4 lg:col-span-5">
            <h2 className="xt-display m-0 text-[48px] leading-[0.9] sm:text-[64px]">Tell us about your group</h2>
            <p className="m-0 text-[16px] leading-relaxed text-xt-mute">Your enquiry goes straight to the XTSY desk. Our own stay is in New Shillong Township; outside New Shillong we arrange stays, transport and guides through trusted travel partners, with XTSY as your single point of contact.</p>
          </div>
          <div className="lg:col-span-7">
            <EnquiryForm
              title="Group quote"
              packageTitle="Group booking"
              category="group"
              types={['Group tour', 'Corporate offsite', 'College trip', 'Whole-dorm stay', 'Group catering', 'Other']}
              note="GST invoices available on request."
            />
          </div>
        </section>

        <FaqList faqs={FAQS} />
      </PageShell>
    </>
  );
}
