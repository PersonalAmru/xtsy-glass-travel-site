import { createFileRoute } from "@tanstack/react-router";
import DestinationWeddingShillong from "@/pages/DestinationWeddingShillong";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/destination-wedding-shillong")({
  head: () =>
    buildRouteHead({
      path: "/destination-wedding-shillong",
      title: "Destination Wedding Venue in Shillong | XTSY",
      description:
        "Host an intimate destination wedding in Shillong with XTSY: mountain-view venues, group accommodation, TAB Bistro catering and full event coordination.",
    }),
  component: DestinationWeddingShillong,
});
