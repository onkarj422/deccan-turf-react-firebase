import { createRoute, redirect } from '@tanstack/react-router';
import { appRoute } from './app';

export const appIndexRoute = createRoute({
    getParentRoute: () => appRoute,
    path: '/',
    beforeLoad: ({ context }) => {
        const { user } = context.auth;
        if (!user) return; // or throw redirect({ to: '/login' }) if you want to force login
        if (user.role === 'admin') {
            throw redirect({ to: '/app/dashboard' });
        } else {
            throw redirect({ to: '/app/turfs' });
        }
    },
    component: () => null,
});
