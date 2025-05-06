import { createRootRouteWithContext } from '@tanstack/react-router';
import { AuthContextType } from '@/context';
import App from '../App';

interface AppRouterContext {
    auth: AuthContextType;
}

export const rootRoute = createRootRouteWithContext<AppRouterContext>()({
    component: App,
});
