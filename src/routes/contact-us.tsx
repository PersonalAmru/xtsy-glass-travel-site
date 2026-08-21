import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/contact-us")({
  head: () =>
    buildRouteHead({
      path: "/contact-us",
      title: "Contact Us | XTSY Travellers Hostel Shillong",
      description:
        "Get in touch with the XTSY team in Shillong for bookings, tours, catering and franchise enquiries. Phone, WhatsApp, email and location details in one place.",
    }),
  beforeLoad: () => {
    throw redirect({ to: "/contact", replace: true });
  },
});
