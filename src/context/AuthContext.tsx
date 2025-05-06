import {
    createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@lib/firebase';
import { PageLoader } from '@/components/Loader';

export interface AuthContextType {
    user: User;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: {} as User,
    loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>({} as User);
    const [loading, setLoading] = useState(true);
    const contextValue = useMemo(() => ({ user, loading }), [user, loading]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser as User);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
