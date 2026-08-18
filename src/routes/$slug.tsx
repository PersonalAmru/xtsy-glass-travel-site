import { createFileRoute } from "@tanstack/react-router";
import ProgrammaticSEOPage from "@/pages/seo/ProgrammaticSEOPage";
import { buildRouteHead } from "@/lib/seo-head";
import { findSEOPage } from "@/data/seoPages";

export const Route = createFileRoute("/$slug")({
  head: ({ params }) => {
    const page = findSEOPage(params.slug);
    if (!page) {
      return buildRouteHead({
        path: `/${params.slug}`,
        title: "Page not found | XTSY",
        description: "This page is unavailable. Explore XTSY hostel stays, Meghalaya tours and TAB Bistro dining.",
        noIndex: true,
      });
    }
    return buildRouteHead({
      path: `/${page.slug}`,
      title: page.title,
      description: page.metaDescription,
      keywords: page.keywords?.join(", "),
    });
  },
  component: ProgrammaticSEOPage,
});
