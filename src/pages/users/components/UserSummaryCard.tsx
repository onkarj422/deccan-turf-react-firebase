import { User } from '@/lib/firebase/firestore/users';
import {
    Avatar, Box, Card, Title,
} from '@mantine/core';
import { IconPhone } from '@tabler/icons-react';

export default function UserSummaryCard({ user }: { user: User }) {
    return (
        <Card
            withBorder
            mt="lg"
            bg="var(--mantine-color-foreground)"
        >
            <Box
                className="flex items-center gap-2"
                mb="md"
            >
                <Avatar
                    name={user?.name}
                    size="md"
                    radius="xl"
                />
                <Title size="h3">{user && user.name}</Title>
            </Box>
            <Card
                radius="md"
                bg="var(--mantine-color-body)"
                p="sm"
            >
                {user?.phone && (
                    <Box
                        className="flex items-center gap-4"
                        c="lime"
                        fz="xl"
                    >
                        <IconPhone
                            stroke={1}
                        />
                        <a
                            href={`tel:${user.phone}`}
                            style={{
                                textDecoration: 'underline',
                                color: 'inherit',
                                fontSize: 'inherit',
                            }}
                        >
                            {user.phone}
                        </a>
                    </Box>
                )}
            </Card>
        </Card>
    );
}
