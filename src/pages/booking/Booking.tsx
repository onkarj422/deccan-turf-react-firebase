import { useNavigate, useParams } from '@tanstack/react-router';
import {
    Card, Title, Divider, Text, Button,
} from '@mantine/core';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useFetchTurfs } from '@/store/server/turfs';
import { PageLoader } from '@/components/Loader';
import DateSelect from '@/components/DateTime/DateSelect';
import TimeSlotSelect from '@/components/DateTime/TimeSlotSelect';
import { useBookingsFromTodayHash } from '@/store/server/bookings/hooks';
import { createDateKey, getTotalSlotHours } from '@/lib/dates/utils';
import TimeSlotSummary from '@/components/DateTime/TimeSlotSummary';

export default function Booking() {
    const { turfId } = useParams({ strict: false });
    const {
        data: turfs, isLoading, isError, error,
    } = useFetchTurfs();
    const [selectedDate, setSelectedDate] = useState<string | Dayjs>(dayjs());
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<Dayjs[]>([]);
    const navigate = useNavigate();

    // Fetch bookings starting from today
    const { bookingsByDateTimeslot, isLoading: isBookingsLoading } = useBookingsFromTodayHash();

    if (isLoading || isBookingsLoading) return <PageLoader />;
    if (isError) {
        return (
            <div>
                Error:
                {error?.message}
            </div>
        );
    }

    const turf = turfs?.find((t) => t.turfId === turfId);

    if (!turf) return <div>Turf not found</div>;

    // Handler for Book Now button
    const handleBookNow = () => {
        if (!selectedTimeSlots || selectedTimeSlots.length === 0) {
            console.alert('No time slot selected');
            return;
        }
        // Booking payload (see Booking interface)
        const bookingDetails = {
            slot: {
                date: dayjs(selectedDate),
                times: selectedTimeSlots,
            },
            totalAmount: turf.pricePerHour * getTotalSlotHours(selectedTimeSlots),
            turfId: turf.turfId,
        };

        navigate({
            to: '/app/payment',
            state: {
                bookingDetails,
                turf,
            },
            replace: true,
        });
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
                {turf.pricePerHour * (selectedTimeSlots ? selectedTimeSlots.length : 1)}
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
        </div>
    );
}
