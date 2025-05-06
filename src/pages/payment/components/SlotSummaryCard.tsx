import TimeSlotRange from '@/components/DateTime/TimeSlotRange';
import { Turf } from '@/lib/firebase/firestore/turfs';
import { BookingDetails } from '@/pages/booking/types';
import {
    Card, Divider, Text, Title,
} from '@mantine/core';

interface SlotSummaryCardProps {
    bookingDetails: BookingDetails;
    turf: Turf;
    cardBg?: string;
    showPrice?: boolean;
}

export default function SlotSummaryCard({
    bookingDetails, turf, cardBg = 'lime.4', showPrice = true,
}: SlotSummaryCardProps) {
    const slotDate = bookingDetails.slot.date;
    const slots = bookingDetails.slot.times;
    return (
        <Card
            withBorder
            radius="md"
            bg={cardBg}
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
            <Divider my="sm" />
            <Text
                size="xl"
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
                {showPrice && (
                    <Text
                        size="lg"
                        fw={400}
                    >
                        { `₹ ${bookingDetails.totalAmount}` }
                    </Text>
                )}
            </Card>
        </Card>
    );
}

SlotSummaryCard.defaultProps = {
    cardBg: 'lime.4',
    showPrice: true,
};
