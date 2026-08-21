import { createFileRoute } from "@tanstack/react-router";
import UserAuth from "@/pages/user/UserAuth";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/auth")({
  head: () =>
    buildRouteHead({
      path: "/auth",
      title: "Sign In to XTSY",
      description:
        "Sign in or create an XTSY account to manage bookings, track tour enquiries and unlock direct-booking member rates.",
      noIndex: true,
    }),
  component: UserAuth,
});
