/**
 * /guides — every live Shillong, Meghalaya and Northeast guide on one crawlable page,
 * grouped by topic. Linked from the footer so no guide is more than two clicks from home.
 */
import { Link } from '@/lib/router-compat';
import { getRouteApi } from '@tanstack/react-router';

// The directory arrives from the route loader (server function); no guide data is bundled.
const route = getRouteApi('/guides');
import { PageShell, PageHero, Breadcrumbs, PAD } from '@/components/v2/blocks';

const idOf = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function GuidesDirectoryV2() {
  const groups = route.useLoaderData()?.groups ?? [];
  const total = groups.reduce((a, g) => a + g.pages.length, 0);
  return (
    <PageShell cta={{ title: 'Found your plan?', sub: 'Base yourself at XTSY in New Shillong Township.' }}>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'All guides' }]} />
      <PageHero
        size="md"
        eyebrow="A–Z directory"
        title="Every guide."
        text={<p className="m-0">{total} guides to stays, trips, food and places across Shillong, Meghalaya and Northeast India, grouped by topic.</p>}
      />
      <nav aria-label="Guide topics" className={`${PAD} sticky top-0 z-10 border-b border-black/10 bg-[#F4EFE8]/95 py-3 backdrop-blur`}>
        <ul className="m-0 flex list-none gap-2 overflow-x-auto p-0">
          {groups.map((g) => (
            <li key={g.label} className="shrink-0">
              <a href={`#${idOf(g.label)}`} className="inline-flex h-11 items-center rounded-full border border-black/15 bg-white px-4 text-[14px] font-extrabold text-xt-ink hover:border-xt-crimson hover:text-xt-crimson">
                {g.label} <span className="ml-1.5 text-xt-mute">{g.pages.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className={`${PAD} flex flex-col gap-14 py-14`}>
        {groups.map((g) => (
          <section key={g.label} id={idOf(g.label)} aria-labelledby={`h-${idOf(g.label)}`} className="scroll-mt-24">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-black/10 pb-3">
              <h2 id={`h-${idOf(g.label)}`} className="m-0 text-[26px] font-extrabold text-xt-ink sm:text-[32px]">{g.label}</h2>
              {g.hub && <Link to={g.hub} className="text-[15px] font-extrabold text-xt-crimson hover:underline">Start here →</Link>}
            </div>
            <ul className="m-0 grid list-none gap-x-8 gap-y-1 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {g.pages.map((p) => (
                <li key={p.slug}>
                  <Link to={`/${p.slug}`} className="block py-2 text-[16px] leading-snug text-xt-ink hover:text-xt-crimson">{p.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
