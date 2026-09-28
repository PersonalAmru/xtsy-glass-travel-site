/**
 * /female-travellers — Women safe stays (redesign).
 */
import SEOHead from '@/components/SEOHead';
import { googleReviews } from '@/data/googleReviews';
import { IMG, first } from '@/data/v2Images';
import { PageShell, PageHero, Btn, CheckPanel, FaqList, SplitFeature, PAD } from '@/components/v2/blocks';
import { Photo, Eyebrow, waLink } from '@/components/v2/primitives';
import { inr, roomPrice } from '@/components/v2/pricing';

const FAQS = [
  { q: 'Do you have a women-only dorm?', a: 'Yes. The 4-bed female-only dorm has secure access, individual bed curtains and personal lockers.' },
  { q: 'What safety measures do you have?', a: '24/7 security, CCTV in common areas, secure female dorm access, well-lit premises and female staff available round the clock.' },
  { q: 'Is Shillong safe to explore solo?', a: 'Meghalaya is one of India’s safer regions for women travellers. Our staff share local tips, safe routes and trusted transport, and group trips are available if you’d rather explore with others.' },
  { q: 'Where is the hostel?', a: 'XTSY Travellers Hostel is on Mawdiangdiang Road, New Shillong Township, near NIFT Shillong and IIM Shillong — a quiet, green part of the city.' },
];

export default function WomenSafeV2() {
  const price = inr(roomPrice('4-bed-female-only-dorm').now);
  const review = googleReviews.find((r) => r.name === 'AnnaLee Serrao' && r.rating === 5);
  return (
    <>
      <SEOHead
        title="Safe Stays for Women — Female-Only Dorm in Shillong | XTSY"
        description="Female-only dorm with 24/7 security, CCTV and personal lockers at XTSY Travellers Hostel, New Shillong Township, Meghalaya."
        keywords="female hostel Shillong, women solo travel India, safe hostel women, girls dorm Meghalaya, female traveller hostel northeast India"
        canonicalUrl="https://xtsy.one/female-travellers"
      />
      <PageShell cta={{ title: 'A safe base for your solo trip.', sub: `Book the 4-bed female dorm for ${price} a night, or message our team with any questions first.` }}>
        <PageHero
          bg="#8A1D3A"
          fg="#FBEFF1"
          muted="#F3D5DB"
          eyebrowColor="#F7C9D1"
          eyebrow="Women safe stays · Female-only dorm"
          title="Travel safe. Travel bold."
          text="Women-only dorm and spaces, female staff any time of day, and a community of women exploring the Northeast together."
          actions={<><Btn to="/book" kind="light">Book the female dorm · {price}</Btn><Btn to={waLink()} kind="outline-light">Speak to our team</Btn></>}
          media={
            <div className="relative flex aspect-square items-center justify-center">
              <span aria-hidden="true" className="xt-live absolute h-[80%] w-[80%] rounded-full border-2 border-[#F7C9D1]" />
              <Photo src={first(IMG.femaleDorm)} alt="The 4-bed female-only dorm" eager tone="sand" className="aspect-square w-[80%] rounded-full" />
            </div>
          }
        />

        <section className={`${PAD} grid gap-6 py-16 md:grid-cols-2 lg:py-24`}>
          <CheckPanel icon="shield" title="Your safety, our priority" items={['24/7 security and CCTV', 'Women-only dorm', 'Female staff available any time', 'Well-lit corridors and common areas', 'Lockers with individual keys', 'Trusted cabs booked by the desk']} />
          <CheckPanel icon="heart" bg="#F3E3E6" color="#8A1D3A" title="Comfort & care" items={['Individual bed curtains', 'Hair dryers and mirrors', 'Hygiene products on hand', 'Reading corners', 'Quiet wellness space', 'Safety guidance and local tips']} />
        </section>

        <SplitFeature media={<Photo src={IMG.femaleDorm[1] ?? first(IMG.femaleDorm)} alt="Bunks inside the 4-bed female-only dorm" tone="pine" className="aspect-[628/440] rounded-[28px]" />}>
          <Eyebrow>Community</Eyebrow>
          <h2 className="xt-display m-0 text-[44px] leading-[0.95] sm:text-[64px]">Join our community of women explorers</h2>
          <p className="m-0 text-[17px] leading-relaxed text-xt-mute">Meet other women on the road, share a cab to Cherrapunji, and get local tips from our female staff before you head out.</p>
          {review && (
            <figure className="m-0 flex flex-col gap-2.5 rounded-[20px] bg-white p-6">
              <blockquote className="m-0 text-[17px] leading-normal">{review.comment}</blockquote>
              <figcaption className="text-[14px] font-bold text-xt-mute">{review.name} · Google</figcaption>
            </figure>
          )}
        </SplitFeature>

        <FaqList faqs={FAQS} />
      </PageShell>
    </>
  );
}
