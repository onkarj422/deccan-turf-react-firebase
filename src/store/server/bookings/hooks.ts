import { useFetchBookings } from '@/store/server/bookings';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import { useMemo } from 'react';
import { FirestoreFilter } from '@/lib/firebase/firestore/query-builder';
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

export const useBookingsFromTodayHash = (turfId = '') => {
    const todayTimestamp = useMemo(() => {
        const today = dayjs().startOf('day').toDate();
        return Timestamp.fromDate(today);
    }, []);

    const filters = useMemo(() => {
        const filtersArr: FirestoreFilter[] = [
            {
                field: 'slot.date',
                op: '>=',
                value: todayTimestamp,
            },
        ];
        if (turfId) {
            filtersArr.push({
                field: 'turfId',
                op: '==',
                value: turfId,
            });
        }
        return filtersArr;
    }, [turfId, todayTimestamp]);

    const bookingsQueryResult = useFetchBookings({
        filters,
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
