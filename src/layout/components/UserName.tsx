import { User } from '@/lib/firebase/firestore/users';
import { Avatar, Box, Title } from '@mantine/core';

interface UserNameProps {
    user: User;
}

export default function UserName({ user }: UserNameProps) {
    return (
        <Box className="flex flex-row items-center gap-4">
            <Avatar
                size="lg"
                name={user?.name || ''}
            />
            <Title
                size="h3"
            >
                {user?.name || user?.email}
            </Title>
        </Box>
    );
}
