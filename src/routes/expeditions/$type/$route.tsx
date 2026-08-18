import { createFileRoute } from "@tanstack/react-router";
import ExpeditionRoutePage from "@/pages/expeditions/ExpeditionRoutePage";
import { buildRouteHead } from "@/lib/seo-head";
import { getExpeditionRoute } from "@/data/neTaxonomy";

export const Route = createFileRoute("/expeditions/$type/$route")({
  head: ({ params }) => {
    const expedition = getExpeditionRoute(params.type, params.route);
    return buildRouteHead({
      path: `/expeditions/${params.type}/${params.route}`,
      title: expedition
        ? `${expedition.name} — ${params.type === "4x4" ? "4x4" : "Motorbike"} Route | XTSY`.slice(0, 65)
        : "Expedition Route | XTSY",
      description:
        "Route structure for Northeast India expeditions. Full distance, permit and season details are published in the expeditions content phase.",
      noIndex: true,
    });
  },
  component: ExpeditionRoutePage,
});
