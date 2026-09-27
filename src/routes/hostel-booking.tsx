import { createFileRoute } from "@tanstack/react-router";
import HostelBookingShillong from "@/pages/HostelBookingShillong";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/hostel-booking")({
  head: () =>
    buildRouteHead({
      path: "/hostel-booking",
      title: "Hostel Booking in Shillong — Direct Online Booking from ₹399 | XTSY",
      description:
        "Online hostel booking in Shillong, Meghalaya. Instant confirmation, free cancellation, dorm beds from ₹399. Book direct — cheaper than Hostelworld and Booking.com.",
      keywords:
        "hostel booking, online hostel booking, hostel booking shillong, book hostel meghalaya, cheap hostel booking",
    }),
  component: HostelBookingShillong,
});
