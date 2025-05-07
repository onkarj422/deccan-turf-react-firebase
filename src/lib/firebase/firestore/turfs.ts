import {
    collection,
    doc,
    getDoc,
    deleteDoc,
    updateDoc,
    query,
    getDocs,
    Timestamp,
    GeoPoint,
    setDoc,
} from 'firebase/firestore';
import { db } from '../db';

export interface Turf {
    advanceAmount: number; // The advance amount required for booking.
    amenities: string[]; // List of amenities available at the turf.
    createdAt: Timestamp; // Timestamp when the turf was created.
    createdBy: string; // ID of the user who created the turf.
    description: string; // Description of the turf.
    images: string[]; // List of image URLs for the turf.
    location: {
        addressLine: string; // Address line of the turf.
        area: string; // Area where the turf is located.
        city: string; // City where the turf is located.
        coordinates: GeoPoint; // Geographical coordinates of the turf.
        country: string; // Country where the turf is located.
        pincode: string; // Pincode of the turf's location.
        state: string; // State where the turf is located.
    };
    name: string; // Name of the turf.
    pricePerHour: number; // Price per hour for booking the turf.
    timings: {
        open: string; // Opening time of the turf.
        close: string; // Closing time of the turf.
    };
    turfId: string; // Unique identifier for the turf.
}

const turfsCollection = collection(db, 'turfs');

// Create a new turf
export const createTurf = async (turf: Omit<Turf, 'turfId'>): Promise<Turf> => {
    const newTurfRef = doc(turfsCollection);
    const turfWithId = { ...turf, turfId: newTurfRef.id };
    await setDoc(newTurfRef, turfWithId);
    return turfWithId;
};

// Read a turf by ID
export const getTurfById = async (turfId: string): Promise<Turf | null> => {
    const turfDoc = doc(turfsCollection, turfId);
    const turfSnapshot = await getDoc(turfDoc);
    return turfSnapshot.exists() ? (turfSnapshot.data() as Turf) : null;
};

// Update a turf by ID
export const updateTurf = async (turfId: string, updatedData: Partial<Turf>): Promise<void> => {
    const turfDoc = doc(turfsCollection, turfId);
    await updateDoc(turfDoc, updatedData);
};

// Delete a turf by ID
export const deleteTurf = async (turfId: string): Promise<void> => {
    const turfDoc = doc(turfsCollection, turfId);
    await deleteDoc(turfDoc);
};

// Get all turfs
export const getAllTurfs = async (): Promise<Turf[]> => {
    const q = query(turfsCollection);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docItem) => docItem.data() as Turf);
};
