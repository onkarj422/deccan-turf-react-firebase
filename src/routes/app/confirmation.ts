import { createRoute } from '@tanstack/react-router';
import { Confirmation } from '@/pages/payment/confirmation';
import { appRoute } from './app';

export const confirmationRoute = createRoute({
    path: '/confirmation',
    component: Confirmation,
    getParentRoute: () => appRoute,
});
