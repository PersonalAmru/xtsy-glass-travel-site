import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo-head";
import AdminLogin from "@/pages/AdminLogin";

export const Route = createFileRoute("/admin-login")({
  head: () =>
    buildRouteHead({
      path: "/admin-login",
      title: "Admin Login | XTSY",
      description: "Internal staff sign-in for the XTSY admin console.",
      noIndex: true,
    }),
  component: AdminLogin,
});
