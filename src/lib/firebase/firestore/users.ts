import { Timestamp } from 'firebase/firestore';
import {
  collection,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  getDocs,
  addDoc
} from 'firebase/firestore';
import { db } from '../db';

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
  return querySnapshot.docs.map(doc => ({ ...doc.data(), userId: doc.id } as User));
};