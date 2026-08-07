import { memo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Utensils, ShoppingBag, Truck, PartyPopper } from "lucide-react";

interface FaqItem {
  q: string;
  a: React.ReactNode;
  text: string; // plain text for schema
}

interface FaqGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: FaqItem[];
}

const groups: FaqGroup[] = [
  {
    id: "dining",
    label: "Restaurant & Dining in Shillong",
    icon: <Utensils className="w-4 h-4" />,
    items: [
      {
        q: "Which is the best multi-cuisine restaurant in Shillong?",
        a: (
          <>
            TAB Bistro by XTSY is one of Shillong's most versatile multi-cuisine restaurants, serving North
            Indian, Tandoor, Indo-Chinese, Thai, Continental, Italian, seafood and Northeast dishes. Browse
            the full range under{" "}
            <a href="#xtsy-specials" className="text-amber-400 underline">XTSY Specials</a>.
          </>
        ),
        text: "TAB Bistro by XTSY is one of Shillong's most versatile multi-cuisine restaurants, serving North Indian, Tandoor, Indo-Chinese, Thai, Continental, Italian, seafood and Northeast dishes. Browse the full range under XTSY Specials.",
      },
      {
        q: "What are TAB Bistro's opening hours?",
        a: <>TAB Bistro is open every day from 9 AM to 10:30 PM, serving breakfast, lunch, dinner and all-day café.</>,
        text: "TAB Bistro is open every day from 9 AM to 10:30 PM, serving breakfast, lunch, dinner and all-day café.",
      },
      {
        q: "Does TAB Bistro have vegetarian options?",
        a: (
          <>
            Yes — there is a large, clearly labelled vegetarian selection across every cuisine in the{" "}
            <a href="#xtsy-specials" className="text-amber-400 underline">XTSY Specials</a> menu, from paneer
            tandoor to Thai veg curries and wood-style pizzas.
          </>
        ),
        text: "Yes — there is a large, clearly labelled vegetarian selection across every cuisine in the XTSY Specials menu, from paneer tandoor to Thai veg curries and wood-style pizzas.",
      },
    ],
  },
  {
    id: "takeaway",
    label: "Takeaway & Online Food Orders",
    icon: <ShoppingBag className="w-4 h-4" />,
    items: [
      {
        q: "Can I order food online or get takeaway in Shillong?",
        a: (
          <>
            Yes. You can place takeaway and online food orders directly with TAB Bistro on WhatsApp at{" "}
            <a href="https://wa.me/918837317070" className="text-amber-400 underline">+91 88373 17070</a> —
            pick any cuisine from{" "}
            <a href="#xtsy-specials" className="text-amber-400 underline">XTSY Specials</a> and we'll pack it fresh.
          </>
        ),
        text: "Yes. You can place takeaway and online food orders directly with TAB Bistro on WhatsApp at +91 88373 17070 — pick any cuisine from XTSY Specials and we'll pack it fresh.",
      },
      {
        q: "What cuisines are available for takeaway?",
        a: (
          <>
            All of them — North Indian, Tandoor, Indo-Chinese, Thai, Continental, Italian (pizza & pasta),
            seafood, sizzlers, café bites and beverages are available to take away. See{" "}
            <a href="#xtsy-specials" className="text-amber-400 underline">XTSY Specials</a>.
          </>
        ),
        text: "All of them — North Indian, Tandoor, Indo-Chinese, Thai, Continental, Italian (pizza & pasta), seafood, sizzlers, café bites and beverages are available to take away. See XTSY Specials.",
      },
    ],
  },
  {
    id: "delivery",
    label: "Food Delivery in Shillong",
    icon: <Truck className="w-4 h-4" />,
    items: [
      {
        q: "Does TAB Bistro deliver food in Shillong?",
        a: (
          <>
            Yes — message us on{" "}
            <a href="https://wa.me/918837317070" className="text-amber-400 underline">WhatsApp +91 88373 17070</a>{" "}
            with your order and location and we'll confirm delivery availability and timing.
          </>
        ),
        text: "Yes — message us on WhatsApp +91 88373 17070 with your order and location and we'll confirm delivery availability and timing.",
      },
      {
        q: "Can I order food for a large group or office?",
        a: (
          <>
            Absolutely. For large group, party or office orders, use our{" "}
            <Link to="/tab-bistro/catering" className="text-amber-400 underline">catering & bulk-orders page</Link>{" "}
            for the best rates and planning.
          </>
        ),
        text: "Absolutely. For large group, party or office orders, use our catering & bulk-orders page for the best rates and planning.",
      },
    ],
  },
  {
    id: "catering",
    label: "Catering, Bulk & Corporate Orders",
    icon: <PartyPopper className="w-4 h-4" />,
    items: [
      {
        q: "Does TAB Bistro do catering and bulk food orders in Shillong?",
        a: (
          <>
            Yes. TAB Bistro by XTSY handles wedding catering, corporate events, private parties and bulk food
            orders across Shillong and Meghalaya. Get a quote on the{" "}
            <Link to="/tab-bistro/catering" className="text-amber-400 underline">catering page</Link>.
          </>
        ),
        text: "Yes. TAB Bistro by XTSY handles wedding catering, corporate events, private parties and bulk food orders across Shillong and Meghalaya. Get a quote on the catering page.",
      },
      {
        q: "Do you cater corporate events and conferences?",
        a: (
          <>
            Yes — we cater corporate offsites, conferences and office parties with multi-cuisine buffets, live
            counters and packed meal boxes. See the{" "}
            <Link to="/tab-bistro/catering" className="text-amber-400 underline">corporate catering details</Link>.
          </>
        ),
        text: "Yes — we cater corporate offsites, conferences and office parties with multi-cuisine buffets, live counters and packed meal boxes. See the corporate catering details.",
      },
    ],
  },
];

const TabBistroFaqHub = memo(() => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.text },
      }))
    ),
  };

  return (
    <section id="faq-hub">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-2">
        Shillong Food, Takeaway, Delivery & Catering — FAQ Hub
      </h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-3xl">
        Everything about eating at, ordering from and catering with TAB Bistro by XTSY in Shillong.
      </p>

      <div className="space-y-8">
        {groups.map((g) => (
          <div key={g.id}>
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              {g.icon}
              <h3 className="text-sm font-semibold uppercase tracking-wide">{g.label}</h3>
            </div>
            <div className="space-y-3">
              {g.items.map((f) => (
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
          </div>
        ))}
      </div>
    </section>
  );
});

TabBistroFaqHub.displayName = "TabBistroFaqHub";
export default TabBistroFaqHub;
