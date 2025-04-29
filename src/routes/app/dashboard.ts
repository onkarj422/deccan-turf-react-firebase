import { Dashboard } from "@/pages/dashboard";
import { createRoute } from "@tanstack/react-router";
import { appRoute } from "./app";

export const dashboardRoute = createRoute({
  path: '/dashboard',
  component: Dashboard,
  getParentRoute: () => appRoute,
})