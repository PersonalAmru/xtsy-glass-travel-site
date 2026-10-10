import { ShieldCheck, Moon, Clock, Users, LockKeyhole, MessageCircle } from 'lucide-react';
import { PageShell, PAD, Btn } from '@/components/v2/blocks';
import { Photo, waLink } from '@/components/v2/primitives';
import { COVERS } from '@/data/v2Images';
import { HOSTEL_POLICIES } from '@/data/hostelPolicies';
import { PROPERTY_ADDRESS, BRAND } from '@/data/brandFacts';
import { roomPrice, inr } from '@/components/v2/pricing';

export default function HostelSafetyV2() {
  const essentials = [
    { icon: Clock, title: 'Arrive & depart', text: `Check-in ${HOSTEL_POLICIES.checkIn}. Check-out strictly ${HOSTEL_POLICIES.checkOut}. Tell the desk your arrival time if you are arriving late; arrival support does not change standard check-in time.` },
    { icon: Moon, title: 'Quiet hours', text: `${HOSTEL_POLICIES.quietHours}. Keep voices and phone calls low, use headphones and respect sleeping guests. Follow posted rules and staff instructions.` },
    { icon: Users, title: 'Shared dorms', text: 'Book one bed for each guest. The 6-bed and 8-bed dorms are mixed; the 4-bed dorm is women-only. Do not exceed room capacity or bring unauthorised visitors. The 4-bed mixed dorm is unavailable.' },
    { icon: LockKeyhole, title: 'Look after your belongings', text: 'Use your personal locker and keep valuables secure. Do not leave belongings unattended. Tell the desk promptly about missing items or a security concern.' },
  ];
  return (
    <PageShell cta={{ title: 'A question before you arrive?', sub: 'Speak with the XTSY desk about your stay.' }}>
      <section className={`${PAD} relative overflow-hidden bg-xt-ink py-16 text-xt-paper lg:py-20`}>
        <Photo src={COVERS.home} alt="XTSY Travellers Hostel among the pines of New Shillong Township" eager className="absolute inset-0" sizes="100vw" />
        <div className="absolute inset-0 bg-xt-ink/70" />
        <div className="relative flex max-w-3xl flex-col gap-5">
          <div className="xt-eyebrow text-[15px]">Stay with respect</div>
          <h1 className="xt-display m-0 text-[52px] leading-none sm:text-[80px]">XTSY Travellers Hostel<br />Safety & house rules</h1>
          <p className="max-w-xl text-[17px] leading-relaxed">A shared home for travellers in New Shillong Township. Rest well, respect your roommates, and reach out whenever you need help.</p>
          <div className="flex flex-wrap gap-3"><Btn to="/book">Book a stay</Btn><Btn to="/faq" kind="light">Hostel FAQs</Btn></div>
        </div>
      </section>
      <section className={`${PAD} py-14`}>
        <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
          {essentials.map(({ icon: Icon, title, text }) => <div key={title} className="border-b border-xt-line pb-8">
            <Icon className="mb-4 h-7 w-7 text-xt-crimson" aria-hidden="true" />
            <h2 className="mb-3 text-[23px] font-extrabold text-xt-ink">{title}</h2>
            <p className="m-0 text-[16px] leading-relaxed text-xt-mute">{text}</p>
          </div>)}
        </div>
      </section>
      <section className={`${PAD} grid gap-8 bg-xt-cream py-14 lg:grid-cols-2`}>
        <Photo src={COVERS.women} alt="The four-bed women-only dorm at XTSY" className="aspect-[4/3] rounded-lg" />
        <div className="flex flex-col justify-center gap-4">
          <ShieldCheck className="h-8 w-8 text-xt-crimson" aria-hidden="true" />
          <h2 className="xt-display m-0 text-[44px] leading-none">Travelling solo as a woman?</h2>
          <p className="m-0 text-[17px] leading-relaxed text-xt-mute">Our 4-bed women-only dorm is {inr(roomPrice('4-bed-female-only-dorm').now)} per bed per night, GST included. Secure dorm access, personal lockers, CCTV in common areas and female staff support help make it a comfortable base.</p>
          <p className="m-0 text-[16px] leading-relaxed text-xt-mute">Ask the desk for local guidance or trusted transport. No accommodation can guarantee complete safety; report discomfort or suspicious behaviour immediately.</p>
          <div><Btn to="/female-travellers" kind="outline">Women-only stays</Btn></div>
        </div>
      </section>
      <section className={`${PAD} grid gap-10 py-14 lg:grid-cols-2`}>
        <div>
          <h2 className="mb-5 text-[26px] font-extrabold">Respect the shared space</h2>
          <ul className="space-y-4 pl-5 text-[16px] leading-relaxed text-xt-mute list-disc">
            <li>Treat staff and other guests with respect. Illegal activities are not permitted.</li>
            <li>Do not damage property or furnishings. Follow posted rules and staff instructions.</li>
            <li>Do not smoke in non-smoking areas. Ask the desk where smoking is permitted.</li>
            <li>Declare pets before arrival; pets are permitted only in suitable pet-friendly rooms with the desk’s approval.</li>
            <li>Rule violations can result in eviction without refund, and charges for damage, under the Terms of Service.</li>
          </ul>
          <div className="mt-6"><Btn to="/terms-of-service" kind="outline">Read the full terms</Btn></div>
        </div>
        <div>
          <h2 className="mb-5 text-[26px] font-extrabold">Before you arrive</h2>
          <p className="text-[16px] leading-relaxed text-xt-mute">{PROPERTY_ADDRESS}. We are near NIFT Shillong, IIM Shillong and NEIGRIHMS, not in Police Bazaar. Share the hostel’s map pin with your driver.</p>
          <p className="text-[16px] leading-relaxed text-xt-mute">A WhatsApp enquiry is pending until the host confirms it. Advance payments are non-refundable. One date modification may be requested within {HOSTEL_POLICIES.modificationDays} days of the original check-in, with at least {HOSTEL_POLICIES.modificationNoticeHours} hours’ notice, subject to availability and any rate difference.</p>
          <div className="mt-6 flex flex-wrap gap-3"><Btn to={waLink('Namaste XTSY! I have a question about hostel safety and house rules (https://xtsy.one/safety-house-rules).')}><MessageCircle className="h-5 w-5" />{BRAND.whatsappDisplay}</Btn><Btn to="/pricing-cancellation-policy" kind="outline">Booking policy</Btn></div>
        </div>
      </section>
    </PageShell>
  );
}