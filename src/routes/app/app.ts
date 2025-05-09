import { ProtectedLayout } from '@/layout';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../__root';
import { dashboardRoute } from './dashboard';
import { bookRoute } from './book';
import { paymentRoute } from './payment';
import { confirmationRoute } from './confirmation';
import { bookingsRoute } from './bookings';
import { appIndexRoute } from './index';
import { turfsRoute } from './turfs';
import { createTurfRoute } from './create-turf';
import { turfRoute } from './turf';
import { editTurfRoute } from './edit-turf';

export const appRoute = createRoute({
    path: '/app',
    component: ProtectedLayout,
    getParentRoute: () => rootRoute,
});

appRoute.addChildren([
    dashboardRoute,
    bookRoute,
    paymentRoute,
    confirmationRoute,
    bookingsRoute,
    appIndexRoute,
    turfsRoute,
    createTurfRoute,
    editTurfRoute,
    turfRoute,
]);
