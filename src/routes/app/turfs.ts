import { Turfs } from '@/pages/turfs';
import { createRoute } from '@tanstack/react-router';
import { appRoute } from './app';

export const turfsRoute = createRoute({
    path: '/turfs',
    component: Turfs,
    getParentRoute: () => appRoute,
});
