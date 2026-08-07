import { createFileRoute } from "@tanstack/react-router";
import FemaleTravellers from "@/pages/FemaleTravellers";

export const Route = createFileRoute("/female-travellers")({
  component: FemaleTravellers,
});
