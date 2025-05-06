import { useAuth } from '@context/index';
import { Navigate } from '@tanstack/react-router';
import { PageLoader } from '@/components/Loader';
import AppShell from './AppShell';

export function ProtectedLayout() {
    const { loading, user } = useAuth();

    if (loading) return <PageLoader />;

    if (!user) {
        // Pass the current location as state to /login
        return <Navigate to="/login" />;
    }

    return <AppShell />;
}
