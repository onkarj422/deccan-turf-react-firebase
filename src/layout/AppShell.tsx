import {
    AppShell, Avatar, Box, Burger, Button, Divider, Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useMatches, useNavigate } from '@tanstack/react-router';
import { HeaderSlotProvider, useHeaderSlot } from '@/context/HeaderSlotContext';
import { ColorSchemeSwitch } from '@/components/ColorSchemeSwitch';
import { useAuth } from '@/context';

function HeaderSlotRenderer() {
    const { headerSlot } = useHeaderSlot();
    if (!headerSlot) return null;
    return headerSlot;
}

export default function Shell() {
    const [opened, { toggle }] = useDisclosure();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const matches = useMatches();

    const title = matches[matches.length - 1].staticData?.title || '';

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
                    <Divider my="lg" />
                    <Button
                        fullWidth
                        color="red"
                        variant="light"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </Button>
                    <div className="flex-grow-1" />
                    <ColorSchemeSwitch />
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
