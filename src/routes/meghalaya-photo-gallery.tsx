import { createFileRoute } from "@tanstack/react-router";
import MeghalayaPhotoGallery from "@/pages/destinations/MeghalayaPhotoGallery";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/meghalaya-photo-gallery")({
  head: () =>
    buildRouteHead({
      path: "/meghalaya-photo-gallery",
      title: "Meghalaya Photo Gallery: Real Trip Photos | XTSY",
      description:
        "Unfiltered photos from Meghalaya trips run by XTSY: living root bridges, Nohkalikai, Umngot river, Mawlynnong and life inside our Shillong hostel.",
    }),
  component: MeghalayaPhotoGallery,
});
