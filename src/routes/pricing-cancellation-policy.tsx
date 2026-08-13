import { createFileRoute } from "@tanstack/react-router";
import PricingCancellationPolicy from "@/pages/PricingCancellationPolicy";

export const Route = createFileRoute("/pricing-cancellation-policy")({
  component: PricingCancellationPolicy,
});
