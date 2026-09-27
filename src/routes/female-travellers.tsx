import { createFileRoute } from "@tanstack/react-router";
import WomenSafeV2 from "@/pages/v2/WomenSafeV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/female-travellers")({
  head: () =>
    buildRouteHead({
      path: "/female-travellers",
      title: "Solo Female Travellers in Shillong: Safe Stay | XTSY",
      description:
        "Safety guidance for solo female travellers in Meghalaya, plus female-only dorms, 24x7 staffed reception and CCTV-covered common areas at XTSY Shillong.",
    }),
  component: WomenSafeV2,
});
