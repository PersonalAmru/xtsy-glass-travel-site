/**
 * /meghalaya-festivals — when and where Meghalaya's main festivals happen, plus nearby
 * Northeast festivals. Dates follow each community's calendar, so the page gives the usual month
 * and tells readers to confirm the year's dates locally. Drive times come from routing.ts.
 */
import { Link } from '@/lib/router-compat';
import { PageShell, Breadcrumbs, PAD } from '@/components/v2/blocks';
import PageFaq from '@/components/seo/PageFaq';

type Festival = { name: string; when: string; where: string; who: string; what: string; plan: string };

const MEGHALAYA: Festival[] = [
  {
    name: 'Shad Suk Mynsiem',
    when: 'Usually April (spring), over three days',
    where: 'Weiking Ground, Shillong',
    who: 'Khasi',
    what: 'A thanksgiving dance for the harvest and the new sowing season. Women in traditional dress dance in the inner circle while men dance around them to drums and pipes.',
    plan: 'In Shillong itself, about 30 minutes by road from XTSY in New Shillong Township.',
  },
  {
    name: 'Behdienkhlam',
    when: 'Usually July, after the sowing season',
    where: 'Jowai, West Jaintia Hills',
    who: 'Pnar (Jaintia)',
    what: 'A festival to drive away sickness and pray for a good harvest. Its highlight is the raising of decorated wooden poles and a football-like game played in a muddy pool.',
    plan: 'Jowai is about 1½ hours by road from XTSY; go for the day or stay overnight.',
  },
  {
    name: 'Nongkrem Dance',
    when: 'Usually October or November, over five days',
    where: 'Smit, near Shillong (Hima Khyrim)',
    who: 'Khasi',
    what: 'A thanksgiving festival of the Khyrim kingdom, with goat sacrifice rituals and dances by young men and women in traditional silk and silver.',
    plan: 'Smit is a short drive from Shillong; combine it with Laitlum Canyons.',
  },
  {
    name: 'Shillong Cherry Blossom Festival',
    when: 'Usually November, when the Himalayan cherry trees bloom',
    where: 'Shillong',
    who: 'Everyone',
    what: 'Pink cherry blossoms across the city, with music, food and craft stalls. The festival has been held in some years and not others, so check the year\'s announcement.',
    plan: 'Blossoms line roads across Shillong and New Shillong; book early, as stays fill up.',
  },
  {
    name: 'Wangala (100 Drums Festival)',
    when: 'Usually November, after the harvest',
    where: 'Asanang, near Tura, Garo Hills',
    who: 'Garo',
    what: 'A harvest festival honouring Misi Saljong, the sun god, with long lines of dancers moving to the beat of a hundred drums.',
    plan: 'Tura is about 5½ hours from Guwahati by road and far from Shillong; plan at least two nights in the Garo Hills.',
  },
];

const NEARBY: Festival[] = [
  { name: 'Rongali (Bohag) Bihu', when: 'Mid-April', where: 'Across Assam', who: 'Assamese', what: 'The Assamese new year and spring festival, with Bihu dance, music and feasts.', plan: 'Guwahati is about 3 hours from XTSY by road.' },
  { name: 'Ziro Festival of Music', when: 'Usually late September', where: 'Ziro Valley, Arunachal Pradesh', who: 'Everyone', what: 'An outdoor independent-music festival in the rice fields of the Apatani plateau.', plan: 'Needs an Inner Line Permit for Arunachal Pradesh and a long road trip; XTSY arranges it through trusted partners.' },
  { name: 'Hornbill Festival', when: '1–10 December every year', where: 'Kisama Heritage Village, near Kohima, Nagaland', who: 'Naga tribes', what: 'Nagaland\'s biggest festival, showcasing the dances, food and crafts of all its tribes.', plan: 'Needs an Inner Line Permit for Nagaland; book stays in Kohima months ahead.' },
];

function FestivalCard({ f }: { f: Festival }) {
  return (
    <article className="xt-reveal flex flex-col gap-3 rounded-3xl bg-white p-6">
      <h3 className="xt-display m-0 text-[28px] leading-none">{f.name}</h3>
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[15px]">
        <dt className="font-bold">When</dt><dd className="m-0 text-xt-mute">{f.when}</dd>
        <dt className="font-bold">Where</dt><dd className="m-0 text-xt-mute">{f.where}</dd>
        <dt className="font-bold">Community</dt><dd className="m-0 text-xt-mute">{f.who}</dd>
      </dl>
      <p className="m-0 text-[15px] leading-relaxed">{f.what}</p>
      <p className="m-0 text-[14px] text-xt-mute"><strong className="text-xt-ink">Getting there:</strong> {f.plan}</p>
    </article>
  );
}

export default function MeghalayaFestivalsV2() {
  return (
    <PageShell
      bar={{ label: 'Plan my trip', to: '/plan-trip-with-ai', note: 'Festivals across the Northeast' }}
      cta={{ title: 'Plan your trip around a festival.', sub: 'Tell a travel expert which festival you want to see; XTSY arranges the stay, transport and timing.', bookTo: '/plan-trip-with-ai', bookLabel: 'Build a trip with AI' }}
    >
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Guides', to: '/guides' }, { label: 'Meghalaya festivals' }]} />
      <section className={`${PAD} flex flex-col gap-5 py-12`}>
        <div className="xt-eyebrow text-[15px]">Meghalaya festivals guide</div>
        <h1 className="xt-display m-0 max-w-[1000px] text-[52px] leading-[0.9] sm:text-[88px]">Meghalaya festivals: when and where</h1>
        <p className="m-0 max-w-[780px] text-[17px] leading-relaxed text-xt-mute">
          Meghalaya's three main communities, the Khasi, the Pnar (Jaintia) and the Garo, each mark the farming year with their own festivals.
          Most follow traditional calendars, so dates move from year to year: the months below are the usual ones, and it is worth confirming the year's dates locally before you book.
        </p>
      </section>

      <section className={`${PAD} flex flex-col gap-6 pb-14`}>
        <h2 className="xt-display m-0 text-[36px] leading-none sm:text-[48px]">Festivals in Meghalaya</h2>
        <div className="grid gap-6 md:grid-cols-2">{MEGHALAYA.map((f) => <FestivalCard key={f.name} f={f} />)}</div>
      </section>

      <section className={`${PAD} flex flex-col gap-6 pb-14`}>
        <h2 className="xt-display m-0 text-[36px] leading-none sm:text-[48px]">Nearby in the Northeast</h2>
        <div className="grid gap-6 md:grid-cols-3">{NEARBY.map((f) => <FestivalCard key={f.name} f={f} />)}</div>
      </section>

      <section className={`${PAD} flex flex-col gap-3 pb-6`}>
        <h2 className="xt-display m-0 text-[36px] leading-none sm:text-[48px]">Tips for festival visitors</h2>
        <ul className="m-0 flex max-w-[860px] list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed text-xt-mute">
          <li>Many festivals are religious ceremonies first. Dress modestly, follow the organisers' instructions and ask before photographing people.</li>
          <li>Stays near festival grounds fill up early; book as soon as dates are announced.</li>
          <li>Roads around festival venues get crowded. Leave early and carry cash.</li>
          <li>Travelling solo? The <Link to="/tours/meghalaya-group-trip-6n-7d" className="font-bold text-xt-crimson underline underline-offset-4">Saturday Meghalaya group trip</Link> runs from October to May, and the <Link to="/best-time-to-visit-meghalaya" className="font-bold text-xt-crimson underline underline-offset-4">best time to visit guide</Link> covers the weather month by month.</li>
        </ul>
      </section>

      <PageFaq path="/meghalaya-festivals" />
    </PageShell>
  );
}
