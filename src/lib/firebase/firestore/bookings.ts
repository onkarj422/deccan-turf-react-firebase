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

export interface Booking {
  advancePaid: number; // Amount paid in advance
  bookingId: string; // Unique identifier for the booking
  cancellationReason: string; // Reason for cancellation, if any
  createdAt: Timestamp; // Timestamp when the booking was created
  date: Timestamp; // Date of the booking
  paymentId: string; // ID of the payment associated with the booking
  slots: {
    endTime: Timestamp; // End time of the slot
    startTime: Timestamp; // Start time of the slot
    status: string; // Status of the slot (e.g., confirmed, cancelled)
  }[]; // Array of slots associated with the booking
  totalAmount: number; // Total amount for the booking
  turfId: string; // ID of the turf associated with the booking
  userId: string; // ID of the user who made the booking
}

const bookingsCollection = collection(db, 'bookings');

// Create a new booking
export const createBooking = async (booking: Omit<Booking, 'bookingId'>): Promise<Booking> => {
  const newBookingRef = await addDoc(bookingsCollection, booking);
  return { ...booking, bookingId: newBookingRef.id }; // Return the created booking with the generated ID
};

// Read a booking by ID
export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  const bookingDoc = doc(bookingsCollection, bookingId);
  const bookingSnapshot = await getDoc(bookingDoc);
  return bookingSnapshot.exists() ? (bookingSnapshot.data() as Booking) : null;
};

// Update a booking by ID
export const updateBooking = async (bookingId: string, updatedData: Partial<Booking>): Promise<void> => {
  const bookingDoc = doc(bookingsCollection, bookingId);
  await updateDoc(bookingDoc, updatedData);
};

// Delete a booking by ID
export const deleteBooking = async (bookingId: string): Promise<void> => {
  const bookingDoc = doc(bookingsCollection, bookingId);
  await deleteDoc(bookingDoc);
};

// Get all bookings
export const getAllBookings = async (): Promise<Booking[]> => {
  const q = query(bookingsCollection);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), bookingId: doc.id } as Booking));
};