import { createFileRoute } from "@tanstack/react-router";
import MeghalayaForInternationalTourists, { internationalFaqs } from "@/pages/MeghalayaForInternationalTourists";
import { buildRouteHead } from "@/lib/seo-head";

const PATH = "/travel-guide/meghalaya-for-international-tourists";
const URL = `https://xtsy.one${PATH}`;

export const Route = createFileRoute("/travel-guide/meghalaya-for-international-tourists")({
  head: () =>
    buildRouteHead({
      path: PATH,
      title: "Meghalaya for International Tourists: Visa & Permits",
      description:
        "Indian e-Visa rules, which Northeast states need permits, SIM cards, money, solo-traveller safety and Guwahati airport to Shillong transfers for foreign visitors.",
      keywords:
        "meghalaya for international tourists, india e-visa meghalaya, inner line permit northeast india, is meghalaya safe for solo travellers, shillong foreign tourists",
      ogType: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Meghalaya Travel Guide for International Tourists: Visas, Permits & Arrival",
          description:
            "What foreign visitors need to enter Meghalaya in 2026 — e-Visa, permits across the seven Northeast states, connectivity, safety and airport transfers.",
          mainEntityOfPage: URL,
          author: { "@type": "Organization", name: "XTSY Travel" },
          publisher: { "@type": "Organization", name: "XTSY Travel", url: "https://xtsy.one" },
          inLanguage: "en-IN",
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: internationalFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://xtsy.one/" },
            { "@type": "ListItem", position: 2, name: "Travel Guide", item: "https://xtsy.one/travel-guide/how-to-reach-meghalaya" },
            { "@type": "ListItem", position: 3, name: "Meghalaya for International Tourists", item: URL },
          ],
        },
      ],
    }),
  component: MeghalayaForInternationalTourists,
});
