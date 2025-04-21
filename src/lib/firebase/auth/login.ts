import { auth } from '../auth'
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth'
import { useEffect, useState } from 'react'

const provider = new GoogleAuthProvider()

export function useLogin() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider)
        const user = result.user;
        console.log(user);
    }

    const logout = () => signOut(auth)

    return { user, loading, loginWithGoogle, logout }
}
