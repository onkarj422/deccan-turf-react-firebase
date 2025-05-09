import { CreateTurf } from '@/pages/create-turf';
import { createRoute, redirect } from '@tanstack/react-router';
import { appRoute } from './app';

export const editTurfRoute = createRoute({
    path: '/edit-turf/$turfId',
    component: CreateTurf,
    getParentRoute: () => appRoute,
    beforeLoad: ({ context }) => {
        const { user } = context.auth;
        if (!user || user.role !== 'admin') {
            throw redirect({ to: '/' });
        }
    },
    staticData: {
        title: 'Edit Turf',
    },
});
