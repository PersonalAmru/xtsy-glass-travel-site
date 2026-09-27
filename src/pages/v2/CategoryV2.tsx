import { destinationPath } from '@/data/neTaxonomy';
import { Link, useLocation } from '@/lib/router-compat';
import NotFound from '@/pages/NotFound';
import { Helmet } from 'react-helmet-async';
import { inr, lowestDormPrice } from '@/components/v2/pricing';
import { PageShell, PageHero, Breadcrumbs, Btn, PAD } from '@/components/v2/blocks';
import { Photo } from '@/components/v2/primitives';
import {
  destinationCategories,
  getDestinationsByCategory,
  getDestinationImages,
} from '@/data/meghalayaDestinations';

/**
 * /meghalaya-waterfalls, -caves, -villages, -viewpoints — category guides (redesign).
 */
const CategoryV2 = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/|\/$/g, '');
  const category = destinationCategories.find(c => c.slug === slug);

  if (!category) {
    return <NotFound />;
  }

  const destinations = getDestinationsByCategory(category.category);
  const singular = category.category; // e.g. "waterfall"
  const lcName = category.name.toLowerCase(); // e.g. "waterfalls"
  const names = destinations.map(d => d.name);
  const ogImage = destinations[0] ? getDestinationImages(destinations[0].slug, 1)[0]?.src : undefined;

  const pageTitle = `Best ${category.name} in Meghalaya — Travel Guide 2026`;
  const canonical = `https://xtsy.one/${category.slug}`;

  // Visible FAQs backed by FAQPage schema (answers must be on-page for the rich result).
  const faqs: { q: string; a: string }[] = [
    {
      q: `How many ${lcName} are there to visit in Meghalaya?`,
      a: `This guide covers ${destinations.length} of the most popular ${lcName} in Meghalaya${names.length ? `, including ${names.slice(0, 4).join(', ')}` : ''}. There are many more across the Khasi, Jaintia and Garo Hills, but these are the most rewarding and accessible for first-time visitors.`,
    },
    {
      q: `What is the best time to visit ${lcName} in Meghalaya?`,
      a: `For full water flow and dramatic, mist-filled landscapes, visit during and just after the monsoon (June to September). For clear skies, comfortable trekking and the best views, plan your trip between October and March.`,
    },
    {
      q: `Where should I stay to explore Meghalaya's ${lcName}?`,
      a: `Shillong is the ideal base — most ${lcName} are within a day trip. XTSY Travellers Hostel offers dorms from ${inr(lowestDormPrice())}/night, Experience by XTSY, and curated Meghalaya tours that cover the region's top ${lcName} and viewpoints.`,
    },
    {
      q: `Can I cover Meghalaya's top ${lcName} on a tour package?`,
      a: `Yes. XTSY's curated Meghalaya tour packages bundle transport, a local guide and the best ${lcName}, waterfalls, living root bridges and viewpoints into a single trip — booking direct saves up to 30% versus marketplace prices.`,
    },
    ...(category.extraFaqs ?? []),
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Things to Do in Meghalaya', item: 'https://xtsy.one/things-to-do-in-meghalaya' },
      { '@type': 'ListItem', position: 3, name: `Meghalaya ${category.name}`, item: canonical },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${category.name} in Meghalaya`,
    description: category.description,
    itemListElement: destinations.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: d.name,
      url: `https://xtsy.one${destinationPath(d.slug)}`,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const hero = ogImage && !ogImage.endsWith('placeholder.svg') ? ogImage : '';
  const related = [
    { to: '/meghalaya-waterfalls', label: 'Waterfalls in Meghalaya' },
    { to: '/meghalaya-viewpoints', label: 'Viewpoints in Meghalaya' },
    { to: '/things-to-do-in-meghalaya', label: 'Things to Do in Meghalaya' },
    { to: '/meghalaya-tour-packages', label: 'Meghalaya Tour Packages' },
    { to: '/best-time-to-visit-meghalaya', label: 'Best Time to Visit' },
    { to: '/meghalaya-travel-guide', label: 'Meghalaya Travel Guide' },
    { to: '/best-hostel-in-shillong', label: 'Best Hostel in Shillong' },
    { to: '/tours', label: 'Northeast India Tours' },
    { to: '/meghalaya-photo-gallery', label: 'Photo Gallery' },
  ];

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={category.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={category.description} />
        <meta property="og:url" content={canonical} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <PageShell cta={{ title: `Chase ${lcName} from the pines.`, sub: 'Stay at XTSY in New Shillong and our travel desk will line up the day with a local driver.', bookTo: '/meghalaya-tour-packages', bookLabel: 'View tour packages' }}>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Things to do', to: '/things-to-do-in-meghalaya' }, { label: `Meghalaya ${category.name}` }]} />
        <PageHero
          bg="#2F4A3F"
          fg="#EAF0EA"
          muted="#C8D6CC"
          eyebrowColor="#F2B8C2"
          size="md"
          eyebrow={`Meghalaya guide · ${destinations.length} ${lcName}`}
          title={<>Best {category.name} in Meghalaya</>}
          text={category.description}
          actions={<><Btn to="#list">See all {destinations.length}</Btn><Btn to="/meghalaya-tour-packages" kind="outline-light">Tour packages</Btn></>}
          media={<Photo src={hero} alt={destinations[0]?.name ?? category.name} eager tone="pine" className="aspect-[628/480] rounded-[32px]" />}
        />

        <section className={`${PAD} py-10`}>
          <p className="m-0 max-w-[860px] text-[17px] leading-relaxed text-xt-mute">
            Meghalaya — the wettest place on Earth — is home to some of India's most spectacular {lcName}. Below are {destinations.length} of the best {lcName} to add to your itinerary, each with a complete travel guide covering how to reach, the best time to visit, entry details and insider tips. Most are an easy day trip from Shillong, where{' '}
            <Link to="/best-hostel-in-shillong" className="font-bold text-xt-crimson">XTSY Travellers Hostel</Link> in New Shillong Township makes a comfortable, affordable base.
          </p>
        </section>

        <section id="list" className={`${PAD} grid scroll-mt-28 gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3`}>
          {destinations.map((d) => {
            const img = getDestinationImages(d.slug, 1)[0];
            return (
              <Link key={d.slug} to={destinationPath(d.slug)} className="xt-reveal xt-lift flex flex-col overflow-hidden rounded-3xl bg-white text-xt-ink hover:text-xt-ink">
                <Photo src={img && !img.src.endsWith('placeholder.svg') ? img.src : ''} alt={d.name} tone="pine" className="aspect-[421/260]" />
                <div className="flex flex-col gap-2 p-6">
                  <span className="text-[13px] font-extrabold uppercase tracking-wider text-xt-crimson">{d.region}</span>
                  <span className="text-[20px] font-extrabold leading-tight">{d.name}</span>
                  <span className="line-clamp-3 text-[15px] text-xt-mute">{d.shortDescription}</span>
                </div>
              </Link>
            );
          })}
        </section>

        {category.seoContent && category.seoContent.length > 0 && (
          <section className={`${PAD} grid gap-8 pb-16 lg:grid-cols-2`}>
            {category.seoContent.map(({ heading, body }) => (
              <article key={heading} className="xt-reveal flex flex-col gap-3 rounded-3xl bg-white p-8">
                <h2 className="xt-display m-0 text-[34px] leading-none">{heading}</h2>
                <p className="m-0 text-[16px] leading-relaxed text-xt-mute">{body}</p>
              </article>
            ))}
          </section>
        )}

        <section className={`${PAD} grid gap-10 pb-14 lg:grid-cols-12`}>
          <h2 className="xt-display m-0 text-[40px] leading-none sm:text-[52px] lg:col-span-4">Meghalaya {category.name} — FAQs</h2>
          <div className="flex flex-col gap-3 lg:col-span-8">
            {faqs.map(({ q, a }) => (
              <div key={q} className="xt-reveal rounded-[18px] bg-white p-6">
                <h3 className="m-0 text-[17px] font-extrabold">{q}</h3>
                <p className="m-0 mt-2 text-[15px] leading-relaxed text-xt-mute">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <nav aria-label="Related guides" className={`${PAD} flex flex-col gap-4 pb-12`}>
          <h2 className="m-0 text-[18px] font-extrabold">Related guides</h2>
          <div className="flex flex-wrap gap-2">
            {related.filter((l) => l.to !== `/${category.slug}`).map((l) => (
              <Link key={l.to} to={l.to} className="rounded-full border-[1.5px] border-xt-stone px-4 py-2 text-[14px] font-bold text-xt-ink hover:text-xt-crimson">{l.label}</Link>
            ))}
          </div>
        </nav>
      </PageShell>
    </>
  );
};

export default CategoryV2;
