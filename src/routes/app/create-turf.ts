import { CreateTurf } from '@/pages/create-turf';
import { createRoute } from '@tanstack/react-router';
import { appRoute } from './app';

export const createTurfRoute = createRoute({
    path: '/create-turf',
    component: CreateTurf,
    getParentRoute: () => appRoute,
    staticData: {
        title: 'New Turf',
    },
});
