import { createFileRoute } from "@tanstack/react-router";
import ProgrammaticV2 from "@/pages/v2/ProgrammaticV2";
import { buildRouteHead } from "@/lib/seo-head";
import { programmaticModel, schemaFor } from "@/lib/seo/programmaticSeo";

export const Route = createFileRoute("/$slug")({
  head: ({ params }) => {
    const model = programmaticModel(params.slug);
    if (!model) {
      return buildRouteHead({
        path: `/${params.slug}`,
        title: "Page not found | XTSY",
        description: "This page is unavailable. Explore XTSY hostel stays, Meghalaya tours and TAB Bistro dining.",
        noIndex: true,
      });
    }
    const { page, hero } = model;
    return buildRouteHead({
      path: `/${page.slug}`,
      title: page.title,
      description: page.metaDescription,
      keywords: page.keywords?.join(", "),
      // Near-duplicate "hostel in <other town> tonight" pages: visible, but not indexed.
      noIndex: model.noindex,
      noIndexFollow: model.noindex,
      image: `https://xtsy.one${hero.src}`,
      ogType: page.schemaType === "Article" || page.schemaType === "TravelGuide" ? "article" : "website",
      preloadImage: hero.src,
      preloadImageSrcSet: hero.srcSet,
      preloadImageSizes: hero.srcSet ? "(max-width: 1024px) 100vw, 40vw" : undefined,
      // All structured data is server-rendered so AI crawlers that don't run JS still see it.
      jsonLd: schemaFor(page),
    });
  },
  component: ProgrammaticV2,
});
