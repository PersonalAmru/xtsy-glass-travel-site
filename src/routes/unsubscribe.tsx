import { createFileRoute } from "@tanstack/react-router";
import Unsubscribe from "@/pages/Unsubscribe";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/unsubscribe")({
  head: () =>
    buildRouteHead({
      path: "/unsubscribe",
      title: "Unsubscribe from XTSY Emails",
      description:
        "Manage your XTSY email preferences or unsubscribe from marketing updates. Booking and transactional emails are sent separately.",
      noIndex: true,
    }),
  component: Unsubscribe,
});
