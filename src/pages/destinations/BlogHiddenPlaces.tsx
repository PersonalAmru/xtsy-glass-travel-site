import { Link } from '@/lib/router-compat';
import { Helmet } from '@/lib/seo/helmet';
import PageFaqs from '@/components/seo/PageFaqs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import PlanTripLinks from '@/components/PlanTripLinks';
import DestinationCard from '@/components/destinations/DestinationCard';
import { meghalayaDestinations } from '@/data/meghalayaDestinations';

const hiddenSlugs = ['wah-rilang-viewpoint', 'phe-phe-falls', 'nongkhnum-island', 'ranikor', 'shnongpdeng', 'nongjrong-sunrise-viewpoint', 'mawthadraishan-peak', 'jakrem-hot-springs'];
const hidden = hiddenSlugs.map(s => meghalayaDestinations.find(d => d.slug === s)).filter(Boolean) as typeof meghalayaDestinations;

const BlogHiddenPlaces = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Hidden Places in Meghalaya — 8 Secret Destinations You Must Visit</title>
      <meta name="description" content="Discover Meghalaya's best-kept secrets — hidden waterfalls, offbeat viewpoints, and unexplored villages that most tourists miss. Curated by XTSY." />
      <link rel="canonical" href="https://xtsy.one/hidden-places-in-meghalaya" />
    </Helmet>
    <Header />
    <main className="pt-20">
      <div className="container mx-auto px-4 max-w-5xl py-12">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Things to Do', href: '/things-to-do-in-meghalaya' }, { label: 'Hidden Places' }]} />
        <h1 className="mt-6 text-3xl md:text-4xl font-bold text-foreground">Hidden Places in Meghalaya: 8 Secret Destinations</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-3xl">
          Beyond Dawki and Cherrapunji lies a Meghalaya that most travelers never see. These offbeat destinations offer untouched beauty, fewer crowds, and experiences that feel genuinely exclusive.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hidden.map(d => <DestinationCard key={d.slug} destination={d} />)}
        </div>
        <section className="mt-12 bg-primary/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">Explore Off-the-Beaten-Path Meghalaya</h2>
          <Link to="/meghalaya-tour-packages" className="mt-4 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">View Tour Packages</Link>
        </section>
        <nav className="mt-8 border-t border-border pt-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">All Places to Visit</Link>
            <Link to="/best-time-to-visit-meghalaya" className="text-sm text-primary hover:underline">Best Time to Visit</Link>
            <Link to="/budget-trip-to-meghalaya" className="text-sm text-primary hover:underline">Budget Trip Guide</Link>
          </div>
        </nav>
        <PlanTripLinks
          source="hidden-places-in-meghalaya"
          heading="Explore the hidden gems — book your base"
          bookingAnchor="Stay in Shillong and reach these offbeat spots easily — dorm beds from ₹399, private rooms & glamping"
          slugs={['laitlum-canyons', 'wei-sawdong-falls', 'mawphlang-sacred-forest', 'phe-phe-falls']}
        />
      </div>
        <div className="container mx-auto px-4 max-w-5xl pb-12">
        <PageFaqs
          faqs={[
          { q: "Which offbeat places in Meghalaya are worth the detour?", a: "Laitlum Canyons for the cliff views, Wei Sawdong for its three-tier falls down a steep bamboo ladder, Mawphlang Sacred Forest for Khasi monoliths and old-growth trees, Phe Phe Falls in the Jaintia Hills, and Krang Suri for its turquoise pool. All are day trips from Shillong." },
          { q: "Are these places reachable without a car?", a: "Most are not reachable by regular public transport. Shared taxis serve the main towns, but the last stretch to viewpoints and falls usually needs a hired vehicle. The XTSY desk arranges cabs and can group travellers heading the same way." },
          { q: "Do offbeat spots in Meghalaya charge entry fees?", a: "Many are run by the village community and charge a small entry or parking fee, typically \u20b920-100 per person, often collected in cash. Carry small notes, as mobile networks and UPI are unreliable away from the main roads." },
          { q: "Is it safe to visit remote spots in Meghalaya?", a: "Generally yes, but go early, tell someone your plan, and come back before dark; the roads have no lighting and mist falls quickly. Several trails, including Wei Sawdong, involve steep ladders and slippery rock in the monsoon. Hire a local guide where the village offers one." },
          { q: "What should I carry for a day of offbeat exploring?", a: "Shoes with grip, a rain layer in any season, cash in small notes, water and snacks, and a power bank. Network coverage drops outside the towns, so download offline maps before you leave Shillong." },
          ]}
        />
        </div>

    </main>
    <Footer />
  </div>
);

export default BlogHiddenPlaces;
