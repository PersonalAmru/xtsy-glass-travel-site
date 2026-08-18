import { createFileRoute } from "@tanstack/react-router";
import Tours from "@/pages/Tours";
import { buildRouteHead } from "@/lib/seo-head";
import toursHeroImg from "@/assets/tours-hero-mountains-900.webp";

export const Route = createFileRoute("/tours/")({
  head: () =>
    buildRouteHead({
      path: "/tours",
      title: "Northeast India Tour Packages from ₹7,999 | XTSY Travel",
      description:
        "30+ curated Meghalaya, Nagaland, Assam, Arunachal & Sikkim tours from ₹7,999. Living root bridges, Dawki, tribal festivals. Book direct and save 20-30% vs OTAs.",
      preloadImage: toursHeroImg,
      keywords:
        "Northeast India tours, Meghalaya tour packages, Nagaland tours, Assam safari, Arunachal Pradesh trips, Sikkim tours",
    }),
  component: Tours,
});
