import { ProtectedLayout } from "@/layout";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";
import { dashboardRoutes } from "./dashboard";

export const appRoute = createRoute({
    path: '/app',
    component: ProtectedLayout,
    getParentRoute: () => rootRoute,
})

appRoute.addChildren([dashboardRoutes]);
