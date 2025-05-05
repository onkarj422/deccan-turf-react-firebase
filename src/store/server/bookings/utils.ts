/* eslint-disable no-restricted-syntax */
import { createDateKey, createTimeslotKey } from '@/lib/dates/utils';
import dayjs from 'dayjs';
import { Booking } from '@/lib/firebase/firestore/bookings';
import { BookingsByDate, BookingsByDateTimeslot } from './types';

export const createBookingsHash = (bookings: Booking[]): {
    bookingsByDate: BookingsByDate;
    bookingsByDateTimeslot: BookingsByDateTimeslot;
} => {
    const bookingsByDate: BookingsByDate = {};
    const bookingsByDateTimeslot: BookingsByDateTimeslot = {};

    for (const booking of bookings) {
        const dateKey = createDateKey((booking.slot.date.toDate()));
        const timeslotKeys = booking.slot.times.map((time) => createTimeslotKey(dayjs(time.toDate())));

        if (!bookingsByDate[dateKey]) {
            bookingsByDate[dateKey] = [];
        }
        bookingsByDate[dateKey].push(booking);

        if (!bookingsByDateTimeslot[dateKey]) {
            bookingsByDateTimeslot[dateKey] = {};
        }
        timeslotKeys.forEach((timeslotKey) => {
            if (!bookingsByDateTimeslot[dateKey][timeslotKey]) {
                bookingsByDateTimeslot[dateKey][timeslotKey] = [];
            }
            bookingsByDateTimeslot[dateKey][timeslotKey].push(booking);
        });
    }

    return {
        bookingsByDate,
        bookingsByDateTimeslot,
    };
};
