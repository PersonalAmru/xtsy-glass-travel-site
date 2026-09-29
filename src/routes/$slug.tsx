import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import ProgrammaticV2 from "@/pages/v2/ProgrammaticV2";
import { buildRouteHead } from "@/lib/seo-head";
import { fetchProgrammaticPage } from "@/lib/seo/pageData.functions";

export const Route = createFileRoute("/$slug")({
  // The page's text comes from the server, so the ~480 guides never ship in the JavaScript bundle.
  // Unknown or thin slugs answer with a real 404; retired slugs with a server-side 301.
  loader: async ({ params }) => {
    const data = await fetchProgrammaticPage({ data: params.slug });
    if (data.status === "redirect") throw redirect({ to: data.to, statusCode: 301 });
    if (data.status !== "ok") throw notFound();
    return data;
  },
  head: ({ loaderData, params }) =>
    loaderData?.status === "ok"
      ? buildRouteHead(loaderData.head)
      : buildRouteHead({
          path: `/${params.slug}`,
          title: "Page not found | XTSY",
          description: "This page is unavailable. Explore XTSY hostel stays, Meghalaya tours and TAB Bistro dining.",
          noIndex: true,
        }),
  component: ProgrammaticV2,
});
