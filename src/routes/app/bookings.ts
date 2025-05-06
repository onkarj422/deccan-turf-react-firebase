import { Bookings } from '@/pages/bookings';
import { createRoute, redirect } from '@tanstack/react-router';
import { appRoute } from './app';

export const bookingsRoute = createRoute({
    path: '/bookings',
    component: Bookings,
    getParentRoute: () => appRoute,
    staticData: {
        title: 'Bookings',
    },
    beforeLoad: ({ context }) => {
        const { user } = context.auth;
        if (!user || user.role !== 'admin') {
            throw redirect({ to: '/' });
        }
    },
});
