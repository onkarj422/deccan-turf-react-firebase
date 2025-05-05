import {
    ActionIcon, AppShell, Burger, Button, Title, useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useMatches, useNavigate } from '@tanstack/react-router';
import { useLogin } from '@lib/firebase/auth/login';
import { IconMoon, IconMoonFilled } from '@tabler/icons-react';

export default function Shell() {
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const [opened, { toggle }] = useDisclosure();
    const { logout } = useLogin();
    const navigate = useNavigate();
    const matches = useMatches();

    const title = matches[matches.length - 1].staticData?.title || '';

    const handleSignOut = async () => {
        await logout();
        navigate({ to: '/login' });
    };

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="sm"
            transitionDuration={200}
            transitionTimingFunction="ease"
            w="100%"
            h="100%"
        >
            <AppShell.Header
                p="sm"
                className="flex items-center text-center"
            >
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="md"
                />
                <Title
                    ml="sm"
                    ta="center"
                    size="h2"
                >
                    {title}
                </Title>
                <ActionIcon
                    variant="subtle"
                    size="xl"
                    ml="auto"
                    onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
                >
                    {colorScheme === 'dark' ? <IconMoonFilled size={32} /> : <IconMoon size={32} />}
                </ActionIcon>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Button
                    fullWidth
                    color="red"
                    variant="light"
                    onClick={handleSignOut}
                >
                    Sign Out
                </Button>
            </AppShell.Navbar>

            <AppShell.Main
                w="100%"
                h="100%"
                className="flex flex-col"
            >
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
