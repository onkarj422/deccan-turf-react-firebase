import { useAuth } from '@/context';
import { Booking } from '@/lib/firebase/firestore/bookings';
import { Turf } from '@/lib/firebase/firestore/turfs';
import { SlotSummaryCard } from '@/pages/payment/components';
import UserSummaryCard from '@/pages/users/components/UserSummaryCard';
import { useUpdateBooking } from '@/store/server/bookings';
import { BOOKING_STATUS } from '@/store/server/bookings/constants';
import { useFetchTurfs } from '@/store/server/turfs';
import { useUsersHash } from '@/store/server/users/hooks';
import { Box, Button, Group, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconCancel, IconCircleCheck, IconExclamationCircle,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

interface BookingOverviewProps {
    booking: Booking;
    onCancel?: (booking: Booking) => void;
}

export default function BookingOverview({ booking, onCancel }: BookingOverviewProps) {
    const { user } = useAuth();
    const { data: turfs, isLoading: isLoadingTurfs } = useFetchTurfs();
    const { usersById, isLoading: isLoadingUsers } = useUsersHash();
    const updateBooking = useUpdateBooking();

    const turf = turfs?.find((_turf) => _turf.turfId === booking.turfId);

    const onClickCancel = () => {
        updateBooking.mutate({
            bookingId: booking.bookingId,
            updatedData: {
                status: BOOKING_STATUS.CANCELLED,
                cancellationReason: `Cancelled by ${user?.name}`,
            },
        }, {
            onSuccess: () => {
                notifications.show({
                    title: 'Booking cancelled',
                    message: 'The booking has been cancelled successfully.',
                    icon: <IconCircleCheck size={16} />,
                    color: 'green',
                });
                if (onCancel) {
                    onCancel(booking);
                }
            },
            onError: () => {
                notifications.show({
                    title: 'Error cancelling booking',
                    message: 'There was an error cancelling the booking. Please try again later.',
                    icon: <IconExclamationCircle size={16} />,
                    color: 'red',
                });
            },
        });
    };

    return (
        <Box
            className="flex flex-col"
            h="calc(var(--drawer-height) - 5rem)"
        >
            <LoadingOverlay
                visible={updateBooking.isPending || isLoadingUsers || isLoadingTurfs}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
            />
            <SlotSummaryCard
                bookingDetails={{
                    slot: {
                        date: dayjs(booking.slot.date.toDate()),
                        times: booking.slot.times.map((time) => dayjs(time.toDate())),
                    },
                    totalAmount: booking.totalAmount,
                }}
                turf={turf as Turf}
                cardBg="var(--mantine-color-foreground)"
            />
            <UserSummaryCard user={usersById[booking.userId]} />
            <div className="grow" />
            <Group
                align="center"
                justify="end"
            >
                <Button
                    variant="light"
                    color="red"
                    c="red"
                    tt="uppercase"
                    size="md"
                    onClick={onClickCancel}
                    leftSection={<IconCancel />}
                >
                    Cancel
                </Button>
            </Group>
        </Box>
    );
}

BookingOverview.defaultProps = {
    onCancel: () => {},
};
