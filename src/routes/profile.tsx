import { createFileRoute } from "@tanstack/react-router";
import UserProfile from "@/pages/user/UserProfile";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/profile")({
  head: () =>
    buildRouteHead({
      path: "/profile",
      title: "Your XTSY Profile & Bookings",
      description:
        "Manage your XTSY profile, view upcoming and past bookings, download invoices and update contact and travel preferences.",
      noIndex: true,
    }),
  component: UserProfile,
});
