import { createFileRoute } from "@tanstack/react-router";
import PricingCancellationPolicy from "@/pages/PricingCancellationPolicy";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/pricing-cancellation-policy")({
  head: () =>
    buildRouteHead({
      path: "/pricing-cancellation-policy",
      title: "Pricing & Cancellation Policy | XTSY Shillong",
      description:
        "XTSY room rates, taxes, deposits and the full cancellation and no-show policy for hostel bookings, tour packages and group reservations.",
    }),
  component: PricingCancellationPolicy,
});
