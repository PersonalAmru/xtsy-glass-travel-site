/**
 * /contact — Contact (redesign). Keeps every business detail the payment
 * gateway onboarding needs: address, phone, emails, GSTIN, support hours.
 */
import { useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from '@/lib/router-compat';
import { PageShell, PAD } from '@/components/v2/blocks';
import { SpinningMark, waLink, WHATSAPP_DISPLAY } from '@/components/v2/primitives';

const PHONE = '+91 8837317070';
const PHONE_TEL = '+918837317070';
const EMAIL = 'hello@xtsy.one';
const SUPPORT = 'support@xtsy.one';
const ADDRESS = 'XTSY Travellers Hostel, Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya – 793018, India';

const TOPICS = ['A room or dorm bed', 'Experience by XTSY', 'A tour package', 'Bike or car rental', 'Workation', 'TAB Bistro or catering', 'Something else'];

export default function ContactV2() {
  const [form, setForm] = useState({ name: '', phone: '', dates: '', topic: TOPICS[0], message: '' });
  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = `Hi XTSY! Enquiry from xtsy.one\nName: ${form.name}\nPhone: ${form.phone}\nDates: ${form.dates || 'Flexible'}\nAbout: ${form.topic}\n${form.message}`;
    window.open(waLink(text), '_blank', 'noopener');
  };
  const ways = [
    { k: 'WhatsApp', v: WHATSAPP_DISPLAY, cta: 'Chat now', href: waLink("Hi XTSY! I'd like to get in touch."), cls: 'bg-xt-crimson text-white' },
    { k: 'Call', v: PHONE, cta: 'Call us', href: `tel:${PHONE_TEL}`, cls: 'bg-white text-xt-ink' },
    { k: 'Email', v: EMAIL, cta: 'Write to us', href: `mailto:${EMAIL}`, cls: 'bg-white text-xt-ink' },
    { k: 'Instagram', v: '@xtsyhostel', cta: 'Follow', href: 'https://www.instagram.com/xtsyhostel', cls: 'bg-xt-slate text-xt-paper' },
  ];
  const input = 'h-12 w-full rounded-xl border-[1.5px] border-xt-line bg-white px-3.5 text-[15px] text-xt-ink focus:border-xt-crimson focus:outline-none';
  return (
    <>
      <Helmet>
        <title>Contact Us — XTSY | Support, Bookings & Enquiries</title>
        <meta name="description" content="Contact XTSY for bookings, support, partnerships and tour enquiries. Call or WhatsApp +91 8837317070, or email hello@xtsy.one. XTSY Travellers Hostel, New Shillong Township, Meghalaya." />
        <link rel="canonical" href="https://xtsy.one/contact" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact XTSY',
          url: 'https://xtsy.one/contact',
          mainEntity: {
            '@type': 'Organization',
            name: 'XTSY',
            url: 'https://xtsy.one',
            telephone: PHONE,
            email: EMAIL,
            address: { '@type': 'PostalAddress', streetAddress: 'Mawdiangdiang Road, New Shillong Township', addressLocality: 'Shillong', addressRegion: 'Meghalaya', postalCode: '793018', addressCountry: 'IN' },
            contactPoint: [
              { '@type': 'ContactPoint', telephone: PHONE, contactType: 'customer service', areaServed: 'IN', availableLanguage: ['English', 'Hindi'] },
              { '@type': 'ContactPoint', telephone: PHONE, contactType: 'reservations', areaServed: 'IN', availableLanguage: ['English', 'Hindi'] },
            ],
          },
        })}</script>
      </Helmet>
      <PageShell cta={false}>
        <section className={`${PAD} relative overflow-hidden bg-xt-cream py-16 lg:py-24`}>
          <SpinningMark className="-right-24 -top-24 h-[520px] w-[520px] opacity-[0.06]" />
          <div className="relative flex max-w-3xl flex-col gap-5">
            <div className="xt-in xt-eyebrow text-[15px] sm:text-[18px]">Contact · 24/7 travel support</div>
            <h1 className="xt-in xt-d1 xt-display m-0 text-[72px] leading-[0.86] sm:text-[120px]">Say hello.</h1>
            <p className="xt-in xt-d2 m-0 text-[17px] leading-relaxed text-xt-mute sm:text-[20px]">Rooms, tours, rentals, events or a table at TAB Bistro. WhatsApp is the fastest way to reach us, day or night.</p>
          </div>
          <div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ways.map((w) => (
              <a key={w.k} href={w.href} {...(/^https?:/.test(w.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={`xt-reveal xt-lift flex min-h-[170px] flex-col gap-2 rounded-3xl p-7 ${w.cls}`}>
                <span className="xt-display text-[30px] leading-none">{w.k}</span>
                <span className="break-all text-[15px] font-bold opacity-90">{w.v}</span>
                <span className="mt-auto text-[15px] font-extrabold">{w.cta} →</span>
              </a>
            ))}
          </div>
        </section>

        <section className={`${PAD} grid gap-10 py-16 lg:grid-cols-12 lg:py-24`}>
          <form onSubmit={send} className="xt-reveal flex flex-col gap-4 rounded-[28px] bg-white p-7 sm:p-10 lg:col-span-7">
            <h2 className="xt-display m-0 text-[40px] leading-none sm:text-[52px]">Send an enquiry</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute">NAME<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} autoComplete="name" /></label>
              <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute">PHONE OR WHATSAPP<input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} autoComplete="tel" /></label>
              <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute">DATES<input value={form.dates} placeholder="e.g. 12–16 Nov" onChange={(e) => setForm({ ...form, dates: e.target.value })} className={input} /></label>
              <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute">ABOUT
                <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className={input}>
                  {TOPICS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
            </div>
            <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute">MESSAGE<textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${input} h-auto py-3`} /></label>
            <button type="submit" className="xt-btn h-14 rounded-full bg-xt-crimson text-[16px] font-extrabold text-white">Send enquiry on WhatsApp</button>
            <p className="m-0 text-[13px] text-xt-mute">Your message opens in WhatsApp so our team can reply straight away.</p>
          </form>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="xt-reveal flex flex-col gap-3 rounded-[28px] bg-xt-slate p-8 text-xt-paper">
              <h2 className="xt-display m-0 text-[36px] leading-none">Getting here</h2>
              <p className="m-0 text-[15px] leading-relaxed text-xt-fog">{ADDRESS}. Near NIFT Shillong, IIM Shillong, NEIGRIMS, NEIAH and Martin Luther Christian University. About 2.5–3 hours by road from Guwahati airport.</p>
              <Link to="/travel-guide/how-to-reach-meghalaya" className="text-[15px] font-extrabold text-xt-rose">How to reach Shillong →</Link>
            </div>
            <dl className="xt-reveal m-0 grid gap-4 rounded-[28px] border-[1.5px] border-xt-line p-8 text-[15px]">
              <div><dt className="font-extrabold">Registered address</dt><dd className="m-0 text-xt-mute">{ADDRESS}</dd></div>
              <div><dt className="font-extrabold">GSTIN</dt><dd className="m-0 text-xt-mute">17QSKPK1714H1ZE</dd></div>
              <div><dt className="font-extrabold">Support hours</dt><dd className="m-0 text-xt-mute">Monday – Sunday, 8:00 AM – 10:00 PM IST (WhatsApp 24/7)</dd></div>
              <div><dt className="font-extrabold">Bookings & partnerships</dt><dd className="m-0"><a href={`mailto:${EMAIL}`} className="text-xt-crimson">{EMAIL}</a></dd></div>
              <div><dt className="font-extrabold">Support, billing & invoices</dt><dd className="m-0"><a href={`mailto:${SUPPORT}`} className="text-xt-crimson">{SUPPORT}</a></dd></div>
              <div><dt className="font-extrabold">Policies</dt><dd className="m-0 flex flex-wrap gap-x-4 gap-y-1 font-bold">
                <Link to="/terms-of-service" className="inline-block py-1 text-xt-crimson">Terms of Service</Link>
                <Link to="/privacy-policy" className="inline-block py-1 text-xt-crimson">Privacy Policy</Link>
                <Link to="/pricing-cancellation-policy" className="inline-block py-1 text-xt-crimson">Pricing & Cancellation</Link>
              </dd></div>
            </dl>
          </div>
        </section>
      </PageShell>
    </>
  );
}
