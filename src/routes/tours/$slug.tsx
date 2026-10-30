import { createFileRoute, redirect } from "@tanstack/react-router";
import TourDetail from "@/pages/v2/TourDetailV2";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/tours/$slug")({
  beforeLoad: ({ params }) => {
    if (params.slug === "meghalaya-group-trip-6n-7d") {
      throw redirect({ to: "/tours", statusCode: 301 });
    }
  },
  // Head data (title, schema, hero preload) is imported on demand — server-side on first load —
  // so the full tour and package data stays out of the shared bundle.
  loader: async ({ params }) => (await import("@/lib/seo/tourPageData")).tourHead(params.slug),
  head: ({ loaderData, params }) =>
    buildRouteHead(
      loaderData ?? {
        path: `/tours/${params.slug}`,
        title: `${params.slug.replace(/-/g, " ")} | XTSY Tours`,
        description: "Tour packages across Meghalaya and Northeast India by XTSY, with stays, transport and local guides arranged for you.",
      },
    ),
  component: TourDetail,
});
