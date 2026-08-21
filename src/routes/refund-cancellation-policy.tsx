import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/refund-cancellation-policy")({
  head: () =>
    buildRouteHead({
      path: "/refund-cancellation-policy",
      title: "Refund & Cancellation Policy | XTSY Travel",
      description:
        "Refund timelines, cancellation windows and processing charges for XTSY hostel bookings, Meghalaya tour packages and TAB Bistro catering orders.",
    }),
  beforeLoad: () => {
    throw redirect({ to: "/pricing-cancellation-policy", replace: true });
  },
});
