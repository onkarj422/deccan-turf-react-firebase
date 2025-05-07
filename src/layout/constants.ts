import {
    IconBallFootball, IconCalendarClock, IconCurrencyRupee, IconHome2,
} from '@tabler/icons-react';

export const NAVIGATION_ITEMS = [{
    title: 'Home',
    to: '/app/dashboard',
    leftIcon: IconHome2,
}, {
    title: 'Bookings',
    to: '/app/bookings',
    leftIcon: IconCalendarClock,
}, {
    title: 'Payments',
    to: '/app/payment',
    leftIcon: IconCurrencyRupee,
}, {
    title: 'Turfs',
    to: '/app/turfs',
    leftIcon: IconBallFootball,
}];
