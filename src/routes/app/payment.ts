import { createRoute } from '@tanstack/react-router';
import { Payment } from '@/pages/payment';
import { appRoute } from './app';

export const paymentRoute = createRoute({
    path: '/payment',
    component: Payment,
    getParentRoute: () => appRoute,
    staticData: {
        title: 'Payment',
    },
});
