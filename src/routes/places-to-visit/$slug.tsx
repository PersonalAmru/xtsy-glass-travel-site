import { createFileRoute, redirect } from "@tanstack/react-router";
import { destinationPath } from "@/data/neTaxonomy";
import { getDestinationBySlug } from "@/data/meghalayaDestinations";
import { GONE_SLUGS } from "@/data/seoGoneSlugs";
import { buildRouteHead } from "@/lib/seo-head";
import DestinationDetail from "@/pages/v2/DestinationV2";

/**
 * LEGACY URL — permanently moved into the hierarchical taxonomy
 * (/destinations/:state/:city/:attraction). 301 keeps indexed equity.
 */
export const Route = createFileRoute("/places-to-visit/$slug")({
  head: ({ params }) => {
    const place = params.slug.replace(/-/g, " ");
    return buildRouteHead({
      path: `/places-to-visit/${params.slug}`,
      title: `${place} — Page Moved | XTSY Meghalaya Guide`.slice(0, 70),
      description:
        "This guide has moved into the XTSY destinations directory. Browse Meghalaya attractions, timings and travel routes there instead.",
      noIndex: true,
    });
  },
  loader: ({ params }) => {
    if (!GONE_SLUGS.has(params.slug)) {
      const dest = getDestinationBySlug(params.slug);
      if (dest) {
        throw redirect({ to: destinationPath(dest.slug), statusCode: 301 });
      }
    }
  },
  component: DestinationDetail,
});

