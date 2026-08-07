import { createFileRoute } from "@tanstack/react-router";
import UserInstall from "@/pages/install/UserInstall";

export const Route = createFileRoute("/install")({
  component: UserInstall,
});
