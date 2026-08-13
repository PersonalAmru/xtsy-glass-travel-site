import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  beforeLoad: () => {
    throw redirect({ to: "/terms-of-service", replace: true });
  },
});
