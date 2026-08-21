import { createFileRoute } from "@tanstack/react-router";
import PetFriendly from "@/pages/PetFriendly";
import { buildRouteHead } from "@/lib/seo-head";

export const Route = createFileRoute("/pet-friendly")({
  head: () =>
    buildRouteHead({
      path: "/pet-friendly",
      title: "Pet Friendly Stay in Shillong, Meghalaya | XTSY",
      description:
        "Travelling with a pet in Meghalaya? See XTSY's pet policy, which room types allow pets, nearby vets, and walking routes around New Shillong Township.",
    }),
  component: PetFriendly,
});
