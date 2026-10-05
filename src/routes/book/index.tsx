import { createFileRoute } from "@tanstack/react-router";
import SimplifiedBookingFlow from "@/pages/SimplifiedBookingFlow";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/book/")({
  head: () =>
    buildRouteHead({
      path: "/book",
      title: "Hostel Booking Shillong — Book Dorms & Rooms Online | XTSY",
      description:
        "Book XTSY, New Shillong Township: dorms from ₹399, King Double ₹2,399, Experience by XTSY ₹5,999, all inclusive. Check-in 11 AM, check-out 10 AM.",
      keywords:
        "hostel booking, online hostel booking, book hostel shillong, dorm booking shillong, hostel booking meghalaya",
    }),
  component: SimplifiedBookingFlow,
});
