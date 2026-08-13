import { createFileRoute } from "@tanstack/react-router";
import UserAuth from "@/pages/user/UserAuth";

export const Route = createFileRoute("/auth")({
  component: UserAuth,
});
