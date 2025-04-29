import { Timestamp } from 'firebase/firestore';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  getDocs,
  addDoc
} from 'firebase/firestore';

export interface Slot {
  booked: {
    bookingId: string; // ID of the booking
    endTime: Timestamp; // End time of the booking
    startTime: Timestamp; // Start time of the booking
    userId: string; // ID of the user who booked the slot
  }[]; // Array of booked slots
  createdAt: Timestamp; // Timestamp when the slot was created
  date: Timestamp; // Date of the slot
  slotId: string; // Unique identifier for the slot
  turfId: string; // ID of the turf associated with the slot
}

const db = getFirestore();
const slotsCollection = collection(db, 'slots');

// Create a new slot
export const createSlot = async (slot: Omit<Slot, 'slotId'>): Promise<Slot> => {
  const newSlotRef = await addDoc(slotsCollection, slot);
  return { ...slot, slotId: newSlotRef.id }; // Return the created slot with the generated ID
};

// Read a slot by ID
export const getSlotById = async (slotId: string): Promise<Slot | null> => {
  const slotDoc = doc(slotsCollection, slotId);
  const slotSnapshot = await getDoc(slotDoc);
  return slotSnapshot.exists() ? (slotSnapshot.data() as Slot) : null;
};

// Update a slot by ID
export const updateSlot = async (slotId: string, updatedData: Partial<Slot>): Promise<void> => {
  const slotDoc = doc(slotsCollection, slotId);
  await updateDoc(slotDoc, updatedData);
};

// Delete a slot by ID
export const deleteSlot = async (slotId: string): Promise<void> => {
  const slotDoc = doc(slotsCollection, slotId);
  await deleteDoc(slotDoc);
};

// Get all slots
export const getAllSlots = async (): Promise<Slot[]> => {
  const q = query(slotsCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), slotId: doc.id } as Slot));
};