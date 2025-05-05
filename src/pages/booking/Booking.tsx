import { useParams } from '@tanstack/react-router';
import {
    Card, Title, Divider, Text, Button,
    Group,
} from '@mantine/core';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useFetchTurfs } from '@/store/server/turfs';
import { PageLoader } from '@/components/Loader';
import DateSelect from '@/components/DateSelect/DateSelect';
import TimeSlotSelect from '@/components/DateSelect/TimeSlotSelect';
import { Timestamp } from 'firebase/firestore';
import { useBookingsFromTodayHash } from '@/store/server/bookings/hooks';
import { createDateKey } from '@/lib/dates/utils';

export default function Booking() {
    const { turfId } = useParams({ strict: false });
    const {
        data: turfs, isLoading, isError, error,
    } = useFetchTurfs();
    const [selectedDate, setSelectedDate] = useState<string | Dayjs>(dayjs());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<Dayjs[] | null>(null);

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
        if (!selectedTimeSlot || selectedTimeSlot.length === 0) {
            console.log('No time slot selected');
            return;
        }
        // Booking payload (see Booking interface)
        const bookingPayload = {
            advancePaid: 0, // Example, update as needed
            cancellationReason: '',
            createdAt: Timestamp.now(),

            paymentId: '', // Example, update as needed
            slot: {
                date: Timestamp.fromDate(dayjs(selectedDate).toDate()),
                times: selectedTimeSlot,
            },
            totalAmount: turf.pricePerHour * selectedTimeSlot.length,
            turfId: turf.turfId,
            userId: 'userId', // Example, update as needed
            status: 'confirmed',
        };
        console.log('Booking payload:', bookingPayload);
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
                    onChange={setSelectedTimeSlot}
                    unavailableTimeslots={bookingsByDateTimeslot[createDateKey(dayjs(selectedDate).toDate())]}
                />
                {/* Selected info display */}
                <Divider my="xs" />
                <Group
                    gap={24}
                    align="start"
                    w="100%"
                >
                    <div className="flex flex-col items-center justify-center flex-grow-1">
                        <Text
                            size="xs"
                            tt="uppercase"
                            fw={300}
                        >
                            Time
                        </Text>
                        <Text
                            size="lg"
                            fw={500}
                        >
                            {selectedTimeSlot && selectedTimeSlot.length > 0
                                ? `${selectedTimeSlot[0].format('hh:mm A')}`
                                : 'Not selected'}
                        </Text>
                    </div>
                    <Divider
                        orientation="vertical"
                        mx="xs"
                        style={{ height: 32 }}
                    />
                    <div className="flex flex-col items-center flex-grow-1">
                        <Text
                            size="xs"
                            tt="uppercase"
                            fw={300}
                        >
                            Duration
                        </Text>
                        <Text
                            size="lg"
                            fw={500}
                        >
                            {selectedTimeSlot && selectedTimeSlot.length > 1
                                ? `${selectedTimeSlot.length} hour(s)`
                                : 'N/A'}
                        </Text>
                    </div>
                </Group>
            </Card>
            <div className="flex-grow-1" />
            <Text
                size="lg"
                fw={300}
                className="text-center"
            >
                Total Price - INR
                {turf.pricePerHour * (selectedTimeSlot ? selectedTimeSlot.length : 1)}
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
                onClick={handleBookNow}
            >
                Book Now
            </Button>
        </div>
    );
}
