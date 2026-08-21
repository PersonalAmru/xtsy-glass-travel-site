import { createFileRoute } from "@tanstack/react-router";
import CampsiteBookingFlow from "@/pages/CampsiteBookingFlow";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/book/campsite")({
  head: () =>
    buildRouteHead({
      path: "/book/campsite",
      title: "Book the Dawki Riverside Campsite | XTSY",
      description:
        "Check dates and book riverside tents at the XTSY Dawki campsite on the Umngot river, with meals, bonfire and kayaking add-ons at direct rates.",
    }),
  component: CampsiteBookingFlow,
});
