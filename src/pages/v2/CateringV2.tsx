/**
 * /tab-bistro/catering and /catering-shillong — TAB Bistro catering (redesign).
 * Enquiries are saved to catering_enquiries (admin is notified).
 */
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';
import { createCateringEnquiry } from '@/services/cateringService';
import { IMG, first } from '@/data/v2Images';
import { PageShell, PageHero, Btn, PAD } from '@/components/v2/blocks';
import { Photo, waLink } from '@/components/v2/primitives';

const KINDS = [
  { t: 'Wedding catering', d: 'Custom menus and live stations for your big day.', cls: 'bg-xt-crimson text-white' },
  { t: 'Corporate events', d: 'Offsites, launches and conferences, with GST invoices.', cls: 'bg-white text-xt-ink' },
  { t: 'Buffets & set menus', d: 'Multi-cuisine buffets for groups at XTSY or anywhere in Shillong.', cls: 'bg-xt-slate text-xt-paper' },
  { t: 'Bulk orders', d: 'Meal boxes for teams, colleges and events.', cls: 'bg-xt-cream text-xt-ink' },
];

export default function CateringV2({ canonical = 'https://xtsy.one/tab-bistro/catering' }: { canonical?: string }) {
  const [f, setF] = useState({ name: '', phone: '', type: 'Wedding', guests: '', date: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const input = 'h-12 w-full rounded-xl border-[1.5px] border-xt-line bg-white px-3.5 text-[15px] text-xt-ink focus:border-xt-crimson focus:outline-none';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await createCateringEnquiry({
      fullName: f.name,
      phone: f.phone,
      eventType: f.type,
      eventDate: f.date || undefined,
      guestCount: f.guests ? Number(f.guests) : undefined,
      message: f.message,
    });
    setBusy(false);
    if (res.success) {
      setDone(true);
      toast.success('Thanks! The TAB Bistro team will send your quote on WhatsApp.');
    } else {
      toast.error('Could not send online — opening WhatsApp instead.');
      window.location.href = waLink(`Hi TAB Bistro! Catering enquiry: ${f.type}, ${f.guests} guests, ${f.date || 'date TBC'}. ${f.message}`);
    }
  };

  return (
    <>
      <SEOHead
        title="Catering in Shillong — Weddings, Corporate & Bulk Orders | TAB Bistro by XTSY"
        description="TAB Bistro by XTSY caters weddings, corporate events, parties and bulk orders across Shillong and Meghalaya. Multi-cuisine buffets, live stations, veg, non-veg and Jain options."
        keywords="catering in shillong, wedding catering shillong, corporate catering shillong, bulk food order shillong, party order shillong, TAB Bistro catering"
        canonicalUrl={canonical}
      />
      <PageShell bar={{ label: 'Get a quote', to: waLink('Hi TAB Bistro! Catering enquiry. Guests: … Date: …'), note: 'Catering by TAB Bistro' }} cta={{ title: 'Feeding a crowd?', sub: 'Share your headcount and date on WhatsApp for a quote.', bookTo: '/tab-bistro', bookLabel: 'See the bistro menu' }}>
        <PageHero
          eyebrow="TAB Bistro Catering · Shillong"
          title="Feeding the whole party."
          text="Weddings, corporate events and bulk orders. Multi-cuisine buffets, custom menus and live stations from the TAB kitchen, with veg, non-veg and Jain options."
          actions={<><Btn to="#quote">Get a catering quote</Btn><Btn to="/tab-bistro" kind="outline">See the bistro menu</Btn></>}
          media={<Photo src={first(IMG.bistro)} alt="TAB Bistro by XTSY" eager tone="crimson" className="aspect-[628/520] rounded-[32px]" />}
        />
        <section className={`${PAD} grid gap-5 py-16 sm:grid-cols-2 lg:grid-cols-4`}>
          {KINDS.map((k) => (
            <div key={k.t} className={`xt-reveal xt-lift flex min-h-[180px] flex-col gap-2.5 rounded-3xl p-7 ${k.cls}`}>
              <h2 className="xt-display m-0 text-[32px] leading-none">{k.t}</h2>
              <p className="m-0 text-[15px] leading-normal opacity-90">{k.d}</p>
            </div>
          ))}
        </section>
        <section className={`${PAD} grid gap-10 pb-16 lg:grid-cols-12`}>
          <div className="xt-reveal flex flex-col gap-4 lg:col-span-5">
            <h2 className="xt-display m-0 text-[44px] leading-none sm:text-[56px]">Cuisines on the menu</h2>
            <div className="flex flex-wrap gap-2">
              {['North Indian', 'Indo-Chinese', 'Thai', 'Continental', 'Italian', 'Northeast Indian', 'Veg & Jain', 'Live stations'].map((c) => (
                <span key={c} className="rounded-full border-[1.5px] border-xt-stone px-4 py-2 text-[14px] font-bold">{c}</span>
              ))}
            </div>
          </div>
          <form id="quote" onSubmit={submit} className="xt-reveal grid scroll-mt-28 gap-4 rounded-[28px] bg-white p-7 sm:grid-cols-2 sm:p-10 lg:col-span-7">
            <h2 className="xt-display m-0 text-[40px] leading-none sm:col-span-2">Quick quote</h2>
            {done ? (
              <p className="m-0 text-[16px] font-bold sm:col-span-2">Thanks, {f.name.split(' ')[0] || 'friend'}! Your enquiry is in. We’ll reply on WhatsApp with a quote.</p>
            ) : (
              <>
                <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute">NAME<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} autoComplete="name" /></label>
                <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute">WHATSAPP<input required type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={input} autoComplete="tel" /></label>
                <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute">EVENT TYPE
                  <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} className={input}>
                    {['Wedding', 'Corporate event', 'Birthday or party', 'Bulk order', 'Other'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute">GUESTS<input type="number" min={1} value={f.guests} onChange={(e) => setF({ ...f, guests: e.target.value })} className={input} /></label>
                  <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute">DATE<input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className={input} /></label>
                </div>
                <label className="flex flex-col gap-1.5 text-[12px] font-extrabold tracking-wide text-xt-mute sm:col-span-2">DETAILS<textarea rows={3} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className={`${input} h-auto py-3`} /></label>
                <button type="submit" disabled={busy} className="xt-btn h-14 rounded-full bg-xt-crimson text-[16px] font-extrabold text-white disabled:opacity-60 sm:col-span-2">{busy ? 'Sending…' : 'Send enquiry'}</button>
              </>
            )}
          </form>
        </section>
      </PageShell>
    </>
  );
}
