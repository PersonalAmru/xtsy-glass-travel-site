import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminBookingsCalendar from "@/pages/admin/AdminBookingsCalendar";

export const Route = createFileRoute("/admin/bookings")({
  head: () =>
    buildRouteHead({
      path: "/admin/bookings",
      title: "Admin Bookings Calendar | XTSY",
      description: "Internal booking calendar and reservation management for XTSY.",
      noIndex: true,
    }),
  component: AdminBookingsCalendar,
});
