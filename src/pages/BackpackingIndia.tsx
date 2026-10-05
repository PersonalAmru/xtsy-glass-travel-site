import { memo } from 'react';
import { Link } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BookDirectComparison from '@/components/hostel/BookDirectComparison';
import HostelDealsFAQ from '@/components/hostel/HostelDealsFAQ';
import { hostelDealFaqEntities } from '@/data/hostelBookingFaqs';
import {
  Backpack, IndianRupee, Train, MapPin, CalendarCheck, MessageCircle,
  Bed, Check, Compass, Sun, Wallet, Shield,
} from 'lucide-react';

const CANONICAL = 'https://xtsy.one/backpacking-india';

const itinerary = [
  {
    label: 'Days 1–3 · Delhi → Rajasthan',
    detail: 'Land in Delhi, sleep in a dorm in Paharganj, then overnight sleeper to Jaipur or Jodhpur. Forts, street food, ₹1,200–1,500/day all-in.',
  },
  {
    label: 'Days 4–8 · Rajasthan → Varanasi',
    detail: 'Udaipur or Pushkar for slow days, then a sleeper train east to Varanasi for the ghats and evening aarti. Trains cost ₹400–900 in sleeper class.',
  },
  {
    label: 'Days 9–13 · Varanasi → Guwahati',
    detail: 'The classic hop east most backpackers skip. Train or a ₹3,000 budget flight into Guwahati (GAU) — the gateway to the entire Northeast.',
  },
  {
    label: 'Days 14–19 · Meghalaya (Shillong base)',
    detail: 'Base at XTSY Travellers Hostel in Shillong from ₹399/night. Day trips: Dawki’s clear Umngot river, Nohkalikai Falls, Krang Suri, Mawlynnong, Umiam Lake, living root bridges at Nongriat.',
  },
  {
    label: 'Days 20–25 · Meghalaya → Assam / Arunachal',
    detail: 'Kaziranga for rhinos, Majuli river island, or push to Ziro Valley. Shared Sumos connect everything for ₹300–700 a leg.',
  },
  {
    label: 'Days 26–30 · South loop or fly out',
    detail: 'Fly Guwahati → Goa/Kerala on a budget carrier for beaches and backwaters, or loop back to Delhi to close the circuit.',
  },
];

const budget = [
  { item: 'Hostel dorm bed', cost: '₹350–₹700 / night', note: 'XTSY dorms from ₹399 in Shillong' },
  { item: 'Street & local food', cost: '₹250–₹500 / day', note: 'Thalis, momos, chai' },
  { item: 'Sleeper trains', cost: '₹350–₹900 / leg', note: 'Book on IRCTC 30–60 days out' },
  { item: 'Shared Sumo / bus (Northeast)', cost: '₹300–₹700 / leg', note: 'Leaves when full, go early' },
  { item: 'Sights & activities', cost: '₹200–₹800 / day', note: 'Most waterfalls are ₹20–₹50 entry' },
  { item: 'SIM + data', cost: '₹300 / month', note: 'Airtel or Jio; carry passport copy' },
];

const tips = [
  { icon: Wallet, title: 'Realistic daily budget', text: '₹1,200–₹1,800 a day covers a dorm bed, three meals, local transport and one paid activity. ₹2,500+ if you take private cabs.' },
  { icon: Sun, title: 'Best months', text: 'October–April for most of India. For Meghalaya, October–May is peak and June–September monsoon is the greenest, cheapest and most dramatic.' },
  { icon: Train, title: 'Book trains early', text: 'IRCTC opens 60 days out. Sleeper class is the backpacker default; 3AC if you want to sleep properly on long hauls.' },
  { icon: Shield, title: 'Solo & female safety', text: 'Stick to verified hostels with lockers, CCTV and female-only dorms. Meghalaya is matrilineal and among the safest states in India for solo women.' },
  { icon: Compass, title: 'Go east, not just north', text: 'Everyone does Goa–Rajasthan–Rishikesh. The Northeast is cheaper, emptier and the single best value region left in India.' },
  { icon: MapPin, title: 'Base and day-trip', text: 'Instead of a new bed every night, base in one hostel for 4–6 days and day-trip out. Cheaper, less exhausting, and unlocks long-stay discounts.' },
];

const BackpackingIndia = memo(() => {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${CANONICAL}#article`,
    headline: 'Backpacking India: 30-Day Itinerary, Daily Budget & Hostel Guide',
    description:
      'A practical backpacking India guide — a 30-day route from Delhi to Meghalaya, real daily budgets in rupees, transport costs, and where to sleep from ₹399 a night.',
    url: CANONICAL,
    inLanguage: 'en-IN',
    about: ['Backpacking India', 'Budget travel India', 'Hostels in India', 'Northeast India travel'],
    author: { '@type': 'Organization', name: 'XTSY Travellers Hostel' },
    publisher: {
      '@type': 'Organization',
      name: 'XTSY Ventures Private Limited',
      url: 'https://xtsy.one/',
    },
  };

  const itinerarySchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '30-Day Backpacking India Itinerary',
    itemListElement: itinerary.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.label,
      description: s.detail,
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Backpacking India', item: CANONICAL },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How much does backpacking India cost per day?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Budget ₹1,200–₹1,800 (about $15–$22) per day for a hostel dorm bed, three local meals, shared transport and one paid activity. Northeast India, including Meghalaya, sits at the lower end — dorm beds start at ₹399 a night in Shillong.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long do you need to backpack India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Thirty days is the sweet spot for one region plus one long hop — for example Delhi, Rajasthan, Varanasi and then Meghalaya and Assam in the Northeast. Two weeks is enough for a single region; anything less and you spend most of it on trains.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Northeast India good for backpackers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — it is the best-value backpacking region in India right now. Meghalaya has living root bridges, Asia’s cleanest village, the clear Umngot river at Dawki and Nohkalikai Falls, with far fewer crowds than Goa or Rajasthan and dorm beds under ₹500.',
        },
      },
      ...hostelDealFaqEntities,
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Backpacking India: 30-Day Itinerary, Budget & Hostels | XTSY</title>
        <meta
          name="description"
          content="Backpacking India guide: a 30-day route from Delhi to Meghalaya, real daily budgets in rupees, train and Sumo costs, safety tips, and hostel beds from ₹399 a night."
        />
        <meta name="keywords" content="backpacking india, backpacking india itinerary, budget travel india, india backpacker hostels, northeast india backpacking, backpacking meghalaya" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Backpacking India: 30-Day Itinerary, Budget & Hostels" />
        <meta property="og:description" content="A practical backpacking India route, real daily costs in rupees, and where to sleep from ₹399 a night." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itinerarySchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />

      <main>
        {/* Hero */}
        <section className="relative pt-28 pb-16 px-4 bg-gradient-to-br from-primary/10 via-background to-brand-ember/10">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <Backpack className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Backpacker Guide · Updated 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground font-playfair mb-4">
              Backpacking India — 30-Day Itinerary, Real Budgets &amp; Where to Sleep
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              A route that actually works: Delhi to Rajasthan, east to Varanasi, then the part most travellers
              miss — Meghalaya and the Northeast. Honest rupee costs, transport that exists, and hostel beds
              from ₹399 a night.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/book"><CalendarCheck className="w-5 h-5 mr-2" aria-hidden="true" /> Book a Dorm Bed from ₹399</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/best-hostel-in-shillong">See the Shillong Hostel</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Itinerary */}
        <section className="py-14 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-foreground text-center">
              The 30-Day Backpacking India Itinerary
            </h2>
            <p className="mt-3 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
              Built around slow bases and cheap overland hops rather than a new city every night. Cut the first
              half if you are short on time and fly straight into Guwahati for the Northeast leg.
            </p>
            <ol className="mt-8 space-y-4">
              {itinerary.map((s, i) => (
                <li key={s.label} className="flex gap-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">{s.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Budget */}
        <section className="py-14 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-foreground text-center">
              What Backpacking India Actually Costs
            </h2>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Real 2026 numbers for a solo backpacker travelling on dorms, trains and street food.
            </p>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-border/60 bg-background">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Expense</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Typical cost</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.map((b) => (
                    <tr key={b.item} className="border-t border-border/50">
                      <td className="py-3 px-4 text-foreground font-medium">{b.item}</td>
                      <td className="py-3 px-4 text-foreground">{b.cost}</td>
                      <td className="py-3 px-4 text-muted-foreground">{b.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-center text-sm text-foreground font-medium flex items-center justify-center gap-2">
              <IndianRupee className="w-4 h-4 text-primary" aria-hidden="true" />
              Daily total: ₹1,200–₹1,800 (~$15–$22) travelling on dorms and shared transport.
            </p>
          </div>
        </section>

        {/* Tips */}
        <section className="py-14 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-foreground text-center mb-8">
              Budget Tips From People Who Live on the Route
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tips.map((t) => (
                <Card key={t.title} className="border-border/50">
                  <CardContent className="p-5">
                    <t.icon className="w-5 h-5 text-primary mb-2" aria-hidden="true" />
                    <h3 className="font-semibold text-sm text-foreground mb-1.5">{t.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Hostel stay CTA */}
        <section className="py-14 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold font-playfair text-foreground text-center">
              Where to Stay on the Northeast Leg
            </h2>
            <p className="mt-3 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
              XTSY Travellers Hostel in Shillong is the Northeast’s largest backpacker hostel and the natural
              base for Meghalaya — every major sight is a day trip away.
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                { name: '8-Bed Mixed Dorm', price: '₹399', note: 'Cheapest bed, best for long stays' },
                { name: '6-Bed Mixed Dorm', price: '₹469', note: 'More space, most popular with backpackers' },
                { name: 'Female-only Dorm', price: '₹550', note: 'Privacy curtains, keycard access' },
                { name: 'Private Double Room', price: '₹2,500', note: 'For couples and rest days' },
              ].map((r) => (
                <Card key={r.name} className="border-border/50 bg-background">
                  <CardContent className="p-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                        <Bed className="w-4 h-4 text-primary" aria-hidden="true" /> {r.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{r.note}</p>
                    </div>
                    <span className="text-lg font-bold text-primary whitespace-nowrap">{r.price}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ul className="mt-6 grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground max-w-2xl mx-auto">
              {['Free WiFi & work desks', 'Lockers at every bed', '24/7 reception & CCTV', 'TAB Bistro café on site', 'Tours and shared cabs booked in-house', 'Long-stay & group discounts'].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/book"><CalendarCheck className="w-5 h-5 mr-2" aria-hidden="true" /> Check Availability &amp; Book</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href="https://wa.me/918837317070?text=Hi%20XTSY%2C%20I%27m%20backpacking%20India%20and%20want%20to%20stay%20in%20Shillong"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" aria-hidden="true" /> WhatsApp us
                </a>
              </Button>
            </div>
          </div>
        </section>

        <BookDirectComparison />

        <HostelDealsFAQ className="bg-muted/30" />

        {/* Internal links */}
        <section className="py-14 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold font-playfair text-foreground mb-3">Plan the Meghalaya Leg</h2>
            <p className="text-sm text-muted-foreground">
              <Link to="/best-hostel-in-shillong" className="underline hover:text-primary">Best hostel in Shillong</Link>
              {' · '}<Link to="/hostel-booking" className="underline hover:text-primary">Hostel booking</Link>
              {' · '}<Link to="/hostel-near-me" className="underline hover:text-primary">Hostel near me</Link>
              {' · '}<Link to="/budget-trip-to-meghalaya" className="underline hover:text-primary">Budget trip to Meghalaya</Link>
              {' · '}<Link to="/best-time-to-visit-meghalaya" className="underline hover:text-primary">Best time to visit Meghalaya</Link>
              {' · '}<Link to="/5-day-meghalaya-itinerary" className="underline hover:text-primary">5-day Meghalaya itinerary</Link>
              {' · '}<Link to="/travel-guide/guwahati-to-shillong-transport" className="underline hover:text-primary">Guwahati to Shillong transport</Link>
              {' · '}<Link to="/places-to-visit-in-meghalaya" className="underline hover:text-primary">Places to visit in Meghalaya</Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
});

BackpackingIndia.displayName = 'BackpackingIndia';
export default BackpackingIndia;
