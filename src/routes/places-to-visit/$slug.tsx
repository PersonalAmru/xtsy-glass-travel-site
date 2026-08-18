import { createFileRoute, redirect } from "@tanstack/react-router";
import { destinationPath } from "@/data/neTaxonomy";
import { getDestinationBySlug } from "@/data/meghalayaDestinations";

/**
 * LEGACY URL — permanently moved into the hierarchical taxonomy
 * (/destinations/:state/:city/:attraction). 301 keeps indexed equity.
 */
export const Route = createFileRoute("/places-to-visit/$slug")({
  beforeLoad: ({ params }) => {
    const dest = getDestinationBySlug(params.slug);
    if (dest) {
      throw redirect({ to: destinationPath(dest.slug), statusCode: 301 });
    }
  },
  component: () => null,
});
