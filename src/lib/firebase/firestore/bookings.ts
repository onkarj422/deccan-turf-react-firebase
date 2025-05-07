/* eslint-disable no-console */
import {
    Timestamp,
    collection,
    doc,
    getDoc,
    deleteDoc,
    updateDoc,
    getDocs,
    setDoc,
} from 'firebase/firestore';

import { db } from '../db';
import { buildFirestoreQuery, FirestoreQueryOptions } from './query-builder';

export interface Booking {
  advancePaid: number; // Amount paid in advance
  bookingId: string; // Unique identifier for the booking
  cancellationReason: string; // Reason for cancellation, if any
  createdAt: Timestamp; // Timestamp when the booking was created
  paymentId: string; // ID of the payment associated with the booking
  slot: {
    times: Timestamp[]; // hours of the slot
    date: Timestamp; // Date of the slot
  }; // Array of slots associated with the booking
  totalAmount: number; // Total amount for the booking
  turfId: string; // ID of the turf associated with the booking
  userId: string; // ID of the user who made the booking
  status: string; // Status of the slot (e.g., confirmed, cancelled)
}

const bookingsCollection = collection(db, 'bookings');

// Create a new booking
export const createBooking = async (booking: Omit<Booking, 'bookingId'>): Promise<Booking> => {
    try {
        const newBookingRef = doc(bookingsCollection);
        const bookingWithId = { ...booking, bookingId: newBookingRef.id };
        await setDoc(newBookingRef, bookingWithId);
        return bookingWithId;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

// Read a booking by ID
export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
    try {
        const bookingDoc = doc(bookingsCollection, bookingId);
        const bookingSnapshot = await getDoc(bookingDoc);
        return bookingSnapshot.exists() ? (bookingSnapshot.data() as Booking) : null;
    } catch (error) {
        console.error('Error getting booking by ID:', error);
        throw error;
    }
};

// Update a booking by ID
export const updateBooking = async (bookingId: string, updatedData: Partial<Booking>): Promise<void> => {
    try {
        const bookingDoc = doc(bookingsCollection, bookingId);
        await updateDoc(bookingDoc, updatedData);
    } catch (error) {
        console.error('Error updating booking:', error);
        throw error;
    }
};

// Delete a booking by ID
export const deleteBooking = async (bookingId: string): Promise<void> => {
    try {
        const bookingDoc = doc(bookingsCollection, bookingId);
        await deleteDoc(bookingDoc);
    } catch (error) {
        console.error('Error deleting booking:', error);
        throw error;
    }
};

// Get all bookings, with flexible filtering using FirestoreQueryOptions
export const getAllBookings = async (options: FirestoreQueryOptions = {}): Promise<Booking[]> => {
    try {
        const q = buildFirestoreQuery(bookingsCollection, options);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((docItem) => ({ ...docItem.data(), bookingId: docItem.id } as Booking));
    } catch (error) {
        console.error('Error getting all bookings:', error);
        throw error;
    }
};
