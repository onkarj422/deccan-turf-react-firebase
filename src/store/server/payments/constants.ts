// Replace this with your local emulator endpoint
export const PAYMENT_API_URL = import.meta.env.MODE === 'production'
    ? '/api/create-payment' // You can set up a proxy or cloud function for prod
    : 'http://localhost:5001/deccan-turf/us-central1/api/create-payment';

export const PAYMENT_EXPIRY_TIME = 1200; // 20 minutes in seconds
