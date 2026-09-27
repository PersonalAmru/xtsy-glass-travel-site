import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/v2/CategoryV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/meghalaya-caves")({
  head: () =>
    buildRouteHead({
      path: "/meghalaya-caves",
      title: "Meghalaya Caves: Mawsmai, Arwah & Siju Guide | XTSY",
      description:
        "Guide to caving in Meghalaya: Mawsmai, Arwah, Liat Prah and Siju, with difficulty, entry fees, timings, safety notes and guided caving trips from Shillong.",
    }),
  component: CategoryPage,
});
