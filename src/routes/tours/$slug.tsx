import { createFileRoute } from "@tanstack/react-router";
import TourDetail from "@/pages/v2/TourDetailV2";
import { buildRouteHead } from "@/lib/seo-head";
import { fetchTourHead } from "@/lib/seo/pageData.functions";

export const Route = createFileRoute("/tours/$slug")({
  // Head data (title, schema, hero preload) is built on the server so the full tour and package
  // data stays out of the shared JavaScript bundle. The page component loads its own chunk.
  loader: ({ params }) => fetchTourHead({ data: params.slug }),
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
