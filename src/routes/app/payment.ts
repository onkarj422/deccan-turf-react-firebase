import { createRoute, redirect } from '@tanstack/react-router';
import { Payment } from '@/pages/payment';
import { appRoute } from './app';

export const paymentRoute = createRoute({
    path: '/payment',
    component: Payment,
    getParentRoute: () => appRoute,
    beforeLoad: ({ context }) => {
        const { user } = context.auth;
        if (!user || user.role !== 'admin') {
            throw redirect({ to: '/' });
        }
    },
    staticData: {
        title: 'Payment',
    },
});
