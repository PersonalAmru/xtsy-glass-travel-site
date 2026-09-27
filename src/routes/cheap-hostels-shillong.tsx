import { createFileRoute } from "@tanstack/react-router";
import StayHubV2 from "@/pages/v2/StayHubV2";
import { buildRouteHead } from "@/lib/seo-head";
import { stayHubCopy, stayHubSchema } from "@/data/stayHub";
import { COVERS } from "@/data/v2Images";
import { responsive } from "@/components/v2/primitives";

const copy = stayHubCopy("cheap");
const hero = responsive(COVERS.home);

export const Route = createFileRoute("/cheap-hostels-shillong")({
  head: () =>
    buildRouteHead({
      path: copy.path,
      title: copy.title,
      description: copy.description,
      keywords: copy.keywords,
      image: `https://xtsy.one${hero?.src ?? COVERS.home}`,
      preloadImage: hero?.src ?? COVERS.home,
      preloadImageSrcSet: hero?.srcSet,
      preloadImageSizes: "(max-width: 1024px) 100vw, 40vw",
      jsonLd: stayHubSchema("cheap"),
    }),
  component: CheapHostelHub,
});

function CheapHostelHub() {
  return <StayHubV2 variant="cheap" />;
}
