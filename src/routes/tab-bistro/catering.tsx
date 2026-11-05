import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tab-bistro/catering")({
  beforeLoad: () => {
    throw redirect({ to: "/catering-shillong", statusCode: 301 });
  },
});
