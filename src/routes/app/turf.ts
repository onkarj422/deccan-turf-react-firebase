import Turf from '@/pages/turfs/pages/Turf';
import { createRoute } from '@tanstack/react-router';
import { appRoute } from './app';

export const turfRoute = createRoute({
    path: '/turf/$turfId',
    component: Turf,
    getParentRoute: () => appRoute,
    staticData: {
        title: 'Turf',
    },
});
