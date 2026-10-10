/**
 * /faq — FAQs with topic tabs (redesign). All answers are also emitted as
 * FAQPage structured data (rendered server-side by the route head).
 */
import { useState } from 'react';
import { PageShell, PAD, Btn } from '@/components/v2/blocks';
import { Photo, waLink } from '@/components/v2/primitives';
import { COVERS } from '@/data/v2Images';
import { Button } from '@/components/ui/button';
import { buildTopics } from './faqData';

export default function FaqV2() {
  const topics = buildTopics();
  const [topic, setTopic] = useState(topics[0].id);
  const [open, setOpen] = useState(0);
  const current = topics.find((t) => t.id === topic) ?? topics[0];
  return (
    <>
      <PageShell cta={{ title: 'Still wondering?', sub: 'Ask the XTSY desk on WhatsApp. We reply day and night.' }}>
        <section className={`${PAD} relative overflow-hidden bg-xt-ink py-16 text-xt-paper lg:py-20`}>
          <Photo src={COVERS.home} alt="XTSY Travellers Hostel in New Shillong Township" eager className="absolute inset-0" sizes="100vw" />
          <div className="absolute inset-0 bg-xt-ink/70" />
          <div className="relative flex max-w-3xl flex-col gap-5">
            <div className="xt-eyebrow text-[15px]">Your stay, answered</div>
            <h1 className="xt-display m-0 text-[52px] leading-none sm:text-[80px]">XTSY Travellers Hostel FAQs</h1>
            <p className="max-w-xl text-[17px] leading-relaxed">Dorms from ₹399, GST included. New Shillong Township. Check-in 11 AM · check-out strictly 10 AM.</p>
            <div className="flex flex-wrap gap-3"><Btn to="/book">Choose your stay</Btn><Btn to="/safety-house-rules" kind="light">Safety & house rules</Btn></div>
          </div>
        </section>
        <section className={`${PAD} grid gap-8 py-14 lg:grid-cols-12 lg:gap-10`}>
          <div className="flex flex-col gap-4 lg:col-span-4">
          <div role="tablist" aria-label="FAQ topics" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {topics.map((t) => (
              <Button variant="ghost"
                key={t.id}
                id={`faq-tab-${t.id}`}
                role="tab"
                aria-selected={t.id === topic}
                aria-controls={`faq-${t.id}`}
                onClick={() => { setTopic(t.id); setOpen(0); }}
                className={`xt-chip shrink-0 rounded-full px-5 py-3 text-left text-[15px] font-extrabold lg:rounded-2xl lg:py-4 ${t.id === topic ? 'bg-xt-slate text-xt-paper' : 'bg-transparent text-xt-ink hover:bg-xt-cream'}`}
              >
                {t.n}
              </Button>
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
                  <div key={q} className="overflow-hidden rounded-lg border border-xt-line bg-xt-paper">
                    <h2 className="m-0 text-[17px]">
                      <Button variant="ghost" type="button" aria-expanded={open === i} aria-controls={`answer-${t.id}-${i}`} onClick={() => setOpen(open === i ? -1 : i)} className="flex h-auto min-h-12 w-full items-center justify-between gap-4 whitespace-normal bg-transparent px-6 py-5 text-left text-[17px] font-extrabold text-xt-ink">
                        <span>{q}</span>
                        <span aria-hidden="true" className="text-[26px] font-normal text-xt-crimson">{open === i ? '−' : '+'}</span>
                      </Button>
                    </h2>
                    <p id={`answer-${t.id}-${i}`} hidden={open !== i} className="m-0 px-6 pb-5 text-[16px] leading-relaxed text-xt-mute">{a}</p>
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
