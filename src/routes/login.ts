/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRoute, redirect } from '@tanstack/react-router';
import { Login } from '../pages/login';
import { rootRoute } from './__root';

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: Login,
    beforeLoad: ({ context }) => {
        if (context.auth.user) {
            throw redirect({ to: '/app' });
        }
    },
});
