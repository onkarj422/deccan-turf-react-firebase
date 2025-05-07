import { Dashboard } from '@/pages/dashboard';
import { createRoute, redirect } from '@tanstack/react-router';
import { appRoute } from './app';

export const dashboardRoute = createRoute({
    path: '/dashboard',
    component: Dashboard,
    getParentRoute: () => appRoute,
    beforeLoad: ({ context }) => {
        const { user } = context.auth;
        if (!user || user.role !== 'admin') {
            throw redirect({ to: '/' });
        }
    },
    staticData: {
        disableNavBar: true,
        title: 'Dashboard',
    },
});
