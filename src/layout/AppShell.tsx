import {
    AppShell, Box, Burger, Button, Divider, Text, Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate, useMatches } from '@tanstack/react-router';
import { useEffect } from 'react';
import { HeaderSlotProvider, useHeaderSlot } from '@/context/HeaderSlotContext';
import { ColorSchemeSwitch } from '@/components/ColorSchemeSwitch';
import { useAuth } from '@/context';
import NavItem from '@/components/List/NavItem';
import { useRouteStaticData } from './hooks';
import UserName from './components/UserName';
import { NAVIGATION_ITEMS } from './constants';

function HeaderSlotRenderer() {
    const { headerSlot } = useHeaderSlot();
    if (!headerSlot) return null;
    return headerSlot;
}

export default function Shell() {
    const [opened, { toggle, close }] = useDisclosure();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { title } = useRouteStaticData();
    const matches = useMatches();

    useEffect(() => {
        close(); // Close navbar on route change
    }, [matches, close]);

    const handleSignOut = async () => {
        await logout();
        navigate({ to: '/login' });
    };

    return (
        <HeaderSlotProvider>
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
                        size="h3"
                    >
                        {title}
                    </Title>
                    <div className="flex-grow-1" />
                    <HeaderSlotRenderer />
                </AppShell.Header>
                <AppShell.Navbar p="md">
                    <UserName user={user} />
                    <Divider my="lg" />
                    {NAVIGATION_ITEMS.map((item) => (
                        <NavItem
                            key={item.title}
                            leftIcon={item.leftIcon}
                            title={item.title}
                            to={item.to}
                        />
                    ))}
                    <Divider my="lg" />
                    <ColorSchemeSwitch />
                    <div className="flex-grow-1" />
                    <Box
                        w="100%"
                        className="flex flex-row items-center gap-8"
                    >
                        <Button
                            fullWidth
                            color="red"
                            variant="light"
                            size="md"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </Button>
                        <Text
                            size="xs"
                            c="dimmed"
                            ml="auto"
                        >
                            Version: 2
                        </Text>
                    </Box>
                </AppShell.Navbar>

                <AppShell.Main
                    w="100%"
                    h="100%"
                    className="flex flex-col"
                >
                    <Outlet />
                </AppShell.Main>
            </AppShell>
        </HeaderSlotProvider>
    );
}
