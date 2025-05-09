import { DayOfWeek, PricingRule } from '@/lib/firebase/firestore/types/bookings.types';

export const DAYS: { label: string; value: DayOfWeek }[] = [
    { label: 'Mon', value: 'Monday' },
    { label: 'Tue', value: 'Tuesday' },
    { label: 'Wed', value: 'Wednesday' },
    { label: 'Thu', value: 'Thursday' },
    { label: 'Fri', value: 'Friday' },
    { label: 'Sat', value: 'Saturday' },
    { label: 'Sun', value: 'Sunday' },
];

export const DAY_LABEL: Record<DayOfWeek, string> = {
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
    Sunday: 'Sun',
    All: 'All Days',
};

export const DEFAULT_TIME_BLOCK = { startTime: '06:00', endTime: '23:00', price: 0 };

export const FALLBACK_RULE: PricingRule = {
    days: ['All'],
    timeBlocks: [{ startTime: '06:00', endTime: '23:59', price: 1000 }],
};

export const DAY_ORDER: DayOfWeek[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

export const DEFAULT_TIMINGS = {
    open: '06:00',
    close: '23:59',
};

export const DEFAULT_ADVANCE_PERCENTAGE = 100;
