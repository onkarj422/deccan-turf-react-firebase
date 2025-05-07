import {
    createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import {
    onAuthStateChanged, User as FirebaseUser, GoogleAuthProvider, signInWithPopup, signOut,
} from 'firebase/auth';
import { auth } from '@lib/firebase';
import { PageLoader } from '@/components/Loader';
import { getOrCreateUser, listenToUserDoc, User } from '@/lib/firebase/firestore/users';
import { notifications } from '@mantine/notifications';

export interface AuthContextType {
    user: User;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    loginPending: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: {} as User,
    loading: true,
    loginWithGoogle: async () => {},
    logout: async () => {},
    loginPending: false,
});

const showLoginError = (error: Error) => {
    notifications.show({
        title: error.name || 'Error',
        message: error.message || 'Unexpected error while logging in',
        color: 'red',
    });
};

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/user.birthday.read');

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>({} as User);
    const [loading, setLoading] = useState(true);
    const [loginPending, setLoginPending] = useState(false);

    const loginWithGoogle = async () => {
        setLoginPending(true);
        try {
            await signInWithPopup(auth, provider);
            // Wait for onAuthStateChanged to fire and user to be set
            await new Promise<void>((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser) => {
                    if (firebaseUser) {
                        unsubscribe();
                        resolve();
                    }
                });
            });
        } catch (error) {
            showLoginError(error);
        } finally {
            setLoginPending(false);
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null as unknown as User);
    };

    const contextValue = useMemo(() => ({
        user, loading, loginWithGoogle, logout, loginPending,
    }), [user, loading, loginPending]);

    useEffect(() => {
        let unsubscribeUserDoc: (() => void) | null = null;
        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (!firebaseUser) {
                if (unsubscribeUserDoc) unsubscribeUserDoc();
                setUser(null as unknown as User);
                setLoading(false);
                return;
            }
            getOrCreateUser(firebaseUser).then((userData) => {
                setUser(userData);
                setLoading(false);
                // Listen to real-time updates on user doc using utility
                if (unsubscribeUserDoc) unsubscribeUserDoc();
                unsubscribeUserDoc = listenToUserDoc(userData.userId, (updatedUser) => setUser(updatedUser));
            });
        });
        return () => {
            unsubscribeAuth();
            if (unsubscribeUserDoc) unsubscribeUserDoc();
        };
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
