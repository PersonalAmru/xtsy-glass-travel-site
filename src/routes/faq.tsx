import { createFileRoute } from "@tanstack/react-router";
import FaqV2 from "@/pages/v2/FaqV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/faq")({
  head: () =>
    buildRouteHead({
      path: "/faq",
      title: "FAQ — XTSY Travellers Hostel, New Shillong Township",
      description:
        "Answers about XTSY Travellers Hostel on Mawdiangdiang Road, New Shillong Township: rooms, Experience by XTSY, check-in, pets, tours and booking.",
      keywords: "XTSY FAQ, hostel Shillong questions, Experience by XTSY FAQ, booking help XTSY",
    }),
  component: FaqV2,
});
