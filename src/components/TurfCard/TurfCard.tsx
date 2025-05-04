import { JSX } from 'react';
import {
    Card, Image, Text, Button, Group,
} from '@mantine/core';
import './TurfCard.css';

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
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
        >
            <Card.Section
                className="section"
                mb="md"
                withBorder
            >
                <Image
                    src="https://i.imgur.com/ZL52Q2D.png"
                    alt="Tesla Model S"
                />
            </Card.Section>

            <Group mb="md">
                <div>
                    <Text fw={500}>{name}</Text>
                    <Text
                        fz="xs"
                        c="dimmed"
                    >
                        {description}
                    </Text>
                </div>
            </Group>

            <Card.Section className="section">
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
                        color="blue"
                        radius="md"
                        onClick={() => onBookNow(name)}
                    >
                        Book Now
                    </Button>
                </Group>
            </Card.Section>
        </Card>
    );
}

export default TurfCard;
