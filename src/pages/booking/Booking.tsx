import { useParams } from '@tanstack/react-router';
import {
    Card, Title, Divider, Box, Text, Button,
    Group,
} from '@mantine/core';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useFetchTurfs } from '@/store/server/turfs';
import { PageLoader } from '@/components/Loader';
import DateSelect from '@/components/DateSelect/DateSelect';
import TimeSlotSelect from '@/components/DateSelect/TimeSlotSelect';

export default function Booking() {
    const { turfId } = useParams({ strict: false });
    const {
        data: turfs, isLoading, isError, error,
    } = useFetchTurfs();
    const [selectedDate, setSelectedDate] = useState<string | Dayjs>(dayjs());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: Dayjs; end: Dayjs } | null>(null);

    if (isLoading) return <PageLoader />;
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
                />
                {/* Selected info display */}
                <Divider my="xs" />
                <Box className="text-center">
                    <Text
                        size="xs"
                        tt="uppercase"
                        fw={300}
                        className="mb-2"
                    >
                        Date
                    </Text>
                    <Text
                        size="lg"
                        tt="uppercase"
                        fw={500}
                    >
                        {dayjs(selectedDate).format('DD MMM YYYY')}
                    </Text>
                </Box>
                <Divider my="xs" />
                <Group
                    gap={24}
                    align="start"
                >
                    <div className="flex flex-col items-center">
                        <Text
                            size="xs"
                            tt="uppercase"
                            fw={300}
                        >
                            Time Slot
                        </Text>
                        <Text
                            size="lg"
                            fw={500}
                        >
                            {selectedTimeSlot
                                ? `${selectedTimeSlot.start.format('hh:mm A')} - ${selectedTimeSlot.end.format('hh:mm A')}`
                                : 'Not selected'}
                        </Text>
                    </div>
                    <Divider
                        orientation="vertical"
                        mx="xs"
                        style={{ height: 32 }}
                    />
                    <div className="flex flex-col items-center">
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
                            {selectedTimeSlot
                                ? `${selectedTimeSlot.end.diff(selectedTimeSlot.start, 'hour')} hour(s)`
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
                {turf.pricePerHour}
            </Text>
            <Divider my="xs" />
            <Button
                className="w-full"
                tt="uppercase"
                size="lg"
                variant="filled"
                color="lime"
                c="white"
                radius="md"
            >
                Book Now
            </Button>
        </div>
    );
}
