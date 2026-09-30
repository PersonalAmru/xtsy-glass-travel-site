/**
 * /faq — FAQs with topic tabs (redesign). All answers are also emitted as
 * FAQPage structured data (rendered server-side by the route head).
 */
import { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { PageShell, PAD, Btn } from '@/components/v2/blocks';
import { SpinningMark, waLink } from '@/components/v2/primitives';
import { buildTopics } from './faqData';

export default function FaqV2() {
  const topics = buildTopics();
  const [topic, setTopic] = useState(topics[0].id);
  const [open, setOpen] = useState(0);
  const current = topics.find((t) => t.id === topic) ?? topics[0];
  return (
    <>
      <SEOHead
        title="FAQ — XTSY Hostel Shillong | Experience by XTSY, Rooms, Tours"
        description="Answers about XTSY Travellers Hostel in New Shillong Township: rooms, Experience by XTSY, check-in, pets, tours, payments and getting here."
        keywords="XTSY FAQ, hostel Shillong questions, Experience by XTSY FAQ, Meghalaya travel FAQ, booking help XTSY"
        canonicalUrl="https://xtsy.one/faq"
      />
      <PageShell cta={{ title: 'Still wondering?', sub: 'Ask the XTSY desk on WhatsApp. We reply day and night.' }}>
        <section className={`${PAD} relative overflow-hidden bg-xt-cream py-16 lg:py-24`}>
          <SpinningMark className="-right-24 -top-24 h-[520px] w-[520px] opacity-[0.06]" />
          <div className="relative flex max-w-3xl flex-col gap-5">
            <div className="xt-in xt-eyebrow text-[15px] sm:text-[18px]">FAQs</div>
            <h1 className="xt-in xt-d1 xt-display m-0 text-[64px] leading-[0.86] sm:text-[112px]">Questions, answered.</h1>
          </div>
        </section>
        <section className={`${PAD} grid gap-8 py-14 lg:grid-cols-12 lg:gap-10`}>
          <div className="flex flex-col gap-4 lg:col-span-4">
          <div role="tablist" aria-label="FAQ topics" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {topics.map((t) => (
              <button
                key={t.id}
                id={`faq-tab-${t.id}`}
                role="tab"
                aria-selected={t.id === topic}
                aria-controls={`faq-${t.id}`}
                onClick={() => { setTopic(t.id); setOpen(0); }}
                className={`xt-chip shrink-0 rounded-full px-5 py-3 text-left text-[15px] font-extrabold lg:rounded-2xl lg:py-4 ${t.id === topic ? 'bg-xt-slate text-xt-paper' : 'bg-transparent text-xt-ink hover:bg-xt-cream'}`}
              >
                {t.n}
              </button>
            ))}
          </div>
            <div className="hidden lg:block"><Btn to={waLink('Hi XTSY! I have a question: ')}>Ask us on WhatsApp</Btn></div>
          </div>
          {/* All topics stay in the server HTML (inactive ones hidden) so every FAQ answer is readable by
              search engines and AI assistants and matches the FAQPage schema. */}
          <div className="lg:col-span-8">
            {topics.map((t) => (
              <div key={t.id} role="tabpanel" id={`faq-${t.id}`} aria-labelledby={`faq-tab-${t.id}`} hidden={t.id !== current.id} className="flex flex-col gap-2.5">
                {t.q.map(([q, a], i) => (
                  <div key={q} className="xt-pop overflow-hidden rounded-[18px] bg-white" style={{ animationDelay: `${i * 0.04}s` }}>
                    <h2 className="m-0 text-[17px]">
                      <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 bg-transparent px-6 py-5 text-left text-[17px] font-extrabold text-xt-ink">
                        <span>{q}</span>
                        <span aria-hidden="true" className="text-[26px] font-normal text-xt-crimson">{open === i ? '−' : '+'}</span>
                      </button>
                    </h2>
                    <p className={open === i && t.id === current.id ? 'm-0 px-6 pb-5 text-[16px] leading-relaxed text-xt-mute' : 'sr-only'}>{a}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </PageShell>
    </>
  );
}
