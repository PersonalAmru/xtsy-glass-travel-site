import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/privacy-policy")({
  head: () =>
    buildRouteHead({
      path: "/privacy-policy",
      title: "Privacy Policy | XTSY Travellers Hostel Shillong",
      description:
        "How XTSY collects, uses and protects your personal data for hostel bookings, tours and dining. GDPR and India DPDP compliant privacy policy.",
      keywords: "XTSY privacy policy, data protection, DPDP compliance, booking privacy",
    }),
  component: PrivacyPolicy,
});
