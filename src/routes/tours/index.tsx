import { createFileRoute } from "@tanstack/react-router";
import Tours from "@/pages/v2/ToursV2";
import { buildRouteHead } from "@/lib/seo-head";
import toursHero900 from "@/assets/tours-hero-mountains-900.webp";
import toursHero1600 from "@/assets/tours-hero-mountains-1600.webp";
import toursHeroImg from "@/assets/tours-hero-mountains.jpg";

export const Route = createFileRoute("/tours/")({
  head: () =>
    buildRouteHead({
      path: "/tours",
      title: "Northeast India Tour Packages from ₹7,999 | XTSY Travel",
      description:
        "30+ curated Meghalaya, Nagaland, Assam, Arunachal & Sikkim tours from ₹7,999. Living root bridges, Dawki, tribal festivals. Book direct and save 20-30% vs OTAs.",
      preloadImage: toursHero900,
      preloadImageSrcSet: `${toursHero900} 900w, ${toursHero1600} 1600w, ${toursHeroImg} 1920w`,
      preloadImageSizes: "100vw",
      keywords:
        "Northeast India tours, Meghalaya tour packages, Nagaland tours, Assam safari, Arunachal Pradesh trips, Sikkim tours",
    }),
  component: Tours,
});
