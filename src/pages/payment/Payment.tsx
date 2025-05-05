import TimeSlotRange from '@/components/DateTime/TimeSlotRange';
import { getTotalSlotHours } from '@/lib/dates/utils';
import { useBookingStore } from '@/store/local/bookingStore';
import {
    Button, Card, Divider,
    Switch,
    Text,
    Title,
} from '@mantine/core';
import { Navigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

export default function Payment() {
    const [isAdvancedPayment, setIsAdvancedPayment] = useState(false);
    const { bookingDetails, turf } = useBookingStore();

    const slotDate = bookingDetails?.slot.date || dayjs();
    const slots = bookingDetails?.slot.times || [];
    const totalHours = getTotalSlotHours(slots);
    const minAdvance = turf ? turf.advanceAmount * totalHours : 0;

    const finalAmount = useMemo(() => {
        if (isAdvancedPayment) {
            return minAdvance;
        }
        return bookingDetails?.totalAmount;
    }, [isAdvancedPayment, minAdvance, bookingDetails?.totalAmount]);

    if (!bookingDetails) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    if (!turf) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return (
        <div className="flex flex-col grow h-full w-full gap-4">
            <Card
                withBorder
                radius="md"
                bg="lime.4"
                className="flex flex-col"
            >
                <Title
                    size="xl"
                    c="gray.9"
                    fw={400}
                >
                    { turf.name }
                </Title>
                <Text
                    size="lg"
                    c="gray.9"
                    fw={300}
                >
                    { `${turf.location.addressLine}, ${turf.location.area}` }
                </Text>
                <Divider my="lg" />
                <Title
                    size="xl"
                    c="gray.9"
                >
                    Slot Details
                </Title>
                <Text
                    size="lg"
                    c="gray.9"
                    mb="sm"
                >
                    { `${slotDate.format('ddd')}, ${slotDate.format('D')}th ${slotDate.format('MMM YY')}` }
                </Text>
                <Card
                    withBorder
                    radius="md"
                    p="sm"
                    className="flex flex-col align-start"
                >
                    <TimeSlotRange
                        slots={slots}
                        size="lg"
                    />
                    <Text
                        size="md"
                        fw={500}
                    >
                        { `₹ ${bookingDetails.totalAmount}` }
                    </Text>
                </Card>
            </Card>
            <Card
                withBorder
                radius="md"
                className="flex flex-col gap-2 p-2"
            >
                <Title size="xl">Booking Summary</Title>
                <div className="flex flex-row justify-between">
                    <Text size="md">Venue</Text>
                    <Text size="md">
                        { `${turf.name}` }
                    </Text>
                </div>
                <div className="flex flex-row justify-between">
                    <Text size="md">Slot Price</Text>
                    <Text size="md">
                        { `₹ ${turf.pricePerHour}` }
                    </Text>
                </div>
                <div className="flex flex-row justify-between">
                    <Text size="md">
                        Slot Hours
                    </Text>
                    <Text size="md">
                        { totalHours }
                    </Text>
                </div>
                <Card.Section
                    p="sm"
                >
                    <Divider my="xs" />
                    <div className="flex flex-row justify-between">
                        <Text
                            size="lg"
                            c="lime"
                        >
                            Total Price
                        </Text>
                        <Text size="lg">
                            { `₹ ${bookingDetails.totalAmount}` }
                        </Text>
                    </div>
                    <div className="flex flex-row justify-between">
                        <Text
                            size="lg"
                            c="lime"
                        >
                            Min. Advance Payment
                        </Text>
                        <Text size="lg">
                            { `₹ ${minAdvance}` }
                        </Text>
                    </div>
                </Card.Section>
            </Card>
            <Card
                withBorder
                radius="md"
            >
                <div className="flex flex-row justify-between">
                    <Text size="lg">Advance Payment</Text>
                    <Switch
                        checked={isAdvancedPayment}
                        onChange={(event) => setIsAdvancedPayment(event.currentTarget.checked)}
                        size="lg"
                        color="lime"
                    />
                </div>
                <Text
                    size="md"
                    c="dimmed"
                >
                    Pay only the advance amount now. The remaining amount can be paid directly at the venue.
                </Text>
            </Card>
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
            >
                Proceed to Payment
            </Button>
        </div>
    );
}
