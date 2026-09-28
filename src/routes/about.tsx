import { createFileRoute } from "@tanstack/react-router";
import AboutV2 from "@/pages/v2/AboutV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/about")({
  head: () =>
    buildRouteHead({
      path: "/about",
      title: "About XTSY — India's Biggest Hostel in Northeast India",
      description:
        "The story of XTSY Travellers Hostel, New Shillong Township: Experience by XTSY, India's first stargaze glamp, and a NEITA 2025 nomination.",
      keywords: "XTSY about, biggest hostel northeast, Shillong hostel story, NEITA 2025",
    }),
  component: AboutV2,
});
