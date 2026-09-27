import { createFileRoute } from "@tanstack/react-router";
import TabBistro from "@/pages/v2/BistroV2";
import { buildRouteHead } from "@/lib/seo-head";
import { RESTAURANT_SCHEMA } from "@/data/siteSchemas";

export const Route = createFileRoute("/tab-bistro/")({
  head: () =>
    buildRouteHead({
      path: "/tab-bistro",
      title: "TAB Bistro Shillong — Multi-Cuisine Restaurant, Catering & Café",
      description:
        "TAB Bistro by XTSY — multi-cuisine restaurant in Shillong. North Indian, Chinese, Thai, Continental & Italian, breakfast, rooftop café, wedding catering. Open 9 AM–10:30 PM.",
      keywords:
        "restaurant in shillong, best restaurant shillong, multi cuisine restaurant shillong, rooftop cafe shillong, wedding catering shillong, TAB Bistro",
      jsonLd: [RESTAURANT_SCHEMA],
    }),
  component: TabBistro,
});
