import { useAuth } from '@context/index';
import { Navigate } from '@tanstack/react-router';
import { PageLoader } from '@/components/Loader';
import AppShell from './AppShell';

export function ProtectedLayout() {
    const { loading, user, loginPending } = useAuth();

    if (loading || loginPending) return <PageLoader />;

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <AppShell />;
}
