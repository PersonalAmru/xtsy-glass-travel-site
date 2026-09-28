import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/book-hostel-shillong")({
  head: () =>
    buildRouteHead({
      path: "/book-hostel-shillong",
      title: "Book a Hostel in Shillong from Rs 389/Night | XTSY",
      description:
        "Book direct at XTSY Travellers Hostel Shillong. Mixed dorms from Rs 389, private rooms and Experience by XTSY, booked direct at the base rate.",
    }),
  beforeLoad: () => {
    throw redirect({ to: "/hostel-booking", replace: true });
  },
});
