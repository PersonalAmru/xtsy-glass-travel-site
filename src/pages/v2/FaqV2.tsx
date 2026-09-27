/**
 * /faq — FAQs with topic tabs (redesign). All answers are also emitted as
 * FAQPage structured data.
 */
import { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { PageShell, PAD, Btn } from '@/components/v2/blocks';
import { SpinningMark, waLink } from '@/components/v2/primitives';
import { inr, lowestDormPrice, roomPrice } from '@/components/v2/pricing';

type Topic = { id: string; n: string; q: [string, string][] };

function buildTopics(): Topic[] {
  const suite = roomPrice('xtsy-270');
  const female = roomPrice('4-bed-female-only-dorm');
  return [
    { id: 'stay', n: 'Staying at XTSY', q: [
      ['Where exactly is XTSY?', 'XTSY Travellers Hostel, Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya – 793018. Near NIFT Shillong, IIM Shillong, NEIGRIMS, NEIAH and Martin Luther Christian University, in a calm, green part of Shillong away from the city centre.'],
      ['Does XTSY have properties in other places?', 'No. XTSY Travellers Hostel in New Shillong Township (with Experience by XTSY and TAB Bistro) is XTSY’s only property. Everywhere else, including Dawki, Sohra, Tawang and beyond, XTSY arranges stays, transport and travel help through trusted travel partners, and our desk stays your single contact.'],
      ['What rooms do you have?', `6 and 8-bed mixed dorms from ${inr(lowestDormPrice())}, a 4-bed female-only dorm (${inr(female.now)}), King Double private rooms and Experience by XTSY, India’s First Stargaze Glamp. Every bed has a locker, reading light and charging point.`],
      ['What are check-in and check-out times?', 'Check-in is from 2 PM and check-out by 11 AM (see our Terms of Service). Arriving late? Message the desk with your arrival time.'],
      ['Is XTSY safe for solo women?', 'Yes. A women-only dorm, female staff on call, CCTV in common areas and personal lockers.'],
      ['Why book direct?', 'You save 20–30% vs OTAs and get instant confirmation from the XTSY team.'],
    ] },
    { id: 'suite', n: 'Experience by XTSY', q: [
      ['What is Experience by XTSY?', 'India’s First Stargaze Glamp: a 270° panoramic glass suite in the pines of New Shillong, for one couple a night.'],
      ['How much is it?', `${inr(suite.now)} a night stay-only, or ₹5,799 with breakfast for two. Decoration for special occasions is ₹2,500.`],
      ['Is it private?', 'Yes. The glass faces natural landscapes, not buildings, and there are blackout shades for total seclusion.'],
      ['Can I book it on OTAs?', 'No. Experience by XTSY is booked direct only, on xtsy.one or WhatsApp. Book 2–3 weeks ahead in peak season, and at least 48 hours ahead for decoration.'],
      ['Does it get hot in the day?', 'Daytime sun can warm any glass structure. The suite has climate control, blackout shades and cross ventilation.'],
    ] },
    { id: 'tours', n: 'Tours & rentals', q: [
      ['What are the must-see spots?', 'Living root bridges, Dawki’s clear Umngot river, Nohkalikai Falls and Mawlynnong village. We arrange guided trips to all of them.'],
      ['Can you customise a trip?', 'Yes. Try the AI trip builder on the home page, then send the plan to the XTSY desk.'],
      ['Who provides stays and vehicles outside New Shillong?', 'Trusted travel partners that XTSY books and coordinates. XTSY stays your single point of contact.'],
      ['Do you handle permits?', 'Yes, for Arunachal Pradesh, parts of Nagaland and border areas. Share your details 15–20 days before travel.'],
      ['Do you rent bikes and cars?', 'Yes. Royal Enfields from ₹1,300 a day and cars from ₹1,800, booked through trusted rental partners, with drivers on request.'],
    ] },
    { id: 'booking', n: 'Booking & payments', q: [
      ['What is your cancellation policy?', 'All advance payments are non-refundable. You can modify a booking once within 90 days of the original check-in, requested at least 48 hours before, subject to availability and any rate difference. No refunds for no-shows. Full details are on the Pricing & Cancellation Policy page.'],
      ['What payment methods work?', 'UPI, bank transfers, cards and cash. International guests can pay by PayPal or wire transfer.'],
      ['Is airport pickup available?', 'Yes, from Guwahati Airport and Shillong Airport (Umroi). Ask the desk when you book.'],
      ['Do groups get discounts?', 'Groups of 6+ get special rates on stays and tours. Colleges, corporates and clubs: message us for a quote.'],
    ] },
    { id: 'food', n: 'TAB Bistro', q: [
      ['When is TAB Bistro open?', 'Every day, 9 AM to 10:30 PM.'],
      ['Do you cater events?', 'Yes. Weddings, corporate events and bulk orders, with veg, non-veg and Jain options.'],
    ] },
    { id: 'pets', n: 'Pets', q: [
      ['Can I bring my pet?', 'Cats and birds are most welcome. Dogs depending on breed and size. Please contact the XTSY desk about any additional charges.'],
      ['Do you help with pet travel?', 'Yes, with domestic and international pet paperwork, vet coordination and pet sitting.'],
    ] },
    { id: 'travel', n: 'Getting here', q: [
      ['How do I reach XTSY from Guwahati?', 'About 100 km from Guwahati Airport, roughly 2.5 to 3 hours by road. We can arrange airport transfers.'],
      ['When is the best time to visit?', 'October to April for clear skies. June to September for the waterfalls at full force.'],
      ['Is the Northeast safe for international tourists?', 'Yes, and people are welcoming. Some areas need permits for foreign nationals, which the XTSY desk helps with.'],
    ] },
  ];
}

export default function FaqV2() {
  const topics = buildTopics();
  const [topic, setTopic] = useState(topics[0].id);
  const [open, setOpen] = useState(0);
  const current = topics.find((t) => t.id === topic) ?? topics[0];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: topics.flatMap((t) => t.q.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))),
  };
  return (
    <>
      <SEOHead
        title="FAQ — XTSY Hostel Shillong | Experience by XTSY, Rooms, Tours"
        description="Answers about XTSY Travellers Hostel in New Shillong Township: rooms, Experience by XTSY, check-in, pets, tours, payments and getting here."
        keywords="XTSY FAQ, hostel Shillong questions, Experience by XTSY FAQ, Meghalaya travel FAQ, booking help XTSY"
        canonicalUrl="https://xtsy.one/faq"
        structuredData={schema}
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
          <div role="tablist" aria-label="FAQ topics" className="flex gap-2 overflow-x-auto pb-1 lg:col-span-4 lg:flex-col lg:overflow-visible">
            {topics.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={t.id === topic}
                onClick={() => { setTopic(t.id); setOpen(0); }}
                className={`xt-chip shrink-0 rounded-full px-5 py-3 text-left text-[15px] font-extrabold lg:rounded-2xl lg:py-4 ${t.id === topic ? 'bg-xt-slate text-xt-paper' : 'bg-transparent text-xt-ink hover:bg-xt-cream'}`}
              >
                {t.n}
              </button>
            ))}
            <div className="hidden pt-4 lg:block"><Btn to={waLink('Hi XTSY! I have a question: ')}>Ask us on WhatsApp</Btn></div>
          </div>
          <div role="tabpanel" className="flex flex-col gap-2.5 lg:col-span-8">
            {current.q.map(([q, a], i) => (
              <div key={q} className="xt-pop overflow-hidden rounded-[18px] bg-white" style={{ animationDelay: `${i * 0.04}s` }}>
                <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 bg-transparent px-6 py-5 text-left text-[17px] font-extrabold text-xt-ink">
                  <span>{q}</span>
                  <span aria-hidden="true" className="text-[26px] font-normal text-xt-crimson">{open === i ? '−' : '+'}</span>
                </button>
                {open === i && <p className="m-0 px-6 pb-5 text-[16px] leading-relaxed text-xt-mute">{a}</p>}
              </div>
            ))}
          </div>
        </section>
      </PageShell>
    </>
  );
}
