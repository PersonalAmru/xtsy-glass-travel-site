import { createFileRoute } from "@tanstack/react-router";
import MeghalayaTourPackages from "@/pages/destinations/MeghalayaTourPackages";

export const Route = createFileRoute("/meghalaya-tour-packages")({
  component: MeghalayaTourPackages,
});
