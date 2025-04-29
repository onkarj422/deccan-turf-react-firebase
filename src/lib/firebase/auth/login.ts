import { auth } from '../auth'
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    signInWithCredential,
    User
} from 'firebase/auth'
import { useEffect, useState } from 'react'

const provider = new GoogleAuthProvider()
provider.addScope('https://www.googleapis.com/auth/user.birthday.read')

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
        return signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                return signInWithCredential(auth, credential).catch((error) => {
                    console.error(error);
                });
                // ...
            }).catch((error) => {
                // Handle Errors here.
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // The email of the user's account used.
                // const email = error.customData.email;
                // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
                console.error(error);
            });
    }

    const logout = () => signOut(auth)

    return { user, loading, loginWithGoogle, logout }
}
