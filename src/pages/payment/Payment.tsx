/* eslint-disable max-len */
import {
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    Button,
    Divider,
    LoadingOverlay,
    Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Navigate, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context';
import { getTotalSlotHours } from '@/lib/dates/utils';
import { useBookingStore } from '@/store/local/bookingStore';
import { createBookingPayload } from '@/store/server/bookings/utils';
import { useCreateBooking, useUpdateBooking } from '@/store/server/bookings';
import { fetchPayment } from '@/store/server/payments/endpoints';
import { createPaymentPayload } from '@/store/server/payments/utils';
import { BOOKING_STATUS } from '@/store/server/bookings/constants';
import { IconCancel } from '@tabler/icons-react';
import { AdvancePaymentCard, BookingSummaryCard, SlotSummaryCard } from './components';
import { getCurrentPricePerHour } from '../create-turf/utils';
import { DEFAULT_ADVANCE_PERCENTAGE } from '../create-turf/constants';

export default function Payment() {
    const [isAdvancedPayment, setIsAdvancedPayment] = useState(false);
    const navigate = useNavigate();
    const { bookingDetails, turf, resetBooking } = useBookingStore();
    const createBooking = useCreateBooking();
    const updateBooking = useUpdateBooking();
    const auth = useAuth();

    const slots = bookingDetails?.slot.times || [];

    const totalHours = getTotalSlotHours(slots);
    const currentPricePerHour = getCurrentPricePerHour(turf?.pricingRules || []);
    const minAdvance = (currentPricePerHour * (turf ? turf.advancePercentage : DEFAULT_ADVANCE_PERCENTAGE)) / 100;

    const finalAmount = useMemo(() => {
        if (isAdvancedPayment) {
            return minAdvance;
        }
        return bookingDetails?.totalAmount || 0;
    }, [isAdvancedPayment, minAdvance, bookingDetails?.totalAmount]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://mercury.phonepe.com/web/bundle/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const [loading, setLoading] = useState(false);

    if (!bookingDetails || !turf) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    const handleProceedToPayment = async () => {
        // if (auth.user.role !== 'user') {
        //     notifications.show({
        //         title: 'Unauthorized',
        //         message: 'You need an account with USER role to proceed.',
        //         color: 'red',
        //     });
        //     return;
        // }
        setLoading(true);
        try {
            // 1. Create booking in Firestore if not already created
            const bookingPayload = createBookingPayload(
                bookingDetails,
                turf,
                auth,
                isAdvancedPayment,
            );
            const booking = await createBooking.mutateAsync(bookingPayload);

            if (!booking.bookingId) {
                throw new Error(JSON.stringify({
                    message: booking,
                    type: 'BOOKING_CREATION_ERROR',
                }));
            }

            // 2. Prepare payment params for PhonePe API
            const redirectUrl = `${window.location.origin}/app/payment/confirmation`;
            const paymentPayload = createPaymentPayload(booking, finalAmount, redirectUrl);
            const paymentResponse = await fetchPayment(paymentPayload);
            if (!paymentResponse.ok) {
                const errJson = await paymentResponse.json();
                throw new Error(JSON.stringify({
                    message: errJson?.error || 'Payment initiation failed',
                    type: 'PAYMENT_API_ERROR',
                    code: paymentResponse.status,
                }));
            }
            const paymentData = await paymentResponse.json();
            // Use the tokenUrl from the backend response
            const tokenUrl = paymentData.redirectUrl;
            if (!tokenUrl) {
                throw new Error(JSON.stringify({
                    message: 'Invalid response from payment API',
                    type: 'INVALID_RESPONSE',
                    code: paymentResponse.status,
                }));
            }
            (window as any).PhonePeCheckout.transact({
                tokenUrl,
                callback: async function callback(response: string) {
                    if (response === 'USER_CANCEL') {
                        // Handle user cancellation here
                        notifications.show({
                            title: 'Payment Cancelled',
                            message: 'You have cancelled the payment.',
                            icon: <IconCancel size={16} />,
                            color: 'red',
                        });
                        await updateBooking.mutateAsync({
                            bookingId: booking.bookingId,
                            updatedData: {
                                status: BOOKING_STATUS.CANCELLED,
                                paymentId: paymentData.orderId,
                                advancePaid: 0,
                            },
                        });
                        await navigate({
                            to: `/app/booking/${turf.turfId}`,
                            replace: true,
                        });
                        resetBooking();
                    } else if (response === 'CONCLUDED') {
                        await updateBooking.mutateAsync({
                            bookingId: booking.bookingId,
                            updatedData: {
                                status: BOOKING_STATUS.CONFIRMED,
                                paymentId: paymentData.orderId,
                            },
                        });
                        setLoading(false);
                        navigate({
                            to: '/app/confirmation',
                            replace: true,
                        });
                    }
                },
                type: 'IFRAME',
            });
        } catch (e) {
            notifications.show({
                title: e.type || 'Error',
                message: e.message || 'Unexpected error',
                color: 'red',
            });
            setLoading(false);
        }
    };

    if (!bookingDetails || !turf) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return (
        <div className="flex flex-col grow h-full w-full gap-4">
            <LoadingOverlay
                visible={updateBooking.isPending || createBooking.isPending}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
            />
            <SlotSummaryCard
                bookingDetails={bookingDetails}
                turf={turf}
            />
            <BookingSummaryCard
                venueName={turf.name}
                totalHours={totalHours}
                pricePerHour={currentPricePerHour}
                minAdvance={minAdvance}
            />
            <AdvancePaymentCard
                isAdvancedPayment={isAdvancedPayment}
                onChange={setIsAdvancedPayment}
            />
            <div className="flex-grow-1" />
            <Text
                size="lg"
                fw={400}
                className="text-center"
            >
                Pay ₹
                {' '}
                {finalAmount}
            </Text>
            <Divider />
            <Button
                className="w-full"
                tt="uppercase"
                size="lg"
                variant="filled"
                color="lime"
                c="white"
                radius="md"
                onClick={handleProceedToPayment}
                loading={loading}
                disabled={loading}
            >
                Proceed to Payment
            </Button>
        </div>
    );
}
