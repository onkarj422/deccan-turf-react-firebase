import { useAuth } from "@context/index";
import Splash from "@/Splash";
import { Navigate } from "@tanstack/react-router";
import AppShell from "./AppShell";

export function ProtectedLayout() {
    const { loading, user } = useAuth();

    if (loading) return <Splash />;

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <AppShell />;
}
