import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/travel")({
  beforeLoad: () => {
    throw redirect({ to: "/tours", replace: true });
  },
});
