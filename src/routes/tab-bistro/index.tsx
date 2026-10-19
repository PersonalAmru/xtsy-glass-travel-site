import { createFileRoute } from "@tanstack/react-router";
import TabBistro from "@/pages/v2/BistroV2";
import { buildRouteHead } from "@/lib/seo-head";
import { RESTAURANT_SCHEMA } from "@/data/siteSchemas";

export const Route = createFileRoute("/tab-bistro/")({
  head: () =>
    buildRouteHead({
      path: "/tab-bistro",
      title: "Restaurant in Shillong | TAB Bistro by XTSY",
      description:
        "Forest dining at TAB Bistro, New Shillong Township. North Indian, Indo-Chinese, Thai, Continental & Italian. View menu or reserve a table. Daily 9 AM–10:30 PM.",
      keywords:
        "restaurant in shillong, best restaurant shillong, multi cuisine restaurant shillong, rooftop cafe shillong, wedding catering shillong, TAB Bistro",
      jsonLd: [RESTAURANT_SCHEMA],
    }),
  component: TabBistro,
});
