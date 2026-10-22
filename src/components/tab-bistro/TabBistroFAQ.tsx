import { memo } from "react";
import { Helmet } from '@/lib/seo/helmet';

export const tabBistroFaqs = [
  {
    q: "Does TAB Bistro serve breakfast in Shillong?",
    a: "Yes. TAB Bistro by XTSY serves a multi-cuisine breakfast daily, 8:45 AM – 11:45 AM — Assam tea, filter coffee, English breakfast, parathas, eggs to order and pancakes, in a pine-forest setting.",
  },
  {
    q: "Is TAB Bistro a rooftop restaurant in Shillong?",
    a: "TAB Bistro is launching a rooftop dining deck with panoramic pine-valley views, alongside its forest dining and BBQ experiences.",
  },
  {
    q: "What are the opening hours of TAB Bistro?",
    a: "TAB Bistro is open every day in two windows: breakfast 8:45 AM – 11:45 AM, and evening & dinner 4:30 PM – 11 PM. We are closed for lunch, but lunch preorders are accepted.",
  },
  {
    q: "What cuisines does TAB Bistro serve?",
    a: "TAB Bistro is a multi-cuisine restaurant serving Indian, Continental, Chinese and Northeast Indian dishes, plus forest BBQ, handcrafted beverages and curated dining experiences.",
  },
  {
    q: "Can I work from the café at TAB Bistro?",
    a: "Yes. TAB Bistro doubles as a café in Shillong with WiFi-friendly corners, espresso and cold brew during both service windows — popular with remote workers and travellers.",
  },
  {
    q: "Does TAB Bistro offer wedding catering and events?",
    a: "Yes. TAB Bistro provides wedding catering and event catering across Shillong and Meghalaya, with custom menus. Enquire on WhatsApp +91 88373 17070.",
  },
  {
    q: "Can I place bulk or party food orders in Shillong?",
    a: "Yes. TAB Bistro by XTSY handles bulk food orders, party orders and large group dining in Shillong — multi-cuisine menus for birthdays, get-togethers and celebrations. Share your headcount and date on WhatsApp +91 88373 17070 for a quote.",
  },
  {
    q: "Do you provide corporate and event catering in Shillong?",
    a: "Absolutely. We cater corporate events, conferences, offsites and private functions across Shillong and Meghalaya with Indian, Chinese, Continental, Thai and Northeast spreads, plus live counters and buffets tailored to your budget.",
  },
  {
    q: "What cuisines can I order from TAB Bistro?",
    a: "TAB Bistro is a multi-cuisine restaurant serving North Indian, Tandoor, Indo-Chinese, Thai, Continental, Italian (pizza & pasta), seafood, sizzlers and Northeast Indian dishes — all under the XTSY Specials menu.",
  },
];


const TabBistroFAQ = memo(() => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tabBistroFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-2">
        Frequently Asked Questions
      </h2>
      <p className="text-muted-foreground text-sm mb-8">
        Breakfast, rooftop dining, hours and catering at TAB Bistro in Shillong.
      </p>

      <div className="space-y-3">
        {tabBistroFaqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-xl bg-card border border-border p-5 hover:border-amber-500/30 transition-colors"
          >
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-base font-semibold text-foreground">
              {f.q}
              <span className="text-amber-400 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
            </summary>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
});

TabBistroFAQ.displayName = "TabBistroFAQ";
export default TabBistroFAQ;
