import { JSX } from 'react';
import {
    Card, Image, Text, Button, Group,
    Box,
    Divider,
    Title,
} from '@mantine/core';
import { Turf } from '@/lib/firebase/firestore/turfs';

interface TurfCardProps {
    turf: Turf
    onBookNow?: (turfId: string) => void;
}

function TurfCard({
    turf, onBookNow,
}: TurfCardProps): JSX.Element {
    return (
        <Card
            padding="lg"
            radius="md"
            withBorder
            bg="var(--mantine-color-body)"
        >
            <Card.Section
                mb="xs"
                withBorder
            >
                <Image
                    src={turf.images[0]}
                    h={200}
                    fit="cover"
                />
            </Card.Section>
            <Box>
                <Title
                    size="h3"
                    fw={500}
                >
                    {turf.name}
                </Title>
                <Text
                    size="lg"
                    c="gray.9"
                    fw={300}
                >
                    { `${turf.location?.addressLine}, ${turf.location?.area}` }
                </Text>
            </Box>
            <Divider my="xs" />
            <Group
                gap={30}
                justify="space-between"
                align="center"
                pt="xs"
            >
                <div>
                    <Text
                        fz="xl"
                        fw={700}
                        style={{ lineHeight: 1 }}
                    >
                        Rs.
                        {turf.pricePerHour}
                    </Text>
                    <Text
                        fz="sm"
                        c="dimmed"
                        fw={500}
                        style={{ lineHeight: 1 }}
                        mt={3}
                    >
                        per hour
                    </Text>
                </div>
                {onBookNow && (
                    <Button
                        color="lime"
                        radius="md"
                        tt="uppercase"
                        c="white"
                        onClick={() => onBookNow(turf.turfId)}
                    >
                        Book Now
                    </Button>
                )}
            </Group>
        </Card>
    );
}

TurfCard.defaultProps = {
    onBookNow: undefined,
};

export default TurfCard;
