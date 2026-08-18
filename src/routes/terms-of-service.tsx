import { createFileRoute } from "@tanstack/react-router";
import TermsOfService from "@/pages/TermsOfService";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/terms-of-service")({
  head: () =>
    buildRouteHead({
      path: "/terms-of-service",
      title: "Terms of Service | XTSY Travellers Hostel Shillong",
      description:
        "Booking terms and conditions for XTSY Travellers Hostel, tours and TAB Bistro — cancellation policy, payment rules, check-in times and guest guidelines.",
      keywords: "XTSY terms, booking terms, cancellation policy, hostel rules Shillong",
    }),
  component: TermsOfService,
});
