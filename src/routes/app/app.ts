import { ProtectedLayout } from '@/layout';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import { dashboardRoute } from './dashboard';
import { bookRoute } from './book';
import { paymentRoute } from './payment';
import { confirmationRoute } from './confirmation';

export const appRoute = createRoute({
    path: '/app',
    component: ProtectedLayout,
    getParentRoute: () => rootRoute,
});

appRoute.addChildren([dashboardRoute, bookRoute, paymentRoute, confirmationRoute]);
