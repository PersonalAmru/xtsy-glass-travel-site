import { createFileRoute } from "@tanstack/react-router";
import MeghalayaPhotoGallery from "@/pages/destinations/MeghalayaPhotoGallery";

export const Route = createFileRoute("/meghalaya-photo-gallery")({
  component: MeghalayaPhotoGallery,
});
