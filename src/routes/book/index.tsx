import { createFileRoute } from "@tanstack/react-router";
import SimplifiedBookingFlow from "@/pages/SimplifiedBookingFlow";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/book/")({
  head: () =>
    buildRouteHead({
      path: "/book",
      title: "Hostel Booking Shillong — Book Dorms & Rooms Online | XTSY",
      description:
        "Enquire about XTSY stays in New Shillong Township: dorm beds from ₹389, King Double ₹2,200 and Panorama ₹5,399 stay only or ₹5,799 with breakfast for two. Check-in 11 AM; check-out strictly 10 AM.",
      keywords:
        "hostel booking, online hostel booking, book hostel shillong, dorm booking shillong, hostel booking meghalaya",
    }),
  component: SimplifiedBookingFlow,
});
