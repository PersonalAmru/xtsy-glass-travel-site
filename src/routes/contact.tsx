import { createFileRoute } from "@tanstack/react-router";
import ContactV2 from "@/pages/v2/ContactV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildRouteHead({
      path: "/contact",
      title: "Contact XTSY Shillong: Phone, Address & Map",
      description:
        "Reach XTSY Travellers Hostel Shillong on +91 8837317070, message us on WhatsApp, or find directions to New Shillong Township for check-in and group enquiries.",
    }),
  component: ContactV2,
});
