import { createFileRoute } from "@tanstack/react-router";
import StateHub from "@/pages/destinations/StateHub";
import { buildRouteHead } from "@/lib/seo-head";
import { getStateBySlug } from "@/data/neTaxonomy";

export const Route = createFileRoute("/destinations/$state/")({
  head: ({ params }) => {
    const state = getStateBySlug(params.state);
    const name = state?.name ?? "Northeast India";
    return buildRouteHead({
      path: `/destinations/${params.state}`,
      title: `${name} Travel Guide — Places, Routes & Stays | XTSY`,
      description:
        state?.blurb.slice(0, 155) ??
        "Travel guide to Northeast India: attractions, base towns, how to reach and where to stay.",
      noIndex: !state,
    });
  },
  component: StateHub,
});
