import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/book-hostel-shillong")({
  beforeLoad: () => {
    throw redirect({ to: "/hostel-booking", replace: true });
  },
});
