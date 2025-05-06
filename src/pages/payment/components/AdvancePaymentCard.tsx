import { Card, Switch, Text } from '@mantine/core';

interface AdvancePaymentCardProps {
    isAdvancedPayment: boolean;
    onChange: (value: boolean) => void;
}

export default function AdvancePaymentCard({ isAdvancedPayment, onChange }: AdvancePaymentCardProps) {
    return (
        <Card
            withBorder
            radius="md"
        >
            <div className="flex flex-row justify-between">
                <Text size="lg">Advance Payment</Text>
                <Switch
                    checked={isAdvancedPayment}
                    onChange={(event) => onChange(event.currentTarget.checked)}
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
    );
}
