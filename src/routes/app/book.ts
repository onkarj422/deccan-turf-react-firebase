import { createRoute } from '@tanstack/react-router';
import { Booking } from '@/pages/booking';
import { appRoute } from './app';

export const bookRoute = createRoute({
    path: '/book/$turfId',
    component: Booking,
    getParentRoute: () => appRoute,
    staticData: {
        title: 'Book a slot',
    },
});
