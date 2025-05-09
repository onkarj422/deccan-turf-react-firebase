import DateSelect from '@/components/DateTime/DateSelect';
import VerticalTimeSlotSelect from '@/components/DateTime/VerticalTimeSlotSelect';
import { useHeaderSlot } from '@/context/HeaderSlotContext';
import { createDateKey } from '@/lib/dates/utils';
import { useBookingsFromTodayHash } from '@/store/server/bookings/hooks';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { Turf } from '@/lib/firebase/firestore/turfs';
import { useUsersHash } from '@/store/server/users/hooks';
import {
    Box, Button, Drawer, Indicator, LoadingOverlay, Title, Transition,
} from '@mantine/core';
import { BOOKING_STATUS } from '@/store/server/bookings/constants';
import { IconCalendarClock } from '@tabler/icons-react';
import { Booking } from '@/lib/firebase/firestore/bookings';
import TurfSelect from '../turfs/components/TurfSelect';
import { AdminBooking } from './components/AdminBooking';
import BookingOverview from './components/BookingOverview';

export default function Bookings() {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<Dayjs[]>([]);
    const [selectedTurf, setSelectedTurf] = useState<Turf>();
    const [showBookingDrawer, setShowBookingDrawer] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking>();
    const [showSlotDrawer, setShowSlotDrawer] = useState(false);
    const { setHeaderSlot } = useHeaderSlot();
    const { bookingsByDateTimeslot, isLoading: isLoadingBookings } = useBookingsFromTodayHash({
        turfId: selectedTurf?.turfId,
        filterCancelled: true,
    });
    const { usersById, isLoading: isLoadingUsers } = useUsersHash();

    useEffect(() => {
        setHeaderSlot(
            <TurfSelect
                value={selectedTurf?.turfId || ''}
                onChange={setSelectedTurf}
            />,
        );
        return () => {
            setHeaderSlot(null);
        };
    }, [setHeaderSlot, selectedTurf, setSelectedTurf]);

    const handleOnBook = () => {
        setShowBookingDrawer(false);
        setSelectedTimeSlots([]);
    };

    const handleOnClickBookedSlot = (booking: Booking) => {
        setShowSlotDrawer(true);
        setSelectedBooking(booking);
    };

    const onCloseSlotDrawer = () => {
        setShowSlotDrawer(false);
        setSelectedBooking(undefined);
    };

    const renderBlockContent = (params) => {
        const { bookings } = params;
        const [booking] = bookings || [];
        const user = usersById[booking?.userId || ''];
        if (booking && user) {
            return (
                <Box
                    bg="blue.1"
                    h="100%"
                    className="flex flex-col gap-1 p-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOnClickBookedSlot(booking);
                    }}
                >
                    <Indicator
                        inline
                        offset={4}
                        withBorder
                        color={booking.status === BOOKING_STATUS.CONFIRMED ? 'blue.6' : 'red.5'}
                        zIndex={1}
                        size={12}
                    />
                    <Title
                        size="lg"
                        fw={500}
                        c="dark.4"
                    >
                        { user.name }
                    </Title>
                </Box>
            );
        }
        return '';
    };

    return (
        <div className="flex flex-col grow h-full w-full gap-4 position-relative">
            <LoadingOverlay
                visible={isLoadingBookings || isLoadingUsers}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
            />
            <DateSelect
                selectedDate={selectedDate}
                onChangeDate={setSelectedDate}
            />
            <VerticalTimeSlotSelect
                selectedDate={selectedDate}
                selectedTimeSlots={selectedTimeSlots}
                onChange={setSelectedTimeSlots}
                unavailableTimeslots={bookingsByDateTimeslot[createDateKey(dayjs(selectedDate).toDate())]}
                unavailableColor="blue.1"
                renderBlockContent={renderBlockContent}
            />
            <Transition
                mounted={Boolean(selectedTimeSlots.length)}
                transition="slide-left"
                duration={200}
            >
                {(styles) => (
                    <Button
                        tt="uppercase"
                        pos="absolute"
                        m="lg"
                        size="md"
                        bottom={0}
                        right={0}
                        style={styles}
                        bg="lime"
                        c="white"
                        leftSection={(
                            <IconCalendarClock
                                size={24}
                                color="white"
                            />
                        )}
                        onClick={() => {
                            setShowBookingDrawer(true);
                        }}
                    >
                        Book Slots
                    </Button>
                )}
            </Transition>
            <Drawer
                opened={showBookingDrawer}
                onClose={() => setShowBookingDrawer(false)}
                size="xl"
                position="bottom"
            >
                <AdminBooking
                    selectedTimeSlots={selectedTimeSlots}
                    turf={selectedTurf as Turf}
                    onBook={handleOnBook}
                />
            </Drawer>
            <Drawer
                opened={showSlotDrawer}
                onClose={onCloseSlotDrawer}
                size="xl"
                position="bottom"
            >
                {selectedBooking && (
                    <BookingOverview
                        booking={selectedBooking}
                        onCancel={onCloseSlotDrawer}
                    />
                )}
            </Drawer>
        </div>
    );
}
