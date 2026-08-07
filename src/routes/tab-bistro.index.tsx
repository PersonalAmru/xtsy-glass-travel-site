import { createFileRoute } from "@tanstack/react-router";
import TabBistro from "@/pages/TabBistro";

export const Route = createFileRoute("/tab-bistro/")({
  component: TabBistro,
});
