import { createFileRoute } from "@tanstack/react-router";
import TabBistro from "@/pages/v2/BistroV2";
import { buildRouteHead } from "@/lib/seo-head";
import { RESTAURANT_SCHEMA } from "@/data/siteSchemas";

export const Route = createFileRoute("/tab-bistro/")({
  head: () =>
    buildRouteHead({
      path: "/tab-bistro",
      title: "TAB Bistro Shillong — Restaurant, Café & Catering",
      description:
        "TAB Bistro by XTSY, New Shillong Township: North Indian, Chinese, Thai, Continental and Italian, breakfast and wedding catering. Open 9 AM–10:30 PM.",
      keywords:
        "restaurant in shillong, best restaurant shillong, multi cuisine restaurant shillong, rooftop cafe shillong, wedding catering shillong, TAB Bistro",
      jsonLd: [RESTAURANT_SCHEMA],
    }),
  component: TabBistro,
});
