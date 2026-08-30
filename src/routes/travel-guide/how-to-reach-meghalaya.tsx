import { createFileRoute } from "@tanstack/react-router";
import HowToReachMeghalaya, { howToReachFaqs } from "@/pages/HowToReachMeghalaya";
import { buildRouteHead } from "@/lib/seo-head";

const PATH = "/travel-guide/how-to-reach-meghalaya";
const URL = `https://xtsy.one${PATH}`;

export const Route = createFileRoute("/travel-guide/how-to-reach-meghalaya")({
  head: () =>
    buildRouteHead({
      path: PATH,
      title: "How to Reach Meghalaya & Shillong (2026 Guide)",
      description:
        "Flights, trains and road transfers into Meghalaya: fly Guwahati (GAU), 100 km / 3.5 hrs to Shillong. 2026 taxi and bus fares, timings and arrival tips.",
      keywords:
        "how to reach meghalaya, how to reach shillong, guwahati airport to shillong taxi, nearest airport to shillong, shillong railway station",
      ogType: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How to Reach Meghalaya & Shillong: Flights, Trains & Road Transfers",
          description:
            "Every realistic route into Meghalaya in 2026 — airports, why there is no train to Shillong, road transfer costs and arrival timing.",
          mainEntityOfPage: URL,
          author: { "@type": "Organization", name: "XTSY Travel" },
          publisher: {
            "@type": "Organization",
            name: "XTSY Travel",
            url: "https://xtsy.one",
          },
          inLanguage: "en-IN",
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: howToReachFaqs.map((f) => ({
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
            { "@type": "ListItem", position: 3, name: "How to Reach Meghalaya", item: URL },
          ],
        },
      ],
    }),
  component: HowToReachMeghalaya,
});
