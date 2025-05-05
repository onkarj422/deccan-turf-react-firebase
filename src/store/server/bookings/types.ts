import { createDateKey, createTimeslotKey } from '@/lib/dates/utils';
import { Booking } from '@/lib/firebase/firestore/bookings';

export type DateKey = ReturnType<typeof createDateKey>;
export type TimeslotKey = ReturnType<typeof createTimeslotKey>;

export type BookingByTimeslot = Record<TimeslotKey, Booking[]>;
export type BookingsByDateTimeslot = Record<DateKey, BookingByTimeslot>;
export type BookingsByDate = Record<DateKey, Booking[]>;
