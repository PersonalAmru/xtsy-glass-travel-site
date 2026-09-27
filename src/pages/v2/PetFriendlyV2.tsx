/**
 * /pet-friendly — Pet-friendly stays (redesign).
 * Policy (from XTSY): cats and birds most welcome; dogs depending on breed and
 * size; guests contact the XTSY desk for any additional charges.
 */
import type { CSSProperties } from 'react';
import SEOHead from '@/components/SEOHead';
import { IMG, first } from '@/data/v2Images';
import { PageShell, PageHero, Btn, Section, H2, FaqList, PAD } from '@/components/v2/blocks';
import { Photo, Eyebrow, waLink } from '@/components/v2/primitives';

const PAWS = [
  { x: '3%', y: '78%', r: -20, d: 0 }, { x: '8%', y: '70%', r: -10, d: 0.6 }, { x: '13%', y: '64%', r: 0, d: 1.2 },
  { x: '19%', y: '59%', r: 10, d: 1.8 }, { x: '90%', y: '9%', r: 160, d: 0.3 }, { x: '85%', y: '16%', r: 170, d: 0.9 }, { x: '80%', y: '22%', r: 180, d: 1.5 },
];

const Paw = ({ className, fill = '#A12444', style, rotate = 0 }: { className?: string; fill?: string; style?: CSSProperties; rotate?: number }) => (
  <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
    <g fill={fill} transform={`rotate(${rotate} 12 12)`}><ellipse cx="12" cy="16" rx="5" ry="4.2" /><circle cx="6" cy="10" r="2.2" /><circle cx="10" cy="6.5" r="2.2" /><circle cx="14" cy="6.5" r="2.2" /><circle cx="18" cy="10" r="2.2" /></g>
  </svg>
);

const FAQS = [
  { q: 'Which pets can stay at XTSY?', a: 'Cats and birds are most welcome. Dogs are welcome depending on breed and size — tell the XTSY desk about your dog before you book. Other pets need a chat with the desk first.' },
  { q: 'Are there extra charges for pets?', a: 'There may be an additional charge depending on your pet and length of stay. Please contact the XTSY desk on WhatsApp (+91 88373 17070) for the exact amount before you book.' },
  { q: 'What documents do I need?', a: 'Up-to-date vaccination records (rabies is a must). For travel within India a vet fitness certificate helps; for international travel the team can guide you on pet passports, permits and health certificates.' },
  { q: 'Can you help with pet travel?', a: 'Yes. The XTSY desk helps with domestic and international pet travel: health certificates, carriers, airline bookings and quarantine guidance, working with vets and authorities.' },
  { q: 'Are there vets nearby?', a: 'The team keeps a list of trusted veterinarians in Shillong and can help arrange emergency vet care if needed.' },
  { q: 'What is the pet behaviour policy?', a: 'Pets should be well-behaved, non-aggressive and house- or crate-trained. Owners are responsible for their pet’s behaviour and any damage, and the team may ask for an aggressive or disruptive pet to be removed.' },
];

export default function PetFriendlyV2() {
  const wa = waLink('Hi XTSY! I want to stay with my pet. Pet type/breed/size: … Dates: …');
  return (
    <>
      <SEOHead
        title="Pet-Friendly Hostel in Shillong — Travel With Your Pet | XTSY"
        description="India's first pet-friendly travellers hostel in New Shillong Township. Cats and birds most welcome; dogs depending on breed and size. Pet travel help from the XTSY desk."
        keywords="pet friendly hostel Shillong, cat friendly hotel Meghalaya, pet friendly accommodation India, travel with pets Shillong, pet friendly stay northeast India"
        canonicalUrl="https://xtsy.one/pet-friendly"
      />
      <PageShell cta={{ title: 'Bring the whole family.', sub: 'Message us your pet’s details and travel dates. Our team is on WhatsApp 24/7.' }}>
        <PageHero
          eyebrow="India’s 1st pet-friendly travellers hostel"
          title="Pets are family."
          decoration={
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              {PAWS.map((p) => (
                <Paw key={`${p.x}${p.y}`} className="xt-float absolute opacity-30" rotate={p.r} style={{ left: p.x, top: p.y, animationDelay: `${p.d}s` }} />
              ))}
            </div>
          }
          text="Cats and birds are most welcome. Dogs too, depending on breed and size. Please contact the XTSY desk about any additional charges. Our team can also sort the paperwork for pet travel in India or abroad."
          actions={<><Btn to={wa}>Book via WhatsApp</Btn><Btn to="/book" kind="outline">See rooms</Btn></>}
          media={<Photo src={IMG.property[1] ?? first(IMG.property)} alt="The pines around XTSY Travellers Hostel" eager tone="pine" className="aspect-[628/560] rounded-[32px]" />}
        />

        <Section>
          <H2>What your pet gets</H2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {['Pet beds', 'Food and water bowls', 'Outdoor exercise area', 'Waste disposal stations', 'Grooming recommendations', 'Secure premises, 24/7'].map((g) => (
              <div key={g} className="xt-reveal xt-lift flex items-center gap-4 rounded-[20px] bg-white p-7">
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-xt-blush"><Paw /></span>
                <span className="text-[18px] font-extrabold">{g}</span>
              </div>
            ))}
          </div>
        </Section>

        <section className={`${PAD} pb-20`}>
          <div className="flex flex-col gap-10 rounded-[32px] bg-xt-slate p-8 text-xt-paper sm:p-16">
            <div className="xt-reveal flex flex-col gap-2.5">
              <Eyebrow light>Pet travel desk</Eyebrow>
              <h2 className="xt-display m-0 text-[44px] leading-[0.95] sm:text-[64px]">We handle the paperwork</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { t: 'Domestic pet travel', d: 'Health certificates, documents and vet coordination.' },
                { t: 'International pet travel', d: 'Pet passports, microchipping, airline bookings and quarantine guidance.' },
                { t: 'Pet sitting', d: 'Someone to keep them company while you explore.' },
                { t: 'Emergency vet contacts', d: 'Trusted local vets on call if anything goes wrong.' },
              ].map((s) => (
                <div key={s.t} className="xt-reveal flex flex-col gap-2.5 rounded-[20px] bg-[#3A4359] p-7">
                  <h3 className="m-0 text-[20px] font-extrabold">{s.t}</h3>
                  <p className="m-0 text-[15px] leading-normal text-xt-fog">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`${PAD} grid gap-6 pb-10 sm:grid-cols-3`}>
          {[IMG.property[2], IMG.property[1], first(IMG.bistro)].map((src, i) => (
            <Photo key={`${src}-${i}`} src={src} alt={['XTSY Travellers Hostel grounds', 'Around the hostel in New Shillong Township', 'TAB Bistro by XTSY'][i]} tone={(['sand', 'pine', 'crimson'] as const)[i]} className="xt-reveal aspect-[421/300] rounded-3xl" />
          ))}
        </section>

        <FaqList faqs={FAQS} />
      </PageShell>
    </>
  );
}
