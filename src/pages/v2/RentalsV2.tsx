/**
 * /xtsy-rentals — car & bike rentals from Shillong (redesign). Rates unchanged.
 */
import { useState } from 'react';
import { Helmet } from '@/lib/seo/helmet';
import SEOHead from '@/components/SEOHead';
import { IMG } from '@/data/v2Images';
import { inr } from '@/components/v2/pricing';
import { PageShell, PageHero, Btn, Section, H2, FeatureCards, FaqList } from '@/components/v2/blocks';
import { Photo, waLink } from '@/components/v2/primitives';

type Vehicle = { name: string; price: number; tag: string; specs: string[]; badge?: string };

const CARS: Vehicle[] = [
  { name: 'Hyundai i10 Nios', price: 1800, tag: 'City Hatchback', specs: ['Petrol', 'Manual', '5 seats'] },
  { name: 'Tata Punch', price: 2000, tag: 'Compact SUV', specs: ['Petrol', 'Manual', '5 seats'] },
  { name: 'Tata Indica', price: 2000, tag: 'Hatchback', specs: ['Diesel', 'Manual', '5 seats'] },
  { name: 'Hyundai i20', price: 2000, tag: 'Premium Hatchback', specs: ['Petrol', 'Manual/Auto', '5 seats'] },
  { name: 'Kia Sonet', price: 2500, tag: 'Compact Crossover', specs: ['Petrol/Diesel', 'Manual/Auto', '5 seats'] },
  { name: 'Kia Seltos', price: 2800, tag: 'Crossover SUV', specs: ['Petrol/Diesel', 'Auto', '5 seats'] },
  { name: 'Mahindra Thar', price: 3800, tag: 'Off-Road SUV', specs: ['Diesel', 'Manual/Auto', '4 seats'] },
  { name: 'Mahindra Scorpio', price: 4000, tag: 'Full-Size SUV', specs: ['Diesel', 'Manual', '7 seats'] },
  { name: 'Mahindra XUV 700', price: 4500, tag: 'Premium SUV', specs: ['Diesel/Petrol', 'Auto', '7 seats'], badge: 'Top End 2025' },
];

const BIKES: Vehicle[] = [
  { name: 'RE Meteor 350', price: 1300, tag: 'Cruiser', specs: ['350cc', '42 km/l'] },
  { name: 'RE Himalayan 411', price: 1300, tag: 'Adventure', specs: ['411cc', '35 km/l'] },
  { name: 'RE Hunter 350', price: 1600, tag: 'Roadster', specs: ['350cc', '40 km/l'] },
  { name: 'RE Himalayan 450', price: 1800, tag: 'Adventure', specs: ['450cc', '30 km/l'], badge: 'New 2024' },
];

const FAQS = [
  { q: 'What documents are required for renting?', a: 'Valid driving license, government ID proof (Aadhaar/Passport), and a security deposit. For bikes, a motorcycle endorsement on your license is required.' },
  { q: 'What is the fuel policy?', a: "Vehicles are provided with a full tank. Please return with a full tank or we'll charge ₹150/litre above market price." },
  { q: 'Is a driver available?', a: 'Yes! We provide experienced local drivers at ₹800-1200/day extra depending on the vehicle. They know all the scenic routes and hidden spots.' },
  { q: 'What about inter-state travel?', a: 'Inter-state travel is allowed with prior approval. Additional permits may be required for certain states like Arunachal Pradesh (ILP).' },
  { q: 'What is the cancellation policy?', a: 'The booking amount is non-refundable — there is no free cancellation. You can change the pickup date once, subject to availability. No refund for no-shows. The security deposit is refunded when the vehicle is returned.' },
  { q: 'Is there a minimum rental period?', a: 'Minimum rental is 1 day (24 hours). Weekly and monthly discounts available - contact us for special rates.' },
];

const bookText = (v: Vehicle) => `Hi! I'd like to rent:\n\nVehicle: ${v.name}\nRate: ${inr(v.price)}/day\nDates: [Please specify]\nPickup: New Shillong Township\n\nPlease confirm availability.`;

export default function RentalsV2() {
  const [tab, setTab] = useState<'cars' | 'bikes'>('cars');
  const list = tab === 'cars' ? CARS : BIKES;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: 'XTSY Rentals',
    url: 'https://xtsy.one/xtsy-rentals',
    telephone: '+918837317070',
    priceRange: '₹1,300 - ₹4,500 per day',
    address: { '@type': 'PostalAddress', streetAddress: 'Mawdiangdiang Road, New Shillong Township', addressLocality: 'Shillong', addressRegion: 'Meghalaya', postalCode: '793018', addressCountry: 'IN' },
  };
  return (
    <>
      <SEOHead
        title="XTSY Rentals - Car & Bike Rentals in Shillong | Explore Northeast India"
        description="Explore Northeast India at your own pace. 9 cars and 4 Royal Enfield bikes from Shillong. Fully insured, 24/7 support. Starting ₹1,300/day."
        keywords="bike rental shillong, car rental shillong, royal enfield rental meghalaya, self drive car shillong"
        canonicalUrl="https://xtsy.one/xtsy-rentals"
      />
      <Helmet><script type="application/ld+json">{JSON.stringify(ld)}</script></Helmet>
      <PageShell bar={{ label: 'Get a quote', to: waLink('Hi XTSY! I want to rent a vehicle. Dates: …'), note: 'Cars & Royal Enfields' }} cta={{ title: 'Keys, route, go.', sub: 'Tell us the vehicle and your dates on WhatsApp. We’ll confirm availability.', bookTo: '/expeditions', bookLabel: 'See expedition routes' }}>
        <PageHero
          bg="#1F2230"
          fg="#F5EFE6"
          muted="#C9CDD8"
          eyebrowColor="#E07A8B"
          eyebrow="XTSY Rentals · Cars & Royal Enfields from Shillong"
          title="Your wheels for the Northeast."
          text={`9 cars and 4 Royal Enfield bikes, from ${inr(1300)} a day. Fully insured, 24/7 roadside support and local drivers on request. Pick up at XTSY in New Shillong Township.`}
          actions={<><Btn to="#fleet">See the fleet</Btn><Btn to={waLink('Hi XTSY! I want to rent a vehicle. Dates: …')} kind="outline-light">Ask on WhatsApp</Btn></>}
          media={<Photo src={IMG.bumla} alt="Royal Enfield on a Northeast expedition" eager tone="night" className="aspect-[628/520] rounded-[32px]" />}
        />

        <Section id="fleet">
          <H2 eyebrow="Per day · fuel extra">The fleet</H2>
          <div role="tablist" aria-label="Vehicle type" className="flex gap-2">
            {(['cars', 'bikes'] as const).map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`xt-chip h-12 rounded-full border-[1.5px] px-6 text-[15px] font-extrabold ${tab === t ? 'border-xt-slate bg-xt-slate text-xt-paper' : 'border-xt-stone text-xt-ink'}`}>
                {t === 'cars' ? `Cars · ${CARS.length}` : `Bikes · ${BIKES.length}`}
              </button>
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((v) => (
              <article key={v.name} className="xt-reveal xt-lift relative flex flex-col gap-3 rounded-3xl bg-white p-7">
                {v.badge && <span className="absolute right-5 top-5 rounded-full bg-xt-blush px-3 py-1 text-[12px] font-extrabold text-xt-crimson-dark">{v.badge}</span>}
                <span className="text-[13px] font-extrabold uppercase tracking-wider text-xt-mute">{v.tag}</span>
                <h3 className="m-0 text-[24px] font-extrabold leading-tight">{v.name}</h3>
                <div className="flex flex-wrap gap-1.5">{v.specs.map((s) => <span key={s} className="rounded-full bg-xt-sand px-3 py-1 text-[13px] font-bold">{s}</span>)}</div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                  <span className="text-[22px] font-extrabold">{inr(v.price)}<span className="text-[13px] font-semibold text-xt-mute">/day</span></span>
                  <Btn to={waLink(bookText(v))} className="h-11 px-5 text-[14px]">Book on WhatsApp</Btn>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section className="bg-xt-cream">
          <H2 eyebrow="Every rental">Included</H2>
          <FeatureCards items={[
            { t: 'Fully insured', d: 'Comprehensive insurance on all vehicles.' },
            { t: '24/7 support', d: 'Round-the-clock roadside assistance.' },
            { t: 'Free delivery', d: 'Vehicle delivery at your doorstep.' },
            { t: 'Driver available', d: 'Experienced local drivers on request.' },
          ]} />
        </Section>

        <FaqList faqs={FAQS} />
      </PageShell>
    </>
  );
}
