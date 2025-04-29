import { AppShell, Burger, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useLogin } from '@lib/firebase/auth/login';

export default function Shell() {
    const [opened, { toggle }] = useDisclosure();
    const { logout } = useLogin();
    const navigate = useNavigate();

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
            <AppShell.Header p="sm" className='flex items-center'>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="md"
                />
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Button fullWidth color="red" variant="light" onClick={handleSignOut}>
                    Sign Out
                </Button>
            </AppShell.Navbar>

            <AppShell.Main w='100%' h="100%" className='flex flex-col'>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}
