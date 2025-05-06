import { Booking } from '@/lib/firebase/firestore/bookings';
import { PAYMENT_EXPIRY_TIME } from './constants';
import { PhonePePayload } from './types';

export const createPaymentPayload = (booking: Booking, amount: number, redirectUrl: string): PhonePePayload => ({
    merchantOrderId: booking.bookingId,
    amount: Math.round(amount * 100), // Convert to paise
    expireAfter: PAYMENT_EXPIRY_TIME, // 1 hour in seconds
    udf1: booking.turfId,
    udf2: booking.userId,
    udf3: booking.totalAmount - booking.advancePaid,
    redirectUrl,
    env: import.meta.env.MODE === 'production' ? 'PROD' : 'UAT',
});
