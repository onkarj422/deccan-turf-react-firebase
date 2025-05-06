import {
    Card, Divider, Text, Title,
} from '@mantine/core';

interface BookingSummaryCardProps {
    venueName: string;
    totalHours: number;
    pricePerHour: number;
    minAdvance: number;
}

export default function BookingSummaryCard({
    venueName, totalHours, pricePerHour, minAdvance,
}: BookingSummaryCardProps) {
    const totalAmount = totalHours * pricePerHour;
    return (
        <Card
            withBorder
            radius="md"
            className="flex flex-col gap-2 p-2"
        >
            <Title size="xl">Booking Summary</Title>
            <div className="flex flex-row justify-between">
                <Text size="md">Venue</Text>
                <Text size="md">
                    { `${venueName}` }
                </Text>
            </div>
            <div className="flex flex-row justify-between">
                <Text size="md">Slot Price</Text>
                <Text size="md">
                    { `₹ ${pricePerHour}` }
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
                        { `₹ ${totalAmount}` }
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
    );
}
