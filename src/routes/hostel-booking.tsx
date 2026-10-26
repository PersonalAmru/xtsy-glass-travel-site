import { createFileRoute } from "@tanstack/react-router";
import HostelBookingShillong from "@/pages/HostelBookingShillong";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/hostel-booking")({
  head: () =>
    buildRouteHead({
      path: "/hostel-booking",
      title: "Hostel Booking in Shillong — Direct from ₹399 | XTSY",
      description:
         "Enquire about XTSY hostel stays in New Shillong Township, Shillong. Dorm beds from ₹399. Choose dates and a room, then confirm with the desk on WhatsApp.",
      keywords:
        "hostel booking, online hostel booking, hostel booking shillong, book hostel meghalaya, budget-friendly hostel booking",
    }),
  component: HostelBookingShillong,
});
