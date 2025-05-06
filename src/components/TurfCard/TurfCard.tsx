import { JSX } from 'react';
import {
    Card, Image, Text, Button, Group,
    Box,
    Divider,
} from '@mantine/core';

interface TurfCardProps {
    name: string;
    description: string;
    pricePerHour: number;
    image: string;
    onBookNow: (turfId: string) => void;
}

function TurfCard({
    name, description, pricePerHour, onBookNow,
}: TurfCardProps): JSX.Element {
    return (
        <Card
            padding="lg"
            radius="md"
            withBorder
        >
            <Card.Section
                mb="md"
                withBorder
            >
                <Image
                    src="https://i.imgur.com/ZL52Q2D.png"
                    alt="Tesla Model S"
                />
            </Card.Section>
            <Box>
                <Text fw={500}>{name}</Text>
                <Text
                    fz="xs"
                    c="dimmed"
                >
                    {description}
                </Text>
            </Box>
            <Divider my="lg" />
            <Group
                gap={30}
                justify="space-between"
                align="center"
            >
                <div>
                    <Text
                        fz="xl"
                        fw={700}
                        style={{ lineHeight: 1 }}
                    >
                        Rs.
                        {pricePerHour}
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

                <Button
                    color="lime"
                    radius="md"
                    onClick={() => onBookNow(name)}
                >
                    Book Now
                </Button>
            </Group>
        </Card>
    );
}

export default TurfCard;
