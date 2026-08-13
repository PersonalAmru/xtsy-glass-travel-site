import { createFileRoute } from "@tanstack/react-router";
import UserProfile from "@/pages/user/UserProfile";

export const Route = createFileRoute("/profile")({
  component: UserProfile,
});
