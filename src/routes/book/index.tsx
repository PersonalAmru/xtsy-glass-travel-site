import { createFileRoute } from "@tanstack/react-router";
import SimplifiedBookingFlow from "@/pages/SimplifiedBookingFlow";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/book/")({
  head: () =>
    buildRouteHead({
      path: "/book",
      title: "Hostel Booking Shillong — Book Dorms & Rooms Online | XTSY",
      description:
        "Online hostel booking made easy. Book a dorm bed or private room at XTSY Travellers Hostel, Shillong from ₹369/night. Instant confirmation, best direct price, no OTA fees.",
      keywords:
        "hostel booking, online hostel booking, book hostel shillong, dorm booking shillong, hostel booking meghalaya",
    }),
  component: SimplifiedBookingFlow,
});
