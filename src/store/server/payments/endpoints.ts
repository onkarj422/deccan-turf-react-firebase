import { PAYMENT_API_URL } from './constants';
import { PhonePePayload } from './types';

export const fetchPayment = (paymentBody: PhonePePayload) => fetch(PAYMENT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentBody),
});
