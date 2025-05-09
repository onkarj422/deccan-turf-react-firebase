import { useNavigate, useParams } from '@tanstack/react-router';
import {
    Card, Title, Divider, Text, Button,
    Drawer,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useFetchTurfs } from '@/store/server/turfs';
import { PageLoader } from '@/components/Loader';
import DateSelect from '@/components/DateTime/DateSelect';
import TimeSlotSelect from '@/components/DateTime/TimeSlotSelect';
import { useBookingsFromTodayHash } from '@/store/server/bookings/hooks';
import { createDateKey, getTotalSlotHours } from '@/lib/dates/utils';
import TimeSlotSummary from '@/components/DateTime/TimeSlotSummary';
import { useBookingStore } from '@/store/local/bookingStore';
import { useAuth } from '@/context';
import UpdatePhone from '../users/components/UpdatePhone';
import { getCurrentPricePerHour } from '../create-turf/utils';

export default function Booking() {
    const { turfId } = useParams({ strict: false });
    const {
        data: turfs, isLoading, isError, error,
    } = useFetchTurfs();
    const [selectedDate, setSelectedDate] = useState<string | Dayjs>(dayjs());
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<Dayjs[]>([]);
    const [showContactDrawer, setShowContactDrawer] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const bookingStore = useBookingStore();

    // Fetch bookings starting from today
    const { bookingsByDateTimeslot, isLoading: isBookingsLoading } = useBookingsFromTodayHash();

    const turf = turfs?.find((t) => t.turfId === turfId);

    const totalAmount = useMemo(() => {
        const pricingRules = turf && turf.pricingRules ? turf.pricingRules : [];
        const currentPricePerHour = getCurrentPricePerHour(pricingRules);
        const totalSlotHours = getTotalSlotHours(selectedTimeSlots);
        const total = currentPricePerHour * totalSlotHours;
        return total;
    }, [turf, selectedTimeSlots]);

    if (!turf) return <div>Turf not found</div>;

    if (isLoading || isBookingsLoading) return <PageLoader />;
    if (isError) {
        return (
            <div>
                Error:
                {error?.message}
            </div>
        );
    }

    const continueBooking = () => {
        // Booking payload (see Booking interface)
        const bookingDetails = {
            slot: {
                date: dayjs(selectedDate),
                times: selectedTimeSlots,
            },
            totalAmount,
            turfId: turf.turfId,
        };

        bookingStore.setBookingDetails(bookingDetails);
        bookingStore.setTurf(turf);

        navigate({
            to: '/app/payment',
            replace: true,
        });
    };

    // Handler for Book Now button
    const handleBookNow = () => {
        if (!selectedTimeSlots || selectedTimeSlots.length === 0) {
            return;
        }

        if (!user.phone) {
            setShowContactDrawer(true);
        } else {
            continueBooking();
        }
    };

    const onCloseContactDrawer = () => {
        setShowContactDrawer(false);
        continueBooking();
    };

    return (
        <div className="flex flex-col grow h-full w-full gap-4">
            <Title size="h3">Select Date</Title>
            <DateSelect
                selectedDate={selectedDate}
                onChangeDate={setSelectedDate}
            />

            <Title size="h3">Select Slots</Title>
            <Card
                withBorder
                radius="md"
                className="flex flex-col gap-2 p-2"
            >
                <TimeSlotSelect
                    selectedDate={selectedDate}
                    selectedTimeSlots={selectedTimeSlots}
                    onChange={setSelectedTimeSlots}
                    unavailableTimeslots={bookingsByDateTimeslot[createDateKey(dayjs(selectedDate).toDate())]}
                />
                {/* Selected info display */}
                <Divider my="xs" />
                <TimeSlotSummary slots={selectedTimeSlots} />
            </Card>
            <div className="flex-grow-1" />
            <Text
                size="lg"
                fw={400}
                className="text-center"
            >
                Total Price - ₹&nbsp;
                {totalAmount}
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
                disabled={!selectedTimeSlots || selectedTimeSlots.length === 0}
                onClick={handleBookNow}
            >
                Book Now
            </Button>
            <Drawer
                opened={showContactDrawer}
                onClose={() => setShowContactDrawer(false)}
                size="sm"
                position="bottom"
            >
                <UpdatePhone onUpdate={onCloseContactDrawer} />
            </Drawer>
        </div>
    );
}
