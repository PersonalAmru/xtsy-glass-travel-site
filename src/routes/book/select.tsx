import { createFileRoute } from "@tanstack/react-router";
import PropertySelector from "@/pages/PropertySelector";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/book/select")({
  head: () =>
    buildRouteHead({
      path: "/book/select",
      title: "Choose Your XTSY Property to Book",
      description:
        "Pick between XTSY Travellers Hostel Shillong, the XTSY 270 glass suite and the Dawki adventure campsite, then check live availability and book direct.",
    }),
  component: PropertySelector,
});
