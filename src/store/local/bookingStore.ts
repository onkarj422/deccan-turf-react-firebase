import { Turf } from '@/lib/firebase/firestore/turfs';
import { BookingDetails } from '@/pages/booking/types';
import { create } from 'zustand';

interface BookingStore {
  bookingDetails: BookingDetails | null;
  turf: Turf | null;
  setBookingDetails: (details: BookingDetails) => void;
  setTurf: (turf: Turf) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
    bookingDetails: null,
    turf: null,
    setBookingDetails: (details) => set({ bookingDetails: details }),
    setTurf: (turf) => set({ turf }),
    resetBooking: () => set({ bookingDetails: null, turf: null }),
}));
