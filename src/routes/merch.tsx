import { createFileRoute } from "@tanstack/react-router";
import MerchV2 from "@/pages/v2/MerchV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/merch")({
  head: () =>
    buildRouteHead({
      path: "/merch",
      title: "XTSY Merch — Travel Gear & Work-from-Anywhere Kit",
      description:
        "Travel gear and work-from-anywhere kit designed at XTSY Travellers Hostel, New Shillong Township. Tap Notify me to hear the day each piece drops.",
      keywords: "xtsy merch, travel merchandise india, digital nomad kit, xtsy backpack",
    }),
  component: MerchV2,
});
