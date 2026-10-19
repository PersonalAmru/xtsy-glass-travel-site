/**
 * /tab-bistro — TAB Bistro by XTSY (redesign) with the full official menu.
 */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '@/components/SEOHead';
import { Link } from '@/lib/router-compat';
import { menuSections } from '@/data/tabBistroMenu';
import { tabBistroFaqs } from '@/components/tab-bistro/TabBistroFAQ';
import { useRestaurantReviews } from '@/hooks/useRestaurantReviews';
import { buildRestaurantSchema, buildMenuSchema } from '@/data/tabBistroSchema';
import { IMG, first } from '@/data/v2Images';
import { PageShell, PageHero, Btn, Section, H2, FaqList, PAD } from '@/components/v2/blocks';
import { Photo, Marquee, Eyebrow, waLink } from '@/components/v2/primitives';
import { TableBookingForm } from '@/components/v2/TableBookingForm';

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=TAB+Bistro+by+XTSY+Mawdiangdiang+New+Shillong+Township';

export default function BistroV2() {
  const { reviews, stats } = useRestaurantReviews();
  const [section, setSection] = useState(menuSections[0]?.id ?? '');
  const current = menuSections.find((s) => s.id === section) ?? menuSections[0];
  const restaurantSchema = buildRestaurantSchema({
    ratingValue: stats.average || undefined,
    reviewCount: stats.count || undefined,
    reviews: reviews.map((r) => ({ name: r.name, rating: r.rating, comment: r.comment, date: r.isoDate.slice(0, 10) })),
  });
  const topReviews = reviews.filter((r) => r.rating >= 4 && r.comment.length > 30).slice(0, 3);
  const reserve = waLink('Hi TAB Bistro! I’d like to reserve a table. Date/time: … People: …');

  return (
    <>
      <SEOHead
        structuredDataOnly
        title="TAB Bistro Shillong — Restaurant, Café & Catering"
        description="TAB Bistro by XTSY — multi-cuisine restaurant in New Shillong Township: North Indian, Chinese, Thai, Continental, Italian, breakfast and café, catering and bulk orders. Open 9 AM–10:30 PM."
        canonicalUrl="https://xtsy.one/tab-bistro"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(restaurantSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(buildMenuSchema())}</script>
      </Helmet>
      <PageShell bar={{ label: 'Book a table', to: '#book-a-table', note: 'TAB Bistro · Open 9 AM – 10:30 PM' }} cta={{ title: 'Hungry? We’re open till 10:30.', sub: 'Book a table online or order on WhatsApp. Staying at XTSY? Breakfast is a short walk away.', bookTo: '/book', bookLabel: 'Stay at XTSY' }}>
        <PageHero
          bg="#2F4A3F"
          fg="#EAF0EA"
          muted="#C8D6CC"
          eyebrowColor="#F2B8C2"
          eyebrow="TAB Bistro by XTSY · New Shillong Township"
          title="Forest dining under the pines."
          text={
            <>
              <p className="m-0">North Indian, Indo-Chinese, Thai, Continental, Italian and Northeast plates, all-day café and a Wi-Fi-friendly table if you need to work.</p>
              <p className="m-0 mt-5 flex items-center gap-2.5 text-[16px] font-bold text-[#EAF0EA]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                Open daily · 9 AM – 10:30 PM
              </p>
            </>
          }
          actions={<><Btn to="#book-a-table">Book a table</Btn><Btn to="#menu" kind="outline-light">View the menu</Btn><Btn to={reserve} kind="outline-light">WhatsApp us</Btn></>}
          media={
            <div className="relative">
              <Photo src={first(IMG.bistro)} alt="TAB Bistro by XTSY" eager tone="sand" className="aspect-[628/600] rounded-[32px]" />
              <div className="xt-float absolute right-6 top-6 rounded-xl bg-xt-ink px-4 py-3 font-display text-[18px] tracking-[0.1em] text-xt-paper">Rooftop terrace · café coming soon</div>
            </div>
          }
        />
        <Marquee className="bg-xt-cream text-xt-pine" markFill="#A12444" words={['North Indian', 'Indo-Chinese', 'Thai', 'Continental', 'Italian', 'Northeast Indian', 'Tandoor', 'All-day café']} />

        <Section id="menu">
          <H2 eyebrow="The menu">What’s cooking</H2>
          <div role="tablist" aria-label="Menu sections" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {menuSections.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={s.id === section}
                onClick={() => setSection(s.id)}
                className={`xt-chip h-11 shrink-0 rounded-full border-[1.5px] px-5 text-[15px] font-bold ${s.id === section ? 'border-xt-pine bg-xt-pine text-[#EAF0EA]' : 'border-xt-stone bg-transparent text-xt-ink'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {current?.categories.map((c, i) => (
              <div key={c.title} className="xt-pop flex flex-col gap-3 rounded-3xl bg-white p-7" style={{ animationDelay: `${i * 0.05}s` }}>
                <h3 className="m-0 text-[20px] font-extrabold">{c.title}</h3>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {c.items.map((it) => (
                    <li key={it.name} className="flex items-baseline justify-between gap-3 border-b border-dashed border-xt-line pb-2 text-[15px] last:border-0">
                      <span>{it.name}</span>
                      <span className="whitespace-nowrap font-extrabold text-xt-crimson">{it.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="m-0 text-[13px] text-xt-mute">Prices in INR from the official TAB Bistro menu. Taxes as applicable.</p>
        </Section>

        <Section id="book-a-table" className="scroll-mt-24 pt-0">
          <TableBookingForm />
        </Section>


        <section className={`${PAD} grid gap-6 pb-20 md:grid-cols-3`}>
          {[
            { t: 'In the pines', d: 'Tables among the trees of New Shillong, a few steps from the hostel.' },
            { t: 'Laptop-friendly', d: 'Wi-Fi and plugs for remote workers, from breakfast to dinner.' },
            { t: 'Rooftop deck soon', d: 'A dining deck with panoramic views is on the way.' },
          ].map((y) => (
            <div key={y.t} className="xt-reveal flex flex-col gap-2.5 rounded-3xl bg-xt-cream p-8">
              <h3 className="xt-display m-0 text-[34px] leading-none">{y.t}</h3>
              <p className="m-0 text-[16px] leading-normal text-xt-mute">{y.d}</p>
            </div>
          ))}
        </section>

        <section className={`${PAD} pb-20`}>
          <div className="grid items-center gap-10 rounded-[32px] bg-xt-ink p-8 text-xt-paper sm:p-14 lg:grid-cols-2">
            <div className="xt-reveal flex flex-col gap-4">
              <Eyebrow light>Catering &amp; events</Eyebrow>
              <h2 className="xt-display m-0 text-[44px] leading-[0.95] sm:text-[64px]">Weddings, offices and big birthdays</h2>
              <p className="m-0 text-[17px] leading-relaxed text-xt-fog">Multi-cuisine buffets, custom menus and live stations, cooked by the TAB kitchen and served wherever you need us.</p>
              <div className="flex flex-wrap gap-3">
                <Btn to="/tab-bistro/catering">Plan an event</Btn>
                <Btn to="/destination-wedding-shillong" kind="outline-light">Wedding catering</Btn>
              </div>
            </div>
            <Photo src={IMG.bistro[1] ?? first(IMG.bistro)} alt="TAB Bistro dining" tone="crimson" className="xt-reveal aspect-[560/380] rounded-3xl" />
          </div>
        </section>

        {topReviews.length > 0 && (
          <Section className="pt-0">
            <H2 eyebrow="Diners say">{stats.average ? `${stats.average.toFixed(1)} from ${stats.count} diners` : 'What diners say'}</H2>
            <div className="grid gap-5 md:grid-cols-3">
              {topReviews.map((r) => (
                <figure key={`${r.name}-${r.isoDate}`} className="xt-reveal m-0 flex flex-col gap-3 rounded-3xl bg-white p-7">
                  <div aria-label={`${r.rating} out of 5 stars`} className="text-[18px] tracking-[3px] text-xt-crimson">{'★'.repeat(Math.round(r.rating))}</div>
                  <blockquote className="m-0 line-clamp-6 text-[16px] leading-normal">{r.comment}</blockquote>
                  <figcaption className="mt-auto text-[14px] font-bold text-xt-mute">{r.name} · {r.date}</figcaption>
                </figure>
              ))}
            </div>
          </Section>
        )}

        <section className={`${PAD} grid gap-6 md:grid-cols-2`}>
          <div className="xt-reveal flex flex-col gap-3.5 rounded-3xl bg-white p-8 sm:p-10">
            <h2 className="xt-display m-0 text-[44px] leading-none sm:text-[48px]">Find us</h2>
            <p className="m-0 text-[17px] leading-relaxed">Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya – 793018 (at XTSY Travellers Hostel)</p>
            <p className="m-0 text-[17px]">9 AM – 10:30 PM, every day</p>
            <p className="m-0 text-[17px]"><a href="tel:+918837317070" className="font-bold text-xt-crimson">+91 88373 17070</a></p>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-[15px] font-extrabold text-xt-crimson">Get directions →</a>
          </div>
          <div className="xt-reveal flex flex-col justify-center gap-3 rounded-3xl bg-xt-cream p-8 sm:p-10">
            <h2 className="xt-display m-0 text-[36px] leading-none">More from the kitchen</h2>
            <Link to="/tab-bistro/catering" className="text-[16px] font-extrabold hover:text-xt-crimson">Catering & bulk orders →</Link>
            <Link to="/restaurant-in-shillong" className="text-[16px] font-extrabold hover:text-xt-crimson">Restaurant in Shillong guide →</Link>
            <Link to="/destination-wedding-shillong" className="text-[16px] font-extrabold hover:text-xt-crimson">Destination weddings →</Link>
          </div>
        </section>

        <FaqList faqs={tabBistroFaqs} />
      </PageShell>
    </>
  );
}
