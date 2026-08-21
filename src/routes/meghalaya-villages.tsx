import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/destinations/CategoryPage";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/meghalaya-villages")({
  head: () =>
    buildRouteHead({
      path: "/meghalaya-villages",
      title: "Meghalaya Villages: Mawlynnong & Beyond | XTSY",
      description:
        "Visit Meghalaya's cleanest village Mawlynnong plus Kongthong, Nongriat and Riwai, with homestay etiquette, trek details and day trips out of Shillong.",
    }),
  component: CategoryPage,
});
