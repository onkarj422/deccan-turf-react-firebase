import {
    Timestamp,
    collection,
    doc,
    getDoc,
    deleteDoc,
    updateDoc,
    query,
    where,
    getDocs,
    setDoc,
    addDoc,
    onSnapshot,
} from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from '../db';

const ADMIN_EMAILS = ['onkarj422@gmail.com', 'joshisharvil11@gmail.com', 'joshipravin969@gmail.com'];
export interface User {
  createdAt: Timestamp; // Timestamp when the user was created
  email: string; // Email address of the user
  name: string; // Name of the user
  phone: string; // Phone number of the user
  role: string; // Role of the user (e.g., admin, user)
  userId: string; // Unique identifier for the user
}

const usersCollection = collection(db, 'users');

// Create a new user, using userId as document ID if present, otherwise auto-generate
export const createUser = async (user: Omit<User, 'userId'> & { userId?: string }): Promise<User> => {
    if (user.userId) {
        const userRef = doc(usersCollection, user.userId);
        await setDoc(userRef, { ...user, userId: user.userId }, { merge: true });
        return { ...user, userId: user.userId } as User;
    }
    // No userId provided, let Firestore generate one
    const addDocRef = await addDoc(usersCollection, { ...user });
    await setDoc(addDocRef, { ...user, userId: addDocRef.id }, { merge: true });
    return { ...user, userId: addDocRef.id } as User;
};

// Read a user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
    const userDoc = doc(usersCollection, userId);
    const userSnapshot = await getDoc(userDoc);
    return userSnapshot.exists() ? (userSnapshot.data() as User) : null;
};

// Update a user by ID
export const updateUser = async (userId: string, updatedData: Partial<User>): Promise<void> => {
    const userDoc = doc(usersCollection, userId);
    await updateDoc(userDoc, updatedData);
};

// Delete a user by ID
export const deleteUser = async (userId: string): Promise<void> => {
    const userDoc = doc(usersCollection, userId);
    await deleteDoc(userDoc);
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
    const q = query(usersCollection);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docItem) => ({ ...docItem.data(), userId: docItem.id } as User));
};

export const getOrCreateUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userId = firebaseUser.uid;
    // Try to find user by UID (document ID)
    let user = await getUserById(userId);
    if (user) return user;

    // If not found, try to find by email
    const q = query(usersCollection, where('email', '==', firebaseUser.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        // User exists with this email, migrate to UID as document ID if needed
        const userDoc = querySnapshot.docs[0];
        user = { ...userDoc.data(), userId } as User;
        if (userDoc.id !== userId) {
            // Create new doc with UID as ID
            await createUser(user);
            // Delete old doc
            await deleteUser(userDoc.id);
        }
        return user;
    }

    // If not found by email, create new user
    const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email || '');
    const role = isAdmin ? 'admin' : 'user';
    const newUser: User = {
        userId,
        createdAt: Timestamp.now(),
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        phone: '',
        role,
    };
    return createUser(newUser);
};

export function listenToUserDoc(userId: string, onChange: (user: User) => void): () => void {
    const userDocRef = doc(db, 'users', userId);
    return onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
            onChange({ ...(docSnap.data() as User) });
        }
    });
}
