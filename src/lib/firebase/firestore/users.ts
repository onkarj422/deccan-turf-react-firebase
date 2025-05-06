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
    addDoc,
} from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from '../db';

const ADMIN_EMAILS = ['onkarj422@gmail.com'];
export interface User {
  createdAt: Timestamp; // Timestamp when the user was created
  email: string; // Email address of the user
  name: string; // Name of the user
  phone: string; // Phone number of the user
  role: string; // Role of the user (e.g., admin, user)
  userId: string; // Unique identifier for the user
}

const usersCollection = collection(db, 'users');

// Create a new user
export const createUser = async (user: Omit<User, 'userId'>): Promise<User> => {
    const newUserRef = await addDoc(usersCollection, user);
    return { ...user, userId: newUserRef.id }; // Return the created user with the generated ID
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
    // Try to find user by UID
    let user = await getUserById(userId);
    if (user) return user;

    // If not found, try to find by email
    const q = query(usersCollection, where('email', '==', firebaseUser.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        // User exists with this email, update their userId if needed
        const userDoc = querySnapshot.docs[0];
        user = { ...userDoc.data(), userId: userDoc.id } as User;
        if (user.userId !== userId) {
            await updateUser(userDoc.id, { userId });
            user.userId = userId;
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
