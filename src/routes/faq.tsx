import { createFileRoute } from "@tanstack/react-router";
import FaqV2 from "@/pages/v2/FaqV2";
import { faqSchema } from "@/pages/v2/faqData";
import { buildRouteHead } from "@/lib/seo-head";
import { COVERS } from "@/data/v2Images";

export const Route = createFileRoute("/faq")({
  head: () =>
    buildRouteHead({
      path: "/faq",
      title: "Hostel FAQs — Shillong Rates, Safety & WhatsApp Booking | XTSY",
      description:
        "Shillong dorms ₹399/₹499/₹599, GST included. XTSY FAQs on solo-women safety, New Shillong Township, check-in and WhatsApp enquiries.",
      image: new URL(COVERS.home, 'https://xtsy.one').href,
      jsonLd: [faqSchema()],
      keywords: "XTSY FAQ, hostel Shillong questions, Experience by XTSY FAQ, booking help XTSY",
    }),
  component: FaqV2,
});
