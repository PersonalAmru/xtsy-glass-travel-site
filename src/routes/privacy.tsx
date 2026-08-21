import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/privacy")({
  head: () =>
    buildRouteHead({
      path: "/privacy",
      title: "Privacy Notice | XTSY Travellers Hostel Shillong",
      description:
        "How XTSY handles guest data across bookings, tours and dining, including consent, retention and your rights under GDPR and India's DPDP Act.",
    }),
  beforeLoad: () => {
    throw redirect({ to: "/privacy-policy", replace: true });
  },
});
