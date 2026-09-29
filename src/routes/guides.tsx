import { createFileRoute } from "@tanstack/react-router";
import GuidesDirectoryV2 from "@/pages/v2/GuidesDirectoryV2";
import { buildRouteHead } from "@/lib/seo-head";
import { fetchGuideDirectory } from "@/lib/seo/pageData.functions";

export const Route = createFileRoute("/guides")({
  // The directory is built on the server so the guide data stays out of the JavaScript bundle.
  loader: () => fetchGuideDirectory(),
  head: ({ loaderData }) => {
    const items = loaderData?.groups.flatMap((g) => g.pages) ?? [];
    return buildRouteHead({
      path: "/guides",
      title: "All Shillong & Meghalaya Travel Guides A–Z | XTSY",
      description: "Every XTSY guide in one place: hostels and stays in Shillong, Meghalaya itineraries, waterfalls, tours, food and Northeast India trips.",
      keywords: "Shillong travel guides, Meghalaya guides, Northeast India travel guide, XTSY guides",
      jsonLd: [{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "All Shillong & Meghalaya travel guides",
        url: "https://xtsy.one/guides",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: items.length,
          itemListElement: items.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.label, url: `https://xtsy.one/${p.slug}` })),
        },
      }],
    });
  },
  component: GuidesDirectoryV2,
});
