import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { RECOVERY_REDIRECTS } from "@/data/seoAffectedSlugs";
import { CANONICAL_TWIN } from "@/data/seoIndexPolicy";
import ProgrammaticV2 from "@/pages/v2/ProgrammaticV2";
import { buildRouteHead } from "@/lib/seo-head";
import { programmaticModel, schemaFor, isThinSEOPage } from "@/lib/seo/programmaticSeo";

export const Route = createFileRoute("/$slug")({
  // Unknown or thin slugs must answer with a real 404 status (not a "not found" page served as 200),
  // and retired slugs with a server-side 301 — so search engines drop or move them.
  beforeLoad: ({ params }) => {
    const model = programmaticModel(params.slug);
    if (!model) {
      const to = RECOVERY_REDIRECTS[params.slug];
      if (to) throw redirect({ to, statusCode: 301 });
      throw notFound();
    }
    if (isThinSEOPage(model.page)) throw notFound();
  },
  head: ({ params }) => {
    try {
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
        path: `/${CANONICAL_TWIN[page.slug] ?? page.slug}`,
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
    } catch (err) {
      // Never turn a lookup failure into a bare 500: log it and serve a plain head.
      console.error("[head] $slug.tsx", err);
      return buildRouteHead({ path: `/${params.slug}`, title: `${params.slug.replace(/-/g, " ")} | XTSY`, description: "XTSY Travellers Hostel, New Shillong Township: dorms, private rooms and trips across Meghalaya and Northeast India." });
    }
  },
  component: ProgrammaticV2,
});
