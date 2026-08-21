import { createFileRoute } from "@tanstack/react-router";
import FranchiseLogin from "@/pages/franchise/FranchiseLogin";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/franchise/login")({
  head: () =>
    buildRouteHead({
      path: "/franchise/login",
      title: "XTSY Franchise Partner Login",
      description:
        "Secure sign-in for XTSY franchise partners to manage inventory, rates and bookings for their property.",
      noIndex: true,
    }),
  component: FranchiseLogin,
});
