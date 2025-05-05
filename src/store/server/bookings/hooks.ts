import { useFetchBookings } from '@/store/server/bookings';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import { useMemo } from 'react';
import { createBookingsHash } from './utils';

export const useBookingsFromToday = () => {
    const todayTimestamp = useMemo(() => {
        const today = dayjs().startOf('day').toDate();
        return Timestamp.fromDate(today);
    }, []);

    return useFetchBookings({
        filters: [
            {
                field: 'slot.date',
                op: '>=',
                value: todayTimestamp,
            },
        ],
    });
};

export const useBookingsFromTodayHash = () => {
    const todayTimestamp = useMemo(() => {
        const today = dayjs().startOf('day').toDate();
        return Timestamp.fromDate(today);
    }, []);

    const bookingsQueryResult = useFetchBookings({
        filters: [
            {
                field: 'slot.date',
                op: '>=',
                value: todayTimestamp,
            },
        ],
    });

    const bookingsByDateTimeHash = useMemo(() => {
        const bookings = bookingsQueryResult.data || [];
        return createBookingsHash(bookings);
    }, [bookingsQueryResult.data]);

    return {
        ...bookingsQueryResult,
        ...bookingsByDateTimeHash,
    };
};
