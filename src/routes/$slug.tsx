import { createFileRoute } from "@tanstack/react-router";
import ProgrammaticSEOPage from "@/pages/seo/ProgrammaticSEOPage";

export const Route = createFileRoute("/$slug")({
  component: ProgrammaticSEOPage,
});
