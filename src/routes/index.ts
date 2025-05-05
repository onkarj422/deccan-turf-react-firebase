/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createRoute, createRouter,
} from '@tanstack/react-router';
import { Turf } from '@/lib/firebase/firestore/turfs';
import { BookingDetails } from '@/pages/booking/types';
import { Home } from '../pages/home';
import { rootRoute } from './__root';
import { loginRoute } from './login';
import { appRoute } from './app';

declare module '@tanstack/react-router' {
    interface HistoryState {
        bookingDetails?: BookingDetails;
        turf?: Turf;
    }
}

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
