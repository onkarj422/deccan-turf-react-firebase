/* eslint-disable no-restricted-syntax */
import { createDateKey, createTimeslotKey } from '@/lib/dates/utils';
import dayjs from 'dayjs';
import { Booking } from '@/lib/firebase/firestore/bookings';
import { BookingDetails } from '@/pages/booking/types';
import { Turf } from '@/lib/firebase/firestore/turfs';
import { AuthContextType } from '@/context';
import { Timestamp } from 'firebase/firestore';
import { BookingsByDate, BookingsByDateTimeslot } from './types';
import { BOOKING_STATUS } from './constants';

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

export const createBookingPayload = (bookingDetails: BookingDetails, turf: Turf, auth: AuthContextType, isAdvancePayment: boolean): Booking => {
    const slots = bookingDetails.slot.times;
    const minAdvance = bookingDetails.totalAmount * (turf.advancePercentage / 100);
    const bookingPayload = {
        bookingId: '', // Will be set by firestore
        advancePaid: isAdvancePayment ? minAdvance : bookingDetails.totalAmount,
        cancellationReason: '',
        createdAt: Timestamp.now(),
        paymentId: '', // Will be set after payment
        slot: {
            date: Timestamp.fromDate(bookingDetails.slot.date.toDate()),
            times: slots.map((d) => Timestamp.fromDate(d.toDate())),
        },
        totalAmount: bookingDetails.totalAmount,
        turfId: turf.turfId,
        userId: auth.user.userId,
        status: BOOKING_STATUS.PENDING,
    };

    return bookingPayload;
};
