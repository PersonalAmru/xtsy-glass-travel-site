import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/refund-cancellation-policy")({
  beforeLoad: () => {
    throw redirect({ to: "/pricing-cancellation-policy", replace: true });
  },
});
