/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createRoute, createRouter,
} from '@tanstack/react-router';
import { Home } from '../pages/home';
import { rootRoute } from './__root';
import { loginRoute } from './login';
import { appRoute } from './app/app';

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, appRoute]);

const router = createRouter({
    routeTree,
    context: {
        auth: undefined!,
    },
});

export { router, routeTree };
