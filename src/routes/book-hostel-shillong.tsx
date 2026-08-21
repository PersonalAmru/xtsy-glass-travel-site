import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/book-hostel-shillong")({
  head: () =>
    buildRouteHead({
      path: "/book-hostel-shillong",
      title: "Book a Hostel in Shillong from Rs 369/Night | XTSY",
      description:
        "Book direct at XTSY Travellers Hostel Shillong. Mixed dorms from Rs 369, private rooms and the 270 degree glass suite, with free cancellation on direct bookings.",
    }),
  beforeLoad: () => {
    throw redirect({ to: "/hostel-booking", replace: true });
  },
});
