/* eslint-disable react/no-array-index-key */
import { Turf } from '@/lib/firebase/firestore/turfs';
import {
    Box, Card, Divider, Text, Title,
} from '@mantine/core';
import PricingRuleSummary from './PricingRuleSummary';
import TurfTimings from './TurfTimings';

interface TurfSummaryProps {
    turf: Turf;
}

export default function TurfSummary({ turf }: TurfSummaryProps) {
    return (
        <Box className="flex flex-col gap-2">
            <Card
                withBorder
                radius="md"
                bg="var(--mantine-color-foreground)"
                className="flex flex-col gap-2 p-2"
            >
                <Box>
                    <Title
                        size="h3"
                        fw={500}
                    >
                        {turf.name}
                    </Title>
                    <Text
                        size="lg"
                        fw={300}
                    >
                        {`${turf.location?.addressLine}, ${turf.location?.area}`}
                    </Text>
                </Box>
            </Card>
            <Card
                withBorder
                radius="md"
                bg="var(--mantine-color-foreground)"
                className="flex flex-col gap-2 p-2"
            >
                <Box
                    mb="md"
                    className="flex flex-col gap-4"
                >
                    <Title
                        size="xl"
                        fw={400}
                    >
                        Prices
                    </Title>
                    {turf.pricingRules.map((rule, idx) => (
                        <PricingRuleSummary
                            key={idx}
                            rule={rule}
                        />
                    ))}
                </Box>
                <Divider my="sm" />
                <Box>
                    <Text
                        size="lg"
                        fw={400}
                    >
                        Advance Payment:
                        {' '}
                        {turf.advancePercentage}
                        %
                    </Text>
                </Box>
            </Card>
            <Card
                withBorder
                radius="md"
                bg="var(--mantine-color-foreground)"
                className="flex flex-col gap-2 p-2"
            >
                <TurfTimings turf={turf} />
            </Card>
        </Box>
    );
}
