import { useFetchBookings } from '@/store/server/bookings';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import { useMemo } from 'react';
import { FirestoreFilter } from '@/lib/firebase/firestore/query-builder';
import { createBookingsHash } from './utils';
import { BOOKING_STATUS } from './constants';

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

export const useBookingsFromTodayHash = ({
    turfId = '',
    filterCancelled = true,
} = {}) => {
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
        if (filterCancelled) {
            filtersArr.push({
                field: 'status',
                op: '!=',
                value: BOOKING_STATUS.CANCELLED,
            });
        }
        if (turfId) {
            filtersArr.push({
                field: 'turfId',
                op: '==',
                value: turfId,
            });
        }
        return filtersArr;
    }, [todayTimestamp, filterCancelled, turfId]);

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
