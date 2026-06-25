import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import {
  Users, Building2, BedDouble, UtensilsCrossed, MapPin,
  Check, MessageCircle, CalendarCheck, ShieldCheck, IndianRupee,
} from 'lucide-react';

const WA = '918837317070';
const waLink = (msg: string) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const GROUP_CTA = waLink(
  "Hi XTSY, I'd like a quote for a group booking in Meghalaya. Group size: __, dates: __, type: (friends / college / corporate).",
);

// Ranked, Semrush-validated keyword cluster (IN database) powering this hub:
//  meghalaya group tour (260, KDI 14) · group tour packages (1,300, KDI 29)
//  group travel packages (590, KDI 23) · corporate tour packages (210, KDI 24)
//  shillong group tour (30, KDI 0)

const branches = [
  {
    icon: Users,
    title: 'Group Tour Packages — Friends, Family & Big Groups',
    keyword: 'group tour packages',
    body:
      'Custom Meghalaya group tour packages for 6–60 travellers. Shillong, Cherrapunji, Dawki, Mawlynnong and the living root bridges — stays, transport, permits and guides handled end-to-end by XTSY Travel.',
    points: ['Per-person group rates', 'Dedicated tempo/SUV transport', 'On-ground team in Shillong & Guwahati'],
    cta: 'View Tour Packages',
    to: '/meghalaya-tour-packages',
  },
  {
    icon: Building2,
    title: 'Corporate Offsites & Team Outings',
    keyword: 'corporate tour packages',
    body:
      'High-recall corporate offsites and team-building retreats in Meghalaya — conference space, AV, twin-share stays, F&B and curated experiences with proper GST invoicing for your bookkeeping.',
    points: ['Conference + AV setup', 'GST invoice on company name', 'Team activities: caving, river days, treks'],
    cta: 'Request Corporate Quote',
    to: waLink("Hi XTSY, I'd like a corporate offsite quote in Meghalaya. Team size: __, dates: __."),
    external: true,
  },
  {
    icon: BedDouble,
    title: 'Whole-Dorm & Group Stays at XTSY Travellers Hostel',
    keyword: 'group accommodation shillong',
    body:
      'Book entire dorms or a block of rooms at XTSY Travellers Hostel, Shillong. Ideal for college trips and friend groups who want to stay together at the best direct rates — no OTA mark-ups.',
    points: ['Whole-dorm buy-outs', 'Direct rates vs OTAs', 'Common areas for your crew'],
    cta: 'Book Group Stay',
    to: '/book',
  },
  {
    icon: UtensilsCrossed,
    title: 'Group Catering & Dining by TAB Bistro',
    keyword: 'group catering shillong',
    body:
      'Feed the whole group at TAB Bistro by XTSY — set menus, buffets and on-site catering for offsites, college trips and celebrations in a pine-forest setting in Shillong.',
    points: ['Set menus & buffets', 'Veg / non-veg / Jain options', 'On-site & event catering'],
    cta: 'Plan Group Catering',
    to: '/tab-bistro/catering',
  },
  {
    icon: MapPin,
    title: 'Shillong Group Tours & Custom Itineraries',
    keyword: 'shillong group tour',
    body:
      'Short on time? Build a 2–3 day Shillong group tour around Umiam Lake, Laitlum Canyons, Elephant Falls and Mawphlang sacred forest — rebuilt around your group size, pace and budget.',
    points: ['2–3 day weekend formats', 'Flexible pickup points', 'Quote within an hour'],
    cta: 'Build Custom Itinerary',
    to: '/shillong-tour-package',
  },
];

const steps = [
  { icon: MessageCircle, title: 'Share your brief', body: 'Send group size, dates and trip type on WhatsApp.' },
  { icon: IndianRupee, title: 'Get a quote in ~1 hour', body: 'Transparent per-person pricing — no hidden mark-ups.' },
  { icon: CalendarCheck, title: 'Lock the dates', body: 'Confirm with a deposit; we hold stays & transport.' },
  { icon: ShieldCheck, title: 'Travel worry-free', body: '24/7 on-ground support throughout your trip.' },
];

const faqs = [
  {
    q: 'What is the minimum group size for a Meghalaya group tour?',
    a: 'XTSY runs group tours and group bookings for 6 to 60 travellers. Smaller crews of 4–5 can also be quoted — just share your dates and headcount on WhatsApp.',
  },
  {
    q: 'Do you offer group discounts and per-person rates?',
    a: 'Yes. Group tour packages, whole-dorm stays and corporate offsites are priced per person, with the rate improving as group size grows. Direct booking saves 20–30% versus OTAs.',
  },
  {
    q: 'Can you handle corporate offsites with GST invoicing?',
    a: 'Absolutely. Corporate offsites include conference space, AV, F&B and a proper GST invoice (GSTIN 17QSKPK1714H1ZE) raised on your company name for bookkeeping.',
  },
  {
    q: 'Can a whole group stay together at XTSY Travellers Hostel?',
    a: 'Yes — you can buy out an entire dormitory or book a block of rooms so your group stays together, with common areas reserved for your crew.',
  },
  {
    q: 'Do you arrange group catering for trips and events?',
    a: 'TAB Bistro by XTSY provides set menus, buffets and on-site catering for groups, with veg, non-veg and Jain options for offsites, college trips and celebrations.',
  },
  {
    q: 'How early should we book a group trip to Meghalaya?',
    a: 'Lock dates 4–8 weeks ahead in peak season (October–March). Off-season groups can usually confirm in 7–10 days, and last-minute bookings are handled on WhatsApp.',
  },
];

const GroupBookingsMeghalaya = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristTrip',
        name: 'Meghalaya Group Tours & Bookings by XTSY',
        description:
          'Custom group tour packages, corporate offsites, whole-dorm stays and group catering across Meghalaya for groups of 6–60.',
        touristType: ['Groups', 'Corporate', 'Students', 'Families'],
        provider: {
          '@type': 'TravelAgency',
          name: 'XTSY Travel',
          telephone: '+91 8837317070',
          areaServed: 'Meghalaya, Northeast India',
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: 'https://xtsy.one/group-bookings-meghalaya',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
          { '@type': 'ListItem', position: 2, name: 'Tours', item: 'https://xtsy.one/tours' },
          { '@type': 'ListItem', position: 3, name: 'Group Bookings Meghalaya', item: 'https://xtsy.one/group-bookings-meghalaya' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Meghalaya Group Tours & Bookings 2026 | XTSY</title>
        <meta
          name="description"
          content="Book Meghalaya group tours — whole-dorm stays, corporate offsites & custom packages for friends, colleges & teams of 6–60. Direct rates at XTSY, Shillong."
        />
        <meta
          name="keywords"
          content="meghalaya group tour, group tour packages, group travel packages, corporate tour packages, shillong group tour, group booking meghalaya, college trip meghalaya, team outing shillong"
        />
        <link rel="canonical" href="https://xtsy.one/group-bookings-meghalaya" />
        <meta property="og:title" content="Meghalaya Group Tours & Bookings 2026 | XTSY" />
        <meta property="og:description" content="Custom group tour packages, corporate offsites, whole-dorm stays & group catering across Meghalaya for groups of 6–60." />
        <meta property="og:url" content="https://xtsy.one/group-bookings-meghalaya" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 max-w-5xl py-12">
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Tours', href: '/tours' },
              { label: 'Group Bookings' },
            ]} />
            <span className="mt-6 inline-flex items-center gap-2 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              <Users className="h-3.5 w-3.5" /> Groups of 6–60 · Friends · Colleges · Corporates
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Meghalaya Group Tours & Bookings
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              One team for your whole group trip — custom <strong>group tour packages</strong>,
              corporate offsites, whole-dorm stays at XTSY Travellers Hostel and group catering by
              TAB Bistro. Stays, transport, permits and guides handled end-to-end in Meghalaya.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="min-h-[48px] text-base">
                <a href={GROUP_CTA} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Get a Group Quote
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-h-[48px] text-base">
                <Link to="/book">Book a Group Stay</Link>
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Quote within ~1 hour · Per-person group rates · Direct booking saves 20–30% vs OTAs
            </p>
          </div>
        </section>

        {/* Branches */}
        <section className="container mx-auto px-4 max-w-5xl py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Everything your group needs, in one place
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {branches.map((b) => (
              <div key={b.title} className="rounded-xl border border-border p-6 hover:border-primary/40 transition-colors flex flex-col">
                <b.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{b.body}</p>
                <ul className="mt-4 space-y-2">
                  {b.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  {b.external ? (
                    <Button asChild variant="secondary" className="min-h-[48px] w-full">
                      <a href={b.to} target="_blank" rel="noopener noreferrer">{b.cta}</a>
                    </Button>
                  ) : (
                    <Button asChild variant="secondary" className="min-h-[48px] w-full">
                      <Link to={b.to}>{b.cta}</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">How group booking works</h2>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <div key={s.title} className="rounded-xl bg-background border border-border p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {i + 1}
                    </span>
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 max-w-3xl py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Group booking FAQs</h2>
          <div className="mt-6 space-y-5">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground">{f.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-primary/10">
          <div className="container mx-auto px-4 max-w-3xl py-14 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Planning a group trip to Meghalaya?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Tell us your group size and dates — get a transparent per-person quote within an hour.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="min-h-[48px] text-base">
                <a href={GROUP_CTA} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Get a Group Quote on WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-h-[48px] text-base">
                <Link to="/contact">Contact the Team</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GroupBookingsMeghalaya;
