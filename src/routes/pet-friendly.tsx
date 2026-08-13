import { createFileRoute } from "@tanstack/react-router";
import PetFriendly from "@/pages/PetFriendly";

export const Route = createFileRoute("/pet-friendly")({
  component: PetFriendly,
});
