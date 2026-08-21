import { createFileRoute } from "@tanstack/react-router";
import GroupBookingsMeghalaya from "@/pages/GroupBookingsMeghalaya";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/group-bookings-meghalaya")({
  head: () =>
    buildRouteHead({
      path: "/group-bookings-meghalaya",
      title: "Group Bookings in Meghalaya: Stays & Tours | XTSY",
      description:
        "Group booking rates for Meghalaya trips: whole-dorm buyouts, college and corporate groups, transport, guides and TAB Bistro meals arranged from Shillong.",
    }),
  component: GroupBookingsMeghalaya,
});
