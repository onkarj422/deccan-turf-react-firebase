import { ProtectedLayout } from "@/layout";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";
import { dashboardRoute } from "./dashboard";
import { bookRoute } from "./book";

export const appRoute = createRoute({
    path: '/app',
    component: ProtectedLayout,
    getParentRoute: () => rootRoute,
})

appRoute.addChildren([dashboardRoute, bookRoute]);
